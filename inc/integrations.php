<?php

/**
 * Load WooCommerce compatibility file.
 */

if ( class_exists( 'WooCommerce' ) ) {
	require get_template_directory() . '/inc/integrations/woocommerce.php';
}
