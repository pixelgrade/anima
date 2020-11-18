/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 16);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

module.exports = jQuery;

/***/ }),
/* 1 */
/***/ (function(module, exports) {

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

module.exports = _classCallCheck;

/***/ }),
/* 2 */
/***/ (function(module, exports) {

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

module.exports = _createClass;

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

var arrayWithoutHoles = __webpack_require__(5);

var iterableToArray = __webpack_require__(6);

var nonIterableSpread = __webpack_require__(7);

function _toConsumableArray(arr) {
  return arrayWithoutHoles(arr) || iterableToArray(arr) || nonIterableSpread();
}

module.exports = _toConsumableArray;

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__;/*!
 * JavaScript Cookie v2.2.1
 * https://github.com/js-cookie/js-cookie
 *
 * Copyright 2006, 2015 Klaus Hartl & Fagner Brack
 * Released under the MIT license
 */
;(function (factory) {
	var registeredInModuleLoader;
	if (true) {
		!(__WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.call(exports, __webpack_require__, exports, module)) :
				__WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
		registeredInModuleLoader = true;
	}
	if (true) {
		module.exports = factory();
		registeredInModuleLoader = true;
	}
	if (!registeredInModuleLoader) {
		var OldCookies = window.Cookies;
		var api = window.Cookies = factory();
		api.noConflict = function () {
			window.Cookies = OldCookies;
			return api;
		};
	}
}(function () {
	function extend () {
		var i = 0;
		var result = {};
		for (; i < arguments.length; i++) {
			var attributes = arguments[ i ];
			for (var key in attributes) {
				result[key] = attributes[key];
			}
		}
		return result;
	}

	function decode (s) {
		return s.replace(/(%[0-9A-Z]{2})+/g, decodeURIComponent);
	}

	function init (converter) {
		function api() {}

		function set (key, value, attributes) {
			if (typeof document === 'undefined') {
				return;
			}

			attributes = extend({
				path: '/'
			}, api.defaults, attributes);

			if (typeof attributes.expires === 'number') {
				attributes.expires = new Date(new Date() * 1 + attributes.expires * 864e+5);
			}

			// We're using "expires" because "max-age" is not supported by IE
			attributes.expires = attributes.expires ? attributes.expires.toUTCString() : '';

			try {
				var result = JSON.stringify(value);
				if (/^[\{\[]/.test(result)) {
					value = result;
				}
			} catch (e) {}

			value = converter.write ?
				converter.write(value, key) :
				encodeURIComponent(String(value))
					.replace(/%(23|24|26|2B|3A|3C|3E|3D|2F|3F|40|5B|5D|5E|60|7B|7D|7C)/g, decodeURIComponent);

			key = encodeURIComponent(String(key))
				.replace(/%(23|24|26|2B|5E|60|7C)/g, decodeURIComponent)
				.replace(/[\(\)]/g, escape);

			var stringifiedAttributes = '';
			for (var attributeName in attributes) {
				if (!attributes[attributeName]) {
					continue;
				}
				stringifiedAttributes += '; ' + attributeName;
				if (attributes[attributeName] === true) {
					continue;
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

			return (document.cookie = key + '=' + value + stringifiedAttributes);
		}

		function get (key, json) {
			if (typeof document === 'undefined') {
				return;
			}

			var jar = {};
			// To prevent the for loop in the first place assign an empty array
			// in case there are no cookies at all.
			var cookies = document.cookie ? document.cookie.split('; ') : [];
			var i = 0;

			for (; i < cookies.length; i++) {
				var parts = cookies[i].split('=');
				var cookie = parts.slice(1).join('=');

				if (!json && cookie.charAt(0) === '"') {
					cookie = cookie.slice(1, -1);
				}

				try {
					var name = decode(parts[0]);
					cookie = (converter.read || converter)(cookie, name) ||
						decode(cookie);

					if (json) {
						try {
							cookie = JSON.parse(cookie);
						} catch (e) {}
					}

					jar[name] = cookie;

					if (key === name) {
						break;
					}
				} catch (e) {}
			}

			return key ? jar[key] : jar;
		}

		api.set = set;
		api.get = function (key) {
			return get(key, false /* read as raw */);
		};
		api.getJSON = function (key) {
			return get(key, true /* read as json */);
		};
		api.remove = function (key, attributes) {
			set(key, '', extend(attributes, {
				expires: -1
			}));
		};

		api.defaults = {};

		api.withConverter = init;

		return api;
	}

	return init(function () {});
}));


/***/ }),
/* 5 */
/***/ (function(module, exports) {

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) {
      arr2[i] = arr[i];
    }

    return arr2;
  }
}

module.exports = _arrayWithoutHoles;

/***/ }),
/* 6 */
/***/ (function(module, exports) {

function _iterableToArray(iter) {
  if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter);
}

module.exports = _iterableToArray;

/***/ }),
/* 7 */
/***/ (function(module, exports) {

function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance");
}

module.exports = _nonIterableSpread;

/***/ }),
/* 8 */,
/* 9 */,
/* 10 */,
/* 11 */,
/* 12 */,
/* 13 */,
/* 14 */,
/* 15 */,
/* 16 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);

// EXTERNAL MODULE: external "jQuery"
var external_jQuery_ = __webpack_require__(0);
var external_jQuery_default = /*#__PURE__*/__webpack_require__.n(external_jQuery_);

// EXTERNAL MODULE: ./node_modules/@babel/runtime/helpers/classCallCheck.js
var classCallCheck = __webpack_require__(1);
var classCallCheck_default = /*#__PURE__*/__webpack_require__.n(classCallCheck);

// EXTERNAL MODULE: ./node_modules/@babel/runtime/helpers/createClass.js
var createClass = __webpack_require__(2);
var createClass_default = /*#__PURE__*/__webpack_require__.n(createClass);

// CONCATENATED MODULE: ./src/js/utils.js
 // checks if box1 and box2 overlap

function overlapping(box1, box2) {
  var overlappingX = box1.left + box1.width >= box2.left && box2.left + box2.width >= box1.left;
  var overlappingY = box1.top + box1.height >= box2.top && box2.top + box2.height >= box1.top;
  return overlappingX && overlappingY;
} // chechks if box1 is completely inside box2

function inside(box1, box2) {
  var insideX = box1.left >= box2.left && box1.left + box1.width <= box2.left + box2.width;
  var insideY = box1.top >= box2.top && box1.top + box1.height <= box2.top + box2.height;
  return insideX && insideY;
} // chechks if box1 is completely inside box2

function insideHalf(box1, box2) {
  var insideX = box1.left + box1.width / 2 >= box2.left && box2.left + box2.width >= box1.left + box1.width / 2;
  var insideY = box1.top + box1.height / 2 >= box2.top && box2.top + box2.height >= box1.top + box1.height / 2;
  return insideX && insideY;
}
var debounce = function debounce(func, wait) {
  var timeout = null;
  return function () {
    var context = this;
    var args = arguments;

    var later = function later() {
      func.apply(context, args);
    };

    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};
var hasTouchScreen = function hasTouchScreen() {
  var hasTouchScreen = false;

  if ("maxTouchPoints" in navigator) {
    hasTouchScreen = navigator.maxTouchPoints > 0;
  } else if ("msMaxTouchPoints" in navigator) {
    hasTouchScreen = navigator.msMaxTouchPoints > 0;
  } else {
    var mQ = window.matchMedia && matchMedia("(pointer:coarse)");

    if (mQ && mQ.media === "(pointer:coarse)") {
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
var mq = function mq(direction, string) {
  var $temp = jQuery('<div class="u-mq-' + direction + '-' + string + '">').appendTo('body'),
      response = $temp.is(':visible');
  $temp.remove();
  return response;
};
var below = function below(string) {
  return mq('below', string);
};
var above = function above(string) {
  return mq('above', string);
};
function setAndResetElementStyles($element) {
  var props = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  Object.keys(props).forEach(function (key) {
    props[key] = '';
  });

  if (window.requestIdleCallback) {
    window.requestIdleCallback(function () {
      $element.css(props);
    });
  } else {
    setTimeout(function () {
      $element.css(props);
    }, 0);
  }
}
// EXTERNAL MODULE: ./node_modules/@babel/runtime/helpers/toConsumableArray.js
var toConsumableArray = __webpack_require__(3);
var toConsumableArray_default = /*#__PURE__*/__webpack_require__.n(toConsumableArray);

// CONCATENATED MODULE: ./src/js/components/globalService.js






var globalService_GlobalService =
/*#__PURE__*/
function () {
  function GlobalService() {
    classCallCheck_default()(this, GlobalService);

    this.props = {};
    this.newProps = {};
    this.renderCallbacks = [];
    this.resizeCallbacks = [];
    this.observeCallbacks = [];
    this.scrollCallbacks = [];
    this.currentMutationList = [];
    this.frameRendered = true;
    this.useOrientation = hasTouchScreen() && 'orientation' in window;

    this._init();
  }

  createClass_default()(GlobalService, [{
    key: "_init",
    value: function _init() {
      var $window = external_jQuery_default()(window);

      var updateProps = this._updateProps.bind(this);

      var renderLoop = this._renderLoop.bind(this);

      updateProps();
      external_jQuery_default()(updateProps);

      this._bindOnResize();

      this._bindOnScroll();

      this._bindOnLoad();

      this._bindObserver();

      this._bindCustomizer();

      requestAnimationFrame(renderLoop);
    }
  }, {
    key: "_bindOnResize",
    value: function _bindOnResize() {
      var $window = external_jQuery_default()(window);

      var updateProps = this._updateProps.bind(this);

      if (this.useOrientation) {
        $window.on('orientationchange', function () {
          $window.one('resize', updateProps);
        });
      } else {
        $window.on('resize', updateProps);
      }
    }
  }, {
    key: "_bindOnScroll",
    value: function _bindOnScroll() {
      external_jQuery_default()(window).on('scroll', this._updateScroll.bind(this));
    }
  }, {
    key: "_bindOnLoad",
    value: function _bindOnLoad() {
      external_jQuery_default()(window).on('load', this._updateProps.bind(this));
    }
  }, {
    key: "_bindObserver",
    value: function _bindObserver() {
      var self = this;

      var observeCallback = this._observeCallback.bind(this);

      var observeAndUpdateProps = function observeAndUpdateProps() {
        observeCallback();
        self.currentMutationList = [];
      };

      var debouncedObserveCallback = debounce(observeAndUpdateProps, 300);

      if (!window.MutationObserver) {
        return;
      }

      var observer = new MutationObserver(function (mutationList) {
        self.currentMutationList = self.currentMutationList.concat(mutationList);
        debouncedObserveCallback();
      });
      observer.observe(document.body, {
        childList: true,
        subtree: true
      });
    }
  }, {
    key: "_bindCustomizer",
    value: function _bindCustomizer() {
      if (typeof wp !== "undefined" && typeof wp.customize !== "undefined") {
        if (typeof wp.customize.selectiveRefresh !== "undefined") {
          wp.customize.selectiveRefresh.bind('partial-content-rendered', this._updateProps.bind(this));
        }

        wp.customize.bind('change', this._updateProps.bind(this));
      }
    }
  }, {
    key: "_updateProps",
    value: function _updateProps() {
      var force = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

      this._updateSize(force);

      this._updateScroll(force);
    }
  }, {
    key: "_observeCallback",
    value: function _observeCallback() {
      var mutationList = this.currentMutationList;
      external_jQuery_default.a.each(this.observeCallbacks, function (i, fn) {
        fn(mutationList);
      });
    }
  }, {
    key: "_renderLoop",
    value: function _renderLoop() {
      if (!this.frameRendered) {
        this._renderCallback();

        this.frameRendered = true;
      }

      window.requestAnimationFrame(this._renderLoop.bind(this));
    }
  }, {
    key: "_renderCallback",
    value: function _renderCallback() {
      var passedArguments = arguments;
      external_jQuery_default.a.each(this.renderCallbacks, function (i, fn) {
        fn.apply(void 0, toConsumableArray_default()(passedArguments));
      });
    }
  }, {
    key: "_resizeCallback",
    value: function _resizeCallback() {
      var passedArguments = arguments;
      external_jQuery_default.a.each(this.resizeCallbacks, function (i, fn) {
        fn.apply(void 0, toConsumableArray_default()(passedArguments));
      });
    }
  }, {
    key: "_scrollCallback",
    value: function _scrollCallback() {
      var passedArguments = arguments;
      external_jQuery_default.a.each(this.scrollCallbacks, function (i, fn) {
        fn.apply(void 0, toConsumableArray_default()(passedArguments));
      });
    }
  }, {
    key: "_updateScroll",
    value: function _updateScroll() {
      var force = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
      this.newProps = Object.assign({}, this.newProps, {
        scrollY: window.pageYOffset,
        scrollX: window.pageXOffset
      });

      this._shouldUpdate(this._scrollCallback.bind(this));
    }
  }, {
    key: "_updateSize",
    value: function _updateSize() {
      var force = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
      var body = document.body;
      var html = document.documentElement;
      var bodyScrollHeight = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight);
      var htmlScrollHeight = Math.max(html.scrollHeight, html.offsetHeight);
      this.newProps = Object.assign({}, this.newProps, {
        scrollHeight: Math.max(bodyScrollHeight, htmlScrollHeight),
        adminBarHeight: this.getAdminBarHeight(),
        windowWidth: this.useOrientation && window.screen && window.screen.availWidth || window.innerWidth,
        windowHeight: this.useOrientation && window.screen && window.screen.availHeight || window.innerHeight
      });

      this._shouldUpdate(this._resizeCallback.bind(this));
    }
  }, {
    key: "_shouldUpdate",
    value: function _shouldUpdate(callback) {
      var force = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

      if (this._hasNewProps() || force) {
        this.props = Object.assign({}, this.props, this.newProps);
        this.newProps = {};
        this.frameRendered = false;

        if (typeof callback === "function") {
          callback();
        }
      }
    }
  }, {
    key: "_hasNewProps",
    value: function _hasNewProps() {
      var _this = this;

      return Object.keys(this.newProps).some(function (key) {
        return _this.newProps[key] !== _this.props[key];
      });
    }
  }, {
    key: "getAdminBarHeight",
    value: function getAdminBarHeight() {
      var adminBar = document.getElementById('wpadminbar');

      if (adminBar) {
        var box = adminBar.getBoundingClientRect();
        return box.height;
      }

      return 0;
    }
  }, {
    key: "registerOnResize",
    value: function registerOnResize(fn) {
      if (typeof fn === "function" && this.resizeCallbacks.indexOf(fn) < 0) {
        this.resizeCallbacks.push(fn);
      }
    }
  }, {
    key: "registerOnScroll",
    value: function registerOnScroll(fn) {
      if (typeof fn === "function" && this.scrollCallbacks.indexOf(fn) < 0) {
        this.scrollCallbacks.push(fn);
      }
    }
  }, {
    key: "registerObserverCallback",
    value: function registerObserverCallback(fn) {
      if (typeof fn === "function" && this.observeCallbacks.indexOf(fn) < 0) {
        this.observeCallbacks.push(fn);
      }
    }
  }, {
    key: "registerRender",
    value: function registerRender(fn) {
      if (typeof fn === "function" && this.renderCallbacks.indexOf(fn) < 0) {
        this.renderCallbacks.push(fn);
      }
    }
  }, {
    key: "getProps",
    value: function getProps() {
      return this.props;
    }
  }]);

  return GlobalService;
}();

/* harmony default export */ var globalService = (new globalService_GlobalService());
// CONCATENATED MODULE: ./src/js/components/hero.js





var hero_Hero =
/*#__PURE__*/
function () {
  function Hero(element) {
    var _this = this;

    classCallCheck_default()(this, Hero);

    this.element = element;
    this.progress = 0;
    this.timeline = new TimelineMax({
      paused: true,
      onComplete: function onComplete() {
        _this.paused = true;
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

  createClass_default()(Hero, [{
    key: "init",
    value: function init() {
      var _this2 = this;

      globalService.registerOnScroll(function () {
        _this2.update();
      });
      globalService.registerRender(function () {
        _this2.updateOnScroll();
      });
      var mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      mediaQuery.addListener(function () {
        _this2.reduceMotion = mediaQuery.matches;

        _this2.updateOnScroll();
      });
      this.reduceMotion = mediaQuery.matches;
      this.addIntroToTimeline();
      this.timeline.addLabel('middle');
      this.addOutroToTimeline();
      this.timeline.addLabel('end');
      this.pauseTimelineOnScroll();

      if (this.reduceMotion) {
        var middleTime = this.timeline.getLabelTime('middle');
        var endTime = this.timeline.getLabelTime('end');
        var minTlProgress = middleTime / endTime;
        this.paused = true;
        this.timeline.progress(minTlProgress);
      } else {
        this.timeline.play();
      }
    }
  }, {
    key: "update",
    value: function update() {
      var _GlobalService$getPro = globalService.getProps(),
          scrollY = _GlobalService$getPro.scrollY;

      this.box = this.element.getBoundingClientRect();
      this.view = {
        left: this.box.left,
        top: this.box.top + scrollY,
        width: this.box.width,
        height: this.box.height
      };
    }
  }, {
    key: "updateOnScroll",
    value: function updateOnScroll() {
      var _GlobalService$getPro2 = globalService.getProps(),
          scrollY = _GlobalService$getPro2.scrollY,
          scrollHeight = _GlobalService$getPro2.scrollHeight,
          windowHeight = _GlobalService$getPro2.windowHeight; // used to calculate animation progress


      var length = windowHeight * 0.5;
      var middleMin = 0;
      var middleMax = scrollHeight - windowHeight - length * 0.5;
      var middle = this.view.top + (this.box.height - windowHeight) * 0.5;
      var middleMid = Math.max(middleMin, Math.min(middle, middleMax));
      this.start = middleMid - length * 0.5;
      this.end = this.start + length;
      this.progress = (scrollY - this.start) / (this.end - this.start);

      if (this.reduceMotion) {
        var middleTime = this.timeline.getLabelTime('middle');
        var endTime = this.timeline.getLabelTime('end');
        var minTlProgress = middleTime / endTime;
        this.progress = minTlProgress;
      }

      this.updateTimelineOnScroll();
    }
  }, {
    key: "updateTimelineOnScroll",
    value: function updateTimelineOnScroll() {
      if (!this.paused) {
        return;
      }

      var currentProgress = this.timeline.progress();
      var middleTime = this.timeline.getLabelTime('middle');
      var endTime = this.timeline.getLabelTime('end');
      var minTlProgress = middleTime / endTime;
      var newTlProgress = (this.progress - 0.5) * 2 * (1 - minTlProgress) + minTlProgress;
      newTlProgress = Math.min(Math.max(minTlProgress, newTlProgress), 1);

      if (currentProgress === newTlProgress) {
        return;
      }

      this.timeline.progress(newTlProgress);
    }
  }, {
    key: "getMarkupPieces",
    value: function getMarkupPieces() {
      var container = jQuery(this.element).find('.novablocks-hero__inner-container');
      var headline = container.children().filter('.c-headline').first();
      var title = headline.find('.c-headline__primary');
      var subtitle = headline.find('.c-headline__secondary');
      var separator = headline.next('.wp-block-separator');
      var sepFlower = separator.find('.c-separator__symbol');
      var sepLine = separator.find('.c-separator__line');
      var sepArrow = separator.find('.c-separator__arrow');
      var othersBefore = headline.prevAll();
      var othersAfter = headline.length ? headline.nextAll().not(separator) : container.children();
      return {
        headline: headline,
        title: title,
        subtitle: subtitle,
        separator: separator,
        sepFlower: sepFlower,
        sepLine: sepLine,
        sepArrow: sepArrow,
        othersBefore: othersBefore,
        othersAfter: othersAfter
      };
    }
  }, {
    key: "addIntroToTimeline",
    value: function addIntroToTimeline() {
      var timeline = this.timeline;

      var _GlobalService$getPro3 = globalService.getProps(),
          windowWidth = _GlobalService$getPro3.windowWidth;

      var _this$pieces = this.pieces,
          headline = _this$pieces.headline,
          title = _this$pieces.title,
          subtitle = _this$pieces.subtitle,
          separator = _this$pieces.separator,
          sepFlower = _this$pieces.sepFlower,
          sepLine = _this$pieces.sepLine,
          sepArrow = _this$pieces.sepArrow,
          othersBefore = _this$pieces.othersBefore,
          othersAfter = _this$pieces.othersAfter;

      if (title.length && title.text().trim().length) {
        this.splitTitle = new SplitText(title, {
          wordsClass: 'c-headline__word'
        });
        this.splitTitle.lines.forEach(function (line) {
          var words = Array.from(line.children);
          var letters = [];
          words.forEach(function (word) {
            letters.push.apply(letters, toConsumableArray_default()(word.children));
          });
          letters.forEach(function (letter) {
            var box = letter.getBoundingClientRect();
            var width = letter.offsetWidth;
            var offset = box.x - windowWidth / 2;
            var offsetPercent = 2 * offset / windowWidth;
            var move = 400 * letters.length * offsetPercent;
            timeline.from(letter, 0.72, {
              x: move,
              ease: Expo.easeOut
            }, 0);
          });
        });
        timeline.fromTo(title, 0.89, {
          opacity: 0
        }, {
          opacity: 1,
          ease: Expo.easeOut
        }, 0); // aici era title dar facea un glitch ciudat

        timeline.fromTo(headline, 1, {
          'y': 30
        }, {
          'y': 0,
          ease: Expo.easeOut
        }, 0);
      }

      if (subtitle.length) {
        timeline.fromTo(subtitle, 0.65, {
          opacity: 0
        }, {
          opacity: 1,
          ease: Quint.easeOut
        }, '-=0.65');
        timeline.fromTo(subtitle, 0.9, {
          y: 30
        }, {
          y: 0,
          ease: Quint.easeOut
        }, '-=0.65');
      }

      if (separator.length) {
        if (sepFlower.length) {
          timeline.fromTo(sepFlower, 0.15, {
            opacity: 0
          }, {
            opacity: 1,
            ease: Quint.easeOut
          }, '-=0.6');
          timeline.fromTo(sepFlower, 0.55, {
            rotation: -270
          }, {
            rotation: 0,
            ease: Back.easeOut
          }, '-=0.5');
        }

        if (sepLine.length) {
          timeline.fromTo(sepLine, 0.6, {
            width: 0
          }, {
            width: '42%',
            opacity: 1,
            ease: Quint.easeOut
          }, '-=0.55');
          timeline.fromTo(separator, 0.6, {
            width: 0
          }, {
            width: '100%',
            opacity: 1,
            ease: Quint.easeOut
          }, '-=0.6');
        }

        if (sepArrow.length) {
          timeline.fromTo(sepArrow, 0.2, {
            opacity: 0
          }, {
            opacity: 1,
            ease: Quint.easeOut
          }, '-=0.27');
        }
      }

      if (othersAfter.length) {
        timeline.fromTo(othersAfter, 0.5, {
          opacity: 0
        }, {
          opacity: 1,
          ease: Quint.easeOut
        }, '-=0.28');
        timeline.fromTo(othersAfter, 0.75, {
          y: -20
        }, {
          y: 0
        }, '-=0.5');
      }

      if (othersBefore.length) {
        timeline.fromTo(othersBefore, 0.5, {
          opacity: 0
        }, {
          opacity: 1,
          ease: Quint.easeOut
        }, '-=0.75');
        timeline.fromTo(othersBefore, 0.75, {
          y: 20
        }, {
          y: 0
        }, '-=0.75');
      }

      this.timeline = timeline;
    }
  }, {
    key: "addOutroToTimeline",
    value: function addOutroToTimeline() {
      var _this$pieces2 = this.pieces,
          title = _this$pieces2.title,
          subtitle = _this$pieces2.subtitle,
          othersBefore = _this$pieces2.othersBefore,
          othersAfter = _this$pieces2.othersAfter,
          separator = _this$pieces2.separator,
          sepLine = _this$pieces2.sepLine,
          sepFlower = _this$pieces2.sepFlower,
          sepArrow = _this$pieces2.sepArrow;
      var timeline = this.timeline;
      timeline.fromTo(title, 1.08, {
        y: 0
      }, {
        opacity: 0,
        y: -60,
        ease: Quad.easeIn
      }, 'middle');
      timeline.to(subtitle, 1.08, {
        opacity: 0,
        y: -90,
        ease: Quad.easeIn
      }, 'middle');
      timeline.to(othersBefore, 1.08, {
        y: 60,
        opacity: 0,
        ease: Quad.easeIn
      }, 'middle');
      timeline.to(othersAfter, 1.08, {
        y: 60,
        opacity: 0,
        ease: Quad.easeIn
      }, 'middle');
      timeline.to(sepLine, 0.86, {
        width: '0%',
        opacity: 0,
        ease: Quad.easeIn
      }, '-=0.94');
      timeline.to(separator, 0.86, {
        width: '0%',
        opacity: 0,
        ease: Quad.easeIn
      }, '-=0.86');
      timeline.to(sepFlower, 1, {
        rotation: 180
      }, '-=1.08');
      timeline.to(sepFlower, 0.11, {
        opacity: 0
      }, '-=0.03');
      timeline.to(sepArrow, 0.14, {
        opacity: 0
      }, '-=1.08');
      this.timeline = timeline;
    }
  }, {
    key: "revertTitle",
    value: function revertTitle() {
      if (typeof this.splitTitle !== "undefined") {
        this.splitTitle.revert();
      }
    }
  }, {
    key: "pauseTimelineOnScroll",
    value: function pauseTimelineOnScroll() {
      var _this3 = this;

      var middleTime = this.timeline.getLabelTime('middle');
      var endTime = this.timeline.getLabelTime('end');
      this.timeline.eventCallback('onUpdate', function (tl) {
        var time = tl.time(); // calculate the current timeline progress relative to middle and end labels
        // in such a way that timelineProgress is 0.5 for middle and 1 for end
        // because we don't want the animation to be stopped before the middle label

        var tlProgress = (time - middleTime) / (endTime - middleTime);
        var pastMiddle = time > middleTime;
        var pastScroll = tlProgress * 0.5 + 0.5 >= _this3.progress;

        if (pastMiddle && pastScroll) {
          tl.pause();

          _this3.revertTitle();

          _this3.timeline.eventCallback('onUpdate', null);

          _this3.paused = true;
        }
      }, ["{self}"]);
    }
  }]);

  return Hero;
}();


// CONCATENATED MODULE: ./src/js/components/commentsArea.js




var commentsArea_CommentsArea =
/*#__PURE__*/
function () {
  function CommentsArea(element) {
    classCallCheck_default()(this, CommentsArea);

    this.$element = external_jQuery_default()(element);
    this.$checkbox = this.$element.find('.c-comments-toggle__checkbox');
    this.$content = this.$element.find('.comments-area__content');
    this.$contentWrap = this.$element.find('.comments-area__wrap'); // overwrite CSS that hides the comments area content

    this.$contentWrap.css('display', 'block');
    this.$checkbox.on('change', this.onChange.bind(this));
    this.checkWindowLocationComments();
  }

  createClass_default()(CommentsArea, [{
    key: "onChange",
    value: function onChange() {
      this.toggle(false);
    }
  }, {
    key: "toggle",
    value: function toggle() {
      var instant = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
      var $contentWrap = this.$contentWrap;
      var isChecked = this.$checkbox.prop('checked');
      var newHeight = isChecked ? this.$content.outerHeight() : 0;

      if (instant) {
        $contentWrap.css('height', newHeight);
      } else {
        TweenMax.to($contentWrap, .4, {
          height: newHeight,
          onComplete: function onComplete() {
            if (isChecked) {
              $contentWrap.css('height', '');
            }
          }
        });
      }
    }
  }, {
    key: "checkWindowLocationComments",
    value: function checkWindowLocationComments() {
      if (window.location.href.indexOf('#comment') === -1) {
        this.$checkbox.prop('checked', false);
        this.toggle(true);
      }
    }
  }]);

  return CommentsArea;
}();


// CONCATENATED MODULE: ./src/js/components/header.js





var defaults = {
  offsetTargetElement: null
};
var NAVIGATION_OPEN_CLASS = 'navigation-is-open';

var header_Header =
/*#__PURE__*/
function () {
  function Header(element, args) {
    classCallCheck_default()(this, Header);

    if (!element) return;
    this.element = element;
    this.options = Object.assign({}, defaults, args);
    this.$header = external_jQuery_default()(this.element);
    this.$toggle = external_jQuery_default()('.c-menu-toggle');
    this.$toggleWrap = external_jQuery_default()('.c-menu-toggle__wrap');
    this.$searchCancelButton = external_jQuery_default()('.c-search-overlay__cancel');
    this.$colorSchemeSwitcher = external_jQuery_default()('.is-color-scheme-switcher-button');
    this.$searchOverlay = external_jQuery_default()('.c-search-overlay');
    this.scrolled = false;
    this.inversed = false;
    this.abovePromoBar = false;
    this.wasSticky = external_jQuery_default()('body').is('.has-site-header-fixed');
    this.offset = 0;
    this.scrollOffset = 0;
    this.mobileHeaderHeight = 0;
    this.promoBarHeight = 0;
    this.$page = external_jQuery_default()('#page .site-content');
    this.$hero = external_jQuery_default()('.has-hero .novablocks-hero').first().find('.novablocks-hero__foreground');
    this.$promoBar = external_jQuery_default()('.novablocks-announcement-bar');
    this.createMobileHeader();
    this.onResize();
    this.render();
    globalService.registerOnResize(this.onResize.bind(this));
    this.initialize();
  }

  createClass_default()(Header, [{
    key: "initialize",
    value: function initialize() {
      this.timeline = this.getInroTimeline();
      external_jQuery_default()('.site-header__wrapper').css('transition', 'none');
      this.$header.addClass('site-header--fixed site-header--ready');
      this.$mobileHeader.addClass('site-header--fixed site-header--ready');
      this.initToggleClick();
      this.timeline.play();
    }
  }, {
    key: "update",
    value: function update() {
      this.updatePageOffset();
      this.updateHeaderOffset();
      this.updateMobileHeaderOffset();
      this.updateHeaderButtonsHeight();
      this.updateSearchOverlayOffset();
    }
  }, {
    key: "getInroTimeline",
    value: function getInroTimeline() {
      var element = this.element;
      var timeline = new TimelineMax({
        paused: true
      });
      var height = external_jQuery_default()(element).outerHeight();
      var transitionEasing = Power4.easeInOut;
      var transitionDuration = 0.5;
      timeline.to(element, transitionDuration, {
        opacity: 1,
        ease: transitionEasing
      }, 0);
      timeline.to({
        height: 0
      }, transitionDuration, {
        height: height,
        onUpdate: this.onHeightUpdate.bind(this),
        onUpdateParams: ["{self}"],
        onComplete: function onComplete() {
          external_jQuery_default()('.site-header__wrapper').css('transition', '');
        },
        ease: transitionEasing
      }, 0);
      return timeline;
    }
  }, {
    key: "onHeightUpdate",
    value: function onHeightUpdate(tween) {
      this.getProps();
      this.box = Object.assign(this.box, {
        height: tween.target.height
      });
      this.setVisibleHeaderHeight();
      this.update();
    }
  }, {
    key: "getMobileHeaderHeight",
    value: function getMobileHeaderHeight() {
      var mobileHeaderHeight = this.$mobileHeader.css('height', '').outerHeight();
      var toggleHeight = this.$toggleWrap.css('height', '').outerHeight();
      return Math.max(mobileHeaderHeight, toggleHeight);
    }
  }, {
    key: "isMobileHeaderVisibile",
    value: function isMobileHeaderVisibile() {
      return this.$mobileHeader.is(':visible');
    }
  }, {
    key: "setVisibleHeaderHeight",
    value: function setVisibleHeaderHeight() {
      this.visibleHeaderHeight = this.isMobileHeaderVisibile() ? this.mobileHeaderHeight : this.box.height;
    }
  }, {
    key: "getProps",
    value: function getProps() {
      this.box = this.element.getBoundingClientRect();
      this.scrollOffset = this.getScrollOffset();
      this.mobileHeaderHeight = this.getMobileHeaderHeight();

      if (this.$promoBar.length) {
        this.promoBarHeight = this.$promoBar.outerHeight();
      }
    }
  }, {
    key: "onResize",
    value: function onResize() {
      var $header = external_jQuery_default()(this.element);
      var wasScrolled = $header.hasClass('site-header--scrolled');
      setAndResetElementStyles($header, {
        transition: 'none'
      });
      setAndResetElementStyles(this.$searchOverlay, {
        transition: 'none'
      });
      $header.removeClass('site-header--scrolled');
      this.getProps();
      this.setVisibleHeaderHeight();
      this.shouldMakeHeaderStatic();
      $header.toggleClass('site-header--scrolled', wasScrolled);
      this.initHeaderButtons();

      if (!this.hasMobileNav()) {
        external_jQuery_default()('body').removeClass(NAVIGATION_OPEN_CLASS);
      }

      this.update();
    }
  }, {
    key: "shouldMakeHeaderStatic",
    value: function shouldMakeHeaderStatic() {
      var $body = external_jQuery_default()('body');

      var _GlobalService$getPro = globalService.getProps(),
          windowHeight = _GlobalService$getPro.windowHeight;

      if (this.wasSticky) {
        $body.toggleClass('has-site-header-fixed', this.visibleHeaderHeight < windowHeight * 0.2);
      }
    }
  }, {
    key: "updateHeaderOffset",
    value: function updateHeaderOffset() {
      if (!this.element) return;
      this.element.style.marginTop = this.offset + 'px';
    }
  }, {
    key: "updateMobileHeaderOffset",
    value: function updateMobileHeaderOffset() {
      if (!this.$mobileHeader) return;
      this.$mobileHeader.css({
        height: this.mobileHeaderHeight
      });
      TweenMax.to(this.$mobileHeader, .2, {
        y: this.offset
      });
      external_jQuery_default()('.site-header__inner-container').css({
        transform: "translateY(".concat(this.mobileHeaderHeight, "px)")
      });
      this.$toggleWrap.css({
        height: this.mobileHeaderHeight
      });
      TweenMax.to(this.$toggleWrap, .2, {
        y: this.offset
      });
    }
  }, {
    key: "getScrollOffset",
    value: function getScrollOffset() {
      var _GlobalService$getPro2 = globalService.getProps(),
          adminBarHeight = _GlobalService$getPro2.adminBarHeight,
          scrollY = _GlobalService$getPro2.scrollY;

      var offsetTargetElement = this.options.offsetTargetElement;

      if (offsetTargetElement) {
        var offsetTargetBox = offsetTargetElement.getBoundingClientRect();
        var targetBottom = offsetTargetBox.top + scrollY + offsetTargetBox.height;
        var headerOffset = adminBarHeight + this.offset + this.box.height / 2;
        return targetBottom - headerOffset;
      }

      return 0;
    }
  }, {
    key: "updatePageOffset",
    value: function updatePageOffset() {
      TweenMax.set(this.$page, {
        css: {
          marginTop: this.visibleHeaderHeight + this.offset
        }
      });
    }
  }, {
    key: "updateMobileNavigationOffset",
    value: function updateMobileNavigationOffset() {
      var _GlobalService$getPro3 = globalService.getProps(),
          scrollY = _GlobalService$getPro3.scrollY;

      if (this.hasMobileNav()) {
        this.element.style.marginTop = Math.max(this.promoBarHeight - scrollY, 0) + 'px';
      }
    }
  }, {
    key: "updateMobileHeaderState",
    value: function updateMobileHeaderState() {
      var _GlobalService$getPro4 = globalService.getProps(),
          scrollY = _GlobalService$getPro4.scrollY;

      var abovePromoBar = scrollY > this.promoBarHeight;

      if (abovePromoBar !== this.abovePromoBar) {
        external_jQuery_default()(body).toggleClass('site-header-mobile--scrolled', abovePromoBar);
        this.abovePromoBar = abovePromoBar;
      }
    }
  }, {
    key: "updateDesktopHeaderState",
    value: function updateDesktopHeaderState(inversed) {
      var _GlobalService$getPro5 = globalService.getProps(),
          scrollY = _GlobalService$getPro5.scrollY;

      var scrolled = scrollY > this.scrollOffset;

      if (inversed !== this.inversed) {
        this.$header.toggleClass('site-header--normal', !inversed);
        this.inversed = inversed;
      }

      if (scrolled !== this.scrolled) {
        this.$header.toggleClass('site-header--scrolled', scrolled);
        this.scrolled = scrolled;
      }
    }
  }, {
    key: "createMobileHeader",
    value: function createMobileHeader() {
      if (this.createdMobileHeader) return;
      var $mobileHeader = external_jQuery_default()('.site-header--mobile');

      if ($mobileHeader.length) {
        this.$mobileHeader = $mobileHeader;
        this.createdMobileHeader = true;
        return;
      }

      this.$mobileHeader = external_jQuery_default()('<div class="site-header--mobile">');
      external_jQuery_default()('.c-branding').first().clone().appendTo(this.$mobileHeader);
      external_jQuery_default()('.menu-item--cart').first().clone().appendTo(this.$mobileHeader);
      this.$mobileHeader.insertAfter(this.$toggle);
      this.createdMobileHeader = true;
    }
  }, {
    key: "initHeaderButtons",
    value: function initHeaderButtons() {
      if (this.hasMobileNav()) {
        this.initHeaderSearchButton();
        this.initHeaderLightsButton();
      }
    }
  }, {
    key: "initHeaderSearchButton",
    value: function initHeaderSearchButton() {
      if (this.movedSearchButton) {
        return;
      }

      this.$searchButtonWrapper = external_jQuery_default()('<div class="search-button__wrapper">');
      external_jQuery_default()('.is-search-button').first().clone().appendTo(this.$searchButtonWrapper);
      this.$searchButtonWrapper.insertAfter('.site-header__wrapper');
      this.movedSearchButton = true;
    }
  }, {
    key: "initHeaderLightsButton",
    value: function initHeaderLightsButton() {
      if (this.movedColorSchemeSwitcherButton) {
        return;
      }

      this.$colorSchemeSwitcherWrapper = external_jQuery_default()('<div class="scheme-switcher__wrapper">');
      external_jQuery_default()('.is-color-scheme-switcher-button').first().clone().appendTo(this.$colorSchemeSwitcherWrapper);
      this.$colorSchemeSwitcherWrapper.insertAfter('.site-header__wrapper');
      this.movedColorSchemeSwitcherButton = true;
    }
  }, {
    key: "updateHeaderButtonsHeight",
    value: function updateHeaderButtonsHeight() {
      var $searchButtonWrapper = external_jQuery_default()('.search-button__wrapper');
      var $lightsButtonWrapper = external_jQuery_default()(' .scheme-switcher__wrapper');
      var $buttons = this.$searchCancelButton.add($searchButtonWrapper, this.$colorSchemeSwitcher, $lightsButtonWrapper);
      $buttons.css('height', '');

      if (!this.hasMobileNav()) {
        return;
      }

      $buttons.css('height', this.mobileHeaderHeight);
    }
  }, {
    key: "updateSearchOverlayOffset",
    value: function updateSearchOverlayOffset() {
      if (this.hasMobileNav() && this.$searchOverlay.length) {
        this.$searchOverlay[0].paddingTop = Math.max(this.promoBarHeight - scrollY, 0) + 'px';
      }
    }
  }, {
    key: "initToggleClick",
    value: function initToggleClick() {
      var $body = external_jQuery_default()('body');
      this.$toggle.on('click', function () {
        $body.toggleClass(NAVIGATION_OPEN_CLASS);
      });
    }
  }, {
    key: "hasMobileNav",
    value: function hasMobileNav() {
      return below('lap');
    }
  }, {
    key: "render",
    value: function render() {
      if (!this.element) return;
      window.document.body.style.setProperty('--site-header-height', this.visibleHeaderHeight * 0.75 + this.promoBarHeight + 'px');
      this.updateMobileNavigationOffset();
      this.updateMobileHeaderState();
      this.updateDesktopHeaderState(false);
    }
  }]);

  return Header;
}();

/* harmony default export */ var components_header = (header_Header);
// EXTERNAL MODULE: ./node_modules/js-cookie/src/js.cookie.js
var js_cookie = __webpack_require__(4);
var js_cookie_default = /*#__PURE__*/__webpack_require__.n(js_cookie);

// CONCATENATED MODULE: ./src/js/components/announcement-bar.js






var announcement_bar_AnnouncementBar =
/*#__PURE__*/
function () {
  function AnnouncementBar(element, args) {
    classCallCheck_default()(this, AnnouncementBar);

    this.element = element;
    this.parent = args.parent || null;
    this.transitionDuration = args.transitionDuration || 0.5;
    this.transitionEasing = args.transitionEasing || Power4.easeOut;
    this.pieces = this.getPieces();
    this.id = external_jQuery_default()(element).data('id');
    this.cookieName = 'novablocks-announcement-' + this.id + '-disabled';
    this.height = 0;
    var disabled = js_cookie_default.a.get(this.cookieName);
    var loggedIn = external_jQuery_default()('body').hasClass('logged-in');

    if (disabled && !loggedIn) {
      external_jQuery_default()(element).remove();
      return;
    }

    this.onResize();
    globalService.registerOnResize(this.onResize.bind(this));
    this.timeline.play();
    this.bindEvents();
  }

  createClass_default()(AnnouncementBar, [{
    key: "onResize",
    value: function onResize() {
      var progress = 0;
      var wasActive = false;
      var wasReversed = false;

      if (typeof this.timeline !== "undefined") {
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
  }, {
    key: "getPieces",
    value: function getPieces() {
      var $element = external_jQuery_default()(this.element);
      return {
        element: $element,
        wrapper: $element.find('.novablocks-announcement-bar__wrapper'),
        content: $element.find('.novablocks-announcement-bar__content'),
        close: $element.find('.novablocks-announcement-bar__close')
      };
    }
  }, {
    key: "getTimeline",
    value: function getTimeline() {
      var transitionDuration = this.transitionDuration,
          transitionEasing = this.transitionEasing,
          _this$pieces = this.pieces,
          element = _this$pieces.element,
          wrapper = _this$pieces.wrapper,
          content = _this$pieces.content,
          close = _this$pieces.close;
      var timeline = new TimelineMax({
        paused: true
      });
      var height = wrapper.outerHeight();
      timeline.fromTo(element, transitionDuration, {
        height: 0
      }, {
        height: height,
        ease: transitionEasing
      }, 0);
      timeline.to({
        height: 0
      }, transitionDuration, {
        height: height,
        onUpdate: this.onHeightUpdate.bind(this),
        onUpdateParams: ["{self}"],
        ease: transitionEasing
      }, 0);
      return timeline;
    }
  }, {
    key: "bindEvents",
    value: function bindEvents() {
      this.pieces.close.on('click', this.onClose.bind(this));
    }
  }, {
    key: "onClose",
    value: function onClose() {
      if (typeof this.timeline !== "undefined") {
        this.timeline.reverse();
      }
    }
  }, {
    key: "onHeightUpdate",
    value: function onHeightUpdate(tween) {
      this.height = tween.target.height;

      if (this.parent) {
        this.parent.update();
      }
    }
  }]);

  return AnnouncementBar;
}();


// CONCATENATED MODULE: ./src/js/components/promo-bar.js




var promo_bar_PromoBar =
/*#__PURE__*/
function () {
  function PromoBar(elements, args) {
    var _this = this;

    classCallCheck_default()(this, PromoBar);

    var announcementElementsArray = Array.from(elements);
    this.bars = announcementElementsArray.map(function (element) {
      return new announcement_bar_AnnouncementBar(element, {
        parent: _this,
        transitionDuration: 0.5,
        transitionEasing: Power4.easeInOut
      });
    });
    this.height = 0;
    this.onUpdate = args.onUpdate;
    this.update();
  }

  createClass_default()(PromoBar, [{
    key: "update",
    value: function update() {
      var promoBarHeight = 0;
      this.bars.forEach(function (bar) {
        promoBarHeight += bar.height;
      });
      this.height = promoBarHeight;

      if (typeof this.onUpdate === "function") {
        this.onUpdate(this);
      }
    }
  }]);

  return PromoBar;
}();


// CONCATENATED MODULE: ./src/js/components/navbar.js




var MENU_ITEM = '.menu-item, .page_item';
var MENU_ITEM_WITH_CHILDREN = '.menu-item-has-children, .page_item_has_children';
var SUBMENU = '.sub-menu, .children';
var SUBMENU_LEFT_CLASS = 'has-submenu-left';
var HOVER_CLASS = 'hover';
var SEARCH_OVERLAY_OPEN_CLASS = 'has-search-overlay';

var navbar_Navbar =
/*#__PURE__*/
function () {
  function Navbar() {
    classCallCheck_default()(this, Navbar);

    this.$menuItems = external_jQuery_default()(MENU_ITEM);
    this.$menuItemsWithChildren = this.$menuItems.filter(MENU_ITEM_WITH_CHILDREN).removeClass(HOVER_CLASS);
    this.$menuItemsWithChildrenLinks = this.$menuItemsWithChildren.children('a');
    this.searchOverlayButton = external_jQuery_default()('.is-search-button a');
    this.searchOverlayCancelButton = external_jQuery_default()('.c-search-overlay__cancel');
    this.initialize();
  }

  createClass_default()(Navbar, [{
    key: "initialize",
    value: function initialize() {
      this.onResize();
      this.addSocialMenuClass();
      this.initialized = true;
      globalService.registerOnResize(this.onResize.bind(this));
      this.searchOverlayButton.on('click', this.onClickSearchButton);
      this.searchOverlayCancelButton.on('click', this.onClickCancelSearchButton);
    }
  }, {
    key: "onResize",
    value: function onResize() {
      var mq = window.matchMedia("only screen and (min-width: 1000px)"); // we are on desktop

      if (mq.matches) {
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
      return;
    }
  }, {
    key: "addSubMenusLeftClass",
    value: function addSubMenusLeftClass() {
      var _GlobalService$getPro = globalService.getProps(),
          windowWidth = _GlobalService$getPro.windowWidth;

      this.$menuItemsWithChildren.each(function (index, obj) {
        var $obj = external_jQuery_default()(obj);
        var $subMenu = $obj.children(SUBMENU),
            subMenuWidth = $subMenu.outerWidth(),
            subMenuOffSet = $subMenu.offset(),
            availableSpace = windowWidth - subMenuOffSet.left;

        if (availableSpace < subMenuWidth) {
          $obj.addClass(SUBMENU_LEFT_CLASS);
        }
      });
    }
  }, {
    key: "removeSubMenusLeftClass",
    value: function removeSubMenusLeftClass() {
      this.$menuItemsWithChildren.removeClass(SUBMENU_LEFT_CLASS);
    }
  }, {
    key: "onClickMobile",
    value: function onClickMobile(event) {
      var $link = external_jQuery_default()(this);
      var $siblings = $link.parent().siblings().not($link);

      if ($link.is('.active')) {
        return;
      }

      event.preventDefault();
      $link.addClass('active').parent().addClass(HOVER_CLASS);
      $siblings.removeClass(HOVER_CLASS);
      $siblings.find('.active').removeClass('active');
    }
  }, {
    key: "onClickSearchButton",
    value: function onClickSearchButton(event) {
      event.preventDefault();
      external_jQuery_default()('body').toggleClass(SEARCH_OVERLAY_OPEN_CLASS);
      external_jQuery_default()('.c-search-overlay__form .search-field').focus();
    }
  }, {
    key: "onClickCancelSearchButton",
    value: function onClickCancelSearchButton(event) {
      event.preventDefault();
      external_jQuery_default()('body').removeClass(SEARCH_OVERLAY_OPEN_CLASS);
    }
  }, {
    key: "bindClick",
    value: function bindClick() {
      this.$menuItemsWithChildrenLinks.on('click', this.onClickMobile);
    }
  }, {
    key: "unbindClick",
    value: function unbindClick() {
      this.$menuItemsWithChildrenLinks.off('click', this.onClickMobile);
    }
  }, {
    key: "bindHoverIntent",
    value: function bindHoverIntent() {
      this.$menuItems.hoverIntent({
        out: function out() {
          external_jQuery_default()(this).removeClass(HOVER_CLASS);
        },
        over: function over() {
          external_jQuery_default()(this).addClass(HOVER_CLASS);
        },
        timeout: 200
      });
    }
  }, {
    key: "unbindHoverIntent",
    value: function unbindHoverIntent() {
      this.$menuItems.off('mousemove.hoverIntent mouseenter.hoverIntent mouseleave.hoverIntent');
      delete this.$menuItems.hoverIntent_t;
      delete this.$menuItems.hoverIntent_s;
    }
  }, {
    key: "addSocialMenuClass",
    value: function addSocialMenuClass() {
      var $menuItem = external_jQuery_default()('.menu-item a');
      var bodyStyle = window.getComputedStyle(document.documentElement);
      var enableSocialIconsProp = bodyStyle.getPropertyValue('--enable-social-icons');
      var enableSocialIcons = !!parseInt(enableSocialIconsProp, 10);

      if (enableSocialIcons) {
        $menuItem.each(function (index, obj) {
          var elementStyle = window.getComputedStyle(obj);
          var elementIsSocialProp = elementStyle.getPropertyValue('--is-social');
          var elementIsSocial = !!parseInt(elementIsSocialProp, 10);

          if (elementIsSocial) {
            external_jQuery_default()(this).parent().addClass('social-menu-item');
          }
        });
      }
    }
  }]);

  return Navbar;
}();


// CONCATENATED MODULE: ./src/js/components/dark-mode.js



var _wp;


var COLOR_SCHEME_BUTTON = '.is-color-scheme-switcher-button';
var STORAGE_ITEM = 'color-scheme-dark';
var TEMP_STORAGE_ITEM = 'color-scheme-dark-temp';
var dark_mode_$html = external_jQuery_default()('html');
var api = (_wp = wp) === null || _wp === void 0 ? void 0 : _wp.customize;
var ignoreStorage = !!api;

var dark_mode_DarkMode =
/*#__PURE__*/
function () {
  function DarkMode(element) {
    classCallCheck_default()(this, DarkMode);

    this.$element = external_jQuery_default()(element);
    this.$colorSchemeButtons = external_jQuery_default()(COLOR_SCHEME_BUTTON);
    this.$colorSchemeButtonsLink = this.$colorSchemeButtons.children('a');
    this.matchMedia = window.matchMedia('(prefers-color-scheme: dark)');
    this.darkModeSetting = dark_mode_$html.data('dark-mode-advanced');
    this.theme = null;
    this.initialize();
  }

  createClass_default()(DarkMode, [{
    key: "initialize",
    value: function initialize() {
      localStorage.removeItem(TEMP_STORAGE_ITEM);
      this.bindEvents();
      this.bindCustomizer();
      this.update();
    }
  }, {
    key: "bindEvents",
    value: function bindEvents() {
      var _this = this;

      this.$colorSchemeButtonsLink.on('click', this.onClick.bind(this));
      this.matchMedia.addEventListener('change', function () {
        localStorage.removeItem(TEMP_STORAGE_ITEM);

        _this.update();
      });
    }
  }, {
    key: "bindCustomizer",
    value: function bindCustomizer() {
      var _this2 = this;

      if (!api) {
        return;
      }

      api('sm_dark_mode_advanced').bind(function (newValue, oldValue) {
        localStorage.removeItem(TEMP_STORAGE_ITEM);
        _this2.darkModeSetting = newValue;

        _this2.update();
      });
    }
  }, {
    key: "onClick",
    value: function onClick(e) {
      e.preventDefault();
      var isDark = this.isCompiledDark();
      localStorage.setItem(this.getStorageItemKey(), !!isDark ? 'light' : 'dark');
      this.update();
    }
  }, {
    key: "getStorageItemKey",
    value: function getStorageItemKey() {
      return !ignoreStorage ? STORAGE_ITEM : TEMP_STORAGE_ITEM;
    }
  }, {
    key: "isSystemDark",
    value: function isSystemDark() {
      var isDark = this.darkModeSetting === 'on';

      if (this.darkModeSetting === 'auto' && this.matchMedia.matches) {
        isDark = true;
      }

      return isDark;
    }
  }, {
    key: "isCompiledDark",
    value: function isCompiledDark() {
      var isDark = this.isSystemDark();
      var colorSchemeStorageValue = localStorage.getItem(this.getStorageItemKey());

      if (colorSchemeStorageValue !== null) {
        isDark = colorSchemeStorageValue === 'dark';
      }

      return isDark;
    }
  }, {
    key: "update",
    value: function update() {
      dark_mode_$html.toggleClass('is-dark', this.isCompiledDark());
    }
  }]);

  return DarkMode;
}();


// CONCATENATED MODULE: ./src/js/components/app.js












var app_App =
/*#__PURE__*/
function () {
  function App() {
    classCallCheck_default()(this, App);

    this.initializeHero();
    this.initializeHeader();
    this.initializeNavbar();
    this.initializePromoBar();
    this.initializeDarkMode();
    this.initializeImages();
    this.initializeCommentsArea();
    this.initializeReservationForm();
    globalService.registerRender(this.render.bind(this));
  }

  createClass_default()(App, [{
    key: "render",
    value: function render() {
      var _GlobalService$getPro = globalService.getProps(),
          scrollY = _GlobalService$getPro.scrollY,
          adminBarHeight = _GlobalService$getPro.adminBarHeight;

      var promoBar = this.promoBar;
      var header = this.header;
      var HeroCollection = this.HeroCollection;
      var overlap = HeroCollection.some(function (hero) {
        return insideHalf({
          left: header.box.left,
          top: header.box.top + scrollY,
          width: header.box.width,
          height: header.box.height
        }, {
          left: hero.box.left,
          top: hero.box.top + promoBar.height,
          width: hero.box.width,
          height: hero.box.height
        });
      });

      if (!!header) {
        header.render(overlap);
      }
    }
  }, {
    key: "initializeImages",
    value: function initializeImages() {
      var showLoadedImages = this.showLoadedImages.bind(this);
      showLoadedImages();
      globalService.registerObserverCallback(function (mutationList) {
        external_jQuery_default.a.each(mutationList, function (i, mutationRecord) {
          external_jQuery_default.a.each(mutationRecord.addedNodes, function (j, node) {
            var nodeName = node.nodeName && node.nodeName.toLowerCase();

            if ('img' === nodeName || node.childNodes.length) {
              showLoadedImages(node);
            }
          });
        });
      });
    }
  }, {
    key: "initializeReservationForm",
    value: function initializeReservationForm() {
      globalService.registerObserverCallback(function (mutationList) {
        external_jQuery_default.a.each(mutationList, function (i, mutationRecord) {
          external_jQuery_default.a.each(mutationRecord.addedNodes, function (j, node) {
            var $node = external_jQuery_default()(node);

            if ($node.is('#ot-reservation-widget')) {
              $node.closest('.novablocks-opentable').addClass('is-loaded');
            }
          });
        });
      });
    }
  }, {
    key: "showLoadedImages",
    value: function showLoadedImages() {
      var container = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : document.body;
      var $images = external_jQuery_default()(container).find('img').not('[srcset], .is-loaded, .is-broken');
      $images.imagesLoaded().progress(function (instance, image) {
        var className = image.isLoaded ? 'is-loaded' : 'is-broken';
        external_jQuery_default()(image.img).addClass(className);
      });
    }
  }, {
    key: "initializeHero",
    value: function initializeHero() {
      var heroElements = document.getElementsByClassName('novablocks-hero');
      var heroElementsArray = Array.from(heroElements);
      this.HeroCollection = heroElementsArray.map(function (element) {
        return new hero_Hero(element);
      });
      this.firstHero = heroElementsArray[0];
    }
  }, {
    key: "initializeCommentsArea",
    value: function initializeCommentsArea() {
      var $commentsArea = external_jQuery_default()('.comments-area');

      if ($commentsArea.length) {
        this.commentsArea = new commentsArea_CommentsArea($commentsArea.get(0));
      }
    }
  }, {
    key: "initializeHeader",
    value: function initializeHeader() {
      var $header = external_jQuery_default()('.site-header');

      if ($header.length) {
        this.header = new components_header($header.get(0));
      }
    }
  }, {
    key: "initializeNavbar",
    value: function initializeNavbar() {
      this.navbar = new navbar_Navbar();
    }
  }, {
    key: "initializePromoBar",
    value: function initializePromoBar() {
      var announcementBars = document.querySelectorAll('.promo-bar .novablocks-announcement-bar');
      this.promoBar = new promo_bar_PromoBar(announcementBars, {
        onUpdate: this.onPromoBarUpdate.bind(this)
      });
    }
  }, {
    key: "initializeDarkMode",
    value: function initializeDarkMode() {
      this.DarkMode = new dark_mode_DarkMode();
    }
  }, {
    key: "onPromoBarUpdate",
    value: function onPromoBarUpdate(promoBar) {
      var header = this.header;
      var HeroCollection = this.HeroCollection;
      var promoBarHeight = !!promoBar ? promoBar.height : 0;

      if (!!header) {
        header.offset = promoBarHeight;
        header.update();
      }

      HeroCollection.forEach(function (hero) {
        hero.offset = promoBarHeight;
        hero.updateOnScroll();
      });
    }
  }]);

  return App;
}();


// CONCATENATED MODULE: ./src/js/scripts.js



function scripts_initialize() {
  new app_App();
}

external_jQuery_default()(function () {
  var $window = external_jQuery_default()(window);
  var $html = external_jQuery_default()('html');

  if ($html.is('.wf-active')) {
    scripts_initialize();
  } else {
    $window.on('wf-active', scripts_initialize);
  }
});

/***/ })
/******/ ]);