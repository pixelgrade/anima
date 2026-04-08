const test = require( 'node:test' );
const assert = require( 'node:assert/strict' );

const {
  getPilePatternSettings,
  matchesPilePattern,
  shouldParallaxItem,
} = require( './targeting' );

test( 'item targeting follows the selected odd/even pattern directly', () => {
  assert.equal( matchesPilePattern( { index: 0, columns: 3, target3d: 'item', rule3d: 'odd' } ), true );
  assert.equal( matchesPilePattern( { index: 1, columns: 3, target3d: 'item', rule3d: 'odd' } ), false );
  assert.equal( matchesPilePattern( { index: 0, columns: 3, target3d: 'item', rule3d: 'even' } ), false );
  assert.equal( matchesPilePattern( { index: 1, columns: 3, target3d: 'item', rule3d: 'even' } ), true );
} );

test( 'column targeting follows the selected odd/even column pattern on every row', () => {
  assert.equal( matchesPilePattern( { index: 0, columns: 3, target3d: 'column', rule3d: 'odd' } ), true );
  assert.equal( matchesPilePattern( { index: 1, columns: 3, target3d: 'column', rule3d: 'odd' } ), false );
  assert.equal( matchesPilePattern( { index: 2, columns: 3, target3d: 'column', rule3d: 'odd' } ), true );
  assert.equal( matchesPilePattern( { index: 3, columns: 3, target3d: 'column', rule3d: 'odd' } ), true );

  assert.equal( matchesPilePattern( { index: 0, columns: 3, target3d: 'column', rule3d: 'even' } ), false );
  assert.equal( matchesPilePattern( { index: 1, columns: 3, target3d: 'column', rule3d: 'even' } ), true );
  assert.equal( matchesPilePattern( { index: 2, columns: 3, target3d: 'column', rule3d: 'even' } ), false );
  assert.equal( matchesPilePattern( { index: 4, columns: 3, target3d: 'column', rule3d: 'even' } ), true );
} );

test( 'parallax applies to all items without 3D, and only the selected 3D pattern otherwise', () => {
  assert.equal( shouldParallaxItem( { has3d: false, index: 0, columns: 3, target3d: 'item', rule3d: 'odd' } ), true );
  assert.equal( shouldParallaxItem( { has3d: false, index: 1, columns: 3, target3d: 'item', rule3d: 'odd' } ), true );

  assert.equal( shouldParallaxItem( { has3d: true, index: 0, columns: 3, target3d: 'item', rule3d: 'odd' } ), true );
  assert.equal( shouldParallaxItem( { has3d: true, index: 1, columns: 3, target3d: 'item', rule3d: 'odd' } ), false );
} );

test( 'pile pattern settings are derived from the Nova block classes', () => {
  assert.deepEqual(
    getPilePatternSettings( {
      className: 'nb-supernova nb-supernova--pile-3d nb-supernova--pile-3d-target-column nb-supernova--pile-3d-rule-even',
      columns: 4,
    } ),
    {
      has3d: true,
      target3d: 'column',
      rule3d: 'even',
      columns: 4,
    }
  );
} );
