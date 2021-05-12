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

$article_thumbnail_type = rosa2_get_image_aspect_ratio_type( get_post_thumbnail_id( $post ), 'landscape' );

$article_landscape_markup = '<!-- wp:novablocks/sidecar { "className":"alignwide", "sidebarWidth":"medium"} -->' .
                            '<!-- wp:novablocks/sidecar-area {"className":"novablocks-content"} -->' .
                            '<div class="article-header article-header--landscape alignwide">' .
                            '<div class="entry-header">' .
                            rosa2_get_meta_template_part() .
                            '<h1 class="entry-title">' . get_the_title() . '</h1>' .
                            '</div>' .
                            '</div>' .
                            '<!-- wp:novablocks/sidecar { "className":"alignwide", "sidebarWidth":"medium"} -->' .
                            '<!-- wp:novablocks/sidecar-area {"className":"novablocks-content entry-content"} -->' .
                            rosa2_get_thumbnail_markup() .
                            rosa2_get_content_markup() .
                            rosa2_get_post_navigation_markup() .
                            '<!-- wp:novablocks/post-comments --><!-- /wp:novablocks/post-comments -->' .
                            '<!-- /wp:novablocks/sidecar-area -->' .
                            '<!-- wp:novablocks/sidecar-area {"className":"novablocks-sidebar"} -->' .
                            rosa2_get_sidebar_markup() .
                            '<!-- /wp:novablocks/sidecar-area -->' .
                            '<!-- /wp:novablocks/sidecar -->' .
                            '<!-- /wp:novablocks/sidecar-area -->' .
                            '<!-- /wp:novablocks/sidecar -->';

$article_portrait_markup = '<!-- wp:novablocks/sidecar { "className":"alignwide", "sidebarWidth":"medium"} -->' .
                           '<!-- wp:novablocks/sidecar-area {"className":"novablocks-content"} -->' .
                           '<div class="article-header article-header--portrait alignwide">' .
                           rosa2_get_thumbnail_markup() .
                           '<div>' .
                           '<div class="entry-header">' .
                           rosa2_get_meta_template_part() .
                           '<h1 class="entry-title">' . get_the_title() . '</h1>' .
                           '</div>' .
                           '<p class="post-excerpt">' . get_the_excerpt() . '</p>' .
                           '</div>' .
                           '</div>' .
                           '<!-- wp:novablocks/sidecar { "className":"alignwide", "sidebarWidth":"medium"} -->' .
                           '<!-- wp:novablocks/sidecar-area {"className":"novablocks-content entry-content"} -->' .
                           rosa2_get_content_markup() .
                           rosa2_get_post_navigation_markup() .
                           '<!-- wp:novablocks/post-comments --><!-- /wp:novablocks/post-comments -->' .
                           '<!-- /wp:novablocks/sidecar-area -->' .
                           '<!-- wp:novablocks/sidecar-area {"className":"novablocks-sidebar"} -->' .
                           rosa2_get_sidebar_markup() .
                           '<!-- /wp:novablocks/sidecar-area -->' .
                           '<!-- /wp:novablocks/sidecar -->' .
                           '<!-- /wp:novablocks/sidecar-area -->' .
                           '<!-- /wp:novablocks/sidecar -->';

$article_markup = $article_landscape_markup;

if ( $article_thumbnail_type === 'portrait' ) {
	$article_markup = $article_portrait_markup;
}

?>

<article id="post-<?php the_ID(); ?>">

	<?php  echo do_blocks( $article_markup ); ?>

</article><!-- #post-<?php the_ID(); ?> -->
