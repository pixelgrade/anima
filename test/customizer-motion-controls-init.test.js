const test = require('node:test');
const assert = require('node:assert/strict');

const {
  attachMotionControlsSync,
} = require('../src/js/admin/customizer-motion-controls-init.js');

test('motion controls attach directly to both motion enable settings', () => {
  const boundValues = [];
  const callbacksBySettingId = {};
  const settingsById = {
    sm_page_transitions_enable: {
      listeners: [],
      get() {
        return '';
      },
      bind(listener) {
        this.listeners.push(listener);
      },
    },
    sm_intro_animations_enable: {
      listeners: [],
      get() {
        return 0;
      },
      bind(listener) {
        this.listeners.push(listener);
      },
    },
  };

  function customizeApi(settingId, callback) {
    callbacksBySettingId[settingId] = callback;
  }

  attachMotionControlsSync(customizeApi, (settingId, value) => {
    boundValues.push([settingId, value]);
  });

  assert.deepEqual(
    Object.keys(callbacksBySettingId).sort(),
    ['sm_intro_animations_enable', 'sm_page_transitions_enable']
  );

  callbacksBySettingId.sm_page_transitions_enable(settingsById.sm_page_transitions_enable);
  callbacksBySettingId.sm_intro_animations_enable(settingsById.sm_intro_animations_enable);

  assert.deepEqual(boundValues, [
    ['sm_page_transitions_enable', ''],
    ['sm_intro_animations_enable', 0],
  ]);

  assert.equal(settingsById.sm_page_transitions_enable.listeners.length, 1);
  assert.equal(settingsById.sm_intro_animations_enable.listeners.length, 1);

  settingsById.sm_page_transitions_enable.listeners[0](1);
  settingsById.sm_intro_animations_enable.listeners[0](true);

  assert.deepEqual(boundValues, [
    ['sm_page_transitions_enable', ''],
    ['sm_intro_animations_enable', 0],
    ['sm_page_transitions_enable', 1],
    ['sm_intro_animations_enable', true],
  ]);
});
