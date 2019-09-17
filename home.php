<?php
/**
 * The template for displaying archive pages
 *
 * @link https://developer.wordpress.org/themes/basics/template-hierarchy/
 *
 * @package Nova
 */

get_header();

$page_id = get_option( 'page_for_posts' );
?>

	<div id="primary" class="content-area">
		<main id="main" class="site-main">

			<?php if ( have_posts() ) : ?>

				<header class="entry-header">
                    <div class="entry-content has-text-align-center">
                        <?php
                        echo '<h1 class="page-title has-text-align-center">' . get_the_title( $page_id ) . '</h1>';
                        $categories = get_categories();
                        $categories = array_filter( $categories, function( $category ) {
                            return $category->term_id !== 1;
                        } );
                        if ( ! empty( $categories ) && ! is_wp_error( $categories ) ) {
                            echo '<ul class="entry-meta">';
                            foreach ( $categories as $category ) {
                                $category_url = get_category_link( $category->term_id );
                                echo '<li><a href="'. $category_url .'">'. $category->name.'</a></li>';
                            }
                            echo '</ul>';
                        }
                        ?>
                    </div>
				</header><!-- .page-header -->

                <?php
                $has_image_on_the_left = false;

                /* Start the Loop */
                while ( have_posts() ) :
                    the_post();
                    $has_image_on_the_left = ! $has_image_on_the_left;
                    set_query_var( 'has_image_on_the_left', $has_image_on_the_left );

                    /*
                     * Include the Post-Type-specific template for the content.
                     * If you want to override this in a child theme, then include a file
                     * called content-___.php (where ___ is the Post Type name) and that will be used instead.
                     */
                    get_template_part( 'template-parts/content', get_post_type() );

                endwhile;
                ?>

				<?php the_posts_navigation();

			else :

				get_template_part( 'template-parts/content', 'none' );

			endif;
			?>

		</main><!-- #main -->
	</div><!-- #primary -->

<?php
get_footer();
