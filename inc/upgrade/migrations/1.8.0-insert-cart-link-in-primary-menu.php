<?php

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

// We will only add the menu item to the primary location menu since that is where Rosa2 previously outputted the cart menu item.
if ( has_nav_menu( 'primary ' ) ) {
	$locations = get_nav_menu_locations();
	$menu = wp_get_nav_menu_object( $locations[ 'primary' ] );

	// Add a menu item at the end.
	$menu_item_db_id = wp_update_nav_menu_item( $menu->term_id, 0, [
		'menu-item-type'        => 'custom-pxg',
		'menu-item-title'   => esc_html__( 'Cart', '__theme_txtd' ),
		'menu-item-classes' => 'menu-item--cart',
		'menu-item-attr-title' => esc_html__( 'Toggle visibility of cart panel', '__theme_txtd' ),
		'menu-item-url'     => esc_url( get_permalink( wc_get_page_id( 'cart' ) ) ),
		'menu-item-status'  => 'publish',
	] );

	// Set the visual style to icon, the same as it was previously in Rosa 2.
	update_post_meta( $menu_item_db_id, '_menu_item_visual_style', 'icon' );
}
