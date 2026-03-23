function attachMotionControlsSync(customizeApi, syncDependentControls) {
  customizeApi('sm_page_transitions_enable', (setting) => {
    syncDependentControls(setting.get());

    setting.bind((value) => {
      syncDependentControls(value);
    });
  });
}

module.exports = {
  attachMotionControlsSync,
};
