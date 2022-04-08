<?php
/**
 * Custom functions that act independently of the theme templates.
 *
 * Eventually, some of the functionality here could be replaced by core features.
 *
 * @package Anima
 */

if ( ! function_exists( 'wp_body_open' ) ) {
	function wp_body_open() {
		/**
		 * Triggered after the opening <body> tag.
		 *
		 * @since 5.2.0
		 */
		do_action( 'wp_body_open' );
	}
}

function anima_first_block_is_hero(): bool {
	global $post;

	if ( is_page() && ! empty( $post->post_content ) && has_blocks( $post->post_content ) ) {
		$blocks = parse_blocks( $post->post_content );

		if ( $blocks[0]['blockName'] === 'novablocks/hero' || $blocks[0]['blockName'] === 'novablocks/slideshow' ) {
			return true;
		}
	}

	return false;
}

function anima_first_block_is( $blockTypes ): bool {
	global $post;

	if ( ! is_array( $blockTypes ) ) {
		$blockTypes = [ $blockTypes ];
	}

	if ( is_page() && ! empty( $post->post_content ) && has_blocks( $post->post_content ) ) {
		$blocks = parse_blocks( $post->post_content );

		if ( in_array( $blocks[0]['blockName'], $blockTypes ) ) {
			return true;
		}
	}

	return false;
}

function anima_remove_site_padding_bottom(): bool {
	global $post;

	if ( ! empty( $post->post_content ) && has_blocks( $post->post_content ) ) {
		$blocks     = parse_blocks( $post->post_content );
		$count      = count( $blocks );
		$lastBlock  = $blocks[ $count - 1 ];
		$blockName  = $lastBlock['blockName'];
		$attributes = $lastBlock['attrs'];

		if ( $blockName === 'novablocks/hero' ||
		     $blockName === 'novablocks/slideshow' ) {
			return true;
		}

		if ( $blockName === 'novablocks/google-map' && $attributes['align'] === 'full' ) {
			return true;
		}
	}

	return false;
}

function anima_has_moderate_media_card_after_hero(): bool {
	global $post;

	if ( ! empty( $post->post_content ) && has_blocks( $post->post_content ) ) {
		$blocks = parse_blocks( $post->post_content );
		$blocks = array_filter( $blocks, 'anima_exclude_null_blocks' );
		$blocks = array_values( $blocks );

		if ( count( $blocks ) > 1 ) {
			$firstBlockIsHero   = $blocks[0]['blockName'] === 'novablocks/hero';
			$secondBlockIsMedia = $blocks[1]['blockName'] === 'novablocks/media';
			if ( $firstBlockIsHero && $secondBlockIsMedia ) {
				return isset( $blocks[1]['attrs']['blockStyle'] ) && $blocks[1]['attrs']['blockStyle'] === 'moderate';
			}
		}
	}

	return false;
}

function anima_exclude_null_blocks( array $block ): bool {
	return ! empty( $block['blockName'] );
}

if ( ! function_exists( 'anima_alter_logo_markup' ) ) {
	function anima_alter_logo_markup() {

		if ( has_custom_logo() || anima_has_custom_logo_transparent() ) { ?>

			<div class="c-logo site-logo">
				<?php if ( has_custom_logo() ) { ?>
					<div class="c-logo__default">
						<?php the_custom_logo(); ?>
					</div>
				<?php } ?>

				<div class="c-logo__inverted">
					<?php anima_has_custom_logo_transparent() ? anima_the_custom_logo_transparent() : the_custom_logo(); ?>
				</div>
			</div>

		<?php }
	}
}
add_filter( 'novablocks/logo_markup', 'anima_alter_logo_markup' );

if ( ! function_exists( ' anima_has_custom_logo_transparent' ) ) {
	/**
	 * Determines whether the site has a custom transparent logo.
	 *
	 * @param int $blog_id Optional. ID of the blog in question. Default is the ID of the current blog.
	 *
	 * @return bool Whether the site has a custom logo or not.
	 */
	function anima_has_custom_logo_transparent( int $blog_id = 0 ): bool {
		$switched_blog = false;

		if ( is_multisite() && ! empty( $blog_id ) && get_current_blog_id() !== absint( $blog_id ) ) {
			switch_to_blog( $blog_id );
			$switched_blog = true;
		}

		$custom_logo_id = get_theme_mod( 'anima_transparent_logo' );

		if ( $switched_blog ) {
			restore_current_blog();
		}

		return (bool) $custom_logo_id;
	}
}

/**
 * Fix skip link focus in IE11.
 *
 * This does not enqueue the script because it is tiny and because it is only for IE11,
 * thus it does not warrant having an entire dedicated blocking script being loaded.
 *
 * @link https://git.io/vWdr2
 */
function anima_skip_link_focus_fix() {
	// The following is minified via `terser --compress --mangle -- js/skip-link-focus-fix.js`.
	?>
	<script>
      /(trident|msie)/i.test(navigator.userAgent) && document.getElementById && window.addEventListener && window.addEventListener('hashchange', function () {
        var t, e = location.hash.substring(1);
        /^[A-z0-9_-]+$/.test(e) && (t = document.getElementById(e)) && (/^(?:a|select|input|button|textarea)$/i.test(t.tagName) || (t.tabIndex = -1), t.focus())
      }, !1)
	</script>
	<?php
}

// We will put this script inline since it is so small.
add_action( 'wp_print_footer_scripts', 'anima_skip_link_focus_fix' );

if ( ! function_exists( 'anima_custom_excerpt_length' ) ) {
	/**
	 * Filter the except length to 25 words.
	 *
	 * @param int $length Excerpt length.
	 *
	 * @return int (Maybe) modified excerpt length.
	 */
	function anima_custom_excerpt_length( int $length ): int {
		return 25;
	}
}
add_filter( 'excerpt_length', 'anima_custom_excerpt_length', 50 );

if ( ! function_exists( 'pixelgrade_user_has_access' ) ) {
	/**
	 * Helper function used to check that the user has access to various features.
	 *
	 * @param string $feature
	 *
	 * @return bool
	 */
	function pixelgrade_user_has_access( string $feature ): bool {
		switch ( $feature ) {
			case 'pro-features':
				return apply_filters( 'pixelgrade_enable_pro_features', false );
			case 'woocommerce':
				return apply_filters( 'pixelgrade_enable_woocommerce', false );
			default:
				break;
		}

		return false;
	}
}

if ( ! function_exists( 'pixelgrade_get_original_theme_name' ) ) {
	/**
	 * Get the current theme original name from the WUpdates code.
	 *
	 * @return string
	 */
	function pixelgrade_get_original_theme_name(): string {
		// Get the id of the current theme
		$wupdates_ids = apply_filters( 'wupdates_gather_ids', [] );
		$slug         = basename( get_template_directory() );
		if ( ! empty( $wupdates_ids[ $slug ]['name'] ) ) {
			return $wupdates_ids[ $slug ]['name'];
		}

		// If we couldn't get the WUpdates name, we will fallback to the theme header name entry.
		$theme_header_name = wp_get_theme( get_template() )->get( 'Name' );
		if ( ! empty( $theme_header_name ) ) {
			return ucwords( str_replace( [ '-', '_' ], ' ', $theme_header_name ) );
		}

		// The ultimate fallback is the template directory, uppercased.
		return ucwords( str_replace( [ '-', '_' ], ' ', $slug ) );
	}
}

if ( ! function_exists( 'anima_parse_content_tags' ) ) {
	/**
	 * Replace any content tags present in the content.
	 *
	 * @param string $content
	 *
	 * @return string
	 */
	function anima_parse_content_tags( string $content ): string {
		$original_content = $content;

		// Allow others to alter the content before we do our work
		$content = apply_filters( 'pixelgrade_before_parse_content_tags', $content );

		// Now we will replace all the supported tags with their value
		// %year%
		$content = str_replace( '%year%', date( 'Y' ), $content );

		// %site-title% or %site_title%
		$content = str_replace( '%site-title%', get_bloginfo( 'name' ), $content );
		$content = str_replace( '%site_title%', get_bloginfo( 'name' ), $content );

		// This is a little sketchy because who is the user?
		// It is not necessarily the logged in user, nor the Administrator user...
		// We will go with the author for cases where we are in a post/page context
		// Since we need to dd some heavy lifting, we will only do it when necessary
		if ( false !== strpos( $content, '%first_name%' ) ||
		     false !== strpos( $content, '%last_name%' ) ||
		     false !== strpos( $content, '%display_name%' ) ) {
			$userId = false;
			// We need to get the current ID in more global manner
			$current_object_id = get_queried_object_id();
			$current_post      = get_post( $current_object_id );
			if ( ! empty( $current_post->post_author ) ) {
				$userId = $current_post->post_author;
			} else {
				global $authordata;
				$userId = $authordata->ID ?? false;
			}

			// If we still haven't got a user ID, we will just use the first user on the site
			if ( empty( $userId ) ) {
				$blogUsers = get_users(
					[
						'role'   => 'administrator',
						'number' => 1,
					]
				);
				if ( ! empty( $blogUsers ) ) {
					$blogUsers = reset( $blogUsers );
					$userId    = $blogUsers->ID;
				}
			}

			if ( ! empty( $userId ) ) {
				// %first_name%
				$content = str_replace( '%first_name%', get_the_author_meta( 'first_name', $userId ), $content );
				// %last_name%
				$content = str_replace( '%last_name%', get_the_author_meta( 'last_name', $userId ), $content );
				// %display_name%
				$content = str_replace( '%display_name%', get_the_author_meta( 'display_name', $userId ), $content );
			}
		}

		// Allow others to alter the content after we did our work
		return apply_filters( 'pixelgrade_after_parse_content_tags', $content, $original_content );
	}
}

if ( ! function_exists( 'anima_dark_mode_support' ) ) {
	function anima_dark_mode_support() {
		if ( 'on' === pixelgrade_option( 'sm_dark_mode', 'off' ) ) {
			add_theme_support( 'editor-styles' );
			add_theme_support( 'dark-editor-style' );
		}
	}
}
add_action( 'after_setup_theme', 'anima_dark_mode_support', 10 );

function anima_block_area_has_blocks( string $slug ): bool {
	$posts = get_posts( [
		'name'        => $slug,
		'post_type'   => 'block_area',
		'post_status' => 'publish',
		'numberposts' => 1,
		'fields'      => 'ids',
	] );

	if ( ! empty( $posts ) && has_blocks( reset( $posts ) ) ) {
		return true;
	}

	return false;
}

function anima_custom_gutenberg_settings() {
	add_theme_support( 'editor-gradient-presets', [] );
	add_theme_support( 'disable-custom-gradients' );
}

add_action( 'after_setup_theme', 'anima_custom_gutenberg_settings', 10 );

function anima_is_using_block( string $slug, bool $isBlockArea ): bool {

	if ( has_block( 'novablocks/' . $slug ) ) {
		return true;
	}

	if ( $isBlockArea && anima_block_area_has_blocks( $slug ) ) {
		return true;
	}

	return false;
}

function anima_init_upgrades_logic() {
	// We don't want to do upgrade logic in the frontend or on ajax calls.
	if ( ! is_admin() || ( function_exists( 'wp_doing_ajax' ) ? wp_doing_ajax() : defined( 'DOING_AJAX' ) ) ) {
		return;
	}

	require_once( trailingslashit( get_template_directory() ) . 'inc/upgrade/class-Anima_Upgrade.php' );

	$current_theme = wp_get_theme( get_template() );

	// Make sure the upgrade class is initialized.
	// The slug will be hard-coded to avoid loss of data due to modifications by the user.
	Anima_Upgrade::instance( 'anima', $current_theme->get( 'Version' ), $current_theme->get( 'Name' ) );
}

add_action( 'after_setup_theme', 'anima_init_upgrades_logic', 10 );

if ( ! function_exists( 'anima_add_primary_menu_item_description' ) ) {

	/**
	 * Add menu item description
	 *
	 * @param string   $item_output The menu item's starting HTML output.
	 * @param WP_Post  $item        Menu item data object.
	 * @param int      $depth       Depth of menu item. Used for padding.
	 * @param stdClass $args        An object of wp_nav_menu() arguments.
	 *
	 * @return string Nav menu item start element.
	 */

	function anima_add_primary_menu_item_description( string $item_output, WP_Post $item, int $depth, stdClass $args ): string {

		if ( ( 'primary' == $args->theme_location || 'secondary' == $args->theme_location ) && $depth && $item->description ) {
			$item_output = str_replace( '</a>', '<span class="menu-description">' . $item->description . '</span></a>', $item_output );
		}

		return $item_output;

	}
}
add_filter( 'walker_nav_menu_start_el', 'anima_add_primary_menu_item_description', 10, 4 );

/**
 * Filters a given script tag, possibly adding an `integrity` attribute.
 *
 * @see https://developer.wordpress.org/reference/hooks/script_loader_tag/
 *
 * @param string $tag    The `<script>` tag for the enqueued script.
 * @param string $handle The script's registered handle.
 * @param string $src    The script's source URL.
 *
 * @return string The original HTML tag or its augmented version.
 */
function anima_script_sri_attributes( string $tag, string $handle, string $src ): string {
	// Only do the thing if it makes sense to do so.
	// (It doesn't make sense for non-ssl pages or local resources on live sites,
	// but it always makes sense to do so in debug mode.)
	if ( ! WP_DEBUG && ( ! is_ssl() || anima_is_local_resource( $src ) ) ) {
		return $tag;
	}

	if ( $integrity_hash = wp_scripts()->get_data( $handle, 'integrity' ) ) {
		// Prevent adding attribute when already added.
		if ( ! preg_match( '#\sintegrity(=|>|\s)#', $tag ) ) {
			$tag = preg_replace( ':(?=></script>):', ' integrity="' . $integrity_hash . '"' , $tag, 1 );
		}
	}

	if ( $crossorigin = wp_scripts()->get_data( $handle, 'crossorigin' ) ) {
		// Prevent adding attribute when already added.
		if ( ! preg_match( '#\scrossorigin(=|>|\s)#', $tag ) ) {
			$tag = preg_replace( ':(?=></script>):', ' crossorigin="' . $crossorigin . '"' , $tag, 1 );
		}
	}

	return $tag;
}
add_filter( 'script_loader_tag', 'anima_script_sri_attributes', 9999, 3 );

/**
 * Checks a URL to determine whether or not the resource is "remote"
 * (served by a third-party) or whether the resource is local (and
 * is being served by the same webserver as this plugin is run on.)
 *
 * @param string $uri The URI of the resource to inspect.
 *
 * @return bool True if the resource is local, false if the resource is remote.
 */
function anima_is_local_resource( string $uri ): bool {
	$resource_src_host = parse_url( $uri, PHP_URL_HOST );
	$site_host = parse_url( get_site_url(), PHP_URL_HOST );

	return 0 === strpos( $resource_src_host, $site_host );
}
