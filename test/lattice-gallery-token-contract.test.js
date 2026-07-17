const test = require( 'node:test' );
const assert = require( 'node:assert/strict' );
const fs = require( 'node:fs' );
const path = require( 'node:path' );
const sass = require( 'sass' );

const themeRoot = path.join( __dirname, '..' );
const latticePath = path.join( themeRoot, 'src', 'scss', 'utility', '_collection-lattice.scss' );

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
