const test = require('node:test');
const assert = require('node:assert/strict');

const {
  attachMotionControlsSync,
} = require('../src/js/admin/customizer-motion-controls-init.js');

test('motion controls attach directly to the page transitions setting', () => {
  const boundValues = [];
  const settingListeners = [];
  const setting = {
    get() {
      return '';
    },
    bind(listener) {
      settingListeners.push(listener);
    },
  };

  let requestedSettingId = null;
  let invokedSettingCallback = null;

  function customizeApi(settingId, callback) {
    requestedSettingId = settingId;
    invokedSettingCallback = callback;
  }

  attachMotionControlsSync(customizeApi, (value) => {
    boundValues.push(value);
  });

  assert.equal(requestedSettingId, 'sm_page_transitions_enable');
  assert.equal(typeof invokedSettingCallback, 'function');

  invokedSettingCallback(setting);

  assert.deepEqual(boundValues, ['']);
  assert.equal(settingListeners.length, 1);

  settingListeners[0](1);

  assert.deepEqual(boundValues, ['', 1]);
});
