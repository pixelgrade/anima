<?php

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$rosa2_options = get_theme_mod( 'rosa2_options', array() );

if ( empty( $rosa2_options ) || ! is_array( $rosa2_options ) ) {
	return;
}

if ( ! empty( $rosa2_options['content_width'] ) && ! empty( $rosa2_options['content_wide_width_addon'] ) ) {

	// Content Width
	$content_width_addon   = $rosa2_options['content_width'];
	// Old Container Width
	$container_width_addon = $rosa2_options['content_wide_width_addon'];

	// New Container Width should be equal with Content Width + Old Container Width.
	$new_container_width_addon = strval( $content_width_addon + $container_width_addon );

	// New maximum setting for Container Width is 100,
	// so we are going to limit new value to that.
	if ( $new_container_width_addon > 100 ) {
		$new_container_width_addon = '100';
	}

	// New minimum setting for Container Width is 60,
	// so we are going to limit new value to that.
	if ( $new_container_width_addon < 60 ) {
		$new_container_width_addon = '60';
	}

	// Update content_wide_width_addon value.
	if ( isset( $rosa2_options['content_width'] ) && isset( $rosa2_options['content_wide_width_addon'] ) ) {
		$rosa2_options['content_wide_width_addon'] = $new_container_width_addon;
	}
}

set_theme_mod( 'rosa2_options', $rosa2_options );
