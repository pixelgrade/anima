<?php
/**
 * Template part for displaying page content in page.php
 *
 * @link https://developer.wordpress.org/themes/basics/template-hierarchy/
 *
 * @package Rosa2
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}
?>

<article id="post-<?php the_ID(); ?>" <?php post_class(); ?>>

    <div class="entry-content">
		<?php
		do_action( 'rosa2_before_content' );
		the_content();
		do_action( 'rosa2_after_content' );
		?>
    </div>

</article><!-- #post-<?php the_ID(); ?> -->
