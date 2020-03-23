<?php
/**
 * Rosa2 Theme admin dashboard logic.
 *
 * @package Rosa2
 */

function rosa2_admin_setup() {

	/**
	 * Load and initialize Pixelgrade Care notice logic.
	 */
	require_once 'pixcare-notice/class-notice.php'; // phpcs:ignore
	PixelgradeCare_Install_Notice::init();
}
add_action( 'after_setup_theme', 'rosa2_admin_setup' );
