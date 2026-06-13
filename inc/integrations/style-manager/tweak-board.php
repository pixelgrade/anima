<?php

// If this file is called directly, abort.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

add_filter( 'style_manager/filter_fields', 'anima_add_tweak_board_section_to_style_manager_config', 65, 1 );
add_filter( 'style_manager/sm_panel_config', 'anima_reorganize_tweak_board_customizer_controls', 25, 2 );
add_action( 'after_setup_theme', 'anima_maybe_invalidate_style_manager_tweak_board_cache', 20 );

/**
 * Add theme-specific Tweak Board controls to the shared Style Manager section config.
 *
 * @param array $config Style Manager config.
 * @return array
 */
function anima_add_tweak_board_section_to_style_manager_config( $config ) {

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
				'sm_contextual_entry_colors_intro' => [
					'type'         => 'html',
					'setting_type' => 'option',
					'setting_id'   => 'sm_contextual_entry_colors_intro',
					'html'         => '<div class="customize-control-title">' . esc_html__( 'Contextual Colors', '__theme_txtd' ) . '</div>' .
						'<span class="description customize-control-description">' . esc_html__( 'Give each post, page, project or product its own colour — picked by hand or pulled from its cover image — for the accents that belong to it.', '__theme_txtd' ) . '</span>',
				],
				'sm_contextual_entry_colors' => [
					'type'         => 'sm_toggle',
					'setting_type' => 'option',
					'setting_id'   => 'sm_contextual_entry_colors',
					'label'        => esc_html__( 'Enabled', '__theme_txtd' ),
					'desc'         => '',
					'default'      => true,
				],
			],
		]
	);

	return $config;
}

/**
 * Append theme-specific controls to the plugin-provided Tweak Board section.
 *
 * @param array $sm_panel_config   Style Manager panel config.
 * @param array $sm_section_config Raw Style Manager section config.
 * @return array
 */
function anima_reorganize_tweak_board_customizer_controls( $sm_panel_config, $sm_section_config ) {

	if ( empty( $sm_panel_config['sections']['sm_tweak_board_section'] ) || empty( $sm_section_config['options']['sm_decorative_titles_style_intro'] ) || empty( $sm_section_config['options']['sm_contextual_entry_colors_intro'] ) || empty( $sm_section_config['options']['sm_contextual_entry_colors'] ) ) {
		return $sm_panel_config;
	}

	$sm_panel_config['sections']['sm_tweak_board_section']['description'] = esc_html__( 'Opt-in visual treatments that give your site a bolder, more expressive voice.', '__theme_txtd' );

	$existing_options = $sm_panel_config['sections']['sm_tweak_board_section']['options'] ?? [];
	$ordered_option_ids = [
		'sm_collection_title_position',
		'sm_collection_hover_effect',
		'sm_decorative_titles_style_intro',
		'sm_decorative_titles_style',
		'sm_contextual_entry_colors_intro',
		'sm_contextual_entry_colors',
	];
	$available_options = array_merge(
		$existing_options,
		[
			'sm_decorative_titles_style_intro' => $sm_section_config['options']['sm_decorative_titles_style_intro'],
			'sm_contextual_entry_colors_intro' => $sm_section_config['options']['sm_contextual_entry_colors_intro'],
			'sm_contextual_entry_colors' => $sm_section_config['options']['sm_contextual_entry_colors'],
		]
	);

	if ( isset( $available_options['sm_collection_title_position'] ) ) {
		$available_options['sm_collection_title_position']['label'] = esc_html__( 'Collection title position', '__theme_txtd' );
		$available_options['sm_collection_title_position']['desc']  = esc_html__( '"Sideways" rotates collection titles along the left edge for an editorial look.', '__theme_txtd' );
	}

	if ( isset( $available_options['sm_collection_hover_effect'] ) ) {
		$available_options['sm_collection_hover_effect']['label'] = esc_html__( 'Collection hover effect', '__theme_txtd' );
		$available_options['sm_collection_hover_effect']['desc']  = esc_html__( "The effect shown when hovering a collection card's media.", '__theme_txtd' );
	}

	$tweak_board_options = [];

	foreach ( $ordered_option_ids as $option_id ) {
		if ( isset( $available_options[ $option_id ] ) ) {
			$tweak_board_options[ $option_id ] = $available_options[ $option_id ];
		}
	}

	foreach ( $existing_options as $option_id => $option_config ) {
		if ( isset( $tweak_board_options[ $option_id ] ) ) {
			continue;
		}

		$tweak_board_options[ $option_id ] = $option_config;
	}

	$sm_panel_config['sections']['sm_tweak_board_section']['options'] = $tweak_board_options;

	return $sm_panel_config;
}

/**
 * Invalidate the cached Style Manager Customizer config when the Tweak Board additions drift.
 */
function anima_maybe_invalidate_style_manager_tweak_board_cache() {
	$cached_config = get_option( 'pixelgrade_style_manager_customizer_config' );
	if ( ! is_array( $cached_config ) ) {
		return;
	}

	$tweak_board_section = $cached_config['panels']['style_manager_panel']['sections']['sm_tweak_board_section'] ?? [];
	$tweak_board_options = $tweak_board_section['options'] ?? [];
	$collection_title_position = $tweak_board_options['sm_collection_title_position'] ?? [];
	$collection_hover_effect = $tweak_board_options['sm_collection_hover_effect'] ?? [];
	$contextual_entry_colors_intro = $tweak_board_options['sm_contextual_entry_colors_intro'] ?? [];
	$contextual_entry_colors = $tweak_board_options['sm_contextual_entry_colors'] ?? [];
	$expected_description = esc_html__( 'Opt-in visual treatments that give your site a bolder, more expressive voice.', '__theme_txtd' );
	$ordered_option_ids = array_keys( $tweak_board_options );
	$expected_sequence = [
		'sm_collection_title_position',
		'sm_collection_hover_effect',
		'sm_decorative_titles_style_intro',
		'sm_decorative_titles_style',
		'sm_contextual_entry_colors_intro',
		'sm_contextual_entry_colors',
	];
	$last_position = -1;
	$has_expected_option_order = true;

	foreach ( $expected_sequence as $option_id ) {
		$position = array_search( $option_id, $ordered_option_ids, true );

		if ( false === $position || $position <= $last_position ) {
			$has_expected_option_order = false;
			break;
		}

		$last_position = $position;
	}

	$has_expected_tweak_board_copy = (
		( $tweak_board_section['title'] ?? '' ) === esc_html__( 'Tweak Board', '__theme_txtd' )
		&& ( $tweak_board_section['description'] ?? '' ) === $expected_description
		&& ( $collection_title_position['label'] ?? '' ) === esc_html__( 'Collection title position', '__theme_txtd' )
		&& ( $collection_title_position['desc'] ?? '' ) === esc_html__( '"Sideways" rotates collection titles along the left edge for an editorial look.', '__theme_txtd' )
		&& ( $collection_hover_effect['label'] ?? '' ) === esc_html__( 'Collection hover effect', '__theme_txtd' )
		&& ( $collection_hover_effect['desc'] ?? '' ) === esc_html__( "The effect shown when hovering a collection card's media.", '__theme_txtd' )
		&& ( $contextual_entry_colors_intro['type'] ?? '' ) === 'html'
		&& false !== strpos( (string) ( $contextual_entry_colors_intro['html'] ?? '' ), 'Custom Post Type Colors' )
		&& false !== strpos( (string) ( $contextual_entry_colors_intro['html'] ?? '' ), 'Add a custom color setting to each post type item and use it anywhere the color options appear.' )
		&& ( $contextual_entry_colors['type'] ?? '' ) === 'sm_toggle'
		&& ( $contextual_entry_colors['setting_type'] ?? '' ) === 'option'
		&& ( $contextual_entry_colors['setting_id'] ?? '' ) === 'sm_contextual_entry_colors'
		&& ( $contextual_entry_colors['label'] ?? '' ) === esc_html__( 'Enabled', '__theme_txtd' )
		&& empty( $contextual_entry_colors['desc'] )
		&& $has_expected_option_order
	);

	if ( $has_expected_tweak_board_copy ) {
		return;
	}

	update_option( 'pixelgrade_style_manager_customizer_config_timestamp', 0, true );
	update_option( 'pixelgrade_style_manager_customizer_opt_name_timestamp', 0, true );
}
