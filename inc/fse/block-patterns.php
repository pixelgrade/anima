<?php
/**
 * Block Patterns
 *
 * @package Anima
 */

/**
 * Registers block patterns and categories.
 *
 * @return void
 */
function anima_register_block_patterns() {
	$block_pattern_categories = [
		'header'   => [ 'label' => __( 'Layout: Header', '__theme_txtd' ) ],
		'footer'   => [ 'label' => __( 'Layout: Footer', '__theme_txtd' ) ],
	];

	/**
	 * Filters the theme block pattern categories.
	 *
	 * @param array[] $block_pattern_categories {
	 *     An associative array of block pattern categories, keyed by category name.
	 *
	 *     @type array[] $properties {
	 *         An array of block category properties.
	 *
	 *         @type string $label A human-readable label for the pattern category.
	 *     }
	 * }
	 */
	$block_pattern_categories = apply_filters( 'anima/block_patterns_categories', $block_pattern_categories );

	foreach ( $block_pattern_categories as $name => $properties ) {
		if ( ! WP_Block_Pattern_Categories_Registry::get_instance()->is_registered( $name ) ) {
			register_block_pattern_category( $name, $properties );
		}
	}

	// Find all available block patterns files.
	$block_patterns = _anima_get_block_patterns_files( get_theme_file_path( '/inc/fse/patterns' ) );

	/**
	 * Filters the theme block patterns.
	 *
	 * @param array $block_patterns {
	 *     List of block patterns keyed by their name/slug.
	 *
	 *     @type array[] $properties {
	 *         An array of block pattern properties.
	 *
	 *         @type string $slug The block pattern name (as extracted from its PHP filename.)
	 *         @type string $path The block pattern file absolute path.
	 *     }
	 * }
	 */
	$block_patterns = apply_filters( 'anima/block_patterns', $block_patterns );

	// Whether the Nova Blocks library is available. Some theme patterns are built
	// from novablocks/* blocks and must not be registered without it (e.g. the
	// bare WordPress.org build) — they would render as broken/invalid content.
	$nova_blocks_active = WP_Block_Type_Registry::get_instance()->is_registered( 'novablocks/header' );

	foreach ( $block_patterns as $block_pattern ) {
		if ( empty( $block_pattern['slug'] ) || empty( $block_pattern['path'] ) || ! file_exists( $block_pattern['path'] ) ) {
			continue;
		}

		$pattern = require $block_pattern['path'];

		if ( ! $nova_blocks_active
			&& ! empty( $pattern['content'] )
			&& false !== strpos( $pattern['content'], 'wp:novablocks/' ) ) {
			continue;
		}

		register_block_pattern( 'anima/' . $block_pattern['slug'], $pattern );
	}
}
// Priority 21 so this runs AFTER Nova Blocks registers its block types
// (novablocks_register_block_types is on init:20). The novablocks-based header
// patterns are gated on `novablocks/header` being registered; running earlier
// (e.g. init:12) made that check always fail, silently skipping every header
// pattern and leaving fresh sites with an empty header template part.
add_action( 'init', 'anima_register_block_patterns', 21 );

/**
 * Keep WooCommerce patterns confined to the WooCommerce category tab.
 *
 * WooCommerce registers many general-purpose categories like Intro, Services,
 * About, and Reviews alongside its own `woo-commerce` category. For LT sites
 * we want those patterns available only under the WooCommerce tab so they do
 * not crowd the broader site-building categories.
 *
 * @return void
 */
function anima_restrict_woocommerce_patterns_to_woocommerce_category() {
	$registry = WP_Block_Patterns_Registry::get_instance();

	foreach ( $registry->get_all_registered() as $pattern ) {
		$name = $pattern['name'] ?? '';

		if ( 0 !== strpos( $name, 'woocommerce-blocks/' ) ) {
			continue;
		}

		$categories = array_values( array_filter( (array) ( $pattern['categories'] ?? [] ) ) );

		if ( [ 'woo-commerce' ] === $categories || ! in_array( 'woo-commerce', $categories, true ) ) {
			continue;
		}

		$pattern['categories'] = [ 'woo-commerce' ];
		unset( $pattern['name'] );

		unregister_block_pattern( $name );
		register_block_pattern( $name, $pattern );
	}
}
add_action( 'init', 'anima_restrict_woocommerce_patterns_to_woocommerce_category', 999 );

/**
 * Finds all block patterns in a certain directory.
 *
 * @access private
 *
 * @param string $base_directory The directory to search into.
 *
 * @return array A list of file details to all block pattern files.
 */
function _anima_get_block_patterns_files( string $base_directory ): array {
	$file_list = [];
	if ( file_exists( $base_directory ) ) {
		$nested_files      = new \RecursiveIteratorIterator( new \RecursiveDirectoryIterator( $base_directory ) );
		$nested_pattern_files = new \RegexIterator( $nested_files, '/^.+\.php$/i', \RecursiveRegexIterator::GET_MATCH );
		foreach ( $nested_pattern_files as $path => $file ) {
			$pattern_slug = substr(
				$path,
				// Starting position of slug.
				strpos( $path, $base_directory . DIRECTORY_SEPARATOR ) + 1 + strlen( $base_directory ),
				// Subtract ending '.php'.
				-4
			);
			$file_list[ $pattern_slug ] = [
				'slug' => $pattern_slug,
				'path' => $path,
			];
		}
	}
	return $file_list;
}
