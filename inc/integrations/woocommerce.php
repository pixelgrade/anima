<?php
/**
 * Handle the WooCommerce integration logic.
 *
 * Everything here gets run at the `after_setup_theme` hook, priority 10.
 * So only use hooks that come after that. The rest will not run.
 *
 * @package Anima
 */

// If this file is called directly, abort.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

function anima_woocommerce_setup() {

	if ( function_exists( 'WC' ) && pixelgrade_user_has_access( 'woocommerce' ) ) {

		// Add the necessary theme support flags
		add_theme_support( 'woocommerce' );
		add_theme_support( 'wc-product-gallery-lightbox' );
		add_theme_support( 'wc-product-gallery-slider' );

		// Load the integration logic.
		add_action( 'wp_enqueue_scripts', 'anima_woocommerce_scripts', 10 );
		add_action( 'enqueue_block_editor_assets', 'anima_enqueue_woocommerce_block_editor_assets', 10 );

        // We do this late so we can give all others room to play.
		add_action( 'wp_loaded', 'anima_woocommerce_setup_hooks' );

        // Add Cart Menu Item to Anima extras box
		add_filter( 'anima/menu_items_boxes_config', 'anima_add_cart_to_extras_menu_items', 10, 1 );

		add_action( 'wp_enqueue_scripts', 'anima_product_catalog_image_aspect_ratio' );

	}
}
add_action( 'after_setup_theme', 'anima_woocommerce_setup', 10 );

function anima_woocommerce_scripts() {
	$theme  = wp_get_theme( get_template() );
	$suffix = ( defined( 'SCRIPT_DEBUG' ) && SCRIPT_DEBUG ) ? '' : '.min';

	wp_enqueue_style( 'anima-woocommerce', get_template_directory_uri() . '/dist/css/woocommerce/style.css', [ 'anima-style' ], $theme->get( 'Version' ) );
	wp_style_add_data( 'anima-woocommerce', 'rtl', 'replace' );

	wp_enqueue_script( 'anima-woocommerce', get_template_directory_uri() . '/dist/js/woocommerce' . $suffix . '.js', [ 'jquery' ], $theme->get( 'Version' ), true );
	wp_localize_script( 'anima-woocommerce', 'pixelgradeWooCommerceStrings', [
		'adding_to_cart' => esc_html__( 'Adding...', '__theme_txtd' ),
		'added_to_cart' => esc_html__( 'Added!', '__theme_txtd' ),
	] );

	wp_deregister_style('wc-block-style' );

	// Enqueue Sidecar Style on  WooCommerce pages.
	if ( is_home() || is_archive() || is_woocommerce() && ! wp_style_is( 'novablocks/sidecar-style', 'enqueued' ) ) {
		wp_enqueue_style( 'novablocks/sidecar-style' );
	}
}

function anima_enqueue_woocommerce_block_editor_assets() {
	$theme  = wp_get_theme( get_template() );

	wp_enqueue_style( 'anima-woocommerce-block-styles', get_template_directory_uri() . '/dist/css/woocommerce/block-editor.css', [], $theme->get( 'Version' ) );
}

function anima_woocommerce_setup_hooks() {

    // Remove Sidebar
	remove_action( 'woocommerce_sidebar', 'woocommerce_get_sidebar', 10 );

	// Remove Breadcrumbs
	remove_action( 'woocommerce_before_main_content', 'woocommerce_breadcrumb', 20 );

	// 1. Remove coupon form
    // 2. Move coupon form between Site Title and Checkout Form
    // 3. Add hidden coupon form outside checkout form
	remove_action( 'woocommerce_before_checkout_form', 'woocommerce_checkout_coupon_form', 10 ); /* 1 */
	add_action( 'woocommerce_checkout_billing', 'woocommerce_checkout_coupon_form', 10 ); /* 2 */
	add_action( 'woocommerce_before_checkout_form', 'anima_woocommerce_coupon_form', 10 ); /* 3 */

    // Add wrapper for summary on single product
	add_action( 'woocommerce_before_single_product_summary', 'anima_add_start_wrapper_before_single_product_summary', 1 );
	add_action( 'woocommerce_after_single_product_summary', 'anima_add_end_wrapper_after_single_product_summary', 1 );

	// Add wrapper for tabs on single product
	add_action( 'woocommerce_after_single_product_summary', 'anima_add_start_wrapper_before_tabs', 9 );
	add_action( 'woocommerce_after_single_product_summary', 'anima_add_end_wrapper_after_tabs', 11 );

	// Add wrapper for upsells
	add_action( 'woocommerce_after_single_product_summary', 'anima_add_start_wrapper_before_upsells', 14 );
	add_action( 'woocommerce_after_single_product_summary', 'anima_add_end_wrapper_after_upsells', 16 );

    // Add wrapper for related products
	add_action( 'woocommerce_after_single_product_summary', 'anima_add_start_wrapper_before_related', 19 );
	add_action( 'woocommerce_after_single_product_summary', 'anima_add_end_wrapper_after_related', 21 );

    // Change class for the product link to match editor block markup
	remove_action( 'woocommerce_before_shop_loop_item', 'woocommerce_template_loop_product_link_open', 10 );
	remove_action( 'woocommerce_after_shop_loop_item', 'woocommerce_template_loop_product_link_close', 5 );
	add_action( 'woocommerce_before_shop_loop_item', 'anima_loop_product_link_open', 10 );
	add_action( 'woocommerce_after_shop_loop_item', 'anima_loop_product_link_close', 5 );

	// Add wrapper for product thumbnail in loops to match editor block markup
	add_action( 'woocommerce_before_shop_loop_item_title', 'anima_loop_product_thumbnail_wrapper_open', 9 );
	add_action( 'woocommerce_before_shop_loop_item_title', 'anima_loop_product_thumbnail_wrapper_close', 11 );

    // Change loop product title
	remove_action('woocommerce_shop_loop_item_title', 'woocommerce_template_loop_product_title', 10);
	add_action('woocommerce_shop_loop_item_title', 'anima_new_product_title_markup', 10);

	// Move sale flash outside the product link to match editor block markup
	remove_action( 'woocommerce_before_shop_loop_item_title', 'woocommerce_show_product_loop_sale_flash', 10 );
	add_action( 'woocommerce_after_shop_loop_item', 'woocommerce_show_product_loop_sale_flash', 5 );

	// Add wrapper for product price in loops and move it after sale flash
	remove_action( 'woocommerce_after_shop_loop_item_title', 'woocommerce_template_loop_price', 10 );
	add_action( 'woocommerce_after_shop_loop_item', 'anima_price_wrapper_start', 5 );
	add_action( 'woocommerce_after_shop_loop_item', 'woocommerce_template_loop_price', 5 );
	add_action( 'woocommerce_after_shop_loop_item', 'anima_price_wrapper_end', 5 );

	// Replace Add To Cart button inside loops with ajax add to cart
	remove_action( 'woocommerce_after_shop_loop_item', 'woocommerce_template_loop_add_to_cart', 10 );
	add_action('woocommerce_after_shop_loop_item', 'anima_append_add_to_cart_button', 5);

    // Add wrapper for single product (container)
	add_action( 'woocommerce_before_main_content', 'anima_add_start_main_content', 21 );
	add_action( 'woocommerce_after_main_content', 'anima_add_end_main_content', 21 );

    // Add ajax button to products
	add_action( 'woocommerce_after_add_to_cart_quantity', 'anima_output_ajax_add_to_cart_button' );

    // Add breadcrumbs on single product, right before title
	add_action( 'woocommerce_single_product_summary', 'woocommerce_breadcrumb', 1 );

    // Add shop categories on archive, right after title
	add_action( 'woocommerce_archive_description', 'woocommerce_display_categories', 1 );

    // Add Site title and Breadcrumbs to Checkout Page
	add_action( 'woocommerce_checkout_billing', 'anima_output_checkout_site_identity', 1 );
	add_action( 'woocommerce_checkout_billing', 'anima_output_checkout_breadcrumbs', 2 );

//	add_action( 'woocommerce_before_thankyou', 'anima_output_checkout_site_identity', 1 );
//	add_action( 'woocommerce_before_thankyou', 'anima_output_checkout_breadcrumbs', 2 );

    // Output fly-out cart markup
	add_action( 'anima/header:before', 'anima_output_mini_cart', 1 );

    // Hide tabs content titles
	add_filter( 'woocommerce_product_description_heading', '__return_false', 30 );
	add_filter( 'woocommerce_product_additional_information_heading', '__return_false', 30 );

    // Limit related posts number
	add_filter( 'woocommerce_output_related_products_args', 'anima_limit_related_posts_count', 20 );

    // Limit upselling products number
	add_filter( 'woocommerce_upsell_display_args', 'anima_limit_related_posts_count', 20 );

    // Change args for WooCommerce pagination
	add_filter( 'woocommerce_pagination_args', 'anima_woocommerce_pagination_args', 40, 1 );

	add_filter( 'product_cat_class', 'anima_product_category_classes', 10, 1);

    // Change loop start
	add_filter( 'woocommerce_product_loop_start', 'anima_woocommerce_loop_start', 9, 1 );

    // Change loop end
	add_filter( 'woocommerce_product_loop_end', 'anima_woocommerce_loop_end', 10, 1 );

    // Change sale flash
	add_filter( 'woocommerce_sale_flash', 'anima_woocommerce_sale_flash', 10, 1 );

	// Remove Sale Flash on Single Product
	remove_action( 'woocommerce_before_single_product_summary', 'woocommerce_show_product_sale_flash', 10 );

	// Change several of the breadcrumb defaults
	add_filter( 'woocommerce_breadcrumb_defaults', 'anima_woocommerce_breadcrumbs' );

    // Replace the shop link URL
	add_filter( 'woocommerce_breadcrumb_home_url', 'anima_woocommerce_custom_breadrumb_home_url' );

	// Add minus to quantity input
    add_action('woocommerce_before_quantity_input_field', 'anima_woocommerce_quantity_label', 10);
    add_action('woocommerce_before_quantity_input_field', 'anima_woocommerce_quantity_input_before', 20);
	add_action('woocommerce_after_quantity_input_field', 'anima_woocommerce_quantity_input_after');

    // Add label before stock
	add_filter( 'woocommerce_get_availability', 'anima_add_label_to_availability_display' );
}

function anima_woocommerce_product_class( $classes, $product ) {
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
function anima_woocommerce_loop_start( string $markup ): string {
    // We only want to filter product classes when we are in a loop (not when rendering single products).
	add_filter( 'woocommerce_post_class', 'anima_woocommerce_product_class', 10, 2 );

	return '<div class="wc-block-grid alignwide has-' . esc_attr( wc_get_loop_prop( 'columns' ) ) . '-columns"><ul class="wc-block-grid__products">';
}

/**
 * Change the loop end markup.
 *
 * @param string $markup
 *
 * @return string
 */
function anima_woocommerce_loop_end( string $markup ): string {
	// Remove filter added in loop start.
	remove_filter( 'woocommerce_post_class', 'anima_woocommerce_product_class', 10 );

	return '</ul><!-- .wc-block-grid__products --></div><!-- .wc-block-grid -->';
}

/**
 * Change the sale flash markup.
 *
 * @param string $markup
 *
 * @return string
 */
function anima_woocommerce_sale_flash( string $markup ): string {
	return '<span class="wc-block-grid__product-onsale">' . esc_html__( 'Sale!', '__theme_txtd' ) . '</span>';
}

function anima_add_start_wrapper_before_single_product_summary() {
	echo '<div class="c-product-main">';
}

function anima_add_end_wrapper_after_single_product_summary() {
	echo '</div><!-- .c-product-main -->';
}


function anima_add_start_wrapper_before_tabs() {
	$product_tabs = apply_filters( 'woocommerce_product_tabs', [] );

	if ( ! empty( $product_tabs ) ) {
		echo '<div class="c-woo-section  c-woo-tabs">';
    }
}

function anima_add_end_wrapper_after_tabs() {
	$product_tabs = apply_filters( 'woocommerce_product_tabs', [] );

	if ( ! empty( $product_tabs ) ) {
		echo '</div><!-- .c-woo-section.c-woo-tabs -->';
	}
}

function anima_add_start_wrapper_before_upsells() {
	echo '<div class="c-woo-section  c-woo-upsells">';
}

function anima_add_end_wrapper_after_upsells() {
	echo '</div><!-- .c-woo-section.c-woo-upsells -->';
}

function anima_add_start_wrapper_before_related() {
	echo '<div class="c-woo-section  c-woo-related">';
}

function anima_add_end_wrapper_after_related() {
	echo '</div><!-- .c-woo-section.c-woo-related -->';
}

function anima_add_start_main_content() {
	echo '<!-- wp:novablocks/sidecar --><!-- wp:novablocks/sidecar-area -->';
}

function anima_add_end_main_content() {
	echo '<!-- /wp:novablocks/sidecar-area --><!-- /wp:novablocks/sidecar -->';
}

function anima_new_product_title_markup() {
	echo '<h2 class="wc-block-grid__product-title">' . get_the_title() . '</h2>';
}

function anima_price_wrapper_start() {
	echo '<div class="wc-block-grid__product-price price">';
}

function anima_price_wrapper_end() {
	echo '</div><!-- .wc-block-grid__product-price.price -->';
}

function anima_append_add_to_cart_button()  {

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
		<?php woocommerce_template_loop_add_to_cart( [ 'class' => $class ] ); ?>
    </div>

<?php }

function anima_output_checkout_site_identity() { ?>

    <h1 class="woocommerce-checkout-title"><a href="<?php echo esc_url( get_home_url() ); ?>" rel="home"><span><?php echo esc_html( get_bloginfo( 'name' ) ) ?></span></a></h1>

<?php }

function anima_output_checkout_breadcrumbs() { ?>

    <ul class="woocommerce-checkout-breadcrumbs">
        <li>
            <a href="<?php echo esc_url( wc_get_cart_url() ); ?>"><?php esc_html_e( 'Cart', '__theme_txtd' ); ?></a>
        </li>
        <li><?php esc_html_e( 'Checkout', '__theme_txtd' ); ?></li>
    </ul>

<?php }

function anima_limit_related_posts_count( $args ) {
	$args['posts_per_page'] = 3;
	$args['columns']        = 3;

	return $args;
}

function anima_output_ajax_add_to_cart_button() {
	if ( 'product' !== get_post_type() ) {
		return;
	}

	$product = wc_get_product();
	if ( ! empty( $product ) && $product->is_type( 'simple' ) && 'yes' === get_option( 'woocommerce_enable_ajax_add_to_cart' ) ) {
		woocommerce_template_loop_add_to_cart( [
			'class' => 'add_to_cart_button  ajax_add_to_cart'
		] );
	}
}

function anima_output_mini_cart() {
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
		$terms = get_terms( [
			'taxonomy' => 'product_cat',
		] );
		if ( ! empty( $terms ) ) {
			// Create a link which should link to the shop.
			$all_link = get_post_type_archive_link( 'product' );

			echo '<ul class="woocommerce-categories">';
			// display the shop link first if there is one
			if ( ! empty( $all_link ) ) {
				// also if the current_term doesn't have a term_id it means we are quering the shop and the "all categories" should be active
				echo '<li><a href="' . esc_url( $all_link ) . '" ' . ( ( ! isset( $current_term->term_id ) ) ? ' class="active"' : ' class="inactive"' ) . '>' . esc_html__( 'All Products', '__theme_txtd' ) . '</a></li>';
			}
			// If we are on main shop page,
            // display only main categories.
			if ( is_shop() ) {
				foreach ( $terms as $term ) {
					if ( ! empty( $current_term->name ) && $current_term->name === $term->name ) {
					    // Check If the menu item in list is the current term,
                        // add .active class so we can add some style on it.
						echo '<li><span class="active">' . esc_html( $term->name ) . '</span></li>';
					} else {
						$link = get_term_link( $term, 'product_cat' );
						// Display main categories.
						if ( ! is_wp_error( $link ) &&  empty( $term->parent ) ) {
							echo '<li><a href="' . esc_url( $link ) . '">' . esc_html( $term->name ) . '</a></li>';
						}
					}
				}
			} else {
			    // Make sure taxonomy is set and the term has parent.
				if ( isset( $current_term->taxonomy ) ) {

					$subcategories = anima_woocommerce_get_subcategories($current_term);

					foreach ( $subcategories as $subcategory ) {
						$link = get_term_link( $subcategory, 'product_cat' );
						echo '<li><a href="' . esc_url( $link ) . '">' . esc_html( $subcategory->name ) . '</a></li>';
					}
				}
			}
			echo '</ul><!-- .woocommerce-categories -->';
		}
	}
}

if ( ! function_exists( ' anima_woocommerce_pagination_args' ) ) {
	function anima_woocommerce_pagination_args(): array {

		return [
			'end_size'           => 1,
			'mid_size'           => 2,
			'type'               => 'plain',
			'prev_text' => esc_html_x( 'Previous', 'previous set of posts', '__theme_txtd' ),
			'next_text' => esc_html_x( 'Next', 'next set of posts', '__theme_txtd' ),
		];
	}
}


if ( ! function_exists( 'anima_woocommerce_coupon_form' ) ) {
	function anima_woocommerce_coupon_form() {
		echo '<form class="checkout_coupon woocommerce-form-coupon" id="form-coupon" method="post" style="display:none">
                <input form="woocommerce-form-coupon" type="text" name="coupon_code" class="js-coupon-value-destination input-text" placeholder="' . esc_attr__( 'Coupon code', '__theme_txtd' ) . '" id="coupon_code" value="">
              </form>';
	}
}

function anima_product_category_classes($class) {

	$class[] = 'wc-block-grid__product';

    return $class;
}

function anima_product_catalog_image_aspect_ratio() {
	$aspect_ratio = 1;

    if ( function_exists( 'wc_get_image_size' ) ) {
        $size = wc_get_image_size( 'thumbnail' );
	    if ( ! empty( $size['width'] ) && ! empty( $size['height'] ) ) {
		    $aspect_ratio = $size['width'] / $size['height'];
	    }
    }

	$css = '.wc-block-grid__product-link {
	    --current-aspect-ratio: ' . $aspect_ratio . ';' .
	       '}';

	wp_add_inline_style( 'anima-woocommerce', $css );
}

function anima_loop_product_link_open() {
	global $product;

	$link = apply_filters( 'woocommerce_loop_product_link', get_the_permalink(), $product );

	echo '<a href="' . esc_url( $link ) . '" class="wc-block-grid__product-link">';
}

function anima_loop_product_link_close() {
	echo '</a><!-- .wc-block-grid__product-link -->';
}

function anima_loop_product_thumbnail_wrapper_open() {
    echo '<div class="wc-block-grid__product-image">';
}

function anima_loop_product_thumbnail_wrapper_close() {
    echo '</div><!-- .wc-block-grid__product-image -->';
}

function anima_woocommerce_breadcrumbs() {
	return [
		'delimiter'   => ' &#47; ',
		'wrap_before' => '<nav class="woocommerce-breadcrumb" itemprop="breadcrumb">',
		'wrap_after'  => '</nav>',
		'before'      => '<span>',
		'after'       => '</span>',
		'home'        => esc_html_x( 'Shop', 'breadcrumb', '__theme_txtd' ),
	];
}

function anima_woocommerce_quantity_input_before() {
    echo '<button class="qty_button minus button--is-disabled"></button>';
}

function anima_woocommerce_quantity_input_after() {
	echo '<button class="qty_button plus"></button></div>';
}

function anima_woocommerce_quantity_label() {

	$label = '<label for="quantity">' . esc_html__( 'Quantity', '__theme_txtd' ) . '</label><div class="quantity__wrapper">';

	echo $label;
}

/**
 * @param array $availability
 *
 * @return array
 */
function anima_add_label_to_availability_display( array $availability ): array {
    global $product;

	if( is_product() && $product-> get_manage_stock() ){
		$label = '<span>' . esc_html__( 'Stock', '__theme_txtd' ) . '</span>';
		$availability['availability'] = $label . '<span>' .$availability['availability'] . '</span>';
	}

	return $availability;
}

/**
 * @return false|string|WP_Error
 */
function anima_woocommerce_custom_breadrumb_home_url() {
	return get_permalink( wc_get_page_id( 'shop' ) );
}

/**
 * @param array|mixed $items
 *
 * @return array
 */
function anima_add_cart_to_extras_menu_items( $items ): array {
	if ( empty( $items ) ) {
		$items = [];
	}
    if ( empty( $items['pxg-extras'] ) ) {
        $items['pxg-extras'] = [];
    }
    if ( empty( $items['pxg-extras']['menu_items'] ) ) {
        $items['pxg-extras']['menu_items'] = [];
    }

	$items['pxg-extras']['menu_items']['cart'] = [
		'type'        => 'custom-pxg',
		'type_label'  => esc_html__( 'Custom', '__theme_txtd' ),
		// This is used for the default Navigation Label value once the menu item is added in a menu.
		'title'       => esc_html__( 'Cart', '__theme_txtd' ),
		// This is the label used for the menu items list.
		'label'       => esc_html__( 'WooCommerce Cart', '__theme_txtd' ),
		'url'         => esc_url( get_permalink( wc_get_page_id( 'cart' ) ) ),
		'attr_title'  => esc_html__( 'Toggle visibility of cart panel', '__theme_txtd' ),
		// These are classes that will be merged with the user defined classes.
		'classes'     => [ 'menu-item--cart' ],
		'custom_fields' => [
			'visual_style' => [
				'type'        => 'select',
				'label'       => esc_html__( 'Visual Style', '__theme_txtd' ),
				'description' => esc_html__( 'Choose a visual style suitable to your goals and audience.', '__theme_txtd' ),
				'default'     => 'icon',
				'options'     => [
					'label'      => esc_html__( 'Label', '__theme_txtd' ),
					'icon'       => esc_html__( 'Icon', '__theme_txtd' ),
					'label_icon' => esc_html__( 'Label with icon', '__theme_txtd' ),
				],
			],
		],
		// Specify the menu item fields we should force-hide via inline CSS for this menu item.
		// This means that despite the Screen Options, these fields will not be shown.
		// Use the value used by core in classes like "field-xfn" -> the 'xfn' value to use.
		'hidden_fields' => [ 'link-target', 'xfn', 'description', ],
	];

    return $items;
}

/**
 * Helper function to get WooCommerce subcategories.
 *
 * @param Object $category
 *
 * @return array
 */

function anima_woocommerce_get_subcategories( $category ): array {

    // Get category ID;
	$parent_category_ID = $category->term_id;

	// Args used to get categories.
	$args = [
		'hierarchical' => 1,
		'show_option_none' => '',
		'hide_empty' => 1,
		'parent' => $parent_category_ID,
		'taxonomy' => 'product_cat'
	];

	return get_categories($args);
}
