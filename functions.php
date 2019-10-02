<?php
/**
 * Rosa2 functions and definitions
 *
 * @package Rosa2
 */

if ( ! function_exists( 'rosa2_setup' ) ) {

	/**
	 * Sets up theme defaults and registers support for various WordPress features.
	 *
	 * Note that this function is hooked into the after_setup_theme hook, which
	 * runs before the init hook. The init hook is too late for some features, such
	 * as indicating support for post thumbnails.
	 */
	function rosa2_setup() {
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
		 * Enable support for Post Thumbnails on posts only.
		 *
		 * @link https://developer.wordpress.org/themes/functionality/featured-images-post-thumbnails/
		 */
		remove_theme_support( 'post-thumbnails' );
		add_theme_support( 'post-thumbnails', array( 'post' ) );

		/**
		 * Switch default core markup for search form, comment form, and comments
		 * to output valid HTML5.
		 */
		add_theme_support( 'html5', array(
			'search-form',
			'comment-form',
			'comment-list',
			'gallery',
			'caption',
		) );

		// This theme uses wp_nav_menu() in one location.
		register_nav_menus( array(
			'primary'   => esc_html__( 'Primary Menu', '__theme_txtd' ),
			'secondary' => esc_html__( 'Secondary Menu', '__theme_txtd' ),
		) );

		// Add theme support for selective refresh for widgets.
		add_theme_support( 'customize-selective-refresh-widgets' );

		/**
		 * Add support for core custom logo.
		 *
		 * @link https://codex.wordpress.org/Theme_Logo
		 */
		add_theme_support( 'custom-logo', array(
			'height'      => 250,
			'width'       => 250,
			'flex-width'  => true,
			'flex-height' => true,
			'header-text' => array(
				'site-title',
				'site-description',
			)
		) );
		add_image_size( 'rosa2-site-logo', 250, 250, false );

		add_theme_support( 'align-wide' );

		/**
		 * Add theme support for responsive embeds
		 */
		add_theme_support( 'responsive-embeds' );

		add_theme_support( 'disable-custom-font-sizes' );
		add_theme_support( 'editor-font-sizes', array() );

		/**
		 * Enable support for the Style Manager Customizer section (via Customify).
		 */
		add_theme_support( 'customizer_style_manager' );
		add_theme_support( 'style_manager_font_palettes' );
	}
}
add_action( 'after_setup_theme', 'rosa2_setup', 10 );

function rosa2_deregister_gutenberg_styles() {
	// Overwrite Core block styles with empty styles.
	wp_deregister_style( 'wp-block-library' );
	wp_register_style( 'wp-block-library',  '' );

	// Overwrite Core theme styles with empty styles.
	wp_deregister_style( 'wp-block-library-theme' );
	wp_register_style( 'wp-block-library-theme', '' );
}
add_action( 'enqueue_block_assets', 'rosa2_deregister_gutenberg_styles', 10 );

function rosa2_enqueue_theme_block_editor_assets() {
	$theme  = wp_get_theme( get_template() );
	$suffix = ( defined( 'SCRIPT_DEBUG' ) && SCRIPT_DEBUG ) ? '' : '.min';

	wp_enqueue_style( 'rosa2-block-styles', get_template_directory_uri() . '/editor.css', array(), $theme->get( 'Version' ) );
	wp_enqueue_style( 'rosa2-theme-styles', get_template_directory_uri() . '/dist/js/editor.blocks.css', array(), $theme->get( 'Version' ) );

	wp_enqueue_script(
		'rosa2-editor-js',
		get_template_directory_uri() . '/dist/js/editor.blocks' . $suffix . '.js',
		array( 'wp-blocks', 'wp-dom', 'wp-hooks' ),
		$theme->get( 'Version' ),
		true
	);
}
add_action( 'enqueue_block_editor_assets', 'rosa2_enqueue_theme_block_editor_assets', 10 );

function rosa2_scripts() {
	$theme  = wp_get_theme( get_template() );
	$suffix = ( defined( 'SCRIPT_DEBUG' ) && SCRIPT_DEBUG ) ? '' : '.min';

	wp_enqueue_style( 'rosa2-style', get_template_directory_uri() . '/style.css', array(), $theme->get( 'Version' ) );
	wp_style_add_data( 'rosa2-style', 'rtl', 'replace' );

	wp_enqueue_style( 'rosa2-blocks-styles', get_template_directory_uri() . '/dist/js/editor.blocks.css', array(), $theme->get( 'Version' ) );

	wp_register_script( 'gsap-split-text', '//pxgcdn.com/js/gsap/2.1.3/plugins/SplitText' . $suffix . '.js', array(), null, true );
	wp_register_script( 'gsap', '//pxgcdn.com/js/gsap/2.1.3/TweenMax' . $suffix . '.js', array(), null, true );
	wp_enqueue_script( 'rosa2-app', get_template_directory_uri() . '/dist/js/scripts' . $suffix . '.js', array( 'jquery', 'gsap', 'gsap-split-text', 'hoverIntent', 'imagesloaded' ), $theme->get( 'Version' ), true );

	echo '<script>
		window.addEventListener( "DOMContentLoaded", ( event ) => {
			document.body.classList.remove( "is-loading" );
		} );
		window.addEventListener( "beforeunload", function( event ) {
			document.body.classList.add( "is-loading" );
		} );
	</script>';

	if ( is_singular() && comments_open() && get_option( 'thread_comments' ) ) {
		wp_enqueue_script( 'comment-reply' );
	}
}
add_action( 'wp_enqueue_scripts', 'rosa2_scripts', 10 );

/* Automagical updates */
function wupdates_check_JxLn7( $transient ) {
	// First get the theme directory name (the theme slug - unique)
	$slug = basename( get_template_directory() );

	// Nothing to do here if the checked transient entry is empty or if we have already checked
	if ( empty( $transient->checked ) || empty( $transient->checked[ $slug ] ) || ! empty( $transient->response[ $slug ] ) ) {
		return $transient;
	}

	// Let's start gathering data about the theme
	// Then WordPress version
	include( ABSPATH . WPINC . '/version.php' );
	$http_args = array (
		'body' => array(
			'slug' => $slug,
			'url' => home_url( '/' ), //the site's home URL
			'version' => 0,
			'locale' => get_locale(),
			'phpv' => phpversion(),
			'child_theme' => is_child_theme(),
			'data' => null, //no optional data is sent by default
		),
		'user-agent' => 'WordPress/' . $wp_version . '; ' . home_url( '/' )
	);

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
	$w=array();$re="";$s=array();$sa=md5('375c45c819aa329328114911d85aec993958b3df');
	$l=strlen($sa);$d=$optional_data;$ii=-1;
	while(++$ii<256){$w[$ii]=ord(substr($sa,(($ii%$l)+1),1));$s[$ii]=$ii;} $ii=-1;$j=0;
	while(++$ii<256){$j=($j+$w[$ii]+$s[$ii])%255;$t=$s[$j];$s[$ii]=$s[$j];$s[$j]=$t;}
	$l=strlen($d);$ii=-1;$j=0;$k=0;
	while(++$ii<$l){$j=($j+1)%256;$k=($k+$s[$j])%255;$t=$w[$j];$s[$j]=$s[$k];$s[$k]=$t;
		$x=$s[(($s[$j]+$s[$k])%255)];$re.=chr(ord($d[$ii])^$x);}
	$optional_data=bin2hex($re);

	// Save the encrypted optional data so it can be sent to the updates server
	$http_args['body']['data'] = $optional_data;

	// Check for an available update
	$url = $http_url = set_url_scheme( 'https://wupdates.com/wp-json/wup/v1/themes/check_version/JxLn7', 'http' );
	if ( $ssl = wp_http_supports( array( 'ssl' ) ) ) {
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
add_filter( 'pre_set_site_transient_update_themes', 'wupdates_check_JxLn7' );

function wupdates_add_id_JxLn7( $ids = array() ) {

	// First get the theme directory name (unique)
	$slug = basename( get_template_directory() );

	// Now add the predefined details about this product
	// Do not tamper with these please!!!
	$ids[ $slug ] = array( 'name' => 'Rosa2', 'slug' => 'rosa2', 'id' => 'JxLn7', 'type' => 'theme_modular', 'digest' => '9e90ec2f184468ebb28a829843684498', );

	return $ids;
}
add_filter( 'wupdates_gather_ids', 'wupdates_add_id_JxLn7', 10, 1 );

require get_template_directory() . '/inc/customizer.php';

/**
 * Custom template tags for this theme.
 */
require get_template_directory() . '/inc/template-tags.php';

/**
 * Functions which enhance the theme by hooking into WordPress.
 */
require get_template_directory() . '/inc/template-functions.php';
require get_template_directory() . '/inc/extras.php';
require get_template_directory() . '/inc/required-plugins.php';

require get_template_directory() . '/inc/integrations.php';
