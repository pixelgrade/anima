<?php
/**
 * Contract test for wp.org Nova Blocks template variants.
 *
 * Run from the theme root:
 * php test/wporg-template-variants.php
 */

function anima_fail_wporg_template_variants_test( string $message ): void {
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
	}
}

$anima_wporg_test_root = sys_get_temp_dir() . '/anima-wporg-template-variants-' . getmypid();
$variant_root          = $anima_wporg_test_root . '/wporg-template-variants/novablocks';

foreach ( [ 'templates', 'parts' ] as $directory ) {
	if ( ! is_dir( $variant_root . '/' . $directory ) && ! mkdir( $variant_root . '/' . $directory, 0777, true ) ) {
		anima_fail_wporg_template_variants_test( 'Could not create variant fixture directory.' );
	}
}

file_put_contents( $variant_root . '/templates/page.html', '<!-- wp:novablocks/sidecar /-->' );
file_put_contents( $variant_root . '/templates/single.html', '<!-- wp:novablocks/post-meta /-->' );
file_put_contents( $variant_root . '/parts/header.html', '<!-- wp:pattern {"slug":"anima/header-default"} /-->' );
file_put_contents( $variant_root . '/parts/footer.html', '<!-- wp:pattern {"slug":"anima/footer-default"} /-->' );

function get_theme_file_path( string $path = '' ): string {
	global $anima_wporg_test_root;

	return rtrim( $anima_wporg_test_root, '/' ) . '/' . ltrim( $path, '/' );
}

function get_stylesheet(): string {
	return 'anima-lt';
}

function add_filter( string $hook_name, $callback, int $priority = 10, int $accepted_args = 1 ): bool {
	$GLOBALS['anima_wporg_registered_filters'][] = [
		'hook_name'     => $hook_name,
		'callback'      => $callback,
		'priority'      => $priority,
		'accepted_args' => $accepted_args,
	];

	return true;
}

$integration_file = dirname( __DIR__ ) . '/wporg/inc/wporg-template-variants.php';

if ( ! file_exists( $integration_file ) ) {
	anima_fail_wporg_template_variants_test( 'Expected wp.org template variant integration file to exist.' );
}

require_once $integration_file;

foreach ( [
	'anima_wporg_novablocks_is_active',
	'anima_wporg_apply_novablocks_template_variant',
	'anima_wporg_filter_block_templates_with_novablocks_variants',
	'anima_wporg_filter_block_template_with_novablocks_variant',
] as $function_name ) {
	if ( ! function_exists( $function_name ) ) {
		anima_fail_wporg_template_variants_test( "Missing {$function_name}()." );
	}
}

if ( anima_wporg_novablocks_is_active() ) {
	anima_fail_wporg_template_variants_test( 'Nova Blocks should be inactive before its bootstrap marker is defined.' );
}

$theme_page_template          = new WP_Block_Template();
$theme_page_template->id      = 'anima-lt//page';
$theme_page_template->theme   = 'anima-lt';
$theme_page_template->slug    = 'page';
$theme_page_template->type    = 'wp_template';
$theme_page_template->source  = 'theme';
$theme_page_template->content = '<!-- wp:post-content /-->';

$inactive_page_template = anima_wporg_apply_novablocks_template_variant( $theme_page_template, 'wp_template' );

if ( '<!-- wp:post-content /-->' !== $inactive_page_template->content ) {
	anima_fail_wporg_template_variants_test( 'Inactive Nova Blocks must leave theme templates untouched.' );
}

define( 'Pixelgrade\NovaBlocks\VERSION', '2.1.18' );

if ( ! anima_wporg_novablocks_is_active() ) {
	anima_fail_wporg_template_variants_test( 'Nova Blocks should be active when its bootstrap marker is defined.' );
}

$active_page_template = anima_wporg_apply_novablocks_template_variant( $theme_page_template, 'wp_template' );

if ( '<!-- wp:novablocks/sidecar /-->' !== $active_page_template->content ) {
	anima_fail_wporg_template_variants_test( 'Expected the page template to swap to the Nova Blocks variant.' );
}

if ( $active_page_template === $theme_page_template ) {
	anima_fail_wporg_template_variants_test( 'Expected template swapping to return a copy, not mutate the original object.' );
}

if ( '<!-- wp:post-content /-->' !== $theme_page_template->content ) {
	anima_fail_wporg_template_variants_test( 'Expected the original theme template object to remain unchanged.' );
}

$custom_page_template         = clone $theme_page_template;
$custom_page_template->source = 'custom';

$custom_after_swap = anima_wporg_apply_novablocks_template_variant( $custom_page_template, 'wp_template' );

if ( '<!-- wp:post-content /-->' !== $custom_after_swap->content ) {
	anima_fail_wporg_template_variants_test( 'User-customized templates must not be replaced.' );
}

$theme_header_part          = new WP_Block_Template();
$theme_header_part->id      = 'anima-lt//header';
$theme_header_part->theme   = 'anima-lt';
$theme_header_part->slug    = 'header';
$theme_header_part->type    = 'wp_template_part';
$theme_header_part->source  = 'theme';
$theme_header_part->content = '<!-- wp:site-title /-->';

$active_header_part = anima_wporg_apply_novablocks_template_variant( $theme_header_part, 'wp_template_part' );

if ( '<!-- wp:pattern {"slug":"anima/header-default"} /-->' !== $active_header_part->content ) {
	anima_fail_wporg_template_variants_test( 'Expected the header part to swap to the Nova Blocks variant.' );
}

$archive_template          = clone $theme_page_template;
$archive_template->slug    = 'archive';
$archive_template->content = '<!-- wp:query /-->';

$header_part = clone $theme_header_part;

$filtered_templates = anima_wporg_filter_block_templates_with_novablocks_variants(
	[
		$archive_template,
		$header_part,
	],
	[],
	'wp_template'
);

if ( '<!-- wp:query /-->' !== $filtered_templates[0]->content ) {
	anima_fail_wporg_template_variants_test( 'Missing variant files should leave allowed templates unchanged.' );
}

if ( '<!-- wp:site-title /-->' !== $filtered_templates[1]->content ) {
	anima_fail_wporg_template_variants_test( 'Template filters must not swap template parts.' );
}

$filtered_part = anima_wporg_filter_block_template_with_novablocks_variant( $theme_header_part, 'anima-lt//header', 'wp_template_part' );

if ( '<!-- wp:pattern {"slug":"anima/header-default"} /-->' !== $filtered_part->content ) {
	anima_fail_wporg_template_variants_test( 'Expected get_block_template filtering to swap a theme header part.' );
}

$registered_filters = $GLOBALS['anima_wporg_registered_filters'] ?? [];
$expected_filters   = [
	'get_block_templates' => false,
	'get_block_template'  => false,
];

foreach ( $registered_filters as $filter ) {
	if ( array_key_exists( $filter['hook_name'], $expected_filters ) && 3 === $filter['accepted_args'] ) {
		$expected_filters[ $filter['hook_name'] ] = true;
	}
}

foreach ( $expected_filters as $hook_name => $was_registered ) {
	if ( ! $was_registered ) {
		anima_fail_wporg_template_variants_test( "Expected {$hook_name} filter to be registered with three args." );
	}
}

echo "wp.org template variants OK\n";
