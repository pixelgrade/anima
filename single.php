<?php
/**
 * The template for displaying all single posts
 *
 * @link https://developer.wordpress.org/themes/basics/template-hierarchy/#single-post
 *
 * @package Rosa2
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}

$article_block_navigation =
	'<!-- wp:novablocks/layout {"layout":"sidebar-right"} -->' .
	'<!-- wp:novablocks/layout-area {"className":"novablocks-content article-navigation"} -->' .
	rosa2_get_post_navigation_markup().
	'<!-- /wp:novablocks/layout-area -->' .
	'<!-- /wp:novablocks/layout -->';

get_header(); ?>

	<div id="primary" class="content-area">
		<main id="main" class="site-main">
			<?php
			while ( have_posts() ) : the_post();

				get_template_part( 'template-parts/content-single', rosa2_get_image_aspect_ratio_type( get_post_thumbnail_id( $post ), 'landscape' ) ); ?>

				<?php echo do_blocks( $article_block_navigation ); ?>

            <div class="novablocks-layout article-comments">
                <div class="wp-block-novablocks-layout-area novablocks-content alignwide break-right">
                    <?php
                        // If comments are open or we have at least one comment, load up the comment template.
                        if ( comments_open() || get_comments_number() ) {
                            comments_template();
                        }

                    endwhile; // End of the loop.
                    ?>
                </div>
            </div>

		</main><!-- #main -->
	</div><!-- #primary -->

<?php
get_footer();
