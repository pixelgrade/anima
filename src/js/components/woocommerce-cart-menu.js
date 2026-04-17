const CART_MENU_ITEM_SELECTOR = '.nb-navigation .menu > .menu-item--cart, .c-editorial-frame .nav--toolbar > .menu-item--cart';
const SELECTIVE_REFRESH_CONTAINER_SELECTOR = '.nb-navigation .menu, .c-editorial-frame .nav--toolbar';

function getCartMenuItemMarkup({
  label = '',
  editorialFrame = false,
  count = '0',
} = {}) {
  const labelClass = editorialFrame ? 'c-editorial-frame__label' : 'menu-item__label';

  return `<span class="${labelClass}">${label}</span><span class="menu-item__icon">${count}</span>`;
}

module.exports = {
  CART_MENU_ITEM_SELECTOR,
  SELECTIVE_REFRESH_CONTAINER_SELECTOR,
  getCartMenuItemMarkup,
};
