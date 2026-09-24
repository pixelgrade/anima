<?php
/**
 * Contract test for the Bottom action bar block style and pattern (#607).
 *
 * Run inside a site with the theme active, e.g.:
 * studio wp eval-file wp-content/bottom-action-bar-contract.php
 */

function anima_fail_bottom_action_bar_contract( string $message ): void {
	fwrite( STDERR, $message . PHP_EOL );
	exit( 1 );
}

if ( ! defined( 'ABSPATH' ) ) {
	anima_fail_bottom_action_bar_contract( 'This script must run through wp eval-file.' );
}

$style = WP_Block_Styles_Registry::get_instance()->get_registered( 'core/group', 'bottom-action-bar' );

if ( empty( $style ) || empty( $style['label'] ) ) {
	anima_fail_bottom_action_bar_contract( 'Expected the core/group "bottom-action-bar" block style to be registered.' );
}

$pattern = WP_Block_Patterns_Registry::get_instance()->get_registered( 'anima/bottom-action-bar' );

if ( empty( $pattern ) ) {
	anima_fail_bottom_action_bar_contract( 'Expected the anima/bottom-action-bar pattern to be registered.' );
}

if ( ! empty( $pattern['blockTypes'] ) ) {
	anima_fail_bottom_action_bar_contract( 'The bar goes inside the Footer part; it must not be offered as a Footer replacement.' );
}

$blocks = array_values( array_filter( parse_blocks( $pattern['content'] ), static function ( $block ) {
	return ! empty( $block['blockName'] );
} ) );

if ( 1 !== count( $blocks ) || 'core/group' !== $blocks[0]['blockName'] ) {
	anima_fail_bottom_action_bar_contract( 'Expected the pattern to be a single core/group.' );
}

$group = $blocks[0];
$attrs = $group['attrs'];

if ( 'section' !== ( $attrs['tagName'] ?? '' ) || empty( $attrs['ariaLabel'] ) ) {
	anima_fail_bottom_action_bar_contract( 'Expected a named landmark: tagName "section" with an ariaLabel.' );
}

if ( 'is-style-bottom-action-bar' !== ( $attrs['className'] ?? '' ) ) {
	anima_fail_bottom_action_bar_contract( 'Expected the Group to carry only the bottom-action-bar style class.' );
}

if ( false === strpos( $group['innerHTML'], 'aria-label="' . esc_attr( $attrs['ariaLabel'] ) . '"' ) ) {
	anima_fail_bottom_action_bar_contract( 'Expected the saved aria-label to match the ariaLabel attribute.' );
}

$nova_active  = WP_Block_Type_Registry::get_instance()->is_registered( 'novablocks/header' );
$has_nova_mark = false !== strpos( $group['innerHTML'], 'sm-palette-1 sm-variation-1 sm-color-signal-0' );

if ( $nova_active !== $has_nova_mark ) {
	anima_fail_bottom_action_bar_contract( 'Expected Nova Group markup exactly when Nova Blocks is active.' );
}

$buttons = $group['innerBlocks'][0] ?? null;

if ( ! $buttons || 'core/buttons' !== $buttons['blockName'] || count( $buttons['innerBlocks'] ) < 2 ) {
	anima_fail_bottom_action_bar_contract( 'Expected core/buttons with the call and email buttons.' );
}

$hrefs = array_map( static function ( $button ) {
	preg_match( '/href="([^"]+)"/', $button['innerHTML'], $match );
	return $match[1] ?? '';
}, $buttons['innerBlocks'] );

if ( 0 !== strpos( $hrefs[0], 'tel:' ) || 0 !== strpos( $hrefs[1], 'mailto:' ) ) {
	anima_fail_bottom_action_bar_contract( 'Expected a tel: button followed by a mailto: button.' );
}

$rendered = do_blocks( $pattern['content'] );

if ( false === strpos( $rendered, '<section aria-label=' ) ) {
	anima_fail_bottom_action_bar_contract( 'Expected the rendered bar to be a named <section>.' );
}

echo 'bottom-action-bar-contract: ok' . ( $nova_active ? ' (Nova Blocks active)' : ' (core only)' ) . PHP_EOL;
