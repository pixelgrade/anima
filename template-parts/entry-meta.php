<?php if ( 'post' === get_post_type() ) { ?>
	<div class="entry-meta">
		<?php novablocks_categories_posted_in(); ?>
		<?php novablocks_tags_posted_in(); ?>
		<?php novablocks_posted_on(); ?>
		<?php // novablocks_posted_by(); ?>
	</div><!-- .entry-meta -->
<?php }