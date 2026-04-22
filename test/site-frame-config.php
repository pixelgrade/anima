<?php
/**
 * Contract test for the Site Frame settings and runtime scaffolding.
 *
 * Run with:
 * php /usr/local/bin/wp --path=/path/to/site eval-file wp-content/themes/anima/test/site-frame-config.php
 */

function anima_fail_site_frame_config_test( string $message ): void {
	fwrite( STDERR, $message . PHP_EOL );
	exit( 1 );
}

/**
 * Restore Site Frame option and menu state.
 *
 * @param array $original_options Original Site Frame option values.
 * @param mixed $original_locations Original nav menu locations theme mod value.
 * @param int   $temporary_menu_id Temporary menu created for the test.
 * @return void
 */
function anima_restore_site_frame_config_state( array $original_options, $original_locations, int $temporary_menu_id ): void {
	foreach ( $original_options as $option_name => $option_value ) {
		if ( null === $option_value ) {
			delete_option( $option_name );
			continue;
		}

		update_option( $option_name, $option_value );
	}

	if ( null === $original_locations ) {
		remove_theme_mod( 'nav_menu_locations' );
	} else {
		set_theme_mod( 'nav_menu_locations', $original_locations );
	}

	if ( $temporary_menu_id > 0 ) {
		wp_delete_nav_menu( $temporary_menu_id );
	}
}

if ( ! defined( 'ABSPATH' ) ) {
	anima_fail_site_frame_config_test( 'This script must run through wp eval-file.' );
}

$option_names = [
	'sm_site_frame_intro',
	'sm_site_frame_style',
	'sm_site_frame_palette',
	'sm_site_frame_variation',
];
$original_options = [];

foreach ( $option_names as $option_name ) {
	$original_options[ $option_name ] = get_option( $option_name, null );
}

$original_locations = get_theme_mod( 'nav_menu_locations', null );
$temporary_menu_id  = 0;

$registered_menus = get_registered_nav_menus();

if ( empty( $registered_menus['site-frame'] ) ) {
	anima_fail_site_frame_config_test( 'Expected Anima to register the site frame menu location.' );
}

$config                = apply_filters( 'style_manager/filter_fields', [] );
$style_manager_section = $config['sections']['style_manager_section'] ?? [];
$style_manager_options = $style_manager_section['options'] ?? [];

foreach ( $option_names as $option_name ) {
	if ( empty( $style_manager_options[ $option_name ] ) || ! is_array( $style_manager_options[ $option_name ] ) ) {
		anima_fail_site_frame_config_test( 'Expected the Style Manager config to expose ' . $option_name . '.' );
	}
}

$panel_config = apply_filters(
	'style_manager/sm_panel_config',
	[
		'sections' => [],
	],
	$style_manager_section
);

$site_frame_section = $panel_config['sections']['sm_site_frame_section'] ?? null;
$tweak_board_section     = $panel_config['sections']['sm_tweak_board_section'] ?? null;

if ( is_array( $site_frame_section ) ) {
	anima_fail_site_frame_config_test( 'Expected the Site Frame controls to stop using a dedicated Style Manager section.' );
}

if ( ! is_array( $tweak_board_section ) ) {
	anima_fail_site_frame_config_test( 'Expected the Site Frame controls to move into the Tweak Board section.' );
}

$section_options = $tweak_board_section['options'] ?? [];
foreach ( $option_names as $option_name ) {
	if ( empty( $section_options[ $option_name ] ) || ! is_array( $section_options[ $option_name ] ) ) {
		anima_fail_site_frame_config_test( 'Expected the Tweak Board section to expose ' . $option_name . '.' );
	}
}

$site_frame_intro = $section_options['sm_site_frame_intro'] ?? [];

if (
	'html' !== ( $site_frame_intro['type'] ?? '' )
	|| false === strpos( (string) ( $site_frame_intro['html'] ?? '' ), 'Site Frame' )
	|| false === strpos( (string) ( $site_frame_intro['html'] ?? '' ), 'Frame the site with a reusable desktop frame and style a dedicated Site Frame menu with search, social links, and expressive navigation.' )
) {
	anima_fail_site_frame_config_test( 'Expected the Tweak Board section to render the Site Frame title and description before the controls.' );
}

$option_order = array_keys( $section_options );
$expected_tail = [
	'sm_site_frame_intro',
	'sm_site_frame_style',
	'sm_site_frame_palette',
	'sm_site_frame_variation',
];
$actual_tail = array_slice( $option_order, -1 * count( $expected_tail ) );

if ( $expected_tail !== $actual_tail ) {
	anima_fail_site_frame_config_test( 'Expected the Site Frame controls to be appended at the end of the Tweak Board section.' );
}

$temporary_menu_id = wp_create_nav_menu( 'Site Frame Test Menu' );

if ( is_wp_error( $temporary_menu_id ) || empty( $temporary_menu_id ) ) {
	anima_fail_site_frame_config_test( 'Expected to create a temporary site frame menu for the config test.' );
}

wp_update_nav_menu_item(
	$temporary_menu_id,
	0,
	[
		'menu-item-title'  => 'Read',
		'menu-item-url'    => 'https://example.com/read',
		'menu-item-status' => 'publish',
	]
);

$menu_locations           = is_array( $original_locations ) ? $original_locations : [];
$menu_locations['site-frame'] = (int) $temporary_menu_id;
set_theme_mod( 'nav_menu_locations', $menu_locations );

update_option( 'sm_site_frame_style', 'editorial' );
update_option( 'sm_site_frame_variation', '11' );

$body_classes = apply_filters( 'body_class', [] );
$expected_classes = [
	'has-site-frame',
	'has-site-frame-menu',
	'has-site-frame-frame',
];

foreach ( $expected_classes as $class_name ) {
	if ( ! in_array( $class_name, $body_classes, true ) ) {
		anima_restore_site_frame_config_state( $original_options, $original_locations, $temporary_menu_id );
		anima_fail_site_frame_config_test( 'Expected the body classes to include ' . $class_name . '.' );
	}
}

$menu_locations = is_array( $menu_locations ) ? $menu_locations : [];
unset( $menu_locations['site-frame'] );
set_theme_mod( 'nav_menu_locations', $menu_locations );

$body_classes_without_menu = apply_filters( 'body_class', [] );

if ( ! in_array( 'has-site-frame-frame', $body_classes_without_menu, true ) ) {
	anima_restore_site_frame_config_state( $original_options, $original_locations, $temporary_menu_id );
	anima_fail_site_frame_config_test( 'Expected the frame class to remain enabled when the Site Frame preset is active.' );
}

if ( in_array( 'has-site-frame-menu', $body_classes_without_menu, true ) ) {
	anima_restore_site_frame_config_state( $original_options, $original_locations, $temporary_menu_id );
	anima_fail_site_frame_config_test( 'Expected the site frame menu class to disappear when no Site Frame menu is assigned.' );
}

anima_restore_site_frame_config_state( $original_options, $original_locations, $temporary_menu_id );

echo "site frame config contract ok\n";
