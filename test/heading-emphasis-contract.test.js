const test = require( 'node:test' );
const assert = require( 'node:assert/strict' );
const fs = require( 'node:fs' );
const path = require( 'node:path' );
const sass = require( 'sass' );

const themeRoot = path.join( __dirname, '..' );
const scssRoot = path.join( themeRoot, 'src', 'scss' );

function compileScss( entry ) {
  const { css } = sass.compile( path.join( scssRoot, entry ), {
    loadPaths: [ scssRoot ],
    silenceDeprecations: [ 'import', 'global-builtin', 'slash-div' ],
  } );

  return css.replace( /\s+/g, ' ' );
}

function getRules( css ) {
  return Array.from( css.matchAll( /([^{}]+)\{([^{}]+)\}/g ) )
    .map( ( [ , selector, declarations ] ) => ( {
      selector: selector.trim(),
      declarations: declarations.trim(),
    } ) );
}

function findRule( css, selectorFragment ) {
  return getRules( css ).find( ( rule ) => rule.selector.includes( selectorFragment ) );
}

test( 'heading emphasis consumes the configured accent font voice', () => {
  const css = compileScss( 'theme/components.scss' );
  const accentRule = findRule( css, ':is(h1, h2, h3, h4, h5, h6) em' );

  assert.ok( accentRule, 'The shared kicker/heading-emphasis rule must compile' );
  assert.match( accentRule.selector, /\.c-headline__secondary/ );
  assert.match( accentRule.selector, /:is\(h1, h2, h3, h4, h5, h6\) em/ );
  assert.match( accentRule.declarations, /--current-font-family: var\(--theme-accent-font-family\);/ );
  assert.match( accentRule.declarations, /--current-font-weight: var\(--theme-accent-font-weight\);/ );
  assert.match( accentRule.declarations, /--current-font-style: var\(--theme-accent-font-style\);/ );
  assert.match( accentRule.declarations, /--current-letter-spacing: var\(--theme-accent-letter-spacing\);/ );
  assert.match( accentRule.declarations, /--font-size-modifier: 1\.3636;/ );
  assert.match( accentRule.declarations, /font-style: var\(--current-font-style\);/ );
  assert.match( accentRule.declarations, /font-weight: var\(--current-font-weight\);/ );
  assert.doesNotMatch( accentRule.declarations, /font-style: normal;|font-weight: 400;/ );

  const headingEmRules = getRules( css ).filter( ( rule ) =>
    rule.selector.includes( ':is(h1, h2, h3, h4, h5, h6) em' )
  );
  assert.ok(
    headingEmRules.some( ( rule ) => /color: var\(--sm-current-accent-color\);/.test( rule.declarations ) ),
    'Heading emphasis must consume the current contextual accent color',
  );
} );

test( 'highlight gradient endpoints follow each Style Manager palette variation', () => {
  const css = compileScss( 'custom-properties.scss' );
  const rootRule = findRule( css, 'html' );
  const variationRule = findRule( css, '[class*=sm-variation-]:where(:not(.sm-color-signal-0))' );

  for ( const rule of [ rootRule, variationRule ] ) {
    assert.ok( rule, 'Root and nested palette contexts must both define highlight endpoints' );
    assert.match(
      rule.declarations,
      /--highlight-text-color-start: var\(--sm-current-accent-color, var\(--wp--preset--color--primary, currentColor\)\);/,
    );
    assert.match(
      rule.declarations,
      /--highlight-text-color-end: var\(--sm-current-accent2-color, var\(--highlight-text-color-start\)\);/,
    );
  }
} );

test( 'double emphasis receives the gradient in shared heading CSS', () => {
  const css = compileScss( 'theme/components.scss' );
  const gradientRule = getRules( css ).find( ( rule ) =>
    rule.selector.includes( ':is(strong, em) > :is(em, strong)' ) &&
    rule.declarations.includes( 'background-image' )
  );

  assert.ok( gradientRule, 'The nested bold/italic heading selector must compile' );
  assert.match( gradientRule.selector, /:not\(\.wp-block-post-title, \.nb-card__title\)/ );
  assert.match(
    gradientRule.declarations,
    /background-image: linear-gradient\(90deg, var\(--highlight-text-color-start\), var\(--highlight-text-color-end\)\);/,
  );
  assert.match( gradientRule.declarations, /background-clip: text;/ );
  assert.match( gradientRule.declarations, /-webkit-background-clip: text;/ );
  assert.match( gradientRule.declarations, /-webkit-text-fill-color: transparent;/ );
} );

test( 'post and card title emphasis stays semantic italic without a gradient', () => {
  const css = compileScss( 'style.scss' );
  const cardRule = findRule( css, ':is(.wp-block-post-title, .nb-card__title) :is(i, em)' );

  assert.ok( cardRule, 'The post/card title emphasis reset must remain present' );
  assert.match( cardRule.declarations, /font-style: italic;/ );
  assert.match( cardRule.declarations, /color: inherit;/ );
  assert.doesNotMatch( cardRule.declarations, /background-image|background-clip|-webkit-text-fill-color/ );
} );

test( 'frontend and editor both load the shared heading-emphasis stylesheet', () => {
  const functionsSource = fs.readFileSync( path.join( themeRoot, 'functions.php' ), 'utf8' );

  assert.match(
    functionsSource,
    /wp_register_style\( 'anima-block-editor-styles',[\s\S]*?'anima-theme-components',[\s\S]*?\);/,
  );
  assert.match(
    functionsSource,
    /wp_enqueue_style\( 'anima-style',[\s\S]*?'anima-theme-components',[\s\S]*?\);/,
  );
} );

test( 'editor semantic fallbacks yield to the configured heading accent role', () => {
  const css = compileScss( 'block-editor.scss' );
  const headingContext = ':is(h1, h2, h3, h4, h5, h6, .c-headline__primary)';
  const italicFallback = getRules( css ).find( ( rule ) =>
    rule.declarations.includes( '--current-font-style: italic;' )
  );
  const doubleEmphasisFallback = getRules( css ).find( ( rule ) =>
    rule.selector.includes( 'strong > em' ) &&
    rule.declarations.includes( '--current-font-family: var(--theme-heading-4-font-family);' )
  );

  assert.ok( italicFallback, 'The generic italic editor fallback must compile' );
  assert.ok(
    italicFallback.selector.includes( `em:not(${ headingContext } em)` ),
    'The generic italic fallback must exclude heading emphasis',
  );

  assert.ok( doubleEmphasisFallback, 'The generic double-emphasis editor fallback must compile' );
  assert.ok(
    doubleEmphasisFallback.selector.includes( `strong > em:not(${ headingContext } em)` ),
    'The generic double-emphasis fallback must exclude heading em',
  );
  assert.ok(
    doubleEmphasisFallback.selector.includes( `em > strong:not(${ headingContext } strong)` ),
    'The generic double-emphasis fallback must exclude heading strong',
  );
} );
