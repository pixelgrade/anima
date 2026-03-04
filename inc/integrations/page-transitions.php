<?php
/**
 * Page Transitions — AJAX navigation with animated border overlay.
 *
 * Ported from the Pile theme's transition system.
 * Uses Barba.js v2 for AJAX navigation and GSAP for animations.
 *
 * @package Anima
 */

// If this file is called directly, abort.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Check if page transitions are enabled.
 *
 * @return bool
 */
function anima_page_transitions_enabled() {
	// Disabled in Customizer preview — full reloads needed for Customizer to track changes.
	if ( is_customize_preview() ) {
		return false;
	}

	return (bool) pixelgrade_option( 'enable_page_transitions', false );
}

/**
 * Enqueue page transitions script when the feature is enabled.
 */
function anima_page_transitions_enqueue() {
	if ( ! anima_page_transitions_enabled() ) {
		return;
	}

	wp_enqueue_script( 'anima-page-transitions' );

	// Build excluded URLs list.
	$excluded_urls = anima_page_transitions_get_excluded_urls();

	wp_localize_script( 'anima-page-transitions', 'animaPageTransitions', [
		'excludedUrls' => $excluded_urls,
	] );
}
add_action( 'wp_enqueue_scripts', 'anima_page_transitions_enqueue', 30 );

/**
 * Build the list of URLs that should skip AJAX navigation.
 *
 * @return array
 */
function anima_page_transitions_get_excluded_urls() {
	$excluded = [];

	// WooCommerce transactional pages.
	if ( function_exists( 'wc_get_page_id' ) ) {
		$cart_page_id     = wc_get_page_id( 'cart' );
		$checkout_page_id = wc_get_page_id( 'checkout' );

		if ( $cart_page_id > 0 ) {
			$excluded[] = get_permalink( $cart_page_id );
		}
		if ( $checkout_page_id > 0 ) {
			$excluded[] = get_permalink( $checkout_page_id );
		}
	}

	/**
	 * Filter the URLs excluded from AJAX page transitions.
	 *
	 * @param array $excluded Array of URL strings to exclude.
	 */
	return apply_filters( 'anima_page_transitions_excluded_urls', $excluded );
}

/**
 * Output the Barba wrapper opening tag before the template HTML.
 */
function anima_page_transitions_wrapper_open() {
	if ( ! anima_page_transitions_enabled() ) {
		return;
	}

	$namespace = 'page';
	if ( is_singular() ) {
		$namespace = get_post_type();
	} elseif ( is_archive() ) {
		$namespace = 'archive';
	} elseif ( is_search() ) {
		$namespace = 'search';
	} elseif ( is_404() ) {
		$namespace = '404';
	}

	echo '<div data-barba="wrapper">';
	echo '<div data-barba="container" data-barba-namespace="' . esc_attr( $namespace ) . '">';
}
add_action( 'anima/template_html:before', 'anima_page_transitions_wrapper_open', 10 );

/**
 * Output the Barba wrapper closing tag after the template HTML.
 */
function anima_page_transitions_wrapper_close() {
	if ( ! anima_page_transitions_enabled() ) {
		return;
	}

	echo '</div><!-- [data-barba="container"] -->';
	echo '</div><!-- [data-barba="wrapper"] -->';
}
add_action( 'anima/template_html:after', 'anima_page_transitions_wrapper_close', 10 );

/**
 * Output the border overlay markup in wp_footer.
 */
function anima_page_transitions_overlay_markup() {
	if ( ! anima_page_transitions_enabled() ) {
		return;
	}

	$logo = '';
	if ( has_custom_logo() ) {
		$logo = get_custom_logo();
	}
	?>
	<div class="c-page-transition-border js-page-transition-border"
	     style="border-color: var(--sm-current-accent-color); background: var(--sm-current-accent-color);">
		<div class="border-logo-bgscale">
			<div class="border-logo-background">
				<div class="border-logo-fill"></div>
				<div class="logo"><?php echo $logo; ?></div>
			</div>
		</div>
		<div class="border-logo"><div class="logo"><?php echo $logo; ?></div></div>
	</div>
	<?php
}
add_action( 'wp_footer', 'anima_page_transitions_overlay_markup', 5 );

/**
 * Add body class when page transitions are enabled.
 */
function anima_page_transitions_body_class( $classes ) {
	if ( anima_page_transitions_enabled() ) {
		$classes[] = 'has-page-transitions';
	}

	return $classes;
}
add_filter( 'body_class', 'anima_page_transitions_body_class' );
