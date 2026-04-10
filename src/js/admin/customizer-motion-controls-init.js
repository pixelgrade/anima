const MOTION_TOGGLE_SETTING_IDS = [
  'sm_page_transitions_enable',
  'sm_intro_animations_enable',
];

function attachMotionControlsSync(customizeApi, syncDependentControls) {
  MOTION_TOGGLE_SETTING_IDS.forEach((settingId) => {
    customizeApi(settingId, (setting) => {
      syncDependentControls(settingId, setting.get());

      setting.bind((value) => {
        syncDependentControls(settingId, value);
      });
    });
  });
}

module.exports = {
  MOTION_TOGGLE_SETTING_IDS,
  attachMotionControlsSync,
};
