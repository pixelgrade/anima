<?php
/**
 * The template for displaying comments.
 *
 * This is the template that displays the area of the page that contains both the current comments
 * and the comment form.
 *
 * @link https://codex.wordpress.org/Template_Hierarchy
 *
 * This template part can be overridden by copying it to a child theme or in the same theme
 * by putting it in the root `/comments.php` or in `/templates/blog/comments.php`.
 * @see pixelgrade_locate_component_template()
 *
 * HOWEVER, on occasion Pixelgrade will need to update template files and you
 * will need to copy the new files to your child theme to
 * maintain compatibility. We try to do this as little as possible, but it does
 * happen. When this occurs the version of the template file will be bumped and
 * the readme will list any important changes.
 *
 * @see        https://pixelgrade.com
 * @author     Pixelgrade
 * @package    Components/Blog
 * @version    1.0.0
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}

/*
 * If the current post is protected by a password and
 * the visitor has not yet entered the password we will
 * return early without loading the comments.
 */
if ( post_password_required() ) {
	return;
}
?>

<div id="comments" class="comments-area  o-wrapper  u-container-width">
    <div class="u-content-width">

        <input type="checkbox" name="comments-toggle" id="comments-toggle" class="c-comments-toggle__checkbox" <?php pixelgrade_comments_toggle_checked_attribute(); ?> />
        <label for="comments-toggle" class="c-btn c-comments-toggle__label">
            <span class="c-comments-toggle__icon"><?php // pixelgrade_get_component_template_part( Pixelgrade_Blog::COMPONENT_SLUG, 'svg/comments-toggle-icon' ); ?></span>
            <span class="c-comments-toggle__text">
			<?php
			/* translators: 1: the number of comments */
			printf( esc_html( _nx( '%1$s comment', '%1$s comments', get_comments_number(), 'comments title', '__components_txtd' ) ), wp_kses( number_format_i18n( get_comments_number() ), wp_kses_allowed_html() ) );
			?>
			</span>
        </label>

		<?php
		// You can start editing here -- including this comment!
		if ( have_comments() ) { ?>

			<?php if ( get_comment_pages_count() > 1 && get_option( 'page_comments' ) ) : // Are there comments to navigate through? ?>
                <nav id="comment-nav-above" class="navigation comment-navigation" role="navigation">
                    <h2 class="screen-reader-text"><?php esc_html_e( 'Comment navigation', '__components_txtd' ); ?></h2>
                    <div class="nav-links">

                        <div class="nav-previous"><?php previous_comments_link( esc_html__( 'Older Comments', '__components_txtd' ) ); ?></div>
                        <div class="nav-next"><?php next_comments_link( esc_html__( 'Newer Comments', '__components_txtd' ) ); ?></div>

                    </div><!-- .nav-links -->
                </nav><!-- #comment-nav-above -->
			<?php endif; // Check for comment navigation. ?>

            <ol class="comment-list">
				<?php
				wp_list_comments(
					array(
						'style'       => 'ol',
						'short_ping'  => true,
						'callback'    => 'pixelgrade_shape_comment',
						'avatar_size' => 56,
					)
				);
				?>
            </ol><!-- .comment-list -->

			<?php if ( get_comment_pages_count() > 1 && get_option( 'page_comments' ) ) { // Are there comments to navigate through? ?>
                <nav id="comment-nav-below" class="navigation comment-navigation" role="navigation">
                    <h2 class="screen-reader-text"><?php esc_html_e( 'Comment navigation', '__components_txtd' ); ?></h2>
                    <div class="nav-links">

                        <div
                                class="nav-previous"><?php previous_comments_link( esc_html__( 'Older Comments', '__components_txtd' ) ); ?></div>
                        <div
                                class="nav-next"><?php next_comments_link( esc_html__( 'Newer Comments', '__components_txtd' ) ); ?></div>

                    </div><!-- .nav-links -->
                </nav><!-- #comment-nav-below -->
			<?php }
		}


		// If comments are closed and there are comments, let's leave a little note, shall we?
		if ( ! comments_open() && get_comments_number() && post_type_supports( get_post_type(), 'comments' ) ) { ?>

            <p class="no-comments"><?php esc_html_e( 'Comments are closed.', '__components_txtd' ); ?></p>
			<?php
		}

		$args = array(
			'class_form'    => 'comment-form  inputs--alt',
			'comment_field' => '<p class="comment-form-comment"><label for="comment">' . esc_html_x( 'Comment', 'noun', '__components_txtd' ) .
			                   '</label><textarea id="comment" class="comment__text" name="comment" cols="45" rows="8" aria-required="true"
			                    placeholder="' . esc_attr__( 'Your comment...', '__components_txtd' ) . '">' .
			                   '</textarea></p>',
			'submit_button' => '<button name="%1$s" type="submit" id="%2$s" class="%3$s">%4$s</button>',
		);
		comment_form( $args );
		?>

    </div><!-- .comments-area__wrapper -->

</div><!-- #comments -->
