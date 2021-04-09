<?php
/**
 * Template part for displaying Article Navigation
 *
 * @link https://developer.wordpress.org/themes/basics/template-hierarchy/
 *
 * @package Rosa2
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}

$article_block_navigation =
	'<!-- wp:novablocks/sidecar {"layout":"sidebar-right"} -->' .
	'<!-- wp:novablocks/sidecar-area {"className":"novablocks-content"} -->' .
	rosa2_get_post_navigation_markup().
	'<!-- /wp:novablocks/sidecar-area -->' .
	'<!-- /wp:novablocks/sidecar -->';

?>

<div class="article-navigation">
	<?php echo do_blocks( $article_block_navigation ); ?>
</div>
