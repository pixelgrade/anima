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
 * Remove block editor global styles (from theme.json) and other stuff that we don't use.
 *
 * @see https://github.com/WordPress/gutenberg/issues/38299#issuecomment-1025520487
 */
add_action( 'after_setup_theme', function () {
	// Remove wp_footer actions which adds global inline styles
	remove_action( 'wp_footer', 'wp_enqueue_global_styles', 1 );

	// Remove render_block filters which adding unnecessary stuff
	remove_filter( 'render_block', 'wp_render_duotone_support' );
	remove_filter( 'render_block', 'wp_restore_group_inner_container' );
} );

/**
 * Modify the block editor settings for things that can't be tackled in a more forgiving manner.
 */
add_filter( 'block_editor_settings_all',
	/**
	 * @param array                   $editor_settings      Default editor settings.
	 * @param WP_Block_Editor_Context $block_editor_context The current block editor context.
	 */
	function ( $editor_settings, $block_editor_context ) {

		// Remove default style presents.
		if ( ! empty( $editor_settings['styles'] ) ) {
			foreach ( $editor_settings['styles'] as $key => $value ) {
				if ( isset( $value['__unstableType'] ) && $value['__unstableType'] === 'presets' ) {
					unset( $editor_settings['styles'][ $key ] );
					continue;
				}
			}

			$editor_settings['styles'] = array_values( $editor_settings['styles'] );
		}

		// Remove default gradients.
		if ( ! empty( $editor_settings['__experimentalFeatures']['color']['gradients'] ) ) {
			$editor_settings['__experimentalFeatures']['color']['gradients'] = [ 'theme' => [] ];
		}

		// Remove default palettes.
		if ( ! empty( $editor_settings['__experimentalFeatures']['color']['palette'] ) ) {
			$editor_settings['__experimentalFeatures']['color']['palette'] = [ 'theme' => [] ];
		}

		// Remove default fontSizes.
		if ( ! empty( $editor_settings['__experimentalFeatures']['typography']['fontSizes'] ) ) {
			$editor_settings['__experimentalFeatures']['typography']['fontSizes'] = [ 'theme' => [] ];
		}

		$style_handles = [
			'pixelgrade_style_manager-sm-colors-custom-properties',
			'anima-block-editor-styles',
			'novablocks-core-style',
			'novablocks-core-editor_style',
		];

		ob_start();
		$done = wp_styles()->done;
		wp_styles()->do_items( $style_handles );
		wp_styles()->done = $done;
		$styles = ob_get_clean();

		$editor_settings['__unstableResolvedAssets']['styles'] .= $styles;
		return $editor_settings;
	}, 10, 2 );
