const test = require( 'node:test' );
const assert = require( 'node:assert/strict' );
const fs = require( 'node:fs' );
const path = require( 'node:path' );
const sass = require( 'sass' );

const themeRoot = path.join( __dirname, '..' );
const recipeFiles = {
  collage: path.join( themeRoot, 'src', 'scss', 'utility', '_collection-collage.scss' ),
  broadsheet: path.join( themeRoot, 'src', 'scss', 'utility', '_collection-broadsheet.scss' ),
  lattice: path.join( themeRoot, 'src', 'scss', 'utility', '_collection-lattice.scss' ),
};

function compileUtilityCss() {
  const { css } = sass.compile( path.join( themeRoot, 'src', 'scss', 'utility.scss' ), {
    loadPaths: [ path.join( themeRoot, 'src', 'scss' ) ],
    silenceDeprecations: [ 'import', 'global-builtin', 'slash-div' ],
  } );

  return css.replace( /\s+/g, ' ' );
}

test( 'collection recipes preserve Nova card-title heading and size controls as their baseline', () => {
  const css = compileUtilityCss();

  Object.entries( recipeFiles ).forEach( ( [ recipe, filePath ] ) => {
    const source = fs.readFileSync( filePath, 'utf8' );

    assert.doesNotMatch(
      source,
      /\.nb-card__title\s*\{[^}]*@include apply-font\(/s,
      `${ recipe } must not replace the heading role selected by Card Title Heading`
    );
    assert.doesNotMatch(
      source,
      /\.nb-card__title\s*\{[^}]*--font-size\s*:/s,
      `${ recipe } must not replace the size selected by Card Title Font Size`
    );
    assert.match(
      source,
      /\.nb-card__title\[class\]\s*\{[^}]*--anima-card-title-expression-scale:\s*1;[^}]*font-size:\s*calc\(var\(--current-font-size\)\s*\*\s*var\(--anima-card-title-expression-scale\)\);/s,
      `${ recipe } must scale the resolved authored title size`
    );
  } );

  [
    'anima-collage.nb-supernova--layout-masonry',
    'anima-broadsheet.nb-supernova--layout-classic',
    'anima-lattice.nb-supernova--layout-classic',
  ].forEach( scope => {
    assert.match(
      css,
      new RegExp( `${ scope.replace( /[.*+?^${}()|[\]\\]/g, '\\$&' ) }[^}]*[\\s\\S]*?\\.nb-card__title\\[class\\][^}]*\\{[^}]*font-size: calc\\(var\\(--current-font-size\\) \\* var\\(--anima-card-title-expression-scale\\)\\);` )
    );
  } );
} );

test( 'composition hierarchy remains relative to the authored card-title baseline', () => {
  const collage = fs.readFileSync( recipeFiles.collage, 'utf8' );
  const broadsheet = fs.readFileSync( recipeFiles.broadsheet, 'utf8' );
  const lattice = fs.readFileSync( recipeFiles.lattice, 'utf8' );

  assert.match( collage, /nb-card--media-portrait[\s\S]*?nb-card--title-short[\s\S]*?--anima-card-title-expression-scale:\s*1\.384562;/ );
  assert.match( collage, /nb-card--no-media\.format-standard[\s\S]*?nb-card--title-short[\s\S]*?--anima-card-title-expression-scale:\s*1\.615322;/ );

  assert.match( broadsheet, /nb-card--title-short \.nb-card__title[^{]*\{[^}]*--anima-card-title-expression-scale:\s*1\.420455;/ );
  assert.match( broadsheet, /#\{\$broadsheet-lead\}[\s\S]*?--anima-card-title-expression-scale:\s*2\.159091;/ );
  assert.match( broadsheet, /nb-card--media-wide:not\(\.format-quote\)[\s\S]*?--anima-card-title-expression-scale:\s*1\.590909;/ );

  assert.match( lattice, /is-sticky-post \.nb-card__title[^{]*\{[^}]*--anima-card-title-expression-scale:\s*1\.358025;/ );
  assert.match( lattice, /nb-card--no-media,[\s\S]*?\.nb-card__title[^{]*\{[^}]*--anima-card-title-expression-scale:\s*1\.200617;/ );
  assert.match( lattice, /@media \(max-width: 599px\)[\s\S]*?is-sticky-post \.nb-card__title[^{]*\{[^}]*--anima-card-title-expression-scale:\s*1;/ );
} );

test( 'Lattice resolves one token-driven caption shelf height from the selected title role', () => {
  const css = compileUtilityCss();
  const source = fs.readFileSync( recipeFiles.lattice, 'utf8' );

  assert.match( source, /@property --nb-lattice-caption-height\s*\{[^}]*syntax:\s*['"]<length>['"];[^}]*inherits:\s*true;[^}]*initial-value:\s*50px;/s );
  assert.match( source, /@mixin lattice-caption-height\(\s*\$role\s*\)[\s\S]*?--nb-lattice-caption-height:\s*max\([\s\S]*?var\(--theme-#\{\$role\}-font-size\)[\s\S]*?var\(--theme-small-body-font-size\)/ );

  [ 'smallest', 'smaller', 'normal', 'regular', 'larger', 'largest' ].forEach( size => {
    assert.match( source, new RegExp( `h[1-5]\\.has-${ size }-font-size` ) );
  } );

  assert.match( source, /h3\.has-normal-font-size[\s\S]*?\{\s*@include lattice-caption-height\(heading-3\);/ );
  assert.match( source, /h2\.has-normal-font-size[\s\S]*?\{\s*@include lattice-caption-height\(heading-2\);/ );
  assert.match( source, /&:has\(\.nb-supernova-item\.is-sticky-post\)[^{]*\{[^}]*--nb-lattice-caption-title-factor:\s*2\.71605;/ );
  assert.match( css, /@property --nb-lattice-caption-height\s*\{[^}]*syntax: "<length>";[^}]*inherits: true;[^}]*initial-value: 50px;/ );
  assert.match( css, /--nb-lattice-caption-height: max\(\s*50px, calc\(\s*var\(--theme-heading-3-font-size\)[^}]*var\(--theme-small-body-font-size\)/ );
} );
