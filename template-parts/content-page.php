<?php
/**
 * Template part for displaying page content in page.php
 *
 * @link https://developer.wordpress.org/themes/basics/template-hierarchy/
 *
 * @package Rosa2
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}

$page_content_block =
	'<!-- wp:novablocks/layout {"layout":"no-sidebar"} -->' .
	'<!-- wp:novablocks/layout-area {"className":"novablocks-content entry-content"} -->' .
	rosa2_get_content_markup().
	'<!-- /wp:novablocks/layout-area -->' .
	'<!-- /wp:novablocks/layout -->';
?>

<article id="post-<?php the_ID(); ?>" <?php post_class(); ?>>

  <?php echo do_blocks( $page_content_block );?>

</article><!-- #post-<?php the_ID(); ?> -->
