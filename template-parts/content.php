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

/*
 * Default Blog Layout Block Attributes
 */

$default_block_attributes = '{
    "cardLayout": "'. $card_layout_direction . '" ,
    "showCollectionTitle":false,
    "showCollectionSubtitle":false,
    "showMeta":true,
    "postsToShow":1,
    "loadingMode":"manual",
    "specificPosts":[' . get_the_ID() . ' ],
    "layoutStyle":"classic",
    "thumbnailAspectRatio":40,
    "contentPadding":100,
    "layoutGutter":100,
    "paletteVariation":2,
    "contentAreaWidth":45
}';

$block ='<!-- wp:novablocks/supernova ' . $default_block_attributes . ' -->';
?>

<?php echo do_blocks($block); ?>
