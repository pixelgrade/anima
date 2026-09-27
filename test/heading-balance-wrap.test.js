/**
 * Headings balance their line lengths so a short emphasised (em/i) phrase
 * usually stays on one line, without an explicit `white-space: nowrap` that
 * could overflow on narrow phones (#624).
 */
const test = require( 'node:test' );
const assert = require( 'node:assert/strict' );
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

const HEADING_SELECTOR_FRAGMENT = 'h1, .h1,';

test( 'h1-h6 and the .h1-.h6 heading utility classes balance their line lengths (#624)', () => {
  const css = compileScss( 'style.scss' );
  const rule = findRule( css, HEADING_SELECTOR_FRAGMENT );

  assert.ok( rule, 'The shared heading font-properties rule must compile' );
  assert.match( rule.selector, /:is\(\s*h1, \.h1, h2, \.h2, h3, \.h3, h4, \.h4, h5, \.h5, h6, \.h6\s*\)/ );
  assert.match( rule.declarations, /text-wrap: balance;/ );
} );

test( 'the block editor loads the same balanced heading rule (#624)', () => {
  const css = compileScss( 'block-editor.scss' );
  const rule = findRule( css, HEADING_SELECTOR_FRAGMENT );

  assert.ok( rule, 'The editor must compile the shared heading font-properties rule' );
  assert.match( rule.declarations, /text-wrap: balance;/ );
} );

test( 'balancing headings never introduces an explicit nowrap (#624)', () => {
  const css = compileScss( 'style.scss' );
  const headingRules = getRules( css ).filter( ( rule ) =>
    /(?:^|[\s,(:])h[1-6](?:[.\s,):]|$)|\.h[1-6](?:[.\s,)]|$)/.test( rule.selector ),
  );

  assert.ok( headingRules.length > 0, 'At least one heading rule must be found to check' );
  for ( const rule of headingRules ) {
    assert.doesNotMatch(
      rule.declarations,
      /white-space:\s*nowrap/,
      `Heading rule "${ rule.selector }" must not fall back to \`white-space: nowrap\` -- it can overflow on phones`,
    );
  }
} );
