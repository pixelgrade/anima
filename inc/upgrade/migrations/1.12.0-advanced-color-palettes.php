<?php

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$alphabet = range( 'A', 'Z' );

$color_control_ids = array(
	'sm_color_primary',
	'sm_color_secondary',
	'sm_color_tertiary',
);

// consider shuffle setting
$shuffle = get_option( 'sm_shuffle_colors' );

if ( $shuffle === 'mixed' ) {
	array_push( $color_control_ids, array_shift( $color_control_ids ) );
}

if ( $shuffle === 'remix' ) {
	array_push( $color_control_ids, array_shift( $color_control_ids ) );
	array_push( $color_control_ids, array_shift( $color_control_ids ) );
}

// consider color diversity
$diversity = get_option( 'sm_color_diversity' );

if ( $diversity === 'low' ) {
	array_splice( $color_control_ids, 1 );
}

if ( $diversity === 'medium' ) {
	array_splice( $color_control_ids, 2 );
}


// build values for sm_advanced_palette_source and sm_advanced_palette_output
$source = array();
$output = array();

$lighter = pixelgrade_option( 'sm_light_primary_final' );
$light = pixelgrade_option( 'sm_light_tertiary_final' );
$text_color = pixelgrade_option( 'sm_dark_secondary_final' );
$dark = pixelgrade_option( 'sm_dark_primary_final' );
$darker = pixelgrade_option( 'sm_dark_tertiary_final' );

foreach ( $color_control_ids as $index => $control_id ) {

	$value = pixelgrade_option( $control_id . '_final' );

	if ( empty( $value ) ) {
		continue;
	}

	$colors = array(
		$lighter,
		$light,
		$light,
		$light,
		$light,
		$value,
		$value,
		$value,
		$dark,
		$dark,
		$darker,
		$darker,
	);

	$color_objects = array();

	foreach ( $colors as $color ) {
		$obj = ( object ) array(
			'value' => $color
		);

		$color_objects[] = $obj;
	}

	$textColors = array(
		$text_color,
		$text_color,
	);

	$textColor_objects = array();

	foreach ( $textColors as $color ) {
		$obj = ( object ) array(
			'value' => $color
		);

		$textColor_objects[] = $obj;
	}

	$source[] = ( object ) array(
		'uid'     => "color_group_" . ( $index + 1 ),
		'sources' => array(
			array(
				'uid'        => "color_" . ( $index + 1 ) . "1",
				'showPicker' => true,
				'label'      => 'Color ' . ( $index + 1 ),
				'value'      => $value
			),
		),
	);

	$output[] = ( object ) array(
		'colors'           => $color_objects,
		'textColors'       => $textColor_objects,
		'source'           => array( $value ),
		'lightColorsCount' => 5,
		'sourceIndex'      => 6,
		'label'            => 'Color ' . $alphabet[ $index + 1 ],
		'id'               => $index + 1
	);
}

$functional_palettes = array(
	( object ) array(
		'sourceIndex'      => 6,
		'id'               => '_info',
		'lightColorsCount' => 5,
		'label'            => 'Info',
		'source'           => array( '#2E72D2' ),
		'colors'           =>
			array(
				( object ) array( 'value' => '#ffffff', ),
				( object ) array( 'value' => '#f6f7fd', ),
				( object ) array( 'value' => '#e1e5f8', ),
				( object ) array( 'value' => '#b2c0ec', ),
				( object ) array( 'value' => '#859ee2', ),
				( object ) array( 'value' => '#527ed3', ),
				( object ) array( 'value' => '#2E72D2', 'isSource' => true, ),
				( object ) array( 'value' => '#0758b0', ),
				( object ) array( 'value' => '#0c4496', ),
				( object ) array( 'value' => '#0e317b', ),
				( object ) array( 'value' => '#0c1861', ),
				( object ) array( 'value' => '#101010', ),
			),
		'textColors'       =>
			array(
				( object ) array( 'value' => '#30354c', ),
				( object ) array( 'value' => '#202132', ),
			),
	),
	( object ) array(
		'sourceIndex'      => 6,
		'id'               => '_error',
		'lightColorsCount' => 5,
		'label'            => 'Error',
		'source'           => array( '#D82C0D' ),
		'colors'           =>
			array(
				( object ) array( 'value' => '#ffffff', ),
				( object ) array( 'value' => '#fff5f2', ),
				( object ) array( 'value' => '#ffdfd6', ),
				( object ) array( 'value' => '#fbaf98', ),
				( object ) array( 'value' => '#f18061', ),
				( object ) array( 'value' => '#de4f2e', ),
				( object ) array( 'value' => '#D82C0D', 'isSource' => true, ),
				( object ) array( 'value' => '#b50f0f', ),
				( object ) array( 'value' => '#901313', ),
				( object ) array( 'value' => '#6c1212', ),
				( object ) array( 'value' => '#4d0000', ),
				( object ) array( 'value' => '#101010', ),
			),
		'textColors'       =>
			array(
				( object ) array( 'value' => '#4c2e2e', ),
				( object ) array( 'value' => '#311c1c', ),
			),
	),
	( object ) array(
		'sourceIndex'      => 3,
		'id'               => '_warning',
		'lightColorsCount' => 5,
		'label'            => 'Warning',
		'source'           => array( '#FFCC00' ),
		'colors'           =>
			array(
				( object ) array( 'value' => '#ffffff', ),
				( object ) array( 'value' => '#fff7df', ),
				( object ) array( 'value' => '#fce690', ),
				( object ) array( 'value' => '#FFCC00', 'isSource' => true, ),
				( object ) array( 'value' => '#c39b10', ),
				( object ) array( 'value' => '#9f7a00', ),
				( object ) array( 'value' => '#896701', ),
				( object ) array( 'value' => '#735507', ),
				( object ) array( 'value' => '#60430a', ),
				( object ) array( 'value' => '#4e2f0d', ),
				( object ) array( 'value' => '#40140b', ),
				( object ) array( 'value' => '#101010', ),
			),
		'textColors'       =>
			array(
				( object ) array( 'value' => '#473222', ),
				( object ) array( 'value' => '#311d1b', ),
			),
	),
	( object ) array(
		'sourceIndex'      => 7,
		'id'               => '_success',
		'lightColorsCount' => 5,
		'label'            => 'Success',
		'source'           => array( '#00703c' ),
		'colors'           =>
			array(
				( object ) array( 'value' => '#ffffff', ),
				( object ) array( 'value' => '#f4f8f5', ),
				( object ) array( 'value' => '#dce9e0', ),
				( object ) array( 'value' => '#a9c9b2', ),
				( object ) array( 'value' => '#7aab89', ),
				( object ) array( 'value' => '#4c8c63', ),
				( object ) array( 'value' => '#257b4a', ),
				( object ) array( 'value' => '#00703c', 'isSource' => true, ),
				( object ) array( 'value' => '#0b5425', ),
				( object ) array( 'value' => '#0d3f12', ),
				( object ) array( 'value' => '#092809', ),
				( object ) array( 'value' => '#101010', ),
			),
		'textColors'       =>
			array(
				( object ) array( 'value' => '#223c23', ),
				( object ) array( 'value' => '#142614', ),
			),
	),
);

if ( ! empty( $output ) ) {
	$output = array_merge( $output, $functional_palettes );

	$advanced_palette_source_value = json_encode( $source );
	$advanced_palette_output_value = json_encode( $output );

	// update the options with the migrated color sources and output values
	update_option( 'sm_advanced_palette_source', $advanced_palette_source_value );
	update_option( 'sm_advanced_palette_output', $advanced_palette_output_value );
}
