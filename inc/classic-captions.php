<?php
/**
 * Classic captions keep to their container (#611).
 *
 * WordPress renders `[caption width="N"]` as a figure with an inline
 * `style="width: Npx"`, and imported posts often carry the same markup already
 * rendered. The stylesheet caps `.wp-caption` at `max-width: 100%`, which is
 * enough in normal flow. Inside Nova's layout grid, though, a fixed width is
 * the figure's min-content contribution: it widens the flexible grid tracks,
 * and the whole page, whatever the figure's max-width. `min(100%, Npx)` keeps
 * the authored width where it fits and lets the grid ignore it otherwise.
 *
 * @package Anima
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! function_exists( 'anima_fluid_classic_caption_width' ) ) {
	/**
	 * Turn the inline pixel width of classic caption containers into `min(100%, Npx)`.
	 *
	 * @param string $content Post content, after shortcodes ran.
	 *
	 * @return string
	 */
	function anima_fluid_classic_caption_width( $content ) {
		if ( ! is_string( $content ) || false === strpos( $content, 'wp-caption' ) ) {
			return $content;
		}

		return preg_replace_callback(
			'/<(?:figure|div)\b[^>]*>/i',
			function ( $tag ) {
				$tag = $tag[0];

				if ( ! preg_match( '/\sclass\s*=\s*(["\'])(?:(?!\1).)*(?<![\w-])wp-caption(?![\w-])/i', $tag ) ) {
					return $tag;
				}

				return preg_replace_callback(
					'/(\sstyle\s*=\s*(["\']))((?:(?!\2).)*)\2/i',
					function ( $style ) {
						$declarations = preg_replace(
							'/(^|;)(\s*)width(\s*):(\s*)(\d+(?:\.\d+)?px)(\s*)(?=;|$)/i',
							'$1$2width$3:$4min(100%, $5)$6',
							$style[3]
						);

						return $style[1] . $declarations . $style[2];
					},
					$tag,
					1
				);
			},
			$content
		);
	}
}
// After do_shortcode (priority 11), so it also sees the [caption] output.
add_filter( 'the_content', 'anima_fluid_classic_caption_width', 12 );
