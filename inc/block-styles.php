<?php
/**
 * Block styles — design-system styles for core blocks.
 *
 * Each style is a token applied to a core block, so it follows the active
 * palette (style variations recolor them for free). The preset custom
 * properties fall back to Style Manager tokens for the commercial build,
 * where theme.json presets are disabled.
 *
 * @package Anima
 */

// If this file is called directly, abort.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Register the block styles.
 *
 * @return void
 */
function anima_register_block_styles() {
	register_block_style(
		'core/quote',
		[
			'name'         => 'editorial',
			'label'        => __( 'Editorial', '__theme_txtd' ),
			'inline_style' => '
				.wp-block-quote.is-style-editorial {
					border: none;
					padding-left: 0;
					font-size: 1.35em;
					line-height: 1.5;
					font-family: var(--wp--preset--font-family--heading, inherit);
					color: var(--wp--preset--color--secondary, var(--sm-current-fg2-color, currentColor));
				}
				.wp-block-quote.is-style-editorial cite {
					font-size: 0.65em;
					font-family: var(--wp--preset--font-family--body, inherit);
					color: var(--sm-current-fg1-color, var(--wp--preset--color--contrast, currentColor));
				}
			',
		]
	);

	// Editorial (reading): the Editorial ornament over a reading-size quote,
	// e.g. for quote cards in narrow tracks (nova-blocks#652). The type roles
	// come from the block bundles; this is the wp.org / no-bundle baseline.
	register_block_style(
		'core/quote',
		[
			'name'         => 'editorial-reading',
			'label'        => __( 'Editorial (reading)', '__theme_txtd' ),
			'inline_style' => '
				.wp-block-quote.is-style-editorial-reading {
					border: none;
					padding-left: 0;
					text-align: center;
					font-family: var(--wp--preset--font-family--body, inherit);
				}
				.wp-block-quote.is-style-editorial-reading cite {
					font-size: 0.8em;
					font-family: var(--wp--preset--font-family--body, inherit);
					color: var(--sm-current-fg1-color, var(--wp--preset--color--contrast, currentColor));
				}
			',
		]
	);

	register_block_style(
		'core/group',
		[
			'name'         => 'panel',
			'label'        => __( 'Panel', '__theme_txtd' ),
			'inline_style' => '
				.wp-block-group.is-style-panel {
					background-color: var(--wp--preset--color--tertiary, var(--sm-current-bg2-color, #f0f0ec));
					border-radius: 10px;
					padding: clamp(1.5rem, 4vw, 3rem);
				}
			',
		]
	);

	register_block_style(
		'core/group',
		[
			'name'  => 'bottom-action-bar',
			'label' => __( 'Bottom action bar (mobile)', '__theme_txtd' ),
			// Inside the Footer template part: pinned to the bottom of the
			// viewport below `lap` (with the mobile menu), hidden on wider
			// screens. Anywhere else it is a plain row of buttons. The styles
			// live in the block bundles (src/scss/blocks/core/group/) because
			// they need breakpoints and separate editor/frontend behaviour.
		]
	);

	register_block_style(
		'core/categories',
		[
			'name'         => 'filter-row',
			'label'        => __( 'Filter row', '__theme_txtd' ),
			// A horizontal collection switcher for archive headers — the list
			// sheds its bullets and reads as quiet uppercase links.
			'inline_style' => '
				.wp-block-categories.is-style-filter-row {
					list-style: none;
					margin: 0;
					padding: 0;
					display: flex;
					flex-wrap: wrap;
					gap: 0.4rem 1.4rem;
					text-transform: uppercase;
					letter-spacing: 0.08em;
				}
				.wp-block-categories.is-style-filter-row li {
					margin: 0;
				}
			',
		]
	);

	register_block_style(
		'core/separator',
		[
			'name'         => 'grade-ramp',
			'label'        => __( 'Grade ramp', '__theme_txtd' ),
			// The theme's signature grade ramp: measured light-to-dark steps
			// of the Primary colour, so it recolors with the active palette.
			'inline_style' => '
				.wp-block-separator.is-style-grade-ramp {
					--anima-ramp-color: var(--wp--preset--color--primary, var(--sm-current-accent-color, #5663d5));
					border: none;
					height: 0.375rem;
					max-width: none;
					opacity: 1;
					background: linear-gradient(
						to right,
						color-mix(in srgb, var(--anima-ramp-color) 33%, #fff) 0 12.5%,
						color-mix(in srgb, var(--anima-ramp-color) 57%, #fff) 12.5% 25%,
						color-mix(in srgb, var(--anima-ramp-color) 80%, #fff) 25% 37.5%,
						var(--anima-ramp-color) 37.5% 50%,
						color-mix(in srgb, var(--anima-ramp-color) 84%, #000) 50% 62.5%,
						color-mix(in srgb, var(--anima-ramp-color) 63%, #000) 62.5% 75%,
						color-mix(in srgb, var(--anima-ramp-color) 43%, #000) 75% 87.5%,
						color-mix(in srgb, var(--anima-ramp-color) 22%, #000) 87.5% 100%
					);
				}
			',
		]
	);
}
add_action( 'init', 'anima_register_block_styles' );

/**
 * Mark the Footer template part that holds a Bottom action bar.
 *
 * The bar is only pinned inside the Footer area: one place, one bar per page,
 * and no transformed content ancestors that would break `position: fixed`.
 * The wrapper tag can be changed per template, so the area is resolved from
 * the template part itself rather than from its tag.
 *
 * @param string $block_content The rendered template part.
 * @param array  $block         The parsed block.
 *
 * @return string
 */
function anima_mark_footer_bottom_action_bar( $block_content, $block ) {
	if ( '' === $block_content || false === strpos( $block_content, 'is-style-bottom-action-bar' ) ) {
		return $block_content;
	}

	$area = $block['attrs']['area'] ?? '';

	if ( '' === $area && ! empty( $block['attrs']['slug'] ) ) {
		$theme         = $block['attrs']['theme'] ?? get_stylesheet();
		$template_part = get_block_template( $theme . '//' . $block['attrs']['slug'], 'wp_template_part' );
		$area          = $template_part->area ?? '';
	}

	if ( WP_TEMPLATE_PART_AREA_FOOTER !== $area ) {
		return $block_content;
	}

	$processor = new WP_HTML_Tag_Processor( $block_content );

	if ( $processor->next_tag() ) {
		$processor->add_class( 'has-bottom-action-bar' );
	}

	return $processor->get_updated_html();
}
add_filter( 'render_block_core/template-part', 'anima_mark_footer_bottom_action_bar', 10, 2 );
