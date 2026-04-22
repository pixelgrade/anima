<?php
/**
 * Site Frame Style Manager integration.
 *
 * @package Anima
 */

// If this file is called directly, abort.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

add_filter( 'style_manager/filter_fields', 'anima_add_site_frame_section_to_style_manager_config', 62, 1 );
add_filter( 'style_manager/sm_panel_config', 'anima_reorganize_site_frame_customizer_controls', 30, 2 );
add_action( 'after_setup_theme', 'anima_maybe_invalidate_style_manager_site_frame_cache', 20 );

/**
 * Get the Site Frame palette choices — the currently saved Style Manager palettes,
 * excluding the functional ones (Info / Error / Warning / Success). Functional
 * palettes are identified by IDs starting with `_`, same convention Nova
 * Blocks' PalettePicker uses via isFunctionalPalette().
 *
 * Keys are palette IDs as strings (what gets saved on the option). Labels come
 * from each palette's label, falling back to the ID so the control stays usable
 * even when labels are missing.
 *
 * @return array<string,string>
 */
function anima_get_site_frame_palette_choices(): array {
	if ( ! function_exists( 'sm_get_saved_palettes' ) ) {
		return [];
	}

	$choices = [];
	foreach ( sm_get_saved_palettes() as $palette ) {
		if ( ! is_object( $palette ) || empty( $palette->id ) ) {
			continue;
		}

		$id = (string) $palette->id;

		// Skip functional palettes — site frame is a brand surface, not a status cue.
		if ( '_' === substr( $id, 0, 1 ) ) {
			continue;
		}

		$label = ! empty( $palette->label ) ? (string) $palette->label : $id;

		$choices[ $id ] = $label;
	}

	return $choices;
}

/**
 * Get the default Site Frame palette — the site's primary palette.
 *
 * @return string
 */
function anima_get_site_frame_default_palette(): string {
	$choices = anima_get_site_frame_palette_choices();

	if ( empty( $choices ) ) {
		return '1';
	}

	return (string) array_key_first( $choices );
}

/**
 * Get the Site Frame grade choices — the 12 palette variations as numeric keys,
 * preceded by an "Accent" shortcut that auto-resolves to whichever grade holds
 * the selected palette's brand colour (the palette's `sourceIndex`).
 *
 * @return array<string,string>
 */
function anima_get_site_frame_variation_choices(): array {
	$choices = [
		'accent' => esc_html__( 'Accent (palette brand colour)', '__theme_txtd' ),
	];

	for ( $i = 1; $i <= 12; $i++ ) {
		$choices[ (string) $i ] = sprintf(
			/* translators: %d: palette grade index (1-12). */
			esc_html__( 'Grade %d', '__theme_txtd' ),
			$i
		);
	}
	return $choices;
}

/**
 * Add Site Frame options to the shared Style Manager section.
 *
 * @param array $config Style Manager config.
 * @return array
 */
function anima_add_site_frame_section_to_style_manager_config( $config ) {
	if ( empty( $config['sections'] ) ) {
		$config['sections'] = [];
	}

	if ( empty( $config['sections']['style_manager_section'] ) ) {
		$config['sections']['style_manager_section'] = [];
	}

	$palette_choices = anima_get_site_frame_palette_choices();
	$palette_default = anima_get_site_frame_default_palette();

	$config['sections']['style_manager_section'] = \Pixelgrade\StyleManager\Utils\ArrayHelpers::array_merge_recursive_distinct(
		$config['sections']['style_manager_section'],
		[
			'options' => [
				'sm_site_frame_intro' => [
					'type'         => 'html',
					'setting_type' => 'option',
					'setting_id'   => 'sm_site_frame_intro',
					'html'         => '<div class="customize-control-title">' . esc_html__( 'Site Frame', '__theme_txtd' ) . '</div>' .
						'<span class="description customize-control-description">' . esc_html__( 'Frame the site with a reusable desktop frame and style a dedicated Site Frame menu with search, social links, and expressive navigation.', '__theme_txtd' ) . '</span>',
				],
				'sm_site_frame_style' => [
					'type'         => 'sm_radio',
					'setting_type' => 'option',
					'setting_id'   => 'sm_site_frame_style',
					'label'        => esc_html__( 'Style', '__theme_txtd' ),
					'default'      => 'none',
					'choices'      => [
						'none'      => esc_html__( 'None', '__theme_txtd' ),
						'editorial' => esc_html__( 'Editorial', '__theme_txtd' ),
					],
				],
				'sm_site_frame_palette' => [
					'type'            => 'radio',
					'setting_type'    => 'option',
					'setting_id'      => 'sm_site_frame_palette',
					'label'           => esc_html__( 'Palette', '__theme_txtd' ),
					'default'         => $palette_default,
					'choices'         => $palette_choices,
					'live'            => true,
					'active_callback' => 'anima_is_site_frame_enabled',
				],
				'sm_site_frame_variation' => [
					'type'            => 'select',
					'setting_type'    => 'option',
					'setting_id'      => 'sm_site_frame_variation',
					'label'           => esc_html__( 'Color Grade', '__theme_txtd' ),
					'desc'            => esc_html__( 'Pick a color grade from the selected color palette.', '__theme_txtd' ),
					'default'         => '11',
					'choices'         => anima_get_site_frame_variation_choices(),
					'live'            => true,
					'active_callback' => 'anima_is_site_frame_enabled',
				],
			],
		]
	);

	return $config;
}

/**
 * Append Site Frame controls to the Tweak Board section.
 *
 * @param array $sm_panel_config   Style Manager panel config.
 * @param array $sm_section_config Raw Style Manager section config.
 * @return array
 */
function anima_reorganize_site_frame_customizer_controls( $sm_panel_config, $sm_section_config ) {
	$required_options = [
		'sm_site_frame_intro',
		'sm_site_frame_style',
		'sm_site_frame_palette',
		'sm_site_frame_variation',
	];

	foreach ( $required_options as $option_id ) {
		if ( empty( $sm_section_config['options'][ $option_id ] ) ) {
			return $sm_panel_config;
		}
	}

	if ( empty( $sm_panel_config['sections']['sm_tweak_board_section']['options'] ) || ! is_array( $sm_panel_config['sections']['sm_tweak_board_section']['options'] ) ) {
		return $sm_panel_config;
	}

	$sm_panel_config['sections']['sm_tweak_board_section']['options'] = array_merge(
		$sm_panel_config['sections']['sm_tweak_board_section']['options'],
		[
			'sm_site_frame_intro'     => $sm_section_config['options']['sm_site_frame_intro'],
			'sm_site_frame_style'     => $sm_section_config['options']['sm_site_frame_style'],
			'sm_site_frame_palette'   => $sm_section_config['options']['sm_site_frame_palette'],
			'sm_site_frame_variation' => $sm_section_config['options']['sm_site_frame_variation'],
		]
	);

	return $sm_panel_config;
}

/**
 * Invalidate stale Style Manager Customizer cache entries for Site Frame.
 *
 * @return void
 */
function anima_maybe_invalidate_style_manager_site_frame_cache(): void {
	$cached_config = get_option( 'pixelgrade_style_manager_customizer_config' );
	if ( ! is_array( $cached_config ) ) {
		return;
	}

	$tweak_board_section = $cached_config['panels']['style_manager_panel']['sections']['sm_tweak_board_section'] ?? [];
	$site_frame_section  = $cached_config['panels']['style_manager_panel']['sections']['sm_site_frame_section'] ?? [];
	$section_options     = $tweak_board_section['options'] ?? [];
	$intro_option        = $section_options['sm_site_frame_intro'] ?? [];
	$style_option        = $section_options['sm_site_frame_style'] ?? [];
	$palette_option      = $section_options['sm_site_frame_palette'] ?? [];
	$signal_option       = $section_options['sm_site_frame_variation'] ?? [];
	$option_order        = array_keys( $section_options );
	$expected_tail       = [
		'sm_site_frame_intro',
		'sm_site_frame_style',
		'sm_site_frame_palette',
		'sm_site_frame_variation',
	];
	$has_expected_copy   = (
		empty( $site_frame_section )
		&& ( $intro_option['type'] ?? '' ) === 'html'
		&& false !== strpos( (string) ( $intro_option['html'] ?? '' ), 'Site Frame' )
		&& false !== strpos( (string) ( $intro_option['html'] ?? '' ), 'Frame the site with a reusable desktop frame and style a dedicated Site Frame menu with search, social links, and expressive navigation.' )
		&& ( $style_option['setting_id'] ?? '' ) === 'sm_site_frame_style'
		&& isset( $style_option['choices']['editorial'] )
		&& ( $palette_option['setting_id'] ?? '' ) === 'sm_site_frame_palette'
		&& ! array_key_exists( '_error', (array) ( $palette_option['choices'] ?? [] ) )
		&& ( $signal_option['setting_id'] ?? '' ) === 'sm_site_frame_variation'
		&& ( $signal_option['type'] ?? '' ) === 'select'
		&& isset( $signal_option['choices']['accent'] )
		&& 'Pick a color grade from the selected color palette.' === ( $signal_option['desc'] ?? '' )
		&& $expected_tail === array_slice( $option_order, -1 * count( $expected_tail ) )
	);

	if ( $has_expected_copy ) {
		return;
	}

	update_option( 'pixelgrade_style_manager_customizer_config_timestamp', 0, true );
	update_option( 'pixelgrade_style_manager_customizer_opt_name_timestamp', 0, true );
}
