<?php
/**
 * Contract test for the wp.org Style Manager font defaults.
 *
 * Run from the theme root:
 * php test/wporg-style-manager-font-defaults.php
 */

function anima_fail_wporg_style_manager_font_defaults_test( string $message ): void {
	fwrite( STDERR, $message . PHP_EOL );
	exit( 1 );
}

if ( ! defined( 'ABSPATH' ) ) {
	define( 'ABSPATH', __DIR__ );
}

function add_filter( string $hook_name, $callback, int $priority = 10, int $accepted_args = 1 ): bool {
	return true;
}

function add_action( string $hook_name, $callback, int $priority = 10, int $accepted_args = 1 ): bool {
	return true;
}

function get_option( string $option_name, $default = false ) {
	return $GLOBALS['anima_test_options'][ $option_name ] ?? $default;
}

function delete_option( string $option_name ): bool {
	$GLOBALS['anima_test_deleted_options'][] = $option_name;
	unset( $GLOBALS['anima_test_options'][ $option_name ] );

	return true;
}

function update_option( string $option_name, $value, $autoload = null ): bool {
	$GLOBALS['anima_test_options'][ $option_name ] = $value;

	return true;
}

function esc_html__( string $text, string $domain = 'default' ): string {
	return $text;
}

function wp_parse_args( array $args, array $defaults = [] ): array {
	return array_merge( $defaults, $args );
}

function current_theme_supports( string $feature ): bool {
	return true;
}

function get_template(): string {
	return $GLOBALS['anima_test_template'] ?? 'anima';
}

require_once dirname( __DIR__ ) . '/inc/integrations/style-manager/fonts.php';
require_once dirname( __DIR__ ) . '/inc/integrations/style-manager/connected-fields.php';

foreach ( [
	'anima_get_style_manager_default_font_family',
	'anima_add_wporg_style_manager_theme_fonts',
	'anima_maybe_refresh_wporg_style_manager_font_default_cache',
] as $function_name ) {
	if ( ! function_exists( $function_name ) ) {
		anima_fail_wporg_style_manager_font_defaults_test( "Missing {$function_name}()." );
	}
}

$GLOBALS['anima_test_template'] = 'anima';

if ( 'System Sans-Serif Clear' !== anima_get_style_manager_default_font_family() ) {
	anima_fail_wporg_style_manager_font_defaults_test( 'The commercial distribution must retain its Style Manager system-font default.' );
}

$GLOBALS['anima_test_template'] = 'anima-lt';

if ( 'Space Grotesk' !== anima_get_style_manager_default_font_family() ) {
	anima_fail_wporg_style_manager_font_defaults_test( 'The wp.org distribution must default Style Manager to bundled Space Grotesk.' );
}

$theme_fonts = anima_add_wporg_style_manager_theme_fonts( [] );

if ( empty( $theme_fonts['Space Grotesk'] ) ) {
	anima_fail_wporg_style_manager_font_defaults_test( 'Space Grotesk must be registered as an Anima LT theme font.' );
}

if ( ! empty( $theme_fonts['Space Grotesk']['src'] ) ) {
	anima_fail_wporg_style_manager_font_defaults_test( 'Space Grotesk must rely on the local theme.json font face, not a second stylesheet request.' );
}

$font_cache_keys = [
	'pixelgrade_style_manager_customizer_config',
	'pixelgrade_style_manager_options_minimal_details',
	'pixelgrade_style_manager_options_extra_details',
];

$GLOBALS['anima_test_options'] = array_fill_keys( $font_cache_keys, [ 'stale' => true ] );
$GLOBALS['anima_test_options']['anima_options'] = [
	'heading_1_font' => [
		'font_family' => 'Saved User Font',
	],
];
$GLOBALS['anima_test_deleted_options'] = [];

anima_maybe_refresh_wporg_style_manager_font_default_cache();

foreach ( $font_cache_keys as $cache_key ) {
	if ( ! in_array( $cache_key, $GLOBALS['anima_test_deleted_options'], true ) ) {
		anima_fail_wporg_style_manager_font_defaults_test( "The wp.org font-default migration must clear {$cache_key}." );
	}
}

if ( 'Saved User Font' !== ( $GLOBALS['anima_test_options']['anima_options']['heading_1_font']['font_family'] ?? '' ) ) {
	anima_fail_wporg_style_manager_font_defaults_test( 'The cache migration must preserve saved Style Manager font choices.' );
}

$GLOBALS['anima_test_deleted_options'] = [];
anima_maybe_refresh_wporg_style_manager_font_default_cache();

if ( [] !== $GLOBALS['anima_test_deleted_options'] ) {
	anima_fail_wporg_style_manager_font_defaults_test( 'The wp.org font-default cache migration must run only once.' );
}

$font_config = anima_add_fonts_section_to_style_manager_config( [] );
$font_options = $font_config['sections']['fonts_section']['options'] ?? [];

foreach ( $font_options as $option_id => $option ) {
	if ( 'font' !== ( $option['type'] ?? '' ) || 'accent_font' === $option_id ) {
		continue;
	}

	if ( 'Space Grotesk' !== ( $option['default']['font-family'] ?? '' ) ) {
		anima_fail_wporg_style_manager_font_defaults_test( "{$option_id} must default to Space Grotesk in Anima LT." );
	}
}

$connected_config = anima_add_style_manager_connected_fields( [] );
$connected_options = $connected_config['sections']['style_manager_section']['options'] ?? [];

foreach ( [ 'sm_font_primary', 'sm_font_secondary', 'sm_font_body' ] as $option_id ) {
	if ( 'Space Grotesk' !== ( $connected_options[ $option_id ]['default'] ?? '' ) ) {
		anima_fail_wporg_style_manager_font_defaults_test( "{$option_id} must default to Space Grotesk in Anima LT." );
	}
}

echo "wp.org Style Manager font defaults OK\n";
