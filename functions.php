<?php

function nova_theme_deregister_gutenberg_styles() {
	// Overwrite Core block styles with empty styles.
	wp_deregister_style( 'wp-block-library' );
	wp_register_style( 'wp-block-library', '' );

	// Overwrite Core theme styles with empty styles.
	wp_deregister_style( 'wp-block-library-theme' );
	wp_register_style( 'wp-block-library-theme', '' );
}
add_action( 'enqueue_block_assets', 'nova_theme_deregister_gutenberg_styles', 20 );

function nova_theme_enqueue_block_editor_assets() {
	wp_enqueue_style('nova-theme-block-styles', get_template_directory_uri() . '/editor.css' );
}
add_action( 'enqueue_block_editor_assets', 'nova_theme_enqueue_block_editor_assets' );

function nova_theme_scripts() {
	wp_enqueue_style( 'nova-theme-adelle-sans', 'https://use.typekit.net/gsj4hyt.css', array(), wp_get_theme()->get( 'Version' ) );
	wp_enqueue_style( 'nova-theme-styles', get_stylesheet_uri(), array(), wp_get_theme()->get( 'Version' ) );
}
add_action( 'wp_enqueue_scripts', 'nova_theme_scripts' );

function nova_theme_setup() {
	add_theme_support( 'align-wide' );
	add_theme_support( 'custom-logo' );
	add_theme_support( 'customizer_style_manager' );
}
add_action( 'after_setup_theme', 'nova_theme_setup', 10 );

function nova_add_customify_options( $config ) {
	$config['opt-name'] = 'nova_options';

	//start with a clean slate - no Customify default sections
	$config['sections'] = array();

	return $config;
}
add_filter( 'customify_filter_fields', 'nova_add_customify_options', 10, 1 );
