<?php

$has_image_on_the_left = false;

/* Start the Loop */
while ( have_posts() ) :
	the_post();
	$has_image_on_the_left = ! $has_image_on_the_left;
	set_query_var( 'has_image_on_the_left', $has_image_on_the_left );
	get_template_part( 'template-parts/content' );
endwhile;
