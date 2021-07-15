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

function rosa2_first_block_is_hero() {
	global $post;

    if ( is_page() && ! empty( $post->post_content ) && has_blocks( $post->post_content ) ) {
		$blocks = parse_blocks( $post->post_content );

		if ( $blocks[0]['blockName'] === 'novablocks/hero' || $blocks[0]['blockName'] === 'novablocks/slideshow' ) {
			return true;
		}
	}

	return false;
}

function rosa2_first_block_is( $blockTypes ) {
	global $post;

	if ( ! is_array( $blockTypes ) ) {
	    $blockTypes = array( $blockTypes );
    }

	if ( is_page() && ! empty( $post->post_content ) && has_blocks( $post->post_content ) ) {
		$blocks = parse_blocks( $post->post_content );

		if ( in_array( $blocks[0]['blockName'], $blockTypes ) ) {
			return true;
		}
	}

	return false;
}

function rosa2_remove_site_padding_bottom() {
	global $post;

	if ( ! empty( $post->post_content ) && has_blocks( $post->post_content ) ) {
		$blocks = parse_blocks( $post->post_content );
		$count = count( $blocks );
		$lastBlock = $blocks[ $count - 1 ];
		$blockName = $lastBlock['blockName'];
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

function rosa2_has_moderate_media_card_after_hero() {
	global $post;

	if ( ! empty( $post->post_content ) && has_blocks( $post->post_content ) ) {
		$blocks = parse_blocks( $post->post_content );
		$blocks = array_filter( $blocks, 'rosa2_exclude_null_blocks' );
		$blocks = array_values( $blocks );

		if ( count( $blocks ) > 1 ) {
		    $firstBlockIsHero = $blocks[0]['blockName'] === 'novablocks/hero';
		    $secondBlockIsMedia = $blocks[1]['blockName'] === 'novablocks/media';
		    if ( $firstBlockIsHero && $secondBlockIsMedia ) {
		    	return isset( $blocks[1]['attrs']['blockStyle'] ) && $blocks[1]['attrs']['blockStyle'] === 'moderate';
		    }
		}
	}

	return false;
}

function rosa2_exclude_null_blocks( $block ) {
    return ! empty( $block['blockName'] );
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

                <div class="c-logo__inverted">
					<?php  rosa2_has_custom_logo_transparent() ? rosa2_the_custom_logo_transparent() : the_custom_logo(); ?>
                </div>
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
  /(trident|msie)/i.test(navigator.userAgent)&&document.getElementById&&window.addEventListener&&window.addEventListener("hashchange",function(){var t,e=location.hash.substring(1);/^[A-z0-9_-]+$/.test(e)&&(t=document.getElementById(e))&&(/^(?:a|select|input|button|textarea)$/i.test(t.tagName)||(t.tabIndex=-1),t.focus())},!1);
</script>
	<?php
}
// We will put this script inline since it is so small.
add_action( 'wp_print_footer_scripts', 'rosa2_skip_link_focus_fix' );

if ( ! function_exists( 'rosa2_custom_excerpt_length' ) ) {
	/**
	 * Filter the except length to 25 words.
	 *
	 * @param int $length Excerpt length.
	 *
	 * @return int (Maybe) modified excerpt length.
	 */
	function rosa2_custom_excerpt_length( $length ) {
		return 25;
	}
}
add_filter( 'excerpt_length', 'rosa2_custom_excerpt_length', 50 );

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

if ( ! function_exists( 'rosa2_render_sharing_block' ) ) {

    function rosa2_render_sharing_block() {

	    if ( ! pixelgrade_option( 'display_sharing_button_on_single', false ) ) {
	        return;
        }

        if ( is_singular( 'post' ) ) {
            echo do_blocks( '<!-- wp:novablocks/sharing-overlay /-->' );
        }
    }
}
add_action( 'rosa2_after_content', 'rosa2_render_sharing_block' );

if ( ! function_exists( 'rosa2_dark_mode_support' ) ) {
    function rosa2_dark_mode_support() {
	    if ( 'on' === pixelgrade_option( 'sm_dark_mode', 'off' ) ) {
            add_theme_support( 'editor-styles' );
            add_theme_support( 'dark-editor-style' );
	    }
    }
}
add_action( 'after_setup_theme', 'rosa2_dark_mode_support', 10 );

function rosa2_block_area_has_blocks( $slug ) {
	$posts = get_posts( array(
		'name'        => $slug,
		'post_type'   => 'block_area',
		'post_status' => 'publish',
		'numberposts' => 1,
		'fields' => 'ids',
	) );

	if ( ! empty( $posts ) && has_blocks( reset( $posts ) ) ) {
	    return true;
    }

	return false;
}

function rosa2_custom_gutenberg_settings() {
	add_theme_support( 'editor-gradient-presets', array() );
	add_theme_support( 'disable-custom-gradients' );
}

add_action( 'after_setup_theme', 'rosa2_custom_gutenberg_settings', 10 );

function rosa2_should_enqueue_novablocks_fallbacks() {
    if ( ! in_array( 'nova-blocks/nova-blocks.php', apply_filters( 'active_plugins', get_option( 'active_plugins' ) ) ) ) {
        return true;
    }

    if ( ( is_home() || is_search() || is_archive() ) && ! wp_style_is( 'novablocks/media-style', 'enqueued' ) ) {
        return true;
    }

	return false;
}

function rosa2_is_using_block( $slug, $isblockarea ) {

	if ( has_block( 'novablocks/' . $slug ) ) {
		return true;
	}

	if ( $isblockarea ) {
		if ( rosa2_block_area_has_blocks( $slug ) ) {
			return true;
		}
	}

	return false;
}

function rosa2_init_upgrades_logic() {
	// We don't want to do upgrade logic in the frontend or on ajax calls.
	if ( ! is_admin() || ( function_exists( 'wp_doing_ajax' ) ? wp_doing_ajax() : defined( 'DOING_AJAX' ) ) ) {
		return;
	}

	require_once( trailingslashit( get_template_directory() ) . 'inc/upgrade/class-Rosa2_Upgrade.php' );

	$current_theme = wp_get_theme( get_template() );

	// Make sure the upgrade class is initialized.
	// The slug will be hard-coded to avoid loss of data due to modifications by the user.
	Rosa2_Upgrade::instance( 'rosa2', $current_theme->get('Version' ), $current_theme->get('Name') );
}
add_action( 'after_setup_theme', 'rosa2_init_upgrades_logic', 10 );

if ( ! function_exists( 'rosa2_add_primary_menu_item_description' ) ) {

	/**
	 * Add menu item description
     *
     * @param string   $item_output The menu item's starting HTML output.
	 * @param WP_Post  $item        Menu item data object.
	 * @param int      $depth       Depth of menu item. Used for padding.
	 * @param stdClass $args        An object of wp_nav_menu() arguments.
     * @return string Nav menu item start element.
	 */

	function rosa2_add_primary_menu_item_description( $item_output, $item, $depth, $args ) {

		if ( ( 'primary' == $args->theme_location || 'secondary' == $args->theme_location ) && $depth && $item->description ) {
			$item_output = str_replace( '</a>', '<span class="menu-description">' . $item->description . '</span></a>', $item_output );
		}

		return $item_output;

	}
}

add_filter( 'walker_nav_menu_start_el', 'rosa2_add_primary_menu_item_description', 10, 4 );

if ( ! function_exists('rosa2_get_content_markup' ) ) {

	/**
	 * Retrieve the markup for post content.
	 */


	function rosa2_get_content_markup() {
		ob_start(); ?>

			<?php
			do_action( 'rosa2_before_content' );
			the_content();
			do_action( 'rosa2_after_content' );
			?>

		<?php return ob_get_clean();
	}
}

if ( ! function_exists('rosa2_get_sidebar_markup' ) ) {

	/**
	 * Retrieve the markup for sidebar.
	 */

	function rosa2_get_sidebar_markup() {
		ob_start();

		get_template_part( 'template-parts/single-sidebar' );

		return ob_get_clean();
	}
}

if ( ! function_exists('rosa2_get_post_navigation_markup' ) ) {

	/**
	 * Retrieve the markup for post navigation.
	 */

	function rosa2_get_post_navigation_markup() {
		ob_start();

		rosa2_the_post_navigation();

		return ob_get_clean();
	}
}

if ( ! function_exists( 'rosa2_article_header' ) ) {

	function rosa2_article_header() {

		if ( 'post' !== get_post_type() ) {
			return;
		}

		ob_start();
		?>

        <div class="article-header">

            <div class="entry-header sm-variation-2">
				<?php rosa2_categories_posted_in() ?>

                <h1 class="entry-title"><?php the_title() ?></h1>

				<?php if ( has_excerpt() ) { ?>
                    <div class="entry-excerpt">
						<?php the_excerpt() ?>
                    </div>
				<?php } ?>

				<?php get_template_part( 'template-parts/meta' ); ?>
            </div>

			<?php if ( has_post_thumbnail() ) { ?>
                <div class="entry-thumbnail alignwide">
					<?php the_post_thumbnail(); ?>
                </div>
			<?php } ?>
        </div>

		<?php return ob_get_clean();
	}
}

if ( ! function_exists( 'rosa2_get_archive_content')) {

	function rosa2_get_archive_content() {

		ob_start();

		if ( have_posts() ) { ?>

            <header class="entry-header has-text-align-center entry-content">
				<?php
				the_archive_title( '<h1 class="page-title">', '</h1>' );
				the_archive_description( '<div class="archive-description">', '</div>' );
				?>
            </header><!-- .page-header -->
			<?php
			get_template_part( 'template-parts/loop' );
			rosa2_the_posts_pagination();
		} else {
			get_template_part( 'template-parts/content', 'none' );
		}

		return ob_get_clean();
	}
}

/**
 * Return the reading time in minutes for a post content.
 * @param WP_Post|int $post
 * @param int $wpm The words per minute reading rate to take into account.
 * @return int
 */
function rosa2_get_post_reading_time_in_minutes( $post, $wpm = 250 ) {
	$post = get_post( $post );

	if ( ! ( $post instanceof WP_Post ) ) {
		return 0;
	}

	// We don't need the whole content filters. Just the bare minimum.
	$content = do_blocks( $post->post_content );
	$content = wptexturize( $content );
	$content = wpautop( $content );
	$content = shortcode_unautop( $content );
	$content = do_shortcode( $content );

	$content = str_replace( ']]>', ']]&gt;', $content );

	// Allow others to have a say; like removing certain non-essential elements (avatars for example).
	$content = apply_filters( 'rosa2_post_content_before_reading_time_calc', $content, $post );

	return rosa2_get_reading_time_in_minutes( $content, $wpm );
}

/**
 * Calculate the reading time in minutes for a piece of content.
 * @param string $content HTML post content.
 * @param int $wpm The words per minute reading rate to take into account.
 * @return int
 */
function rosa2_get_reading_time_in_minutes( $content, $wpm = 250 ) {
	// Calculate the time in seconds for the images in the content.
	$images_time = 0;
	if ( preg_match_all( '/<img\s[^>]+>/', $content, $matches ) ) {
		$num_images = count( $matches[0] );

		// The starting image weight (expressed in seconds of reading time).
		// This weight is decreasing one second with each image encountered, with a minium of 3 seconds.
		$img_weight = 12;
		for ( $i = 0; $i < $num_images; $i++ ) {
			$images_time += $img_weight;

			if ( $img_weight > 3 ) {
				$img_weight --;
			}
		}
	}

	// Calculate the time in seconds for the videos in the content.
	$videos_time = 0;
	if ( preg_match_all( '/<iframe\s[^>]+>/', $content, $matches ) ) {
		// We will give one minute for every video (even if the video might be longer).
		$videos_time = count( $matches[0] ) * 60;
	}

	// Calculate the words reading time in seconds.
	$word_count = str_word_count( wp_strip_all_tags( $content ) );
	$words_time = ceil( $word_count / ( $wpm / 60 ) );

	// Convert the reading time to minutes.
	$minutes = (int) ceil( ( $words_time + $images_time + $videos_time ) / 60 );
	if ( $minutes < 1 ) {
		$minutes = 1;
	}

	return $minutes;
}

/**
 * Displays the class names for the site_content element.
 *
 * @since 1.12.0
 *
 * @param string|string[] $class Space-separated string or array of class names to add to the class list.
 */
function site_content_class( $class = '' ) {
	// Separates class names with a single space, collates class names for site-content.
	echo 'class="' . esc_attr( implode( ' ', get_site_content_class( $class ) ) ) . '"';
}

/**
 * Retrieves an array of the class names for the site_content element.
 *
 * @since 1.12.0
 *
 *
 * @param string|string[] $class Space-separated string or array of class names to add to the class list.
 * @return string[] Array of class names.
 */
function get_site_content_class( $class = '' ) {

	$classes = array();

	$classes[] = 'site-content';

	if ( is_home() || is_post_type_archive('post') || is_archive() ) {
		$classes[] = 'sm-variation-2';
	}

	if ( is_singular('post') ) {
		$classes[] = 'sm-variation-1';
    }

	$classes = array_map( 'esc_attr', $classes );
	$classes = apply_filters( 'site_content_class', $classes, $class );

	return array_unique( $classes );
}

if ( ! class_exists( 'PixCustomifyPlugin' ) && ! class_exists( 'Pixelgrade\StyleManager\Plugin' ) && ! function_exists( 'pixelgrade_option' ) ) {
    function pixelgrade_option( $settings_id, $default = null, $force_given_default = false ) {
        return get_option( $settings_id, $default );
    }
}
