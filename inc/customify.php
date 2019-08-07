<?php
/**
 * Handle the Customify integration logic.
 */

// If this file is called directly, abort.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

add_filter( 'customify_filter_fields', 'novablocks_add_customify_section', 20, 1 );
add_filter( 'customify_filter_fields', 'novablocks_add_customify_style_manager_section', 20, 1 );

define( 'NOVABLOCKS_THEME_COLOR_PRIMARY', '#203AB6' ); // blue
define( 'NOVABLOCKS_THEME_COLOR_SECONDARY', '#FFE42E' ); // yellow
define( 'NOVABLOCKS_THEME_COLOR_TERTIARY', '#FFE42E' ); // yellow

define( 'NOVABLOCKS_THEME_DARK_PRIMARY', '#000043' ); // blue darker
define( 'NOVABLOCKS_THEME_DARK_SECONDARY', '#272743' ); // text color
define( 'NOVABLOCKS_THEME_DARK_TERTIARY', '#323067' ); // blue dark

define( 'NOVABLOCKS_THEME_LIGHT_PRIMARY', '#FFFFFF' ); // white
define( 'NOVABLOCKS_THEME_LIGHT_SECONDARY', '#EEF1F2' ); // gray
define( 'NOVABLOCKS_THEME_LIGHT_TERTIARY', '#EEF1F2' ); // gray


function novablocks_add_customify_options( $config ) {
	$config['opt-name'] = 'novablocks_options';

	//start with a clean slate - no Customify default sections
	$config['sections'] = array();

	return $config;
}
add_filter( 'customify_filter_fields', 'novablocks_add_customify_options', 10, 1 );

function novablocks_add_customify_section( $config ) {

	$novablocks_section = array(
		// Header
		'novablocks_section' => array(
			'title'   => esc_html__( 'Nova', '__theme_txtd' ),
			'options' => array(
				'novablocks_color_1'       => array(
					'type'    => 'color',
					'live'    => true,
					'label'   => esc_html__( 'Nova Primary Color', '__theme_txtd' ),
					'default' => NOVABLOCKS_THEME_COLOR_PRIMARY,
					'css'     => array(
						array(
							'selector' => ':root',
							'property' => '--nova-color-1',
						),
					),
				),
				'novablocks_color_2'       => array(
					'type'    => 'color',
					'live'    => true,
					'label'   => esc_html__( 'Nova Secondary Color', '__theme_txtd' ),
					'default' => NOVABLOCKS_THEME_COLOR_SECONDARY,
					'css'     => array(
						array(
							'selector' => ':root',
							'property' => '--nova-color-2',
						),
					),
				),
				'novablocks_color_3'       => array(
					'type'    => 'color',
					'live'    => true,
					'label'   => esc_html__( 'Nova Tertiary Color', '__theme_txtd' ),
					'default' => NOVABLOCKS_THEME_COLOR_TERTIARY,
					'css'     => array(
						array(
							'selector' => ':root',
							'property' => '--nova-color-3',
						),
					),
				),
				'novablocks_color_dark_1'  => array(
					'type'    => 'color',
					'live'    => true,
					'label'   => esc_html__( 'Nova Primary Dark Color', '__theme_txtd' ),
					'default' => NOVABLOCKS_THEME_DARK_PRIMARY,
					'css'     => array(
						array(
							'selector' => ':root',
							'property' => '--nova-dark-1',
						),
					),
				),
				'novablocks_color_dark_2'  => array(
					'type'    => 'color',
					'live'    => true,
					'label'   => esc_html__( 'Nova Secondary Dark Color', '__theme_txtd' ),
					'default' => NOVABLOCKS_THEME_DARK_SECONDARY,
					'css'     => array(
						array(
							'selector' => ':root',
							'property' => '--nova-dark-2',
						),
					),
				),
				'novablocks_color_dark_3'  => array(
					'type'    => 'color',
					'live'    => true,
					'label'   => esc_html__( 'Nova Tertiary Dark Color', '__theme_txtd' ),
					'default' => NOVABLOCKS_THEME_DARK_TERTIARY,
					'css'     => array(
						array(
							'selector' => ':root',
							'property' => '--nova-dark-3',
						),
					),
				),
				'novablocks_color_light_1' => array(
					'type'    => 'color',
					'live'    => true,
					'label'   => esc_html__( 'Nova Primary Light Color', '__theme_txtd' ),
					'default' => NOVABLOCKS_THEME_LIGHT_PRIMARY,
					'css'     => array(
						array(
							'selector' => ':root',
							'property' => '--nova-light-1',
						),
					),
				),
				'novablocks_color_light_2' => array(
					'type'    => 'color',
					'live'    => true,
					'label'   => esc_html__( 'Nova Secondary Light Color', '__theme_txtd' ),
					'default' => NOVABLOCKS_THEME_LIGHT_SECONDARY,
					'css'     => array(
						array(
							'selector' => ':root',
							'property' => '--nova-light-2',
						),
					),
				),
				'novablocks_color_light_3' => array(
					'type'    => 'color',
					'live'    => true,
					'label'   => esc_html__( 'Nova Tertiary Light Color', '__theme_txtd' ),
					'default' => NOVABLOCKS_THEME_LIGHT_TERTIARY,
					'css'     => array(
						array(
							'selector' => ':root',
							'property' => '--nova-light-3',
						),
					),
				),
			),
		),
	);


	// make sure we are in good working order
	if ( empty( $config['sections'] ) ) {
		$config['sections'] = array();
	}

	// append the header section
	$config['sections'] = $config['sections'] + $novablocks_section;

	return $config;
}

function novablocks_add_customify_style_manager_section( $options ) {

	if ( ! isset( $options['sections']['style_manager_section'] ) ) {
		$options['sections']['style_manager_section'] = array();
	}

	// The section might be already defined, thus we merge, not replace the entire section config.
	$options['sections']['style_manager_section'] = array_replace_recursive( $options['sections']['style_manager_section'], array(
			'options' => array(
				'sm_color_primary'   => array(
					'default'          => NOVABLOCKS_THEME_COLOR_PRIMARY,
					'connected_fields' => array(
						'novablocks_color_1'
					),
				),
				'sm_color_secondary' => array(
					'default'          => NOVABLOCKS_THEME_COLOR_SECONDARY,
					'connected_fields' => array(
						'novablocks_color_2'
					),
				),
				'sm_color_tertiary'  => array(
					'default'          => NOVABLOCKS_THEME_COLOR_TERTIARY,
					'connected_fields' => array(
						'novablocks_color_3'
					),
				),
				'sm_dark_primary'    => array(
					'default'          => NOVABLOCKS_THEME_DARK_PRIMARY,
					'connected_fields' => array(
						'novablocks_color_dark_1'
					),
				),
				'sm_dark_secondary'  => array(
					'default'          => NOVABLOCKS_THEME_DARK_SECONDARY,
					'connected_fields' => array(
						'novablocks_color_dark_2'
					),
				),
				'sm_dark_tertiary'   => array(
					'default'          => NOVABLOCKS_THEME_DARK_TERTIARY,
					'connected_fields' => array(
						'novablocks_color_dark_3'
					),
				),
				'sm_light_primary'   => array(
					'default'          => NOVABLOCKS_THEME_LIGHT_PRIMARY,
					'connected_fields' => array(
						'novablocks_color_light_1'
					),
				),
				'sm_light_secondary' => array(
					'default'          => NOVABLOCKS_THEME_LIGHT_SECONDARY,
					'connected_fields' => array(
						'novablocks_color_light_2'
					),
				),
				'sm_light_tertiary'  => array(
					'default'          => NOVABLOCKS_THEME_LIGHT_TERTIARY,
					'connected_fields' => array(
						'novablocks_color_light_3'
					),
				),
			),
		)
	);

	return $options;
}

function osteria_add_default_color_palette( $color_palettes ) {

	$color_palettes = array_merge( array(
		'default' => array(
			'label'   => 'Theme Default',
			'preview' => array(
				'background_image_url' => 'https://cloud.pixelgrade.com/wp-content/uploads/2019/08/nova-theme.jpg',
			),
			'options' => array(
				'sm_color_primary'   => NOVABLOCKS_THEME_COLOR_PRIMARY,
				'sm_color_secondary' => NOVABLOCKS_THEME_COLOR_SECONDARY,
				'sm_color_tertiary'  => NOVABLOCKS_THEME_COLOR_TERTIARY,
				'sm_dark_primary'    => NOVABLOCKS_THEME_DARK_PRIMARY,
				'sm_dark_secondary'  => NOVABLOCKS_THEME_DARK_SECONDARY,
				'sm_dark_tertiary'   => NOVABLOCKS_THEME_DARK_TERTIARY,
				'sm_light_primary'   => NOVABLOCKS_THEME_LIGHT_PRIMARY,
				'sm_light_secondary' => NOVABLOCKS_THEME_LIGHT_SECONDARY,
				'sm_light_tertiary'  => NOVABLOCKS_THEME_LIGHT_TERTIARY,
			),
		),
	), $color_palettes );

	return $color_palettes;
}

add_filter( 'customify_get_color_palettes', 'osteria_add_default_color_palette' );
