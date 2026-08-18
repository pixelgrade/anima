<?php
/**
 * Headless Theme Check runner for the WordPress.org build.
 *
 * The release gate in AGENTS.md requires Theme Check to report no REQUIRED
 * items before an Anima LT upload. Keep the runner here so the gate cannot
 * drift away with a deleted Studio site.
 *
 * Usage: install the built anima-lt zip on a bare Studio site, activate the
 * theme-check plugin there, copy this file into that site's wp-content/, then:
 *
 *   studio wp eval-file wp-content/theme-check-runner.php --path=<site>
 *
 * Exits with a PASS/FAIL line; PASS means zero REQUIRED items.
 */
// Headless Theme Check runner for the active theme.
if ( ! function_exists( 'run_themechecks_against_theme' ) ) {
	$tc = WP_PLUGIN_DIR . '/theme-check/checkbase.php';
	if ( ! file_exists( $tc ) ) { echo "theme-check not installed\n"; return; }
	require_once $tc;
}
$theme = wp_get_theme( 'anima-lt' );
$files = [];
$dir   = $theme->get_stylesheet_directory();
$it    = new RecursiveIteratorIterator( new RecursiveDirectoryIterator( $dir ) );
foreach ( $it as $f ) {
	if ( $f->isFile() ) {
		$files[ $f->getPathname() ] = file_get_contents( $f->getPathname() );
	}
}
$php = $css = $other = [];
foreach ( $files as $path => $contents ) {
	$ext = strtolower( pathinfo( $path, PATHINFO_EXTENSION ) );
	if ( 'php' === $ext ) { $php[ $path ] = $contents; }
	elseif ( 'css' === $ext ) { $css[ $path ] = $contents; }
	else { $other[ $path ] = $contents; }
}
$success = run_themechecks( $php, $css, $other, [ 'slug' => 'anima-lt', 'theme' => $theme ] );
global $themechecks;
$required = $warning = $info = 0;
$req_lines = [];
foreach ( $themechecks as $check ) {
	if ( ! ( $check instanceof themecheck ) ) { continue; }
	$err = $check->getError();
	if ( ! is_array( $err ) ) { continue; }
	foreach ( $err as $e ) {
		$plain = trim( strip_tags( $e ) );
		if ( stripos( $plain, 'REQUIRED' ) === 0 ) { $required++; $req_lines[] = $plain; }
		elseif ( stripos( $plain, 'WARNING' ) === 0 ) { $warning++; }
		else { $info++; }
	}
}
echo "THEME CHECK anima-lt " . $theme->get( 'Version' ) . "\n";
echo "files scanned: " . count( $files ) . "\n";
echo "REQUIRED: $required | WARNING: $warning | other: $info\n";
foreach ( array_slice( $req_lines, 0, 40 ) as $l ) { echo "  - $l\n"; }
echo ( 0 === $required ) ? "RESULT: PASS\n" : "RESULT: FAIL\n";
