<?php
/**
 * Title: Header, minimal (logo left, menu right)
 * Slug: anima-lt/header-minimal
 * Categories: header
 * Block Types: core/template-part/header
 * Description: A clean header with the site logo on the left and the navigation on the right — in the spirit of Mies LT.
 * Inserter: true
 */
?>
<!-- wp:group {"tagName":"div","style":{"spacing":{"padding":{"top":"1.4rem","bottom":"1.4rem"}}},"layout":{"type":"constrained"}} -->
<div class="wp-block-group" style="padding-top:1.4rem;padding-bottom:1.4rem">
	<!-- wp:group {"layout":{"type":"flex","justifyContent":"space-between","flexWrap":"wrap"}} -->
	<div class="wp-block-group">
		<!-- wp:group {"layout":{"type":"flex","flexWrap":"nowrap","verticalAlignment":"center"},"style":{"spacing":{"blockGap":"0.6rem"}}} -->
		<div class="wp-block-group">
			<!-- wp:site-logo {"width":40} /-->

			<!-- wp:site-title {"level":0} /-->
		</div>
		<!-- /wp:group -->

		<!-- wp:navigation {"overlayMenu":"mobile","layout":{"type":"flex","justifyContent":"right","flexWrap":"wrap"}} /-->
	</div>
	<!-- /wp:group -->
</div>
<!-- /wp:group -->
