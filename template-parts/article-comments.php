<?php
/**
 * Template part for displaying Article Comments
 *
 * @link https://developer.wordpress.org/themes/basics/template-hierarchy/
 *
 * @package Anima
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}
?>

<div class="novablocks-layout article-comments">
    <div class="wp-block-novablocks-layout-area novablocks-content">
        <?php
            // If comments are open or we have at least one comment, load up the comment template.
            if ( comments_open() || get_comments_number() ) {
                comments_template();
            } ?>
    </div>
</div>
