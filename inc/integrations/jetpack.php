<?php
/**
 * Jetpack Compatibility File
 *
 * @link https://jetpack.com/
 *
 * @package Anima
 */

// If this file is called directly, abort.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Jetpack setup function.
 *
 * See: https://jetpack.com/support/responsive-videos/
 * See: https://jetpack.com/support/content-options/
 */
function anima_jetpack_setup() {

	// Add theme support for Responsive Videos.
	add_theme_support( 'jetpack-responsive-videos' );

	// Add theme support for Content Options.
	add_theme_support( 'jetpack-content-options', [
		'post-details'    => [
			'stylesheet' => 'nova-style',
			'date'       => '.posted-on',
			'categories' => '.cat-links',
			'tags'       => '.tags-links',
			'author'     => '.byline',
			'comment'    => '.comments-link',
		],
		'featured-images' => [
			'archive'    => true,
			'post'       => true,
			'page'       => true,
		],
	] );
}
add_action( 'after_setup_theme', 'anima_jetpack_setup' );
