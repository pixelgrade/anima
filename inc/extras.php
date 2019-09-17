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

if ( ! function_exists( 'rosa_alter_nova_hero_block_template' ) ) {
    function rosa_alter_nova_hero_block_template( $settings ) {
        $settings['hero']['template'] = array(
		    array(
			    'novablocks/headline',
			    array(
				    'secondary' => 'This is a catchy',
			        'primary' => 'Headline',
				    'align' => 'center',
				    'level' => 1,
                    'fontSize' => 'larger',
				    'className' => 'has-larger-font-size',
			    ),
		    ),
		   	array(
			    'core/paragraph',
			    array(
				    'content' => 'A brilliant subtitle to explain its catchiness',
                    'className' => 'is-style-lead',
			    ),
		    )
	    );

        $settings['media']['template'] = array(
	        array(
		        'novablocks/headline',
		        array(
			        'secondary' => 'Discover',
			        'primary' => 'Our Story',
			        'align' => 'center',
			        'level' => 2,
                    'fontSize' => 'larger',
			        'className' => 'has-large-font-size',
		        ),
	        ),
	        array(
		        'core/separator',
		        array(
                    'style' => 'flower',
			        'className' => 'is-style-flower',
		        ),
	        ),
	        array(
		        'core/paragraph',
		        array(
			        'content' => 'Rosa is a restaurant, bar and coffee roastery located on a busy corner site in Farringdon’s Exmouth Market. With glazed frontage on two sides of the building, overlooking the market and a bustling London intersection.',
                    'align' => 'center',
		        ),
	        ),
	        array(
		        'core/button',
		        array(
			        'text' => 'About Us',
			        'align' => 'center',
                    'className' => 'is-style-text'
		        ),
	        ),
        );

        $settings['media']['attributes']['horizontalAlignment']['default'] = 'center';

        if ( ! empty( $settings['media']['blockAreaOptions'] ) ) {
            $settings['media']['blockAreaOptions'] = array_filter( $settings['media']['blockAreaOptions'], function( $option ) {
                return $option['value'] != 'highlighted';
            } );
        }

        return $settings;
    }
}
add_filter( 'novablocks_block_editor_settings', 'rosa_alter_nova_hero_block_template' );

if ( ! function_exists( 'rosa_alter_novablocks_separator_settings' ) ) {
    function rosa_alter_novablocks_separator_settings( $settings ) {
        $settings['separator']['markup'] = rosa_get_separator_markup();
        return $settings;
    }
}
add_filter( 'novablocks_block_editor_settings', 'rosa_alter_novablocks_separator_settings' );

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
