<!doctype html>
<html <?php language_attributes(); ?>>
<head>
	<meta charset="<?php bloginfo( 'charset' ); ?>">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<link rel="profile" href="https://gmpg.org/xfn/11">
	<?php wp_head(); ?>
</head>

<body <?php body_class(); ?>>

<?php wp_body_open(); ?>

<div id="page" class="site">

    <a class="skip-link screen-reader-text" href="#content"><?php esc_html_e( 'Skip to content', 'nova' ); ?></a>

    <?php if ( function_exists( 'block_areas' ) ) { ?>
        <div class="promo-bar js-promo-bar">
            <?php block_areas()->render( 'promo-bar' ); ?>
        </div>
        <?php block_areas()->render( 'header' );
    } else {
        get_template_part( 'template-parts/site-header' );
    } ?>

	<div id="content" class="site-content">

