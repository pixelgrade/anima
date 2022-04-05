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
		$anima_novablocks_config = [
			'advanced-gallery' => [
				'name' => 'advanced-gallery',
				'supports' => [ 'blobs' ],
				'enabled' => true,
			],
			'announcement-bar' => [
				'name' => 'announcement-bar',
				'enabled' => true,
			],
			'author-box' => [
				'name' => 'author-box',
				'enabled' => true,
			],
			'cards-collection' => [
				'name' => 'cards-collection',
				'enabled' => true,
			],
			'card' => [
				'name' => 'card',
				'enabled' => true,
			],
			'google-map' => [
				'name' => 'google-map',
				'enabled' => true,
			],
			'header' => [
				'name' => 'header',
				'enabled' => true,
			],
			'header-row' => [
				'name' => 'header-row',
				'enabled' => true,
			],
			'headline' => [
				'name' => 'headline',
				'enabled' => true,
			],
			'hero' => [
				'name' => 'hero',
				'supports' => [ 'doppler' ],
				'enabled' => true,
			],
			'logo' => [
				'name' => 'logo',
				'enabled' => true,
			],
			'media' => [
				'name' => 'media',
				'supports' => [ 'blobs' ],
				'enabled' => true,
			],
			'menu-food' => [
				'name' => 'menu-food',
				'enabled' => true,
			],
			'navigation' => [
				'name' => 'navigation',
				'enabled' => true,
			],
			'opentable' => [
				'name' => 'opentable',
				'enabled' => true,
			],
			'openhours' => [
				'name' => 'openhours',
				'enabled' => true,
			],
			'post-comments' => [
				'name' => 'post-comments',
				'enabled' => true,
			],
			'post-meta' => [
				'name' => 'post-meta',
				'enabled' => true,
			],
			'post-navigation' => [
				'name' => 'post-navigation',
				'enabled' => true,
			],
			'posts-collection' => [
				'name' => 'posts-collection',
				'enabled' => true,
			],
			'sharing-overlay' => [
				'name' => 'sharing-overlay',
				'enabled' => true,
			],
			'slideshow' => [
				'name' => 'slideshow',
				'enabled' => true,
			],
			'sidecar' => [
				'name' => 'sidecar',
				'enabled' => true,
			],
			'sidecar-area' => [
				'name' => 'sidecar-area',
				'enabled' => true,
			],
			'supernova' => [
				'name' => 'supernova',
				'enabled' => true,
			],
			'supernova-item' => [
				'name' => 'supernova-item',
				'enabled' => true,
			],
		];

		$anima_novablocks_config = apply_filters( 'anima/novablocks_config', $anima_novablocks_config );

		add_theme_support( 'novablocks', $anima_novablocks_config );
	}
}


if ( ! function_exists( 'anima_alter_novablocks_separator_settings' ) ) {
	function anima_alter_novablocks_separator_settings( $settings ) {
		if ( empty( $settings['separator'] ) ) {
			$settings['separator'] = [];
		}

		$settings['separator']['markup'] = anima_get_separator_markup();

		return $settings;
	}
}


if ( ! function_exists( 'anima_alter_novablocks_map_settings' ) ) {
	function anima_alter_novablocks_map_settings( $settings ) {
		if ( empty( $settings['map'] ) ) {
			$settings['map'] = [];
		}

		$settings['map']['accentColor'] = pixelgrade_option( 'sm_color_primary', '#DDAB5D' );

		return $settings;
	}
}
