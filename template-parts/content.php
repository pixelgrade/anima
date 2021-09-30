<?php
/**
 * Template part for displaying posts
 *
 * @link https://developer.wordpress.org/themes/basics/template-hierarchy/
 *
 * @package Rosa2
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}

global $wp_query;


/**
 * We want the first post in the loop on the left,
 * the next one on the right and so on.
 * $wp_query->current_post starts at 0, not at 1.
 */
$card_layout_direction = $wp_query->current_post % 2 ? 'horizontal-reverse' : 'horizontal';

$block ='<!-- wp:novablocks/supernova {
    "cardLayout": "'. $card_layout_direction . '" ,
    "showCollectionTitle":false,
    "showCollectionSubtitle":false,
    "showMeta":true,
    "postsToShow":1,
    "loadingMode":"manual",
    "specificPosts":[' . get_the_ID() . ' ],
    "layoutStyle":"classic",
    "thumbnailAspectRatio":45,
    "contentPadding":50,
    "layoutGutter":100,
    "paletteVariation":2
} -->';
?>

<?php echo do_blocks($block); ?>
