<?php
/**
 * Handle the Nova Blocks integration logic.
 *
 * @package Anima
 */

// If this file is called directly, abort.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

add_action( 'after_setup_theme', 'anima_novablocks_setup', 10 );

add_filter( 'novablocks_block_editor_settings', 'anima_alter_novablocks_separator_settings' );
add_filter( 'novablocks_block_editor_settings', 'anima_alter_novablocks_map_settings' );

if ( ! function_exists( 'anima_novablocks_setup' ) ) {
	function anima_novablocks_setup() {
		$anima_novablocks_config = array(
			'advanced-gallery' => [
				'name' => 'advanced-gallery',
				'supports' => [ 'blobs' ],
			],
			'announcement-bar' => [
				'name' => 'announcement-bar',
			],
			'cards-collection' => [
				'name' => 'cards-collection',
			],
			'card' => [
				'name' => 'card',
			],
			'google-map' => [
				'name' => 'google-map',
			],
			'header' => [
				'name' => 'header',
			],
			'header-row' => [
				'name' => 'header-row',
			],
			'headline' => [
				'name' => 'headline',
			],
			'hero' => [
				'name' => 'hero',
				'supports' => [ 'doppler' ],
			],
			'logo' => [
				'name' => 'logo',
			],
			'media' => [
				'name' => 'media',
				'supports' => [ 'blobs' ],
			],
			'menu-food' => [
				'name' => 'menu-food',
			],
			'navigation' => [
				'name' => 'navigation',
			],
			'opentable' => [
				'name' => 'opentable',
			],
			'openhours' => [
				'name' => 'openhours',
			],
			'post-comments' => [
				'name' => 'post-comments',
			],
			'posts-collection' => [
				'name' => 'posts-collection',
			],
			'sharing-overlay' => [
				'name' => 'sharing-overlay',
			],
			'slideshow' => [
				'name' => 'slideshow',
			],
			'sidecar' => [
				'name' => 'sidecar',
			],
			'sidecar-area' => [
				'name' => 'sidecar-area',
			],
			'supernova' => [
				'name' => 'supernova',
			],
			'supernova-item' => [
				'name' => 'supernova-item',
			],
		);

		$anima_novablocks_config = apply_filters( 'anima_novablocks_config', $anima_novablocks_config );

		add_theme_support( 'novablocks', $anima_novablocks_config );
	}
}


if ( ! function_exists( 'anima_alter_novablocks_separator_settings' ) ) {
	function anima_alter_novablocks_separator_settings( $settings ) {
		if ( empty( $settings['separator'] ) ) {
			$settings['separator'] = array();
		}

		$settings['separator']['markup'] = anima_get_separator_markup();

		return $settings;
	}
}


if ( ! function_exists( 'anima_alter_novablocks_map_settings' ) ) {
	function anima_alter_novablocks_map_settings( $settings ) {
		if ( empty( $settings['map'] ) ) {
			$settings['map'] = array();
		}

		$settings['map']['accentColor'] = pixelgrade_option( 'sm_color_primary', '#DDAB5D' );

		return $settings;
	}
}
