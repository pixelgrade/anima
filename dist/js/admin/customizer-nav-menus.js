/******/ (() => { // webpackBootstrap
var __webpack_exports__ = {};
/**
 * Started from this wonderful solution provided by Weston Ruter: https://gist.github.com/westonruter/7f2b9c18113f0576a72e0aca3ce3dbcb
 */
(function () {
  // Augment each menu item control once it is added and embedded.
  wp.customize.control.bind('add', control => {
    if (control.extended(wp.customize.Menus.MenuItemControl)) {
      control.deferred.embedded.done(() => {
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
    if (control.container.find('.field-visual_style').length) {
      control.visualStyleField = control.container.find('.field-visual_style'); // Update the UI state when the setting changes programmatically.

      control.setting.bind(() => {
        updateVisualStyleControlFields(control);
      }); // Update the setting when the inputs are modified.

      control.visualStyleField.find('select').on('change', function () {
        setSettingVisualStyle(control.setting, this.value);
      }); // Set the initial UI state.

      let initialVisualStyle = updateVisualStyleControlFields(control); // Update the initial setting value.

      setSettingVisualStyle(control.setting, initialVisualStyle);
    }

    if (control.container.find('.field-badge').length) {
      control.badgeField = control.container.find('.field-badge'); // Update the UI state when the setting changes programmatically.

      control.setting.bind(() => {
        updateBadgeControlFields(control);
      });
      control.badgeField.find('input').on('input', function () {
        setSettingBadge(control.setting, this.value);
      }); // Set the initial UI state.

      let initialBadge = updateBadgeControlFields(control); // Update the initial setting value.

      setSettingBadge(control.setting, initialBadge);
    }
  }
  /**
   * Extend the setting with roles information.
   *
   * @param {wp.customize.Setting} setting
   * @param {string} visual_style
   */


  function setSettingVisualStyle(setting, visual_style) {
    setting.set(Object.assign({}, _.clone(setting()), {
      visual_style
    }));
  }
  /**
   * Extend the setting with roles information.
   *
   * @param {wp.customize.Setting} setting
   * @param {string} badge
   */


  function setSettingBadge(setting, badge) {
    setting.set(Object.assign({}, _.clone(setting()), {
      badge
    }));
  }
  /**
   * Apply the control's setting value to the control's fields (or the default value if that's the case).
   *
   * @param {wp.customize.Menus.MenuItemControl} control
   */


  function updateVisualStyleControlFields(control) {
    const defaultVisualStyle = control.visualStyleField.find('select').data('default') || 'label_icon';
    const visualStyle = control.setting().visual_style || defaultVisualStyle;
    control.visualStyleField.find('select').val(visualStyle);
    return visualStyle;
  }
  /**
   * Apply the control's setting value to the control's fields (or the default value if that's the case).
   *
   * @param {wp.customize.Menus.MenuItemControl} control
   */


  function updateBadgeControlFields(control) {
    const defaultBadge = control.badgeField.find('input').data('default') || '';
    const badge = control.setting().badge || defaultBadge;
    control.badgeField.find('input').val(badge);
    return badge;
  }
})();
/******/ })()
;