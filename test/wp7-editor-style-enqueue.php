<?php
/**
 * Regression check for WordPress 7 editor iframe style enqueueing.
 *
 * Run inside WordPress with Anima active:
 * wp eval-file wp-content/themes/anima/test/wp7-editor-style-enqueue.php
 */

if ( ! defined( 'ABSPATH' ) ) {
	fwrite( STDERR, "This test must run through WordPress.\n" );
	exit( 1 );
}

$style_callback = 'anima_enqueue_iframed_block_editor_styles';

if ( ! function_exists( $style_callback ) ) {
	fwrite( STDERR, sprintf( "Missing %s().\n", $style_callback ) );
	exit( 1 );
}

if ( false === has_action( 'enqueue_block_assets', $style_callback ) ) {
	fwrite( STDERR, sprintf( "%s() must be registered on enqueue_block_assets.\n", $style_callback ) );
	exit( 1 );
}

if ( false !== has_action( 'enqueue_block_editor_assets', $style_callback ) ) {
	fwrite( STDERR, sprintf( "%s() must not be registered on enqueue_block_editor_assets.\n", $style_callback ) );
	exit( 1 );
}

if ( false === has_action( 'enqueue_block_editor_assets', 'anima_enqueue_theme_block_editor_assets' ) ) {
	fwrite( STDERR, "The editor script enqueue callback must remain on enqueue_block_editor_assets.\n" );
	exit( 1 );
}

$woocommerce_style_callback = 'anima_enqueue_woocommerce_block_editor_assets';

if ( function_exists( 'WC' ) && function_exists( 'pixelgrade_user_has_access' ) && pixelgrade_user_has_access( 'woocommerce' ) ) {
	if ( ! function_exists( $woocommerce_style_callback ) ) {
		fwrite( STDERR, sprintf( "Missing %s().\n", $woocommerce_style_callback ) );
		exit( 1 );
	}

	$woocommerce_style_priority = has_action( 'enqueue_block_assets', $woocommerce_style_callback );

	if ( false === $woocommerce_style_priority ) {
		fwrite( STDERR, sprintf( "%s() must be registered on enqueue_block_assets.\n", $woocommerce_style_callback ) );
		exit( 1 );
	}

	if ( 30 !== $woocommerce_style_priority ) {
		fwrite( STDERR, sprintf( "%s() must run on enqueue_block_assets priority 30.\n", $woocommerce_style_callback ) );
		exit( 1 );
	}

	if ( false !== has_action( 'enqueue_block_editor_assets', $woocommerce_style_callback ) ) {
		fwrite( STDERR, sprintf( "%s() must not be registered on enqueue_block_editor_assets.\n", $woocommerce_style_callback ) );
		exit( 1 );
	}
}

echo "WordPress 7 editor style enqueue OK.\n";
