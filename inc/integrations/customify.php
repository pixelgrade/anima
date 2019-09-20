<?php
/**
 * Handle the Customify integration logic.
 */

// If this file is called directly, abort.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

add_filter( 'customify_filter_fields', 'rosa2_add_customify_options', 11, 1 );

add_filter( 'customify_filter_fields', 'rosa2_add_customify_section', 20, 1 );
add_filter( 'customify_filter_fields', 'rosa2_add_customify_style_manager_section', 12, 1 );


define( 'ROSA2_THEME_COLOR_PRIMARY', '#DDAB5D' ); // gold
define( 'ROSA2_THEME_COLOR_SECONDARY', '#39497C' ); // blue
define( 'ROSA2_THEME_COLOR_TERTIARY', '#B12C4A' ); // red

define( 'ROSA2_THEME_DARK_PRIMARY', '#212B49' ); // dark blue
define( 'ROSA2_THEME_DARK_SECONDARY', '#34394B' ); // dark light blue
define( 'ROSA2_THEME_DARK_TERTIARY', '#141928' ); // darker blue

define( 'ROSA2_THEME_LIGHT_PRIMARY', '#FFFFFF' ); // white
define( 'ROSA2_THEME_LIGHT_SECONDARY', '#CCCCCC' ); // gray
define( 'ROSA2_THEME_LIGHT_TERTIARY', '#EEEFF2' ); // light gray


function rosa2_add_customify_options( $config ) {
	$config['opt-name'] = 'rosa2_options';

	//start with a clean slate - no Customify default sections
	$config['sections'] = array();

	return $config;
}

function rosa2_add_customify_section( $config ) {

	$separator_symbol_choices = array();
	$separator_symbol_values = array(
		'fleuron-1',
		'fleuron-2',
		'fleuron-3',
		'fleuron-4',
		'fleuron-5',
	);

	foreach ( $separator_symbol_values as $symbol ) {
		ob_start();
		get_template_part( 'template-parts/separators/' . $symbol . '-svg' );
		$separator_symbol_choices[$symbol] = ob_get_clean();
	}

	$rosa2_section = array(
		'content_section' => array(
			'title'   => esc_html__( 'Content', '__theme_txtd' ),
			'options' => array(
				'display_categories_on_archive' => array(
					'type' => 'checkbox',
					'label' => esc_html__( 'Display Categories on Archives', '__theme_txtd' ),
					'default' => true,
				),
				'display_tags_on_archive' => array(
					'type' => 'checkbox',
					'label' => esc_html__( 'Display Tags on Archives', '__theme_txtd' ),
					'default' => false,
				),
				'display_date_on_archive' => array(
					'type' => 'checkbox',
					'label' => esc_html__( 'Display Date on Archives', '__theme_txtd' ),
					'default' => true,
				),
				'display_author_on_archive' => array(
					'type' => 'checkbox',
					'label' => esc_html__( 'Display Author on Archives', '__theme_txtd' ),
					'default' => false,
				),
				'separator_symbol' => array(
					'type'    => 'radio_html',
					'label'   => esc_html__( 'Separator Symbol', '__theme_txtd' ),
					'default' => 'fleuron-1',
					'choices' => $separator_symbol_choices,
				),
			),
		),
		'colors_section' => array(
			'title'   => esc_html__( 'Colors', '__theme_txtd' ),
			'options' => array(
				'rosa2_color_1'       => array(
					'type'    => 'color',
					'live'    => true,
					'label'   => esc_html__( 'Rosa Primary Color', '__theme_txtd' ),
					'default' => ROSA2_THEME_COLOR_PRIMARY,
					'css'     => array(
						array(
							'selector' => ':root',
							'property' => '--sm-color-1',
						),
					),
				),
				'rosa2_color_2'       => array(
					'type'    => 'color',
					'live'    => true,
					'label'   => esc_html__( 'Rosa Secondary Color', '__theme_txtd' ),
					'default' => ROSA2_THEME_COLOR_SECONDARY,
					'css'     => array(
						array(
							'selector' => ':root',
							'property' => '--sm-color-2',
						),
					),
				),
				'rosa2_color_3'       => array(
					'type'    => 'color',
					'live'    => true,
					'label'   => esc_html__( 'Rosa Tertiary Color', '__theme_txtd' ),
					'default' => ROSA2_THEME_COLOR_TERTIARY,
					'css'     => array(
						array(
							'selector' => ':root',
							'property' => '--sm-color-3',
						),
					),
				),
				'rosa2_color_dark_1'  => array(
					'type'    => 'color',
					'live'    => true,
					'label'   => esc_html__( 'Rosa Primary Dark Color', '__theme_txtd' ),
					'default' => ROSA2_THEME_DARK_PRIMARY,
					'css'     => array(
						array(
							'selector' => ':root',
							'property' => '--sm-dark-1',
						),
					),
				),
				'rosa2_color_dark_2'  => array(
					'type'    => 'color',
					'live'    => true,
					'label'   => esc_html__( 'Rosa Secondary Dark Color', '__theme_txtd' ),
					'default' => ROSA2_THEME_DARK_SECONDARY,
					'css'     => array(
						array(
							'selector' => ':root',
							'property' => '--sm-dark-2',
						),
					),
				),
				'rosa2_color_dark_3'  => array(
					'type'    => 'color',
					'live'    => true,
					'label'   => esc_html__( 'Rosa Tertiary Dark Color', '__theme_txtd' ),
					'default' => ROSA2_THEME_DARK_TERTIARY,
					'css'     => array(
						array(
							'selector' => ':root',
							'property' => '--sm-dark-3',
						),
					),
				),
				'rosa2_color_light_1' => array(
					'type'    => 'color',
					'live'    => true,
					'label'   => esc_html__( 'Rosa Primary Light Color', '__theme_txtd' ),
					'default' => ROSA2_THEME_LIGHT_PRIMARY,
					'css'     => array(
						array(
							'selector' => ':root',
							'property' => '--sm-light-1',
						),
					),
				),
				'rosa2_color_light_2' => array(
					'type'    => 'color',
					'live'    => true,
					'label'   => esc_html__( 'Rosa Secondary Light Color', '__theme_txtd' ),
					'default' => ROSA2_THEME_LIGHT_SECONDARY,
					'css'     => array(
						array(
							'selector' => ':root',
							'property' => '--sm-light-2',
						),
					),
				),
				'rosa2_color_light_3' => array(
					'type'    => 'color',
					'live'    => true,
					'label'   => esc_html__( 'Rosa Tertiary Light Color', '__theme_txtd' ),
					'default' => ROSA2_THEME_LIGHT_TERTIARY,
					'css'     => array(
						array(
							'selector' => ':root',
							'property' => '--sm-light-3',
						),
					),
				),
			),
		),
		'fonts_section' => array(
			'title'   => esc_html__( 'Fonts', '__theme_txtd' ),
			'options' => array(
				'body_font' => array(
					'type'              => 'font',
					'label'             => esc_html__( 'Body', '__theme_txtd' ),
					'desc'              => esc_html__( '', '__theme_txtd' ),
					'selector'          => ':root',
					'properties_prefix' => '--theme-body-',
					'default'           => array(
						'font-family'    => 'Reforma1969, sans-serif',
						'font-size'      => 16,
						'line-height'    => 1.7,
					),
					'fields'            => array(
						'text-align'      => false,
						'text-transform'  => false,
						'text-decoration' => false,
						'line-height'   => array( 'unit' => '' ),
					),
				),
				'content_font' => array(
					'type'              => 'font',
					'label'             => esc_html__( 'Content', '__theme_txtd' ),
					'desc'              => esc_html__( '', '__theme_txtd' ),
					'selector'          => ':root',
					'properties_prefix' => '--theme-content-',
					'default'           => array(
						'font-family'    => 'Reforma1969, sans-serif',
						'font-size'      => 18,
						'line-height'    => 1.7,
					),
					'fields'            => array(
						'text-align'      => false,
						'text-transform'  => false,
						'text-decoration' => false,
						'line-height'   => array( 'unit' => '' ),
					),
				),
				'huge_font' => array(
					'type'              => 'font',
					'label'             => esc_html__( 'Huge', '__theme_txtd' ),
					'desc'              => esc_html__( '', '__theme_txtd' ),
					'selector'          => ':root',
					'properties_prefix' => '--theme-huge-',
					'default'           => array(
						'font-family'    => 'Reforma1969, sans-serif',
						'font-size'      => 115,
						'line-height'    => 1.03,
						'font-weight'    => 700,
						'letter-spacing' => -0.03,
					),
					'fields'            => array(
						'text-align'      => false,
						'text-transform'  => false,
						'text-decoration' => false,
						'line-height'   => array( 'unit' => '' ),
					),
				),
				'display_font' => array(
					'type'              => 'font',
					'label'             => esc_html__( 'Display', '__theme_txtd' ),
					'desc'              => esc_html__( '', '__theme_txtd' ),
					'selector'          => ':root',
					'properties_prefix' => '--theme-display-',
					'default'           => array(
						'font-family'    => 'Reforma1969, sans-serif',
						'font-size'      => 100,
						'line-height'    => 1.03,
						'font-weight'    => 700,
						'letter-spacing' => -0.03,
					),
					'fields'            => array(
						'text-align'      => false,
						'text-transform'  => false,
						'text-decoration' => false,
						'line-height'   => array( 'unit' => '' ),
					),
				),
				'heading_1_font' => array(
					'type'              => 'font',
					'label'             => esc_html__( 'Heading 1', '__theme_txtd' ),
					'desc'              => esc_html__( '', '__theme_txtd' ),
					'selector'          => ':root',
					'properties_prefix' => '--theme-heading-1-',
					'default'           => array(
						'font-family'    => 'Reforma1969, sans-serif',
						'font-size'      => 66,
						'line-height'    => 1.1,
						'font-weight'    => 700,
						'letter-spacing' => -0.03,
					),
					'fields'            => array(
						'text-align'      => false,
						'text-transform'  => false,
						'text-decoration' => false,
						'line-height'   => array( 'unit' => '' ),
					),
				),
				'heading_2_font' => array(
					'type'              => 'font',
					'label'             => esc_html__( 'Heading 2', '__theme_txtd' ),
					'desc'              => esc_html__( '', '__theme_txtd' ),
					'selector'          => ':root',
					'properties_prefix' => '--theme-heading-2-',
					'default'           => array(
						'font-family'    => 'Reforma1969, sans-serif',
						'font-size'      => 40,
						'line-height'    => 1.2,
						'font-weight'    => 700,
						'letter-spacing' => -0.02,
					),
					'fields'            => array(
						'text-align'      => false,
						'text-transform'  => false,
						'text-decoration' => false,
						'line-height'   => array( 'unit' => '' ),
					),
				),
				'heading_3_font' => array(
					'type'              => 'font',
					'label'             => esc_html__( 'Heading 3', '__theme_txtd' ),
					'desc'              => esc_html__( '', '__theme_txtd' ),
					'selector'          => ':root',
					'properties_prefix' => '--theme-heading-3-',
					'default'           => array(
						'font-family'    => 'Reforma1969, sans-serif',
						'font-size'      => 32,
						'line-height'    => 1.2,
						'font-weight'    => 700,
						'letter-spacing' => -0.02,
					),
					'fields'            => array(
						'text-align'      => false,
						'text-transform'  => false,
						'text-decoration' => false,
						'line-height'   => array( 'unit' => '' ),
					),
				),
				'heading_4_font' => array(
					'type'              => 'font',
					'label'             => esc_html__( 'Heading 4', '__theme_txtd' ),
					'desc'              => esc_html__( '', '__theme_txtd' ),
					'selector'          => ':root',
					'properties_prefix' => '--theme-heading-4-',
					'default'           => array(
						'font-family'    => 'Reforma1969, sans-serif',
						'font-size'      => 24,
						'line-height'    => 1.2,
						'font-weight'    => 700,
						'letter-spacing' => -0.02,
					),
					'fields'            => array(
						'text-align'      => false,
						'text-transform'  => false,
						'text-decoration' => false,
						'line-height'   => array( 'unit' => '' ),
					),
				),
				'heading_5_font' => array(
					'type'              => 'font',
					'label'             => esc_html__( 'Heading 5', '__theme_txtd' ),
					'desc'              => esc_html__( '', '__theme_txtd' ),
					'selector'          => ':root',
					'properties_prefix' => '--theme-heading-5-',
					'default'           => array(
						'font-family'    => 'Reforma2018, sans-serif',
						'font-size'      => 17,
						'line-height'    => 1.5,
						'font-weight'    => 400,
					),
					'fields'            => array(
						'text-align'      => false,
						'text-transform'  => false,
						'text-decoration' => false,
						'line-height'   => array( 'unit' => '' ),
					),
				),
				'heading_6_font' => array(
					'type'              => 'font',
					'label'             => esc_html__( 'Heading 6', '__theme_txtd' ),
					'desc'              => esc_html__( '', '__theme_txtd' ),
					'selector'          => ':root',
					'properties_prefix' => '--theme-heading-5-',
					'default'           => array(
						'font-family'    => 'Reforma2018, sans-serif',
						'font-size'      => 17,
						'line-height'    => 1.5,
						'font-weight'    => 400,
					),
					'fields'            => array(
						'text-align'      => false,
						'text-transform'  => false,
						'text-decoration' => false,
						'line-height'   => array( 'unit' => '' ),
					),
				),
				'navigation_font' => array(
					'type'              => 'font',
					'label'             => esc_html__( 'Navigation', '__theme_txtd' ),
					'desc'              => esc_html__( '', '__theme_txtd' ),
					'selector'          => ':root',
					'properties_prefix' => '--theme-navigation-',
					'default'           => array(
						'font-family'    => 'Reforma2018, sans-serif',
						'font-size'      => 17,
						'line-height'    => 1.5,
						'font-weight'    => 400,
					),
					'fields'            => array(
						'text-align'      => false,
						'text-transform'  => false,
						'text-decoration' => false,
						'line-height'   => array( 'unit' => '' ),
					),
				),
				'accent_font' => array(
					'type'              => 'font',
					'label'             => esc_html__( 'Accent', '__theme_txtd' ),
					'desc'              => esc_html__( '', '__theme_txtd' ),
					'selector'          => ':root',
					'properties_prefix' => '--theme-headings-alt-',
					'default'           => array(
						'font-family'    => '"Billy Ohio", sans-serif',
					),
					'fields'            => array(
						'letter-spacing'  => array( -1, 2, 0.01, 'em' ),
						'text-align'      => false,
						'text-transform'  => false,
						'text-decoration' => false,
						'letter-spacing'  => false,
					),
				),
			),
		)
	);


	// make sure we are in good working order
	if ( empty( $config['sections'] ) ) {
		$config['sections'] = array();
	}

	// append the header section
	$config['sections'] = $config['sections'] + $rosa2_section;

	return $config;
}

function rosa2_add_customify_style_manager_section( $options ) {
	// If the theme hasn't declared support for style manager, bail.
	if ( ! current_theme_supports( 'customizer_style_manager' ) ) {
		return $options;
	}

	if ( ! isset( $options['sections']['style_manager_section'] ) ) {
		$options['sections']['style_manager_section'] = array();
	}

	// The section might be already defined, thus we merge, not replace the entire section config.
	$options['sections']['style_manager_section'] = array_replace_recursive( $options['sections']['style_manager_section'], array(
			'options' => array(
				// Font Palettes Assignment.
				'sm_font_palette'    => array(
					'default' => 'patch',
				),
				'sm_font_primary'    => array(
					'connected_fields' => array(
						'hude_font',
						'display_font',
						'heading_1_font',
						'heading_2_font',
						'heading_3_font',
						'heading_4_font',
					),
				),
				'sm_font_secondary'  => array(
					'connected_fields' => array(
						'heading_5_font',
						'heading_6_font',
					),
				),
				'sm_font_body'       => array(
					'connected_fields' => array(
						'body_font',
						'content_font',
					),
				),
				'sm_font_accent'       => array(
					'connected_fields' => array(
						'accent_font',
					),
				),
				'sm_color_primary'   => array(
					'default'          => ROSA2_THEME_COLOR_PRIMARY,
					'connected_fields' => array(
						'rosa2_color_1'
					),
				),
				'sm_color_secondary' => array(
					'default'          => ROSA2_THEME_COLOR_SECONDARY,
					'connected_fields' => array(
						'rosa2_color_2'
					),
				),
				'sm_color_tertiary'  => array(
					'default'          => ROSA2_THEME_COLOR_TERTIARY,
					'connected_fields' => array(
						'rosa2_color_3'
					),
				),
				'sm_dark_primary'    => array(
					'default'          => ROSA2_THEME_DARK_PRIMARY,
					'connected_fields' => array(
						'rosa2_color_dark_1'
					),
				),
				'sm_dark_secondary'  => array(
					'default'          => ROSA2_THEME_DARK_SECONDARY,
					'connected_fields' => array(
						'rosa2_color_dark_2'
					),
				),
				'sm_dark_tertiary'   => array(
					'default'          => ROSA2_THEME_DARK_TERTIARY,
					'connected_fields' => array(
						'rosa2_color_dark_3'
					),
				),
				'sm_light_primary'   => array(
					'default'          => ROSA2_THEME_LIGHT_PRIMARY,
					'connected_fields' => array(
						'rosa2_color_light_1'
					),
				),
				'sm_light_secondary' => array(
					'default'          => ROSA2_THEME_LIGHT_SECONDARY,
					'connected_fields' => array(
						'rosa2_color_light_2'
					),
				),
				'sm_light_tertiary'  => array(
					'default'          => ROSA2_THEME_LIGHT_TERTIARY,
					'connected_fields' => array(
						'rosa2_color_light_3'
					),
				),
			),
		)
	);

	return $options;
}

function rosa2_add_default_color_palette( $color_palettes ) {

	$color_palettes = array_merge( array(
		'default' => array(
			'label'   => 'Theme Default',
			'preview' => array(
				'background_image_url' => 'https://cloud.pixelgrade.com/wp-content/uploads/2019/08/nova-theme.jpg',
			),
			'options' => array(
				'sm_color_primary'   => ROSA2_THEME_COLOR_PRIMARY,
				'sm_color_secondary' => ROSA2_THEME_COLOR_SECONDARY,
				'sm_color_tertiary'  => ROSA2_THEME_COLOR_TERTIARY,
				'sm_dark_primary'    => ROSA2_THEME_DARK_PRIMARY,
				'sm_dark_secondary'  => ROSA2_THEME_DARK_SECONDARY,
				'sm_dark_tertiary'   => ROSA2_THEME_DARK_TERTIARY,
				'sm_light_primary'   => ROSA2_THEME_LIGHT_PRIMARY,
				'sm_light_secondary' => ROSA2_THEME_LIGHT_SECONDARY,
				'sm_light_tertiary'  => ROSA2_THEME_LIGHT_TERTIARY,
			),
		),
	), $color_palettes );

	return $color_palettes;
}
add_filter( 'customify_get_color_palettes', 'rosa2_add_default_color_palette' );

function rosa2_add_default_font_palette( $font_palettes ) {

	$font_palettes = array(
		'rosa2' => array(
			'label'   => esc_html__( 'Theme Defaults', '__theme_txtd' ),
			'preview' => array(
				// Font Palette Name
				'title'            => esc_html__( 'Rosa', '__theme_txtd' ),
				'description'      => esc_html__( 'A graceful nature, truly tasteful and polished.', '__theme_txtd' ),
				'background_image_url' => 'https://cloud.pixelgrade.com/wp-content/uploads/2018/09/font-palette-classic.png',
			),

			'fonts_logic' => array(
				// Primary is used for main headings [Display, H1, H2, H3]
				'sm_font_primary' => array(
					'type'        => 'theme_font',
					'font_family' => 'Reforma1969, sans-serif',
				),
				// Secondary font is used for smaller headings [H4, H5, H6], including meta details
				'sm_font_secondary' => array(
					'type'        => 'theme_font',
					'font_family' => 'Reforma2018, sans-serif',
					// Define how fonts will look based on their size
					'font_styles_intervals'      => array(
						array(
							'start'          => 0,
							'font_weight'    => 400,
							'letter_spacing' => 'normal',
							'text_transform' => 'none',
						),
					),
				),
				// Used for Body Font [eg. entry-content]
				'sm_font_body' => array(
					'type'        => 'theme_font',
					'font_family' => 'Reforma1969, sans-serif',
				),
				'sm_font_accent' => array(
					'type'        => 'theme_font',
					'font_family' => '"Billy Ohio", sans-serif',
				),
			),
		),
		'gema' => array(
			'label'   => esc_html__( 'Gema', 'customify' ),
			'preview' => array(
				// Font Palette Name
				'title'            => esc_html__( 'Gema', 'customify' ),
				'description'      => esc_html__( 'A graceful nature, truly tasteful and polished.', 'customify' ),
				'background_image_url' => 'https://cloud.pixelgrade.com/wp-content/uploads/2018/09/font-palette-thin.png',
			),

			'fonts_logic' => array(
				// Primary is used for main headings [Display, H1, H2, H3]
				'sm_font_primary' => array(
					// Define the font type ('google' or 'theme_font'). By default it's 'google'.
					'type' => 'google',
					// Font loaded when a palette is selected
					'font_family'      => 'Montserrat',
					// Load all these fonts weights.
					'font_weights'     => array( 100, 300, 700 ),
					// "Generate" the graph to be used for font-size and line-height.
					'font_size_to_line_height_points' => array(
						array( 17, 1.7 ),
						array( 48, 1.2 ),
					),

					// Define how fonts will look based on the font size.
					'font_styles_intervals'      => array(
						array(
							'start'          => 10,
							'font_weight'    => 300,
							'letter_spacing' => '0.03em',
							'text_transform' => 'uppercase',
						),
						array(
							'start'          => 12,
							'font_weight'    => 700,
							'letter_spacing' => '0em',
							'text_transform' => 'uppercase',
						),
						array(
							'start'          => 18,
							'font_weight'    => 100,
							'letter_spacing' => '0.03em',
							'text_transform' => 'uppercase',
						),
					),
				),

				// Secondary font is used for smaller headings [H4, H5, H6], including meta details
				'sm_font_secondary' => array(
					'font_family'      => 'Montserrat',
					'font_weights'     => array( 200, 400 ),
					'font_size_to_line_height_points' => array(
						array( 10, 1.6 ),
						array( 18, 1.5 )
					),
					'font_styles_intervals'      => array(
						array(
							'start'          => 0,
							'font_weight'    => 200,
							'letter_spacing' => '0.03em',
							'text_transform' => 'uppercase',
						),
						array(
							'start'          => 13,
							'font_weight'    => 400,
							'letter_spacing' => '0.015em',
							'text_transform' => 'uppercase',
						),
					),
				),

				// Used for Body Font [eg. entry-content]
				'sm_font_body' => array(
					'font_family'      => 'Montserrat',
					'font_weights'     => array( 200, '200italic', 700, '700italic' ),
					'font_size_to_line_height_points' => array(
						array( 15, 1.8 ),
						array( 18, 1.7 ),
					),

					// Define how fonts will look based on their size
					'font_styles_intervals'      => array(
						array(
							'start'         => 0,
							'font_weight'    => 200,
							'letter_spacing' => 0,
							'text_transform' => 'none',
						),
						array(
							'start'         => 20,
							'font_weight'    => 400,
							'letter_spacing' => 0,
							'text_transform' => 'none',
						),
					),
				),

				'sm_font_accent' => array(
					'type'        => 'theme_font',
					'font_family' => '"Billy Ohio", sans-serif',
				),
			),
		),
		'julia' => array(
			'label'   => esc_html__( 'Julia', 'customify' ),
			'preview' => array(
				// Font Palette Name
				'title'            => esc_html__( 'Julia', 'customify' ),
				'description'      => esc_html__( 'A graceful nature, truly tasteful and polished.', 'customify' ),
				'background_image_url' => 'https://cloud.pixelgrade.com/wp-content/uploads/2018/09/font-palette-serif.png',

				// Use the following options to style the preview card fonts
				// Including font-family, size, line-height, weight, letter-spacing and text transform
				'title_font'       => array(
					'font' => 'font_primary',
					'size' => 30,
				),
				'description_font' => array(
					'font' => 'font_body',
					'size' => 17,
				),
			),

			'fonts_logic' => array(
				// Primary is used for main headings [Display, H1, H2, H3]
				'sm_font_primary' => array(
					// Define the font type ('google' or 'theme_font'). By default it's 'google'.
					'type' => 'google',
					// Font loaded when a palette is selected
					'font_family'      => 'Lora',
					// Load all these fonts weights.
					'font_weights'     => array( 700 ),
					// "Generate" the graph to be used for font-size and line-height.
					'font_size_to_line_height_points' => array(
						array( 24, 1.25 ),
						array( 66, 1.15 ),
					),

					// Define how fonts will look based on the font size.
					'font_styles_intervals'      => array(
						array(
							'start'          => 0,
							'font_weight'    => 700,
							'letter_spacing' => '0em',
							'text_transform' => 'none',
						),
					),
				),

				// Secondary font is used for smaller headings [H4, H5, H6], including meta details
				'sm_font_secondary' => array(
					'font_family'      => 'Montserrat',
					'font_weights'     => array( 'regular', 600 ),
					'font_size_to_line_height_points' => array(
						array( 14, 1.3 ),
						array( 16, 1.2 )
					),
					'font_styles_intervals'      => array(
						array(
							'start'          => 0,
							'font_weight'    => 600,
							'letter_spacing' => '0.154em',
							'text_transform' => 'uppercase',
						),
						array(
							'start'          => 13,
							'font_weight'    => 'regular',
							'letter_spacing' => '0em',
							'text_transform' => 'uppercase',
						),
						array(
							'start'          => 14,
							'font_weight'    => 'regular',
							'letter_spacing' => '0.1em',
							'text_transform' => 'uppercase',
						),
						array(
							'start'          => 16,
							'font_weight'    => 'regular',
							'letter_spacing' => '0em',
							'text_transform' => 'uppercase',
						),
						array(
							'start'          => 17,
							'font_weight'    => 'regular',
							'letter_spacing' => '0em',
							'text_transform' => 'none',
						),
					),
				),

				// Used for Body Font [eg. entry-content]
				'sm_font_body' => array(
					'font_family'      => 'PT Serif',
					'font_weights'     => array( 'regular', '400italic', 700, '700italic' ),
					'font_size_to_line_height_points' => array(
						array( 15, 1.7 ),
						array( 18, 1.5 ),
					),

					// Define how fonts will look based on their size
					'font_styles_intervals'      => array(
						array(
							'start'          => 0,
							'font_weight'    => 'regular',
							'letter_spacing' => 0,
							'text_transform' => 'none',
						),
					),
				),
			),
		),
		'patch' => array(
			'label'   => esc_html__( 'Patch', 'customify' ),
			'preview' => array(
				// Font Palette Name
				'title'            => esc_html__( 'Patch', 'customify' ),
				'description'      => esc_html__( 'A graceful nature, truly tasteful and polished.', 'customify' ),
				'background_image_url' => 'https://cloud.pixelgrade.com/wp-content/uploads/2018/09/font-palette-lofty.png',

				// Use the following options to style the preview card fonts
				// Including font-family, size, line-height, weight, letter-spacing and text transform
				'title_font'       => array(
					'font' => 'font_primary',
					'size' => 26,
				),
				'description_font' => array(
					'font' => 'font_body',
					'size' => 16,
				),
			),

			'fonts_logic' => array(
				// Primary is used for main headings [Display, H1, H2, H3]
				'sm_font_primary' => array(
					// Define the font type ('google' or 'theme_font'). By default it's 'google'.
					'type' => 'google',
					// Font loaded when a palette is selected
					'font_family'      => 'Oswald',
					// Load all these fonts weights.
					'font_weights'     => array( 300, 400, 500 ),
					// "Generate" the graph to be used for font-size and line-height.
					'font_size_to_line_height_points' => array(
						array( 20, 1.55 ),
						array( 56, 1.25 ),
					),

					// Define how fonts will look based on the font size.
					'font_styles_intervals'      => array(
						array(
							'start'          => 0,
							'font_weight'    => 500,
							'letter_spacing' => '0.04em',
							'text_transform' => 'uppercase',
						),
						array(
							'start'          => 24,
							'font_weight'    => 300,
							'letter_spacing' => '0.06em',
							'text_transform' => 'uppercase',
						),
						array(
							'start'          => 25,
							'font_weight'    => 400,
							'letter_spacing' => '0.04em',
							'text_transform' => 'uppercase',
						),
						array(
							'start'          => 26,
							'font_weight'    => 500,
							'letter_spacing' => '0.04em',
							'text_transform' => 'uppercase',
						),
					),
				),

				// Secondary font is used for smaller headings [H4, H5, H6], including meta details
				'sm_font_secondary' => array(
					'font_family'      => 'Oswald',
					'font_weights'     => array( 200, '200italic', 500, '500italic' ),
					'font_size_to_line_height_points' => array(
						array( 14, 1.625 ),
						array( 24, 1.5 ),
					),
					'font_styles_intervals'      => array(
						array(
							'start'          => 0,
							'font_weight'    => 500,
							'letter_spacing' => '0.01em',
							'text_transform' => 'uppercase',
						),
						array(
							'start'          => 20,
							'font_weight'    => 500,
							'letter_spacing' => '0em',
							'text_transform' => 'uppercase',
						),
						array(
							'start'          => 24,
							'font_weight'    => 200,
							'letter_spacing' => '0em',
							'text_transform' => 'none',
						),
					),
				),

				// Used for Body Font [eg. entry-content]
				'sm_font_body' => array(
					'font_family'      => 'Roboto',
					'font_weights'     => array( 300, '300italic', 400, '400italic', 500, '500italic' ),
					'font_size_to_line_height_points' => array(
						array( 14, 1.5 ),
						array( 24, 1.45 ),
					),

					// Define how fonts will look based on their size
					'font_styles_intervals'      => array(
						array(
							'start'          => 0,
							'end'            => 10.9,
							'font_weight'    => 500,
							'letter_spacing' => '0.03em',
							'text_transform' => 'none',
						),
						array(
							'start'          => 10.9,
							'end'            => 12,
							'font_weight'    => 500,
							'letter_spacing' => '0.02em',
							'text_transform' => 'uppercase',
						),
						array(
							'start'          => 12,
							'font_weight'    => 300,
							'letter_spacing' => 0,
							'text_transform' => 'none',
						),
					),
				),
			),
		),
		'hive' => array(
			'label'   => esc_html__( 'Hive', 'customify' ),
			'preview' => array(
				// Font Palette Name
				'title'            => esc_html__( 'Hive', 'customify' ),
				'description'      => esc_html__( 'A graceful nature, truly tasteful and polished.', 'customify' ),
				'background_image_url' => 'https://cloud.pixelgrade.com/wp-content/uploads/2018/09/font-palette-classic.png',

				// Use the following options to style the preview card fonts
				// Including font-family, size, line-height, weight, letter-spacing and text transform
				'title_font'       => array(
					'font' => 'font_primary',
					'size' => 36,
				),
				'description_font' => array(
					'font' => 'font_body',
					'size' => 18,
				),
			),

			'fonts_logic' => array(
				// Primary is used for main headings [Display, H1, H2, H3]
				'sm_font_primary' => array(
					// Define the font type ('google' or 'theme_font'). By default it's 'google'.
					'type' => 'google',
					// Font loaded when a palette is selected
					'font_family'      => 'Playfair Display',
					// Load all these fonts weights.
					'font_weights'     => array( 400, '400italic', 700, '700italic', 900, '900italic' ),
					// "Generate" the graph to be used for font-size and line-height.
					'font_size_to_line_height_points' => array(
						array( 20, 1.55 ),
						array( 65, 1.15 ),
					),

					// Define how fonts will look based on the font size.
					'font_styles_intervals'      => array(
						array(
							'start'          => 0,
							'font_weight'    => 400,
							'letter_spacing' => '0em',
							'text_transform' => 'none',
						),
					),
				),

				// Secondary font is used for smaller headings [H4, H5, H6], including meta details
				'sm_font_secondary' => array(
					'font_family'      => 'Noto Serif',
					'font_weights'     => array( 400, '400italic', 700, '700italic' ),
					'font_size_to_line_height_points' => array(
						array( 13, 1.33 ),
						array( 18, 1.5 ),
					),
					'font_styles_intervals'      => array(
						array(
							'start'          => 0,
							'end'          	 => 15,
							'font_weight'    => 400,
							'letter_spacing' => '0em',
							'text_transform' => 'none',
						),
						array(
							'start'          => 15,
							'font_weight'    => 700,
							'letter_spacing' => '0em',
							'text_transform' => 'none',
						),
					),
				),

				// Used for Body Font [eg. entry-content]
				'sm_font_body' => array(
					'font_family'      => 'Noto Serif',
					'font_weights'     => array( 400, '400italic', 700, '700italic' ),
					'font_size_to_line_height_points' => array(
						array( 13, 1.4 ),
						array( 18, 1.5 ),
					),

					// Define how fonts will look based on their size
					'font_styles_intervals'      => array(
						array(
							'start'          => 0,
							'font_weight'    => 400,
							'letter_spacing' => 0,
							'text_transform' => 'none',
						),
					),
				),
			),
		),
	);

	return $font_palettes;
}
add_filter( 'customify_get_font_palettes', 'rosa2_add_default_font_palette' );
