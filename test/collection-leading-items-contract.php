<?php
/**
 * Regression contract: Anima never injects Header markup into Nova layouts.
 */

if ( ! defined( 'ABSPATH' ) ) {
	define( 'ABSPATH', dirname( __DIR__ ) . '/' );
}

$GLOBALS['anima_test_filters'] = [];

function add_action() { return true; }
function add_filter( $hook, $callback, $priority = 10, $accepted_args = 1 ) {
	$GLOBALS['anima_test_filters'][ $hook ][] = [ $callback, $priority, $accepted_args ];
	return true;
}
function __( $value ) { return $value; }
function pixelgrade_option( $name, $default = null ) { return $default; }

require_once dirname( __DIR__ ) . '/inc/integrations/novablocks.php';

if ( ! empty( $GLOBALS['anima_test_filters']['novablocks/collection_leading_items'] ) ) {
	throw new RuntimeException( 'Anima must not provide Header or archive markup through collection leading items.' );
}

$source = file_get_contents( dirname( __DIR__ ) . '/inc/integrations/novablocks.php' );
foreach ( [ 'get_custom_logo', 'wp_nav_menu', 'c-header-brick', 'anima-site-header' ] as $generated_header_signal ) {
	if ( false !== strpos( $source, $generated_header_signal ) ) {
		throw new RuntimeException( 'Generated Header signal remains: ' . $generated_header_signal );
	}
}

$recipes = anima_register_collection_layout_recipes( [] );
if ( 'anima-collage' !== ( $recipes[0]['id'] ?? '' ) ) {
	throw new RuntimeException( 'The removed Header provider must be replaced by the block-local Collage recipe.' );
}

echo "Anima generated collection leading items absent OK\n";
