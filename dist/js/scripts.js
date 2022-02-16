/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	// The require scope
/******/ 	var __webpack_require__ = {};
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
var __webpack_exports__ = {};

;// CONCATENATED MODULE: external "jQuery"
const external_jQuery_namespaceObject = jQuery;
var external_jQuery_default = /*#__PURE__*/__webpack_require__.n(external_jQuery_namespaceObject);
;// CONCATENATED MODULE: ./node_modules/colord/index.mjs
var r={grad:.9,turn:360,rad:360/(2*Math.PI)},t=function(r){return"string"==typeof r?r.length>0:"number"==typeof r},n=function(r,t,n){return void 0===t&&(t=0),void 0===n&&(n=Math.pow(10,t)),Math.round(n*r)/n+0},e=function(r,t,n){return void 0===t&&(t=0),void 0===n&&(n=1),r>n?n:r>t?r:t},u=function(r){return(r=isFinite(r)?r%360:0)>0?r:r+360},a=function(r){return{r:e(r.r,0,255),g:e(r.g,0,255),b:e(r.b,0,255),a:e(r.a)}},o=function(r){return{r:n(r.r),g:n(r.g),b:n(r.b),a:n(r.a,3)}},i=/^#([0-9a-f]{3,8})$/i,s=function(r){var t=r.toString(16);return t.length<2?"0"+t:t},h=function(r){var t=r.r,n=r.g,e=r.b,u=r.a,a=Math.max(t,n,e),o=a-Math.min(t,n,e),i=o?a===t?(n-e)/o:a===n?2+(e-t)/o:4+(t-n)/o:0;return{h:60*(i<0?i+6:i),s:a?o/a*100:0,v:a/255*100,a:u}},b=function(r){var t=r.h,n=r.s,e=r.v,u=r.a;t=t/360*6,n/=100,e/=100;var a=Math.floor(t),o=e*(1-n),i=e*(1-(t-a)*n),s=e*(1-(1-t+a)*n),h=a%6;return{r:255*[e,i,o,o,s,e][h],g:255*[s,e,e,i,o,o][h],b:255*[o,o,s,e,e,i][h],a:u}},g=function(r){return{h:u(r.h),s:e(r.s,0,100),l:e(r.l,0,100),a:e(r.a)}},d=function(r){return{h:n(r.h),s:n(r.s),l:n(r.l),a:n(r.a,3)}},f=function(r){return b((n=(t=r).s,{h:t.h,s:(n*=((e=t.l)<50?e:100-e)/100)>0?2*n/(e+n)*100:0,v:e+n,a:t.a}));var t,n,e},c=function(r){return{h:(t=h(r)).h,s:(u=(200-(n=t.s))*(e=t.v)/100)>0&&u<200?n*e/100/(u<=100?u:200-u)*100:0,l:u/2,a:t.a};var t,n,e,u},l=/^hsla?\(\s*([+-]?\d*\.?\d+)(deg|rad|grad|turn)?\s*,\s*([+-]?\d*\.?\d+)%\s*,\s*([+-]?\d*\.?\d+)%\s*(?:,\s*([+-]?\d*\.?\d+)(%)?\s*)?\)$/i,p=/^hsla?\(\s*([+-]?\d*\.?\d+)(deg|rad|grad|turn)?\s+([+-]?\d*\.?\d+)%\s+([+-]?\d*\.?\d+)%\s*(?:\/\s*([+-]?\d*\.?\d+)(%)?\s*)?\)$/i,v=/^rgba?\(\s*([+-]?\d*\.?\d+)(%)?\s*,\s*([+-]?\d*\.?\d+)(%)?\s*,\s*([+-]?\d*\.?\d+)(%)?\s*(?:,\s*([+-]?\d*\.?\d+)(%)?\s*)?\)$/i,m=/^rgba?\(\s*([+-]?\d*\.?\d+)(%)?\s+([+-]?\d*\.?\d+)(%)?\s+([+-]?\d*\.?\d+)(%)?\s*(?:\/\s*([+-]?\d*\.?\d+)(%)?\s*)?\)$/i,y={string:[[function(r){var t=i.exec(r);return t?(r=t[1]).length<=4?{r:parseInt(r[0]+r[0],16),g:parseInt(r[1]+r[1],16),b:parseInt(r[2]+r[2],16),a:4===r.length?n(parseInt(r[3]+r[3],16)/255,2):1}:6===r.length||8===r.length?{r:parseInt(r.substr(0,2),16),g:parseInt(r.substr(2,2),16),b:parseInt(r.substr(4,2),16),a:8===r.length?n(parseInt(r.substr(6,2),16)/255,2):1}:null:null},"hex"],[function(r){var t=v.exec(r)||m.exec(r);return t?t[2]!==t[4]||t[4]!==t[6]?null:a({r:Number(t[1])/(t[2]?100/255:1),g:Number(t[3])/(t[4]?100/255:1),b:Number(t[5])/(t[6]?100/255:1),a:void 0===t[7]?1:Number(t[7])/(t[8]?100:1)}):null},"rgb"],[function(t){var n=l.exec(t)||p.exec(t);if(!n)return null;var e,u,a=g({h:(e=n[1],u=n[2],void 0===u&&(u="deg"),Number(e)*(r[u]||1)),s:Number(n[3]),l:Number(n[4]),a:void 0===n[5]?1:Number(n[5])/(n[6]?100:1)});return f(a)},"hsl"]],object:[[function(r){var n=r.r,e=r.g,u=r.b,o=r.a,i=void 0===o?1:o;return t(n)&&t(e)&&t(u)?a({r:Number(n),g:Number(e),b:Number(u),a:Number(i)}):null},"rgb"],[function(r){var n=r.h,e=r.s,u=r.l,a=r.a,o=void 0===a?1:a;if(!t(n)||!t(e)||!t(u))return null;var i=g({h:Number(n),s:Number(e),l:Number(u),a:Number(o)});return f(i)},"hsl"],[function(r){var n=r.h,a=r.s,o=r.v,i=r.a,s=void 0===i?1:i;if(!t(n)||!t(a)||!t(o))return null;var h=function(r){return{h:u(r.h),s:e(r.s,0,100),v:e(r.v,0,100),a:e(r.a)}}({h:Number(n),s:Number(a),v:Number(o),a:Number(s)});return b(h)},"hsv"]]},N=function(r,t){for(var n=0;n<t.length;n++){var e=t[n][0](r);if(e)return[e,t[n][1]]}return[null,void 0]},x=function(r){return"string"==typeof r?N(r.trim(),y.string):"object"==typeof r&&null!==r?N(r,y.object):[null,void 0]},I=function(r){return x(r)[1]},M=function(r,t){var n=c(r);return{h:n.h,s:e(n.s+100*t,0,100),l:n.l,a:n.a}},H=function(r){return(299*r.r+587*r.g+114*r.b)/1e3/255},colord_$=function(r,t){var n=c(r);return{h:n.h,s:n.s,l:e(n.l+100*t,0,100),a:n.a}},j=function(){function r(r){this.parsed=x(r)[0],this.rgba=this.parsed||{r:0,g:0,b:0,a:1}}return r.prototype.isValid=function(){return null!==this.parsed},r.prototype.brightness=function(){return n(H(this.rgba),2)},r.prototype.isDark=function(){return H(this.rgba)<.5},r.prototype.isLight=function(){return H(this.rgba)>=.5},r.prototype.toHex=function(){return r=o(this.rgba),t=r.r,e=r.g,u=r.b,i=(a=r.a)<1?s(n(255*a)):"","#"+s(t)+s(e)+s(u)+i;var r,t,e,u,a,i},r.prototype.toRgb=function(){return o(this.rgba)},r.prototype.toRgbString=function(){return r=o(this.rgba),t=r.r,n=r.g,e=r.b,(u=r.a)<1?"rgba("+t+", "+n+", "+e+", "+u+")":"rgb("+t+", "+n+", "+e+")";var r,t,n,e,u},r.prototype.toHsl=function(){return d(c(this.rgba))},r.prototype.toHslString=function(){return r=d(c(this.rgba)),t=r.h,n=r.s,e=r.l,(u=r.a)<1?"hsla("+t+", "+n+"%, "+e+"%, "+u+")":"hsl("+t+", "+n+"%, "+e+"%)";var r,t,n,e,u},r.prototype.toHsv=function(){return r=h(this.rgba),{h:n(r.h),s:n(r.s),v:n(r.v),a:n(r.a,3)};var r},r.prototype.invert=function(){return w({r:255-(r=this.rgba).r,g:255-r.g,b:255-r.b,a:r.a});var r},r.prototype.saturate=function(r){return void 0===r&&(r=.1),w(M(this.rgba,r))},r.prototype.desaturate=function(r){return void 0===r&&(r=.1),w(M(this.rgba,-r))},r.prototype.grayscale=function(){return w(M(this.rgba,-1))},r.prototype.lighten=function(r){return void 0===r&&(r=.1),w(colord_$(this.rgba,r))},r.prototype.darken=function(r){return void 0===r&&(r=.1),w(colord_$(this.rgba,-r))},r.prototype.rotate=function(r){return void 0===r&&(r=15),this.hue(this.hue()+r)},r.prototype.alpha=function(r){return"number"==typeof r?w({r:(t=this.rgba).r,g:t.g,b:t.b,a:r}):n(this.rgba.a,3);var t},r.prototype.hue=function(r){var t=c(this.rgba);return"number"==typeof r?w({h:r,s:t.s,l:t.l,a:t.a}):n(t.h)},r.prototype.isEqual=function(r){return this.toHex()===w(r).toHex()},r}(),w=function(r){return r instanceof j?r:new j(r)},S=[],k=function(r){r.forEach(function(r){S.indexOf(r)<0&&(r(j,y),S.push(r))})},E=function(){return new j({r:255*Math.random(),g:255*Math.random(),b:255*Math.random()})};

;// CONCATENATED MODULE: ./node_modules/colord/plugins/a11y.mjs
var a11y_o=function(o){var t=o/255;return t<.04045?t/12.92:Math.pow((t+.055)/1.055,2.4)},a11y_t=function(t){return.2126*a11y_o(t.r)+.7152*a11y_o(t.g)+.0722*a11y_o(t.b)};/* harmony default export */ function a11y(o){o.prototype.luminance=function(){return o=a11y_t(this.rgba),void 0===(r=2)&&(r=0),void 0===n&&(n=Math.pow(10,r)),Math.round(n*o)/n+0;var o,r,n},o.prototype.contrast=function(r){void 0===r&&(r="#FFF");var n,a,i,e,v,u,d,c=r instanceof o?r:new o(r);return e=this.rgba,v=c.toRgb(),u=a11y_t(e),d=a11y_t(v),n=u>d?(u+.05)/(d+.05):(d+.05)/(u+.05),void 0===(a=2)&&(a=0),void 0===i&&(i=Math.pow(10,a)),Math.floor(i*n)/i+0},o.prototype.isReadable=function(o,t){return void 0===o&&(o="#FFF"),void 0===t&&(t={}),this.contrast(o)>=(e=void 0===(i=(r=t).size)?"normal":i,"AAA"===(a=void 0===(n=r.level)?"AA":n)&&"normal"===e?7:"AA"===a&&"large"===e?3:4.5);var r,n,a,i,e}}

;// CONCATENATED MODULE: ./src/js/utils.js



const utils_debounce = (func, wait) => {
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
function utils_setAndResetElementStyles(element) {
  let props = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
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
const utils_getColorSetClasses = element => {
  const classAttr = element?.getAttribute('class');

  if (!classAttr) {
    return [];
  }

  const classes = classAttr.split(/\s+/);
  return classes.filter(classname => {
    return classname.search('sm-palette-') !== -1 || classname.search('sm-variation-') !== -1;
  });
};
const utils_addClass = (element, classes) => {
  const classesArray = classes.split(/\s+/).filter(x => x.trim().length);

  if (classesArray.length) {
    element.classList.add(...classesArray);
  }
};
const utils_removeClass = (element, classes) => {
  const classesArray = classes.split(/\s+/).filter(x => x.trim().length);

  if (classesArray.length) {
    element.classList.remove(...classesArray);
  }
};
const utils_hasClass = (element, className) => {
  return element.classList.contains(className);
};
const utils_toggleClasses = function (element) {
  let classesToAdd = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
  const prefixes = ['sm-palette-', 'sm-variation-', 'sm-color-signal-'];
  const classesToRemove = Array.from(element.classList).filter(classname => {
    return prefixes.some(prefix => classname.indexOf(prefix) > -1);
  });
  element.classList.remove(...classesToRemove);
  utils_addClass(element, classesToAdd);
};
function utils_getFirstChild(el) {
  var firstChild = el.firstChild;

  while (firstChild != null && firstChild.nodeType === 3) {
    // skip TextNodes
    firstChild = firstChild.nextSibling;
  }

  return firstChild;
}
const utils_toggleLightClasses = element => {
  const classes = Array.from(element.classList);
  const paletteClassname = classes.find(classname => {
    return classname.indexOf('sm-palette-') > -1 && classname.indexOf('sm-palette--') === -1;
  });
  const palette = paletteClassname ? paletteClassname.substring('sm-palette-'.length) : 1;
  const variationPrefix = 'sm-variation-';
  const variationClassname = classes.find(classname => classname.indexOf(variationPrefix) > -1);
  const variation = variationClassname ? variationClassname.substring(variationPrefix.length) : 1;
  const isShifted = !!classes.find(classname => classname.indexOf('sm-palette--shifted') > -1);
  const sm_site_color_variation = window?.style_manager_values?.sm_site_color_variation;
  const siteColorVariation = sm_site_color_variation ? parseInt(sm_site_color_variation, 10) : 1;

  if (!Array.isArray(window?.styleManager?.colorsConfig)) {
    return;
  }

  const currentPaletteConfig = window.styleManager.colorsConfig.find(thisPalette => {
    return `${thisPalette.id}` === `${palette}`;
  });

  if (currentPaletteConfig) {
    k([a11y]);
    const variationIndex = parseInt(variation, 10) - 1;
    const hex = currentPaletteConfig.variations ? currentPaletteConfig.variations[variationIndex].bg : currentPaletteConfig.colors[variationIndex].value;
    const isLight = w('#FFFFFF').contrast(hex) < w('#000000').contrast(hex);
    utils_removeClass(element, isLight ? 'sm-dark' : 'sm-light');
    utils_addClass(element, isLight ? 'sm-light' : 'sm-dark');
  }
};
const utils_getFirstBlock = element => {
  if (!element || !element.children.length) {
    return element;
  }

  const firstBlock = element.children[0];

  if (utils_hasClass(firstBlock, 'nb-sidecar')) {
    const content = firstBlock.querySelector('.nb-sidecar-area--content');

    if (content && content.children.length) {
      return utils_getFirstBlock(content);
    }
  }

  return firstBlock;
};
;// CONCATENATED MODULE: ./src/js/components/globalService.js



class globalService_GlobalService {
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

    this._debouncedResizeCallback = utils_debounce(this._resizeCallbackToBeDebounced.bind(this), 100); // now

    updateProps(); // on document ready

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

    const debouncedObserveCallback = utils_debounce(observeAndUpdateProps, 300);

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

      wp.customize.bind('change', utils_debounce(this._updateProps.bind(this), 100));
    }
  }

  _updateProps() {
    let force = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

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

  _updateScroll() {
    let force = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
    this.newProps = Object.assign({}, this.newProps, {
      scrollY: window.pageYOffset,
      scrollX: window.pageXOffset
    });

    this._shouldUpdate(this._scrollCallback.bind(this));
  }

  _updateSize() {
    let force = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
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

  _shouldUpdate(callback) {
    let force = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

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

/* harmony default export */ const components_globalService = (new globalService_GlobalService());
;// CONCATENATED MODULE: ./src/js/components/hero.js

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
    components_globalService.registerOnScroll(() => {
      this.update();
    });
    components_globalService.registerRender(() => {
      this.updateOnScroll();
    });
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    mediaQuery.addListener(() => {
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
    } = components_globalService.getProps();
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
    } = components_globalService.getProps(); // used to calculate animation progress

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
    const container = jQuery(this.element).find('.novablocks-hero__inner-container');
    const headline = container.children().filter('.c-headline').first();
    const title = headline.find('.c-headline__primary');
    const subtitle = headline.find('.c-headline__secondary');
    const separator = headline.next('.wp-block-separator');
    const sepFlower = separator.find('.c-separator__symbol');
    const sepLine = separator.find('.c-separator__line');
    const sepArrow = separator.find('.c-separator__arrow');
    const othersBefore = headline.prevAll();
    const othersAfter = headline.length ? headline.nextAll().not(separator) : container.children();
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
    } = components_globalService.getProps();
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
      }, 0); // aici era title dar facea un glitch ciudat

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
    timeline.fromTo(title, {
      y: 0
    }, {
      opacity: 0,
      y: -60,
      duration: 1.08,
      ease: 'power1.in'
    }, 'middle');
    timeline.to(subtitle, {
      opacity: 0,
      y: -90,
      duration: 1.08,
      ease: 'power1.in'
    }, 'middle');
    timeline.to(othersBefore, {
      y: 60,
      opacity: 0,
      duration: 1.08,
      ease: 'power1.in'
    }, 'middle');
    timeline.to(othersAfter, {
      y: 60,
      opacity: 0,
      duration: 1.08,
      ease: 'power1.in'
    }, 'middle');
    timeline.to(sepLine, {
      width: '0%',
      opacity: 0,
      duration: 0.86,
      ease: 'power1.in'
    }, '-=0.94');
    timeline.to(separator, {
      width: '0%',
      opacity: 0,
      duration: 0.86,
      ease: 'power1.in'
    }, '-=0.86');
    timeline.to(sepFlower, {
      rotation: 180,
      duration: 1
    }, '-=1.08');
    timeline.to(sepFlower, {
      opacity: 0,
      duration: 0.11
    }, '-=0.03');
    timeline.to(sepArrow, {
      opacity: 0,
      duration: 0.14
    }, '-=1.08');
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
      const time = this.timeline.time(); // calculate the current timeline progress relative to middle and end labels
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
;// CONCATENATED MODULE: ./src/js/components/commentsArea.js

class CommentsArea {
  constructor(element) {
    this.$element = external_jQuery_default()(element);
    this.$checkbox = this.$element.find('.c-comments-toggle__checkbox');
    this.$content = this.$element.find('.comments-area__content');
    this.$contentWrap = this.$element.find('.comments-area__wrap'); // overwrite CSS that hides the comments area content

    this.$contentWrap.css('display', 'block');
    this.$checkbox.on('change', this.onChange.bind(this));
    this.checkWindowLocationComments();
  }

  onChange() {
    this.toggle(false);
  }

  toggle() {
    let instant = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
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
;// CONCATENATED MODULE: ./src/js/components/mqService.js


class mqService_mqService {
  constructor() {
    this.breakpoints = {
      mobile: '480px',
      tablet: '768px',
      lap: '1024px',
      desktop: '1440px'
    };
    this.above = {};
    this.below = {};
    components_globalService.registerOnDeouncedResize(this.onResize.bind(this));
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

/* harmony default export */ const components_mqService = (new mqService_mqService());
;// CONCATENATED MODULE: ./src/js/components/navbar.js



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
    components_globalService.registerOnDeouncedResize(this.onResize.bind(this));
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
    } = components_globalService.getProps();
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
;// CONCATENATED MODULE: ./src/js/components/base-component.js


class BaseComponent {
  constructor() {
    components_globalService.registerOnResize(this.onResize.bind(this));
    components_globalService.registerOnDeouncedResize(this.onDebouncedResize.bind(this));
  }

  onResize() {}

  onDebouncedResize() {}

}

/* harmony default export */ const base_component = (BaseComponent);
;// CONCATENATED MODULE: ./src/js/components/search-overlay.js



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
    utils_setAndResetElementStyles(this.$searchOverlay, {
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
;// CONCATENATED MODULE: ./src/js/components/header-template/header/header-base.js



class header_base_HeaderBase {
  constructor(options) {
    this.staticDistance = 0;
    this.stickyDistance = 0;
    this.options = options || {};
  }

  initialize() {
    addClass(this.element, 'novablocks-header--ready');
    globalService.registerRender(this.render.bind(this));
    globalService.registerOnDeouncedResize(this.onResize.bind(this));
  }

  onResize() {
    this.box = this.element.getBoundingClientRect();

    if (typeof this.options.onResize === 'function') {
      this.options.onResize();
    }
  }

  getHeight() {
    return this?.box?.height;
  }

  render(forceUpdate) {
    this.maybeUpdateStickyStyles(forceUpdate);
  }

  maybeUpdateStickyStyles(forceUpdate) {
    const {
      scrollY
    } = globalService.getProps();
    const shouldBeSticky = scrollY > this.staticDistance - this.stickyDistance;

    if (this.shouldBeSticky === shouldBeSticky && !forceUpdate) {
      return;
    }

    this.shouldBeSticky = shouldBeSticky;
    this.updateStickyStyles();
  }

  updateStickyStyles() {
    this.applyStickyStyles(this.element);
  }

  applyStickyStyles(element) {
    if (this.shouldBeSticky) {
      element.style.position = 'fixed';
      element.style.top = `${this.stickyDistance}px`;
    } else {
      element.style.position = '';
      element.style.top = '';
    }
  }

}

/* harmony default export */ const header_base = ((/* unused pure expression or super */ null && (header_base_HeaderBase)));
;// CONCATENATED MODULE: ./src/js/components/header-template/header/header-colors.js



class header_colors_HeaderColors {
  constructor(element, initialColorsSource, transparentColorsSource) {
    this.element = element;
    this.initialColorsSource = initialColorsSource ? initialColorsSource : element;
    this.transparentColorsSource = transparentColorsSource ? transparentColorsSource : this.getFirstUsefulBlock();
    this.initializeColors();
  }

  getFirstBlock() {
    const content = document.querySelector('.site-main .hentry');

    if (!content) {
      return null;
    }

    const firstBlock = getFirstChild(content);

    if (hasClass(firstBlock, 'nb-sidecar')) {
      const wrapper = firstBlock.querySelector('.nb-sidecar-area--content');

      if (!wrapper) {
        return firstBlock;
      }

      return getFirstChild(wrapper);
    }

    return null;
  }

  getFirstUsefulBlock() {
    const firstBlock = this.getFirstBlock();

    if (!firstBlock) {
      return null;
    }

    const attributes = firstBlock.dataset;

    if (!hasClass(firstBlock, 'alignfull')) {
      return null;
    }

    if (hasClass(firstBlock, 'supernova') && parseInt(attributes.imagePadding, 10) === 0 && attributes.cardLayout === 'stacked' && !firstBlock.querySelector('.nb-collection__header')) {
      return firstBlock.querySelector('.supernova-item');
    }

    return firstBlock;
  }

  initializeColors() {
    this.initialColorClasses = getColorSetClasses(this.initialColorsSource).join(' ');
    this.transparentColorClasses = this.initialColorClasses;

    if (this.transparentColorsSource) {
      this.transparentColorClasses = getColorSetClasses(this.transparentColorsSource).join(' ');
    } else {
      this.transparentColorClasses = 'sm-palette-1 sm-variation-1';
    }

    this.transparentColorClasses = `${this.transparentColorClasses}`;
  }

  toggleColors(isTransparent) {
    toggleClasses(this.element, isTransparent ? this.transparentColorClasses : this.initialColorClasses);
    toggleLightClasses(this.element);
  }

}

/* harmony default export */ const header_colors = ((/* unused pure expression or super */ null && (header_colors_HeaderColors)));
;// CONCATENATED MODULE: ./src/js/components/header-template/header/header-mobile.js





class header_mobile_HeaderMobile extends (/* unused pure expression or super */ null && (HeaderBase)) {
  constructor(parent) {
    super();
    this.parent = parent;
    this.parentContainer = parent.element.querySelector('.novablocks-header__inner-container');
    this.initialize();
    this.onResize();
  }

  initialize() {
    this.initializeMenuToggle();
    this.createMobileHeader();
    const logoRow = this.parent.rows.find(row => {
      return row.element.querySelector('.site-logo');
    });
    this.headerClasses = getColorSetClasses(this.parent.element).join(' ');
    this.colors = new HeaderColors(this.element, logoRow?.element);
    this.menuToggleColors = new HeaderColors(this.menuToggle.element, logoRow?.element);
    HeaderBase.prototype.initialize.call(this);
  }

  render(forceUpdate) {
    HeaderBase.prototype.render.call(this, forceUpdate);
  }

  initializeMenuToggle() {
    const menuToggleCheckbox = document.getElementById('nova-menu-toggle');
    this.navigationIsOpen = menuToggleCheckbox.checked;
    this.menuToggle = new MenuToggle(menuToggleCheckbox, {
      onChange: this.onToggleChange.bind(this)
    });
  }

  createMobileHeader() {
    this.element = document.createElement('div');
    this.element.setAttribute('class', 'novablocks-header--mobile novablocks-header-background novablocks-header-shadow');
    this.copyElementFromParent('.c-branding');
    this.copyElementFromParent('.menu-item--cart');
    this.menuToggle.element.insertAdjacentElement('afterend', this.element);
    this.createButtonMenu();
  }

  createButtonMenu() {
    let buttonCount = 0;
    this.buttonMenu = document.createElement('ul');
    addClass(this.buttonMenu, 'menu menu--buttons');
    const buttonSelectors = ['.menu-item--search', '.menu-item--dark-mode'];
    buttonSelectors.forEach(selector => {
      const button = this.parent.element.querySelector(selector);

      if (button) {
        const buttonClone = button.cloneNode(true);
        this.buttonMenu.appendChild(buttonClone);
        buttonCount = buttonCount + 1;
      }
    });

    if (buttonCount) {
      // create a fake navigation block to inherit styles
      // @todo hopefully find a better solution for styling
      const navigationBlock = document.createElement('div');
      const wrapper = document.createElement('div');
      addClass(navigationBlock, 'wp-block-novablocks-navigation');
      addClass(wrapper, 'novablocks-header__buttons-menu wp-block-group__inner-container');
      wrapper.appendChild(navigationBlock);
      navigationBlock.appendChild(this.buttonMenu);
      this.parent.element.appendChild(wrapper);
    }
  }

  updateStickyStyles() {
    HeaderBase.prototype.updateStickyStyles.call(this);
    this.applyStickyStyles(this.menuToggle.element);
    this.colors.toggleColors(!this.shouldBeSticky);
    this.updateToggleClasses();
  }

  onResize() {
    HeaderBase.prototype.onResize.call(this);
    this.update();
  }

  update() {
    this.element.style.top = `${this.stickyDistance}px`;
    this.menuToggle.element.style.height = `${this.box.height}px`;
    this.parentContainer.style.paddingTop = `${this.box.height}px`;
    this.buttonMenu.style.height = `${this.box.height}px`;
  }

  onToggleChange(event, menuToggle) {
    const {
      checked
    } = event.target;
    document.body.style.overflow = checked ? 'hidden' : '';
    this.navigationIsOpen = !!checked;
    this.updateToggleClasses();
  }

  updateToggleClasses() {
    if (this.navigationIsOpen) {
      removeClass(this.menuToggle.element, `${this.menuToggleColors.transparentColorClasses} ${this.menuToggleColors.initialColorClasses}`);
      addClass(this.menuToggle.element, this.headerClasses);
    } else {
      removeClass(this.menuToggle.element, this.headerClasses);
      this.menuToggleColors.toggleColors(!this.shouldBeSticky);
    }
  }

  copyElementFromParent(selector) {
    const element = this.parent.element.querySelector(selector);
    const elementClone = element?.cloneNode(true);

    if (elementClone) {
      this.element.appendChild(elementClone);
    }
  }

}

/* harmony default export */ const header_mobile = ((/* unused pure expression or super */ null && (header_mobile_HeaderMobile)));
;// CONCATENATED MODULE: ./src/js/components/header-template/header/header-row.js



class header_row_HeaderRow extends (/* unused pure expression or super */ null && (HeaderBase)) {
  constructor(element) {
    super();
    this.element = element;
    this.colors = new HeaderColors(this.element);
  }

}

/* harmony default export */ const header_row = ((/* unused pure expression or super */ null && (header_row_HeaderRow)));
;// CONCATENATED MODULE: ./src/js/components/header-template/header/index.js







class header_Header extends (/* unused pure expression or super */ null && (HeaderBase)) {
  constructor(element, options) {
    super(options);

    if (!element) {
      return;
    }

    this.onUpdate = options.onUpdate;
    this.element = element;
    this.placeholder = document.createElement('div');
    this.placeholder.style.display = 'none';
    addClass(this.placeholder, 'site-header-placeholder');
    this.element.insertAdjacentElement('beforebegin', this.placeholder);
    this.rows = this.getHeaderRows();
    this.shouldToggleColors = !!this.element.dataset.sticky;
    this.mobileHeader = new HeaderMobile(this);
    this.secondaryHeader = this.getSecondaryHeader();
    this.initialize();
    this.toggleRowsColors(true);
    addClass(this.element, 'novablocks-header--transparent');

    if (this.secondaryHeader) {
      addClass(this.secondaryHeader, 'novablocks-header--ready');
    }

    this.onResize();
  }

  initialize() {
    HeaderBase.prototype.initialize.call(this);
    this.timeline = this.getIntroTimeline();
    this.timeline.play();
  }

  render(forceUpdate) {
    HeaderBase.prototype.render.call(this, forceUpdate);

    if (typeof this.onUpdate === 'function') {
      this.onUpdate();
    }
  }

  getHeight() {
    if (!!mqService.below.lap) {
      return this.mobileHeader.getHeight();
    }

    return HeaderBase.prototype.getHeight.call(this);
  }

  onResize() {
    HeaderBase.prototype.onResize.call(this);
    setAndResetElementStyles(this.element, {
      transition: 'none'
    });
  }

  getSecondaryHeader() {
    return document.querySelector('.novablocks-header--secondary');
  }

  getHeaderRows() {
    const rows = this.element.querySelectorAll('.novablocks-header-row');

    if (rows) {
      return Array.from(rows).map(element => {
        return new HeaderRow(element);
      });
    }

    return [];
  }

  toggleRowsColors(isTransparent) {
    this.rows.forEach(row => {
      row.colors.toggleColors(isTransparent);
    });
  }

  updateStickyStyles() {
    HeaderBase.prototype.updateStickyStyles.call(this);

    if (this.shouldToggleColors) {
      this.toggleRowsColors(!this.shouldBeSticky);
    } //    this.element.style.marginTop = `${this.staticDistance}px`;


    if (this.secondaryHeader) {
      this.secondaryHeader.style.top = `${this.staticDistance}px`;
    }
  }

  getIntroTimeline() {
    const that = this;
    const timeline = gsap.timeline({
      paused: true
    });
    const height = this.element.offsetHeight;
    const transitionEasing = 'power4.inOut';
    const transitionDuration = 0.5;
    timeline.to(this.element, {
      duration: transitionDuration,
      opacity: 1,
      ease: transitionEasing
    }, 0);
    timeline.to({
      height: 0
    }, {
      duration: transitionDuration,
      height: height,
      onUpdate: function () {
        const targets = this.targets();

        if (Array.isArray(targets) && targets.length) {
          that.box = Object.assign({}, that.box, {
            height: targets[0].height
          });
          that.onResize();
        }
      },
      onUpdateParams: ['{self}'],
      ease: transitionEasing
    }, 0);
    return timeline;
  }

}

/* harmony default export */ const header = ((/* unused pure expression or super */ null && (header_Header)));
;// CONCATENATED MODULE: ./node_modules/js-cookie/dist/js.cookie.mjs
/*! js-cookie v3.0.1 | MIT */
/* eslint-disable no-var */
function js_cookie_assign (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];
    for (var key in source) {
      target[key] = source[key];
    }
  }
  return target
}
/* eslint-enable no-var */

/* eslint-disable no-var */
var defaultConverter = {
  read: function (value) {
    if (value[0] === '"') {
      value = value.slice(1, -1);
    }
    return value.replace(/(%[\dA-F]{2})+/gi, decodeURIComponent)
  },
  write: function (value) {
    return encodeURIComponent(value).replace(
      /%(2[346BF]|3[AC-F]|40|5[BDE]|60|7[BCD])/g,
      decodeURIComponent
    )
  }
};
/* eslint-enable no-var */

/* eslint-disable no-var */

function init (converter, defaultAttributes) {
  function set (key, value, attributes) {
    if (typeof document === 'undefined') {
      return
    }

    attributes = js_cookie_assign({}, defaultAttributes, attributes);

    if (typeof attributes.expires === 'number') {
      attributes.expires = new Date(Date.now() + attributes.expires * 864e5);
    }
    if (attributes.expires) {
      attributes.expires = attributes.expires.toUTCString();
    }

    key = encodeURIComponent(key)
      .replace(/%(2[346B]|5E|60|7C)/g, decodeURIComponent)
      .replace(/[()]/g, escape);

    var stringifiedAttributes = '';
    for (var attributeName in attributes) {
      if (!attributes[attributeName]) {
        continue
      }

      stringifiedAttributes += '; ' + attributeName;

      if (attributes[attributeName] === true) {
        continue
      }

      // Considers RFC 6265 section 5.2:
      // ...
      // 3.  If the remaining unparsed-attributes contains a %x3B (";")
      //     character:
      // Consume the characters of the unparsed-attributes up to,
      // not including, the first %x3B (";") character.
      // ...
      stringifiedAttributes += '=' + attributes[attributeName].split(';')[0];
    }

    return (document.cookie =
      key + '=' + converter.write(value, key) + stringifiedAttributes)
  }

  function get (key) {
    if (typeof document === 'undefined' || (arguments.length && !key)) {
      return
    }

    // To prevent the for loop in the first place assign an empty array
    // in case there are no cookies at all.
    var cookies = document.cookie ? document.cookie.split('; ') : [];
    var jar = {};
    for (var i = 0; i < cookies.length; i++) {
      var parts = cookies[i].split('=');
      var value = parts.slice(1).join('=');

      try {
        var foundKey = decodeURIComponent(parts[0]);
        jar[foundKey] = converter.read(value, foundKey);

        if (key === foundKey) {
          break
        }
      } catch (e) {}
    }

    return key ? jar[key] : jar
  }

  return Object.create(
    {
      set: set,
      get: get,
      remove: function (key, attributes) {
        set(
          key,
          '',
          js_cookie_assign({}, attributes, {
            expires: -1
          })
        );
      },
      withAttributes: function (attributes) {
        return init(this.converter, js_cookie_assign({}, this.attributes, attributes))
      },
      withConverter: function (converter) {
        return init(js_cookie_assign({}, this.converter, converter), this.attributes)
      }
    },
    {
      attributes: { value: Object.freeze(defaultAttributes) },
      converter: { value: Object.freeze(converter) }
    }
  )
}

var api = init(defaultConverter, { path: '/' });
/* eslint-enable no-var */

/* harmony default export */ const js_cookie = ((/* unused pure expression or super */ null && (api)));

;// CONCATENATED MODULE: ./src/js/components/header-template/announcement-bar/index.js



class announcement_bar_AnnouncementBar {
  constructor(element, args) {
    this.element = element;
    this.parent = args.parent || null;
    this.transitionDuration = args.transitionDuration || 0.5;
    this.transitionEasing = args.transitionEasing || 'power4.out';
    this.pieces = this.getPieces();
    this.id = $(element).data('id');
    this.cookieName = 'novablocks-announcement-' + this.id + '-disabled';
    this.height = 0;
    const disabled = Cookies.get(this.cookieName);
    const loggedIn = $('body').hasClass('logged-in');

    if (disabled && !loggedIn) {
      $(element).remove();
      return;
    }

    this.onResize();
    GlobalService.registerOnDeouncedResize(this.onResize.bind(this));
    this.timeline.play();
    this.bindEvents();
  }

  onResize() {
    let progress = 0;
    let wasActive = false;
    let wasReversed = false;

    if (typeof this.timeline !== 'undefined') {
      progress = this.timeline.progress();
      wasActive = this.timeline.isActive();
      wasReversed = this.timeline.reversed();
      this.timeline.clear();
      this.timeline.kill();
      this.pieces.wrapper.css('height', '');
    }

    this.timeline = this.getTimeline();
    this.timeline.progress(progress);
    this.timeline.reversed(wasReversed);

    if (wasActive) {
      this.timeline.resume();
    }
  }

  getPieces() {
    const $element = $(this.element);
    return {
      element: $element,
      wrapper: $element.find('.novablocks-announcement-bar__wrapper'),
      content: $element.find('.novablocks-announcement-bar__content'),
      close: $element.find('.novablocks-announcement-bar__close')
    };
  }

  getTimeline() {
    const {
      transitionDuration,
      transitionEasing,
      pieces: {
        element,
        wrapper,
        content,
        close
      }
    } = this;
    const that = this;
    const timeline = gsap.timeline({
      paused: true
    });
    const height = wrapper.outerHeight();
    timeline.fromTo(element, {
      height: 0
    }, {
      duration: transitionDuration,
      height: height,
      ease: transitionEasing
    }, 0);
    timeline.to({
      height: 0
    }, {
      duration: transitionDuration,
      height: height,
      onUpdate: function () {
        const targets = this.targets();

        if (Array.isArray(targets) && targets.length) {
          that.height = targets[0].height;

          if (that.parent) {
            that.parent.update();
          }
        }
      },
      onUpdateParams: ['{self}'],
      ease: transitionEasing
    }, 0);
    return timeline;
  }

  bindEvents() {
    this.pieces.close.on('click', this.onClose.bind(this));
  }

  onClose() {
    if (typeof this.timeline !== 'undefined') {
      this.timeline.reverse();
    }
  }

}
;// CONCATENATED MODULE: ./src/js/components/header-template/promo-bar/index.js

class promo_bar_PromoBar {
  constructor(element, args) {
    const announcementBars = element.querySelectorAll('.novablocks-announcement-bar');
    const announcementElementsArray = Array.from(announcementBars);
    this.element = element;
    this.bars = announcementElementsArray.map(element => new AnnouncementBar(element, {
      parent: this,
      transitionDuration: 0.5,
      transitionEasing: 'power4.inOut'
    }));
    this.height = 0;
    this.onUpdate = args.onUpdate;
    this.offset = args.offset || 0;
    this.update();
  }

  update() {
    let promoBarHeight = 0;
    this.bars.forEach(bar => {
      promoBarHeight += bar.height;
    });
    this.height = promoBarHeight;
    this.element.style.top = `${this.offset}px`;

    if ('function' === typeof this.onUpdate) {
      this.onUpdate(this);
    }
  }

}
;// CONCATENATED MODULE: ./src/js/components/header-template/index.js






const applyPaddingTopToTargets = ($targets, extraPaddingTop) => {
  $targets.each((i, target) => {
    const $target = $(target);
    const paddingTop = getPaddingTop($target);
    $target.css('paddingTop', paddingTop + extraPaddingTop);
  });
};

const getPaddingTop = $element => {
  return parseInt($element.css('paddingTop', '').css('paddingTop'), 10) || 0;
};

class HeaderTemplate {
  constructor() {
    this.adminBar = document.getElementById('wpadminbar');
    this.enableFirstBlockPaddingTop = $('body').hasClass('has-novablocks-header-transparent');
    this.adminBarFixed = false;
    this.promoBarFixed = false;
    this.adminBarHeight = 0;
    this.updateAdminBarProps();
    this.onStickyHeaderResize = debounce(stickyHeaderHeight => {
      document.documentElement.style.setProperty('--theme-sticky-header-height', `${stickyHeaderHeight}px`);
    }, 100);
    this.initializeHeader();
    this.initializePromoBar();
    GlobalService.registerOnDeouncedResize(this.onResize.bind(this));
  }

  onResize() {
    this.updateAdminBarProps();
    this.updatePromoBarProps();

    if (!!this.promoBar) {
      this.promoBar.offset = this.adminBarHeight;
      this.promoBar.update();
    } else {
      this.onPromoBarUpdate();
    }

    if (this?.header?.mobileHeader) {
      this.header.mobileHeader.top = this.adminBarHeight;
    }
  }

  initializeHeader() {
    const header = document.querySelector('.novablocks-header');
    const stickyHeader = document.querySelector('.novablocks-header--sticky');

    if (stickyHeader) {
      const resizeObserver = new ResizeObserver(entries => {
        this.onStickyHeaderResize(stickyHeader.offsetHeight);
      });
      resizeObserver.observe(stickyHeader);
    }

    if (!!header) {
      this.header = new Header(header, {
        onResize: () => {
          requestAnimationFrame(this.onHeaderUpdate.bind(this));
        }
      });
    }
  }

  onHeaderUpdate() {
    if (!this.enableFirstBlockPaddingTop) {
      return false;
    }

    const promoBarHeight = this.promoBar?.height || 0;
    const headerHeight = this.header?.getHeight() || 0;
    const $body = $('body');
    document.documentElement.style.setProperty('--theme-header-height', `${headerHeight}px`);

    if (!$body.is('.has-no-spacing-top')) {
      $body.find('.site-content').css('marginTop', `${promoBarHeight + headerHeight}px`);
    } else {
      const content = document.querySelector('.site-main .hentry');
      const firstBlock = getFirstBlock(content);
      const $firstBlock = $(firstBlock);

      if ($firstBlock.is('.supernova')) {
        const attributes = $firstBlock.data();
        const $header = $firstBlock.find('.nb-collection__header');
        let $targets = $firstBlock;

        if (!$header.length && attributes.imagePadding === 0 && attributes.cardLayout === 'stacked') {
          $targets = $firstBlock.find('.supernova-item__inner-container');

          if (attributes.layoutStyle !== 'carousel') {
            $targets = $targets.first();
          }
        }

        applyPaddingTopToTargets($targets, headerHeight + promoBarHeight);
        return;
      }

      if ($firstBlock.is('.novablocks-hero, .novablocks-slideshow')) {
        const $targets = $firstBlock.find('.novablocks-doppler__foreground');
        applyPaddingTopToTargets($targets, headerHeight + promoBarHeight);
        return;
      }

      applyPaddingTopToTargets($firstBlock, headerHeight + promoBarHeight);
    }
  }

  initializePromoBar() {
    const promoBar = document.querySelector('.promo-bar');

    if (!promoBar) {
      this.onPromoBarUpdate();
      return;
    }

    this.promoBar = new PromoBar(promoBar, {
      offset: this.adminBarHeight,
      onUpdate: this.onPromoBarUpdate.bind(this)
    });
    this.updatePromoBarProps();
  }

  updatePromoBarProps() {
    if (!this.promoBar) {
      return;
    }

    const promoBarStyle = window.getComputedStyle(this.promoBar.element);
    this.promoBarFixed = promoBarStyle.getPropertyValue('position') === 'fixed';
  }

  onPromoBarUpdate() {
    const header = this.header;
    const HeroCollection = this.HeroCollection;
    const promoBarHeight = !!this.promoBar ? this.promoBar.height : 0;
    const adminBarTop = this.adminBarFixed ? this.adminBarHeight : 0;
    const promoBarTop = this.promoBarFixed ? promoBarHeight : 0;
    const stickyDistance = adminBarTop + promoBarTop;
    const staticDistance = this.adminBarHeight + promoBarHeight;
    document.documentElement.style.setProperty('--theme-sticky-distance', `${stickyDistance}px`);

    if (!!header) {
      header.stickyDistance = stickyDistance;
      header.staticDistance = staticDistance;
      header.render(true);
      header.mobileHeader.stickyDistance = stickyDistance;
      header.mobileHeader.staticDistance = staticDistance;
      header.mobileHeader.render(true);
    } //    HeroCollection.forEach( hero => {
    //      hero.offset = promoBarHeight;
    //      hero.updateOnScroll();
    //    } );


    this.onHeaderUpdate();
  }

  updateAdminBarProps() {
    if (!this.adminBar) {
      return;
    }

    this.adminBarHeight = this.adminBar.offsetHeight;
    const adminBarStyle = window.getComputedStyle(this.adminBar);
    this.adminBarFixed = adminBarStyle.getPropertyValue('position') === 'fixed';
  }

}
;// CONCATENATED MODULE: ./src/js/components/app.js








class App {
  constructor() {
    this.initializeHero();
    this.toggleSMLightDarkClasses();
    this.navbar = new Navbar();
    this.searchOverlay = new search_overlay();
    this.initializeImages();
    this.initializeCommentsArea();
    this.initializeReservationForm();
  }

  initializeImages() {
    const showLoadedImages = this.showLoadedImages.bind(this);
    showLoadedImages();
    components_globalService.registerObserverCallback(function (mutationList) {
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

  toggleSMLightDarkClasses() {
    const wrappers = document.querySelectorAll('[class*="sm-palette"]');
    wrappers.forEach(utils_toggleLightClasses);
  }

  initializeReservationForm() {
    components_globalService.registerObserverCallback(function (mutationList) {
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

  showLoadedImages() {
    let container = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : document.body;
    const $images = external_jQuery_default()(container).find('img').not('[srcset], .is-loaded, .is-broken');
    $images.imagesLoaded().progress((instance, image) => {
      const className = image.isLoaded ? 'is-loaded' : 'is-broken';
      external_jQuery_default()(image.img).addClass(className);
    });
  }

  initializeHero() {
    const heroElements = document.getElementsByClassName('novablocks-hero');
    const heroElementsArray = Array.from(heroElements);
    this.HeroCollection = heroElementsArray.map(element => new Hero(element));
    this.firstHero = heroElementsArray[0];
  }

  initializeCommentsArea() {
    const $commentsArea = external_jQuery_default()('.comments-area');

    if ($commentsArea.length) {
      this.commentsArea = new CommentsArea($commentsArea.get(0));
    }
  }

}
;// CONCATENATED MODULE: ./src/js/scripts.js



function initialize() {
  new App();
}

external_jQuery_default()(function () {
  const $window = external_jQuery_default()(window);
  const $html = external_jQuery_default()('html');

  if ($html.is('.wf-active')) {
    initialize();
  } else {
    $window.on('wf-active', initialize);
  }
});
/******/ })()
;