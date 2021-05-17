<?php
/**
 * The template part for displaying the social section of the meta box of an article.
 *
 * Learn more: http://codex.wordpress.org/Template_Hierarchy
 *
 * @package Rosa2
 */

$comments_count = get_comments_number();
?>

<div class="c-meta__social">
	<div class="c-meta__rows">
		<div class="c-meta__row">
			<div class="c-meta__row-item">
				<?php echo do_blocks( '<!-- wp:novablocks/sharing-overlay {"buttonLabel":"' . esc_html__( 'Share', '__theme_txtd' ) . '"} --><!-- /wp:novablocks/sharing-overlay -->' ); ?>
			</div>
			<div class="c-meta__row-item">
				<div class="c-meta-comments">
                    <div class="c-meta-comments__count"><div class="c-meta-comments__count-text"><?php echo $comments_count ? $comments_count : '&nbsp;'; ?></div><div class="c-meta-comments__arrow"></div></div>
					<div class="c-meta-comments__label">
						<a class="c-meta-comments__link" href="#novablocks-comments"><?php echo esc_html__( 'Discuss', '__theme_txtd' ); ?></a>
					</div>
				</div>
			</div>
		</div>
	</div><!-- .c-meta__rows -->
</div><!-- .c-meta__social -->
