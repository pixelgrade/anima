<?php
/**
 * The template for displaying the footer.
 *
 * @link https://developer.wordpress.org/themes/basics/template-hierarchy/
 *
 * @package Rosa2
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
} ?>
	</div><!-- #content -->

	<?php if ( function_exists( 'block_areas' ) && rosa2_block_area_has_blocks( 'footer' ) ) { ?>
        <footer id="colophon" class="site-footer">
            <div class="site-footer__inner-container">
		        <?php block_areas()->render( 'footer' ); ?>
            </div>
        </footer>
	<?php } else {
		get_template_part( 'template-parts/site-footer' );
	} ?>

</div><!-- #page -->

<?php wp_footer(); ?>

</body>
</html>
