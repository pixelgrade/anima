<?php
/**
 * The template for displaying archive pages
 *
 * @link https://developer.wordpress.org/themes/basics/template-hierarchy/
 *
 * @package Rosa2
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}

get_header();

?>

    <div id="primary" class="content-area">
        <main id="main" class="site-main">

            <?php echo do_blocks(
	            '<!-- wp:novablocks/sidecar { "className":"alignwide", "sidebarWidth":"medium", "lastItemIsSticky":true} -->' .
	            '<!-- wp:novablocks/sidecar-area {"className":"novablocks-content entry-content"} -->' .
	            rosa2_get_archive_content() .
	            '<!-- /wp:novablocks/sidecar-area -->' .
	            '<!-- /wp:novablocks/sidecar -->'
            ); ?>

        </main><!-- #main -->
    </div><!-- #primary -->

<?php
get_footer();
