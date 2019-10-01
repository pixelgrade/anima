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
/******/ 	return __webpack_require__(__webpack_require__.s = 73);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

module.exports = jQuery;

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;

exports.default = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;

var _defineProperty = __webpack_require__(59);

var _defineProperty2 = _interopRequireDefault(_defineProperty);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      (0, _defineProperty2.default)(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

var store = __webpack_require__(29)('wks');
var uid = __webpack_require__(30);
var Symbol = __webpack_require__(7).Symbol;
var USE_SYMBOL = typeof Symbol == 'function';

var $exports = module.exports = function (name) {
  return store[name] || (store[name] =
    USE_SYMBOL && Symbol[name] || (USE_SYMBOL ? Symbol : uid)('Symbol.' + name));
};

$exports.store = store;


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(36), __esModule: true };

/***/ }),
/* 5 */
/***/ (function(module, exports) {

var core = module.exports = { version: '2.6.9' };
if (typeof __e == 'number') __e = core; // eslint-disable-line no-undef


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

// Thank's IE8 for his funny defineProperty
module.exports = !__webpack_require__(16)(function () {
  return Object.defineProperty({}, 'a', { get: function () { return 7; } }).a != 7;
});


/***/ }),
/* 7 */
/***/ (function(module, exports) {

// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
var global = module.exports = typeof window != 'undefined' && window.Math == Math
  ? window : typeof self != 'undefined' && self.Math == Math ? self
  // eslint-disable-next-line no-new-func
  : Function('return this')();
if (typeof __g == 'number') __g = global; // eslint-disable-line no-undef


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

var anObject = __webpack_require__(11);
var IE8_DOM_DEFINE = __webpack_require__(41);
var toPrimitive = __webpack_require__(42);
var dP = Object.defineProperty;

exports.f = __webpack_require__(6) ? Object.defineProperty : function defineProperty(O, P, Attributes) {
  anObject(O);
  P = toPrimitive(P, true);
  anObject(Attributes);
  if (IE8_DOM_DEFINE) try {
    return dP(O, P, Attributes);
  } catch (e) { /* empty */ }
  if ('get' in Attributes || 'set' in Attributes) throw TypeError('Accessors not supported!');
  if ('value' in Attributes) O[P] = Attributes.value;
  return O;
};


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__(7);
var core = __webpack_require__(5);
var ctx = __webpack_require__(22);
var hide = __webpack_require__(10);
var has = __webpack_require__(12);
var PROTOTYPE = 'prototype';

var $export = function (type, name, source) {
  var IS_FORCED = type & $export.F;
  var IS_GLOBAL = type & $export.G;
  var IS_STATIC = type & $export.S;
  var IS_PROTO = type & $export.P;
  var IS_BIND = type & $export.B;
  var IS_WRAP = type & $export.W;
  var exports = IS_GLOBAL ? core : core[name] || (core[name] = {});
  var expProto = exports[PROTOTYPE];
  var target = IS_GLOBAL ? global : IS_STATIC ? global[name] : (global[name] || {})[PROTOTYPE];
  var key, own, out;
  if (IS_GLOBAL) source = name;
  for (key in source) {
    // contains in native
    own = !IS_FORCED && target && target[key] !== undefined;
    if (own && has(exports, key)) continue;
    // export native or passed
    out = own ? target[key] : source[key];
    // prevent global pollution for namespaces
    exports[key] = IS_GLOBAL && typeof target[key] != 'function' ? source[key]
    // bind timers to global for call from export context
    : IS_BIND && own ? ctx(out, global)
    // wrap global constructors for prevent change them in library
    : IS_WRAP && target[key] == out ? (function (C) {
      var F = function (a, b, c) {
        if (this instanceof C) {
          switch (arguments.length) {
            case 0: return new C();
            case 1: return new C(a);
            case 2: return new C(a, b);
          } return new C(a, b, c);
        } return C.apply(this, arguments);
      };
      F[PROTOTYPE] = C[PROTOTYPE];
      return F;
    // make static versions for prototype methods
    })(out) : IS_PROTO && typeof out == 'function' ? ctx(Function.call, out) : out;
    // export proto methods to core.%CONSTRUCTOR%.methods.%NAME%
    if (IS_PROTO) {
      (exports.virtual || (exports.virtual = {}))[key] = out;
      // export proto methods to core.%CONSTRUCTOR%.prototype.%NAME%
      if (type & $export.R && expProto && !expProto[key]) hide(expProto, key, out);
    }
  }
};
// type bitmap
$export.F = 1;   // forced
$export.G = 2;   // global
$export.S = 4;   // static
$export.P = 8;   // proto
$export.B = 16;  // bind
$export.W = 32;  // wrap
$export.U = 64;  // safe
$export.R = 128; // real proto method for `library`
module.exports = $export;


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

var dP = __webpack_require__(8);
var createDesc = __webpack_require__(17);
module.exports = __webpack_require__(6) ? function (object, key, value) {
  return dP.f(object, key, createDesc(1, value));
} : function (object, key, value) {
  object[key] = value;
  return object;
};


/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__(15);
module.exports = function (it) {
  if (!isObject(it)) throw TypeError(it + ' is not an object!');
  return it;
};


/***/ }),
/* 12 */
/***/ (function(module, exports) {

var hasOwnProperty = {}.hasOwnProperty;
module.exports = function (it, key) {
  return hasOwnProperty.call(it, key);
};


/***/ }),
/* 13 */
/***/ (function(module, exports) {

// 7.1.4 ToInteger
var ceil = Math.ceil;
var floor = Math.floor;
module.exports = function (it) {
  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
};


/***/ }),
/* 14 */
/***/ (function(module, exports) {

// 7.2.1 RequireObjectCoercible(argument)
module.exports = function (it) {
  if (it == undefined) throw TypeError("Can't call method on  " + it);
  return it;
};


/***/ }),
/* 15 */
/***/ (function(module, exports) {

module.exports = function (it) {
  return typeof it === 'object' ? it !== null : typeof it === 'function';
};


/***/ }),
/* 16 */
/***/ (function(module, exports) {

module.exports = function (exec) {
  try {
    return !!exec();
  } catch (e) {
    return true;
  }
};


/***/ }),
/* 17 */
/***/ (function(module, exports) {

module.exports = function (bitmap, value) {
  return {
    enumerable: !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable: !(bitmap & 4),
    value: value
  };
};


/***/ }),
/* 18 */
/***/ (function(module, exports) {

module.exports = {};


/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

var shared = __webpack_require__(29)('keys');
var uid = __webpack_require__(30);
module.exports = function (key) {
  return shared[key] || (shared[key] = uid(key));
};


/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

// 7.1.13 ToObject(argument)
var defined = __webpack_require__(14);
module.exports = function (it) {
  return Object(defined(it));
};


/***/ }),
/* 21 */
/***/ (function(module, exports) {

module.exports = true;


/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

// optional / simple context binding
var aFunction = __webpack_require__(40);
module.exports = function (fn, that, length) {
  aFunction(fn);
  if (that === undefined) return fn;
  switch (length) {
    case 1: return function (a) {
      return fn.call(that, a);
    };
    case 2: return function (a, b) {
      return fn.call(that, a, b);
    };
    case 3: return function (a, b, c) {
      return fn.call(that, a, b, c);
    };
  }
  return function (/* ...args */) {
    return fn.apply(that, arguments);
  };
};


/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__(15);
var document = __webpack_require__(7).document;
// typeof document.createElement is 'object' in old IE
var is = isObject(document) && isObject(document.createElement);
module.exports = function (it) {
  return is ? document.createElement(it) : {};
};


/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.14 / 15.2.3.14 Object.keys(O)
var $keys = __webpack_require__(47);
var enumBugKeys = __webpack_require__(31);

module.exports = Object.keys || function keys(O) {
  return $keys(O, enumBugKeys);
};


/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

// to indexed object, toObject with fallback for non-array-like ES3 strings
var IObject = __webpack_require__(26);
var defined = __webpack_require__(14);
module.exports = function (it) {
  return IObject(defined(it));
};


/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

// fallback for non-array-like ES3 and non-enumerable old V8 strings
var cof = __webpack_require__(27);
// eslint-disable-next-line no-prototype-builtins
module.exports = Object('z').propertyIsEnumerable(0) ? Object : function (it) {
  return cof(it) == 'String' ? it.split('') : Object(it);
};


/***/ }),
/* 27 */
/***/ (function(module, exports) {

var toString = {}.toString;

module.exports = function (it) {
  return toString.call(it).slice(8, -1);
};


/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

// 7.1.15 ToLength
var toInteger = __webpack_require__(13);
var min = Math.min;
module.exports = function (it) {
  return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
};


/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

var core = __webpack_require__(5);
var global = __webpack_require__(7);
var SHARED = '__core-js_shared__';
var store = global[SHARED] || (global[SHARED] = {});

(module.exports = function (key, value) {
  return store[key] || (store[key] = value !== undefined ? value : {});
})('versions', []).push({
  version: core.version,
  mode: __webpack_require__(21) ? 'pure' : 'global',
  copyright: '© 2019 Denis Pushkarev (zloirock.ru)'
});


/***/ }),
/* 30 */
/***/ (function(module, exports) {

var id = 0;
var px = Math.random();
module.exports = function (key) {
  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
};


/***/ }),
/* 31 */
/***/ (function(module, exports) {

// IE 8- don't enum bug keys
module.exports = (
  'constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf'
).split(',');


/***/ }),
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

var def = __webpack_require__(8).f;
var has = __webpack_require__(12);
var TAG = __webpack_require__(3)('toStringTag');

module.exports = function (it, tag, stat) {
  if (it && !has(it = stat ? it : it.prototype, TAG)) def(it, TAG, { configurable: true, value: tag });
};


/***/ }),
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;

var _from = __webpack_require__(4);

var _from2 = _interopRequireDefault(_from);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
      arr2[i] = arr[i];
    }

    return arr2;
  } else {
    return (0, _from2.default)(arr);
  }
};

/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(62), __esModule: true };

/***/ }),
/* 35 */
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
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(37);
__webpack_require__(52);
module.exports = __webpack_require__(5).Array.from;


/***/ }),
/* 37 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $at = __webpack_require__(38)(true);

// 21.1.3.27 String.prototype[@@iterator]()
__webpack_require__(39)(String, 'String', function (iterated) {
  this._t = String(iterated); // target
  this._i = 0;                // next index
// 21.1.5.2.1 %StringIteratorPrototype%.next()
}, function () {
  var O = this._t;
  var index = this._i;
  var point;
  if (index >= O.length) return { value: undefined, done: true };
  point = $at(O, index);
  this._i += point.length;
  return { value: point, done: false };
});


/***/ }),
/* 38 */
/***/ (function(module, exports, __webpack_require__) {

var toInteger = __webpack_require__(13);
var defined = __webpack_require__(14);
// true  -> String#at
// false -> String#codePointAt
module.exports = function (TO_STRING) {
  return function (that, pos) {
    var s = String(defined(that));
    var i = toInteger(pos);
    var l = s.length;
    var a, b;
    if (i < 0 || i >= l) return TO_STRING ? '' : undefined;
    a = s.charCodeAt(i);
    return a < 0xd800 || a > 0xdbff || i + 1 === l || (b = s.charCodeAt(i + 1)) < 0xdc00 || b > 0xdfff
      ? TO_STRING ? s.charAt(i) : a
      : TO_STRING ? s.slice(i, i + 2) : (a - 0xd800 << 10) + (b - 0xdc00) + 0x10000;
  };
};


/***/ }),
/* 39 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var LIBRARY = __webpack_require__(21);
var $export = __webpack_require__(9);
var redefine = __webpack_require__(43);
var hide = __webpack_require__(10);
var Iterators = __webpack_require__(18);
var $iterCreate = __webpack_require__(44);
var setToStringTag = __webpack_require__(32);
var getPrototypeOf = __webpack_require__(51);
var ITERATOR = __webpack_require__(3)('iterator');
var BUGGY = !([].keys && 'next' in [].keys()); // Safari has buggy iterators w/o `next`
var FF_ITERATOR = '@@iterator';
var KEYS = 'keys';
var VALUES = 'values';

var returnThis = function () { return this; };

module.exports = function (Base, NAME, Constructor, next, DEFAULT, IS_SET, FORCED) {
  $iterCreate(Constructor, NAME, next);
  var getMethod = function (kind) {
    if (!BUGGY && kind in proto) return proto[kind];
    switch (kind) {
      case KEYS: return function keys() { return new Constructor(this, kind); };
      case VALUES: return function values() { return new Constructor(this, kind); };
    } return function entries() { return new Constructor(this, kind); };
  };
  var TAG = NAME + ' Iterator';
  var DEF_VALUES = DEFAULT == VALUES;
  var VALUES_BUG = false;
  var proto = Base.prototype;
  var $native = proto[ITERATOR] || proto[FF_ITERATOR] || DEFAULT && proto[DEFAULT];
  var $default = $native || getMethod(DEFAULT);
  var $entries = DEFAULT ? !DEF_VALUES ? $default : getMethod('entries') : undefined;
  var $anyNative = NAME == 'Array' ? proto.entries || $native : $native;
  var methods, key, IteratorPrototype;
  // Fix native
  if ($anyNative) {
    IteratorPrototype = getPrototypeOf($anyNative.call(new Base()));
    if (IteratorPrototype !== Object.prototype && IteratorPrototype.next) {
      // Set @@toStringTag to native iterators
      setToStringTag(IteratorPrototype, TAG, true);
      // fix for some old engines
      if (!LIBRARY && typeof IteratorPrototype[ITERATOR] != 'function') hide(IteratorPrototype, ITERATOR, returnThis);
    }
  }
  // fix Array#{values, @@iterator}.name in V8 / FF
  if (DEF_VALUES && $native && $native.name !== VALUES) {
    VALUES_BUG = true;
    $default = function values() { return $native.call(this); };
  }
  // Define iterator
  if ((!LIBRARY || FORCED) && (BUGGY || VALUES_BUG || !proto[ITERATOR])) {
    hide(proto, ITERATOR, $default);
  }
  // Plug for library
  Iterators[NAME] = $default;
  Iterators[TAG] = returnThis;
  if (DEFAULT) {
    methods = {
      values: DEF_VALUES ? $default : getMethod(VALUES),
      keys: IS_SET ? $default : getMethod(KEYS),
      entries: $entries
    };
    if (FORCED) for (key in methods) {
      if (!(key in proto)) redefine(proto, key, methods[key]);
    } else $export($export.P + $export.F * (BUGGY || VALUES_BUG), NAME, methods);
  }
  return methods;
};


/***/ }),
/* 40 */
/***/ (function(module, exports) {

module.exports = function (it) {
  if (typeof it != 'function') throw TypeError(it + ' is not a function!');
  return it;
};


/***/ }),
/* 41 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = !__webpack_require__(6) && !__webpack_require__(16)(function () {
  return Object.defineProperty(__webpack_require__(23)('div'), 'a', { get: function () { return 7; } }).a != 7;
});


/***/ }),
/* 42 */
/***/ (function(module, exports, __webpack_require__) {

// 7.1.1 ToPrimitive(input [, PreferredType])
var isObject = __webpack_require__(15);
// instead of the ES6 spec version, we didn't implement @@toPrimitive case
// and the second argument - flag - preferred type is a string
module.exports = function (it, S) {
  if (!isObject(it)) return it;
  var fn, val;
  if (S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it))) return val;
  if (typeof (fn = it.valueOf) == 'function' && !isObject(val = fn.call(it))) return val;
  if (!S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it))) return val;
  throw TypeError("Can't convert object to primitive value");
};


/***/ }),
/* 43 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(10);


/***/ }),
/* 44 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var create = __webpack_require__(45);
var descriptor = __webpack_require__(17);
var setToStringTag = __webpack_require__(32);
var IteratorPrototype = {};

// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
__webpack_require__(10)(IteratorPrototype, __webpack_require__(3)('iterator'), function () { return this; });

module.exports = function (Constructor, NAME, next) {
  Constructor.prototype = create(IteratorPrototype, { next: descriptor(1, next) });
  setToStringTag(Constructor, NAME + ' Iterator');
};


/***/ }),
/* 45 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
var anObject = __webpack_require__(11);
var dPs = __webpack_require__(46);
var enumBugKeys = __webpack_require__(31);
var IE_PROTO = __webpack_require__(19)('IE_PROTO');
var Empty = function () { /* empty */ };
var PROTOTYPE = 'prototype';

// Create object with fake `null` prototype: use iframe Object with cleared prototype
var createDict = function () {
  // Thrash, waste and sodomy: IE GC bug
  var iframe = __webpack_require__(23)('iframe');
  var i = enumBugKeys.length;
  var lt = '<';
  var gt = '>';
  var iframeDocument;
  iframe.style.display = 'none';
  __webpack_require__(50).appendChild(iframe);
  iframe.src = 'javascript:'; // eslint-disable-line no-script-url
  // createDict = iframe.contentWindow.Object;
  // html.removeChild(iframe);
  iframeDocument = iframe.contentWindow.document;
  iframeDocument.open();
  iframeDocument.write(lt + 'script' + gt + 'document.F=Object' + lt + '/script' + gt);
  iframeDocument.close();
  createDict = iframeDocument.F;
  while (i--) delete createDict[PROTOTYPE][enumBugKeys[i]];
  return createDict();
};

module.exports = Object.create || function create(O, Properties) {
  var result;
  if (O !== null) {
    Empty[PROTOTYPE] = anObject(O);
    result = new Empty();
    Empty[PROTOTYPE] = null;
    // add "__proto__" for Object.getPrototypeOf polyfill
    result[IE_PROTO] = O;
  } else result = createDict();
  return Properties === undefined ? result : dPs(result, Properties);
};


/***/ }),
/* 46 */
/***/ (function(module, exports, __webpack_require__) {

var dP = __webpack_require__(8);
var anObject = __webpack_require__(11);
var getKeys = __webpack_require__(24);

module.exports = __webpack_require__(6) ? Object.defineProperties : function defineProperties(O, Properties) {
  anObject(O);
  var keys = getKeys(Properties);
  var length = keys.length;
  var i = 0;
  var P;
  while (length > i) dP.f(O, P = keys[i++], Properties[P]);
  return O;
};


/***/ }),
/* 47 */
/***/ (function(module, exports, __webpack_require__) {

var has = __webpack_require__(12);
var toIObject = __webpack_require__(25);
var arrayIndexOf = __webpack_require__(48)(false);
var IE_PROTO = __webpack_require__(19)('IE_PROTO');

module.exports = function (object, names) {
  var O = toIObject(object);
  var i = 0;
  var result = [];
  var key;
  for (key in O) if (key != IE_PROTO) has(O, key) && result.push(key);
  // Don't enum bug & hidden keys
  while (names.length > i) if (has(O, key = names[i++])) {
    ~arrayIndexOf(result, key) || result.push(key);
  }
  return result;
};


/***/ }),
/* 48 */
/***/ (function(module, exports, __webpack_require__) {

// false -> Array#indexOf
// true  -> Array#includes
var toIObject = __webpack_require__(25);
var toLength = __webpack_require__(28);
var toAbsoluteIndex = __webpack_require__(49);
module.exports = function (IS_INCLUDES) {
  return function ($this, el, fromIndex) {
    var O = toIObject($this);
    var length = toLength(O.length);
    var index = toAbsoluteIndex(fromIndex, length);
    var value;
    // Array#includes uses SameValueZero equality algorithm
    // eslint-disable-next-line no-self-compare
    if (IS_INCLUDES && el != el) while (length > index) {
      value = O[index++];
      // eslint-disable-next-line no-self-compare
      if (value != value) return true;
    // Array#indexOf ignores holes, Array#includes - not
    } else for (;length > index; index++) if (IS_INCLUDES || index in O) {
      if (O[index] === el) return IS_INCLUDES || index || 0;
    } return !IS_INCLUDES && -1;
  };
};


/***/ }),
/* 49 */
/***/ (function(module, exports, __webpack_require__) {

var toInteger = __webpack_require__(13);
var max = Math.max;
var min = Math.min;
module.exports = function (index, length) {
  index = toInteger(index);
  return index < 0 ? max(index + length, 0) : min(index, length);
};


/***/ }),
/* 50 */
/***/ (function(module, exports, __webpack_require__) {

var document = __webpack_require__(7).document;
module.exports = document && document.documentElement;


/***/ }),
/* 51 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.9 / 15.2.3.2 Object.getPrototypeOf(O)
var has = __webpack_require__(12);
var toObject = __webpack_require__(20);
var IE_PROTO = __webpack_require__(19)('IE_PROTO');
var ObjectProto = Object.prototype;

module.exports = Object.getPrototypeOf || function (O) {
  O = toObject(O);
  if (has(O, IE_PROTO)) return O[IE_PROTO];
  if (typeof O.constructor == 'function' && O instanceof O.constructor) {
    return O.constructor.prototype;
  } return O instanceof Object ? ObjectProto : null;
};


/***/ }),
/* 52 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var ctx = __webpack_require__(22);
var $export = __webpack_require__(9);
var toObject = __webpack_require__(20);
var call = __webpack_require__(53);
var isArrayIter = __webpack_require__(54);
var toLength = __webpack_require__(28);
var createProperty = __webpack_require__(55);
var getIterFn = __webpack_require__(56);

$export($export.S + $export.F * !__webpack_require__(58)(function (iter) { Array.from(iter); }), 'Array', {
  // 22.1.2.1 Array.from(arrayLike, mapfn = undefined, thisArg = undefined)
  from: function from(arrayLike /* , mapfn = undefined, thisArg = undefined */) {
    var O = toObject(arrayLike);
    var C = typeof this == 'function' ? this : Array;
    var aLen = arguments.length;
    var mapfn = aLen > 1 ? arguments[1] : undefined;
    var mapping = mapfn !== undefined;
    var index = 0;
    var iterFn = getIterFn(O);
    var length, result, step, iterator;
    if (mapping) mapfn = ctx(mapfn, aLen > 2 ? arguments[2] : undefined, 2);
    // if object isn't iterable or it's array with default iterator - use simple case
    if (iterFn != undefined && !(C == Array && isArrayIter(iterFn))) {
      for (iterator = iterFn.call(O), result = new C(); !(step = iterator.next()).done; index++) {
        createProperty(result, index, mapping ? call(iterator, mapfn, [step.value, index], true) : step.value);
      }
    } else {
      length = toLength(O.length);
      for (result = new C(length); length > index; index++) {
        createProperty(result, index, mapping ? mapfn(O[index], index) : O[index]);
      }
    }
    result.length = index;
    return result;
  }
});


/***/ }),
/* 53 */
/***/ (function(module, exports, __webpack_require__) {

// call something on iterator step with safe closing on error
var anObject = __webpack_require__(11);
module.exports = function (iterator, fn, value, entries) {
  try {
    return entries ? fn(anObject(value)[0], value[1]) : fn(value);
  // 7.4.6 IteratorClose(iterator, completion)
  } catch (e) {
    var ret = iterator['return'];
    if (ret !== undefined) anObject(ret.call(iterator));
    throw e;
  }
};


/***/ }),
/* 54 */
/***/ (function(module, exports, __webpack_require__) {

// check on default Array iterator
var Iterators = __webpack_require__(18);
var ITERATOR = __webpack_require__(3)('iterator');
var ArrayProto = Array.prototype;

module.exports = function (it) {
  return it !== undefined && (Iterators.Array === it || ArrayProto[ITERATOR] === it);
};


/***/ }),
/* 55 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $defineProperty = __webpack_require__(8);
var createDesc = __webpack_require__(17);

module.exports = function (object, index, value) {
  if (index in object) $defineProperty.f(object, index, createDesc(0, value));
  else object[index] = value;
};


/***/ }),
/* 56 */
/***/ (function(module, exports, __webpack_require__) {

var classof = __webpack_require__(57);
var ITERATOR = __webpack_require__(3)('iterator');
var Iterators = __webpack_require__(18);
module.exports = __webpack_require__(5).getIteratorMethod = function (it) {
  if (it != undefined) return it[ITERATOR]
    || it['@@iterator']
    || Iterators[classof(it)];
};


/***/ }),
/* 57 */
/***/ (function(module, exports, __webpack_require__) {

// getting tag from 19.1.3.6 Object.prototype.toString()
var cof = __webpack_require__(27);
var TAG = __webpack_require__(3)('toStringTag');
// ES3 wrong here
var ARG = cof(function () { return arguments; }()) == 'Arguments';

// fallback for IE11 Script Access Denied error
var tryGet = function (it, key) {
  try {
    return it[key];
  } catch (e) { /* empty */ }
};

module.exports = function (it) {
  var O, T, B;
  return it === undefined ? 'Undefined' : it === null ? 'Null'
    // @@toStringTag case
    : typeof (T = tryGet(O = Object(it), TAG)) == 'string' ? T
    // builtinTag case
    : ARG ? cof(O)
    // ES3 arguments fallback
    : (B = cof(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : B;
};


/***/ }),
/* 58 */
/***/ (function(module, exports, __webpack_require__) {

var ITERATOR = __webpack_require__(3)('iterator');
var SAFE_CLOSING = false;

try {
  var riter = [7][ITERATOR]();
  riter['return'] = function () { SAFE_CLOSING = true; };
  // eslint-disable-next-line no-throw-literal
  Array.from(riter, function () { throw 2; });
} catch (e) { /* empty */ }

module.exports = function (exec, skipClosing) {
  if (!skipClosing && !SAFE_CLOSING) return false;
  var safe = false;
  try {
    var arr = [7];
    var iter = arr[ITERATOR]();
    iter.next = function () { return { done: safe = true }; };
    arr[ITERATOR] = function () { return iter; };
    exec(arr);
  } catch (e) { /* empty */ }
  return safe;
};


/***/ }),
/* 59 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(60), __esModule: true };

/***/ }),
/* 60 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(61);
var $Object = __webpack_require__(5).Object;
module.exports = function defineProperty(it, key, desc) {
  return $Object.defineProperty(it, key, desc);
};


/***/ }),
/* 61 */
/***/ (function(module, exports, __webpack_require__) {

var $export = __webpack_require__(9);
// 19.1.2.4 / 15.2.3.6 Object.defineProperty(O, P, Attributes)
$export($export.S + $export.F * !__webpack_require__(6), 'Object', { defineProperty: __webpack_require__(8).f });


/***/ }),
/* 62 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(63);
module.exports = __webpack_require__(5).Object.assign;


/***/ }),
/* 63 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.3.1 Object.assign(target, source)
var $export = __webpack_require__(9);

$export($export.S + $export.F, 'Object', { assign: __webpack_require__(64) });


/***/ }),
/* 64 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// 19.1.2.1 Object.assign(target, source, ...)
var DESCRIPTORS = __webpack_require__(6);
var getKeys = __webpack_require__(24);
var gOPS = __webpack_require__(65);
var pIE = __webpack_require__(66);
var toObject = __webpack_require__(20);
var IObject = __webpack_require__(26);
var $assign = Object.assign;

// should work with symbols and should have deterministic property order (V8 bug)
module.exports = !$assign || __webpack_require__(16)(function () {
  var A = {};
  var B = {};
  // eslint-disable-next-line no-undef
  var S = Symbol();
  var K = 'abcdefghijklmnopqrst';
  A[S] = 7;
  K.split('').forEach(function (k) { B[k] = k; });
  return $assign({}, A)[S] != 7 || Object.keys($assign({}, B)).join('') != K;
}) ? function assign(target, source) { // eslint-disable-line no-unused-vars
  var T = toObject(target);
  var aLen = arguments.length;
  var index = 1;
  var getSymbols = gOPS.f;
  var isEnum = pIE.f;
  while (aLen > index) {
    var S = IObject(arguments[index++]);
    var keys = getSymbols ? getKeys(S).concat(getSymbols(S)) : getKeys(S);
    var length = keys.length;
    var j = 0;
    var key;
    while (length > j) {
      key = keys[j++];
      if (!DESCRIPTORS || isEnum.call(S, key)) T[key] = S[key];
    }
  } return T;
} : $assign;


/***/ }),
/* 65 */
/***/ (function(module, exports) {

exports.f = Object.getOwnPropertySymbols;


/***/ }),
/* 66 */
/***/ (function(module, exports) {

exports.f = {}.propertyIsEnumerable;


/***/ }),
/* 67 */,
/* 68 */,
/* 69 */,
/* 70 */,
/* 71 */,
/* 72 */,
/* 73 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);

// EXTERNAL MODULE: external "jQuery"
var external_jQuery_ = __webpack_require__(0);
var external_jQuery_default = /*#__PURE__*/__webpack_require__.n(external_jQuery_);

// EXTERNAL MODULE: ./node_modules/babel-runtime/core-js/array/from.js
var from = __webpack_require__(4);
var from_default = /*#__PURE__*/__webpack_require__.n(from);

// EXTERNAL MODULE: ./node_modules/babel-runtime/helpers/classCallCheck.js
var classCallCheck = __webpack_require__(1);
var classCallCheck_default = /*#__PURE__*/__webpack_require__.n(classCallCheck);

// EXTERNAL MODULE: ./node_modules/babel-runtime/helpers/createClass.js
var createClass = __webpack_require__(2);
var createClass_default = /*#__PURE__*/__webpack_require__.n(createClass);

// CONCATENATED MODULE: ./src/utils.js
// checks if box1 and box2 overlap
function overlapping(box1, box2) {
	var overlappingX = box1.x + box1.width >= box2.x && box2.x + box2.width >= box1.x;
	var overlappingY = box1.y + box1.height >= box2.y && box2.y + box2.height >= box1.y;
	return overlappingX && overlappingY;
}

// chechks if box1 is completely inside box2
function inside(box1, box2) {
	var insideX = box1.x >= box2.x && box1.x + box1.width <= box2.x + box2.width;
	var insideY = box1.y >= box2.y && box1.y + box1.height <= box2.y + box2.height;
	return insideX && insideY;
}

// chechks if box1 is completely inside box2
function insideHalf(box1, box2) {
	var insideX = box1.x + box1.width / 2 >= box2.x && box2.x + box2.width >= box1.x + box1.width / 2;
	var insideY = box1.y + box1.height / 2 >= box2.y && box2.y + box2.height >= box1.y + box1.height / 2;
	return insideX && insideY;
}

function reloadRellax(element) {
	var rellax = jQuery(element).data('rellax');

	if (rellax) {
		rellax._reset();
		rellax._cachePosition();
		rellax._prepareElement();
		rellax._updatePosition();
	}
}
// CONCATENATED MODULE: ./src/components/globalService.js



var globalService_GlobalService = function () {
	function GlobalService() {
		classCallCheck_default()(this, GlobalService);

		this.props = {};
		this.renderCallbacks = [];
		this.updateCallbacks = [];
		this.frameRendered = true;
		var updateProps = this.updateProps.bind(this);
		var updateScroll = this.updateScroll.bind(this);
		updateProps();
		updateScroll();
		document.addEventListener('DOMContentLoaded', updateProps);
		window.addEventListener('resize', updateProps);
		window.addEventListener('load', updateProps);
		window.addEventListener('scroll', updateScroll);
		window.requestAnimationFrame(this.renderLoop.bind(this));
	}

	createClass_default()(GlobalService, [{
		key: 'renderLoop',
		value: function renderLoop() {
			if (!this.frameRendered) {
				this.renderStuff();
				this.frameRendered = true;
			}
			window.requestAnimationFrame(this.renderLoop.bind(this));
		}
	}, {
		key: 'registerRender',
		value: function registerRender(fn) {
			if (typeof fn === "function" && this.renderCallbacks.indexOf(fn) < 0) {
				this.renderCallbacks.push(fn);
			}
		}
	}, {
		key: 'renderStuff',
		value: function renderStuff() {
			this.renderCallbacks.forEach(function (fn) {
				fn();
			});
		}
	}, {
		key: 'registerUpdate',
		value: function registerUpdate(fn) {
			if (typeof fn === "function" && this.updateCallbacks.indexOf(fn) < 0) {
				this.updateCallbacks.push(fn);
			}
		}
	}, {
		key: 'updateStuff',
		value: function updateStuff() {
			this.updateCallbacks.forEach(function (fn) {
				fn();
			});
		}
	}, {
		key: 'updateScroll',
		value: function updateScroll() {
			this.props.scrollY = window.scrollY;
			this.props.scrollX = window.scrollX;
			this.frameRendered = false;
		}
	}, {
		key: 'updateProps',
		value: function updateProps() {
			var body = document.body;
			var html = document.documentElement;
			var bodyScrollHeight = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight);
			var htmlScrollHeight = Math.max(html.scrollHeight, html.offsetHeight);

			this.props.scrollHeight = Math.max(bodyScrollHeight, htmlScrollHeight);
			this.props.adminBarHeight = this.getAdminBarHeight();

			this.props.windowWidth = window.innerWidth;
			this.props.windowHeight = window.innerHeight;
			this.updateScroll();
			this.updateStuff();
		}
	}, {
		key: 'getAdminBarHeight',
		value: function getAdminBarHeight() {
			var adminBar = document.getElementById('wpadminbar');

			if (adminBar) {
				var box = adminBar.getBoundingClientRect();
				return box.height;
			}

			return 0;
		}
	}, {
		key: 'getProps',
		value: function getProps() {
			return this.props;
		}
	}, {
		key: 'getProp',
		value: function getProp(propName) {
			return this.props[propName];
		}
	}]);

	return GlobalService;
}();

/* harmony default export */ var globalService = (new globalService_GlobalService());
// EXTERNAL MODULE: ./node_modules/babel-runtime/helpers/toConsumableArray.js
var toConsumableArray = __webpack_require__(33);
var toConsumableArray_default = /*#__PURE__*/__webpack_require__.n(toConsumableArray);

// CONCATENATED MODULE: ./src/components/hero.js






var hero_Hero = function () {
	function Hero(element) {
		var _this = this;

		classCallCheck_default()(this, Hero);

		this.element = element;
		this.progress = 0;
		this.timeline = new TimelineMax({ paused: true, onComplete: function onComplete() {
				_this.paused = true;
			} });
		this.pieces = this.getMarkupPieces();
		this.paused = false;
		this.offset = 0;
		this.update();
		this.updateOnScroll();
		this.init();
	}

	createClass_default()(Hero, [{
		key: 'init',
		value: function init() {
			var _this2 = this;

			globalService.registerUpdate(function () {
				_this2.update();
			});

			globalService.registerRender(function () {
				_this2.updateOnScroll();
			});

			this.addIntroToTimeline();
			this.timeline.addLabel('middle');
			this.addOutroToTimeline();
			this.timeline.addLabel('end');

			this.pauseTimelineOnScroll();
			this.timeline.play();
		}
	}, {
		key: 'update',
		value: function update() {
			this.box = this.element.getBoundingClientRect();
			this.view = {
				x: this.box.x,
				y: this.box.y + scrollY,
				width: this.box.width,
				height: this.box.height
			};
		}
	}, {
		key: 'updateOnScroll',
		value: function updateOnScroll() {
			var _GlobalService$getPro = globalService.getProps(),
			    scrollY = _GlobalService$getPro.scrollY,
			    scrollHeight = _GlobalService$getPro.scrollHeight,
			    windowHeight = _GlobalService$getPro.windowHeight;

			// used to calculate animation progress


			var length = windowHeight * 0.5;
			var middleMin = 0;
			var middleMax = scrollHeight - windowHeight - length * 0.5;
			var middle = this.view.y + (this.box.height - windowHeight) * 0.5;
			var middleMid = Math.max(middleMin, Math.min(middle, middleMax));

			this.start = middleMid - length * 0.5;
			this.end = this.start + length;

			this.progress = (scrollY - this.start) / (this.end - this.start);
			this.updateTimelineOnScroll();
		}
	}, {
		key: 'updateTimelineOnScroll',
		value: function updateTimelineOnScroll() {

			if (!this.paused) {
				return;
			}

			var currentProgress = this.timeline.progress();
			var middleTime = this.timeline.getLabelTime('middle');
			var endTime = this.timeline.getLabelTime('end');

			// ( this.progress - 0.5 ) / ( 1 - 0.5 ) = ( newTlProgress - minTlProgress ) / ( 1 - minTlProgress );
			// ( this.progress - 0.5 ) * 2 * ( 1 - minTlProgress ) = ( newTlProgress - minTlProgress );
			// newTlProgress = ( this.progress - 0.5 ) * 2 * ( 1 - minTlProgress ) + minTlProgress;
			var minTlProgress = middleTime / endTime;
			var newTlProgress = (this.progress - 0.5) * 2 * (1 - minTlProgress) + minTlProgress;
			newTlProgress = Math.min(Math.max(minTlProgress, newTlProgress), 1);

			if (currentProgress === newTlProgress) {
				return;
			}

			this.timeline.progress(newTlProgress);
		}
	}, {
		key: 'getMarkupPieces',
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

			return { headline: headline, title: title, subtitle: subtitle, separator: separator, sepFlower: sepFlower, sepLine: sepLine, sepArrow: sepArrow, othersBefore: othersBefore, othersAfter: othersAfter };
		}
	}, {
		key: 'addIntroToTimeline',
		value: function addIntroToTimeline() {
			var timeline = this.timeline;

			var _GlobalService$getPro2 = globalService.getProps(),
			    windowWidth = _GlobalService$getPro2.windowWidth;

			var _pieces = this.pieces,
			    headline = _pieces.headline,
			    title = _pieces.title,
			    subtitle = _pieces.subtitle,
			    separator = _pieces.separator,
			    sepFlower = _pieces.sepFlower,
			    sepLine = _pieces.sepLine,
			    sepArrow = _pieces.sepArrow,
			    othersBefore = _pieces.othersBefore,
			    othersAfter = _pieces.othersAfter;


			if (title.length && title.text().trim().length) {

				var splitTitle = new SplitText(title, { wordsClass: 'c-headline__word' });

				splitTitle.lines.forEach(function (line) {
					var words = from_default()(line.children);
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
				}, 0);

				// aici era title dar facea un glitch ciudat
				timeline.fromTo(headline, 1, {
					'y': 30
				}, {
					'y': 0,
					ease: Expo.easeOut
				}, 0);
			}

			if (subtitle.length) {
				timeline.fromTo(subtitle, 0.65, { opacity: 0 }, { opacity: 1, ease: Quint.easeOut }, '-=0.65');
				timeline.fromTo(subtitle, 0.9, { y: 30 }, { y: 0, ease: Quint.easeOut }, '-=0.65');
			}

			if (separator.length) {

				if (sepFlower.length) {
					timeline.fromTo(sepFlower, 0.15, { opacity: 0 }, { opacity: 1, ease: Quint.easeOut }, '-=0.6');
					timeline.fromTo(sepFlower, 0.55, { rotation: -270 }, { rotation: 0, ease: Back.easeOut }, '-=0.5');
				}

				if (sepLine.length) {
					timeline.fromTo(sepLine, 0.6, { width: 0 }, { width: '42%', opacity: 1, ease: Quint.easeOut }, '-=0.55');
					timeline.fromTo(separator, 0.6, { width: 0 }, { width: '100%', opacity: 1, ease: Quint.easeOut }, '-=0.6');
				}

				if (sepArrow.length) {
					timeline.fromTo(sepArrow, 0.2, { opacity: 0 }, { opacity: 1, ease: Quint.easeOut }, '-=0.27');
				}
			}

			if (othersAfter.length) {
				timeline.fromTo(othersAfter, 0.5, { opacity: 0 }, { opacity: 1, ease: Quint.easeOut }, '-=0.28');
				timeline.fromTo(othersAfter, 0.75, { y: -20 }, { y: 0 }, '-=0.5');
			}

			if (othersBefore.length) {
				timeline.fromTo(othersBefore, 0.5, { opacity: 0 }, { opacity: 1, ease: Quint.easeOut }, '-=0.75');
				timeline.fromTo(othersBefore, 0.75, { y: 20 }, { y: 0 }, '-=0.75');
			}

			this.timeline = timeline;
		}
	}, {
		key: 'addOutroToTimeline',
		value: function addOutroToTimeline() {
			var _pieces2 = this.pieces,
			    title = _pieces2.title,
			    subtitle = _pieces2.subtitle,
			    othersBefore = _pieces2.othersBefore,
			    othersAfter = _pieces2.othersAfter,
			    separator = _pieces2.separator,
			    sepLine = _pieces2.sepLine,
			    sepFlower = _pieces2.sepFlower,
			    sepArrow = _pieces2.sepArrow;

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

			timeline.to(sepLine, 0.86, { width: '0%', opacity: 0, ease: Quad.easeIn }, '-=0.94');
			timeline.to(separator, 0.86, { width: '0%', opacity: 0, ease: Quad.easeIn }, '-=0.86');
			timeline.to(sepFlower, 1, { rotation: 180 }, '-=1.08');
			timeline.to(sepFlower, 0.11, { opacity: 0 }, '-=0.03');
			timeline.to(sepArrow, 0.14, { opacity: 0 }, '-=1.08');

			this.timeline = timeline;
		}
	}, {
		key: 'pauseTimelineOnScroll',
		value: function pauseTimelineOnScroll() {
			var _this3 = this;

			var middleTime = this.timeline.getLabelTime('middle');
			var endTime = this.timeline.getLabelTime('end');

			this.timeline.eventCallback('onUpdate', function (tl) {
				var time = tl.time();

				// calculate the current timeline progress relative to middle and end labels
				// in such a way that timelineProgress is 0.5 for middle and 1 for end
				// because we don't want the animation to be stopped before the middle label
				var tlProgress = (time - middleTime) / (endTime - middleTime);
				var pastMiddle = time > middleTime;
				var pastScroll = tlProgress * 0.5 + 0.5 >= _this3.progress;

				if (pastMiddle && pastScroll) {
					tl.pause();
					_this3.timeline.eventCallback('onUpdate', null);
					_this3.paused = true;
				}
			}, ["{self}"]);
		}
	}]);

	return Hero;
}();

/* harmony default export */ var components_hero = (hero_Hero);
// EXTERNAL MODULE: ./node_modules/babel-runtime/core-js/object/assign.js
var object_assign = __webpack_require__(34);
var assign_default = /*#__PURE__*/__webpack_require__.n(object_assign);

// CONCATENATED MODULE: ./src/components/header.js






var defaults = {
	offsetTargetElement: null
};

var header_Header = function () {
	function Header(element, args) {
		classCallCheck_default()(this, Header);

		if (!element) return;

		this.element = element;
		this.options = assign_default()({}, defaults, args);

		this.$header = external_jQuery_default()(this.element);
		this.$toggle = external_jQuery_default()('.c-menu-toggle');
		this.$toggleWrap = external_jQuery_default()('.c-menu-toggle__wrap');

		this.scrolled = false;
		this.inversed = false;

		this.offset = 0;
		this.scrollOffset = 0;
		this.mobileHeaderHeight = 0;

		this.createMobileHeader();

		this.onResize();
		globalService.registerUpdate(this.onResize.bind(this));

		this.timeline = this.getInroTimeline();
		this.timeline.play();
	}

	createClass_default()(Header, [{
		key: 'initialize',
		value: function initialize() {
			this.$header.addClass('site-header--fixed site-header--ready');
			this.$mobileHeader.addClass('site-header--fixed site-header--ready');
		}
	}, {
		key: 'update',
		value: function update() {
			this.updatePageOffset();
			this.updateHeaderOffset();
			this.updateMobileHeaderOffset();
		}
	}, {
		key: 'getInroTimeline',
		value: function getInroTimeline() {
			var element = this.element;
			var timeline = new TimelineMax({ paused: true });
			var height = external_jQuery_default()(element).outerHeight();
			var transitionEasing = Power4.easeOut;
			var transitionDuration = 0.5;
			timeline.to(element, transitionDuration, { opacity: 1, ease: transitionEasing }, 0);
			timeline.to({ height: 0 }, transitionDuration, {
				height: height,
				onUpdate: this.onHeightUpdate.bind(this),
				onUpdateParams: ["{self}"],
				onComplete: this.initialize.bind(this),
				ease: transitionEasing
			}, 0);

			return timeline;
		}
	}, {
		key: 'onHeightUpdate',
		value: function onHeightUpdate(tween) {
			this.getProps();
			this.box = assign_default()(this.box, { height: tween.target.height });
			this.setVisibleHeaderHeight();
			this.update();
		}
	}, {
		key: 'getMobileHeaderHeight',
		value: function getMobileHeaderHeight() {
			var mobileHeaderHeight = this.$mobileHeader.css('height', '').outerHeight();
			var toggleHeight = this.$toggleWrap.css('height', '').outerHeight();

			return Math.max(mobileHeaderHeight, toggleHeight);
		}
	}, {
		key: 'isMobileHeaderVisibile',
		value: function isMobileHeaderVisibile() {
			return this.$mobileHeader.is(':visible');
		}
	}, {
		key: 'setVisibleHeaderHeight',
		value: function setVisibleHeaderHeight() {
			this.visibleHeaderHeight = this.isMobileHeaderVisibile() ? this.mobileHeaderHeight : this.box.height;
		}
	}, {
		key: 'getProps',
		value: function getProps() {
			this.box = this.element.getBoundingClientRect();
			this.scrollOffset = this.getScrollOffset();
			this.mobileHeaderHeight = this.getMobileHeaderHeight();
		}
	}, {
		key: 'onResize',
		value: function onResize() {
			this.getProps();
			this.setVisibleHeaderHeight();
			this.update();
		}
	}, {
		key: 'updateHeaderOffset',
		value: function updateHeaderOffset() {
			if (!this.element) return;

			this.element.style.marginTop = this.offset + 'px';
		}
	}, {
		key: 'updateMobileHeaderOffset',
		value: function updateMobileHeaderOffset() {
			if (!this.$mobileHeader) return;

			this.$mobileHeader.css({
				height: this.mobileHeaderHeight,
				marginTop: this.offset + 'px'
			});

			external_jQuery_default()('.site-header__inner-container').css({
				marginTop: this.mobileHeaderHeight
			});

			this.$toggleWrap.css({
				height: this.mobileHeaderHeight,
				marginTop: this.offset + 'px'
			});
		}
	}, {
		key: 'getScrollOffset',
		value: function getScrollOffset() {
			var _GlobalService$getPro = globalService.getProps(),
			    adminBarHeight = _GlobalService$getPro.adminBarHeight,
			    scrollY = _GlobalService$getPro.scrollY;

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
		key: 'updatePageOffset',
		value: function updatePageOffset() {
			var page = document.getElementById('page');
			page.style.paddingTop = this.visibleHeaderHeight + this.offset + 'px';
		}
	}, {
		key: 'createMobileHeader',
		value: function createMobileHeader() {
			if (this.createdMobileHeader) {
				return;
			}

			this.$mobileHeader = external_jQuery_default()('<div class="site-header--mobile">');

			external_jQuery_default()('.c-branding').clone().appendTo(this.$mobileHeader);
			external_jQuery_default()('.menu-item--cart').clone().appendTo(this.$mobileHeader);

			this.$mobileHeader.insertAfter(this.$toggle);
			this.createdMobileHeader = true;
		}
	}, {
		key: 'render',
		value: function render(inversed) {
			if (!this.element) return;

			var _GlobalService$getPro2 = globalService.getProps(),
			    scrollY = _GlobalService$getPro2.scrollY;

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
	}]);

	return Header;
}();

/* harmony default export */ var components_header = (header_Header);
// EXTERNAL MODULE: ./node_modules/js-cookie/src/js.cookie.js
var js_cookie = __webpack_require__(35);
var js_cookie_default = /*#__PURE__*/__webpack_require__.n(js_cookie);

// CONCATENATED MODULE: ./src/components/announcement-bar.js






var announcement_bar_AnnouncementBar = function () {
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
		globalService.registerUpdate(this.onResize.bind(this));

		//		if ( typeof this.timeline !== "undefined" ) {
		//		console.log( this.timeline );
		this.timeline.play();
		//		}

		this.bindEvents();
	}

	createClass_default()(AnnouncementBar, [{
		key: 'onResize',
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
		key: 'getPieces',
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
		key: 'getTimeline',
		value: function getTimeline() {
			var transitionDuration = this.transitionDuration,
			    transitionEasing = this.transitionEasing,
			    _pieces = this.pieces,
			    element = _pieces.element,
			    wrapper = _pieces.wrapper,
			    content = _pieces.content,
			    close = _pieces.close;


			var timeline = new TimelineMax({ paused: true });
			var height = wrapper.outerHeight();
			timeline.fromTo(element, transitionDuration, { height: 0 }, { height: height, ease: transitionEasing }, 0);
			timeline.to({ height: 0 }, transitionDuration, {
				height: height,
				onUpdate: this.onHeightUpdate.bind(this),
				onUpdateParams: ["{self}"],
				ease: transitionEasing
			}, 0);

			return timeline;
		}
	}, {
		key: 'bindEvents',
		value: function bindEvents() {
			this.pieces.close.on('click', this.onClose.bind(this));
		}
	}, {
		key: 'onClose',
		value: function onClose() {
			if (typeof this.timeline !== "undefined") {
				this.timeline.reverse();
			}
		}
	}, {
		key: 'onHeightUpdate',
		value: function onHeightUpdate(tween) {
			this.height = tween.target.height;

			if (this.parent) {
				this.parent.update();
			}
		}
	}]);

	return AnnouncementBar;
}();

/* harmony default export */ var announcement_bar = (announcement_bar_AnnouncementBar);
// CONCATENATED MODULE: ./src/components/promo-bar.js





var promo_bar_PromoBar = function () {
	function PromoBar(elements, args) {
		var _this = this;

		classCallCheck_default()(this, PromoBar);

		var announcementElementsArray = from_default()(elements);

		this.bars = announcementElementsArray.map(function (element) {
			return new announcement_bar(element, {
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

/* harmony default export */ var promo_bar = (promo_bar_PromoBar);
// CONCATENATED MODULE: ./src/components/navbar.js





var MENU_ITEM = '.menu-item, .page_item';
var MENU_ITEM_WITH_CHILDREN = '.menu-item-has-children, .page_item_has_children';
var SUBMENU = '.sub-menu, .children';
var SUBMENU_LEFT_CLASS = 'has-submenu-left';
var HOVER_CLASS = 'hover';

var navbar_Navbar = function () {
	function Navbar() {
		classCallCheck_default()(this, Navbar);

		this.$menuItems = external_jQuery_default()(MENU_ITEM);
		this.$menuItemsWithChildren = this.$menuItems.filter(MENU_ITEM_WITH_CHILDREN).removeClass(HOVER_CLASS);
		this.$menuItemsWithChildrenLinks = this.$menuItemsWithChildren.children('a');

		this.initialize();
	}

	createClass_default()(Navbar, [{
		key: 'initialize',
		value: function initialize() {
			this.onResize();
			this.initialized = true;
			globalService.registerUpdate(this.onResize.bind(this));
		}
	}, {
		key: 'onResize',
		value: function onResize() {
			var mq = window.matchMedia("only screen and (min-width: 1000px)");

			// we are on desktop
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
		key: 'addSubMenusLeftClass',
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
		key: 'removeSubMenusLeftClass',
		value: function removeSubMenusLeftClass() {
			this.$menuItemsWithChildren.removeClass(SUBMENU_LEFT_CLASS);
		}
	}, {
		key: 'onClickMobile',
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
		key: 'bindClick',
		value: function bindClick() {
			this.$menuItemsWithChildrenLinks.on('click', this.onClickMobile);
		}
	}, {
		key: 'unbindClick',
		value: function unbindClick() {
			this.$menuItemsWithChildrenLinks.off('click', this.onClickMobile);
		}
	}, {
		key: 'bindHoverIntent',
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
		key: 'unbindHoverIntent',
		value: function unbindHoverIntent() {
			this.$menuItems.off('mousemove.hoverIntent mouseenter.hoverIntent mouseleave.hoverIntent');
			delete this.$menuItems.hoverIntent_t;
			delete this.$menuItems.hoverIntent_s;
		}
	}]);

	return Navbar;
}();

/* harmony default export */ var navbar = (navbar_Navbar);
// CONCATENATED MODULE: ./src/components/app.js












var app_App = function () {
	function App() {
		classCallCheck_default()(this, App);

		this.initializeHero();
		this.initializeHeader();
		this.initializeNavbar();
		this.initializePromoBar();
		this.checkWindowLocationComments();

		globalService.registerRender(this.render.bind(this));
	}

	createClass_default()(App, [{
		key: 'render',
		value: function render() {
			var _GlobalService$getPro = globalService.getProps(),
			    scrollY = _GlobalService$getPro.scrollY,
			    adminBarHeight = _GlobalService$getPro.adminBarHeight;

			var promoBar = this.promoBar;
			var header = this.header;
			var HeroCollection = this.HeroCollection;

			var overlap = HeroCollection.some(function (hero) {
				return insideHalf({
					x: header.box.x,
					y: header.box.y + scrollY,
					width: header.box.width,
					height: header.box.height
				}, {
					x: hero.box.x,
					y: hero.box.y + promoBar.height,
					width: hero.box.width,
					height: hero.box.height
				});
			});

			header.render(overlap);
		}
	}, {
		key: 'initializeHero',
		value: function initializeHero() {
			var heroElements = document.getElementsByClassName('novablocks-hero');
			var heroElementsArray = from_default()(heroElements);

			this.HeroCollection = heroElementsArray.map(function (element) {
				return new components_hero(element);
			});
			this.firstHero = heroElementsArray[0];
		}
	}, {
		key: 'initializeHeader',
		value: function initializeHeader() {
			var headerElement = external_jQuery_default()('.site-header').get(0);

			this.header = new components_header(headerElement);
		}
	}, {
		key: 'initializeNavbar',
		value: function initializeNavbar() {
			this.navbar = new navbar();
		}
	}, {
		key: 'initializePromoBar',
		value: function initializePromoBar() {
			var announcementBars = document.querySelectorAll('.promo-bar .novablocks-announcement-bar');

			this.promoBar = new promo_bar(announcementBars, {
				onUpdate: this.onPromoBarUpdate.bind(this)
			});
		}
	}, {
		key: 'onPromoBarUpdate',
		value: function onPromoBarUpdate(promoBar) {
			var header = this.header;
			var HeroCollection = this.HeroCollection;

			header.offset = promoBar.height;
			header.update();

			HeroCollection.forEach(function (hero) {
				hero.offset = promoBar.height;
				hero.updateOnScroll();

				var parallaxSelector = '.novablocks-slideshow__parallax, .novablocks-hero__parallax, .novablocks-map__parallax';
				var $parallaxBlocks = external_jQuery_default()('.has-parallax');
				var $parallaxElements = $parallaxBlocks.find('.novablocks-hero__parallax');

				$parallaxBlocks.find(parallaxSelector).each(function (i, obj) {
					reloadRellax(obj);
				});
			});
		}
	}, {
		key: 'checkWindowLocationComments',
		value: function checkWindowLocationComments() {
			if (window.location.href.indexOf("#comment") === -1) {
				external_jQuery_default()(".c-comments-toggle__checkbox").prop("checked", false);
			}
		}
	}]);

	return App;
}();

/* harmony default export */ var app = (app_App);
// CONCATENATED MODULE: ./src/scripts.js



function scripts_initialize() {
	new app();
}

external_jQuery_default()(function () {
	var $window = external_jQuery_default()(window);
	var $html = external_jQuery_default()('html');

	if (!$html.is('.wf-active')) {
		$window.on('wf-active', scripts_initialize);
	} else {
		scripts_initialize();
	}
});

/***/ })
/******/ ]);