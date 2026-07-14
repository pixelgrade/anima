<?php

// If this file is called directly, abort.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Get the unsaved Style Manager font-family default for this distribution.
 *
 * Anima LT bundles Space Grotesk and registers its font face through theme.json.
 * The commercial distribution keeps the cloud-backed system font default.
 *
 * @return string
 */
function anima_get_style_manager_default_font_family() {
	if ( 'anima-lt' === get_template() ) {
		return 'Space Grotesk';
	}

	return 'System Sans-Serif Clear';
}

/**
 * Expose the bundled Anima LT family to Style Manager's font controls.
 *
 * The font face itself belongs to theme.json, so no additional stylesheet
 * source is registered here.
 *
 * @param array $fonts Registered theme fonts.
 * @return array
 */
function anima_add_wporg_style_manager_theme_fonts( $fonts ) {
	if ( 'Space Grotesk' !== anima_get_style_manager_default_font_family() ) {
		return $fonts;
	}

	if ( ! isset( $fonts['Space Grotesk'] ) ) {
		$fonts['Space Grotesk'] = [
			'family'         => 'Space Grotesk',
			'family_display' => 'Space Grotesk',
			'category'       => 'sans-serif',
			'variants'       => [ '300', '400', '500', '600', '700' ],
			'subsets'        => [ 'latin' ],
			'fallback_stack' => '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Helvetica, Arial, sans-serif',
		];
	}

	return $fonts;
}
add_filter( 'style_manager/theme_fonts', 'anima_add_wporg_style_manager_theme_fonts' );

/**
 * Refresh Style Manager's derived field caches once for the Anima LT default.
 *
 * Saved font values live outside these caches and remain untouched. Deleting
 * the derived data instead of only expiring it also lets the next anonymous
 * frontend request rebuild immediately.
 *
 * @return void
 */
function anima_maybe_refresh_wporg_style_manager_font_default_cache() {
	if ( 'Space Grotesk' !== anima_get_style_manager_default_font_family() ) {
		return;
	}

	$config_version = '2026-07-14-space-grotesk-default';
	$version_option = 'anima_style_manager_font_defaults_config_version';

	if ( get_option( $version_option ) === $config_version ) {
		return;
	}

	$cache_options = [
		'pixelgrade_style_manager_customizer_config',
		'pixelgrade_style_manager_options_minimal_details',
		'pixelgrade_style_manager_options_extra_details',
	];

	foreach ( $cache_options as $cache_option ) {
		delete_option( $cache_option );
	}

	update_option( $version_option, $config_version, true );
}
add_action( 'after_setup_theme', 'anima_maybe_refresh_wporg_style_manager_font_default_cache', 20 );

// Add fonts section and options to the Style Manager config
add_filter( 'style_manager/filter_fields', 'anima_add_fonts_section_to_style_manager_config', 60, 1 );

function anima_add_fonts_section_to_style_manager_config( $config ) {
	$default_font_family = anima_get_style_manager_default_font_family();

	$font_size_config = [
		'min'  => 12,
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
		'min'  => 16,
		'max'  => 200,
		'step' => 1,
		'unit' => '',
	];

	$font_size_config_extra_large = [
		'min'  => 60,
		'max'  => 240,
		'step' => 1,
		'unit' => '',
	];

	$line_height_config = [
		'min' => 0.8,
		'max' => 2,
		'step' => 0.05,
		'unit' => '',
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

	$fields_config_extra_large = [
		'font-size'      => $font_size_config_extra_large,
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
				'body_font'    => [
					'type'              => 'font',
					'label'             => esc_html__( 'Body', '__theme_txtd' ),
					'desc'              => esc_html__( '', '__theme_txtd' ),
					'selector'          => ':root',
					'properties_prefix' => '--theme-body-',
					'default'           => [
						'font-family'     => $default_font_family,
						'font-size'       => 16,
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
						'font-family'     => $default_font_family,
						'font-size'       => 21,
						'line-height'     => 1.6,
						'font-weight'     => 500,
						'text-transform'  => 'none',
						'text-decoration' => 'none',
						'letter-spacing'  => - 0.02,
					],
					'fields'            => $fields_config_medium,
					// We want all the font variants for this field since it is a rich content one.
					// 'fields'            => wp_parse_args( [ 'font-weight' => [ 'loadAllVariants' => true ] ], $fields_config_medium ),
				],
				'small_body_font' => [
					'type'              => 'font',
					'label'             => esc_html__( 'Small Text', '__theme_txtd' ),
					'desc'              => esc_html__( 'Smaller sibling of Body for card descriptions, short notes, inline asides, and fine-print paragraphs.', '__theme_txtd' ),
					'selector'          => ':root',
					'properties_prefix' => '--theme-small-body-',
					'default'           => [
						'font-family'     => $default_font_family,
						'font-size'       => 14,
						'line-height'     => 1.5,
						'font-weight'     => 400,
						'text-transform'  => 'none',
						'text-decoration' => 'none',
						'letter-spacing'  => - 0.03,
					],
					// Same control set as Body so authors get full typography controls,
					// including all font weight variants for a rich-content reading role.
					'fields'            => wp_parse_args( [ 'font-weight' => [ 'loadAllVariants' => true ] ], $fields_config ),
				],
				'main_content_title_heading_fonts_section' => [
					'type' => 'html',
					'html' => '<span class="separator sub-section label">' . esc_html__( 'Heading Fonts', '__theme_txtd' ) . '</span>',
				],
				'super_display_font'    => [
					'type'              => 'font',
					'label'             => esc_html__( 'Super Display', '__theme_txtd' ),
					'desc'              => esc_html__( '', '__theme_txtd' ),
					'selector'          => ':root',
					'properties_prefix' => '--theme-super-display-',
					'default'           => [
						'font-family'     => $default_font_family,
						'font-size'       => 165,
						'line-height'     => 1.0,
						'font-weight'     => 700,
						'text-transform'  => 'none',
						'text-decoration' => 'none',
						'letter-spacing'  => - 0.03,
					],
					'fields'            => $fields_config_extra_large,
				],
				'display_font'    => [
					'type'              => 'font',
					'label'             => esc_html__( 'Display', '__theme_txtd' ),
					'desc'              => esc_html__( '', '__theme_txtd' ),
					'selector'          => ':root',
					'properties_prefix' => '--theme-display-',
					'default'           => [
						'font-family'     => $default_font_family,
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
						'font-family'     => $default_font_family,
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
						'font-family'     => $default_font_family,
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
						'font-family'     => $default_font_family,
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
						'font-family'     => $default_font_family,
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
						'font-family'     => $default_font_family,
						'font-size'       => 18,
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
						'font-family'     => $default_font_family,
						'font-size'       => 16,
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
						'font-family' => 'System Handwriting',
					],
					'recommended'       => [],
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
				'site_title_font' => [
					'type'              => 'font',
					'label'             => esc_html__( 'Site Title', '__theme_txtd' ),
					'desc'              => esc_html__( '', '__theme_txtd' ),
					'selector'          => ':root',
					'properties_prefix' => '--theme-site-title-',
					'default'           => [
						'font-family'     => $default_font_family,
						'font-size'       => 32,
						'line-height'     => 1.2,
						'font-weight'     => 700,
						'text-transform'  => 'none',
						'text-decoration' => 'none',
						'letter-spacing'  => - 0.02,
					],
					'fields'            => [
						'font-size'      => false,
						'font-weight'    => true,
						'font-style'     => true,
						'line-height'    => false,
						'letter-spacing' => $letter_spacing_config,
						'text-align'     => false,
						'text-transform' => 'none'
					],
				],
				'navigation_font' => [
					'type'              => 'font',
					'label'             => esc_html__( 'Navigation', '__theme_txtd' ),
					'desc'              => esc_html__( '', '__theme_txtd' ),
					'selector'          => ':root',
					'properties_prefix' => '--theme-navigation-',
					'default'           => [
						'font-family'     => $default_font_family,
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
						'font-family'     => $default_font_family,
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
						'font-family'     => $default_font_family,
						'font-size'       => 16.5,
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
						'font-family'     => $default_font_family,
						'font-size'       => 16,
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
