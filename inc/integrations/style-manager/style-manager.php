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

	add_filter( 'style_manager/filter_fields', 'anima_add_separators_section_to_style_manager_config', 30, 1 );
	add_filter( 'style_manager/filter_fields', 'anima_add_content_section_to_style_manager_config', 40, 1 );
}


function anima_add_style_manager_options( $config ) {
	$config['opt-name'] = 'anima_options';

	//start with a clean slate - no Style Manager default sections
	$config['sections'] = [];

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

	// Bail if we have no choices.
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


