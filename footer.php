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

	<?php if ( function_exists( 'block_areas' ) ) {
		block_areas()->render( 'footer' );
	} else {
		get_template_part( 'template-parts/site-footer' );
	} ?>

</div><!-- #page -->

<?php wp_footer(); ?>

</body>
</html>
