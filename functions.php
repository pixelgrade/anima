<?php

function novablocks_deregister_gutenberg_styles() {
	// Overwrite Core block styles with empty styles.
	wp_deregister_style( 'wp-block-library' );
	wp_register_style( 'wp-block-library',  '' );

	// Overwrite Core theme styles with empty styles.
	wp_deregister_style( 'wp-block-library-theme' );
	wp_register_style( 'wp-block-library-theme', '' );
}
add_action( 'enqueue_block_assets', 'novablocks_deregister_gutenberg_styles' );

function novablocks_enqueue_theme_block_editor_assets() {
	wp_enqueue_style( 'nova-google-webfonts', 'https://fonts.googleapis.com/css?family=Cabin:400,400i,700,700i|Herr+Von+Muellerhoff|Source+Sans+Pro:600,900&display=swap', array(), wp_get_theme()->get( 'Version' ) );
	wp_enqueue_style('nova-block-styles', get_template_directory_uri() . '/editor.css' );
	wp_enqueue_style('nova-theme-styles', get_template_directory_uri() . '/dist/js/editor.blocks.css' );

	wp_enqueue_script(
		'nova-theme-js',
		get_template_directory_uri() . '/dist/js/editor.blocks.js',
		array( 'wp-blocks', 'wp-dom', 'wp-hooks' ),
		false,
		true
	);
}
add_action( 'enqueue_block_editor_assets', 'novablocks_enqueue_theme_block_editor_assets' );

function novablocks_scripts() {
	wp_enqueue_style( 'nova-google-webfonts', 'https://fonts.googleapis.com/css?family=Cabin:400,400i,700,700i|Herr+Von+Muellerhoff|Source+Sans+Pro:600,900&display=swap', array(), wp_get_theme()->get( 'Version' ) );
	wp_enqueue_style( 'nova-style', get_stylesheet_uri(), array(), wp_get_theme()->get( 'Version' ) );
	wp_enqueue_style( 'nova-theme-styles', get_template_directory_uri() . '/dist/js/editor.blocks.css' );

	if ( is_singular() && comments_open() && get_option( 'thread_comments' ) ) {
		wp_enqueue_script( 'comment-reply' );
	}
}
add_action( 'wp_enqueue_scripts', 'novablocks_scripts', 10 );

function novablocks_setup() {
	/**
	 * Make theme available for translation.
	 * Translations can be filed in the /languages/ directory.
	 * If you're building a theme based on Nova, use a find and replace
	 * to change '__theme_txtd' to the name of your theme in all the template files.
	 */
	load_theme_textdomain( '__theme_txtd', get_template_directory() . '/languages' );

	// Add default posts and comments RSS feed links to head.
	add_theme_support( 'automatic-feed-links' );

	/**
	 * Let WordPress manage the document title.
	 * By adding theme support, we declare that this theme does not use a
	 * hard-coded <title> tag in the document head, and expect WordPress to
	 * provide it for us.
	 */
	add_theme_support( 'title-tag' );

	/**
	 * Enable support for Post Thumbnails on posts and pages.
	 *
	 * @link https://developer.wordpress.org/themes/functionality/featured-images-post-thumbnails/
	 */
	add_theme_support( 'post-thumbnails' );

	/**
	 * Switch default core markup for search form, comment form, and comments
	 * to output valid HTML5.
	 */
	add_theme_support( 'html5', array(
		'search-form',
		'comment-form',
		'comment-list',
		'gallery',
		'caption',
	) );

	// This theme uses wp_nav_menu() in one location.
	register_nav_menus( array(
		'menu-1' => esc_html__( 'Primary Menu', '__theme_txtd' ),
	) );

	// Add theme support for selective refresh for widgets.
	add_theme_support( 'customize-selective-refresh-widgets' );

	/**
	 * Add support for core custom logo.
	 *
	 * @link https://codex.wordpress.org/Theme_Logo
	 */
	add_theme_support( 'custom-logo', array(
		'height'      => 250,
		'width'       => 250,
		'flex-width'  => true,
		'flex-height' => true,
	) );

	add_theme_support( 'align-wide' );

	/**
	 * Add support for Style Manager section in Customizer.
	 */
	add_theme_support( 'customizer_style_manager' );

	/**
	 * Add theme support for responsive embeds
	 */
	add_theme_support( 'responsive-embeds' );

	add_theme_support( 'disable-custom-font-sizes' );

	/**
	 * Add custom colors to the default Color palette control in the block editor
	 */
	add_theme_support( 'editor-color-palette', array(
		array(
			'name'  => __( 'Blue', '__theme_txtd' ),
			'slug'  => 'nova-blue',
			'color'	=> '#203AB6',
		),
		array(
			'name'  => __( 'Yellow', '__theme_txtd' ),
			'slug'  => 'nova-yellow',
			'color' => '#FFE42E',
		),
		array(
			'name'  => __( 'Almost Black', '__theme_txtd' ),
			'slug'  => 'nova-almost-black',
			'color' => '#000043',
		),
		array(
			'name'  => __( 'Darkest Blue', '__theme_txtd' ),
			'slug'  => 'nova-darkest-blue',
			'color' => '#272743',
		),
		array(
			'name'  => __( 'White', '__theme_txtd' ),
			'slug'  => 'nova-white',
			'color' => '#FFFFFF',
		),
		array(
			'name'  => __( 'Gray', '__theme_txtd' ),
			'slug'  => 'nova-gray',
			'color' => '#EEF1F2',
		),
	) );

	add_theme_support( 'editor-font-sizes', array(
		array(
			'name'      => __( 'Tiny', '__theme_txtd' ),
			'size'      => 13,
			'slug'      => 'tiny'
		),
		array(
			'name'      => __( 'Small', '__theme_txtd' ),
			'size'      => 16,
			'slug'      => 'small'
		),
		array(
			'name'      => __( 'Normal', '__theme_txtd' ),
			'size'      => 22,
			'slug'      => 'normal'
		),
		array(
			'name'      => __( 'Medium', '__theme_txtd' ),
			'size'      => 29,
			'slug'      => 'medium'
		),
		array(
			'name'      => __( 'Large', '__theme_txtd' ),
			'size'      => 45,
			'slug'      => 'large'
		),
		array(
			'name'      => __( 'Huge', '__theme_txtd' ),
			'size'      => 79,
			'slug'      => 'huge'
		),
	) );
}
add_action( 'after_setup_theme', 'novablocks_setup' );

/**
 * Customify integration for this theme.
 */
require get_template_directory() . '/inc/customify.php';

/**
 * Custom template tags for this theme.
 */
require get_template_directory() . '/inc/template-tags.php';

/**
 * Functions which enhance the theme by hooking into WordPress.
 */
require get_template_directory() . '/inc/template-functions.php';
require get_template_directory() . '/inc/extras.php';
