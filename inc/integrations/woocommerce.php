<?php

// Remove Add To Cart
remove_action( 'woocommerce_after_shop_loop_item', 'woocommerce_template_loop_add_to_cart', 10 );
// Remove Sidebar
remove_action( 'woocommerce_sidebar', 'woocommerce_get_sidebar', 10 );
// Remove Breadcrumbs
remove_action( 'woocommerce_before_main_content', 'woocommerce_breadcrumb', 20 );
// Remove coupon form
remove_action( 'woocommerce_before_checkout_form', 'woocommerce_checkout_coupon_form', 10 );
// Remove product title
remove_action('woocommerce_shop_loop_item_title', 'woocommerce_template_loop_product_title', 10);


// Open wrapper for single product
add_action( 'woocommerce_before_single_product_summary', 'addStartWrapperBeforeSingleProductSummary', 1 );
// Close wrapper for single product
add_action( 'woocommerce_after_single_product_summary', 'addEndWrapperAfterSingleProductSummary', 1 );
// Open wrapper for tabs
add_action( 'woocommerce_after_single_product_summary', 'addStartWrapperBeforeTabs', 9 );
// Close wrapper for tabs
add_action( 'woocommerce_after_single_product_summary', 'addEndWrapperAfterTabs', 11 );
// Open wrapper for upselling products
add_action( 'woocommerce_after_single_product_summary', 'addStartWrapperBeforeUpsells', 14 );
// Close wrapper for upselling products
add_action( 'woocommerce_after_single_product_summary', 'addEndWrapperAfterUpsells', 16 );

// Open wrapper for related products
add_action( 'woocommerce_after_single_product_summary', 'addStartWrapperBeforeRelated', 19 );
// Close wrapper for related products
add_action( 'woocommerce_after_single_product_summary', 'addEndWrapperAfterRelated', 21 );
// Open wrapper for product on archive
add_action('woocommerce_before_shop_loop_item', 'addStartWrapperProduct', 20);
// Close wrapper for product on archive
add_action('woocommerce_shop_loop_item_title', 'addEndWrapperProduct', 20);
// Change markup for product title on archive
add_action('woocommerce_shop_loop_item_title','newProductTitleMarkup', 10);

// Open wrapper for product price
add_action('woocommerce_shop_loop_item_title', 'addStartWrapperPrice', 30);
// Close wrapper for product price
add_action('woocommerce_after_shop_loop_item_title', 'addEndWrapperPrice', 30);

// Open wrapper for single product (container)
add_action( 'woocommerce_before_main_content', 'addStartMainContent', 21 );
// Close wrapper for single product (container)
add_action( 'woocommerce_after_main_content', 'addEndMainContent', 21 );

// Add ajax button to products
add_action( 'woocommerce_after_add_to_cart_quantity', 'outputAjaxAddToCartButton' );

// Add breadcrumbs on single product, right before title
add_action( 'woocommerce_single_product_summary', 'woocommerce_breadcrumb', 1 );

// Add shop categories on archive, right after title
add_action( 'woocommerce_archive_description', 'woocommerce_display_categories', 1 );

// Add Site title and Breadcrumbs to Checkout Page
add_action( 'woocommerce_checkout_billing', 'outputCheckoutSiteIdentity', 1 );
add_action( 'woocommerce_checkout_billing', 'outputCheckoutBreadcrumbs', 2 );

// Move coupon form between Site Title and Checkout Form
add_action( 'woocommerce_checkout_billing', 'woocommerce_checkout_coupon_form', 10 );

// Add hidden coupon form outside checkout form
add_action( 'woocommerce_before_checkout_form', 'woocommerceCouponForm', 10 );

// Add ajax button to archive products
add_action('woocommerce_after_shop_loop_item', 'appendAddToCartButton', 1);

// Output fly-out cart markup
add_action( 'rosa_before_header', 'outputMiniCart', 1 );

// Hide tabs content titles
add_filter( 'woocommerce_product_description_heading', '__return_false', 30 );
add_filter( 'woocommerce_product_additional_information_heading', '__return_false', 30 );

// Append cart to menu
add_filter( 'wp_nav_menu_items', 'appendCartIconToMenu', 10, 2 );

// Limit related posts number
add_filter( 'woocommerce_output_related_products_args', 'limitRelatedPostsCount', 20 );

// Limit upselling products number
add_filter( 'woocommerce_upsell_display_args', 'limitRelatedPostsCount', 20 );

// Change args for WooCommerce pagination
add_filter( 'woocommerce_pagination_args', 'rosa_woocommerce_pagination_args', 40, 1 );

function addStartWrapperBeforeSingleProductSummary() {
	echo '<div class="c-product-main">';
}

function addEndWrapperAfterSingleProductSummary() {
	echo '</div>';
}


function addStartWrapperBeforeTabs() {
	echo '<div class="c-woo-section  c-woo-tabs">';
}

function addEndWrapperAfterTabs() {
	echo '</div>';
}

function addStartWrapperBeforeUpsells() {
	echo '<div class="c-woo-section  c-woo-upsells">';
}

function addEndWrapperAfterUpsells() {
	echo '</div>';
}

function addStartWrapperBeforeRelated() {
	echo '<div class="c-woo-section  c-woo-related">';
}

function addEndWrapperAfterRelated() {
	echo '</div>';
}

function addStartMainContent() {
	echo '<div class="wp-block-group__inner-container"><div class="wp-block alignwide">';
}

function addEndMainContent() {
	echo '</div></div>';
}

function newProductTitleMarkup() {
	echo '<h2 class="wc-block-grid__product-title">' . get_the_title() . '</h2>';
}

function addStartWrapperProduct() {
	echo '<div class="wc-block-grid__product-link">';
}

function addEndWrapperProduct() {
	echo '</div>';
}

function addStartWrapperPrice() {
	echo '<div class="wc-block-grid__product-price price">';
}

function addEndWrapperPrice() {
	echo '</div>';
}

function appendAddToCartButton()  {

	if ( 'product' !== get_post_type() ) {
		return;
	}

	$product = wc_get_product();
	$class = 'add_to_cart_button';

	if ( $product->is_type( 'simple' ) ) {
		$class .= '  ajax_add_to_cart';
	} ?>

    <div class="wp-block-button wc-block-grid__product-add-to-cart">
		<?php woocommerce_template_loop_add_to_cart( array( 'class' => $class ) ); ?>
    </div>

<?php }

function outputCheckoutSiteIdentity() { ?>

    <h1 class="woocommerce-checkout-title"><a
                href="<?php echo esc_url( get_home_url() ); ?>"><span><?php echo esc_html( get_bloginfo( 'name' ) ) ?></span></a>
    </h1>

<?php }

function outputCheckoutBreadcrumbs() { ?>

    <ul class="woocommerce-checkout-breadcrumbs">
        <li>
            <a href="<?php echo esc_url( wc_get_cart_url() ); ?>"><?php esc_html_e( 'Cart', '__components_txtd' ); ?></a>
        </li>
        <li><?php esc_html_e( 'Checkout', '__theme_txtd' ); ?></li>
    </ul>

<?php }

function limitRelatedPostsCount( $args ) {
	$args['posts_per_page'] = 3;
	$args['columns']        = 3;

	return $args;
}

function outputAjaxAddToCartButton() {
	if ( 'product' !== get_post_type() ) {
		return;
	}

	$product = wc_get_product();

	if ( $product->is_type( 'simple' ) ) {
		woocommerce_template_loop_add_to_cart( array(
			'class' => 'add_to_cart_button  ajax_add_to_cart'
		) );
	}
}

function outputMiniCart() {
	if ( ! is_cart() ) { ?>

        <div class="c-mini-cart">
            <div class="c-mini-cart__overlay"></div>
            <div class="c-mini-cart__flyout">
                <div class="c-mini-cart__header">
                    <h5 class="c-mini-cart__title"><?php esc_html_e( 'Your cart', '__components_txtd' ); ?></h5>
                    <div class="c-mini-cart__close"></div>
                </div>
				<?php the_widget( 'WC_Widget_Cart', 'title=' ); ?>
            </div>
        </div>

	<?php }
}


function appendCartIconToMenu( $items, $args ) {

    if ( empty( WC()->cart ) ) {
        return $items;
    }

	$cart_item_count = WC()->cart->get_cart_contents_count();
	$cart_count_span = '';

	if ( $cart_item_count ) {
		$cart_count_span = '<div class="cart-count"><span>' . esc_html( $cart_item_count ) . '</span></div>';
	} else {
		$cart_count_span = '<div class="cart-count"><span>0</span></div>';
    }

	$cart_link               = '<li class="menu-item  menu-item--cart"><a class="js-open-cart" href="' . esc_url( get_permalink( wc_get_page_id( 'cart' ) ) ) . '">' . $cart_count_span . '</a></li>';


	// Add the cart link to the end of the menu.
	if ( $args->theme_location === 'primary' || ! empty( $args->hasCartMenuItem ) ) {
		$items = $items . $cart_link;
	}

	return $items;
}

if ( ! function_exists( 'woocommerce_display_categories' ) ) {

	function woocommerce_display_categories() {

		global $wp_query;

		// get all product categories
		$terms = get_terms( array(
			'taxonomy' => 'product_cat',
		) );

		// if there is a category queried cache it
		$current_term = get_queried_object();

		if ( ! empty( $terms ) ) {
			// create a link which should link to the shop
			$all_link = get_post_type_archive_link( 'product' );

			echo '<ul class="woocommerce-categories">';
			// display the shop link first if there is one
			if ( ! empty( $all_link ) ) {
				// also if the current_term doesn't have a term_id it means we are quering the shop and the "all categories" should be active
				echo '<li><a href="' . esc_url( $all_link ) . '" ' . ( ( ! isset( $current_term->term_id ) ) ? ' class="active"' : ' class="inactive"' ) . '>' . esc_html__( 'All Products', '__components_txtd' ) . '</a></li>';
			}

			// display a link for each product category
			foreach ( $terms as $key => $term ) {
				$link = get_term_link( $term, 'product_cat' );
				if ( ! is_wp_error( $link ) ) {

					if ( ! empty( $current_term->name ) && $current_term->name === $term->name ) {
						echo '<li><span class="active">' . esc_html( $term->name ) . '</span></li>';
					} else {
						echo '<li><a href="' . esc_url( $link ) . '">' . esc_html( $term->name ) . '</a></li>';
					}
				}
			}
			echo '</ul>';
		}
	}
}


if ( ! function_exists( ' rosa_woocommerce_pagination_args' ) ) {
	function rosa_woocommerce_pagination_args() {

		$args =  array(
			'end_size'           => 1,
			'mid_size'           => 2,
			'type'               => 'list',
			'type' => null,
			'prev_text' => esc_html_x( 'Previous', 'previous set of posts', '__theme_txtd' ),
			'next_text' => esc_html_x( 'Next', 'next set of posts', '__theme_txtd' ),
		);

		return $args;
	}
}


if ( ! function_exists( 'woocommerceCouponForm' ) ) {
	function woocommerceCouponForm() {
		echo '<form class="checkout_coupon woocommerce-form-coupon" id="form-coupon" method="post" style="display:none"></form>';
	}
}
