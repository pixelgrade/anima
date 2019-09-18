<?php

/**
 * Load WooCommerce compatibility file.
 */
if ( class_exists( 'WooCommerce' ) ) {
	require get_template_directory() . '/inc/integrations/woocommerce.php';
}

/**
 * Load NovaBlocks integration for this theme
 */
require get_template_directory() . '/inc/integrations/novablocks.php';

/**
 * Load Customify integration for this theme.
 */
require get_template_directory() . '/inc/integrations/customify.php';
require get_template_directory() . '/inc/integrations/customify_extras.php';

/**
 * Load Jetpack integration for this theme.
 */
require get_template_directory() . '/inc/integrations/jetpack.php';
