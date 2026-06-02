<?php
/**
 * Regression check for unreadable images in Tonesque on PHP 8.x.
 *
 * Run from the theme root:
 * php test/tonesque-unreadable-image.php
 */

if ( ! extension_loaded( 'gd' ) || ! function_exists( 'imagecreatefromjpeg' ) ) {
	echo "GD extension missing; skipping Tonesque unreadable image check.\n";
	exit( 0 );
}

if ( ! function_exists( 'esc_url_raw' ) ) {
	function esc_url_raw( $url ) {
		return $url;
	}
}

require_once dirname( __DIR__ ) . '/inc/classes/class-tonesque.php';

$image_path = sys_get_temp_dir() . '/anima-tonesque-broken-' . uniqid( '', true ) . '.jpg';
file_put_contents( $image_path, 'not a jpeg image' );

set_error_handler(
	function () {
		return true;
	}
);

try {
	$color = ( new Tonesque( $image_path ) )->color();
	restore_error_handler();
	unlink( $image_path );
} catch ( Throwable $exception ) {
	restore_error_handler();
	unlink( $image_path );

	fwrite( STDERR, sprintf( "Tonesque must return false for unreadable images; got %s: %s\n", get_class( $exception ), $exception->getMessage() ) );
	exit( 1 );
}

if ( false !== $color ) {
	fwrite( STDERR, sprintf( "Tonesque must return false for unreadable images; got %s.\n", var_export( $color, true ) ) );
	exit( 1 );
}

echo "Tonesque unreadable image guard OK.\n";
