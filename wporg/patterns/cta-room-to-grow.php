<?php
/**
 * Title: Room to grow (call to action)
 * Slug: anima-lt/cta-room-to-grow
 * Categories: call-to-action
 * Description: A closing call-to-action panel on the Tertiary colour — heading, a short paragraph, a button to the free Nova Blocks plugin, and a quiet supporting line.
 * Inserter: true
 */
?>
<!-- wp:group {"tagName":"section","align":"full","style":{"spacing":{"padding":{"top":"2.5rem","bottom":"2rem"}}},"layout":{"type":"constrained"}} -->
<section class="wp-block-group alignfull" style="padding-top:2.5rem;padding-bottom:2rem">
	<!-- wp:group {"style":{"spacing":{"padding":{"top":"3rem","right":"2rem","bottom":"3rem","left":"2rem"},"blockGap":"1.2rem"},"border":{"radius":"10px"}},"backgroundColor":"tertiary","layout":{"type":"constrained"}} -->
	<div class="wp-block-group has-tertiary-background-color has-background" style="border-radius:10px;padding-top:3rem;padding-right:2rem;padding-bottom:3rem;padding-left:2rem">
		<!-- wp:heading {"textAlign":"center","level":2,"fontSize":"x-large"} -->
		<h2 class="wp-block-heading has-text-align-center has-x-large-font-size"><?php esc_html_e( 'Room to grow', '__theme_txtd' ); ?></h2>
		<!-- /wp:heading -->

		<!-- wp:paragraph {"align":"center"} -->
		<p class="has-text-align-center"><?php esc_html_e( 'Anima is complete on its own. When you’re ready for richer layouts and ready-made sections, the free Nova Blocks plugin picks up exactly where the theme leaves off.', '__theme_txtd' ); ?></p>
		<!-- /wp:paragraph -->

		<!-- wp:buttons {"layout":{"type":"flex","justifyContent":"center"}} -->
		<div class="wp-block-buttons">
			<!-- wp:button -->
			<div class="wp-block-button"><a class="wp-block-button__link wp-element-button" href="https://wordpress.org/plugins/nova-blocks/"><?php esc_html_e( 'Get Nova Blocks', '__theme_txtd' ); ?></a></div>
			<!-- /wp:button -->
		</div>
		<!-- /wp:buttons -->

		<!-- wp:paragraph {"align":"center","textColor":"secondary","fontSize":"small"} -->
		<p class="has-text-align-center has-secondary-color has-text-color has-small-font-size"><?php esc_html_e( 'Anima is the foundation of Pixelgrade LT — Pixelgrade’s design system for WordPress.', '__theme_txtd' ); ?></p>
		<!-- /wp:paragraph -->
	</div>
	<!-- /wp:group -->
</section>
<!-- /wp:group -->
