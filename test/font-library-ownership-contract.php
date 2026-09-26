<?php
/**
 * Contract: the WordPress Font Library stays enabled (pixelgrade/anima#379).
 *
 * Fonts installed through the core Font Library are a Style Manager font
 * source (pixelgrade/style-manager#57), so Anima no longer hard-disables the
 * library while Style Manager is active. Style Manager keeps block-level font
 * family pickers out of the way, so it stays the one place fonts are chosen.
 *
 * - `block_editor_settings_all` never forces `fontLibraryEnabled` off, with or
 *   without Style Manager, while it still strips the core preset styles when
 *   Style Manager owns the design system.
 * - The Site Editor Styles handoff links to Appearance > Fonts when this
 *   WordPress has the standalone Fonts screen (7.0+), and omits the card
 *   otherwise.
 *
 * Run from the theme root:
 * php test/font-library-ownership-contract.php
 */

$wp_root = sys_get_temp_dir() . '/anima-font-library-contract-' . getmypid() . '/';
@mkdir( $wp_root . 'wp-admin', 0777, true );
define( 'ABSPATH', $wp_root );

$GLOBALS['anima_test_filters']   = [];
$GLOBALS['anima_test_localized'] = [];
$GLOBALS['anima_test_sm_active'] = false;

function add_filter( $hook, $callback, $priority = 10, $accepted_args = 1 ) {
	$GLOBALS['anima_test_filters'][ $hook ][] = $callback;
	return true;
}

function add_action( $hook, $callback, $priority = 10, $accepted_args = 1 ) {
	return add_filter( $hook, $callback, $priority, $accepted_args );
}

function esc_html__( $text, $domain = 'default' ) {
	return $text;
}

function esc_url_raw( $url ) {
	return $url;
}

function esc_url( $url ) {
	return $url;
}

function admin_url( $path = '' ) {
	return 'https://example.test/wp-admin/' . $path;
}

function wp_customize_url() {
	return 'https://example.test/wp-admin/customize.php';
}

function add_query_arg( $args, $url ) {
	return $url . '?' . http_build_query( $args );
}

function get_template() {
	return 'anima';
}

function get_template_directory_uri() {
	return 'https://example.test/wp-content/themes/anima';
}

function trailingslashit( $value ) {
	return rtrim( $value, '/' ) . '/';
}

function wp_get_theme( $stylesheet = null ) {
	return new class() {
		public function get( $header ) {
			return '0.0.0-test';
		}
	};
}

function get_current_screen() {
	return (object) [ 'id' => 'site-editor' ];
}

function wp_enqueue_script( ...$args ) {}

function wp_localize_script( $handle, $name, $data ) {
	$GLOBALS['anima_test_localized'][ $handle ] = $data;
	return true;
}

function current_user_can( $capability ) {
	return true;
}

function self_admin_url( $path = '' ) {
	return admin_url( $path );
}

require_once dirname( __DIR__ ) . '/inc/block-editor.php';

$failures = [];
$check    = static function ( string $label, bool $ok ) use ( &$failures ) {
	if ( ! $ok ) {
		$failures[] = $label;
	}
};

// -----------------------------------------------------------------------------
// The editor settings never switch the Font Library off.
// -----------------------------------------------------------------------------

$settings_filter = $GLOBALS['anima_test_filters']['block_editor_settings_all'][0] ?? null;
$check( 'block_editor_settings_all is filtered by Anima', is_callable( $settings_filter ) );

$context = (object) [ 'name' => 'core/edit-site' ];
$input   = [
	'fontLibraryEnabled' => true,
	'styles'             => [
		[ 'css' => 'preset', '__unstableType' => 'presets' ],
		[ 'css' => 'theme', '__unstableType' => 'theme' ],
	],
];

// Without Style Manager (the WordPress.org build).
$bare = $settings_filter( $input, $context );
$check( 'Font Library stays enabled without Style Manager', true === $bare['fontLibraryEnabled'] );

// With Style Manager active.
eval( 'namespace Pixelgrade\\StyleManager; class Plugin {}' );
$owned = $settings_filter( $input, $context );
$check( 'Font Library stays enabled while Style Manager is active', true === ( $owned['fontLibraryEnabled'] ?? null ) );
$check( 'Style Manager still owns the preset styles', [ 'theme' ] === array_column( $owned['styles'], 'css' ) );

// -----------------------------------------------------------------------------
// theme.json does not switch it off either.
// -----------------------------------------------------------------------------

$theme_json = json_decode( (string) file_get_contents( dirname( __DIR__ ) . '/theme.json' ), true );
$check( 'theme.json does not set typography.fontLibrary to false', false !== ( $theme_json['settings']['typography']['fontLibrary'] ?? null ) );
$check( 'theme.json keeps no theme font family presets (Style Manager owns them)', [] === ( $theme_json['settings']['typography']['fontFamilies'] ?? null ) );

// -----------------------------------------------------------------------------
// The Styles handoff reaches the Font Library.
// -----------------------------------------------------------------------------

$find_fonts_card = static function () {
	anima_enqueue_site_editor_style_manager_assets();
	$resources = $GLOBALS['anima_test_localized']['anima-site-editor-style-manager']['resources'] ?? [];
	$check     = array_values( array_filter( $resources, static function ( $resource ) {
		return is_array( $resource ) && str_ends_with( (string) $resource['url'], 'wp-admin/font-library.php' );
	} ) );

	return [ $resources, $check ];
};

[ $resources, $cards ] = $find_fonts_card();
$check( 'without a Fonts screen (WordPress < 7.0) the handoff has no Fonts card', 0 === count( $cards ) );
$check( 'the handoff resources stay a clean list', array_keys( $resources ) === range( 0, count( $resources ) - 1 ) );

touch( $wp_root . 'wp-admin/font-library.php' );
[ $resources, $cards ] = $find_fonts_card();
$check( 'with the Fonts screen the handoff links to Appearance > Fonts', 1 === count( $cards ) );

@unlink( $wp_root . 'wp-admin/font-library.php' );
@rmdir( $wp_root . 'wp-admin' );
@rmdir( $wp_root );

if ( $failures ) {
	fwrite( STDERR, "Font Library ownership contract failed:\n - " . implode( "\n - ", $failures ) . "\n" );
	exit( 1 );
}

echo "Font Library ownership contract OK\n";
