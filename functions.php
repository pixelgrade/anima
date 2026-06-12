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
		// TODO: Re-enable gallery, link, audio, and video once LT ships their blueprint cards and single-template routing.
		add_theme_support( 'post-formats', [ 'quote', 'image' ] );

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
			'tertiary'           => esc_html__( 'Tertiary Menu', '__theme_txtd' ),
			'site-frame'         => esc_html__( 'Site Frame', '__theme_txtd' ),
			'search-suggestions' => esc_html__( 'Search Suggestions', '__theme_txtd' ),
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
		 * Enable editor styles so the Post Editor uses an iframe
		 * (matching the Site Editor) for proper CSS isolation.
		 */
		add_theme_support( 'editor-styles' );

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

	// GSAP, SplitText, and Snap.svg are CDN-loaded and not GPL-redistributable,
	// so only the commercial distribution registers them
	// (inc/distribution/remote-scripts.php, init/5). The bare WordPress.org
	// build runs without them and the frontend bundle degrades gracefully.
	$app_deps = [ 'jquery', 'hoverIntent', 'imagesloaded' ];
	if ( wp_script_is( 'gsap', 'registered' ) ) {
		array_unshift( $app_deps, 'gsap' );
	}
	if ( wp_script_is( 'gsap-split-text', 'registered' ) ) {
		$app_deps[] = 'gsap-split-text';
	}

	wp_register_script( 'anima-app', trailingslashit( get_template_directory_uri() ) . 'dist/js/scripts' . $suffix . '.js', $app_deps, $theme->get( 'Version' ), true );

	// Page transitions are built on GSAP, so the script only exists where the
	// commercial distribution provides it.
	if ( wp_script_is( 'gsap', 'registered' ) ) {
		$page_transitions_deps = [ 'jquery', 'gsap', 'anima-app' ];
		$logo_loading_style = get_option( 'sm_logo_loading_style', 'progress_bar' );
		if ( 'cycling_images' === $logo_loading_style && wp_script_is( 'snapsvg', 'registered' ) ) {
			$page_transitions_deps[] = 'snapsvg';
		}
		wp_register_script( 'anima-page-transitions', trailingslashit( get_template_directory_uri() ) . 'dist/js/page-transitions' . $suffix . '.js', $page_transitions_deps, $theme->get( 'Version' ), true );
	}
}
add_action( 'init', 'anima_register_assets', 10 );

function anima_enqueue_theme_block_editor_assets() {
	$theme  = wp_get_theme( get_template() );
	$suffix = ( defined( 'SCRIPT_DEBUG' ) && SCRIPT_DEBUG ) ? '' : '.min';

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

function anima_print_scripts() {
	// The `beforeunload` handler below fades the body out to opacity 0 by
	// re-adding the `.is-loading` class on every navigation. With Page
	// Transitions ENABLED this only kicks in on hard refreshes and external
	// links — Barba intercepts normal link clicks, so beforeunload doesn't
	// fire. With Page Transitions DISABLED every link click fades the page
	// out, which reads as an implicit page transition the user didn't opt
	// into. Gate the handler on the PT toggle: keep the FOUT-preventing
	// fade-in on DOMContentLoaded unconditionally (universally useful),
	// skip the fade-out when PT is off so navigation feels crisp.
	$page_transitions_enabled = function_exists( 'anima_page_transitions_enabled' )
		? anima_page_transitions_enabled()
		: (bool) get_option( 'sm_page_transitions_enable', false );

	ob_start(); ?>

	<script>
		window.addEventListener( "DOMContentLoaded", function( event ) {
			document.body.classList.remove( "is-loading" );
			document.body.classList.add( "has-loaded" );
		} );
<?php if ( $page_transitions_enabled ) : ?>

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
<?php endif; ?>

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

/**
 * Custom template tags for this theme.
 */
require_once trailingslashit( get_template_directory() ) . 'inc/template-tags.php';

/**
 * Functions which enhance the theme by hooking into WordPress.
 */
require_once trailingslashit( get_template_directory() ) . 'inc/template-functions.php';
require_once trailingslashit( get_template_directory() ) . 'inc/site-frame.php';
require_once trailingslashit( get_template_directory() ) . 'inc/title-styles.php';
require_once trailingslashit( get_template_directory() ) . 'inc/extras.php';

/**
 * Block editor related logic.
 */
require_once trailingslashit( get_template_directory() ) . 'inc/block-editor.php';
require_once trailingslashit( get_template_directory() ) . 'inc/post-expressions.php';

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

/**
 * Commercial distribution logic (WUpdates self-updates, required-plugins
 * onboarding, Pixelgrade Care installer, CDN webfonts fallback).
 *
 * This file is stripped from the WordPress.org build, so it is loaded only
 * when present.
 */
if ( file_exists( trailingslashit( get_template_directory() ) . 'inc/distribution.php' ) ) {
	require_once trailingslashit( get_template_directory() ) . 'inc/distribution.php';
}
