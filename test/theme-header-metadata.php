<?php
/**
 * Verifies theme headers that matter for the WordPress.org compatibility update.
 *
 * Run from the theme root:
 * php test/theme-header-metadata.php
 */

$theme_root = dirname( __DIR__ );
$files      = [
	'src/scss/style.scss',
	'style.css',
	'style-rtl.css',
];

foreach ( $files as $file ) {
	$path = $theme_root . '/' . $file;

	if ( ! is_readable( $path ) ) {
		fwrite( STDERR, sprintf( "Missing readable theme header file: %s\n", $file ) );
		exit( 1 );
	}

	$contents = file_get_contents( $path );

	if ( ! preg_match( '/^Version:\s*2\.0\.23\s*$/m', $contents ) ) {
		fwrite( STDERR, sprintf( "%s must declare Version: 2.0.23\n", $file ) );
		exit( 1 );
	}

	if ( ! preg_match( '/^Tested up to:\s*7\.0\s*$/m', $contents ) ) {
		fwrite( STDERR, sprintf( "%s must declare Tested up to: 7.0\n", $file ) );
		exit( 1 );
	}

	if ( ! preg_match( '/^Requires PHP:\s*7\.4\s*$/m', $contents ) ) {
		fwrite( STDERR, sprintf( "%s must declare Requires PHP: 7.4\n", $file ) );
		exit( 1 );
	}
}

echo "Theme header metadata OK.\n";
