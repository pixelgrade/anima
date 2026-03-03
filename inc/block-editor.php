<?php
/**
 * Logic that deals with the block editor experience.
 *
 * @package Anima
 */

// If this file is called directly, abort.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Remove core global style callbacks since Style Manager handles all styling.
 *
 * Core moved these callbacks across hooks in recent WP releases, so we remove
 * all known combinations to keep behavior consistent on WP 6.x and 7.x.
 *
 * @see https://github.com/WordPress/gutenberg/issues/38299#issuecomment-1025520487
 */
add_action( 'after_setup_theme', function () {
	$global_styles_callbacks = [
		'wp_enqueue_global_styles',
		'wp_enqueue_global_styles_css_custom_properties',
	];

	$global_styles_hooks = [
		'wp_enqueue_scripts',
		'enqueue_block_assets',
		'admin_enqueue_scripts',
		'wp_footer',
	];

	$priorities = [ 1, 10 ];

	foreach ( $global_styles_callbacks as $callback ) {
		if ( ! function_exists( $callback ) ) {
			continue;
		}

		foreach ( $global_styles_hooks as $hook ) {
			foreach ( $priorities as $priority ) {
				remove_action( $hook, $callback, $priority );
			}
		}
	}
} );

/**
 * Modify the block editor settings to remove default style presets.
 *
 * Gradients, palettes, and font sizes are already disabled via theme.json settings.
 * The __experimentalFeatures key was removed in WP 7.0.
 */
add_filter( 'block_editor_settings_all',
	/**
	 * @param array                   $editor_settings      Default editor settings.
	 * @param WP_Block_Editor_Context $block_editor_context The current block editor context.
	 */
	function ( $editor_settings, $block_editor_context ) {

		// Remove default style presets.
		if ( ! empty( $editor_settings['styles'] ) ) {
			foreach ( $editor_settings['styles'] as $key => $value ) {
				if ( isset( $value['__unstableType'] ) && $value['__unstableType'] === 'presets' ) {
					unset( $editor_settings['styles'][ $key ] );
					continue;
				}
			}

			$editor_settings['styles'] = array_values( $editor_settings['styles'] );
		}

		// Keep font management in Style Manager to avoid duplicate UI with Font Library.
		$editor_settings['fontLibraryEnabled'] = false;

		return $editor_settings;
	}, 10, 2 );

/**
 * Enqueue theme editor styles into the block editor via the stable enqueue action.
 *
 * This replaces the previous __unstableResolvedAssets injection which is removed in WP 7.0.
 * Styles enqueued here are automatically loaded inside the editor iframe.
 */
add_action( 'enqueue_block_editor_assets', function () {
	$style_handles = [
		'pixelgrade_style_manager-sm-colors-custom-properties',
		'anima-block-editor-styles',
		'novablocks-core-style',
		'novablocks-core-editor_style',
	];

	foreach ( $style_handles as $handle ) {
		wp_enqueue_style( $handle );
	}
} );
