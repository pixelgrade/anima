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

function rosa2_page_has_hero() {
	global $post;

    if ( is_page() && ! empty( $post->post_content ) && has_blocks( $post->post_content ) ) {
		$blocks = parse_blocks( $post->post_content );

		if ( $blocks[0]['blockName'] === 'novablocks/hero' || $blocks[0]['blockName'] === 'novablocks/slideshow' ) {
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

function rosa2_woocommerce_setup() {
	if ( function_exists( 'WC' ) && pixelgrade_user_has_access( 'woocommerce' ) ) {

		// Add the necessary theme support flags
		add_theme_support( 'woocommerce' );
		add_theme_support( 'wc-product-gallery-lightbox' );
		add_theme_support( 'wc-product-gallery-slider' );


		// Load the integration logic.
		require_once trailingslashit( get_template_directory() ) . 'inc/integrations/woocommerce.php';
	}
}
add_action( 'after_setup_theme', 'rosa2_woocommerce_setup', 10 );



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

    if( ( is_home() || is_search() || is_archive() ) && ! wp_style_is( 'novablocks/media-style', 'enqueued' ) ) {
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

function rosa2_add_custom_menu_items() {
	global $pagenow;
	if( 'nav-menus.php' == $pagenow ) {
		add_meta_box( 'rosa2-add-search-links', esc_html__( 'Extras', '__theme_txtd' ), 'rosa2_nav_menu_item_search', 'nav-menus', 'side', 'low' );
	}
}
add_action( 'admin_init', 'rosa2_add_custom_menu_items' );

function rosa2_nav_menu_item_search( $object ) {
	global $nav_menu_selected_id;

	$menu_items = array(
		'#search' => array(
			'title' => esc_html__( 'Search', '__theme_txtd' ),
			'label' => esc_html__( 'Search', '__theme_txtd' ),
		),

		'#color-scheme-switcher' => array(
			'title' => esc_html__( 'Dark Mode Switcher', '__theme_txtd' ),
			'label' => esc_html__( 'Dark Mode Switcher', '__theme_txtd' ),
		)
	);
	$menu_items_obj = array();

	foreach ( $menu_items as $id => $item ) {
		$menu_items_obj[$id] = new stdClass;
		$menu_items_obj[$id]->ID			    = esc_attr( $id );
		$menu_items_obj[$id]->object_id			= esc_attr( $id );
		$menu_items_obj[$id]->title				= esc_attr( $item['title'] );
		$menu_items_obj[$id]->url				= esc_attr( $id );
		$menu_items_obj[$id]->description 		= 'description';
		$menu_items_obj[$id]->db_id 			= 0;
		$menu_items_obj[$id]->object 			= 'rosa2';
		$menu_items_obj[$id]->menu_item_parent 	= 0;
		$menu_items_obj[$id]->type 				= 'custom';
		$menu_items_obj[$id]->target 			= '';
		$menu_items_obj[$id]->attr_title 		= '';
		$menu_items_obj[$id]->label 		    = esc_attr( $item['label'] );
		$menu_items_obj[$id]->classes 			= array('is-' .$id . '-button');
		$menu_items_obj[$id]->xfn 				= '';
	}

	$walker = new Walker_Nav_Menu_Checklist( array() );

	?>

	<div id="rosa2-user-menu-links" class="taxonomydiv">
		<div id="tabs-panel-rosa2-links-all" class="tabs-panel tabs-panel-view-all tabs-panel-active">

			<ul id="rosa2-user-menu-linkschecklist" class="list:rosa2-user-menu-links categorychecklist form-no-clear">
				<?php echo walk_nav_menu_tree( array_map( 'wp_setup_nav_menu_item', $menu_items_obj ), 0, (object) array( 'walker' => $walker ) ); ?>
			</ul>

		</div>
		<p class="button-controls">
				<span class="add-to-menu">
					<input type="submit" <?php disabled( $nav_menu_selected_id, 0 ); ?> class="button-secondary submit-add-to-menu right"
					       value="<?php esc_attr_e( 'Add to Menu', '__theme_txtd' ); ?>"
					       name="add-rosa2-user-menu-links-menu-item" id="submit-rosa2-user-menu-links"/>
				</span>
		</p>
	</div>

	<?php
}

function rosa2_output_search_overlay() {

	$menu_locations = get_nav_menu_locations();

	// Determine if any menu location has a search menu item so we can output the overlay markup.
	$has_search_item = false;
	foreach ( $menu_locations as $menu_location ) {
		$menu_items = wp_get_nav_menu_items( $menu_location );
		if ( ! $menu_items ) {
			continue;
		}

		foreach ( $menu_items as $menu_item ) {
			if ( '#search' === $menu_item->url ) {
				$has_search_item = true;
				break;
			}
		}

		// No need to continue if we have found one.
		if ( $has_search_item ) {
			break;
		}
	}

	if ( ! $has_search_item ) {
	    return;
    } ?>

    <div class="c-search-overlay">
        <div class="c-search-overlay__content">
            <div class="c-search-overlay__form">
                <?php get_search_form(); ?>
                <span class="c-search-overlay__cancel"></span>
            </div>

            <?php if ( has_nav_menu( 'search-suggestions' ) ) {

	            $menu_name = wp_get_nav_menu_name('search-suggestions' );

	            ?>
                <div class="c-search-overlay__suggestions">
                    <p><?php echo wp_kses( $menu_name, wp_kses_allowed_html() ); ?></p>
		            <?php wp_nav_menu( array(
			            'container'      => false,
			            'theme_location' => 'search-suggestions',
			            'menu_id'        => 'search-suggestions-menu',
			            'fallback_cb'    => false
		            ) ); ?>
                </div><!-- .c-search-overlay__suggestions -->
            <?php } ?>
        </div><!-- .c-search-overlay__content -->
    </div><!-- .c-search-overlay -->

    <?php
}
add_action( 'rosa2_after_footer', 'rosa2_output_search_overlay', 10 );

/**
 * Rosa2 custom search form.
 *
 * @param string $form Form HTML.
 * @return string Modified form HTML.
 */
function rosa2_custom_search_form( $form ) {
	$form = '<form role="search" method="get" class="search-form" action="' . esc_url( home_url( '/' ) ) . '">
				<label>
					<span class="screen-reader-text">' . _x( 'Search for:', 'label', '__theme_txtd' ) . '</span>
					<input type="search" class="search-field" placeholder="' . esc_attr( sprintf( __( 'Search %s...', '__theme_txtd' ), esc_html( get_bloginfo( 'name' ) ) ) ) . '" value="' . get_search_query() . '" name="s" />
					<span class="search-icon"></span>
				</label>
				<input type="submit" class="search-submit" value="' . esc_attr_x( 'Search', 'submit button', '__theme_txtd' ) . '" />
			</form>';

	return $form;
}
add_filter( 'get_search_form', 'rosa2_custom_search_form' );

function rosa2_is_nav_menus_page( $new_edit = null ) {
	global $pagenow;

	// Make sure we are on the backend.
	if ( ! is_admin() ) {
		return false;
	}

	if( 'nav-menus.php' == $pagenow ) {
		return true;
	}

	return false;
}

/**
 * Add Color Scheme attribute to <html> tag.
 *
 *
 * @since 1.6.0
 *
 * @param string $output A space-separated list of language attributes.
 * @param string $doctype The type of html document (xhtml|html).
 *
 * @return string $output A space-separated list of language attributes.
 */
function rosa2_add_color_scheme_attribute( $output, $doctype ) {

    if( is_admin() ) {
        return;
    }

	if ( 'html' !== $doctype ) {
		return $output;
	}

	$output .= ' data-dark-mode-advanced=' . pixelgrade_option( 'sm_dark_mode_advanced', 'off' );

	return $output;
}

add_filter( 'language_attributes', 'rosa2_add_color_scheme_attribute', 10, 2 );
