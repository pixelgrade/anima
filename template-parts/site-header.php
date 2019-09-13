<?php

?>

<?php get_template_part( 'template-parts/menu-toggle' ); ?>

<header id="masthead" class="site-header site-header--logo-center">
    <div class="site-header__inner-container">
        <div class="site-header__content alignfull">
            <nav class="wp-block-novablocks-navigation site-header__menu--secondary">
	            <?php wp_nav_menu( array(
		            'container'      => false,
		            'theme_location' => 'menu-1',
		            'menu_id'        => 'secondary-menu',
	            ) ); ?>
            </nav><!-- #site-navigation -->
			<?php get_template_part( 'template-parts/site-branding' ); ?>
            <nav class="wp-block-novablocks-navigation site-header__menu--primary">
	            <?php wp_nav_menu( array(
		            'container'      => false,
		            'theme_location' => 'primary',
		            'menu_id'        => 'primary-menu',
	            ) ); ?>
            </nav><!-- #site-navigation -->
        </div>
    </div>
</header>
