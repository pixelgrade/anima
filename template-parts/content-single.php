<?php
/**
 * Template part for displaying single posts
 *
 * @link https://developer.wordpress.org/themes/basics/template-hierarchy/
 *
 * @package Anima
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}

$article_markup =   '<!-- wp:novablocks/sidecar { "className":"alignwide", "sidebarWidth":"medium", "lastItemIsSticky":true} -->' .
                    '<!-- wp:novablocks/sidecar-area {"className":"novablocks-content entry-content"} -->' .
                    anima_article_header() .
                    anima_get_content_markup() .
                    anima_get_post_navigation_markup() .
                    '<!-- wp:novablocks/post-comments --><!-- /wp:novablocks/post-comments -->' .
                    '<!-- /wp:novablocks/sidecar-area -->' .
                    '<!-- wp:novablocks/sidecar-area {"className":"novablocks-sidebar"} -->' .
                    anima_get_sidebar_markup() .
                    '<!-- /wp:novablocks/sidecar-area -->' .
                    '<!-- /wp:novablocks/sidecar -->';

?>

<article id="post-<?php the_ID(); ?>" <?php post_class(); ?>>

	<?php  echo do_blocks( $article_markup ); ?>

</article><!-- #post-<?php the_ID(); ?> -->
