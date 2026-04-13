function getProjectColorDescription( isEnabled, descriptions = {} ) {
  const enabledDescription =
    descriptions.enabled || 'Color used for supported reading and transition accents.';
  const disabledDescription =
    descriptions.disabled ||
    'Contextual entry colors are disabled in Tweak Board. Saved colors will stay here until you enable the feature.';

  return isEnabled ? enabledDescription : disabledDescription;
}

function shouldAutoSuggestProjectColor( {
  isEnabled,
  manualColor,
  autoColor,
  featuredImageId,
} = {} ) {
  return Boolean( isEnabled && ! manualColor && ! autoColor && featuredImageId );
}

function shouldRefreshAutoProjectColor( {
  isEnabled,
  manualColor,
  featuredImageId,
  previousFeaturedImageId,
} = {} ) {
  return Boolean(
    isEnabled &&
    ! manualColor &&
    previousFeaturedImageId !== featuredImageId
  );
}

module.exports = {
  getProjectColorDescription,
  shouldAutoSuggestProjectColor,
  shouldRefreshAutoProjectColor,
};
