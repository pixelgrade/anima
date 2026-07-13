<?php
/**
 * Contract: free Anima LT exposes Collage as a block-local Nova recipe.
 */

$GLOBALS['anima_recipe_filters'] = [];

if ( ! defined( 'ABSPATH' ) ) {
	define( 'ABSPATH', dirname( __DIR__ ) . '/' );
}

function add_action() { return true; }
function add_filter( $hook, $callback, $priority = 10, $accepted_args = 1 ) {
	$GLOBALS['anima_recipe_filters'][ $hook ][] = [ $callback, $priority, $accepted_args ];
	return true;
}
function __( $value ) { return $value; }
function pixelgrade_option( $name, $default = null ) { return $default; }
function get_option( $name, $default = false ) {
	return 'sm_card_metadata_style' === $name ? 'accent-label' : $default;
}

require_once dirname( __DIR__ ) . '/inc/integrations/novablocks.php';

if ( empty( $GLOBALS['anima_recipe_filters']['novablocks_collection_layout_recipes'] ) ) {
	throw new RuntimeException( 'Expected Anima to register a server-authoritative Nova recipe.' );
}

$foreign = [ 'id' => 'foreign-recipe' ];
$recipes = anima_register_collection_layout_recipes( [ $foreign ] );
$recipe = $recipes[1] ?? [];

if ( $foreign !== ( $recipes[0] ?? null ) ) {
	throw new RuntimeException( 'Existing recipe providers must be preserved.' );
}

if ( 'anima-collage' !== ( $recipe['id'] ?? '' )
	|| 'Anima Collage' !== ( $recipe['label'] ?? '' )
	|| 'masonry' !== ( $recipe['baseLayout'] ?? '' )
	|| 'masonry' !== ( $recipe['thumbnail'] ?? '' ) ) {
	throw new RuntimeException( 'Expected the stable Anima Collage Masonry recipe.' );
}

$defaults = $recipe['defaults'] ?? [];
if ( 4 !== ( $defaults['columns'] ?? null )
	|| 350 !== ( $defaults['columnsFitMinWidth'] ?? null )
	|| 38 !== ( $defaults['gridGap'] ?? null )
	|| 'original' !== ( $defaults['thumbnailAspectRatioString'] ?? '' )
	|| 'reveal' !== ( $defaults['cardHoverEffect'] ?? '' )
	|| 'standard' !== ( $defaults['headerIntegration'] ?? '' ) ) {
	throw new RuntimeException( 'Expected Collage selection defaults without permanent overrides.' );
}

$capabilities = $recipe['capabilities'] ?? [];
foreach ( [ 'itemsGap', 'fitColumns', 'aspectRatio', 'hover', 'scrolling', 'pile3d', 'headerIntegration', 'linkedPostMetadata', 'readMoreAffordance' ] as $capability ) {
	if ( true !== ( $capabilities[ $capability ] ?? null ) ) {
		throw new RuntimeException( 'Missing Collage capability: ' . $capability );
	}
}

if ( array_key_exists( 'gateId', $recipe ) || array_key_exists( 'entitlement', $recipe ) ) {
	throw new RuntimeException( 'Anima Collage must be part of free Anima LT.' );
}

$theme_root = dirname( __DIR__ );
foreach ( [
	'inc/integrations/novablocks.php',
	'inc/template-functions.php',
	'inc/integrations/style-manager/tweak-board.php',
] as $relative_file ) {
	$source = file_get_contents( $theme_root . '/' . $relative_file );
	if ( false !== strpos( $source, 'sm_collection_collage_grid' ) ) {
		throw new RuntimeException( 'Collage must not depend on a global Style Manager option: ' . $relative_file );
	}
}

$integration_source = file_get_contents( $theme_root . '/inc/integrations/novablocks.php' );
if ( false !== strpos( $integration_source, 'anima_output_brand_source_color_css_var' )
	|| false !== strpos( $integration_source, '--anima-brand-source-color' ) ) {
	throw new RuntimeException( 'Collage must consume the existing Style Manager token chain.' );
}

foreach ( [
	'anima_get_collection_header_brick_markup',
	'anima_get_collection_header_leading_item',
	'anima_add_collection_header_leading_item',
] as $legacy_provider ) {
	if ( false !== strpos( $integration_source, $legacy_provider ) ) {
		throw new RuntimeException( 'Generated Header provider must be removed: ' . $legacy_provider );
	}
}

echo "Anima collection layout recipe contract OK\n";
