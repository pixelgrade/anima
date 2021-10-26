<?php
/**
 * Template part for displaying the posts loop.
 *
 * @link https://developer.wordpress.org/themes/basics/template-hierarchy/
 *
 * @package Anima
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}

global $wp_query;

/*
 * Get post from current query.
 */
$posts_to_show = $wp_query->posts;

/*
 * Get number of posts in current query.
 */
$number_of_posts_to_show = count( $posts_to_show );

$posts_to_show_ids = array();

foreach ( $posts_to_show as $post ) {
	$posts_to_show_ids[] = $post->ID;
}

$blog_layout_style = pixelgrade_option( 'sm_blog_layout_style', 'rosa2' );

$blocks = anima_get_archive_blocks( $blog_layout_style, $number_of_posts_to_show, $posts_to_show_ids );

echo do_blocks( $blocks );
