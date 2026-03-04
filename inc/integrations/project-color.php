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
 * Enqueue the block editor sidebar panel script.
 */
function anima_project_color_editor_assets() {
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
		'ajaxUrl' => admin_url( 'admin-ajax.php' ),
		'nonce'   => wp_create_nonce( 'anima_project_color' ),
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
	$color = anima_get_project_color( $post->ID );

	if ( empty( $color ) ) {
		return $markup;
	}

	// Inject inline style on the .nb-supernova-item div.
	// The markup structure is: <div class="nb-collection__layout-item"><div class="nb-supernova-item ..." ...>
	$markup = preg_replace(
		'/(<div\s+class="[^"]*nb-supernova-item\b[^"]*")/',
		'$1 style="--anima-project-color: ' . esc_attr( $color ) . '"',
		$markup,
		1
	);

	return $markup;
}
add_filter( 'novablocks/get_collection_card_markup', 'anima_inject_project_color_on_card', 10, 3 );
