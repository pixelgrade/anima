<?php
/**
 * Title: Featured post hero (full-bleed)
 * Slug: anima-lt/hero-featured
 * Categories: banner, featured, query
 * Description: A full-width hero showing the latest post over its featured image, with a category eyebrow, large title, and excerpt centered on top — a magazine-style cover in the spirit of Felt LT.
 * Inserter: true
 */
?>
<!-- wp:query {"queryId":20,"query":{"perPage":1,"pages":1,"offset":0,"postType":"post","order":"desc","orderBy":"date","sticky":"","inherit":false},"align":"full"} -->
<div class="wp-block-query alignfull">
	<!-- wp:post-template {"layout":{"type":"default"}} -->
		<!-- wp:cover {"useFeaturedImage":true,"dimRatio":50,"overlayColor":"contrast","isUserOverlayColor":true,"minHeight":82,"minHeightUnit":"vh","contentPosition":"center center","align":"full","style":{"spacing":{"padding":{"top":"4rem","bottom":"4rem","left":"1.5rem","right":"1.5rem"}}},"layout":{"type":"constrained","contentSize":"760px"}} -->
		<div class="wp-block-cover alignfull has-custom-content-position is-position-center-center" style="padding-top:4rem;padding-right:1.5rem;padding-bottom:4rem;padding-left:1.5rem;min-height:82vh">
			<span aria-hidden="true" class="wp-block-cover__background has-contrast-background-color has-background-dim-50 has-background-dim"></span>
			<div class="wp-block-cover__inner-container">
				<!-- wp:post-terms {"term":"category","textAlign":"center","textColor":"primary","style":{"typography":{"textTransform":"uppercase","letterSpacing":"0.18em"}},"fontSize":"small"} /-->

				<!-- wp:post-title {"textAlign":"center","level":1,"isLink":true,"textColor":"base","fontSize":"xx-large"} /-->

				<!-- wp:post-excerpt {"textAlign":"center","textColor":"base","excerptLength":24} /-->
			</div>
		</div>
		<!-- /wp:cover -->
	<!-- /wp:post-template -->
</div>
<!-- /wp:query -->
