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

/**
 * Determine whether the current admin screen is the Site Editor.
 *
 * @return bool
 */
function anima_is_site_editor_screen() {
	if ( ! function_exists( 'get_current_screen' ) ) {
		return false;
	}

	$screen = get_current_screen();

	return (bool) $screen && in_array( $screen->id, [ 'site-editor', 'site-editor-v2' ], true );
}

/**
 * Get a Customizer link focused on a specific panel or section.
 *
 * @param string $focus_type   Whether to focus a panel or section.
 * @param string $focus_target The panel or section ID.
 * @return string
 */
function anima_get_style_manager_customizer_url( $focus_type = 'panel', $focus_target = 'style_manager_panel' ) {
	return add_query_arg(
		[
			'autofocus[' . $focus_type . ']' => $focus_target,
		],
		wp_customize_url()
	);
}

/**
 * Redirect Site Editor global styles users back to the Customizer-managed flow.
 *
 * LT themes use Style Manager as the single source of truth for the design
 * system, so the Site Editor Styles route should act as a handoff instead of a
 * second styling UI.
 */
function anima_enqueue_site_editor_style_manager_assets() {
	if ( ! anima_is_site_editor_screen() ) {
		return;
	}

	$theme  = wp_get_theme( get_template() );
	$suffix = ( defined( 'SCRIPT_DEBUG' ) && SCRIPT_DEBUG ) ? '' : '.min';

	wp_enqueue_script(
		'anima-site-editor-style-manager',
		trailingslashit( get_template_directory_uri() ) . 'dist/js/admin/site-editor-style-manager' . $suffix . '.js',
		[ 'wp-dom-ready' ],
		$theme->get( 'Version' ),
		true
	);

	wp_localize_script( 'anima-site-editor-style-manager', 'animaSiteEditorStyleManager', [
		'customizerUrl'      => anima_get_style_manager_customizer_url(),
		'eyebrow'            => esc_html__( 'Pixelgrade LT', '__theme_txtd' ),
		'title'              => esc_html__( 'Use the Customizer for your design system', '__theme_txtd' ),
		'description'        => esc_html__( 'We know that each website needs to have an unique voice in tune with your charisma. That\'s why we created a smart options system to easily make handy color changes, spacing adjustments and balancing fonts, each step bringing you closer to a striking result.', '__theme_txtd' ),
		'buttonLabel'        => esc_html__( 'Open the Customizer', '__theme_txtd' ),
		'resourcesEyebrow'   => esc_html__( 'Learn more', '__theme_txtd' ),
		'resources'          => [
			[
				'title'       => esc_html__( 'The Color System', '__theme_txtd' ),
				'description' => esc_html__( 'Set the overall mood of your site with a palette that feels calm, bold, playful, or anywhere in between.', '__theme_txtd' ),
				'buttonLabel' => esc_html__( 'Set Up Colors', '__theme_txtd' ),
				'url'         => anima_get_style_manager_customizer_url( 'section', 'sm_color_palettes_section' ),
			],
			[
				'title'       => esc_html__( 'Managing Typography', '__theme_txtd' ),
				'description' => esc_html__( 'Choose a small set of fonts that work well together so headings, interface text, and longer reads stay balanced.', '__theme_txtd' ),
				'buttonLabel' => esc_html__( 'Change Fonts', '__theme_txtd' ),
				'url'         => anima_get_style_manager_customizer_url( 'section', 'sm_font_palettes_section' ),
			],
		],
	] );
}
add_action( 'enqueue_block_editor_assets', 'anima_enqueue_site_editor_style_manager_assets', 20 );
