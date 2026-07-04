const test = require( 'node:test' );
const assert = require( 'node:assert/strict' );
const fs = require( 'node:fs' );
const path = require( 'node:path' );

const source = fs.readFileSync( path.join( __dirname, 'index.js' ), 'utf8' );

// Parametric grids rebuild their DOM after our resize pass (debounced),
// orphaning the cached item references and measured scroll windows. The
// runtime must re-measure whenever the collection frontend announces a
// finished parametric layout via `nb:parametric-layout`.
test( 'binds a parametric-layout listener that re-initializes and re-measures', () => {
  assert.match( source, /const PARAMETRIC_LAYOUT_EVENT = 'nb:parametric-layout';/ );
  assert.match(
    source,
    /window\.addEventListener\(\s*PARAMETRIC_LAYOUT_EVENT,\s*onParametricLayoutHandler\s*\);/
  );
  // The handler must both re-measure (initialize) and repaint at the current
  // scroll position (onScroll) so the drift isn't stuck at its old offset.
  assert.match(
    source,
    /onParametricLayoutHandler = \(\) => \{\s*initialize\(\);\s*onScroll\(\);\s*\};/
  );
} );

test( 'removes the parametric-layout listener on destroy', () => {
  assert.match(
    source,
    /window\.removeEventListener\(\s*PARAMETRIC_LAYOUT_EVENT,\s*onParametricLayoutHandler\s*\);/
  );
  assert.match( source, /onParametricLayoutHandler = null;/ );
} );
