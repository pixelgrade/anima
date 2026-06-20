<?php
/**
 * Title: Journal strip
 * Slug: anima-lt/journal-strip
 * Categories: posts, query
 * Description: A section heading beside a small specimen label, above a three-column strip of the latest posts — each under a hairline rule, with category and date, the title, and a short excerpt.
 * Inserter: true
 */
?>
<!-- wp:group {"tagName":"section","align":"full","style":{"spacing":{"padding":{"top":"4.5rem","bottom":"1.5rem"},"blockGap":"2rem"}},"layout":{"type":"constrained"}} -->
<section class="wp-block-group alignfull" style="padding-top:4.5rem;padding-bottom:1.5rem">
	<!-- wp:group {"align":"wide","layout":{"type":"flex","justifyContent":"space-between","flexWrap":"wrap","verticalAlignment":"center"}} -->
	<div class="wp-block-group alignwide">
		<!-- wp:heading {"level":2,"fontSize":"x-large"} -->
		<h2 class="wp-block-heading has-x-large-font-size"><?php esc_html_e( 'From the journal', '__theme_txtd' ); ?></h2>
		<!-- /wp:heading -->

		<!-- wp:group {"style":{"spacing":{"padding":{"top":"0.15rem","right":"0.6rem","bottom":"0.15rem","left":"0.6rem"}},"border":{"width":"1px","color":"#0000002e","radius":"4px"}},"layout":{"type":"flex"}} -->
		<div class="wp-block-group has-border-color" style="border-color:#0000002e;border-width:1px;border-radius:4px;padding-top:0.15rem;padding-right:0.6rem;padding-bottom:0.15rem;padding-left:0.6rem">
			<!-- wp:paragraph {"textColor":"secondary","style":{"typography":{"textTransform":"uppercase","letterSpacing":"0.08em"}},"fontSize":"small"} -->
			<p class="has-secondary-color has-text-color has-small-font-size" style="text-transform:uppercase;letter-spacing:0.08em"><?php esc_html_e( 'core/query', '__theme_txtd' ); ?></p>
			<!-- /wp:paragraph -->
		</div>
		<!-- /wp:group -->
	</div>
	<!-- /wp:group -->

	<!-- wp:query {"queryId":10,"query":{"perPage":3,"pages":1,"offset":0,"postType":"post","order":"desc","orderBy":"date","sticky":"","inherit":false},"align":"wide"} -->
	<div class="wp-block-query alignwide">
		<!-- wp:post-template {"layout":{"type":"grid","columnCount":3}} -->
			<!-- wp:group {"style":{"border":{"top":{"color":"#0000002e","width":"1px"}},"spacing":{"padding":{"top":"1.1rem"},"blockGap":"0.6rem"}}} -->
			<div class="wp-block-group" style="border-top-color:#0000002e;border-top-width:1px;padding-top:1.1rem">
				<!-- wp:group {"layout":{"type":"flex","justifyContent":"space-between","flexWrap":"wrap","verticalAlignment":"center"}} -->
				<div class="wp-block-group">
					<!-- wp:post-terms {"term":"category","fontSize":"small","style":{"typography":{"textTransform":"uppercase","letterSpacing":"0.14em"}}} /-->

					<!-- wp:post-date {"textColor":"secondary","fontSize":"small"} /-->
				</div>
				<!-- /wp:group -->

				<!-- wp:post-title {"isLink":true,"fontSize":"large"} /-->

				<!-- wp:post-excerpt {"excerptLength":20,"textColor":"secondary","fontSize":"small"} /-->
			</div>
			<!-- /wp:group -->
		<!-- /wp:post-template -->
	</div>
	<!-- /wp:query -->
</section>
<!-- /wp:group -->
