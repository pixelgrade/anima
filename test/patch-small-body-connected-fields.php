<?php
/**
 * Contract test for the Patch excerpt role following Style Manager palettes.
 *
 * Run from the theme root:
 * php test/patch-small-body-connected-fields.php
 */

function anima_fail_patch_small_body_contract( string $message ): void {
	fwrite( STDERR, $message . PHP_EOL );
	exit( 1 );
}

if ( ! defined( 'ABSPATH' ) ) {
	define( 'ABSPATH', __DIR__ );
}

function add_filter( string $hook_name, $callback, int $priority = 10, int $accepted_args = 1 ): bool {
	return true;
}

function current_theme_supports( string $feature ): bool {
	return 'customizer_style_manager' === $feature;
}

function esc_html__( string $text, string $domain ): string {
	return $text;
}

require_once dirname( __DIR__ ) . '/inc/integrations/style-manager/connected-fields.php';

$config = anima_add_style_manager_connected_fields(
	[
		'sections' => [
			'style_manager_section' => [],
		],
	]
);

$options = $config['sections']['style_manager_section']['options'] ?? [];
$default_body_fields = $options['sm_font_body']['connected_fields'] ?? [];

if ( ! in_array( 'small_body_font', $default_body_fields, true ) ) {
	anima_fail_patch_small_body_contract( 'small_body_font must follow sm_font_body in the default connected-fields map.' );
}

$presets = $options['sm_fonts_connected_fields_preset']['choices'] ?? [];
foreach ( $presets as $preset_id => $preset ) {
	$owner = null;
	foreach ( $preset['config'] ?? [] as $master_font_id => $connected_fields ) {
		if ( in_array( 'body_font', $connected_fields, true ) ) {
			$owner = $master_font_id;
			break;
		}
	}

	if ( null === $owner || ! in_array( 'small_body_font', $preset['config'][ $owner ] ?? [], true ) ) {
		anima_fail_patch_small_body_contract( "small_body_font must follow body_font in {$preset_id}." );
	}
}

echo "Patch small-body connected-fields contract OK\n";
