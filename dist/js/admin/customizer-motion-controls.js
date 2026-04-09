/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 526
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

/***/ 290
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

/***/ 143
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

/***/ },

/***/ 352
(module) {

const PREVIEW_ROOT_ID = 'anima-motion-preview-root';
const PREVIEW_HIDE_DELAY = 2200;
const PREVIEW_FADE_OUT_DELAY = 180;
function escapeHtml(value) {
  return String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
}
function renderTransitionSymbolMarkup(symbol, fallbackSymbol) {
  const normalizedSymbol = typeof symbol === 'string' ? symbol.trim() : '';
  if (normalizedSymbol.includes('<') && normalizedSymbol.includes('>')) {
    return normalizedSymbol;
  }
  return `<svg><text id="letter" x="50%" y="50%" text-anchor="middle" alignment-baseline="central" font-size="180" font-weight="bold">${escapeHtml(normalizedSymbol || fallbackSymbol || '')}</text></svg>`;
}
function getLoadingContentMarkup(state, config) {
  if (state.logoLoadingStyle === 'cycling_images') {
    return `<div class="c-loader__logo">${renderTransitionSymbolMarkup(state.transitionSymbol, config.fallbackSymbol)}</div>`;
  }
  return config.progressBarMarkup || '';
}
function getOverlayMarkup(state, config) {
  const loadingMarkup = getLoadingContentMarkup(state, config);
  if (state.pageTransitionStyle === 'slide_wipe') {
    return `<div class="c-loader c-loader--preview"><div class="c-loader__mask">${loadingMarkup}</div></div>`;
  }
  return `<div class="c-page-transition-border c-page-transition-border--preview" style="border-color: var(--sm-current-accent-color); background: var(--sm-current-accent-color);">${loadingMarkup}</div>`;
}
function clearMotionPreviewTimer(previewWindow) {
  if (!previewWindow || !previewWindow.__animaMotionPreviewHideTimer) {
    return;
  }
  previewWindow.clearTimeout(previewWindow.__animaMotionPreviewHideTimer);
  previewWindow.__animaMotionPreviewHideTimer = null;
}
function removeMotionPreview(previewDocument) {
  if (!previewDocument) {
    return;
  }
  clearMotionPreviewTimer(previewDocument.defaultView);
  const existingRoot = previewDocument.getElementById(PREVIEW_ROOT_ID);
  if (existingRoot) {
    existingRoot.remove();
  }
}
function hideMotionPreview(previewDocument) {
  if (!previewDocument) {
    return;
  }
  const previewWindow = previewDocument.defaultView;
  const existingRoot = previewDocument.getElementById(PREVIEW_ROOT_ID);
  if (!previewWindow || !existingRoot) {
    return;
  }
  existingRoot.classList.add('anima-motion-preview-root--hiding');
  previewWindow.setTimeout(() => {
    const currentRoot = previewDocument.getElementById(PREVIEW_ROOT_ID);
    if (currentRoot) {
      currentRoot.remove();
    }
  }, PREVIEW_FADE_OUT_DELAY);
}
function renderMotionPreview(previewDocument, state, config = {}) {
  removeMotionPreview(previewDocument);
  if (!previewDocument || !state || !state.isVisible) {
    return;
  }
  const previewWindow = previewDocument.defaultView;
  if (!previewWindow || !previewDocument.body) {
    return;
  }
  const previewRoot = previewDocument.createElement('div');
  previewRoot.id = PREVIEW_ROOT_ID;
  previewRoot.className = 'anima-motion-preview-root';
  previewRoot.setAttribute('aria-hidden', 'true');
  previewRoot.innerHTML = getOverlayMarkup(state, config);
  previewDocument.body.appendChild(previewRoot);
  previewWindow.__animaMotionPreviewHideTimer = previewWindow.setTimeout(() => hideMotionPreview(previewDocument), config.previewDuration || PREVIEW_HIDE_DELAY);
}
module.exports = {
  renderMotionPreview
};

/***/ },

/***/ 176
(module, __unused_webpack_exports, __webpack_require__) {

const {
  MOTION_PREVIEW_SETTING_IDS
} = __webpack_require__(673);
function attachMotionPreviewSync(customizeApi, onChange) {
  if (typeof customizeApi !== 'function' || typeof onChange !== 'function') {
    return;
  }
  if (typeof customizeApi.section === 'function') {
    customizeApi.section('sm_motion_section', section => {
      if (!section || !section.expanded) {
        return;
      }
      onChange({
        type: 'section',
        value: section.expanded.get()
      });
      section.expanded.bind(value => {
        onChange({
          type: 'section',
          value
        });
      });
    });
  }
  MOTION_PREVIEW_SETTING_IDS.forEach(settingId => {
    customizeApi(settingId, setting => {
      onChange({
        type: 'setting',
        id: settingId,
        value: setting.get()
      });
      setting.bind(value => {
        onChange({
          type: 'setting',
          id: settingId,
          value
        });
      });
    });
  });
}
module.exports = {
  MOTION_PREVIEW_SETTING_IDS,
  attachMotionPreviewSync
};

/***/ },

/***/ 673
(module) {

const MOTION_PREVIEW_SETTING_IDS = ['sm_page_transitions_enable', 'sm_page_transition_style', 'sm_logo_loading_style', 'sm_transition_symbol'];
const DEFAULT_PAGE_TRANSITION_STYLE = 'border_iris';
const DEFAULT_LOGO_LOADING_STYLE = 'progress_bar';
const PAGE_TRANSITION_STYLES = [DEFAULT_PAGE_TRANSITION_STYLE, 'slide_wipe'];
const LOGO_LOADING_STYLES = [DEFAULT_LOGO_LOADING_STYLE, 'cycling_images'];
function normalizeBoolean(value) {
  return value === true || value === 1 || value === '1' || value === 'true';
}
function normalizeChoice(value, choices, fallbackValue) {
  return choices.includes(value) ? value : fallbackValue;
}
function getMotionPreviewState(settings = {}, isSectionExpanded = false) {
  const isEnabled = normalizeBoolean(settings.sm_page_transitions_enable);
  return {
    isEnabled,
    isSectionExpanded: normalizeBoolean(isSectionExpanded),
    isVisible: isEnabled && normalizeBoolean(isSectionExpanded),
    pageTransitionStyle: normalizeChoice(settings.sm_page_transition_style, PAGE_TRANSITION_STYLES, DEFAULT_PAGE_TRANSITION_STYLE),
    logoLoadingStyle: normalizeChoice(settings.sm_logo_loading_style, LOGO_LOADING_STYLES, DEFAULT_LOGO_LOADING_STYLE),
    transitionSymbol: typeof settings.sm_transition_symbol === 'string' ? settings.sm_transition_symbol : ''
  };
}
module.exports = {
  MOTION_PREVIEW_SETTING_IDS,
  getMotionPreviewState
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
} = __webpack_require__(143);
const {
  attachMotionControlsSync
} = __webpack_require__(290);
const {
  attachMotionPreviewSync
} = __webpack_require__(176);
const {
  getMotionControl
} = __webpack_require__(526);
const {
  getMotionPreviewState
} = __webpack_require__(673);
const {
  renderMotionPreview
} = __webpack_require__(352);
(function () {
  if (typeof wp === 'undefined' || typeof wp.customize === 'undefined') {
    return;
  }
  const DISABLED_CLASS = 'anima-control-is-disabled';
  const motionPreviewSettings = {
    sm_page_transitions_enable: false,
    sm_page_transition_style: 'border_iris',
    sm_logo_loading_style: 'progress_bar',
    sm_transition_symbol: ''
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
    renderMotionPreview(previewDocument, getMotionPreviewState(motionPreviewSettings, isMotionSectionExpanded), typeof animaCustomizerMotionPreview === 'undefined' ? {} : animaCustomizerMotionPreview);
  }
  attachMotionControlsSync(wp.customize, syncDependentControls);
  attachMotionPreviewSync(wp.customize, syncMotionPreview);
})();
/******/ })()
;