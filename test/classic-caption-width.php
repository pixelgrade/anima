<?php
/**
 * Contract for classic captions' fluid width (#611).
 *
 * WordPress renders `[caption width="N"]` as a figure with an inline
 * `style="width: Npx"`. Inside Nova's layout grid that fixed width is the
 * figure's min-content contribution, so it widens the grid tracks and the
 * whole page, and a stylesheet `max-width: 100%` cannot stop it. Anima turns
 * the inline width into `min(100%, Npx)`: the authored width still applies
 * where it fits, and the figure never outgrows its container.
 *
 * Run from the theme root:
 * php test/classic-caption-width.php
 */

define( 'ABSPATH', __DIR__ . '/' );

$registered = array();

if ( ! function_exists( 'add_filter' ) ) {
	function add_filter( $hook, $callback, $priority = 10 ) {
		$GLOBALS['registered'][] = array( $hook, $callback, $priority );
	}
}

require_once dirname( __DIR__ ) . '/inc/classic-captions.php';

$failures = array();
$check    = function ( $label, $expected, $actual ) use ( &$failures ) {
	if ( $expected !== $actual ) {
		$failures[] = sprintf( "%s\n  expected: %s\n  actual:   %s", $label, $expected, $actual );
	}
};

if ( ! function_exists( 'anima_fluid_classic_caption_width' ) ) {
	fwrite( STDERR, "Missing anima_fluid_classic_caption_width().\n" );
	exit( 1 );
}

// Runs on the_content after shortcodes (priority 11), so it sees shortcode output.
$hooked = array_filter(
	$registered,
	function ( $entry ) {
		return 'the_content' === $entry[0] && 'anima_fluid_classic_caption_width' === $entry[1];
	}
);
if ( 1 !== count( $hooked ) || current( $hooked )[2] <= 11 ) {
	$failures[] = 'anima_fluid_classic_caption_width must be hooked once to the_content after do_shortcode (priority > 11).';
}

$f = 'anima_fluid_classic_caption_width';

// Core's HTML5 caption shortcode output.
$check(
	'shortcode figure',
	'<figure id="attachment_2" aria-describedby="caption-attachment-2" style="width: min(100%, 985px)" class="wp-caption aligncenter"><img src="a.jpg" width="985" height="657"><figcaption id="caption-attachment-2" class="wp-caption-text">Caption</figcaption></figure>',
	$f( '<figure id="attachment_2" aria-describedby="caption-attachment-2" style="width: 985px" class="wp-caption aligncenter"><img src="a.jpg" width="985" height="657"><figcaption id="caption-attachment-2" class="wp-caption-text">Caption</figcaption></figure>' )
);

// Imported, already-rendered HTML4 markup: a div, class first, other declarations kept.
$check(
	'imported div with extra declarations',
	'<div class="wp-caption alignright" style="margin: 0 auto;width:min(100%, 430px); border: 0"><img src="a.jpg" width="420"><p class="wp-caption-text">Caption</p></div>',
	$f( '<div class="wp-caption alignright" style="margin: 0 auto;width:430px; border: 0"><img src="a.jpg" width="420"><p class="wp-caption-text">Caption</p></div>' )
);

// Single quotes and a fractional width.
$check(
	'single-quoted style',
	"<figure class='wp-caption' style='width: min(100%, 300.5px)'></figure>",
	$f( "<figure class='wp-caption' style='width: 300.5px'></figure>" )
);

// Untouched: other elements, other properties, other units, already fluid.
$unchanged = array(
	'caption text'     => '<p class="wp-caption-text" style="width: 300px">Caption</p>',
	'unrelated class'  => '<figure class="wp-block-image" style="width: 300px"></figure>',
	'similar class'    => '<div class="my-wp-caption" style="width: 300px"></div>',
	'max-width only'   => '<figure class="wp-caption" style="max-width: 300px"></figure>',
	'percentage width' => '<figure class="wp-caption" style="width: 50%"></figure>',
	'already fluid'    => '<figure class="wp-caption" style="width: min(100%, 300px)"></figure>',
	'no style'         => '<figure class="wp-caption alignnone"></figure>',
	'no captions'      => '<p>Plain text with a width: 300px mention.</p>',
);
foreach ( $unchanged as $label => $html ) {
	$check( $label, $html, $f( $html ) );
}

if ( $failures ) {
	fwrite( STDERR, implode( "\n", $failures ) . "\n" );
	exit( 1 );
}

echo "Classic caption fluid width contract OK.\n";
