<?php
/**
 * Shared social icon registry (#614).
 *
 * inc/social-icons.json is the single list of social platforms: the Sass build
 * turns it into dist/css/social-links.css (tasks/lib/social-icons-scss.js) and
 * these helpers read it for PHP-side detection (the Site Frame rail), so the
 * two can't drift.
 *
 * @package Anima
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Get the social icon registry, keyed by slug, in registry order.
 *
 * @return array<string, array{slug: string, match: string[]}>
 */
function anima_get_social_icons(): array {
	static $icons = null;

	if ( null !== $icons ) {
		return $icons;
	}

	$icons = [];
	$file  = get_template_directory() . '/inc/social-icons.json';
	$data  = is_readable( $file ) ? json_decode( (string) file_get_contents( $file ), true ) : null; // phpcs:ignore WordPress.WP.AlternativeFunctions.file_get_contents_file_get_contents

	if ( ! is_array( $data ) || empty( $data['icons'] ) || ! is_array( $data['icons'] ) ) {
		return $icons;
	}

	foreach ( $data['icons'] as $icon ) {
		if ( empty( $icon['slug'] ) || ! is_string( $icon['slug'] ) ) {
			continue;
		}

		$icon['match']          = array_values( array_filter( (array) ( $icon['match'] ?? [] ), 'is_string' ) );
		$icons[ $icon['slug'] ] = $icon;
	}

	return $icons;
}

/**
 * Resolve the icon slug a URL gets from the registry.
 *
 * Mirrors the stylesheet: fragments match case-insensitively and a later
 * registry entry wins when several match.
 *
 * @param string $url Link URL.
 * @return string Icon slug, or an empty string when nothing matches.
 */
function anima_get_social_icon_slug_for_url( string $url ): string {
	$found = '';

	if ( '' === $url ) {
		return $found;
	}

	foreach ( anima_get_social_icons() as $slug => $icon ) {
		foreach ( $icon['match'] as $fragment ) {
			if ( '' !== $fragment && false !== stripos( $url, $fragment ) ) {
				$found = (string) $slug;
				break;
			}
		}
	}

	return $found;
}

/**
 * Resolve the social icon of a menu item.
 *
 * A `menu-item--icon-{slug}` class naming a registry icon wins over URL
 * detection, so any link (an internal Contact page, a Mastodon instance) can
 * carry an icon.
 *
 * @param WP_Post $item Menu item.
 * @return string Icon slug, or an empty string when the item has no icon.
 */
function anima_get_menu_item_social_icon( WP_Post $item ): string {
	$icons = anima_get_social_icons();

	foreach ( (array) $item->classes as $class ) {
		if ( is_string( $class ) && 0 === strpos( $class, 'menu-item--icon-' ) ) {
			$slug = substr( $class, strlen( 'menu-item--icon-' ) );

			if ( isset( $icons[ $slug ] ) ) {
				return $slug;
			}
		}
	}

	return anima_get_social_icon_slug_for_url( (string) $item->url );
}
