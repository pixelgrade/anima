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

	if ( ! isset( $config['sections']['style_manager_section'] ) ) {
		$config['sections']['style_manager_section'] = array();
	}

	// The section might be already defined, thus we merge, not replace the entire section config.
	$config['sections']['style_manager_section'] = Customify_Array::array_merge_recursive_distinct( $config['sections']['style_manager_section'], array(
		'options' => array(
			'sm_text_color_switch_master' => array(
				'connected_fields' => array(
					'body',

					'links_color',
					'links_hover_color',

					'meta_links_color',
					'meta_links_hover_color',

					'article_title',

					'heading_1_color',
					'heading_2_color',
					'heading_3_color',
					'heading_4_color',
					'heading_5_color',
					'heading_6_color',

					'text_button',
					'solid_button',

					'menu_item_color',
					'menu_active_item_color',
					'submenu_item_color',
					'submenu_active_item_color',

					'post_navigation_label',
					'post_navigation_title',

					'novablocks_headline_primary',

					'novablocks_menu_section_title',
					'novablocks_menu_item_highlight',
					'novablocks_menu_item_price',
					'novablocks_menu_item_title',
					'novablocks_menu_item_description',

					'novablocks_conversations_title',
				),
			),
			'sm_text_color_select_master' => array(
				'connected_fields' => array(
					'links_decoration_color',
				),
			),
			'sm_accent_color_switch_master' => array(
				'connected_fields' => array(
					'novablocks_headline_secondary',
				),
			),
			'sm_accent_color_select_master' => array(
				'connected_fields' => array(
					'links_hover_decoration_color',
					'meta_links_hover_decoration_color',
				),
			),
			'sm_color_primary'   => array( 'default' => THEME_COLOR_PRIMARY, ),
			'sm_color_secondary' => array( 'default' => THEME_COLOR_SECONDARY, ),
			'sm_color_tertiary'  => array( 'default' => THEME_COLOR_TERTIARY, ),
			'sm_dark_primary'    => array( 'default' => THEME_DARK_PRIMARY, ),
			'sm_dark_secondary'  => array( 'default' => THEME_DARK_SECONDARY, ),
			'sm_dark_tertiary'   => array( 'default' => THEME_DARK_TERTIARY, ),
			'sm_light_primary'   => array( 'default' => THEME_LIGHT_PRIMARY, ),
			'sm_light_secondary' => array( 'default' => THEME_LIGHT_SECONDARY, ),
			'sm_light_tertiary'  => array( 'default' => THEME_LIGHT_TERTIARY, ),
		),
	) );

	if ( ! isset( $config['sections']['colors_section'] ) ) {
		$config['sections']['colors_section'] = array();
	}

	$config['sections']['colors_section'] = Customify_Array::array_merge_recursive_distinct( $config['sections']['colors_section'], array(
		'title'   => esc_html__( 'Colors', '__theme_txtd' ),
		'options' => array(

			'body_color' => rosa2_get_color_switch_config( 'Body', 'body', 'off' ),

			'colors_links_section_title' => array(
				'type' => 'html',
				'html' => '<span class="separator sub-section label">' . esc_html__( 'Links', '__theme_txtd' ) . '</span>',
			),
			'links_color' => rosa2_get_color_switch_config( 'Link', ':root', 'off', '--theme-links-color' ),
            'links_decoration_color' => rosa2_get_color_select_config( 'Link Decoration', ':root', 'text', '--theme-links-decoration-color' ),
            'links_hover_color' => rosa2_get_color_switch_config( 'Active Link', ':root', 'off', '--theme-links-hover-color' ),
            'links_hover_decoration_color' => rosa2_get_color_select_config( 'Active Link Decoration', ':root', 'accent', '--theme-links-hover-decoration-color' ),

			'colors_article_section_title' => array(
				'type' => 'html',
				'html' => '<span class="separator sub-section label">' . esc_html__( 'Article', '__theme_txtd' ) . '</span>',
			),
			'article_title' => rosa2_get_color_switch_config( 'Article Title', '.entry-title', 'off' ),
			'meta_links_color' => rosa2_get_color_switch_config( 'Link', '.entry-meta', 'off', '--theme-links-color' ),
            'meta_links_decoration_color' => rosa2_get_color_select_config( 'Link Decoration', '.entry-meta', 'background', '--theme-links-decoration-color' ),
            'meta_links_hover_color' => rosa2_get_color_switch_config( 'Active Link', '.entry-meta', 'off', '--theme-links-hover-color' ),
            'meta_links_hover_decoration_color' => rosa2_get_color_select_config( 'Active Link Decoration', '.entry-meta', 'accent', '--theme-links-hover-decoration-color' ),

			'colors_headings_section_title' => array(
				'type' => 'html',
				'html' => '<span class="separator sub-section label">' . esc_html__( 'Headings', '__theme_txtd' ) . '</span>',
			),
			'heading_1_color' => rosa2_get_color_switch_config( 'Heading 1', 'h1', 'off' ),
			'heading_2_color' => rosa2_get_color_switch_config( 'Heading 2', 'h2', 'off' ),
			'heading_3_color' => rosa2_get_color_switch_config( 'Heading 3', 'h3', 'off' ),
			'heading_4_color' => rosa2_get_color_switch_config( 'Heading 4', 'h4', 'off' ),
			'heading_5_color' => rosa2_get_color_switch_config( 'Heading 5', 'h5', 'off' ),
			'heading_6_color' => rosa2_get_color_switch_config( 'Heading 6', 'h6', 'off' ),

			'colors_buttons_section_title' => array(
				'type' => 'html',
				'html' => '<span class="separator sub-section label">' . esc_html__( 'Buttons', '__theme_txtd' ) . '</span>',
			),
			'text_button' => rosa2_get_color_switch_config( 'Text Button Color', '.wp-block-button.is-style-text .wp-block-button__link', 'off' ),
			'solid_button' => rosa2_get_color_switch_config( 'Solid Button Color', ':root', 'off', '--sm-button-background-color' ),

			'colors_header_section_title' => array(
				'type' => 'html',
				'html' => '<span class="separator sub-section label">' . esc_html__( 'Header', '__theme_txtd' ) . '</span>',
			),
			'menu_item_color' => rosa2_get_color_switch_config( 'Menu Item', '.site-header__menu', 'off' ),
			'menu_active_item_color' => rosa2_get_color_switch_config( 'Menu Active Item', '.site-header__menu > ul > li[class*="current"]', 'off' ),
			'submenu_item_color' => rosa2_get_color_switch_config( 'Submenu Item', '.site-header__menu .sub-menu', 'off' ),
			'submenu_active_item_color' => rosa2_get_color_switch_config( 'Submenu Active Item', '.site-header__menu .sub-menu > li[class*="current"]', 'off' ),

			'colors_post_navigation_section_title' => array(
				'type' => 'html',
				'html' => '<span class="separator sub-section label">' . esc_html__( 'Post Navigation', '__theme_txtd' ) . '</span>',
			),
			'post_navigation_label' => rosa2_get_color_switch_config( 'Post Navigation Label', '.post-navigation__link-label', 'off' ),
			'post_navigation_title' => rosa2_get_color_switch_config( 'Post Navigation Title', '.post-navigation__post-title', 'off' ),

			'colors_novablocks_headline_section_title' => array(
				'type' => 'html',
				'html' => '<span class="separator sub-section label">' . esc_html__( 'Nova Blocks - Headline', '__theme_txtd' ) . '</span>',
			),
			'novablocks_headline_primary' => rosa2_get_color_switch_config( 'Headline Primary', '.c-headline__primary', 'off' ),
			'novablocks_headline_secondary' => rosa2_get_color_switch_config( 'Headline Secondary', '.c-headline__secondary', 'on' ),

			'colors_novablocks_food_menu_section_title' => array(
				'type' => 'html',
				'html' => '<span class="separator sub-section label">' . esc_html__( 'Nova Blocks - Food Menu', '__theme_txtd' ) . '</span>',
			),
			'novablocks_menu_section_title' => rosa2_get_color_switch_config( 'Menu Section Title', '.nova-food-menu__header .section-title', 'off' ),
			'novablocks_menu_item_highlight' => rosa2_get_color_switch_config( 'Menu Item Highlight', 'html:root', 'off', '--nova-food-menu-item-highlight-color' ),
			'novablocks_menu_item_price' => rosa2_get_color_switch_config( 'Menu Item Price', '.nova-food-menu-item__prices', 'off' ),
			'novablocks_menu_item_title' => rosa2_get_color_switch_config( 'Menu Item Title', '.nova-food-menu-item__title', 'off' ),
			'novablocks_menu_item_description' => rosa2_get_color_switch_config( 'Menu Item Description', '.nova-food-menu-item__description', 'off' ),

			'colors_novablocks_conversations_section_title' => array(
				'type' => 'html',
				'html' => '<span class="separator sub-section label">' . esc_html__( 'Nova Blocks - Conversations', '__theme_txtd' ) . '</span>',
			),
			'novablocks_conversations_title' => rosa2_get_color_switch_config( 'Conversations Title', '.novablocks-conversations__header', 'off' ),
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

function rosa2_get_color_select_config( $label, $selector, $default, $properties = [ 'color' ] ) {

	$css = array();

	if ( ! is_array( $properties ) ) {
		$properties = [ $properties ];
	}

	foreach ( $properties as $property ) {
		$css[] = array(
			'property' => $property,
			'selector' => $selector,
			'callback_filter' => 'rosa2_color_select_cb',
		);
	}

	return array(
		'type'    => 'select_color',
		'label'   => esc_html__( $label, '__theme_txtd' ),
		'live'    => true,
		'default' => $default,
		'css'     => $css,
		'choices' => array(
			'background' => esc_html__( 'Background', '__theme_txtd' ),
			'text'       => esc_html__( 'Text', '__theme_txtd' ),
			'accent'     => esc_html__( 'Accent', '__theme_txtd' ),
		),
	);
}

function rosa2_color_select_cb( $value, $selector, $property ) {
	$output = '';

	$output .= $selector . ' {' . PHP_EOL .
	           $property . ': var(--novablocks-current-' . $value . '-color);' . PHP_EOL .
	           '}' . PHP_EOL;

	return $output;
}

function rosa2_color_select_cb_customizer_preview() {
	$js = "";

	$js .= "
function rosa2_color_select_cb(value, selector, property) {
    var css = '',
        string = selector + property,
        id = string.hashCode(),
        idAttr = 'rosa2_color_select' + id;
        style = document.getElementById( idAttr ),
        head = document.head || document.getElementsByTagName('head')[0];

    css += selector + ' {' +
        property + ': var(--novablocks-current-' + value + '-color);' +
        '}';
    

    if ( style !== null ) {
        style.innerHTML = css;
    } else {
        style = document.createElement('style');
        style.setAttribute( 'id', idAttr );

        style.type = 'text/css';
        if ( style.styleSheet ) {
            style.styleSheet.cssText = css;
        } else {
            style.appendChild(document.createTextNode(css));
        }

        head.appendChild(style);
    }" . PHP_EOL .
	       "}" . PHP_EOL;

	wp_add_inline_script( 'customify-previewer-scripts', $js );
}
add_action( 'customize_preview_init', 'rosa2_color_select_cb_customizer_preview', 20 );

function rosa2_get_color_switch_config( $label, $selector, $default, $properties = [ 'color' ] ) {

	$css = array();

	if ( ! is_array( $properties ) ) {
		$properties = [ $properties ];
	}

	foreach ( $properties as $property ) {
		$css[] = array(
			'property' => $property,
			'selector' => $selector,
			'callback_filter' => 'rosa2_color_swtich_cb',
		);
	}

	return array(
		'type'    => 'sm_switch',
		'label'   => esc_html__( $label, '__theme_txtd' ),
		'live'    => true,
		'default' => $default,
		'css'     => $css,
		'choices'      => array(
			'off' => esc_html__( 'Off', 'customify' ),
			'on'  => esc_html__( 'On', 'customify' ),
		),
	);
}

function rosa2_color_swtich_cb( $value, $selector, $property ) {
	$output = '';
	$color = 'text';

	if ( $value === 'on' ) {
		$color = 'accent';
	}

	$output .= $selector . ' {' . PHP_EOL .
	           $property . ': var(--novablocks-current-' . $color . '-color);' . PHP_EOL .
	           '}' . PHP_EOL;

	return $output;
}

function rosa2_color_swtich_cb_customizer_preview() {
	$js = "";

	$js .= "
function rosa2_color_swtich_cb(value, selector, property) {
    var css = '',
        string = selector + property,
        id = string.hashCode(),
        idAttr = 'rosa2_color_source' + id;
        style = document.getElementById( idAttr ),
        color = 'text',
        head = document.head || document.getElementsByTagName('head')[0];
        
        if ( value === 'on' ) {
            color = 'accent';
        }
        
    css += selector + ' {' +
        property + ': var(--novablocks-current-' + color + '-color);' +
        '}';
    

    if ( style !== null ) {
        style.innerHTML = css;
    } else {
        style = document.createElement('style');
        style.setAttribute( 'id', idAttr );

        style.type = 'text/css';
        if ( style.styleSheet ) {
            style.styleSheet.cssText = css;
        } else {
            style.appendChild(document.createTextNode(css));
        }

        head.appendChild(style);
    }" . PHP_EOL .
	       "}" . PHP_EOL;

	wp_add_inline_script( 'customify-previewer-scripts', $js );
}
add_action( 'customize_preview_init', 'rosa2_color_swtich_cb_customizer_preview', 20 );
