function getTransitionColorFromTrigger( trigger, fallbackColor = 'var(--sm-current-accent-color)' ) {
  if ( ! trigger || typeof trigger.getAttribute !== 'function' ) {
    return fallbackColor;
  }

  const explicitColorAttributes = [
    'data-anima-transition-color',
    'data-color',
  ];

  for ( const attributeName of explicitColorAttributes ) {
    const explicitColor = trigger.getAttribute( attributeName );

    if ( explicitColor && explicitColor.trim() ) {
      return explicitColor.trim();
    }
  }

  return fallbackColor;
}

module.exports = {
  getTransitionColorFromTrigger,
};
