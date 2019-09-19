<?php
/**
 * Require files that deal with various plugins integrations.
 *
 * @package Rosa2
 */

/**
 * Load WooCommerce compatibility file.
 */
if ( function_exists( 'WC' ) ) {
	require_once trailingslashit( get_template_directory() ) . 'inc/integrations/woocommerce.php';
}

/**
 * Load NovaBlocks integration for this theme
 */
require_once trailingslashit( get_template_directory() ) . 'inc/integrations/novablocks.php';

/**
 * Load Customify integration for this theme.
 */
require_once trailingslashit( get_template_directory() ) . 'inc/integrations/customify.php';
require_once trailingslashit( get_template_directory() ) . 'inc/integrations/customify_extras.php';

/**
 * Load Jetpack integration for this theme.
 */
require_once trailingslashit( get_template_directory() ) . 'inc/integrations/jetpack.php';

/**
 * Load Pixelgrade Care compatibility file.
 * http://pixelgrade.com/
 */
require_once trailingslashit( get_template_directory() ) . 'inc/integrations/pixelgrade-care.php';
