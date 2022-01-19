/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 815:
/***/ (() => {

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

/***/ }),

/***/ 904:
/***/ (() => {

wp.domReady(() => {
  wp.blocks.registerBlockStyle('novablocks/menu-food-item', {
    name: 'rounded',
    label: 'Rounded'
  });
});

/***/ }),

/***/ 902:
/***/ (() => {

wp.domReady(() => {
  wp.blocks.registerBlockStyle('core/paragraph', {
    name: 'lead',
    label: 'Lead'
  });
});

/***/ }),

/***/ 749:
/***/ (() => {

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

/***/ })

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
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
/* harmony import */ var _blocks_button__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(815);
/* harmony import */ var _blocks_button__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_blocks_button__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _blocks_menu_item__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(904);
/* harmony import */ var _blocks_menu_item__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_blocks_menu_item__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _blocks_paragraph__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(902);
/* harmony import */ var _blocks_paragraph__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_blocks_paragraph__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _blocks_separator__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(749);
/* harmony import */ var _blocks_separator__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_blocks_separator__WEBPACK_IMPORTED_MODULE_3__);




})();

/******/ })()
;