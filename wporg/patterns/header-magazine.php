<?php
/**
 * Title: Header, magazine (utility bar + centered logo)
 * Slug: anima-lt/header-magazine
 * Categories: header
 * Block Types: core/template-part/header
 * Description: A magazine-style header — a thin utility bar with social links above a centered logo and primary navigation, in the spirit of Felt LT.
 * Inserter: true
 */
?>
<!-- wp:group {"tagName":"div","style":{"spacing":{"padding":{"top":"0.8rem","bottom":"1.2rem"}}},"layout":{"type":"constrained"}} -->
<div class="wp-block-group" style="padding-top:0.8rem;padding-bottom:1.2rem">
	<!-- wp:group {"style":{"spacing":{"blockGap":"0.8rem"}},"layout":{"type":"flex","justifyContent":"space-between","flexWrap":"wrap"}} -->
	<div class="wp-block-group">
		<!-- wp:social-links {"size":"has-small-icon-size","className":"is-style-logos-only","layout":{"type":"flex","justifyContent":"left"}} -->
		<ul class="wp-block-social-links has-small-icon-size is-style-logos-only">
			<!-- wp:social-link {"url":"#","service":"instagram"} /-->

			<!-- wp:social-link {"url":"#","service":"x"} /-->
		</ul>
		<!-- /wp:social-links -->

		<!-- wp:paragraph {"style":{"typography":{"textTransform":"uppercase","letterSpacing":"0.12em"}},"textColor":"secondary","fontSize":"small"} -->
		<p class="has-secondary-color has-text-color has-small-font-size" style="text-transform:uppercase;letter-spacing:0.12em"><a href="#">Subscribe</a></p>
		<!-- /wp:paragraph -->
	</div>
	<!-- /wp:group -->

	<!-- wp:separator {"className":"is-style-wide","style":{"spacing":{"margin":{"top":"0.6rem","bottom":"0.8rem"}}}} -->
	<hr class="wp-block-separator has-alpha-channel-opacity is-style-wide" style="margin-top:0.6rem;margin-bottom:0.8rem"/>
	<!-- /wp:separator -->

	<!-- wp:group {"layout":{"type":"flex","orientation":"vertical","justifyContent":"center"}} -->
	<div class="wp-block-group">
		<!-- wp:site-title {"level":0,"textAlign":"center","fontSize":"x-large"} /-->

		<!-- wp:navigation {"overlayMenu":"mobile","layout":{"type":"flex","justifyContent":"center","flexWrap":"wrap"}} /-->
	</div>
	<!-- /wp:group -->
</div>
<!-- /wp:group -->
