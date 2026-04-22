<?php
/**
 * Contract test for intro animations frontend integration.
 *
 * Run with:
 * studio wp eval-file /Users/georgeolaru/.config/superpowers/worktrees/anima/intro-animations/test/intro-animations-contract.php
 */

function anima_fail_intro_animations_contract_test( string $message ): void {
	fwrite( STDERR, $message . PHP_EOL );
	exit( 1 );
}

if ( ! defined( 'ABSPATH' ) ) {
	anima_fail_intro_animations_contract_test( 'This script must run through wp eval-file.' );
}

$integration_file = dirname( __DIR__ ) . '/inc/integrations/intro-animations.php';

if ( file_exists( $integration_file ) ) {
	require_once $integration_file;
}

if ( ! function_exists( 'anima_intro_animations_enabled' ) ) {
	anima_fail_intro_animations_contract_test( 'Expected intro animations integration helpers to be available.' );
}

$original_enable = get_option( 'sm_intro_animations_enable', null );
$original_style  = get_option( 'sm_intro_animations_style', null );
$original_speed  = get_option( 'sm_intro_animations_speed', null );

delete_option( 'sm_intro_animations_enable' );
delete_option( 'sm_intro_animations_style' );
delete_option( 'sm_intro_animations_speed' );

$disabled_classes = anima_intro_animations_body_class( [] );

if ( in_array( 'has-intro-animations', $disabled_classes, true ) ) {
	anima_fail_intro_animations_contract_test( 'Expected disabled intro animations to add no intro body classes.' );
}

if ( '' !== anima_get_intro_animations_critical_css() ) {
	anima_fail_intro_animations_contract_test( 'Expected disabled intro animations to return no critical CSS.' );
}

update_option( 'sm_intro_animations_enable', 1 );
update_option( 'sm_intro_animations_style', 'scale' );
update_option( 'sm_intro_animations_speed', 'fast' );

$enabled_classes = anima_intro_animations_body_class( [] );

if ( ! in_array( 'has-intro-animations', $enabled_classes, true ) ) {
	anima_fail_intro_animations_contract_test( 'Expected enabled intro animations to add the base body class.' );
}

if ( ! in_array( 'has-intro-animations--scale', $enabled_classes, true ) ) {
	anima_fail_intro_animations_contract_test( 'Expected enabled intro animations to add the normalized style class.' );
}

if ( ! in_array( 'has-intro-animations--fast', $enabled_classes, true ) ) {
	anima_fail_intro_animations_contract_test( 'Expected enabled intro animations to add the normalized speed class.' );
}

$critical_css = anima_get_intro_animations_critical_css();

if ( '' === $critical_css ) {
	anima_fail_intro_animations_contract_test( 'Expected enabled intro animations to return critical CSS.' );
}

update_option( 'sm_intro_animations_style', 'not-a-real-style' );
update_option( 'sm_intro_animations_speed', 'not-a-real-speed' );

if ( 'fade' !== anima_get_intro_animation_style() ) {
	anima_fail_intro_animations_contract_test( 'Expected invalid style values to normalize to fade.' );
}

if ( 'medium' !== anima_get_intro_animation_speed() ) {
	anima_fail_intro_animations_contract_test( 'Expected invalid speed values to normalize to medium.' );
}

update_option( 'sm_intro_animations_style', 'clip' );

if ( 'fade' !== anima_get_intro_animation_style() ) {
	anima_fail_intro_animations_contract_test( 'Expected retired "clip" style to migrate to fade.' );
}

update_option( 'sm_intro_animations_style', 'flex' );

if ( 'fade' !== anima_get_intro_animation_style() ) {
	anima_fail_intro_animations_contract_test( 'Expected retired "flex" style to migrate to fade.' );
}

$supported_styles = anima_get_intro_animation_supported_styles();

if ( in_array( 'clip', $supported_styles, true ) || in_array( 'flex', $supported_styles, true ) ) {
	anima_fail_intro_animations_contract_test( 'Expected retired styles to be absent from the supported styles list.' );
}

if ( null === $original_enable ) {
	delete_option( 'sm_intro_animations_enable' );
} else {
	update_option( 'sm_intro_animations_enable', $original_enable );
}

if ( null === $original_style ) {
	delete_option( 'sm_intro_animations_style' );
} else {
	update_option( 'sm_intro_animations_style', $original_style );
}

if ( null === $original_speed ) {
	delete_option( 'sm_intro_animations_speed' );
} else {
	update_option( 'sm_intro_animations_speed', $original_speed );
}

echo "intro animations contract ok\n";
