const test = require('node:test');
const assert = require('node:assert/strict');

const {
  getMotionPreviewState,
} = require('../src/js/admin/customizer-motion-preview-state.js');

test('motion preview stays hidden when the Motion section is collapsed', () => {
  const state = getMotionPreviewState(
    {
      sm_page_transitions_enable: true,
      sm_page_transition_style: 'slide_wipe',
      sm_logo_loading_style: 'cycling_images',
      sm_transition_symbol: 'P',
    },
    false
  );

  assert.equal(state.isVisible, false);
  assert.equal(state.pageTransitionStyle, 'slide_wipe');
  assert.equal(state.logoLoadingStyle, 'cycling_images');
  assert.equal(state.transitionSymbol, 'P');
});

test('motion preview normalizes unsupported setting values back to the safe defaults', () => {
  const state = getMotionPreviewState(
    {
      sm_page_transitions_enable: 1,
      sm_page_transition_style: 'unknown',
      sm_logo_loading_style: 'invalid',
      sm_transition_symbol: null,
    },
    true
  );

  assert.equal(state.isVisible, true);
  assert.equal(state.pageTransitionStyle, 'border_iris');
  assert.equal(state.logoLoadingStyle, 'progress_bar');
  assert.equal(state.transitionSymbol, '');
});
