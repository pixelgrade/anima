<?php
/**
 * Custom template tags for this theme
 *
 * Eventually, some of the functionality here could be replaced by core features.
 *
 * @package Anima
 */

if ( ! function_exists( 'anima_categories_posted_in' ) ) {
	function anima_categories_posted_in() {
		// Hide category and tag text for pages.
		if ( 'post' === get_post_type() ) {
			/* translators: used between list items, there is a space after the comma */
			$categories_list = get_the_category_list( esc_html__( ', ', '__theme_txtd' ) );
			if ( $categories_list ) {
				/* translators: before list of categories. */
				echo '<div class="cat-links"><span class="screen-reader-text">' . esc_html_x( 'Posted in', 'post categories', '__theme_txtd' ) . '</span>' . $categories_list . '</div>';
			}
		}
	}
}

if ( ! function_exists( ' anima_get_custom_logo_transparent' ) ) {
	/**
	 * Returns a custom logo, linked to home.
	 *
	 * @param int $blog_id Optional. ID of the blog in question. Default is the ID of the current blog.
	 *
	 * @return string Custom logo transparent markup.
	 */
	function anima_get_custom_logo_transparent( int $blog_id = 0 ): string {
		$html          = '';
		$switched_blog = false;

		if ( is_multisite() && ! empty( $blog_id ) && get_current_blog_id() !== absint( $blog_id ) ) {
			switch_to_blog( $blog_id );
			$switched_blog = true;
		}

		$custom_logo_id = get_theme_mod( 'anima_transparent_logo' );

		// We have a logo. Logo is go.
		if ( $custom_logo_id ) {
			$html = sprintf(
				'<a href="%1$s" class="custom-logo-link  custom-logo-link--inversed" rel="home" itemprop="url">%2$s</a>',
				esc_url( home_url( '/' ) ),
				wp_get_attachment_image(
					$custom_logo_id, 'large', false, [
						'class'    => 'custom-logo--transparent',
						'itemprop' => 'logo',
					]
				)
			);
		} // If no logo is set but we're in the Customizer, leave a placeholder (needed for the live preview).
		elseif ( is_customize_preview() ) {
			$html = sprintf(
				'<a href="%1$s" class="custom-logo-link  custom-logo-link--inversed" style="display:none;"></a>',
				esc_url( home_url( '/' ) )
			);
		}

		if ( $switched_blog ) {
			restore_current_blog();
		}

		/**
		 * Filters the custom logo output.
		 *
		 * @param string $html    Custom logo HTML output.
		 * @param int    $blog_id ID of the blog to get the custom logo for.
		 */
		return apply_filters( 'anima/get_custom_logo_transparent', $html, $blog_id );
	}
}

if ( ! function_exists( ' anima_the_custom_logo_transparent' ) ) {
	/**
	 * Displays a custom logo transparent, linked to home.
	 *
	 * @param int $blog_id Optional. ID of the blog in question. Default is the ID of the current blog.
	 */
	function anima_the_custom_logo_transparent( int $blog_id = 0 ) {
		echo anima_get_custom_logo_transparent( $blog_id ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
	}
}

if ( ! function_exists( 'anima_footer_get_copyright' ) ) {
	/**
	 * Get the footer copyright markup.
	 */
	function anima_footer_get_copyright() {
		$copyright_text = anima_footer_get_copyright_content();
		$output         = '';
		if ( ! empty( $copyright_text ) ) {
			$output       .= '<!-- wp:group {"className":"site-info"} -->
<div class="wp-block-group break-align-left break-align-right sm-palette-1 sm-variation-1 sm-color-signal-0 site-info" style="--nb-emphasis-top-spacing:0;--nb-emphasis-bottom-spacing:0;--nb-block-top-spacing:1;--nb-block-bottom-spacing:0;--nb-block-zindex:0;--nb-card-content-area-width:50%;--nb-card-media-container-height:50px;--nb-card-content-padding-multiplier:0;--nb-card-media-padding-top:100%;--nb-card-media-object-fit:cover;--nb-card-media-padding-multiplier:0;--nb-card-layout-gap-modifier:0;--nb-minimum-container-height:0vh;--nb-spacing-modifier:1;--nb-emphasis-area:100px" data-palette="1" data-palette-variation="1" data-color-signal="0">' . "\n";
			$output       .= '<!-- wp:paragraph {"align":"right"} -->
<p class="has-text-align-right has-normal-font-size alignright">';
			$output       .= $copyright_text . "\n";
			$hide_credits = pixelgrade_option( 'footer_hide_credits', false );
			if ( empty( $hide_credits ) ) {
				$output .= '<span class="c-footer__credits">' . sprintf( esc_html__( 'Theme: %1$s by %2$s.', '__theme_txtd' ), esc_html( pixelgrade_get_original_theme_name() ), '<a href="https://pixelgrade.com/?utm_source=anima-clients&utm_medium=footer&utm_campaign=anima" title="' . esc_html__( 'The Pixelgrade Website', '__theme_txtd' ) . '" rel="nofollow">Pixelgrade</a>' ) . '</span>' . "\n";
			}
			$output .= '</p><!-- /wp:paragraph -->';
			$output .= '</div><!-- /wp:group -->';
		}

		return apply_filters( 'anima/footer_get_copyright', $output );
	}
}

if ( ! function_exists( 'anima_footer_get_copyright_content' ) ) {
	/**
	 * Get the footer copyright content (HTML or simple text).
	 * It already has do_shortcode applied.
	 *
	 * @return string
	 */
	function anima_footer_get_copyright_content(): string {
		$copyright_text = apply_filters( 'anima/footer_copyright_text', esc_html__( '&copy; %year% %site-title%.', '__theme_txtd' ) );
		if ( ! empty( $copyright_text ) ) {
			// We need to parse some tags
			return anima_parse_content_tags( $copyright_text );
		}

		return '';
	}
}


if ( ! function_exists( 'anima_is_active_sidebar' ) ) {
	/**
	 * Determines whether a sidebar is in use.
	 *
	 * This is a modified version of the core template tag is_active_sidebar() due to the fact that it conflicted with
	 * the Customizer logic for displaying available widget areas. See WP_Customize_Widgets::tally_sidebars_via_is_active_sidebar_calls()
	 *
	 * Also see this discussion: https://core.trac.wordpress.org/ticket/39087#comment:12
	 *
	 * @param string|int $index Sidebar name, id or number to check.
	 *
	 * @return bool true if the sidebar is in use, false otherwise.
	 */
	function anima_is_active_sidebar( $index ): bool {
		global $wp_registered_sidebars;

		$index             = ( is_int( $index ) ) ? "sidebar-$index" : sanitize_title( $index );
		$sidebars_widgets  = wp_get_sidebars_widgets();
		$is_active_sidebar = ! empty( $wp_registered_sidebars[ $index ] ) && ! empty( $sidebars_widgets[ $index ] );

		// We have simply omitted to apply the "is_active_sidebar" filter.
		return $is_active_sidebar;
	}
}

if ( ! class_exists( 'PixCustomifyPlugin' ) && ! function_exists( 'Pixelgrade\StyleManager\plugin' ) && ! function_exists( 'pixelgrade_option' ) ) {
	function pixelgrade_option( $settings_id, $default = null, $force_given_default = false ) {
		return get_option( $settings_id, $default );
	}
}
