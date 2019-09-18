<?php
/**
 * Handle the Customify integration logic.
 */

// If this file is called directly, abort.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

add_filter( 'customify_filter_fields', 'rosa2_add_customify_section', 20, 1 );
add_filter( 'customify_filter_fields', 'rosa2_add_customify_style_manager_section', 20, 1 );


define( 'ROSA2_THEME_COLOR_PRIMARY', '#DDAB5D' ); // gold
define( 'ROSA2_THEME_COLOR_SECONDARY', '#39497C' ); // blue
define( 'ROSA2_THEME_COLOR_TERTIARY', '#B12C4A' ); // red

define( 'ROSA2_THEME_DARK_PRIMARY', '#212B49' ); // dark blue
define( 'ROSA2_THEME_DARK_SECONDARY', '#34394B' ); // dark light blue
define( 'ROSA2_THEME_DARK_TERTIARY', '#141928' ); // darker blue

define( 'ROSA2_THEME_LIGHT_PRIMARY', '#FFFFFF' ); // white
define( 'ROSA2_THEME_LIGHT_SECONDARY', '#CCCCCC' ); // gray
define( 'ROSA2_THEME_LIGHT_TERTIARY', '#EEEFF2' ); // light gray


function rosa2_add_customify_options( $config ) {
	$config['opt-name'] = 'rosa2_options';

	//start with a clean slate - no Customify default sections
	$config['sections'] = array();

	return $config;
}
add_filter( 'customify_filter_fields', 'rosa2_add_customify_options', 10, 1 );

function rosa2_add_customify_section( $config ) {

	$separator_symbol_choices = array();
	$separator_symbol_values = array(
		'fleuron-1',
		'fleuron-2',
		'fleuron-3',
		'fleuron-4',
		'fleuron-5',
	);

	foreach ( $separator_symbol_values as $symbol ) {
		ob_start();
		get_template_part( 'template-parts/separators/' . $symbol . '-svg' );
		$separator_symbol_choices[$symbol] = ob_get_clean();
	}

	$rosa2_section = array(
		// Header
		'rosa2_section' => array(
			'title'   => esc_html__( 'Rosa', '__theme_txtd' ),
			'options' => array(
				'rosa2_color_1'       => array(
					'type'    => 'color',
					'live'    => true,
					'label'   => esc_html__( 'Rosa Primary Color', '__theme_txtd' ),
					'default' => ROSA2_THEME_COLOR_PRIMARY,
					'css'     => array(
						array(
							'selector' => ':root',
							'property' => '--nova-color-1',
						),
					),
				),
				'rosa2_color_2'       => array(
					'type'    => 'color',
					'live'    => true,
					'label'   => esc_html__( 'Rosa Secondary Color', '__theme_txtd' ),
					'default' => ROSA2_THEME_COLOR_SECONDARY,
					'css'     => array(
						array(
							'selector' => ':root',
							'property' => '--nova-color-2',
						),
					),
				),
				'rosa2_color_3'       => array(
					'type'    => 'color',
					'live'    => true,
					'label'   => esc_html__( 'Rosa Tertiary Color', '__theme_txtd' ),
					'default' => ROSA2_THEME_COLOR_TERTIARY,
					'css'     => array(
						array(
							'selector' => ':root',
							'property' => '--nova-color-3',
						),
					),
				),
				'rosa2_color_dark_1'  => array(
					'type'    => 'color',
					'live'    => true,
					'label'   => esc_html__( 'Rosa Primary Dark Color', '__theme_txtd' ),
					'default' => ROSA2_THEME_DARK_PRIMARY,
					'css'     => array(
						array(
							'selector' => ':root',
							'property' => '--nova-dark-1',
						),
					),
				),
				'rosa2_color_dark_2'  => array(
					'type'    => 'color',
					'live'    => true,
					'label'   => esc_html__( 'Rosa Secondary Dark Color', '__theme_txtd' ),
					'default' => ROSA2_THEME_DARK_SECONDARY,
					'css'     => array(
						array(
							'selector' => ':root',
							'property' => '--nova-dark-2',
						),
					),
				),
				'rosa2_color_dark_3'  => array(
					'type'    => 'color',
					'live'    => true,
					'label'   => esc_html__( 'Rosa Tertiary Dark Color', '__theme_txtd' ),
					'default' => ROSA2_THEME_DARK_TERTIARY,
					'css'     => array(
						array(
							'selector' => ':root',
							'property' => '--nova-dark-3',
						),
					),
				),
				'rosa2_color_light_1' => array(
					'type'    => 'color',
					'live'    => true,
					'label'   => esc_html__( 'Rosa Primary Light Color', '__theme_txtd' ),
					'default' => ROSA2_THEME_LIGHT_PRIMARY,
					'css'     => array(
						array(
							'selector' => ':root',
							'property' => '--nova-light-1',
						),
					),
				),
				'rosa2_color_light_2' => array(
					'type'    => 'color',
					'live'    => true,
					'label'   => esc_html__( 'Rosa Secondary Light Color', '__theme_txtd' ),
					'default' => ROSA2_THEME_LIGHT_SECONDARY,
					'css'     => array(
						array(
							'selector' => ':root',
							'property' => '--nova-light-2',
						),
					),
				),
				'rosa2_color_light_3' => array(
					'type'    => 'color',
					'live'    => true,
					'label'   => esc_html__( 'Rosa Tertiary Light Color', '__theme_txtd' ),
					'default' => ROSA2_THEME_LIGHT_TERTIARY,
					'css'     => array(
						array(
							'selector' => ':root',
							'property' => '--nova-light-3',
						),
					),
				),
			),
		),
		'main_content' => array(
			'title'   => esc_html__( 'Main Content', '__theme_txtd' ),
			'options' => array(
				'separator_symbol' => array(
					'type'    => 'radio_html',
					'label'   => esc_html__( 'Separator Symbol', '__theme_txtd' ),
					'default' => 'fleuron-1',
					'choices' => $separator_symbol_choices,
				),
			),
		),
	);


	// make sure we are in good working order
	if ( empty( $config['sections'] ) ) {
		$config['sections'] = array();
	}

	// append the header section
	$config['sections'] = $config['sections'] + $rosa2_section;

	return $config;
}

function rosa2_add_customify_style_manager_section( $options ) {

	if ( ! isset( $options['sections']['style_manager_section'] ) ) {
		$options['sections']['style_manager_section'] = array();
	}

	// The section might be already defined, thus we merge, not replace the entire section config.
	$options['sections']['style_manager_section'] = array_replace_recursive( $options['sections']['style_manager_section'], array(
			'options' => array(
				'sm_color_primary'   => array(
					'default'          => ROSA2_THEME_COLOR_PRIMARY,
					'connected_fields' => array(
						'rosa2_color_1'
					),
				),
				'sm_color_secondary' => array(
					'default'          => ROSA2_THEME_COLOR_SECONDARY,
					'connected_fields' => array(
						'rosa2_color_2'
					),
				),
				'sm_color_tertiary'  => array(
					'default'          => ROSA2_THEME_COLOR_TERTIARY,
					'connected_fields' => array(
						'rosa2_color_3'
					),
				),
				'sm_dark_primary'    => array(
					'default'          => ROSA2_THEME_DARK_PRIMARY,
					'connected_fields' => array(
						'rosa2_color_dark_1'
					),
				),
				'sm_dark_secondary'  => array(
					'default'          => ROSA2_THEME_DARK_SECONDARY,
					'connected_fields' => array(
						'rosa2_color_dark_2'
					),
				),
				'sm_dark_tertiary'   => array(
					'default'          => ROSA2_THEME_DARK_TERTIARY,
					'connected_fields' => array(
						'rosa2_color_dark_3'
					),
				),
				'sm_light_primary'   => array(
					'default'          => ROSA2_THEME_LIGHT_PRIMARY,
					'connected_fields' => array(
						'rosa2_color_light_1'
					),
				),
				'sm_light_secondary' => array(
					'default'          => ROSA2_THEME_LIGHT_SECONDARY,
					'connected_fields' => array(
						'rosa2_color_light_2'
					),
				),
				'sm_light_tertiary'  => array(
					'default'          => ROSA2_THEME_LIGHT_TERTIARY,
					'connected_fields' => array(
						'rosa2_color_light_3'
					),
				),
			),
		)
	);

	return $options;
}

function rosa2_add_default_color_palette( $color_palettes ) {

	$color_palettes = array_merge( array(
		'default' => array(
			'label'   => 'Theme Default',
			'preview' => array(
				'background_image_url' => 'https://cloud.pixelgrade.com/wp-content/uploads/2019/08/nova-theme.jpg',
			),
			'options' => array(
				'sm_color_primary'   => ROSA2_THEME_COLOR_PRIMARY,
				'sm_color_secondary' => ROSA2_THEME_COLOR_SECONDARY,
				'sm_color_tertiary'  => ROSA2_THEME_COLOR_TERTIARY,
				'sm_dark_primary'    => ROSA2_THEME_DARK_PRIMARY,
				'sm_dark_secondary'  => ROSA2_THEME_DARK_SECONDARY,
				'sm_dark_tertiary'   => ROSA2_THEME_DARK_TERTIARY,
				'sm_light_primary'   => ROSA2_THEME_LIGHT_PRIMARY,
				'sm_light_secondary' => ROSA2_THEME_LIGHT_SECONDARY,
				'sm_light_tertiary'  => ROSA2_THEME_LIGHT_TERTIARY,
			),
		),
	), $color_palettes );

	return $color_palettes;
}

add_filter( 'customify_get_color_palettes', 'rosa2_add_default_color_palette' );
