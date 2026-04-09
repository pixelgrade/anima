<?php
/**
 * Contract test for bottom post-navigation transition color mapping.
 *
 * Run with:
 * wp eval-file wp-content/themes/anima/test/post-navigation-transition-color.php
 */

function anima_fail_post_navigation_transition_color_test( string $message ): void {
	fwrite( STDERR, $message . PHP_EOL );
	exit( 1 );
}

if ( ! defined( 'ABSPATH' ) ) {
	anima_fail_post_navigation_transition_color_test( 'This script must run through wp eval-file.' );
}

$current_post_id = wp_insert_post(
	[
		'post_title'   => 'Current Navigation Test Post',
		'post_content' => 'Current content',
		'post_status'  => 'publish',
		'post_date'    => '1970-01-01 10:00:00',
		'post_type'    => 'post',
	]
);

$next_post_id = wp_insert_post(
	[
		'post_title'   => 'Next Navigation Test Post',
		'post_content' => 'Next content',
		'post_status'  => 'publish',
		'post_date'    => '1970-01-01 11:00:00',
		'post_type'    => 'post',
	]
);

if ( is_wp_error( $current_post_id ) || empty( $current_post_id ) || is_wp_error( $next_post_id ) || empty( $next_post_id ) ) {
	anima_fail_post_navigation_transition_color_test( 'Failed to create temporary posts.' );
}

update_post_meta( $next_post_id, '_project_color', '#123456' );

$markup = <<<'HTML'
<nav class="navigation post-navigation" aria-label="Post navigation">
	<h2 class="screen-reader-text">Post navigation</h2>
	<div class="nav-links">
		<div class="post-navigation__link post-navigation__link--next">
			<span class="post-navigation__link-label post-navigation__link-label--next">Next article</span>
			<span class="post-navigation__post-title post-navigation__post-title--next">
				<a href="https://example.com/next-post" rel="next">Next Navigation Test Post</a>
			</span>
		</div>
	</div>
</nav>
HTML;

$filtered = anima_add_next_entry_transition_color_to_post_navigation_markup( $markup, $current_post_id );

if ( 1 !== preg_match( '/<a[^>]*data-anima-transition-color="#123456"[^>]*>Next Navigation Test Post<\/a>/', $filtered ) ) {
	wp_delete_post( $current_post_id, true );
	wp_delete_post( $next_post_id, true );
	anima_fail_post_navigation_transition_color_test( 'Expected the next post link to expose the destination transition color.' );
}

$GLOBALS['post'] = get_post( $current_post_id );
setup_postdata( $GLOBALS['post'] );

$filtered_via_render_hook = anima_apply_next_entry_transition_color_to_post_navigation( $markup );

if ( 1 !== preg_match( '/<a[^>]*data-anima-transition-color="#123456"[^>]*>Next Navigation Test Post<\/a>/', $filtered_via_render_hook ) ) {
	wp_reset_postdata();
	wp_delete_post( $current_post_id, true );
	wp_delete_post( $next_post_id, true );
	anima_fail_post_navigation_transition_color_test( 'Expected the render hook entrypoint to use the current render post when the queried object is unavailable.' );
}

wp_reset_postdata();

delete_post_meta( $next_post_id, '_project_color' );
delete_post_meta( $next_post_id, '_project_color_auto' );

$unchanged = anima_add_next_entry_transition_color_to_post_navigation_markup( $markup, $current_post_id );

if ( $unchanged !== $markup ) {
	wp_delete_post( $current_post_id, true );
	wp_delete_post( $next_post_id, true );
	anima_fail_post_navigation_transition_color_test( 'Expected markup without a next-entry color to remain unchanged.' );
}

wp_delete_post( $current_post_id, true );
wp_delete_post( $next_post_id, true );

echo "post navigation transition color contract ok\n";
