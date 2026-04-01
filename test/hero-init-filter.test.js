const test = require('node:test');
const assert = require('node:assert/strict');

const {
  shouldInitializeHero,
} = require('../src/js/components/hero-init-filter.js');

const createElement = ( className = '' ) => ( {
  classList: {
    contains( token ) {
      return className.split( /\s+/ ).filter( Boolean ).includes( token );
    },
  },
  matches( selector ) {
    const classes = new Set( className.split( /\s+/ ).filter( Boolean ) );

    return selector
      .split( '.' )
      .filter( Boolean )
      .every( ( token ) => classes.has( token ) );
  },
} );

test( 'initializes legacy hero blocks', () => {
  assert.equal(
    shouldInitializeHero( createElement( 'novablocks-hero' ) ),
    true
  );
} );

test( 'initializes full-width stacked one-column supernovas', () => {
  assert.equal(
    shouldInitializeHero(
      createElement( 'nb-supernova nb-supernova--card-layout-stacked nb-supernova--1-columns nb-supernova--align-full' )
    ),
    true
  );
} );

test( 'does not initialize contextual post cards as heroes', () => {
  assert.equal(
    shouldInitializeHero(
      createElement( 'nb-contextual-post-card nb-supernova nb-supernova--card-layout-stacked nb-supernova--1-columns nb-supernova--align-full' )
    ),
    false
  );
} );
