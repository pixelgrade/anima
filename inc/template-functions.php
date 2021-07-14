<?php
/**
 * Functions which enhance the theme by hooking into WordPress.
 *
 * @package Rosa2
 */

// If this file is called directly, abort.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Adds custom classes to the array of body classes.
 *
 * @param array $classes Classes for the body element.
 * @return array
 */
function rosa2_body_classes( $classes ) {

	$classes[] = 'is-loading';

	// Adds a class of hfeed to non-singular pages.
	if ( ! is_singular() ) {
		$classes[] = 'hfeed';
	}

	$classes[] = 'has-novablocks-header-transparent';

	if ( rosa2_first_block_is( array(
		'novablocks/hero',
		'novablocks/media',
		'novablocks/slideshow',
		'novablocks/cards-collection',
		'novablocks/posts-collection',
		) ) ) {
		$classes[] = 'has-no-spacing-top';
	}

	if ( rosa2_remove_site_padding_bottom() ) {
		$classes[] = 'has-no-padding-bottom';
	}

	if ( rosa2_has_moderate_media_card_after_hero() ) {
		$classes[] = 'has-moderate-media-card-after-hero';
	}

	if ( 'on' === pixelgrade_option( 'sm_dark_mode' ) ) {
		$classes[] = 'is-dark-mode';
	}

	if ( is_single() && rosa2_is_active_sidebar( 'sidebar-1' ) ) {
		$classes[] = 'has-sidebar';
	}

	if ( is_home() || is_post_type_archive( 'post' ) || is_singular('post') || is_archive() ) {
		$classes[] = 'sm-variation-2';
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
