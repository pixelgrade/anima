<?php
/**
 * Handle the Nova Blocks integration logic.
 *
 * @package Anima
 */

// If this file is called directly, abort.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

add_action( 'after_setup_theme', 'anima_novablocks_setup', 10 );

add_filter( 'novablocks_block_editor_settings', 'anima_alter_novablocks_separator_settings' );
add_filter( 'novablocks_block_editor_settings', 'anima_alter_novablocks_map_settings', 20 );

if ( ! function_exists( 'anima_novablocks_setup' ) ) {
	function anima_novablocks_setup() {
		$anima_novablocks_config = [
			'advanced-gallery' => [
				'name' => 'advanced-gallery',
				'supports' => [ 'blobs' ],
				'enabled' => true,
			],
			'announcement-bar' => [
				'name' => 'announcement-bar',
				'enabled' => true,
			],
			'author-box' => [
				'name' => 'author-box',
				'enabled' => true,
			],
			'cards-collection' => [
				'name' => 'cards-collection',
				'enabled' => true,
			],
			'card' => [
				'name' => 'card',
				'enabled' => true,
			],
			'contextual-post-card' => [
				'name' => 'contextual-post-card',
				'enabled' => true,
			],
			'google-map' => [
				'name' => 'google-map',
				'enabled' => true,
			],
			'header' => [
				'name' => 'header',
				'enabled' => true,
			],
			'header-row' => [
				'name' => 'header-row',
				'enabled' => true,
			],
			'headline' => [
				'name' => 'headline',
				'enabled' => true,
			],
			'hero' => [
				'name' => 'hero',
				'supports' => [ 'doppler' ],
				'enabled' => true,
			],
			'logo' => [
				'name' => 'logo',
				'enabled' => true,
			],
			'media' => [
				'name' => 'media',
				'supports' => [ 'blobs' ],
				'enabled' => true,
			],
			'menu-food' => [
				'name' => 'menu-food',
				'enabled' => true,
			],
			'navigation' => [
				'name' => 'navigation',
				'enabled' => true,
			],
			'opentable' => [
				'name' => 'opentable',
				'enabled' => true,
			],
			'openhours' => [
				'name' => 'openhours',
				'enabled' => true,
			],
			'post-comments' => [
				'name' => 'post-comments',
				'enabled' => true,
			],
			'post-meta' => [
				'name' => 'post-meta',
				'enabled' => true,
			],
			'post-navigation' => [
				'name' => 'post-navigation',
				'enabled' => true,
			],
			'posts-collection' => [
				'name' => 'posts-collection',
				'enabled' => true,
			],
			'sharing-overlay' => [
				'name' => 'sharing-overlay',
				'enabled' => true,
			],
			'slideshow' => [
				'name' => 'slideshow',
				'enabled' => true,
			],
			'sidecar' => [
				'name' => 'sidecar',
				'enabled' => true,
			],
			'sidecar-area' => [
				'name' => 'sidecar-area',
				'enabled' => true,
			],
			'supernova' => [
				'name' => 'supernova',
				'enabled' => true,
			],
			'supernova-item' => [
				'name' => 'supernova-item',
				'enabled' => true,
			],
		];

		$anima_novablocks_config = apply_filters( 'anima/novablocks_config', $anima_novablocks_config );

		add_theme_support( 'novablocks', $anima_novablocks_config );
	}
}


if ( ! function_exists( 'anima_alter_novablocks_separator_settings' ) ) {
	function anima_alter_novablocks_separator_settings( $settings ) {
		if ( empty( $settings['separator'] ) ) {
			$settings['separator'] = [];
		}

		$settings['separator']['markup'] = anima_get_separator_markup();

		return $settings;
	}
}

if ( ! function_exists( 'anima_get_separator_markup' ) ) {
	function anima_get_separator_markup() {
		ob_start();
		?>

		<div class="c-separator">
			<div class="c-separator__arrow c-separator__arrow--left"></div>
			<div class="c-separator__line c-separator__line--left"></div>
			<div class="c-separator__symbol">
				<span><?php echo anima_get_separator_symbol(); ?></span>
			</div>
			<div class="c-separator__line c-separator__line--right"></div>
			<div class="c-separator__arrow c-separator__arrow--right"></div>
		</div>
		<?php return apply_filters( 'anima/separator_markup', ob_get_clean() );
	}
}

if ( ! function_exists( 'anima_get_separator_symbol' ) ) {
	function anima_get_separator_symbol() {
		$symbol = pixelgrade_option( 'separator_symbol', 'fleuron-1' );
		$allowed_symbols = [ 'fleuron-1', 'fleuron-2', 'fleuron-3', 'fleuron-4', 'fleuron-5' ];
		if ( ! in_array( $symbol, $allowed_symbols, true ) ) {
			$symbol = 'fleuron-1';
		}
		ob_start();
		get_template_part( 'assets/separators/' . $symbol . '-svg' );

		return ob_get_clean();
	}
}

if ( ! function_exists( 'anima_alter_novablocks_map_settings' ) ) {
	function anima_alter_novablocks_map_settings( $settings ) {

		if ( empty( $settings['map'] ) ) {
			$settings['map'] = [];
		}

		$accent_color = pixelgrade_option( 'sm_color_primary', '#DDAB5D' );
		$advanced_palettes_setting = pixelgrade_option( 'sm_advanced_palette_output' );

		if ( ! empty( $advanced_palettes_setting ) ) {
			$palettes = json_decode( $advanced_palettes_setting, true );

			if ( isset( $palettes[0]['source'][0] ) ) {
				$accent_color = $palettes[0]['source'][0];
			}
		}

		$settings['map']['accentColor'] = $accent_color;

		return $settings;
	}
}

/**
 * Collage header brick: when the Collage Grid treatment is on, render the
 * site branding + primary menu as the FIRST brick inside the main collage
 * collection on blog-like views — the masonry engine packs it like a card
 * (the Patch-style header-in-grid).
 */
add_filter( 'novablocks/collection_leading_items_markup', 'anima_collection_header_brick_markup', 10, 2 );

function anima_collection_header_brick_markup( $markup, array $attributes ) {
	static $rendered = false;

	if ( $rendered || ! is_string( $markup ) ) {
		return $markup;
	}

	if ( ! get_option( 'sm_collection_collage_grid', false ) ) {
		return $markup;
	}

	if ( ( $attributes['layoutStyle'] ?? '' ) !== 'masonry'
		|| ( $attributes['thumbnailAspectRatioString'] ?? '' ) !== 'original' ) {
		return $markup;
	}

	if ( ! ( is_home() || is_front_page() || is_archive() || is_search() ) || is_singular() ) {
		return $markup;
	}

	$rendered = true;

	$branding = get_custom_logo();

	if ( empty( $branding ) ) {
		$branding = '<a class="c-header-brick__title" href="' . esc_url( home_url( '/' ) ) . '" rel="home">'
			. esc_html( get_bloginfo( 'name' ) )
			. '</a>';
	}

	$menu = '';

	if ( has_nav_menu( 'primary' ) ) {
		$menu = wp_nav_menu(
			[
				'theme_location'       => 'primary',
				'container'            => 'nav',
				'container_class'      => 'c-header-brick__navigation',
				'container_aria_label' => esc_attr__( 'Primary Menu', '__theme_txtd' ),
				'menu_class'           => 'c-header-brick__menu',
				'fallback_cb'          => false,
				'depth'                => 1,
				'echo'                 => false,
			]
		);
	}

	return $markup
		. '<div class="nb-collection__layout-item nb-collection__layout-item--header-brick">'
		. '<div class="c-header-brick">'
		. '<div class="c-header-brick__branding">' . $branding . '</div>'
		. $menu
		. anima_header_brick_social_markup()
		. '</div>'
		. '</div>';
}

/**
 * Expose the Style Manager palette SOURCE color as a CSS variable. The
 * generated accent is contrast-corrected (a saturated source like #ffeb00
 * becomes darker for text safety); brand moments that want the RAW color
 * (category chips, sticky ribbons, menu highlights) read this variable.
 */
add_action( 'wp_head', 'anima_output_brand_source_color_css_var', 5 );

function anima_output_brand_source_color_css_var(): void {
	$advanced_palettes_setting = pixelgrade_option( 'sm_advanced_palette_output' );

	if ( empty( $advanced_palettes_setting ) ) {
		return;
	}

	$palettes = json_decode( $advanced_palettes_setting, true );
	$source   = $palettes[0]['source'][0] ?? '';

	if ( empty( $source ) || ! preg_match( '/^#[0-9a-fA-F]{3,8}$/', $source ) ) {
		return;
	}

	echo '<style id="anima-brand-source-color">:root { --anima-brand-source-color: ' . esc_html( $source ) . '; }</style>' . "\n";
}

/**
 * Archive title brick: on archive/search views the page title becomes the
 * second grid brick, right after the header brick (Patch's page-header card).
 */
add_filter( 'novablocks/collection_leading_items_markup', 'anima_collection_archive_title_brick_markup', 20, 2 );

function anima_collection_archive_title_brick_markup( $markup, array $attributes ) {
	static $rendered = false;

	if ( $rendered || ! is_string( $markup ) || '' === $markup ) {
		// Only ever render alongside the header brick (same gates passed).
		return $markup;
	}

	if ( ! ( is_archive() || is_search() ) ) {
		return $markup;
	}

	$rendered = true;

	if ( is_search() ) {
		/* translators: %s: search query. */
		$title = sprintf( esc_html__( 'Search: %s', '__theme_txtd' ), get_search_query() );
	} else {
		$title = get_the_archive_title();
	}

	return $markup
		. '<div class="nb-collection__layout-item nb-collection__layout-item--archive-title-brick">'
		. '<div class="c-archive-title-brick"><h1 class="c-archive-title-brick__title">' . wp_kses_post( $title ) . '</h1></div>'
		. '</div>';
}

/**
 * Social icons row for the collage header brick: renders the nav menu NAMED
 * "Social" (a starter convention — Anima registers no social location) with
 * URL-mapped inline SVG icons, mirroring Patch's header.
 */
function anima_header_brick_social_markup(): string {
	$menu = wp_get_nav_menu_object( 'Social' );

	if ( ! $menu ) {
		return '';
	}

	$items = wp_get_nav_menu_items( $menu->term_id );

	if ( empty( $items ) ) {
		return '';
	}

	$icons = [
		'twitter'  => '<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true"><path d="M23 5.1c-.8.4-1.7.6-2.6.8a4.5 4.5 0 0 0 2-2.5c-.9.5-1.9.9-2.9 1.1a4.5 4.5 0 0 0-7.7 4.1A12.8 12.8 0 0 1 2.5 4a4.5 4.5 0 0 0 1.4 6 4.4 4.4 0 0 1-2-.5v.1a4.5 4.5 0 0 0 3.6 4.4 4.6 4.6 0 0 1-2 .1 4.5 4.5 0 0 0 4.2 3.1A9 9 0 0 1 1 19.1a12.7 12.7 0 0 0 6.9 2c8.3 0 12.8-6.9 12.8-12.8v-.6c.9-.6 1.6-1.4 2.2-2.3z"/></svg>',
		'x.com'    => '<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true"><path d="M18.9 2H22l-6.8 7.8L23.3 22h-6.3l-4.9-6.4L6.5 22H3.4l7.3-8.3L1 2h6.4l4.4 5.9L18.9 2zm-1.1 18h1.7L7.3 3.7H5.5L17.8 20z"/></svg>',
		'facebook' => '<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true"><path d="M13.5 22v-9h3l.5-3.5h-3.5V7.2c0-1 .3-1.7 1.8-1.7H17V2.2C16.7 2.1 15.6 2 14.4 2c-2.6 0-4.4 1.6-4.4 4.6v2.9H7V13h3v9h3.5z"/></svg>',
		'feed'     => '<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true"><path d="M4 11a9 9 0 0 1 9 9h3A12 12 0 0 0 4 8v3zm0-7a16 16 0 0 1 16 16h3A19 19 0 0 0 4 1v3zm2 13a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5z"/></svg>',
		'mailto'   => '<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true"><path d="M2 5v14h20V5H2zm18 2v.5L12 13 4 7.5V7h16zM4 17V9.9l8 5.4 8-5.4V17H4z"/></svg>',
		'instagram' => '<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true"><path d="M12 2.2c3.2 0 3.6 0 4.8.1 3.3.1 4.8 1.7 4.9 4.9.1 1.3.1 1.6.1 4.8s0 3.6-.1 4.8c-.1 3.2-1.7 4.8-4.9 4.9-1.3.1-1.6.1-4.8.1s-3.6 0-4.8-.1c-3.3-.1-4.8-1.7-4.9-4.9C2.2 15.6 2.2 15.2 2.2 12s0-3.6.1-4.8C2.4 4 4 2.4 7.2 2.3 8.4 2.2 8.8 2.2 12 2.2zm0 2.7c-3.1 0-3.5 0-4.7.1-2.4.1-3.5 1.2-3.6 3.6-.1 1.2-.1 1.6-.1 4.7s0 3.5.1 4.7c.1 2.4 1.2 3.5 3.6 3.6 1.2.1 1.6.1 4.7.1s3.5 0 4.7-.1c2.4-.1 3.5-1.2 3.6-3.6.1-1.2.1-1.6.1-4.7s0-3.5-.1-4.7c-.1-2.4-1.2-3.5-3.6-3.6-1.2-.1-1.6-.1-4.7-.1zm0 4.1a5 5 0 1 1 0 10 5 5 0 0 1 0-10zm0 2.7a2.3 2.3 0 1 0 0 4.6 2.3 2.3 0 0 0 0-4.6zm5.2-3.4a1.2 1.2 0 1 1 0 2.4 1.2 1.2 0 0 1 0-2.4z"/></svg>',
	];

	$out = '<ul class="c-header-brick__social" aria-label="' . esc_attr__( 'Social Links', '__theme_txtd' ) . '">';

	foreach ( $items as $item ) {
		$url  = (string) $item->url;
		$icon = '';

		foreach ( $icons as $needle => $svg ) {
			if ( false !== stripos( $url, $needle ) ) {
				$icon = $svg;
				break;
			}
		}

		if ( ! $icon ) {
			$icon = '<span aria-hidden="true">' . esc_html( mb_substr( $item->title, 0, 1 ) ) . '</span>';
		}

		$out .= '<li><a href="' . esc_url( $url ) . '">'
			. '<span class="screen-reader-text">' . esc_html( $item->title ) . '</span>'
			. $icon
			. '</a></li>';
	}

	$out .= '</ul>';

	return $out;
}
