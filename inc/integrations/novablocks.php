<?php
/**
 * Handle the Nova Blocks integration logic.
 */

// If this file is called directly, abort.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

add_action( 'after_setup_theme', 'rosa2_novablocks_setup', 10 );

add_filter( 'novablocks_block_editor_settings', 'rosa2_alter_novablocks_hero_settings' );
add_filter( 'novablocks_block_editor_settings', 'rosa2_alter_novablocks_media_settings' );
add_filter( 'novablocks_block_editor_settings', 'rosa2_alter_novablocks_separator_settings' );

add_filter( 'novablocks_block_editor_settings', 'rosa2_alter_novablocks_map_settings' );

if ( ! function_exists( 'rosa2_novablocks_setup' ) ) {
	function rosa2_novablocks_setup() {
		add_theme_support( 'novablocks', array(
			'doppler' => array(
				'novablocks/hero',
			),
			'blobs' => array(
				'novablocks/media',
				'novablocks/advanced-gallery',
			),
			'advanced-gallery',
			'announcement-bar',
			'cards-collection',
			'posts-collection',
			'card',
			'google-map',
			'header',
			'headline',
			'hero',
			'logo',
			'media',
			'menu-food',
			'navigation',
			'opentable',
			'openhours',
			'posts-collection',
			'slideshow',
		) );
	}
}

if ( ! function_exists( 'rosa2_alter_novablocks_hero_settings' ) ) {
	function rosa2_alter_novablocks_hero_settings( $settings ) {
		$settings['hero']['template'] = array(
			array(
				'core/separator',
				array(
					'className' => 'is-style-decorative',
				),
			),
			array(
				'novablocks/headline',
				array(
					'secondary' => esc_html__( 'This is a catchy', '__theme_txtd' ),
					'primary'   => esc_html__( 'Headline', '__theme_txtd' ),
					'align'     => 'center',
					'level'     => 1,
					'fontSize'     => 'larger',
					'className' => 'has-larger-font-size',
				),
			),
			array(
				'core/paragraph',
				array(
					'content'   => esc_html__( 'A brilliant subtitle to explain its catchiness', '__theme_txtd' ),
					'className' => 'is-style-lead',
				),
			)
		);

		$settings['hero']['scrollIndicatorMarkup'] = '<svg width="160" height="50" viewBox="0 0 160 50" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0 50C55 50 45 0 80 0C115 0 105 50 160 50H0Z" fill="currentColor"/></svg>';

		return $settings;
	}
}

if ( ! function_exists( 'rosa2_alter_novablocks_media_settings' ) ) {
	function rosa2_alter_novablocks_media_settings( $settings ) {
		$settings['media']['template'] = array(
			array(
				'novablocks/headline',
				array(
					'secondary' => esc_html__( 'Discover', '__theme_txtd' ),
					'primary'   => esc_html__( 'Our Story', '__theme_txtd' ),
					'align'     => 'center',
					'level'     => 2,
					'fontSize'  => 'larger',
					'className' => 'has-larger-font-size',
				),
			),
			array(
				'core/separator',
				array(
					'style'     => 'flower',
					'className' => 'is-style-decorative',
				),
			),
			array(
				'core/paragraph',
				array(
					'content' => esc_html__( 'We have always defined ourselves by the ability to overcome the impossible. And we count these moments. These moments when we dare to aim higher, to break barriers, to make the unknown known.', '__theme_txtd' ),
					'align'   => 'center',
				),
			),
			array(
				'core/buttons',
				array(
					'align'     => 'center',
				),
				array(
					array(
						'core/button',
						array(
							'text'      => esc_html__( 'Learn More', '__theme_txtd' ),
							'className' => 'is-style-text'
						),
					),
				)
			),
		);

		$settings['media']['attributes']['horizontalAlignment']['default'] = 'center';

		return $settings;
	}
}

if ( ! function_exists( 'rosa2_alter_novablocks_separator_settings' ) ) {
	function rosa2_alter_novablocks_separator_settings( $settings ) {
		if ( empty( $settings['separator'] ) ) {
			$settings['separator'] = array();
		}

		$settings['separator']['markup'] = rosa2_get_separator_markup();

		return $settings;
	}
}


if ( ! function_exists( 'rosa2_alter_novablocks_map_settings' ) ) {
	function rosa2_alter_novablocks_map_settings( $settings ) {
		if ( empty( $settings['map'] ) ) {
			$settings['map'] = array();
		}

		$settings['map']['accentColor'] = pixelgrade_option( 'sm_color_primary', '#DDAB5D' );

		return $settings;
	}
}
