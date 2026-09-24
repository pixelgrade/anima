/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 864
() {

wp.domReady(() => {
  wp.blocks.unregisterBlockStyle('core/button', 'fill');
  wp.blocks.unregisterBlockStyle('core/button', 'outline');
  wp.blocks.unregisterBlockStyle('core/button', 'squared');
  wp.blocks.registerBlockStyle('core/button', {
    name: 'primary',
    label: 'Primary',
    isDefault: true
  });
  wp.blocks.registerBlockStyle('core/button', {
    name: 'secondary',
    label: 'Secondary'
  });
  wp.blocks.registerBlockStyle('core/button', {
    name: 'text',
    label: 'Text'
  });
});

/***/ },

/***/ 353
(module) {

// Where a Group with the Bottom action bar style sits decides what it does:
// inside the Footer template part it is pinned on phones; anywhere else it
// is a plain row of buttons. Kept free of WordPress globals for node tests.

const STYLE_CLASS = 'is-style-bottom-action-bar';
const FOOTER_AREA = 'footer';
const hasBottomActionBarStyle = className => {
  return String(className || '').split(/\s+/).includes(STYLE_CLASS);
};

// `parentBlocks` runs from the root down to the closest parent, as
// `getBlockParents()` returns them.
const isInFooterTemplatePart = ({
  parentBlocks = [],
  getTemplatePartArea,
  editedPostType,
  editedArea
}) => {
  const templatePart = [...parentBlocks].reverse().find(block => block && block.name === 'core/template-part');
  if (templatePart) {
    return getTemplatePartArea(templatePart.attributes || {}) === FOOTER_AREA;
  }

  // Editing the Footer template part itself: its blocks have no template-part parent.
  return editedPostType === 'wp_template_part' && editedArea === FOOTER_AREA;
};
module.exports = {
  STYLE_CLASS,
  hasBottomActionBarStyle,
  isInFooterTemplatePart
};

/***/ },

/***/ 152
(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

// Explains the Bottom action bar where it is chosen: next to the block style
// picker, a note says when visitors see it, or warns that it only works in
// the Footer template part.

const {
  hasBottomActionBarStyle,
  isInFooterTemplatePart
} = __webpack_require__(353);
const {
  createElement: el,
  Fragment
} = wp.element;
const {
  __
} = wp.i18n;
const useIsInFooterTemplatePart = clientId => {
  return wp.data.useSelect(select => {
    const blockEditor = select('core/block-editor');
    const core = select('core');
    const editor = select('core/editor');
    const stylesheet = core.getCurrentTheme?.()?.stylesheet;
    return isInFooterTemplatePart({
      parentBlocks: blockEditor.getBlockParents(clientId).map(id => blockEditor.getBlock(id)),
      getTemplatePartArea: ({
        area,
        slug,
        theme
      }) => {
        if (area) {
          return area;
        }
        const record = slug && core.getEditedEntityRecord('postType', 'wp_template_part', `${theme || stylesheet}//${slug}`);
        return record?.area;
      },
      editedPostType: editor?.getCurrentPostType?.(),
      editedArea: editor?.getEditedPostAttribute?.('area')
    });
  }, [clientId]);
};
const BottomActionBarNotice = ({
  clientId
}) => {
  const inFooter = useIsInFooterTemplatePart(clientId);
  const {
    InspectorControls
  } = wp.blockEditor;
  const {
    Notice
  } = wp.components;
  const message = inFooter ? __('Visitors see this bar pinned to the bottom of the screen below 1024px, together with the mobile menu. It is hidden on wider screens. Only the first bar in the footer is shown.', '__theme_txtd') : __('The bottom action bar only works in the Footer template part. Here it shows as a regular row of buttons.', '__theme_txtd');
  return el(InspectorControls, null, el('div', {
    className: 'anima-bottom-action-bar-notice'
  }, el(Notice, {
    status: inFooter ? 'info' : 'warning',
    isDismissible: false
  }, message)));
};
const withBottomActionBarNotice = wp.compose.createHigherOrderComponent(BlockEdit => props => {
  if (props.name !== 'core/group' || !props.isSelected || !hasBottomActionBarStyle(props.attributes.className)) {
    return el(BlockEdit, props);
  }
  return el(Fragment, null, el(BlockEdit, props), el(BottomActionBarNotice, {
    clientId: props.clientId
  }));
}, 'withAnimaBottomActionBarNotice');
wp.hooks.addFilter('editor.BlockEdit', 'anima/bottom-action-bar-notice', withBottomActionBarNotice);

/***/ },

/***/ 185
() {

wp.domReady(() => {
  wp.blocks.registerBlockStyle('novablocks/menu-food-item', {
    name: 'rounded',
    label: 'Rounded'
  });
});

/***/ },

/***/ 430
() {

wp.domReady(() => {
  wp.blocks.registerBlockStyle('core/paragraph', {
    name: 'lead',
    label: 'Lead'
  });
});

/***/ },

/***/ 375
() {

wp.domReady(() => {
  wp.blocks.unregisterBlockStyle('core/separator', 'default');
  wp.blocks.unregisterBlockStyle('core/separator', 'wide');
  wp.blocks.unregisterBlockStyle('core/separator', 'dots');
  wp.blocks.registerBlockStyle('core/separator', {
    name: 'decorative',
    label: 'Decorative'
  });
  wp.blocks.registerBlockStyle('core/separator', {
    name: 'simple',
    label: 'Simple'
  });
  wp.blocks.registerBlockStyle('core/separator', {
    name: 'elaborate',
    label: 'Elaborate'
  });
  wp.blocks.registerBlockStyle('core/separator', {
    name: 'blank',
    label: 'Blank'
  });
});

/***/ },

/***/ 11
(module) {

const CANVAS_SELECTOR = '.anima-collection-canvas';
const HEADER_SELECTOR = ':scope > header.wp-block-template-part, header.wp-block-template-part';
const COLLECTION_SELECTOR = '.nb-supernova--layout-recipe-anima-collage[data-header-integration="grid-item"]';
const PROXY_SELECTOR = '[data-nb-external-participant="site-header"]';
const SHARED_RUNTIME_KEY = '__animaCollectionHeaderIntegrationRuntime';
let sharedRuntime = null;
let sharedRuntimeWindow = null;
function getCandidates(canvas) {
  if (!canvas || typeof canvas.querySelector !== 'function') {
    return [];
  }
  const header = canvas.querySelector(HEADER_SELECTOR);
  const collections = typeof canvas.querySelectorAll === 'function' ? Array.from(canvas.querySelectorAll(COLLECTION_SELECTOR)) : [canvas.querySelector(COLLECTION_SELECTOR)].filter(Boolean);
  if (!header) {
    return [];
  }
  return collections.map(collection => {
    const proxy = collection && collection.querySelector(PROXY_SELECTOR);
    const grid = proxy && typeof proxy.closest === 'function' ? proxy.closest('.nb-collection__layout') : null;
    return proxy && grid ? {
      canvas,
      header,
      collection,
      proxy,
      grid
    } : null;
  }).filter(Boolean);
}
function getCandidate(canvas) {
  return getCandidates(canvas)[0] || null;
}
function getEditorColumnCount(grid) {
  if (!grid || typeof grid.querySelectorAll !== 'function') {
    return null;
  }
  const columns = grid.querySelectorAll(':scope > .nb-collection__layout-column');
  return columns.length > 0 ? columns.length : null;
}
function captureHeaderStyle(header) {
  return {
    position: header.style.position,
    top: header.style.top,
    left: header.style.left,
    width: header.style.width,
    zIndex: header.style.zIndex
  };
}
function restoreHeaderStyle(binding) {
  const {
    header,
    originalHeaderStyle
  } = binding;
  Object.keys(originalHeaderStyle).forEach(property => {
    header.style[property] = originalHeaderStyle[property];
  });
}
function releaseBinding(binding, {
  flow = false,
  hideProxy = false
} = {}) {
  restoreHeaderStyle(binding);
  binding.header.classList.remove('is-anima-collage-header-integrated');
  binding.canvas.classList.remove('is-anima-collage-header-bound');
  binding.canvas.classList[flow ? 'add' : 'remove']('is-anima-collage-header-flow');
  binding.proxy.style.removeProperty('--nb-external-participant-height');
  binding.proxy.hidden = flow || hideProxy;
  binding.flow = flow;
}
function destroyBinding(binding) {
  releaseBinding(binding, {
    hideProxy: true
  });
  if (binding.resizeObserver) {
    binding.resizeObserver.disconnect();
    binding.resizeObserver = null;
  }
}
function applyBinding(binding) {
  const {
    canvas,
    header,
    proxy
  } = binding;
  proxy.hidden = false;
  canvas.classList.remove('is-anima-collage-header-flow');
  canvas.classList.add('is-anima-collage-header-bound');
  const headerRect = header.getBoundingClientRect();
  proxy.style.setProperty('--nb-external-participant-height', `${headerRect.height}px`);
  const proxyRect = proxy.getBoundingClientRect();
  const canvasRect = canvas.getBoundingClientRect();
  header.style.position = 'absolute';
  header.style.top = `${proxyRect.top - canvasRect.top}px`;
  header.style.left = `${proxyRect.left - canvasRect.left}px`;
  header.style.width = `${proxyRect.width}px`;
  header.style.zIndex = '40';
  header.classList.add('is-anima-collage-header-integrated');
  binding.flow = false;
}
function createCollectionHeaderIntegrationRuntime({
  window: win = typeof window !== 'undefined' ? window : null,
  document: doc = typeof document !== 'undefined' ? document : null,
  createObserver = callback => {
    const Observer = win && typeof win.MutationObserver === 'function' ? win.MutationObserver : typeof MutationObserver === 'function' ? MutationObserver : null;
    return Observer ? new Observer(callback) : null;
  },
  createResizeObserver = callback => {
    const Observer = win && typeof win.ResizeObserver === 'function' ? win.ResizeObserver : typeof ResizeObserver === 'function' ? ResizeObserver : null;
    return Observer ? new Observer(callback) : null;
  }
} = {}) {
  const bindings = new Map();
  const activeColumnsByGrid = new WeakMap();
  let observer = null;
  let frameId = null;
  let isBound = false;
  function rememberLayoutEvent(event) {
    const eventGrid = event && event.detail ? event.detail.grid : null;
    const eventColumns = event && event.detail ? event.detail.activeColumns : null;
    if (eventGrid && Number.isFinite(eventColumns)) {
      activeColumnsByGrid.set(eventGrid, eventColumns);
    }
  }
  function sync(event = null) {
    if (!doc || typeof doc.querySelectorAll !== 'function') {
      return;
    }
    rememberLayoutEvent(event);
    const canvases = Array.from(doc.querySelectorAll(CANVAS_SELECTOR));
    const activeCanvases = new Set(canvases);
    bindings.forEach((binding, canvas) => {
      if (!activeCanvases.has(canvas)) {
        destroyBinding(binding);
        bindings.delete(canvas);
      }
    });
    canvases.forEach(canvas => {
      const candidates = getCandidates(canvas);
      const candidate = candidates[0] || null;
      const existing = bindings.get(canvas);
      candidates.slice(1).forEach(({
        proxy
      }) => {
        proxy.style.removeProperty('--nb-external-participant-height');
        proxy.hidden = true;
      });
      if (!candidate) {
        if (existing) {
          destroyBinding(existing);
          bindings.delete(canvas);
        }
        return;
      }
      let binding = existing;
      if (!binding || binding.header !== candidate.header || binding.proxy !== candidate.proxy || binding.grid !== candidate.grid) {
        if (binding) {
          destroyBinding(binding);
        }
        binding = {
          ...candidate,
          originalHeaderStyle: captureHeaderStyle(candidate.header),
          flow: false,
          resizeObserver: null
        };
        binding.resizeObserver = createResizeObserver(scheduleSync);
        if (binding.resizeObserver && typeof binding.resizeObserver.observe === 'function') {
          binding.resizeObserver.observe(binding.header);
          binding.resizeObserver.observe(binding.grid);
        }
        bindings.set(canvas, binding);
      }
      const activeColumns = activeColumnsByGrid.get(binding.grid) || getEditorColumnCount(binding.grid);
      if (activeColumns === 1) {
        releaseBinding(binding, {
          flow: true
        });
        return;
      }
      applyBinding(binding);
    });
  }
  function scheduleSync(event = null) {
    // Nova emits the detailed Masonry event immediately followed by the
    // generic layout event. Persist the detail before coalescing animation
    // frames so the generic event cannot erase the one-column state.
    rememberLayoutEvent(event);
    if (!win || typeof win.requestAnimationFrame !== 'function') {
      sync();
      return;
    }
    if (frameId !== null) {
      win.cancelAnimationFrame(frameId);
    }
    frameId = win.requestAnimationFrame(() => {
      frameId = null;
      sync();
    });
  }
  function bind() {
    if (isBound || !win || !doc) {
      return;
    }
    isBound = true;
    win.addEventListener('nb:masonry-layout', scheduleSync);
    win.addEventListener('nb:layout', scheduleSync);
    win.addEventListener('resize', scheduleSync);
    observer = createObserver(scheduleSync);
    if (observer && doc.body && typeof observer.observe === 'function') {
      observer.observe(doc.body, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['data-header-integration']
      });
    }
    sync();
  }
  function destroy() {
    if (!isBound) {
      return;
    }
    isBound = false;
    win.removeEventListener('nb:masonry-layout', scheduleSync);
    win.removeEventListener('nb:layout', scheduleSync);
    win.removeEventListener('resize', scheduleSync);
    if (observer) {
      observer.disconnect();
    }
    if (frameId !== null) {
      win.cancelAnimationFrame(frameId);
    }
    bindings.forEach(binding => destroyBinding(binding));
    bindings.clear();
  }
  return {
    bind,
    destroy,
    sync
  };
}
function getSharedCollectionHeaderIntegrationRuntime(options = {}) {
  const runtimeWindow = options.window || (typeof window !== 'undefined' ? window : null);

  // `scripts.js` and `page-transitions.js` are independent webpack bundles,
  // so their module caches cannot provide a true singleton. Store the runtime
  // on the shared browser window to keep AJAX re-initialization idempotent.
  if (runtimeWindow) {
    if (!runtimeWindow[SHARED_RUNTIME_KEY]) {
      runtimeWindow[SHARED_RUNTIME_KEY] = createCollectionHeaderIntegrationRuntime(options);
      runtimeWindow[SHARED_RUNTIME_KEY].bind();
    }
    sharedRuntimeWindow = runtimeWindow;
    return runtimeWindow[SHARED_RUNTIME_KEY];
  }
  if (!sharedRuntime) {
    sharedRuntime = createCollectionHeaderIntegrationRuntime(options);
    sharedRuntime.bind();
  }
  return sharedRuntime;
}
function destroySharedCollectionHeaderIntegrationRuntime(options = {}) {
  const runtimeWindow = options.window || sharedRuntimeWindow || (typeof window !== 'undefined' ? window : null);
  const runtime = runtimeWindow ? runtimeWindow[SHARED_RUNTIME_KEY] : sharedRuntime;
  if (!runtime) {
    return;
  }
  runtime.destroy();
  if (runtimeWindow && runtimeWindow[SHARED_RUNTIME_KEY] === runtime) {
    delete runtimeWindow[SHARED_RUNTIME_KEY];
  }
  sharedRuntime = null;
  sharedRuntimeWindow = null;
}
module.exports = {
  CANVAS_SELECTOR,
  HEADER_SELECTOR,
  COLLECTION_SELECTOR,
  PROXY_SELECTOR,
  SHARED_RUNTIME_KEY,
  createCollectionHeaderIntegrationRuntime,
  destroySharedCollectionHeaderIntegrationRuntime,
  getSharedCollectionHeaderIntegrationRuntime,
  getCandidate,
  getCandidates,
  getEditorColumnCount
};

/***/ },

/***/ 566
(module, __unused_webpack_exports, __webpack_require__) {

const {
  createCollectionHeaderIntegrationRuntime
} = __webpack_require__(11);
const runtimes = new WeakMap();
const observedFrames = new WeakSet();
function initializeDocument(doc) {
  if (!doc || !doc.defaultView || runtimes.has(doc)) {
    return;
  }
  const runtime = createCollectionHeaderIntegrationRuntime({
    window: doc.defaultView,
    document: doc
  });
  runtime.bind();
  runtimes.set(doc, runtime);
}
function initializeIframe(iframe) {
  if (!iframe || observedFrames.has(iframe)) {
    return;
  }
  observedFrames.add(iframe);
  const initializeContentDocument = () => {
    try {
      initializeDocument(iframe.contentDocument);
    } catch (error) {
      // The editor canvas is same-origin. Ignore unrelated cross-origin frames.
    }
  };
  iframe.addEventListener('load', initializeContentDocument);
  initializeContentDocument();
}
function initializeEditorDocuments() {
  initializeDocument(document);
  document.querySelectorAll('iframe').forEach(initializeIframe);
  if (typeof MutationObserver !== 'function' || !document.body) {
    return;
  }
  const observer = new MutationObserver(() => {
    document.querySelectorAll('iframe').forEach(initializeIframe);
  });
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
}
wp.domReady(initializeEditorDocuments);
module.exports = {
  initializeDocument,
  initializeIframe
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
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/************************************************************************/
// This entry needs to be wrapped in an IIFE because it needs to be in strict mode.
(() => {
"use strict";
/* harmony import */ var _blocks_button__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(864);
/* harmony import */ var _blocks_button__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_blocks_button__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _blocks_group__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(152);
/* harmony import */ var _blocks_group__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_blocks_group__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _blocks_menu_item__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(185);
/* harmony import */ var _blocks_menu_item__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_blocks_menu_item__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _blocks_paragraph__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(430);
/* harmony import */ var _blocks_paragraph__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_blocks_paragraph__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _blocks_separator__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(375);
/* harmony import */ var _blocks_separator__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_blocks_separator__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _editor_collection_header_integration__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(566);
/* harmony import */ var _editor_collection_header_integration__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_editor_collection_header_integration__WEBPACK_IMPORTED_MODULE_5__);






})();

/******/ })()
;