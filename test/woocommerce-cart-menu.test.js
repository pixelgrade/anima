const test = require('node:test');
const assert = require('node:assert/strict');

const {
  CART_MENU_ITEM_SELECTOR,
  SELECTIVE_REFRESH_CONTAINER_SELECTOR,
  getCartMenuItemMarkup,
} = require('../src/js/components/woocommerce-cart-menu.js');

test('targets cart extras in both the main navigation and Site Frame rail', () => {
  assert.equal(
    CART_MENU_ITEM_SELECTOR,
    '.nb-navigation .menu > .menu-item--cart, .c-site-frame .nav--toolbar > .menu-item--cart'
  );

  assert.equal(
    SELECTIVE_REFRESH_CONTAINER_SELECTOR,
    '.nb-navigation .menu, .c-site-frame .nav--toolbar'
  );
});

test('builds header cart menu markup with the default label wrapper and count icon', () => {
  assert.equal(
    getCartMenuItemMarkup({ label: 'Cart' }),
    '<span class="menu-item__label">Cart</span><span class="menu-item__icon">0</span>'
  );
});

test('builds Site Frame cart menu markup with the Site Frame label wrapper and count icon', () => {
  assert.equal(
    getCartMenuItemMarkup({ label: 'Cart', siteFrame: true }),
    '<span class="c-site-frame__label">Cart</span><span class="menu-item__icon">0</span>'
  );
});
