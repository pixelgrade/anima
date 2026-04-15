<?php
/**
 * Contract test for post-format single template routing.
 *
 * Run with:
 * studio wp eval-file /wordpress/wp-content/themes/anima/test/post-expression-single-template-routing.php --path /Users/georgeolaru/Studio/hive-lt-starter
 */

function anima_fail_post_expression_single_template_routing_test( string $message ): void {
	fwrite( STDERR, $message . PHP_EOL );
	exit( 1 );
}

if ( ! defined( 'ABSPATH' ) ) {
	anima_fail_post_expression_single_template_routing_test( 'This script must run through wp eval-file.' );
}

if ( ! function_exists( 'anima_get_post_format_single_template_hierarchy' ) ) {
	anima_fail_post_expression_single_template_routing_test( 'Expected post-format single template routing helpers to be available.' );
}

$created_post_ids = [];

$create_post = static function ( array $args ) use ( &$created_post_ids ): int {
	$post_id = wp_insert_post(
		wp_parse_args(
			$args,
			[
				'post_status' => 'publish',
				'post_type'   => 'post',
			]
		)
	);

	if ( is_wp_error( $post_id ) || ! $post_id ) {
		anima_fail_post_expression_single_template_routing_test( 'Expected post fixture creation to succeed.' );
	}

	$created_post_ids[] = $post_id;

	return $post_id;
};

$standard_post_id = $create_post(
	[
		'post_title'   => 'Standard Single Template Fixture',
		'post_name'    => 'standard-single-template-fixture',
		'post_content' => '<!-- wp:paragraph --><p>Standard body copy.</p><!-- /wp:paragraph -->',
	]
);

$quote_post_id = $create_post(
	[
		'post_title'   => 'Quote Single Template Fixture',
		'post_name'    => 'quote-single-template-fixture',
		'post_content' => '<!-- wp:quote --><blockquote class="wp-block-quote"><!-- wp:paragraph --><p>Quote body copy.</p><!-- /wp:paragraph --></blockquote><!-- /wp:quote -->',
	]
);
set_post_format( $quote_post_id, 'quote' );
update_post_meta( $quote_post_id, '_wp_page_template', 'single-split-header' );

$base_hierarchy = [
	'single-split-header',
	'single-post-quote-single-template-fixture.php',
	'single-post.php',
	'single.php',
];

$template_filter = static function ( $template, $id, $template_type ) {
	if ( 'wp_template' !== $template_type || get_stylesheet() . '//single-quote' !== $id ) {
		return $template;
	}

	$block_template                 = new WP_Block_Template();
	$block_template->id             = $id;
	$block_template->theme          = get_stylesheet();
	$block_template->slug           = 'single-quote';
	$block_template->type           = 'wp_template';
	$block_template->source         = 'custom';
	$block_template->origin         = 'theme';
	$block_template->title          = 'Single Quote';
	$block_template->content        = '<!-- wp:post-content /-->';
	$block_template->has_theme_file = false;
	$block_template->is_custom      = true;

	return $block_template;
};

$standard_hierarchy = anima_get_post_format_single_template_hierarchy( $base_hierarchy, get_post( $standard_post_id ) );

if ( $base_hierarchy !== $standard_hierarchy ) {
	anima_fail_post_expression_single_template_routing_test( 'Expected standard posts to keep the default single template hierarchy.' );
}

$quote_hierarchy_without_template = anima_get_post_format_single_template_hierarchy( $base_hierarchy, get_post( $quote_post_id ) );

if ( $base_hierarchy !== $quote_hierarchy_without_template ) {
	anima_fail_post_expression_single_template_routing_test( 'Expected quote posts without a single-quote template to keep the default hierarchy.' );
}

add_filter( 'pre_get_block_template', $template_filter, 10, 3 );

try {
	$quote_hierarchy = anima_get_post_format_single_template_hierarchy( $base_hierarchy, get_post( $quote_post_id ) );

	if ( 'single-quote.php' !== ( $quote_hierarchy[0] ?? '' ) ) {
		anima_fail_post_expression_single_template_routing_test( 'Expected quote posts to prioritize the single-quote template candidate.' );
	}

	if ( in_array( 'single-split-header', $quote_hierarchy, true ) ) {
		anima_fail_post_expression_single_template_routing_test( 'Expected quote routing to ignore the manually assigned template candidate.' );
	}

	if ( ! in_array( 'single-post-quote-single-template-fixture.php', $quote_hierarchy, true ) ) {
		anima_fail_post_expression_single_template_routing_test( 'Expected quote routing to keep the remaining single-post hierarchy intact.' );
	}
} finally {
	remove_filter( 'pre_get_block_template', $template_filter, 10 );

	foreach ( array_reverse( $created_post_ids ) as $post_id ) {
		wp_delete_post( $post_id, true );
	}
}

echo "post expression single template routing contract ok\n";
