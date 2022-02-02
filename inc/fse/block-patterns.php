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
	$block_pattern_categories = array(
		'featured' => array( 'label' => __( 'Featured', '__theme_txtd' ) ),
		'footer'   => array( 'label' => __( 'Footers', '__theme_txtd' ) ),
		'header'   => array( 'label' => __( 'Headers', '__theme_txtd' ) ),
		'query'    => array( 'label' => __( 'Query', '__theme_txtd' ) ),
		'pages'    => array( 'label' => __( 'Pages', '__theme_txtd' ) ),
	);

	/**
	 * Filters the theme block pattern categories.
	 *
	 * @since Twenty Twenty-Two 1.0
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
	$block_pattern_categories = apply_filters( 'anima_block_pattern_categories', $block_pattern_categories );

	foreach ( $block_pattern_categories as $name => $properties ) {
		if ( ! WP_Block_Pattern_Categories_Registry::get_instance()->is_registered( $name ) ) {
			register_block_pattern_category( $name, $properties );
		}
	}

	$block_patterns = array(
		'footer-dark',
		'footer-navigation-copyright',
		'general-subscribe',
		'general-featured-posts',
		'general-layered-images-with-duotone',
		'general-wide-image-intro-buttons',
		'general-large-list-names',
		'general-video-header-details',
		'general-list-events',
		'general-two-images-text',
		'general-image-with-caption',
		'general-video-trailer',
		'general-pricing-table',
		'general-divider-light',
		'general-divider-dark',
		'header-default',
		'header-large-dark',
		'header-small-dark',
		'header-image-background',
		'header-image-background-overlay',
		'header-with-tagline',
		'header-text-only-green-background',
		'header-text-only-salmon-background',
		'header-title-and-button',
		'header-text-only-with-tagline-black-background',
		'header-logo-navigation-gray-background',
		'header-logo-navigation-social-black-background',
		'header-title-navigation-social',
		'header-logo-navigation-offset-tagline',
		'header-stacked',
		'header-centered-logo',
		'header-centered-logo-black-background',
		'header-centered-title-navigation-social',
		'header-title-and-button',
		'hidden-404',
		'page-about-media-left',
		'page-about-simple-dark',
		'page-about-media-right',
		'page-about-solid-color',
		'page-about-links',
		'page-about-links-dark',
		'page-about-large-image-and-buttons',
		'page-layout-image-and-text',
		'page-layout-image-text-and-video',
		'page-layout-two-columns',
		'page-sidebar-poster',
		'page-sidebar-grid-posts',
		'page-sidebar-blog-posts',
		'page-sidebar-blog-posts-right',
		'query-default',
		'query-simple-blog',
		'query-grid',
		'query-text-grid',
		'query-image-grid',
		'query-large-titles',
		'query-irregular-grid',
	);

	/**
	 * Filters the theme block patterns.
	 *
	 * @param array $block_patterns List of block patterns by name.
	 */
	$block_patterns = apply_filters( 'anima_block_patterns', $block_patterns );

	foreach ( $block_patterns as $block_pattern ) {
		$pattern_file = get_theme_file_path( '/inc/patterns/' . $block_pattern . '.php' );

		register_block_pattern(
			'anima/' . $block_pattern,
			require $pattern_file
		);
	}
}
add_action( 'init', 'anima_register_block_patterns', 9 );
