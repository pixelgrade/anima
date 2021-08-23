<?php
/**
 * The template for displaying comments.
 *
 * @link https://developer.wordpress.org/themes/basics/template-hierarchy/
 *
 * @package Anima
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}

/*
 * If the current post is protected by a password and
 * the visitor has not yet entered the password we will
 * return early without loading the comments.
 */
if ( post_password_required() ) {
	return;
} ?>

<div class="comments-area">
    <?php echo do_blocks( '<!-- wp:novablocks/post-comments --><!-- /wp:novablocks/post-comments -->' ); ?>
</div>
