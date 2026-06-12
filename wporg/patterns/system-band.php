<?php
/**
 * Title: Design-system band
 * Slug: anima-lt/system-band
 * Categories: text, columns
 * Description: The design system at a glance — the five colour roles with their values and jobs, then type weights, the spacing scale, and a live button specimen in three bordered columns.
 * Inserter: true
 */
?>
<!-- wp:group {"tagName":"section","align":"full","style":{"spacing":{"padding":{"top":"2.5rem","bottom":"1.5rem"},"blockGap":"1.5rem"}},"layout":{"type":"constrained"}} -->
<section class="wp-block-group alignfull" style="padding-top:2.5rem;padding-bottom:1.5rem">
	<!-- wp:group {"align":"wide","style":{"spacing":{"blockGap":"0.8rem"}}} -->
	<div class="wp-block-group alignwide">
		<!-- wp:group {"layout":{"type":"flex","justifyContent":"space-between","flexWrap":"wrap","verticalAlignment":"center"}} -->
		<div class="wp-block-group">
			<!-- wp:heading {"level":2,"fontSize":"x-large"} -->
			<h2 class="wp-block-heading has-x-large-font-size"><?php esc_html_e( 'The system underneath', '__theme_txtd' ); ?></h2>
			<!-- /wp:heading -->

			<!-- wp:group {"style":{"spacing":{"padding":{"top":"0.15rem","right":"0.6rem","bottom":"0.15rem","left":"0.6rem"}},"border":{"width":"1px","color":"#0000002e","radius":"4px"}},"layout":{"type":"flex"}} -->
			<div class="wp-block-group has-border-color" style="border-color:#0000002e;border-width:1px;border-radius:4px;padding-top:0.15rem;padding-right:0.6rem;padding-bottom:0.15rem;padding-left:0.6rem">
				<!-- wp:paragraph {"textColor":"secondary","style":{"typography":{"textTransform":"uppercase","letterSpacing":"0.08em"}},"fontSize":"small"} -->
				<p class="has-secondary-color has-text-color has-small-font-size" style="text-transform:uppercase;letter-spacing:0.08em">core/columns · core/buttons</p>
				<!-- /wp:paragraph -->
			</div>
			<!-- /wp:group -->
		</div>
		<!-- /wp:group -->

		<!-- wp:paragraph {"textColor":"secondary","fontSize":"small"} -->
		<p class="has-secondary-color has-text-color has-small-font-size"><?php esc_html_e( 'Switch the palette once and the whole site follows — these are the Morning Glory defaults.', '__theme_txtd' ); ?></p>
		<!-- /wp:paragraph -->
	</div>
	<!-- /wp:group -->

	<!-- wp:columns {"align":"wide","style":{"spacing":{"blockGap":{"left":"1rem"}}}} -->
	<div class="wp-block-columns alignwide">
		<!-- wp:column -->
		<div class="wp-block-column">
			<!-- wp:group {"style":{"spacing":{"padding":{"top":"2.6rem","bottom":"2.6rem"}},"border":{"width":"1px","color":"#0000001a","radius":"8px"}},"backgroundColor":"base"} -->
			<div class="wp-block-group has-border-color has-base-background-color has-background" style="border-color:#0000001a;border-width:1px;border-radius:8px;padding-top:2.6rem;padding-bottom:2.6rem">
				<!-- wp:paragraph {"align":"center","textColor":"contrast","fontSize":"small"} -->
				<p class="has-text-align-center has-contrast-color has-text-color has-small-font-size">#eef0ea</p>
				<!-- /wp:paragraph -->
			</div>
			<!-- /wp:group -->
			<!-- wp:paragraph {"align":"center","fontSize":"small","style":{"typography":{"fontWeight":"700"}}} -->
			<p class="has-text-align-center has-small-font-size" style="font-weight:700"><?php esc_html_e( 'Base', '__theme_txtd' ); ?></p>
			<!-- /wp:paragraph -->
			<!-- wp:paragraph {"align":"center","textColor":"secondary","fontSize":"small"} -->
			<p class="has-text-align-center has-secondary-color has-text-color has-small-font-size"><?php esc_html_e( 'Background', '__theme_txtd' ); ?></p>
			<!-- /wp:paragraph -->
		</div>
		<!-- /wp:column -->

		<!-- wp:column -->
		<div class="wp-block-column">
			<!-- wp:group {"style":{"spacing":{"padding":{"top":"2.6rem","bottom":"2.6rem"}},"border":{"width":"1px","color":"#0000001a","radius":"8px"}},"backgroundColor":"primary"} -->
			<div class="wp-block-group has-border-color has-primary-background-color has-background" style="border-color:#0000001a;border-width:1px;border-radius:8px;padding-top:2.6rem;padding-bottom:2.6rem">
				<!-- wp:paragraph {"align":"center","textColor":"base","fontSize":"small"} -->
				<p class="has-text-align-center has-base-color has-text-color has-small-font-size">#5663d5</p>
				<!-- /wp:paragraph -->
			</div>
			<!-- /wp:group -->
			<!-- wp:paragraph {"align":"center","fontSize":"small","style":{"typography":{"fontWeight":"700"}}} -->
			<p class="has-text-align-center has-small-font-size" style="font-weight:700"><?php esc_html_e( 'Primary', '__theme_txtd' ); ?></p>
			<!-- /wp:paragraph -->
			<!-- wp:paragraph {"align":"center","textColor":"secondary","fontSize":"small"} -->
			<p class="has-text-align-center has-secondary-color has-text-color has-small-font-size"><?php esc_html_e( 'Links & buttons', '__theme_txtd' ); ?></p>
			<!-- /wp:paragraph -->
		</div>
		<!-- /wp:column -->

		<!-- wp:column -->
		<div class="wp-block-column">
			<!-- wp:group {"style":{"spacing":{"padding":{"top":"2.6rem","bottom":"2.6rem"}},"border":{"width":"1px","color":"#0000001a","radius":"8px"}},"backgroundColor":"secondary"} -->
			<div class="wp-block-group has-border-color has-secondary-background-color has-background" style="border-color:#0000001a;border-width:1px;border-radius:8px;padding-top:2.6rem;padding-bottom:2.6rem">
				<!-- wp:paragraph {"align":"center","textColor":"base","fontSize":"small"} -->
				<p class="has-text-align-center has-base-color has-text-color has-small-font-size">#262c52</p>
				<!-- /wp:paragraph -->
			</div>
			<!-- /wp:group -->
			<!-- wp:paragraph {"align":"center","fontSize":"small","style":{"typography":{"fontWeight":"700"}}} -->
			<p class="has-text-align-center has-small-font-size" style="font-weight:700"><?php esc_html_e( 'Secondary', '__theme_txtd' ); ?></p>
			<!-- /wp:paragraph -->
			<!-- wp:paragraph {"align":"center","textColor":"secondary","fontSize":"small"} -->
			<p class="has-text-align-center has-secondary-color has-text-color has-small-font-size"><?php esc_html_e( 'Headings', '__theme_txtd' ); ?></p>
			<!-- /wp:paragraph -->
		</div>
		<!-- /wp:column -->

		<!-- wp:column -->
		<div class="wp-block-column">
			<!-- wp:group {"style":{"spacing":{"padding":{"top":"2.6rem","bottom":"2.6rem"}},"border":{"width":"1px","color":"#0000001a","radius":"8px"}},"backgroundColor":"tertiary"} -->
			<div class="wp-block-group has-border-color has-tertiary-background-color has-background" style="border-color:#0000001a;border-width:1px;border-radius:8px;padding-top:2.6rem;padding-bottom:2.6rem">
				<!-- wp:paragraph {"align":"center","textColor":"contrast","fontSize":"small"} -->
				<p class="has-text-align-center has-contrast-color has-text-color has-small-font-size">#dcdfd3</p>
				<!-- /wp:paragraph -->
			</div>
			<!-- /wp:group -->
			<!-- wp:paragraph {"align":"center","fontSize":"small","style":{"typography":{"fontWeight":"700"}}} -->
			<p class="has-text-align-center has-small-font-size" style="font-weight:700"><?php esc_html_e( 'Tertiary', '__theme_txtd' ); ?></p>
			<!-- /wp:paragraph -->
			<!-- wp:paragraph {"align":"center","textColor":"secondary","fontSize":"small"} -->
			<p class="has-text-align-center has-secondary-color has-text-color has-small-font-size"><?php esc_html_e( 'Panels & cards', '__theme_txtd' ); ?></p>
			<!-- /wp:paragraph -->
		</div>
		<!-- /wp:column -->

		<!-- wp:column -->
		<div class="wp-block-column">
			<!-- wp:group {"style":{"spacing":{"padding":{"top":"2.6rem","bottom":"2.6rem"}},"border":{"width":"1px","color":"#0000001a","radius":"8px"}},"backgroundColor":"contrast"} -->
			<div class="wp-block-group has-border-color has-contrast-background-color has-background" style="border-color:#0000001a;border-width:1px;border-radius:8px;padding-top:2.6rem;padding-bottom:2.6rem">
				<!-- wp:paragraph {"align":"center","textColor":"base","fontSize":"small"} -->
				<p class="has-text-align-center has-base-color has-text-color has-small-font-size">#2b3e20</p>
				<!-- /wp:paragraph -->
			</div>
			<!-- /wp:group -->
			<!-- wp:paragraph {"align":"center","fontSize":"small","style":{"typography":{"fontWeight":"700"}}} -->
			<p class="has-text-align-center has-small-font-size" style="font-weight:700"><?php esc_html_e( 'Contrast', '__theme_txtd' ); ?></p>
			<!-- /wp:paragraph -->
			<!-- wp:paragraph {"align":"center","textColor":"secondary","fontSize":"small"} -->
			<p class="has-text-align-center has-secondary-color has-text-color has-small-font-size"><?php esc_html_e( 'Body text', '__theme_txtd' ); ?></p>
			<!-- /wp:paragraph -->
		</div>
		<!-- /wp:column -->
	</div>
	<!-- /wp:columns -->

	<!-- wp:columns {"align":"wide","style":{"spacing":{"blockGap":{"left":"1rem"}}}} -->
	<div class="wp-block-columns alignwide">
		<!-- wp:column -->
		<div class="wp-block-column">
			<!-- wp:group {"style":{"spacing":{"padding":{"top":"1.8rem","right":"1.8rem","bottom":"1.8rem","left":"1.8rem"},"blockGap":"1.1rem"},"border":{"width":"1px","color":"#0000001a","radius":"8px"}}} -->
			<div class="wp-block-group has-border-color" style="border-color:#0000001a;border-width:1px;border-radius:8px;padding-top:1.8rem;padding-right:1.8rem;padding-bottom:1.8rem;padding-left:1.8rem">
				<!-- wp:paragraph {"style":{"typography":{"textTransform":"uppercase","letterSpacing":"0.18em"}},"textColor":"primary","fontSize":"small"} -->
				<p class="has-primary-color has-text-color has-small-font-size" style="text-transform:uppercase;letter-spacing:0.18em"><?php esc_html_e( 'Type · Space Grotesk', '__theme_txtd' ); ?></p>
				<!-- /wp:paragraph -->

				<!-- wp:group {"layout":{"type":"flex","flexWrap":"wrap"},"style":{"spacing":{"blockGap":"1.25rem"}}} -->
				<div class="wp-block-group">
					<!-- wp:paragraph {"style":{"typography":{"fontWeight":"300"}},"fontSize":"large"} -->
					<p class="has-large-font-size" style="font-weight:300"><?php esc_html_e( 'Light', '__theme_txtd' ); ?></p>
					<!-- /wp:paragraph -->
					<!-- wp:paragraph {"style":{"typography":{"fontWeight":"400"}},"fontSize":"large"} -->
					<p class="has-large-font-size" style="font-weight:400"><?php esc_html_e( 'Regular', '__theme_txtd' ); ?></p>
					<!-- /wp:paragraph -->
					<!-- wp:paragraph {"style":{"typography":{"fontWeight":"500"}},"fontSize":"large"} -->
					<p class="has-large-font-size" style="font-weight:500"><?php esc_html_e( 'Medium', '__theme_txtd' ); ?></p>
					<!-- /wp:paragraph -->
					<!-- wp:paragraph {"style":{"typography":{"fontWeight":"700"}},"fontSize":"large"} -->
					<p class="has-large-font-size" style="font-weight:700"><?php esc_html_e( 'Bold', '__theme_txtd' ); ?></p>
					<!-- /wp:paragraph -->
				</div>
				<!-- /wp:group -->

				<!-- wp:paragraph {"textColor":"secondary","fontSize":"small"} -->
				<p class="has-secondary-color has-text-color has-small-font-size"><?php esc_html_e( 'Body is set at 1.05rem with a calm 1.7 line-height, so long reads stay easy.', '__theme_txtd' ); ?></p>
				<!-- /wp:paragraph -->
			</div>
			<!-- /wp:group -->
		</div>
		<!-- /wp:column -->

		<!-- wp:column -->
		<div class="wp-block-column">
			<!-- wp:group {"style":{"spacing":{"padding":{"top":"1.8rem","right":"1.8rem","bottom":"1.8rem","left":"1.8rem"},"blockGap":"1.1rem"},"border":{"width":"1px","color":"#0000001a","radius":"8px"}}} -->
			<div class="wp-block-group has-border-color" style="border-color:#0000001a;border-width:1px;border-radius:8px;padding-top:1.8rem;padding-right:1.8rem;padding-bottom:1.8rem;padding-left:1.8rem">
				<!-- wp:paragraph {"style":{"typography":{"textTransform":"uppercase","letterSpacing":"0.18em"}},"textColor":"primary","fontSize":"small"} -->
				<p class="has-primary-color has-text-color has-small-font-size" style="text-transform:uppercase;letter-spacing:0.18em"><?php esc_html_e( 'Spacing · 1.5×', '__theme_txtd' ); ?></p>
				<!-- /wp:paragraph -->

				<!-- wp:columns {"verticalAlignment":"bottom","style":{"spacing":{"blockGap":{"left":"0.75rem"}}}} -->
				<div class="wp-block-columns are-vertically-aligned-bottom">
					<!-- wp:column {"verticalAlignment":"bottom"} -->
					<div class="wp-block-column is-vertically-aligned-bottom">
						<!-- wp:group {"style":{"spacing":{"padding":{"top":"0.34rem","bottom":"0.34rem"}},"border":{"radius":"6px"}},"backgroundColor":"primary"} -->
						<div class="wp-block-group has-primary-background-color has-background" style="border-radius:6px;padding-top:0.34rem;padding-bottom:0.34rem"></div>
						<!-- /wp:group -->
						<!-- wp:paragraph {"align":"center","fontSize":"small"} -->
						<p class="has-text-align-center has-small-font-size">0.67</p>
						<!-- /wp:paragraph -->
					</div>
					<!-- /wp:column -->

					<!-- wp:column {"verticalAlignment":"bottom"} -->
					<div class="wp-block-column is-vertically-aligned-bottom">
						<!-- wp:group {"style":{"spacing":{"padding":{"top":"0.5rem","bottom":"0.5rem"}},"border":{"radius":"6px"}},"backgroundColor":"primary"} -->
						<div class="wp-block-group has-primary-background-color has-background" style="border-radius:6px;padding-top:0.5rem;padding-bottom:0.5rem"></div>
						<!-- /wp:group -->
						<!-- wp:paragraph {"align":"center","fontSize":"small"} -->
						<p class="has-text-align-center has-small-font-size">1</p>
						<!-- /wp:paragraph -->
					</div>
					<!-- /wp:column -->

					<!-- wp:column {"verticalAlignment":"bottom"} -->
					<div class="wp-block-column is-vertically-aligned-bottom">
						<!-- wp:group {"style":{"spacing":{"padding":{"top":"0.75rem","bottom":"0.75rem"}},"border":{"radius":"6px"}},"backgroundColor":"primary"} -->
						<div class="wp-block-group has-primary-background-color has-background" style="border-radius:6px;padding-top:0.75rem;padding-bottom:0.75rem"></div>
						<!-- /wp:group -->
						<!-- wp:paragraph {"align":"center","fontSize":"small"} -->
						<p class="has-text-align-center has-small-font-size">1.5</p>
						<!-- /wp:paragraph -->
					</div>
					<!-- /wp:column -->

					<!-- wp:column {"verticalAlignment":"bottom"} -->
					<div class="wp-block-column is-vertically-aligned-bottom">
						<!-- wp:group {"style":{"spacing":{"padding":{"top":"1.13rem","bottom":"1.13rem"}},"border":{"radius":"6px"}},"backgroundColor":"primary"} -->
						<div class="wp-block-group has-primary-background-color has-background" style="border-radius:6px;padding-top:1.13rem;padding-bottom:1.13rem"></div>
						<!-- /wp:group -->
						<!-- wp:paragraph {"align":"center","fontSize":"small"} -->
						<p class="has-text-align-center has-small-font-size">2.25</p>
						<!-- /wp:paragraph -->
					</div>
					<!-- /wp:column -->

					<!-- wp:column {"verticalAlignment":"bottom"} -->
					<div class="wp-block-column is-vertically-aligned-bottom">
						<!-- wp:group {"style":{"spacing":{"padding":{"top":"1.69rem","bottom":"1.69rem"}},"border":{"radius":"6px"}},"backgroundColor":"primary"} -->
						<div class="wp-block-group has-primary-background-color has-background" style="border-radius:6px;padding-top:1.69rem;padding-bottom:1.69rem"></div>
						<!-- /wp:group -->
						<!-- wp:paragraph {"align":"center","fontSize":"small"} -->
						<p class="has-text-align-center has-small-font-size">3.38</p>
						<!-- /wp:paragraph -->
					</div>
					<!-- /wp:column -->
				</div>
				<!-- /wp:columns -->

				<!-- wp:paragraph {"textColor":"secondary","fontSize":"small"} -->
				<p class="has-secondary-color has-text-color has-small-font-size"><?php esc_html_e( 'Each step is 1.5× the last — it drives block gap, section rhythm, and padding.', '__theme_txtd' ); ?></p>
				<!-- /wp:paragraph -->
			</div>
			<!-- /wp:group -->
		</div>
		<!-- /wp:column -->

		<!-- wp:column -->
		<div class="wp-block-column">
			<!-- wp:group {"style":{"spacing":{"padding":{"top":"1.8rem","right":"1.8rem","bottom":"1.8rem","left":"1.8rem"},"blockGap":"1.1rem"},"border":{"width":"1px","color":"#0000001a","radius":"8px"}}} -->
			<div class="wp-block-group has-border-color" style="border-color:#0000001a;border-width:1px;border-radius:8px;padding-top:1.8rem;padding-right:1.8rem;padding-bottom:1.8rem;padding-left:1.8rem">
				<!-- wp:paragraph {"style":{"typography":{"textTransform":"uppercase","letterSpacing":"0.18em"}},"textColor":"primary","fontSize":"small"} -->
				<p class="has-primary-color has-text-color has-small-font-size" style="text-transform:uppercase;letter-spacing:0.18em"><?php esc_html_e( 'Components', '__theme_txtd' ); ?></p>
				<!-- /wp:paragraph -->

				<!-- wp:buttons -->
				<div class="wp-block-buttons">
					<!-- wp:button -->
					<div class="wp-block-button"><a class="wp-block-button__link wp-element-button" href="#"><?php esc_html_e( 'A real button', '__theme_txtd' ); ?></a></div>
					<!-- /wp:button -->
				</div>
				<!-- /wp:buttons -->

				<!-- wp:paragraph {"fontSize":"small"} -->
				<p class="has-small-font-size"><a href="#"><?php esc_html_e( 'A real link', '__theme_txtd' ); ?></a></p>
				<!-- /wp:paragraph -->

				<!-- wp:paragraph {"textColor":"secondary","fontSize":"small"} -->
				<p class="has-secondary-color has-text-color has-small-font-size"><?php esc_html_e( 'Both inherit the Primary role — palettes recolour them for free.', '__theme_txtd' ); ?></p>
				<!-- /wp:paragraph -->
			</div>
			<!-- /wp:group -->
		</div>
		<!-- /wp:column -->
	</div>
	<!-- /wp:columns -->
</section>
<!-- /wp:group -->
