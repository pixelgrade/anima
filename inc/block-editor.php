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
 * Get the wp.org fallback CSS for Style Manager-owned design tokens.
 *
 * The WordPress.org build uses theme.json presets as the plugin-free design
 * source, but only while Style Manager is absent. When Style Manager is active
 * it emits these tokens at runtime and must remain the sole owner.
 *
 * @return string
 */
function anima_get_sm_inactive_design_token_fallback_css() {
	$root_declarations = [
		'--sm-current-bg-color'          => 'var(--wp--preset--color--base)',
		'--sm-current-accent-color'      => 'var(--wp--preset--color--primary)',
		'--sm-current-accent2-color'     => 'var(--sm-current-accent-color)',
		'--sm-current-accent3-color'     => 'var(--sm-current-accent2-color)',
		'--sm-current-fg1-color'         => 'var(--wp--preset--color--contrast)',
		'--sm-current-fg2-color'         => 'var(--wp--preset--color--secondary)',
		'--sm-button-background-color'   => 'var(--wp--preset--color--primary)',
		'--sm-spacing-level'             => '1',
	];

	$heading_roles = [
		'super-display',
		'display',
		'heading-1',
		'heading-2',
		'heading-3',
		'heading-4',
		'site-title',
	];

	$body_roles = [
		'body',
		'lead',
		'small-body',
		'caption',
		'heading-5',
		'heading-6',
		'navigation',
		'meta',
		'button',
		'input',
		'accent',
	];

	$css = ':root{';

	foreach ( $root_declarations as $property => $value ) {
		$css .= $property . ':' . $value . ';';
	}

	$css .= '}';
	$css .= ':root:root{';

	foreach ( $heading_roles as $role ) {
		$css .= '--theme-' . $role . '-font-family:var(--wp--preset--font-family--heading);';
	}

	foreach ( $body_roles as $role ) {
		$css .= '--theme-' . $role . '-font-family:var(--wp--preset--font-family--body);';
	}

	$css .= '}';

	return $css;
}

/**
 * Enqueue plugin-free fallbacks for Style Manager-owned design tokens.
 *
 * @return void
 */
function anima_enqueue_sm_inactive_design_token_fallback() {
	static $enqueued = false;

	if ( $enqueued || anima_style_manager_is_active() ) {
		return;
	}

	$enqueued = true;
	$theme    = wp_get_theme( get_template() );
	$handle   = 'anima-sm-inactive-design-token-fallback';

	wp_register_style( $handle, false, [], $theme->get( 'Version' ) );
	wp_enqueue_style( $handle );
	wp_add_inline_style( $handle, anima_get_sm_inactive_design_token_fallback_css() );
}
add_action( 'wp_enqueue_scripts', 'anima_enqueue_sm_inactive_design_token_fallback', 21 );
add_action( 'enqueue_block_assets', 'anima_enqueue_sm_inactive_design_token_fallback', 21 );

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

	// Without Style Manager, only the commercial distribution adds its note
	// to the Styles screen. The WordPress.org build keeps the native Styles
	// screen completely untouched: Style Manager is not currently available
	// in the plugin directory, and injecting promotional UI into core editor
	// screens is not allowed by the theme directory rules.
	if ( ! anima_style_manager_is_active() && ! function_exists( 'anima_webfonts_fallback' ) ) {
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

	if ( anima_style_manager_is_active() ) {
		// Style Manager is the single source of truth: hand the Styles screen
		// off to the Customizer-managed flow.
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

		return;
	}

	// Bare build (no Style Manager): keep the native Styles screen fully usable
	// and add a gentle, non-blocking note encouraging the free Style Manager
	// plugin for the advanced color/font system. `keepNativeStyles` tells the
	// script to append the note above the controls instead of replacing them.
	$install_url = current_user_can( 'install_plugins' )
		? add_query_arg(
			[ 'tab' => 'search', 'type' => 'term', 's' => rawurlencode( 'Style Manager Pixelgrade' ) ],
			self_admin_url( 'plugin-install.php' )
		)
		: 'https://wordpress.org/plugins/style-manager/';

	wp_localize_script( 'anima-site-editor-style-manager', 'animaSiteEditorStyleManager', [
		'keepNativeStyles' => true,
		'customizerUrl'    => esc_url( $install_url ),
		'eyebrow'          => esc_html__( 'Pixelgrade LT', '__theme_txtd' ),
		'title'            => esc_html__( 'Unlock advanced design settings', '__theme_txtd' ),
		'description'      => esc_html__( 'Anima works beautifully on its own. Install the free Style Manager plugin to unlock the full design system — smart color palettes, balanced font pairings, and fine-grained spacing — without leaving WordPress.', '__theme_txtd' ),
		'buttonLabel'      => esc_html__( 'Install Style Manager', '__theme_txtd' ),
		'resources'        => [],
	] );
}
add_action( 'enqueue_block_editor_assets', 'anima_enqueue_site_editor_style_manager_assets', 20 );
