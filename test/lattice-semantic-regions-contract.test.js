const test = require( 'node:test' );
const assert = require( 'node:assert/strict' );
const fs = require( 'node:fs' );
const path = require( 'node:path' );
const sass = require( 'sass' );

const themeRoot = path.join( __dirname, '..' );
const latticePath = path.join( themeRoot, 'src', 'scss', 'utility', '_collection-lattice.scss' );
const hoverPath = path.join( themeRoot, 'src', 'scss', 'utility', '_collection-hover-reveal.scss' );

function compileUtilityCss() {
  const { css } = sass.compile( path.join( themeRoot, 'src', 'scss', 'utility.scss' ), {
    loadPaths: [ path.join( themeRoot, 'src', 'scss' ) ],
    silenceDeprecations: [ 'import', 'global-builtin', 'slash-div' ],
  } );

  return css.replace( /\s+/g, ' ' );
}

test( 'Lattice geometry consumes Nova semantic regions instead of inferring wrapper contents', () => {
  const source = fs.readFileSync( latticePath, 'utf8' );

  assert.match(
    source,
    /\.nb-supernova-item__content--contains-title/,
    'The fixed shelf must have an explicit semantic owner.',
  );
  assert.match(
    source,
    /\.nb-supernova-item__content--details-only\.nb-supernova-item__content--before-media/,
    'Leading isolated details must use Nova region classes.',
  );
  assert.match(
    source,
    /\.nb-supernova-item__content--details-only\.nb-supernova-item__content--after-media/,
    'Trailing isolated details must use Nova region classes.',
  );
  assert.match(
    source,
    /\.nb-supernova-item--split-content\s*>\s*\.nb-supernova-item__frame/,
    'Stacked split geometry must use the explicit card-level contract.',
  );
  assert.doesNotMatch( source, /\$lattice-isolated-reveal-item/ );
  assert.doesNotMatch(
    source,
    /:has\(> \.nb-supernova-item__content--(?:before|after)-media/,
    'Lattice must not reconstruct split anatomy from descendants.',
  );
} );

test( 'Meta Reveal targets explicit semantic boundaries for hover and keyboard focus', () => {
  const source = fs.readFileSync( hoverPath, 'utf8' );
  const css = compileUtilityCss();

  assert.match(
    source,
    /\$leading-boundary:[^\n]*\.nb-supernova-item__content--leading-boundary/,
  );
  assert.match(
    source,
    /\$trailing-boundary:[^\n]*\.nb-supernova-item__content--trailing-boundary/,
  );
  assert.doesNotMatch( source, /__content:first-child/ );
  assert.doesNotMatch( source, /__content:last-child/ );
  assert.match( source, /\.nb-supernova-item--split-content/ );
  const boundaryRevealRule = Array.from( css.matchAll( /([^{}]+)\{([^{}]+)\}/g ) )
    .map( ( [ , selector, declarations ] ) => ( { selector, declarations } ) )
    .find( ( { selector, declarations } ) =>
      selector.includes( '.nb-supernova--card-hover-reveal' ) &&
      selector.includes( '.nb-supernova-item' ) &&
      selector.includes( ':is(:hover, :focus-within)' ) &&
      selector.includes( '.nb-card__meta' ) &&
      declarations.includes( 'opacity: 1;' )
    );

  assert.ok( boundaryRevealRule, 'Boundary details must reveal on both hover and focus-within.' );
} );

test( 'Lattice Meta Reveal stays in-frame, stationary, and presentation-neutral', () => {
  const hoverSource = fs.readFileSync( hoverPath, 'utf8' );
  const latticeSource = fs.readFileSync( latticePath, 'utf8' );

  assert.match(
    hoverSource,
    /\$outward-reveal-scope:[^\n]*:not\(\.nb-supernova--layout-recipe-anima-lattice\)/,
  );
  assert.match(
    hoverSource,
    /\$in-frame-collection-scope:[^\n]*\.nb-supernova--layout-recipe-anima-lattice/,
  );
  assert.doesNotMatch(
    latticeSource,
    /__content--details-only[^\{]*\{[^}]*\b(?:background|font-family|font-size|letter-spacing|text-transform)\s*:/s,
    'Semantic edge placement must not invent a Lattice-only Meta presentation.',
  );
  assert.match( hoverSource, /@media \(hover: hover\)/ );
} );
