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
