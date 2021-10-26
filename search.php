<?php
/**
 * The template for displaying search pages
 *
 * @link https://developer.wordpress.org/themes/basics/template-hierarchy/
 *
 * @package Anima
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}

get_header(); ?>

    <div id="primary" class="content-area">
        <main id="main" class="site-main">

	        <?php echo do_blocks(
		        '<!-- wp:novablocks/sidecar { "className":"alignwide", "sidebarWidth":"medium", "lastItemIsSticky":false} -->' .
		        '<!-- wp:novablocks/sidecar-area {"className":"novablocks-content entry-content"} -->' .
		        anima_get_search_content_markup() .
		        '<!-- /wp:novablocks/sidecar-area -->' .
		        '<!-- /wp:novablocks/sidecar -->'
	        ); ?>

        </main><!-- #main -->
    </div><!-- #primary -->

<?php
get_footer();
