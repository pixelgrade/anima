<?php

// If this file is called directly, abort.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

// Add motion options to the Style Manager config.
add_filter( 'style_manager/filter_fields', 'anima_add_motion_section_to_style_manager_config', 60, 1 );
add_filter( 'style_manager/sm_panel_config', 'anima_reorganize_motion_customizer_controls', 25, 2 );
add_action( 'after_setup_theme', 'anima_maybe_invalidate_style_manager_motion_cache', 20 );

function anima_add_motion_section_to_style_manager_config( $config ) {

	if ( empty( $config['sections'] ) ) {
		$config['sections'] = [];
	}

	if ( empty( $config['sections']['style_manager_section'] ) ) {
		$config['sections']['style_manager_section'] = [];
	}

	$config['sections']['style_manager_section'] = \Pixelgrade\StyleManager\Utils\ArrayHelpers::array_merge_recursive_distinct(
		$config['sections']['style_manager_section'],
		[
			'options' => [
				'sm_motion_intro' => [
					'type'         => 'html',
					'setting_type' => 'option',
					'setting_id'   => 'sm_motion_intro',
					'html'         => '<span class="description customize-control-description">' . esc_html__( 'Control how motion is used across your site to make navigation feel more fluid and create a more refined, intentional experience for visitors.', '__theme_txtd' ) . '</span>',
				],
				'sm_separator_motion_1' => [
					'type'         => 'html',
					'setting_type' => 'option',
					'setting_id'   => 'sm_separator_motion_1',
					'html'         => '',
				],
				'sm_page_transitions_intro' => [
					'type'         => 'html',
					'setting_type' => 'option',
					'setting_id'   => 'sm_page_transitions_intro',
					'html'         => '<div class="customize-control-title">' . esc_html__( 'Page Transitions', '__theme_txtd' ) . '</div>' .
						'<span class="description customize-control-description">' . esc_html__( 'Make navigation feel smoother with seamless transitions between pages.', '__theme_txtd' ) . '</span>',
				],
				'sm_page_transitions_enable' => [
					'type'         => 'sm_toggle',
					'setting_type' => 'option',
					'setting_id'   => 'sm_page_transitions_enable',
					'label'        => esc_html__( 'Enable Page Transitions', '__theme_txtd' ),
					'default'      => false,
				],
				'sm_page_transition_style' => [
					'type'         => 'sm_radio',
					'setting_type' => 'option',
					'setting_id'   => 'sm_page_transition_style',
					'label'        => esc_html__( 'Page Transition Style', '__theme_txtd' ),
					'default'      => 'border_iris',
					'choices'      => [
						'border_iris' => esc_html__( 'Border Iris', '__theme_txtd' ),
						'slide_wipe'  => esc_html__( 'Slide Wipe', '__theme_txtd' ),
					],
				],
				'sm_logo_loading_style' => [
					'type'         => 'sm_radio',
					'setting_type' => 'option',
					'setting_id'   => 'sm_logo_loading_style',
					'label'        => esc_html__( 'Logo Loading Style', '__theme_txtd' ),
					'default'      => 'progress_bar',
					'choices'      => [
						'progress_bar'    => esc_html__( 'Progress Bar', '__theme_txtd' ),
						'cycling_images'  => esc_html__( 'Cycling Images', '__theme_txtd' ),
					],
				],
				'sm_transition_symbol' => [
					'type'            => 'text',
					'setting_type'    => 'option',
					'setting_id'      => 'sm_transition_symbol',
					'label'           => esc_html__( 'Transition Symbol', '__theme_txtd' ),
					'desc'            => esc_html__( 'Defaults to the first letter of the site title. Accepts plain text or inline SVG.', '__theme_txtd' ),
					'default'         => '',
					'active_callback' => 'anima_is_cycling_images_loading_style',
				],
			],
		]
	);

	return $config;
}

function anima_reorganize_motion_customizer_controls( $sm_panel_config, $sm_section_config ) {

	if ( empty( $sm_section_config['options']['sm_motion_intro'] ) || empty( $sm_section_config['options']['sm_separator_motion_1'] ) || empty( $sm_section_config['options']['sm_page_transitions_intro'] ) || empty( $sm_section_config['options']['sm_page_transitions_enable'] ) || empty( $sm_section_config['options']['sm_page_transition_style'] ) || empty( $sm_section_config['options']['sm_logo_loading_style'] ) || empty( $sm_section_config['options']['sm_transition_symbol'] ) ) {
		return $sm_panel_config;
	}

	$sm_panel_config['sections']['sm_motion_section'] = [
		'title'       => esc_html__( 'Motion', '__theme_txtd' ),
		'description' => '',
		'section_id'  => 'sm_motion_section',
		'priority'    => 45,
		'options'     => [
			'sm_motion_intro' => $sm_section_config['options']['sm_motion_intro'],
			'sm_separator_motion_1' => $sm_section_config['options']['sm_separator_motion_1'],
			'sm_page_transitions_intro' => $sm_section_config['options']['sm_page_transitions_intro'],
			'sm_page_transitions_enable' => $sm_section_config['options']['sm_page_transitions_enable'],
			'sm_page_transition_style' => $sm_section_config['options']['sm_page_transition_style'],
			'sm_logo_loading_style' => $sm_section_config['options']['sm_logo_loading_style'],
			'sm_transition_symbol' => $sm_section_config['options']['sm_transition_symbol'],
		],
	];

	return $sm_panel_config;
}

function anima_maybe_invalidate_style_manager_motion_cache() {
	$cached_config = get_option( 'pixelgrade_style_manager_customizer_config' );
	if ( ! is_array( $cached_config ) ) {
		return;
	}

	$style_manager_sections = $cached_config['panels']['style_manager_panel']['sections'] ?? [];
	$theme_options_sections = $cached_config['panels']['theme_options_panel']['sections'] ?? [];
	$motion_section = $style_manager_sections['sm_motion_section'] ?? [];
	$motion_intro = $motion_section['options']['sm_motion_intro'] ?? [];
	$motion_separator = $motion_section['options']['sm_separator_motion_1'] ?? [];
	$page_transitions_intro = $motion_section['options']['sm_page_transitions_intro'] ?? [];
	$page_transitions_option = $motion_section['options']['sm_page_transitions_enable'] ?? [];
	$page_transition_style = $motion_section['options']['sm_page_transition_style'] ?? [];
	$logo_loading_style = $motion_section['options']['sm_logo_loading_style'] ?? [];
	$transition_symbol = $motion_section['options']['sm_transition_symbol'] ?? [];

	$has_motion_section = isset( $style_manager_sections['sm_motion_section'] );
	$has_layout_section = isset( $theme_options_sections['layout_section'] );
	$has_expected_motion_copy = (
		( $motion_section['description'] ?? '' ) === ''
		&& false !== strpos( (string) ( $motion_intro['html'] ?? '' ), 'Control how motion is used across your site to make navigation feel more fluid and create a more refined, intentional experience for visitors.' )
		&& array_key_exists( 'html', $motion_separator )
		&& false !== strpos( (string) ( $page_transitions_intro['html'] ?? '' ), 'Page Transitions' )
		&& false !== strpos( (string) ( $page_transitions_intro['html'] ?? '' ), 'Make navigation feel smoother with seamless transitions between pages.' )
		&& ( $page_transitions_option['type'] ?? '' ) === 'sm_toggle'
		&& ( $page_transitions_option['setting_type'] ?? '' ) === 'option'
		&& ( $page_transitions_option['setting_id'] ?? '' ) === 'sm_page_transitions_enable'
		&& ( $page_transitions_option['label'] ?? '' ) === 'Enable Page Transitions'
		&& ( $page_transition_style['type'] ?? '' ) === 'sm_radio'
		&& ( $page_transition_style['setting_id'] ?? '' ) === 'sm_page_transition_style'
		&& ( $logo_loading_style['type'] ?? '' ) === 'sm_radio'
		&& ( $logo_loading_style['setting_id'] ?? '' ) === 'sm_logo_loading_style'
		&& ( $transition_symbol['type'] ?? '' ) === 'text'
		&& ( $transition_symbol['setting_id'] ?? '' ) === 'sm_transition_symbol'
	);

	if ( $has_motion_section && ! $has_layout_section && $has_expected_motion_copy ) {
		return;
	}

	update_option( 'pixelgrade_style_manager_customizer_config_timestamp', 0, true );
	update_option( 'pixelgrade_style_manager_customizer_opt_name_timestamp', 0, true );
}

add_action( 'after_setup_theme', 'anima_migrate_loading_transition_style_option', 15 );
function anima_migrate_loading_transition_style_option() {
	$old_value = get_option( 'sm_loading_transition_style', null );
	if ( null === $old_value ) {
		return; // No old option, nothing to migrate.
	}

	// Only migrate once.
	if ( false !== get_option( 'sm_page_transition_style', false ) ) {
		return; // Already migrated.
	}

	if ( 'slide_wipe' === $old_value ) {
		update_option( 'sm_page_transition_style', 'slide_wipe' );
		update_option( 'sm_logo_loading_style', 'cycling_images' );
	} else {
		update_option( 'sm_page_transition_style', 'border_iris' );
		update_option( 'sm_logo_loading_style', 'progress_bar' );
	}

	// Migrate symbol option name.
	$old_symbol = get_option( 'sm_slide_wipe_symbol', '' );
	if ( ! empty( $old_symbol ) ) {
		update_option( 'sm_transition_symbol', $old_symbol );
	}

	// Force cache rebuild.
	update_option( 'pixelgrade_style_manager_customizer_config_timestamp', 0, true );
}

/**
 * Active callback for the Transition Symbol option.
 * Only show when Logo Loading Style is set to Cycling Images.
 *
 * @return bool
 */
function anima_is_cycling_images_loading_style() {
	return 'cycling_images' === get_option( 'sm_logo_loading_style', 'progress_bar' );
}
