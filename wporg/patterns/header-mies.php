<?php
/**
 * Title: Header, minimal wordmark (uppercase menu)
 * Slug: anima-lt/header-mies
 * Categories: header
 * Block Types: core/template-part/header
 * Description: A minimal, architectural header — a wordmark/logo on the left and an uppercase, letter-spaced menu on the right, in the spirit of Mies LT.
 * Inserter: true
 */
?>
<!-- wp:group {"tagName":"div","style":{"spacing":{"padding":{"top":"1.8rem","bottom":"1.8rem"}}},"layout":{"type":"constrained"}} -->
<div class="wp-block-group" style="padding-top:1.8rem;padding-bottom:1.8rem">
	<!-- wp:group {"layout":{"type":"flex","justifyContent":"space-between","flexWrap":"wrap","verticalAlignment":"center"}} -->
	<div class="wp-block-group">
		<!-- wp:group {"layout":{"type":"flex","flexWrap":"nowrap","verticalAlignment":"center"},"style":{"spacing":{"blockGap":"0.6rem"}}} -->
		<div class="wp-block-group">
			<!-- wp:site-logo {"width":36} /-->

			<!-- wp:site-title {"level":0,"fontFamily":"body","style":{"typography":{"textTransform":"uppercase","letterSpacing":"0.14em","fontStyle":"normal","fontWeight":"700"}}} /-->
		</div>
		<!-- /wp:group -->

		<!-- wp:navigation {"overlayMenu":"mobile","fontSize":"small","style":{"typography":{"textTransform":"uppercase","letterSpacing":"0.12em"}},"layout":{"type":"flex","justifyContent":"right","flexWrap":"wrap"}} /-->
	</div>
	<!-- /wp:group -->
</div>
<!-- /wp:group -->
