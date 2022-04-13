<?php
/**
 * 404 content.
 *
 * It does not appear in the inserter.
 */
return array(
	'title'    => __( '404 content (theme)', '__theme_txtd' ),
	'inserter' => false,
	'content'  => '<!-- wp:heading {"textAlign":"center","level":1,"align":"wide","className":"has-larger-font-size","fontSize":"larger"} -->
<h1 class="alignwide has-text-align-center has-larger-font-size" id="looks-like-you-ve-stumbled-into-nowhere">' . esc_html__( 'Looks like you\'ve stumbled into nowhere.', '__theme_txtd' ) . '</h1>
<!-- /wp:heading -->

<!-- wp:paragraph {"align":"center"} -->
<p class="has-text-align-center has-normal-font-size">' . esc_html__( 'It seems we can\'t find what you’re looking for. Perhaps searching can help.', '__theme_txtd' ) . '</p>
<!-- /wp:paragraph -->

<!-- wp:search {"label":"' . esc_html__( 'Search', '__theme_txtd' ) . '","showLabel":false,"buttonText":"' . esc_html__( 'Search', '__theme_txtd' ) . '"} /-->',
);
