<?php

// If this file is called directly, abort.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

// Add theme fonts to the font field options list
add_filter( 'customify_theme_fonts', 'anima_add_customify_theme_fonts' );

// Add fonts section and options to the Customify config
add_filter( 'customify_filter_fields', 'anima_add_fonts_section_to_customify_config', 60, 1 );

function anima_add_customify_theme_fonts( $fonts ) {

	$fonts['Reforma1969'] = [
		'family'   => 'Reforma1969',
		'src'      => '//pxgcdn.com/fonts/reforma1969/stylesheet.css',
		'variants' => [ '300', '300italic', '500', '500italic', '700', '700italic' ],
	];

	$fonts['Reforma2018'] = [
		'family'   => 'Reforma2018',
		'src'      => '//pxgcdn.com/fonts/reforma2018/stylesheet.css',
		'variants' => [ '300', '300italic', '500', '500italic', '700', '700italic' ],
	];

	$fonts['League Spartan'] = [
		'family'   => 'League Spartan',
		'src'      => '//pxgcdn.com/fonts/league-spartan/stylesheet.css',
		'variants' => []
	];

	$fonts['HK Grotesk'] = [
		'family'   => 'HK Grotesk',
		'src'      => '//pxgcdn.com/fonts/hk-grotesk/stylesheet.css',
		'variants' => []
	];

	$fonts['YoungSerif'] = [
		'family'   => 'YoungSerif',
		'src'      => '//pxgcdn.com/fonts/young-serif/stylesheet.css',
		'variants' => []
	];

	$fonts['Billy Ohio'] = [
		'family'   => 'Billy Ohio',
		'src'      => '//pxgcdn.com/fonts/billy-ohio/stylesheet.css',
		'variants' => []
	];

	$fonts['Mellony Dry Brush'] = [
		'family'   => 'Mellony Dry Brush',
		'src'      => '//pxgcdn.com/fonts/mellony-dry-brush/stylesheet.css',
		'variants' => []
	];

	$fonts['Jandys Dua'] = [
		'family'   => 'Jandys Dua',
		'src'      => '//pxgcdn.com/fonts/jandys-dua/stylesheet.css',
		'variants' => []
	];

	$fonts['Nermola Script'] = [
		'family'   => 'Nermola Script',
		'src'      => '//pxgcdn.com/fonts/nermola-script/stylesheet.css',
		'variants' => []
	];

	return $fonts;
}

function anima_add_fonts_section_to_customify_config( $config ) {

	$font_size_config = [
		'min'  => 14,
		'max'  => 32,
		'step' => 1,
		'unit' => '',
	];

	$font_size_config_medium = [
		'min'  => 12,
		'max'  => 36,
		'step' => 1,
		'unit' => '',
	];

	$font_size_config_large = [
		'min'  => 18,
		'max'  => 200,
		'step' => 1,
		'unit' => '',
	];

	$line_height_config = [
		'min' => 0.8,
		'max' => 2,
		'step' => 0.05,
		'unit' => 'em',
	];

	$letter_spacing_config = [
		'min'  => - 0.2,
		'max'  => 0.2,
		'step' => 0.01,
		'unit' => 'em',
	];


	$fields_config = [
		'font-size'      => $font_size_config,
		'font-weight'    => true,
		'font-style'    => true,
		'line-height'    => $line_height_config,
		'letter-spacing' => $letter_spacing_config,
		'text-align'     => false,
		'text-transform' => 'none'
	];

	$fields_config_medium = [
		'font-size'      => $font_size_config_medium,
		'font-weight'    => true,
		'font-style'    => true,
		'line-height'    => $line_height_config,
		'letter-spacing' => $letter_spacing_config,
		'text-align'     => false,
		'text-transform' => 'none'
	];

	$fields_config_large = [
		'font-size'      => $font_size_config_large,
		'font-weight'    => true,
		'font-style'    => true,
		'line-height'    => $line_height_config,
		'letter-spacing' => $letter_spacing_config,
		'text-align'     => false,
		'text-transform' => 'none'
	];


	$anima_fonts_section = [
		'fonts_section' => [
			'title'   => esc_html__( 'Fonts', '__theme_txtd' ),
			'options' => [
				'main_content_title_body_fonts_section' => [
					'type' => 'html',
					'html' => '<span class="separator sub-section label">' . esc_html__( 'Body Fonts', '__theme_txtd' ) . '</span>',
				],
				'body_font'       => [
					'type'              => 'font',
					'label'             => esc_html__( 'Body', '__theme_txtd' ),
					'desc'              => esc_html__( '', '__theme_txtd' ),
					'selector'          => ':root',
					'properties_prefix' => '--theme-body-',
					'default'           => [
						'font-family'     => 'Reforma1969',
						'font-size'       => 16,
						'line-height'     => 1.7,
						'font-weight'     => 500,
						'text-transform'  => 'none',
						'text-decoration' => 'none',
						'letter-spacing'  => - 0.03,
					],
					// We want all the font variants for this field since it is a rich content one.
					'fields'            => wp_parse_args( [ 'font-weight' => [ 'loadAllVariants' => true ] ], $fields_config ),
				],
				'content_font'    => [
					'type'              => 'font',
					'label'             => esc_html__( 'Content', '__theme_txtd' ),
					'desc'              => esc_html__( '', '__theme_txtd' ),
					'selector'          => ':root',
					'properties_prefix' => '--theme-content-',
					'default'           => [
						'font-family'     => 'Reforma1969',
						'font-size'       => 18,
						'line-height'     => 1.6,
						'font-weight'     => '500',
						'text-transform'  => 'none',
						'text-decoration' => 'none',
						'letter-spacing'  => - 0.03,
					],
					// We want all the font variants for this field since it is a rich content one.
					'fields'            => wp_parse_args( [ 'font-weight' => [ 'loadAllVariants' => true ] ], $fields_config ),
				],
				'lead_font'    => [
					'type'              => 'font',
					'label'             => esc_html__( 'Lead Paragraphs', '__theme_txtd' ),
					'desc'              => esc_html__( '', '__theme_txtd' ),
					'selector'          => ':root',
					'properties_prefix' => '--theme-lead-',
					'default'           => [
						'font-family'     => 'Reforma1969',
						'font-size'       => 24,
						'line-height'     => 1.6,
						'font-weight'     => 500,
						'text-transform'  => 'none',
						'text-decoration' => 'none',
						'letter-spacing'  => - 0.02,
					],
					// We want all the font variants for this field since it is a rich content one.
					'fields'            => wp_parse_args( [ 'font-weight' => [ 'loadAllVariants' => true ] ], $fields_config_medium ),
				],
				'main_content_title_heading_fonts_section' => [
					'type' => 'html',
					'html' => '<span class="separator sub-section label">' . esc_html__( 'Heading Fonts', '__theme_txtd' ) . '</span>',
				],
				'display_font'    => [
					'type'              => 'font',
					'label'             => esc_html__( 'Display', '__theme_txtd' ),
					'desc'              => esc_html__( '', '__theme_txtd' ),
					'selector'          => ':root',
					'properties_prefix' => '--theme-display-',
					'default'           => [
						'font-family'     => 'Reforma1969',
						'font-size'       => 115,
						'line-height'     => 1.03,
						'font-weight'     => 700,
						'text-transform'  => 'none',
						'text-decoration' => 'none',
						'letter-spacing'  => - 0.03,
					],
					'fields'            => $fields_config_large,
				],
				'heading_1_font'  => [
					'type'              => 'font',
					'label'             => esc_html__( 'Heading 1', '__theme_txtd' ),
					'desc'              => esc_html__( '', '__theme_txtd' ),
					'selector'          => ':root',
					'properties_prefix' => '--theme-heading-1-',
					'default'           => [
						'font-family'     => 'Reforma1969',
						'font-size'       => 66,
						'line-height'     => 1.1,
						'font-weight'     => 700,
						'text-transform'  => 'none',
						'text-decoration' => 'none',
						'letter-spacing'  => - 0.02,
					],
					'fields'            => $fields_config_large,
				],
				'heading_2_font'  => [
					'type'              => 'font',
					'label'             => esc_html__( 'Heading 2', '__theme_txtd' ),
					'desc'              => esc_html__( '', '__theme_txtd' ),
					'selector'          => ':root',
					'properties_prefix' => '--theme-heading-2-',
					'default'           => [
						'font-family'     => 'Reforma1969',
						'font-size'       => 40,
						'line-height'     => 1.2,
						'font-weight'     => 700,
						'text-transform'  => 'none',
						'text-decoration' => 'none',
						'letter-spacing'  => - 0.02,
					],
					'fields'            => $fields_config_large,
				],
				'heading_3_font'  => [
					'type'              => 'font',
					'label'             => esc_html__( 'Heading 3', '__theme_txtd' ),
					'desc'              => esc_html__( '', '__theme_txtd' ),
					'selector'          => ':root',
					'properties_prefix' => '--theme-heading-3-',
					'default'           => [
						'font-family'     => 'Reforma1969',
						'font-size'       => 32,
						'line-height'     => 1.2,
						'font-weight'     => 700,
						'text-transform'  => 'none',
						'text-decoration' => 'none',
						'letter-spacing'  => - 0.02,
					],
					'fields'            => $fields_config_large,
				],
				'heading_4_font'  => [
					'type'              => 'font',
					'label'             => esc_html__( 'Heading 4', '__theme_txtd' ),
					'desc'              => esc_html__( '', '__theme_txtd' ),
					'selector'          => ':root',
					'properties_prefix' => '--theme-heading-4-',
					'default'           => [
						'font-family'     => 'Reforma1969',
						'font-size'       => 24,
						'line-height'     => 1.2,
						'font-weight'     => 700,
						'text-transform'  => 'none',
						'text-decoration' => 'none',
						'letter-spacing'  => - 0.02,
					],
					'fields'            => $fields_config_medium,
				],
				'heading_5_font'  => [
					'type'              => 'font',
					'label'             => esc_html__( 'Heading 5', '__theme_txtd' ),
					'desc'              => esc_html__( '', '__theme_txtd' ),
					'selector'          => ':root',
					'properties_prefix' => '--theme-heading-5-',
					'default'           => [
						'font-family'     => 'Reforma2018',
						'font-size'       => 17,
						'line-height'     => 1.5,
						'font-weight'     => 700,
						'text-transform'  => 'none',
						'text-decoration' => 'none',
						'letter-spacing'  => 0.017,
					],
					'fields'            => $fields_config_medium,
				],
				'heading_6_font'  => [
					'type'              => 'font',
					'label'             => esc_html__( 'Heading 6', '__theme_txtd' ),
					'desc'              => esc_html__( '', '__theme_txtd' ),
					'selector'          => ':root',
					'properties_prefix' => '--theme-heading-6-',
					'default'           => [
						'font-family'     => 'Reforma2018',
						'font-size'       => 17,
						'line-height'     => 1.5,
						'font-weight'     => 500,
						'text-transform'  => 'none',
						'text-decoration' => 'none',
						'letter-spacing'  => 0.017,
					],
					'fields'            => $fields_config_medium,
				],
				'accent_font'     => [
					'type'              => 'font',
					'label'             => esc_html__( 'Accent', '__theme_txtd' ),
					'desc'              => esc_html__( '', '__theme_txtd' ),
					'selector'          => ':root',
					'properties_prefix' => '--theme-accent-',
					'default'           => [
						'font-family' => 'Billy Ohio',
					],
					'recommended'       => [
						'Billy Ohio',
						'Mellony Dry Brush',
						'Jandys Dua',
						'Nermola Script',
					],
				],
				'headline_lines_spacings'   =>  [
					'type'        => 'range',
					'label'       => esc_html__( 'Headline Lines Spacing', '__theme_txtd' ),
					'desc'        => esc_html__( 'The vertical distance between primary and secondary titles.', '__theme_txtd' ),
					'live'        => true,
					'default'     => -0.3,
					'input_attrs' => [
						'min'          => -1,
						'max'          => 0.3,
						'step'         => 0.1,
						'data-preview' => true,
					],
					'css'         => [
						[
							'property' => '--theme-headline-spacing-setting',
							'selector' => ':root',
							'unit'     => '',
						],
					],
				],
				'main_content_title_other_fonts_section' => [
					'type' => 'html',
					'html' => '<span class="separator sub-section label">' . esc_html__( 'Other Fonts', '__theme_txtd' ) . '</span>',
				],
				'navigation_font' => [
					'type'              => 'font',
					'label'             => esc_html__( 'Navigation', '__theme_txtd' ),
					'desc'              => esc_html__( '', '__theme_txtd' ),
					'selector'          => ':root',
					'properties_prefix' => '--theme-navigation-',
					'default'           => [
						'font-family'     => 'Reforma2018',
						'font-size'       => 17,
						'line-height'     => 1.5,
						'font-weight'     => 500,
						'text-transform'  => 'none',
						'text-decoration' => 'none',
						'letter-spacing'  => 0.017,
					],
					'fields'            => $fields_config,
				],
				'buttons_font' => [
					'type'              => 'font',
					'label'             => esc_html__( 'Buttons', '__theme_txtd' ),
					'desc'              => esc_html__( '', '__theme_txtd' ),
					'selector'          => ':root',
					'properties_prefix' => '--theme-button-',
					'default'           => [
						'font-family'     => 'Reforma2018',
						'font-size'       => 17,
						'line-height'     => 1.2,
						'font-weight'     => 500,
						'text-transform'  => 'none',
						'text-decoration' => 'none',
						'letter-spacing'  => 0.03,
					],
					'fields'            => $fields_config,
				],
				'input_font' => [
					'type'              => 'font',
					'label'             => esc_html__( 'Fields', '__theme_txtd' ),
					'desc'              => esc_html__( '', '__theme_txtd' ),
					'selector'          => ':root',
					'properties_prefix' => '--theme-input-',
					'default'           => [
						'font-family'     => 'Reforma2018',
						'font-size'       => 17,
						'line-height'     => 1.2,
						'font-weight'     => 500,
						'text-transform'  => 'none',
						'text-decoration' => 'none',
						'letter-spacing'  => 0.03,
					],
					'fields'            => $fields_config,
				],
				'meta_font'  => [
					'type'              => 'font',
					'label'             => esc_html__( 'Meta', '__theme_txtd' ),
					'desc'              => esc_html__( '', '__theme_txtd' ),
					'selector'          => ':root',
					'properties_prefix' => '--theme-meta-',
					'default'           => [
						'font-family'     => 'Reforma2018',
						'font-size'       => 17,
						'line-height'     => 1.5,
						'font-weight'     => 500,
						'text-transform'  => 'none',
						'text-decoration' => 'none',
						'letter-spacing'  => 0.017,
					],
					'fields'            => $fields_config,
				],
			],
		]
	];

	if ( empty( $config['sections'] ) ) {
		$config['sections'] = [];
	}

	$config['sections'] = $config['sections'] + $anima_fonts_section;

	return $config;
}
