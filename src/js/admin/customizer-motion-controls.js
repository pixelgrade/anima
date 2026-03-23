const {
  MOTION_DEPENDENT_CONTROL_IDS,
  getMotionDependentControlsState,
} = require('./customizer-motion-controls-state.js');

(function () {
  if (typeof wp === 'undefined' || typeof wp.customize === 'undefined') {
    return;
  }

  const DISABLED_CLASS = 'anima-control-is-disabled';

  function getControlElement(control) {
    if (!control || !control.container || !control.container.length) {
      return null;
    }

    return control.container.get(0);
  }

  function setControlDisabledState(controlId, isDisabled) {
    const control = wp.customize.control(controlId);
    const controlElement = getControlElement(control);

    if (!controlElement) {
      return;
    }

    controlElement.classList.toggle(DISABLED_CLASS, isDisabled);
    controlElement.setAttribute('aria-disabled', isDisabled ? 'true' : 'false');

    controlElement.querySelectorAll('input, select, textarea, button').forEach((field) => {
      field.disabled = isDisabled;
    });
  }

  function syncDependentControls(isEnabled) {
    const controlState = getMotionDependentControlsState(!!isEnabled);

    MOTION_DEPENDENT_CONTROL_IDS.forEach((controlId) => {
      setControlDisabledState(controlId, controlState[controlId]);
    });
  }

  wp.customize.bind('ready', () => {
    wp.customize('sm_page_transitions_enable', (setting) => {
      syncDependentControls(setting.get());

      setting.bind((value) => {
        syncDependentControls(value);
      });
    });
  });
})();
