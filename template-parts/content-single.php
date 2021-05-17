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

$article_markup =   '<!-- wp:novablocks/sidecar { "className":"alignwide", "sidebarWidth":"medium"} -->' .
                    '<!-- wp:novablocks/sidecar-area {"className":"novablocks-content entry-content"} -->' .
                    rosa2_article_header() .
                    rosa2_get_content_markup() .
                    rosa2_get_post_navigation_markup() .
                    '<!-- wp:novablocks/post-comments --><!-- /wp:novablocks/post-comments -->' .
                    '<!-- /wp:novablocks/sidecar-area -->' .
                    '<!-- wp:novablocks/sidecar-area {"className":"novablocks-sidebar"} -->' .
                    rosa2_get_sidebar_markup() .
                    '<!-- /wp:novablocks/sidecar-area -->' .
                    '<!-- /wp:novablocks/sidecar -->';

?>

<article id="post-<?php the_ID(); ?>" <?php post_class(); ?>>

	<?php  echo do_blocks( $article_markup ); ?>

</article><!-- #post-<?php the_ID(); ?> -->
