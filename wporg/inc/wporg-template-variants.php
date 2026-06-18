<?php
/**
 * Plugin-aware template variants for the WordPress.org build.
 *
 * @package Anima
 */

defined( 'ABSPATH' ) || exit;

/**
 * Determines whether Nova Blocks has loaded.
 *
 * Nova Blocks defines this public version constant in its main plugin
 * bootstrap. The helper functions in that file are marked private, so the
 * constant is the least brittle runtime marker.
 *
 * @return bool
 */
function anima_wporg_novablocks_is_active(): bool {
	return defined( 'Pixelgrade\NovaBlocks\VERSION' );
}

/**
 * Gets the theme-owned templates and parts that have Nova Blocks variants.
 *
 * @return array<string,string[]>
 */
function anima_wporg_get_novablocks_template_variant_slugs(): array {
	return [
		'wp_template'      => [
			'page',
			'single',
			'home',
			'index',
			'archive',
			'search',
		],
		'wp_template_part' => [
			'header',
			'footer',
		],
	];
}

/**
 * Resolves the Nova Blocks variant file path for a template or part.
 *
 * @param string $slug          Template or part slug.
 * @param string $template_type Template type.
 * @return string File path, or an empty string when no variant exists.
 */
function anima_wporg_get_novablocks_template_variant_path( string $slug, string $template_type ): string {
	$template_variant_slugs = anima_wporg_get_novablocks_template_variant_slugs();

	if ( empty( $template_variant_slugs[ $template_type ] ) || ! in_array( $slug, $template_variant_slugs[ $template_type ], true ) ) {
		return '';
	}

	$directory = 'wp_template_part' === $template_type ? 'parts' : 'templates';
	$path      = get_theme_file_path( 'wporg-template-variants/novablocks/' . $directory . '/' . $slug . '.html' );

	if ( ! is_readable( $path ) ) {
		return '';
	}

	return $path;
}

/**
 * Determines whether a resolved block template may be swapped.
 *
 * @param mixed  $template      Resolved block template.
 * @param string $template_type Template type.
 * @return bool
 */
function anima_wporg_can_swap_to_novablocks_template_variant( $template, string $template_type ): bool {
	if ( ! anima_wporg_novablocks_is_active() || ! is_object( $template ) ) {
		return false;
	}

	if ( 'theme' !== ( $template->source ?? '' ) ) {
		return false;
	}

	if ( function_exists( 'get_stylesheet' ) && get_stylesheet() !== ( $template->theme ?? '' ) ) {
		return false;
	}

	if ( isset( $template->type ) && $template_type !== $template->type ) {
		return false;
	}

	$slug = $template->slug ?? '';

	return '' !== anima_wporg_get_novablocks_template_variant_path( $slug, $template_type );
}

/**
 * Applies the Nova Blocks variant to a resolved theme template or part.
 *
 * User-customized templates have source "custom", so they are returned as-is.
 *
 * @param mixed  $template      Resolved block template.
 * @param string $template_type Template type.
 * @return mixed
 */
function anima_wporg_apply_novablocks_template_variant( $template, string $template_type ) {
	if ( ! anima_wporg_can_swap_to_novablocks_template_variant( $template, $template_type ) ) {
		return $template;
	}

	$path    = anima_wporg_get_novablocks_template_variant_path( $template->slug, $template_type );
	$content = file_get_contents( $path );

	if ( false === $content ) {
		return $template;
	}

	$variant          = clone $template;
	$variant->content = $content;
	$variant->path    = $path;

	return $variant;
}

/**
 * Swaps queried theme templates and parts to their Nova Blocks variants.
 *
 * @param array  $query_result  Array of found block templates.
 * @param array  $query         Optional query arguments.
 * @param string $template_type Template type.
 * @return array
 */
function anima_wporg_filter_block_templates_with_novablocks_variants( $query_result, $query, $template_type ): array {
	foreach ( $query_result as $index => $template ) {
		$query_result[ $index ] = anima_wporg_apply_novablocks_template_variant( $template, $template_type );
	}

	return $query_result;
}
add_filter( 'get_block_templates', 'anima_wporg_filter_block_templates_with_novablocks_variants', 11, 3 );

/**
 * Swaps a single resolved theme template or part to its Nova Blocks variant.
 *
 * @param mixed  $template      Resolved block template.
 * @param string $id            Template ID.
 * @param string $template_type Template type.
 * @return mixed
 */
function anima_wporg_filter_block_template_with_novablocks_variant( $template, $id, $template_type ) {
	return anima_wporg_apply_novablocks_template_variant( $template, $template_type );
}
add_filter( 'get_block_template', 'anima_wporg_filter_block_template_with_novablocks_variant', 11, 3 );
