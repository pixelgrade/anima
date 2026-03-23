const MOTION_DEPENDENT_CONTROL_IDS = [
  'sm_page_transition_style',
  'sm_logo_loading_style',
  'sm_transition_symbol',
];

function getMotionDependentControlsState(isEnabled) {
  return MOTION_DEPENDENT_CONTROL_IDS.reduce((state, controlId) => {
    state[controlId] = !isEnabled;

    return state;
  }, {});
}

module.exports = {
  MOTION_DEPENDENT_CONTROL_IDS,
  getMotionDependentControlsState,
};
