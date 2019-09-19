<?php
/**
 * The template for displaying archive pages
 *
 * @link https://developer.wordpress.org/themes/basics/template-hierarchy/
 *
 * @package Nova
 */

get_header();
?>

    <div id="primary" class="content-area">
        <main id="main" class="site-main">

			<?php if ( have_posts() ) : ?>

                <header class="entry-header">
					<?php
					the_archive_title( '<h1 class="page-title">', '</h1>' );
					the_archive_description( '<div class="archive-description">', '</div>' );
					?>
                </header><!-- .page-header -->

                <?php

				get_template_part( 'template-parts/loop' );
				the_posts_navigation();

			else :

				get_template_part( 'template-parts/content', 'none' );

			endif;
			?>

        </main><!-- #main -->
    </div><!-- #primary -->

<?php
get_footer();
