<?php
/**
 * Contract test for expression-aware Nova card rendering.
 *
 * Run with:
 * studio wp eval-file /wordpress/wp-content/themes/anima/test/post-expression-card-render.php --path /Users/georgeolaru/Studio/hive-lt-starter
 */

function anima_fail_post_expression_card_render_test( string $message ): void {
	fwrite( STDERR, $message . PHP_EOL );
	exit( 1 );
}

if ( ! defined( 'ABSPATH' ) ) {
	anima_fail_post_expression_card_render_test( 'This script must run through wp eval-file.' );
}

if ( ! function_exists( 'novablocks_get_collection_card_markup_from_post' ) ) {
	anima_fail_post_expression_card_render_test( 'Expected Nova card helpers to be available.' );
}

$created_post_ids       = [];
$created_attachment_ids = [];

$attributes = [
	'showMedia'               => true,
	'showMeta'                => false,
	'showTitle'               => true,
	'showSubtitle'            => false,
	'showDescription'         => true,
	'showButtons'             => false,
	'primaryMetadata'         => 'none',
	'secondaryMetadata'       => 'none',
	'metadataPosition'        => 'below-title',
	'cardTitleLevel'          => 3,
	'cardTitleFontSize'       => 'regular',
	'contentPosition'         => 'top left',
	'columns'                 => 1,
	'cardLayout'              => 'vertical',
	'palette'                 => 1,
	'colorSignal'             => 0,
	'contentColorSignal'      => 0,
	'contentPaletteVariation' => 1,
];

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
		anima_fail_post_expression_card_render_test( 'Expected post fixture creation to succeed.' );
	}

	$created_post_ids[] = $post_id;

	return $post_id;
};

$create_attachment = static function ( string $title, int $width, int $height ) use ( &$created_attachment_ids ): int {
	$uploads = wp_upload_dir();

	if ( ! empty( $uploads['error'] ) ) {
		anima_fail_post_expression_card_render_test( 'Expected uploads to be available for attachment fixtures.' );
	}

	$fixture_dir = trailingslashit( $uploads['path'] ) . 'contract-fixtures';
	wp_mkdir_p( $fixture_dir );

	$file_name = sanitize_title( $title ) . '-' . wp_generate_password( 6, false, false ) . '.jpg';
	$file_path = trailingslashit( $fixture_dir ) . $file_name;
	$image     = imagecreatetruecolor( $width, $height );

	if ( false === $image ) {
		anima_fail_post_expression_card_render_test( 'Expected GD image creation to succeed for attachment fixtures.' );
	}

	$background = imagecolorallocate( $image, 120, 120, 120 );
	imagefill( $image, 0, 0, $background );
	imagejpeg( $image, $file_path, 85 );
	imagedestroy( $image );

	$attachment_id = wp_insert_attachment(
		[
			'post_mime_type' => 'image/jpeg',
			'post_title'     => $title,
			'post_status'    => 'inherit',
		],
		$file_path
	);

	if ( is_wp_error( $attachment_id ) || ! $attachment_id ) {
		anima_fail_post_expression_card_render_test( 'Expected attachment fixture creation to succeed.' );
	}

	$relative_path = ltrim( str_replace( trailingslashit( $uploads['basedir'] ), '', $file_path ), '/' );
	update_attached_file( $attachment_id, $file_path );

	wp_update_attachment_metadata(
		$attachment_id,
		[
			'width'  => $width,
			'height' => $height,
			'file'   => $relative_path,
		]
	);

	$created_attachment_ids[] = $attachment_id;

	return $attachment_id;
};

$quote_post_id = $create_post(
	[
		'post_title'   => 'Quote Card Fixture',
		'post_content' => '<!-- wp:quote --><blockquote class="wp-block-quote is-style-plain"><!-- wp:paragraph --><p>It is a purely lyrical process. A kind of musical shriving of the soul.</p><!-- /wp:paragraph --><cite>Paul Graham</cite></blockquote><!-- /wp:quote -->',
	]
);
set_post_format( $quote_post_id, 'quote' );

$quote_attachment_id = $create_attachment( 'Quote Card Fixture', 1600, 900 );
set_post_thumbnail( $quote_post_id, $quote_attachment_id );

$valid_blueprint_content =
	'<!-- wp:novablocks/supernova {"contentType":"custom","colorSignal":3,"paletteVariation":11,"palette":1} -->' .
	'<!-- wp:novablocks/supernova-item {"contentType":"custom","cardLayout":"stacked","contentPosition":"bottom right","contentPadding":50,"overlayFilterStrength":80,"minHeightFallback":66,"thumbnailAspectRatioString":"landscape","imageResizing":"cover","colorSignal":3,"paletteVariation":11,"contentPaletteVariation":11} -->' .
	'<!-- wp:quote --><blockquote class="wp-block-quote is-style-plain"><!-- wp:paragraph --><p>Blueprint quote copy.</p><!-- /wp:paragraph --><cite>Blueprint cite</cite></blockquote><!-- /wp:quote -->' .
	'<!-- /wp:novablocks/supernova-item -->' .
	'<!-- /wp:novablocks/supernova -->';

$blueprint_filter = static function ( $template, $id, $template_type ) use ( $valid_blueprint_content ) {
	if ( 'wp_template_part' !== $template_type || get_stylesheet() . '//card-quote' !== $id ) {
		return $template;
	}

	$block_template                 = new WP_Block_Template();
	$block_template->id             = $id;
	$block_template->theme          = get_stylesheet();
	$block_template->slug           = 'card-quote';
	$block_template->type           = 'wp_template_part';
	$block_template->source         = 'custom';
	$block_template->origin         = 'theme';
	$block_template->title          = 'Card Quote';
	$block_template->content        = $valid_blueprint_content;
	$block_template->area           = WP_TEMPLATE_PART_AREA_UNCATEGORIZED;
	$block_template->has_theme_file = false;
	$block_template->is_custom      = true;

	return $block_template;
};

add_filter( 'pre_get_block_template', $blueprint_filter, 10, 3 );

try {
	$quote_markup = novablocks_get_collection_card_markup_from_post( get_post( $quote_post_id ), $attributes );

	if ( false === strpos( $quote_markup, 'format-quote' ) ) {
		anima_fail_post_expression_card_render_test( 'Expected quote semantic class on card output.' );
	}

	if ( false === strpos( $quote_markup, 'card-trait-landscape' ) ) {
		anima_fail_post_expression_card_render_test( 'Expected landscape trait class on quote card output.' );
	}

	if ( false === strpos( $quote_markup, 'card-variant-quote' ) ) {
		anima_fail_post_expression_card_render_test( 'Expected quote card variant class on card output.' );
	}

	if ( false === strpos( $quote_markup, 'Paul Graham' ) ) {
		anima_fail_post_expression_card_render_test( 'Expected the live quote citation to reach the rendered card.' );
	}

	if ( false !== strpos( $quote_markup, 'Blueprint quote copy.' ) ) {
		anima_fail_post_expression_card_render_test( 'Expected the live quote text to replace the static blueprint copy.' );
	}
} finally {
	remove_filter( 'pre_get_block_template', $blueprint_filter, 10 );

	foreach ( array_reverse( $created_post_ids ) as $post_id ) {
		wp_delete_post( $post_id, true );
	}

	foreach ( array_reverse( $created_attachment_ids ) as $attachment_id ) {
		wp_delete_attachment( $attachment_id, true );
	}
}

echo "post expression card render contract ok\n";
