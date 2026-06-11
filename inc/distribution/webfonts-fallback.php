<?php
/**
 * Fallback webfonts loaded from the Pixelgrade CDN.
 *
 * Part of the commercial distribution logic. This file is stripped from
 * builds intended for the WordPress.org theme directory, where loading
 * remote (non-bundled) resources is not allowed. Those builds fall back
 * to the system font stack when the Style Manager plugin is not active.
 *
 * @package Anima
 */

// If this file is called directly, abort.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Provide fallback webfonts for when the Style Manager plugin is not active.
 *
 * @return void
 */
function anima_webfonts_fallback() {

	if ( class_exists( 'PixCustomifyPlugin' ) || function_exists( '\Pixelgrade\StyleManager\plugin') ) {
		return;
	}

	ob_start(); ?>
		var config = {
			classes: true,
			events: true,
			custom: {
				families: [
					'Reforma1969',
					'Reforma2018',
					'Billy Ohio',
				],
				urls: [
					'//pxgcdn.com/fonts/reforma1969/stylesheet.css',
					'//pxgcdn.com/fonts/reforma2018/stylesheet.css',
					'//pxgcdn.com/fonts/billy-ohio/stylesheet.css',
				],
			},
			loading: function() {
				jQuery( window ).trigger( 'wf-loading' );
			},
			active: function() {
				jQuery( window ).trigger( 'wf-active' );
			},
			inactive: function() {
				jQuery( window ).trigger( 'wf-inactive' );
			},
		};
		WebFont.load( config );
	<?php $webfontloader_inline_script = ob_get_clean();

	wp_register_script( 'webfontloader', '//ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js', [ 'jquery' ], null, true );
	wp_add_inline_script( 'webfontloader', $webfontloader_inline_script );
	wp_enqueue_script( 'webfontloader' );

}
add_action( 'wp_enqueue_scripts', 'anima_webfonts_fallback', 10 );
