<?php

// If this file is called directly, abort.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

add_filter( 'customify_filter_fields', 'anima_add_customify_connected_fields', 12, 1 );

function anima_add_customify_connected_fields( $options ) {

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
					'default' => 'exquisite',
				],
				'sm_font_primary'    => [
					'default' => 'Reforma1969',
					'connected_fields' => [
						'display_font',
						'heading_1_font',
						'heading_2_font',
						'heading_3_font',
						'heading_4_font',
						'quote_font',
					],
				],
				'sm_font_secondary'  => [
					'default' => 'Reforma2018',
					'connected_fields' => [
						'heading_5_font',
						'heading_6_font',
						'navigation_font',
						'buttons_font',
						'meta_font',
					],
				],
				'sm_font_body'       => [
					'default' => 'Reforma1969',
					'connected_fields' => [
						'body_font',
						'content_font',
						'lead_font',
						'cite_font',
						'input_font'
					],
				],
				'sm_font_accent'     => [
					'default' => 'Billy Ohio',
					'connected_fields' => [
						'accent_font',
					],
				],
			],
		]
	);

	return $options;
}
