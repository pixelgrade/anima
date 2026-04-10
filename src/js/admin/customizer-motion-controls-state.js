const MOTION_DEPENDENT_CONTROLS = {
  sm_page_transitions_enable: [
    'sm_page_transition_style',
    'sm_logo_loading_style',
    'sm_transition_symbol',
  ],
  sm_intro_animations_enable: [
    'sm_intro_animations_style',
    'sm_intro_animations_speed',
  ],
};

const MOTION_DEPENDENT_CONTROL_IDS = Object.values(MOTION_DEPENDENT_CONTROLS).flat();

function normalizeBoolean(value) {
  return value === true || value === 1 || value === '1' || value === 'true';
}

function getMotionDependentControlsState(settings = {}) {
  return Object.entries(MOTION_DEPENDENT_CONTROLS).reduce((state, [settingId, controlIds]) => {
    const isEnabled = normalizeBoolean(settings[settingId]);

    controlIds.forEach((controlId) => {
      state[controlId] = !isEnabled;
    });

    return state;
  }, {});
}

module.exports = {
  MOTION_DEPENDENT_CONTROLS,
  MOTION_DEPENDENT_CONTROL_IDS,
  getMotionDependentControlsState,
};
