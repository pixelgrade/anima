<?php
/**
 * Page Transitions Integration
 *
 * Provides smooth AJAX-like page transitions using the View Transitions API,
 * Navigation API, and GSAP animations. Controlled by a Style Manager toggle.
 *
 * When disabled: zero footprint — no JS, CSS, or markup output.
 *
 * @package Anima
 */

// If this file is called directly, abort.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Check if page transitions are enabled via Style Manager.
 *
 * @return bool
 */
function anima_page_transitions_enabled() {
	// Don't run in Customizer preview — full reloads needed.
	if ( is_customize_preview() ) {
		return false;
	}

	// Don't run in admin.
	if ( is_admin() ) {
		return false;
	}

	// Force-enabled for testing. TODO: restore pixelgrade_option check.
	return true;
}

/**
 * Register and enqueue page transitions assets.
 */
function anima_page_transitions_enqueue() {
	if ( ! anima_page_transitions_enabled() ) {
		return;
	}

	$theme  = wp_get_theme( get_template() );
	$suffix = ( defined( 'SCRIPT_DEBUG' ) && SCRIPT_DEBUG ) ? '' : '.min';

	// Register the page transitions script.
	wp_register_script(
		'anima-page-transitions',
		trailingslashit( get_template_directory_uri() ) . 'dist/js/page-transitions' . $suffix . '.js',
		array( 'gsap' ),
		$theme->get( 'Version' ),
		true
	);

	// Build excluded URLs list.
	$excluded_urls = array();

	// WooCommerce transactional pages.
	if ( function_exists( 'wc_get_page_permalink' ) ) {
		$excluded_urls[] = wp_make_link_relative( wc_get_page_permalink( 'cart' ) );
		$excluded_urls[] = wp_make_link_relative( wc_get_page_permalink( 'checkout' ) );
		$excluded_urls[] = wp_make_link_relative( wc_get_page_permalink( 'myaccount' ) );
	}

	/**
	 * Filter the list of URL paths excluded from page transitions.
	 *
	 * @param array $excluded_urls Array of relative URL paths to exclude.
	 */
	$excluded_urls = apply_filters( 'anima_page_transitions_excluded_urls', $excluded_urls );

	// Pass config to JS.
	wp_localize_script( 'anima-page-transitions', 'animaPageTransitions', array(
		'excludedUrls' => $excluded_urls,
		'siteUrl'      => home_url( '/' ),
	) );

	wp_enqueue_script( 'anima-page-transitions' );
}
add_action( 'wp_enqueue_scripts', 'anima_page_transitions_enqueue', 30 );

/**
 * Output the transition overlay markup in the footer.
 * Only when the feature is enabled.
 */
function anima_page_transitions_overlay() {
	if ( ! anima_page_transitions_enabled() ) {
		return;
	}
	?>
	<div class="c-page-transition-border js-page-transition-border"
	     style="border-color: var(--sm-current-accent-color); background: var(--sm-current-accent-color);">
		<div class="border-logo-bgscale">
			<div class="border-logo-background">
				<div class="border-logo-fill"></div>
				<?php if ( has_custom_logo() ) : ?>
					<div class="logo"><?php the_custom_logo(); ?></div>
				<?php endif; ?>
			</div>
		</div>
		<?php if ( has_custom_logo() ) : ?>
			<div class="border-logo"><?php the_custom_logo(); ?></div>
		<?php endif; ?>
	</div>
	<?php
}
add_action( 'wp_footer', 'anima_page_transitions_overlay', 100 );

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
