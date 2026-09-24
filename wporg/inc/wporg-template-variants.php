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

	if ( 'wp_template' !== $template_type ) {
		return $query_result;
	}

	// Add the stripped Nova Blocks templates back, unless a copy (e.g. a
	// user-customized one) is already in the results.
	$present = [];
	foreach ( $query_result as $template ) {
		if ( is_object( $template ) && ! empty( $template->slug ) ) {
			$present[ $template->slug ] = true;
		}
	}

	foreach ( anima_wporg_get_novablocks_added_templates( is_array( $query ) ? $query : [] ) as $template ) {
		if ( empty( $present[ $template->slug ] ) ) {
			$query_result[] = $template;
		}
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

/**
 * Nova Blocks templates the wp.org build strips from templates/ entirely
 * (see .zipignore-wporg), mapped to what must exist for each to be useful.
 *
 * They reference Nova Blocks and plugin-registered content (the Pixelgrade
 * Care portfolio, gallery and testimonial post types), so the plugin-free
 * package cannot ship them as regular templates (#602). With Nova Blocks
 * active they are added back from wporg-template-variants/, one by one,
 * when their post type or taxonomy is registered.
 *
 * @return array<string,array<string,mixed>>
 */
function anima_wporg_get_novablocks_added_template_requirements(): array {
	return [
		'archive-portfolio'       => [ 'post_type' => 'portfolio' ],
		'single-portfolio'        => [ 'post_type' => 'portfolio' ],
		'taxonomy-portfolio_type' => [ 'taxonomy' => 'portfolio_type' ],
		'taxonomy-portfolio_tag'  => [ 'taxonomy' => 'portfolio_tag' ],
		'archive-gallery'         => [ 'post_type' => 'gallery' ],
		'single-gallery'          => [ 'post_type' => 'gallery' ],
		'taxonomy-gallery_type'   => [ 'taxonomy' => 'gallery_type' ],
		'taxonomy-gallery_tag'    => [ 'taxonomy' => 'gallery_tag' ],
		'archive-testimonial'     => [ 'post_type' => 'testimonial' ],
		'single-testimonial'      => [ 'post_type' => 'testimonial' ],
		// A custom template (theme.json customTemplates), offered for posts.
		'single-split-header'     => [ 'post_types' => [ 'post' ] ],
	];
}

/**
 * Whether an added template's post type or taxonomy is registered.
 *
 * @param array<string,mixed> $requirement Requirement from the map above.
 * @return bool
 */
function anima_wporg_novablocks_added_template_requirement_met( array $requirement ): bool {
	if ( ! empty( $requirement['post_type'] ) ) {
		return post_type_exists( $requirement['post_type'] );
	}

	if ( ! empty( $requirement['taxonomy'] ) ) {
		return taxonomy_exists( $requirement['taxonomy'] );
	}

	return true;
}

/**
 * Builds an added template from its variant file, like a theme file template.
 *
 * @param string $slug Template slug.
 * @return WP_Block_Template|null
 */
function anima_wporg_build_novablocks_added_template( string $slug ) {
	$requirements = anima_wporg_get_novablocks_added_template_requirements();

	if ( ! isset( $requirements[ $slug ] ) ) {
		return null;
	}

	$path = get_theme_file_path( 'wporg-template-variants/novablocks/templates/' . $slug . '.html' );

	if ( ! is_readable( $path ) || ! anima_wporg_novablocks_added_template_requirement_met( $requirements[ $slug ] ) ) {
		return null;
	}

	$template_file = [
		'slug'  => $slug,
		'path'  => $path,
		'theme' => get_stylesheet(),
		'type'  => 'wp_template',
	];

	// Like core's _add_block_template_info(): theme.json custom templates
	// (e.g. the split-header single) bring their title and post types.
	$custom_templates = function_exists( 'wp_get_theme_data_custom_templates' ) ? wp_get_theme_data_custom_templates() : [];
	if ( isset( $custom_templates[ $slug ] ) ) {
		$template_file['title']     = $custom_templates[ $slug ]['title'];
		$template_file['postTypes'] = $custom_templates[ $slug ]['postTypes'];
	}

	// Core's builder then fills in the rest exactly as for a file in templates/.
	if ( function_exists( '_build_block_template_result_from_file' ) ) {
		return _build_block_template_result_from_file( $template_file, 'wp_template' );
	}

	$content = file_get_contents( $path );

	if ( false === $content ) {
		return null;
	}

	$template                 = new WP_Block_Template();
	$template->id             = get_stylesheet() . '//' . $slug;
	$template->theme          = get_stylesheet();
	$template->content        = $content;
	$template->slug           = $slug;
	$template->source         = 'theme';
	$template->type           = 'wp_template';
	$template->title          = $template_file['title'] ?? $slug;
	$template->status         = 'publish';
	$template->has_theme_file = true;
	$post_types               = $template_file['postTypes'] ?? ( $requirements[ $slug ]['post_types'] ?? [] );
	$template->is_custom      = ! empty( $post_types ) || isset( $template_file['title'] );
	$template->path           = $path;

	if ( ! empty( $post_types ) ) {
		$template->post_types = $post_types;
	}

	return $template;
}

/**
 * Gets the added templates that match a get_block_templates() query.
 *
 * @param array $query Query arguments (slug__in, post_type, theme, wp_id).
 * @return WP_Block_Template[]
 */
function anima_wporg_get_novablocks_added_templates( array $query = [] ): array {
	if ( ! anima_wporg_novablocks_is_active() || ! empty( $query['wp_id'] ) ) {
		return [];
	}

	if ( ! empty( $query['theme'] ) && get_stylesheet() !== $query['theme'] ) {
		return [];
	}

	$templates = [];

	foreach ( array_keys( anima_wporg_get_novablocks_added_template_requirements() ) as $slug ) {
		if ( ! empty( $query['slug__in'] ) && ! in_array( $slug, (array) $query['slug__in'], true ) ) {
			continue;
		}

		$template = anima_wporg_build_novablocks_added_template( $slug );

		if ( ! $template ) {
			continue;
		}

		// Same rule as core: custom templates list the post types they serve.
		if ( ! empty( $query['post_type'] ) && ! empty( $template->post_types ) && ! in_array( $query['post_type'], $template->post_types, true ) ) {
			continue;
		}

		$templates[] = $template;
	}

	return $templates;
}

/**
 * Resolves an added template for single fetches (Site Editor, get_block_template).
 *
 * @param WP_Block_Template|null $block_template Template found so far.
 * @param string                 $id             Template ID (theme//slug).
 * @param string                 $template_type  Template type.
 * @return WP_Block_Template|null
 */
function anima_wporg_filter_block_file_template_with_novablocks_addition( $block_template, $id, $template_type ) {
	if ( null !== $block_template || 'wp_template' !== $template_type || ! anima_wporg_novablocks_is_active() ) {
		return $block_template;
	}

	$parts = explode( '//', (string) $id, 2 );

	if ( 2 !== count( $parts ) || get_stylesheet() !== $parts[0] ) {
		return $block_template;
	}

	$template = anima_wporg_build_novablocks_added_template( $parts[1] );

	return $template ? $template : $block_template;
}
add_filter( 'get_block_file_template', 'anima_wporg_filter_block_file_template_with_novablocks_addition', 10, 3 );
