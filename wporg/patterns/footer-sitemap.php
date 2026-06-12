<?php
/**
 * Title: Footer, sitemap colophon with grade ramp
 * Slug: anima-lt/footer-sitemap
 * Categories: footer
 * Block Types: core/template-part/footer
 * Description: A three-column footer — brand with tagline and a design-system colophon line, two link columns — closed by the WordPress credit and a grade ramp of the Primary colour at the very bottom of the page.
 * Inserter: true
 */
?>
<!-- wp:group {"style":{"spacing":{"padding":{"top":"3.5rem","bottom":"1.5rem"},"blockGap":"2rem"}},"layout":{"type":"constrained"}} -->
<div class="wp-block-group" style="padding-top:3.5rem;padding-bottom:1.5rem">
	<!-- wp:columns {"align":"wide","style":{"spacing":{"blockGap":{"left":"2rem"}}}} -->
	<div class="wp-block-columns alignwide">
		<!-- wp:column {"width":"46%"} -->
		<div class="wp-block-column" style="flex-basis:46%">
			<!-- wp:group {"style":{"spacing":{"blockGap":"0.5rem"}}} -->
			<div class="wp-block-group">
				<!-- wp:site-title {"level":0,"fontFamily":"body","style":{"typography":{"textTransform":"uppercase","letterSpacing":"0.14em","fontStyle":"normal","fontWeight":"700"}}} /-->

				<!-- wp:site-tagline {"textColor":"secondary","fontSize":"small"} /-->

				<!-- wp:paragraph {"textColor":"secondary","fontSize":"small"} -->
				<p class="has-secondary-color has-text-color has-small-font-size"><?php esc_html_e( 'Set in Space Grotesk, coloured by Morning Glory, spaced at 1.5× — and all of it yours to change.', '__theme_txtd' ); ?></p>
				<!-- /wp:paragraph -->
			</div>
			<!-- /wp:group -->
		</div>
		<!-- /wp:column -->

		<!-- wp:column {"width":"27%"} -->
		<div class="wp-block-column" style="flex-basis:27%">
			<!-- wp:group {"style":{"spacing":{"blockGap":"0.8rem"}}} -->
			<div class="wp-block-group">
				<!-- wp:paragraph {"style":{"typography":{"textTransform":"uppercase","letterSpacing":"0.16em"}},"textColor":"primary","fontSize":"small"} -->
				<p class="has-primary-color has-text-color has-small-font-size" style="text-transform:uppercase;letter-spacing:0.16em"><?php esc_html_e( 'Explore', '__theme_txtd' ); ?></p>
				<!-- /wp:paragraph -->

				<!-- wp:navigation {"overlayMenu":"never","fontSize":"small","layout":{"type":"flex","orientation":"vertical"}} -->
				<!-- wp:navigation-link {"label":"<?php esc_html_e( 'Home', '__theme_txtd' ); ?>","url":"/"} /-->

				<!-- wp:navigation-link {"label":"<?php esc_html_e( 'Design', '__theme_txtd' ); ?>","url":"#"} /-->

				<!-- wp:navigation-link {"label":"<?php esc_html_e( 'Travel', '__theme_txtd' ); ?>","url":"#"} /-->
				<!-- /wp:navigation -->
			</div>
			<!-- /wp:group -->
		</div>
		<!-- /wp:column -->

		<!-- wp:column {"width":"27%"} -->
		<div class="wp-block-column" style="flex-basis:27%">
			<!-- wp:group {"style":{"spacing":{"blockGap":"0.8rem"}}} -->
			<div class="wp-block-group">
				<!-- wp:paragraph {"style":{"typography":{"textTransform":"uppercase","letterSpacing":"0.16em"}},"textColor":"primary","fontSize":"small"} -->
				<p class="has-primary-color has-text-color has-small-font-size" style="text-transform:uppercase;letter-spacing:0.16em"><?php esc_html_e( 'More', '__theme_txtd' ); ?></p>
				<!-- /wp:paragraph -->

				<!-- wp:navigation {"overlayMenu":"never","fontSize":"small","layout":{"type":"flex","orientation":"vertical"}} -->
				<!-- wp:navigation-link {"label":"<?php esc_html_e( 'Stories', '__theme_txtd' ); ?>","url":"#"} /-->

				<!-- wp:navigation-link {"label":"<?php esc_html_e( 'About', '__theme_txtd' ); ?>","url":"#"} /-->
				<!-- /wp:navigation -->
			</div>
			<!-- /wp:group -->
		</div>
		<!-- /wp:column -->
	</div>
	<!-- /wp:columns -->

	<!-- wp:group {"align":"wide","style":{"border":{"top":{"color":"#0000002e","width":"1px"}},"spacing":{"padding":{"top":"1.2rem"}}},"layout":{"type":"flex","justifyContent":"space-between","flexWrap":"wrap","verticalAlignment":"center"}} -->
	<div class="wp-block-group alignwide" style="border-top-color:#0000002e;border-top-width:1px;padding-top:1.2rem">
		<!-- wp:paragraph {"fontSize":"small"} -->
		<p class="has-small-font-size"><?php
		printf(
			/* translators: %s: WordPress, linking to wordpress.org. */
			esc_html__( 'Proudly powered by %s.', '__theme_txtd' ),
			'<a href="' . esc_url( __( 'https://wordpress.org', '__theme_txtd' ) ) . '">WordPress</a>'
		);
		?></p>
		<!-- /wp:paragraph -->

		<!-- wp:group {"style":{"spacing":{"padding":{"top":"0.15rem","right":"0.6rem","bottom":"0.15rem","left":"0.6rem"}},"border":{"width":"1px","color":"#0000002e","radius":"4px"}},"layout":{"type":"flex"}} -->
		<div class="wp-block-group has-border-color" style="border-color:#0000002e;border-width:1px;border-radius:4px;padding-top:0.15rem;padding-right:0.6rem;padding-bottom:0.15rem;padding-left:0.6rem">
			<!-- wp:paragraph {"textColor":"secondary","style":{"typography":{"textTransform":"uppercase","letterSpacing":"0.08em"}},"fontSize":"small"} -->
			<p class="has-secondary-color has-text-color has-small-font-size" style="text-transform:uppercase;letter-spacing:0.08em">core/template-part</p>
			<!-- /wp:paragraph -->
		</div>
		<!-- /wp:group -->
	</div>
	<!-- /wp:group -->
</div>
<!-- /wp:group -->

<!-- wp:group {"style":{"spacing":{"blockGap":"0","padding":{"top":"0","right":"0","bottom":"0","left":"0"}}},"backgroundColor":"primary","layout":{"type":"flex","flexWrap":"nowrap"}} -->
<div class="wp-block-group has-primary-background-color has-background" style="padding-top:0;padding-right:0;padding-bottom:0;padding-left:0">
	<!-- wp:group {"style":{"color":{"background":"#ffffffAB"},"spacing":{"padding":{"top":"0.375rem","right":"0","bottom":"0.375rem","left":"0"}},"layout":{"selfStretch":"fill","flexSize":null}}} -->
	<div class="wp-block-group has-background" style="background-color:#ffffffAB;padding-top:0.375rem;padding-right:0;padding-bottom:0.375rem;padding-left:0"></div>
	<!-- /wp:group -->

	<!-- wp:group {"style":{"color":{"background":"#ffffff6E"},"spacing":{"padding":{"top":"0.375rem","right":"0","bottom":"0.375rem","left":"0"}},"layout":{"selfStretch":"fill","flexSize":null}}} -->
	<div class="wp-block-group has-background" style="background-color:#ffffff6E;padding-top:0.375rem;padding-right:0;padding-bottom:0.375rem;padding-left:0"></div>
	<!-- /wp:group -->

	<!-- wp:group {"style":{"color":{"background":"#ffffff33"},"spacing":{"padding":{"top":"0.375rem","right":"0","bottom":"0.375rem","left":"0"}},"layout":{"selfStretch":"fill","flexSize":null}}} -->
	<div class="wp-block-group has-background" style="background-color:#ffffff33;padding-top:0.375rem;padding-right:0;padding-bottom:0.375rem;padding-left:0"></div>
	<!-- /wp:group -->

	<!-- wp:group {"style":{"spacing":{"padding":{"top":"0.375rem","right":"0","bottom":"0.375rem","left":"0"}},"layout":{"selfStretch":"fill","flexSize":null}}} -->
	<div class="wp-block-group" style="padding-top:0.375rem;padding-right:0;padding-bottom:0.375rem;padding-left:0"></div>
	<!-- /wp:group -->

	<!-- wp:group {"style":{"color":{"background":"#00000029"},"spacing":{"padding":{"top":"0.375rem","right":"0","bottom":"0.375rem","left":"0"}},"layout":{"selfStretch":"fill","flexSize":null}}} -->
	<div class="wp-block-group has-background" style="background-color:#00000029;padding-top:0.375rem;padding-right:0;padding-bottom:0.375rem;padding-left:0"></div>
	<!-- /wp:group -->

	<!-- wp:group {"style":{"color":{"background":"#0000005E"},"spacing":{"padding":{"top":"0.375rem","right":"0","bottom":"0.375rem","left":"0"}},"layout":{"selfStretch":"fill","flexSize":null}}} -->
	<div class="wp-block-group has-background" style="background-color:#0000005E;padding-top:0.375rem;padding-right:0;padding-bottom:0.375rem;padding-left:0"></div>
	<!-- /wp:group -->

	<!-- wp:group {"style":{"color":{"background":"#00000091"},"spacing":{"padding":{"top":"0.375rem","right":"0","bottom":"0.375rem","left":"0"}},"layout":{"selfStretch":"fill","flexSize":null}}} -->
	<div class="wp-block-group has-background" style="background-color:#00000091;padding-top:0.375rem;padding-right:0;padding-bottom:0.375rem;padding-left:0"></div>
	<!-- /wp:group -->

	<!-- wp:group {"style":{"color":{"background":"#000000C7"},"spacing":{"padding":{"top":"0.375rem","right":"0","bottom":"0.375rem","left":"0"}},"layout":{"selfStretch":"fill","flexSize":null}}} -->
	<div class="wp-block-group has-background" style="background-color:#000000C7;padding-top:0.375rem;padding-right:0;padding-bottom:0.375rem;padding-left:0"></div>
	<!-- /wp:group -->
</div>
<!-- /wp:group -->
