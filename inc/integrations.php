<?php
/**
 * Require files that deal with various plugins integrations.
 *
 * @package Anima
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
 * Load Style Manager integration for this theme.
 */
if ( class_exists( 'Pixelgrade\StyleManager\Plugin' ) ) {
	require_once trailingslashit( get_template_directory() ) . 'inc/integrations/style-manager/style-manager.php';
}

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
