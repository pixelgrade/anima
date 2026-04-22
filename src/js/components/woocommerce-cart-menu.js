const CART_MENU_ITEM_SELECTOR = '.nb-navigation .menu > .menu-item--cart, .c-site-frame .nav--toolbar > .menu-item--cart';
const SELECTIVE_REFRESH_CONTAINER_SELECTOR = '.nb-navigation .menu, .c-site-frame .nav--toolbar';

function getCartMenuItemMarkup({
  label = '',
  siteFrame = false,
  count = '0',
} = {}) {
  const labelClass = siteFrame ? 'c-site-frame__label' : 'menu-item__label';

  return `<span class="${labelClass}">${label}</span><span class="menu-item__icon">${count}</span>`;
}

module.exports = {
  CART_MENU_ITEM_SELECTOR,
  SELECTIVE_REFRESH_CONTAINER_SELECTOR,
  getCartMenuItemMarkup,
};
