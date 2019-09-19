<?php
/**
 * Template part for displaying the post meta
 *
 * @link https://developer.wordpress.org/themes/basics/template-hierarchy/
 *
 * @package Rosa2
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}

if ( 'post' === get_post_type() ) { ?>
	<div class="entry-meta">
		<?php
		rosa2_categories_posted_in();
		rosa2_tags_posted_in();
		rosa2_posted_on();
		?>
	</div><!-- .entry-meta -->
<?php }
