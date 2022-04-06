<?php
/**
 * Anima Theme Customizer logic.
 *
 * @package Anima
 */

// If this file is called directly, abort.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! class_exists( 'Anima_Admin_Customize', false ) ) :

	/**
	 * Anima_Admin_Customize Class.
	 */
	class Anima_Admin_Customize {

		/**
		 * Initialize customize actions.
		 */
		public function __construct() {
			add_action( 'customize_register', [ $this, 'customize_register' ] );
			// Scripts and styles enqueued in the Customizer.
			add_action( 'customize_controls_enqueue_scripts', [ $this, 'enqueue_assets' ], 15 );
		}

		/**
		 * Add postMessage support for site title and description for the Theme Customizer.
		 *
		 * @param WP_Customize_Manager $wp_customize Theme Customizer object.
		 */
		public function customize_register( WP_Customize_Manager $wp_customize ) {
			$wp_customize->get_setting( 'blogname' )->transport         = 'postMessage';
			$wp_customize->get_setting( 'blogdescription' )->transport  = 'postMessage';
			$wp_customize->get_setting( 'header_textcolor' )->transport = 'postMessage';

			if ( isset( $wp_customize->selective_refresh ) ) {
				$wp_customize->selective_refresh->add_partial( 'blogname', [
					'selector' => '.site-title',
					'render_callback' => [ $this, 'customize_partial_blogname' ],
				] );
				$wp_customize->selective_refresh->add_partial( 'blogdescription', [
					'selector' => '.site-description',
					'render_callback' => [ $this, 'customize_partial_blogdescription' ],
				] );
			}

			// add a setting for the site logo
			$wp_customize->add_setting('anima_transparent_logo', [
				'theme_supports' => [ 'custom-logo' ],
				'transport'      => 'postMessage',
				'sanitize_callback' => [ $this, 'sanitize_transparent_logo' ],
			] );

			// Add a control to upload the logo
			// But first get the custom logo options
			$custom_logo_args = get_theme_support( 'custom-logo' );
			$wp_customize->add_control( new WP_Customize_Cropped_Image_Control( $wp_customize, 'anima_transparent_logo',
				[
					'label' => esc_html__( 'Logo while on Transparent Header', '__theme_txtd' ),
					'button_labels' => [
						'select'       => esc_html__( 'Select logo', '__theme_txtd' ),
						'change'       => esc_html__( 'Change logo', '__theme_txtd' ),
						'default'      => esc_html__( 'Default', '__theme_txtd' ),
						'remove'       => esc_html__( 'Remove', '__theme_txtd' ),
						'placeholder'  => esc_html__( 'No logo selected', '__theme_txtd' ),
						'frame_title'  => esc_html__( 'Select logo', '__theme_txtd' ),
						'frame_button' => esc_html__( 'Choose logo', '__theme_txtd' ),
					],
					'section' => 'title_tagline',
					'priority'      => 9, // put it after the normal logo that has priority 8
					'height'        => $custom_logo_args[0]['height'],
					'width'         => $custom_logo_args[0]['width'],
					'flex_height'   => $custom_logo_args[0]['flex-height'],
					'flex_width'    => $custom_logo_args[0]['flex-width'],
				] ) );

			$wp_customize->selective_refresh->add_partial( 'anima_transparent_logo', [
				'settings'            => [ 'anima_transparent_logo' ],
				'selector'            => '.custom-logo-link--transparent',
				'render_callback'     => [ $this, 'customizer_partial_transparent_logo' ],
				'container_inclusive' => true,
			] );
		}

		/**
		 * Enqueue Customizer scripts and styles.
		 *
		 * @since 2.0.0
		 */
		public function enqueue_assets() {
			$theme  = wp_get_theme( get_template() );

			wp_enqueue_style( 'anima-customizer', get_template_directory_uri() . '/dist/css/admin/customizer.css', [], $theme->get( 'Version' ) );
			wp_style_add_data( 'anima-customizer', 'rtl', 'replace' );
		}

		/* ============================
		 * Customizer sanitization
		 * ============================ */

		public function sanitize_transparent_logo( $input ) {
			return $input;
		}

		/* ============================
		 * Customizer rendering helpers
		 * ============================ */

		/**
		 * Render the site title for the selective refresh partial.
		 *
		 * @see Anima_Admin_Customize::customize_register()
		 *
		 * @return void
		 */
		public function customize_partial_blogname() {
			return get_bloginfo( 'name', 'display' );
		}

		/**
		 * Render the site tagline for the selective refresh partial.
		 *
		 * @see Anima_Admin_Customize::customize_register()
		 *
		 * @return void
		 */
		public function customize_partial_blogdescription() {
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
		public function customizer_partial_transparent_logo() {
			return anima_get_custom_logo_transparent();
		}
	}

endif;

return new Anima_Admin_Customize();
