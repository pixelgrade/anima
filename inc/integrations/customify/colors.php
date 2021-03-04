<?php

// If this file is called directly, abort.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

// Add colors section and options to the Customify config
add_filter( 'customify_filter_fields', 'pixelgrade_add_colors_section_to_customify_config', 50, 1 );

// Prepend theme color palette to the default color palettes list
add_filter( 'customify_get_color_palettes', 'pixelgrade_add_default_color_palettes' );

function pixelgrade_add_colors_section_to_customify_config( $config ) {

	if ( empty( $config['sections'] ) ) {
		$config['sections'] = array();
	}

	if ( ! isset( $config['sections']['colors_section'] ) ) {
		$config['sections']['colors_section'] = array();
	}

	$config['sections']['colors_section'] = Customify_Array::array_merge_recursive_distinct( $config['sections']['colors_section'], array(
		'title'   => esc_html__( 'Colors', '__theme_txtd' ),
		'options' => array(
			'body_color' => sm_get_color_switch_dark_config( 'Body', 'html, [class*="sm-variation-"]', 'off' ),

			'colors_links_section_title' => array(
				'type' => 'html',
				'html' => '<span class="separator sub-section label">' . esc_html__( 'Links', '__theme_txtd' ) . '</span>',
			),
			'links_color' => sm_get_color_switch_dark_config( 'Link', '*', 'off', '--theme-links-color' ),
            'links_decoration_color' => sm_get_color_select_dark_config( 'Link Decoration', '*', 'dark', '--theme-links-decoration-color' ),
            'links_hover_color' => sm_get_color_switch_dark_config( 'Active Link', '*', 'off', '--theme-links-hover-color' ),
            'links_hover_decoration_color' => sm_get_color_select_dark_config( 'Active Link Decoration', '*', 'accent', '--theme-links-hover-decoration-color' ),

			'colors_article_section_title' => array(
				'type' => 'html',
				'html' => '<span class="separator sub-section label">' . esc_html__( 'Article', '__theme_txtd' ) . '</span>',
			),
			'article_title' => sm_get_color_switch_dark_config( 'Article Title', '.entry-title', 'off' ),
			'meta_links_color' => sm_get_color_switch_dark_config( 'Link', '.entry-meta', 'off', '--theme-links-color' ),
            'meta_links_decoration_color' => sm_get_color_select_dark_config( 'Link Decoration', '.entry-meta', 'background', '--theme-links-decoration-color' ),
            'meta_links_hover_color' => sm_get_color_switch_dark_config( 'Active Link', '.entry-meta', 'off', '--theme-links-hover-color' ),
            'meta_links_hover_decoration_color' => sm_get_color_select_dark_config( 'Active Link Decoration', '.entry-meta', 'accent', '--theme-links-hover-decoration-color' ),

			'colors_headings_section_title' => array(
				'type' => 'html',
				'html' => '<span class="separator sub-section label">' . esc_html__( 'Headings', '__theme_txtd' ) . '</span>',
			),
			'heading_1_color' => sm_get_color_switch_darker_config( 'Heading 1', 'h1', 'off' ),
			'heading_2_color' => sm_get_color_switch_darker_config( 'Heading 2', 'h2', 'off' ),
			'heading_3_color' => sm_get_color_switch_darker_config( 'Heading 3', 'h3', 'off' ),
			'heading_4_color' => sm_get_color_switch_darker_config( 'Heading 4', 'h4', 'off' ),
			'heading_5_color' => sm_get_color_switch_darker_config( 'Heading 5', 'h5', 'off' ),
			'heading_6_color' => sm_get_color_switch_darker_config( 'Heading 6', 'h6', 'off' ),

			'colors_buttons_section_title' => array(
				'type' => 'html',
				'html' => '<span class="separator sub-section label">' . esc_html__( 'Buttons', '__theme_txtd' ) . '</span>',
			),
			'text_button' => sm_get_color_switch_dark_config( 'Text Button Color', '.wp-block-button.is-style-text .wp-block-button__link', 'off', array( '--theme-button-text-color' ) ),
			'solid_button' => sm_get_color_switch_dark_config( 'Solid Button Color', '*', 'off', '--sm-button-background-color' ),

			'colors_header_section_title' => array(
				'type' => 'html',
				'html' => '<span class="separator sub-section label">' . esc_html__( 'Header', '__theme_txtd' ) . '</span>',
			),
			'menu_item_color' => sm_get_color_switch_dark_config( 'Menu Item', '.novablocks-navigation', 'off' ),
			'menu_active_item_color' => sm_get_color_switch_dark_config( 'Menu Active Item', '.novablocks-navigation > ul > li[class*="current"]', 'off' ),
			'submenu_item_color' => sm_get_color_switch_dark_config( 'Submenu Item', '.novablocks-navigation .sub-menu', 'off' ),
			'submenu_active_item_color' => sm_get_color_switch_dark_config( 'Submenu Active Item', '.novablocks-navigation .sub-menu > li[class*="current"]', 'off' ),

			'colors_post_navigation_section_title' => array(
				'type' => 'html',
				'html' => '<span class="separator sub-section label">' . esc_html__( 'Post Navigation', '__theme_txtd' ) . '</span>',
			),
			'post_navigation_label' => sm_get_color_switch_dark_config( 'Post Navigation Label', '.post-navigation__link-label', 'off' ),
			'post_navigation_title' => sm_get_color_switch_dark_config( 'Post Navigation Title', '.post-navigation__post-title', 'off' ),

			'colors_novablocks_headline_section_title' => array(
				'type' => 'html',
				'html' => '<span class="separator sub-section label">' . esc_html__( 'Nova Blocks - Headline', '__theme_txtd' ) . '</span>',
			),
			'novablocks_headline_primary' => sm_get_color_switch_darker_config( 'Headline Primary', '.c-headline__primary', 'off' ),
			'novablocks_headline_secondary' => sm_get_color_switch_darker_config( 'Headline Secondary', '.c-headline__secondary', 'on' ),

			'colors_novablocks_food_menu_section_title' => array(
				'type' => 'html',
				'html' => '<span class="separator sub-section label">' . esc_html__( 'Nova Blocks - Food Menu', '__theme_txtd' ) . '</span>',
			),
			'novablocks_menu_section_title' => sm_get_color_switch_dark_config( 'Menu Section Title', '.nova-food-menu__header .section-title', 'off' ),
			'novablocks_menu_item_highlight' => sm_get_color_switch_dark_config( 'Menu Item Highlight', 'html:root', 'off', '--nova-food-menu-item-highlight-color' ),
			'novablocks_menu_item_price' => sm_get_color_switch_dark_config( 'Menu Item Price', '.nova-food-menu-item__prices', 'off' ),
			'novablocks_menu_item_title' => sm_get_color_switch_dark_config( 'Menu Item Title', '.nova-food-menu-item__title', 'off' ),
			'novablocks_menu_item_description' => sm_get_color_switch_dark_config( 'Menu Item Description', '.nova-food-menu-item__description', 'off' ),

			'colors_novablocks_conversations_section_title' => array(
				'type' => 'html',
				'html' => '<span class="separator sub-section label">' . esc_html__( 'Nova Blocks - Conversations', '__theme_txtd' ) . '</span>',
			),
			'novablocks_conversations_title' => sm_get_color_switch_dark_config( 'Conversations Title', '.novablocks-conversations__header', 'off' ),
		),
	) );

	return $config;
}

function pixelgrade_add_default_color_palettes( $color_palettes ) {

	$color_palettes = array_merge( array(
		'default' => array(
			'label'   => esc_html__( 'Theme Default', '__theme_txtd' ),
			'preview' => array(
				'background_image_url' => '//cloud.pixelgrade.com/wp-content/uploads/2018/07/rosa-palette.jpg',
			),
			'options' => array(
				'sm_color_primary'   => THEME_COLOR_PRIMARY,
				'sm_color_secondary' => THEME_COLOR_SECONDARY,
				'sm_color_tertiary'  => THEME_COLOR_TERTIARY,
				'sm_dark_primary'    => THEME_DARK_PRIMARY,
				'sm_dark_secondary'  => THEME_DARK_SECONDARY,
				'sm_dark_tertiary'   => THEME_DARK_TERTIARY,
				'sm_light_primary'   => THEME_LIGHT_PRIMARY,
				'sm_light_secondary' => THEME_LIGHT_SECONDARY,
				'sm_light_tertiary'  => THEME_LIGHT_TERTIARY,
			),
		),
	), $color_palettes );

	return $color_palettes;
}
