<?php
/**
 * Functions which enhance the theme by hooking into WordPress.
 *
 * @package Anima
 */

// If this file is called directly, abort.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Adds custom classes to the array of body classes.
 *
 * @param array $classes Classes for the body element.
 *
 * @return array
 */
function anima_body_classes( array $classes ): array {

	$classes[] = 'is-loading';

	// Adds a class of hfeed to non-singular pages.
	if ( ! is_singular() ) {
		$classes[] = 'hfeed';
	}

	if ( anima_first_block_is( [
		'novablocks/hero',
		'novablocks/media',
		'novablocks/slideshow',
		'novablocks/cards-collection',
		'novablocks/posts-collection',
		'novablocks/supernova',
	] ) ) {
		$classes[] = 'has-no-spacing-top';
	}

	if ( anima_remove_site_padding_bottom() ) {
		$classes[] = 'has-no-padding-bottom';
	}

	if ( anima_has_moderate_media_card_after_hero() ) {
		$classes[] = 'has-moderate-media-card-after-hero';
	}

	if ( 'on' === pixelgrade_option( 'sm_dark_mode' ) ) {
		$classes[] = 'is-dark-mode';
	}

	if ( is_single() && anima_is_active_sidebar( 'sidebar-1' ) ) {
		$classes[] = 'has-sidebar';
	}


	//  Titles Positioning
	$collection_title_position = get_option( 'sm_collection_title_position', 'above' );

	if ( $collection_title_position === 'sideways' ) {
		$classes[] = 'u-collection-title-sideways';
	}


	// Cards Hover Effect
	$collection_hover_effect = get_option( 'sm_collection_hover_effect', 'none' );

	if ( ! empty( $collection_hover_effect ) ) {
		$classes[] = 'u-collection-hover-' . $collection_hover_effect;
	}


	// Decorative Titles Style
	$decorative_titles_style = get_option( 'sm_decorative_titles_style', 'underline' );

	if ( ! empty( $decorative_titles_style ) ) {
		$classes[] = 'u-decorative-titles-' . $decorative_titles_style;
	}


	return $classes;
}
add_filter( 'body_class', 'anima_body_classes' );

/**
 * Add a pingback url auto-discovery header for single posts, pages, or attachments.
 */
function anima_pingback_header() {
	if ( is_singular() && pings_open() ) {
		printf( '<link rel="pingback" href="%s">', esc_url( get_bloginfo( 'pingback_url' ) ) );
	}
}
add_action( 'wp_head', 'anima_pingback_header' );
