<?php
/**
 * Handle the WooCommerce integration logic.
 */

// If this file is called directly, abort.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

function rosa2_woocommerce_replace_hooks() {

    // Remove Sidebar
	remove_action( 'woocommerce_sidebar', 'woocommerce_get_sidebar', 10 );

	// Remove Breadcrumbs
	remove_action( 'woocommerce_before_main_content', 'woocommerce_breadcrumb', 20 );

	// 1. Remove coupon form
    // 2. Move coupon form between Site Title and Checkout Form
    // 3. Add hidden coupon form outside checkout form
	remove_action( 'woocommerce_before_checkout_form', 'woocommerce_checkout_coupon_form', 10 ); /* 1 */
	add_action( 'woocommerce_checkout_billing', 'woocommerce_checkout_coupon_form', 10 ); /* 2 */
	add_action( 'woocommerce_before_checkout_form', 'rosa2_woocommerce_coupon_form', 10 ); /* 3 */

    // Add wrapper for summary on single product
	add_action( 'woocommerce_before_single_product_summary', 'rosa2_add_start_wrapper_before_single_product_summary', 1 );
	add_action( 'woocommerce_after_single_product_summary', 'rosa2_add_end_wrapper_after_single_product_summary', 1 );

	// Add wrapper for tasb on single product
	add_action( 'woocommerce_after_single_product_summary', 'rosa2_add_start_wrapper_before_tabs', 9 );
	add_action( 'woocommerce_after_single_product_summary', 'rosa2_add_end_wrapper_after_tabs', 11 );

	// Add wrapper for upsells
	add_action( 'woocommerce_after_single_product_summary', 'rosa2_add_start_wrapper_before_upsells', 14 );
	add_action( 'woocommerce_after_single_product_summary', 'rosa2_add_end_wrapper_after_upsells', 16 );

    // Add wrapper for related products
	add_action( 'woocommerce_after_single_product_summary', 'rosa2_add_start_wrapper_before_related', 19 );
	add_action( 'woocommerce_after_single_product_summary', 'rosa2_add_end_wrapper_after_related', 21 );

    // Change class for the product link to match editor block markup
	remove_action( 'woocommerce_before_shop_loop_item', 'woocommerce_template_loop_product_link_open', 10 );
	remove_action( 'woocommerce_after_shop_loop_item', 'woocommerce_template_loop_product_link_close', 5 );
	add_action( 'woocommerce_before_shop_loop_item', 'rosa2_loop_product_link_open', 10 );
	add_action( 'woocommerce_after_shop_loop_item', 'rosa2_loop_product_link_close', 5 );

	// Add wrapper for product thumbnail in loops to match editor block markup
	add_action( 'woocommerce_before_shop_loop_item_title', 'rosa2_loop_product_thumbnail_wrapper_open', 9 );
	add_action( 'woocommerce_before_shop_loop_item_title', 'rosa2_loop_product_thumbnail_wrapper_close', 11 );

    // Change loop product title
	remove_action('woocommerce_shop_loop_item_title', 'woocommerce_template_loop_product_title', 10);
	add_action('woocommerce_shop_loop_item_title', 'rosa2_new_product_title_markup', 10);

	// Move sale flash outside the product link to match editor block markup
	remove_action( 'woocommerce_before_shop_loop_item_title', 'woocommerce_show_product_loop_sale_flash', 10 );
	add_action( 'woocommerce_after_shop_loop_item', 'woocommerce_show_product_loop_sale_flash', 5 );

	// Add wrapper for product price in loops and move it after sale flash
	remove_action( 'woocommerce_after_shop_loop_item_title', 'woocommerce_template_loop_price', 10 );
	add_action( 'woocommerce_after_shop_loop_item', 'rosa2_price_wrapper_start', 5 );
	add_action( 'woocommerce_after_shop_loop_item', 'woocommerce_template_loop_price', 5 );
	add_action( 'woocommerce_after_shop_loop_item', 'rosa2_price_wrapper_end', 5 );

	// Replace Add To Cart button inside loops with ajax add to cart
	remove_action( 'woocommerce_after_shop_loop_item', 'woocommerce_template_loop_add_to_cart', 10 );
	add_action('woocommerce_after_shop_loop_item', 'rosa2_append_add_to_cart_button', 5);

    // Add wrapper for single product (container)
	add_action( 'woocommerce_before_main_content', 'rosa2_add_start_main_content', 21 );
	add_action( 'woocommerce_after_main_content', 'rosa2_add_end_main_content', 21 );

    // Add ajax button to products
	add_action( 'woocommerce_after_add_to_cart_quantity', 'rosa2_output_ajax_add_to_cart_button' );

    // Add breadcrumbs on single product, right before title
	add_action( 'woocommerce_single_product_summary', 'woocommerce_breadcrumb', 1 );

    // Add shop categories on archive, right after title
	add_action( 'woocommerce_archive_description', 'woocommerce_display_categories', 1 );

    // Add Site title and Breadcrumbs to Checkout Page
	add_action( 'woocommerce_checkout_billing', 'rosa2_output_checkout_site_identity', 1 );
	add_action( 'woocommerce_checkout_billing', 'rosa2_output_checkout_breadcrumbs', 2 );

    // Output fly-out cart markup
	add_action( 'rosa_before_header', 'rosa2_output_mini_cart', 1 );

    // Hide tabs content titles
	add_filter( 'woocommerce_product_description_heading', '__return_false', 30 );
	add_filter( 'woocommerce_product_additional_information_heading', '__return_false', 30 );

    // Append cart to menu
	add_filter( 'wp_nav_menu_items', 'rosa2_append_cart_icon_to_menu', 10, 2 );

    // Limit related posts number
	add_filter( 'woocommerce_output_related_products_args', 'rosa2_limit_related_posts_count', 20 );

    // Limit upselling products number
	add_filter( 'woocommerce_upsell_display_args', 'rosa2_limit_related_posts_count', 20 );

    // Change args for WooCommerce pagination
	add_filter( 'woocommerce_pagination_args', 'rosa2_woocommerce_pagination_args', 40, 1 );

	add_filter( 'product_cat_class', 'rosa2_product_category_classes', 10, 1);

    // Change loop start
	add_filter( 'woocommerce_product_loop_start', 'rosa2_woocommerce_loop_start', 10, 1 );

    // Change loop end
	add_filter( 'woocommerce_product_loop_end', 'rosa2_woocommerce_loop_end', 10, 1 );

    // Change sale flash
	add_filter( 'woocommerce_sale_flash', 'rosa2_woocommerce_sale_flash', 10, 1 );
}
add_action( 'wp_loaded', 'rosa2_woocommerce_replace_hooks' );

function rosa2_woocommerce_product_class( $classes, $product ) {
    $classes[] = 'wc-block-grid__product';

	return $classes;
}

function rosa2_woocommerce_loop_start( $markup ) {
    // Change product classes.
	add_filter( 'woocommerce_post_class', 'rosa2_woocommerce_product_class', 10, 2 );

	return '<div class="wc-block-grid has-' . esc_attr( wc_get_loop_prop( 'columns' ) ) . '-columns"><ul class="wc-block-grid__products">';
}

function rosa2_woocommerce_loop_end( $markup ) {
	// Remove filter added in loop start.
	remove_filter( 'woocommerce_post_class', 'rosa2_woocommerce_product_class', 10 );

	return '</ul></div>';
}

function rosa2_woocommerce_sale_flash( $markup ) {
	return '<span class="wc-block-grid__product-onsale">' . esc_html__( 'Sale!', '__theme_txtd' ) . '</span>';
}

function rosa2_add_start_wrapper_before_single_product_summary() {
	echo '<div class="c-product-main">';
}

function rosa2_add_end_wrapper_after_single_product_summary() {
	echo '</div>';
}


function rosa2_add_start_wrapper_before_tabs() {
	echo '<div class="c-woo-section  c-woo-tabs">';
}

function rosa2_add_end_wrapper_after_tabs() {
	echo '</div>';
}

function rosa2_add_start_wrapper_before_upsells() {
	echo '<div class="c-woo-section  c-woo-upsells">';
}

function rosa2_add_end_wrapper_after_upsells() {
	echo '</div>';
}

function rosa2_add_start_wrapper_before_related() {
	echo '<div class="c-woo-section  c-woo-related">';
}

function rosa2_add_end_wrapper_after_related() {
	echo '</div>';
}

function rosa2_add_start_main_content() {
	echo '<div class="wp-block-group__inner-container"><div class="wp-block alignwide">';
}

function rosa2_add_end_main_content() {
	echo '</div></div>';
}

function rosa2_new_product_title_markup() {
	echo '<h2 class="wc-block-grid__product-title">' . get_the_title() . '</h2>';
}

function rosa2_price_wrapper_start() {
	echo '<div class="wc-block-grid__product-price price">';
}

function rosa2_price_wrapper_end() {
	echo '</div>';
}

function rosa2_append_add_to_cart_button()  {

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

function rosa2_output_checkout_site_identity() { ?>

    <h1 class="woocommerce-checkout-title"><a
                href="<?php echo esc_url( get_home_url() ); ?>"><span><?php echo esc_html( get_bloginfo( 'name' ) ) ?></span></a>
    </h1>

<?php }

function rosa2_output_checkout_breadcrumbs() { ?>

    <ul class="woocommerce-checkout-breadcrumbs">
        <li>
            <a href="<?php echo esc_url( wc_get_cart_url() ); ?>"><?php esc_html_e( 'Cart', '__theme_txtd' ); ?></a>
        </li>
        <li><?php esc_html_e( 'Checkout', '__theme_txtd' ); ?></li>
    </ul>

<?php }

function rosa2_limit_related_posts_count( $args ) {
	$args['posts_per_page'] = 3;
	$args['columns']        = 3;

	return $args;
}

function rosa2_output_ajax_add_to_cart_button() {
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

function rosa2_output_mini_cart() {
	if ( ! is_cart() ) { ?>

        <div class="c-mini-cart">
            <div class="c-mini-cart__overlay"></div>
            <div class="c-mini-cart__flyout">
                <div class="c-mini-cart__header">
                    <h5 class="c-mini-cart__title"><?php esc_html_e( 'Your cart', '__theme_txtd' ); ?></h5>
                    <div class="c-mini-cart__close"></div>
                </div>
				<?php the_widget( 'WC_Widget_Cart', 'title=' ); ?>
            </div>
        </div>

	<?php }
}


function rosa2_append_cart_icon_to_menu( $items, $args ) {

    if ( empty( WC()->cart ) ) {
        return $items;
    }

	$cart_item_count = WC()->cart->get_cart_contents_count();

	if ( $cart_item_count ) {
		$cart_count_span = '<div class="cart-count"><span>' . esc_html( $cart_item_count ) . '</span></div>';
	} else {
		$cart_count_span = '<div class="cart-count"><span>0</span></div>';
    }

	$cart_link = '<li class="menu-item  menu-item--cart"><a class="js-open-cart" href="' . esc_url( get_permalink( wc_get_page_id( 'cart' ) ) ) . '">' . $cart_count_span . '</a></li>';


	// Add the cart link to the end of the menu.
	if ( $args->theme_location === 'primary' ) {
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
				echo '<li><a href="' . esc_url( $all_link ) . '" ' . ( ( ! isset( $current_term->term_id ) ) ? ' class="active"' : ' class="inactive"' ) . '>' . esc_html__( 'All Products', '__theme_txtd' ) . '</a></li>';
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

if ( ! function_exists( ' rosa2_woocommerce_pagination_args' ) ) {
	function rosa2_woocommerce_pagination_args() {

		$args =  array(
			'end_size'           => 1,
			'mid_size'           => 2,
			'type'               => 'plain',
			'prev_text' => esc_html_x( 'Previous', 'previous set of posts', '__theme_txtd' ),
			'next_text' => esc_html_x( 'Next', 'next set of posts', '__theme_txtd' ),
		);

		return $args;
	}
}


if ( ! function_exists( 'rosa2_woocommerce_coupon_form' ) ) {
	function rosa2_woocommerce_coupon_form() {
		echo '<form class="checkout_coupon woocommerce-form-coupon" id="form-coupon" method="post" style="display:none"></form>';
	}
}

function rosa2_product_category_classes($class) {

	$class[] = 'wc-block-grid__product';

    return $class;
}

function rosa2_product_catalog_image_aspect_ratio() {
    if ( function_exists( 'wc_get_image_size' ) ) {
        $size = wc_get_image_size( 'thumbnail' );
    } else {
        $size = array(
            'width' => 300,
            'height' => 300
        );
    }


	$css = '' .
    '.wc-block-grid__product-link {
        --current-aspect-ratio: ' . $size['width'] / $size['height'] . ';' .
    '}';

	wp_add_inline_style( 'rosa2-woocommerce', $css );
}
add_action( 'wp_enqueue_scripts', 'rosa2_product_catalog_image_aspect_ratio' );

function rosa2_loop_product_link_open() {
	global $product;

	$link = apply_filters( 'woocommerce_loop_product_link', get_the_permalink(), $product );

	echo '<a href="' . esc_url( $link ) . '" class="wc-block-grid__product-link">';
}

function rosa2_loop_product_link_close() {
	echo '</a>';
}

function rosa2_loop_product_thumbnail_wrapper_open() {
    echo '<div class="wc-block-grid__product-image">';
}

function rosa2_loop_product_thumbnail_wrapper_close() {
    echo '</div>';
}
