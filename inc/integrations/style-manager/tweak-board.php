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
				'sm_collection_collage_grid' => [
					'type'         => 'sm_toggle',
					'setting_type' => 'option',
					'setting_id'   => 'sm_collection_collage_grid',
					'label'        => esc_html__( 'Collage grid collections', '__theme_txtd' ),
					'desc'         => esc_html__( 'A patchwork treatment for Masonry collections with Original aspect ratio: side-by-side portrait cards, media overlapping between columns, and a staggered reveal.', '__theme_txtd' ),
					'default'      => false,
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
		'sm_collection_collage_grid',
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

	if ( isset( $sm_section_config['options']['sm_collection_collage_grid'] ) ) {
		$available_options['sm_collection_collage_grid'] = $sm_section_config['options']['sm_collection_collage_grid'];
	}

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
 * Invalidate the cached Style Manager Customizer config once when this theme's
 * Tweak Board additions change, tracked by the version token below.
 *
 * The previous implementation compared the cached config against hard-coded
 * label/description strings; once any of that copy changed (e.g. the rename to
 * "Contextual Colors") the comparison never matched again and the cache was
 * re-invalidated on every request, rebuilding the whole config on each load.
 * A version token invalidates the cache exactly once per change instead.
 */
function anima_maybe_invalidate_style_manager_tweak_board_cache() {
	// Bump this token whenever the Tweak Board controls, copy, or order added in
	// this file change, so the cached Style Manager config is rebuilt once to
	// pick up the new definition.
	$config_version = '2026-07-10-collage-grid';

	if ( get_option( 'anima_tweak_board_config_version' ) === $config_version ) {
		return;
	}

	update_option( 'pixelgrade_style_manager_customizer_config_timestamp', 0, true );
	update_option( 'pixelgrade_style_manager_customizer_opt_name_timestamp', 0, true );
	update_option( 'anima_tweak_board_config_version', $config_version, true );
}
