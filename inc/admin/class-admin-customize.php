<?php
/**
 * Rosa 2 Theme Customizer logic.
 *
 * @package Rosa2
 */

// If this file is called directly, abort.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! class_exists( 'Rosa2_Admin_Customize', false ) ) :

	/**
	 * Rosa2_Admin_Customize Class.
	 */
	class Rosa2_Admin_Customize {

		/**
		 * Initialize customize actions.
		 */
		public function __construct() {
			add_action( 'customize_register', array( $this, 'customize_register' ) );

			// Include custom items to customizer nav menu settings.
			add_filter( 'customize_nav_menu_available_item_types', array( $this, 'register_customize_nav_menu_item_types' ) );
			add_filter( 'customize_nav_menu_available_items', array( $this, 'register_customize_nav_menu_items' ), 10, 4 );
		}

		/**
		 * Add postMessage support for site title and description for the Theme Customizer.
		 *
		 * @param WP_Customize_Manager $wp_customize Theme Customizer object.
		 */
		public function customize_register( $wp_customize ) {
			$wp_customize->get_setting( 'blogname' )->transport         = 'postMessage';
			$wp_customize->get_setting( 'blogdescription' )->transport  = 'postMessage';
			$wp_customize->get_setting( 'header_textcolor' )->transport = 'postMessage';

			if ( isset( $wp_customize->selective_refresh ) ) {
				$wp_customize->selective_refresh->add_partial( 'blogname', array(
					'selector' => '.site-title',
					'render_callback' => array( $this, 'customize_partial_blogname' ),
				) );
				$wp_customize->selective_refresh->add_partial( 'blogdescription', array(
					'selector' => '.site-description',
					'render_callback' => array( $this, 'customize_partial_blogdescription' ),
				) );
			}

			// add a setting for the site logo
			$wp_customize->add_setting('rosa_transparent_logo', array(
				'theme_supports' => array( 'custom-logo' ),
				'transport'      => 'postMessage',
				'sanitize_callback' => array( $this, 'sanitize_transparent_logo' ),
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
				'render_callback'     => array( $this, 'customizer_partial_transparent_logo' ),
				'container_inclusive' => true,
			) );
		}

		/**
		 * Register customize new nav menu item types.
		 *
		 * @param  array $item_types Menu item types.
		 * @return array
		 */
		public function register_customize_nav_menu_item_types( $item_types ) {
			$item_types[] = array(
				'title'      => __( 'Extras', '__theme_txtd' ),
				'type_label' => __( 'Extras', '__theme_txtd' ),
				'type'       => 'custom',
				'object'     => 'rosa2',
			);

			return $item_types;
		}

		/**
		 * Add our extra menu items to customize nav menu items.
		 *
		 * @param  array   $items  List of nav menu items.
		 * @param  string  $type   Nav menu type.
		 * @param  string  $object Nav menu object.
		 * @param  integer $page   Page number.
		 * @return array
		 */
		public function register_customize_nav_menu_items( $items = array(), $type = '', $object = '', $page = 0 ) {
			if ( 'rosa2' !== $object ) {
				return $items;
			}

			// Don't allow pagination since all items are loaded at once.
			if ( 0 < $page ) {
				return $items;
			}

			$items[] = array(
				'id'         => '#search',
				'title'      => esc_html__( 'Search', '__theme_txtd' ),
				'type_label' => esc_html__( 'Search Link', '__theme_txtd' ),
				'url'        => esc_url_raw( '#search' ),
			);

			return $items;
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
		 * @see Rosa2_Admin_Customize::customize_register()
		 *
		 * @return void
		 */
		public function customize_partial_blogname() {
			return get_bloginfo( 'name', 'display' );
		}

		/**
		 * Render the site tagline for the selective refresh partial.
		 *
		 * @see Rosa2_Admin_Customize::customize_register()
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
			return rosa2_get_custom_logo_transparent();
		}
	}

endif;

return new Rosa2_Admin_Customize();
