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
					color: var(--wp--preset--color--contrast, var(--sm-current-fg1-color, currentColor));
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
