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
		'features' => [ 'label' => __( 'Features', '__theme_txtd' ) ],
		'footer'   => [ 'label' => __( 'Footers', '__theme_txtd' ) ],
		'header'   => [ 'label' => __( 'Headers', '__theme_txtd' ) ],
		'query'    => [ 'label' => __( 'Query', '__theme_txtd' ) ],
		'pages'    => [ 'label' => __( 'Pages', '__theme_txtd' ) ],
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

	foreach ( $block_patterns as $block_pattern ) {
		if ( empty( $block_pattern['slug'] ) || empty( $block_pattern['path'] ) || ! file_exists( $block_pattern['path'] ) ) {
			continue;
		}

		register_block_pattern(
			'anima/' . $block_pattern['slug'],
			require $block_pattern['path']
		);
	}
}
add_action( 'init', 'anima_register_block_patterns', 12 );

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
