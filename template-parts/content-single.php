<?php
/**
 * Template part for displaying single posts
 *
 * @link https://developer.wordpress.org/themes/basics/template-hierarchy/
 *
 * @package Anima
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}

$sidebar_markup = '';
$sidecar_attributes_string = '';

if ( is_active_sidebar( 'sidebar-1' ) ) {
	$sidebar_markup =
		'<!-- wp:novablocks/sidecar-area { "areaName":"sidebar" } -->' .
		anima_get_sidebar_markup() .
		'<!-- /wp:novablocks/sidecar-area -->';

    $sidecar_attributes = [
	    'sidebarPosition'  => 'right',
	    'sidebarWidth'     => 'medium',
	    'lastItemIsSticky' => true
    ];

    $sidecar_attributes_string = json_encode( $sidecar_attributes );
}

$article_markup =   '<!-- wp:novablocks/sidecar ' . $sidecar_attributes_string . ' -->' .
                    '<!-- wp:novablocks/sidecar-area { "areaName":"content" } -->' .
                    anima_article_header() .
                    anima_get_content_markup() .
                    anima_get_author_box_markup() .
                    anima_get_post_navigation_markup() .
                    '<!-- wp:novablocks/post-comments --><!-- /wp:novablocks/post-comments -->' .
                    '<!-- /wp:novablocks/sidecar-area -->' .
                    $sidebar_markup .
                    '<!-- /wp:novablocks/sidecar -->';

?>

<article id="post-<?php the_ID(); ?>" <?php post_class(); ?>>
	<?php echo do_blocks( $article_markup ); ?>
</article><!-- #post-<?php the_ID(); ?> -->
