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

		if ( pixelgrade_option( 'display_categories_on_archive' ) ) {
            rosa2_categories_posted_in();
		}

        if ( pixelgrade_option( 'display_tags_on_archive' ) ) {
            rosa2_tags_posted_in();
		}

    	if ( pixelgrade_option( 'display_date_on_archive' ) ) {
		    rosa2_posted_on();
    	}

    	if ( pixelgrade_option( 'display_author_on_archive' ) ) {
		    rosa2_posted_by();
	    }
        ?>
	</div><!-- .entry-meta -->
<?php
}
