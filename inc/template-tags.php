<?php
/**
 * Custom template tags for this theme
 *
 * Eventually, some of the functionality here could be replaced by core features.
 *
 * @package Nova
 */

if ( ! function_exists( 'novablocks_posted_on' ) ) :
	/**
	 * Prints HTML with meta information for the current post-date/time.
	 */
	function novablocks_posted_on() {
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

if ( ! function_exists( 'novablocks_posted_by' ) ) {

	/**
	 * Prints HTML with meta information for the current author.
	 */
	function novablocks_posted_by() {
	    $author_url = esc_url( get_author_posts_url( get_the_author_meta( 'ID' ) ) );
	    $author_name = esc_html( get_the_author() );

		echo '<span class="byline">' .
             '<div class="screen-reader-text">' . esc_html_x( 'by', 'post author', 'nova' ) . '</div>' .
		     '<span class="author vcard"><a class="url fn n" href="' . $author_url . '">' . $author_name . '</a></span>' .
         '</span>'; // WPCS: XSS OK.

	}
}

if ( ! function_exists( 'novablocks_posted_in' ) ) {
    function novablocks_posted_in() {
        novablocks_categories_posted_in();
        novablocks_tags_posted_in();
    }
}

if ( ! function_exists( 'novablocks_categories_posted_in' ) ) {
	function novablocks_categories_posted_in() {
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

if ( ! function_exists( 'novablocks_tags_posted_in' ) ) {
	function novablocks_tags_posted_in() {
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

if ( ! function_exists( 'novablocks_comments_link' ) ) {
	function novablocks_comments_link() {
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

if ( ! function_exists( 'novablocks_edit_post_link' ) ) {
	/**
	 * Prints HTML with meta information for the categories, tags and comments.
	 */
	function novablocks_edit_post_link() {

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

if ( ! function_exists( 'novablocks_post_thumbnail' ) ) :
	/**
	 * Displays an optional post thumbnail.
	 *
	 * Wraps the post thumbnail in an anchor element on index views, or a div
	 * element when on single views.
	 */
	function novablocks_post_thumbnail() {
		if ( post_password_required() || is_attachment() || ! has_post_thumbnail() ) {
			return;
		}

		if ( is_singular() ) :
			?>

			<div class="post-thumbnail">
				<?php the_post_thumbnail(); ?>
			</div><!-- .post-thumbnail -->

		<?php else : ?>

		<a class="post-thumbnail" href="<?php the_permalink(); ?>" aria-hidden="true" tabindex="-1">
			<?php
			the_post_thumbnail( 'post-thumbnail', array(
				'alt' => the_title_attribute( array(
					'echo' => false,
				) ),
			) );
			?>
		</a>

		<?php
		endif; // End is_singular().
	}
endif;

if ( ! function_exists( 'rosa_the_separator' ) ) {
    function rosa_the_separator( $style = 'default' ) {
        echo '<div class="wp-block-separator is-style-' . $style . '">' . rosa_get_separator_markup() . '</div>';
    }
}

if ( ! function_exists( 'rosa_get_separator_markup' ) ) {
    function rosa_get_separator_markup() {
        ob_start();
        ?>
        <div class="c-separator">
            <div class="c-separator__arrow c-separator__arrow--left"></div>
            <div class="c-separator__line c-separator__line--left"></div>
            <div class="c-separator__flower">
                <span><?php echo rosa_get_separator_symbol(); ?></span>
            </div>
            <div class="c-separator__line c-separator__line--right"></div>
            <div class="c-separator__arrow c-separator__arrow--right"></div>
        </div>
        <?php return apply_filters( 'rosa_separator_markup', ob_get_clean() );
    }
}

if ( ! function_exists( 'rosa_get_separator_symbol' ) ) {
	function rosa_get_separator_symbol() {
        ob_start();
        $symbol = pixelgrade_option( 'separator_symbol', 'fleuron-1' );
        get_template_part( 'template-parts/separators/' . $symbol . '-svg' );
        return ob_get_clean();
	}
}

if ( ! function_exists( ' rosa_woocommerce_pagination_args' ) ) {
	function rosa_woocommerce_pagination_args() {

		$args =  array(
				'end_size'           => 1,
				'mid_size'           => 2,
				'type'               => 'list',
				'type' => null,
				'prev_text' => esc_html_x( 'Previous', 'previous set of posts', '__theme_txtd' ),
				'next_text' => esc_html_x( 'Next', 'next set of posts', '__theme_txtd' ),
			);

		return $args;
    }
}

