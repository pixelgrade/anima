<?php
/**
 * Frontend menu filters must tolerate WPML's synthetic, non-WP_Post items.
 * Run: php test/synthetic-menu-items.php
 */
define( 'ABSPATH', __DIR__ );
$filters = [];
function add_action( ...$args ) {}
function add_filter( $hook, $callback, $priority = 10, $accepted_args = 1 ) {
	global $filters;
	$filters[ $hook ][ $priority ][] = [ $callback, $accepted_args ];
}
function apply_filters( $hook, $value, ...$args ) {
	global $filters;
	$callbacks = $filters[ $hook ] ?? [];
	ksort( $callbacks );
	foreach ( $callbacks as $entries ) {
		foreach ( $entries as [ $callback, $accepted_args ] ) {
			$value = $callback( ...array_slice( [ $value, ...$args ], 0, $accepted_args ) );
		}
	}
	return $value;
}
function esc_html( $value ) { return htmlspecialchars( $value, ENT_QUOTES, 'UTF-8' ); }
function esc_html__( $value, $domain ) { return esc_html( $value ); }
function wp_strip_all_tags( $value ) { return strip_tags( $value ); }
function wp_kses_post( $value ) { return strip_tags( $value, '<em><strong>' ); }
function sanitize_html_class( $value ) { return preg_replace( '/[^a-zA-Z0-9_-]/', '', $value ); }
function get_template_directory() { return dirname( __DIR__ ); }
class WP_Post {
	public $classes = [];
	public $type = 'custom';
	public $title = 'About';
	public $url = 'https://example.com/about';
	public $description = '';
	public $badge = '';
}
// Intentionally not derived from WP_Post; its markup belongs to WPML.
class WPML_LS_Menu_Item {
	public $classes = [ 'menu-item', 'wpml-ls-item', 'icon-only' ];
	public $title = '<img src="flag.png" alt=""> English';
}
require dirname( __DIR__ ) . '/inc/social-icons.php';
require dirname( __DIR__ ) . '/inc/site-frame.php';
require dirname( __DIR__ ) . '/inc/extras.php';
require dirname( __DIR__ ) . '/inc/admin/class-admin-nav-menus.php';

$failures = [];
$checks = 0;
function check( $label, $expected, $callback ) {
	global $failures, $checks;
	$checks++;
	try {
		$actual = $callback();
		if ( $expected !== $actual ) {
			$failures[] = $label . ': unexpected result ' . var_export( $actual, true );
		}
	} catch ( Throwable $error ) {
		$failures[] = $label . ': ' . $error->getMessage();
	}
}
set_error_handler( function ( $severity, $message, $file, $line ) {
	throw new ErrorException( $message, 0, $severity, $file, $line );
} );
$synthetic = new WPML_LS_Menu_Item();
foreach ( [ 'primary', 'secondary', 'footer', 'site-frame' ] as $location ) {
	$args = (object) [ 'theme_location' => $location ];
	check( "WPML classes in $location", $synthetic->classes, function () use ( $synthetic, $args ) {
		return apply_filters( 'nav_menu_css_class', $synthetic->classes, $synthetic, $args, 0 );
	} );
	check( "WPML title in $location", $synthetic->title, function () use ( $synthetic, $args ) {
		return apply_filters( 'nav_menu_item_title', $synthetic->title, $synthetic, $args, 0 );
	} );
	check( "WPML Site Frame title callback in $location", $synthetic->title, function () use ( $synthetic, $args ) {
		return anima_site_frame_nav_menu_item_title( $synthetic->title, $synthetic, $args, 0 );
	} );
	check( "WPML description in $location", '<a>English</a>', function () use ( $synthetic, $args ) {
		return apply_filters( 'walker_nav_menu_start_el', '<a>English</a>', $synthetic, 1, $args );
	} );
}
$item = new WP_Post();
$frame_args = (object) [ 'theme_location' => 'site-frame' ];
$primary_args = (object) [ 'theme_location' => 'primary' ];
check( 'regular Site Frame classes', [ 'menu-item', 'menu-item--site-frame', 'menu-item--site-frame-link' ], function () use ( $item, $frame_args ) {
	return apply_filters( 'nav_menu_css_class', [ 'menu-item', 'icon-only' ], $item, $frame_args, 0 );
} );
check( 'regular Site Frame monogram', '<span class="menu-item-monogram" aria-hidden="true">A</span><span class="c-site-frame__label">About</span>', function () use ( $item, $frame_args ) {
	return apply_filters( 'nav_menu_item_title', 'About', $item, $frame_args, 0 );
} );
check( 'ordinary menu classes', [ 'menu-item', 'icon-only' ], function () use ( $item, $primary_args ) {
	return apply_filters( 'nav_menu_css_class', [ 'menu-item', 'icon-only' ], $item, $primary_args, 0 );
} );
check( 'ordinary menu title', 'About', function () use ( $item, $primary_args ) {
	return apply_filters( 'nav_menu_item_title', 'About', $item, $primary_args, 0 );
} );
$item->badge = '<New>';
check( 'badge remains escaped', 'About<span class="menu-item-label">&lt;New&gt;</span>', function () use ( $item, $primary_args ) {
	return apply_filters( 'nav_menu_item_title', 'About', $item, $primary_args, 0 );
} );
$item->description = '<em>More</em><script>bad</script>';
check( 'nested primary description remains sanitized', '<a>About<span class="menu-description"><em>More</em>bad</span></a>', function () use ( $item, $primary_args ) {
	return apply_filters( 'walker_nav_menu_start_el', '<a>About</a>', $item, 1, $primary_args );
} );
$item->badge = '';
$item->classes = [ 'menu-item--monogram-off' ];
check( 'monogram can still be disabled', '<span class="c-site-frame__label">About</span>', function () use ( $item, $frame_args ) {
	return apply_filters( 'nav_menu_item_title', 'About', $item, $frame_args, 0 );
} );
$item->classes = [];
$item->url = 'https://instagram.com/pixelgrade';
check( 'social link classification', [ 'menu-item--site-frame', 'social-menu-item' ], function () use ( $item, $frame_args ) {
	return apply_filters( 'nav_menu_css_class', [], $item, $frame_args, 0 );
} );
check( 'social link has no monogram', '<span class="c-site-frame__label">Instagram</span>', function () use ( $item, $frame_args ) {
	return apply_filters( 'nav_menu_item_title', 'Instagram', $item, $frame_args, 0 );
} );
$item->type = 'custom-pxg';
$item->classes = [ 'menu-item--search' ];
check( 'search extra classes', [ 'menu-item--search', 'menu-item--site-frame', 'nav__item--search' ], function () use ( $item, $frame_args ) {
	return apply_filters( 'nav_menu_css_class', $item->classes, $item, $frame_args, 0 );
} );
if ( $failures ) {
	fwrite( STDERR, implode( "\n", $failures ) . "\n" );
	exit( 1 );
}
echo "PASS: $checks menu filter checks\n";
