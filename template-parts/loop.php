<?php
/**
 * Template part for displaying the posts loop.
 *
 * @link https://developer.wordpress.org/themes/basics/template-hierarchy/
 *
 * @package Rosa2
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}

global $wp_query;

/*
 * Get post from current query.
 */
$posts_to_show = $wp_query -> posts;

/*
 * Get number of posts in current query.
 */
$number_of_posts_to_show = count($posts_to_show);

$posts_to_show_ids = array();

foreach( $posts_to_show as $post) {
	$posts_to_show_ids[] = $post -> ID;
}

$blog_layout_style = pixelgrade_option( 'sm_blog_layout_style', 'rosa2' );

$blog_layout_attributes = get_blog_layout_attributes( $blog_layout_style, $number_of_posts_to_show, $posts_to_show_ids);

$block ='<!-- wp:novablocks/supernova ' . $blog_layout_attributes . ' -->';

echo do_blocks($block);
