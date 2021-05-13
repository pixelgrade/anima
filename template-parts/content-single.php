<?php
/**
 * Template part for displaying single posts
 *
 * @link https://developer.wordpress.org/themes/basics/template-hierarchy/
 *
 * @package Rosa2
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}

$article_markup = '          <!-- wp:novablocks/sidecar { "className":"alignwide", "sidebarWidth":"medium"} -->' .
                            '<!-- wp:novablocks/sidecar-area {"className":"novablocks-content entry-content"} -->' .
                            '<div class="article-header article-header--landscape">' .
                            '<div class="entry-header">' .
                            rosa2_get_categories_markup() .
                            '<h1 class="entry-title">' . get_the_title() . '</h1>' .
                            '<p class="entry-excerpt">' . get_the_excerpt() . '</p>' .
                            rosa2_get_meta_template_part() .
                            '</div>' .
                            rosa2_get_thumbnail_markup() .
                            '</div>' .
                            rosa2_get_content_markup() .
                            rosa2_get_post_navigation_markup() .
                            '<!-- wp:novablocks/post-comments --><!-- /wp:novablocks/post-comments -->' .
                            '<!-- /wp:novablocks/sidecar-area -->' .
                            '<!-- wp:novablocks/sidecar-area {"className":"novablocks-sidebar"} -->' .
                            rosa2_get_sidebar_markup() .
                            '<!-- /wp:novablocks/sidecar-area -->' .
                            '<!-- /wp:novablocks/sidecar -->';

?>

<article id="post-<?php the_ID(); ?>">

	<?php  echo do_blocks( $article_markup ); ?>

</article><!-- #post-<?php the_ID(); ?> -->
