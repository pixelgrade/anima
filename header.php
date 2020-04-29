<?php
/**
 * The template for displaying the header.
 *
 * @link https://developer.wordpress.org/themes/basics/template-hierarchy/
 *
 * @package Rosa2
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
} ?><!doctype html>
<html <?php language_attributes(); ?> id="html">
<head>
    <meta charset="<?php bloginfo( 'charset' ); ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="profile" href="https://gmpg.org/xfn/11">
	<?php wp_head(); ?>
</head>
<body <?php body_class(); ?> id="body">
<?php wp_body_open(); ?>

<div id="page" class="site">
    <a class="skip-link screen-reader-text" href="#content"><?php esc_html_e( 'Skip to content', '__theme_txtd' ); ?></a>

	<?php do_action( 'rosa_before_header', 'main' ); ?>

    <?php if ( function_exists( 'block_areas' ) ) { ?>
	    <?php if ( ! class_exists( 'woocommerce' ) || ! ( is_cart() || is_checkout() ) ) { ?>
		    <?php if ( rosa2_block_area_has_blocks( 'promo-bar' ) ) { ?>
                <div class="promo-bar js-promo-bar">
				    <?php block_areas()->render( 'promo-bar' ); ?>
                </div>
		    <?php } ?>
	    <?php } ?>
    <?php } ?>

    <?php if ( ! class_exists( 'woocommerce' ) || ! is_checkout() ) {
        if ( function_exists( 'block_areas' ) ) {
            if ( rosa2_block_area_has_blocks( 'header' ) ) {
                block_areas()->render( 'header' );
            } else {
                get_template_part( 'template-parts/site-header' );
            }
        } else {
            get_template_part( 'template-parts/site-header' );
        }
    } ?>

    <div id="content" class="site-content">

