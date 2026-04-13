<?php
/**
 * Contract test for the contextual entry colors Tweak Board option.
 *
 * Run with:
 * studio wp eval-file wp-content/themes/anima/test/tweak-board-contextual-entry-colors-option.php
 */

function anima_fail_tweak_board_contextual_entry_colors_option_test( string $message ): void {
	fwrite( STDERR, $message . PHP_EOL );
	exit( 1 );
}

if ( ! defined( 'ABSPATH' ) ) {
	anima_fail_tweak_board_contextual_entry_colors_option_test( 'This script must run through wp eval-file.' );
}

$config = apply_filters( 'style_manager/filter_fields', [] );
$style_manager_section = $config['sections']['style_manager_section'] ?? null;
$option = $style_manager_section['options']['sm_contextual_entry_colors'] ?? null;

if ( ! is_array( $option ) ) {
	anima_fail_tweak_board_contextual_entry_colors_option_test( 'Expected the Style Manager section to expose the contextual entry colors option.' );
}

if ( 'sm_toggle' !== ( $option['type'] ?? null ) ) {
	anima_fail_tweak_board_contextual_entry_colors_option_test( 'Expected the contextual entry colors option to use the toggle control type.' );
}

if ( 'sm_contextual_entry_colors' !== ( $option['setting_id'] ?? null ) ) {
	anima_fail_tweak_board_contextual_entry_colors_option_test( 'Expected the contextual entry colors option to store under the sm_contextual_entry_colors setting id.' );
}

if ( true !== ( $option['default'] ?? null ) ) {
	anima_fail_tweak_board_contextual_entry_colors_option_test( 'Expected the contextual entry colors option to default to enabled.' );
}

if ( 'Enable Custom Post Type Colors' !== ( $option['label'] ?? null ) ) {
	anima_fail_tweak_board_contextual_entry_colors_option_test( 'Expected the contextual entry colors option to use the agreed toggle label.' );
}

$panel_config = apply_filters(
	'style_manager/sm_panel_config',
	[
		'sections' => [],
	],
	$style_manager_section
);

$tweak_board_section = $panel_config['sections']['sm_tweak_board_section'] ?? null;

if ( ! is_array( $tweak_board_section ) ) {
	anima_fail_tweak_board_contextual_entry_colors_option_test( 'Expected the contextual entry colors option to be moved into the Tweak Board section.' );
}

$expected_description = 'Control the opt-in visual treatments that give your site a bolder voice and keep future expressive tweaks together.';

if ( $expected_description !== ( $tweak_board_section['description'] ?? null ) ) {
	anima_fail_tweak_board_contextual_entry_colors_option_test( 'Expected the Tweak Board intro copy to reflect expressive treatments and future tweaks.' );
}

$tweak_board_options = $tweak_board_section['options'] ?? [];

if ( ! is_array( $tweak_board_options ) ) {
	anima_fail_tweak_board_contextual_entry_colors_option_test( 'Expected the Tweak Board section to expose an options array.' );
}

$post_titles_intro = $tweak_board_options['sm_decorative_titles_style_intro'] ?? null;
$post_titles_toggle = $tweak_board_options['sm_decorative_titles_style'] ?? null;
$contextual_intro = $tweak_board_options['sm_contextual_entry_colors_intro'] ?? null;
$contextual_toggle = $tweak_board_options['sm_contextual_entry_colors'] ?? null;

if ( ! is_array( $post_titles_intro ) || 'html' !== ( $post_titles_intro['type'] ?? null ) ) {
	anima_fail_tweak_board_contextual_entry_colors_option_test( 'Expected the Tweak Board to expose an intro control for auto-style post titles.' );
}

if ( false === strpos( (string) ( $post_titles_intro['html'] ?? '' ), 'Auto-style Post Titles' ) || false === strpos( (string) ( $post_titles_intro['html'] ?? '' ), 'Give post titles and supported collection card titles a more expressive typographic treatment, guided automatically by punctuation and letter case.' ) ) {
	anima_fail_tweak_board_contextual_entry_colors_option_test( 'Expected the auto-style post titles intro control to carry the agreed title and description.' );
}

if ( ! is_array( $post_titles_toggle ) || 'Enable Auto-style Post Titles' !== ( $post_titles_toggle['label'] ?? null ) ) {
	anima_fail_tweak_board_contextual_entry_colors_option_test( 'Expected the post title styling toggle to use the enable-style label under its intro control.' );
}

if ( ! empty( $post_titles_toggle['desc'] ) ) {
	anima_fail_tweak_board_contextual_entry_colors_option_test( 'Expected the post title styling toggle description to move into the intro control.' );
}

if ( ! is_array( $contextual_intro ) || 'html' !== ( $contextual_intro['type'] ?? null ) ) {
	anima_fail_tweak_board_contextual_entry_colors_option_test( 'Expected the Tweak Board to expose an intro control for contextual entry colors.' );
}

if ( false === strpos( (string) ( $contextual_intro['html'] ?? '' ), 'Custom Post Type Colors' ) || false === strpos( (string) ( $contextual_intro['html'] ?? '' ), 'Add a custom color setting to each post type item and make it available through the Color Signal control.' ) ) {
	anima_fail_tweak_board_contextual_entry_colors_option_test( 'Expected the contextual entry colors intro control to carry the agreed title and description.' );
}

if ( ! is_array( $contextual_toggle ) || 'Enable Custom Post Type Colors' !== ( $contextual_toggle['label'] ?? null ) ) {
	anima_fail_tweak_board_contextual_entry_colors_option_test( 'Expected the contextual entry colors toggle to use the enable-style label under its intro control.' );
}

if ( ! empty( $contextual_toggle['desc'] ) ) {
	anima_fail_tweak_board_contextual_entry_colors_option_test( 'Expected the contextual entry colors toggle description to move into the intro control.' );
}

$option_order = array_keys( $tweak_board_options );
$expected_sequence = [
	'sm_collection_hover_effect',
	'sm_decorative_titles_style_intro',
	'sm_decorative_titles_style',
	'sm_contextual_entry_colors_intro',
	'sm_contextual_entry_colors',
];

$last_position = -1;
foreach ( $expected_sequence as $option_id ) {
	$position = array_search( $option_id, $option_order, true );

	if ( false === $position ) {
		anima_fail_tweak_board_contextual_entry_colors_option_test( 'Expected the Tweak Board options to include ' . $option_id . '.' );
	}

	if ( $position <= $last_position ) {
		anima_fail_tweak_board_contextual_entry_colors_option_test( 'Expected the Tweak Board intro/toggle controls to keep the same order as the Motion subsections.' );
	}

	$last_position = $position;
}

echo "tweak board contextual entry colors option contract ok\n";
