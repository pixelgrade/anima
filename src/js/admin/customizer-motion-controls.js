const {
  MOTION_DEPENDENT_CONTROL_IDS,
  getMotionDependentControlsState,
} = require('./customizer-motion-controls-state.js');
const {
  attachMotionControlsSync,
} = require('./customizer-motion-controls-init.js');
const {
  attachMotionPreviewSync,
} = require('./customizer-motion-preview-init.js');
const {
  getMotionControl,
} = require('./customizer-motion-controls-dom.js');
const {
  getMotionPreviewState,
} = require('./customizer-motion-preview-state.js');
const {
  renderMotionPreview,
} = require('./customizer-motion-preview-dom.js');

(function () {
  if (typeof wp === 'undefined' || typeof wp.customize === 'undefined') {
    return;
  }

  const DISABLED_CLASS = 'anima-control-is-disabled';
  const motionPreviewSettings = {
    sm_page_transitions_enable: false,
    sm_page_transition_style: 'border_iris',
    sm_logo_loading_style: 'progress_bar',
    sm_transition_symbol: '',
  };
  let isMotionSectionExpanded = false;

  function getControlElement(control) {
    if (!control || !control.container || !control.container.length) {
      return null;
    }

    return control.container.get(0);
  }

  function setControlDisabledState(controlId, isDisabled) {
    const control = getMotionControl(wp.customize, controlId);
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

  function syncMotionPreview(update) {
    if (update.type === 'section') {
      isMotionSectionExpanded = update.value;
    }

    if (update.type === 'setting') {
      motionPreviewSettings[update.id] = update.value;
    }

    const previewFrame = document.querySelector('#customize-preview iframe, iframe[title="Site Preview"]');
    const previewDocument = previewFrame && previewFrame.contentDocument ? previewFrame.contentDocument : null;

    if (!previewDocument) {
      return;
    }

    renderMotionPreview(
      previewDocument,
      getMotionPreviewState(motionPreviewSettings, isMotionSectionExpanded),
      typeof animaCustomizerMotionPreview === 'undefined' ? {} : animaCustomizerMotionPreview
    );
  }

  attachMotionControlsSync(wp.customize, syncDependentControls);
  attachMotionPreviewSync(wp.customize, syncMotionPreview);
})();
