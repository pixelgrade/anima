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
</div> <!-- .u-container-sides-spacing -->

    <?php
    /**
     * rosa2_before_footer hook.
     *
     * @hooked nothing() - 10 (outputs nothing)
     */
    do_action( 'rosa2_before_footer' ); ?>

	<?php if ( function_exists( 'block_areas' ) && rosa2_block_area_has_blocks( 'footer' ) ) { ?>
        <footer id="colophon" class="site-footer">
            <div class="site-footer__inner-container">
		        <?php block_areas()->render( 'footer' ); ?>
            </div>
        </footer>
	<?php } else {
		get_template_part( 'template-parts/site-footer' );
	} ?>

    <?php
    /**
     * rosa2_after_footer hook.
     *
     * @hooked rosa2_output_search_overlay() - 10 (outputs search overlay markup)
     */
    do_action( 'rosa2_after_footer' ); ?>

</div><!-- #page -->

<?php wp_footer(); ?>

</body>
</html>
