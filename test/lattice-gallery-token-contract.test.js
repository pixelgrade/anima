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

  assert.match(
    source,
    /\$lattice-isolated-reveal-item:\s*'#\{\$lattice-revealable-item\}:nth-child\(1 of #\{\$lattice-card-item\}\):nth-last-child\(1 of #\{\$lattice-card-item\}\)'/,
    'The structural exception must require one isolated semantic reveal item',
  );
  assert.match(
    css,
    /\.nb-supernova--layout-recipe-anima-lattice\.nb-supernova--layout-classic\.nb-supernova--card-hover-reveal [^{]*\.nb-supernova-item:not\(\.nb-card--no-media\):not\(\.format-quote\):has\(> \.nb-supernova-item__content--after-media > \.nb-supernova-item__inner-container > \.nb-card__title\) > \.nb-supernova-item__content--before-media:has\([^}]*\{[^}]*position: absolute !important;[^}]*top: 0;[^}]*height: auto !important;/,
    'A leading isolated detail must overlay the top media edge instead of consuming a second shelf',
  );
  assert.match(
    css,
    /\.nb-supernova--layout-recipe-anima-lattice\.nb-supernova--layout-classic\.nb-supernova--card-hover-reveal [^{]*\.nb-supernova-item:not\(\.nb-card--no-media\):not\(\.format-quote\):has\(> \.nb-supernova-item__content--before-media > \.nb-supernova-item__inner-container > \.nb-card__title\) > \.nb-supernova-item__content--after-media:has\([^}]*\{[^}]*position: absolute !important;[^}]*bottom: 0;[^}]*height: auto !important;/,
    'A trailing isolated detail must overlay the bottom media edge instead of consuming a second shelf',
  );
  assert.match(
    source,
    /background:\s*color-mix\(in srgb, var\(--sm-current-bg-color\) 92%, transparent\)/,
    'The revealed edge label must remain readable through the current palette',
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
