/******/ (() => { // webpackBootstrap
/**
 * Project Color — Block editor sidebar panel.
 *
 * Adds a "Project Color" panel to the post/page editor sidebar
 * with a color picker, "Suggest from Image" button, and "Clear" button.
 *
 * Uses wp.element.createElement (no JSX) to avoid build complexity.
 */

(function () {
  var el = wp.element.createElement;
  var Fragment = wp.element.Fragment;
  var useState = wp.element.useState;
  var useEffect = wp.element.useEffect;
  var registerPlugin = wp.plugins.registerPlugin;
  var PluginDocumentSettingPanel = wp.editPost.PluginDocumentSettingPanel;
  var ColorIndicator = wp.components.ColorIndicator;
  var ColorPicker = wp.components.ColorPicker;
  var Button = wp.components.Button;
  var useSelect = wp.data.useSelect;
  var useDispatch = wp.data.useDispatch;
  var __ = wp.i18n.__;
  function ProjectColorPanel() {
    var postMeta = useSelect(function (select) {
      return select('core/editor').getEditedPostAttribute('meta') || {};
    }, []);
    var featuredImageId = useSelect(function (select) {
      return select('core/editor').getEditedPostAttribute('featured_media');
    }, []);
    var editPost = useDispatch('core/editor').editPost;
    var color = postMeta._project_color || '';
    var _useState = useState(false);
    var isSuggesting = _useState[0];
    var setIsSuggesting = _useState[1];
    var _useShowPicker = useState(!!color);
    var showPicker = _useShowPicker[0];
    var setShowPicker = _useShowPicker[1];
    function setColor(newColor) {
      editPost({
        meta: {
          _project_color: newColor
        }
      });
    }
    function clearColor() {
      setColor('');
      setShowPicker(false);
    }
    function suggestFromImage() {
      if (!featuredImageId) {
        return;
      }
      setIsSuggesting(true);
      var formData = new FormData();
      formData.append('action', 'anima_get_project_color');
      formData.append('nonce', animaProjectColor.nonce);
      formData.append('attachment_id', featuredImageId);
      fetch(animaProjectColor.ajaxUrl, {
        method: 'POST',
        credentials: 'same-origin',
        body: formData
      }).then(function (response) {
        return response.json();
      }).then(function (result) {
        if (result.success && result.data) {
          setColor(result.data);
          setShowPicker(true);
        }
        setIsSuggesting(false);
      }).catch(function () {
        setIsSuggesting(false);
      });
    }
    return el(PluginDocumentSettingPanel, {
      name: 'anima-project-color',
      title: __('Project Color', '__theme_txtd'),
      className: 'anima-project-color-panel'
    }, el('p', {
      className: 'description',
      style: {
        marginTop: 0,
        color: '#757575',
        fontSize: '12px'
      }
    }, __('Color used for page transition animation. Leave empty to use the accent color.', '__theme_txtd')),
    // Color indicator + clear button row
    color ? el('div', {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        marginBottom: '12px'
      }
    }, el(ColorIndicator, {
      colorValue: color
    }), el('code', {
      style: {
        fontSize: '12px'
      }
    }, color), el(Button, {
      variant: 'link',
      isDestructive: true,
      onClick: clearColor,
      style: {
        marginLeft: 'auto'
      }
    }, __('Clear', '__theme_txtd'))) : null,
    // Toggle picker button when no color is set
    !showPicker ? el(Button, {
      variant: 'secondary',
      onClick: function () {
        setShowPicker(true);
      },
      style: {
        marginBottom: '12px'
      }
    }, __('Choose Color', '__theme_txtd')) : null,
    // Color picker
    showPicker ? el(ColorPicker, {
      color: color || '#333333',
      onChangeComplete: function (value) {
        setColor(value.hex);
      },
      disableAlpha: true
    }) : null,
    // Suggest from image button
    el(Button, {
      variant: 'tertiary',
      onClick: suggestFromImage,
      disabled: !featuredImageId || isSuggesting,
      isBusy: isSuggesting,
      style: {
        marginTop: '8px'
      }
    }, isSuggesting ? __('Extracting...', '__theme_txtd') : __('Suggest from Featured Image', '__theme_txtd')), !featuredImageId ? el('p', {
      style: {
        color: '#757575',
        fontSize: '11px',
        marginTop: '4px'
      }
    }, __('Set a featured image first to use auto-suggestion.', '__theme_txtd')) : null);
  }
  registerPlugin('anima-project-color', {
    render: ProjectColorPanel,
    icon: 'art'
  });
})();
/******/ })()
;