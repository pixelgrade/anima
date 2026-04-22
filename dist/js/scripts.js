/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 771
(module) {

const NEW_HERO_SELECTOR = '.nb-supernova--card-layout-stacked.nb-supernova--1-columns.nb-supernova--align-full';
const OLD_HERO_SELECTOR = '.novablocks-hero';
function shouldInitializeHero(element) {
  if (!element || typeof element.matches !== 'function') {
    return false;
  }
  if (element.classList && element.classList.contains('nb-contextual-post-card')) {
    return false;
  }
  return element.matches(NEW_HERO_SELECTOR) || element.matches(OLD_HERO_SELECTOR);
}
module.exports = {
  NEW_HERO_SELECTOR,
  OLD_HERO_SELECTOR,
  shouldInitializeHero
};

/***/ },

/***/ 688
(module, __unused_webpack_exports, __webpack_require__) {

const {
  createIntroAnimationsRuntime
} = __webpack_require__(280);
const runtime = createIntroAnimationsRuntime();
module.exports = {
  initialize(root) {
    return runtime.initialize(root);
  },
  bind() {
    return runtime.bind();
  },
  disconnect() {
    return runtime.disconnect();
  }
};

/***/ },

/***/ 280
(module, __unused_webpack_exports, __webpack_require__) {

const {
  collectRevealTargets
} = __webpack_require__(687);
const REVEAL_ZONE_TOP_RATIO = 0.82;
const DELAY_WINDOW_BY_STYLE = {
  fade: 600,
  scale: 600,
  slide: 600
};
function getRevealObserverOptions() {
  return {
    threshold: 0,
    rootMargin: `0px 0px -${Math.round((1 - REVEAL_ZONE_TOP_RATIO) * 100)}% 0px`
  };
}
function createIntroAnimationsRuntime({
  window: win = typeof window !== 'undefined' ? window : null,
  document: doc = typeof document !== 'undefined' ? document : null,
  collectTargets = collectRevealTargets,
  createObserver = callback => new win.IntersectionObserver(callback, getRevealObserverOptions())
} = {}) {
  const consumedTargets = new WeakSet();
  let observer = null;
  let isBound = false;
  function hasEnabledBodyClass() {
    return !!doc && !!doc.body && !!doc.body.classList && doc.body.classList.contains('has-intro-animations');
  }
  function prefersReducedMotion() {
    return !!win && typeof win.matchMedia === 'function' && win.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }
  function getActiveAnimationStyle() {
    if (!doc || !doc.body || !doc.body.classList) {
      return 'fade';
    }
    const styles = Object.keys(DELAY_WINDOW_BY_STYLE);
    const activeStyle = styles.find(style => doc.body.classList.contains(`has-intro-animations--${style}`));
    return activeStyle || 'fade';
  }
  function parseDelayWindow(value) {
    if (typeof value !== 'string') {
      return null;
    }
    const normalizedValue = value.trim();
    if (!normalizedValue) {
      return null;
    }
    if (normalizedValue.endsWith('ms')) {
      const numericValue = Number.parseFloat(normalizedValue.slice(0, -2));
      return Number.isNaN(numericValue) ? null : numericValue;
    }
    if (normalizedValue.endsWith('s')) {
      const numericValue = Number.parseFloat(normalizedValue.slice(0, -1));
      return Number.isNaN(numericValue) ? null : numericValue * 1000;
    }
    return null;
  }
  function getDelayWindowMs() {
    if (win && typeof win.getComputedStyle === 'function' && doc && doc.body) {
      const delayWindow = parseDelayWindow(win.getComputedStyle(doc.body).getPropertyValue('--anima-intro-delay-window'));
      if (delayWindow !== null) {
        return delayWindow;
      }
    }
    return DELAY_WINDOW_BY_STYLE[getActiveAnimationStyle()] || DELAY_WINDOW_BY_STYLE.fade;
  }
  function formatDelay(delay) {
    const roundedDelay = Math.round(delay * 1000) / 1000;
    if (Number.isInteger(roundedDelay)) {
      return `${roundedDelay}ms`;
    }
    return `${roundedDelay}ms`;
  }
  function isInViewport(target) {
    if (!target) {
      return false;
    }
    if (typeof target.isInViewport === 'boolean') {
      return target.isInViewport;
    }
    if (!win || typeof target.getBoundingClientRect !== 'function') {
      return false;
    }
    const rect = target.getBoundingClientRect();
    const viewportHeight = win.innerHeight || doc?.documentElement?.clientHeight || 0;
    const viewportWidth = win.innerWidth || doc?.documentElement?.clientWidth || 0;
    const revealTop = viewportHeight * REVEAL_ZONE_TOP_RATIO;
    return rect.bottom > 0 && rect.top <= revealTop && rect.right > 0 && rect.left < viewportWidth;
  }
  function markTargetBase(target) {
    if (target && target.classList) {
      target.classList.add('anima-intro-target');
    }
  }
  function applyRevealDelay(target, index = 0, totalTargets = 1) {
    if (!target || !target.style || typeof target.style.setProperty !== 'function') {
      return;
    }
    const delay = totalTargets > 0 ? getDelayWindowMs() / totalTargets * index : 0;
    target.style.setProperty('--anima-intro-delay', formatDelay(delay));
  }
  function revealTarget(target) {
    if (!target || !target.classList) {
      return;
    }
    markTargetBase(target);
    target.classList.remove('anima-intro-target--pending');
    target.classList.add('anima-intro-target--revealed');
    consumedTargets.add(target);
    if (observer && typeof observer.unobserve === 'function') {
      observer.unobserve(target);
    }
  }
  function stageTarget(target) {
    if (!target || consumedTargets.has(target)) {
      return false;
    }
    markTargetBase(target);
    target.classList.remove('anima-intro-target--revealed');
    if (prefersReducedMotion()) {
      revealTarget(target);
      return false;
    }
    target.classList.add('anima-intro-target--pending');
    return true;
  }
  function disconnect() {
    if (observer && typeof observer.disconnect === 'function') {
      observer.disconnect();
    }
    observer = null;
  }
  function ensureObserver() {
    if (observer || prefersReducedMotion() || !hasEnabledBodyClass() || typeof createObserver !== 'function') {
      return observer;
    }
    observer = createObserver((entries = []) => {
      const readyTargets = entries.filter(entry => entry && entry.isIntersecting).map(entry => entry.target);
      revealTargets(readyTargets);
    });
    return observer;
  }
  function sortBatchTargets(targets = []) {
    return [...targets].sort((firstTarget, secondTarget) => {
      if (!firstTarget || !secondTarget || typeof firstTarget.getBoundingClientRect !== 'function' || typeof secondTarget.getBoundingClientRect !== 'function') {
        return 0;
      }
      const firstRect = firstTarget.getBoundingClientRect();
      const secondRect = secondTarget.getBoundingClientRect();
      const verticalDelta = firstRect.top - secondRect.top;
      if (Math.abs(verticalDelta) > 24) {
        return verticalDelta;
      }
      return firstRect.left - secondRect.left;
    });
  }
  function revealTargets(targets = []) {
    const sortedTargets = sortBatchTargets(targets);
    sortedTargets.forEach((target, index) => {
      applyRevealDelay(target, index, sortedTargets.length);
      revealTarget(target);
    });
  }
  function scheduleReveal(targets) {
    if (!targets.length) {
      return;
    }
    const runReveal = () => {
      revealTargets(targets);
    };
    if (win && typeof win.requestAnimationFrame === 'function') {
      win.requestAnimationFrame(() => {
        win.requestAnimationFrame(runReveal);
      });
      return;
    }
    runReveal();
  }
  function initialize(root = doc) {
    if (!hasEnabledBodyClass() || !root || typeof collectTargets !== 'function') {
      return [];
    }
    disconnect();
    const immediateTargets = [];
    const targets = collectTargets(root);
    targets.forEach(target => {
      if (!stageTarget(target)) {
        return;
      }
      if (isInViewport(target)) {
        immediateTargets.push(target);
        return;
      }
      const activeObserver = ensureObserver();
      if (activeObserver && typeof activeObserver.observe === 'function') {
        activeObserver.observe(target);
      }
    });
    scheduleReveal(immediateTargets);
    return targets;
  }
  function bind() {
    if (isBound || !win || typeof win.addEventListener !== 'function') {
      return;
    }
    win.addEventListener('anima:page-transition-complete', () => {
      initialize(doc);
    });
    isBound = true;
  }
  return {
    initialize,
    bind,
    disconnect,
    revealTarget,
    revealTargets,
    stageTarget,
    prefersReducedMotion,
    isInViewport,
    getRevealObserverOptions
  };
}
module.exports = {
  createIntroAnimationsRuntime,
  getRevealObserverOptions
};

/***/ },

/***/ 687
(module, __unused_webpack_exports, __webpack_require__) {

const {
  NEW_HERO_SELECTOR,
  OLD_HERO_SELECTOR
} = __webpack_require__(771);
const REVEAL_ROOT_SELECTORS = ['.wp-block-cover', '.wp-block-group', '.wp-block-columns', '.wp-block-media-text', '.wp-block-gallery', '.wp-block-image', '.wp-block-quote', '.wp-block-pullquote', '.wp-block-buttons', '.wp-block-button', '.wp-block-query .wp-block-post', '.nb-supernova-item'];
const FALLBACK_TARGET_SELECTORS = ['.wp-block-heading', '.wp-block-paragraph', '.wp-block-list', '.wp-block-table', '.wp-block-separator', '.wp-block-file', '.wp-block-embed', '.wp-block-post-title', '.wp-block-post-featured-image', '.wp-block-post-excerpt'];
const EXCLUDED_TARGET_SELECTORS = ['header', 'footer', '.js-page-transition-border', '.js-slide-wipe-loader', NEW_HERO_SELECTOR, OLD_HERO_SELECTOR, '.nb-supernova-item--scrolling-effect-parallax', '#wpadminbar', '[aria-hidden="true"]', '[inert]'];
function isExcludedTarget(node) {
  if (!node || typeof node.matches !== 'function' || typeof node.closest !== 'function') {
    return false;
  }
  return EXCLUDED_TARGET_SELECTORS.some(selector => node.matches(selector) || node.closest(selector));
}
function hasTrackedRevealAncestor(node, trackedNodes = []) {
  if (!node) {
    return false;
  }
  return trackedNodes.some(trackedNode => {
    return trackedNode !== node && typeof trackedNode.contains === 'function' && trackedNode.contains(node);
  });
}
function addTargetsForSelectors(root, selectors, trackedNodes) {
  selectors.forEach(selector => {
    const nodes = Array.from(root.querySelectorAll(selector));
    nodes.forEach(node => {
      if (!node || node.isConnected === false) {
        return;
      }
      if (trackedNodes.includes(node) || isExcludedTarget(node) || hasTrackedRevealAncestor(node, trackedNodes)) {
        return;
      }
      trackedNodes.push(node);
    });
  });
}
function collectRevealTargets(root) {
  if (!root || typeof root.querySelectorAll !== 'function') {
    return [];
  }
  const trackedNodes = [];
  addTargetsForSelectors(root, REVEAL_ROOT_SELECTORS, trackedNodes);
  addTargetsForSelectors(root, FALLBACK_TARGET_SELECTORS, trackedNodes);
  return trackedNodes;
}
module.exports = {
  REVEAL_ROOT_SELECTORS,
  FALLBACK_TARGET_SELECTORS,
  EXCLUDED_TARGET_SELECTORS,
  isExcludedTarget,
  hasTrackedRevealAncestor,
  collectRevealTargets
};

/***/ },

/***/ 233
(module) {

function matchesPilePattern({
  index,
  columns = 1,
  target3d = 'item',
  rule3d = 'odd'
}) {
  const normalizedColumns = Math.max(1, parseInt(columns, 10) || 1);
  if (target3d === 'column') {
    const column = index % normalizedColumns + 1;
    return rule3d === 'even' ? column % 2 === 0 : column % 2 === 1;
  }
  const position = index + 1;
  return rule3d === 'even' ? position % 2 === 0 : position % 2 === 1;
}
function getPilePatternSettings({
  className = '',
  columns = 1
} = {}) {
  return {
    has3d: className.includes('nb-supernova--pile-3d'),
    target3d: className.includes('nb-supernova--pile-3d-target-column') ? 'column' : 'item',
    rule3d: className.includes('nb-supernova--pile-3d-rule-even') ? 'even' : 'odd',
    columns: Math.max(1, parseInt(columns, 10) || 1)
  };
}
function shouldParallaxItem({
  has3d = false,
  index,
  columns = 1,
  target3d = 'item',
  rule3d = 'odd'
}) {
  if (!has3d) {
    return true;
  }
  return matchesPilePattern({
    index,
    columns,
    target3d,
    rule3d
  });
}
module.exports = {
  getPilePatternSettings,
  matchesPilePattern,
  shouldParallaxItem
};

/***/ },

/***/ 33
(module, __unused_webpack_exports, __webpack_require__) {

const {
  createSiteFrameRuntime
} = __webpack_require__(869);
class SiteFrame {
  constructor({
    window: win = typeof window !== 'undefined' ? window : null,
    runtime = createSiteFrameRuntime()
  } = {}) {
    this.window = win;
    this.runtime = runtime;
    this.onResize = this.onResize.bind(this);
    this.runtime.sync();
    if (this.window && typeof this.window.addEventListener === 'function') {
      this.window.addEventListener('resize', this.onResize);
    }
  }
  onResize() {
    this.runtime.sync();
  }
}
module.exports = SiteFrame;

/***/ },

/***/ 869
(module) {

const SITE_FRAME_CLONE_ATTR = 'siteFrameClone';
function getChildElements(node) {
  if (!node || !node.children) {
    return [];
  }
  return Array.from(node.children);
}
function removeSiteFrameMobileMenuClones(targetList) {
  if (!targetList) {
    return 0;
  }
  let removedCount = 0;
  getChildElements(targetList).forEach(item => {
    if (item?.dataset?.[SITE_FRAME_CLONE_ATTR] !== 'true') {
      return;
    }
    if (typeof item.remove === 'function') {
      item.remove();
      removedCount += 1;
    }
  });
  return removedCount;
}
function appendSiteFrameMobileMenuItems(sourceList, targetList) {
  if (!sourceList || !targetList) {
    return 0;
  }
  removeSiteFrameMobileMenuClones(targetList);
  let appendedCount = 0;
  getChildElements(sourceList).forEach(item => {
    if (!item || typeof item.cloneNode !== 'function') {
      return;
    }
    const clone = item.cloneNode(true);
    if (!clone.dataset) {
      clone.dataset = {};
    }
    clone.dataset[SITE_FRAME_CLONE_ATTR] = 'true';
    if (clone.classList && typeof clone.classList.add === 'function') {
      clone.classList.add('menu-item--site-frame-clone');
    }
    if (typeof targetList.appendChild === 'function') {
      targetList.appendChild(clone);
      appendedCount += 1;
    }
  });
  return appendedCount;
}
function syncSiteFrameMobileMenu({
  enabled = false,
  belowLap = false,
  sourceList = null,
  targetList = null
} = {}) {
  if (!enabled || !belowLap || !sourceList || !targetList) {
    removeSiteFrameMobileMenuClones(targetList);
    return 0;
  }
  return appendSiteFrameMobileMenuItems(sourceList, targetList);
}
function createSiteFrameRuntime({
  window: win = typeof window !== 'undefined' ? window : null,
  document: doc = typeof document !== 'undefined' ? document : null,
  sourceSelector = '.c-site-frame__menu',
  targetSelector = '.nb-header .nb-navigation--primary .menu',
  isBelowLap = () => !!win && typeof win.matchMedia === 'function' && win.matchMedia('not screen and (min-width: 1024px)').matches
} = {}) {
  function hasEnabledBodyClass() {
    return !!doc && !!doc.body && !!doc.body.classList && doc.body.classList.contains('has-site-frame-menu');
  }
  function getSourceList() {
    return doc && typeof doc.querySelector === 'function' ? doc.querySelector(sourceSelector) : null;
  }
  function getTargetList() {
    return doc && typeof doc.querySelector === 'function' ? doc.querySelector(targetSelector) : null;
  }
  function sync() {
    return syncSiteFrameMobileMenu({
      enabled: hasEnabledBodyClass(),
      belowLap: isBelowLap(),
      sourceList: getSourceList(),
      targetList: getTargetList()
    });
  }
  return {
    sync,
    removeClones() {
      return removeSiteFrameMobileMenuClones(getTargetList());
    }
  };
}
module.exports = {
  SITE_FRAME_CLONE_ATTR,
  appendSiteFrameMobileMenuItems,
  createSiteFrameRuntime,
  removeSiteFrameMobileMenuClones,
  syncSiteFrameMobileMenu
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

;// external "jQuery"
const external_jQuery_namespaceObject = jQuery;
var external_jQuery_default = /*#__PURE__*/__webpack_require__.n(external_jQuery_namespaceObject);
;// ./src/js/utils.js



const debounce = (func, wait) => {
  let timeout = null;
  return function () {
    const context = this;
    const args = arguments;
    const later = () => {
      func.apply(context, args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};
const hasTouchScreen = function () {
  var hasTouchScreen = false;
  if ('maxTouchPoints' in navigator) {
    hasTouchScreen = navigator.maxTouchPoints > 0;
  } else if ('msMaxTouchPoints' in navigator) {
    hasTouchScreen = navigator.msMaxTouchPoints > 0;
  } else {
    var mQ = window.matchMedia && matchMedia('(pointer:coarse)');
    if (mQ && mQ.media === '(pointer:coarse)') {
      hasTouchScreen = !!mQ.matches;
    } else if ('orientation' in window) {
      hasTouchScreen = true;
    } else {
      var UA = navigator.userAgent;
      hasTouchScreen = /\b(BlackBerry|webOS|iPhone|IEMobile)\b/i.test(UA) || /\b(Android|Windows Phone|iPad|iPod)\b/i.test(UA);
    }
  }
  return hasTouchScreen;
};
function setAndResetElementStyles(element, props = {}) {
  const $element = external_jQuery_default()(element);
  $element.css(props);
  Object.keys(props).forEach(key => {
    props[key] = '';
  });
  if (window.requestIdleCallback) {
    window.requestIdleCallback(() => {
      $element.css(props);
    });
  } else {
    setTimeout(() => {
      $element.css(props);
    }, 0);
  }
}
const getColorSetClasses = element => {
  const classAttr = element?.getAttribute('class');
  if (!classAttr) {
    return [];
  }
  const classes = classAttr.split(/\s+/);
  return classes.filter(classname => {
    return classname.search('sm-palette-') !== -1 || classname.search('sm-variation-') !== -1;
  });
};
const addClass = (element, classes) => {
  const classesArray = classes.split(/\s+/).filter(x => x.trim().length);
  if (classesArray.length) {
    element.classList.add(...classesArray);
  }
};
const removeClass = (element, classes) => {
  const classesArray = classes.split(/\s+/).filter(x => x.trim().length);
  if (classesArray.length) {
    element.classList.remove(...classesArray);
  }
};
const hasClass = (element, className) => {
  return element.classList.contains(className);
};
const toggleClasses = (element, classesToAdd = '') => {
  const prefixes = ['sm-palette-', 'sm-variation-', 'sm-color-signal-'];
  const classesToRemove = Array.from(element.classList).filter(classname => {
    return prefixes.some(prefix => classname.indexOf(prefix) > -1);
  });
  element.classList.remove(...classesToRemove);
  addClass(element, classesToAdd);
};
function getFirstChild(el) {
  var firstChild = el.firstChild;
  while (firstChild != null && firstChild.nodeType === 3) {
    // skip TextNodes
    firstChild = firstChild.nextSibling;
  }
  return firstChild;
}
const getFirstBlock = element => {
  if (!element || !element.children.length) {
    return element;
  }
  const firstBlock = element.children[0];
  if (hasClass(firstBlock, 'nb-sidecar')) {
    const content = firstBlock.querySelector('.nb-sidecar-area--content');
    if (content && content.children.length) {
      return getFirstBlock(content);
    }
  }
  return firstBlock;
};
;// ./src/js/components/globalService.js


class GlobalService {
  constructor() {
    this.props = {};
    this.newProps = {};
    this.renderCallbacks = [];
    this.resizeCallbacks = [];
    this.debouncedResizeCallbacks = [];
    this.observeCallbacks = [];
    this.scrollCallbacks = [];
    this.currentMutationList = [];
    this.frameRendered = true;
    this.useOrientation = hasTouchScreen() && 'orientation' in window;
    this._init();
  }
  _init() {
    const $window = external_jQuery_default()(window);
    const updateProps = this._updateProps.bind(this);
    const renderLoop = this._renderLoop.bind(this);
    this._debouncedResizeCallback = debounce(this._resizeCallbackToBeDebounced.bind(this), 100);

    // now
    updateProps();

    // on document ready
    external_jQuery_default()(updateProps);
    this._bindOnResize();
    this._bindOnScroll();
    this._bindOnLoad();
    this._bindObserver();
    this._bindCustomizer();
    requestAnimationFrame(renderLoop);
  }
  _bindOnResize() {
    const $window = external_jQuery_default()(window);
    const updateProps = this._updateProps.bind(this);
    if (this.useOrientation) {
      $window.on('orientationchange', () => {
        $window.one('resize', updateProps);
      });
    } else {
      $window.on('resize', updateProps);
    }
  }
  _bindOnScroll() {
    external_jQuery_default()(window).on('scroll', this._updateScroll.bind(this));
  }
  _bindOnLoad() {
    external_jQuery_default()(window).on('load', this._updateProps.bind(this));
  }
  _bindObserver() {
    const self = this;
    const observeCallback = this._observeCallback.bind(this);
    const observeAndUpdateProps = () => {
      observeCallback();
      self.currentMutationList = [];
    };
    const debouncedObserveCallback = debounce(observeAndUpdateProps, 300);
    if (!window.MutationObserver) {
      return;
    }
    const observer = new MutationObserver(function (mutationList) {
      self.currentMutationList = self.currentMutationList.concat(mutationList);
      debouncedObserveCallback();
    });
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }
  _bindCustomizer() {
    if (typeof wp !== 'undefined' && typeof wp.customize !== 'undefined') {
      if (typeof wp.customize.selectiveRefresh !== 'undefined') {
        wp.customize.selectiveRefresh.bind('partial-content-rendered', this._updateProps.bind(this));
      }
      wp.customize.bind('change', debounce(this._updateProps.bind(this), 100));
    }
  }
  _updateProps(force = false) {
    this._updateSize(force);
    this._updateScroll(force);
  }
  _observeCallback() {
    const mutationList = this.currentMutationList;
    external_jQuery_default().each(this.observeCallbacks, function (i, fn) {
      fn(mutationList);
    });
  }
  _renderLoop() {
    if (!this.frameRendered) {
      this._renderCallback();
      this.frameRendered = true;
    }
    window.requestAnimationFrame(this._renderLoop.bind(this));
  }
  _renderCallback() {
    const passedArguments = arguments;
    external_jQuery_default().each(this.renderCallbacks, function (i, fn) {
      fn(...passedArguments);
    });
  }
  _resizeCallback() {
    const passedArguments = arguments;
    external_jQuery_default().each(this.resizeCallbacks, function (i, fn) {
      fn(...passedArguments);
    });
  }
  _resizeCallbackToBeDebounced() {
    const passedArguments = arguments;
    external_jQuery_default().each(this.debouncedResizeCallbacks, function (i, fn) {
      fn(...passedArguments);
    });
  }
  _scrollCallback() {
    const passedArguments = arguments;
    external_jQuery_default().each(this.scrollCallbacks, function (i, fn) {
      fn(...passedArguments);
    });
  }
  _updateScroll(force = false) {
    this.newProps = Object.assign({}, this.newProps, {
      scrollY: window.scrollY,
      scrollX: window.scrollX
    });
    this._shouldUpdate(this._scrollCallback.bind(this));
  }
  _updateSize(force = false) {
    const body = document.body;
    const html = document.documentElement;
    const bodyScrollHeight = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight);
    const htmlScrollHeight = Math.max(html.scrollHeight, html.offsetHeight);
    this.newProps = Object.assign({}, this.newProps, {
      scrollHeight: Math.max(bodyScrollHeight, htmlScrollHeight),
      adminBarHeight: this.getAdminBarHeight(),
      windowWidth: this.useOrientation && window.screen && window.screen.availWidth || window.innerWidth,
      windowHeight: this.useOrientation && window.screen && window.screen.availHeight || window.innerHeight
    });
    this._shouldUpdate(() => {
      this._resizeCallback();
      this._debouncedResizeCallback();
    });
  }
  _shouldUpdate(callback, force = false) {
    if (this._hasNewProps() || force) {
      this.props = Object.assign({}, this.props, this.newProps);
      this.newProps = {};
      this.frameRendered = false;
      if (typeof callback === 'function') {
        callback();
      }
    }
  }
  _hasNewProps() {
    return Object.keys(this.newProps).some(key => {
      return this.newProps[key] !== this.props[key];
    });
  }
  getAdminBarHeight() {
    const adminBar = document.getElementById('wpadminbar');
    if (adminBar) {
      const box = adminBar.getBoundingClientRect();
      return box.height;
    }
    return 0;
  }
  registerOnResize(fn) {
    if (typeof fn === 'function' && this.resizeCallbacks.indexOf(fn) < 0) {
      this.resizeCallbacks.push(fn);
    }
  }
  registerOnDeouncedResize(fn) {
    if (typeof fn === 'function' && this.resizeCallbacks.indexOf(fn) < 0) {
      this.debouncedResizeCallbacks.push(fn);
    }
  }
  registerOnScroll(fn) {
    if (typeof fn === 'function' && this.scrollCallbacks.indexOf(fn) < 0) {
      this.scrollCallbacks.push(fn);
    }
  }
  registerObserverCallback(fn) {
    if (typeof fn === 'function' && this.observeCallbacks.indexOf(fn) < 0) {
      this.observeCallbacks.push(fn);
    }
  }
  registerRender(fn) {
    if (typeof fn === 'function' && this.renderCallbacks.indexOf(fn) < 0) {
      this.renderCallbacks.push(fn);
    }
  }
  getProps() {
    return this.props;
  }
}
/* harmony default export */ const globalService = (new GlobalService());
;// ./src/js/components/hero.js

class Hero {
  constructor(element) {
    this.element = element;
    this.progress = 0;
    this.timeline = gsap.timeline({
      paused: true,
      onComplete: () => {
        this.paused = true;
      }
    });
    this.pieces = this.getMarkupPieces();
    this.paused = false;
    this.offset = 0;
    this.reduceMotion = false;
    this.update();
    this.updateOnScroll();
    this.init();
  }
  init() {
    globalService.registerOnScroll(() => {
      this.update();
    });
    globalService.registerRender(() => {
      this.updateOnScroll();
    });
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    mediaQuery.addEventListener('change', () => {
      this.reduceMotion = mediaQuery.matches;
      this.updateOnScroll();
    });
    this.reduceMotion = mediaQuery.matches;
    this.addIntroToTimeline();
    this.timeline.addLabel('middle');
    this.addOutroToTimeline();
    this.timeline.addLabel('end');
    this.pauseTimelineOnScroll();
    if (this.reduceMotion) {
      const middleTime = this.labels.middle;
      const endTime = this.labels.end;
      const minTlProgress = middleTime / endTime;
      this.paused = true;
      this.timeline.progress(minTlProgress);
    } else {
      this.timeline.play();
    }
  }
  update() {
    const {
      scrollY
    } = globalService.getProps();
    this.box = this.element.getBoundingClientRect();
    this.view = {
      left: this.box.left,
      top: this.box.top + scrollY,
      width: this.box.width,
      height: this.box.height
    };
  }
  updateOnScroll() {
    const {
      scrollY,
      scrollHeight,
      windowHeight
    } = globalService.getProps();

    // used to calculate animation progress
    const length = windowHeight * 0.5;
    const middleMin = 0;
    const middleMax = scrollHeight - windowHeight - length * 0.5;
    const middle = this.view.top + (this.box.height - windowHeight) * 0.5;
    const middleMid = Math.max(middleMin, Math.min(middle, middleMax));
    this.start = middleMid - length * 0.5;
    this.end = this.start + length;
    this.progress = (scrollY - this.start) / (this.end - this.start);
    if (this.reduceMotion) {
      const middleTime = this.timeline.labels.middle;
      const endTime = this.timeline.labels.end;
      const minTlProgress = middleTime / endTime;
      this.progress = minTlProgress;
    }
    this.updateTimelineOnScroll();
  }
  updateTimelineOnScroll() {
    if (!this.paused) {
      return;
    }
    const currentProgress = this.timeline.progress();
    const middleTime = this.timeline.labels.middle;
    const endTime = this.timeline.labels.end;
    const minTlProgress = middleTime / endTime;
    let newTlProgress = (this.progress - 0.5) * 2 * (1 - minTlProgress) + minTlProgress;
    newTlProgress = Math.min(Math.max(minTlProgress, newTlProgress), 1);
    if (currentProgress === newTlProgress) {
      return;
    }
    this.timeline.progress(newTlProgress);
  }
  getMarkupPieces() {
    const container = jQuery(this.element).find('.novablocks-hero__inner-container, .nb-supernova-item__inner-container');
    const headline = container.children().filter('.c-headline').first();
    const title = headline.find('.c-headline__primary');
    const subtitle = headline.find('.c-headline__secondary');
    const separator = headline.next('.wp-block-separator');
    const sepFlower = separator.find('.c-separator__symbol');
    const sepLine = separator.find('.c-separator__line');
    const sepArrow = separator.find('.c-separator__arrow');
    const othersBefore = headline.prevAll();
    const othersAfter = headline.length ? headline.nextAll().not(separator).not('.nb-scroll-indicator') : container.children().not('.nb-scroll-indicator');
    return {
      headline,
      title,
      subtitle,
      separator,
      sepFlower,
      sepLine,
      sepArrow,
      othersBefore,
      othersAfter
    };
  }
  addIntroToTimeline() {
    const timeline = this.timeline;
    const {
      windowWidth
    } = globalService.getProps();
    const {
      headline,
      title,
      subtitle,
      separator,
      sepFlower,
      sepLine,
      sepArrow,
      othersBefore,
      othersAfter
    } = this.pieces;
    if (title.length && title.text().trim().length) {
      this.splitTitle = new SplitText(title, {
        wordsClass: 'c-headline__word'
      });
      this.splitTitle.lines.forEach(line => {
        const words = Array.from(line.children);
        const letters = [];
        words.forEach(word => {
          letters.push(...word.children);
        });
        letters.forEach(letter => {
          const box = letter.getBoundingClientRect();
          const width = letter.offsetWidth;
          const offset = box.x - windowWidth / 2;
          const offsetPercent = 2 * offset / windowWidth;
          const move = 400 * letters.length * offsetPercent;
          timeline.from(letter, {
            duration: 0.72,
            x: move,
            ease: 'power.out'
          }, 0);
        });
      });
      timeline.fromTo(title, {
        opacity: 0
      }, {
        opacity: 1,
        duration: 0.89,
        ease: 'power.out'
      }, 0);

      // aici era title dar facea un glitch ciudat
      timeline.fromTo(headline, {
        'y': 30
      }, {
        'y': 0,
        duration: 1,
        ease: 'power.out'
      }, 0);
    }
    if (subtitle.length) {
      timeline.fromTo(subtitle, {
        opacity: 0
      }, {
        opacity: 1,
        duration: 0.65,
        ease: 'power4.out'
      }, '-=0.65');
      timeline.fromTo(subtitle, {
        y: 30
      }, {
        y: 0,
        duration: 0.9,
        ease: 'power4.out'
      }, '-=0.65');
    }
    if (separator.length) {
      if (sepFlower.length) {
        timeline.fromTo(sepFlower, {
          opacity: 0
        }, {
          opacity: 1,
          duration: 0.15,
          ease: 'power4.out'
        }, '-=0.6');
        timeline.fromTo(sepFlower, {
          rotation: -270
        }, {
          rotation: 0,
          duration: 0.55,
          ease: 'back.out'
        }, '-=0.5');
      }
      if (sepLine.length) {
        timeline.fromTo(sepLine, {
          width: 0
        }, {
          width: '42%',
          opacity: 1,
          duration: 0.6,
          ease: 'power4.out'
        }, '-=0.55');
        timeline.fromTo(separator, {
          width: 0
        }, {
          width: '100%',
          opacity: 1,
          duration: 0.6,
          ease: 'power4.out'
        }, '-=0.6');
      }
      if (sepArrow.length) {
        timeline.fromTo(sepArrow, {
          opacity: 0
        }, {
          opacity: 1,
          duration: 0.2,
          ease: 'power4.out'
        }, '-=0.27');
      }
    }
    if (othersAfter.length) {
      timeline.fromTo(othersAfter, {
        opacity: 0
      }, {
        opacity: 1,
        duration: 0.5,
        ease: 'power4.out'
      }, '-=0.28');
      timeline.fromTo(othersAfter, {
        y: -20
      }, {
        y: 0,
        duration: 0.75
      }, '-=0.5');
    }
    if (othersBefore.length) {
      timeline.fromTo(othersBefore, {
        opacity: 0
      }, {
        opacity: 1,
        duration: 0.5,
        ease: 'power4.out'
      }, '-=0.75');
      timeline.fromTo(othersBefore, {
        y: 20
      }, {
        y: 0,
        duration: 0.75
      }, '-=0.75');
    }
    this.timeline = timeline;
  }
  addOutroToTimeline() {
    const {
      title,
      subtitle,
      othersBefore,
      othersAfter,
      separator,
      sepLine,
      sepFlower,
      sepArrow
    } = this.pieces;
    const timeline = this.timeline;
    if (title.length) {
      timeline.fromTo(title, {
        y: 0
      }, {
        opacity: 0,
        y: -60,
        duration: 1.08,
        ease: 'power1.in'
      }, 'middle');
    }
    if (subtitle.length) {
      timeline.to(subtitle, {
        opacity: 0,
        y: -90,
        duration: 1.08,
        ease: 'power1.in'
      }, 'middle');
    }
    if (othersBefore.length) {
      timeline.to(othersBefore, {
        y: 60,
        opacity: 0,
        duration: 1.08,
        ease: 'power1.in'
      }, 'middle');
    }
    if (othersAfter.length) {
      timeline.to(othersAfter, {
        y: 60,
        opacity: 0,
        duration: 1.08,
        ease: 'power1.in'
      }, 'middle');
    }
    if (sepLine.length) {
      timeline.to(sepLine, {
        width: '0%',
        opacity: 0,
        duration: 0.86,
        ease: 'power1.in'
      }, '-=0.94');
    }
    if (separator.length) {
      timeline.to(separator, {
        width: '0%',
        opacity: 0,
        duration: 0.86,
        ease: 'power1.in'
      }, '-=0.86');
    }
    if (sepFlower.length) {
      timeline.to(sepFlower, {
        rotation: 180,
        duration: 1
      }, '-=1.08');
    }
    if (sepFlower.length) {
      timeline.to(sepFlower, {
        opacity: 0,
        duration: 0.11
      }, '-=0.03');
    }
    if (sepArrow.length) {
      timeline.to(sepArrow, {
        opacity: 0,
        duration: 0.14
      }, '-=1.08');
    }
    this.timeline = timeline;
  }
  revertTitle() {
    if (typeof this.splitTitle !== 'undefined') {
      this.splitTitle.revert();
    }
  }
  pauseTimelineOnScroll() {
    const middleTime = this.timeline.labels.middle;
    const endTime = this.timeline.labels.end;
    this.timeline.eventCallback('onUpdate', tl => {
      const time = this.timeline.time();

      // calculate the current timeline progress relative to middle and end labels
      // in such a way that timelineProgress is 0.5 for middle and 1 for end
      // because we don't want the animation to be stopped before the middle label
      const tlProgress = (time - middleTime) / (endTime - middleTime);
      const pastMiddle = time > middleTime;
      const pastScroll = tlProgress * 0.5 + 0.5 >= this.progress;
      if (pastMiddle && pastScroll) {
        this.timeline.pause();
        this.revertTitle();
        this.timeline.eventCallback('onUpdate', null);
        this.paused = true;
      }
    }, ['{self}']);
  }
}
// EXTERNAL MODULE: ./src/js/components/hero-init-filter.js
var hero_init_filter = __webpack_require__(771);
var hero_init_filter_default = /*#__PURE__*/__webpack_require__.n(hero_init_filter);
;// ./src/js/components/commentsArea.js

class CommentsArea {
  constructor(element) {
    this.$element = external_jQuery_default()(element);
    this.$checkbox = this.$element.find('.c-comments-toggle__checkbox');
    this.$content = this.$element.find('.comments-area__content');
    this.$contentWrap = this.$element.find('.comments-area__wrap');

    // overwrite CSS that hides the comments area content
    this.$contentWrap.css('display', 'block');
    this.$checkbox.on('change', this.onChange.bind(this));
    this.checkWindowLocationComments();
  }
  onChange() {
    this.toggle(false);
  }
  toggle(instant = false) {
    const $contentWrap = this.$contentWrap;
    const isChecked = this.$checkbox.prop('checked');
    const newHeight = isChecked ? this.$content.outerHeight() : 0;
    if (instant) {
      $contentWrap.css('height', newHeight);
    } else {
      gsap.to($contentWrap, {
        duration: 0.4,
        height: newHeight,
        onComplete: function () {
          if (isChecked) {
            $contentWrap.css('height', '');
          }
        }
      });
    }
  }
  checkWindowLocationComments() {
    if (window.location.href.indexOf('#comment') === -1) {
      this.$checkbox.prop('checked', false);
      this.toggle(true);
    }
  }
}
;// ./src/js/components/mqService.js

class mqService {
  constructor() {
    this.breakpoints = {
      mobile: '480px',
      tablet: '768px',
      lap: '1024px',
      desktop: '1440px'
    };
    this.above = {};
    this.below = {};
    globalService.registerOnDeouncedResize(this.onResize.bind(this));
    this.onResize();
  }
  onResize() {
    Object.keys(this.breakpoints).forEach(key => {
      const breakpoint = this.breakpoints[key];
      this.above[key] = !!window.matchMedia(`not screen and (min-width: ${breakpoint})`).matches;
      this.below[key] = !!window.matchMedia(`not screen and (min-width: ${breakpoint})`).matches;
    });
  }
}
/* harmony default export */ const components_mqService = (new mqService());
;// ./src/js/components/navbar.js



const MENU_ITEM = '.menu-item, .page_item';
const MENU_ITEM_WITH_CHILDREN = '.menu-item-has-children, .page_item_has_children';
const SUBMENU = '.sub-menu, .children';
const SUBMENU_LEFT_CLASS = 'has-submenu-left';
const HOVER_CLASS = 'hover';
class Navbar {
  constructor() {
    this.$menuItems = external_jQuery_default()(MENU_ITEM);
    this.$menuItemsWithChildren = this.$menuItems.filter(MENU_ITEM_WITH_CHILDREN).removeClass(HOVER_CLASS);
    this.$menuItemsWithChildrenLinks = this.$menuItemsWithChildren.children('a');
    this.initialize();
  }
  initialize() {
    this.onResize();
    this.initialized = true;
    globalService.registerOnDeouncedResize(this.onResize.bind(this));
  }
  onResize() {
    // we are on desktop
    if (!components_mqService.below.lap) {
      this.addSubMenusLeftClass();
      if (this.initialized && !this.desktop) {
        this.unbindClick();
      }
      if (!this.initialized || !this.desktop) {
        this.bindHoverIntent();
      }
      this.desktop = true;
      return;
    }
    this.removeSubMenusLeftClass();
    if (this.initialized && this.desktop) {
      this.unbindHoverIntent();
    }
    if (!this.initialized || this.desktop) {
      this.bindClick();
    }
    this.desktop = false;
  }
  addSubMenusLeftClass() {
    const {
      windowWidth
    } = globalService.getProps();
    this.$menuItemsWithChildren.each(function (index, obj) {
      const $obj = external_jQuery_default()(obj);
      const $subMenu = $obj.children(SUBMENU),
        subMenuWidth = $subMenu.outerWidth(),
        subMenuOffSet = $subMenu.offset(),
        availableSpace = windowWidth - subMenuOffSet.left;
      if (availableSpace < subMenuWidth) {
        $obj.addClass(SUBMENU_LEFT_CLASS);
      }
    });
  }
  removeSubMenusLeftClass() {
    this.$menuItemsWithChildren.removeClass(SUBMENU_LEFT_CLASS);
  }
  onClickMobile(event) {
    const $link = external_jQuery_default()(this);
    const $siblings = $link.parent().siblings().not($link);
    if ($link.is('.active')) {
      return;
    }
    event.preventDefault();
    $link.addClass('active').parent().addClass(HOVER_CLASS);
    $siblings.removeClass(HOVER_CLASS);
    $siblings.find('.active').removeClass('active');
  }
  bindClick() {
    this.$menuItemsWithChildrenLinks.on('click', this.onClickMobile);
  }
  unbindClick() {
    this.$menuItemsWithChildrenLinks.off('click', this.onClickMobile);
  }
  bindHoverIntent() {
    this.$menuItems.hoverIntent({
      out: function () {
        external_jQuery_default()(this).removeClass(HOVER_CLASS);
      },
      over: function () {
        external_jQuery_default()(this).addClass(HOVER_CLASS);
      },
      timeout: 200
    });
  }
  unbindHoverIntent() {
    this.$menuItems.off('mousemove.hoverIntent mouseenter.hoverIntent mouseleave.hoverIntent');
    delete this.$menuItems.hoverIntent_t;
    delete this.$menuItems.hoverIntent_s;
  }
}
;// ./src/js/components/base-component.js

class BaseComponent {
  constructor() {
    globalService.registerOnResize(this.onResize.bind(this));
    globalService.registerOnDeouncedResize(this.onDebouncedResize.bind(this));
  }
  onResize() {}
  onDebouncedResize() {}
}
/* harmony default export */ const base_component = (BaseComponent);
;// ./src/js/components/search-overlay.js



const SEARCH_OVERLAY_OPEN_CLASS = 'has-search-overlay';
const ESC_KEY_CODE = 27;
class SearchOverlay extends base_component {
  constructor() {
    super();
    this.$searchOverlay = external_jQuery_default()('.c-search-overlay');
    this.initialize();
    this.onDebouncedResize();
  }
  initialize() {
    external_jQuery_default()(document).on('click', '.menu-item--search a', this.openSearchOverlay);
    external_jQuery_default()(document).on('click', '.c-search-overlay__cancel', this.closeSearchOverlay);
    external_jQuery_default()(document).on('keydown', this.closeSearchOverlayOnEsc);
  }
  onDebouncedResize() {
    setAndResetElementStyles(this.$searchOverlay, {
      transition: 'none'
    });
  }
  openSearchOverlay(e) {
    e.preventDefault();
    external_jQuery_default()('body').toggleClass(SEARCH_OVERLAY_OPEN_CLASS);
    external_jQuery_default()('.c-search-overlay__form .search-field').focus();
  }
  closeSearchOverlayOnEsc(e) {
    if (e.keyCode === ESC_KEY_CODE) {
      external_jQuery_default()('body').removeClass(SEARCH_OVERLAY_OPEN_CLASS);
      external_jQuery_default()('.c-search-overlay__form .search-field').blur();
    }
  }
  closeSearchOverlay(e) {
    e.preventDefault();
    external_jQuery_default()('body').removeClass(SEARCH_OVERLAY_OPEN_CLASS);
  }
}
/* harmony default export */ const search_overlay = (SearchOverlay);
// EXTERNAL MODULE: ./src/js/components/site-frame/index.js
var site_frame = __webpack_require__(33);
var site_frame_default = /*#__PURE__*/__webpack_require__.n(site_frame);
;// ./src/js/components/pile-parallax/index.js
/**
 * Pile Parallax — differential parallax scrolling for Nova Blocks collection grids.
 *
 * Ported from Pile theme's ArchiveParallax.js.
 * Uses vanilla JS + requestAnimationFrame — no GSAP dependency.
 *
 * Two linked features:
 *  1. 3D Grid: applies `js-3d` to the same item/column odd/even pattern used by
 *     Nova Blocks so the frontend matches the editor and plugin CSS.
 *  2. Parallax Scrolling: when 3D is enabled, only the selected 3D pattern gets
 *     translated on scroll; otherwise the effect applies to every item.
 */

const {
  getPilePatternSettings,
  matchesPilePattern,
  shouldParallaxItem
} = __webpack_require__(233);
const PARALLAX_SELECTOR = '.nb-supernova--pile-parallax';
const GRID_3D_SELECTOR = '.nb-supernova--pile-3d';
const ITEM_SELECTOR = '.nb-collection__layout-item';
let blocks = [];
let ticking = false;
let positiveOffsetFactor = 1;
let isBound = false;
let onResizeHandler = null;
let onPageTransitionCompleteHandler = null;
function getDocumentHeight() {
  const body = document.body;
  const html = document.documentElement;
  return Math.max(body ? body.scrollHeight : 0, html ? html.scrollHeight : 0);
}

/**
 * Add only the missing top/bottom space needed for parallax near viewport edges.
 * Mirrors Pile's ArchiveParallax.addMissingPadding() behavior.
 */
function addMissingPadding(layout, items, parallaxAmount, windowHeight) {
  if (!layout) {
    return;
  }
  let maxMissingTop = 0;
  let maxMissingBottom = 0;

  // Remove previously applied inline padding before recomputing.
  layout.style.paddingTop = '';
  layout.style.paddingBottom = '';
  const contentTop = 0;
  const contentBottom = getDocumentHeight();
  items.forEach(item => {
    item.style.transform = '';
    const rect = item.getBoundingClientRect();
    const itemTop = rect.top + window.scrollY;
    const itemHeight = item.offsetHeight;
    const toTop = itemTop + itemHeight / 2 - contentTop;
    const toBottom = contentBottom - itemTop - itemHeight / 2;
    const missingTop = toTop < windowHeight / 2 ? windowHeight / 2 - toTop : 0;
    const missingBottom = toBottom < windowHeight / 2 ? windowHeight / 2 - toBottom : 0;
    const paddingLimit = itemHeight * parallaxAmount / 2;
    maxMissingTop = Math.max(Math.min(missingTop, paddingLimit), maxMissingTop);
    maxMissingBottom = Math.max(Math.min(missingBottom, paddingLimit), maxMissingBottom);
  });
  if (!maxMissingTop && !maxMissingBottom) {
    return;
  }
  const computedStyles = window.getComputedStyle(layout);
  const basePaddingTop = parseFloat(computedStyles.paddingTop) || 0;
  const basePaddingBottom = parseFloat(computedStyles.paddingBottom) || 0;
  layout.style.paddingTop = `${(basePaddingTop + maxMissingTop).toFixed(2)}px`;
  layout.style.paddingBottom = `${(basePaddingBottom + maxMissingBottom).toFixed(2)}px`;
}

/**
 * Apply 3D grid classes to items in a collection.
 * Purely visual: adds `js-3d` class for CSS padding using Nova's selected pattern.
 */
function apply3dClasses(el) {
  const {
    columns,
    target3d,
    rule3d
  } = getPilePatternSettings({
    className: el.className,
    columns: parseInt(el.dataset.columns, 10) || 3
  });
  const items = el.querySelectorAll(ITEM_SELECTOR);
  items.forEach((item, index) => {
    item.classList.toggle('js-3d', matchesPilePattern({
      index,
      columns,
      target3d,
      rule3d
    }));
  });
}

/**
 * Initialize parallax for all matching blocks on the page.
 */
function initialize() {
  blocks = [];

  // 1. Apply 3D classes to all 3D grid blocks (independent of parallax).
  const grid3dElements = document.querySelectorAll(GRID_3D_SELECTOR);
  grid3dElements.forEach(apply3dClasses);

  // 2. Set up parallax scrolling for blocks that have it enabled.
  const parallaxElements = document.querySelectorAll(PARALLAX_SELECTOR);
  const windowHeight = window.innerHeight;
  // Reduce only the positive (downward) phase to avoid oversized blank bands at
  // the top of dense grids, while keeping the negative (upward) phase fully
  // visible so the parallax effect remains obvious during scroll.
  positiveOffsetFactor = 0.35;
  parallaxElements.forEach(el => {
    const amount = parseFloat(el.dataset.pileParallaxAmount) || 0;
    const parallaxAmount = amount / 100;
    const layout = el.querySelector('.nb-collection__layout');
    const pilePattern = getPilePatternSettings({
      className: el.className,
      columns: parseInt(el.dataset.columns, 10) || 3
    });
    if (amount <= 0) {
      if (layout) {
        layout.style.paddingTop = '';
        layout.style.paddingBottom = '';
      }
      return;
    }
    const items = el.querySelectorAll(ITEM_SELECTOR);
    if (!items.length) {
      if (layout) {
        layout.style.paddingTop = '';
        layout.style.paddingBottom = '';
      }
      return;
    }
    const animatedItems = Array.from(items).filter((item, index) => {
      const shouldAnimate = shouldParallaxItem({
        ...pilePattern,
        index
      });
      if (!shouldAnimate) {
        item.style.transform = '';
      }
      return shouldAnimate;
    });
    if (!animatedItems.length) {
      if (layout) {
        layout.style.paddingTop = '';
        layout.style.paddingBottom = '';
      }
      return;
    }

    // Match Pile: compute extra padding before measuring per-item scroll windows.
    addMissingPadding(layout, animatedItems, parallaxAmount, windowHeight);
    const itemsData = [];
    animatedItems.forEach(item => {
      // Reset transform before measuring positions.
      item.style.transform = '';
      const height = item.offsetHeight;
      const initialTop = height * parallaxAmount / 2;
      const travel = initialTop;

      // Cache the item's absolute top position for scroll-window calculation.
      const rect = item.getBoundingClientRect();
      const itemTop = rect.top + window.scrollY;

      // Scroll window: item enters viewport at bottom → leaves at top.
      const scrollStart = itemTop - windowHeight;
      const scrollEnd = itemTop + height;
      itemsData.push({
        el: item,
        travel,
        scrollStart,
        scrollEnd
      });
    });
    blocks.push({
      el,
      items: itemsData
    });
  });
  if (blocks.length) {
    update();
  }
}

/**
 * Update transforms based on current scroll position.
 */
function update() {
  const scrollY = window.scrollY;
  blocks.forEach(block => {
    block.items.forEach(({
      el,
      travel,
      scrollStart,
      scrollEnd
    }) => {
      const scrollRange = scrollEnd - scrollStart;
      if (scrollRange <= 0) {
        return;
      }
      let progress = (scrollY - scrollStart) / scrollRange;
      progress = Math.max(0, Math.min(1, progress));
      const rawOffset = travel - progress * travel * 2;
      const y = rawOffset > 0 ? rawOffset * positiveOffsetFactor : rawOffset;
      el.style.transform = `translateY(${y.toFixed(1)}px)`;
    });
  });
}

/**
 * Scroll handler with requestAnimationFrame throttle.
 */
function onScroll() {
  if (!ticking) {
    ticking = true;
    requestAnimationFrame(() => {
      update();
      ticking = false;
    });
  }
}

/**
 * Start listening for scroll events.
 */
function bind() {
  if (isBound) {
    return;
  }
  onResizeHandler = () => {
    initialize();
  };
  onPageTransitionCompleteHandler = () => {
    initialize();
    onScroll();
  };
  window.addEventListener('scroll', onScroll, {
    passive: true
  });
  window.addEventListener('resize', onResizeHandler);
  window.addEventListener('anima:page-transition-complete', onPageTransitionCompleteHandler);
  isBound = true;
}

/**
 * Clean up — useful for page transitions.
 */
function destroy() {
  window.removeEventListener('scroll', onScroll);
  if (onResizeHandler) {
    window.removeEventListener('resize', onResizeHandler);
  }
  if (onPageTransitionCompleteHandler) {
    window.removeEventListener('anima:page-transition-complete', onPageTransitionCompleteHandler);
  }
  onResizeHandler = null;
  onPageTransitionCompleteHandler = null;
  isBound = false;
  blocks = [];
}
// EXTERNAL MODULE: ./src/js/components/intro-animations/index.js
var intro_animations = __webpack_require__(688);
var intro_animations_default = /*#__PURE__*/__webpack_require__.n(intro_animations);
;// ./src/js/components/app.js











class App {
  constructor() {
    this.initializeHero();
    this.navbar = new Navbar();
    this.searchOverlay = new search_overlay();
    this.siteFrame = new (site_frame_default())();
    this.initializeImages();
    this.initializeCommentsArea();
    this.initializeReservationForm();
    this.initializeIntroAnimations();
    this.initializePileParallax();
  }
  initializeImages() {
    const showLoadedImages = this.showLoadedImages.bind(this);
    showLoadedImages();
    globalService.registerObserverCallback(function (mutationList) {
      external_jQuery_default().each(mutationList, (i, mutationRecord) => {
        external_jQuery_default().each(mutationRecord.addedNodes, (j, node) => {
          const nodeName = node.nodeName && node.nodeName.toLowerCase();
          if ('img' === nodeName || node.childNodes.length) {
            showLoadedImages(node);
          }
        });
      });
    });
  }
  initializeReservationForm() {
    globalService.registerObserverCallback(function (mutationList) {
      external_jQuery_default().each(mutationList, (i, mutationRecord) => {
        external_jQuery_default().each(mutationRecord.addedNodes, (j, node) => {
          const $node = external_jQuery_default()(node);
          if ($node.is('#ot-reservation-widget')) {
            $node.closest('.novablocks-opentable').addClass('is-loaded');
          }
        });
      });
    });
  }
  showLoadedImages(container = document.body) {
    const $images = external_jQuery_default()(container).find('img').not('[srcset], .is-loaded, .is-broken');
    $images.imagesLoaded().progress((instance, image) => {
      const className = image.isLoaded ? 'is-loaded' : 'is-broken';
      external_jQuery_default()(image.img).addClass(className);
    });
  }
  initializeHero() {
    const {
      NEW_HERO_SELECTOR: newHeroesSelector,
      OLD_HERO_SELECTOR: oldHeroesSelector,
      shouldInitializeHero
    } = (hero_init_filter_default());
    const heroesSelector = `${newHeroesSelector}, ${oldHeroesSelector}`;
    const heroElementsArray = Array.from(document.querySelectorAll(heroesSelector)).filter(shouldInitializeHero);
    this.HeroCollection = heroElementsArray.map(element => new Hero(element));
    this.firstHero = heroElementsArray[0];
  }
  initializePileParallax() {
    initialize();
    bind();
  }
  initializeIntroAnimations() {
    intro_animations_default().initialize();
    intro_animations_default().bind();
  }
  initializeCommentsArea() {
    const $commentsArea = external_jQuery_default()('.comments-area');
    if ($commentsArea.length) {
      this.commentsArea = new CommentsArea($commentsArea.get(0));
    }
  }
}
;// ./src/js/scripts.js


function scripts_initialize() {
  new App();
}
external_jQuery_default()(function () {
  const $window = external_jQuery_default()(window);
  const $html = external_jQuery_default()('html');
  if ($html.is('.wf-active')) {
    scripts_initialize();
  } else {
    $window.on('wf-active', scripts_initialize);
  }
});
})();

/******/ })()
;