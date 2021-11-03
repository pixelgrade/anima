<?php
/**
 * Template part for displaying page content in page.php
 *
 * @link https://developer.wordpress.org/themes/basics/template-hierarchy/
 *
 * @package Anima
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}

$page_markup =
	'<!-- wp:novablocks/sidecar { "sidebarPosition":"none" } -->' .
	'<!-- wp:novablocks/sidecar-area { "areaName":"content" } -->' .
	anima_get_content_markup().
	'<!-- wp:novablocks/post-comments --><!-- /wp:novablocks/post-comments -->' .
	'<!-- /wp:novablocks/sidecar-area -->' .
	'<!-- /wp:novablocks/sidecar -->';
?>

<article id="post-<?php the_ID(); ?>" <?php post_class(); ?>>
    <?php echo do_blocks( $page_markup );?>
</article><!-- #post-<?php the_ID(); ?> -->
