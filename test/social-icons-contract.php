<?php
/**
 * Contract test for the shared social icon registry (#614): the Site Frame
 * detector reads inc/social-icons.json, honours the `menu-item--icon-{slug}`
 * opt-in class, and keeps the monogram as the last fallback.
 *
 * Run with:
 * wp --path=/path/to/site eval-file wp-content/themes/anima/test/social-icons-contract.php
 */

if ( ! defined( 'ABSPATH' ) ) {
	fwrite( STDERR, 'This script must run through wp eval-file.' . PHP_EOL );
	exit( 1 );
}

$GLOBALS['anima_social_failures'] = [];

function anima_social_contract_expect( bool $condition, string $message ): void {
	if ( ! $condition ) {
		$GLOBALS['anima_social_failures'][] = $message;
	}
}

// 1. URL detection comes from the shared registry.
$url_expectations = [
	'https://www.tiktok.com/@pixelgrade'            => 'tiktok',
	'https://www.linkedin.com/company/pixelgrade'   => 'linkedin',
	'https://github.com/pixelgrade'                 => 'github',
	'https://www.threads.net/@pixelgrade'           => 'threads',
	'https://www.threads.com/@pixelgrade'           => 'threads',
	'https://bsky.app/profile/pixelgrade.com'       => 'bluesky',
	'https://wa.me/40700000000'                     => 'whatsapp',
	'https://t.me/pixelgrade'                       => 'telegram',
	'https://discord.gg/abc123'                     => 'discord',
	'https://x.com/pixelgrade'                      => 'x',
	'https://www.x.com/pixelgrade'                  => 'x',
	'https://twitter.com/pixelgrade'                => 'x',
	'https://www.dropbox.com/s/abc'                 => 'dropbox',
	'https://Instagram.com/pixelgrade'              => 'instagram',
	'mailto:hello@example.com'                      => 'mail',
	'tel:+40700000000'                              => 'phone',
	'https://example.com/contact/'                  => '',
	'https://ottawa.me/about'                       => '',
	'https://netflix.com/title/1'                   => '',
	'https://mastodon.social/@pixelgrade'           => '',
];

foreach ( $url_expectations as $url => $slug ) {
	$actual = anima_get_social_icon_slug_for_url( $url );
	anima_social_contract_expect( $slug === $actual, sprintf( 'Expected %s to resolve to "%s", got "%s".', $url, $slug, $actual ) );
	anima_social_contract_expect( ( '' !== $slug ) === anima_site_frame_is_social_url( $url ), sprintf( 'anima_site_frame_is_social_url() disagrees with the registry for %s.', $url ) );
}

// 2. The PHP registry is the JSON file the Sass build reads.
$registry = anima_get_social_icons();
$json     = json_decode( (string) file_get_contents( get_template_directory() . '/inc/social-icons.json' ), true );
anima_social_contract_expect( array_column( $json['icons'], 'slug' ) === array_keys( $registry ), 'Expected the PHP registry to mirror inc/social-icons.json in order.' );

// 3. Menu item classification: the opt-in class wins, unknown classes fall back.
function anima_social_contract_item( string $title, string $url, array $classes = [] ): WP_Post {
	return new WP_Post(
		(object) [
			'ID'      => 0,
			'title'   => $title,
			'url'     => $url,
			'type'    => 'custom',
			'classes' => $classes,
		]
	);
}

$item_expectations = [
	[ anima_social_contract_item( 'Contact', 'https://example.com/contact/', [ 'menu-item--icon-mail' ] ), 'mail', 'social' ],
	[ anima_social_contract_item( 'Mastodon', 'https://mastodon.social/@pg', [ 'menu-item--icon-mastodon' ] ), 'mastodon', 'social' ],
	[ anima_social_contract_item( 'Feed', 'https://x.com/pg', [ 'menu-item--icon-rss' ] ), 'rss', 'social' ],
	[ anima_social_contract_item( 'TikTok', 'https://www.tiktok.com/@pg' ), 'tiktok', 'social' ],
	[ anima_social_contract_item( 'Shop', 'https://example.com/shop/', [ 'menu-item--icon-unknown' ] ), '', 'regular' ],
	[ anima_social_contract_item( 'Read', 'https://example.com/read/' ), '', 'regular' ],
];

foreach ( $item_expectations as [ $item, $slug, $kind ] ) {
	$actual_slug = anima_get_menu_item_social_icon( $item );
	anima_social_contract_expect( $slug === $actual_slug, sprintf( 'Expected "%s" to use icon "%s", got "%s".', $item->title, $slug, $actual_slug ) );
	anima_social_contract_expect( $kind === anima_site_frame_get_item_kind( $item ), sprintf( 'Expected "%s" to be a %s Site Frame item.', $item->title, $kind ) );
}

// 4. Rendered Site Frame rail: icons instead of monograms, monogram as fallback.
$original_style     = get_option( 'sm_site_frame_style', null );
$original_locations = get_theme_mod( 'nav_menu_locations', null );
$menu_id            = wp_create_nav_menu( 'Social Icons Contract Menu ' . wp_generate_password( 6, false ) );

$menu_items = [
	[ 'TikTok', 'https://www.tiktok.com/@pixelgrade', '' ],
	[ 'Contact', home_url( '/contact/' ), 'menu-item--icon-mail' ],
	[ 'Read', home_url( '/read/' ), '' ],
];

foreach ( $menu_items as [ $title, $url, $classes ] ) {
	wp_update_nav_menu_item(
		$menu_id,
		0,
		[
			'menu-item-title'   => $title,
			'menu-item-url'     => $url,
			'menu-item-status'  => 'publish',
			'menu-item-classes' => $classes,
		]
	);
}

set_theme_mod( 'nav_menu_locations', array_merge( is_array( $original_locations ) ? $original_locations : [], [ 'site-frame' => (int) $menu_id ] ) );
update_option( 'sm_site_frame_style', 'editorial' );

ob_start();
do_action( 'anima/template_html:before', 'main' );
$output = (string) ob_get_clean();

wp_delete_nav_menu( $menu_id );
if ( null === $original_locations ) {
	remove_theme_mod( 'nav_menu_locations' );
} else {
	set_theme_mod( 'nav_menu_locations', $original_locations );
}
if ( null === $original_style ) {
	delete_option( 'sm_site_frame_style' );
} else {
	update_option( 'sm_site_frame_style', $original_style );
}

if ( '' === $output ) {
	anima_social_contract_expect( false, 'Expected the Site Frame shell to render (is Style Manager active?).' );
} else {
	preg_match_all( '/<li[^>]*class="([^"]*)"[^>]*>(.*?)<\/li>/s', $output, $matches, PREG_SET_ORDER );
	$rendered = [];
	foreach ( $matches as $match ) {
		$rendered[ trim( wp_strip_all_tags( $match[2] ) ) ] = $match;
	}

	foreach ( [ 'TikTok', 'Contact' ] as $label ) {
		anima_social_contract_expect( isset( $rendered[ $label ] ) && false !== strpos( $rendered[ $label ][1], 'social-menu-item' ), "Expected the {$label} rail item to be a social icon item." );
		anima_social_contract_expect( isset( $rendered[ $label ] ) && false === strpos( $rendered[ $label ][2], 'menu-item-monogram' ), "Expected no monogram on the {$label} rail item." );
	}

	anima_social_contract_expect( isset( $rendered['RRead'] ) && false !== strpos( $rendered['RRead'][2], 'menu-item-monogram' ), 'Expected the regular Read item to keep its monogram fallback.' );
}

// wp eval-file runs this file inside a function, so failures live in $GLOBALS.
if ( $GLOBALS['anima_social_failures'] ) {
	fwrite( STDERR, implode( PHP_EOL, $GLOBALS['anima_social_failures'] ) . PHP_EOL );
	exit( 1 );
}

echo "social icons contract ok\n";
