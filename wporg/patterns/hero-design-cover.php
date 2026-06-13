<?php
/**
 * Title: Design-system cover
 * Slug: anima-lt/hero-design-cover
 * Categories: banner, featured
 * Description: A full-bleed magazine cover on the Contrast colour — eyebrow, an oversized display headline that doubles as the type specimen, a short deck, and a grade ramp of the Primary colour along the bottom edge.
 * Inserter: true
 */
?>
<!-- wp:cover {"url":"<?php echo esc_url( get_theme_file_uri( 'assets/images/cover-foundation.jpg' ) ); ?>","dimRatio":60,"overlayColor":"contrast","minHeight":78,"minHeightUnit":"vh","contentPosition":"bottom center","align":"full","style":{"spacing":{"padding":{"top":"5rem","right":"0","bottom":"0","left":"0"},"blockGap":"1.6rem"}},"layout":{"type":"constrained"}} -->
<div class="wp-block-cover alignfull has-custom-content-position is-position-bottom-center" style="padding-top:5rem;padding-right:0;padding-bottom:0;padding-left:0;min-height:78vh">
	<span aria-hidden="true" class="wp-block-cover__background has-contrast-background-color has-background-dim-60 has-background-dim"></span>
	<img class="wp-block-cover__image-background" alt="" src="<?php echo esc_url( get_theme_file_uri( 'assets/images/cover-foundation.jpg' ) ); ?>" data-object-fit="cover"/>
	<div class="wp-block-cover__inner-container">
		<!-- wp:group {"align":"wide","style":{"spacing":{"blockGap":"1.2rem"}}} -->
		<div class="wp-block-group alignwide">
			<!-- wp:paragraph {"textColor":"tertiary","style":{"typography":{"textTransform":"uppercase","letterSpacing":"0.22em"}},"fontSize":"small"} -->
			<p class="has-tertiary-color has-text-color has-small-font-size" style="text-transform:uppercase;letter-spacing:0.22em"><?php esc_html_e( 'A block theme by Pixelgrade', '__theme_txtd' ); ?></p>
			<!-- /wp:paragraph -->

			<!-- wp:heading {"level":1,"textColor":"base","style":{"typography":{"fontSize":"clamp(2.8rem, 6vw, 5.5rem)"}}} -->
			<h1 class="wp-block-heading has-base-color has-text-color" style="font-size:clamp(2.8rem, 6vw, 5.5rem)"><?php esc_html_e( 'A considered foundation.', '__theme_txtd' ); ?></h1>
			<!-- /wp:heading -->
		</div>
		<!-- /wp:group -->

		<!-- wp:columns {"verticalAlignment":"bottom","align":"wide"} -->
		<div class="wp-block-columns alignwide are-vertically-aligned-bottom">
			<!-- wp:column {"verticalAlignment":"bottom","width":"62%"} -->
			<div class="wp-block-column is-vertically-aligned-bottom" style="flex-basis:62%">
				<!-- wp:paragraph {"textColor":"base","fontSize":"large"} -->
				<p class="has-base-color has-text-color has-large-font-size"><?php esc_html_e( 'Impeccable colour, type, and rhythm from your very first post — and nothing you don’t need. Everything on this page is a core WordPress block.', '__theme_txtd' ); ?></p>
				<!-- /wp:paragraph -->
			</div>
			<!-- /wp:column -->

			<!-- wp:column {"verticalAlignment":"bottom","width":"38%"} -->
			<div class="wp-block-column is-vertically-aligned-bottom" style="flex-basis:38%">
				<!-- wp:group {"layout":{"type":"flex","justifyContent":"right"}} -->
				<div class="wp-block-group">
					<!-- wp:group {"style":{"spacing":{"padding":{"top":"0.15rem","right":"0.6rem","bottom":"0.15rem","left":"0.6rem"}},"border":{"width":"1px","color":"#eef0ea40","radius":"4px"}},"layout":{"type":"flex"}} -->
					<div class="wp-block-group has-border-color" style="border-color:#eef0ea40;border-width:1px;border-radius:4px;padding-top:0.15rem;padding-right:0.6rem;padding-bottom:0.15rem;padding-left:0.6rem">
						<!-- wp:paragraph {"textColor":"tertiary","style":{"typography":{"textTransform":"uppercase","letterSpacing":"0.08em"}},"fontSize":"small"} -->
						<p class="has-tertiary-color has-text-color has-small-font-size" style="text-transform:uppercase;letter-spacing:0.08em">core/cover · display · 2.8–5.5rem</p>
						<!-- /wp:paragraph -->
					</div>
					<!-- /wp:group -->
				</div>
				<!-- /wp:group -->
			</div>
			<!-- /wp:column -->
		</div>
		<!-- /wp:columns -->

		<!-- wp:spacer {"height":"2.5rem"} -->
		<div style="height:2.5rem" aria-hidden="true" class="wp-block-spacer"></div>
		<!-- /wp:spacer -->

		<!-- wp:group {"align":"full","style":{"spacing":{"blockGap":"0","padding":{"top":"0","right":"0","bottom":"0","left":"0"}}},"backgroundColor":"primary","layout":{"type":"flex","flexWrap":"nowrap"}} -->
		<div class="wp-block-group alignfull has-primary-background-color has-background" style="padding-top:0;padding-right:0;padding-bottom:0;padding-left:0">
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
		</div>
		<!-- /wp:group -->
	</div>
</div>
<!-- /wp:cover -->
