<?php

// If this file is called directly, abort.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

// Add colors section and options to the Style Manager config
add_filter( 'style_manager/filter_fields', 'pixelgrade_add_colors_section_to_style_manager_config', 50, 1 );

// Prepend theme color palette to the default color palettes list
add_filter( 'style_manager/get_color_palettes', 'pixelgrade_add_default_color_palettes' );

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
		'title'   => esc_html__( 'Elements coloration', '__theme_txtd' ),
		'options' => array(
			'sm-description_colorize_elements_intro' => array(
				'type' => 'html',
				'html' => 'Apply color to <a href="https://pixelgrade.com/docs/rosa2/design-and-style/color-system/#change-elements-color-one-by-one" target="blank">specific elements</a> from your site that you seek to get more attention.',
			),

			'main_content_section_title' => array(
				'type' => 'html',
				'html' => '<span class="sm-group__title">' . esc_html__( 'Main Content', '__theme_txtd' ) . '</span>',
			),

			'page_title' => sm_get_color_switch_dark_config( 'Page title', '.page-title', false, 2 ),
			'body_color' => sm_get_color_switch_dark_config( 'Body text', 'html, [class*="sm-variation-"]', false, 0 ),
			'links_color' => sm_get_color_switch_dark_config( 'Body links', 'a', true, 1, '--theme-links-color' ),
			'heading_links_color' => sm_get_color_switch_dark_config( 'Heading links', 'h1 a, h2 a, h3 a, h4 a, h5 a, h6 a', false, 2, '--theme-links-color' ),

			'sm-group-separator-1' => array( 'type' => 'html', 'html' => '' ),

			'colors_header_section_title' => array(
				'type' => 'html',
				'html' => '<span class="sm-group__title">' . esc_html__( 'Header', '__theme_txtd' ) . '</span>',
			),

			'menu_item_color' => sm_get_color_switch_dark_config( 'Navigation links', '.novablocks-navigation', false, 1 ),
			'menu_active_item_color' => sm_get_color_switch_dark_config( 'Navigaiton active link', '.novablocks-navigation > ul > li[class*="current"]', true, 3 ),

			'sm-group-separator-2' => array( 'type' => 'html', 'html' => '' ),

			'colors_headings_section_title' => array(
				'type' => 'html',
				'html' => '<span class="sm-group__title">' . esc_html__( 'Headings', '__theme_txtd' ) . '</span>',
			),

			'super_display_color' => sm_get_color_switch_darker_config( 'Super Display', '*', false, 1, [ '--theme-super-display-color' ] ),
			'display_color'       => sm_get_color_switch_darker_config( 'Display', '*', false, 1, [ '--theme-display-color' ] ),
			'heading_1_color'     => sm_get_color_switch_darker_config( 'Heading 1', '*', false, 1, [ '--theme-heading-1-color' ] ),
			'heading_2_color'     => sm_get_color_switch_darker_config( 'Heading 2', '*', false, 1, [ '--theme-heading-2-color' ] ),
			'heading_3_color'     => sm_get_color_switch_darker_config( 'Heading 3', '*', false, 2, [ '--theme-heading-3-color' ] ),
			'heading_4_color'     => sm_get_color_switch_darker_config( 'Heading 4', '*', false, 2, [ '--theme-heading-4-color' ] ),
			'heading_5_color'     => sm_get_color_switch_darker_config( 'Heading 5', '*', false, 3, [ '--theme-heading-5-color' ] ),
			'heading_6_color'     => sm_get_color_switch_darker_config( 'Heading 6', '*', false, 3, [ '--theme-heading-6-color' ] ),

			'sm-group-separator-3' => array( 'type' => 'html', 'html' => '' ),

			'colors_buttons_section_title' => array(
				'type' => 'html',
				'html' => '<span class="sm-group__title">' . esc_html__( 'Buttons', '__theme_txtd' ) . '</span>',
			),

			'solid_button' => sm_get_color_switch_dark_config( 'Buttons', '*', false, 3, '--sm-button-background-color' ),
			'text_button' => sm_get_color_switch_dark_config( 'Text', '.wp-block-button.is-style-text .wp-block-button__link', true, 4, array( '--theme-button-text-color' ) ),

			'sm-group-separator-4' => array( 'type' => 'html', 'html' => '' ),

			'colors_novablocks_headline_section_title' => array(
				'type' => 'html',
				'html' => '<span class="sm-group__title">' . esc_html__( 'Headline Block', '__theme_txtd' ) . '</span>',
			),

			'novablocks_headline_primary' => sm_get_color_switch_darker_config( 'Headline primary', '.c-headline__primary', false, 2 ),
			'novablocks_headline_secondary' => sm_get_color_switch_darker_config( 'Headline secondary', '.c-headline__secondary', true, 3 ),

			'colors_novablocks_card_section_title' => array(
				'type' => 'html',
				'html' => '<span class="sm-group__title">' . esc_html__( 'Card Block', '__theme_txtd' ) . '</span>',
			),

			'novablocks_card_meta_first' => sm_get_color_switch_darker_config( 'Meta', '.novablocks-grid__item-meta', false, 2 ),

			'sm-description_colorize_elements_outro' => array(
				'type' => 'html',
				'html' => 'Some elements are not available in this list, and you can change their coloration by using CSS code snippets.',
			),

		),
	) );

	return $config;
}

function pixelgrade_add_default_color_palettes( $color_palettes ) {

	$color_palettes = array_merge( array(
		'default' => array(
			'id'           => 0,
			'label'        => esc_html__( 'Theme Default', '__theme_txtd' ),
			'description'  => esc_html__( 'Rosa2 is to colors what wisdom is to knowledge', '__theme_txtd' ),
			'preview'      => array(
				'background_image_url' => '//cloud.pixelgrade.com/wp-content/uploads/2018/07/rosa-palette.jpg',
			),
			'color_groups' => [
				[
					"_uid" => "color_group_1",
					"sources" => [
						[
							"_uid" => "color_11",
							"label" => "Brand Primary",
							"color" => "#ddaa61"
						]
					]
				],
				[
					"_uid" => "color_group_2",
					"sources" => [
						[
							"_uid" => "color_21",
							"label" => "Secondary",
							"color" => "#39497C"
						]
					]
				],
				[
					"_uid" => "color_group_3",
					"sources" => [
						[
							"_uid" => "color_31",
							"label" => "Tertiary",
							"color" => "#B12C4A"
						]
					]
				]
			],
			'tags'         => array(),
			'hashid'       => 'default',
		),
	), $color_palettes );

	return $color_palettes;
}
