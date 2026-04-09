<?php
/**
 * Contract test for contextual reading bar palette mapping.
 *
 * Run with:
 * studio wp eval-file wp-content/themes/anima/test/reading-bar-contextual-palette.php
 */

function anima_fail_reading_bar_contextual_palette_test( string $message ): void {
	fwrite( STDERR, $message . PHP_EOL );
	exit( 1 );
}

if ( ! defined( 'ABSPATH' ) ) {
	anima_fail_reading_bar_contextual_palette_test( 'This script must run through wp eval-file.' );
}

$post_id = wp_insert_post(
	[
		'post_title'   => 'Reading Bar Contextual Palette Test',
		'post_content' => 'Test content',
		'post_status'  => 'publish',
		'post_type'    => 'post',
	]
);

if ( is_wp_error( $post_id ) || empty( $post_id ) ) {
	anima_fail_reading_bar_contextual_palette_test( 'Failed to create a temporary post.' );
}

update_post_meta( $post_id, '_project_color', '#123456' );

$markup = <<<'HTML'
<div class="c-reading-bar  js-reading-bar">
	<div class="c-reading-bar__container">
		<div class="c-reading-bar__layer c-reading-bar__layer--current">
			<div class="c-reading-bar__layer-wrapper">
				<div class="c-reading-bar__title c-reading-bar__title--current"></div>
			</div>
		</div>
		<div class="c-reading-bar__layer c-reading-bar__layer--next sm-color-signal-2 sm-palette-1 sm-variation-1 sm-palette--shifted">
			<div class="c-reading-bar__layer-wrapper"></div>
		</div>
	</div>
</div>
<div class="c-reading-bar__progress  js-reading-progress"></div>
HTML;

$filtered = anima_apply_contextual_palette_to_reading_bar_markup( $markup, $post_id );

if ( 1 !== preg_match( '/class="[^"]*\bc-reading-bar\b[^"]*\bjs-reading-bar\b[^"]*\bsm-palette-contextual-post\b[^"]*\bsm-variation-1\b[^"]*\bsm-color-signal-0\b/', $filtered ) ) {
	wp_delete_post( $post_id, true );
	anima_fail_reading_bar_contextual_palette_test( 'Expected the reading bar wrapper to opt into the contextual post palette.' );
}

if ( 1 !== preg_match( '/class="[^"]*\bc-reading-bar__layer--next\b[^"]*\bsm-color-signal-2\b[^"]*\bsm-palette-contextual-post\b[^"]*\bsm-variation-1\b[^"]*\bsm-palette--shifted\b/', $filtered ) ) {
	wp_delete_post( $post_id, true );
	anima_fail_reading_bar_contextual_palette_test( 'Expected the next reading layer to use the contextual post palette.' );
}

if ( 1 !== preg_match( '/class="[^"]*\bc-reading-bar__progress\b[^"]*\bjs-reading-progress\b[^"]*\bsm-palette-contextual-post\b[^"]*\bsm-variation-1\b[^"]*\bsm-color-signal-0\b/', $filtered ) ) {
	wp_delete_post( $post_id, true );
	anima_fail_reading_bar_contextual_palette_test( 'Expected the reading progress bar to use the contextual post palette.' );
}

delete_post_meta( $post_id, '_project_color' );

$unchanged = anima_apply_contextual_palette_to_reading_bar_markup( $markup, $post_id );

if ( $unchanged !== $markup ) {
	wp_delete_post( $post_id, true );
	anima_fail_reading_bar_contextual_palette_test( 'Expected markup without a contextual color to remain unchanged.' );
}

wp_delete_post( $post_id, true );

echo "reading bar contextual palette contract ok\n";
