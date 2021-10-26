<?php
/**
 * Template part for displaying the site header.
 *
 * @link https://developer.wordpress.org/themes/basics/template-hierarchy/
 *
 * @package Anima
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}

$block ='<!-- wp:novablocks/header {"layout":"logo-center"} -->
        <!-- wp:novablocks/navigation {"slug":"secondary","className":"novablocks-navigation novablocks-navigation\u002d\u002dsecondary"} /-->
        <!-- wp:novablocks/logo /-->
        <!-- wp:novablocks/navigation {"slug":"primary","className":"novablocks-navigation novablocks-navigation\u002d\u002dprimary"} /-->
        <!-- /wp:novablocks/header -->'
?>

<?php echo do_blocks($block); ?>
