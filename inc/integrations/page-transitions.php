<?php
/**
 * Page Transitions — AJAX navigation with animated border overlay.
 *
 * Ported from the Pile theme's transition system.
 * Uses Barba.js v2 for AJAX navigation and GSAP for animations.
 *
 * @package Anima
 */

// If this file is called directly, abort.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Check if page transitions are enabled.
 *
 * @return bool
 */
function anima_page_transitions_enabled() {
	// Disabled in Customizer preview — full reloads needed for Customizer to track changes.
	if ( is_customize_preview() ) {
		return false;
	}

	$motion_toggle = get_option( 'sm_page_transitions_enable', null );
	if ( null !== $motion_toggle ) {
		return (bool) $motion_toggle;
	}

	return (bool) pixelgrade_option( 'enable_page_transitions', false );
}

/**
 * Enqueue page transitions script when the feature is enabled.
 */
function anima_page_transitions_enqueue() {
	if ( ! anima_page_transitions_enabled() ) {
		return;
	}

	wp_enqueue_script( 'anima-page-transitions' );

	// Build excluded URLs list.
	$excluded_urls = anima_page_transitions_get_excluded_urls();

	$page_transition_style = anima_get_page_transition_style();
	$logo_loading_style = anima_get_logo_loading_style();

	$localize_data = [
		'excludedUrls'        => $excluded_urls,
		'pageTransitionStyle' => $page_transition_style,
		'logoLoadingStyle'    => $logo_loading_style,
	];

	if ( 'cycling_images' === $logo_loading_style ) {
		$localize_data['loaderRandomImages'] = anima_get_random_post_image_srcs();
	}

	wp_localize_script( 'anima-page-transitions', 'animaPageTransitions', $localize_data );
}
add_action( 'wp_enqueue_scripts', 'anima_page_transitions_enqueue', 30 );

/**
 * Build the list of URLs that should skip AJAX navigation.
 *
 * @return array
 */
function anima_page_transitions_get_excluded_urls() {
	$excluded = [];

	// WooCommerce transactional and single product pages.
	if ( function_exists( 'wc_get_page_id' ) ) {
		$cart_page_id     = wc_get_page_id( 'cart' );
		$checkout_page_id = wc_get_page_id( 'checkout' );
		$myaccount_page_id = wc_get_page_id( 'myaccount' );

		if ( $cart_page_id > 0 ) {
			$excluded[] = get_permalink( $cart_page_id );
		}
		if ( $checkout_page_id > 0 ) {
			$excluded[] = get_permalink( $checkout_page_id );
		}
		if ( $myaccount_page_id > 0 ) {
			$excluded[] = get_permalink( $myaccount_page_id );
		}

		// Exclude single product pages — WooCommerce scripts and inline state
		// don't reliably survive AJAX navigation.
		$wc_permalinks = get_option( 'woocommerce_permalinks', [] );
		$product_base  = ! empty( $wc_permalinks['product_base'] ) ? trim( $wc_permalinks['product_base'], '/' ) : 'product';
		$excluded[]    = '/' . $product_base . '/';
	}

	/**
	 * Filter the URLs excluded from AJAX page transitions.
	 *
	 * @param array $excluded Array of URL strings to exclude.
	 */
	return apply_filters( 'anima_page_transitions_excluded_urls', $excluded );
}

/**
 * Get the page transition style.
 *
 * @return string 'border_iris' or 'slide_wipe'
 */
function anima_get_page_transition_style() {
	return get_option( 'sm_page_transition_style', 'border_iris' );
}

/**
 * Get the logo loading style.
 *
 * @return string 'progress_bar' or 'cycling_images'
 */
function anima_get_logo_loading_style() {
	return get_option( 'sm_logo_loading_style', 'progress_bar' );
}

/**
 * Get the transition symbol for Slide Wipe.
 * Falls back to the first alphanumeric character of the site title.
 *
 * @return string Plain text, or raw inline SVG.
 */
function anima_get_transition_symbol() {
	$symbol = get_option( 'sm_transition_symbol', '' );

	if ( ! empty( $symbol ) ) {
		// If the option contains HTML tags, treat as raw inline SVG.
		if ( $symbol !== wp_strip_all_tags( $symbol ) ) {
			return $symbol;
		}
		$string = $symbol;
	} else {
		$string = anima_first_site_title_character();
	}

	return '<svg><text id="letter" x="50%" y="50%" text-anchor="middle" alignment-baseline="central" font-size="180" font-weight="bold">' . esc_html( $string ) . '</text></svg>';
}

/**
 * Get the first alphanumeric character of the site title (UTF-8 safe).
 *
 * @return string Single character or empty string.
 */
function anima_first_site_title_character() {
	$title = get_bloginfo( 'name' );
	if ( empty( $title ) ) {
		return '';
	}

	// Try multibyte first.
	@preg_match( '/[\p{Xan}]/u', $title, $results );
	if ( ! empty( $results[0] ) ) {
		return $results[0];
	}

	// Fallback to ASCII.
	preg_match( '/[a-zA-Z\d]/', $title, $results );
	if ( ! empty( $results[0] ) ) {
		return $results[0];
	}

	return '';
}

/**
 * Get random image URLs from recent posts for Slide Wipe pattern fills.
 *
 * @param int $maxnum Maximum number of images.
 * @return array Array of thumbnail URL strings.
 */
function anima_get_random_post_image_srcs( $maxnum = 5 ) {
	$cached = get_transient( 'anima_slide_wipe_random_images' );
	if ( false !== $cached ) {
		return $cached;
	}

	// Query posts that have featured images.
	$posts = get_posts( [
		'post_type'      => 'post',
		'posts_per_page' => 50,
		'fields'         => 'ids',
		'meta_key'       => '_thumbnail_id',
		'meta_compare'   => 'EXISTS',
	] );

	if ( empty( $posts ) ) {
		// Fallback: try pages.
		$posts = get_posts( [
			'post_type'      => 'page',
			'posts_per_page' => 50,
			'fields'         => 'ids',
			'meta_key'       => '_thumbnail_id',
			'meta_compare'   => 'EXISTS',
		] );
	}

	if ( empty( $posts ) ) {
		set_transient( 'anima_slide_wipe_random_images', [], HOUR_IN_SECONDS );
		return [];
	}

	// Shuffle and pick up to $maxnum.
	shuffle( $posts );
	$posts = array_slice( $posts, 0, $maxnum );

	$srcs = [];
	foreach ( $posts as $post_id ) {
		$thumb_id = get_post_thumbnail_id( $post_id );
		if ( $thumb_id ) {
			$thumb = wp_get_attachment_image_src( $thumb_id, 'thumbnail' );
			if ( $thumb ) {
				$srcs[] = $thumb[0];
			}
		}
	}

	set_transient( 'anima_slide_wipe_random_images', $srcs, HOUR_IN_SECONDS );
	return $srcs;
}

/**
 * Output the Barba wrapper opening tag before the template HTML.
 */
function anima_page_transitions_wrapper_open() {
	if ( ! anima_page_transitions_enabled() ) {
		return;
	}

	$namespace = 'page';
	if ( is_singular() ) {
		$namespace = get_post_type();
	} elseif ( is_archive() ) {
		$namespace = 'archive';
	} elseif ( is_search() ) {
		$namespace = 'search';
	} elseif ( is_404() ) {
		$namespace = '404';
	}

	echo '<div data-barba="wrapper">';
	echo '<div data-barba="container" data-barba-namespace="' . esc_attr( $namespace ) . '">';
}
add_action( 'anima/template_html:before', 'anima_page_transitions_wrapper_open', 10 );

/**
 * Output the Barba wrapper closing tag after the template HTML.
 */
function anima_page_transitions_wrapper_close() {
	if ( ! anima_page_transitions_enabled() ) {
		return;
	}

	echo '</div><!-- [data-barba="container"] -->';
	echo '</div><!-- [data-barba="wrapper"] -->';
}
add_action( 'anima/template_html:after', 'anima_page_transitions_wrapper_close', 10 );

/**
 * Output the overlay markup in wp_footer.
 * The overlay element is determined by page transition style.
 * The content inside is determined by logo loading style.
 */
function anima_page_transitions_overlay_markup() {
	if ( ! anima_page_transitions_enabled() ) {
		return;
	}

	$page_style = anima_get_page_transition_style();
	$logo_style = anima_get_logo_loading_style();

	if ( 'slide_wipe' === $page_style ) {
		?>
		<div class="c-loader js-slide-wipe-loader">
			<div class="c-loader__mask">
				<?php anima_render_loading_content( $logo_style ); ?>
			</div>
		</div>
		<?php
	} else {
		?>
		<div class="c-page-transition-border js-page-transition-border"
		     style="border-color: var(--sm-current-accent-color); background: var(--sm-current-accent-color);">
			<?php anima_render_loading_content( $logo_style ); ?>
		</div>
		<?php
	}
}

/**
 * Render the loading content inside the overlay.
 *
 * @param string $logo_style 'progress_bar' or 'cycling_images'
 */
function anima_render_loading_content( $logo_style ) {
	if ( 'cycling_images' === $logo_style ) {
		?>
		<div class="c-loader__logo">
			<?php echo anima_get_transition_symbol(); ?>
		</div>
		<?php
	} else {
		// Use the transparent header logo if available (typically light-colored),
		// falling back to the regular custom logo.
		$logo = '';
		if ( function_exists( 'anima_has_custom_logo_transparent' ) && anima_has_custom_logo_transparent() ) {
			$logo = anima_get_custom_logo_transparent();
		} elseif ( has_custom_logo() ) {
			$logo = get_custom_logo();
		}
		?>
		<div class="border-logo-bgscale">
			<div class="border-logo-background">
				<div class="border-logo-fill"></div>
				<div class="logo"><?php echo $logo; ?></div>
			</div>
		</div>
		<div class="border-logo"><div class="logo"><?php echo $logo; ?></div></div>
		<?php
	}
}
add_action( 'wp_footer', 'anima_page_transitions_overlay_markup', 5 );

/**
 * Add body class when page transitions are enabled.
 */
function anima_page_transitions_body_class( $classes ) {
	if ( anima_page_transitions_enabled() ) {
		$classes[] = 'has-page-transitions';
		$page_style = anima_get_page_transition_style();
		$logo_style = anima_get_logo_loading_style();
		$classes[] = 'has-page-transitions--' . sanitize_html_class( $page_style );
		$classes[] = 'has-logo-loading--' . sanitize_html_class( $logo_style );
	}

	return $classes;
}
add_filter( 'body_class', 'anima_page_transitions_body_class' );
