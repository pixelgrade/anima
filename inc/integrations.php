<?php
/**
 * Require files that deal with various plugins integrations.
 *
 * @package Rosa2
 */

// If this file is called directly, abort.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Load NovaBlocks integration for this theme
 */
require_once trailingslashit( get_template_directory() ) . 'inc/integrations/novablocks.php';

/**
 * Load Customify integration for this theme.
 */
require_once trailingslashit( get_template_directory() ) . 'inc/integrations/customify/customify.php';

/**
 * Load Jetpack integration for this theme.
 */
require_once trailingslashit( get_template_directory() ) . 'inc/integrations/jetpack.php';

/**
 * Load Pixelgrade Care compatibility file.
 * http://pixelgrade.com/
 */
require_once trailingslashit( get_template_directory() ) . 'inc/integrations/pixelgrade-care.php';

/**
 * Load WooCommerce integration for this theme
 * This has to be loaded before inc/admin/admin.php
 */
require_once trailingslashit( get_template_directory() ) . 'inc/integrations/woocommerce.php';

/**
 * Admin Dashboard logic.
 */
require_once trailingslashit( get_template_directory() ) . 'inc/admin/admin.php'; // phpcs:ignore
