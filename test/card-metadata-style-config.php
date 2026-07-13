<?php
/**
 * Contract test for the site-wide Card Metadata Style and Nova bridge.
 *
 * Run through WordPress with Anima active.
 */

function anima_fail_card_metadata_style_test( string $message ): void {
	fwrite( STDERR, $message . PHP_EOL );
	exit( 1 );
}

if ( ! defined( 'ABSPATH' ) ) {
	anima_fail_card_metadata_style_test( 'This script must run through wp eval-file.' );
}

if ( ! function_exists( 'anima_get_card_metadata_style' ) ) {
	anima_fail_card_metadata_style_test( 'Expected Anima to expose the site-wide card metadata style.' );
}

$original_style = get_option( 'sm_card_metadata_style', null );

try {
	$config                = apply_filters( 'style_manager/filter_fields', [] );
	$style_manager_section = $config['sections']['style_manager_section'] ?? [];
	$style_option          = $style_manager_section['options']['sm_card_metadata_style'] ?? [];

	if ( 'sm_radio' !== ( $style_option['type'] ?? '' )
		|| 'plain' !== ( $style_option['default'] ?? '' )
		|| [ 'plain', 'accent-label' ] !== array_keys( $style_option['choices'] ?? [] ) ) {
		anima_fail_card_metadata_style_test( 'Expected Plain and Accent Label choices with a safe Plain default.' );
	}

	$panel_config = apply_filters(
		'style_manager/sm_panel_config',
		[
			'sections' => [
				'sm_tweak_board_section' => [
					'options' => [],
				],
			],
		],
		$style_manager_section
	);
	$tweak_board_style_option = $panel_config['sections']['sm_tweak_board_section']['options']['sm_card_metadata_style'] ?? [];

	if ( $style_option !== $tweak_board_style_option ) {
		anima_fail_card_metadata_style_test( 'Expected Card metadata style to be available from the Tweak Board section.' );
	}

	update_option( 'sm_card_metadata_style', 'accent-label' );
	if ( 'accent-label' !== anima_get_card_metadata_style() ) {
		anima_fail_card_metadata_style_test( 'Expected the Accent Label site setting to resolve.' );
	}

	$editor_settings = apply_filters( 'novablocks_block_editor_settings', [] );
	if ( 'accent-label' !== ( $editor_settings['cardMetadataStyleDefault'] ?? '' ) ) {
		anima_fail_card_metadata_style_test( 'Expected the editor settings bridge to expose the site default.' );
	}

	$frontend_default = apply_filters( 'novablocks/card_metadata_style_default', 'plain', [] );
	if ( 'accent-label' !== $frontend_default ) {
		anima_fail_card_metadata_style_test( 'Expected the frontend Nova filter to expose the site default.' );
	}
} finally {
	if ( null === $original_style ) {
		delete_option( 'sm_card_metadata_style' );
	} else {
		update_option( 'sm_card_metadata_style', $original_style );
	}
}

echo "Anima card metadata style contract OK\n";
