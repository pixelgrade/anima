<?php
/**
 * Contract test for the Motion Style Manager copy.
 *
 * Run with:
 * wp eval-file wp-content/themes/anima/test/motion-style-manager-copy.php
 */

function anima_fail_motion_style_manager_copy_test( string $message ): void {
	fwrite( STDERR, $message . PHP_EOL );
	exit( 1 );
}

if ( ! defined( 'ABSPATH' ) ) {
	anima_fail_motion_style_manager_copy_test( 'This script must run through wp eval-file.' );
}

$config = apply_filters( 'style_manager/filter_fields', [] );
$style_manager_section = $config['sections']['style_manager_section'] ?? null;

if ( ! is_array( $style_manager_section ) ) {
	anima_fail_motion_style_manager_copy_test( 'Expected the Style Manager section config to be available.' );
}

$panel_config = apply_filters(
	'style_manager/sm_panel_config',
	[
		'sections' => [],
	],
	$style_manager_section
);

$motion_section = $panel_config['sections']['sm_motion_section'] ?? null;

if ( ! is_array( $motion_section ) ) {
	anima_fail_motion_style_manager_copy_test( 'Expected Anima to expose the Motion section.' );
}

$motion_options = $motion_section['options'] ?? [];

if ( ! is_array( $motion_options ) ) {
	anima_fail_motion_style_manager_copy_test( 'Expected the Motion section to expose an options array.' );
}

$page_transitions_intro = $motion_options['sm_page_transitions_intro'] ?? null;
$page_transitions_toggle = $motion_options['sm_page_transitions_enable'] ?? null;
$transition_symbol = $motion_options['sm_transition_symbol'] ?? null;
$intro_animations_intro = $motion_options['sm_intro_animations_intro'] ?? null;
$intro_animations_toggle = $motion_options['sm_intro_animations_enable'] ?? null;

if ( ! is_array( $page_transitions_intro ) || false === strpos( (string) ( $page_transitions_intro['html'] ?? '' ), 'Page Transitions' ) || false === strpos( (string) ( $page_transitions_intro['html'] ?? '' ), 'Make navigation feel smoother with seamless transitions between pages.' ) ) {
	anima_fail_motion_style_manager_copy_test( 'Expected the Page Transitions intro to provide the Site Editor toggle label and help.' );
}

if ( ! is_array( $page_transitions_toggle ) || 'Enabled' !== ( $page_transitions_toggle['label'] ?? null ) ) {
	anima_fail_motion_style_manager_copy_test( 'Expected the Page Transitions toggle label to avoid duplicating its intro title.' );
}

if ( ! is_array( $transition_symbol ) || 'anima_is_cycling_images_loading_style' !== ( $transition_symbol['active_callback'] ?? null ) ) {
	anima_fail_motion_style_manager_copy_test( 'Expected the Transition Symbol active callback wiring to remain unchanged.' );
}

if ( ! is_array( $intro_animations_intro ) || false === strpos( (string) ( $intro_animations_intro['html'] ?? '' ), 'Intro Animations' ) || false === strpos( (string) ( $intro_animations_intro['html'] ?? '' ), 'Animate site elements as they appear on the page.' ) ) {
	anima_fail_motion_style_manager_copy_test( 'Expected the Intro Animations intro to provide the Site Editor toggle label and help.' );
}

if ( ! is_array( $intro_animations_toggle ) || 'Enabled' !== ( $intro_animations_toggle['label'] ?? null ) ) {
	anima_fail_motion_style_manager_copy_test( 'Expected the Intro Animations toggle label to avoid duplicating its intro title.' );
}

$option_order = array_keys( $motion_options );
$expected_adjacency = [
	[ 'sm_page_transitions_intro', 'sm_page_transitions_enable' ],
	[ 'sm_intro_animations_intro', 'sm_intro_animations_enable' ],
];

foreach ( $expected_adjacency as $pair ) {
	$intro_position = array_search( $pair[0], $option_order, true );
	$toggle_position = array_search( $pair[1], $option_order, true );

	if ( false === $intro_position || $intro_position + 1 !== $toggle_position ) {
		anima_fail_motion_style_manager_copy_test( 'Expected Motion intro controls to remain immediately adjacent to their toggles.' );
	}
}

echo "motion style manager copy contract ok\n";
