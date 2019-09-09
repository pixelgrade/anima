<?php
/**
 * Template part for displaying posts
 *
 * @link https://developer.wordpress.org/themes/basics/template-hierarchy/
 *
 * @package Nova
 */

$classes = array();

?>

<article id="post-<?php the_ID(); ?>" <?php post_class( join( ' ', $classes ) ); ?>>

    <div class="page-header">
        <div class="entry-content">
            <?php get_template_part( 'template-parts/entry-meta' ); ?>
            <?php the_title( '<h1 class="entry-title has-text-align-center">', '</h1>' ); ?>
            <div class="has-normal-font-size">
                <?php rosa_the_separator( 'flower' ); ?>
            </div>
        </div>
    </div>

    <div class="page-thumbnail">
        <div class="entry-content">
            <?php if ( has_post_thumbnail() ) { ?>
                <div class="wp-block-image alignwide">
                    <?php the_post_thumbnail(); ?>
                </div>
            <?php }
            the_content();
            ?>
        </div>
    </div>

</article><!-- #post-<?php the_ID(); ?> -->
