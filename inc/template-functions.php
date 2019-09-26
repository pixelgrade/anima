<?php
/**
 * Functions which enhance the theme by hooking into WordPress
 *
 * @package Rosa2
 */

/**
 * Adds custom classes to the array of body classes.
 *
 * @param array $classes Classes for the body element.
 * @return array
 */
function rosa2_body_classes( $classes ) {

	// Adds a class of hfeed to non-singular pages.
	if ( ! is_singular() ) {
		$classes[] = 'hfeed';
	}

	// Adds a class of no-sidebar when there is no sidebar present.
	if ( ! is_active_sidebar( 'sidebar-1' ) ) {
		$classes[] = 'no-sidebar';
	}

	if ( rosa2_header_should_be_fixed() ) {
		$classes[] = 'has-fixed-site-header';
	}

	if ( rosa2_has_moderate_media_card_after_hero() ) {
		$classes[] = 'has-moderate-media-card-after-hero';
	}

	if ( ! empty( pixelgrade_option( 'sm_dark_mode' ) ) ) {
		$classes[] = 'is-dark-mode';
	}

	return $classes;
}
add_filter( 'body_class', 'rosa2_body_classes' );

/**
 * Add a pingback url auto-discovery header for single posts, pages, or attachments.
 */
function rosa2_pingback_header() {
	if ( is_singular() && pings_open() ) {
		printf( '<link rel="pingback" href="%s">', esc_url( get_bloginfo( 'pingback_url' ) ) );
	}
}
add_action( 'wp_head', 'rosa2_pingback_header' );
