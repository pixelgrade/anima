<?php
/**
 * Rosa2 Theme admin dashboard logic.
 *
 * @package Rosa2
 */

// If this file is called directly, abort.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

function rosa2_admin_setup() {

	/**
	 * Load and initialize the Customizer logic.
	 */
	require_once 'class-admin-customize.php'; // phpcs:ignore

	/**
	 * Load and initialize the nav menus logic.
	 */
	require_once 'class-admin-nav-menus.php'; // phpcs:ignore

	/**
	 * Load and initialize Pixelgrade Care notice logic.
	 */
	if ( ! class_exists( 'PixelgradeCare_Install_Notice' ) ) {
		require_once 'pixcare-notice/class-notice.php'; // phpcs:ignore
	}
	PixelgradeCare_Install_Notice::init();
}
add_action( 'after_setup_theme', 'rosa2_admin_setup', 99 );
