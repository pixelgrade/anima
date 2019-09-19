<?php
/**
 * Custom template tags for this theme
 *
 * Eventually, some of the functionality here could be replaced by core features.
 *
 * @package Rosa2
 */

if ( ! function_exists( 'rosa2_posted_on' ) ) :
	/**
	 * Prints HTML with meta information for the current post-date/time.
	 */
	function rosa2_posted_on() {
		$time_string = '<time class="entry-date published" datetime="%1$s">%2$s</time>';

		$time_string = sprintf( $time_string,
			esc_attr( get_the_date( DATE_W3C ) ),
			esc_html( get_the_date() )
		);

        /* translators: before post date. */
		echo '<div class="posted-on">' .
            '<span class="screen-reader-text">' . esc_html_x( 'Posted on', 'post date', 'nova' ) . '</span>' .
		     '<a href="' . esc_url( get_permalink() ) . '" rel="bookmark">' . $time_string . '</a>' .
        '</div>';

	}
endif;

if ( ! function_exists( 'rosa2_posted_by' ) ) {

	/**
	 * Prints HTML with meta information for the current author.
	 */
	function rosa2_posted_by() {
	    $author_url = esc_url( get_author_posts_url( get_the_author_meta( 'ID' ) ) );
	    $author_name = esc_html( get_the_author() );

		echo '<span class="byline">' .
             '<div class="screen-reader-text">' . esc_html_x( 'by', 'post author', 'nova' ) . '</div>' .
		     '<span class="author vcard"><a class="url fn n" href="' . $author_url . '">' . $author_name . '</a></span>' .
         '</span>'; // WPCS: XSS OK.

	}
}

if ( ! function_exists( 'rosa2_posted_in' ) ) {
    function rosa2_posted_in() {
        rosa2_categories_posted_in();
        rosa2_tags_posted_in();
    }
}

if ( ! function_exists( 'rosa2_categories_posted_in' ) ) {
	function rosa2_categories_posted_in() {
		// Hide category and tag text for pages.
		if ( 'post' === get_post_type() ) {
			/* translators: used between list items, there is a space after the comma */
			$categories_list = get_the_category_list( esc_html__( ', ', 'nova' ) );
			if ( $categories_list ) {
				/* translators: before list of categories. */
				echo '<div class="cat-links"><span class="screen-reader-text">' . esc_html_x( 'Posted in', 'post categories', 'nova' ) . '</span>' .  $categories_list . '</div>';
			}
		}
	}
}

if ( ! function_exists( 'rosa2_tags_posted_in' ) ) {
	function rosa2_tags_posted_in() {
		// Hide category and tag text for pages.
		if ( 'post' === get_post_type() ) {
			/* translators: used between list items, there is a space after the comma */
			$tags_list = get_the_tag_list( '', esc_html_x( ', ', 'list item separator', 'nova' ) );
			if ( $tags_list ) {
				/* translators: before list of tags. */
				echo '<div class="tags-links"><span class="screen-reader-text">' . esc_html_x( 'Tagged', 'post tags', 'nova' ) . '</span>' .  $tags_list . '</div>';
			}
		}
	}
}

if ( ! function_exists( 'rosa2_comments_link' ) ) {
	function rosa2_comments_link() {
		if ( ! is_single() && ! post_password_required() && ( comments_open() || get_comments_number() ) ) {
			echo '<div class="comments-link">';
			comments_popup_link(
				sprintf(
					wp_kses(
					/* translators: %s: post title */
						__( 'Leave a Comment<span class="screen-reader-text"> on %s</span>', 'nova' ),
						array(
							'span' => array(
								'class' => array(),
							),
						)
					),
					get_the_title()
				)
			);
			echo '</div>';
		}
	}
}

if ( ! function_exists( 'rosa2_edit_post_link' ) ) {
	/**
	 * Prints HTML with meta information for the categories, tags and comments.
	 */
	function rosa2_edit_post_link() {

		edit_post_link(
			sprintf(
				wp_kses(
					/* translators: %s: Name of current post. Only visible to screen readers */
					__( 'Edit <span class="screen-reader-text">%s</span>', 'nova' ),
					array(
						'span' => array(
							'class' => array(),
						),
					)
				),
				get_the_title()
			),
			'<div class="edit-link">',
			'</div>'
		);
	}
}

if ( ! function_exists( 'rosa2_post_thumbnail' ) ) :
	/**
	 * Displays an optional post thumbnail.
	 *
	 * Wraps the post thumbnail in an anchor element on index views, or a div
	 * element when on single views.
	 */
	function rosa2_post_thumbnail() {
		if ( post_password_required() || is_attachment() || ! has_post_thumbnail() ) {
			return;
		}

		if ( is_singular() ) { ?>

			<div class="post-thumbnail">
				<?php the_post_thumbnail(); ?>
			</div><!-- .post-thumbnail -->

		<?php } else { ?>

			<a class="post-thumbnail" href="<?php the_permalink(); ?>" aria-hidden="true" tabindex="-1">
				<?php
				the_post_thumbnail( 'post-thumbnail', array(
					'alt' => the_title_attribute( array(
						'echo' => false,
					) ),
				) ); ?>
			</a>

			<?php
		}
	}
endif;

if ( ! function_exists( 'rosa2_the_separator' ) ) {
    function rosa2_the_separator( $style = 'default' ) {
        echo '<div class="wp-block-separator is-style-' . esc_attr( $style ) . '">' . rosa2_get_separator_markup() . '</div>';
    }
}

if ( ! function_exists( 'rosa2_get_separator_markup' ) ) {
    function rosa2_get_separator_markup() {
        ob_start();
        ?>
        <div class="c-separator">
            <div class="c-separator__arrow c-separator__arrow--left"></div>
            <div class="c-separator__line c-separator__line--left"></div>
            <div class="c-separator__symbol">
                <span><?php echo rosa2_get_separator_symbol(); ?></span>
            </div>
            <div class="c-separator__line c-separator__line--right"></div>
            <div class="c-separator__arrow c-separator__arrow--right"></div>
        </div>
        <?php return apply_filters( 'rosa_separator_markup', ob_get_clean() );
    }
}

if ( ! function_exists( 'rosa2_get_separator_symbol' ) ) {
	function rosa2_get_separator_symbol() {
        ob_start();
        $symbol = pixelgrade_option( 'separator_symbol', 'fleuron-1' );
        get_template_part( 'template-parts/separators/' . $symbol . '-svg' );
        return ob_get_clean();
	}
}

if ( ! function_exists( ' rosa2_woocommerce_pagination_args' ) ) {
	function rosa2_woocommerce_pagination_args() {

		$args =  array(
				'end_size'           => 1,
				'mid_size'           => 2,
				'type'               => 'list',
				'prev_text' => esc_html_x( 'Previous', 'previous set of posts', '__theme_txtd' ),
				'next_text' => esc_html_x( 'Next', 'next set of posts', '__theme_txtd' ),
			);

		return $args;
    }
}

if ( ! function_exists( ' rosa2_has_custom_logo_transparent' ) ) {
	/**
	 * Determines whether the site has a custom transparent logo.
	 *
	 * @param int $blog_id Optional. ID of the blog in question. Default is the ID of the current blog.
	 *
	 * @return bool Whether the site has a custom logo or not.
	 */
	function rosa2_has_custom_logo_transparent( $blog_id = 0 ) {
		$switched_blog = false;

		if ( is_multisite() && ! empty( $blog_id ) && get_current_blog_id() !== absint( $blog_id ) ) {
			switch_to_blog( $blog_id );
			$switched_blog = true;
		}

		$custom_logo_id = get_theme_mod( 'rosa_transparent_logo' );

		if ( $switched_blog ) {
			restore_current_blog();
		}

		return (bool) $custom_logo_id;
	}
}

if ( ! function_exists( ' rosa2_get_custom_logo_transparent' ) ) {
	/**
	 * Returns a custom logo, linked to home.
	 *
	 * @param int $blog_id Optional. ID of the blog in question. Default is the ID of the current blog.
	 *
	 * @return string Custom logo transparent markup.
	 */
	function rosa2_get_custom_logo_transparent( $blog_id = 0 ) {
		$html          = '';
		$switched_blog = false;

		if ( is_multisite() && ! empty( $blog_id ) && get_current_blog_id() !== absint( $blog_id ) ) {
			switch_to_blog( $blog_id );
			$switched_blog = true;
		}

		$custom_logo_id = get_theme_mod( 'rosa_transparent_logo' );

		// We have a logo. Logo is go.
		if ( $custom_logo_id ) {
			$html = sprintf(
				'<a href="%1$s" class="custom-logo-link  custom-logo-link--inversed" rel="home" itemprop="url">%2$s</a>',
				esc_url( home_url( '/' ) ),
				wp_get_attachment_image(
					$custom_logo_id, 'large', false, array(
						'class'    => 'custom-logo--transparent',
						'itemprop' => 'logo',
					)
				)
			);
		} // If no logo is set but we're in the Customizer, leave a placeholder (needed for the live preview).
		elseif ( is_customize_preview() ) {
			$html = sprintf(
				'<a href="%1$s" class="custom-logo-link  custom-logo-link--inversed" style="display:none;"><img class="custom-logo--transparent"/></a>',
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
		return apply_filters( 'rosa2_get_custom_logo_transparent', $html, $blog_id );
	}
}

if ( ! function_exists( ' rosa2_the_custom_logo_transparent' ) ) {
	/**
	 * Displays a custom logo transparent, linked to home.
	 *
	 * @param int $blog_id Optional. ID of the blog in question. Default is the ID of the current blog.
	 */
	function rosa2_the_custom_logo_transparent( $blog_id = 0 ) {
		echo rosa2_get_custom_logo_transparent( $blog_id ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
	}
}

if ( ! function_exists( 'rosa2_footer_the_copyright' ) ) {
	/**
	 * Display the footer copyright.
	 */
	function rosa2_footer_the_copyright() {
		$copyright_text = rosa2_footer_get_copyright_content();
		$output         = '';
		if ( ! empty( $copyright_text ) ) {
			$output       .= '<div class="site-info">' . "\n";
			$output       .= $copyright_text . "\n";
			$hide_credits = pixelgrade_option( 'footer_hide_credits', false );
			if ( empty( $hide_credits ) ) {
				$output .= '<span class="c-footer__credits">' . sprintf( esc_html__( 'Made with love by %s', '__theme_txtd' ), '<a href="https://pixelgrade.com/?utm_source=rosa2-clients&utm_medium=footer&utm_campaign=rosa2" title="' . esc_html__( 'The Pixelgrade Website', '__theme_txtd' ) . '" rel="nofollow">Pixelgrade</a>' ) . '</span>' . "\n";
			}
			$output .= '</div>';
		}
		echo apply_filters( 'rosa2_footer_the_copyright', $output );
	}
}

if ( ! function_exists( 'rosa2_footer_get_copyright_content' ) ) {
	/**
	 * Get the footer copyright content (HTML or simple text).
	 * It already has do_shortcode applied.
	 *
	 * @return bool|string
	 */
	function rosa2_footer_get_copyright_content() {
		$copyright_text = apply_filters( 'rosa2_footer_copyright_text', esc_html__( '&copy; %year% %site-title%.', '__theme_txtd' ) );
		if ( ! empty( $copyright_text ) ) {
			// We need to parse some tags
			return rosa2_parse_content_tags( $copyright_text );
		}

		return '';
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
