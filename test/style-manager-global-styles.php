<?php
/**
 * Regression test for keeping WordPress global styles with Style Manager.
 *
 * Run from the theme root:
 * php test/style-manager-global-styles.php
 */

function anima_fail_style_manager_global_styles_test( string $message ): void {
	fwrite( STDERR, $message . PHP_EOL );
	exit( 1 );
}

if ( ! defined( 'ABSPATH' ) ) {
	define( 'ABSPATH', __DIR__ );
}

function add_action( string $hook_name, $callback, int $priority = 10, int $accepted_args = 1 ): bool {
	$GLOBALS['anima_style_manager_global_styles_actions'][] = [
		'hook_name'     => $hook_name,
		'callback'      => $callback,
		'priority'      => $priority,
		'accepted_args' => $accepted_args,
	];

	return true;
}

function add_filter( string $hook_name, $callback, int $priority = 10, int $accepted_args = 1 ): bool {
	return true;
}

function remove_action( string $hook_name, $callback, int $priority = 10 ): bool {
	$GLOBALS['anima_style_manager_global_styles_removals'][] = [
		'hook_name' => $hook_name,
		'callback'  => $callback,
		'priority'  => $priority,
	];

	return true;
}

function wp_enqueue_global_styles(): void {}

function wp_enqueue_global_styles_css_custom_properties(): void {}

eval( 'namespace Pixelgrade\\StyleManager; class Plugin {}' );

require_once dirname( __DIR__ ) . '/inc/block-editor.php';

foreach ( $GLOBALS['anima_style_manager_global_styles_actions'] ?? [] as $action ) {
	if ( 'after_setup_theme' === $action['hook_name'] && $action['callback'] instanceof Closure ) {
		$action['callback']();
	}
}

$global_style_callbacks = [
	'wp_enqueue_global_styles',
	'wp_enqueue_global_styles_css_custom_properties',
];

foreach ( $GLOBALS['anima_style_manager_global_styles_removals'] ?? [] as $removal ) {
	if ( in_array( $removal['callback'], $global_style_callbacks, true ) ) {
		anima_fail_style_manager_global_styles_test(
			'Anima must not remove WordPress global-style callbacks when Style Manager is active.'
		);
	}
}

echo "Style Manager keeps WordPress global styles OK\n";
