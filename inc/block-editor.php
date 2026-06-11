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
 * Whether the Style Manager plugin is active.
 *
 * The theme delegates its entire design system (global styles, palettes, font
 * sizes) to Style Manager and therefore disables the corresponding core
 * features. When Style Manager is NOT active — e.g. the bare WordPress.org
 * build previewed without plugins — those core features must stay enabled so
 * the theme.json design tokens still render.
 *
 * @return bool
 */
function anima_style_manager_is_active() {
	return class_exists( 'Pixelgrade\StyleManager\Plugin' )
		|| class_exists( 'PixCustomifyPlugin' )
		|| function_exists( '\Pixelgrade\StyleManager\plugin' );
}

/**
 * Reveal content when no web font loader will mark fonts as active.
 *
 * To prevent a flash of unstyled text, the theme hides text until the web font
 * loader adds the `wf-active` class to <html>
 * (`html:not(.wf-active) … { opacity: 0 }`, plus `pointer-events: none`). Both
 * Style Manager and the commercial CDN webfont fallback add that class. The
 * bare WordPress.org build uses the system font stack and ships neither, so
 * without this the page would stay blank forever. When no font loader is
 * present, add `wf-active` to <html> server-side — there are no remote fonts to
 * wait for, so there is nothing to flash.
 *
 * @param string $output The language attributes string for the <html> tag.
 * @return string
 */
function anima_maybe_force_wf_active( $output ) {
	if ( anima_style_manager_is_active() || function_exists( 'anima_webfonts_fallback' ) ) {
		return $output;
	}

	return trim( $output . ' class="wf-active"' );
}
add_filter( 'language_attributes', 'anima_maybe_force_wf_active' );

/**
 * Enqueue the Style Manager token fallback in the bare WordPress.org build.
 *
 * The compiled theme CSS consumes `--sm-current-*` color tokens that Style
 * Manager emits at runtime. Without the plugin they are undefined, so the
 * wp.org build ships a generated fallback (dist/css/sm-token-fallback.css,
 * produced from SM's own default palette by `gulp build:wporg:token-fallback`).
 * Enqueue it only when Style Manager is absent and the file is present (it is
 * generated only into the wp.org build, never the commercial one).
 *
 * @return void
 */
function anima_enqueue_sm_token_fallback() {
	if ( anima_style_manager_is_active() ) {
		return;
	}

	$relative = '/dist/css/sm-token-fallback.css';
	if ( ! file_exists( get_template_directory() . $relative ) ) {
		return;
	}

	$theme = wp_get_theme( get_template() );
	wp_enqueue_style(
		'anima-sm-token-fallback',
		trailingslashit( get_template_directory_uri() ) . 'dist/css/sm-token-fallback.css',
		[ 'anima-custom-properties' ],
		$theme->get( 'Version' )
	);
}
add_action( 'wp_enqueue_scripts', 'anima_enqueue_sm_token_fallback', 5 );

/**
 * Get the default constrained layout used for post content in the editor.
 *
 * @return array
 */
function anima_get_post_content_layout_defaults() {
	return [
		'inherit'     => true,
		'contentSize' => 'var(--nb-content-width)',
		'wideSize'    => 'var(--nb-container-width)',
	];
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
	// Without Style Manager the theme has no other source of global styles, so
	// let WordPress emit them from theme.json (palette, font sizes, base styles).
	if ( ! anima_style_manager_is_active() ) {
		return;
	}

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

		// Only strip the core design UI when Style Manager owns the design
		// system. In the bare WordPress.org build these stay so the editor
		// exposes the theme.json palette, font sizes, and Font Library.
		if ( anima_style_manager_is_active() ) {
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
		}

		// WordPress 7 only exposes Wide/Full in the post editor when post content
		// resolves to a constrained layout context. Seed that context explicitly
		// for classic post editing while preserving any values already provided.
		if ( isset( $block_editor_context->name ) && 'core/edit-post' === $block_editor_context->name ) {
			if ( empty( $editor_settings['postContentAttributes'] ) || ! is_array( $editor_settings['postContentAttributes'] ) ) {
				$editor_settings['postContentAttributes'] = [];
			}

			$post_content_layout = $editor_settings['postContentAttributes']['layout'] ?? [];
			$post_content_layout = is_array( $post_content_layout ) ? $post_content_layout : [];

			$editor_settings['postContentAttributes']['layout'] = array_merge(
				anima_get_post_content_layout_defaults(),
				$post_content_layout
			);
		}

		return $editor_settings;
	}, 10, 2 );

/**
 * Enqueue theme editor styles through the hook WordPress uses for editor iframe assets.
 *
 * WordPress 7 warns when canvas styles are added through enqueue_block_editor_assets
 * and then copied into the iframe as legacy compatibility styles.
 *
 * @return void
 */
function anima_enqueue_iframed_block_editor_styles() {
	if ( ! is_admin() ) {
		return;
	}

	$style_handles = [
		'pixelgrade_style_manager-sm-colors-custom-properties',
		'anima-block-editor-styles',
		'novablocks-core-style',
		'novablocks-core-editor_style',
	];

	foreach ( $style_handles as $handle ) {
		wp_enqueue_style( $handle );
	}
}
add_action( 'enqueue_block_assets', 'anima_enqueue_iframed_block_editor_styles', 20 );

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
 * Determine whether the current admin screen is a block editor canvas.
 *
 * @return bool
 */
function anima_is_block_editor_screen() {
	if ( ! is_admin() || ! function_exists( 'get_current_screen' ) ) {
		return false;
	}

	$screen = get_current_screen();

	if ( ! $screen ) {
		return false;
	}

	if ( method_exists( $screen, 'is_block_editor' ) && $screen->is_block_editor() ) {
		return true;
	}

	return in_array( $screen->id, [ 'site-editor', 'site-editor-v2' ], true );
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
