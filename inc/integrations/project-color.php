<?php
/**
 * Project Color — per-post color for page transition animations.
 *
 * Adds a color picker to the block editor sidebar that lets users set
 * a color per project/post. This color is used for the card-expand
 * page transition animation. If no color is set, falls back to the
 * Style Manager accent color (--sm-current-accent-color).
 *
 * Color can be auto-suggested from the featured image using Tonesque
 * (GD-based dominant color extraction, ported from Pile theme).
 *
 * @package Anima
 */

// If this file is called directly, abort.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Determine whether contextual entry colors are enabled globally.
 *
 * @return bool
 */
function anima_contextual_entry_colors_enabled() {
	return (bool) get_option( 'sm_contextual_entry_colors', true );
}

/**
 * Register the _project_color and _project_color_auto post meta for all public post types.
 */
function anima_project_color_register_meta() {
	register_post_meta( '', '_project_color', [
		'show_in_rest'  => true,
		'single'        => true,
		'type'          => 'string',
		'default'       => '',
		'auth_callback' => function () {
			return current_user_can( 'edit_posts' );
		},
	] );

	// Auto-generated color from featured image (read-only in REST, written by PHP).
	register_post_meta( '', '_project_color_auto', [
		'show_in_rest'  => [
			'schema' => [
				'type' => 'string',
			],
		],
		'single'        => true,
		'type'          => 'string',
		'default'       => '',
		'auth_callback' => function () {
			return current_user_can( 'edit_posts' );
		},
	] );
}
add_action( 'init', 'anima_project_color_register_meta' );

/**
 * Determine whether the current block editor screen supports the Project Color panel.
 *
 * The panel is designed for post document editors. The Site Editor uses the same
 * enqueue hook for template entities such as wp_template_part, where the panel has
 * no purpose and can crash when editor APIs differ during boot.
 *
 * @return bool
 */
function anima_project_color_supports_current_editor_screen() {
	if ( ! function_exists( 'get_current_screen' ) ) {
		return false;
	}

	$screen = get_current_screen();

	if ( ! $screen ) {
		return false;
	}

	if ( method_exists( $screen, 'is_block_editor' ) && ! $screen->is_block_editor() ) {
		return false;
	}

	if ( in_array( $screen->id, [ 'site-editor', 'site-editor-v2' ], true ) ) {
		return false;
	}

	if ( empty( $screen->post_type ) ) {
		return false;
	}

	if ( in_array( $screen->post_type, [ 'wp_template', 'wp_template_part', 'wp_navigation' ], true ) ) {
		return false;
	}

	return true;
}

/**
 * Enqueue the block editor sidebar panel script.
 */
function anima_project_color_editor_assets() {
	if ( ! anima_project_color_supports_current_editor_screen() ) {
		return;
	}

	$theme   = wp_get_theme( get_template() );
	$suffix  = ( defined( 'SCRIPT_DEBUG' ) && SCRIPT_DEBUG ) ? '' : '.min';

	wp_enqueue_script(
		'anima-project-color',
		trailingslashit( get_template_directory_uri() ) . 'dist/js/admin/project-color' . $suffix . '.js',
		[ 'wp-plugins', 'wp-edit-post', 'wp-components', 'wp-data', 'wp-element', 'wp-i18n' ],
		$theme->get( 'Version' ),
		true
	);

	wp_localize_script( 'anima-project-color', 'animaProjectColor', [
		'ajaxUrl'           => admin_url( 'admin-ajax.php' ),
		'nonce'             => wp_create_nonce( 'anima_project_color' ),
		'contextualId'      => 'contextual-post',
		'contextualStyleId' => 'style-manager-contextual-preview-inline-css',
		'isEnabled'         => anima_contextual_entry_colors_enabled(),
	] );
}
add_action( 'enqueue_block_editor_assets', 'anima_project_color_editor_assets' );

/**
 * Extract the dominant color from an attachment image using Tonesque.
 *
 * Loads the Tonesque class, extracts the dominant color, and boosts
 * saturation for a more vibrant result suitable for transition overlays.
 *
 * @param int $attachment_id Attachment ID.
 * @return string Hex color (e.g. '#3a2b1c') or empty string on failure.
 */
function anima_extract_color_from_attachment( $attachment_id ) {
	$url = wp_get_attachment_url( $attachment_id );
	if ( ! $url ) {
		return '';
	}

	require_once get_template_directory() . '/inc/classes/class-tonesque.php';

	if ( ! class_exists( 'Tonesque' ) ) {
		return '';
	}

	$tonesque = new Tonesque( $url );
	$color    = $tonesque->color();

	if ( empty( $color ) ) {
		return '';
	}

	// Boost saturation — Tonesque averages sample points which produces
	// desaturated/muddy colors. Increase saturation by 25% for a more
	// vibrant result that works better as a transition overlay color.
	if ( class_exists( 'Color' ) ) {
		$color_obj = new Color( $color, 'hex' );
		$saturated = $color_obj->saturate( 25 );
		if ( $saturated ) {
			$color = $saturated->toHex();
		}
	}

	return '#' . $color;
}

/**
 * AJAX handler: extract dominant color from an attachment image using Tonesque.
 */
function anima_ajax_get_project_color() {
	check_ajax_referer( 'anima_project_color', 'nonce' );

	if ( ! current_user_can( 'edit_posts' ) ) {
		wp_send_json_error( 'Unauthorized' );
	}

	$attachment_id = isset( $_POST['attachment_id'] ) ? absint( $_POST['attachment_id'] ) : 0;
	if ( ! $attachment_id ) {
		wp_send_json_error( 'No attachment ID' );
	}

	$color = anima_extract_color_from_attachment( $attachment_id );

	if ( empty( $color ) ) {
		wp_send_json_error( 'Could not extract color from image' );
	}

	// If a post_id was passed, save as auto-generated color.
	$post_id = isset( $_POST['post_id'] ) ? absint( $_POST['post_id'] ) : 0;
	if ( $post_id ) {
		update_post_meta( $post_id, '_project_color_auto', $color );
	}

	wp_send_json_success( $color );
}
add_action( 'wp_ajax_anima_get_project_color', 'anima_ajax_get_project_color' );

/**
 * AJAX handler: preview the contextual runtime palette for an unsaved editor color.
 */
function anima_ajax_get_contextual_palette_preview() {
	check_ajax_referer( 'anima_project_color', 'nonce' );

	if ( ! current_user_can( 'edit_posts' ) ) {
		wp_send_json_error( 'Unauthorized' );
	}

	if ( ! function_exists( 'sm_get_palette_runtime_preview_payload' ) ) {
		wp_send_json_error( 'Style Manager runtime preview is unavailable.' );
	}

	$post_id = isset( $_POST['post_id'] ) ? absint( $_POST['post_id'] ) : 0;
	$color   = isset( $_POST['color'] ) ? sanitize_hex_color( wp_unslash( $_POST['color'] ) ) : '';

	$payload = sm_get_palette_runtime_preview_payload(
		[
			'post_id'          => $post_id,
			'contextual_color' => $color,
		]
	);

	wp_send_json_success( $payload );
}
add_action( 'wp_ajax_anima_get_contextual_palette_preview', 'anima_ajax_get_contextual_palette_preview' );

/**
 * Get the project color for a post.
 *
 * Priority: manual color > cached auto color > lazy-generate from featured image.
 *
 * @param int|null $post_id Post ID. Defaults to current post.
 * @return string Hex color string (e.g. '#3a2b1c') or empty string.
 */
function anima_get_project_color( $post_id = null ) {
	if ( empty( $post_id ) ) {
		$post_id = get_the_ID();
	}

	// 1. Manual color always wins.
	$color = get_post_meta( $post_id, '_project_color', true );
	if ( ! empty( $color ) && '#' !== $color ) {
		return $color;
	}

	// 2. Check cached auto-generated color.
	$auto_color = get_post_meta( $post_id, '_project_color_auto', true );
	if ( ! empty( $auto_color ) && '#' !== $auto_color ) {
		return $auto_color;
	}

	// 3. Generate from featured image (lazy).
	$thumbnail_id = get_post_thumbnail_id( $post_id );
	if ( ! $thumbnail_id ) {
		return '';
	}

	$auto_color = anima_extract_color_from_attachment( $thumbnail_id );
	if ( ! empty( $auto_color ) ) {
		update_post_meta( $post_id, '_project_color_auto', $auto_color );
		return $auto_color;
	}

	return '';
}

/**
 * Get the effective contextual color for a post.
 *
 * @param int|null $post_id Post ID.
 * @return string
 */
function anima_get_contextual_post_color( $post_id = null ) {
	return (string) anima_get_project_color( $post_id );
}

/**
 * Resolve the post id that should receive a contextual runtime palette.
 *
 * @return int
 */
function anima_get_contextual_palette_post_id() {
	if ( is_admin() ) {
		if ( isset( $_GET['post'] ) ) {
			return absint( $_GET['post'] );
		}

		if ( isset( $_POST['post_ID'] ) ) {
			return absint( $_POST['post_ID'] );
		}

		if ( function_exists( 'anima_project_color_supports_current_editor_screen' ) && ! anima_project_color_supports_current_editor_screen() ) {
			return 0;
		}

		$current_post = get_post();
		return $current_post instanceof WP_Post ? (int) $current_post->ID : 0;
	}

	if ( is_singular() ) {
		return (int) get_queried_object_id();
	}

	$current_post = get_post();
	return $current_post instanceof WP_Post ? (int) $current_post->ID : 0;
}

/**
 * Get the contextual palette label for a post.
 *
 * @param int $post_id Post ID.
 * @return string
 */
function anima_get_contextual_palette_label( int $post_id ): string {
	$post_type        = get_post_type( $post_id );
	$post_type_object = $post_type ? get_post_type_object( $post_type ) : null;
	$singular_name    = $post_type_object->labels->singular_name ?? __( 'Post', '__theme_txtd' );

	return sprintf(
		/* translators: %s: singular post type label. */
		__( 'Current %s', '__theme_txtd' ),
		$singular_name
	);
}

/**
 * Register a request-scoped contextual palette with Style Manager.
 *
 * @param array $palettes Existing runtime palettes.
 * @return array
 */
function anima_add_contextual_runtime_palette( array $palettes, array $saved_palettes = [], array $context = [] ): array {
	if ( ! anima_contextual_entry_colors_enabled() ) {
		return $palettes;
	}

	if ( ! function_exists( 'sm_build_contextual_palette_from_color' ) ) {
		return $palettes;
	}

	$post_id = ! empty( $context['post_id'] ) ? absint( $context['post_id'] ) : anima_get_contextual_palette_post_id();

	if ( empty( $post_id ) ) {
		return $palettes;
	}

	$color = ! empty( $context['contextual_color'] ) ? sanitize_hex_color( $context['contextual_color'] ) : sanitize_hex_color( anima_get_contextual_post_color( $post_id ) );

	if ( empty( $color ) ) {
		return $palettes;
	}

	$palettes[] = sm_build_contextual_palette_from_color(
		$color,
		'contextual-post',
		anima_get_contextual_palette_label( $post_id )
	);

	return $palettes;
}
add_filter( 'style_manager/runtime_palettes', 'anima_add_contextual_runtime_palette', 10, 3 );

/**
 * Invalidate the auto-generated color when the featured image changes.
 *
 * @param int    $meta_id    Meta ID.
 * @param int    $post_id    Post ID.
 * @param string $meta_key   Meta key.
 * @param mixed  $meta_value Meta value.
 */
function anima_invalidate_auto_color_on_thumbnail_change( $meta_id, $post_id, $meta_key, $meta_value ) {
	if ( '_thumbnail_id' === $meta_key ) {
		delete_post_meta( $post_id, '_project_color_auto' );
	}
}
add_action( 'updated_post_meta', 'anima_invalidate_auto_color_on_thumbnail_change', 10, 4 );
add_action( 'added_post_meta', 'anima_invalidate_auto_color_on_thumbnail_change', 10, 4 );
add_action( 'deleted_post_meta', 'anima_invalidate_auto_color_on_thumbnail_change', 10, 4 );

/**
 * Inject --anima-project-color CSS custom property on Nova Blocks collection cards.
 *
 * Hooks into Nova Blocks' card markup filter to add the color as an inline style
 * on the .nb-supernova-item wrapper. When no color is set, CSS falls back to
 * var(--sm-current-accent-color).
 *
 * @param string  $markup     Card HTML markup.
 * @param WP_Post $post       The post object for this card.
 * @param array   $attributes Block attributes.
 * @return string Modified markup.
 */
function anima_inject_project_color_on_card( $markup, $post, $attributes ) {
	if ( ! anima_contextual_entry_colors_enabled() ) {
		return $markup;
	}

	$color = anima_get_project_color( $post->ID );

	if ( empty( $color ) ) {
		return $markup;
	}

	// Inject inline style on the .nb-supernova-item div, merging with any
	// existing style attribute so card-level Nova overrides survive.
	$markup = preg_replace_callback(
		'/(<div\s+class="[^"]*nb-supernova-item\b[^"]*")([^>]*?)(\sstyle="([^"]*)")?([^>]*>)/',
		static function( array $matches ) use ( $color ) {
			$prefix         = $matches[1];
			$before_style   = $matches[2] ?? '';
			$existing_style = trim( (string) ( $matches[4] ?? '' ) );
			$suffix         = $matches[5] ?? '>';
			$style_parts    = array_filter( array_map( 'trim', explode( ';', $existing_style ) ) );
			$style_parts[]  = '--anima-project-color: ' . $color;

			return $prefix . $before_style . ' style="' . esc_attr( implode( '; ', array_unique( $style_parts ) ) ) . '"' . $suffix;
		},
		$markup,
		1
	);

	return $markup;
}
add_filter( 'novablocks/get_collection_card_markup', 'anima_inject_project_color_on_card', 10, 3 );

/**
 * Append CSS classes to the first matching class attribute in a markup fragment.
 *
 * @param string $markup        HTML fragment.
 * @param string $class_pattern Regex that matches the target class attribute contents.
 * @param array  $classes       Classes to append.
 * @return string
 */
function anima_append_classes_to_markup_fragment( string $markup, string $class_pattern, array $classes ): string {
	$result = preg_replace_callback(
		$class_pattern,
		static function( array $matches ) use ( $classes ) {
			$existing_classes = preg_split( '/\s+/', trim( $matches[1] ) );
			$existing_classes = array_values( array_filter( $existing_classes ) );

			foreach ( $classes as $class_name ) {
				if ( ! in_array( $class_name, $existing_classes, true ) ) {
					$existing_classes[] = $class_name;
				}
			}

			return 'class="' . esc_attr( implode( ' ', $existing_classes ) ) . '"';
		},
		$markup,
		1
	);

	return is_string( $result ) ? $result : $markup;
}

/**
 * Replace a CSS class with another one in the first matching markup fragment.
 *
 * @param string $markup        HTML fragment.
 * @param string $class_pattern Regex that matches the target class attribute contents.
 * @param string $existing      Existing class to replace.
 * @param string $replacement   Replacement class.
 * @return string
 */
function anima_replace_class_in_markup_fragment( string $markup, string $class_pattern, string $existing, string $replacement ): string {
	$result = preg_replace_callback(
		$class_pattern,
		static function( array $matches ) use ( $existing, $replacement ) {
			$existing_classes = preg_split( '/\s+/', trim( $matches[1] ) );
			$existing_classes = array_values( array_filter( $existing_classes ) );
			$updated_classes  = [];

			foreach ( $existing_classes as $class_name ) {
				$updated_classes[] = $existing === $class_name ? $replacement : $class_name;
			}

			return 'class="' . esc_attr( implode( ' ', $updated_classes ) ) . '"';
		},
		$markup,
		1
	);

	return is_string( $result ) ? $result : $markup;
}

/**
 * Apply the contextual post palette classes to the singular reading bar markup.
 *
 * @param string   $markup  Reading bar HTML fragment.
 * @param int|null $post_id Post ID.
 * @return string
 */
function anima_apply_contextual_palette_to_reading_bar_markup( string $markup, $post_id = null ): string {
	if ( ! anima_contextual_entry_colors_enabled() ) {
		return $markup;
	}

	$contextual_color = sanitize_hex_color( anima_get_contextual_post_color( $post_id ) );

	if ( empty( $contextual_color ) || false === strpos( $markup, 'js-reading-bar' ) ) {
		return $markup;
	}

	$contextual_classes = [
		'sm-palette-contextual-post',
		'sm-variation-1',
		'sm-color-signal-0',
	];

	$markup = anima_append_classes_to_markup_fragment(
		$markup,
		'/class="([^"]*\bc-reading-bar\b[^"]*\bjs-reading-bar\b[^"]*)"/',
		$contextual_classes
	);

	$markup = anima_append_classes_to_markup_fragment(
		$markup,
		'/class="([^"]*\bc-reading-bar__progress\b[^"]*\bjs-reading-progress\b[^"]*)"/',
		$contextual_classes
	);

	$markup = anima_replace_class_in_markup_fragment(
		$markup,
		'/class="([^"]*\bc-reading-bar__layer\b[^"]*\bc-reading-bar__layer--next\b[^"]*)"/',
		'sm-palette-1',
		'sm-palette-contextual-post'
	);

	return $markup;
}

/**
 * Scope the singular reading bar to the existing contextual post palette.
 *
 * @param string $block_content Rendered block markup.
 * @return string
 */
function anima_apply_contextual_palette_to_header_reading_bar( string $block_content ): string {
	if ( ! ( is_single() || is_singular( 'portfolio' ) ) ) {
		return $block_content;
	}

	if ( false === strpos( $block_content, 'js-reading-bar' ) ) {
		return $block_content;
	}

	return anima_apply_contextual_palette_to_reading_bar_markup( $block_content, get_queried_object_id() );
}
add_filter( 'render_block_novablocks/header', 'anima_apply_contextual_palette_to_header_reading_bar', 10, 1 );

/**
 * Resolve the current singular post ID during block rendering.
 *
 * `get_queried_object_id()` can be empty inside dynamic block render callbacks,
 * even when the current post is available on the global post stack.
 *
 * @return int
 */
function anima_get_current_render_post_id(): int {
	if ( isset( $GLOBALS['post'] ) && $GLOBALS['post'] instanceof WP_Post ) {
		return (int) $GLOBALS['post']->ID;
	}

	$render_post_id = get_the_ID();

	if ( ! empty( $render_post_id ) ) {
		return (int) $render_post_id;
	}

	return (int) get_queried_object_id();
}

/**
 * Inject the next entry transition color into the bottom post-navigation markup.
 *
 * @param string   $markup          Post navigation HTML fragment.
 * @param int|null $current_post_id Current post ID.
 * @return string
 */
function anima_add_next_entry_transition_color_to_post_navigation_markup( string $markup, $current_post_id = null ): string {
	if ( ! anima_contextual_entry_colors_enabled() ) {
		return $markup;
	}

	if ( empty( $current_post_id ) || false === strpos( $markup, 'post-navigation__link--next' ) ) {
		return $markup;
	}

	$current_post = get_post( $current_post_id );

	if ( ! $current_post instanceof WP_Post ) {
		return $markup;
	}

	$previous_post = $GLOBALS['post'] ?? null;
	$GLOBALS['post'] = $current_post;
	setup_postdata( $current_post );

	$next_post = get_next_post();

	if ( $previous_post instanceof WP_Post ) {
		$GLOBALS['post'] = $previous_post;
		setup_postdata( $previous_post );
	} else {
		wp_reset_postdata();
	}

	if ( ! $next_post instanceof WP_Post ) {
		return $markup;
	}

	$next_color = sanitize_hex_color( anima_get_project_color( $next_post->ID ) );

	if ( empty( $next_color ) ) {
		return $markup;
	}

	$result = preg_replace(
		'/(<span class="[^"]*\bpost-navigation__post-title--next\b[^"]*">\s*<a\b)([^>]*)(>)/',
		'$1$2 data-anima-transition-color="' . esc_attr( $next_color ) . '"$3',
		$markup,
		1
	);

	return is_string( $result ) ? $result : $markup;
}

/**
 * Expose destination colors on the bottom post-navigation next link.
 *
 * @param string $block_content Rendered block markup.
 * @return string
 */
function anima_apply_next_entry_transition_color_to_post_navigation( string $block_content ): string {
	if ( is_admin() || false === strpos( $block_content, 'post-navigation__link--next' ) ) {
		return $block_content;
	}

	return anima_add_next_entry_transition_color_to_post_navigation_markup( $block_content, anima_get_current_render_post_id() );
}
add_filter( 'render_block_novablocks/post-navigation', 'anima_apply_next_entry_transition_color_to_post_navigation', 10, 1 );
