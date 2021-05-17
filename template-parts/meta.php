<?php
/**
 * The template part for displaying a box with meta information about current article on single post template.
 *
 * @link https://developer.wordpress.org/themes/basics/template-hierarchy/
 *
 * @package Rosa2
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}

?>

<div class="c-meta">
	<?php
	$author_id        = get_the_author_meta( 'ID' );
	$author           = get_userdata( $author_id );
	$author_email     = $author->user_email;
	$avatar_url       = get_avatar_url( $author_email, array( 'size' => 100, 'default' => 'identicon' ) );
	$avatar           = get_avatar( $author_email, '80', 'identicon' );
	$min_reading_time = rosa2_get_post_reading_time_in_minutes( $post, 280 );

	$byline = sprintf(
		__( '%s', '__theme_txtd' ),
		'<span class="author vcard"><a class="url fn n" href="' . esc_url( get_author_posts_url( $author_id ) ) . '">' . $author->display_name . '</a></span>'
	);

	?>
    <div class="c-meta__authorship">
        <div class="c-meta-author" itemscope="" itemtype="http://schema.org/Person">
			<?php if ( ! empty( $avatar_url ) ) { ?>
                <div class="c-meta-author__avatar">
                    <meta itemprop="image" content="<?php echo esc_url( $avatar_url ); ?>"/>
                    <div class="c-meta-author__avatar-wrapper">
						<?php echo $avatar; ?>
                    </div>
                </div>
			<?php } ?>
            <div class="c-meta-author__body">
                <div class="c-meta__rows">
                    <div class="c-meta__row">
                        <div class="c-meta__row-item">
							<?php echo $byline ?>
                        </div>
                    </div>
                    <div class="c-meta__row c-meta__row--secondary">
                        <div class="c-meta__row-item"><?php echo get_the_date(); ?></div>
                        <div class="c-meta__row-item">
							<?php
								printf( __( '%s min read', '__theme_txtd' ), $min_reading_time );
							?>
                        </div>
                    </div> <!-- .c-meta__row--secondary -->
                </div>
            </div>  <!-- .c-meta-author__body -->
        </div> <!-- .c-meta-author -->
    </div> <!-- .c-meta__authorship -->
	<?php get_template_part( 'template-parts/meta-social' ); ?>
</div> <!-- .c-meta -->
