const test = require( 'node:test' );
const assert = require( 'node:assert/strict' );
const fs = require( 'node:fs' );
const path = require( 'node:path' );
const sass = require( 'sass' );

const themeRoot = path.join( __dirname, '..' );
const latticePath = path.join( themeRoot, 'src', 'scss', 'utility', '_collection-lattice.scss' );
const hoverRevealPath = path.join( themeRoot, 'src', 'scss', 'utility', '_collection-hover-reveal.scss' );

function compileUtilityCss() {
  const { css } = sass.compile( path.join( themeRoot, 'src', 'scss', 'utility.scss' ), {
    loadPaths: [ path.join( themeRoot, 'src', 'scss' ) ],
    silenceDeprecations: [ 'import', 'global-builtin', 'slash-div' ],
  } );

  return css.replace( /\s+/g, ' ' );
}

test( 'Gallery Lattice is imported and scoped to its active Classic recipe', () => {
  const entry = fs.readFileSync( path.join( themeRoot, 'src', 'scss', 'utility.scss' ), 'utf8' );
  const source = fs.readFileSync( latticePath, 'utf8' );

  assert.match( entry, /@import "utility\/collection-lattice";/ );
  assert.match( source, /\$lattice-scope: '\.nb-supernova--layout-recipe-anima-lattice\.nb-supernova--layout-classic';/ );
  assert.match( source, /\$lattice-editor-scope: '\.editor-styles-wrapper \.nb-supernova--layout-recipe-anima-lattice\.nb-supernova--layout-classic';/ );
  assert.doesNotMatch( source, /body\.(?:anima-lattice|lattice-gallery)|\.u-collection-lattice/ );
} );

test( 'Gallery geometry follows the playground shelf and crop contract', () => {
  const css = compileUtilityCss();
  const source = fs.readFileSync( latticePath, 'utf8' );

  assert.match( css, /\.nb-supernova--layout-recipe-anima-lattice\.nb-supernova--layout-classic[^}]*\{[^}]*--nb-lattice-caption-height: 50px;/ );
  assert.match( css, /\.nb-supernova--layout-recipe-anima-lattice\.nb-supernova--layout-classic[^}]*\{[^}]*--nb-lattice-caption-title-factor: 3\.4;/ );
  assert.match( source, /&:has\(\.nb-supernova-item\.is-sticky-post\)\s*\{[^}]*--nb-lattice-caption-title-factor:\s*3\.4;/ );
  assert.match( css, /\.nb-supernova--layout-recipe-anima-lattice\.nb-supernova--layout-classic [^{]*\.nb-collection__layout[^}]*\{[^}]*gap: 26px !important;/ );
  assert.match( css, /\.nb-supernova--layout-recipe-anima-lattice\.nb-supernova--layout-classic [^{]*\.nb-supernova-item__media[^}]*\{[^}]*object-fit: cover;/ );
  assert.match( source, /flex:\s*0 0 var\(--nb-lattice-caption-height\)/ );
  assert.doesNotMatch( source, /#\{\$lattice-scope\}\.nb-header-neighbour/ );
  assert.doesNotMatch( source, /padding-top:[^;]*!important/ );
  assert.doesNotMatch( source, /object-position\s*:/ );
} );

test( 'Gallery captions preserve authored card typography while internal plates keep the quiet gallery voice', () => {
  const css = compileUtilityCss();
  const source = fs.readFileSync( latticePath, 'utf8' );

  assert.match( css, /\.nb-supernova--layout-recipe-anima-lattice\.nb-supernova--layout-classic [^{]*\.nb-card__title\[class\][^}]*\{[^}]*--anima-card-title-expression-scale: 1;[^}]*font-size: calc\(var\(--current-font-size\) \* var\(--anima-card-title-expression-scale\)\);/ );
  assert.match( css, /\.nb-supernova--layout-recipe-anima-lattice\.nb-supernova--layout-classic [^{]*\.nb-card__title\[class\][^}]*\{[^}]*white-space: normal;[^}]*overflow-wrap: anywhere;/ );
  assert.match( css, /\.nb-supernova--layout-recipe-anima-lattice\.nb-supernova--layout-classic [^{]*\.nb-card__title\[class\] [^{]*\.nb-supernova-item__link[^}]*\{[^}]*overflow-wrap: anywhere;/ );
  assert.doesNotMatch( source, /\.nb-card__title\[class\][\s\S]*?white-space:\s*nowrap;/ );
  assert.match( source, /\.nb-supernova-item\.is-sticky-post \.nb-card__title\s*\{[^}]*--anima-card-title-expression-scale:\s*1\.358025;[^}]*white-space:\s*normal;/ );
  assert.match( source, /\.nb-supernova-item\.nb-card--no-media,[\s\S]*?\.nb-card__title\s*\{[^}]*--anima-card-title-expression-scale:\s*1\.200617;/ );
  assert.match( source, /blockquote\s*\{[\s\S]*?p\s*\{[^}]*@include apply-font\(heading-2\);[^}]*--font-size:\s*calc\(var\(--theme-heading-2-font-size\) \* 0\.453\);/ );
  assert.match( css, /\.nb-card__meta[^}]*\{[^}]*font-size: calc\(var\(--theme-small-body-font-size\) \* 0\.68px\);[^}]*text-transform: uppercase;/ );
  assert.match( source, /\.nb-card__meta\s*\{[\s\S]*?\n\s+:is\(\.nb-card__meta--primary, \.nb-card__meta-link\)\s*\{[^}]*font: inherit;[^}]*text-transform: inherit;[^}]*text-decoration: none;/ );
  assert.match( source, /var\(--sm-current-fg1-color\)/ );
  assert.match( source, /var\(--sm-current-fg2-color\)/ );
  assert.match( source, /var\(--sm-current-accent-color\)/ );
  assert.match( source, /color-mix\(in srgb, var\(--sm-current-fg1-color\) 5%, var\(--sm-current-bg-color\)\)/ );
  assert.match( css, /\.nb-supernova-item\.format-quote/ );
  assert.match( css, /\.nb-supernova-item\.nb-card--no-media/ );
  assert.match( source, /@media \(max-width: 599px\)[\s\S]*?\.nb-supernova-item\.is-sticky-post \.nb-card__title\s*\{[^}]*--anima-card-title-expression-scale:\s*1;[^}]*white-space:\s*normal;/ );
  assert.doesNotMatch( source, /#[0-9a-f]{3,8}\b|font-family:\s*["']/i );
} );

test( 'Gallery keeps focus visible and supplies quiet touch/mobile behavior', () => {
  const css = compileUtilityCss();

  assert.match( css, /\.nb-supernova-item:focus-within[^}]*\{[^}]*outline: 1px solid var\(--sm-current-accent-color\);/ );
  assert.match( css, /@media \(hover: hover\)/ );
  assert.match( css, /@media \(max-width: 599px\)/ );
  assert.match( css, /@media not screen and \(min-width: 768px\)/ );
} );

test( 'Gallery keeps Meta Reveal inside its bounded Lattice wrapper', () => {
  const hoverRevealSource = fs.readFileSync( hoverRevealPath, 'utf8' );
  const latticeSource = fs.readFileSync( latticePath, 'utf8' );

  assert.match(
    hoverRevealSource,
    /\$outward-reveal-scope:[^\n]*:not\(\.nb-supernova--layout-recipe-anima-lattice\)/,
    'Lattice cards must not use the outward reveal that moves the whole card',
  );
  assert.match(
    hoverRevealSource,
    /\$in-frame-collection-scope:[^\n]*\.nb-supernova--layout-recipe-anima-lattice/,
    'Lattice metadata must reveal inside the clipped caption shelf',
  );
  assert.match(
    latticeSource,
    /&:not\(\.nb-supernova--card-hover-reveal\)\s+\.nb-supernova-item:hover/,
    'The default Lattice image hover must yield to the Meta Reveal media treatment',
  );
  assert.match(
    hoverRevealSource,
    /#\{\$reveal-scope\}\.nb-supernova--layout-recipe-anima-lattice[\s\S]*?#\{\$leading-boundary\},\s*#\{\$trailing-boundary\}[\s\S]*?position:\s*static;[\s\S]*?inset:\s*auto;/,
    'Lattice boundary details must stay in wrapper flow while the wrapper owns shelf or media-edge geometry',
  );
} );

test( 'Gallery overlays only isolated split reveal details at the media edge', () => {
  const css = compileUtilityCss();
  const source = fs.readFileSync( latticePath, 'utf8' );
  const rules = Array.from( css.matchAll( /([^{}]+)\{([^{}]+)\}/g ) )
    .map( ( [ , selector, declarations ] ) => ( { selector: selector.trim(), declarations } ) );
  const isolatedOverlayRules = rules.filter( ( { selector, declarations } ) =>
    selector.includes( '.nb-supernova--layout-recipe-anima-lattice' ) &&
    selector.includes( '.nb-supernova--card-layout-vertical' ) &&
    selector.includes( '.nb-supernova-item__content--details-only' ) &&
    selector.includes( '.nb-supernova-item__content--' ) &&
    declarations.includes( 'position: absolute !important;' ) &&
    declarations.includes( 'height: auto !important;' )
  );

  assert.match(
    source,
    /\.nb-supernova-item__content--details-only\.nb-supernova-item__content--before-media/,
    'The structural exception must use Nova\'s explicit leading details region',
  );
  assert.match( source, /\.nb-supernova-item__content--details-only\.nb-supernova-item__content--after-media/ );
  assert.equal( isolatedOverlayRules.length, 4, 'Vertical and reverse Lattice need both media-edge directions' );
  assert.ok(
    isolatedOverlayRules.every( ( { selector } ) => ! selector.includes( '.nb-supernova--card-hover-reveal' ) ),
    'One-shelf geometry must not depend on whether Meta Reveal is active',
  );
  assert.ok(
    isolatedOverlayRules.some( ( { selector, declarations } ) =>
      selector.includes( '.nb-supernova--card-layout-vertical' ) &&
      ! selector.includes( '.nb-supernova--card-layout-vertical-reverse' ) &&
      declarations.includes( 'top: 0;' )
    ),
    'A leading isolated detail must overlay the top media edge in Vertical cards',
  );
  assert.ok(
    isolatedOverlayRules.some( ( { selector, declarations } ) =>
      selector.includes( '.nb-supernova--card-layout-vertical-reverse' ) &&
      declarations.includes( 'bottom: 0;' )
    ),
    'Vertical Reverse must move the same leading detail to the reversed media edge',
  );
  assert.ok(
    isolatedOverlayRules.every( ( { declarations } ) => ! declarations.includes( 'padding:' ) ),
    'Media-edge geometry must not add Lattice-only Meta spacing',
  );
  assert.doesNotMatch(
    source,
    /__content--details-only[^\{]*\{[^}]*\b(?:background|font-family|font-size|letter-spacing|text-transform)\s*:/s,
    'Lattice must position the wrapper without inventing a separate Meta presentation',
  );
} );

test( 'Gallery contains split Horizontal and Stacked structures without extra content columns', () => {
  const css = compileUtilityCss();
  const rules = Array.from( css.matchAll( /([^{}]+)\{([^{}]+)\}/g ) )
    .map( ( [ , selector, declarations ] ) => ( { selector: selector.trim(), declarations } ) );
  const horizontalOverlayRules = rules.filter( ( { selector, declarations } ) =>
    selector.includes( '.nb-supernova--layout-recipe-anima-lattice' ) &&
    selector.includes( '.nb-supernova--card-layout-horizontal' ) &&
    selector.includes( '.nb-supernova-item__content--details-only' ) &&
    selector.includes( '.nb-supernova-item__content--' ) &&
    declarations.includes( 'position: absolute !important;' ) &&
    declarations.includes( 'width: auto !important;' )
  );
  const stackedFrameRule = rules.find( ( { selector, declarations } ) =>
    selector.includes( '.nb-supernova--layout-recipe-anima-lattice' ) &&
    selector.includes( '.nb-supernova--card-layout-stacked' ) &&
    selector.includes( '.nb-supernova-item--split-content > .nb-supernova-item__frame' ) &&
    declarations.includes( 'grid-template-rows: auto minmax(0, 1fr) auto;' )
  );

  assert.equal( horizontalOverlayRules.length, 4, 'Horizontal and reverse need both isolated edge directions' );
  assert.ok( horizontalOverlayRules.every( ( { selector } ) => ! selector.includes( '.nb-supernova--card-hover-reveal' ) ) );
  assert.ok(
    horizontalOverlayRules.some( ( { selector, declarations } ) =>
      selector.includes( '.nb-supernova--card-layout-horizontal' ) &&
      ! selector.includes( '.nb-supernova--card-layout-horizontal-reverse' ) &&
      declarations.includes( 'left: 0;' )
    ),
  );
  assert.ok(
    horizontalOverlayRules.some( ( { selector, declarations } ) =>
      selector.includes( '.nb-supernova--card-layout-horizontal-reverse' ) &&
      declarations.includes( 'right: 0;' )
    ),
  );
  assert.ok( stackedFrameRule, 'Split Stacked cards need independent top and bottom content rows' );
  assert.ok( ! stackedFrameRule.selector.includes( '.nb-supernova--card-hover-reveal' ) );
} );

test( 'Gallery leaves Elements Stacking anatomy to Nova outside its vertical shelf modes', () => {
  const css = compileUtilityCss();
  const rules = Array.from( css.matchAll( /([^{}]+)\{([^{}]+)\}/g ) )
    .map( ( [ , selector, declarations ] ) => ( { selector: selector.trim(), declarations } ) )
    .filter( ( { selector } ) => selector.includes( '.nb-supernova--layout-recipe-anima-lattice' ) );
  const genericColumnRules = rules.filter( ( { selector, declarations } ) =>
    selector.includes( '.nb-supernova-item' ) &&
    ! selector.includes( '.nb-supernova-item__content' ) &&
    ! selector.includes( '.nb-supernova--card-layout-' ) &&
    declarations.includes( 'flex-direction: column;' )
  );
  const shelfRules = rules.filter( ( { declarations } ) =>
    declarations.includes( 'flex: 0 0 var(--nb-lattice-caption-height);' )
  );

  assert.equal( genericColumnRules.length, 0, 'Lattice must not mask Nova cardLayout classes' );
  assert.ok( shelfRules.length > 0, 'Vertical Lattice still needs its fixed caption shelf' );
  assert.ok(
    shelfRules.every( ( { selector } ) =>
      selector.includes( '.nb-supernova--card-layout-vertical' ) ||
      selector.includes( '.nb-supernova--card-layout-vertical-reverse' )
    ),
    'Fixed shelf geometry must not leak into Horizontal or Stacked cards',
  );
} );

test( 'Gallery contains Quote blueprints and removes the colliding editorial ornament', () => {
  const css = compileUtilityCss();
  const source = fs.readFileSync( latticePath, 'utf8' );

  assert.match(
    source,
    /\.nb-post-format-card-blueprint--quote\s*\{[\s\S]*?&::before\s*\{[^}]*background:\s*none;/,
    'The structural blueprint surface must not paint behind the Lattice quote plate',
  );
  assert.match(
    css,
    /\.nb-post-format-card-blueprint--quote > \.nb-supernova-item\.format-quote[^}]*\{[^}]*display: flex !important;[^}]*height: 100%;/,
  );
  assert.match(
    css,
    /\.nb-post-format-card-blueprint--quote [^{]*\.nb-supernova-item__frame[^}]*\{[^}]*height: 100%;[^}]*min-height: 0 !important;[^}]*overflow: hidden;/,
  );
  assert.match(
    css,
    /\.nb-post-format-card-blueprint--quote [^{]*blockquote::before[^,]*,[^{]*\.nb-post-format-card-blueprint--quote [^{]*blockquote::after[^}]*\{[^}]*content: none;[^}]*display: none;/,
  );
} );
