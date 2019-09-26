<?php
/**
 * Custom functions that act independently of the theme templates.
 *
 * Eventually, some of the functionality here could be replaced by core features.
 *
 * @package Rosa 2
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

function rosa2_admin_init() {
	global $_wp_post_type_features;
	$_wp_post_type_features['post']['editor'];
}
add_action( 'admin_init', 'rosa2_admin_init' );
remove_action( 'edit_form_after_title', '_wp_posts_page_notice' );

function rosa2_header_should_be_fixed() {
	global $post;

	if ( has_blocks( $post->post_content ) ) {
		$blocks = parse_blocks( $post->post_content );

		if ( $blocks[0]['blockName'] === 'novablocks/hero' ) {
			return true;
		}
	}

	return false;
}

if ( ! function_exists( 'rosa2_alter_logo_markup' ) ) {
	function rosa2_alter_logo_markup() {
		if ( has_custom_logo() || rosa2_has_custom_logo_transparent() ) { ?>

			<div class="c-logo site-logo">
				<?php if ( has_custom_logo() ) { ?>
					<div class="c-logo__default">
						<?php the_custom_logo(); ?>
					</div>
				<?php } ?>

				<?php if ( rosa2_has_custom_logo_transparent() ) { ?>
					<div class="c-logo__inverted">
						<?php rosa2_the_custom_logo_transparent(); ?>
					</div>
				<?php } ?>
			</div>

		<?php }
	}
}
add_filter( 'novablocks_logo_markup', 'rosa2_alter_logo_markup' );

/**
 * Fix skip link focus in IE11.
 *
 * This does not enqueue the script because it is tiny and because it is only for IE11,
 * thus it does not warrant having an entire dedicated blocking script being loaded.
 *
 * @link https://git.io/vWdr2
 */
function rosa2_skip_link_focus_fix() {
	// The following is minified via `terser --compress --mangle -- js/skip-link-focus-fix.js`.
	?>
    <script>
		/(trident|msie)/i.test( navigator.userAgent ) && document.getElementById && window.addEventListener && window.addEventListener( "hashchange", function() {
			var t, e = location.hash.substring( 1 );
			/^[A-z0-9_-]+$/.test( e ) && (
				t = document.getElementById( e )
			) && (
				/^(?:a|select|input|button|textarea)$/i.test( t.tagName ) || (
					t.tabIndex = - 1
				), t.focus()
			)
		}, ! 1 );
    </script>
	<?php
}
// We will put this script inline since it is so small.
add_action( 'wp_print_footer_scripts', 'rosa2_skip_link_focus_fix' );

if ( ! function_exists( 'pixelgrade_user_has_access' ) ) {
	/**
	 * Helper function used to check that the user has access to various features.
	 *
	 * @param string $feature
	 *
	 * @return bool
	 */
	function pixelgrade_user_has_access( $feature ) {
		switch ( $feature ) {
			case 'pro-features':
				return apply_filters( 'pixelgrade_enable_pro_features', false );
				break;
			case 'woocommerce':
				return apply_filters( 'pixelgrade_enable_woocommerce', false );
				break;
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
	function pixelgrade_get_original_theme_name() {
		// Get the id of the current theme
		$wupdates_ids = apply_filters( 'wupdates_gather_ids', array() );
		$slug         = basename( get_template_directory() );
		if ( ! empty( $wupdates_ids[ $slug ]['name'] ) ) {
			return $wupdates_ids[ $slug ]['name'];
		}

		// If we couldn't get the WUpdates name, we will fallback to the theme header name entry.
		$theme_header_name = wp_get_theme( get_template() )->get( 'Name' );
		if ( ! empty( $theme_header_name ) ) {
			return ucwords( str_replace( array( '-', '_' ), ' ', $theme_header_name ) );
		}

		// The ultimate fallback is the template directory, uppercased.
		return ucwords( str_replace( array( '-', '_' ), ' ', $slug ) );
	}
}

function rosa2_woocommerce_setup() {
	if ( function_exists( 'WC') && pixelgrade_user_has_access('woocommerce') ) {

		// Add the necessary theme support flags
		add_theme_support( 'woocommerce' );
		add_theme_support( 'wc-product-gallery-zoom' );
		add_theme_support( 'wc-product-gallery-lightbox' );
		add_theme_support( 'wc-product-gallery-slider' );

		// Enqueue static assets
		add_action( 'wp_enqueue_scripts', 'rosa2_woocommerce_scripts', 10 );

		// Load any custom logic
		require_once trailingslashit( get_template_directory() ) . 'inc/integrations/woocommerce.php';
	}
}
add_action( 'after_setup_theme', 'rosa2_woocommerce_setup', 10 );

function rosa2_woocommerce_scripts() {
	$theme  = wp_get_theme( get_template() );
	$suffix = ( defined( 'SCRIPT_DEBUG' ) && SCRIPT_DEBUG ) ? '' : '.min';

//	wp_enqueue_style( 'rosa2-style', get_template_directory_uri() . '/style.css', array(), $theme->get( 'Version' ) );

	wp_enqueue_script( 'rosa2-woocommerce', get_template_directory_uri() . '/dist/js/woocommerce' . $suffix . '.js', array( 'jquery' ), $theme->get( 'Version' ), true );
	wp_localize_script( 'rosa2-woocommerce', 'pixelgradeWooCommerceStrings', array(
		'adding_to_cart' => esc_html__( 'Adding...', '__theme_txtd' ),
		'added_to_cart' => esc_html__( 'Added!', '__theme_txtd' ),
	) );

	wp_deregister_style('wc-block-style');
}

if ( ! function_exists( 'rosa2_parse_content_tags' ) ) {
	/**
	 * Replace any content tags present in the content.
	 *
	 * @param string $content
	 *
	 * @return string
	 */
	function rosa2_parse_content_tags( $content ) {
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
			$user_id = false;
			// We need to get the current ID in more global manner
			$current_object_id = get_queried_object_id();
			$current_post      = get_post( $current_object_id );
			if ( ! empty( $current_post->post_author ) ) {
				$user_id = $current_post->post_author;
			} else {
				global $authordata;
				$user_id = isset( $authordata->ID ) ? $authordata->ID : false;
			}

			// If we still haven't got a user ID, we will just use the first user on the site
			if ( empty( $user_id ) ) {
				$blogusers = get_users(
					array(
						'role'   => 'administrator',
						'number' => 1,
					)
				);
				if ( ! empty( $blogusers ) ) {
					$blogusers = reset( $blogusers );
					$user_id   = $blogusers->ID;
				}
			}

			if ( ! empty( $user_id ) ) {
				// %first_name%
				$content = str_replace( '%first_name%', get_the_author_meta( 'first_name', $user_id ), $content );
				// %last_name%
				$content = str_replace( '%last_name%', get_the_author_meta( 'last_name', $user_id ), $content );
				// %display_name%
				$content = str_replace( '%display_name%', get_the_author_meta( 'display_name', $user_id ), $content );
			}
		}

		// Allow others to alter the content after we did our work
		return apply_filters( 'pixelgrade_after_parse_content_tags', $content, $original_content );
	}
}
