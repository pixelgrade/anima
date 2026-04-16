<?php
/**
 * Contract test for the Editorial Frame shell rendering.
 *
 * Run with:
 * php /usr/local/bin/wp --path=/path/to/site eval-file wp-content/themes/anima/test/editorial-frame-render.php
 */

function anima_fail_editorial_frame_render_test( string $message ): void {
	fwrite( STDERR, $message . PHP_EOL );
	exit( 1 );
}

/**
 * Restore Editorial Frame render test state.
 *
 * @param array $original_options Original Editorial Frame option values.
 * @param mixed $original_locations Original nav menu locations theme mod value.
 * @param int   $temporary_menu_id Temporary menu created for the test.
 * @return void
 */
function anima_restore_editorial_frame_render_state( array $original_options, $original_locations, int $temporary_menu_id ): void {
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
	anima_fail_editorial_frame_render_test( 'This script must run through wp eval-file.' );
}

$option_names = [
	'sm_chrome_preset',
	'sm_chrome_menu_visibility',
	'sm_chrome_frame_visibility',
	'sm_chrome_color_role',
];
$original_options = [];

foreach ( $option_names as $option_name ) {
	$original_options[ $option_name ] = get_option( $option_name, null );
}

$original_locations = get_theme_mod( 'nav_menu_locations', null );
$temporary_menu_id  = wp_create_nav_menu( 'Editorial Frame Render Test Menu' );

if ( is_wp_error( $temporary_menu_id ) || empty( $temporary_menu_id ) ) {
	anima_fail_editorial_frame_render_test( 'Expected to create the temporary chrome menu for the render test.' );
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
		anima_restore_editorial_frame_render_state( $original_options, $original_locations, $temporary_menu_id );
		anima_fail_editorial_frame_render_test( 'Expected the temporary chrome menu items to be created successfully.' );
	}
}

$menu_locations           = is_array( $original_locations ) ? $original_locations : [];
$menu_locations['chrome'] = (int) $temporary_menu_id;
set_theme_mod( 'nav_menu_locations', $menu_locations );

update_option( 'sm_chrome_preset', 'editorial-frame' );
update_option( 'sm_chrome_menu_visibility', true );
update_option( 'sm_chrome_frame_visibility', true );
update_option( 'sm_chrome_color_role', 'strong-contrast' );

ob_start();
do_action( 'anima/template_html:before', 'main' );
$output = ob_get_clean();

$expected_fragments = [
	'c-editorial-frame__top'                     => 'Expected the top frame accent to render.',
	'c-editorial-frame__left'                    => 'Expected the left frame accent to render.',
	'c-editorial-frame__rail'                    => 'Expected the right rail container to render.',
	'menu-item-monogram'                         => 'Expected ordinary chrome links to render a monogram marker.',
	'social-menu-item'                           => 'Expected social chrome links to keep the social icon class.',
	'menu-item--search'                          => 'Expected Search extras to keep the existing search class.',
	'c-editorial-frame__navigation'              => 'Expected the chrome menu navigation wrapper to render.',
];

foreach ( $expected_fragments as $fragment => $message ) {
	if ( false === strpos( $output, $fragment ) ) {
		anima_restore_editorial_frame_render_state( $original_options, $original_locations, $temporary_menu_id );
		anima_fail_editorial_frame_render_test( $message );
	}
}

anima_restore_editorial_frame_render_state( $original_options, $original_locations, $temporary_menu_id );

echo "editorial frame render contract ok\n";
