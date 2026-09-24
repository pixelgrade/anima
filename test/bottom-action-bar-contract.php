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

if ( false === stripos( $style['label'], 'mobile' ) ) {
	anima_fail_bottom_action_bar_contract( 'Expected the block style label to say the bar is for mobile.' );
}

if ( [ 'wp_template', 'wp_template_part' ] !== ( $pattern['postTypes'] ?? null ) ) {
	anima_fail_bottom_action_bar_contract( 'Expected the pattern to be offered only where templates and template parts are edited.' );
}

// Only the Footer template part is marked, so only a Footer bar is pinned.
$bar_markup  = '<footer class="wp-block-template-part"><section class="wp-block-group is-style-bottom-action-bar"></section></footer>';
$plain_part  = '<footer class="wp-block-template-part"><p>Footer</p></footer>';
$is_marked   = static function ( $html ) {
	$processor = new WP_HTML_Tag_Processor( $html );
	return $processor->next_tag() && $processor->has_class( 'has-bottom-action-bar' );
};

if ( ! $is_marked( apply_filters( 'render_block_core/template-part', $bar_markup, [ 'blockName' => 'core/template-part', 'attrs' => [ 'area' => 'footer' ] ] ) ) ) {
	anima_fail_bottom_action_bar_contract( 'Expected a Footer-area part with a bar to be marked.' );
}

if ( ! $is_marked( apply_filters( 'render_block_core/template-part', $bar_markup, [ 'blockName' => 'core/template-part', 'attrs' => [ 'slug' => 'footer' ] ] ) ) ) {
	anima_fail_bottom_action_bar_contract( 'Expected the Footer area to be resolved from the template part slug.' );
}

if ( $is_marked( apply_filters( 'render_block_core/template-part', $bar_markup, [ 'blockName' => 'core/template-part', 'attrs' => [ 'slug' => 'header' ] ] ) ) ) {
	anima_fail_bottom_action_bar_contract( 'A bar in the Header part must not be marked.' );
}

if ( $plain_part !== apply_filters( 'render_block_core/template-part', $plain_part, [ 'blockName' => 'core/template-part', 'attrs' => [ 'slug' => 'footer' ] ] ) ) {
	anima_fail_bottom_action_bar_contract( 'A Footer part without a bar must render unchanged.' );
}

echo 'bottom-action-bar-contract: ok' . ( $nova_active ? ' (Nova Blocks active)' : ' (core only)' ) . PHP_EOL;
