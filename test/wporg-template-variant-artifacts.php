<?php
/**
 * Verifies source artifacts for plugin-aware wp.org templates.
 *
 * Run from the theme root:
 * php test/wporg-template-variant-artifacts.php
 */

function anima_fail_wporg_template_variant_artifacts_test( string $message ): void {
	fwrite( STDERR, $message . PHP_EOL );
	exit( 1 );
}

$theme_root = dirname( __DIR__ );

$required_files = [
	'wporg/parts/header.html',
	'wporg/parts/footer.html',
	'wporg/inc/wporg-template-variants.php',
];

foreach ( $required_files as $relative_path ) {
	if ( ! is_readable( $theme_root . '/' . $relative_path ) ) {
		anima_fail_wporg_template_variant_artifacts_test( "Missing readable source artifact: {$relative_path}" );
	}
}

$header = file_get_contents( $theme_root . '/wporg/parts/header.html' );
$footer = file_get_contents( $theme_root . '/wporg/parts/footer.html' );

foreach ( [
	'wporg/parts/header.html' => $header,
	'wporg/parts/footer.html' => $footer,
] as $relative_path => $contents ) {
	if ( false !== strpos( $contents, 'novablocks/' ) ) {
		anima_fail_wporg_template_variant_artifacts_test( "{$relative_path} must stay plugin-free." );
	}

	foreach ( [ 'core/navigation', 'core/template-part', '#ffffffAB', '#000000C7' ] as $scaffold_marker ) {
		if ( false !== strpos( $contents, $scaffold_marker ) ) {
			anima_fail_wporg_template_variant_artifacts_test( "{$relative_path} still contains scaffold marker {$scaffold_marker}." );
		}
	}
}

if ( false === strpos( $header, '<!-- wp:navigation' ) ) {
	anima_fail_wporg_template_variant_artifacts_test( 'The wp.org header should include a core navigation block.' );
}

if ( false === strpos( $footer, 'Proudly powered by WordPress' ) ) {
	anima_fail_wporg_template_variant_artifacts_test( 'The wp.org footer should include the WordPress credit.' );
}

$build_task = file_get_contents( $theme_root . '/tasks/build-wporg.js' );

foreach ( [
	'wporg-template-variants/novablocks/templates',
	'wporg-template-variants/novablocks/parts',
	'build:wporg:copy-novablocks-template-variants',
] as $expected_snippet ) {
	if ( false === strpos( $build_task, $expected_snippet ) ) {
		anima_fail_wporg_template_variant_artifacts_test( "The wp.org build task is missing {$expected_snippet}." );
	}
}

foreach ( [ 'page', 'single', 'home', 'index', 'archive', 'search' ] as $template_slug ) {
	if ( false === strpos( $build_task, 'templates/' . $template_slug . '.html' ) ) {
		anima_fail_wporg_template_variant_artifacts_test( "The wp.org build task must preserve templates/{$template_slug}.html as a Nova Blocks variant." );
	}
}

foreach ( [ 'header', 'footer' ] as $part_slug ) {
	if ( false === strpos( $build_task, 'parts/' . $part_slug . '.html' ) ) {
		anima_fail_wporg_template_variant_artifacts_test( "The wp.org build task must preserve parts/{$part_slug}.html as a Nova Blocks variant." );
	}
}

echo "wp.org template variant source artifacts OK\n";
