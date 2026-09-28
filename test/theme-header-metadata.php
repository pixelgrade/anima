<?php
/**
 * Verifies theme headers that matter for the WordPress.org compatibility update.
 *
 * Run from the theme root:
 * php test/theme-header-metadata.php
 */

$theme_root = dirname( __DIR__ );
$expected   = null;
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

	// All header files must declare the same semantic version as the SCSS source.
	if ( ! preg_match( '/^Version:\s*(\d+\.\d+\.\d+)\s*$/m', $contents, $version_match ) ) {
		fwrite( STDERR, sprintf( "%s must declare a semantic Version\n", $file ) );
		exit( 1 );
	}

	if ( null === $expected ) {
		$expected = $version_match[1];
	} elseif ( $version_match[1] !== $expected ) {
		fwrite( STDERR, sprintf( "%s must declare Version: %s\n", $file, $expected ) );
		exit( 1 );
	}

	if ( ! preg_match( '/^Tested up to:\s*7\.1\s*$/m', $contents ) ) {
		fwrite( STDERR, sprintf( "%s must declare Tested up to: 7.1\n", $file ) );
		exit( 1 );
	}

	if ( ! preg_match( '/^Requires PHP:\s*7\.4\s*$/m', $contents ) ) {
		fwrite( STDERR, sprintf( "%s must declare Requires PHP: 7.4\n", $file ) );
		exit( 1 );
	}
}

$readme = (string) file_get_contents( $theme_root . '/wporg/readme.txt' );

if ( ! preg_match( '/^Stable tag:\s*' . preg_quote( $expected, '/' ) . '\s*$/m', $readme ) ) {
	fwrite( STDERR, sprintf( "wporg/readme.txt must declare Stable tag: %s\n", $expected ) );
	exit( 1 );
}

echo "Theme header metadata OK.\n";
