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

$header_classes = array(
	'novablocks-header',
	'novablocks-header--main',
	'novablocks-header-shadow',
	'novablocks-header-background',
	'novablocks-header--legacy',
	'alignfull'
);

$header_row_classes = array(
	'novablocks-header-row',
	'novablocks-header-background',
	'wp-block-novablocks-header-row',
	'sm-light',
    'sm-palette-1',
    'sm-variation-1',
	'alignfull',
);

$header_row_style = '--novablocks-block-top-spacing: 0; --novablocks-block-bottom-spacing: 0; --novablocks-emphasis-top-spacing: 1; --novablocks-emphasis-bottom-spacing: 1';
?>

<header id="masthead" class="<?php echo esc_attr( join( ' ', $header_classes ) ); ?>" <?php echo $sticky_attribute; ?>>
    <div class="novablocks-header__inner-container">
        <div
                class="<?php echo esc_attr( join( ' ', $header_row_classes ) ); ?>"
                style="<?php echo esc_attr( $header_row_style ); ?>"
        >
            <div class="novablocks-header-row__inner-container">
                <div class="wp-block alignfull">
                    <div class="novablocks-navigation wp-block-novablocks-navigation novablocks-navigation--secondary">
		                <?php wp_nav_menu( array(
			                'container'      => false,
			                'theme_location' => 'secondary',
			                'menu_id'        => 'secondary-menu',
			                'fallback_cb'    => false,
		                ) ); ?>
                    </div><!-- #site-navigation -->
	                <?php get_template_part( 'template-parts/site-branding' ); ?>
                    <div class="wp-block-novablocks-navigation novablocks-navigation novablocks-navigation--primary">
		                <?php wp_nav_menu( array(
			                'container'      => false,
			                'theme_location' => 'primary',
			                'menu_id'        => 'primary-menu',
			                'fallback_cb'    => false,
		                ) ); ?>
                    </div><!-- #site-navigation -->
                </div>
            </div>
        </div>
    </div>
</header>
