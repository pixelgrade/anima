<?php
/**
 * Contract test for the Site Frame shell rendering.
 *
 * Run with:
 * php /usr/local/bin/wp --path=/path/to/site eval-file wp-content/themes/anima/test/site-frame-render.php
 */

function anima_fail_site_frame_render_test( string $message ): void {
	fwrite( STDERR, $message . PHP_EOL );
	exit( 1 );
}

/**
 * Restore Site Frame render test state.
 *
 * @param array $original_options Original Site Frame option values.
 * @param mixed $original_locations Original nav menu locations theme mod value.
 * @param int   $temporary_menu_id Temporary menu created for the test.
 * @return void
 */
function anima_restore_site_frame_render_state( array $original_options, $original_locations, int $temporary_menu_id ): void {
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
	anima_fail_site_frame_render_test( 'This script must run through wp eval-file.' );
}

$option_names = [
	'sm_site_frame_style',
	'sm_site_frame_palette',
	'sm_site_frame_variation',
];
$original_options = [];

foreach ( $option_names as $option_name ) {
	$original_options[ $option_name ] = get_option( $option_name, null );
}

$original_locations = get_theme_mod( 'nav_menu_locations', null );
$temporary_menu_id  = wp_create_nav_menu( 'Site Frame Render Test Menu' );

if ( is_wp_error( $temporary_menu_id ) || empty( $temporary_menu_id ) ) {
	anima_fail_site_frame_render_test( 'Expected to create the temporary site frame menu for the render test.' );
}

$regular_item_id = wp_update_nav_menu_item(
	$temporary_menu_id,
	0,
	[
		'menu-item-title'  => 'Read',
		'menu-item-url'    => 'https://example.com/read',
		'menu-item-status' => 'publish',
	]
);

$social_item_id = wp_update_nav_menu_item(
	$temporary_menu_id,
	0,
	[
		'menu-item-title'  => 'Instagram',
		'menu-item-url'    => 'https://instagram.com/pixelgrade',
		'menu-item-status' => 'publish',
	]
);

$search_item_id = wp_update_nav_menu_item(
	$temporary_menu_id,
	0,
	[
		'menu-item-title'   => 'Search',
		'menu-item-url'     => '#search',
		'menu-item-status'  => 'publish',
		'menu-item-classes' => 'menu-item--search',
	]
);

foreach ( [ $regular_item_id, $social_item_id, $search_item_id ] as $item_id ) {
	if ( is_wp_error( $item_id ) || empty( $item_id ) ) {
		anima_restore_site_frame_render_state( $original_options, $original_locations, $temporary_menu_id );
		anima_fail_site_frame_render_test( 'Expected the temporary site frame menu items to be created successfully.' );
	}
}

$menu_locations           = is_array( $original_locations ) ? $original_locations : [];
$menu_locations['site-frame'] = (int) $temporary_menu_id;
set_theme_mod( 'nav_menu_locations', $menu_locations );

update_option( 'sm_site_frame_style', 'editorial' );
update_option( 'sm_site_frame_variation', '11' );

ob_start();
do_action( 'anima/template_html:before', 'main' );
$output = ob_get_clean();

$expected_fragments = [
	'c-site-frame__top'                     => 'Expected the top frame accent to render.',
	'c-site-frame__left'                    => 'Expected the left frame accent to render.',
	'c-site-frame__rail'                    => 'Expected the right rail container to render.',
	'c-site-frame__head'                    => 'Expected the Hive-like toolbar head wrapper to render.',
	'menu-item-monogram'                         => 'Expected ordinary site-frame links to render a monogram marker.',
	'social-menu-item'                           => 'Expected social site-frame links to keep the social icon class.',
	'menu-item--search'                          => 'Expected Search extras to keep the existing search class.',
	'c-site-frame__navigation'              => 'Expected the site frame menu navigation wrapper to render.',
	'nav--toolbar'                               => 'Expected the site frame menu to use the toolbar navigation class.',
	'c-site-frame__label'                   => 'Expected ordinary site-frame links to keep a dedicated label wrapper.',
	'Site Frame Menu'                       => 'Expected the Site Frame menu aria label to render.',
];

foreach ( $expected_fragments as $fragment => $message ) {
	if ( false === strpos( $output, $fragment ) ) {
		anima_restore_site_frame_render_state( $original_options, $original_locations, $temporary_menu_id );
		anima_fail_site_frame_render_test( $message );
	}
}

if ( 3 !== substr_count( $output, 'c-site-frame__label' ) ) {
	anima_restore_site_frame_render_state( $original_options, $original_locations, $temporary_menu_id );
	anima_fail_site_frame_render_test( 'Expected every Site Frame menu item title to render inside a dedicated label wrapper.' );
}

anima_restore_site_frame_render_state( $original_options, $original_locations, $temporary_menu_id );

echo "site frame render contract ok\n";
