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
/******/ 	return __webpack_require__(__webpack_require__.s = 9);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */,
/* 1 */,
/* 2 */,
/* 3 */,
/* 4 */,
/* 5 */,
/* 6 */,
/* 7 */,
/* 8 */,
/* 9 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _blocks_button__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(10);
/* harmony import */ var _blocks_button__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_blocks_button__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _blocks_group__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(11);
/* harmony import */ var _blocks_group__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_blocks_group__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _blocks_menu_item__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(12);
/* harmony import */ var _blocks_menu_item__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_blocks_menu_item__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _blocks_paragraph__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(13);
/* harmony import */ var _blocks_paragraph__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_blocks_paragraph__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _blocks_separator__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(14);
/* harmony import */ var _blocks_separator__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_blocks_separator__WEBPACK_IMPORTED_MODULE_4__);






/***/ }),
/* 10 */
/***/ (function(module, exports) {

wp.domReady(function () {
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

/***/ }),
/* 11 */
/***/ (function(module, exports) {

var _wp$blockEditor = wp.blockEditor,
    InnerBlocks = _wp$blockEditor.InnerBlocks,
    getColorClassName = _wp$blockEditor.getColorClassName;
var deprecatedStyles = {
  'is-style-accent': '6',
  'is-style-dark': '9',
  'is-style-darker': '10'
};

function addDeprecatedGroup(settings, name) {
  if (name !== 'core/group') {
    return settings;
  }

  var newSettings = Object.assign({}, settings, {
    attributes: Object.assign({}, settings.attributes, {
      paletteVariation: {
        type: "string"
      }
    }),
    deprecated: [{
      attributes: settings.attributes,
      migrate: function migrate(attributes, innerBlocks) {
        var classAttr = attributes.className;
        var classes = classAttr.split(/\b\s+/);
        var paletteVariation = '0';
        var newClasses = classes.filter(function (className) {
          var isDeprecated = typeof deprecatedStyles[className] !== "undefined";

          if (isDeprecated) {
            paletteVariation = deprecatedStyles[className];
            return false;
          }

          return true;
        });
        newClasses.push("sm-variation-".concat(paletteVariation));
        return [Object.assign({}, attributes, {
          paletteVariation: paletteVariation,
          className: newClasses.join(" ")
        }), innerBlocks];
      },
      isEligible: function isEligible(attributes, innerBlocks) {
        var classAttr = attributes.className;

        if (typeof classAttr !== "string") {
          return false;
        }

        var classes = classAttr.split(/\b\s+/);
        return classes.some(function (className) {
          return Object.keys(deprecatedStyles).includes(className);
        });
      },
      save: settings.save
    }].concat(settings.deprecated)
  });
  console.log(newSettings);
  return newSettings;
}

wp.hooks.addFilter('blocks.registerBlockType', 'nova-blocks/deprecate-group', addDeprecatedGroup);

/***/ }),
/* 12 */
/***/ (function(module, exports) {

wp.domReady(function () {
  wp.blocks.registerBlockStyle('novablocks/menu-food-item', {
    name: 'rounded',
    label: 'Rounded'
  });
});

/***/ }),
/* 13 */
/***/ (function(module, exports) {

wp.domReady(function () {
  wp.blocks.registerBlockStyle('core/paragraph', {
    name: 'lead',
    label: 'Lead'
  });
});

/***/ }),
/* 14 */
/***/ (function(module, exports) {

wp.domReady(function () {
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
});

/***/ })
/******/ ]);