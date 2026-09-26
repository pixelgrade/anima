<?php
/**
 * Resolve lightweight post expression profiles for cards and single posts.
 *
 * @package Anima
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

function anima_get_post_expression_profile( $post = null, string $surface = 'default' ): array {
	$post = get_post( $post );

	if ( ! $post instanceof WP_Post ) {
		return anima_get_default_post_expression_profile( $surface );
	}

	static $profile_cache = [];

	$cache_key = $post->ID . ':' . $surface;

	if ( isset( $profile_cache[ $cache_key ] ) ) {
		return $profile_cache[ $cache_key ];
	}

	$profile_cache[ $cache_key ] = anima_resolve_post_expression_profile( $post, $surface );

	return $profile_cache[ $cache_key ];
}

function anima_get_default_post_expression_profile( string $surface ): array {
	return [
		'format'         => 'standard',
		'surface'        => $surface,
		'extracts'       => [
			'quote'          => '',
			'quote_html'     => '',
			'quote_citation' => '',
			'link'           => '',
		],
		'traits'         => [
			'media_mode'    => 'text',
			'image_shape'   => 'text',
			'has_thumbnail' => false,
		],
		'card_variant'   => 'text',
		'single_variant' => 'default',
	];
}

function anima_resolve_post_expression_profile( WP_Post $post, string $surface ): array {
	$format        = anima_normalize_post_expression_format( get_post_format( $post ) );
	$thumbnail_id  = (int) get_post_thumbnail_id( $post );
	$has_thumbnail = $thumbnail_id > 0;
	$image_shape   = $has_thumbnail ? anima_get_post_expression_image_shape( $thumbnail_id ) : anima_get_post_expression_fallback_shape( $format );
	$media_mode    = anima_get_post_expression_media_mode( $format, $has_thumbnail );
	$extracts      = anima_get_post_expression_extracts( $post, $format );

	return [
		'format'         => $format,
		'surface'        => $surface,
		'extracts'       => $extracts,
		'traits'         => [
			'media_mode'    => $media_mode,
			'image_shape'   => $image_shape,
			'has_thumbnail' => $has_thumbnail,
		],
		'card_variant'   => anima_get_post_expression_card_variant( $format, $image_shape ),
		'single_variant' => anima_get_post_expression_single_variant( $format ),
	];
}

function anima_get_post_expression_supported_formats(): array {
	return [ 'quote', 'image', 'gallery', 'link', 'audio', 'video' ];
}

function anima_normalize_post_expression_format( $format ): string {
	if ( empty( $format ) || ! in_array( $format, anima_get_post_expression_supported_formats(), true ) ) {
		return 'standard';
	}

	return $format;
}

function anima_get_post_expression_image_shape( int $thumbnail_id ): string {
	$metadata = wp_get_attachment_metadata( $thumbnail_id );
	$width    = absint( $metadata['width'] ?? 0 );
	$height   = absint( $metadata['height'] ?? 0 );

	if ( ! $width || ! $height ) {
		return 'landscape';
	}

	$ratio = $width / $height;

	if ( $ratio < 0.5625 ) {
		return 'tall';
	}

	if ( $ratio < 0.75 ) {
		return 'portrait';
	}

	if ( $ratio > 1.78 ) {
		return 'wide';
	}

	if ( $ratio > 1.34 ) {
		return 'landscape';
	}

	return 'square';
}

function anima_get_post_expression_extracts( WP_Post $post, string $format = '' ): array {
	static $extract_cache = [];

	$format = '' !== $format ? $format : anima_normalize_post_expression_format( get_post_format( $post ) );

	if ( isset( $extract_cache[ $post->ID ] ) ) {
		return $extract_cache[ $post->ID ];
	}

	$extracts = [
		'quote'          => '',
		'quote_html'     => '',
		'quote_citation' => '',
		'link'           => '',
	];

	if ( ! in_array( $format, [ 'quote', 'link' ], true ) ) {
		$extract_cache[ $post->ID ] = $extracts;

		return $extract_cache[ $post->ID ];
	}

	$blocks = [];
	if ( ! empty( $post->post_content ) && has_blocks( $post->post_content ) ) {
		$blocks = parse_blocks( $post->post_content );
	}

	if ( 'quote' === $format ) {
		$quote_extract = anima_get_post_expression_quote_extract( $post, $blocks );
		$extracts      = array_merge( $extracts, $quote_extract );
	}

	if ( 'link' === $format ) {
		$extracts['link'] = anima_get_post_expression_link_extract( $post, $blocks );
	}

	$extract_cache[ $post->ID ] = $extracts;

	return $extract_cache[ $post->ID ];
}

function anima_get_post_expression_fallback_shape( string $format ): string {
	if ( in_array( $format, [ 'gallery', 'image', 'audio', 'video' ], true ) ) {
		return 'landscape';
	}

	return 'text';
}

function anima_get_post_expression_media_mode( string $format, bool $has_thumbnail ): string {
	switch ( $format ) {
		case 'quote':
		case 'link':
			return 'text';
		case 'gallery':
		case 'audio':
		case 'video':
			return $format;
		case 'image':
			return 'image';
		default:
			return $has_thumbnail ? 'image' : 'text';
	}
}

function anima_get_post_expression_card_variant( string $format, string $image_shape ): string {
	switch ( $format ) {
		case 'quote':
		case 'image':
		case 'gallery':
		case 'link':
		case 'audio':
		case 'video':
			return $format;
		default:
			return 'text' === $image_shape ? 'text' : 'default';
	}
}

function anima_get_post_expression_single_variant( string $format ): string {
	switch ( $format ) {
		case 'quote':
			return 'quote';
		case 'image':
		case 'gallery':
			return 'visual';
		case 'audio':
		case 'video':
			return 'media';
		default:
			return 'default';
	}
}

function anima_get_post_expression_quote_extract( WP_Post $post, array $blocks ): array {
	$quote_block = anima_find_first_block_by_name( $blocks, 'core/quote' );

	if ( ! empty( $quote_block ) ) {
		$parts = anima_extract_first_blockquote_parts( render_block( $quote_block ) );

		if ( '' !== $parts['quote'] ) {
			return [
				'quote'          => $parts['quote'],
				'quote_html'     => $parts['quote_html'],
				'quote_citation' => $parts['citation'],
			];
		}
	}

	$blockquote_parts = anima_extract_first_blockquote_parts( $post->post_content );

	if ( '' !== $blockquote_parts['quote'] ) {
		return [
			'quote'          => $blockquote_parts['quote'],
			'quote_html'     => $blockquote_parts['quote_html'],
			'quote_citation' => $blockquote_parts['citation'],
		];
	}

	if ( has_excerpt( $post ) ) {
		$excerpt = trim( wp_strip_all_tags( get_the_excerpt( $post ) ) );

		return [
			'quote'          => $excerpt,
			'quote_html'     => esc_html( $excerpt ),
			'quote_citation' => '',
		];
	}

	$paragraph      = anima_get_first_paragraph_text( $post->post_content, $blocks );
	$paragraph_html = anima_get_first_paragraph_html( $post->post_content, $blocks );

	return [
		'quote'          => $paragraph,
		'quote_html'     => '' !== $paragraph_html ? anima_get_inline_quote_html( $paragraph_html ) : esc_html( $paragraph ),
		'quote_citation' => '',
	];
}

function anima_get_post_expression_link_extract( WP_Post $post, array $blocks ): string {
	$link_url = anima_find_first_url_in_blocks( $blocks );

	if ( '' !== $link_url ) {
		return $link_url;
	}

	$legacy_url = get_url_in_content( $post->post_content );

	return is_string( $legacy_url ) ? trim( $legacy_url ) : '';
}

function anima_find_first_block_by_name( array $blocks, string $block_name ): ?array {
	foreach ( $blocks as $block ) {
		if ( $block_name === ( $block['blockName'] ?? null ) ) {
			return $block;
		}

		if ( ! empty( $block['innerBlocks'] ) ) {
			$inner_match = anima_find_first_block_by_name( $block['innerBlocks'], $block_name );

			if ( ! empty( $inner_match ) ) {
				return $inner_match;
			}
		}
	}

	return null;
}

function anima_find_first_url_in_blocks( array $blocks ): string {
	foreach ( $blocks as $block ) {
		if ( 'core/button' === ( $block['blockName'] ?? null ) && ! empty( $block['attrs']['url'] ) ) {
			return trim( $block['attrs']['url'] );
		}

		if ( 'core/embed' === ( $block['blockName'] ?? null ) && ! empty( $block['attrs']['url'] ) ) {
			return trim( $block['attrs']['url'] );
		}

		if ( ! empty( $block['innerBlocks'] ) ) {
			$inner_url = anima_find_first_url_in_blocks( $block['innerBlocks'] );

			if ( '' !== $inner_url ) {
				return $inner_url;
			}
		}
	}

	return '';
}

function anima_extract_first_blockquote_parts( string $content ): array {
	if ( ! preg_match( '/<blockquote\b[^>]*>(.*?)<\/blockquote>/is', $content, $matches ) ) {
		return [
			'quote'      => '',
			'quote_html' => '',
			'citation'   => '',
		];
	}

	$quote_markup = $matches[1];
	$citation     = '';

	if ( preg_match( '/<cite\b[^>]*>(.*?)<\/cite>/is', $quote_markup, $cite_matches ) ) {
		$citation = trim( wp_strip_all_tags( $cite_matches[1] ) );
	}

	$quote_markup = preg_replace( '/<cite\b[^>]*>.*?<\/cite>/is', '', $quote_markup );

	return [
		'quote'      => trim( wp_strip_all_tags( $quote_markup ) ),
		'quote_html' => anima_get_inline_quote_html( $quote_markup ),
		'citation'   => $citation,
	];
}

/**
 * A quote's inline formatting (links, emphasis, code…) for cards that render
 * it (nova-blocks#652). Paragraph breaks become line breaks; block tags,
 * scripts and attributes other than a link's href/title are dropped.
 *
 * @param string $quote_markup Blockquote inner markup without the citation.
 * @return string Safe inline HTML.
 */
function anima_get_inline_quote_html( string $quote_markup ): string {
	$quote_markup = preg_replace( '/<(script|style)\b[^>]*>.*?<\/\1>/is', '', $quote_markup );
	$quote_markup = preg_replace( '/<\/p>\s*<p\b[^>]*>/i', '<br>', $quote_markup );

	$inline = wp_kses(
		$quote_markup,
		[
			'a'      => [ 'href' => true, 'title' => true ],
			'strong' => [],
			'b'      => [],
			'em'     => [],
			'i'      => [],
			'code'   => [],
			'mark'   => [],
			'sub'    => [],
			'sup'    => [],
			's'      => [],
			'br'     => [],
		]
	);

	return trim( preg_replace( '/^(\s*<br\s*\/?>)+|(<br\s*\/?>\s*)+$/i', '', trim( $inline ) ) );
}

/**
 * A classic post's first paragraph rarely arrives as a `<blockquote>` or a
 * `core/quote` block; it is a plain paragraph. Its inline markup (links,
 * `strong`/`em`…) is kept here the same way `anima_extract_first_blockquote_parts()`
 * keeps a blockquote's, so `anima_get_post_expression_quote_extract()` can
 * hand a real `quote_html` to the card instead of stripping it to plain text
 * first (#615).
 *
 * @param string $content Post content (classic or block markup).
 * @param array  $blocks   Parsed blocks, when available.
 * @return string The first paragraph's inner markup, or '' if none is found.
 */
function anima_get_first_paragraph_html( string $content, array $blocks = [] ): string {
	if ( ! empty( $blocks ) ) {
		$paragraph_block = anima_find_first_block_by_name( $blocks, 'core/paragraph' );

		if ( ! empty( $paragraph_block['innerHTML'] ) ) {
			$inner_html = (string) $paragraph_block['innerHTML'];

			if ( preg_match( '/<p\b[^>]*>(.*?)<\/p>/is', $inner_html, $matches ) ) {
				return trim( $matches[1] );
			}

			return trim( $inner_html );
		}
	}

	if ( preg_match( '/<p\b[^>]*>(.*?)<\/p>/is', $content, $matches ) ) {
		return trim( $matches[1] );
	}

	return '';
}

function anima_get_first_paragraph_text( string $content, array $blocks = [] ): string {
	return trim( wp_strip_all_tags( anima_get_first_paragraph_html( $content, $blocks ) ) );
}
