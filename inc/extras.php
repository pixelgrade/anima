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
