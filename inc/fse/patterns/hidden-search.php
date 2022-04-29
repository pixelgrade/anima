<?php
/**
 * Search content.
 *
 * It does not appear in the inserter.
 */
return [
	'title'    => __( 'Search content (theme)', '__theme_txtd' ),
	'inserter' => false,
	'content'  => '<!-- wp:group {"align":"wide","blockTopSpacing":0} -->
<div class="wp-block-group break-align-left break-align-right alignwide sm-palette-1 sm-variation-1 sm-color-signal-0" style="--nb-emphasis-top-spacing:0;--nb-emphasis-bottom-spacing:0;--nb-block-top-spacing:0;--nb-block-bottom-spacing:0;--nb-block-zindex:0;--nb-card-content-area-width:50%;--nb-card-media-container-height:50px;--nb-card-content-padding-multiplier:0;--nb-card-media-padding-top:100%;--nb-card-media-object-fit:cover;--nb-card-media-padding-multiplier:0;--nb-card-layout-gap-modifier:0;--nb-minimum-container-height:0vh;--nb-spacing-modifier:1;--nb-emphasis-area:100px" data-palette="1" data-palette-variation="1" data-color-signal="0"><!-- wp:heading {"level":1,"className":"has-larger-font-size","fontSize":"larger"} -->
<h1 class="has-larger-font-size" id="search-results">' . esc_html__( 'Search results', '__theme_txtd' ) . '</h1>
<!-- /wp:heading -->

<!-- wp:search {"label":"' . esc_html__( 'Search', '__theme_txtd' ) . '","showLabel":false,"width":null,"widthUnit":"%","buttonText":"' . esc_html__( 'Search', '__theme_txtd' ) . '"} /--></div>
<!-- /wp:group -->',
];
