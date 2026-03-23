const test = require('node:test');
const assert = require('node:assert/strict');

const {
  getMotionDependentControlsState,
} = require('../src/js/admin/customizer-motion-controls-state.js');

test('motion-dependent controls are disabled when page transitions are off', () => {
  const state = getMotionDependentControlsState(false);

  assert.equal(state.sm_page_transition_style, true);
  assert.equal(state.sm_logo_loading_style, true);
  assert.equal(state.sm_transition_symbol, true);
});

test('motion-dependent controls stay enabled when page transitions are on', () => {
  const state = getMotionDependentControlsState(true);

  assert.equal(state.sm_page_transition_style, false);
  assert.equal(state.sm_logo_loading_style, false);
  assert.equal(state.sm_transition_symbol, false);
});
