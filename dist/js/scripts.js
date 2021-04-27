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
/******/ 	return __webpack_require__(__webpack_require__.s = 21);
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

var arrayWithoutHoles = __webpack_require__(9);

var iterableToArray = __webpack_require__(10);

var nonIterableSpread = __webpack_require__(11);

function _toConsumableArray(arr) {
  return arrayWithoutHoles(arr) || iterableToArray(arr) || nonIterableSpread();
}

module.exports = _toConsumableArray;

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

var _typeof = __webpack_require__(12);

var assertThisInitialized = __webpack_require__(7);

function _possibleConstructorReturn(self, call) {
  if (call && (_typeof(call) === "object" || typeof call === "function")) {
    return call;
  }

  return assertThisInitialized(self);
}

module.exports = _possibleConstructorReturn;

/***/ }),
/* 5 */
/***/ (function(module, exports) {

function _getPrototypeOf(o) {
  module.exports = _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
    return o.__proto__ || Object.getPrototypeOf(o);
  };
  return _getPrototypeOf(o);
}

module.exports = _getPrototypeOf;

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

var setPrototypeOf = __webpack_require__(13);

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      writable: true,
      configurable: true
    }
  });
  if (superClass) setPrototypeOf(subClass, superClass);
}

module.exports = _inherits;

/***/ }),
/* 7 */
/***/ (function(module, exports) {

function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return self;
}

module.exports = _assertThisInitialized;

/***/ }),
/* 8 */
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
/* 9 */
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
/* 10 */
/***/ (function(module, exports) {

function _iterableToArray(iter) {
  if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter);
}

module.exports = _iterableToArray;

/***/ }),
/* 11 */
/***/ (function(module, exports) {

function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance");
}

module.exports = _nonIterableSpread;

/***/ }),
/* 12 */
/***/ (function(module, exports) {

function _typeof2(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof2 = function _typeof2(obj) { return typeof obj; }; } else { _typeof2 = function _typeof2(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof2(obj); }

function _typeof(obj) {
  if (typeof Symbol === "function" && _typeof2(Symbol.iterator) === "symbol") {
    module.exports = _typeof = function _typeof(obj) {
      return _typeof2(obj);
    };
  } else {
    module.exports = _typeof = function _typeof(obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : _typeof2(obj);
    };
  }

  return _typeof(obj);
}

module.exports = _typeof;

/***/ }),
/* 13 */
/***/ (function(module, exports) {

function _setPrototypeOf(o, p) {
  module.exports = _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };

  return _setPrototypeOf(o, p);
}

module.exports = _setPrototypeOf;

/***/ }),
/* 14 */,
/* 15 */,
/* 16 */,
/* 17 */,
/* 18 */,
/* 19 */,
/* 20 */,
/* 21 */
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

// EXTERNAL MODULE: ./node_modules/@babel/runtime/helpers/toConsumableArray.js
var toConsumableArray = __webpack_require__(3);
var toConsumableArray_default = /*#__PURE__*/__webpack_require__.n(toConsumableArray);

// CONCATENATED MODULE: ./src/js/utils.js


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
function setAndResetElementStyles(element) {
  var props = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var $element = external_jQuery_default()(element);
  $element.css(props);
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
var getColorSetClasses = function getColorSetClasses(element) {
  var classAttr = element === null || element === void 0 ? void 0 : element.getAttribute('class');

  if (!classAttr) {
    return [];
  }

  var classes = classAttr.split(/\s+/);
  return classes.filter(function (classname) {
    return classname.search('sm-palette-') !== -1 || classname.search('sm-variation-') !== -1 || classname === 'sm-palette--shifted';
  });
};
var utils_addClass = function addClass(element, classes) {
  var classesArray = classes.split(/\s+/).filter(function (x) {
    return x.trim().length;
  });

  if (classesArray.length) {
    var _element$classList;

    (_element$classList = element.classList).add.apply(_element$classList, toConsumableArray_default()(classesArray));
  }
};
var utils_removeClass = function removeClass(element, classes) {
  var classesArray = classes.split(/\s+/).filter(function (x) {
    return x.trim().length;
  });

  if (classesArray.length) {
    var _element$classList2;

    (_element$classList2 = element.classList).remove.apply(_element$classList2, toConsumableArray_default()(classesArray));
  }
};
var hasClass = function hasClass(element, classes) {
  return el.classList.contains(className);
};
var toggleClasses = function toggleClasses(element, check) {
  var trueClasses = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';
  var falseClasses = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : '';
  utils_removeClass(element, !!check ? falseClasses : trueClasses);
  utils_addClass(element, !!check ? trueClasses : falseClasses);
};
function getFirstChild(el) {
  var firstChild = el.firstChild;

  while (firstChild != null && firstChild.nodeType === 3) {
    // skip TextNodes
    firstChild = firstChild.nextSibling;
  }

  return firstChild;
}
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

        wp.customize.bind('change', debounce(this._updateProps.bind(this), 100));
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
      var indicator = this.element.querySelectorAll('.novablocks-hero__indicator');
      var nextSibling = this.element.nextElementSibling;
      var next = nextSibling.querySelectorAll('.novablocks-block');
      next = !!next && next.length ? next[0] : nextSibling;

      if (!!indicator && indicator.length) {
        var colorClasses = getColorSetClasses(next);
        colorClasses.forEach(function (className) {
          indicator[0].classList.add(className);
        });
      }

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


// EXTERNAL MODULE: ./node_modules/@babel/runtime/helpers/possibleConstructorReturn.js
var possibleConstructorReturn = __webpack_require__(4);
var possibleConstructorReturn_default = /*#__PURE__*/__webpack_require__.n(possibleConstructorReturn);

// EXTERNAL MODULE: ./node_modules/@babel/runtime/helpers/getPrototypeOf.js
var getPrototypeOf = __webpack_require__(5);
var getPrototypeOf_default = /*#__PURE__*/__webpack_require__.n(getPrototypeOf);

// EXTERNAL MODULE: ./node_modules/@babel/runtime/helpers/assertThisInitialized.js
var assertThisInitialized = __webpack_require__(7);
var assertThisInitialized_default = /*#__PURE__*/__webpack_require__.n(assertThisInitialized);

// EXTERNAL MODULE: ./node_modules/@babel/runtime/helpers/inherits.js
var inherits = __webpack_require__(6);
var inherits_default = /*#__PURE__*/__webpack_require__.n(inherits);

// CONCATENATED MODULE: ./src/js/components/mqService.js




var mqService_mqService =
/*#__PURE__*/
function () {
  function mqService() {
    classCallCheck_default()(this, mqService);

    this.breakpoints = {
      mobile: '480px',
      tablet: '768px',
      lap: '1000px',
      desktop: '1440px'
    };
    this.above = {};
    this.below = {};
    globalService.registerOnResize(this.onResize.bind(this));
    this.onResize();
  }

  createClass_default()(mqService, [{
    key: "onResize",
    value: function onResize() {
      var _this = this;

      Object.keys(this.breakpoints).forEach(function (key) {
        var breakpoint = _this.breakpoints[key];
        _this.above[key] = !!window.matchMedia("not screen and (min-width: ".concat(breakpoint, ")")).matches;
        _this.below[key] = !!window.matchMedia("not screen and (min-width: ".concat(breakpoint, ")")).matches;
      });
    }
  }]);

  return mqService;
}();

/* harmony default export */ var components_mqService = (new mqService_mqService());
// CONCATENATED MODULE: ./src/js/components/header/header-base.js





var header_base_HeaderBase =
/*#__PURE__*/
function () {
  function HeaderBase() {
    classCallCheck_default()(this, HeaderBase);

    this.offset = 0;
  }

  createClass_default()(HeaderBase, [{
    key: "initialize",
    value: function initialize() {
      utils_addClass(this.element, 'novablocks-header--ready');
      globalService.registerRender(this.render.bind(this));
      globalService.registerOnResize(this.onResize.bind(this));
      this.render();
    }
  }, {
    key: "onResize",
    value: function onResize() {
      this.box = this.element.getBoundingClientRect();
    }
  }, {
    key: "getHeight",
    value: function getHeight() {
      var _this$box;

      return this === null || this === void 0 ? void 0 : (_this$box = this.box) === null || _this$box === void 0 ? void 0 : _this$box.height;
    }
  }, {
    key: "render",
    value: function render(forceUpdate) {
      this.maybeUpdateStickyStyles(forceUpdate);
    }
  }, {
    key: "maybeUpdateStickyStyles",
    value: function maybeUpdateStickyStyles(forceUpdate) {
      var _globalService$getPro = globalService.getProps(),
          scrollY = _globalService$getPro.scrollY;

      var shouldBeSticky = scrollY > this.offset;

      if (this.shouldBeSticky === shouldBeSticky && !forceUpdate) {
        return;
      }

      this.shouldBeSticky = shouldBeSticky;
      this.updateStickyStyles();
    }
  }, {
    key: "updateStickyStyles",
    value: function updateStickyStyles() {
      this.applyStickyStyles(this.element);
    }
  }, {
    key: "applyStickyStyles",
    value: function applyStickyStyles(element) {
      if (this.shouldBeSticky) {
        element.style.position = 'fixed';
        element.style.removeProperty('top');
      } else {
        element.style.position = 'absolute';
        element.style.top = "".concat(this.offset, "px");
      }
    }
  }]);

  return HeaderBase;
}();

/* harmony default export */ var header_base = (header_base_HeaderBase);
// CONCATENATED MODULE: ./src/js/components/header/header-colors.js





var header_colors_HeaderColors =
/*#__PURE__*/
function () {
  function HeaderColors(element, initialColorsSource, transparentColorsSource) {
    classCallCheck_default()(this, HeaderColors);

    this.element = element;
    this.initialColorsSource = initialColorsSource ? initialColorsSource : element;
    this.transparentColorsSource = transparentColorsSource ? transparentColorsSource : this.getFirstBlockElement();
    this.initializeColors();
  }

  createClass_default()(HeaderColors, [{
    key: "getFirstBlockElement",
    value: function getFirstBlockElement() {
      var content = document.querySelector('.site-main .entry-content');
      var firstBlock = content ? getFirstChild(content) : null;
      var novablocksBlock = firstBlock ? firstBlock.querySelector('.novablocks-block') : null;
      return novablocksBlock || firstBlock;
    }
  }, {
    key: "initializeColors",
    value: function initializeColors() {
      this.initialColorClasses = getColorSetClasses(this.initialColorsSource).join(' ');
      this.transparentColorClasses = getColorSetClasses(this.transparentColorsSource).join(' ') + ' novablocks-header--transparent';
    }
  }, {
    key: "toggleColors",
    value: function toggleColors(isTransparent) {
      toggleClasses(this.element, isTransparent, this.transparentColorClasses, this.initialColorClasses);
    }
  }]);

  return HeaderColors;
}();

/* harmony default export */ var header_colors = (header_colors_HeaderColors);
// CONCATENATED MODULE: ./src/js/components/header/menu-toggle.js



var menu_toggle_MenuToggle =
/*#__PURE__*/
function () {
  function MenuToggle(input, options) {
    classCallCheck_default()(this, MenuToggle);

    var id = input.getAttribute('id');
    var toggleLabels = document.querySelectorAll("[for=\"".concat(id, "\"]"));
    var defaults = {
      onChange: this.onChange
    };
    this.options = Object.assign({}, defaults, options);
    this.input = input;
    this.element = toggleLabels.length ? toggleLabels[0] : null;
    this.bindEvents();
  }

  createClass_default()(MenuToggle, [{
    key: "bindEvents",
    value: function bindEvents() {
      var _this = this;

      this.input.addEventListener('change', function (event) {
        _this.options.onChange.call(_this, event, _this);
      });
    }
  }, {
    key: "onChange",
    value: function onChange(isChecked, menuToggle) {}
  }, {
    key: "getHeight",
    value: function getHeight() {
      var _this$element;

      return (this === null || this === void 0 ? void 0 : (_this$element = this.element) === null || _this$element === void 0 ? void 0 : _this$element.offsetHeight) || 0;
    }
  }]);

  return MenuToggle;
}();

/* harmony default export */ var menu_toggle = (menu_toggle_MenuToggle);
// CONCATENATED MODULE: ./src/js/components/header/header-mobile.js











var header_mobile_HeaderMobile =
/*#__PURE__*/
function (_HeaderBase) {
  inherits_default()(HeaderMobile, _HeaderBase);

  function HeaderMobile(parent) {
    var _this;

    classCallCheck_default()(this, HeaderMobile);

    _this = possibleConstructorReturn_default()(this, getPrototypeOf_default()(HeaderMobile).call(this));
    _this.parent = parent;
    _this.parentContainer = parent.element.querySelector('.novablocks-header__inner-container');

    _this.initialize();

    _this.onResize();

    return _this;
  }

  createClass_default()(HeaderMobile, [{
    key: "initialize",
    value: function initialize() {
      this.initializeMenuToggle();
      this.createMobileHeader();
      var logoRow = this.parent.rows.find(function (row) {
        return row.element.querySelector('.site-logo');
      });
      this.headerClasses = getColorSetClasses(this.parent.element).join(' ');
      this.colors = new header_colors(this.element, logoRow === null || logoRow === void 0 ? void 0 : logoRow.element);
      this.menuToggleColors = new header_colors(this.menuToggle.element, logoRow === null || logoRow === void 0 ? void 0 : logoRow.element);
      header_base.prototype.initialize.call(this);
    }
  }, {
    key: "render",
    value: function render(forceUpdate) {
      header_base.prototype.render.call(this);
    }
  }, {
    key: "initializeMenuToggle",
    value: function initializeMenuToggle() {
      var menuToggleCheckbox = document.getElementById('nova-menu-toggle');
      this.navigationIsOpen = menuToggleCheckbox.checked;
      this.menuToggle = new menu_toggle(menuToggleCheckbox, {
        onChange: this.onToggleChange.bind(this)
      });
    }
  }, {
    key: "createMobileHeader",
    value: function createMobileHeader() {
      this.element = document.createElement('div');
      this.element.setAttribute('class', 'novablocks-header--mobile novablocks-header-background novablocks-header-shadow');
      this.copyElementFromParent('.c-branding');
      this.copyElementFromParent('.menu-item--cart');
      this.menuToggle.element.insertAdjacentElement('afterend', this.element);
      this.createButtonMenu();
    }
  }, {
    key: "createButtonMenu",
    value: function createButtonMenu() {
      var _this2 = this;

      var buttonCount = 0;
      this.buttonMenu = document.createElement('ul');
      utils_addClass(this.buttonMenu, 'menu menu--buttons');
      var buttonSelectors = ['.menu-item--search', '.menu-item--dark-mode'];
      buttonSelectors.forEach(function (selector) {
        var button = _this2.parent.element.querySelector(selector);

        if (button) {
          var buttonClone = button.cloneNode(true);

          _this2.buttonMenu.appendChild(buttonClone);

          buttonCount = buttonCount + 1;
        }
      });

      if (buttonCount) {
        // create a fake navigation block to inherit styles
        // @todo hopefully find a better solution for styling
        var navigationBlock = document.createElement('div');
        var wrapper = document.createElement('div');
        utils_addClass(navigationBlock, 'wp-block-novablocks-navigation');
        utils_addClass(wrapper, 'novablocks-header__buttons-menu wp-block-group__inner-container');
        wrapper.appendChild(navigationBlock);
        navigationBlock.appendChild(this.buttonMenu);
        this.parent.element.appendChild(wrapper);
      }
    }
  }, {
    key: "updateStickyStyles",
    value: function updateStickyStyles() {
      header_base.prototype.updateStickyStyles.call(this);
      this.applyStickyStyles(this.menuToggle.element);
      this.colors.toggleColors(!this.shouldBeSticky);
      this.updateToggleClasses();
    }
  }, {
    key: "onResize",
    value: function onResize() {
      header_base.prototype.onResize.call(this);
      this.update();
    }
  }, {
    key: "update",
    value: function update() {
      this.menuToggle.element.style.height = "".concat(this.box.height, "px");
      this.parentContainer.style.paddingTop = "".concat(this.box.height, "px");
      this.buttonMenu.style.height = "".concat(this.box.height, "px");
    }
  }, {
    key: "onToggleChange",
    value: function onToggleChange(event, menuToggle) {
      var checked = event.target.checked;
      document.body.style.overflow = checked ? 'hidden' : '';
      this.navigationIsOpen = !!checked;
      this.updateToggleClasses();
    }
  }, {
    key: "updateToggleClasses",
    value: function updateToggleClasses() {
      if (this.navigationIsOpen) {
        utils_removeClass(this.menuToggle.element, "".concat(this.menuToggleColors.transparentColorClasses, " ").concat(this.menuToggleColors.initialColorClasses));
        utils_addClass(this.menuToggle.element, this.headerClasses);
      } else {
        utils_removeClass(this.menuToggle.element, this.headerClasses);
        this.menuToggleColors.toggleColors(this.shouldBeSticky);
      }
    }
  }, {
    key: "copyElementFromParent",
    value: function copyElementFromParent(selector) {
      var element = this.parent.element.querySelector(selector);
      var elementClone = element === null || element === void 0 ? void 0 : element.cloneNode(true);

      if (elementClone) {
        this.element.appendChild(elementClone);
      }
    }
  }]);

  return HeaderMobile;
}(header_base);

/* harmony default export */ var header_mobile = (header_mobile_HeaderMobile);
// CONCATENATED MODULE: ./src/js/components/header/index.js













var header_Header =
/*#__PURE__*/
function (_HeaderBase) {
  inherits_default()(Header, _HeaderBase);

  function Header(element, options) {
    var _this;

    classCallCheck_default()(this, Header);

    _this = possibleConstructorReturn_default()(this, getPrototypeOf_default()(Header).call(this));
    if (!element) return possibleConstructorReturn_default()(_this);
    _this.onUpdate = options.onUpdate;
    _this.element = element;
    _this.rows = _this.getHeaderRows();
    _this.mobileHeader = new header_mobile(assertThisInitialized_default()(_this));
    _this.secondaryHeader = _this.getSecondaryHeader();

    _this.initialize();

    _this.toggleRowsColors(true);

    utils_addClass(_this.element, 'novablocks-header--transparent');

    if (_this.secondaryHeader) {
      utils_addClass(_this.secondaryHeader, 'novablocks-header--ready');
    }

    _this.onResize();

    return _this;
  }

  createClass_default()(Header, [{
    key: "initialize",
    value: function initialize() {
      header_base.prototype.initialize.call(this);
      this.rows.forEach(function (row) {
        row.initializeColors();
      });
      this.timeline = this.getIntroTimeline();
      this.timeline.play();
    }
  }, {
    key: "render",
    value: function render(forceUpdate) {
      header_base.prototype.render.call(this, forceUpdate);

      if (typeof this.onUpdate === "function") {
        this.onUpdate();
      }
    }
  }, {
    key: "getHeight",
    value: function getHeight() {
      if (!!components_mqService.below.lap) {
        return this.mobileHeader.getHeight();
      }

      return header_base.prototype.getHeight.call(this);
    }
  }, {
    key: "onResize",
    value: function onResize() {
      header_base.prototype.onResize.call(this);
      setAndResetElementStyles(this.element, {
        transition: 'none'
      });
    }
  }, {
    key: "getSecondaryHeader",
    value: function getSecondaryHeader() {
      var nextSibling = this.element.nextElementSibling;

      if (nextSibling.classList.contains('novablocks-header--secondary')) {
        return nextSibling;
      }

      return null;
    }
  }, {
    key: "getHeaderRows",
    value: function getHeaderRows() {
      var rows = this.element.querySelectorAll('.novablocks-header-row');

      if (rows) {
        return Array.from(rows).map(function (element) {
          return new header_colors(element);
        });
      }

      return [];
    }
  }, {
    key: "toggleRowsColors",
    value: function toggleRowsColors(isTransparent) {
      this.rows.forEach(function (row) {
        row.toggleColors(isTransparent);
      });
    }
  }, {
    key: "updateStickyStyles",
    value: function updateStickyStyles() {
      header_base.prototype.updateStickyStyles.call(this);
      this.element.style.marginTop = "".concat(this.offset, "px");

      if (this.secondaryHeader) {
        this.secondaryHeader.style.top = "".concat(this.offset, "px");
      }
    }
  }, {
    key: "getIntroTimeline",
    value: function getIntroTimeline() {
      var _this2 = this;

      var timeline = new TimelineMax({
        paused: true
      });
      var height = this.element.offsetHeight;
      var transitionEasing = Power4.easeInOut;
      var transitionDuration = 0.5;
      timeline.to(this.element, transitionDuration, {
        opacity: 1,
        ease: transitionEasing
      }, 0);
      timeline.to({
        height: 0
      }, transitionDuration, {
        height: height,
        onUpdate: function onUpdate(tween) {
          _this2.box = Object.assign({}, _this2.box, {
            height: tween.target.height
          });
        },
        onUpdateParams: ["{self}"],
        ease: transitionEasing
      }, 0);
      return timeline;
    }
  }]);

  return Header;
}(header_base);

/* harmony default export */ var header = (header_Header);
// EXTERNAL MODULE: ./node_modules/js-cookie/src/js.cookie.js
var js_cookie = __webpack_require__(8);
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

var navbar_Navbar =
/*#__PURE__*/
function () {
  function Navbar() {
    classCallCheck_default()(this, Navbar);

    this.$menuItems = external_jQuery_default()(MENU_ITEM);
    this.$menuItemsWithChildren = this.$menuItems.filter(MENU_ITEM_WITH_CHILDREN).removeClass(HOVER_CLASS);
    this.$menuItemsWithChildrenLinks = this.$menuItemsWithChildren.children('a');
    this.initialize();
  }

  createClass_default()(Navbar, [{
    key: "initialize",
    value: function initialize() {
      this.onResize();
      this.initialized = true;
      globalService.registerOnResize(this.onResize.bind(this));
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
  }]);

  return Navbar;
}();


// CONCATENATED MODULE: ./src/js/components/base-component.js




var base_component_BaseComponent =
/*#__PURE__*/
function () {
  function BaseComponent() {
    classCallCheck_default()(this, BaseComponent);

    globalService.registerOnResize(this.onResize.bind(this));
  }

  createClass_default()(BaseComponent, [{
    key: "onResize",
    value: function onResize() {}
  }]);

  return BaseComponent;
}();

/* harmony default export */ var base_component = (base_component_BaseComponent);
// CONCATENATED MODULE: ./src/js/components/search-overlay.js








var SEARCH_OVERLAY_OPEN_CLASS = 'has-search-overlay';
var ESC_KEY_CODE = 27;

var search_overlay_SearchOverlay =
/*#__PURE__*/
function (_BaseComponent) {
  inherits_default()(SearchOverlay, _BaseComponent);

  function SearchOverlay() {
    var _this;

    classCallCheck_default()(this, SearchOverlay);

    _this = possibleConstructorReturn_default()(this, getPrototypeOf_default()(SearchOverlay).call(this));
    _this.$searchOverlay = external_jQuery_default()('.c-search-overlay');

    _this.initialize();

    _this.onResize();

    return _this;
  }

  createClass_default()(SearchOverlay, [{
    key: "initialize",
    value: function initialize() {
      external_jQuery_default()(document).on('click', '.menu-item--search a', this.openSearchOverlay);
      external_jQuery_default()(document).on('click', '.c-search-overlay__cancel', this.closeSearchOverlay);
      external_jQuery_default()(document).on('keydown', this.closeSearchOverlayOnEsc);
    }
  }, {
    key: "onResize",
    value: function onResize() {
      setAndResetElementStyles(this.$searchOverlay, {
        transition: 'none'
      });
    }
  }, {
    key: "openSearchOverlay",
    value: function openSearchOverlay(e) {
      e.preventDefault();
      external_jQuery_default()('body').toggleClass(SEARCH_OVERLAY_OPEN_CLASS);
      external_jQuery_default()('.c-search-overlay__form .search-field').focus();
    }
  }, {
    key: "closeSearchOverlayOnEsc",
    value: function closeSearchOverlayOnEsc(e) {
      if (e.keyCode === ESC_KEY_CODE) {
        external_jQuery_default()('body').removeClass(SEARCH_OVERLAY_OPEN_CLASS);
        external_jQuery_default()('.c-search-overlay__form .search-field').blur();
      }
    }
  }, {
    key: "closeSearchOverlay",
    value: function closeSearchOverlay(e) {
      e.preventDefault();
      external_jQuery_default()('body').removeClass(SEARCH_OVERLAY_OPEN_CLASS);
    }
  }]);

  return SearchOverlay;
}(base_component);

/* harmony default export */ var search_overlay = (search_overlay_SearchOverlay);
// CONCATENATED MODULE: ./src/js/components/app.js












var app_App =
/*#__PURE__*/
function () {
  function App() {
    classCallCheck_default()(this, App);

    this.initializeHero();
    this.initializeHeader();
    this.initializeNavbar();
    this.searchOverlay = new search_overlay();
    this.initializePromoBar();
    this.initializeImages();
    this.initializeCommentsArea();
    this.initializeReservationForm();
  }

  createClass_default()(App, [{
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
      var $header = external_jQuery_default()('.novablocks-header');

      if ($header.length) {
        this.header = new header($header.get(0), {
          onUpdate: this.onHeaderUpdate.bind(this)
        });
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
    key: "onPromoBarUpdate",
    value: function onPromoBarUpdate(promoBar) {
      var header = this.header;
      var HeroCollection = this.HeroCollection;
      var promoBarHeight = !!promoBar ? promoBar.height : 0;

      if (!!header) {
        header.offset = promoBarHeight;
        header.render(true);
        header.mobileHeader.offset = promoBarHeight;
        header.mobileHeader.render(true);
      }

      HeroCollection.forEach(function (hero) {
        hero.offset = promoBarHeight;
        hero.updateOnScroll();
      });
    }
  }, {
    key: "onHeaderUpdate",
    value: function onHeaderUpdate() {
      var _this$promoBar, _this$header;

      var promoBarHeight = ((_this$promoBar = this.promoBar) === null || _this$promoBar === void 0 ? void 0 : _this$promoBar.height) || 0;
      var headerHeight = ((_this$header = this.header) === null || _this$header === void 0 ? void 0 : _this$header.getHeight()) || 0;
      external_jQuery_default()('body:not(.has-no-spacing-top) .site-content').css('marginTop', "".concat(promoBarHeight + headerHeight, "px"));
      external_jQuery_default()('html').css('scrollPaddingTop', "".concat(headerHeight, "px"));
      var $firstBlock = external_jQuery_default()('.has-novablocks-header-transparent .entry-content > :first-child');
      var $firstBlockFg = $firstBlock.find('.novablocks-foreground');
      var firstBlockFgPaddingTop = parseInt($firstBlockFg.css('paddingTop', '').css('paddingTop'), 0);
      $firstBlockFg.css('paddingTop', Math.max(firstBlockFgPaddingTop, headerHeight + promoBarHeight));
      var $supernova = $firstBlock.filter('.supernova');
      var $firstNovaBlock = $supernova.length ? $supernova : $firstBlock.children('.novablocks-block');
      var firstBlockPaddingTop = parseInt($firstNovaBlock.css('paddingTop', '').css('paddingTop'), 0);
      $firstNovaBlock.css('paddingTop', firstBlockPaddingTop + headerHeight + promoBarHeight);
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