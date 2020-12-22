<?php
/**
 * Template part for displaying single posts
 *
 * @link https://developer.wordpress.org/themes/basics/template-hierarchy/
 *
 * @package Rosa2
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}
?>

<article id="post-<?php the_ID(); ?>" <?php post_class(); ?>>

    <div>
        <header class="entry-header">
			<?php
			get_template_part( 'template-parts/entry-meta', get_post_type() );
			the_title( '<h1 class="entry-title has-text-align-center">', '</h1>' ); ?>
            <div class="has-normal-font-size">
				<?php rosa2_the_separator( 'decorative' ); ?>
            </div>
        </header>
		<?php if ( has_post_thumbnail() ) { ?>
            <div class="entry-thumbnail">
                <div class="entry-content">
                    <div class="entry-thumbnail__wrapper  alignwide  disabled-avoid-fout">
                        <div class="entry-thumbnail__container">
						    <?php the_post_thumbnail(); ?>
                        </div>
                    </div>
                </div>
            </div>
		<?php } ?>
    </div>

    <div class="entry-content">
		<?php
        do_action( 'rosa2_before_content' );
        the_content();
        do_action( 'rosa2_after_content' );
        ?>
    </div>

</article><!-- #post-<?php the_ID(); ?> -->
