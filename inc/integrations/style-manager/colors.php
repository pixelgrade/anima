<?php

// If this file is called directly, abort.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

// Add colors section and options to the Style Manager config
add_filter( 'style_manager/filter_fields', 'pixelgrade_add_colors_section_to_style_manager_config', 50, 1 );

function pixelgrade_add_colors_section_to_style_manager_config( $config ) {

	if ( ! function_exists( 'sm_get_color_switch_dark_config' ) ||
	     ! function_exists( 'sm_get_color_switch_darker_config' ) ) {
		return $config;
	}

	if ( empty( $config['sections'] ) ) {
		$config['sections'] = array();
	}

	if ( ! isset( $config['sections']['colors_section'] ) ) {
		$config['sections']['colors_section'] = array();
	}

	// The section might be already defined, thus we merge, not replace the entire section config.
	$config['sections']['colors_section'] = \Pixelgrade\StyleManager\Utils\ArrayHelpers::array_merge_recursive_distinct( $config['sections']['colors_section'], array(
		'title'   => esc_html__( 'Colors', '__theme_txtd' ),
		'options' => array(
			'sm-description_colorize_elements_intro' => array(
				'type' => 'html',
				'html' => 'Apply color to specific elements from your site that you seek to get more attention.',
			),

			'main_content_section_title' => array(
				'type' => 'html',
				'html' => '<span class="sm-group__title">' . esc_html__( 'Main Content', '__theme_txtd' ) . '</span>',
			),

			'page_title' => sm_get_color_switch_dark_config( 'Page title', '.entry-title', false ),
			'body_color' => sm_get_color_switch_dark_config( 'Body text', 'html, [class*="sm-variation-"]', false ),
			'links_color' => sm_get_color_switch_dark_config( 'Body links', '*', true, '--theme-links-color' ),
			'heading_links_color' => sm_get_color_switch_dark_config( 'Heading links', 'h1, h2, h3, h4, h5, h6', true, '--theme-links-color' ),

			'sm-group-separator-1' => array( 'type' => 'html', 'html' => '' ),

			'colors_header_section_title' => array(
				'type' => 'html',
				'html' => '<span class="sm-group__title">' . esc_html__( 'Header', '__theme_txtd' ) . '</span>',
			),

			'menu_item_color' => sm_get_color_switch_dark_config( 'Navigation links', '.novablocks-navigation', false ),
			'menu_active_item_color' => sm_get_color_switch_dark_config( 'Navigaiton active link', '.novablocks-navigation > ul > li[class*="current"]', false ),

			'sm-group-separator-2' => array( 'type' => 'html', 'html' => '' ),

			'colors_headings_section_title' => array(
				'type' => 'html',
				'html' => '<span class="sm-group__title">' . esc_html__( 'Headings', '__theme_txtd' ) . '</span>',
			),

			'heading_1_color' => sm_get_color_switch_darker_config( 'Heading 1', 'h1', false ),
			'heading_2_color' => sm_get_color_switch_darker_config( 'Heading 2', 'h2', false ),
			'heading_3_color' => sm_get_color_switch_darker_config( 'Heading 3', 'h3', false ),
			'heading_4_color' => sm_get_color_switch_darker_config( 'Heading 4', 'h4', false ),
			'heading_5_color' => sm_get_color_switch_darker_config( 'Heading 5', 'h5', false ),
			'heading_6_color' => sm_get_color_switch_darker_config( 'Heading 6', 'h6', false ),

			'sm-group-separator-3' => array( 'type' => 'html', 'html' => '' ),

			'colors_buttons_section_title' => array(
				'type' => 'html',
				'html' => '<span class="sm-group__title">' . esc_html__( 'Buttons', '__theme_txtd' ) . '</span>',
			),

			'solid_button' => sm_get_color_switch_dark_config( 'Buttons', '*', false, '--sm-button-background-color' ),
			'text_button' => sm_get_color_switch_dark_config( 'Text', '.wp-block-button.is-style-text .wp-block-button__link', false, array( '--theme-button-text-color' ) ),

			'sm-group-separator-4' => array( 'type' => 'html', 'html' => '' ),

			'colors_novablocks_headline_section_title' => array(
				'type' => 'html',
				'html' => '<span class="sm-group__title">' . esc_html__( 'Headline Block', '__theme_txtd' ) . '</span>',
			),

			'novablocks_headline_primary' => sm_get_color_switch_darker_config( 'Headline primary', '.c-headline__primary', false ),
			'novablocks_headline_secondary' => sm_get_color_switch_darker_config( 'Headline secondary', '.c-headline__secondary', true ),

			'sm-description_colorize_elements_outro' => array(
				'type' => 'html',
				'html' => 'Some elements are not available in this list, and you can change their coloration by using CSS code snippets.',
			),

		),
	) );

	return $config;
}
