/**
 * Single-logo context filters (#606).
 *
 * With only one logo uploaded, Anima recolours it for the surrounding
 * palette: white on dark (`.sm-dark`, `html.is-dark`), untouched on light.
 * The old dark filter, grayscale(1) brightness(10), multiplies channels, so
 * pure black (0 x 10 = 0) and near-black logos never turned white and
 * disappeared over dark heroes. These tests evaluate the compiled filter
 * lists the way the Filter Effects spec defines them.
 */
const test = require( 'node:test' );
const assert = require( 'node:assert/strict' );
const fs = require( 'node:fs' );
const path = require( 'node:path' );
const sass = require( 'sass' );
const postcss = require( 'postcss' );

const scssRoot = path.join( __dirname, '..', 'src', 'scss' );

const clamp = value => Math.min( 1, Math.max( 0, value ) );

// Filter Effects Module Level 1: grayscale / brightness / invert on sRGB 0..1.
const FILTERS = {
  grayscale: ( [ r, g, b ], amount ) => {
    const a = 1 - amount;
    return [
      ( 0.2126 + 0.7874 * a ) * r + ( 0.7152 - 0.7152 * a ) * g + ( 0.0722 - 0.0722 * a ) * b,
      ( 0.2126 - 0.2126 * a ) * r + ( 0.7152 + 0.2848 * a ) * g + ( 0.0722 - 0.0722 * a ) * b,
      ( 0.2126 - 0.2126 * a ) * r + ( 0.7152 - 0.7152 * a ) * g + ( 0.0722 + 0.9278 * a ) * b,
    ].map( clamp );
  },
  brightness: ( rgb, amount ) => rgb.map( channel => clamp( channel * amount ) ),
  invert: ( rgb, amount ) => rgb.map( channel => clamp( channel * ( 1 - amount ) + ( 1 - channel ) * amount ) ),
};

const applyFilter = ( value, rgb ) => {
  if ( ! value || value === 'none' ) {
    return rgb;
  }

  return Array.from( value.matchAll( /([a-z]+)\(\s*([\d.]+)\s*\)/g ) ).reduce( ( color, [ , name, amount ] ) => {
    assert.ok( FILTERS[ name ], `unsupported filter function ${ name }()` );
    return FILTERS[ name ]( color, Number( amount ) );
  }, rgb );
};

const hex = value => [ 1, 3, 5 ].map( i => parseInt( value.slice( i, i + 2 ), 16 ) / 255 );
const toHex = rgb => '#' + rgb.map( c => Math.round( c * 255 ).toString( 16 ).padStart( 2, '0' ) ).join( '' );

const css = postcss.parse( sass.compile( path.join( scssRoot, 'components', '_logo.scss' ) ).css );

const declarationsFor = selector => {
  const found = {};
  css.walkRules( rule => {
    if ( rule.selectors.includes( selector ) ) {
      rule.walkDecls( decl => {
        found[ decl.prop ] = decl.value;
      } );
    }
  } );
  return found;
};

const LOGO_COLOURS = {
  'pure black': '#000000',
  'near black': '#0a0a0a',
  'dark grey': '#333333',
  'brand orange': '#f55d05',
  'deep blue': '#1f3a93',
  white: '#ffffff',
};

test( 'the logo partial is part of the theme stylesheet', () => {
  assert.match( fs.readFileSync( path.join( scssRoot, 'style.scss' ), 'utf8' ), /@import "components\/logo";/ );
} );

for ( const selector of [ '.sm-dark', 'html.is-dark' ] ) {
  test( `${ selector }: a single logo of any colour renders white`, () => {
    const filter = declarationsFor( selector )[ '--theme-logo-default-filter' ];

    for ( const [ name, colour ] of Object.entries( LOGO_COLOURS ) ) {
      assert.equal( toHex( applyFilter( filter, hex( colour ) ) ), '#ffffff', `${ name } (${ colour }) under "${ filter }"` );
    }
  } );
}

test( 'light context: a single inverted logo of any colour renders black', () => {
  const filter = declarationsFor( ':root' )[ '--theme-logo-inverted-filter' ];

  for ( const [ name, colour ] of Object.entries( LOGO_COLOURS ) ) {
    assert.equal( toHex( applyFilter( filter, hex( colour ) ) ), '#000000', `${ name } (${ colour }) under "${ filter }"` );
  }
} );

test( 'light context resets the dark whitening, so a light row inside a dark area keeps the original logo', () => {
  for ( const selector of [ ':root', 'html:not(.is-dark) .sm-light' ] ) {
    assert.equal( declarationsFor( selector )[ '--theme-logo-default-filter' ], 'none', selector );
  }

  // And "none" leaves every colour untouched.
  for ( const colour of Object.values( LOGO_COLOURS ) ) {
    assert.equal( toHex( applyFilter( 'none', hex( colour ) ) ), colour );
  }
} );
