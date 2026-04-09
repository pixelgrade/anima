/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 530
(module) {

function getMotionControl(customizeApi, controlId) {
  if (!customizeApi || typeof customizeApi.control !== 'function') {
    return null;
  }
  return customizeApi.control(`${controlId}_control`) || customizeApi.control(controlId) || null;
}
module.exports = {
  getMotionControl
};

/***/ },

/***/ 166
(module) {

function attachMotionControlsSync(customizeApi, syncDependentControls) {
  customizeApi('sm_page_transitions_enable', setting => {
    syncDependentControls(setting.get());
    setting.bind(value => {
      syncDependentControls(value);
    });
  });
}
module.exports = {
  attachMotionControlsSync
};

/***/ },

/***/ 763
(module) {

const MOTION_DEPENDENT_CONTROL_IDS = ['sm_page_transition_style', 'sm_logo_loading_style', 'sm_transition_symbol'];
function getMotionDependentControlsState(isEnabled) {
  return MOTION_DEPENDENT_CONTROL_IDS.reduce((state, controlId) => {
    state[controlId] = !isEnabled;
    return state;
  }, {});
}
module.exports = {
  MOTION_DEPENDENT_CONTROL_IDS,
  getMotionDependentControlsState
};

/***/ }

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
const {
  MOTION_DEPENDENT_CONTROL_IDS,
  getMotionDependentControlsState
} = __webpack_require__(763);
const {
  attachMotionControlsSync
} = __webpack_require__(166);
const {
  getMotionControl
} = __webpack_require__(530);
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
    const control = getMotionControl(wp.customize, controlId);
    const controlElement = getControlElement(control);
    if (!controlElement) {
      return;
    }
    controlElement.classList.toggle(DISABLED_CLASS, isDisabled);
    controlElement.setAttribute('aria-disabled', isDisabled ? 'true' : 'false');
    controlElement.querySelectorAll('input, select, textarea, button').forEach(field => {
      field.disabled = isDisabled;
    });
  }
  function syncDependentControls(isEnabled) {
    const controlState = getMotionDependentControlsState(!!isEnabled);
    MOTION_DEPENDENT_CONTROL_IDS.forEach(controlId => {
      setControlDisabledState(controlId, controlState[controlId]);
    });
  }
  attachMotionControlsSync(wp.customize, syncDependentControls);
})();
/******/ })()
;