<?php

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

// We need Customify to be active, not a surrogate that offers fallbacks like Style Manager 1.0 does.
if ( ! function_exists( 'PixCustomifyPlugin' ) || empty( PixCustomifyPlugin()->settings ) ) {
	return;
}

$opt_name = PixCustomifyPlugin()->get_options_key();

$content_option = intval( pixelgrade_option('content_width', 30) );
$container_option = intval( pixelgrade_option('content_wide_width_addon', 35) );
$new_container_option_value = $content_option + $container_option;

if ( $new_container_option_value > 100 ) {
	// New maximum setting for Container Width is 100,
	// so we are going to limit new value to that.
	$new_container_option_value = 100;
} else if ( $new_container_option_value < 60 ) {
	// New minimum setting for Container Width is 60,
	// so we are going to limit new value to that.
	$new_container_option_value = 60;
}

$container_option_config = pixelgrade_get_option_customizer_config( 'content_wide_width_addon', PixCustomifyPlugin()->get_customizer_config() );

if ( ! empty( $container_option_config['setting_type'] ) && 'option' === $container_option_config['setting_type'] ) {

	if ( ! empty( $option_config['setting_id'] ) ) {
		$setting_id = $option_config['setting_id'];
	} else {
		$setting_id = $opt_name . '[content_wide_width_addon]';
	}

	update_option( $setting_id, $new_container_option_value );
} else {

	if ( PixCustomifyPlugin()->settings->get_plugin_setting('values_store_mod') === 'option' ) {
		$rosa2_options = get_option( $opt_name );
		$rosa2_options['content_wide_width_addon'] = $new_container_option_value;
		update_option( $opt_name, $rosa2_options );
	} else {
		$rosa2_options = get_theme_mod( $opt_name );
		$rosa2_options['content_wide_width_addon'] = $new_container_option_value;
		set_theme_mod( $opt_name, $rosa2_options );
	}
}
