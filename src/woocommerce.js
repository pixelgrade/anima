(function($, document) {

	$(function(){

		var $body = $( document.body ).not( '.woocommerce-cart' );

		// show mini cart when a product is added to cart
		function onAddedToCart( event, fragments, cart_hash, $button ) {
			var key = 'div.widget_shopping_cart_content';
			var sku = $button.data( 'product_sku' );

			if ( key in fragments ) {
				$body.one( 'wc_fragments_loaded', function() {
					var $fragment = $( key );
					var $productList = $fragment.find( '.product_list_widget' );
					var $product = $productList.find( '[data-product_sku="' + sku + '"]' ).closest( '.mini_cart_item' );

					if ( $product.length ) {

						// scroll the newly added product into view
						if ( document.documentElement.scrollIntoView ) {
							$product.get(0).scrollIntoView();
						}

						// prepare the fade-in animation for the updated product in the cart
						$product.addClass( 'mini_cart_item--hidden' );

						// trigger the animation to show the updated product shortly after the cart slides into view
						setTimeout( function() {
							$product.removeClass( 'mini_cart_item--hidden' );
						}, 100 )
					}
				});
			}

			$button.text( pixelgradeWooCommerceStrings.added_to_cart );

			$( '.c-mini-cart' ).addClass( 'c-mini-cart--visible' );
		}

		// update cart items count in cart menu item
		function updateCartMenuItemCount( event, fragments, cart_hash, $button ) {
			var key = 'div.widget_shopping_cart_content';

			if ( key in fragments ) {
				// initialize cart items sum count with 0
				var products = 0;

				// loop through every item in cart and sum up the quantity
				$( fragments[key] ).find( '.mini_cart_item' ).each( function(i, obj) {
					var $quantity = $( obj ).find( '.quantity' );

					// remove the price html tag to be able to parse number of items for that product
					$quantity.children().remove();
					products += parseInt( $quantity.text(), 10 );
				});

				// actually update the cart items count
				$( '.menu-item--cart .cart-count span' ).text( products );
			}
		}

		// show mini cart when Cart menu item is clicked
		function openMiniCart( event ) {
			event.preventDefault();
			event.stopPropagation();
			$( '.c-mini-cart' ).addClass( 'c-mini-cart--visible' );

			debugger;
		}

		// close mini Cart
		function closeMiniCart() {
			var $add_to_cart_button = $( '.add_to_cart_button.added' );
			var $view_cart_button = $( '.added_to_cart' );
			var label = $add_to_cart_button.data( 'label' );

			$add_to_cart_button.removeClass( 'added' ).text( label );
			$view_cart_button.remove();

			$( '.c-mini-cart' ).removeClass( 'c-mini-cart--visible' );

			$( '.c-card.hover' ).each( function( i, obj ) {
				var $card = $(obj);

				setTimeout(function() {
					$card.removeClass( 'hover' );
				}, 100);
			});
		}

		$( '.c-mini-cart__overlay, .c-mini-cart__close').on( 'click', closeMiniCart);

		$body.on( 'added_to_cart', onAddedToCart );
		$body.on( 'added_to_cart removed_from_cart', updateCartMenuItemCount );

		$( '.js-open-cart' ).on( 'click', openMiniCart );

		// in order to avoid template overwrites add the class used to style buttons programatically
		$body.on( 'wc_cart_button_updated', function( event, $button ) {
			$button.siblings( '.added_to_cart' ).addClass( 'button' );
		} );

		// replace the "Add to cart" label with string that provide more feedback
		// when the cart gets updated
		$body.on( 'adding_to_cart', function( event, $button, data ) {
			// cache old label and save it in a data-attribute
			// in order to restore it once the mini cart gets closed
			debugger;
			var label = $button.text();
			$button.data( 'label', label );

			// replace the button label with a new one that provides more feedback
			// "Add to cart" gets replaced with "Adding..."
			$button.closest( '.wc-block-grid__product' ).addClass( 'hover' );
			$button.text( pixelgradeWooCommerceStrings.adding_to_cart );
		} );
	})

})(jQuery, document);
