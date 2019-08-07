<?php

if ( ! function_exists( 'wp_body_open' ) ) {
	function wp_body_open() {
		/**
		 * Triggered after the opening <body> tag.
		 *
		 * @since 5.2.0
		 */
		do_action( 'wp_body_open' );
	}
}