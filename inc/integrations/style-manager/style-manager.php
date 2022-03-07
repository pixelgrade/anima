<?php
/**
 * Handle the Style Manager integration logic.
 */

// If this file is called directly, abort.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

// pixelgrade_option
require_once __DIR__ . '/extras.php';

if ( defined( '\Pixelgrade\StyleManager\VERSION' ) ) {

	require_once __DIR__ . '/colors.php';
	require_once __DIR__ . '/fonts.php';
	require_once __DIR__ . '/connected-fields.php';

	// Add new options to the Style Manager config
	add_filter( 'style_manager/filter_fields', 'anima_add_style_manager_options', 11, 1 );

	add_filter( 'style_manager/filter_fields', 'anima_add_header_section_to_style_manager_config', 20, 1 );
	add_filter( 'style_manager/filter_fields', 'anima_add_separators_section_to_style_manager_config', 30, 1 );
	add_filter( 'style_manager/filter_fields', 'anima_add_content_section_to_style_manager_config', 40, 1 );
}


function anima_add_style_manager_options( $config ) {
	$config['opt-name'] = 'anima_options';

	//start with a clean slate - no Style Manager default sections
	$config['sections'] = [];

	return $config;
}

function anima_add_header_section_to_style_manager_config( $config ) {

	$anima_header_section = [
		'header_section' => [
			'title'   => esc_html__( 'Header', '__theme_txtd' ),
			'options' => [
				'header_logo_height'              => [
					'type'        => 'range',
					'label'       => esc_html__( 'Logo Height', '__theme_txtd' ),
					'desc'        => esc_html__( 'Adjust the height of your logo.', '__theme_txtd' ),
					'live'        => true,
					'default'     => 22,
					'input_attrs' => [
						'min'          => 20,
						'max'          => 200,
						'step'         => 1,
						'data-preview' => true,
					],
					'css'         => [
						[
							'property' => '--theme-header-logo-height-setting',
							'selector' => ':root',
							'unit'     => '',
						],
					],
				],
				'mobile_header_logo_height'       => [
					'type'        => 'range',
					'label'       => esc_html__( 'Mobile Logo Height', '__theme_txtd' ),
					'desc'        => esc_html__( 'Adjust the height of your logo on small screens.', '__theme_txtd' ),
					'live'        => true,
					'default'     => 24,
					'input_attrs' => [
						'min'          => 14,
						'max'          => 80,
						'step'         => 1,
						'data-preview' => true,
					],
					'css'         => [
						[
							'property' => '--theme-mobile-header-logo-height-setting',
							'selector' => ':root',
							'unit'     => '',
						],
					],
				],
				'header_navigation_links_spacing' => [
					'type'        => 'range',
					'label'       => esc_html__( 'Navigation Link Spacing', '__theme_txtd' ),
					'desc'        => esc_html__( 'Adjust the spacing between individual items in your navigation.', '__theme_txtd' ),
					'live'        => true,
					'default'     => 32,
					'input_attrs' => [
						'min'          => 12,
						'max'          => 75,
						'step'         => 1,
						'data-preview' => true,
					],
					'css'         => [
						[
							'property' => '--theme-header-links-spacing-setting',
							'selector' => ':root',
							'unit'     => '',
						],
					],
				],
				'header_sides_spacing'            => [
					'type'        => 'range',
					'label'       => esc_html__( 'Header Sides Spacing', '__theme_txtd' ),
					'desc'        => esc_html__( 'Adjust the space separating the header and the sides of the browser.', '__theme_txtd' ),
					'live'        => true,
					'default'     => 50, // this should be set by the theme (previously 40)
					'input_attrs' => [
						'min'          => 0,
						'max'          => 100,
						'step'         => 1,
						'data-preview' => true,
					],
					'css'         => [
						[
							'property' => '--theme-header-sides-spacing-setting',
							'selector' => ':root',
							'unit'     => '',
						],
					],
				],
			],
		],
	];

	if ( empty( $config['sections'] ) ) {
		$config['sections'] = [];
	}

	$config['sections'] = $config['sections'] + $anima_header_section;

	return $config;
}

function anima_add_content_section_to_style_manager_config( $config ) {

	$anima_content_section = [
		'content_section' => [
			'title'   => esc_html__( 'Content', '__theme_txtd' ),
			'options' => [
				'this_divider_8874320137'      => [
					'type' => 'html',
					'html' => '<span class="separator label large">' . esc_html__( 'Archive', '__theme_txtd' ) . '</span>'
				],
				'display_categories_on_archive'    => [
					'type'    => 'checkbox',
					'label'   => esc_html__( 'Display Categories', '__theme_txtd' ),
					'default' => true,
				],
				'display_tags_on_archive'          => [
					'type'    => 'checkbox',
					'label'   => esc_html__( 'Display Tags', '__theme_txtd' ),
					'default' => false,
				],
				'display_date_on_archive'          => [
					'type'    => 'checkbox',
					'label'   => esc_html__( 'Display Date', '__theme_txtd' ),
					'default' => true,
				],
				'display_author_on_archive'        => [
					'type'    => 'checkbox',
					'label'   => esc_html__( 'Display Author', '__theme_txtd' ),
					'default' => false,
				],
				'this_divider_8874320138'      => [
					'type' => 'html',
					'html' => '<span class="separator label large">' . esc_html__( 'Article', '__theme_txtd' ) . '</span>'
				],
				'display_sharing_button_on_single' => [
					'type'    => 'checkbox',
					'label'   => esc_html__( 'Display Sharing Buttons', '__theme_txtd' ),
					'default' => false,
				]
			],
		],
	];

	if ( empty( $config['sections'] ) ) {
		$config['sections'] = [];
	}

	$config['sections'] = $config['sections'] + $anima_content_section;

	return $config;
}

function anima_add_separators_section_to_style_manager_config( $config ) {

	$separator_symbol_values = [
		'fleuron-1',
		'fleuron-2',
		'fleuron-3',
		'fleuron-4',
		'fleuron-5',
	];

	$separator_symbol_choices = [];
	foreach ( $separator_symbol_values as $symbol ) {
		ob_start();
		get_template_part( 'template-parts/separators/' . $symbol . '-svg' );
		$separator_symbol_choices[ $symbol ] = ob_get_clean();
	}

	// Bail if we have not choices.
	if ( empty( $separator_symbol_choices ) ) {
		return $config;
	}

	$anima_separators_section = [
		'separators_section' => [
			'title'   => esc_html__( 'Separators', '__theme_txtd' ),
			'options' => [
				'separator_symbol'              => [
					'type'    => 'radio_html',
					'label'   => esc_html__( 'Separator Symbol', '__theme_txtd' ),
					'default' => 'fleuron-1',
					'choices' => $separator_symbol_choices,
				],
			],
		],
	];

	if ( empty( $config['sections'] ) ) {
		$config['sections'] = [];
	}

	$config['sections'] = $config['sections'] + $anima_separators_section;

	return $config;
}


