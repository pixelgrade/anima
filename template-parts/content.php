<?php
/**
 * Template part for displaying posts
 *
 * @link https://developer.wordpress.org/themes/basics/template-hierarchy/
 *
 * @package Rosa2
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}

global $wp_query;

$classes = array(
	'novablocks-media',
	'novablocks-media--blog',
	'alignfull',
);

$blockClasses = array(
	'novablocks-block',
);

if ( ! has_post_thumbnail() ) {
	$classes[] = 'novablocks-media--no-thumbnail';
}

// We want the first post in the loop on the left, the next one on the right and so on. $wp_query->current_post starts at 0, not at 1.
$classes[] = ( $wp_query->current_post % 2 ) ? 'has-image-on-the-right' : 'has-image-on-the-left';
?>

<article id="post-<?php the_ID(); ?>" <?php post_class( $classes ); ?>>
    <div class="<?php echo esc_attr( join( ' ', $blockClasses ) ); ?>" style="--card-content-padding: 100">
        <div class="wp-block-group__inner-container">
            <div class="wp-block alignwide">
                <div class="novablocks-media__layout">
                    <div class="novablocks-media__content">
                        <div class="novablocks-media__inner-container novablocks-block__content sm-palette-1 sm-variation-1">
                            <?php
                            get_template_part( 'template-parts/entry-meta', get_post_type() );
                            the_title( '<h2 class="entry-title has-text-align-center"><a href="' . esc_url( get_permalink() ) . '" rel="bookmark">', '</a></h2>' );
                            rosa2_the_separator( 'decorative' );
                            echo '<p class="has-text-align-center">' . get_the_excerpt() . '</p>';
                            rosa2_the_read_more_button();
                            ?>
                        </div>
                    </div>
                    <div class="novablocks-media__aside">
                        <div class="novablocks-media__image sm-palette-1 sm-variation-1">
                            <?php
                            if( has_post_thumbnail() ) {
                                rosa2_post_thumbnail();
                            } else { ?>
                                <svg viewBox="-100 -100 344 344" width="144" height="144" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M84 36L61.5 66l17.1 22.8L69 96C58.86 82.5 42 60 42 60L6 108h132L84 36z" fill="#212B49"/></svg>
                            <?php } ?>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</article><!-- #post-<?php the_ID(); ?> -->
