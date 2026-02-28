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
  var useState = wp.element.useState;
  var useEffect = wp.element.useEffect;
  var useRef = wp.element.useRef;
  var registerPlugin = wp.plugins.registerPlugin;
  var PluginDocumentSettingPanel = wp.editPost.PluginDocumentSettingPanel;
  var ColorIndicator = wp.components.ColorIndicator;
  var ColorPicker = wp.components.ColorPicker;
  var Button = wp.components.Button;
  var Notice = wp.components.Notice;
  var useSelect = wp.data.useSelect;
  var useDispatch = wp.data.useDispatch;
  var __ = wp.i18n.__;

  // Post type label map for the panel title.
  var postTypeLabels = {
    portfolio: __('Project Color', '__theme_txtd'),
    post: __('Post Color', '__theme_txtd'),
    page: __('Page Color', '__theme_txtd')
  };
  var defaultLabel = __('Transition Color', '__theme_txtd');

  /**
   * Fetch color from featured image via AJAX.
   *
   * @param {number} attachmentId Featured image attachment ID.
   * @param {number} postId       Current post ID.
   * @return {Promise<string>}    Hex color or empty string.
   */
  function fetchColorFromImage(attachmentId, postId) {
    var formData = new FormData();
    formData.append('action', 'anima_get_project_color');
    formData.append('nonce', animaProjectColor.nonce);
    formData.append('attachment_id', attachmentId);
    if (postId) {
      formData.append('post_id', postId);
    }
    return fetch(animaProjectColor.ajaxUrl, {
      method: 'POST',
      credentials: 'same-origin',
      body: formData
    }).then(function (response) {
      return response.json();
    }).then(function (result) {
      if (result.success && result.data) {
        return result.data;
      }
      return '';
    }).catch(function () {
      return '';
    });
  }
  function ProjectColorPanel() {
    var postMeta = useSelect(function (select) {
      return select('core/editor').getEditedPostAttribute('meta') || {};
    }, []);
    var featuredImageId = useSelect(function (select) {
      return select('core/editor').getEditedPostAttribute('featured_media');
    }, []);
    var postId = useSelect(function (select) {
      return select('core/editor').getCurrentPostId();
    }, []);
    var postType = useSelect(function (select) {
      return select('core/editor').getCurrentPostType();
    }, []);
    var editPost = useDispatch('core/editor').editPost;
    var manualColor = postMeta._project_color || '';
    var autoColor = postMeta._project_color_auto || '';
    var isAuto = !manualColor && !!autoColor;
    var color = manualColor || autoColor;
    var _useState = useState(false);
    var isSuggesting = _useState[0];
    var setIsSuggesting = _useState[1];
    var _useShowPicker = useState(!!manualColor);
    var showPicker = _useShowPicker[0];
    var setShowPicker = _useShowPicker[1];
    var _useNotice = useState(null);
    var notice = _useNotice[0];
    var setNotice = _useNotice[1];

    // Track the previous featured image ID to detect changes.
    var prevFeaturedImageRef = useRef(featuredImageId);
    function setManualColor(newColor) {
      editPost({
        meta: {
          _project_color: newColor
        }
      });
    }
    function setAutoColor(newColor) {
      editPost({
        meta: {
          _project_color_auto: newColor
        }
      });
    }
    function clearColor() {
      editPost({
        meta: {
          _project_color: '',
          _project_color_auto: ''
        }
      });
      setShowPicker(false);
      setNotice(null);
    }
    function suggestFromImage() {
      if (!featuredImageId) {
        return;
      }
      setIsSuggesting(true);
      setNotice(null);
      fetchColorFromImage(featuredImageId, postId).then(function (result) {
        if (result) {
          setManualColor(result);
          setShowPicker(true);
          setNotice({
            type: 'success',
            message: __('Color extracted: ', '__theme_txtd') + result
          });
        } else {
          setNotice({
            type: 'error',
            message: __('Could not extract color from image.', '__theme_txtd')
          });
        }
        setIsSuggesting(false);
      });
    }

    // Auto-suggest on mount: if no manual color and a featured image exists,
    // fetch and save as auto color (not manual).
    useEffect(function () {
      if (!manualColor && !autoColor && featuredImageId) {
        setIsSuggesting(true);
        fetchColorFromImage(featuredImageId, postId).then(function (result) {
          if (result) {
            setAutoColor(result);
          }
          setIsSuggesting(false);
        });
      }
    }, []); // eslint-disable-line react-hooks/exhaustive-deps -- run once on mount.

    // Re-suggest when featured image changes (after initial mount).
    useEffect(function () {
      if (prevFeaturedImageRef.current === featuredImageId) {
        return;
      }
      prevFeaturedImageRef.current = featuredImageId;
      if (!featuredImageId) {
        // Featured image removed — clear auto color.
        setAutoColor('');
        return;
      }

      // Only auto-suggest if no manual color is set.
      if (manualColor) {
        return;
      }
      setIsSuggesting(true);
      setAutoColor(''); // Clear stale auto color while fetching.
      fetchColorFromImage(featuredImageId, postId).then(function (result) {
        if (result) {
          setAutoColor(result);
        }
        setIsSuggesting(false);
      });
    }, [featuredImageId]); // eslint-disable-line react-hooks/exhaustive-deps

    // Dynamic label based on post type.
    var label = postTypeLabels[postType] || defaultLabel;

    // Build title with inline ColorIndicator when a color is set.
    var panelTitle = color ? el('span', {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      }
    }, label, el(ColorIndicator, {
      colorValue: color
    })) : label;
    return el(PluginDocumentSettingPanel, {
      name: 'anima-project-color',
      title: panelTitle,
      className: 'anima-project-color-panel'
    }, el('p', {
      className: 'description',
      style: {
        marginTop: 0,
        color: '#757575',
        fontSize: '12px'
      }
    }, __('Color used for page transition animation. Leave empty to use the accent color.', '__theme_txtd')),
    // Notice (success or error)
    notice ? el(Notice, {
      status: notice.type,
      isDismissible: true,
      onRemove: function () {
        setNotice(null);
      },
      style: {
        marginBottom: '12px'
      }
    }, notice.message) : null,
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
    }, color),
    // "(auto)" label when using auto-generated color
    isAuto ? el('span', {
      style: {
        fontSize: '11px',
        color: '#757575',
        fontStyle: 'italic'
      }
    }, __('(auto)', '__theme_txtd')) : null, el(Button, {
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
    // Color picker — manual pick always writes to _project_color
    showPicker ? el(ColorPicker, {
      color: color || '#333333',
      onChangeComplete: function (value) {
        setManualColor(value.hex);
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
    }, isSuggesting ? __('Extracting color...', '__theme_txtd') : __('Suggest from Featured Image', '__theme_txtd')), !featuredImageId ? el('p', {
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