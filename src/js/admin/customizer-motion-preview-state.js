const MOTION_PREVIEW_SETTING_IDS = [
  'sm_page_transitions_enable',
  'sm_page_transition_style',
  'sm_logo_loading_style',
  'sm_transition_symbol',
];

const DEFAULT_PAGE_TRANSITION_STYLE = 'border_iris';
const DEFAULT_LOGO_LOADING_STYLE = 'progress_bar';

const PAGE_TRANSITION_STYLES = [
  DEFAULT_PAGE_TRANSITION_STYLE,
  'slide_wipe',
];

const LOGO_LOADING_STYLES = [
  DEFAULT_LOGO_LOADING_STYLE,
  'cycling_images',
];

function normalizeBoolean(value) {
  return value === true || value === 1 || value === '1' || value === 'true';
}

function normalizeChoice(value, choices, fallbackValue) {
  return choices.includes(value) ? value : fallbackValue;
}

function getMotionPreviewState(settings = {}, isSectionExpanded = false) {
  const isEnabled = normalizeBoolean(settings.sm_page_transitions_enable);

  return {
    isEnabled,
    isSectionExpanded: normalizeBoolean(isSectionExpanded),
    isVisible: isEnabled && normalizeBoolean(isSectionExpanded),
    pageTransitionStyle: normalizeChoice(
      settings.sm_page_transition_style,
      PAGE_TRANSITION_STYLES,
      DEFAULT_PAGE_TRANSITION_STYLE
    ),
    logoLoadingStyle: normalizeChoice(
      settings.sm_logo_loading_style,
      LOGO_LOADING_STYLES,
      DEFAULT_LOGO_LOADING_STYLE
    ),
    transitionSymbol: typeof settings.sm_transition_symbol === 'string'
      ? settings.sm_transition_symbol
      : '',
  };
}

module.exports = {
  MOTION_PREVIEW_SETTING_IDS,
  getMotionPreviewState,
};
