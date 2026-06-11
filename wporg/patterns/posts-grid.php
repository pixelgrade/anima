<?php
/**
 * Title: Posts grid with heading
 * Slug: anima-lt/posts-grid
 * Categories: posts, query
 * Description: A section heading above a three-column grid of latest posts with featured image, title, meta, and excerpt.
 * Inserter: true
 */
?>
<!-- wp:group {"tagName":"section","style":{"spacing":{"padding":{"top":"4rem","bottom":"2rem"}}},"layout":{"type":"constrained"}} -->
<section class="wp-block-group" style="padding-top:4rem;padding-bottom:2rem">
	<!-- wp:paragraph {"align":"center","style":{"typography":{"textTransform":"uppercase","letterSpacing":"0.18em"}},"textColor":"secondary","fontSize":"small"} -->
	<p class="has-text-align-center has-secondary-color has-text-color has-small-font-size" style="text-transform:uppercase;letter-spacing:0.18em">Latest from the journal</p>
	<!-- /wp:paragraph -->

	<!-- wp:query {"queryId":10,"query":{"perPage":3,"pages":1,"offset":0,"postType":"post","order":"desc","orderBy":"date","sticky":"","inherit":false},"align":"wide"} -->
	<div class="wp-block-query alignwide">
		<!-- wp:post-template {"layout":{"type":"grid","columnCount":3}} -->
			<!-- wp:post-featured-image {"isLink":true,"aspectRatio":"4/3"} /-->

			<!-- wp:post-title {"isLink":true,"fontSize":"large"} /-->

			<!-- wp:group {"layout":{"type":"flex","flexWrap":"wrap"}} -->
			<div class="wp-block-group">
				<!-- wp:post-date {"fontSize":"small"} /-->

				<!-- wp:post-terms {"term":"category","fontSize":"small"} /-->
			</div>
			<!-- /wp:group -->

			<!-- wp:post-excerpt {"excerptLength":18} /-->
		<!-- /wp:post-template -->
	</div>
	<!-- /wp:query -->
</section>
<!-- /wp:group -->
