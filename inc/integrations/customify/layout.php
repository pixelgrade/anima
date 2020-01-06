<?php

// If this file is called directly, abort.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

// Add colors section and options to the Customify config
add_filter( 'customify_filter_fields', 'rosa2_add_layout_section_to_customify_config', 60, 1 );

function rosa2_add_layout_section_to_customify_config( $config ) {

	$layout_section = array(
		'layout_section' => array(
			'title'   => esc_html__( 'Layout', '__theme_txtd' ),
			'options' => array(
				'content_width'      => array(
					'type'        => 'range',
					'live'        => true,
					'label'       => esc_html__( 'Content Width', '__theme_txtd' ),
					'default'     => 38,
					'input_attrs' => array(
						'min'          => 20,
						'max'          => 100,
						'step'         => 1,
						'data-preview' => true,
					),
					'css'         => array(
						array(
							'property' => '--theme-content-width-normal-initial',
							'selector' => ':root',
							'unit'     => '',
						),
					),
				),
				'content_wide_width' => array(
					'type'        => 'range',
					'live'        => true,
					'label'       => esc_html__( 'Container Width', '__theme_txtd' ),
					'default'     => 65,
					'input_attrs' => array(
						'min'          => 20,
						'max'          => 100,
						'step'         => 1,
						'data-preview' => true,
					),
					'css'         => array(
						array(
							'property' => '--theme-content-width-wide-initial',
							'selector' => ':root',
							'unit'     => '',
						),
					),
				),
				'layout_spacing' => array(
					'type'        => 'range',
					'live'        => true,
					'label'       => esc_html__( 'Spacing', '__theme_txtd' ),
					'default'     => 1,
					'input_attrs' => array(
						'min'          => 0,
						'max'          => 2,
						'step'         => 0.1,
						'data-preview' => true,
					),
					'css'         => array(
						array(
							'property' => '--theme-spacing-ratio',
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

	$config['sections'] = $config['sections'] + $layout_section;

	return $config;
}
