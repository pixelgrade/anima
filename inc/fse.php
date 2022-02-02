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

/**
 * Get our custom template canvas file path, depending on the type of template being queried.
 *
 * Since with FSE we have little room in terms of hooks, we need to make do to bring back some of our hooks.
 *
 * The file wp-includes/template-canvas.php is the default entry point for rendering block-templates (wp_templates).
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
	// If the template location logic determined to use the template canvas, we have work to do.
	// Otherwise, do not touch the selected template.
	if ( $template === ABSPATH . WPINC . '/template-canvas.php' ) {
		return get_theme_file_path( 'inc/fse/template-canvas.php' );
	}

	return $template;
}
add_filter( '404_template', 'anima_get_custom_template_canvas_path', 10, 3 );
add_filter( 'archive_template', 'anima_get_custom_template_canvas_path', 10, 3 );
add_filter( 'attachment_template', 'anima_get_custom_template_canvas_path', 10, 3 );
add_filter( 'author_template', 'anima_get_custom_template_canvas_path', 10, 3 );
add_filter( 'category_template', 'anima_get_custom_template_canvas_path', 10, 3 );
add_filter( 'date_template', 'anima_get_custom_template_canvas_path', 10, 3 );
add_filter( 'embed_template', 'anima_get_custom_template_canvas_path', 10, 3 );
add_filter( 'frontpage_template', 'anima_get_custom_template_canvas_path', 10, 3 );
add_filter( 'home_template', 'anima_get_custom_template_canvas_path', 10, 3 );
add_filter( 'index_template', 'anima_get_custom_template_canvas_path', 10, 3 );
add_filter( 'page_template', 'anima_get_custom_template_canvas_path', 10, 3 );
add_filter( 'paged_template', 'anima_get_custom_template_canvas_path', 10, 3 );
add_filter( 'privacypolicy_template', 'anima_get_custom_template_canvas_path', 10, 3 );
add_filter( 'search_template', 'anima_get_custom_template_canvas_path', 10, 3 );
add_filter( 'single_template', 'anima_get_custom_template_canvas_path', 10, 3 );
add_filter( 'singular_template', 'anima_get_custom_template_canvas_path', 10, 3 );
add_filter( 'tag_template', 'anima_get_custom_template_canvas_path', 10, 3 );
add_filter( 'taxonomy_template', 'anima_get_custom_template_canvas_path', 10, 3 );

/**
 * Open the main page wrapper.
 */
add_action( 'anima_before_template_html', function() { ?>

<div id="page" <?php anima_page_class() ?>>

	<?php
	do_action( 'anima_before_header', 'main' );
}, 10 );

/**
 * Close the main page wrapper.
 *
 * Use a ridiculously small priority to be sure we get there first.
 */
add_action( 'anima_after_template_html', function() {
    /**
     * anima_after_footer hook.
     *
     * @hooked anima_output_search_overlay() - 10 (outputs search overlay markup)
     */
    do_action( 'anima_after_footer' ); ?>

</div><!-- #page -->
<?php
}, 10 );
