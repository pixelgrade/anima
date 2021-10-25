<?php

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! class_exists( 'Pixelgrade\StyleManager\Plugin' ) ) {
	return;
}

use Pixelgrade\StyleManager\Provider\PluginSettings as PluginSettings;

$plugin_settings = new PluginSettings();
$values_store_mode = $plugin_settings->get( 'values_store_mod' );
$options_name = Pixelgrade\StyleManager\get_options_key();

if ( $values_store_mode === 'option' ) {
	$anima_options = get_option( $options_name );
} else {
	$anima_options = get_theme_mod( $options_name );
}

$body_font_size = 16;
$content_font_size = 18;

if ( isset( $anima_options['body_font']['font_size']['value'] ) ) {
	$body_font_size = $anima_options['body_font']['font_size']['value'];
}

if ( isset( $anima_options['content_font']['font_size']['value'] ) ) {
	$content_font_size = $anima_options['content_font']['font_size']['value'];
}

$site_container_width = intval( pixelgrade_option( 'sm_site_container_width', 75 ) );
$new_site_container_width = $site_container_width * $body_font_size / $content_font_size;

update_option( 'sm_site_container_width', $new_site_container_width );
