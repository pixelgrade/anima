<?php

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

if ( ! function_exists( 'pixelgrade_shape_comment' ) ) {
	/**
	 * Template for comments and pingbacks.
	 *
	 * Used as a callback by wp_list_comments() for displaying the comments.
	 *
	 * @param WP_Comment $comment
	 * @param array      $args
	 * @param int        $depth
	 */
	function pixelgrade_shape_comment( $comment, $args, $depth ) {
		$GLOBALS['comment'] = $comment; // phpcs:ignore
		switch ( $comment->comment_type ) :
			case 'pingback':
			case 'trackback':
				?>
				<li class="post pingback">
				<p><?php esc_html_e( 'Pingback:', '__theme_txtd' ); ?><?php comment_author_link(); ?><?php edit_comment_link( esc_html__( '(Edit)', '__theme_txtd' ), ' ' ); ?></p>
				<?php
				break;
			default: ?>

			<li <?php comment_class(); ?> id="li-comment-<?php comment_ID(); ?>">
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
		endswitch;
	} // function
}


if ( ! function_exists( 'pixelgrade_comments_toggle_checked_attribute' ) ) {
	/**
	 * Print the comment show/hide control's checked HTML attribute.
	 *
	 * We only accept two outcomes: either output 'checked="checked"' or nothing.
	 */
	function pixelgrade_comments_toggle_checked_attribute() {
		// If the outcome is not falsy, output the attribute.
		if ( pixelgrade_get_comments_toggle_checked_attribute() ) {
			echo 'checked="checked"';
		}
	}
}


if ( ! function_exists( 'pixelgrade_get_comments_toggle_checked_attribute' ) ) {
	/**
	 * Return the comment show/hide control's checked HTML attribute.
	 *
	 * @return string
	 */
	function pixelgrade_get_comments_toggle_checked_attribute() {
		return apply_filters( 'pixelgrade_get_comments_toggle_checked_attribute', 'checked="checked"' );
	}
}

function rosa_the_read_more_button() {
    echo rosa_get_read_more_button();
}

function rosa_get_read_more_button() {
    global $post;
	return
        '<div class="wp-block-button aligncenter is-style-text">' .
            '<a class="wp-block-button__link" href="' . get_permalink( $post->ID ) . '">' .
                __( 'Read more', 'nova' ) .
            '</a>' .
        '</div>';
}

function rosa_admin_init() {
	global $_wp_post_type_features;
	$_wp_post_type_features[ 'post' ][ 'editor' ];
}
add_action( 'admin_init', 'rosa_admin_init' );
remove_action( 'edit_form_after_title', '_wp_posts_page_notice' );


// This function should come from Customify, but we need to do our best to make things happen
if ( ! function_exists( 'pixelgrade_option' ) ) {
	/**
	 * Get option from the database
	 *
	 * @param string $option_id           The option name.
	 * @param mixed  $default             Optional. The default value to return when the option was not found or saved.
	 * @param bool   $force_given_default Optional. When true, we will use the $default value provided for when the option was not saved at least once.
	 *                                    When false, we will let the option's default set value (in the Customify settings) kick in first, then our $default.
	 *                                    It basically, reverses the order of fallback, first the option's default, then our own.
	 *                                    This is ignored when $default is null.
	 *
	 * @return mixed
	 */
	function pixelgrade_option( $option_id, $default = null, $force_given_default = false ) {
		if ( function_exists( 'PixCustomifyPlugin' ) ) {
			// Customify is present so we should get the value via it
			// We need to account for the case where a option has an 'active_callback' defined in it's config
			$options_config = PixCustomifyPlugin()->get_options_configs();
			if ( ! empty( $options_config ) && ! empty( $options_config[ $option_id ] ) ) {
				if ( ! empty( $options_config[ $option_id ]['active_callback'] ) ) {
					// This option has an active callback
					// We need to "question" it
					//
					// IMPORTANT NOTICE:
					//
					// Be extra careful when setting up the options to not end up in a circular logic
					// due to callbacks that get an option and that option has a callback that gets the initial option - INFINITE LOOPS :(
					if ( is_callable( $options_config[ $option_id ]['active_callback'] ) ) {
						// Now we call the function and if it returns false, this means that the control is not active
						// Hence it's saved value doesn't matter
						$active = call_user_func( $options_config[ $option_id ]['active_callback'] );
						if ( empty( $active ) ) {
							// If we need to force the default received; we respect that
							if ( true === $force_given_default && null !== $default ) {
								return $default;
							} else {
								// Else we return false
								// because we treat the case when the active callback returns false as if the option would be non-existent
								// We do not return the default configured value in this case
								return false;
							}
						}
					}
				}

				// Now that the option is truly active, we need to see if we are not supposed to force over the option's default value
				if ( $default !== null && false === $force_given_default ) {
					// We will not pass the received $default here so Customify will fallback on the option's default value, if set
					$customify_value = PixCustomifyPlugin()->get_option( $option_id );

					// We only fallback on the $default if none was given from Customify
					if ( null === $customify_value ) {
						return $default;
					}
				} else {
					$customify_value = PixCustomifyPlugin()->get_option( $option_id, $default );
				}

				return $customify_value;
			}
		}

		// We don't have Customify present, or Customify doesn't "know" about this option ID, so we need to retrieve the option value the hard way.
		$option_value = null;

		// Fire the all-gathering-filter that Customify uses so we can get as much data about this option as possible.
		$config = apply_filters( 'customify_filter_fields', array() );

		if ( ! isset( $config['opt-name'] ) ) {
			return $default;
		}

		$option_config = pixelgrade_get_option_customizer_config( $option_id, $config );
		if ( ! empty( $option_config ) && isset( $option_config['setting_type'] ) && 'option' === $option_config['setting_type'] ) {
			// We need to retrieve it from the wp_options table
			// If we have been explicitly given a setting ID we will use that
			if ( ! empty( $option_config['setting_id'] ) ) {
				$setting_id = $option_config['setting_id'];
			} else {
				$setting_id = $config['opt-name'] . '[' . $option_id . ']';
			}

			$option_value = get_option( $setting_id, null );
		} else {
			$values = get_theme_mod( $config['opt-name'] );

			if ( isset( $values[ $option_id ] ) ) {
				$option_value = $values[ $option_id ];
			}
		}

		if ( null !== $option_value ) {
			return $option_value;
		}

		if ( false === $force_given_default && isset( $option_config['default'] ) ) {
			return $option_config['default'];
		}

		return $default;
	}
}

function rosa_header_should_be_fixed() {
	global $post;

	if ( has_blocks( $post->post_content ) ) {
		$blocks = parse_blocks( $post->post_content );

		if ( $blocks[0]['blockName'] === 'novablocks/hero' ) {
			return true;
		}
	}

	return false;
}
