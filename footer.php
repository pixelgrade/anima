<?php
/**
 * The template for displaying the footer.
 *
 * @link https://developer.wordpress.org/themes/basics/template-hierarchy/
 *
 * @package Anima
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
} ?>
	</div><!-- #content -->
</div> <!-- .u-container-sides-spacing -->

    <?php
    /**
     * anima_before_footer hook.
     *
     * @hooked nothing() - 10 (outputs nothing)
     */
    do_action( 'anima_before_footer' ); ?>

	<?php if ( function_exists( 'block_areas' ) && anima_block_area_has_blocks( 'footer' ) ) { ?>
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
     * anima_after_footer hook.
     *
     * @hooked anima_output_search_overlay() - 10 (outputs search overlay markup)
     */
    do_action( 'anima_after_footer' ); ?>

</div><!-- #page -->

<?php wp_footer(); ?>

</body>
</html>
