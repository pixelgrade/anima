const NEW_HERO_SELECTOR = '.nb-supernova--card-layout-stacked.nb-supernova--1-columns.nb-supernova--align-full';
const OLD_HERO_SELECTOR = '.novablocks-hero';

function shouldInitializeHero( element ) {
  if ( ! element || typeof element.matches !== 'function' ) {
    return false;
  }

  if ( element.classList && element.classList.contains( 'nb-contextual-post-card' ) ) {
    return false;
  }

  return element.matches( NEW_HERO_SELECTOR ) || element.matches( OLD_HERO_SELECTOR );
}

module.exports = {
  NEW_HERO_SELECTOR,
  OLD_HERO_SELECTOR,
  shouldInitializeHero,
};
