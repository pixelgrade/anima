<?php
/**
 * Title: Editorial hero (image)
 * Slug: anima-lt/hero-editorial
 * Categories: banner, featured
 * Description: A full-bleed photographic hero over a bundled image, with an eyebrow, large headline, lead paragraph, and a call to action.
 * Inserter: true
 */
$anima_hero_image = esc_url( get_theme_file_uri( 'assets/images/hero-craft.jpg' ) );
?>
<!-- wp:cover {"url":"<?php echo $anima_hero_image; ?>","dimRatio":50,"overlayColor":"contrast","isUserOverlayColor":true,"minHeight":84,"minHeightUnit":"vh","align":"full","style":{"spacing":{"padding":{"top":"5rem","bottom":"5rem","left":"1.5rem","right":"1.5rem"}}},"layout":{"type":"constrained","contentSize":"720px"}} -->
<div class="wp-block-cover alignfull" style="padding-top:5rem;padding-right:1.5rem;padding-bottom:5rem;padding-left:1.5rem;min-height:84vh">
	<span aria-hidden="true" class="wp-block-cover__background has-contrast-background-color has-background-dim"></span>
	<img class="wp-block-cover__image-background" alt="" src="<?php echo $anima_hero_image; ?>" data-object-fit="cover"/>
	<div class="wp-block-cover__inner-container">
		<!-- wp:paragraph {"align":"center","style":{"typography":{"textTransform":"uppercase","letterSpacing":"0.18em"}},"textColor":"primary","fontSize":"small"} -->
		<p class="has-text-align-center has-primary-color has-text-color has-small-font-size" style="text-transform:uppercase;letter-spacing:0.18em">Pixelgrade LT — Journal</p>
		<!-- /wp:paragraph -->

		<!-- wp:heading {"textAlign":"center","level":1,"textColor":"base","fontSize":"xx-large"} -->
		<h1 class="wp-block-heading has-text-align-center has-base-color has-text-color has-xx-large-font-size">Design, architecture, and the quiet life</h1>
		<!-- /wp:heading -->

		<!-- wp:paragraph {"align":"center","textColor":"base","fontSize":"large"} -->
		<p class="has-text-align-center has-base-color has-text-color has-large-font-size">A journal of considered work — interiors, places, and the craft of making things that last.</p>
		<!-- /wp:paragraph -->

		<!-- wp:buttons {"layout":{"type":"flex","justifyContent":"center"}} -->
		<div class="wp-block-buttons">
			<!-- wp:button -->
			<div class="wp-block-button"><a class="wp-block-button__link wp-element-button" href="#">Start reading</a></div>
			<!-- /wp:button -->
		</div>
		<!-- /wp:buttons -->
	</div>
</div>
<!-- /wp:cover -->
