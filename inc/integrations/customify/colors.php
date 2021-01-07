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
			'sm_color_primary'   => array(
				'default'          => THEME_COLOR_PRIMARY,
				'connected_fields' => array(
					'color_1'
				),
			),
			'sm_color_secondary' => array(
				'default'          => THEME_COLOR_SECONDARY,
				'connected_fields' => array(
					'color_2'
				),
			),
			'sm_color_tertiary'  => array(
				'default'          => THEME_COLOR_TERTIARY,
				'connected_fields' => array(
					'color_3'
				),
			),
			'sm_dark_primary'    => array(
				'default'          => THEME_DARK_PRIMARY,
				'connected_fields' => array(
					'color_dark_1'
				),
			),
			'sm_dark_secondary'  => array(
				'default'          => THEME_DARK_SECONDARY,
				'connected_fields' => array(
					'color_dark_2'
				),
			),
			'sm_dark_tertiary'   => array(
				'default'          => THEME_DARK_TERTIARY,
				'connected_fields' => array(
					'color_dark_3'
				),
			),
			'sm_light_primary'   => array(
				'default'          => THEME_LIGHT_PRIMARY,
				'connected_fields' => array(
					'color_light_1'
				),
			),
			'sm_light_secondary' => array(
				'default'          => THEME_LIGHT_SECONDARY,
				'connected_fields' => array(
					'color_light_2'
				),
			),
			'sm_light_tertiary'  => array(
				'default'          => THEME_LIGHT_TERTIARY,
				'connected_fields' => array(
					'color_light_3'
				),
			),

		),
	) );

	if ( ! isset( $config['sections']['colors_section'] ) ) {
		$config['sections']['colors_section'] = array();
	}

	$config['sections']['colors_section'] = Customify_Array::array_merge_recursive_distinct( $config['sections']['colors_section'], array(
		'title'   => esc_html__( 'Colors', '__theme_txtd' ),
		'options' => array(
			'heading_1_color' => rosa2_get_color_source_config( 'Heading 1 Color', 'h1', 'titles' ),
			'heading_2_color' => rosa2_get_color_source_config( 'Heading 2 Color', 'h2', 'titles' ),
			'heading_3_color' => rosa2_get_color_source_config( 'Heading 3 Color', 'h3', 'titles' ),
			'heading_4_color' => rosa2_get_color_source_config( 'Heading 4 Color', 'h4', 'titles' ),
			'heading_5_color' => rosa2_get_color_source_config( 'Heading 5 Color', 'h5', 'titles' ),
			'heading_6_color' => rosa2_get_color_source_config( 'Heading 6 Color', 'h6', 'titles' ),

			'novablocks_headline_primary' => rosa2_get_color_source_config( 'Headline Primary', '.c-headline__primary', 'titles' ),
			'novablocks_headline_secondary' => rosa2_get_color_source_config( 'Headline Secondary', '.c-headline__secondary', 'accent' ),

			'text_button' => rosa2_get_color_source_config( 'Text Button Color', '.wp-block-button.is-style-text .wp-block-button__link', 'accent' ),
			'solid_button' => rosa2_get_color_source_config( 'Solid Button Color', ':root', 'titles', '--sm-button-background-color' ),

			'blog_items_aspect_ratio'             => array(
				'type'            => 'range',
				'label'           => esc_html__( 'Items Aspect Ratio', '__components_txtd' ),
				'desc'            => esc_html__( 'Change the images ratio from landscape to portrait.', '__components_txtd' ),
				'live'            => true,
				'default'         => null, // this should be set by the theme (previously 130)
				'input_attrs'     => array(
					'min'          => 0,
					'max'          => 200,
					'step'         => 10,
					'data-preview' => true,
				),
				'css'             => array(
					array(
						'property'        => 'dummy',
						'selector'        => '.c-gallery--blog.c-gallery--regular .c-card__frame',
						'callback_filter' => 'pixelgrade_aspect_ratio_cb',
						'unit'            => '%',
					),
				),
			),

			'color_1'       => array(
				'type'    => 'color',
				'live'    => true,
				'label'   => esc_html__( 'Theme Primary Color', '__theme_txtd' ),
				'default' => THEME_COLOR_PRIMARY,
				'css'     => array(
					array(
						'selector' => ':root',
						'property' => '--theme-color-primary',
					),
				),
			),
			'color_2'       => array(
				'type'    => 'color',
				'live'    => true,
				'label'   => esc_html__( 'Theme Secondary Color', '__theme_txtd' ),
				'default' => THEME_COLOR_SECONDARY,
				'css'     => array(
					array(
						'selector' => ':root',
						'property' => '--theme-color-secondary',
					),
				),
			),
			'color_3'       => array(
				'type'    => 'color',
				'live'    => true,
				'label'   => esc_html__( 'Theme Tertiary Color', '__theme_txtd' ),
				'default' => THEME_COLOR_TERTIARY,
				'css'     => array(
					array(
						'selector' => ':root',
						'property' => '--theme-color-tertiary',
					),
				),
			),
			'color_dark_1'  => array(
				'type'    => 'color',
				'live'    => true,
				'label'   => esc_html__( 'Theme Primary Dark Color', '__theme_txtd' ),
				'default' => THEME_DARK_PRIMARY,
				'css'     => array(
					array(
						'selector' => ':root',
						'property' => '--theme-dark-primary',
					),
				),
			),
			'color_dark_2'  => array(
				'type'    => 'color',
				'live'    => true,
				'label'   => esc_html__( 'Theme Secondary Dark Color', '__theme_txtd' ),
				'default' => THEME_DARK_SECONDARY,
				'css'     => array(
					array(
						'selector' => ':root',
						'property' => '--theme-dark-secondary',
					),
				),
			),
			'color_dark_3'  => array(
				'type'    => 'color',
				'live'    => true,
				'label'   => esc_html__( 'Theme Tertiary Dark Color', '__theme_txtd' ),
				'default' => THEME_DARK_TERTIARY,
				'css'     => array(
					array(
						'selector' => ':root',
						'property' => '--theme-dark-tertiary',
					),
				),
			),
			'color_light_1' => array(
				'type'    => 'color',
				'live'    => true,
				'label'   => esc_html__( 'Theme Primary Light Color', '__theme_txtd' ),
				'default' => THEME_LIGHT_PRIMARY,
				'css'     => array(
					array(
						'selector' => ':root',
						'property' => '--theme-light-primary',
					),
				),
			),
			'color_light_2' => array(
				'type'    => 'color',
				'live'    => true,
				'label'   => esc_html__( 'Theme Secondary Light Color', '__theme_txtd' ),
				'default' => THEME_LIGHT_SECONDARY,
				'css'     => array(
					array(
						'selector' => ':root',
						'property' => '--theme-light-secondary',
					),
				),
			),
			'color_light_3' => array(
				'type'    => 'color',
				'live'    => true,
				'label'   => esc_html__( 'Theme Tertiary Light Color', '__theme_txtd' ),
				'default' => THEME_LIGHT_TERTIARY,
				'css'     => array(
					array(
						'selector' => ':root',
						'property' => '--theme-light-tertiary',
					),
				),
			),
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

function rosa2_get_color_source_config( $label, $selector, $default, $properties = [ 'color' ] ) {

	$css = array();

	if ( ! is_array( $properties ) ) {
		$properties = [ $properties ];
	}

	foreach ( $properties as $property ) {
		$css[] = array(
			'property' => $property,
			'selector' => $selector,
			'callback_filter' => 'rosa2_color_source_cb',
		);
	}
	return array(
		'type'    => 'select',
		'label'   => esc_html__( $label, '__theme_txtd' ),
		'live'    => true,
		'default' => $default,
		'css'     => $css,
		'choices' => array(
			'text'       => esc_html__( 'Text', '__theme_txtd' ),
			'titles'     => esc_html__( 'Title', '__theme_txtd' ),
			'accent'     => esc_html__( 'Accent', '__theme_txtd' ),
			'background' => esc_html__( 'Background', '__theme_txtd' ),
		),
	);
}

function rosa2_color_source_cb( $value, $selector, $property ) {
	$output = '';

	$output .= $selector . ' {' . PHP_EOL .
	           $property . ': var(--novablocks-current-' . $value . '-color);' . PHP_EOL .
	           '}' . PHP_EOL;

	return $output;
}

function rosa2_color_source_cb_customizer_preview() {
	$js = "";

	$js .= "
function rosa2_color_source_cb(value, selector, property) {
	console.log( 'apeleaza-ma' );
    var css = '',
        string = selector + property,
        id = string.hashCode(),
        idAttr = 'rosa2_color_source' + id;
        style = document.getElementById( idAttr ),
        head = document.head || document.getElementsByTagName('head')[0];

    css += selector + ' {' +
        property + ': var(--novablocks-current-' + value + '-color);' +
        '}';
    
    console.log( idAttr, style, css );

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
add_action( 'customize_preview_init', 'rosa2_color_source_cb_customizer_preview', 20 );

//


if ( ! function_exists( 'pixelgrade_aspect_ratio_cb' ) ) :
	/**
	 * Returns the custom CSS rules for the aspect ratio depending on the Customizer settings.
	 *
	 * @param mixed  $value The value of the option.
	 * @param string $selector The CSS selector for this option.
	 * @param string $property The CSS property of the option.
	 * @param string $unit The CSS unit used by this option.
	 *
	 * @return string
	 */
	function pixelgrade_aspect_ratio_cb( $value, $selector, $property, $unit ) {
		$min = 0;
		$max = 200;

		$value  = intval( $value );
		$center = ( $max - $min ) / 2;
		$offset = $value / $center - 1;

		if ( $offset >= 0 ) {
			$padding = 100 + $offset * 100 . '%';
		} else {
			$padding = 100 + $offset * 50 . '%';
		}

		$output = '';

		$output .= $selector . ' {' . PHP_EOL .
		           'padding-top: ' . $padding . ';' . PHP_EOL .
		           '}' . PHP_EOL;

		return $output;
	}
endif;

if ( ! function_exists( 'pixelgrade_aspect_ratio_cb_customizer_preview' ) ) :
	/**
	 * Outputs the inline JS code used in the Customizer for the aspect ratio live preview.
	 */
	function pixelgrade_aspect_ratio_cb_customizer_preview() {

		$js = "
function pixelgrade_aspect_ratio_cb( value, selector, property, unit ) {

    var css = '',
        style = document.getElementById('pixelgrade_aspect_ratio_cb_style_tag'),
        head = document.head || document.getElementsByTagName('head')[0];

    var min = 0,
        max = 200,
        center = (max - min) / 2,
        offset = value / center - 1,
        padding;

    if ( offset >= 0 ) {
        padding = 100 + offset * 100 + '%';
    } else {
        padding = 100 + offset * 50 + '%';
    }

    css += selector + ' {' +
        'padding-top: ' + padding +
        '}';

    if ( style !== null ) {
        style.innerHTML = css;
    } else {
        style = document.createElement('style');
        style.setAttribute('id', 'pixelgrade_aspect_ratio_cb_style_tag');

        style.type = 'text/css';
        if ( style.styleSheet ) {
            style.styleSheet.cssText = css;
        } else {
            style.appendChild(document.createTextNode(css));
        }

        head.appendChild(style);
    }
}" . PHP_EOL;

		wp_add_inline_script( 'customify-previewer-scripts', $js );
	}
endif;
add_action( 'customize_preview_init', 'pixelgrade_aspect_ratio_cb_customizer_preview', 20 );

