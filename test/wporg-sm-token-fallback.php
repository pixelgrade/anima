<?php
/**
 * Contract test for the wp.org Style Manager token fallback split.
 *
 * Run from the theme root:
 * php test/wporg-sm-token-fallback.php
 */

function anima_fail_wporg_sm_token_fallback_test( string $message ): void {
	fwrite( STDERR, $message . PHP_EOL );
	exit( 1 );
}

if ( ! defined( 'ABSPATH' ) ) {
	define( 'ABSPATH', __DIR__ );
}

function add_action( string $hook_name, $callback, int $priority = 10, int $accepted_args = 1 ): bool {
	$GLOBALS['anima_wporg_sm_token_fallback_actions'][] = [
		'hook_name'     => $hook_name,
		'callback'      => $callback,
		'priority'      => $priority,
		'accepted_args' => $accepted_args,
	];

	return true;
}

function add_filter( string $hook_name, $callback, int $priority = 10, int $accepted_args = 1 ): bool {
	$GLOBALS['anima_wporg_sm_token_fallback_filters'][] = [
		'hook_name'     => $hook_name,
		'callback'      => $callback,
		'priority'      => $priority,
		'accepted_args' => $accepted_args,
	];

	return true;
}

$theme_root = dirname( __DIR__ );

require_once $theme_root . '/inc/block-editor.php';

foreach ( [
	'anima_get_sm_inactive_design_token_fallback_css',
	'anima_enqueue_sm_inactive_design_token_fallback',
] as $function_name ) {
	if ( ! function_exists( $function_name ) ) {
		anima_fail_wporg_sm_token_fallback_test( "Missing {$function_name}()." );
	}
}

$heading_roles = [ 'super-display', 'display', 'heading-1', 'heading-2', 'heading-3', 'heading-4', 'site-title' ];
$body_roles    = [ 'body', 'lead', 'small-body', 'caption', 'heading-5', 'heading-6', 'navigation', 'meta', 'button', 'input', 'accent' ];

$expected_fallback_declarations = [
	'--sm-current-bg-color:var(--wp--preset--color--base);',
	'--sm-current-accent-color:var(--wp--preset--color--primary);',
	'--sm-current-accent2-color:var(--sm-current-accent-color);',
	'--sm-current-accent3-color:var(--sm-current-accent2-color);',
	'--sm-current-fg1-color:var(--wp--preset--color--contrast);',
	'--sm-current-fg2-color:var(--wp--preset--color--secondary);',
	'--sm-button-background-color:var(--wp--preset--color--primary);',
	'--sm-spacing-level:1;',
];

foreach ( $heading_roles as $role ) {
	$expected_fallback_declarations[] = "--theme-{$role}-font-family:var(--wp--preset--font-family--heading);";
}

foreach ( $body_roles as $role ) {
	$expected_fallback_declarations[] = "--theme-{$role}-font-family:var(--wp--preset--font-family--body);";
}

$fallback_css = anima_get_sm_inactive_design_token_fallback_css();

foreach ( $expected_fallback_declarations as $declaration ) {
	if ( false === strpos( $fallback_css, $declaration ) ) {
		anima_fail_wporg_sm_token_fallback_test( "Runtime fallback is missing {$declaration}" );
	}
}

if ( false !== strpos( $fallback_css, '--font-size-base' ) ) {
	anima_fail_wporg_sm_token_fallback_test( '--font-size-base is a theme default and must stay out of the gated runtime fallback.' );
}

$build_task = file_get_contents( $theme_root . '/tasks/build-wporg.js' );
if ( false === $build_task ) {
	anima_fail_wporg_sm_token_fallback_test( 'Could not read tasks/build-wporg.js.' );
}

if ( ! preg_match( '/\n\t\tcss:\s*(?<css>.*?),\n\t};/s', $build_task, $matches ) ) {
	anima_fail_wporg_sm_token_fallback_test( 'Could not locate the static theme.json css bridge in tasks/build-wporg.js.' );
}

$static_theme_json_css = $matches['css'];

foreach ( $expected_fallback_declarations as $declaration ) {
	$token = strtok( $declaration, ':' );
	if ( false !== strpos( $static_theme_json_css, $token ) ) {
		anima_fail_wporg_sm_token_fallback_test( "{$token} must not be baked into static theme.json styles.css." );
	}
}

if ( false === strpos( $static_theme_json_css, '--font-size-base:0.9375;' ) ) {
	anima_fail_wporg_sm_token_fallback_test( '--font-size-base must remain as an unconditional wp.org theme default.' );
}

$actions        = $GLOBALS['anima_wporg_sm_token_fallback_actions'] ?? [];
$expected_hooks = [
	'wp_enqueue_scripts'          => false,
	'enqueue_block_assets'        => false,
	'enqueue_block_editor_assets' => false,
];

foreach ( $actions as $action ) {
	if ( 'anima_enqueue_sm_inactive_design_token_fallback' !== $action['callback'] ) {
		continue;
	}

	if ( array_key_exists( $action['hook_name'], $expected_hooks ) ) {
		$expected_hooks[ $action['hook_name'] ] = true;
	}
}

if ( ! $expected_hooks['wp_enqueue_scripts'] ) {
	anima_fail_wporg_sm_token_fallback_test( 'Runtime fallback must be enqueued on wp_enqueue_scripts for the frontend.' );
}

if ( ! $expected_hooks['enqueue_block_assets'] ) {
	anima_fail_wporg_sm_token_fallback_test( 'Runtime fallback must be enqueued on enqueue_block_assets for the editor canvas iframe.' );
}

if ( $expected_hooks['enqueue_block_editor_assets'] ) {
	anima_fail_wporg_sm_token_fallback_test( 'Runtime fallback must not use enqueue_block_editor_assets for canvas CSS.' );
}

echo "wp.org Style Manager token fallback split OK\n";
