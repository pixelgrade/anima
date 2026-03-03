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
 * Remove block editor global styles (from theme.json) since Style Manager handles all styling.
 *
 * @see https://github.com/WordPress/gutenberg/issues/38299#issuecomment-1025520487
 */
add_action( 'after_setup_theme', function () {

	// Remove SVG and global styles
	remove_action( 'wp_enqueue_scripts', 'wp_enqueue_global_styles' );

	// Remove wp_footer actions which adds global inline styles
	remove_action( 'wp_footer', 'wp_enqueue_global_styles', 1 );
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
