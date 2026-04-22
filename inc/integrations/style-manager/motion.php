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
				'sm_separator_motion_2' => [
					'type'         => 'html',
					'setting_type' => 'option',
					'setting_id'   => 'sm_separator_motion_2',
					'html'         => '',
				],
				'sm_intro_animations_intro' => [
					'type'         => 'html',
					'setting_type' => 'option',
					'setting_id'   => 'sm_intro_animations_intro',
					'html'         => '<div class="customize-control-title">' . esc_html__( 'Animations', '__theme_txtd' ) . '</div>' .
						'<span class="description customize-control-description">' . esc_html__( 'Select an animation style to animate site elements as they appear on the page.', '__theme_txtd' ) . '</span>',
				],
				'sm_intro_animations_enable' => [
					'type'         => 'sm_toggle',
					'setting_type' => 'option',
					'setting_id'   => 'sm_intro_animations_enable',
					'label'        => esc_html__( 'Enable Intro Animations', '__theme_txtd' ),
					'default'      => false,
				],
				'sm_intro_animations_style' => [
					'type'         => 'radio_html',
					'setting_type' => 'option',
					'setting_id'   => 'sm_intro_animations_style',
					'label'        => esc_html__( 'Style', '__theme_txtd' ),
					'default'      => 'fade',
					'choices'      => anima_get_intro_animation_style_choices(),
				],
				'sm_intro_animations_speed' => [
					'type'         => 'sm_radio',
					'setting_type' => 'option',
					'setting_id'   => 'sm_intro_animations_speed',
					'label'        => esc_html__( 'Speed', '__theme_txtd' ),
					'default'      => 'medium',
					'choices'      => [
						'slow'   => esc_html__( 'Slow', '__theme_txtd' ),
						'medium' => esc_html__( 'Medium', '__theme_txtd' ),
						'fast'   => esc_html__( 'Fast', '__theme_txtd' ),
					],
				],
			],
		]
	);

	return $config;
}

function anima_reorganize_motion_customizer_controls( $sm_panel_config, $sm_section_config ) {

	if ( empty( $sm_section_config['options']['sm_motion_intro'] ) || empty( $sm_section_config['options']['sm_separator_motion_1'] ) || empty( $sm_section_config['options']['sm_page_transitions_intro'] ) || empty( $sm_section_config['options']['sm_page_transitions_enable'] ) || empty( $sm_section_config['options']['sm_page_transition_style'] ) || empty( $sm_section_config['options']['sm_logo_loading_style'] ) || empty( $sm_section_config['options']['sm_transition_symbol'] ) || empty( $sm_section_config['options']['sm_separator_motion_2'] ) || empty( $sm_section_config['options']['sm_intro_animations_intro'] ) || empty( $sm_section_config['options']['sm_intro_animations_enable'] ) || empty( $sm_section_config['options']['sm_intro_animations_style'] ) || empty( $sm_section_config['options']['sm_intro_animations_speed'] ) ) {
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
			'sm_separator_motion_2' => $sm_section_config['options']['sm_separator_motion_2'],
			'sm_intro_animations_intro' => $sm_section_config['options']['sm_intro_animations_intro'],
			'sm_intro_animations_enable' => $sm_section_config['options']['sm_intro_animations_enable'],
			'sm_intro_animations_style' => $sm_section_config['options']['sm_intro_animations_style'],
			'sm_intro_animations_speed' => $sm_section_config['options']['sm_intro_animations_speed'],
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
	$intro_separator = $motion_section['options']['sm_separator_motion_2'] ?? [];
	$intro_animations_intro = $motion_section['options']['sm_intro_animations_intro'] ?? [];
	$intro_animations_enable = $motion_section['options']['sm_intro_animations_enable'] ?? [];
	$intro_animations_style = $motion_section['options']['sm_intro_animations_style'] ?? [];
	$intro_animations_speed = $motion_section['options']['sm_intro_animations_speed'] ?? [];

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
		&& array_key_exists( 'html', $intro_separator )
		&& false !== strpos( (string) ( $intro_animations_intro['html'] ?? '' ), 'Animations' )
		&& false !== strpos( (string) ( $intro_animations_intro['html'] ?? '' ), 'Select an animation style to animate site elements as they appear on the page.' )
		&& ( $intro_animations_enable['type'] ?? '' ) === 'sm_toggle'
		&& ( $intro_animations_enable['setting_type'] ?? '' ) === 'option'
		&& ( $intro_animations_enable['setting_id'] ?? '' ) === 'sm_intro_animations_enable'
		&& ( $intro_animations_enable['label'] ?? '' ) === 'Enable Intro Animations'
		&& ( $intro_animations_style['type'] ?? '' ) === 'radio_html'
		&& ( $intro_animations_style['setting_id'] ?? '' ) === 'sm_intro_animations_style'
		&& ( $intro_animations_speed['type'] ?? '' ) === 'sm_radio'
		&& ( $intro_animations_speed['setting_id'] ?? '' ) === 'sm_intro_animations_speed'
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

/**
 * Build the intro-animation style choices for the Motion panel.
 *
 * @return array
 */
function anima_get_intro_animation_style_choices() {
	return [
		'fade'  => anima_get_intro_animation_choice_markup( 'fade', esc_html__( 'Fade', '__theme_txtd' ) ),
		'scale' => anima_get_intro_animation_choice_markup( 'scale', esc_html__( 'Scale', '__theme_txtd' ) ),
		'slide' => anima_get_intro_animation_choice_markup( 'slide', esc_html__( 'Slide', '__theme_txtd' ) ),
	];
}

/**
 * Build a single intro-animation choice row with icon and label.
 *
 * @param string $slug  Animation style slug.
 * @param string $label Animation style label.
 *
 * @return string
 */
function anima_get_intro_animation_choice_markup( $slug, $label ) {
	return sprintf(
		'<div class="anima-motion-choice anima-motion-choice--%1$s"><span class="anima-motion-choice__icon" aria-hidden="true">%2$s</span><span class="anima-motion-choice__label">%3$s</span></div>',
		esc_attr( $slug ),
		anima_get_intro_animation_choice_icon_markup( $slug ),
		esc_html( $label )
	);
}

/**
 * Build inline SVG icon markup for an intro-animation style.
 *
 * @param string $slug Animation style slug.
 *
 * @return string
 */
function anima_get_intro_animation_choice_icon_markup( $slug ) {
	$stroke = 'currentColor';
	$icons  = [
		'fade'  => '<svg viewBox="0 0 20 20" focusable="false" aria-hidden="true"><path d="M3.5 10h13" fill="none" stroke="' . $stroke . '" stroke-width="1.75" stroke-linecap="round"/><path d="M6.5 6.25h7" fill="none" stroke="' . $stroke . '" stroke-width="1.75" stroke-linecap="round" opacity=".45"/><path d="M6.5 13.75h7" fill="none" stroke="' . $stroke . '" stroke-width="1.75" stroke-linecap="round" opacity=".75"/></svg>',
		'scale' => '<svg viewBox="0 0 20 20" focusable="false" aria-hidden="true"><path d="M5 8V5h3" fill="none" stroke="' . $stroke . '" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"/><path d="M12 5h3v3" fill="none" stroke="' . $stroke . '" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"/><path d="M15 12v3h-3" fill="none" stroke="' . $stroke . '" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"/><path d="M8 15H5v-3" fill="none" stroke="' . $stroke . '" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"/></svg>',
		'slide' => '<svg viewBox="0 0 20 20" focusable="false" aria-hidden="true"><path d="M10 4.5v11" fill="none" stroke="' . $stroke . '" stroke-width="1.75" stroke-linecap="round"/><path d="m6.75 7.75 3.25-3.25 3.25 3.25" fill="none" stroke="' . $stroke . '" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"/><path d="M4.5 15.5h11" fill="none" stroke="' . $stroke . '" stroke-width="1.75" stroke-linecap="round" opacity=".5"/></svg>',
	];

	return $icons[ $slug ] ?? '';
}
