<?php
/**
 * Editorial Frame Style Manager integration.
 *
 * @package Anima
 */

// If this file is called directly, abort.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

add_filter( 'style_manager/filter_fields', 'anima_add_editorial_frame_section_to_style_manager_config', 62, 1 );
add_filter( 'style_manager/sm_panel_config', 'anima_reorganize_editorial_frame_customizer_controls', 30, 2 );
add_action( 'after_setup_theme', 'anima_maybe_invalidate_style_manager_editorial_frame_cache', 20 );

/**
 * Add Editorial Frame options to the shared Style Manager section.
 *
 * @param array $config Style Manager config.
 * @return array
 */
function anima_add_editorial_frame_section_to_style_manager_config( $config ) {
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
				'sm_editorial_frame_intro' => [
					'type'         => 'html',
					'setting_type' => 'option',
					'setting_id'   => 'sm_editorial_frame_intro',
					'html'         => '<div class="customize-control-title">' . esc_html__( 'Editorial Frame', '__theme_txtd' ) . '</div>' .
						'<span class="description customize-control-description">' . esc_html__( 'Frame the site with a graphic chrome and style a dedicated Chrome menu with search, social links, and expressive navigation.', '__theme_txtd' ) . '</span>',
				],
				'sm_chrome_preset' => [
					'type'         => 'sm_radio',
					'setting_type' => 'option',
					'setting_id'   => 'sm_chrome_preset',
					'label'        => esc_html__( 'Chrome Preset', '__theme_txtd' ),
					'default'      => 'none',
					'choices'      => [
						'none'            => esc_html__( 'None', '__theme_txtd' ),
						'editorial-frame' => esc_html__( 'Editorial Frame', '__theme_txtd' ),
					],
				],
				'sm_chrome_color_role' => [
					'type'            => 'sm_radio',
					'setting_type'    => 'option',
					'setting_id'      => 'sm_chrome_color_role',
					'label'           => esc_html__( 'Chrome Tone', '__theme_txtd' ),
					'default'         => 'strong-contrast',
					'choices'         => [
						'strong-contrast' => esc_html__( 'Strong Contrast', '__theme_txtd' ),
						'quiet-contrast'  => esc_html__( 'Quiet Contrast', '__theme_txtd' ),
						'accent'          => esc_html__( 'Accent', '__theme_txtd' ),
					],
					'active_callback' => 'anima_is_editorial_frame_enabled',
				],
			],
		]
	);

	return $config;
}

/**
 * Append Editorial Frame controls to the Tweak Board section.
 *
 * @param array $sm_panel_config   Style Manager panel config.
 * @param array $sm_section_config Raw Style Manager section config.
 * @return array
 */
function anima_reorganize_editorial_frame_customizer_controls( $sm_panel_config, $sm_section_config ) {
	$required_options = [
		'sm_editorial_frame_intro',
		'sm_chrome_preset',
		'sm_chrome_color_role',
	];

	foreach ( $required_options as $option_id ) {
		if ( empty( $sm_section_config['options'][ $option_id ] ) ) {
			return $sm_panel_config;
		}
	}

	if ( empty( $sm_panel_config['sections']['sm_tweak_board_section']['options'] ) || ! is_array( $sm_panel_config['sections']['sm_tweak_board_section']['options'] ) ) {
		return $sm_panel_config;
	}

	$sm_panel_config['sections']['sm_tweak_board_section']['options'] = array_merge(
		$sm_panel_config['sections']['sm_tweak_board_section']['options'],
		[
			'sm_editorial_frame_intro' => $sm_section_config['options']['sm_editorial_frame_intro'],
			'sm_chrome_preset'         => $sm_section_config['options']['sm_chrome_preset'],
			'sm_chrome_color_role'     => $sm_section_config['options']['sm_chrome_color_role'],
		]
	);

	return $sm_panel_config;
}

/**
 * Invalidate stale Style Manager Customizer cache entries for Editorial Frame.
 *
 * @return void
 */
function anima_maybe_invalidate_style_manager_editorial_frame_cache(): void {
	$cached_config = get_option( 'pixelgrade_style_manager_customizer_config' );
	if ( ! is_array( $cached_config ) ) {
		return;
	}

	$tweak_board_section     = $cached_config['panels']['style_manager_panel']['sections']['sm_tweak_board_section'] ?? [];
	$editorial_frame_section = $cached_config['panels']['style_manager_panel']['sections']['sm_editorial_frame_section'] ?? [];
	$section_options         = $tweak_board_section['options'] ?? [];
	$intro_option            = $section_options['sm_editorial_frame_intro'] ?? [];
	$preset_option           = $section_options['sm_chrome_preset'] ?? [];
	$color_role_option       = $section_options['sm_chrome_color_role'] ?? [];
	$option_order            = array_keys( $section_options );
	$expected_tail           = [
		'sm_editorial_frame_intro',
		'sm_chrome_preset',
		'sm_chrome_color_role',
	];
	$has_expected_copy       = (
		empty( $editorial_frame_section )
		&& ( $intro_option['type'] ?? '' ) === 'html'
		&& false !== strpos( (string) ( $intro_option['html'] ?? '' ), 'Editorial Frame' )
		&& false !== strpos( (string) ( $intro_option['html'] ?? '' ), 'Frame the site with a graphic chrome and style a dedicated Chrome menu with search, social links, and expressive navigation.' )
		&& ( $preset_option['setting_id'] ?? '' ) === 'sm_chrome_preset'
		&& ( $color_role_option['setting_id'] ?? '' ) === 'sm_chrome_color_role'
		&& $expected_tail === array_slice( $option_order, -1 * count( $expected_tail ) )
	);

	if ( $has_expected_copy ) {
		return;
	}

	update_option( 'pixelgrade_style_manager_customizer_config_timestamp', 0, true );
	update_option( 'pixelgrade_style_manager_customizer_opt_name_timestamp', 0, true );
}
