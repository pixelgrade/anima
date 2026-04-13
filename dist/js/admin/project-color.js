/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 183
(module) {

function getProjectColorDescription(isEnabled, descriptions = {}) {
  const enabledDescription = descriptions.enabled || 'Color used for supported reading and transition accents.';
  const disabledDescription = descriptions.disabled || 'Contextual entry colors are disabled in Tweak Board. Saved colors will stay here until you enable the feature.';
  return isEnabled ? enabledDescription : disabledDescription;
}
function shouldAutoSuggestProjectColor({
  isEnabled,
  manualColor,
  autoColor,
  featuredImageId
} = {}) {
  return Boolean(isEnabled && !manualColor && !autoColor && featuredImageId);
}
function shouldRefreshAutoProjectColor({
  isEnabled,
  manualColor,
  featuredImageId,
  previousFeaturedImageId
} = {}) {
  return Boolean(isEnabled && !manualColor && previousFeaturedImageId !== featuredImageId);
}
module.exports = {
  getProjectColorDescription,
  shouldAutoSuggestProjectColor,
  shouldRefreshAutoProjectColor
};

/***/ }

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
/**
 * Project Color — Block editor sidebar panel.
 *
 * Adds a "Project Color" panel to the post/page editor sidebar
 * with a color picker, "Suggest from Image" button, and "Clear" button.
 *
 * Uses wp.element.createElement (no JSX) to avoid build complexity.
 */

(function () {
  var projectColorState = __webpack_require__(183);
  var unsupportedPostTypes = {
    wp_template: true,
    wp_template_part: true,
    wp_navigation: true
  };
  var el = wp.element.createElement;
  var useState = wp.element.useState;
  var useEffect = wp.element.useEffect;
  var useRef = wp.element.useRef;
  var registerPlugin = wp.plugins && wp.plugins.registerPlugin;
  var PluginDocumentSettingPanel = wp.editPost && wp.editPost.PluginDocumentSettingPanel;
  var ColorIndicator = wp.components.ColorIndicator;
  var ColorPicker = wp.components.ColorPicker;
  var Button = wp.components.Button;
  var Notice = wp.components.Notice;
  var useSelect = wp.data.useSelect;
  var useDispatch = wp.data.useDispatch;
  var __ = wp.i18n.__;
  var CONTEXTUAL_PALETTE_ID = animaProjectColor.contextualId || 'contextual-post';
  var CONTEXTUAL_STYLE_ID = animaProjectColor.contextualStyleId || 'style-manager-contextual-preview-inline-css';
  var IS_CONTEXTUAL_ENTRY_COLORS_ENABLED = !!animaProjectColor.isEnabled;

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

  /**
   * Fetch the contextual palette preview for an unsaved editor color.
   *
   * @param {number} postId Current post ID.
   * @param {string} color  Effective contextual color.
   * @return {Promise<Object|null>} Preview payload or null on failure.
   */
  function fetchContextualPalettePreview(postId, color) {
    var formData = new FormData();
    formData.append('action', 'anima_get_contextual_palette_preview');
    formData.append('nonce', animaProjectColor.nonce);
    formData.append('post_id', postId);
    formData.append('color', color || '');
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
      return null;
    }).catch(function () {
      return null;
    });
  }
  function getPreviewStyleDocuments() {
    var docs = [document];
    var iframe = document.querySelector('iframe[name="editor-canvas"]');
    try {
      if (iframe && iframe.contentDocument) {
        docs.push(iframe.contentDocument);
      }
    } catch (e) {
      // Ignore iframe access errors and keep the outer document only.
    }
    return docs;
  }
  function upsertContextualPreviewStyle(css) {
    getPreviewStyleDocuments().forEach(function (doc) {
      var container = doc.head || doc.body || doc.documentElement;
      if (!container) {
        return;
      }
      var styleTag = doc.getElementById(CONTEXTUAL_STYLE_ID);
      if (!styleTag) {
        styleTag = doc.createElement('style');
        styleTag.id = CONTEXTUAL_STYLE_ID;
        container.appendChild(styleTag);
      }
      styleTag.textContent = css || '';
    });
  }
  function getPalettesWithoutContextual(palettes) {
    return (palettes || []).filter(function (palette) {
      return String(palette.id) !== CONTEXTUAL_PALETTE_ID;
    });
  }
  function getCurrentNovablocksSettings() {
    var storeSettings = wp.data && wp.data.select && wp.data.select('novablocks') && wp.data.select('novablocks').getSettings && wp.data.select('novablocks').getSettings();
    return storeSettings || window.wp.novaBlocks && window.wp.novaBlocks.settings || {};
  }
  function updateNovablocksSettings(nextSettings) {
    window.wp = window.wp || {};
    window.wp.novaBlocks = window.wp.novaBlocks || {};
    window.wp.novaBlocks.settings = nextSettings;
    if (wp.data && wp.data.dispatch && wp.data.dispatch('novablocks') && wp.data.dispatch('novablocks').updateSettings) {
      wp.data.dispatch('novablocks').updateSettings(nextSettings);
    }
  }
  function applyPaletteRuntimePayload(payload) {
    var nextPalettes = Array.isArray(payload && payload.palettes) ? payload.palettes : [];
    var runtimeCss = payload && payload.runtimeCss || '';
    var currentSettings = getCurrentNovablocksSettings();
    var nextSettings = Object.assign({}, currentSettings, {
      palettes: nextPalettes
    });
    window.styleManager = window.styleManager || {};
    window.styleManager.colorsConfig = nextPalettes;
    updateNovablocksSettings(nextSettings);
    upsertContextualPreviewStyle(runtimeCss);
  }
  function clearContextualPalettePreview() {
    var basePalettes = getPalettesWithoutContextual(getCurrentNovablocksSettings().palettes || window.styleManager && window.styleManager.colorsConfig || []);
    applyPaletteRuntimePayload({
      palettes: basePalettes,
      runtimeCss: ''
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
    if (!PluginDocumentSettingPanel || !postType || unsupportedPostTypes[postType] || typeof editPost !== 'function') {
      return null;
    }
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
    var previewRequestRef = useRef(0);
    var previewTimeoutRef = useRef(null);

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
    var panelDescription = projectColorState.getProjectColorDescription(IS_CONTEXTUAL_ENTRY_COLORS_ENABLED, {
      enabled: __('Color used for supported reading and transition accents.', '__theme_txtd'),
      disabled: __('Contextual entry colors are disabled in Tweak Board. Saved colors will stay here until you enable the feature.', '__theme_txtd')
    });

    // Auto-suggest on mount: if the feature is enabled, no manual color exists,
    // and a featured image is available, fetch and save the auto color.
    useEffect(function () {
      if (!projectColorState.shouldAutoSuggestProjectColor({
        isEnabled: IS_CONTEXTUAL_ENTRY_COLORS_ENABLED,
        manualColor: manualColor,
        autoColor: autoColor,
        featuredImageId: featuredImageId
      })) {
        return;
      }
      setIsSuggesting(true);
      fetchColorFromImage(featuredImageId, postId).then(function (result) {
        if (result) {
          setAutoColor(result);
        }
        setIsSuggesting(false);
      });
    }, []); // eslint-disable-line react-hooks/exhaustive-deps -- run once on mount.

    // Re-suggest when featured image changes (after initial mount).
    useEffect(function () {
      var previousFeaturedImageId = prevFeaturedImageRef.current;
      if (previousFeaturedImageId === featuredImageId) {
        return;
      }
      prevFeaturedImageRef.current = featuredImageId;
      if (!projectColorState.shouldRefreshAutoProjectColor({
        isEnabled: IS_CONTEXTUAL_ENTRY_COLORS_ENABLED,
        manualColor: manualColor,
        featuredImageId: featuredImageId,
        previousFeaturedImageId: previousFeaturedImageId
      })) {
        return;
      }
      if (!featuredImageId) {
        setAutoColor('');
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

    useEffect(function () {
      if (previewTimeoutRef.current) {
        clearTimeout(previewTimeoutRef.current);
        previewTimeoutRef.current = null;
      }
      previewRequestRef.current = previewRequestRef.current + 1;
      var currentRequest = previewRequestRef.current;
      if (!postId) {
        return undefined;
      }
      if (!IS_CONTEXTUAL_ENTRY_COLORS_ENABLED) {
        clearContextualPalettePreview();
        return undefined;
      }
      if (!color) {
        clearContextualPalettePreview();
        return undefined;
      }
      previewTimeoutRef.current = setTimeout(function () {
        fetchContextualPalettePreview(postId, color).then(function (payload) {
          if (previewRequestRef.current !== currentRequest) {
            return;
          }
          if (payload && Array.isArray(payload.palettes)) {
            applyPaletteRuntimePayload(payload);
            return;
          }
          clearContextualPalettePreview();
        });
      }, 150);
      return function () {
        if (previewTimeoutRef.current) {
          clearTimeout(previewTimeoutRef.current);
          previewTimeoutRef.current = null;
        }
      };
    }, [color, postId]);

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
    }, panelDescription),
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
  if (!registerPlugin) {
    return;
  }
  registerPlugin('anima-project-color', {
    render: ProjectColorPanel,
    icon: 'art'
  });
})();
/******/ })()
;