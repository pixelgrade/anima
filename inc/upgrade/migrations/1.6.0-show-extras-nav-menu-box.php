<?php

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$user_hidden_nav_menus_boxes = get_user_option( 'metaboxhidden_nav-menus' );

// Make sure that 'pxg-extras' is not part of the hidden nav menus boxes.
if ( is_array( $user_hidden_nav_menus_boxes ) && false !== $key = array_search( 'pxg-extras', $user_hidden_nav_menus_boxes ) ) {
	unset( $user_hidden_nav_menus_boxes[ $key ] );

	update_user_option( get_current_user_id(), 'metaboxhidden_nav-menus', $user_hidden_nav_menus_boxes, true );
}
