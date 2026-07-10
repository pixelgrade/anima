<?php
/**
 * Integrate Anima post expression profiles with Nova cards.
 *
 * @package Anima
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

add_filter( 'novablocks/post_card_profile', 'anima_filter_novablocks_post_card_profile', 10, 3 );
add_filter( 'novablocks/post_card_render_data', 'anima_filter_novablocks_post_card_render_data', 10, 4 );

function anima_filter_novablocks_post_card_profile( array $profile, $post, array $attributes ): array {
	return array_merge( $profile, anima_get_post_expression_profile( $post, 'card' ) );
}

function anima_filter_novablocks_post_card_render_data( array $render_data, $post, array $attributes, array $profile ): array {
	$format       = $profile['format'] ?? 'standard';
	$image_shape  = $profile['traits']['image_shape'] ?? 'text';
	$card_variant = $profile['card_variant'] ?? 'default';

	$extra_classes = [
		'format-' . $format,
		'card-trait-' . $image_shape,
		'card-variant-' . $card_variant,
	];

	// Sticky posts get a marker class so themes can render a sticky
	// affordance (e.g. the Patch-style bookmark ribbon).
	$post_id = $post instanceof WP_Post ? $post->ID : (int) $post;
	if ( $post_id && is_sticky( $post_id ) ) {
		$extra_classes[] = 'is-sticky-post';
	}

	$render_data['card_classes'] = array_values(
		array_unique(
			array_merge(
				$render_data['card_classes'] ?? [],
				$extra_classes
			)
		)
	);

	return $render_data;
}
