<?php
/**
 * Intro Animations frontend integration.
 *
 * @package Anima
 */

// If this file is called directly, abort.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

add_filter( 'body_class', 'anima_intro_animations_body_class' );
add_action( 'wp_enqueue_scripts', 'anima_intro_animations_add_critical_inline_css', 30 );

/**
 * Check if intro animations are enabled.
 *
 * @return bool
 */
function anima_intro_animations_enabled() {
	$value = get_option( 'sm_intro_animations_enable', false );

	return in_array( $value, [ true, 1, '1', 'true' ], true );
}

/**
 * Get the normalized intro-animation style.
 *
 * Retired style slugs (e.g. `clip`, `flex` from pre-2.0.17 installs) fall
 * back to `fade` so sites that had them selected keep animating after upgrade
 * instead of silently rendering nothing.
 *
 * @return string
 */
function anima_get_intro_animation_style() {
	$style = get_option( 'sm_intro_animations_style', 'fade' );

	if ( in_array( $style, [ 'clip', 'flex' ], true ) ) {
		return 'fade';
	}

	if ( ! in_array( $style, anima_get_intro_animation_supported_styles(), true ) ) {
		return 'fade';
	}

	return $style;
}

/**
 * Get the normalized intro-animation speed.
 *
 * @return string
 */
function anima_get_intro_animation_speed() {
	$speed = get_option( 'sm_intro_animations_speed', 'medium' );

	if ( ! in_array( $speed, anima_get_intro_animation_supported_speeds(), true ) ) {
		return 'medium';
	}

	return $speed;
}

/**
 * Get the supported intro-animation styles.
 *
 * @return array
 */
function anima_get_intro_animation_supported_styles() {
	return [
		'fade',
		'scale',
		'slide',
	];
}

/**
 * Get the supported intro-animation speeds.
 *
 * @return array
 */
function anima_get_intro_animation_supported_speeds() {
	return [
		'slow',
		'medium',
		'fast',
	];
}

/**
 * Add body classes when intro animations are enabled.
 *
 * @param array $classes Existing body classes.
 *
 * @return array
 */
function anima_intro_animations_body_class( $classes ) {
	if ( ! anima_intro_animations_enabled() ) {
		return $classes;
	}

	$classes[] = 'has-intro-animations';
	$classes[] = 'has-intro-animations--' . sanitize_html_class( anima_get_intro_animation_style() );
	$classes[] = 'has-intro-animations--' . sanitize_html_class( anima_get_intro_animation_speed() );

	return $classes;
}

/**
 * Return the critical inline CSS used to stage intro-animation targets before boot.
 *
 * @return string
 */
function anima_get_intro_animations_critical_css() {
	if ( ! anima_intro_animations_enabled() ) {
		return '';
	}

	return '@media (prefers-reduced-motion: no-preference){body.has-intro-animations .anima-intro-target--pending{opacity:0;visibility:hidden;}}';
}

/**
 * Add the critical intro-animation CSS to the frontend stylesheet.
 *
 * @return void
 */
function anima_intro_animations_add_critical_inline_css() {
	$css = anima_get_intro_animations_critical_css();

	if ( '' === $css || ! wp_style_is( 'anima-style', 'enqueued' ) ) {
		return;
	}

	wp_add_inline_style( 'anima-style', $css );
}
