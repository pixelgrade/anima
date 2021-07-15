<?php
/**
 * The template for displaying the blog home page.
 *
 * @link https://developer.wordpress.org/themes/basics/template-hierarchy/
 *
 * @package Rosa2
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}

get_header();

?>

	<div id="primary" class="content-area">
		<main id="main" class="site-main">

			<?php echo do_blocks(
				'<!-- wp:novablocks/sidecar { "className":"alignwide", "sidebarWidth":"medium", "lastItemIsSticky":true} -->' .
				'<!-- wp:novablocks/sidecar-area {"className":"novablocks-content entry-content"} -->' .
				rosa2_get_home_content_markup() .
				'<!-- /wp:novablocks/sidecar-area -->' .
				'<!-- /wp:novablocks/sidecar -->'
			); ?>

		</main><!-- #main -->
	</div><!-- #primary -->

<?php

function rosa2_get_home_content_markup() {

	ob_start();

	$page_for_posts = get_option( 'page_for_posts' );
	$categories = get_categories();

	if ( ! empty( $categories ) ) {
		$categories = array_filter( $categories, function ( $category ) {
			return $category->term_id !== 1;
		} );
	}

	$has_title      = ! empty( $page_for_posts );
	$has_categories = ! empty( $categories ) && ! is_wp_error( $categories );

	if ( have_posts() ) {
		if ( $has_title || $has_categories ) { ?>
            <header class="entry-header has-text-align-center entry-content">
				<?php

				if ( $has_title ) {
					echo '<h1 class="page-title">' . get_the_title( $page_for_posts ) . '</h1>';
				}

				if ( $has_categories ) {
					echo '<ul class="entry-meta">';
					foreach ( $categories as $category ) {
						$category_url = get_category_link( $category->term_id );
						echo '<li><a href="' . esc_url( $category_url ) . '">' . esc_html( $category->name ) . '</a></li>';
					}
					echo '</ul>';
				}
				?>
            </header><!-- .page-header -->
		<?php }

		get_template_part( 'template-parts/loop' );
		rosa2_the_posts_pagination();

	} else {
		get_template_part( 'template-parts/content', 'none' );
	}

    return ob_get_clean();
}

get_footer();
