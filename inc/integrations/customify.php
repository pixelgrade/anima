<?php
/**
 * Handle the Customify integration logic.
 */

// If this file is called directly, abort.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

// Define color constants
define( 'ROSA2_THEME_COLOR_PRIMARY',    '#DDAB5D' );    // gold
define( 'ROSA2_THEME_COLOR_SECONDARY',  '#39497C' );    // blue
define( 'ROSA2_THEME_COLOR_TERTIARY',   '#B12C4A' );    // red
define( 'ROSA2_THEME_DARK_PRIMARY',     '#212B49' );    // dark blue
define( 'ROSA2_THEME_DARK_SECONDARY',   '#34394B' );    // dark light blue
define( 'ROSA2_THEME_DARK_TERTIARY',    '#141928' );    // darker blue
define( 'ROSA2_THEME_LIGHT_PRIMARY',    '#FFFFFF' );    // white
define( 'ROSA2_THEME_LIGHT_SECONDARY',  '#CCCCCC' );    // gray
define( 'ROSA2_THEME_LIGHT_TERTIARY',   '#EEEFF2' );    // light gray

// Add new options to the Customify config
add_filter( 'customify_filter_fields', 'rosa2_add_customify_options', 11, 1 );
add_filter( 'customify_filter_fields', 'rosa2_add_customify_connected_fields', 12, 1 );
add_filter( 'customify_filter_fields', 'rosa2_add_header_section_to_customify_config', 20, 1 );
add_filter( 'customify_filter_fields', 'rosa2_add_separators_section_to_customify_config', 30, 1 );
add_filter( 'customify_filter_fields', 'rosa2_add_content_section_to_customify_config', 40, 1 );
add_filter( 'customify_filter_fields', 'rosa2_add_colors_section_to_customify_config', 50, 1 );
add_filter( 'customify_filter_fields', 'rosa2_add_fonts_section_to_customify_config', 60, 1 );

// Filter Style Manager color and font palettes
add_filter( 'customify_get_color_palettes', 'rosa2_filter_color_palettes' );
add_filter( 'customify_get_font_palettes', 'rosa2_filter_font_palettes' );

// Add theme fonts to the font field options list
add_filter( 'customify_theme_fonts', 'rosa2_add_customify_theme_fonts' );

function rosa2_add_customify_options( $config ) {
	$config['opt-name'] = 'rosa2_options';

	//start with a clean slate - no Customify default sections
	$config['sections'] = array();

	return $config;
}

function rosa2_add_fonts_section_to_customify_config( $config ) {

	$font_size_config = array(
		'min'  => 8,
		'max'  => 120,
		'step' => 1,
		'unit' => '',
	);

	$line_height_config = array(
		'min' => 0.8,
		'max' => 2,
		'step' => 0.05,
		'unit' => 'em',
	);

	$letter_spacing_config = array(
		'min'  => - 0.2,
		'max'  => 0.2,
		'step' => 0.01,
		'unit' => 'em',
	);

	$fields_config = array(
		'font-size'      => $font_size_config,
		'line-height'    => $line_height_config,
		'letter-spacing' => $letter_spacing_config,
		'text-align'     => false,
	);

	$rosa2_fonts_section = array(
		'fonts_section' => array(
			'title'   => esc_html__( 'Fonts', '__theme_txtd' ),
			'options' => array(
				'main_content_title_body_fonts_section' => array(
					'type' => 'html',
					'html' => '<span class="separator sub-section label">' . esc_html__( 'Body Fonts', '__theme_txtd' ) . '</span>',
				),
				'body_font'       => array(
					'type'              => 'font',
					'label'             => esc_html__( 'Body', '__theme_txtd' ),
					'desc'              => esc_html__( '', '__theme_txtd' ),
					'selector'          => ':root',
					'properties_prefix' => '--theme-body-',
					'default'           => array(
						'font-family'     => 'Reforma1969',
						'font-size'       => 16,
						'line-height'     => 1.7,
						'font-weight'     => '400',
						'text-transform'  => 'none',
						'text-decoration' => 'none',
						'letter-spacing'  => - 0.03,
					),
					'fields'            => $fields_config,
				),
				'content_font'    => array(
					'type'              => 'font',
					'label'             => esc_html__( 'Content', '__theme_txtd' ),
					'desc'              => esc_html__( '', '__theme_txtd' ),
					'selector'          => ':root',
					'properties_prefix' => '--theme-content-',
					'default'           => array(
						'font-family'     => 'Reforma1969',
						'font-size'       => 18,
						'line-height'     => 1.6,
						'font-weight'     => '500',
						'text-transform'  => 'none',
						'text-decoration' => 'none',
						'letter-spacing'  => - 0.03,
					),
					'fields'            => $fields_config,
				),
				'lead_font'    => array(
					'type'              => 'font',
					'label'             => esc_html__( 'Lead Paragraphs', '__theme_txtd' ),
					'desc'              => esc_html__( '', '__theme_txtd' ),
					'selector'          => ':root',
					'properties_prefix' => '--theme-lead-',
					'default'           => array(
						'font-family'     => 'Reforma1969',
						'font-size'       => 24,
						'line-height'     => 1.6,
						'font-weight'     => '500',
						'text-transform'  => 'none',
						'text-decoration' => 'none',
						'letter-spacing'  => - 0.02,
					),
					'fields'            => $fields_config,
				),
				'main_content_title_heading_fonts_section' => array(
					'type' => 'html',
					'html' => '<span class="separator sub-section label">' . esc_html__( 'Heading Fonts', '__theme_txtd' ) . '</span>',
				),
				'display_font'    => array(
					'type'              => 'font',
					'label'             => esc_html__( 'Display', '__theme_txtd' ),
					'desc'              => esc_html__( '', '__theme_txtd' ),
					'selector'          => ':root',
					'properties_prefix' => '--theme-display-',
					'default'           => array(
						'font-family'     => 'Reforma1969',
						'font-size'       => 115,
						'line-height'     => 1.03,
						'font-weight'     => '700',
						'text-transform'  => 'none',
						'text-decoration' => 'none',
						'letter-spacing'  => - 0.03,
					),
					'fields'            => $fields_config,
				),
				'heading_1_font'  => array(
					'type'              => 'font',
					'label'             => esc_html__( 'Heading 1', '__theme_txtd' ),
					'desc'              => esc_html__( '', '__theme_txtd' ),
					'selector'          => ':root',
					'properties_prefix' => '--theme-heading-1-',
					'default'           => array(
						'font-family'     => 'Reforma1969',
						'font-size'       => 66,
						'line-height'     => 1.1,
						'font-weight'     => '700',
						'text-transform'  => 'none',
						'text-decoration' => 'none',
						'letter-spacing'  => - 0.03,
					),
					'fields'            => $fields_config,
				),
				'heading_2_font'  => array(
					'type'              => 'font',
					'label'             => esc_html__( 'Heading 2', '__theme_txtd' ),
					'desc'              => esc_html__( '', '__theme_txtd' ),
					'selector'          => ':root',
					'properties_prefix' => '--theme-heading-2-',
					'default'           => array(
						'font-family'     => 'Reforma1969',
						'font-size'       => 40,
						'line-height'     => 1.2,
						'font-weight'     => '700',
						'text-transform'  => 'none',
						'text-decoration' => 'none',
						'letter-spacing'  => - 0.02,
					),
					'fields'            => $fields_config,
				),
				'heading_3_font'  => array(
					'type'              => 'font',
					'label'             => esc_html__( 'Heading 3', '__theme_txtd' ),
					'desc'              => esc_html__( '', '__theme_txtd' ),
					'selector'          => ':root',
					'properties_prefix' => '--theme-heading-3-',
					'default'           => array(
						'font-family'     => 'Reforma1969',
						'font-size'       => 32,
						'line-height'     => 1.2,
						'font-weight'     => '700',
						'text-transform'  => 'none',
						'text-decoration' => 'none',
						'letter-spacing'  => - 0.02,
					),
					'fields'            => $fields_config,
				),
				'heading_4_font'  => array(
					'type'              => 'font',
					'label'             => esc_html__( 'Heading 4', '__theme_txtd' ),
					'desc'              => esc_html__( '', '__theme_txtd' ),
					'selector'          => ':root',
					'properties_prefix' => '--theme-heading-4-',
					'default'           => array(
						'font-family'     => 'Reforma1969',
						'font-size'       => 24,
						'line-height'     => 1.2,
						'font-weight'     => '700',
						'text-transform'  => 'none',
						'text-decoration' => 'none',
						'letter-spacing'  => - 0.02,
					),
					'fields'            => $fields_config,
				),
				'heading_5_font'  => array(
					'type'              => 'font',
					'label'             => esc_html__( 'Heading 5', '__theme_txtd' ),
					'desc'              => esc_html__( '', '__theme_txtd' ),
					'selector'          => ':root',
					'properties_prefix' => '--theme-heading-5-',
					'default'           => array(
						'font-family'     => 'Reforma2018',
						'font-size'       => 17,
						'line-height'     => 1.5,
						'font-weight'     => '500',
						'text-transform'  => 'none',
						'text-decoration' => 'none',
						'letter-spacing'  => 0.017,
					),
					'fields'            => $fields_config,
				),
				'heading_6_font'  => array(
					'type'              => 'font',
					'label'             => esc_html__( 'Heading 6', '__theme_txtd' ),
					'desc'              => esc_html__( '', '__theme_txtd' ),
					'selector'          => ':root',
					'properties_prefix' => '--theme-heading-6-',
					'default'           => array(
						'font-family'     => 'Reforma2018',
						'font-size'       => 17,
						'line-height'     => 1.5,
						'font-weight'     => '500',
						'text-transform'  => 'none',
						'text-decoration' => 'none',
						'letter-spacing'  => 0.017,
					),
					'fields'            => $fields_config,
				),
				'accent_font'     => array(
					'type'              => 'font',
					'label'             => esc_html__( 'Accent', '__theme_txtd' ),
					'desc'              => esc_html__( '', '__theme_txtd' ),
					'selector'          => ':root',
					'properties_prefix' => '--theme-accent-',
					'default'           => array(
						'font-family' => 'Billy Ohio',
					),
					'recommended'       => array(
						'Billy Ohio',
						'Mellony Dry Brush',
						'Jandys Dua',
						'Nermola Script',
					),
				),
				'main_content_title_other_fonts_section' => array(
					'type' => 'html',
					'html' => '<span class="separator sub-section label">' . esc_html__( 'Other Fonts', '__theme_txtd' ) . '</span>',
				),
				'navigation_font' => array(
					'type'              => 'font',
					'label'             => esc_html__( 'Navigation', '__theme_txtd' ),
					'desc'              => esc_html__( '', '__theme_txtd' ),
					'selector'          => ':root',
					'properties_prefix' => '--theme-navigation-',
					'default'           => array(
						'font-family'     => 'Reforma2018',
						'font-size'       => 17,
						'line-height'     => 1.5,
						'font-weight'     => '500',
						'text-transform'  => 'none',
						'text-decoration' => 'none',
						'letter-spacing'  => 0.017,
					),
					'fields'            => $fields_config,
				),
				'buttons_font' => array(
					'type'              => 'font',
					'label'             => esc_html__( 'Buttons', '__theme_txtd' ),
					'desc'              => esc_html__( '', '__theme_txtd' ),
					'selector'          => ':root',
					'properties_prefix' => '--theme-button-',
					'default'           => array(
						'font-family'     => 'Reforma2018',
						'font-size'       => 17,
						'line-height'     => 1.2,
						'font-weight'     => '500',
						'text-transform'  => 'capitalize',
						'text-decoration' => 'none',
						'letter-spacing'  => 0.03,
					),
					'fields'            => $fields_config,
				),
				'meta_font'  => array(
					'type'              => 'font',
					'label'             => esc_html__( 'Meta', '__theme_txtd' ),
					'desc'              => esc_html__( '', '__theme_txtd' ),
					'selector'          => ':root',
					'properties_prefix' => '--theme-meta-',
					'default'           => array(
						'font-family'     => 'Reforma2018',
						'font-size'       => 17,
						'line-height'     => 1.5,
						'font-weight'     => '500',
						'text-transform'  => 'none',
						'text-decoration' => 'none',
						'letter-spacing'  => 0.017,
					),
					'fields'            => $fields_config,
				),
			),
		)
	);

	if ( empty( $config['sections'] ) ) {
		$config['sections'] = array();
	}

	$config['sections'] = $config['sections'] + $rosa2_fonts_section;

	return $config;
}

function rosa2_add_colors_section_to_customify_config( $config ) {

	$colors_section = array(
		'colors_section' => array(
			'title'   => esc_html__( 'Colors', '__theme_txtd' ),
			'options' => array(
				'color_1'       => array(
					'type'    => 'color',
					'live'    => true,
					'label'   => esc_html__( 'Rosa Primary Color', '__theme_txtd' ),
					'default' => ROSA2_THEME_COLOR_PRIMARY,
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
					'label'   => esc_html__( 'Rosa Secondary Color', '__theme_txtd' ),
					'default' => ROSA2_THEME_COLOR_SECONDARY,
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
					'label'   => esc_html__( 'Rosa Tertiary Color', '__theme_txtd' ),
					'default' => ROSA2_THEME_COLOR_TERTIARY,
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
					'label'   => esc_html__( 'Rosa Primary Dark Color', '__theme_txtd' ),
					'default' => ROSA2_THEME_DARK_PRIMARY,
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
					'label'   => esc_html__( 'Rosa Secondary Dark Color', '__theme_txtd' ),
					'default' => ROSA2_THEME_DARK_SECONDARY,
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
					'label'   => esc_html__( 'Rosa Tertiary Dark Color', '__theme_txtd' ),
					'default' => ROSA2_THEME_DARK_TERTIARY,
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
					'label'   => esc_html__( 'Rosa Primary Light Color', '__theme_txtd' ),
					'default' => ROSA2_THEME_LIGHT_PRIMARY,
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
					'label'   => esc_html__( 'Rosa Secondary Light Color', '__theme_txtd' ),
					'default' => ROSA2_THEME_LIGHT_SECONDARY,
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
					'label'   => esc_html__( 'Rosa Tertiary Light Color', '__theme_txtd' ),
					'default' => ROSA2_THEME_LIGHT_TERTIARY,
					'css'     => array(
						array(
							'selector' => ':root',
							'property' => '--theme-light-tertiary',
						),
					),
				),
			),
		),
	);

	if ( empty( $config['sections'] ) ) {
		$config['sections'] = array();
	}

	$config['sections'] = $config['sections'] + $colors_section;

	return $config;
}

function rosa2_add_header_section_to_customify_config( $config ) {

	$rosa2_header_section = array(
		'header_section' => array(
			'title'   => esc_html__( 'Header', '__theme_txtd' ),
			'options' => array(
				'header_logo_height'              => array(
					'type'        => 'range',
					'label'       => esc_html__( 'Logo Height', '__theme_txtd' ),
					'desc'        => esc_html__( 'Adjust the max height of your logo container.', '__theme_txtd' ),
					'live'        => true,
					'default'     => 22,
					'input_attrs' => array(
						'min'          => 20,
						'max'          => 200,
						'step'         => 1,
						'data-preview' => true,
					),
					'css'         => array(
						array(
							'property' => '--theme-logo-height',
							'selector' => ':root',
							'unit'     => '',
						),
					),
				),
				'header_height'                   => array(
					'type'        => 'range',
					'label'       => esc_html__( 'Header Height', '__theme_txtd' ),
					'desc'        => esc_html__( 'Adjust the header and navigation bar height.', '__theme_txtd' ),
					'live'        => true,
					'default'     => 118,
					'input_attrs' => array(
						'min'          => 40,
						'max'          => 200,
						'step'         => 10,
						'data-preview' => true,
					),
					'css'         => array(
						array(
							'property' => '--theme-header-height',
							'selector' => ':root',
							'unit'     => '',
						),
					),
				),
				'header_navigation_links_spacing' => array(
					'type'        => 'range',
					'label'       => esc_html__( 'Navigation Link Spacing', '__theme_txtd' ),
					'desc'        => esc_html__( 'Adjust the spacing between individual items in your navigation.', '__theme_txtd' ),
					'live'        => true,
					'default'     => 32,
					'input_attrs' => array(
						'min'          => 12,
						'max'          => 75,
						'step'         => 1,
						'data-preview' => true,
					),
					'css'         => array(
						array(
							'property'        => '--theme-header-links-spacing-settings',
							'selector'        => ':root',
							'unit'            => '',
						),
					),
				),
				'header_position'                 => array(
					'type'    => 'select',
					'label'   => esc_html__( 'Header Position', '__theme_txtd' ),
					'desc'    => esc_html__( 'Choose if you want a static menu or a fixed (sticky) one that stays visible no matter how much you scroll the page.', '__theme_txtd' ),
					'default' => 'sticky',
					'choices' => array(
						'static' => esc_html__( 'Static', '__theme_txtd' ),
						'sticky' => esc_html__( 'Sticky (fixed)', '__theme_txtd' ),
					),
				),
				'header_sides_spacing'            => array(
					'type'        => 'range',
					'label'       => esc_html__( 'Header Sides Spacing', '__theme_txtd' ),
					'desc'        => esc_html__( 'Adjust the space separating the header and the sides of the browser.', '__theme_txtd' ),
					'live'        => true,
					'default'     => 48, // this should be set by the theme (previously 40)
					'input_attrs' => array(
						'min'          => 0,
						'max'          => 140,
						'step'         => 1,
						'data-preview' => true,
					),
					'css'         => array(
						array(
							'property'        => '--theme-header-sides-spacing-settings',
							'selector'        => ':root',
							'unit'            => '',
						),
					),
				),
			),
		),
	);

	if ( empty( $config['sections'] ) ) {
		$config['sections'] = array();
	}

	$config['sections'] = $config['sections'] + $rosa2_header_section;

	return $config;
}

function rosa2_add_content_section_to_customify_config( $config ) {

	$rosa2_content_section = array(
		'content_section' => array(
			'title'   => esc_html__( 'Content', '__theme_txtd' ),
			'options' => array(
				'display_categories_on_archive' => array(
					'type'    => 'checkbox',
					'label'   => esc_html__( 'Display Categories on Archives', '__theme_txtd' ),
					'default' => true,
				),
				'display_tags_on_archive'       => array(
					'type'    => 'checkbox',
					'label'   => esc_html__( 'Display Tags on Archives', '__theme_txtd' ),
					'default' => false,
				),
				'display_date_on_archive'       => array(
					'type'    => 'checkbox',
					'label'   => esc_html__( 'Display Date on Archives', '__theme_txtd' ),
					'default' => true,
				),
				'display_author_on_archive'     => array(
					'type'    => 'checkbox',
					'label'   => esc_html__( 'Display Author on Archives', '__theme_txtd' ),
					'default' => false,
				),
			),
		),
	);

	if ( empty( $config['sections'] ) ) {
		$config['sections'] = array();
	}

	$config['sections'] = $config['sections'] + $rosa2_content_section;

	return $config;
}

function rosa2_add_separators_section_to_customify_config( $config ) {

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
		$separator_symbol_choices[ $symbol ] = ob_get_clean();
	}

	$rosa2_separators_section = array(
		'separators_section' => array(
			'title'   => esc_html__( 'Separators', '__theme_txtd' ),
			'options' => array(
				'separator_symbol'              => array(
					'type'    => 'radio_html',
					'label'   => esc_html__( 'Separator Symbol', '__theme_txtd' ),
					'default' => 'fleuron-1',
					'choices' => $separator_symbol_choices,
				),
			),
		),
	);

	if ( empty( $config['sections'] ) ) {
		$config['sections'] = array();
	}

	$config['sections'] = $config['sections'] + $rosa2_separators_section;

	return $config;
}

function rosa2_add_customify_connected_fields( $options ) {
	// If the theme hasn't declared support for style manager, bail.
	if ( ! current_theme_supports( 'customizer_style_manager' ) ) {
		return $options;
	}

	if ( ! isset( $options['sections']['style_manager_section'] ) ) {
		$options['sections']['style_manager_section'] = array();
	}

	// The section might be already defined, thus we merge, not replace the entire section config.
	$options['sections']['style_manager_section'] = array_replace_recursive( $options['sections']['style_manager_section'],
		array(
			'options' => array(
				// Font Palettes Assignment.
				'sm_font_palette'    => array(
					'default' => 'exquisite',
				),
				'sm_font_primary'    => array(
					'connected_fields' => array(
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
						'navigation_font',
						'buttons_font',
						'meta_font',
					),
				),
				'sm_font_body'       => array(
					'connected_fields' => array(
						'body_font',
						'content_font',
						'lead_font',
					),
				),
				'sm_font_accent'     => array(
					'connected_fields' => array(
						'accent_font',
					),
				),
				'sm_color_primary'   => array(
					'default'          => ROSA2_THEME_COLOR_PRIMARY,
					'connected_fields' => array(
						'color_1'
					),
				),
				'sm_color_secondary' => array(
					'default'          => ROSA2_THEME_COLOR_SECONDARY,
					'connected_fields' => array(
						'color_2'
					),
				),
				'sm_color_tertiary'  => array(
					'default'          => ROSA2_THEME_COLOR_TERTIARY,
					'connected_fields' => array(
						'color_3'
					),
				),
				'sm_dark_primary'    => array(
					'default'          => ROSA2_THEME_DARK_PRIMARY,
					'connected_fields' => array(
						'color_dark_1'
					),
				),
				'sm_dark_secondary'  => array(
					'default'          => ROSA2_THEME_DARK_SECONDARY,
					'connected_fields' => array(
						'color_dark_2'
					),
				),
				'sm_dark_tertiary'   => array(
					'default'          => ROSA2_THEME_DARK_TERTIARY,
					'connected_fields' => array(
						'color_dark_3'
					),
				),
				'sm_light_primary'   => array(
					'default'          => ROSA2_THEME_LIGHT_PRIMARY,
					'connected_fields' => array(
						'color_light_1'
					),
				),
				'sm_light_secondary' => array(
					'default'          => ROSA2_THEME_LIGHT_SECONDARY,
					'connected_fields' => array(
						'color_light_2'
					),
				),
				'sm_light_tertiary'  => array(
					'default'          => ROSA2_THEME_LIGHT_TERTIARY,
					'connected_fields' => array(
						'color_light_3'
					),
				),
			),
		)
	);

	return $options;
}

function rosa2_filter_color_palettes( $color_palettes ) {

	$color_palettes = array_merge( array(
		'default' => array(
			'label'   => 'Theme Default',
			'preview' => array(
				'background_image_url' => '//cloud.pixelgrade.com/wp-content/uploads/2018/07/rosa-palette.jpg',
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

function rosa2_filter_font_palettes( $font_palettes ) {

	$font_palettes = array(
		'exquisite'  => array(
			'label'   => esc_html__( 'Exquisite', '__theme_txtd' ),
			'preview' => array(
				'title'                => esc_html__( 'Exquisite', '__theme_txtd' ),
				'description'          => esc_html__( 'A warm comfort, truly simple and delightfull', '__theme_txtd' ),
				'background_image_url' => 'https://cloud.pixelgrade.com/wp-content/uploads/2019/09/font-palette-exquisite.png',
			),
			'fonts_logic' => array(
				'sm_font_primary'   => array(
					'type'        => 'theme_font',
					'font_family' => 'Reforma1969',
					'font_size_to_line_height_points' => array(
						array( 17, 1.5 ),
						array( 24, 1.2 ),
						array( 32, 1.2 ),
						array( 40, 1.2 ),
						array( 66, 1.1 ),
						array( 115, 1.03 ),
					),
					'font_styles_intervals' => array(
						array(
							'start'           => 0,
							'font_weight'     => '500',
							'letter_spacing'  => '-0.02em',
							'text_transform'  => 'none',
							'text_decoration' => 'none',
						),
						array(
							'start'           => 24,
							'font_weight'     => '700',
							'letter_spacing'  => '-0.02em',
						),
						array(
							'start'           => 66,
							'letter_spacing'  => '-0.03em',
						),
					),
				),
				'sm_font_secondary' => array(
					'type'                  => 'theme_font',
					'font_family'           => 'Reforma2018',
					'font_size_to_line_height_points' => array(
						array( 17, 1.5 ),
						array( 100, 1 ),
					),
					'font_styles_intervals' => array(
						array(
							'start'           => 0,
							'font_weight'     => '500',
							'letter_spacing'  => 'normal',
							'text_transform'  => 'none',
							'text_decoration' => 'none',
						),
					),
				),
				'sm_font_body'      => array(
					'type'        => 'theme_font',
					'font_family' => 'Reforma1969',
					'font_size_to_line_height_points' => array(
						array( 16, 1.7 ),
						array( 18, 1.6 ),
						array( 24, 1.6 ),
					),
					'font_styles_intervals' => array(
						array(
							'start'           => 0,
							'font_weight'     => '500',
							'letter_spacing'  => '-0.03em',
							'text_transform'  => 'none',
							'text_decoration' => 'none',
						),
						array(
							'start'           => 24,
							'letter_spacing'  => '-0.02em',
						),
					),
				),
				'sm_font_accent'    => array(
					'type'        => 'theme_font',
					'font_family' => 'Billy Ohio',
				),
			),
		),
		'lively'  => array(
			'label'   => esc_html__( 'Lively', '__theme_txtd' ),
			'preview' => array(
				'title'                => esc_html__( 'Lively', '__theme_txtd' ),
				'description'          => esc_html__( 'Chic and energetic with a confident nature', '__theme_txtd' ),
				'background_image_url' => 'https://cloud.pixelgrade.com/wp-content/uploads/2019/09/font-palette-lively.png',
			),
			'fonts_logic' => array(
				'sm_font_primary'   => array(
					'type'        => 'google',
					'font_family' => 'Prata',
					'font_size_to_line_height_points' => array(
						array( 16, 1.5 ),
						array( 80, 1.2 ),
					),
					'font_styles_intervals' => array(
						array(
							'start'           => 0,
							'font_weight'     => 'regular',
							'letter_spacing'  => 'normal',
							'text_transform'  => 'none',
							'text_decoration' => 'none',
						),
					),
				),
				'sm_font_secondary' => array(
					'type'        => 'google',
					'font_family' => 'Prata',
					'font_size_to_line_height_points' => array(
						array( 16, 1.5 ),
						array( 80, 1.2 ),
					),
					'font_styles_intervals' => array(
						array(
							'start'           => 0,
							'font_weight'     => 'regular',
							'letter_spacing'  => 'normal',
							'text_transform'  => 'none',
							'text_decoration' => 'none',
						),
					),
				),
				'sm_font_body'      => array(
					'type'        => 'theme_font',
					'font_family' => 'HK Grotesk',
					'font_size_to_line_height_points' => array(
						array( 16, 1.7 ),
						array( 24, 1.6 ),
					),
					'font_styles_intervals' => array(
						array(
							'start'           => 0,
							'font_weight'     => '400',
							'letter_spacing'  => 'normal',
							'text_transform'  => 'none',
							'text_decoration' => 'none',
						),
					),
				),
				'sm_font_accent' => array(
					'type' => 'theme_font',
					'font_family' => 'Mellony Dry Brush'
				),
			),
		),
		'voltage'  => array(
			'label'   => esc_html__( 'Voltage', '__theme_txtd' ),
			'preview' => array(
				'title'                => esc_html__( 'Voltage', '__theme_txtd' ),
				'description'          => esc_html__( 'Bold and strong, ready to make an impact', '__theme_txtd' ),
				'background_image_url' => 'https://cloud.pixelgrade.com/wp-content/uploads/2019/09/font-palette-voltage.png',
			),
			'fonts_logic' => array(
				'sm_font_primary'   => array(
					'type'        => 'theme_font',
					'font_family' => 'League Spartan',
					'font_size_to_line_height_points' => array(
						array( 16, 1.5 ),
						array( 80, 1.2 ),
					),
					'font_styles_intervals' => array(
						array(
							'start'           => 0,
							'font_weight'     => '400',
							'letter_spacing'  => 'normal',
							'text_transform'  => 'none',
							'text_decoration' => 'none',
						),
					),
				),
				'sm_font_secondary' => array(
					'type'        => 'theme_font',
					'font_family' => 'League Spartan',
					'font_size_to_line_height_points' => array(
						array( 16, 1.5 ),
						array( 80, 1.2 ),
					),
					'font_styles_intervals' => array(
						array(
							'start'           => 0,
							'font_weight'     => '400',
							'letter_spacing'  => 'normal',
							'text_transform'  => 'none',
							'text_decoration' => 'none',
						),
					),
				),
				'sm_font_body'      => array(
					'type'        => 'google',
					'font_family' => 'Poppins',
					'font_size_to_line_height_points' => array(
						array( 16, 1.7 ),
						array( 24, 1.6 ),
					),
					'font_styles_intervals' => array(
						array(
							'start'           => 0,
							'font_weight'     => 'regular',
							'letter_spacing'  => 'normal',
							'text_transform'  => 'none',
							'text_decoration' => 'none',
						),
					),
				),
				'sm_font_accent' => array(
					'type' => 'theme_font',
					'font_family' => 'Jandys Dua'
				),
			),
		),
		'self'  => array(
			'label'   => esc_html__( 'Self', '__theme_txtd' ),
			'preview' => array(
				'title'                => esc_html__( 'Self', '__theme_txtd' ),
				'description'          => esc_html__( 'An adventurous spirit that\'s loud and proud', '__theme_txtd' ),
				'background_image_url' => 'https://cloud.pixelgrade.com/wp-content/uploads/2019/09/font-palette-self.png',
			),
			'fonts_logic' => array(
				'sm_font_primary'   => array(
					'type'        => 'theme_font',
					'font_family' => 'YoungSerif',
					'font_size_to_line_height_points' => array(
						array( 16, 1.5 ),
						array( 80, 1.2 ),
					),
					'font_styles_intervals' => array(
						array(
							'start'           => 0,
							'font_weight'     => '400',
							'letter_spacing'  => 'normal',
							'text_transform'  => 'none',
							'text_decoration' => 'none',
						),
					),
				),
				'sm_font_secondary' => array(
					'type'        => 'theme_font',
					'font_family' => 'YoungSerif',
					'font_size_to_line_height_points' => array(
						array( 16, 1.5 ),
						array( 80, 1.2 ),
					),
					'font_styles_intervals' => array(
						array(
							'start'           => 0,
							'font_weight'     => '400',
							'letter_spacing'  => 'normal',
							'text_transform'  => 'none',
							'text_decoration' => 'none',
						),
					),
				),
				'sm_font_body'      => array(
					'type'        => 'google',
					'font_family' => 'Lato',
					'font_size_to_line_height_points' => array(
						array( 16, 1.7 ),
						array( 24, 1.6 ),
					),
					'font_styles_intervals' => array(
						array(
							'start'           => 0,
							'font_weight'     => 'regular',
							'letter_spacing'  => 'normal',
							'text_transform'  => 'none',
							'text_decoration' => 'none',
						),
					),
				),
				'sm_font_accent' => array(
					'type' => 'theme_font',
					'font_family' => 'Nermola Script'
				),
			),
		),
	);

	return $font_palettes;
}

function rosa2_add_customify_theme_fonts( $fonts ) {

	$fonts['Reforma1969'] = array(
		'family'   => 'Reforma1969',
		'src'      => '//pxgcdn.com/fonts/reforma1969/stylesheet.css',
		'variants' => array( '300', '500', '700' ),
	);

	$fonts['Reforma2018'] = array(
		'family'   => 'Reforma2018',
		'src'      => '//pxgcdn.com/fonts/reforma2018/stylesheet.css',
		'variants' => array( '300', '500', '700', '900' ),
	);

	$fonts['League Spartan'] = array(
		'family'   => 'League Spartan',
		'src'      => '//pxgcdn.com/fonts/league-spartan/stylesheet.css',
		'variants' => array()
	);

	$fonts['HK Grotesk'] = array(
		'family'   => 'HK Grotesk',
		'src'      => '//pxgcdn.com/fonts/hk-grotesk/stylesheet.css',
		'variants' => array()
	);

	$fonts['YoungSerif'] = array(
		'family'   => 'YoungSerif',
		'src'      => '//pxgcdn.com/fonts/young-serif/stylesheet.css',
		'variants' => array()
	);

	$fonts['Billy Ohio'] = array(
		'family'   => 'Billy Ohio',
		'src'      => '//pxgcdn.com/fonts/billy-ohio/stylesheet.css',
		'variants' => array()
	);

	$fonts['Mellony Dry Brush'] = array(
		'family'   => 'Mellony Dry Brush',
		'src'      => '//pxgcdn.com/fonts/mellony-dry-brush/stylesheet.css',
		'variants' => array()
	);

	$fonts['Jandys Dua'] = array(
		'family'   => 'Jandys Dua',
		'src'      => '//pxgcdn.com/fonts/jandys-dua/stylesheet.css',
		'variants' => array()
	);

	$fonts['Nermola Script'] = array(
		'family'   => 'Nermola Script',
		'src'      => '//pxgcdn.com/fonts/nermola-script/stylesheet.css',
		'variants' => array()
	);

	return $fonts;
}

