<?php
/**
 * Contract test for the wp.org build's added Nova Blocks templates (#602).
 *
 * The wp.org package strips the Nova Blocks templates for plugin-registered
 * post types (portfolio, gallery, testimonial) and the split-header single.
 * With Nova Blocks active, they come back from wporg-template-variants/ —
 * but only when their post type or taxonomy exists, and never over a
 * user-customized copy.
 *
 * Run from the theme root:
 * php test/wporg-template-variant-additions.php
 */

function anima_fail_wporg_additions_test( string $message ): void {
	fwrite( STDERR, $message . PHP_EOL );
	exit( 1 );
}

if ( ! defined( 'ABSPATH' ) ) {
	define( 'ABSPATH', __DIR__ );
}

if ( ! class_exists( 'WP_Block_Template' ) ) {
	class WP_Block_Template {
		public $content;
		public $id;
		public $path;
		public $slug;
		public $source;
		public $theme;
		public $type;
		public $title;
		public $status;
		public $has_theme_file;
		public $is_custom;
		public $post_types;
	}
}

$anima_additions_root = sys_get_temp_dir() . '/anima-wporg-additions-' . getmypid();
$templates_dir        = $anima_additions_root . '/wporg-template-variants/novablocks/templates';

if ( ! is_dir( $templates_dir ) && ! mkdir( $templates_dir, 0777, true ) ) {
	anima_fail_wporg_additions_test( 'Could not create the fixture directory.' );
}

foreach ( [ 'archive-portfolio', 'single-portfolio', 'taxonomy-portfolio_type', 'archive-gallery', 'single-testimonial', 'single-split-header' ] as $slug ) {
	file_put_contents( $templates_dir . '/' . $slug . '.html', '<!-- wp:novablocks/sidecar {"slug":"' . $slug . '"} /-->' );
}

$GLOBALS['anima_test_post_types'] = [ 'post', 'page', 'portfolio' ];
$GLOBALS['anima_test_taxonomies'] = [ 'category', 'portfolio_type' ];

function get_theme_file_path( string $path = '' ): string {
	global $anima_additions_root;
	return rtrim( $anima_additions_root, '/' ) . '/' . ltrim( $path, '/' );
}

function get_stylesheet(): string {
	return 'anima-lt';
}

function post_type_exists( $post_type ): bool {
	return in_array( $post_type, $GLOBALS['anima_test_post_types'], true );
}

function taxonomy_exists( $taxonomy ): bool {
	return in_array( $taxonomy, $GLOBALS['anima_test_taxonomies'], true );
}

function wp_get_theme_data_custom_templates(): array {
	return [ 'single-split-header' => [ 'title' => 'Single Post (Split Header)', 'postTypes' => [ 'post' ] ] ];
}

function add_filter( string $hook_name, $callback, int $priority = 10, int $accepted_args = 1 ): bool {
	$GLOBALS['anima_additions_filters'][] = compact( 'hook_name', 'priority', 'accepted_args' ) + [ 'callback' => $callback ];
	return true;
}

require_once dirname( __DIR__ ) . '/wporg/inc/wporg-template-variants.php';

foreach ( [ 'anima_wporg_get_novablocks_added_template_requirements', 'anima_wporg_get_novablocks_added_templates', 'anima_wporg_filter_block_file_template_with_novablocks_addition' ] as $function_name ) {
	if ( ! function_exists( $function_name ) ) {
		anima_fail_wporg_additions_test( "Missing {$function_name}()." );
	}
}

$slugs = static function ( array $templates ): array {
	$result = array_map( static function ( $template ) {
		return $template->slug;
	}, $templates );
	sort( $result );
	return $result;
};

// Every stripped template has a requirement entry.
$requirements = anima_wporg_get_novablocks_added_template_requirements();
foreach ( [ 'archive-gallery', 'archive-portfolio', 'archive-testimonial', 'single-gallery', 'single-portfolio', 'single-testimonial', 'single-split-header', 'taxonomy-gallery_tag', 'taxonomy-gallery_type', 'taxonomy-portfolio_tag', 'taxonomy-portfolio_type' ] as $slug ) {
	if ( ! array_key_exists( $slug, $requirements ) ) {
		anima_fail_wporg_additions_test( "Missing requirement for {$slug}." );
	}
}

// 1. Without Nova Blocks nothing is added.
if ( [] !== anima_wporg_filter_block_templates_with_novablocks_variants( [], [], 'wp_template' ) ) {
	anima_fail_wporg_additions_test( 'Templates must not be added while Nova Blocks is inactive.' );
}

define( 'Pixelgrade\NovaBlocks\VERSION', '2.6.6' );

// 2. With Nova Blocks: only templates whose post type / taxonomy exists and whose file ships.
$added = anima_wporg_filter_block_templates_with_novablocks_variants( [], [], 'wp_template' );
$expected = [ 'archive-portfolio', 'single-portfolio', 'single-split-header', 'taxonomy-portfolio_type' ];
if ( $expected !== $slugs( $added ) ) {
	anima_fail_wporg_additions_test( 'Unexpected added templates: ' . implode( ', ', $slugs( $added ) ) );
}

$portfolio = null;
foreach ( $added as $template ) {
	if ( 'archive-portfolio' === $template->slug ) {
		$portfolio = $template;
	}
}
if ( 'anima-lt//archive-portfolio' !== $portfolio->id || 'theme' !== $portfolio->source || 'anima-lt' !== $portfolio->theme || 'wp_template' !== $portfolio->type ) {
	anima_fail_wporg_additions_test( 'Added templates must look like theme templates (id, source, theme, type).' );
}
if ( false === strpos( $portfolio->content, 'archive-portfolio' ) ) {
	anima_fail_wporg_additions_test( 'Added template content must come from its variant file.' );
}

// theme.json custom templates keep their title and post types, like a theme file.
foreach ( $added as $template ) {
	if ( 'single-split-header' === $template->slug && ( 'Single Post (Split Header)' !== $template->title || [ 'post' ] !== $template->post_types ) ) {
		anima_fail_wporg_additions_test( 'The split-header template must take its title and post types from theme.json.' );
	}
}

// 3. Template parts are never touched by the additions.
if ( [] !== anima_wporg_filter_block_templates_with_novablocks_variants( [], [], 'wp_template_part' ) ) {
	anima_fail_wporg_additions_test( 'Template parts must not receive template additions.' );
}

// 4. slug__in narrows (this is how the template hierarchy resolves).
$narrowed = anima_wporg_filter_block_templates_with_novablocks_variants( [], [ 'slug__in' => [ 'single-portfolio', 'single' ] ], 'wp_template' );
if ( [ 'single-portfolio' ] !== $slugs( $narrowed ) ) {
	anima_fail_wporg_additions_test( 'slug__in must limit the added templates.' );
}

// 5. A user-customized copy (already in the results) wins; no duplicate.
$custom         = new WP_Block_Template();
$custom->slug   = 'single-portfolio';
$custom->source = 'custom';
$custom->theme  = 'anima-lt';
$custom->type   = 'wp_template';
$custom->content = 'CUSTOM';
$with_custom = anima_wporg_filter_block_templates_with_novablocks_variants( [ $custom ], [ 'slug__in' => [ 'single-portfolio' ] ], 'wp_template' );
if ( 1 !== count( $with_custom ) || 'CUSTOM' !== $with_custom[0]->content ) {
	anima_fail_wporg_additions_test( 'A customized template must not be duplicated or replaced.' );
}

// 6. post_type queries keep custom templates only for their post types.
$for_pages = $slugs( anima_wporg_filter_block_templates_with_novablocks_variants( [], [ 'post_type' => 'page' ], 'wp_template' ) );
if ( in_array( 'single-split-header', $for_pages, true ) ) {
	anima_fail_wporg_additions_test( 'The split-header custom template is for posts only.' );
}
$for_posts = $slugs( anima_wporg_filter_block_templates_with_novablocks_variants( [], [ 'post_type' => 'post' ], 'wp_template' ) );
if ( ! in_array( 'single-split-header', $for_posts, true ) ) {
	anima_fail_wporg_additions_test( 'The split-header custom template must be offered for posts.' );
}

// 7. Single fetches (Site Editor, get_block_template) resolve added templates.
$fetched = anima_wporg_filter_block_file_template_with_novablocks_addition( null, 'anima-lt//archive-portfolio', 'wp_template' );
if ( ! $fetched || 'archive-portfolio' !== $fetched->slug ) {
	anima_fail_wporg_additions_test( 'get_block_file_template must resolve an added template.' );
}
if ( null !== anima_wporg_filter_block_file_template_with_novablocks_addition( null, 'anima-lt//archive-gallery', 'wp_template' ) ) {
	anima_fail_wporg_additions_test( 'Templates for missing post types must not resolve.' );
}
if ( null !== anima_wporg_filter_block_file_template_with_novablocks_addition( null, 'other-theme//archive-portfolio', 'wp_template' ) ) {
	anima_fail_wporg_additions_test( 'Only this theme\'s templates may resolve.' );
}

// 8. The file-template filter is registered.
$registered = false;
foreach ( $GLOBALS['anima_additions_filters'] ?? [] as $filter ) {
	if ( 'get_block_file_template' === $filter['hook_name'] && 3 === $filter['accepted_args'] ) {
		$registered = true;
	}
}
if ( ! $registered ) {
	anima_fail_wporg_additions_test( 'Expected get_block_file_template to be filtered with three args.' );
}

echo "wp.org template variant additions OK\n";
