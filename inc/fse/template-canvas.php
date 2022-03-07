<?php
/**
 * Basic template canvas file to render the current 'wp_template'.
 *
 * This is an augmented version of the core `wp-includes/template-canvas.php` file.
 * We did this to have more control through hooks.
 *
 * @package Anima
 */

/*
 * Get the template HTML.
 * This needs to run before <head> so that blocks can add scripts and styles in wp_head().
 */
$template_html = apply_filters( 'anima/get_block_template_html', get_the_block_template_html() );
?><!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
	<meta charset="<?php bloginfo( 'charset' ); ?>" />
	<?php wp_head(); ?>
</head>

<body <?php body_class(); ?>>
<?php wp_body_open(); ?>

<?php
do_action( 'anima/template_html:before', 'main' );

echo $template_html; // phpcs:ignore WordPress.Security.EscapeOutput

do_action( 'anima/template_html:after', 'main' );
?>

<?php wp_footer(); ?>
</body>
</html>
