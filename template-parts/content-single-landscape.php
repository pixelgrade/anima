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

$article_header_block =
	'<!-- wp:novablocks/sidecar -->' .
	'<!-- wp:novablocks/sidecar-area {"className":"novablocks-content article-header"} -->' .
	'<div class="article-header__wrapper">'.
	rosa2_get_meta_template_part().
	'<h1 class="entry-title">' . get_the_title() . '</h1>'.
    '<div class="header-dropcap">' . esc_html( substr( get_the_title(), 0, 1 ) ) . '</div>' .
	'</div>'.
	'<!-- /wp:novablocks/sidecar-area -->' .
	'<!-- /wp:novablocks/sidecar -->';

$article_content_block =
	'<!-- wp:novablocks/sidecar {"layout":"sidebar-right"} -->' .
	'<!-- wp:novablocks/sidecar-area {"className":"novablocks-content entry-content"} -->' .
	rosa2_get_thumbnail_markup().
	rosa2_get_content_markup().
	rosa2_get_post_navigation_markup().
    '<!-- wp:novablocks/post-comments --><!-- /wp:novablocks/post-comments -->' .
	'<!-- /wp:novablocks/sidecar-area -->' .
	'<!-- wp:novablocks/sidecar-area {"className":"novablocks-sidebar"} -->' .
	rosa2_get_sidebar_markup() .
	'<!-- /wp:novablocks/sidecar-area -->' .
	'<!-- /wp:novablocks/sidecar -->';

?>

<article id="post-<?php the_ID(); ?>" <?php post_class('article--is-landscape'); ?>>

    <?php

    echo do_blocks( $article_header_block );
    echo do_blocks( $article_content_block );

    ?>

</article><!-- #post-<?php the_ID(); ?> -->
