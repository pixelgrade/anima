/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 8);
/******/ })
/************************************************************************/
/******/ ({

/***/ 8:
/***/ (function(module, exports) {

(function ($, document) {
  // Handle Checkout Notifications
  $(document.body).on('checkout_error', function () {
    $('.woocommerce-NoticeGroup-checkout').insertBefore('#customer_details .col-1 .woocommerce-billing-fields');
  }); // Handle Coupon Notifications on Checkout

  $(document.body).on('applied_coupon_in_checkout update_checkout', function () {
    var wooErrorNotification = $('.woocommerce-error'),
        wooMessageNotification = $('.woocommerce-message');

    if (wooErrorNotification.length) {
      wooErrorNotification.insertBefore('#customer_details .col-1 .woocommerce-billing-fields');
    }

    if (wooMessageNotification.length) {
      wooMessageNotification.insertBefore('#customer_details .col-1 .woocommerce-billing-fields');
    }

    $('.js-coupon-value-source').val('');
  });

  function enableMinusButton() {
    var $minusButton = $('.qty_button.minus'),
        qtyValue = $('.quantity__wrapper .qty').val();
    $minusButton.each(function (i, obj) {
      qtyValue = $(obj).parent().find('.qty').val();

      if (qtyValue > 1) {
        $(this).removeClass('button--is-disabled');
      }
    });
  }

  enableMinusButton();
  $(document.body).on('updated_cart_totals', function () {
    enableMinusButton();
  });
  $(function () {
    var $body = $(document.body).not('.woocommerce-cart');
    var $cartMenuItems = $('.site-header__menu .menu > .menu-item--cart');
    $cartMenuItems.each(function (i, obj) {
      var $cartMenuItem = $(obj);
      var $cartMenuItemLink = $cartMenuItem.children('a');
      var cartMenuItemText = $cartMenuItemLink.text();
      var $cartMenuItemCount = $('<span class="menu-item__icon">0</span>');
      $cartMenuItemLink.html("<span class=\"menu-item__label\">".concat(cartMenuItemText, " </span>"));
      $cartMenuItemCount.appendTo($cartMenuItemLink);
      var fragmentKey = 'div.widget_shopping_cart_content';
      var $fragment = $(fragmentKey);

      if ($fragment.length) {
        var fragments = {};
        fragments[fragmentKey] = $fragment.html();
        var itemCount = getCartMenuItemCount(fragments);
        updateCardMenuItems($cartMenuItems, itemCount);
      }
    });
    $cartMenuItems.on('click', openMiniCart); // show mini cart when a product is added to cart

    function onAddedToCart(event, fragments, cart_hash, $button) {
      var key = 'div.widget_shopping_cart_content';
      var sku = $button.data('product_sku');

      if (key in fragments) {
        $body.one('wc_fragments_loaded', function () {
          var $fragment = $(key);
          var $productList = $fragment.find('.product_list_widget');
          var $product = $productList.find('[data-product_sku="' + sku + '"]').closest('.mini_cart_item');

          if ($product.length) {
            // scroll the newly added product into view
            if (document.documentElement.scrollIntoView) {
              $product.get(0).scrollIntoView();
            } // prepare the fade-in animation for the updated product in the cart


            $product.addClass('mini_cart_item--hidden'); // trigger the animation to show the updated product shortly after the cart slides into view

            setTimeout(function () {
              $product.removeClass('mini_cart_item--hidden');
            }, 100);
          }
        });
      }

      $button.text(pixelgradeWooCommerceStrings.added_to_cart);
      $('.c-mini-cart').addClass('c-mini-cart--visible');
    } // update cart items count in cart menu item


    function getCartMenuItemCount(fragments) {
      var key = 'div.widget_shopping_cart_content';
      var count = 0;

      if (key in fragments) {
        // loop through every item in cart and sum up the quantity
        $(fragments[key]).find('.mini_cart_item').each(function (i, obj) {
          var $quantity = $(obj).find('.quantity'); // remove the price html tag to be able to parse number of items for that product

          $quantity.children().remove();
          count += parseInt($quantity.text(), 10);
        }); // actually update the cart items count

        $('.menu-item--cart .cart-count span').text(products);
      }

      return count;
    } // show mini cart when Cart menu item is clicked


    function openMiniCart(event) {
      event.preventDefault();
      event.stopPropagation();
      $('.c-mini-cart').addClass('c-mini-cart--visible');
    } // close mini Cart


    function closeMiniCart() {
      var $add_to_cart_button = $('.add_to_cart_button.added');
      var $view_cart_button = $('.added_to_cart');
      var label = $add_to_cart_button.data('label');
      $add_to_cart_button.removeClass('added').text(label);
      $view_cart_button.remove();
      $('.c-mini-cart').removeClass('c-mini-cart--visible');
      $('.c-card.hover').each(function (i, obj) {
        var $card = $(obj);
        setTimeout(function () {
          $card.removeClass('hover');
        }, 100);
      });
    }

    $('.c-mini-cart__overlay, .c-mini-cart__close').on('click', closeMiniCart);

    function updateCardMenuItems($cartMenuItems, count) {
      $cartMenuItems.each(function (i, obj) {
        var $cartMenuItem = $(obj);
        var $cartMenuItemCount = $cartMenuItem.find('.menu-item__icon');
        $cartMenuItemCount.text(count);
      });
    }

    $body.on('added_to_cart', onAddedToCart);
    $body.on('added_to_cart removed_from_cart', function (event, fragments, cart_hash, $button) {
      var itemCount = getCartMenuItemCount(fragments);
      updateCardMenuItems($cartMenuItems, itemCount);
    });
    $('.js-open-cart').on('click', openMiniCart); // in order to avoid template overwrites add the class used to style buttons programatically

    $body.on('wc_cart_button_updated', function (event, $button) {
      $button.siblings('.added_to_cart').addClass('button');
    }); // replace the "Add to cart" label with string that provide more feedback
    // when the cart gets updated

    $body.on('adding_to_cart', function (event, $button, data) {
      // cache old label and save it in a data-attribute
      // in order to restore it once the mini cart gets closed
      var label = $button.text();
      $button.data('label', label); // replace the button label with a new one that provides more feedback
      // "Add to cart" gets replaced with "Adding..."

      $button.closest('.wc-block-grid__product').addClass('hover');
      $button.text(pixelgradeWooCommerceStrings.adding_to_cart);
    });
    $('.c-product-main .cart').on('change', '.qty', function () {
      $(this.form).find('.ajax_add_to_cart[data-quantity]').attr('data-quantity', this.value);
    });
    $('.js-coupon-value-source').on('change', function () {
      $('.js-coupon-value-destination').val($(this).val());
    });
    $('body').on('click', '.plus, .minus', updateProductQuantity);

    function updateProductQuantity(e) {
      e.preventDefault();

      if (!String.prototype.getDecimals) {
        String.prototype.getDecimals = function () {
          var num = this,
              match = ('' + num).match(/(?:\.(\d+))?(?:[eE]([+-]?\d+))?$/);

          if (!match) {
            return 0;
          }

          return Math.max(0, (match[1] ? match[1].length : 0) - (match[2] ? +match[2] : 0));
        };
      }

      var $qty = $(this).closest('.quantity').find('.qty'),
          currentVal = parseFloat($qty.val()),
          max = parseFloat($qty.attr('max')),
          min = parseFloat($qty.attr('min')),
          step = $qty.attr('step'); // Format values

      if (!currentVal || currentVal === '' || currentVal === 'NaN') currentVal = 0;
      if (max === '' || max === 'NaN') max = '';
      if (min === '' || min === 'NaN') min = 0;
      if (step === 'any' || step === '' || step === undefined || parseFloat(step) === 'NaN') step = 1;

      if ($(this).is('.plus')) {
        var $minusButton = $(this).parent().find('.minus');

        if ($minusButton.hasClass('button--is-disabled')) {
          $minusButton.removeClass('button--is-disabled');
        }

        if (max && currentVal >= max) {
          $qty.val(max);
        } else {
          $qty.val((currentVal + parseFloat(step)).toFixed(step.getDecimals()));
        }
      } else {
        if (min && currentVal <= min) {
          $qty.val(min);
          $(this).addClass('button--is-disabled');
        } else if (currentVal > 1) {
          $qty.val((currentVal - parseFloat(step)).toFixed(step.getDecimals()));
        } else {
          $(this).addClass('button--is-disabled');
        }
      } // Trigger change event


      $qty.trigger('change');
    }
  });
})(jQuery, document);

/***/ })

/******/ });