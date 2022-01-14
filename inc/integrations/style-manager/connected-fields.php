<?php

// If this file is called directly, abort.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

add_filter( 'style_manager/filter_fields', 'anima_add_style_manager_connected_fields', 12, 1 );

function anima_add_style_manager_connected_fields( $options ) {

	// If the theme hasn't declared support for style manager, bail.
	if ( ! current_theme_supports( 'customizer_style_manager' ) ) {
		return $options;
	}

	if ( ! isset( $options['sections']['style_manager_section'] ) ) {
		$options['sections']['style_manager_section'] = array();
	}

	// The section might be already defined, thus we merge, not replace the entire section config.
	$options['sections']['style_manager_section'] = array_replace_recursive( $options['sections']['style_manager_section'],
		array(
			'options' => array(
				// Font Palettes Assignment.
				'sm_font_palette'    => array(
					'default' => 'exquisite',
				),
				'sm_font_primary'    => array(
					'default' => 'Reforma1969',
					'connected_fields' => array(
						'super_display_font',
						'display_font',
						'heading_1_font',
						'heading_2_font',
						'heading_3_font',
						'heading_4_font',
					),
				),
				'sm_font_secondary'  => array(
					'default' => 'Reforma2018',
					'connected_fields' => array(
						'heading_5_font',
						'heading_6_font',
						'navigation_font',
						'buttons_font',
						'meta_font',
					),
				),
				'sm_font_body'       => array(
					'default' => 'Reforma1969',
					'connected_fields' => array(
						'body_font',
						'content_font',
						'lead_font',
						'input_font'
					),
				),
				'sm_font_accent'     => array(
					'default' => 'Billy Ohio',
					'connected_fields' => array(
						'accent_font',
					),
				),
				'sm_fonts_connected_fields_preset' => array(
					'default' => 'preset-2',
					'choices' => array(
						'preset-1'      => array(
							'label'   => __( 'Preset 1', '__theme_txtd' ),
							'options' => array(),
							'config'  => array(
								'sm_font_primary'   => array(
									'super_display_font',
									'display_font',
									'heading_1_font',
									'heading_2_font',
									'heading_3_font',
									'heading_4_font',
									'heading_5_font',
									'heading_6_font',
									'quote_font',
								),
								'sm_font_secondary' => array(
									'buttons_font',
									'meta_font',
									'lead_font',
								),
								'sm_font_body'      => array(
									'navigation_font',
									'body_font',
									'content_font',
									'cite_font',
									'input_font',
								),
								'sm_font_accent'    => array(
									'accent_font'
								),
							),
						),
						'preset-2'      => array(
							'label'   => __( 'Preset 2 (Default)', '__theme_txtd' ),
							'options' => array(),
							'config'  => array(
								'sm_font_primary'   => array(
									'super_display_font',
									'display_font',
									'heading_1_font',
									'heading_2_font',
									'heading_3_font',
									'heading_4_font',
									'quote_font',
								),
								'sm_font_secondary' => array(
									'heading_5_font',
									'heading_6_font',
									'navigation_font',
									'buttons_font',
									'meta_font',
								),
								'sm_font_body'      => array(
									'body_font',
									'content_font',
									'lead_font',
									'cite_font',
									'input_font',
								),
								'sm_font_accent'    => array(
									'accent_font'
								),
							),
						),
						'preset-3'      => array(
							'label'   => __( 'Preset 3', '__theme_txtd' ),
							'options' => array(),
							'config'  => array(
								'sm_font_primary'   => array(
									'super_display_font',
									'display_font',
									'heading_1_font',
									'heading_2_font',
								),
								'sm_font_secondary' => array(
									'heading_3_font',
									'heading_4_font',
									'heading_5_font',
									'heading_6_font',
									'quote_font',
								),
								'sm_font_body'      => array(
									'buttons_font',
									'meta_font',
									'navigation_font',
									'body_font',
									'content_font',
									'lead_font',
									'cite_font',
									'input_font',
								),
								'sm_font_accent'    => array(
									'accent_font'
								),
							),
						),
						'preset-body'   => array(
							'label'   => __( 'Misc: All Body', '__theme_txtd' ),
							'options' => array(),
							'config'  => array(
								'sm_font_primary'   => array(),
								'sm_font_secondary' => array(),
								'sm_font_body'      => array(
									'super_display_font',
									'display_font',
									'heading_1_font',
									'heading_2_font',
									'heading_3_font',
									'heading_4_font',
									'heading_5_font',
									'heading_6_font',
									'quote_font',
									'buttons_font',
									'meta_font',
									'navigation_font',
									'body_font',
									'content_font',
									'lead_font',
									'cite_font',
									'input_font',
									'accent_font'
								),
								'sm_font_accent'    => array(),
							),
						),
						'preset-accent' => array(
							'label'   => __( 'Misc: All Accent', '__theme_txtd' ),
							'options' => array(),
							'config'  => array(
								'sm_font_primary'   => array(),
								'sm_font_secondary' => array(),
								'sm_font_body'      => array(),
								'sm_font_accent'    => array(
									'super_display_font',
									'display_font',
									'heading_1_font',
									'heading_2_font',
									'heading_3_font',
									'heading_4_font',
									'heading_5_font',
									'heading_6_font',
									'quote_font',
									'buttons_font',
									'meta_font',
									'navigation_font',
									'body_font',
									'content_font',
									'lead_font',
									'cite_font',
									'input_font',
									'accent_font'
								),
							),
						)
					),
				),
			),
		)
	);

	return $options;
}
