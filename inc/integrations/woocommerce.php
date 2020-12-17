<?php
/**
 * Handle the WooCommerce integration logic.
 *
 * Everything here gets run at the `after_setup_theme` hook, priority 10.
 * So only use hooks that come after that. The rest will not run.
 */

// If this file is called directly, abort.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

function rosa2_woocommerce_setup() {

	if ( function_exists( 'WC' ) && pixelgrade_user_has_access( 'woocommerce' ) ) {

		// Add the necessary theme support flags
		add_theme_support( 'woocommerce' );
		add_theme_support( 'wc-product-gallery-lightbox' );
		add_theme_support( 'wc-product-gallery-slider' );

		// Load the integration logic.
		add_action( 'wp_enqueue_scripts', 'rosa2_woocommerce_scripts', 10 );
		add_action( 'enqueue_block_editor_assets', 'rosa2_enqueue_woocommerce_block_editor_assets', 10 );

        // We do this late so we can give all others room to play.
		add_action( 'wp_loaded', 'rosa2_woocommerce_setup_hooks' );

        // Add Cart Menu Item to Rosa2 extras box
		add_filter( 'rosa2_menu_items_boxes_config', 'rosa2_add_cart_to_menu_items' );
		add_action( 'wp_enqueue_scripts', 'rosa2_product_catalog_image_aspect_ratio' );

	}
}
add_action( 'after_setup_theme', 'rosa2_woocommerce_setup', 10 );

function rosa2_woocommerce_scripts() {
	$theme  = wp_get_theme( get_template() );
	$suffix = ( defined( 'SCRIPT_DEBUG' ) && SCRIPT_DEBUG ) ? '' : '.min';

	wp_enqueue_style( 'rosa2-woocommerce', get_template_directory_uri() . '/dist/css/woocommerce/style.css', array( 'rosa2-style' ), $theme->get( 'Version' ) );
	wp_style_add_data( 'rosa2-woocommerce', 'rtl', 'replace' );

	wp_enqueue_script( 'rosa2-woocommerce', get_template_directory_uri() . '/dist/js/woocommerce' . $suffix . '.js', array( 'jquery' ), $theme->get( 'Version' ), true );
	wp_localize_script( 'rosa2-woocommerce', 'pixelgradeWooCommerceStrings', array(
		'adding_to_cart' => esc_html__( 'Adding...', '__theme_txtd' ),
		'added_to_cart' => esc_html__( 'Added!', '__theme_txtd' ),
	) );

	wp_deregister_style('wc-block-style' );
}

function rosa2_enqueue_woocommerce_block_editor_assets() {
	$theme  = wp_get_theme( get_template() );

	wp_enqueue_style( 'rosa2-woocommerce-block-styles', get_template_directory_uri() . '/dist/css/woocommerce/block-editor.css', array(), $theme->get( 'Version' ) );
}

function rosa2_woocommerce_setup_hooks() {

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

	// Add wrapper for tabs on single product
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

//	add_action( 'woocommerce_before_thankyou', 'rosa2_output_checkout_site_identity', 1 );
//	add_action( 'woocommerce_before_thankyou', 'rosa2_output_checkout_breadcrumbs', 2 );

    // Output fly-out cart markup
	add_action( 'rosa_before_header', 'rosa2_output_mini_cart', 1 );

    // Hide tabs content titles
	add_filter( 'woocommerce_product_description_heading', '__return_false', 30 );
	add_filter( 'woocommerce_product_additional_information_heading', '__return_false', 30 );

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

	// Remove Sale Flash on Single Product
	remove_action( 'woocommerce_before_single_product_summary', 'woocommerce_show_product_sale_flash', 10 );

	// Change several of the breadcrumb defaults
	add_filter( 'woocommerce_breadcrumb_defaults', 'rosa2_woocommerce_breadcrumbs' );

    // Replace the shop link URL
	add_filter( 'woocommerce_breadcrumb_home_url', 'rosa2_woocommerce_custom_breadrumb_home_url' );

	// Add minus to quantity input
    add_action('woocommerce_before_quantity_input_field', 'rosa2_woocommerce_quantity_label', 10);
    add_action('woocommerce_before_quantity_input_field', 'rosa2_woocommerce_quantity_input_before', 20);
	add_action('woocommerce_after_quantity_input_field', 'rosa2_woocommerce_quantity_input_after');

    // Add label before stock
	add_filter( 'woocommerce_get_availability', 'rosa2_add_label_to_availability_display' );
}

function rosa2_woocommerce_product_class( $classes, $product ) {
    $classes[] = 'wc-block-grid__product';

	return $classes;
}

/**
 * Change the loop start markup.
 *
 * @param string $markup
 *
 * @return string
 */
function rosa2_woocommerce_loop_start( $markup ) {
    // We only want to filter product classes when we are in a loop (not when rendering single products).
	add_filter( 'woocommerce_post_class', 'rosa2_woocommerce_product_class', 10, 2 );

	$markup = '<div class="wc-block-grid has-' . esc_attr( wc_get_loop_prop( 'columns' ) ) . '-columns"><ul class="wc-block-grid__products">';

	return $markup;
}

/**
 * Change the loop end markup.
 *
 * @param string $markup
 *
 * @return string
 */
function rosa2_woocommerce_loop_end( $markup ) {
	// Remove filter added in loop start.
	remove_filter( 'woocommerce_post_class', 'rosa2_woocommerce_product_class', 10 );

	$markup = '</ul><!-- .wc-block-grid__products --></div><!-- .wc-block-grid -->';

	return $markup;
}

/**
 * Change the sale flash markup.
 *
 * @param string $markup
 *
 * @return string
 */
function rosa2_woocommerce_sale_flash( $markup ) {
	$markup = '<span class="wc-block-grid__product-onsale">' . esc_html__( 'Sale!', '__theme_txtd' ) . '</span>';

	return $markup;
}

function rosa2_add_start_wrapper_before_single_product_summary() {
	echo '<div class="c-product-main">';
}

function rosa2_add_end_wrapper_after_single_product_summary() {
	echo '</div><!-- .c-product-main -->';
}


function rosa2_add_start_wrapper_before_tabs() {
	$product_tabs = apply_filters( 'woocommerce_product_tabs', array() );

	if ( ! empty( $product_tabs ) ) {
		echo '<div class="c-woo-section  c-woo-tabs">';
    }
}

function rosa2_add_end_wrapper_after_tabs() {
	$product_tabs = apply_filters( 'woocommerce_product_tabs', array() );

	if ( ! empty( $product_tabs ) ) {
		echo '</div><!-- .c-woo-section.c-woo-tabs -->';
	}
}

function rosa2_add_start_wrapper_before_upsells() {
	echo '<div class="c-woo-section  c-woo-upsells">';
}

function rosa2_add_end_wrapper_after_upsells() {
	echo '</div><!-- .c-woo-section.c-woo-upsells -->';
}

function rosa2_add_start_wrapper_before_related() {
	echo '<div class="c-woo-section  c-woo-related">';
}

function rosa2_add_end_wrapper_after_related() {
	echo '</div><!-- .c-woo-section.c-woo-related -->';
}

function rosa2_add_start_main_content() {
	echo '<div class="wp-block-group__inner-container"><div class="wp-block alignwide">';
}

function rosa2_add_end_main_content() {
	echo '</div><!-- .wp-block.alignwide --></div><!-- .wp-block-group__inner-container -->';
}

function rosa2_new_product_title_markup() {
	echo '<h2 class="wc-block-grid__product-title">' . get_the_title() . '</h2>';
}

function rosa2_price_wrapper_start() {
	echo '<div class="wc-block-grid__product-price price">';
}

function rosa2_price_wrapper_end() {
	echo '</div><!-- .wc-block-grid__product-price.price -->';
}

function rosa2_append_add_to_cart_button()  {

	if ( 'product' !== get_post_type() ) {
		return;
	}

	$product = wc_get_product();
	if ( empty( $product ) ) {
		// Bail if we don't have a current product.
		return;
	}

	$class = 'add_to_cart_button';
	if ( $product->is_type( 'simple' ) && 'yes' === get_option( 'woocommerce_enable_ajax_add_to_cart' ) ) {
		$class .= '  ajax_add_to_cart';
	} ?>

    <div class="wp-block-button wc-block-grid__product-add-to-cart">
		<?php woocommerce_template_loop_add_to_cart( array( 'class' => $class ) ); ?>
    </div>

<?php }

function rosa2_output_checkout_site_identity() { ?>

    <h1 class="woocommerce-checkout-title"><a href="<?php echo esc_url( get_home_url() ); ?>" rel="home"><span><?php echo esc_html( get_bloginfo( 'name' ) ) ?></span></a></h1>

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
	if ( ! empty( $product ) && $product->is_type( 'simple' ) && 'yes' === get_option( 'woocommerce_enable_ajax_add_to_cart' ) ) {
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

if ( ! function_exists( 'woocommerce_display_categories' ) ) {

	function woocommerce_display_categories() {

		// If there is a category queried, cache it.
		$current_term = get_queried_object();

		// Get all product categories.
		$terms = get_terms( array(
			'taxonomy' => 'product_cat',
		) );
		if ( ! empty( $terms ) ) {
			// Create a link which should link to the shop.
			$all_link = get_post_type_archive_link( 'product' );

			echo '<ul class="woocommerce-categories">';
			// display the shop link first if there is one
			if ( ! empty( $all_link ) ) {
				// also if the current_term doesn't have a term_id it means we are quering the shop and the "all categories" should be active
				echo '<li><a href="' . esc_url( $all_link ) . '" ' . ( ( ! isset( $current_term->term_id ) ) ? ' class="active"' : ' class="inactive"' ) . '>' . esc_html__( 'All Products', '__theme_txtd' ) . '</a></li>';
			}

			// Display a link for each product category.
			foreach ( $terms as $term ) {
				if ( ! empty( $current_term->name ) && $current_term->name === $term->name ) {
					echo '<li><span class="active">' . esc_html( $term->name ) . '</span></li>';
				} else {
					$link = get_term_link( $term, 'product_cat' );
					if ( ! is_wp_error( $link ) ) {
						echo '<li><a href="' . esc_url( $link ) . '">' . esc_html( $term->name ) . '</a></li>';
					}
				}
			}
			echo '</ul><!-- .woocommerce-categories -->';
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
		echo '<form class="checkout_coupon woocommerce-form-coupon" id="form-coupon" method="post" style="display:none">
                <input form="woocommerce-form-coupon" type="text" name="coupon_code" class="js-coupon-value-destination input-text" placeholder="Coupon code" id="coupon_code" value="">
              </form>';
	}
}

function rosa2_product_category_classes($class) {

	$class[] = 'wc-block-grid__product';

    return $class;
}

function rosa2_product_catalog_image_aspect_ratio() {
	$aspect_ratio = 1;

    if ( function_exists( 'wc_get_image_size' ) ) {
        $size = wc_get_image_size( 'thumbnail' );
	    if ( ! empty( $size['width'] ) && ! empty( $size['height'] ) ) {
		    $aspect_ratio = $size['width'] / $size['height'];
	    }
    }

	$css = '' .
    '.wc-block-grid__product-link {
        --current-aspect-ratio: ' . $aspect_ratio . ';' .
    '}';

	wp_add_inline_style( 'rosa2-woocommerce', $css );
}

function rosa2_loop_product_link_open() {
	global $product;

	$link = apply_filters( 'woocommerce_loop_product_link', get_the_permalink(), $product );

	echo '<a href="' . esc_url( $link ) . '" class="wc-block-grid__product-link">';
}

function rosa2_loop_product_link_close() {
	echo '</a><!-- .wc-block-grid__product-link -->';
}

function rosa2_loop_product_thumbnail_wrapper_open() {
    echo '<div class="wc-block-grid__product-image">';
}

function rosa2_loop_product_thumbnail_wrapper_close() {
    echo '</div><!-- .wc-block-grid__product-image -->';
}

function rosa2_woocommerce_breadcrumbs() {
	return array(
		'delimiter'   => ' &#47; ',
		'wrap_before' => '<nav class="woocommerce-breadcrumb" itemprop="breadcrumb">',
		'wrap_after'  => '</nav>',
		'before'      => '<span>',
		'after'       => '</span>',
		'home'        => _x( 'Shop', 'breadcrumb', 'woocommerce' ),
	);
}

function rosa2_woocommerce_quantity_input_before() {
    echo '<button class="qty_button minus button--is-disabled"></button>';
}

function rosa2_woocommerce_quantity_input_after() {
	echo '<button class="qty_button plus"></button></div>';
}

function rosa2_woocommerce_quantity_label() {

	$label = '<label for="quantity">' . esc_html__( 'Quantity', 'woocommerce' ) . '</label><div class="quantity__wrapper">';

	echo $label;
}

function rosa2_add_label_to_availability_display( $availability ) {
    global $product;

	if( is_product() && $product-> get_manage_stock() ){
		$label = '<span>' . esc_html__( 'Stock', 'woocommerce' ) . '</span>';
		$availability['availability'] = $label . '<span>' .$availability['availability'] . '</span>';
	}

	return $availability;
}

function rosa2_woocommerce_custom_breadrumb_home_url() {
	return get_permalink( wc_get_page_id( 'shop' ) );
}

function rosa2_add_cart_to_menu_items( $items ) {

    if ( ! isset( $items['pxg-extras'] ) ) {
        $items['pxg-extras'] = array();
    }

    if ( ! isset( $items['pxg-extras']['menu_items'] ) ) {
        $items['pxg-extras']['menu_items'] = array();
    }

	$items['pxg-extras']['menu_items']['cart'] = array(
		'type'        => 'custom-pxg',
		'type_label'  => esc_html__( 'Custom', '__theme_txtd' ),
		'title'       => esc_html__( 'Cart', '__theme_txtd' ),
		'label'       => esc_html__( 'Cart', '__theme_txtd' ),
		'url'         => esc_url( get_permalink( wc_get_page_id( 'cart' ) ) ),
		'attr_title'  => esc_html__( 'Toggle visibility of cart panel', '__theme_txtd' ),
		// These are classes that will be merged with the user defined classes.
		'classes'     => array( 'menu-item--cart' ),
		'custom_fields' => array(
			'visual_style' => array(
				'type'        => 'select',
				'label'       => esc_html__( 'Visual Style', '__theme_txtd' ),
				'description' => esc_html__( 'Choose a visual style suitable to your goals and audience.', '__theme_txtd' ),
				'default'     => 'icon',
				'options'     => array(
					'label'      => esc_html__( 'Label', '__theme_txtd' ),
					'icon'       => esc_html__( 'Icon', '__theme_txtd' ),
					'label_icon' => esc_html__( 'Label with icon', '__theme_txtd' ),
				),
			),
		),
	);

    return $items;
}
