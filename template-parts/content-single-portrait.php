<?php
/**
 * Template part for displaying single posts with Portrait Images
 *
 * @link https://developer.wordpress.org/themes/basics/template-hierarchy/
 *
 * @package Rosa2
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}

$article_header_block =
	'<!-- wp:novablocks/layout {"layout":"sidebar-left", "className":"alignwide"} -->' .
	'<!-- wp:novablocks/layout-area {"className":"novablocks-sidebar article-thumbnail half-block-left"} -->' .
	rosa2_get_thumbnail_markup().
	'<!-- /wp:novablocks/layout-area -->' .
	'<!-- wp:novablocks/layout-area {"className":"article-header half-block-right"} -->' .
	'<div class="article-header__wrapper">'.
	rosa2_get_meta_template_part().
	'<h1 class="entry-title">' . get_the_title() . '</h1>'.
	'</div>'.
	'<p class="post-excerpt">' . get_the_excerpt() .'</p>'.
	'<!-- /wp:novablocks/layout-area -->' .
	'<!-- /wp:novablocks/layout -->';

$article_content_block =
	'<!-- wp:novablocks/layout {"layout":"sidebar-right"} -->' .
	'<!-- wp:novablocks/layout-area {"className":"novablocks-content entry-content"} -->' .
	rosa2_get_content_markup().
	'<!-- /wp:novablocks/layout-area -->' .
	'<!-- wp:novablocks/layout-area {"className":" novablocks-sidebar novablocks-sidebar--right"} -->' .
	rosa2_get_sidebar_markup() .
	'<!-- /wp:novablocks/layout-area -->' .
	'<!-- /wp:novablocks/layout -->';

?>

<article id="post-<?php the_ID(); ?>" <?php post_class('article--is-portrait'); ?>>
    <div class="entry-header">
	    <?php echo do_blocks( $article_header_block ); ?>
    </div>
	<?php echo do_blocks( $article_content_block ); ?>

</article><!-- #post-<?php the_ID(); ?> -->
