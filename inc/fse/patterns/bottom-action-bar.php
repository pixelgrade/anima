<?php
/**
 * Bottom action bar: call / email buttons pinned to the bottom of the
 * viewport below `lap`, alongside the mobile menu. It only pins inside the
 * Footer template part, so it appears on every page.
 *
 * Nova Blocks augments the saved markup of every Group, so the pattern ships
 * the serialization that validates in the active runtime.
 */

$label      = __( 'Quick contact', '__theme_txtd' );
$call_label = __( 'Call us', '__theme_txtd' );
$mail_label = __( 'Email us', '__theme_txtd' );

$group_attributes = serialize_block_attributes( [
	'tagName'   => 'section',
	'className' => 'is-style-bottom-action-bar',
	'layout'    => [
		'type'           => 'flex',
		'flexWrap'       => 'nowrap',
		'justifyContent' => 'center',
	],
	'ariaLabel' => $label,
] );

$group_class = 'wp-block-group is-style-bottom-action-bar';
$group_extra = '';

if ( WP_Block_Type_Registry::get_instance()->is_registered( 'novablocks/header' ) ) {
	$group_class .= ' sm-palette-1 sm-variation-1 sm-color-signal-0';
	$group_extra  = ' style="--nb-emphasis-top-spacing:0;--nb-emphasis-bottom-spacing:0;--nb-block-top-spacing:1;--nb-block-bottom-spacing:0;--nb-block-zindex:0;--nb-card-content-area-width:50%;--nb-card-media-container-height:50;--nb-card-content-padding-multiplier:0;--nb-card-media-padding-top:75.75757575757575%;--nb-card-media-aspect-ratio:1.32;--nb-card-media-object-fit:cover;--nb-card-media-padding-multiplier:0;--nb-card-layout-gap-modifier:0;--nb-min-height-fallback:0;--nb-minimum-container-height:0vh;--nb-spacing-modifier:1;--nb-spacing-multiplier-override:1;--nb-emphasis-area:100" data-palette="1" data-palette-variation="1" data-color-signal="0"';
}

return [
	'title'       => __( 'Bottom action bar (call / email)', '__theme_txtd' ),
	'description' => __( 'Call and email buttons pinned to the bottom of the screen on phones and tablets, where the site shows its mobile menu. Hidden on wider screens. Add it to the Footer template part.', '__theme_txtd' ),
	'categories'  => [ 'footer', 'call-to-action' ],
	// Only offered where the Footer template part is edited.
	'postTypes'   => [ 'wp_template', 'wp_template_part' ],
	'keywords'    => [ 'phone', 'call', 'email', 'contact', 'sticky', 'mobile' ],
	'content'     => '<!-- wp:group ' . $group_attributes . ' -->
<section aria-label="' . esc_attr( $label ) . '" class="' . $group_class . '"' . $group_extra . '><!-- wp:buttons {"layout":{"type":"flex","justifyContent":"center","flexWrap":"nowrap"}} -->
<div class="wp-block-buttons"><!-- wp:button -->
<div class="wp-block-button"><a class="wp-block-button__link wp-element-button" href="tel:+15555550100">' . esc_html( $call_label ) . '</a></div>
<!-- /wp:button -->

<!-- wp:button -->
<div class="wp-block-button"><a class="wp-block-button__link wp-element-button" href="mailto:hello@example.com">' . esc_html( $mail_label ) . '</a></div>
<!-- /wp:button --></div>
<!-- /wp:buttons --></section>
<!-- /wp:group -->',
];
