<?php if ( 'post' === get_post_type() ) { ?>
	<div class="entry-meta">
		<?php

		if ( pixelgrade_option( 'display_categories_on_archive' ) ) {
            novablocks_categories_posted_in();
		}

        if ( pixelgrade_option( 'display_tags_on_archive' ) ) {
            novablocks_tags_posted_in();
		}

    	if ( pixelgrade_option( 'display_date_on_archive' ) ) {
		    novablocks_posted_on();
    	}

    	if ( pixelgrade_option( 'display_author_on_archive' ) ) {
		    novablocks_posted_by();
	    }

        ?>
	</div><!-- .entry-meta -->
<?php
}