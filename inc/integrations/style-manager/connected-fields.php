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
		$options['sections']['style_manager_section'] = [];
	}

	// The section might be already defined, thus we merge, not replace the entire section config.
	$options['sections']['style_manager_section'] = array_replace_recursive( $options['sections']['style_manager_section'],
		[
			'options' => [
				// Font Palettes Assignment.
				'sm_font_palette'    => [
					'default' => 'system',
				],
				'sm_font_primary'    => [
					'default' => 'System Sans-Serif Clear',
					'connected_fields' => [
						'super_display_font',
						'display_font',
						'heading_1_font',
						'heading_2_font',
						'heading_3_font',
						'heading_4_font',
						'quote_font', // !!! Add font-control option
					],
				],
				'sm_font_secondary'  => [
					'default' => 'System Sans-Serif Clear',
					'connected_fields' => [
						'heading_5_font',
						'heading_6_font',
						'navigation_font',
						'buttons_font',
						'meta_font',
					],
				],
				'sm_font_body'       => [
					'default' => 'System Sans-Serif Clear',
					'connected_fields' => [
						'body_font',
						'lead_font',
						'cite_font', // !!! Add font-control option
						'input_font'
					],
				],
				'sm_font_accent'     => [
					'default' => 'System Handwriting',
					'connected_fields' => [
						'accent_font',
					],
				],
				'sm_fonts_connected_fields_preset' => [
					'default' => 'preset-2',
					'choices' => [
						'preset-1'      => [
							'label'   => __( 'Preset 1 (Towards Primary)', '__theme_txtd' ),
							'options' => [],
							'config'  => [
								'sm_font_primary'   => [
									'super_display_font',
									'display_font',
									'heading_1_font',
									'heading_2_font',
									'heading_3_font',
									'heading_4_font',
									'heading_5_font',
									'heading_6_font',
									'quote_font',
								],
								'sm_font_secondary' => [
									'buttons_font',
									'meta_font',
									'lead_font',
								],
								'sm_font_body'      => [
									'navigation_font',
									'body_font',
									'cite_font',
									'input_font',
								],
								'sm_font_accent'    => [
									'accent_font'
								],
							],
						],
						'preset-2'      => [
							'label'   => __( 'Preset 2 (Default)', '__theme_txtd' ),
							'options' => [],
							'config'  => [
								'sm_font_primary'   => [
									'super_display_font',
									'display_font',
									'heading_1_font',
									'heading_2_font',
									'heading_3_font',
									'heading_4_font',
									'quote_font',
								],
								'sm_font_secondary' => [
									'heading_5_font',
									'heading_6_font',
									'navigation_font',
									'buttons_font',
									'meta_font',
								],
								'sm_font_body'      => [
									'body_font',
									'lead_font',
									'cite_font',
									'input_font',
								],
								'sm_font_accent'    => [
									'accent_font'
								],
							],
						],
						'preset-2-5'      => [
							'label'   => __( 'Preset 2.5', '__theme_txtd' ),
							'options' => [],
							'config'  => [
								'sm_font_primary'   => [
									'super_display_font',
									'display_font',
									'heading_1_font',
									'heading_2_font',
									'heading_3_font',
								],
								'sm_font_secondary' => [
									'heading_4_font',
									'heading_5_font',
									'heading_6_font',
									'quote_font',
									'buttons_font',
									'meta_font',
									'navigation_font',
								],
								'sm_font_body'      => [
									'body_font',
									'lead_font',
									'cite_font',
									'input_font',
								],
								'sm_font_accent'    => [
									'accent_font'
								],
							],
						],
						'preset-3'      => [
							'label'   => __( 'Preset 3 (Towards Secondary/Body)', '__theme_txtd' ),
							'options' => [],
							'config'  => [
								'sm_font_primary'   => [
									'super_display_font',
									'display_font',
									'heading_1_font',
									'heading_2_font',
								],
								'sm_font_secondary' => [
									'heading_3_font',
									'heading_4_font',
									'heading_5_font',
									'heading_6_font',
									'quote_font',
								],
								'sm_font_body'      => [
									'buttons_font',
									'meta_font',
									'navigation_font',
									'body_font',
									'lead_font',
									'cite_font',
									'input_font',
								],
								'sm_font_accent'    => [
									'accent_font'
								],
							],
						],
						'preset-body'   => [
							'label'   => __( 'Misc: All Body', '__theme_txtd' ),
							'options' => [],
							'config'  => [
								'sm_font_primary'   => [],
								'sm_font_secondary' => [],
								'sm_font_body'      => [
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
									'lead_font',
									'cite_font',
									'input_font',
									'accent_font'
								],
								'sm_font_accent'    => [],
							],
						],
						'preset-accent' => [
							'label'   => __( 'Misc: All Accent', '__theme_txtd' ),
							'options' => [],
							'config'  => [
								'sm_font_primary'   => [],
								'sm_font_secondary' => [],
								'sm_font_body'      => [],
								'sm_font_accent'    => [
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
									'lead_font',
									'cite_font',
									'input_font',
									'accent_font'
								],
							],
						]
					],
				],
			],
		]
	);

	return $options;
}
