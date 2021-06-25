<?php
/**
 * Template part for displaying the site header.
 *
 * @link https://developer.wordpress.org/themes/basics/template-hierarchy/
 *
 * @package Rosa2
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}

get_template_part( 'template-parts/menu-toggle' );

$site_header_is_sticky = pixelgrade_option( 'header_position', 'sticky' ) === 'sticky';
$sticky_attribute = $site_header_is_sticky ? 'data-sticky=true' : '';
?>

<header id="masthead" class="novablocks-header novablocks-header--main novablocks-header--logo-center" <?php echo $sticky_attribute; ?>>
    <div class="novablocks-header__wrapper">
        <div class="novablocks-header__inner-container">
            <div class="novablocks-header__content alignfull">
                <div class="wp-block-novablocks-header-row novablocks-header__row novablocks-header__row--primary">
                    <nav class="wp-block-novablocks-navigation novablocks-navigation novablocks-navigation--secondary">
                        <?php wp_nav_menu( array(
                            'container'      => false,
                            'theme_location' => 'secondary',
                            'menu_id'        => 'secondary-menu',
                            'fallback_cb'    => false,
                        ) ); ?>
                    </nav><!-- #site-navigation -->

                    <?php get_template_part( 'template-parts/site-branding' ); ?>

                    <nav class="wp-block-novablocks-navigation novablocks-navigation novablocks-navigation--primary">
                        <?php wp_nav_menu( array(
                            'container'      => false,
                            'theme_location' => 'primary',
                            'menu_id'        => 'primary-menu',
                            'fallback_cb'    => false,
                        ) ); ?>
                    </nav><!-- #site-navigation -->
                </div>
            </div>
        </div>
    </div>
</header>
