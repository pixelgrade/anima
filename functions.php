<?php
/**
 * Anima functions and definitions
 *
 * @package Anima
 */

if ( ! function_exists( 'anima_setup' ) ) {

	/**
	 * Sets up theme defaults and registers support for various WordPress features.
	 *
	 * Note that this function is hooked into the after_setup_theme hook, which
	 * runs before the init hook. The init hook is too late for some features, such
	 * as indicating support for post thumbnails.
	 */
	function anima_setup() {
		/**
		 * Make theme available for translation.
		 * Translations can be filed in the /languages/ directory.
		 * If you're building a theme based on Nova, use a find and replace
		 * to change '__theme_txtd' to the name of your theme in all the template files.
		 */
		load_theme_textdomain( '__theme_txtd', get_template_directory() . '/languages' );

		// Add default posts and comments RSS feed links to head.
		add_theme_support( 'automatic-feed-links' );

		/**
		 * Let WordPress manage the document title.
		 * By adding theme support, we declare that this theme does not use a
		 * hard-coded <title> tag in the document head, and expect WordPress to
		 * provide it for us.
		 */
		add_theme_support( 'title-tag' );

		/**
		 * Enable support for Post Thumbnails.
		 *
		 * @link https://developer.wordpress.org/themes/functionality/featured-images-post-thumbnails/
		 */
		add_theme_support( 'post-thumbnails' );

		/**
		 * Switch default core markup for search form, comment form, and comments
		 * to output valid HTML5.
		 */
		add_theme_support( 'html5', [
			'search-form',
			'comment-form',
			'comment-list',
			'gallery',
			'caption',
		] );

		// This theme uses wp_nav_menu() in one location.
		register_nav_menus( [
			'primary'            => esc_html__( 'Primary Menu', '__theme_txtd' ),
			'secondary'          => esc_html__( 'Secondary Menu', '__theme_txtd' ),
			'tertiary'          => esc_html__( 'Tertiary Menu', '__theme_txtd' ),
			'search-suggestions' => esc_html__( 'Search Suggestions', '__theme_txtd' )
		] );

		// Add theme support for selective refresh for widgets.
		add_theme_support( 'customize-selective-refresh-widgets' );

		/**
		 * Add support for core custom logo.
		 *
		 * @link https://codex.wordpress.org/Theme_Logo
		 */
		add_theme_support( 'custom-logo', [
			'height'      => 250,
			'width'       => 250,
			'flex-width'  => true,
			'flex-height' => true,
			'header-text' => [
				'site-title',
				'site-description',
			]
		] );
		add_image_size( 'anima-site-logo', 250, 250, false );

		add_theme_support( 'align-wide' );

		/**
		 * Add theme support for responsive embeds
		 */
		add_theme_support( 'responsive-embeds' );

		/**
		 * Enable support for the Style Manager Customizer section.
		 */
		add_theme_support( 'customizer_style_manager' );
		add_theme_support( 'style_manager_font_palettes' );
		add_theme_support( 'style_manager_advanced_dark_mode' );

		/**
		 * Remove Theme support for Core Block Patterns.
		 */
		remove_theme_support( 'core-block-patterns' );

		/**
		 * Use 'wp_template' posts instead of theme template files.
		 *
		 * This support is automatically added by wp_enable_block_templates() but we add it also to be more upfront.
		 */
		add_theme_support( 'block-templates' );
	}
}
add_action( 'after_setup_theme', 'anima_setup', 10 );

/**
 * Register widget area.
 *
 * @since Anima 1.10.0
 *
 * @link https://developer.wordpress.org/themes/functionality/sidebars/#registering-a-sidebar
 *
 * @return void
 */
function anima_widgets_init() {

	register_sidebar(
		[
			'name'          => esc_html__( 'Article Sidebar', '__theme_txtd' ),
			'id'            => 'sidebar-1',
			'description'   => esc_html__( 'Add widgets here to appear next to your articles.', '__theme_txtd' ),
			'before_widget' => '<section id="%1$s" class="widget %2$s">',
			'after_widget'  => '</section>',
			'before_title'  => '<h2 class="widget-title">',
			'after_title'   => '</h2>',
		]
	);
}
add_action( 'widgets_init', 'anima_widgets_init' );

function anima_register_assets() {
	$theme  = wp_get_theme( get_template() );
	$suffix = ( defined( 'SCRIPT_DEBUG' ) && SCRIPT_DEBUG ) ? '' : '.min';

	wp_register_style( 'anima-custom-properties', trailingslashit( get_template_directory_uri() ) . 'dist/css/custom-properties.css', [], $theme->get( 'Version' ) );
	wp_register_style( 'anima-social-links', trailingslashit( get_template_directory_uri() ) . 'dist/css/social-links.css', [], $theme->get( 'Version' ) );
	wp_register_style( 'anima-theme', trailingslashit( get_template_directory_uri() ) . 'dist/css/theme/style.css', [], $theme->get( 'Version' ) );
	wp_register_style( 'anima-theme-components', trailingslashit( get_template_directory_uri() ) . 'dist/css/theme/components.css', [], $theme->get( 'Version' ) );
	wp_register_style( 'anima-utility', trailingslashit( get_template_directory_uri() ) . 'dist/css/utility.css', [], $theme->get( 'Version' ) );

	wp_register_style('anima-novablocks-conversations', trailingslashit( get_template_directory_uri() ) . 'dist/css/blocks/nova-blocks/conversations.css', [], '1.8.0');

	wp_register_style( 'anima-blocks-common', trailingslashit( get_template_directory_uri() ) . 'dist/css/blocks/common.css', [], $theme->get( 'Version' ) );
	wp_register_style( 'anima-blocks-editor', trailingslashit( get_template_directory_uri() ) . 'dist/css/blocks/editor.css', [ 'anima-blocks-common' ], $theme->get( 'Version' ) );
	wp_register_style( 'anima-blocks-style', trailingslashit( get_template_directory_uri() ) . 'dist/css/blocks/style.css', [ 'anima-blocks-common' ], $theme->get( 'Version' ) );

	wp_register_style( 'anima-block-editor-styles', trailingslashit( get_template_directory_uri() ) . 'dist/css/block-editor.css', [
		'anima-custom-properties',
		'anima-theme-components',
		'anima-blocks-editor',
		'anima-utility',
	], $theme->get( 'Version' ) );

	wp_style_add_data( 'anima-theme', 'rtl', 'replace' );
	wp_style_add_data( 'anima-theme-components', 'rtl', 'replace' );

	// Use the public CDN for better performance
	// (high likelihood the file is already cached in the browser from other sites).
	wp_register_script( 'gsap', 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.9.1/gsap.min.js', [], null, true );
	// Add the SRI (Subresource Integrity) hash data.
	// Generated with https://www.srihash.org/
	wp_script_add_data( 'gsap', 'integrity', 'sha384-lI86CGWNchoT9leGBpVR41iGrRTRbHRDsPI4Zo/atPOIodjl8YyDaVefcpgkCg4u');
	wp_script_add_data( 'gsap', 'crossorigin', 'anonymous');

	// Use our private CDN since GSAP premium plugins can't be distributed in the bundle.
	wp_register_script( 'gsap-split-text', '//pxgcdn.com/js/gsap/3.9.1/SplitText.min.js', [], null, true );
	// Add the SRI (Subresource Integrity) hash data.
	// Generated with https://www.srihash.org/
	wp_script_add_data( 'gsap-split-text', 'integrity', 'sha384-KoviLFAFGG+n+c3BxM58Gr/poK7WAtzed6kU8Kzr2fvjp3Q8gttOWY+XvpTjShW3');
	wp_script_add_data( 'gsap-split-text', 'crossorigin', 'anonymous');

	wp_register_script( 'anima-app', trailingslashit( get_template_directory_uri() ) . 'dist/js/scripts' . $suffix . '.js', [ 'jquery', 'gsap', 'gsap-split-text', 'hoverIntent', 'imagesloaded' ], $theme->get( 'Version' ), true );
}
add_action( 'init', 'anima_register_assets', 10 );

function anima_enqueue_theme_block_editor_assets() {
	$theme  = wp_get_theme( get_template() );
	$suffix = ( defined( 'SCRIPT_DEBUG' ) && SCRIPT_DEBUG ) ? '' : '.min';

	wp_enqueue_style( 'anima-block-editor-styles' );

	wp_enqueue_script(
		'anima-editor-js',
		trailingslashit( get_template_directory_uri() ) . 'dist/js/editor' . $suffix . '.js',
		[ 'wp-hooks' ],
		$theme->get( 'Version' ),
		true
	);
}
add_action( 'enqueue_block_editor_assets', 'anima_enqueue_theme_block_editor_assets', 10 );

function anima_enqueue_assets() {
	$theme  = wp_get_theme( get_template() );

	$used_blocks = [ 'media' ];
	foreach( $used_blocks as $block ) {
		if ( ! anima_is_using_block( $block, true ) ) {
			wp_enqueue_style('novablocks/' . $block );
		}
	}

    wp_enqueue_style( 'anima-style', get_template_directory_uri() . '/style.css', [
        'anima-social-links',
        'anima-custom-properties',
		'anima-theme',
        'anima-theme-components',
		'anima-blocks-style',
		'anima-utility',
    ], $theme->get( 'Version' ) );

	wp_style_add_data( 'anima-style', 'rtl', 'replace' );

	wp_localize_script( 'anima-app', 'style_manager_values', [
        'sm_site_color_variation' => pixelgrade_option( 'sm_site_color_variation', 1 )
	] );

	wp_enqueue_script( 'anima-app' );


	// Load Conversation CSS only when we need it:
    // 1. Comments are open.
    // 2. When there are comments on a post and the conversation has been closed.
	if ( is_singular() && ( comments_open() || ! comments_open() && get_comments_number() > 0 ) ) {

		wp_enqueue_style('anima-novablocks-conversations');

	    if  ( get_option( 'thread_comments' ) ) {
		    wp_enqueue_script( 'comment-reply' );

	    }
	}
}
add_action( 'wp_enqueue_scripts', 'anima_enqueue_assets', 20 );

/**
 * Provide fallback webfonts for when the Style Manager plugin is not active.
 *
 * @return void
 */
function anima_webfonts_fallback() {

	if ( class_exists( 'PixCustomifyPlugin' ) || function_exists( '\Pixelgrade\StyleManager\plugin') ) {
		return;
	}

	ob_start(); ?>
		var config = {
			classes: true,
			events: true,
			custom: {
				families: [
					'Reforma1969',
					'Reforma2018',
					'Billy Ohio',
				],
				urls: [
					'//pxgcdn.com/fonts/reforma1969/stylesheet.css',
					'//pxgcdn.com/fonts/reforma2018/stylesheet.css',
					'//pxgcdn.com/fonts/billy-ohio/stylesheet.css',
				],
			},
			loading: function() {
				jQuery( window ).trigger( 'wf-loading' );
			},
			active: function() {
				jQuery( window ).trigger( 'wf-active' );
			},
			inactive: function() {
				jQuery( window ).trigger( 'wf-inactive' );
			},
		};
		WebFont.load( config );
	<?php $webfontloader_inline_script = ob_get_clean();

	wp_register_script( 'webfontloader', '//ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js', [ 'jquery' ], null, true );
	wp_add_inline_script( 'webfontloader', $webfontloader_inline_script );
	wp_enqueue_script( 'webfontloader' );

}
add_action( 'wp_enqueue_scripts', 'anima_webfonts_fallback', 10 );

function anima_print_scripts() {
	ob_start(); ?>

	<script>
		window.addEventListener( "DOMContentLoaded", function( event ) {
			document.body.classList.remove( "is-loading" );
			document.body.classList.add( "has-loaded" );
		} );

		function animaIsUndefined( target ) {
			return typeof target === "undefined" || target === null;
        }

		function animaShouldCancelFadeOut( e ) {

			if ( animaIsUndefined( e.target ) ||
                 animaIsUndefined( e.target.activeElement ) ||
                 animaIsUndefined( e.target.activeElement ) ||
                 animaIsUndefined( e.target.activeElement.getAttribute( 'href' ) ) ) {
				return false;
            }

			var href = e.target.activeElement.getAttribute( 'href' );
			var isMail = typeof href === 'string' && href.indexOf( 'mailto:' ) === 0;
			var isTel = typeof href === 'string' && href.indexOf( 'tel:' ) === 0;

			return isMail || isTel;
        }

		window.addEventListener( "beforeunload", function( event ) {
			if ( ! animaShouldCancelFadeOut( event ) ) {
			    document.body.classList.add( "is-loading" );
            }
		} );

		// Fix Safari bfcache: page stays invisible on back/swipe-back navigation.
		// Safari's Back-Forward Cache restores the DOM state (with "is-loading" class
		// applied by the beforeunload handler) but does not re-fire DOMContentLoaded,
		// so the page remains at opacity: 0. The pageshow event with persisted=true
		// fires only on bfcache restore — not on initial load — so the reveal
		// animation is preserved for first visits.
		window.addEventListener( "pageshow", function( event ) {
			if ( event.persisted ) {
				// Restore body visibility (undo the beforeunload fade-out).
				document.body.classList.remove( "is-loading" );
				document.body.classList.add( "has-loaded" );

				// Force hero elements visible. CSS sets opacity: 0 on hero content
				// by default — GSAP overrides this with inline opacity: 1 during
				// the intro animation. We must SET opacity to 1 (not remove it),
				// otherwise elements fall back to the CSS opacity: 0.
				var heroes = document.querySelectorAll(
					'.nb-supernova--card-layout-stacked.nb-supernova--1-columns.nb-supernova--align-full,' +
					'.novablocks-hero'
				);

				heroes.forEach( function( hero ) {
					var containers = hero.querySelectorAll(
						'.novablocks-hero__inner-container,' +
						'.nb-supernova-item__inner-container'
					);

					containers.forEach( function( container ) {
						var els = container.querySelectorAll( '*' );
						els.forEach( function( el ) {
							el.style.opacity = '1';
							el.style.removeProperty( 'transform' );
						} );
					} );

					var mediaWrappers = hero.querySelectorAll( '.nb-supernova-item__media-wrapper' );
					mediaWrappers.forEach( function( el ) {
						el.style.opacity = '1';
					} );
				} );

				// Trigger scroll recalculation so GSAP hero animations
				// sync to the current scroll position.
				window.dispatchEvent( new Event( "scroll" ) );
			}
		} );
	</script>

	<?php echo ob_get_clean();
}
add_action( 'wp_print_scripts', 'anima_print_scripts', 10 );

/* Automagical updates */
function wupdates_check_QBAXY( $transient ) {
	// First get the theme directory name (the theme slug - unique)
	$slug = basename( get_template_directory() );

	// Nothing to do here if the checked transient entry is empty or if we have already checked
	if ( empty( $transient->checked ) || empty( $transient->checked[ $slug ] ) || ! empty( $transient->response[ $slug ] ) ) {
		return $transient;
	}

	// Let's start gathering data about the theme
	// Then WordPress version
	include( ABSPATH . WPINC . '/version.php' );
	$http_args = [
		'body' => [
			'slug' => $slug,
			'url' => home_url( '/' ), //the site's home URL
			'version' => 0,
			'locale' => get_locale(),
			'phpv' => phpversion(),
			'child_theme' => is_child_theme(),
			'data' => null, //no optional data is sent by default
		],
		'user-agent' => 'WordPress/' . $wp_version . '; ' . home_url( '/' )
	];

	// If the theme has been checked for updates before, get the checked version
	if ( isset( $transient->checked[ $slug ] ) && $transient->checked[ $slug ] ) {
		$http_args['body']['version'] = $transient->checked[ $slug ];
	}

	// Use this filter to add optional data to send
	// Make sure you return an associative array - do not encode it in any way
	$optional_data = apply_filters( 'wupdates_call_data_request', $http_args['body']['data'], $slug, $http_args['body']['version'] );

	// Encrypting optional data with private key, just to keep your data a little safer
	// You should not edit the code bellow
	$optional_data = json_encode( $optional_data );
	$w             =[];$re = '';$s =[];$sa =md5('fec5c0ec5abdf0ff450db296c8407b1c6bb53ed7');
	$l             =strlen($sa);$d =$optional_data;$ii =-1;
	while(++$ii<256){$w[$ii]=ord(substr($sa,(($ii%$l)+1),1));$s[$ii]=$ii;} $ii=-1;$j=0;
	while(++$ii<256){$j=($j+$w[$ii]+$s[$ii])%255;$t=$s[$j];$s[$ii]=$s[$j];$s[$j]=$t;}
	$l=strlen($d);$ii=-1;$j=0;$k=0;
	while(++$ii<$l){$j=($j+1)%256;$k=($k+$s[$j])%255;$t=$w[$j];$s[$j]=$s[$k];$s[$k]=$t;
		$x=$s[(($s[$j]+$s[$k])%255)];$re.=chr(ord($d[$ii])^$x);}
	$optional_data=bin2hex($re);

	// Save the encrypted optional data so it can be sent to the updates server
	$http_args['body']['data'] = $optional_data;

	// Check for an available update
	$url = $http_url = set_url_scheme( 'https://wupdates.com/wp-json/wup/v1/themes/check_version/QBAXY', 'http' );
	if ( $ssl = wp_http_supports( [ 'ssl' ] ) ) {
		$url = set_url_scheme( $url, 'https' );
	}

	$raw_response = wp_remote_post( $url, $http_args );
	if ( $ssl && is_wp_error( $raw_response ) ) {
		$raw_response = wp_remote_post( $http_url, $http_args );
	}
	// We stop in case we haven't received a proper response
	if ( is_wp_error( $raw_response ) || 200 != wp_remote_retrieve_response_code( $raw_response ) ) {
		return $transient;
	}

	$response = (array) json_decode($raw_response['body']);
	if ( ! empty( $response ) ) {
		// You can use this action to show notifications or take other action
		do_action( 'wupdates_before_response', $response, $transient );
		if ( isset( $response['allow_update'] ) && $response['allow_update'] && isset( $response['transient'] ) ) {
			$transient->response[ $slug ] = (array) $response['transient'];
		}
		do_action( 'wupdates_after_response', $response, $transient );
	}

	return $transient;
}
add_filter( 'pre_set_site_transient_update_themes', 'wupdates_check_QBAXY' );

function wupdates_add_id_QBAXY( $ids = [] ) {
	// First get the theme directory name (unique)
	$slug = basename( get_template_directory() );

	// Now add the predefined details about this product
	// Do not tamper with these please!!!
	$ids[ $slug ] = [ 'name' => 'Anima', 'slug' => 'anima', 'id' => 'QBAXY', 'type' => 'theme_lt_wporg', 'digest' => '100be1dade32eb97a6849c29b2d03e65', ];

	return $ids;
}
add_filter( 'wupdates_gather_ids', 'wupdates_add_id_QBAXY', 10, 1 );

/**
 * Custom template tags for this theme.
 */
require_once trailingslashit( get_template_directory() ) . 'inc/template-tags.php';

/**
 * Functions which enhance the theme by hooking into WordPress.
 */
require_once trailingslashit( get_template_directory() ) . 'inc/template-functions.php';
require_once trailingslashit( get_template_directory() ) . 'inc/extras.php';
require_once trailingslashit( get_template_directory() ) . 'inc/required-plugins.php';

/**
 * Block editor related logic.
 */
require_once trailingslashit( get_template_directory() ) . 'inc/block-editor.php';

/**
 * Full site editing logic.
 */
require_once trailingslashit( get_template_directory() ) . 'inc/fse.php';

/**
 * Admin Dashboard logic.
 */
require_once trailingslashit( get_template_directory() ) . 'inc/admin/admin.php'; // phpcs:ignore

/**
 * Various integrations with plugins to keep things smooth and easy.
 */
require_once trailingslashit( get_template_directory() ) . '/inc/integrations.php';
