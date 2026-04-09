const test = require('node:test');
const assert = require('node:assert/strict');

const {
  MOTION_PREVIEW_SETTING_IDS,
  attachMotionPreviewSync,
} = require('../src/js/admin/customizer-motion-preview-init.js');

test('motion preview sync binds the Motion section and every relevant setting', () => {
  const requestedSettingIds = [];
  const settingListeners = {};
  const sectionListeners = [];
  const updates = [];

  function customizeApi(settingId, callback) {
    requestedSettingIds.push(settingId);
    callback({
      get() {
        return `${settingId}:initial`;
      },
      bind(listener) {
        settingListeners[settingId] = listener;
      },
    });
  }

  customizeApi.section = (sectionId, callback) => {
    assert.equal(sectionId, 'sm_motion_section');
    callback({
      expanded: {
        get() {
          return false;
        },
        bind(listener) {
          sectionListeners.push(listener);
        },
      },
    });
  };

  attachMotionPreviewSync(customizeApi, (update) => {
    updates.push(update);
  });

  assert.deepEqual(requestedSettingIds, MOTION_PREVIEW_SETTING_IDS);
  assert.equal(sectionListeners.length, 1);
  assert.deepEqual(
    updates,
    [
      { type: 'section', value: false },
      { type: 'setting', id: 'sm_page_transitions_enable', value: 'sm_page_transitions_enable:initial' },
      { type: 'setting', id: 'sm_page_transition_style', value: 'sm_page_transition_style:initial' },
      { type: 'setting', id: 'sm_logo_loading_style', value: 'sm_logo_loading_style:initial' },
      { type: 'setting', id: 'sm_transition_symbol', value: 'sm_transition_symbol:initial' },
    ]
  );

  sectionListeners[0](true);
  settingListeners.sm_logo_loading_style('cycling_images');

  assert.deepEqual(updates.slice(-2), [
    { type: 'section', value: true },
    { type: 'setting', id: 'sm_logo_loading_style', value: 'cycling_images' },
  ]);
});
