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
/******/ 	return __webpack_require__(__webpack_require__.s = 14);
/******/ })
/************************************************************************/
/******/ ({

/***/ 14:
/***/ (function(module, exports) {

/**
 * Started from this wonderful solution provided by Weston Ruter: https://gist.github.com/westonruter/7f2b9c18113f0576a72e0aca3ce3dbcb
 */
(function () {
  // Augment each menu item control once it is added and embedded.
  wp.customize.control.bind('add', function (control) {
    if (control.extended(wp.customize.Menus.MenuItemControl)) {
      control.deferred.embedded.done(function () {
        extendControl(control);
      });
    }
  });
  /**
   * Extend the control with our custom fields information.
   *
   * @param {wp.customize.Menus.MenuItemControl} control
   */

  function extendControl(control) {
    if (control.container.find('.field-visual_style').length < 1) {
      return;
    }

    control.visualStyleField = control.container.find('.field-visual_style'); // Update the UI state when the setting changes programmatically.

    control.setting.bind(function () {
      updateControlFields(control);
    }); // Update the setting when the inputs are modified.

    control.visualStyleField.find('select').on('change', function () {
      setSettingVisualStyle(control.setting, this.value);
    }); // Set the initial UI state.

    var initialVisualStyle = updateControlFields(control); // Update the initial setting value.

    setSettingVisualStyle(control.setting, initialVisualStyle);
  }
  /**
   * Extend the setting with roles information.
   *
   * @param {wp.customize.Setting} setting
   * @param {string} visual_style
   */


  function setSettingVisualStyle(setting, visual_style) {
    setting.set(Object.assign({}, _.clone(setting()), {
      visual_style: visual_style
    }));
  }
  /**
   * Apply the control's setting value to the control's fields (or the default value if that's the case).
   *
   * @param {wp.customize.Menus.MenuItemControl} control
   */


  function updateControlFields(control) {
    var defaultVisualStyle = control.visualStyleField.find('select').data('default') || 'label_icon';
    var visualStyle = control.setting().visual_style || defaultVisualStyle;
    control.visualStyleField.find('select').val(visualStyle);
    return visualStyle;
  }
})();

/***/ })

/******/ });