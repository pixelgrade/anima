const test = require('node:test');
const assert = require('node:assert/strict');

const {
  getMotionControl,
} = require('../src/js/admin/customizer-motion-controls-dom.js');

test('motion controls resolve using the Customizer control id suffix', () => {
  const calls = [];
  const expectedControl = { container: { length: 1, get: () => ({}) } };
  const customizeApi = {
    control(controlId) {
      calls.push(controlId);

      if (controlId === 'sm_page_transition_style_control') {
        return expectedControl;
      }

      return null;
    },
  };

  const control = getMotionControl(customizeApi, 'sm_page_transition_style');

  assert.equal(control, expectedControl);
  assert.deepEqual(calls, ['sm_page_transition_style_control']);
});
