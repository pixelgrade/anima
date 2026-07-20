<?php
/**
 * Verifies the legacy Pixelgrade Assistant activation URL contract.
 *
 * Run from the theme root:
 * php test/pixelgrade-assistant-notice-compatibility.php
 */

define( 'ABSPATH', __DIR__ . '/' );
define( 'WP_PLUGIN_DIR', __DIR__ . '/fixtures/plugins' );

$anima_localized_notice_data = [];
$anima_nonce_action          = '';

function wp_enqueue_script() {}

function wp_register_script() {}

function wp_normalize_path( $path ) {
	return str_replace( '\\', '/', $path );
}

function trailingslashit( $path ) {
	return rtrim( $path, '/' ) . '/';
}

function get_template_directory() {
	return dirname( __DIR__ );
}

function get_parent_theme_file_uri( $path = '' ) {
	return 'https://example.test/wp-content/themes/anima/' . ltrim( $path, '/' );
}

function wp_localize_script( $handle, $name, $data ) {
	global $anima_localized_notice_data;
	$anima_localized_notice_data = $data;
}

function admin_url( $path = '' ) {
	return 'https://example.test/wp-admin/' . ltrim( $path, '/' );
}

function self_admin_url( $path = '' ) {
	return admin_url( $path );
}

function wp_nonce_url( $url, $action ) {
	global $anima_nonce_action;
	$anima_nonce_action = $action;

	return $url . '&_wpnonce=test-nonce';
}

function esc_url( $url ) {
	return $url;
}

function esc_url_raw( $url ) {
	return $url;
}

function esc_html__( $text ) {
	return $text;
}

require_once dirname( __DIR__ ) . '/inc/admin/assistant-notice/class-notice.php';

$reflection = new ReflectionClass( Pixelgrade_Assistant_Install_Notice::class );
$notice     = $reflection->newInstanceWithoutConstructor();
$notice->outputJS();

$expected_url = 'https://example.test/wp-admin/plugins.php?action=activate&plugin=pixelgrade-assistant%2Fpixelgrade-assistant.php&_wpnonce=test-nonce';
$actual_url   = $anima_localized_notice_data['activateUrl'] ?? '';

if (
	$expected_url !== $actual_url
	|| 'activate-plugin_pixelgrade-assistant/pixelgrade-assistant.php' !== $anima_nonce_action
) {
	fwrite( STDERR, "Expected a nonce-protected legacy activation URL.\n" );
	exit( 1 );
}

echo "Pixelgrade Assistant legacy activation URL OK.\n";
