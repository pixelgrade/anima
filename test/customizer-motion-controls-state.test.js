const test = require('node:test');
const assert = require('node:assert/strict');

const {
  getMotionDependentControlsState,
} = require('../src/js/admin/customizer-motion-controls-state.js');

test('motion-dependent controls are disabled when page transitions are off', () => {
  const state = getMotionDependentControlsState({
    sm_page_transitions_enable: false,
    sm_intro_animations_enable: true,
  });

  assert.equal(state.sm_page_transition_style, true);
  assert.equal(state.sm_logo_loading_style, true);
  assert.equal(state.sm_transition_symbol, true);
  assert.equal(state.sm_intro_animations_style, false);
  assert.equal(state.sm_intro_animations_speed, false);
});

test('motion-dependent controls stay enabled when page transitions are on', () => {
  const state = getMotionDependentControlsState({
    sm_page_transitions_enable: true,
    sm_intro_animations_enable: true,
  });

  assert.equal(state.sm_page_transition_style, false);
  assert.equal(state.sm_logo_loading_style, false);
  assert.equal(state.sm_transition_symbol, false);
  assert.equal(state.sm_intro_animations_style, false);
  assert.equal(state.sm_intro_animations_speed, false);
});

test('intro-animation controls are disabled when intro animations are off', () => {
  const state = getMotionDependentControlsState({
    sm_page_transitions_enable: true,
    sm_intro_animations_enable: false,
  });

  assert.equal(state.sm_page_transition_style, false);
  assert.equal(state.sm_logo_loading_style, false);
  assert.equal(state.sm_transition_symbol, false);
  assert.equal(state.sm_intro_animations_style, true);
  assert.equal(state.sm_intro_animations_speed, true);
});
