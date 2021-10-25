<?php
/**
 * Handle the Customify integration logic.
 */

// If this file is called directly, abort.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

// pixelgrade_option
require_once __DIR__ . '/extras.php';

// If the Style Manager plugin is active, don't load the Customify integration.
if ( class_exists( 'PixCustomifyPlugin' ) && ! defined( '\Pixelgrade\StyleManager\VERSION' ) ) {

	require_once __DIR__ . '/colors.php';
	require_once __DIR__ . '/fonts.php';
	require_once __DIR__ . '/connected-fields.php';
	require_once __DIR__ . '/layout.php';

	// Add new options to the Customify config
	add_filter( 'customify_filter_fields', 'anima_add_customify_options', 11, 1 );

	add_filter( 'customify_filter_fields', 'anima_add_header_section_to_customify_config', 20, 1 );
	add_filter( 'customify_filter_fields', 'anima_add_separators_section_to_customify_config', 30, 1 );
	add_filter( 'customify_filter_fields', 'anima_add_content_section_to_customify_config', 40, 1 );
}


function anima_add_customify_options( $config ) {
	$config['opt-name'] = 'anima_options';

	//start with a clean slate - no Customify default sections
	$config['sections'] = array();

	return $config;
}

function anima_add_header_section_to_customify_config( $config ) {

	$anima_header_section = array(
		'header_section' => array(
			'title'   => esc_html__( 'Header', '__theme_txtd' ),
			'options' => array(
				'header_logo_height'              => array(
					'type'        => 'range',
					'label'       => esc_html__( 'Logo Height', '__theme_txtd' ),
					'desc'        => esc_html__( 'Adjust the height of your logo.', '__theme_txtd' ),
					'live'        => true,
					'default'     => 22,
					'input_attrs' => array(
						'min'          => 20,
						'max'          => 200,
						'step'         => 1,
						'data-preview' => true,
					),
					'css'         => array(
						array(
							'property' => '--theme-header-logo-height-setting',
							'selector' => ':root',
							'unit'     => '',
						),
					),
				),
				'mobile_header_logo_height'       => array(
					'type'        => 'range',
					'label'       => esc_html__( 'Mobile Logo Height', '__theme_txtd' ),
					'desc'        => esc_html__( 'Adjust the height of your logo on small screens.', '__theme_txtd' ),
					'live'        => true,
					'default'     => 20,
					'input_attrs' => array(
						'min'          => 10,
						'max'          => 150,
						'step'         => 1,
						'data-preview' => true,
					),
					'css'         => array(
						array(
							'property' => '--theme-mobile-header-logo-height',
							'selector' => ':root',
							'unit'     => 'px',
						),
					),
				),
				'header_navigation_links_spacing' => array(
					'type'        => 'range',
					'label'       => esc_html__( 'Navigation Link Spacing', '__theme_txtd' ),
					'desc'        => esc_html__( 'Adjust the spacing between individual items in your navigation.', '__theme_txtd' ),
					'live'        => true,
					'default'     => 32,
					'input_attrs' => array(
						'min'          => 12,
						'max'          => 75,
						'step'         => 1,
						'data-preview' => true,
					),
					'css'         => array(
						array(
							'property' => '--theme-header-links-spacing-setting',
							'selector' => ':root',
							'unit'     => '',
						),
					),
				),
				'header_position'                 => array(
					'type'    => 'select',
					'label'   => esc_html__( 'Header Position on Scroll', '__theme_txtd' ),
					'desc'    => esc_html__( 'Note: to prevent your content from being annoyingly hidden behind the Header on smaller screens, the Sticky option will remain active only if the Header height is larger than 20% of the browser window height.', '__theme_txtd' ),
					'default' => 'sticky',
					'choices' => array(
						'static' => esc_html__( 'Static', '__theme_txtd' ),
						'sticky' => esc_html__( 'Sticky (fixed)', '__theme_txtd' ),
					),
				),
				'header_sides_spacing'            => array(
					'type'        => 'range',
					'label'       => esc_html__( 'Header Sides Spacing', '__theme_txtd' ),
					'desc'        => esc_html__( 'Adjust the space separating the header and the sides of the browser.', '__theme_txtd' ),
					'live'        => true,
					'default'     => 48, // this should be set by the theme (previously 40)
					'input_attrs' => array(
						'min'          => 0,
						'max'          => 140,
						'step'         => 1,
						'data-preview' => true,
					),
					'css'         => array(
						array(
							'property' => '--theme-header-sides-spacing-setting',
							'selector' => ':root',
							'unit'     => '',
						),
					),
				),
			),
		),
	);

	if ( empty( $config['sections'] ) ) {
		$config['sections'] = array();
	}

	$config['sections'] = $config['sections'] + $anima_header_section;

	return $config;
}

function anima_add_content_section_to_customify_config( $config ) {

	$anima_content_section = array(
		'content_section' => array(
			'title'   => esc_html__( 'Content', '__theme_txtd' ),
			'options' => array(
				'this_divider_8874320137'      => array(
					'type' => 'html',
					'html' => '<span class="separator label large">' . esc_html__( 'Archive', '__theme_txtd' ) . '</span>'
				),
				'display_categories_on_archive'    => array(
					'type'    => 'checkbox',
					'label'   => esc_html__( 'Display Categories', '__theme_txtd' ),
					'default' => true,
				),
				'display_tags_on_archive'          => array(
					'type'    => 'checkbox',
					'label'   => esc_html__( 'Display Tags', '__theme_txtd' ),
					'default' => false,
				),
				'display_date_on_archive'          => array(
					'type'    => 'checkbox',
					'label'   => esc_html__( 'Display Date', '__theme_txtd' ),
					'default' => true,
				),
				'display_author_on_archive'        => array(
					'type'    => 'checkbox',
					'label'   => esc_html__( 'Display Author', '__theme_txtd' ),
					'default' => false,
				),
				'this_divider_8874320138'      => array(
					'type' => 'html',
					'html' => '<span class="separator label large">' . esc_html__( 'Article', '__theme_txtd' ) . '</span>'
				),
				'display_sharing_button_on_single' => array(
					'type'    => 'checkbox',
					'label'   => esc_html__( 'Display Sharing Buttons', '__theme_txtd' ),
					'default' => false,
				)
			),
		),
	);

	if ( empty( $config['sections'] ) ) {
		$config['sections'] = array();
	}

	$config['sections'] = $config['sections'] + $anima_content_section;

	return $config;
}

function anima_add_separators_section_to_customify_config( $config ) {

	$separator_symbol_values = array(
		'fleuron-1',
		'fleuron-2',
		'fleuron-3',
		'fleuron-4',
		'fleuron-5',
	);

	$separator_symbol_choices = array();
	foreach ( $separator_symbol_values as $symbol ) {
		ob_start();
		get_template_part( 'template-parts/separators/' . $symbol . '-svg' );
		$separator_symbol_choices[ $symbol ] = ob_get_clean();
	}

	// Bail if we have not choices.
	if ( empty( $separator_symbol_choices ) ) {
		return $config;
	}

	$anima_separators_section = array(
		'separators_section' => array(
			'title'   => esc_html__( 'Separators', '__theme_txtd' ),
			'options' => array(
				'separator_symbol'              => array(
					'type'    => 'radio_html',
					'label'   => esc_html__( 'Separator Symbol', '__theme_txtd' ),
					'default' => 'fleuron-1',
					'choices' => $separator_symbol_choices,
				),
			),
		),
	);

	if ( empty( $config['sections'] ) ) {
		$config['sections'] = array();
	}

	$config['sections'] = $config['sections'] + $anima_separators_section;

	return $config;
}
