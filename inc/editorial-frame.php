<?php
/**
 * Editorial Frame runtime helpers.
 *
 * @package Anima
 */

// If this file is called directly, abort.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Get the active Editorial Frame preset slug.
 *
 * @return string
 */
function anima_get_editorial_frame_preset(): string {
	return sanitize_key( (string) get_option( 'sm_chrome_preset', 'none' ) );
}

/**
 * Determine whether the Editorial Frame preset is active.
 *
 * @return bool
 */
function anima_is_editorial_frame_enabled(): bool {
	return 'editorial-frame' === anima_get_editorial_frame_preset();
}

/**
 * Determine whether the frame accents should render.
 *
 * @return bool
 */
function anima_is_editorial_frame_frame_enabled(): bool {
	return anima_is_editorial_frame_enabled();
}

/**
 * Determine whether the Chrome menu has assigned content.
 *
 * @return bool
 */
function anima_editorial_frame_has_menu(): bool {
	return has_nav_menu( 'chrome' );
}

/**
 * Determine whether the Chrome menu should render.
 *
 * @return bool
 */
function anima_is_editorial_frame_menu_enabled(): bool {
	return anima_is_editorial_frame_enabled()
		&& anima_editorial_frame_has_menu();
}

/**
 * Get the Chrome palette ID — the Style Manager palette the chrome should
 * scope itself to. Defaults to the site's primary (first) palette when the
 * option hasn't been set or the saved palette no longer exists.
 *
 * @return string
 */
function anima_get_editorial_frame_palette(): string {
	$saved = sanitize_text_field( (string) get_option( 'sm_chrome_palette', '' ) );

	if ( function_exists( 'sm_get_saved_palettes' ) ) {
		$valid_ids = [];
		foreach ( sm_get_saved_palettes() as $palette ) {
			if ( is_object( $palette ) && ! empty( $palette->id ) ) {
				$valid_ids[] = (string) $palette->id;
			}
		}

		if ( $saved !== '' && in_array( $saved, $valid_ids, true ) ) {
			return $saved;
		}

		if ( ! empty( $valid_ids ) ) {
			return $valid_ids[0];
		}
	}

	return $saved !== '' ? $saved : '1';
}

/**
 * Get the active Chrome color signal slug.
 *
 * @return string
 */
function anima_get_editorial_frame_signal(): string {
	$signal = sanitize_key( (string) get_option( 'sm_chrome_signal', 'high' ) );

	if ( ! in_array( $signal, [ 'low', 'medium', 'high' ], true ) ) {
		return 'high';
	}

	return $signal;
}

/**
 * Map the Chrome color signal slug to its Style Manager palette variation
 * (1-12) using the same default signals array Nova Blocks blocks use
 * (`[1, 3, 8, 11]`).
 *
 * @return int
 */
function anima_get_editorial_frame_signal_variation(): int {
	switch ( anima_get_editorial_frame_signal() ) {
		case 'low':
			return 3;
		case 'medium':
			return 8;
		case 'high':
		default:
			return 11;
	}
}

/**
 * Map the Chrome color signal slug to its 0-3 index (Nova Blocks color
 * signal class suffix).
 *
 * @return int
 */
function anima_get_editorial_frame_signal_index(): int {
	switch ( anima_get_editorial_frame_signal() ) {
		case 'low':
			return 1;
		case 'medium':
			return 2;
		case 'high':
		default:
			return 3;
	}
}

/**
 * Expose Editorial Frame state through body classes. Chrome palette and
 * variation classes are scoped to the frame wrapper (not the body) so they
 * don't leak into the main content; the body only carries the presence
 * flags the rest of the theme keys off.
 *
 * @param string[] $classes Existing body classes.
 * @return string[]
 */
function anima_editorial_frame_body_class( array $classes ): array {
	if ( ! anima_is_editorial_frame_enabled() ) {
		return $classes;
	}

	$classes[] = 'has-editorial-frame';

	if ( anima_is_editorial_frame_menu_enabled() ) {
		$classes[] = 'has-editorial-frame-menu';
	}

	if ( anima_is_editorial_frame_frame_enabled() ) {
		$classes[] = 'has-editorial-frame-frame';
	}

	return $classes;
}
add_filter( 'body_class', 'anima_editorial_frame_body_class' );

/**
 * Determine whether the current nav menu args target the Chrome menu location.
 *
 * @param mixed $args Menu args.
 * @return bool
 */
function anima_is_editorial_frame_chrome_menu_args( $args ): bool {
	return is_object( $args ) && 'chrome' === ( $args->theme_location ?? '' );
}

/**
 * Determine whether a menu item URL should receive social styling.
 *
 * @param string $url Menu item URL.
 * @return bool
 */
function anima_editorial_frame_is_social_url( string $url ): bool {
	$social_fragments = [
		'facebook',
		'instagram',
		'youtube',
		'pinterest',
		'dropbox',
		'flickr',
		'tumblr',
		'apple',
		'dribbble',
		'skype',
		'foursquare',
		'vk',
		'reddit',
		'stumbleupon',
		'delicious',
		'digg',
		'behance',
		'spotify',
		'deviantart',
		'soundcloud',
		'codepen',
		'slideshare',
		'twitch',
		'yelp',
		'medium',
		'tripadvisor',
		'pocket.com',
		'500px',
		'amazon',
		'vimeo',
		'snapchat',
		'bandcamp',
		'etsy',
		'meetup',
		'tel:',
		'mailto:',
		'feed',
		'twitter.com',
		'x.com',
	];

	foreach ( $social_fragments as $fragment ) {
		if ( false !== stripos( $url, $fragment ) ) {
			return true;
		}
	}

	return false;
}

/**
 * Classify a Chrome menu item.
 *
 * @param WP_Post $item Menu item.
 * @return string
 */
function anima_editorial_frame_get_item_kind( WP_Post $item ): string {
	$classes = array_filter( array_map( 'sanitize_html_class', (array) $item->classes ) );
	$extra_classes = [
		'menu-item--search',
		'menu-item--dark-mode',
		'menu-item--cart',
	];

	if ( 'custom-pxg' === $item->type || array_intersect( $extra_classes, $classes ) ) {
		return 'extra';
	}

	if ( in_array( 'social-menu-item', $classes, true ) || anima_editorial_frame_is_social_url( (string) $item->url ) ) {
		return 'social';
	}

	return 'regular';
}

/**
 * Resolve the decorative monogram for a regular Chrome menu item.
 *
 * @param WP_Post $item Menu item.
 * @return string
 */
function anima_get_editorial_frame_menu_item_monogram( WP_Post $item ): string {
	$label = trim( wp_strip_all_tags( (string) $item->title ) );

	if ( '' === $label ) {
		return '';
	}

	if ( preg_match( '/[\p{L}\p{N}]/u', $label, $matches ) ) {
		$character = $matches[0];
	} else {
		$character = substr( $label, 0, 1 );
	}

	if ( function_exists( 'mb_strtoupper' ) ) {
		return mb_strtoupper( $character );
	}

	return strtoupper( $character );
}

/**
 * Add Chrome-specific menu item classes.
 *
 * @param string[] $classes Existing menu item classes.
 * @param WP_Post  $item    Menu item.
 * @param stdClass $args    Nav menu args.
 * @param int      $depth   Menu depth.
 * @return string[]
 */
function anima_editorial_frame_nav_menu_css_class( array $classes, WP_Post $item, $args, int $depth ): array {
	unset( $depth );

	if ( ! anima_is_editorial_frame_chrome_menu_args( $args ) ) {
		return $classes;
	}

	$classes = array_values( array_diff( $classes, [ 'icon-only' ] ) );
	$classes[] = 'menu-item--editorial-frame';
	$item_kind = anima_editorial_frame_get_item_kind( $item );

	if ( 'social' === $item_kind ) {
		$classes[] = 'social-menu-item';
	}

	if ( in_array( 'menu-item--search', $classes, true ) ) {
		$classes[] = 'nav__item--search';
	}

	if ( 'regular' === $item_kind ) {
		$classes[] = 'menu-item--editorial-frame-link';
	}

	return array_values( array_unique( array_filter( $classes ) ) );
}
add_filter( 'nav_menu_css_class', 'anima_editorial_frame_nav_menu_css_class', 20, 4 );

/**
 * Prepend a decorative monogram to regular Chrome menu items.
 *
 * @param string  $title Menu item title HTML.
 * @param WP_Post $item  Menu item.
 * @param mixed   $args  Nav menu args.
 * @param int     $depth Menu depth.
 * @return string
 */
function anima_editorial_frame_nav_menu_item_title( string $title, WP_Post $item, $args, int $depth ): string {
	unset( $depth );

	if ( ! anima_is_editorial_frame_chrome_menu_args( $args ) ) {
		return $title;
	}

	$label = '<span class="c-editorial-frame__label">' . $title . '</span>';

	if ( 'regular' !== anima_editorial_frame_get_item_kind( $item ) ) {
		return $label;
	}

	if ( in_array( 'menu-item--monogram-off', (array) $item->classes, true ) ) {
		return $label;
	}

	$monogram = anima_get_editorial_frame_menu_item_monogram( $item );

	if ( '' === $monogram ) {
		return $label;
	}

	return '<span class="menu-item-monogram" aria-hidden="true">' . esc_html( $monogram ) . '</span>' . $label;
}
add_filter( 'nav_menu_item_title', 'anima_editorial_frame_nav_menu_item_title', 20, 4 );

/**
 * Render the Editorial Frame shell around the FSE template canvas.
 *
 * @return void
 */
function anima_render_editorial_frame_shell(): void {
	if ( ! anima_is_editorial_frame_enabled() ) {
		return;
	}

	$has_menu  = anima_is_editorial_frame_menu_enabled();
	$has_frame = anima_is_editorial_frame_frame_enabled();

	if ( ! $has_menu && ! $has_frame ) {
		return;
	}

	$shell_classes = [
		'c-editorial-frame',
		'sm-palette-' . sanitize_html_class( anima_get_editorial_frame_palette() ),
		'sm-variation-' . anima_get_editorial_frame_signal_variation(),
		'sm-color-signal-' . anima_get_editorial_frame_signal_index(),
	];
	?>
	<div class="<?php echo esc_attr( implode( ' ', $shell_classes ) ); ?>">
		<?php if ( $has_frame ) : ?>
			<span class="c-editorial-frame__top" aria-hidden="true"></span>
			<span class="c-editorial-frame__left" aria-hidden="true"></span>
		<?php endif; ?>

		<?php if ( $has_menu ) : ?>
			<aside class="c-editorial-frame__rail toolbar">
				<div class="c-editorial-frame__head toolbar__head">
					<?php
					wp_nav_menu(
						[
							'theme_location'       => 'chrome',
							'container'            => 'nav',
							'container_class'      => 'c-editorial-frame__navigation toolbar-navigation',
							'container_aria_label' => esc_attr__( 'Chrome Menu', '__theme_txtd' ),
							'menu_class'           => 'menu c-editorial-frame__menu nav nav--toolbar',
							'fallback_cb'          => false,
							'depth'                => 2,
						]
					);
					?>
				</div>
			</aside>
		<?php endif; ?>
	</div>
	<?php
}
add_action( 'anima/template_html:before', 'anima_render_editorial_frame_shell', 100 );
