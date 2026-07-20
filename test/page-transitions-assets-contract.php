<?php
/**
 * Contract test for keeping saved page transitions dormant without their assets.
 */

define( 'ABSPATH', __DIR__ . '/' );

$GLOBALS['anima_test_page_transitions_option']     = '1';
$GLOBALS['anima_test_page_transitions_registered'] = false;

function add_action() {}
function add_filter() {}
function is_customize_preview() {
	return false;
}
function apply_filters( $hook, $value ) {
	return $value;
}
function get_option( $key, $default = false ) {
	if ( 'sm_page_transitions_enable' === $key ) {
		return $GLOBALS['anima_test_page_transitions_option'];
	}

	return $default;
}
function pixelgrade_option( $key, $default = false ) {
	return $default;
}
function wp_script_is( $handle, $status = 'enqueued' ) {
	return 'anima-page-transitions' === $handle
		&& 'registered' === $status
		&& $GLOBALS['anima_test_page_transitions_registered'];
}

require_once dirname( __DIR__ ) . '/inc/integrations/page-transitions.php';

if ( anima_page_transitions_enabled() ) {
	fwrite( STDERR, "Saved page transitions must stay dormant when their runtime script is unavailable.\n" );
	exit( 1 );
}

$GLOBALS['anima_test_page_transitions_registered'] = true;

if ( ! anima_page_transitions_enabled() ) {
	fwrite( STDERR, "Saved page transitions must activate when their runtime script is registered.\n" );
	exit( 1 );
}

$GLOBALS['anima_test_page_transitions_option'] = '0';

if ( anima_page_transitions_enabled() ) {
	fwrite( STDERR, "Available runtime assets must not override a disabled page-transition setting.\n" );
	exit( 1 );
}

echo "page transitions assets contract ok\n";
