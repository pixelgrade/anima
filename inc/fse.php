<?php
/**
 * Logic that deals with the WordPress 5.9+ full site editing experience.
 *
 * @package Anima
 */

// If this file is called directly, abort.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

require_once 'fse/block-patterns.php';

/**
 * Determine whether a post-content block is missing an explicit layout context.
 *
 * @param array $block Parsed block data.
 * @return bool
 */
function anima_post_content_block_needs_layout_defaults( array $block ): bool {
	if ( 'core/post-content' !== ( $block['blockName'] ?? null ) ) {
		return false;
	}

	$layout = $block['attrs']['layout'] ?? null;

	if ( ! is_array( $layout ) ) {
		return true;
	}

	foreach ( [ 'type', 'inherit', 'contentSize', 'wideSize' ] as $key ) {
		if ( array_key_exists( $key, $layout ) ) {
			return false;
		}
	}

	return true;
}

/**
 * Add the theme's constrained post-content layout defaults to stale templates.
 *
 * Older customized templates may serialize a bare core/post-content block, which
 * makes WP 7 treat post content as flow layout and hide Wide/Full controls.
 *
 * @param array $blocks Parsed block data.
 * @return array
 */
function anima_normalize_post_content_layout_blocks( array $blocks ): array {
	foreach ( $blocks as &$block ) {
		if ( anima_post_content_block_needs_layout_defaults( $block ) ) {
			$block['attrs']           = is_array( $block['attrs'] ?? null ) ? $block['attrs'] : [];
			$existing_layout          = $block['attrs']['layout'] ?? [];
			$existing_layout          = is_array( $existing_layout ) ? $existing_layout : [];
			$block['attrs']['layout'] = array_merge( anima_get_post_content_layout_defaults(), $existing_layout );
		}

		if ( ! empty( $block['innerBlocks'] ) && is_array( $block['innerBlocks'] ) ) {
			$block['innerBlocks'] = anima_normalize_post_content_layout_blocks( $block['innerBlocks'] );
		}
	}
	unset( $block );

	return $blocks;
}

/**
 * Normalize retrieved block templates so stale custom templates inherit layout.
 *
 * @param WP_Block_Template[] $query_result  Array of found block templates.
 * @param array               $query         Optional query arguments.
 * @param string              $template_type wp_template or wp_template_part.
 * @return WP_Block_Template[]
 */
function anima_normalize_block_templates_post_content_layout( $query_result, $query, $template_type ) {
	if ( 'wp_template' !== $template_type ) {
		return $query_result;
	}

	foreach ( $query_result as $template ) {
		if ( 'anima' !== ( $template->theme ?? '' ) || empty( $template->content ) ) {
			continue;
		}

		$blocks            = parse_blocks( $template->content );
		$normalized_blocks = anima_normalize_post_content_layout_blocks( $blocks );

		if ( $normalized_blocks !== $blocks ) {
			$template->content = serialize_blocks( $normalized_blocks );
		}
	}

	return $query_result;
}
add_filter( 'get_block_templates', 'anima_normalize_block_templates_post_content_layout', 9, 3 );

/**
 * Filters the array of queried block templates array after they've been fetched.
 *
 * This way we add titles and/or descriptions about the templates we're providing that are not covered by core
 * ( through @see get_default_block_template_types() ).
 *
 * @param WP_Block_Template[] $query_result Array of found block templates.
 * @param array  $query {
 *     Optional. Arguments to retrieve templates.
 *
 *     @type array  $slug__in List of slugs to include.
 *     @type int    $wp_id Post ID of customized template.
 * }
 * @param string $template_type wp_template or wp_template_part.
 *
 * @return WP_Block_Template[]
 */
function anima_add_block_templates_details( $query_result, $query, $template_type ) {
	if ( 'wp_template' === $template_type ) {
		foreach ( $query_result as $template ) {
			// Leave it alone if it is not from Anima or it already has a description.
			if ( 'anima' !== $template->theme || ! empty( $template->description ) ) {
				continue;
			}

			switch ( $template->slug ) {
				case 'archive-product':
					$template->title = esc_html__( 'Products Archive', '__theme_txtd' );
					$template->description = esc_html__( 'Displays the entire products list.', '__theme_txtd' );
					break;
				case 'taxonomy-product_cat':
					$template->title = esc_html__( 'Product Categories Archive', '__theme_txtd' );
					$template->description = esc_html__( 'Displays the products from a certain product category.', '__theme_txtd' );
					break;
				case 'taxonomy-product_tag':
					$template->title = esc_html__( 'Product Tags Archive', '__theme_txtd' );
					$template->description = esc_html__( 'Displays the products with a certain product tag attached.', '__theme_txtd' );
					break;
				case 'single-product':
					$template->title = esc_html__( 'Single Product', '__theme_txtd' );
					$template->description = esc_html__( 'Displays a single product.', '__theme_txtd' );
					break;
				case 'single-split-header':
					$template->description = esc_html__( 'Displays a single post with a different layout for the header.', '__theme_txtd' );
					break;
				
				// Single
				case 'single-testimonial':
					$template->description = esc_html__( 'Displays a single testimonial.', '__theme_txtd' );
					break;
				case 'single-portfolio':
					$template->description = esc_html__( 'Displays a single project.', '__theme_txtd' );
					break;
				case 'single-gallery':
					$template->description = esc_html__( 'Displays a single gallery.', '__theme_txtd' );
					break;
				
				// Archive
				case 'archive-testimonial':
					$template->description = esc_html__( 'Displays the entire testimonials list.', '__theme_txtd' );
					break;
				case 'archive-portfolio':
					$template->description = esc_html__( 'Displays the entire projects list.', '__theme_txtd' );
					break;
				case 'archive-gallery':
					$template->description = esc_html__( 'Displays the entire galleries list.', '__theme_txtd' );
					break;
				
				// Tag
				case 'taxonomy-testimonial_tag':
					$template->description = esc_html__( 'Displays the testimonials with a certain tag attached.', '__theme_txtd' );
					break;
				case 'taxonomy-portfolio_tag':
					$template->description = esc_html__( 'Displays the projects with a certain tag attached.', '__theme_txtd' );
					break;
				case 'taxonomy-gallery_tag':
					$template->description = esc_html__( 'Displays the galleries with a certain tag attached.', '__theme_txtd' );
					break;
				
				// Type
				case 'taxonomy-testimonial_type':
					$template->description = esc_html__( 'Displays the testimonials with a certain type attached.', '__theme_txtd' );
					break;
				case 'taxonomy-portfolio_type':
					$template->description = esc_html__( 'Displays the projects with a certain type attached.', '__theme_txtd' );
					break;
				case 'taxonomy-gallery_type':
					$template->description = esc_html__( 'Displays the galleries with a certain type attached.', '__theme_txtd' );
					break;
				default:
					break;
			}
		}
	}

	return $query_result;
}
add_filter( 'get_block_templates', 'anima_add_block_templates_details', 10, 3 );

/**
 * Get our custom template canvas file path, depending on the type of template being queried.
 *
 * Since with FSE we have little room in terms of hooks, we need to make do to bring back some of our hooks.
 *
 * The core template-canvas file is the default entry point for rendering block templates.
 * Its full path changed over time in Gutenberg/plugin contexts, so we detect it by suffix.
 *
 * @see get_query_template(), locate_block_template()
 *
 * @param string   $template  Path to the template. See locate_template().
 * @param string   $type      Sanitized filename without extension.
 * @param string[] $templates A list of template candidates, in descending order of priority.
 *
 * @return string
 */
function anima_get_custom_template_canvas_path( string $template, string $type, array $templates ): string {
	$template_path = wp_normalize_path( $template );
	$template_canvas_suffix = '/template-canvas.php';
	$template_canvas_suffix_length = strlen( $template_canvas_suffix );

	$is_core_template_canvas = $template_path === wp_normalize_path( ABSPATH . WPINC . $template_canvas_suffix );
	$is_gutenberg_template_canvas = false;

	if ( function_exists( 'gutenberg_dir_path' ) ) {
		$gutenberg_dir = wp_normalize_path( untrailingslashit( gutenberg_dir_path() ) ) . '/';
		$is_gutenberg_template_canvas = strpos( $template_path, $gutenberg_dir ) === 0
			&& substr( $template_path, -$template_canvas_suffix_length ) === $template_canvas_suffix;
	}

	// If the template location logic determined to use the template canvas (core or Gutenberg plugin), we have work to do.
	// Otherwise, do not touch the selected template.
	if ( $is_core_template_canvas || $is_gutenberg_template_canvas ) {
		return get_theme_file_path( 'inc/fse/template-canvas.php' );
	}

	return $template;
}

/**
 * Adds necessary filters to use our custom template canvas instead of core one.
 *
 * Inspired by @see _add_template_loader_filters()
 *
 * @access private
 */
function _anima_add_template_loader_filters() {
	$template_types = array_keys( get_default_block_template_types() );
	foreach ( $template_types as $template_type ) {
		/**
		 * Use a higher priority than 20, since the core uses that, and we want to come latter then that.
		 * @see _add_template_loader_filters()
		 */
		add_filter(
			str_replace( '-', '', $template_type ) . '_template',
			'anima_get_custom_template_canvas_path',
			99, 3
		);
	}
}
add_action( 'wp_loaded', '_anima_add_template_loader_filters' );

/**
 * Open the main page wrapper.
 *
 * Use a ridiculously big priority to be sure we get there last,
 * thus being fired closest to the beginning of template_html.
 */
add_action( 'anima/template_html:before', function() { ?>

<div id="page">

	<?php
	do_action( 'anima/header:before', 'main' );
}, 999999 );

/**
 * Close the main page wrapper.
 *
 * Use a ridiculously small priority to be sure we get there first,
 * thus being fired closest to the end of template_html.
 */
add_action( 'anima/template_html:after', function() {
    /**
     * anima/footer:after hook.
     *
     * @hooked anima_output_search_overlay() - 10 (outputs search overlay markup)
     */
    do_action( 'anima/footer:after' ); ?>

</div><!-- #page -->
<?php
}, -1 );
