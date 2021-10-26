<?php
/**
 * Template part for displaying the site footer.
 *
 * @link https://developer.wordpress.org/themes/basics/template-hierarchy/
 *
 * @package Anima
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}
?>

<footer id="colophon" class="site-footer  site-footer--fallback  sm-variation-10">
	<div class="site-footer__inner-container">
		<?php
		anima_footer_the_copyright();

		if ( has_nav_menu( 'footer' ) ) { ?>
			<nav class="footer-navigation" aria-label="<?php esc_attr_e( 'Footer Menu', '__theme_txtd' ); ?>">
				<?php
				wp_nav_menu(
					array(
						'theme_location' => 'footer',
						'menu_class'     => 'footer-menu',
						'depth'          => 1,
					)
				);
				?>
			</nav><!-- .footer-navigation -->
		<?php } ?>
	</div><!-- .site-footer__inner-container -->
</footer><!-- #colophon -->
