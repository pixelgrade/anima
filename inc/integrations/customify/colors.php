<?php

// If this file is called directly, abort.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

define( 'THEME_COLOR_PRIMARY',    '#DDAB5D' );    // gold
define( 'THEME_COLOR_SECONDARY',  '#39497C' );    // blue
define( 'THEME_COLOR_TERTIARY',   '#B12C4A' );    // red
define( 'THEME_DARK_PRIMARY',     '#212B49' );    // dark blue
define( 'THEME_DARK_SECONDARY',   '#34394B' );    // dark light blue
define( 'THEME_DARK_TERTIARY',    '#141928' );    // darker blue
define( 'THEME_LIGHT_PRIMARY',    '#FFFFFF' );    // white
define( 'THEME_LIGHT_SECONDARY',  '#CCCCCC' );    // gray
define( 'THEME_LIGHT_TERTIARY',   '#EEEFF2' );    // light gray

// Add colors section and options to the Customify config
add_filter( 'customify_filter_fields', 'rosa2_add_colors_section_to_customify_config', 50, 1 );

// Prepend theme color palette to the default color palettes list
add_filter( 'customify_get_color_palettes', 'rosa2_add_default_color_palettes' );

function rosa2_add_colors_section_to_customify_config( $config ) {

	if ( empty( $config['sections'] ) ) {
		$config['sections'] = array();
	}

	if ( ! isset( $config['sections']['style_manager_section'] ) ) {
		$config['sections']['style_manager_section'] = array();
	}

	// The section might be already defined, thus we merge, not replace the entire section config.
	$config['sections']['style_manager_section'] = Customify_Array::array_merge_recursive_distinct( $config['sections']['style_manager_section'], array(
		'options' => array(
			'sm_color_primary'   => array( 'default' => THEME_COLOR_PRIMARY, ),
			'sm_color_secondary' => array( 'default' => THEME_COLOR_SECONDARY, ),
			'sm_color_tertiary'  => array( 'default' => THEME_COLOR_TERTIARY, ),
			'sm_dark_primary'    => array( 'default' => THEME_DARK_PRIMARY, ),
			'sm_dark_secondary'  => array( 'default' => THEME_DARK_SECONDARY, ),
			'sm_dark_tertiary'   => array( 'default' => THEME_DARK_TERTIARY, ),
			'sm_light_primary'   => array( 'default' => THEME_LIGHT_PRIMARY, ),
			'sm_light_secondary' => array( 'default' => THEME_LIGHT_SECONDARY, ),
			'sm_light_tertiary'  => array( 'default' => THEME_LIGHT_TERTIARY, ),
		),
	) );

	if ( ! isset( $config['sections']['colors_section'] ) ) {
		$config['sections']['colors_section'] = array();
	}

	$config['sections']['colors_section'] = Customify_Array::array_merge_recursive_distinct( $config['sections']['colors_section'], array(
		'title'   => esc_html__( 'Colors', '__theme_txtd' ),
		'options' => array(
			'sm_color_primary'   => array(
				'default'          => THEME_COLOR_PRIMARY,
				'connected_fields' => array(
					'color_1'
				),
			),
			'sm_color_secondary' => array(
				'default'          => THEME_COLOR_SECONDARY,
				'connected_fields' => array(
					'color_2'
				),
			),
			'sm_color_tertiary'  => array(
				'default'          => THEME_COLOR_TERTIARY,
				'connected_fields' => array(
					'color_3'
				),
			),
			'sm_dark_primary'    => array(
				'default'          => THEME_DARK_PRIMARY,
				'connected_fields' => array(
					'color_dark_1'
				),
			),
			'sm_dark_secondary'  => array(
				'default'          => THEME_DARK_SECONDARY,
				'connected_fields' => array(
					'color_dark_2'
				),
			),
			'sm_dark_tertiary'   => array(
				'default'          => THEME_DARK_TERTIARY,
				'connected_fields' => array(
					'color_dark_3'
				),
			),
			'sm_light_primary'   => array(
				'default'          => THEME_LIGHT_PRIMARY,
				'connected_fields' => array(
					'color_light_1'
				),
			),
			'sm_light_secondary' => array(
				'default'          => THEME_LIGHT_SECONDARY,
				'connected_fields' => array(
					'color_light_2'
				),
			),
			'sm_light_tertiary'  => array(
				'default'          => THEME_LIGHT_TERTIARY,
				'connected_fields' => array(
					'color_light_3'
				),
			),
			'color_1'       => array(
				'type'    => 'color',
				'live'    => true,
				'label'   => esc_html__( 'Theme Primary Color', '__theme_txtd' ),
				'default' => THEME_COLOR_PRIMARY,
				'css'     => array(
					array(
						'selector' => ':root',
						'property' => '--theme-color-primary',
					),
				),
			),
			'color_2'       => array(
				'type'    => 'color',
				'live'    => true,
				'label'   => esc_html__( 'Theme Secondary Color', '__theme_txtd' ),
				'default' => THEME_COLOR_SECONDARY,
				'css'     => array(
					array(
						'selector' => ':root',
						'property' => '--theme-color-secondary',
					),
				),
			),
			'color_3'       => array(
				'type'    => 'color',
				'live'    => true,
				'label'   => esc_html__( 'Theme Tertiary Color', '__theme_txtd' ),
				'default' => THEME_COLOR_TERTIARY,
				'css'     => array(
					array(
						'selector' => ':root',
						'property' => '--theme-color-tertiary',
					),
				),
			),
			'color_dark_1'  => array(
				'type'    => 'color',
				'live'    => true,
				'label'   => esc_html__( 'Theme Primary Dark Color', '__theme_txtd' ),
				'default' => THEME_DARK_PRIMARY,
				'css'     => array(
					array(
						'selector' => ':root',
						'property' => '--theme-dark-primary',
					),
				),
			),
			'color_dark_2'  => array(
				'type'    => 'color',
				'live'    => true,
				'label'   => esc_html__( 'Theme Secondary Dark Color', '__theme_txtd' ),
				'default' => THEME_DARK_SECONDARY,
				'css'     => array(
					array(
						'selector' => ':root',
						'property' => '--theme-dark-secondary',
					),
				),
			),
			'color_dark_3'  => array(
				'type'    => 'color',
				'live'    => true,
				'label'   => esc_html__( 'Theme Tertiary Dark Color', '__theme_txtd' ),
				'default' => THEME_DARK_TERTIARY,
				'css'     => array(
					array(
						'selector' => ':root',
						'property' => '--theme-dark-tertiary',
					),
				),
			),
			'color_light_1' => array(
				'type'    => 'color',
				'live'    => true,
				'label'   => esc_html__( 'Theme Primary Light Color', '__theme_txtd' ),
				'default' => THEME_LIGHT_PRIMARY,
				'css'     => array(
					array(
						'selector' => ':root',
						'property' => '--theme-light-primary',
					),
				),
			),
			'color_light_2' => array(
				'type'    => 'color',
				'live'    => true,
				'label'   => esc_html__( 'Theme Secondary Light Color', '__theme_txtd' ),
				'default' => THEME_LIGHT_SECONDARY,
				'css'     => array(
					array(
						'selector' => ':root',
						'property' => '--theme-light-secondary',
					),
				),
			),
			'color_light_3' => array(
				'type'    => 'color',
				'live'    => true,
				'label'   => esc_html__( 'Theme Tertiary Light Color', '__theme_txtd' ),
				'default' => THEME_LIGHT_TERTIARY,
				'css'     => array(
					array(
						'selector' => ':root',
						'property' => '--theme-light-tertiary',
					),
				),
			),
		),
	) );

	return $config;
}

function rosa2_add_default_color_palettes( $color_palettes ) {

	$color_palettes = array_merge( array(
		'default' => array(
			'label'   => esc_html__( 'Theme Default', '__theme_txtd' ),
			'preview' => array(
				'background_image_url' => '//cloud.pixelgrade.com/wp-content/uploads/2018/07/rosa-palette.jpg',
			),
			'options' => array(
				'sm_color_primary'   => THEME_COLOR_PRIMARY,
				'sm_color_secondary' => THEME_COLOR_SECONDARY,
				'sm_color_tertiary'  => THEME_COLOR_TERTIARY,
				'sm_dark_primary'    => THEME_DARK_PRIMARY,
				'sm_dark_secondary'  => THEME_DARK_SECONDARY,
				'sm_dark_tertiary'   => THEME_DARK_TERTIARY,
				'sm_light_primary'   => THEME_LIGHT_PRIMARY,
				'sm_light_secondary' => THEME_LIGHT_SECONDARY,
				'sm_light_tertiary'  => THEME_LIGHT_TERTIARY,
			),
		),
	), $color_palettes );

	return $color_palettes;
}
