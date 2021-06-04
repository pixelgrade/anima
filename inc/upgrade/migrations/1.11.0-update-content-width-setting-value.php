<?php

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$config = apply_filters( 'customify_filter_fields', array() );

$content_option = pixelgrade_option('content_width', 30);
$container_option = pixelgrade_option('content_wide_width_addon', 35);

$new_container_option_value = $content_option + $container_option;

// New maximum setting for Container Width is 100,
// so we are going to limit new value to that.
if ( $new_container_option_value > 100 ) {
	$new_container_option_value = '100';
}

// New minimum setting for Container Width is 60,
// so we are going to limit new value to that.
if ( $new_container_option_value < 60 ) {
	$new_container_option_value = '60';
}

$container_option_config = pixelgrade_get_option_customizer_config('content_wide_width_addon', $config);

if ( ! empty( $container_option_config ) && isset( $container_option_config['setting_type'] ) && 'option' === $container_option_config['setting_type'] ) {

	if ( ! empty( $option_config['setting_id'] ) ) {
		$setting_id = $option_config['setting_id'];
	} else {
		$setting_id = $config['opt-name'] . '[content_wide_width_addon]';
	}

	update_option( $setting_id, $new_container_option_value );
} else {

	if ( PixCustomifyPlugin()->settings->get_plugin_setting('values_store_mod') === 'option' ) {
		$setting_id = $config['opt-name'] . '[content_wide_width_addon]';
		update_option( $setting_id, $new_container_option_value );
	} else {
		$rosa2_options = get_theme_mod( 'rosa2_options' );
		$rosa2_options['content_wide_width_addon'] = strval( $new_container_option_value );
		set_theme_mod( 'rosa2_options', $rosa2_options );
	}
}
