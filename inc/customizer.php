<?php
/**
 * Rosa 2 Theme Customizer.
 *
 * @package Rosa2
 */

/**
 * Add postMessage support for site title and description for the Theme Customizer.
 *
 * @param WP_Customize_Manager $wp_customize Theme Customizer object.
 */
function rosa2_customize_register( $wp_customize ) {
	$wp_customize->get_setting( 'blogname' )->transport         = 'postMessage';
	$wp_customize->get_setting( 'blogdescription' )->transport  = 'postMessage';
	$wp_customize->get_setting( 'header_textcolor' )->transport = 'postMessage';

	if ( isset( $wp_customize->selective_refresh ) ) {
		$wp_customize->selective_refresh->add_partial( 'blogname', array(
			'selector' => '.site-title',
			'render_callback' => 'rosa2_customize_partial_blogname',
		) );
		$wp_customize->selective_refresh->add_partial( 'blogdescription', array(
			'selector' => '.site-description',
			'render_callback' => 'rosa2_customize_partial_blogdescription',
		) );
	}

	// add a setting for the site logo
	$wp_customize->add_setting('rosa_transparent_logo', array(
		'theme_supports' => array( 'custom-logo' ),
		'transport'      => 'postMessage',
		'sanitize_callback' => 'rosa2_sanitize_transparent_logo',
	) );

	// Add a control to upload the logo
	// But first get the custom logo options
	$custom_logo_args = get_theme_support( 'custom-logo' );
	$wp_customize->add_control( new WP_Customize_Cropped_Image_Control( $wp_customize, 'rosa_transparent_logo',
		array(
			'label' => esc_html__( 'Logo while on Transparent Header', 'rosa-2' ),
			'button_labels' => array(
				'select'       => esc_html__( 'Select logo', 'rosa-2' ),
				'change'       => esc_html__( 'Change logo', 'rosa-2' ),
				'default'      => esc_html__( 'Default', 'rosa-2' ),
				'remove'       => esc_html__( 'Remove', 'rosa-2' ),
				'placeholder'  => esc_html__( 'No logo selected', 'rosa-2' ),
				'frame_title'  => esc_html__( 'Select logo', 'rosa-2' ),
				'frame_button' => esc_html__( 'Choose logo', 'rosa-2' ),
			),
			'section' => 'title_tagline',
			'priority'      => 9, // put it after the normal logo that has priority 8
			'height'        => $custom_logo_args[0]['height'],
			'width'         => $custom_logo_args[0]['width'],
			'flex_height'   => $custom_logo_args[0]['flex-height'],
			'flex_width'    => $custom_logo_args[0]['flex-width'],
		) ) );

	$wp_customize->selective_refresh->add_partial( 'rosa_transparent_logo', array(
		'settings'            => array( 'rosa_transparent_logo' ),
		'selector'            => '.custom-logo-link--transparent',
		'render_callback'     => 'rosa2_customizer_partial_transparent_logo',
		'container_inclusive' => true,
	) );
}
add_action( 'customize_register', 'rosa2_customize_register' );

/* ============================
 * Customizer sanitization
 * ============================ */

function rosa2_sanitize_transparent_logo( $input ) {
	return $input;
}

/* ============================
 * Customizer rendering helpers
 * ============================ */

/**
 * Render the site title for the selective refresh partial.
 *
 * @see rosa2_customize_register()
 *
 * @return void
 */
function rosa2_customize_partial_blogname() {
	return get_bloginfo( 'name', 'display' );
}

/**
 * Render the site tagline for the selective refresh partial.
 *
 * @see rosa2_customize_register()
 *
 * @return void
 */
function rosa2_customize_partial_blogdescription() {
	return get_bloginfo( 'description', 'display' );
}

/**
 * Callback for rendering the custom logo, used in the custom_logo partial.
 *
 * This method exists because the partial object and context data are passed
 * into a partial's render_callback so we cannot use get_custom_logo() as
 * the render_callback directly since it expects a blog ID as the first
 * argument. When WP no longer supports PHP 5.3, this method can be removed
 * in favor of an anonymous function.
 *
 * @see WP_Customize_Manager::register_controls()
 *
 * @return string Custom logo transparent.
 */
function rosa2_customizer_partial_transparent_logo() {
	return rosa2_get_custom_logo_transparent();
}
