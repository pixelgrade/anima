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
add_filter( 'novablocks_block_editor_settings', 'anima_add_card_metadata_style_editor_setting', 30 );
add_filter( 'novablocks_collection_layout_recipes', 'anima_register_collection_layout_recipes' );

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
 * Register Anima Collage as a free, block-local Cards Collection recipe.
 *
 * Defaults are applied once when the recipe is selected. Nova continues to
 * own the Masonry engine and every ordinary collection control afterwards.
 */
function anima_add_card_metadata_style_editor_setting( $settings ): array {
	if ( ! is_array( $settings ) ) {
		$settings = [];
	}

	$settings['cardMetadataStyleDefault'] = function_exists( 'anima_get_card_metadata_style' )
		? anima_get_card_metadata_style()
		: 'plain';

	return $settings;
}

/**
 * Register the Collage and Broadsheet recipes with Nova's authoritative
 * recipe registry.
 *
 * @param array $recipes Recipes supplied by Nova and other integrations.
 * @return array
 */
function anima_register_collection_layout_recipes( $recipes ): array {
	if ( ! is_array( $recipes ) ) {
		$recipes = [];
	}

	$recipes[] = [
		'id'           => 'anima-collage',
		'label'        => __( 'Collage', '__theme_txtd' ),
		'baseLayout'   => 'masonry',
		'thumbnail'    => 'collage',
		'defaults'     => [
			'columns'                    => 4,
			'columnsFitMinWidth'         => 350,
			'gridGap'                    => 38,
			'thumbnailAspectRatioString' => 'original',
			'cardHoverEffect'            => 'reveal',
			'headerIntegration'          => 'standard',
		],
		'capabilities' => [
			'itemsGap'         => true,
			'fitColumns'       => true,
			'aspectRatio'      => true,
			'hover'            => true,
			'scrolling'        => true,
			'pile3d'           => true,
			'headerIntegration' => true,
			'linkedPostMetadata' => true,
			'readMoreAffordance' => true,
		],
	];

	// Broadsheet: a newspaper front page over the classic grid engine. Content
	// signals assign editorial roles in CSS only (lead/feature/brief/pull-quote
	// from the card-expression classes); pile3d stays off because the recipe
	// uses dense grid flow, which breaks the 3D effect's nth-child column
	// targeting; the site-header grid proxy is masonry-only, so no
	// headerIntegration; fitColumns is a masonry-only control.
	$recipes[] = [
		'id'           => 'anima-broadsheet',
		'label'        => __( 'Broadsheet (Beta)', '__theme_txtd' ),
		'baseLayout'   => 'classic',
		'thumbnail'    => 'broadsheet',
		'defaults'     => [
			'columns'             => 4,
			'gridGap'             => 30,
			'verticalGapModifier' => 1.5,
		],
		'capabilities' => [
			'itemsGap'           => true,
			'fitColumns'         => false,
			'aspectRatio'        => true,
			'hover'              => true,
			'scrolling'          => true,
			'pile3d'             => false,
			'headerIntegration'  => false,
			'linkedPostMetadata' => true,
			'readMoreAffordance' => false,
		],
	];

	// Lattice: the quiet Gallery voice from the composition playground. Nova's
	// generic Lattice strategy owns placement; Anima supplies selection defaults
	// and a block-local skin over the Classic collection content model.
	$recipes[] = [
		'id'             => 'anima-lattice',
		'label'          => __( 'Lattice', '__theme_txtd' ),
		'baseLayout'     => 'classic',
		'layoutStrategy' => 'lattice',
		'thumbnail'      => 'lattice',
		'defaults'       => [
			'columns'                    => 5,
			'gridGap'                    => 26,
			'verticalGapModifier'        => 1,
			'thumbnailAspectRatioString' => 'portrait',
			'imageResizing'              => 'cropped',
			'cardLayout'                 => 'vertical',
			'showMedia'                  => true,
			'showTitle'                  => true,
			'showSubtitle'               => false,
			'showDescription'            => false,
			'showButtons'                => false,
			'showMeta'                   => true,
			'primaryMetadata'            => 'date',
			'secondaryMetadata'          => 'none',
			'elementOrder'               => [ 'media', 'title', 'meta-primary' ],
			'cardHoverEffect'            => 'none',
		],
		'capabilities' => [
			'columnsRange'       => [ 'min' => 2, 'max' => 6 ],
			'itemsGap'           => false,
			'verticalGap'        => false,
			'aspectRatio'        => false,
			'hoverEffect'        => false,
			'fitColumns'         => false,
			'scrolling'          => true,
			'pile3d'             => false,
			'headerIntegration'  => false,
			'linkedPostMetadata' => true,
			'readMoreAffordance' => false,
		],
	];

	return $recipes;
}
