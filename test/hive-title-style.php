<?php
/**
 * Contract test for Hive decorative title styling.
 *
 * Run with:
 * studio wp eval-file wp-content/themes/anima/test/hive-title-style.php
 */

function anima_fail_hive_title_style_test( string $message ): void {
	fwrite( STDERR, $message . PHP_EOL );
	exit( 1 );
}

if ( ! defined( 'ABSPATH' ) ) {
	anima_fail_hive_title_style_test( 'This script must run through wp eval-file.' );
}

$original_style = get_option( 'sm_decorative_titles_style', null );
update_option( 'sm_decorative_titles_style', 'hive' );

if ( ! function_exists( 'anima_get_hive_styled_title_markup' ) ) {
	if ( null === $original_style ) {
		delete_option( 'sm_decorative_titles_style' );
	} else {
		update_option( 'sm_decorative_titles_style', $original_style );
	}

	anima_fail_hive_title_style_test( 'Expected Anima to expose the Hive title styling parser.' );
}

$styled_question_title = anima_get_hive_styled_title_markup( 'Question? Answer' );

if ( '<b>Question?</b><i> Answer</i>' !== $styled_question_title ) {
	if ( null === $original_style ) {
		delete_option( 'sm_decorative_titles_style' );
	} else {
		update_option( 'sm_decorative_titles_style', $original_style );
	}

	anima_fail_hive_title_style_test( 'Expected the Hive parser to bold the left side of ? titles and italicize the right side.' );
}

$styled_colon_title = anima_get_hive_styled_title_markup( 'Wait: really?' );

if ( '<b>Wait:</b><i> really?</i>' !== $styled_colon_title ) {
	if ( null === $original_style ) {
		delete_option( 'sm_decorative_titles_style' );
	} else {
		update_option( 'sm_decorative_titles_style', $original_style );
	}

	anima_fail_hive_title_style_test( 'Expected the Hive parser to bold the text before : and italicize the trailing question.' );
}

$post_id = wp_insert_post(
	[
		'post_title'   => 'Question? Answer',
		'post_content' => 'Test content',
		'post_status'  => 'publish',
		'post_type'    => 'post',
	]
);

if ( is_wp_error( $post_id ) || empty( $post_id ) ) {
	if ( null === $original_style ) {
		delete_option( 'sm_decorative_titles_style' );
	} else {
		update_option( 'sm_decorative_titles_style', $original_style );
	}

	anima_fail_hive_title_style_test( 'Failed to create the temporary post.' );
}

$GLOBALS['post'] = get_post( $post_id );
setup_postdata( $GLOBALS['post'] );

$post_title_markup = '<h1 class="wp-block-post-title"><a href="https://example.com/question-answer">Question? Answer</a></h1>';

if ( ! function_exists( 'anima_apply_hive_decorative_style_to_post_title_block' ) ) {
	wp_reset_postdata();
	wp_delete_post( $post_id, true );

	if ( null === $original_style ) {
		delete_option( 'sm_decorative_titles_style' );
	} else {
		update_option( 'sm_decorative_titles_style', $original_style );
	}

	anima_fail_hive_title_style_test( 'Expected Anima to expose the core/post-title render hook entrypoint.' );
}

$filtered_post_title_markup = anima_apply_hive_decorative_style_to_post_title_block( $post_title_markup, [] );

if ( false === strpos( $filtered_post_title_markup, '<b>Question?</b><i> Answer</i>' ) ) {
	wp_reset_postdata();
	wp_delete_post( $post_id, true );

	if ( null === $original_style ) {
		delete_option( 'sm_decorative_titles_style' );
	} else {
		update_option( 'sm_decorative_titles_style', $original_style );
	}

	anima_fail_hive_title_style_test( 'Expected the core/post-title entrypoint to inject the Hive title markup into the rendered title.' );
}

if ( ! function_exists( 'anima_apply_hive_decorative_style_to_collection_card_markup' ) ) {
	wp_reset_postdata();
	wp_delete_post( $post_id, true );

	if ( null === $original_style ) {
		delete_option( 'sm_decorative_titles_style' );
	} else {
		update_option( 'sm_decorative_titles_style', $original_style );
	}

	anima_fail_hive_title_style_test( 'Expected Anima to expose the Nova Blocks collection card entrypoint.' );
}

$card_markup = '<article class="nb-supernova-item"><h3 class="nb-card__title has-medium-font-size"><a href="https://example.com/question-answer">Question? Answer</a></h3></article>';
$filtered_card_markup = anima_apply_hive_decorative_style_to_collection_card_markup( $card_markup, get_post( $post_id ), [] );

if ( false === strpos( $filtered_card_markup, '<b>Question?</b><i> Answer</i>' ) ) {
	wp_reset_postdata();
	wp_delete_post( $post_id, true );

	if ( null === $original_style ) {
		delete_option( 'sm_decorative_titles_style' );
	} else {
		update_option( 'sm_decorative_titles_style', $original_style );
	}

	anima_fail_hive_title_style_test( 'Expected the Nova Blocks collection card entrypoint to inject the Hive title markup into card titles.' );
}

update_option( 'sm_decorative_titles_style', 'underline' );
$unchanged_post_title_markup = anima_apply_hive_decorative_style_to_post_title_block( $post_title_markup, [] );
$unchanged_card_markup       = anima_apply_hive_decorative_style_to_collection_card_markup( $card_markup, get_post( $post_id ), [] );

if ( $post_title_markup !== $unchanged_post_title_markup || $card_markup !== $unchanged_card_markup ) {
	wp_reset_postdata();
	wp_delete_post( $post_id, true );

	if ( null === $original_style ) {
		delete_option( 'sm_decorative_titles_style' );
	} else {
		update_option( 'sm_decorative_titles_style', $original_style );
	}

	anima_fail_hive_title_style_test( 'Expected non-Hive decorative title styles to leave title markup unchanged.' );
}

wp_reset_postdata();
wp_delete_post( $post_id, true );

if ( null === $original_style ) {
	delete_option( 'sm_decorative_titles_style' );
} else {
	update_option( 'sm_decorative_titles_style', $original_style );
}

echo "hive title style contract ok\n";
