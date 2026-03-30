<?php
/**
 * Regression check for post editor layout settings.
 *
 * Run with:
 * wp eval-file wp-content/themes/anima/test/post-editor-layout-settings.php
 */

function anima_fail_post_editor_layout_test( string $message ): void {
	fwrite( STDERR, $message . PHP_EOL );
	exit( 1 );
}

function anima_assert_expected_post_content_layout( $layout, string $context ): void {
	if ( ! is_array( $layout ) ) {
		anima_fail_post_editor_layout_test( "Missing {$context} layout array." );
	}

	if ( true !== ( $layout['inherit'] ?? false ) ) {
		anima_fail_post_editor_layout_test( "Expected {$context} inherit to be true." );
	}

	if ( 'var(--nb-content-width)' !== ( $layout['contentSize'] ?? null ) ) {
		anima_fail_post_editor_layout_test( "Expected {$context} contentSize to match the theme content width." );
	}

	if ( 'var(--nb-container-width)' !== ( $layout['wideSize'] ?? null ) ) {
		anima_fail_post_editor_layout_test( "Expected {$context} wideSize to match the theme wide width." );
	}
}

if ( ! defined( 'ABSPATH' ) ) {
	anima_fail_post_editor_layout_test( 'This script must run through wp eval-file.' );
}

$settings = get_block_editor_settings(
	[],
	new WP_Block_Editor_Context(
		[
			'name' => 'core/edit-post',
		]
	)
);

$post_content_attributes = $settings['postContentAttributes'] ?? null;

if ( ! is_array( $post_content_attributes ) ) {
	anima_fail_post_editor_layout_test( 'Missing postContentAttributes in block editor settings.' );
}

$layout = $post_content_attributes['layout'] ?? null;

anima_assert_expected_post_content_layout( $layout, 'postContentAttributes.layout' );

$stale_template           = new WP_Block_Template();
$stale_template->theme    = 'anima';
$stale_template->slug     = 'single';
$stale_template->type     = 'wp_template';
$stale_template->source   = 'custom';
$stale_template->content  = '<!-- wp:group --><div class="wp-block-group"><!-- wp:post-content /--></div><!-- /wp:group -->';
$normalized_templates     = apply_filters( 'get_block_templates', [ $stale_template ], [], 'wp_template' );
$normalized_template      = $normalized_templates[0] ?? null;
$normalized_template_data = parse_blocks( $normalized_template->content ?? '' );
$normalized_group         = $normalized_template_data[0] ?? null;
$normalized_post_content  = $normalized_group['innerBlocks'][0] ?? null;

if ( 'core/post-content' !== ( $normalized_post_content['blockName'] ?? null ) ) {
	anima_fail_post_editor_layout_test( 'Expected normalized template to keep the post-content block in place.' );
}

anima_assert_expected_post_content_layout(
	$normalized_post_content['attrs']['layout'] ?? null,
	'normalized custom template post-content layout'
);

echo "post editor layout settings OK\n";
