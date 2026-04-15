<?php
/**
 * Contract test for post expression profile resolution.
 *
 * Run with:
 * studio wp eval-file /wordpress/wp-content/themes/anima/test/post-expression-profile.php --path /Users/georgeolaru/Studio/hive-lt-starter
 */

function anima_fail_post_expression_profile_test( string $message ): void {
	fwrite( STDERR, $message . PHP_EOL );
	exit( 1 );
}

if ( ! defined( 'ABSPATH' ) ) {
	anima_fail_post_expression_profile_test( 'This script must run through wp eval-file.' );
}

if ( ! function_exists( 'anima_get_post_expression_profile' ) ) {
	anima_fail_post_expression_profile_test( 'Expected post expression resolver helpers to be available.' );
}

$created_post_ids       = [];
$created_attachment_ids = [];

$create_attachment = static function ( string $title, int $width, int $height ) use ( &$created_attachment_ids ): int {
	$uploads = wp_upload_dir();

	if ( ! empty( $uploads['error'] ) ) {
		anima_fail_post_expression_profile_test( 'Expected uploads to be available for attachment fixtures.' );
	}

	$fixture_dir = trailingslashit( $uploads['path'] ) . 'contract-fixtures';
	wp_mkdir_p( $fixture_dir );

	$file_name = sanitize_title( $title ) . '-' . wp_generate_password( 6, false, false ) . '.jpg';
	$file_path = trailingslashit( $fixture_dir ) . $file_name;
	$image     = imagecreatetruecolor( $width, $height );

	if ( false === $image ) {
		anima_fail_post_expression_profile_test( 'Expected GD image creation to succeed for attachment fixtures.' );
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
		anima_fail_post_expression_profile_test( 'Expected attachment fixture creation to succeed.' );
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
		anima_fail_post_expression_profile_test( 'Expected post fixture creation to succeed.' );
	}

	$created_post_ids[] = $post_id;

	return $post_id;
};

$standard_post_id = $create_post(
	[
		'post_title'   => 'Standard Expression Fixture',
		'post_content' => '<!-- wp:paragraph --><p>Standard body copy.</p><!-- /wp:paragraph -->',
	]
);

$quote_post_id = $create_post(
	[
		'post_title'   => 'Quote Expression Fixture',
		'post_content' => '<!-- wp:quote --><blockquote class="wp-block-quote is-style-plain"><!-- wp:paragraph --><p>It is a purely lyrical process.</p><!-- /wp:paragraph --><cite>Paul Graham</cite></blockquote><!-- /wp:quote -->',
	]
);
set_post_format( $quote_post_id, 'quote' );

$fallback_quote_post_id = $create_post(
	[
		'post_title'   => 'Quote Fallback Fixture',
		'post_content' => '<!-- wp:paragraph --><p>Fallback quote paragraph.</p><!-- /wp:paragraph -->',
	]
);
set_post_format( $fallback_quote_post_id, 'quote' );

$portrait_post_id = $create_post(
	[
		'post_title'   => 'Portrait Expression Fixture',
		'post_content' => '<!-- wp:paragraph --><p>Portrait body copy.</p><!-- /wp:paragraph -->',
	]
);
set_post_format( $portrait_post_id, 'image' );

$portrait_attachment_id  = $create_attachment( 'Portrait Fixture', 800, 1200 );
$tall_attachment_id      = $create_attachment( 'Tall Fixture', 500, 1000 );
$square_attachment_id    = $create_attachment( 'Square Fixture', 1000, 1000 );
$landscape_attachment_id = $create_attachment( 'Landscape Fixture', 1600, 1000 );
$wide_attachment_id      = $create_attachment( 'Wide Fixture', 2000, 1000 );

set_post_thumbnail( $portrait_post_id, $portrait_attachment_id );

$standard_profile = anima_get_post_expression_profile( $standard_post_id, 'card' );

if ( 'standard' !== $standard_profile['format'] ) {
	anima_fail_post_expression_profile_test( 'Expected empty post format to normalize to standard.' );
}

$quote_profile = anima_get_post_expression_profile( $quote_post_id, 'card' );

if ( 'quote' !== $quote_profile['format'] ) {
	anima_fail_post_expression_profile_test( 'Expected Quote post format to resolve to quote.' );
}

if ( 'text' !== $quote_profile['traits']['media_mode'] ) {
	anima_fail_post_expression_profile_test( 'Expected quote posts to resolve text media mode.' );
}

if ( 'It is a purely lyrical process.' !== ( $quote_profile['extracts']['quote'] ?? '' ) ) {
	anima_fail_post_expression_profile_test( 'Expected quote extraction to prefer the first core/quote block.' );
}

if ( 'Paul Graham' !== ( $quote_profile['extracts']['quote_citation'] ?? '' ) ) {
	anima_fail_post_expression_profile_test( 'Expected quote extraction to keep the cite text.' );
}

$fallback_quote_profile = anima_get_post_expression_profile( $fallback_quote_post_id, 'card' );

if ( 'Fallback quote paragraph.' !== ( $fallback_quote_profile['extracts']['quote'] ?? '' ) ) {
	anima_fail_post_expression_profile_test( 'Expected quote fallback to use the first paragraph only.' );
}

if ( '' !== ( $fallback_quote_profile['extracts']['quote_citation'] ?? '' ) ) {
	anima_fail_post_expression_profile_test( 'Expected paragraph fallback to leave the quote citation empty.' );
}

$portrait_profile = anima_get_post_expression_profile( $portrait_post_id, 'card' );

if ( 'portrait' !== $portrait_profile['traits']['image_shape'] ) {
	anima_fail_post_expression_profile_test( 'Expected portrait featured images to resolve the portrait bucket.' );
}

$shape_expectations = [
	$tall_attachment_id      => 'tall',
	$portrait_attachment_id  => 'portrait',
	$square_attachment_id    => 'square',
	$landscape_attachment_id => 'landscape',
	$wide_attachment_id      => 'wide',
];

foreach ( $shape_expectations as $attachment_id => $expected_shape ) {
	$actual_shape = anima_get_post_expression_image_shape( $attachment_id );

	if ( $expected_shape !== $actual_shape ) {
		anima_fail_post_expression_profile_test(
			sprintf(
				'Expected attachment %d to resolve %s, got %s.',
				$attachment_id,
				$expected_shape,
				$actual_shape
			)
		);
	}
}

foreach ( array_reverse( $created_post_ids ) as $post_id ) {
	wp_delete_post( $post_id, true );
}

foreach ( array_reverse( $created_attachment_ids ) as $attachment_id ) {
	wp_delete_attachment( $attachment_id, true );
}

echo "post expression profile contract ok\n";
