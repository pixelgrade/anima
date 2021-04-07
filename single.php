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
	'<!-- wp:novablocks/layout-area {"className":"novablocks-content"} -->' .
	rosa2_get_post_navigation_markup().
	'<!-- /wp:novablocks/layout-area -->' .
	'<!-- /wp:novablocks/layout -->';

get_header(); ?>

	<div id="primary" class="content-area">
		<main id="main" class="site-main">
			<?php
			    while ( have_posts() ) {
				    the_post();
				    get_template_part( 'template-parts/content-single', rosa2_get_image_aspect_ratio_type( get_post_thumbnail_id( $post ), 'landscape' ) );
                }?>

		</main><!-- #main -->
	</div><!-- #primary -->

<?php
get_footer();
