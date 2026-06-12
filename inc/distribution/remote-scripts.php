<?php
/**
 * Remote vendor scripts for the commercial distribution.
 *
 * GSAP and its premium SplitText plugin cannot be redistributed under the
 * GPL, and they (plus Snap.svg) load from remote CDNs — both forbidden in
 * the WordPress.org build. They are registered only here, in the commercial
 * distribution layer, which `.zipignore-wporg` strips from the wp.org zip.
 * Code outside this file must treat these handles as optional and check
 * `wp_script_is( $handle, 'registered' )` before depending on them.
 *
 * @package Anima
 */

// If this file is called directly, abort.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! function_exists( 'anima_distribution_register_remote_scripts' ) ) {
	/**
	 * Register the remote vendor script handles ahead of the theme's own
	 * asset registration (init/10), which wires them in as dependencies.
	 */
	function anima_distribution_register_remote_scripts() {
		// Use the public CDN for better performance
		// (high likelihood the file is already cached in the browser from other sites).
		wp_register_script( 'gsap', 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.9.1/gsap.min.js', [], null, true );
		// Add the SRI (Subresource Integrity) hash data.
		// Generated with https://www.srihash.org/
		wp_script_add_data( 'gsap', 'integrity', 'sha384-lI86CGWNchoT9leGBpVR41iGrRTRbHRDsPI4Zo/atPOIodjl8YyDaVefcpgkCg4u' );
		wp_script_add_data( 'gsap', 'crossorigin', 'anonymous' );

		// Use our private CDN since GSAP premium plugins can't be distributed in the bundle.
		wp_register_script( 'gsap-split-text', '//pxgcdn.com/js/gsap/3.9.1/SplitText.min.js', [ 'gsap' ], null, true );
		// Add the SRI (Subresource Integrity) hash data.
		// Generated with https://www.srihash.org/
		wp_script_add_data( 'gsap-split-text', 'integrity', 'sha384-KoviLFAFGG+n+c3BxM58Gr/poK7WAtzed6kU8Kzr2fvjp3Q8gttOWY+XvpTjShW3' );
		wp_script_add_data( 'gsap-split-text', 'crossorigin', 'anonymous' );

		// Snap.svg — required for Slide Wipe transition's SVG pattern fills.
		wp_register_script( 'snapsvg', 'https://cdnjs.cloudflare.com/ajax/libs/snap.svg/0.5.1/snap.svg-min.js', [], '0.5.1', true );
	}
}
add_action( 'init', 'anima_distribution_register_remote_scripts', 5 );
