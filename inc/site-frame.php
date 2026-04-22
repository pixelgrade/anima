<?php
/**
 * Site Frame runtime helpers.
 *
 * @package Anima
 */

// If this file is called directly, abort.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Migrate beta Site Frame settings that used the internal Chrome naming.
 *
 * @return void
 */
function anima_migrate_site_frame_beta_settings(): void {
	$style = get_option( 'sm_chrome_preset', false );
	if ( false !== $style && false === get_option( 'sm_site_frame_style', false ) ) {
		update_option( 'sm_site_frame_style', 'editorial-frame' === $style ? 'editorial' : $style );
	}

	$option_map = [
		'sm_chrome_palette'   => 'sm_site_frame_palette',
		'sm_chrome_variation' => 'sm_site_frame_variation',
	];

	foreach ( $option_map as $old_option_name => $new_option_name ) {
		$old_value = get_option( $old_option_name, false );
		if ( false !== $old_value && false === get_option( $new_option_name, false ) ) {
			update_option( $new_option_name, $old_value );
		}
	}

	$locations = get_theme_mod( 'nav_menu_locations', [] );
	if ( is_array( $locations ) && isset( $locations['chrome'] ) ) {
		if ( empty( $locations['site-frame'] ) ) {
			$locations['site-frame'] = (int) $locations['chrome'];
		}
		unset( $locations['chrome'] );
		set_theme_mod( 'nav_menu_locations', $locations );
	}

	delete_option( 'sm_chrome_preset' );
	delete_option( 'sm_chrome_palette' );
	delete_option( 'sm_chrome_variation' );
	delete_option( 'sm_chrome_color_role' );
}
add_action( 'after_setup_theme', 'anima_migrate_site_frame_beta_settings', 20 );

/**
 * Get the active Site Frame style slug.
 *
 * @return string
 */
function anima_get_site_frame_style(): string {
	return sanitize_key( (string) get_option( 'sm_site_frame_style', 'none' ) );
}

/**
 * Determine whether the Editorial Site Frame style is active.
 *
 * @return bool
 */
function anima_is_site_frame_enabled(): bool {
	return 'editorial' === anima_get_site_frame_style();
}

/**
 * Determine whether the frame accents should render.
 *
 * @return bool
 */
function anima_is_site_frame_frame_enabled(): bool {
	return anima_is_site_frame_enabled();
}

/**
 * Determine whether the Site Frame menu has assigned content.
 *
 * @return bool
 */
function anima_site_frame_has_menu(): bool {
	return has_nav_menu( 'site-frame' );
}

/**
 * Determine whether the Site Frame menu should render.
 *
 * @return bool
 */
function anima_is_site_frame_menu_enabled(): bool {
	return anima_is_site_frame_enabled()
		&& anima_site_frame_has_menu();
}

/**
 * Get the Site Frame palette ID — the Style Manager palette the site frame should
 * scope itself to. Defaults to the site's primary (first) palette when the
 * option hasn't been set or the saved palette no longer exists.
 *
 * @return string
 */
function anima_get_site_frame_palette(): string {
	$saved = sanitize_text_field( (string) get_option( 'sm_site_frame_palette', '' ) );

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
 * Get the raw Site Frame variation option value — either a 1-12 grade string or
 * the special `accent` keyword that resolves at render time to whichever
 * grade holds the selected palette's brand colour.
 *
 * @return string
 */
function anima_get_site_frame_variation_choice(): string {
	$saved = sanitize_text_field( (string) get_option( 'sm_site_frame_variation', '11' ) );

	if ( 'accent' === $saved ) {
		return 'accent';
	}

	$variation = (int) $saved;
	if ( $variation < 1 || $variation > 12 ) {
		return '11';
	}

	return (string) $variation;
}

/**
 * Get the effective Site Frame palette variation (1-12) after resolving the
 * `accent` shortcut against the selected palette's sourceIndex.
 *
 * Uses the same shift logic as Nova Blocks' getSourceIndexFromPaletteId so
 * the site frame follows the site's Palette Basis Offset when that's in play.
 *
 * @return int
 */
function anima_get_site_frame_variation(): int {
	$choice = anima_get_site_frame_variation_choice();

	if ( 'accent' !== $choice ) {
		return (int) $choice;
	}

	return anima_resolve_site_frame_accent_variation(
		anima_get_site_frame_palette()
	);
}

/**
 * Resolve the 1-12 variation index that corresponds to the brand colour of
 * the given palette, accounting for the site-level Palette Basis Offset.
 *
 * Falls back to 11 when the palette can't be located or Style Manager
 * hasn't loaded — the same default we use when a plain grade is out of
 * range.
 *
 * @param string $palette_id Style Manager palette ID.
 * @return int
 */
function anima_resolve_site_frame_accent_variation( string $palette_id ): int {
	if ( ! function_exists( 'sm_get_saved_palettes' ) ) {
		return 11;
	}

	$site_variation = (int) get_option( 'sm_site_color_variation', 1 );
	if ( $site_variation < 1 ) {
		$site_variation = 1;
	}

	foreach ( sm_get_saved_palettes() as $palette ) {
		if ( ! is_object( $palette ) || ! isset( $palette->id ) ) {
			continue;
		}

		if ( (string) $palette->id !== $palette_id ) {
			continue;
		}

		$source_index = isset( $palette->sourceIndex ) ? (int) $palette->sourceIndex : 3;
		$shifted      = ( ( $source_index - $site_variation + 1 + 12 ) % 12 );

		return $shifted + 1;
	}

	return 11;
}

/**
 * Expose Site Frame state through body classes. Site Frame palette and
 * variation classes are scoped to the frame wrapper (not the body) so they
 * don't leak into the main content; the body only carries the presence
 * flags the rest of the theme keys off.
 *
 * @param string[] $classes Existing body classes.
 * @return string[]
 */
function anima_site_frame_body_class( array $classes ): array {
	if ( ! anima_is_site_frame_enabled() ) {
		return $classes;
	}

	$classes[] = 'has-site-frame';

	if ( anima_is_site_frame_menu_enabled() ) {
		$classes[] = 'has-site-frame-menu';
	}

	if ( anima_is_site_frame_frame_enabled() ) {
		$classes[] = 'has-site-frame-frame';
	}

	return $classes;
}
add_filter( 'body_class', 'anima_site_frame_body_class' );

/**
 * Determine whether the current nav menu args target the Site Frame menu location.
 *
 * @param mixed $args Menu args.
 * @return bool
 */
function anima_is_site_frame_menu_args( $args ): bool {
	return is_object( $args ) && 'site-frame' === ( $args->theme_location ?? '' );
}

/**
 * Determine whether a menu item URL should receive social styling.
 *
 * @param string $url Menu item URL.
 * @return bool
 */
function anima_site_frame_is_social_url( string $url ): bool {
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
 * Classify a Site Frame menu item.
 *
 * @param WP_Post $item Menu item.
 * @return string
 */
function anima_site_frame_get_item_kind( WP_Post $item ): string {
	$classes = array_filter( array_map( 'sanitize_html_class', (array) $item->classes ) );
	$extra_classes = [
		'menu-item--search',
		'menu-item--dark-mode',
		'menu-item--cart',
	];

	if ( 'custom-pxg' === $item->type || array_intersect( $extra_classes, $classes ) ) {
		return 'extra';
	}

	if ( in_array( 'social-menu-item', $classes, true ) || anima_site_frame_is_social_url( (string) $item->url ) ) {
		return 'social';
	}

	return 'regular';
}

/**
 * Resolve the decorative monogram for a regular Site Frame menu item.
 *
 * @param WP_Post $item Menu item.
 * @return string
 */
function anima_get_site_frame_menu_item_monogram( WP_Post $item ): string {
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
 * Add Site Frame-specific menu item classes.
 *
 * @param string[] $classes Existing menu item classes.
 * @param WP_Post  $item    Menu item.
 * @param stdClass $args    Nav menu args.
 * @param int      $depth   Menu depth.
 * @return string[]
 */
function anima_site_frame_nav_menu_css_class( array $classes, WP_Post $item, $args, int $depth ): array {
	unset( $depth );

	if ( ! anima_is_site_frame_menu_args( $args ) ) {
		return $classes;
	}

	$classes = array_values( array_diff( $classes, [ 'icon-only' ] ) );
	$classes[] = 'menu-item--site-frame';
	$item_kind = anima_site_frame_get_item_kind( $item );

	if ( 'social' === $item_kind ) {
		$classes[] = 'social-menu-item';
	}

	if ( in_array( 'menu-item--search', $classes, true ) ) {
		$classes[] = 'nav__item--search';
	}

	if ( 'regular' === $item_kind ) {
		$classes[] = 'menu-item--site-frame-link';
	}

	return array_values( array_unique( array_filter( $classes ) ) );
}
add_filter( 'nav_menu_css_class', 'anima_site_frame_nav_menu_css_class', 20, 4 );

/**
 * Prepend a decorative monogram to regular Site Frame menu items.
 *
 * @param string  $title Menu item title HTML.
 * @param WP_Post $item  Menu item.
 * @param mixed   $args  Nav menu args.
 * @param int     $depth Menu depth.
 * @return string
 */
function anima_site_frame_nav_menu_item_title( string $title, WP_Post $item, $args, int $depth ): string {
	unset( $depth );

	if ( ! anima_is_site_frame_menu_args( $args ) ) {
		return $title;
	}

	$label = '<span class="c-site-frame__label">' . $title . '</span>';

	if ( 'regular' !== anima_site_frame_get_item_kind( $item ) ) {
		return $label;
	}

	if ( in_array( 'menu-item--monogram-off', (array) $item->classes, true ) ) {
		return $label;
	}

	$monogram = anima_get_site_frame_menu_item_monogram( $item );

	if ( '' === $monogram ) {
		return $label;
	}

	return '<span class="menu-item-monogram" aria-hidden="true">' . esc_html( $monogram ) . '</span>' . $label;
}
add_filter( 'nav_menu_item_title', 'anima_site_frame_nav_menu_item_title', 20, 4 );

/**
 * Render the Site Frame shell around the FSE template canvas.
 *
 * @return void
 */
function anima_render_site_frame_shell(): void {
	if ( ! anima_is_site_frame_enabled() ) {
		return;
	}

	$has_menu  = anima_is_site_frame_menu_enabled();
	$has_frame = anima_is_site_frame_frame_enabled();

	if ( ! $has_menu && ! $has_frame ) {
		return;
	}

	$shell_classes = [
		'c-site-frame',
		'sm-palette-' . sanitize_html_class( anima_get_site_frame_palette() ),
		'sm-variation-' . anima_get_site_frame_variation(),
	];

	if ( 'accent' === anima_get_site_frame_variation_choice() ) {
		$shell_classes[] = 'has-site-frame-accent';
	}
	?>
	<div class="<?php echo esc_attr( implode( ' ', $shell_classes ) ); ?>">
		<?php if ( $has_frame ) : ?>
			<span class="c-site-frame__top" aria-hidden="true"></span>
			<span class="c-site-frame__left" aria-hidden="true"></span>
		<?php endif; ?>

		<?php if ( $has_menu ) : ?>
			<aside class="c-site-frame__rail toolbar">
				<div class="c-site-frame__head toolbar__head">
					<?php
					wp_nav_menu(
						[
							'theme_location'       => 'site-frame',
							'container'            => 'nav',
							'container_class'      => 'c-site-frame__navigation toolbar-navigation',
							'container_aria_label' => esc_attr__( 'Site Frame Menu', '__theme_txtd' ),
							'menu_class'           => 'menu c-site-frame__menu nav nav--toolbar',
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
add_action( 'anima/template_html:before', 'anima_render_site_frame_shell', 100 );

/**
 * Emit a tiny Customizer-preview bridge that swaps the palette and variation
 * classes on the Site Frame wrapper without reloading the page. The
 * settings marked `live => true` in the Style Manager config push through
 * postMessage; this script just translates those messages to class swaps.
 *
 * @return void
 */
function anima_site_frame_render_preview_bridge(): void {
	if ( ! is_customize_preview() ) {
		return;
	}

	if ( ! anima_is_site_frame_enabled() ) {
		return;
	}
	?>
	<script id="anima-site-frame-preview">
	( function () {
		if ( typeof wp === 'undefined' || ! wp.customize ) {
			return;
		}

		var wrapper = document.querySelector( '.c-site-frame' );
		if ( ! wrapper ) {
			return;
		}

		function replaceClassWithPrefix( prefix, nextValue ) {
			if ( ! nextValue ) {
				return;
			}
			Array.prototype.slice.call( wrapper.classList ).forEach( function ( className ) {
				if ( className.indexOf( prefix ) === 0 ) {
					wrapper.classList.remove( className );
				}
			} );
			wrapper.classList.add( prefix + nextValue );
		}

		function resolveAccentVariation( paletteId ) {
			var sm      = window.styleManager || {};
			var configs = Array.isArray( sm.colorsConfig ) ? sm.colorsConfig : [];
			var siteVar = parseInt( sm.siteColorVariation, 10 );
			if ( ! siteVar || siteVar < 1 ) {
				siteVar = 1;
			}

			for ( var i = 0; i < configs.length; i++ ) {
				var palette = configs[ i ];
				if ( ! palette || String( palette.id ) !== String( paletteId ) ) {
					continue;
				}
				var sourceIndex = parseInt( palette.sourceIndex, 10 );
				if ( isNaN( sourceIndex ) ) {
					sourceIndex = 3;
				}
				return ( ( sourceIndex - siteVar + 1 + 12 ) % 12 ) + 1;
			}

			return 11;
		}

		function applySiteFrameState() {
			var paletteId     = wp.customize( 'sm_site_frame_palette' )();
			var variationRaw  = wp.customize( 'sm_site_frame_variation' )();
			var isAccent      = 'accent' === variationRaw;
			var variation;

			if ( isAccent ) {
				variation = resolveAccentVariation( paletteId );
			} else {
				variation = parseInt( variationRaw, 10 );
				if ( ! variation || variation < 1 || variation > 12 ) {
					variation = 11;
				}
			}

			replaceClassWithPrefix( 'sm-palette-', paletteId );
			replaceClassWithPrefix( 'sm-variation-', String( variation ) );
			wrapper.classList.toggle( 'has-site-frame-accent', isAccent );
		}

		wp.customize( 'sm_site_frame_palette', function ( setting ) {
			setting.bind( applySiteFrameState );
		} );

		wp.customize( 'sm_site_frame_variation', function ( setting ) {
			setting.bind( applySiteFrameState );
		} );
	}() );
	</script>
	<?php
}
add_action( 'wp_footer', 'anima_site_frame_render_preview_bridge', 50 );
