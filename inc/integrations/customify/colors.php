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
add_filter( 'customify_filter_fields', 'anima_add_colors_section_to_customify_config', 50, 1 );

// Prepend theme color palette to the default color palettes list
add_filter( 'customify_get_color_palettes', 'anima_add_default_color_palettes' );

function anima_add_colors_section_to_customify_config( array $config ): array {

	if ( empty( $config['sections'] ) ) {
		$config['sections'] = [];
	}

	if ( ! isset( $config['sections']['style_manager_section'] ) ) {
		$config['sections']['style_manager_section'] = [];
	}

	// The section might be already defined, thus we merge, not replace the entire section config.
	$config['sections']['style_manager_section'] = Customify_Array::array_merge_recursive_distinct( $config['sections']['style_manager_section'], [
		'options' => [
			'sm_color_primary'   => [ 'default' => THEME_COLOR_PRIMARY, ],
			'sm_color_secondary' => [ 'default' => THEME_COLOR_SECONDARY, ],
			'sm_color_tertiary'  => [ 'default' => THEME_COLOR_TERTIARY, ],
			'sm_dark_primary'    => [ 'default' => THEME_DARK_PRIMARY, ],
			'sm_dark_secondary'  => [ 'default' => THEME_DARK_SECONDARY, ],
			'sm_dark_tertiary'   => [ 'default' => THEME_DARK_TERTIARY, ],
			'sm_light_primary'   => [ 'default' => THEME_LIGHT_PRIMARY, ],
			'sm_light_secondary' => [ 'default' => THEME_LIGHT_SECONDARY, ],
			'sm_light_tertiary'  => [ 'default' => THEME_LIGHT_TERTIARY, ],
		],
	] );

	if ( ! isset( $config['sections']['colors_section'] ) ) {
		$config['sections']['colors_section'] = [];
	}

	$config['sections']['colors_section'] = Customify_Array::array_merge_recursive_distinct( $config['sections']['colors_section'], [
		'title'   => esc_html__( 'Colors', '__theme_txtd' ),
		'options' => [
			'sm_color_primary'   => [
				'default'          => THEME_COLOR_PRIMARY,
				'connected_fields' => [
					'color_1'
				],
			],
			'sm_color_secondary' => [
				'default'          => THEME_COLOR_SECONDARY,
				'connected_fields' => [
					'color_2'
				],
			],
			'sm_color_tertiary'  => [
				'default'          => THEME_COLOR_TERTIARY,
				'connected_fields' => [
					'color_3'
				],
			],
			'sm_dark_primary'    => [
				'default'          => THEME_DARK_PRIMARY,
				'connected_fields' => [
					'color_dark_1'
				],
			],
			'sm_dark_secondary'  => [
				'default'          => THEME_DARK_SECONDARY,
				'connected_fields' => [
					'color_dark_2'
				],
			],
			'sm_dark_tertiary'   => [
				'default'          => THEME_DARK_TERTIARY,
				'connected_fields' => [
					'color_dark_3'
				],
			],
			'sm_light_primary'   => [
				'default'          => THEME_LIGHT_PRIMARY,
				'connected_fields' => [
					'color_light_1'
				],
			],
			'sm_light_secondary' => [
				'default'          => THEME_LIGHT_SECONDARY,
				'connected_fields' => [
					'color_light_2'
				],
			],
			'sm_light_tertiary'  => [
				'default'          => THEME_LIGHT_TERTIARY,
				'connected_fields' => [
					'color_light_3'
				],
			],
			'color_1'       => [
				'type'    => 'color',
				'live'    => true,
				'label'   => esc_html__( 'Theme Primary Color', '__theme_txtd' ),
				'default' => THEME_COLOR_PRIMARY,
				'css'     => [
					[
						'selector' => ':root',
						'property' => '--theme-color-primary',
					],
				],
			],
			'color_2'       => [
				'type'    => 'color',
				'live'    => true,
				'label'   => esc_html__( 'Theme Secondary Color', '__theme_txtd' ),
				'default' => THEME_COLOR_SECONDARY,
				'css'     => [
					[
						'selector' => ':root',
						'property' => '--theme-color-secondary',
					],
				],
			],
			'color_3'       => [
				'type'    => 'color',
				'live'    => true,
				'label'   => esc_html__( 'Theme Tertiary Color', '__theme_txtd' ),
				'default' => THEME_COLOR_TERTIARY,
				'css'     => [
					[
						'selector' => ':root',
						'property' => '--theme-color-tertiary',
					],
				],
			],
			'color_dark_1'  => [
				'type'    => 'color',
				'live'    => true,
				'label'   => esc_html__( 'Theme Primary Dark Color', '__theme_txtd' ),
				'default' => THEME_DARK_PRIMARY,
				'css'     => [
					[
						'selector' => ':root',
						'property' => '--theme-dark-primary',
					],
				],
			],
			'color_dark_2'  => [
				'type'    => 'color',
				'live'    => true,
				'label'   => esc_html__( 'Theme Secondary Dark Color', '__theme_txtd' ),
				'default' => THEME_DARK_SECONDARY,
				'css'     => [
					[
						'selector' => ':root',
						'property' => '--theme-dark-secondary',
					],
				],
			],
			'color_dark_3'  => [
				'type'    => 'color',
				'live'    => true,
				'label'   => esc_html__( 'Theme Tertiary Dark Color', '__theme_txtd' ),
				'default' => THEME_DARK_TERTIARY,
				'css'     => [
					[
						'selector' => ':root',
						'property' => '--theme-dark-tertiary',
					],
				],
			],
			'color_light_1' => [
				'type'    => 'color',
				'live'    => true,
				'label'   => esc_html__( 'Theme Primary Light Color', '__theme_txtd' ),
				'default' => THEME_LIGHT_PRIMARY,
				'css'     => [
					[
						'selector' => ':root',
						'property' => '--theme-light-primary',
					],
				],
			],
			'color_light_2' => [
				'type'    => 'color',
				'live'    => true,
				'label'   => esc_html__( 'Theme Secondary Light Color', '__theme_txtd' ),
				'default' => THEME_LIGHT_SECONDARY,
				'css'     => [
					[
						'selector' => ':root',
						'property' => '--theme-light-secondary',
					],
				],
			],
			'color_light_3' => [
				'type'    => 'color',
				'live'    => true,
				'label'   => esc_html__( 'Theme Tertiary Light Color', '__theme_txtd' ),
				'default' => THEME_LIGHT_TERTIARY,
				'css'     => [
					[
						'selector' => ':root',
						'property' => '--theme-light-tertiary',
					],
				],
			],
		],
	] );

	return $config;
}

function anima_add_default_color_palettes( array $color_palettes ): array {

	return array_merge( [
		'default' => [
			'label'   => esc_html__( 'Theme Default', '__theme_txtd' ),
			'preview' => [
				'background_image_url' => '//cloud.pixelgrade.com/wp-content/uploads/2018/07/rosa-palette.jpg',
			],
			'options' => [
				'sm_color_primary'   => THEME_COLOR_PRIMARY,
				'sm_color_secondary' => THEME_COLOR_SECONDARY,
				'sm_color_tertiary'  => THEME_COLOR_TERTIARY,
				'sm_dark_primary'    => THEME_DARK_PRIMARY,
				'sm_dark_secondary'  => THEME_DARK_SECONDARY,
				'sm_dark_tertiary'   => THEME_DARK_TERTIARY,
				'sm_light_primary'   => THEME_LIGHT_PRIMARY,
				'sm_light_secondary' => THEME_LIGHT_SECONDARY,
				'sm_light_tertiary'  => THEME_LIGHT_TERTIARY,
			],
		],
	], $color_palettes );
}
