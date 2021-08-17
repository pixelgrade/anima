<?php
/**
 * Custom template tags for this theme
 *
 * Eventually, some of the functionality here could be replaced by core features.
 *
 * @package Rosa2
 */

if ( ! function_exists( 'rosa2_posted_on' ) ) {

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
		     '<span class="screen-reader-text">' . esc_html_x( 'Posted on', 'post date', '__theme_txtd' ) . '</span>' .
		     '<a href="' . esc_url( get_permalink() ) . '" rel="bookmark">' . $time_string . '</a>' .
		     '</div>';

	}
}

if ( ! function_exists( 'rosa2_posted_by' ) ) {

	/**
	 * Prints HTML with meta information for the current author.
	 */
	function rosa2_posted_by() {
	    $author_url = esc_url( get_author_posts_url( get_the_author_meta( 'ID' ) ) );
	    $author_name = esc_html( get_the_author() );

		echo '<span class="byline">' .
		     '<div class="screen-reader-text">' . esc_html_x( 'by', 'post author', '__theme_txtd' ) . '</div>' .
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
			$categories_list = get_the_category_list( esc_html__( ', ', '__theme_txtd' ) );
			if ( $categories_list ) {
				/* translators: before list of categories. */
				echo '<div class="cat-links"><span class="screen-reader-text">' . esc_html_x( 'Posted in', 'post categories', '__theme_txtd' ) . '</span>' . $categories_list . '</div>';
			}
		}
	}
}

if ( ! function_exists( 'rosa2_tags_posted_in' ) ) {
	function rosa2_tags_posted_in() {
		// Hide category and tag text for pages.
		if ( 'post' === get_post_type() ) {
			/* translators: used between list items, there is a space after the comma */
			$tags_list = get_the_tag_list( '', esc_html_x( ', ', 'list item separator', '__theme_txtd' ) );
			if ( $tags_list ) {
				/* translators: before list of tags. */
				echo '<div class="tags-links"><span class="screen-reader-text">' . esc_html_x( 'Tagged', 'post tags', '__theme_txtd' ) . '</span>' . $tags_list . '</div>';
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
						__( 'Leave a Comment<span class="screen-reader-text"> on %s</span>', '__theme_txtd' ),
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
					__( 'Edit <span class="screen-reader-text">%s</span>', '__theme_txtd' ),
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

if ( ! function_exists( 'rosa2_post_thumbnail' ) ) {
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
}

if ( ! function_exists( 'rosa2_the_separator' ) ) {
    function rosa2_the_separator( $style = 'default' ) {
        echo '<div class="wp-block-separator has-text-align-center is-style-' . esc_attr( $style ) . '">' . rosa2_get_separator_markup() . '</div>';
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
		$symbol = pixelgrade_option( 'separator_symbol', 'fleuron-1' );
        ob_start();
        get_template_part( 'template-parts/separators/' . $symbol . '-svg' );
        return ob_get_clean();
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
				$output .= '<span class="c-footer__credits">' . sprintf( esc_html__( 'Theme: %1$s by %2$s.', '__theme_txtd' ), esc_html( pixelgrade_get_original_theme_name() ), '<a href="https://pixelgrade.com/?utm_source=rosa2-clients&utm_medium=footer&utm_campaign=rosa2" title="' . esc_html__( 'The Pixelgrade Website', '__theme_txtd' ) . '" rel="nofollow">Pixelgrade</a>' ) . '</span>' . "\n";
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

if ( ! function_exists( 'rosa2_shape_comment' ) ) {
	/**
	 * Template for comments and pingbacks.
	 *
	 * Used as a callback by wp_list_comments() for displaying the comments.
	 *
	 * @param WP_Comment $comment
	 * @param array $args
	 * @param int $depth
	 */
	function rosa2_shape_comment( $comment, $args, $depth ) {
		$GLOBALS['comment'] = $comment; // phpcs:ignore
		switch ( $comment->comment_type ) {
			case 'pingback':
			case 'trackback': ?>

				<li class="post pingback">
				<p><?php esc_html_e( 'Pingback:', '__theme_txtd' ); ?><?php comment_author_link(); ?><?php edit_comment_link( esc_html__( '(Edit)', '__theme_txtd' ), ' ' ); ?></p>
				<?php
				break;
			default: ?>

			<li <?php comment_class(); ?> id="comment-<?php comment_ID(); ?>">
				<article id="div-comment-<?php comment_ID(); ?>" class="comment__wrapper">
					<?php if ( 0 != $args['avatar_size'] ) : ?>
						<div class="comment__avatar"><?php echo get_avatar( $comment, $args['avatar_size'] ); ?></div>
					<?php endif; ?>

					<div class="comment__body">

						<header class="comment__header">

							<div class="comment__author vcard">
								<?php
								/* translators: %s: comment author link */
								printf( wp_kses_post( __( '%s <span class="says">says:</span>', '__theme_txtd' ) ), sprintf( '<b class="fn">%s</b>', get_comment_author_link( $comment ) ) );
								?>
							</div><!-- .comment-author -->

							<div class="comment__metadata">
								<a href="<?php echo esc_url( get_comment_link( $comment, $args ) ); ?>">
									<time datetime="<?php esc_attr( get_comment_time( 'c' ) ); ?>">
										<?php
										/* translators: 1: comment date, 2: comment time */
										printf( esc_html__( '%1$s at %2$s', '__theme_txtd' ), esc_html( get_comment_date( '', $comment ) ), esc_html( get_comment_time() ) );
										?>
									</time>
								</a>
								<?php edit_comment_link( esc_html__( 'Edit', '__theme_txtd' ), '<span class="comment__edit">', '</span>' ); ?>
							</div><!-- .comment-metadata -->

							<?php if ( '0' == $comment->comment_approved ) : ?>
								<p class="comment-awaiting-moderation"><?php esc_html_e( 'Your comment is awaiting moderation.', '__theme_txtd' ); ?></p>
							<?php endif; ?>

						</header><!-- .comment-meta -->

						<div class="comment__content">
							<?php comment_text( $comment ); ?>
						</div><!-- .comment-content -->

						<?php
						comment_reply_link(
							array_merge(
								$args, array(
									'add_below' => 'div-comment',
									'depth'     => $depth,
									'max_depth' => $args['max_depth'],
									'before'    => '<div class="comment__reply">',
									'after'     => '</div>',
								)
							),
							$comment
						);
						?>
					</div>
				</article><!-- .comment-body -->
				<?php
				break;
		}
	}
}

if ( ! function_exists( 'rosa2_comments_toggle_checked_attribute' ) ) {
	/**
	 * Print the comment show/hide control's checked HTML attribute.
	 *
	 * We only accept two outcomes: either output 'checked="checked"' or nothing.
	 */
	function rosa2_comments_toggle_checked_attribute() {
		echo rosa2_get_comments_toggle_checked_attribute();
	}
}

if ( ! function_exists( 'rosa2_get_comments_toggle_checked_attribute' ) ) {
	/**
	 * Return the comment show/hide control's checked HTML attribute.
	 *
	 * @return string
	 */
	function rosa2_get_comments_toggle_checked_attribute() {
		$attribute = 'checked';

		return apply_filters( 'pixelgrade_get_comments_toggle_checked_attribute', $attribute );
	}
}

if ( ! function_exists( 'rosa2_the_read_more_button' ) ) {
	function rosa2_the_read_more_button() {
		echo rosa2_get_read_more_button();
	}
}

if ( ! function_exists( 'rosa2_get_read_more_button' ) ) {
	function rosa2_get_read_more_button() {

		return
			'<div class="wp-block-button aligncenter is-style-text">' .
			'<a class="wp-block-button__link" href="' . esc_url( get_permalink() ) . '">' . sprintf( wp_kses_post( __( 'Read more <span class="screen-reader-text">about "%s"</span>', '__theme_txtd' ) ), get_the_title() ) . '</a>' .
			'</div>';
	}
}

if ( ! function_exists( 'rosa2_the_posts_pagination' ) ) {
	/**
	 * Displays a paginated navigation to next/previous set of posts, when applicable.
	 *
	 * @param array $args Optional. See paginate_links() for available arguments.
	 *                    Default empty array.
	 */
	function rosa2_the_posts_pagination( $args = array() ) { ?>

        <!-- Use Group Inner Container, -->
        <!-- so we can have access to Sidecar Grid.-->
        <div class="wp-block-group__inner-container">
            <?php echo rosa2_get_the_posts_pagination( $args ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
        </div>

    <?php
	}
}

if ( ! function_exists( 'rosa2_get_the_posts_pagination' ) ) {
	/**
	 * Retrieves a paginated navigation to next/previous set of posts, when applicable.
	 *
	 * @param array $args Optional. See paginate_links() for options.
	 *
	 * @return string Markup for pagination links.
	 */
	function rosa2_get_the_posts_pagination( $args = array() ) {
		// Put our own defaults in place
		$args = wp_parse_args(
			$args, array(
				'end_size'           => 1,
				'mid_size'           => 2,
				'type'               => 'plain',
				'prev_text'          => esc_html_x( 'Previous', 'previous set of posts', '__theme_txtd' ),
				'next_text'          => esc_html_x( 'Next', 'next set of posts', '__theme_txtd' ),
				'screen_reader_text' => esc_html__( 'Posts navigation', '__theme_txtd' ),
			)
		);

		return get_the_posts_pagination( $args );
	}
}

/**
 * Displays the navigation to next/previous post, when applicable.
 *
 * @param array $args Optional. See get_the_post_navigation() for available arguments.
 *                    Default empty array.
 * @return void
 */
function rosa2_the_post_navigation( $args = array() ) {
	echo rosa2_get_the_post_navigation( $args ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
}

if ( ! function_exists( 'rosa2_get_the_post_navigation' ) ) {
	/**
	 * Retrieves the navigation to next/previous post, when applicable.
	 *
	 * @param array $args {
	 *     Optional. Default post navigation arguments. Default empty array.
	 *
	 * @type string $prev_text Anchor text to display in the previous post link. Default '%title'.
	 * @type string $next_text Anchor text to display in the next post link. Default '%title'.
	 * @type bool $in_same_term Whether link should be in a same taxonomy term. Default false.
	 * @type array|string $excluded_terms Array or comma-separated list of excluded term IDs. Default empty.
	 * @type string $taxonomy Taxonomy, if `$in_same_term` is true. Default 'category'.
	 * @type string $screen_reader_text Screen reader text for nav element. Default 'Post navigation'.
	 * }
	 * @return string Markup for post links.
	 */
	function rosa2_get_the_post_navigation( $args = array() ) {
		$args = wp_parse_args(
			$args, array(
				'prev_text'          => '%title',
				'next_text'          => '%title',
				'in_same_term'       => false,
				'excluded_terms'     => '',
				'taxonomy'           => 'category',
				'screen_reader_text' => esc_html__( 'Post navigation', '__theme_txtd' ),
			)
		);

		$navigation = '';

		$previous = get_previous_post_link(
			'<div class="post-navigation__link post-navigation__link--previous"><span class="post-navigation__link-label  post-navigation__link-label--previous">' . esc_html__( 'Previous article', '__theme_txtd' ) . '</span><span class="post-navigation__post-title  post-navigation__post-title--previous">%link</span></div>',
			$args['prev_text'],
			$args['in_same_term'],
			$args['excluded_terms'],
			$args['taxonomy']
		);

		$next = get_next_post_link(
			'<div class="post-navigation__link post-navigation__link--next"><span class="post-navigation__link-label  post-navigation__link-label--next">' . esc_html__( 'Next article', '__theme_txtd' ) . '</span><span class="post-navigation__post-title  post-navigation__post-title--next">%link</span></div>',
			$args['next_text'],
			$args['in_same_term'],
			$args['excluded_terms'],
			$args['taxonomy']
		);

		// Only add markup if there's somewhere to navigate to.
		if ( $previous || $next ) {
			$navigation = _navigation_markup( $previous . $next, 'post-navigation', $args['screen_reader_text'] );
		}

		return apply_filters( 'rosa2_get_the_post_navigation', $navigation, $args );
	}
}

if ( ! function_exists( 'rosa2_is_active_sidebar' ) ) {
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
	function rosa2_is_active_sidebar( $index ) {
		global $wp_registered_sidebars;

		$index             = ( is_int( $index ) ) ? "sidebar-$index" : sanitize_title( $index );
		$sidebars_widgets  = wp_get_sidebars_widgets();
		$is_active_sidebar = ! empty( $wp_registered_sidebars[ $index ] ) && ! empty( $sidebars_widgets[ $index ] );

		// We have simply omitted to apply the "is_active_sidebar" filter.
		return $is_active_sidebar;
	}
}

if ( ! function_exists( 'rosa2_get_the_author_info_box' ) ) {

	/**
	 * Get the HTML of the author info box
	 *
	 * @return string
	 */
	function rosa2_get_the_author_info_box() {
		// Get the current post for easy use
		$post = get_post();

		// Bail if no post
		if ( empty( $post ) ) {
			return '';
		}

		// If we aren't on a single post or it's a single post without author, don't continue.
		if ( ! is_single() || ! isset( $post->post_author ) ) {
			return '';
		}

		// Get author's biographical information or description
		$user_description = get_the_author_meta( 'user_description', $post->post_author );
		// If an author doesn't have a description, don't display the author info box
		if ( empty( $user_description ) ) {
			return '';
		}

		$author_details = '';

		// Get author's display name
		$display_name = get_the_author_meta( 'display_name', $post->post_author );

		// If display name is not available then use nickname as display name
		if ( empty( $display_name ) ) {
			$display_name = get_the_author_meta( 'nickname', $post->post_author );
		}

		if ( ! empty( $user_description ) ) {
			$author_details .= '<div class="c-author has-description" itemscope itemtype="http://schema.org/Person">';
		} else {
			$author_details .= '<div class="c-author" itemscope itemtype="http://schema.org/Person">';
		}

		// The author avatar
		$author_avatar = get_avatar( get_the_author_meta( 'user_email' ), 100 );
		if ( ! empty( $author_avatar ) ) {
			$author_details .= '<div class="c-author__avatar">' . $author_avatar . '</div>';
		}

		$author_details .= '<div class="c-author__details">';

		if ( ! empty( $display_name ) ) {
			$author_details .= '<span class="c-author__name h3">' . esc_html( $display_name ) . '</span>';
		}

		// The author bio
		if ( ! empty( $user_description ) ) {
			$author_details .= '<p class="c-author__description" itemprop="description">' . nl2br( $user_description ) . '</p>';
		}

		$author_details .= '<footer class="c-author__footer">';

		$author_details .= rosa2_get_author_bio_links( $post->ID );

		$author_details .= '</footer>';
		$author_details .= '</div><!-- .c-author__details -->';
		$author_details .= '</div><!-- .c-author -->';

		return $author_details;
	} // function
}

if ( ! function_exists( 'rosa2_get_author_bio_links' ) ) {
	/**
	 * Return the markup for the author bio links.
	 * These are the links/websites added by one to it's Gravatar profile
	 *
	 * @param int|WP_Post $post_id Optional. Post ID or post object.
	 * @return string The HTML markup of the author bio links list.
	 */
	function rosa2_get_author_bio_links( $post_id = null ) {
		$post   = get_post( $post_id );
		$markup = '';
		if ( empty( $post ) ) {
			return $markup;
		}

		// Get author's website URL
		$user_website = get_the_author_meta( 'url', $post->post_author );

		// Get link to the author archive page
		$user_posts = get_author_posts_url( get_the_author_meta( 'ID', $post->post_author ) );

		$str     = wp_remote_fopen( 'https://www.gravatar.com/' . md5( strtolower( trim( get_the_author_meta( 'user_email' ) ) ) ) . '.php' );
		$profile = unserialize( $str );

		$markup .= "<span class=\"c-author__links\">\n";

		/* translators: %s: the author name */
		$markup .= '<a class="c-author__social-link  c-author__website-link h5" href="' . esc_url( $user_posts ) . '" rel="author" title="' . esc_attr( sprintf( esc_html__( 'View all posts by %s', '__components_txtd' ), get_the_author() ) ) . '">' . esc_html__( 'All posts', '__components_txtd' ) . '</a>';

		if ( is_array( $profile ) && ! empty( $profile['entry'][0]['urls'] ) ) {
			foreach ( $profile['entry'][0]['urls'] as $link ) {
				if ( ! empty( $link['value'] ) && ! empty( $link['title'] ) ) {
					$markup .= '<a class="c-author__social-link h5" href="' . esc_url( $link['value'] ) . '" target="_blank">' . $link['title'] . "</a>\n";
				}
			}
		}

		if ( ! empty( $user_website ) ) {
			$markup .= '<a class="c-author__social-link h5" href="' . esc_url( $user_website ) . '" target="_blank">' . esc_html__( 'Website', '__components_txtd' ) . "</a>\n";
		}
		$markup .= "</span>\n";

		return $markup;
	} // function
}
