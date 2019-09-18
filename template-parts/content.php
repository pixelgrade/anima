<?php
/**
 * Template part for displaying posts
 *
 * @link https://developer.wordpress.org/themes/basics/template-hierarchy/
 *
 * @package Nova
 */

$classes = array(
    'novablocks-media',
    'wp-block-group',
    'alignfull',
    'block-is-moderate',
    'content-is-moderate',
    'has-background',
);

$classes[] = get_query_var( 'has_image_on_the_left' ) ? 'has-image-on-the-left' : 'has-image-on-the-right';

?>

<article id="post-<?php the_ID(); ?>" <?php post_class( join( ' ', $classes ) ); ?>>
    <div class="wp-block-group__inner-container">
        <div class="wp-block alignwide"><!-- -->
            <div class="novablocks-media__layout">
                <div class="novablocks-media__content">
                    <div class="novablocks-media__inner-container">
                        <?php
                        get_template_part( 'template-parts/entry-meta', get_post_type() );
                        the_title( '<h2 class="entry-title"><a href="' . esc_url( get_permalink() ) . '" rel="bookmark">', '</a></h2>' );
                        rosa_the_separator( 'decorative' );
                        the_excerpt();
                        rosa_the_read_more_button();
                        ?>
                    </div>
                </div>
                <div class="novablocks-media__aside">
                    <div class="novablocks-media__image">
                        <?php novablocks_post_thumbnail(); ?>
                    </div>
                </div>
            </div>
        </div>
    </div>
</article><!-- #post-<?php the_ID(); ?> -->
