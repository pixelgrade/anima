<?php
/**
 * Template part for displaying page content in page.php
 *
 * @link https://developer.wordpress.org/themes/basics/template-hierarchy/
 *
 * @package Nova
 */

?>

<article id="post-<?php the_ID(); ?>" <?php post_class(); ?>>

	<?php if ( ! rosa_header_should_be_fixed() ) { ?>
        <div class="entry-header entry-content">
			<?php get_template_part( 'template-parts/entry-meta' ); ?>
			<?php the_title( '<h1 class="entry-title has-text-align-center">', '</h1>' ); ?>
            <div class="has-normal-font-size">
				<?php rosa_the_separator( 'flower' ); ?>
            </div>
        </div>
	<?php } ?>

    <div class="entry-content">
		<?php the_content(); ?>
    </div>

</article><!-- #post-<?php the_ID(); ?> -->
