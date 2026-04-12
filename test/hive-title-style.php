<?php
/**
 * Contract test for LT post title styling.
 *
 * Run with:
 * wp eval-file wp-content/themes/anima/test/hive-title-style.php
 */

function anima_fail_hive_title_style_test( string $message ): void {
	fwrite( STDERR, $message . PHP_EOL );
	exit( 1 );
}

/**
 * Restore the original option state before aborting or exiting.
 *
 * @param mixed $original_style Original option value.
 */
function anima_restore_hive_title_style_option( $original_style ): void {
	if ( null === $original_style ) {
		delete_option( 'sm_decorative_titles_style' );
		return;
	}

	update_option( 'sm_decorative_titles_style', $original_style );
}

if ( ! defined( 'ABSPATH' ) ) {
	anima_fail_hive_title_style_test( 'This script must run through wp eval-file.' );
}

$original_style = get_option( 'sm_decorative_titles_style', null );

$config = apply_filters( 'style_manager/filter_fields', [] );
$field  = $config['sections']['style_manager_section']['options']['sm_decorative_titles_style'] ?? null;

if ( ! is_array( $field ) ) {
	anima_restore_hive_title_style_option( $original_style );
	anima_fail_hive_title_style_test( 'Expected the Style Manager config to expose the post title styling field.' );
}

if ( 'sm_toggle' !== ( $field['type'] ?? '' ) ) {
	anima_restore_hive_title_style_option( $original_style );
	anima_fail_hive_title_style_test( 'Expected the post title styling field to be rendered as an sm_toggle control.' );
}

if ( 'sm_decorative_titles_style' !== ( $field['setting_id'] ?? '' ) ) {
	anima_restore_hive_title_style_option( $original_style );
	anima_fail_hive_title_style_test( 'Expected the post title styling field to keep using the shared sm_decorative_titles_style option.' );
}

if ( 'Auto-style post titles' !== ( $field['label'] ?? '' ) ) {
	anima_restore_hive_title_style_option( $original_style );
	anima_fail_hive_title_style_test( 'Expected the LT-facing post title styling label.' );
}

if ( 'Apply Hive-inspired emphasis to post titles and supported collection card titles based on punctuation and letter case.' !== ( $field['desc'] ?? '' ) ) {
	anima_restore_hive_title_style_option( $original_style );
	anima_fail_hive_title_style_test( 'Expected the LT-facing post title styling description.' );
}

if ( false !== ( $field['default'] ?? null ) ) {
	anima_restore_hive_title_style_option( $original_style );
	anima_fail_hive_title_style_test( 'Expected automatic post title styling to default to disabled.' );
}

if ( ! function_exists( 'anima_maybe_migrate_post_title_styling_option' ) ) {
	anima_restore_hive_title_style_option( $original_style );
	anima_fail_hive_title_style_test( 'Expected Anima to expose the post title styling migration helper.' );
}

update_option( 'sm_decorative_titles_style', 'hive' );
anima_maybe_migrate_post_title_styling_option();

if ( 'hive' === get_option( 'sm_decorative_titles_style', null ) ) {
	anima_restore_hive_title_style_option( $original_style );
	anima_fail_hive_title_style_test( 'Expected the legacy Hive option value to be normalized for the LT toggle.' );
}

update_option( 'sm_decorative_titles_style', 'underline' );
anima_maybe_migrate_post_title_styling_option();

if ( 'underline' === get_option( 'sm_decorative_titles_style', null ) ) {
	anima_restore_hive_title_style_option( $original_style );
	anima_fail_hive_title_style_test( 'Expected legacy underline values to be normalized away for the LT toggle.' );
}

if ( ! function_exists( 'anima_get_hive_styled_title_markup' ) ) {
	anima_restore_hive_title_style_option( $original_style );
	anima_fail_hive_title_style_test( 'Expected Anima to expose the Hive title styling parser.' );
}

$styled_question_title = anima_get_hive_styled_title_markup( 'Question? Answer' );

if ( '<b>Question?</b><i> Answer</i>' !== $styled_question_title ) {
	anima_restore_hive_title_style_option( $original_style );
	anima_fail_hive_title_style_test( 'Expected the Hive parser to bold the left side of ? titles and italicize the right side.' );
}

$styled_colon_title = anima_get_hive_styled_title_markup( 'Wait: really?' );

if ( '<b>Wait:</b><i> really?</i>' !== $styled_colon_title ) {
	anima_restore_hive_title_style_option( $original_style );
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
	anima_restore_hive_title_style_option( $original_style );
	anima_fail_hive_title_style_test( 'Failed to create the temporary post.' );
}

$GLOBALS['post'] = get_post( $post_id );
setup_postdata( $GLOBALS['post'] );

$post_title_markup = '<h1 class="wp-block-post-title"><a href="https://example.com/question-answer">Question? Answer</a></h1>';
$card_markup       = '<article class="nb-supernova-item"><h3 class="nb-card__title has-medium-font-size"><a href="https://example.com/question-answer">Question? Answer</a></h3></article>';

if ( ! function_exists( 'anima_apply_hive_decorative_style_to_post_title_block' ) ) {
	wp_reset_postdata();
	wp_delete_post( $post_id, true );
	anima_restore_hive_title_style_option( $original_style );
	anima_fail_hive_title_style_test( 'Expected Anima to expose the core/post-title render hook entrypoint.' );
}

if ( ! function_exists( 'anima_apply_hive_decorative_style_to_collection_card_markup' ) ) {
	wp_reset_postdata();
	wp_delete_post( $post_id, true );
	anima_restore_hive_title_style_option( $original_style );
	anima_fail_hive_title_style_test( 'Expected Anima to expose the Nova Blocks collection card entrypoint.' );
}

update_option( 'sm_decorative_titles_style', false );
$unchanged_post_title_markup = anima_apply_hive_decorative_style_to_post_title_block( $post_title_markup, [] );
$unchanged_card_markup       = anima_apply_hive_decorative_style_to_collection_card_markup( $card_markup, get_post( $post_id ), [] );

if ( $post_title_markup !== $unchanged_post_title_markup || $card_markup !== $unchanged_card_markup ) {
	wp_reset_postdata();
	wp_delete_post( $post_id, true );
	anima_restore_hive_title_style_option( $original_style );
	anima_fail_hive_title_style_test( 'Expected disabled automatic post title styling to leave title markup unchanged.' );
}

update_option( 'sm_decorative_titles_style', true );
$filtered_post_title_markup = anima_apply_hive_decorative_style_to_post_title_block( $post_title_markup, [] );
$filtered_card_markup       = anima_apply_hive_decorative_style_to_collection_card_markup( $card_markup, get_post( $post_id ), [] );

if ( false === strpos( $filtered_post_title_markup, '<b>Question?</b><i> Answer</i>' ) ) {
	wp_reset_postdata();
	wp_delete_post( $post_id, true );
	anima_restore_hive_title_style_option( $original_style );
	anima_fail_hive_title_style_test( 'Expected the core/post-title entrypoint to inject the Hive title markup when the toggle is enabled.' );
}

if ( false === strpos( $filtered_card_markup, '<b>Question?</b><i> Answer</i>' ) ) {
	wp_reset_postdata();
	wp_delete_post( $post_id, true );
	anima_restore_hive_title_style_option( $original_style );
	anima_fail_hive_title_style_test( 'Expected the Nova Blocks collection card entrypoint to inject the Hive title markup when the toggle is enabled.' );
}

wp_reset_postdata();
wp_delete_post( $post_id, true );
anima_restore_hive_title_style_option( $original_style );

echo "hive title style contract ok\n";
