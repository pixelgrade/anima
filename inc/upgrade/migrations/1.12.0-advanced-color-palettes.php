<?php

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

// We need Customify to be active, not a surrogate that offers fallbacks like Style Manager 1.0 does.
if ( ! function_exists( 'PixCustomifyPlugin' ) || empty( PixCustomifyPlugin()->settings ) ) {
	return;
}

$alphabet = range( 'A', 'Z' );

$color_control_ids = [
	'color_1',
	'color_2',
	'color_3',
];

// consider color diversity
$diversity = pixelgrade_option( 'sm_color_diversity' );

if ( $diversity === 'low' ) {
	array_splice( $color_control_ids, 1 );
}

if ( $diversity === 'medium' ) {
	array_splice( $color_control_ids, 2 );
}

// build values for sm_advanced_palette_source and sm_advanced_palette_output
$source = [];
$output = [];

$lighter = pixelgrade_option( 'color_light_1' );
$light = pixelgrade_option( 'color_light_3' );
$text_color = pixelgrade_option( 'color_dark_2' );
$dark = pixelgrade_option( 'color_dark_1' );

foreach ( $color_control_ids as $index => $control_id ) {

	$value = pixelgrade_option( $control_id );

	if ( empty( $value ) ) {
		continue;
	}

	$colors = [
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
		$dark,
		$dark,
	];

	$color_objects = [];

	foreach ( $colors as $color ) {
		$obj = ( object ) [
			'value' => $color
		];

		$color_objects[] = $obj;
	}

	$textColors = [
		$text_color,
		$text_color,
	];

	$textColor_objects = [];

	foreach ( $textColors as $color ) {
		$obj = ( object ) [
			'value' => $color
		];

		$textColor_objects[] = $obj;
	}

	$source[] = ( object ) [
		'uid'     => 'color_group_' . ( $index + 1 ),
		'sources' => [
			[
				'uid'        => 'color_' . ( $index + 1 ) . '1',
				'showPicker' => true,
				'label'      => 'Color ' . ( $index + 1 ),
				'value'      => $value
			],
		],
	];

	$output[] = ( object ) [
		'colors'           => $color_objects,
		'textColors'       => $textColor_objects,
		'source'           => [ $value ],
		'lightColorsCount' => 5,
		'sourceIndex'      => 6,
		'label'            => 'Color ' . $alphabet[ $index + 1 ],
		'id'               => $index + 1
	];
}

$functional_palettes = [
	( object ) [
		'sourceIndex'      => 6,
		'id'               => '_info',
		'lightColorsCount' => 5,
		'label'            => 'Info',
		'source'           => [ '#2E72D2' ],
		'colors'           =>
			[
				( object ) [ 'value' => '#ffffff', ],
				( object ) [ 'value' => '#f6f7fd', ],
				( object ) [ 'value' => '#e1e5f8', ],
				( object ) [ 'value' => '#b2c0ec', ],
				( object ) [ 'value' => '#859ee2', ],
				( object ) [ 'value' => '#527ed3', ],
				( object ) [ 'value' => '#2E72D2', 'isSource' => true, ],
				( object ) [ 'value' => '#0758b0', ],
				( object ) [ 'value' => '#0c4496', ],
				( object ) [ 'value' => '#0e317b', ],
				( object ) [ 'value' => '#0c1861', ],
				( object ) [ 'value' => '#101010', ],
			],
		'textColors'       =>
			[
				( object ) [ 'value' => '#30354c', ],
				( object ) [ 'value' => '#202132', ],
			],
	],
	( object ) [
		'sourceIndex'      => 6,
		'id'               => '_error',
		'lightColorsCount' => 5,
		'label'            => 'Error',
		'source'           => [ '#D82C0D' ],
		'colors'           =>
			[
				( object ) [ 'value' => '#ffffff', ],
				( object ) [ 'value' => '#fff5f2', ],
				( object ) [ 'value' => '#ffdfd6', ],
				( object ) [ 'value' => '#fbaf98', ],
				( object ) [ 'value' => '#f18061', ],
				( object ) [ 'value' => '#de4f2e', ],
				( object ) [ 'value' => '#D82C0D', 'isSource' => true, ],
				( object ) [ 'value' => '#b50f0f', ],
				( object ) [ 'value' => '#901313', ],
				( object ) [ 'value' => '#6c1212', ],
				( object ) [ 'value' => '#4d0000', ],
				( object ) [ 'value' => '#101010', ],
			],
		'textColors'       =>
			[
				( object ) [ 'value' => '#4c2e2e', ],
				( object ) [ 'value' => '#311c1c', ],
			],
	],
	( object ) [
		'sourceIndex'      => 3,
		'id'               => '_warning',
		'lightColorsCount' => 5,
		'label'            => 'Warning',
		'source'           => [ '#FFCC00' ],
		'colors'           =>
			[
				( object ) [ 'value' => '#ffffff', ],
				( object ) [ 'value' => '#fff7df', ],
				( object ) [ 'value' => '#fce690', ],
				( object ) [ 'value' => '#FFCC00', 'isSource' => true, ],
				( object ) [ 'value' => '#c39b10', ],
				( object ) [ 'value' => '#9f7a00', ],
				( object ) [ 'value' => '#896701', ],
				( object ) [ 'value' => '#735507', ],
				( object ) [ 'value' => '#60430a', ],
				( object ) [ 'value' => '#4e2f0d', ],
				( object ) [ 'value' => '#40140b', ],
				( object ) [ 'value' => '#101010', ],
			],
		'textColors'       =>
			[
				( object ) [ 'value' => '#473222', ],
				( object ) [ 'value' => '#311d1b', ],
			],
	],
	( object ) [
		'sourceIndex'      => 7,
		'id'               => '_success',
		'lightColorsCount' => 5,
		'label'            => 'Success',
		'source'           => [ '#00703c' ],
		'colors'           =>
			[
				( object ) [ 'value' => '#ffffff', ],
				( object ) [ 'value' => '#f4f8f5', ],
				( object ) [ 'value' => '#dce9e0', ],
				( object ) [ 'value' => '#a9c9b2', ],
				( object ) [ 'value' => '#7aab89', ],
				( object ) [ 'value' => '#4c8c63', ],
				( object ) [ 'value' => '#257b4a', ],
				( object ) [ 'value' => '#00703c', 'isSource' => true, ],
				( object ) [ 'value' => '#0b5425', ],
				( object ) [ 'value' => '#0d3f12', ],
				( object ) [ 'value' => '#092809', ],
				( object ) [ 'value' => '#101010', ],
			],
		'textColors'       =>
			[
				( object ) [ 'value' => '#223c23', ],
				( object ) [ 'value' => '#142614', ],
			],
	],
];

if ( ! empty( $output ) ) {
	$output = array_merge( $output, $functional_palettes );

	$advanced_palette_source_value = json_encode( $source );
	$advanced_palette_output_value = json_encode( $output );

	// update the options with the migrated color sources and output values
	update_option( 'sm_advanced_palette_source', $advanced_palette_source_value );
	update_option( 'sm_advanced_palette_output', $advanced_palette_output_value );
}
