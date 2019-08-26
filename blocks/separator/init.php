<?php
/**
 * Handle the Slideshow block server logic.
 */

// If this file is called directly, abort.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! function_exists( 'novablocks_logo_block_init' ) ) {

	function novablocks_logo_block_init() {
		register_block_type( 'novablocks/logo', array(
			'attributes'      => array(),
			'render_callback' => 'novablocks_render_logo_block'
		) );
	}
}
add_action( 'init', 'novablocks_logo_block_init' );

if ( ! function_exists( 'novablocks_render_logo_block' ) ) {

	function novablocks_render_logo_block( $attributes, $content ) {

		$classes = array();

		ob_start(); ?>

		<div class="<?php echo esc_attr( join( ' ', $classes ) ); ?>">
		</div>

		<?php

		return ob_get_clean();
	}
}
