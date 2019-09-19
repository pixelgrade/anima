<?php
/**
 * Handle the Nova Blocks integration logic.
 */

// If this file is called directly, abort.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
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
					'secondary' => 'This is a catchy',
					'primary'   => 'Headline',
					'align'     => 'center',
					'level'     => 1,
					'className' => 'has-larger-font-size',
				),
			),
			array(
				'core/paragraph',
				array(
					'content'   => 'A brilliant subtitle to explain its catchiness',
					'className' => 'is-style-lead',
				),
			)
		);

		$settings['hero']['scrollIndicatorMarkup'] = '<svg width="160" height="50" viewBox="0 0 160 50" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0 50C55 50 45 0 80 0C115 0 105 50 160 50H0Z" fill="currentColor"/></svg>';

		return $settings;
	}
}
add_filter( 'novablocks_block_editor_settings', 'rosa2_alter_novablocks_hero_settings' );

if ( ! function_exists( 'rosa2_alter_novablocks_media_settings' ) ) {
	function rosa2_alter_novablocks_media_settings( $settings ) {
		$settings['media']['template'] = array(
			array(
				'novablocks/headline',
				array(
					'secondary' => 'Discover',
					'primary'   => 'Our Story',
					'align'     => 'center',
					'level'     => 2,
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
					'content' => 'Rosa is a restaurant, bar and coffee roastery located on a busy corner site in Farringdon’s Exmouth Market. With glazed frontage on two sides of the building, overlooking the market and a bustling London intersection.',
					'align'   => 'center',
				),
			),
			array(
				'core/button',
				array(
					'text'      => 'About Us',
					'align'     => 'center',
					'className' => 'is-style-text'
				),
			),
		);

		$settings['media']['attributes']['horizontalAlignment']['default'] = 'center';

		if ( ! empty( $settings['media']['blockAreaOptions'] ) ) {
			$settings['media']['blockAreaOptions'] = array_filter( $settings['media']['blockAreaOptions'], function ( $option ) {
				return $option['value'] != 'highlighted';
			} );
		}

		return $settings;
	}
}
add_filter( 'novablocks_block_editor_settings', 'rosa2_alter_novablocks_media_settings' );

if ( ! function_exists( 'rosa2_alter_novablocks_separator_settings' ) ) {
	function rosa2_alter_novablocks_separator_settings( $settings ) {
		if ( empty( $settings['separator'] ) ) {
			$settings['separator'] = array();
		}

		$settings['separator']['markup'] = rosa2_get_separator_markup();

		return $settings;
	}
}
add_filter( 'novablocks_block_editor_settings', 'rosa2_alter_novablocks_separator_settings' );
