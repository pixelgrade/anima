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

$lighter = get_option( 'sm_light_primary_final' );
$light = get_option( 'sm_light_tertiary_final' );
$text_color = get_option( 'sm_dark_secondary_final' );
$dark = get_option( 'sm_dark_primary_final' );
$darker = get_option( 'sm_dark_tertiary_final' );

foreach ( $color_control_ids as $index => $control_id ) {

	$value = get_option( $control_id . '_final' );

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
		'source'           => $value,
		'lightColorsCount' => 5,
		'sourceIndex'      => 5,
		'label'            => 'Color ' . $alphabet[ $index + 1 ],
		'id'               => $index + 1
	);
}

$advanced_palette_source_value = json_encode( $source );
$advanced_palette_output_value = json_encode( $output );

// update the options with the migrated color sources and output values
update_option( 'sm_advanced_palette_source', $advanced_palette_source_value );
update_option( 'sm_advanced_palette_output', $advanced_palette_output_value );
