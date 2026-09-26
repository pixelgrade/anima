<?php
/**
 * Contract test: quote-format cards keep a classic post's plain first
 * paragraph's inline formatting (#615).
 *
 * Classic posts usually hold the quote as a plain paragraph, not a
 * `<blockquote>`/`core/quote` block. `anima_get_post_expression_quote_extract()`
 * used to hand that paragraph to `quote_html` only after `wp_strip_all_tags()`
 * had already dropped its links and emphasis (inc/post-expressions.php,
 * `anima_get_first_paragraph_text()`), so the card rendered plain text even
 * though nova-blocks#652 can render a real `quote_html`.
 *
 * Run standalone (no WordPress bootstrap needed — this stubs the handful of
 * WP functions the extraction path calls):
 * php test/quote-card-plain-paragraph-formatting-contract.php
 */

if ( ! defined( 'ABSPATH' ) ) {
	define( 'ABSPATH', dirname( __DIR__ ) . '/' );
}

// --- Minimal WP stand-ins, just enough for inc/post-expressions.php to run. ---

class WP_Post {
	public $ID           = 1;
	public $post_content = '';
	public $post_excerpt  = '';

	public function __construct( array $args = [] ) {
		foreach ( $args as $key => $value ) {
			$this->$key = $value;
		}
	}
}

$GLOBALS['anima_test_excerpt'] = [
	'has'   => false,
	'value' => '',
];

function has_excerpt( $post = null ) {
	return $GLOBALS['anima_test_excerpt']['has'];
}

function get_the_excerpt( $post = null ) {
	return $GLOBALS['anima_test_excerpt']['value'];
}

function render_block( array $block ) {
	// Stand-in for WP's block renderer: for this contract, the fixture's
	// innerHTML for the core/quote block IS the markup a render would
	// produce, so returning it directly keeps the parsing under test.
	return (string) ( $block['innerHTML'] ?? '' );
}

function wp_strip_all_tags( $string, $remove_breaks = false ) {
	$string = (string) $string;
	$string = preg_replace( '@<(script|style)[^>]*?>.*?</\\1>@si', '', $string );
	$string = strip_tags( $string );

	if ( $remove_breaks ) {
		$string = preg_replace( '/[\r\n\t ]+/', ' ', $string );
	}

	return trim( $string );
}

function esc_html( $text ) {
	return htmlspecialchars( (string) $text, ENT_QUOTES, 'UTF-8' );
}

function esc_attr( $text ) {
	return htmlspecialchars( (string) $text, ENT_QUOTES, 'UTF-8' );
}

/**
 * A small, deliberately permissive stand-in for wp_kses(): enough to drop
 * disallowed tags (keeping their text) while keeping the allow-listed ones,
 * which is all this contract needs from it.
 */
function wp_kses( $string, array $allowed_html ) {
	return preg_replace_callback(
		'/<(\/?)([a-zA-Z0-9]+)( [^>]*)?>/',
		static function ( $matches ) use ( $allowed_html ) {
			$tag = strtolower( $matches[2] );

			if ( ! array_key_exists( $tag, $allowed_html ) ) {
				return '';
			}

			if ( '' !== $matches[1] ) {
				return '</' . $tag . '>';
			}

			$allowed_attrs = $allowed_html[ $tag ];
			$attrs         = '';

			if ( ! empty( $allowed_attrs ) && ! empty( $matches[3] ) ) {
				foreach ( array_keys( $allowed_attrs ) as $attr_name ) {
					if ( preg_match( '/\b' . preg_quote( $attr_name, '/' ) . '=("[^"]*"|\'[^\']*\')/', $matches[3], $attr_match ) ) {
						$attrs .= ' ' . $attr_name . '=' . $attr_match[1];
					}
				}
			}

			return '<' . $tag . $attrs . '>';
		},
		$string
	);
}

// --- Load the real source under test. ---

require_once dirname( __DIR__ ) . '/inc/post-expressions.php';

$failures = [];

function anima_contract_assert( bool $condition, string $message, array &$failures ): void {
	if ( ! $condition ) {
		$failures[] = $message;
	}
}

// 1. Classic post, plain first paragraph with a link, bold and italic:
// the card must keep them.
$GLOBALS['anima_test_excerpt'] = [ 'has' => false, 'value' => '' ];
$post = new WP_Post( [
	'post_content' => '<p>Read the <a href="https://example.com">full report</a> and <strong>act now</strong>, or <em>wait</em>.</p>',
] );
$extract = anima_get_post_expression_quote_extract( $post, [] );

anima_contract_assert( str_contains( $extract['quote_html'], '<a href="https://example.com">full report</a>' ), 'classic plain paragraph: link dropped from quote_html: ' . $extract['quote_html'], $failures );
anima_contract_assert( str_contains( $extract['quote_html'], '<strong>act now</strong>' ), 'classic plain paragraph: <strong> dropped from quote_html: ' . $extract['quote_html'], $failures );
anima_contract_assert( str_contains( $extract['quote_html'], '<em>wait</em>' ), 'classic plain paragraph: <em> dropped from quote_html: ' . $extract['quote_html'], $failures );
anima_contract_assert( 'Read the full report and act now, or wait.' === $extract['quote'], 'classic plain paragraph: plain-text quote changed: ' . $extract['quote'], $failures );

// 2. Same repro through the parsed-blocks path (a Gutenberg post whose first
// block is a plain core/paragraph, no core/quote).
$blocks = [
	[
		'blockName' => 'core/paragraph',
		'innerHTML' => '<p>Read the <a href="https://example.com">full report</a> and <strong>act now</strong>.</p>',
	],
];
$extract_blocks = anima_get_post_expression_quote_extract( $post, $blocks );
anima_contract_assert( str_contains( $extract_blocks['quote_html'], '<a href="https://example.com">full report</a>' ), 'blocks-path plain paragraph: link dropped from quote_html: ' . $extract_blocks['quote_html'], $failures );
anima_contract_assert( str_contains( $extract_blocks['quote_html'], '<strong>act now</strong>' ), 'blocks-path plain paragraph: <strong> dropped from quote_html: ' . $extract_blocks['quote_html'], $failures );

// 3. Regression: an unformatted plain paragraph renders byte-identically to
// the old esc_html() output — no visible change for the common case.
$plain_post = new WP_Post( [ 'post_content' => '<p>Nothing fancy here.</p>' ] );
$plain_extract = anima_get_post_expression_quote_extract( $plain_post, [] );
anima_contract_assert( 'Nothing fancy here.' === $plain_extract['quote_html'], 'unformatted paragraph: quote_html changed for the plain case: ' . $plain_extract['quote_html'], $failures );
anima_contract_assert( 'Nothing fancy here.' === $plain_extract['quote'], 'unformatted paragraph: quote changed: ' . $plain_extract['quote'], $failures );

// 4. Block quote (core/quote) post: unchanged, still sourced from the
// blockquote branch, not the paragraph fallback.
$quote_blocks = [
	[
		'blockName' => 'core/quote',
		'innerHTML' => '<blockquote class="wp-block-quote"><p>A quote with <a href="https://example.com">a link</a> and <em>emphasis</em>.</p><cite>Someone</cite></blockquote>',
	],
];
$quote_post = new WP_Post( [ 'post_content' => '<!-- wp:quote --><blockquote class="wp-block-quote"><p>A quote with <a href="https://example.com">a link</a> and <em>emphasis</em>.</p><cite>Someone</cite></blockquote><!-- /wp:quote -->' ] );
$quote_extract = anima_get_post_expression_quote_extract( $quote_post, $quote_blocks );
anima_contract_assert( str_contains( $quote_extract['quote_html'], '<a href="https://example.com">a link</a>' ), 'core/quote: link missing from quote_html (regression): ' . $quote_extract['quote_html'], $failures );
anima_contract_assert( 'Someone' === $quote_extract['quote_citation'], 'core/quote: citation regressed: ' . $quote_extract['quote_citation'], $failures );
anima_contract_assert( 'A quote with a link and emphasis.' === $quote_extract['quote'], 'core/quote: plain quote regressed: ' . $quote_extract['quote'], $failures );

// 5. Excerpt-only fallback: unchanged, still plain-text escaped even though
// the excerpt happens to carry raw markup.
$GLOBALS['anima_test_excerpt'] = [ 'has' => true, 'value' => 'An excerpt with <strong>markup</strong> in it.' ];
$excerpt_post = new WP_Post( [ 'post_content' => '<p>This paragraph must not be used.</p>' ] );
$excerpt_extract = anima_get_post_expression_quote_extract( $excerpt_post, [] );
anima_contract_assert( 'An excerpt with markup in it.' === $excerpt_extract['quote'], 'excerpt fallback: plain quote regressed: ' . $excerpt_extract['quote'], $failures );
anima_contract_assert( 'An excerpt with markup in it.' === $excerpt_extract['quote_html'], 'excerpt fallback: quote_html must stay escaped plain text, got: ' . $excerpt_extract['quote_html'], $failures );
anima_contract_assert( ! str_contains( $excerpt_extract['quote_html'], '<strong>' ), 'excerpt fallback: must not gain inline markup: ' . $excerpt_extract['quote_html'], $failures );

// 6. Disallowed tags (script) never reach quote_html, even from a plain
// paragraph.
$unsafe_post = new WP_Post( [ 'post_content' => '<p>Safe text<script>alert(1)</script> and more.</p>' ] );
$unsafe_extract = anima_get_post_expression_quote_extract( $unsafe_post, [] );
anima_contract_assert( ! str_contains( $unsafe_extract['quote_html'], 'script' ), 'plain paragraph: <script> leaked into quote_html: ' . $unsafe_extract['quote_html'], $failures );

if ( ! empty( $failures ) ) {
	fwrite( STDERR, implode( PHP_EOL, $failures ) . PHP_EOL );
	exit( 1 );
}

echo "Quote card plain-paragraph formatting contract OK\n";
