<?php
/**
 * View Transitions engine — SPIKE (H3 of the page-transitions roadmap, #530).
 *
 * Cross-document View Transitions + Speculation Rules as a candidate
 * replacement for the Barba engine: real navigations (every plugin, form,
 * and script works by construction) with the wipe choreography declared in
 * CSS between the old-page snapshot and the new page.
 *
 * DEV-ONLY OPT-IN: activate with `?anima-vt=1` (carried across same-origin
 * links by the inline script) or the `anima/view_transitions_spike` filter.
 * Mutually exclusive with the Barba engine — the spike deactivates it.
 *
 * Replication target (slide_wipe, from slide-wipe-loader.js):
 * - cover: .c-loader x -100% -> 0 with .c-loader__mask counter-moving
 *   x 100% -> 0, 1s quint.inOut (two-layer masked parallax)
 * - reveal: mirrored, loader 0 -> 100%, mask 0 -> -100%
 * - minimum hold 900ms; cycling-images loader content animates during waits
 *
 * @package Anima
 */

// If this file is called directly, abort.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Whether the View Transitions spike is active for this request.
 *
 * @return bool
 */
function anima_view_transitions_spike_active() {
	// phpcs:ignore WordPress.Security.NonceVerification.Recommended -- dev-only presence marker.
	if ( isset( $_GET['anima-vt'] ) ) {
		return true;
	}

	return (bool) apply_filters( 'anima/view_transitions_spike', false );
}

/**
 * The Barba engine must stand down while the spike drives navigation.
 */
add_filter( 'anima/page_transitions_in_customize_preview', function ( $allowed ) {
	return anima_view_transitions_spike_active() ? false : $allowed;
}, 20 );

add_action( 'wp_enqueue_scripts', function () {
	if ( ! anima_view_transitions_spike_active() ) {
		return;
	}

	// Disable the Barba engine script for this request.
	wp_dequeue_script( 'anima-page-transitions' );
}, 20 );

add_action( 'wp_head', 'anima_view_transitions_spike_head', 5 );
/**
 * Print the cross-document View Transition opt-in, the wipe choreography,
 * and the Speculation Rules prerender hint.
 */
function anima_view_transitions_spike_head() {
	if ( ! anima_view_transitions_spike_active() ) {
		return;
	}

	?>
	<style id="anima-vt-spike">
		/* Opt this document into cross-document view transitions. */
		@view-transition {
			navigation: auto;
		}

		/* quint.inOut ≈ cubic-bezier(.83, 0, .17, 1) — same curve GSAP uses. */
		:root {
			--vt-wipe-ease: cubic-bezier(.83, 0, .17, 1);
			--vt-wipe-duration: 1s;
		}

		/* The wipe overlay lives in BOTH documents (printed below) and is
		   promoted to its own snapshot layer. Old page: it sits offscreen.
		   The transition animates it across the viewport — covering the old
		   snapshot, then revealing the new page — a single continuous pass
		   approximating the cover+reveal choreography. */
		.anima-vt-wipe {
			position: fixed;
			inset: 0;
			z-index: 99999;
			background: var(--sm-current-bg-color, #1e1e1e);
			transform: translateX(-100%);
			pointer-events: none;
			view-transition-name: anima-wipe;
		}

		/* Old page stays frozen beneath; no default cross-fade. */
		::view-transition-old(root) {
			animation: none;
		}
		::view-transition-new(root) {
			animation: anima-vt-reveal-hold var(--vt-wipe-duration) steps(1, end) both;
		}

		/* The overlay sweeps across: -100% -> 0 (covers old) -> 100% (reveals new). */
		::view-transition-group(anima-wipe) {
			animation-duration: calc(var(--vt-wipe-duration) * 2);
		}
		::view-transition-old(anima-wipe),
		::view-transition-new(anima-wipe) {
			animation: anima-vt-wipe calc(var(--vt-wipe-duration) * 2) var(--vt-wipe-ease) both;
		}

		@keyframes anima-vt-wipe {
			0%   { transform: translateX(-100%); }
			50%  { transform: translateX(0); }
			100% { transform: translateX(100%); }
		}

		/* Hide the incoming page until the overlay has covered the viewport. */
		@keyframes anima-vt-reveal-hold {
			0%   { opacity: 0; }
			50%  { opacity: 1; }
			100% { opacity: 1; }
		}
	</style>
	<script type="speculationrules">
	{
		"prerender": [ {
			"where": { "and": [
				{ "href_matches": "/*" },
				{ "not": { "href_matches": "/wp-admin/*" } },
				{ "not": { "href_matches": "*add-to-cart*" } }
			] },
			"eagerness": "moderate"
		} ]
	}
	</script>
	<?php
}

add_action( 'wp_body_open', function () {
	if ( ! anima_view_transitions_spike_active() ) {
		return;
	}

	// The wipe overlay element — present in every document so both the old
	// and new snapshots have the named layer.
	echo '<div class="anima-vt-wipe" aria-hidden="true"></div>';
} );

add_action( 'wp_footer', function () {
	if ( ! anima_view_transitions_spike_active() ) {
		return;
	}

	?>
	<script id="anima-vt-spike-js">
		( function () {
			// Carry the dev opt-in across same-origin links.
			document.addEventListener( 'click', function ( event ) {
				const link = event.target.closest && event.target.closest( 'a[href]' );
				if ( ! link || link.origin !== window.location.origin ) {
					return;
				}
				try {
					const url = new URL( link.href );
					if ( ! url.searchParams.has( 'anima-vt' ) ) {
						url.searchParams.set( 'anima-vt', '1' );
						link.href = url.toString();
					}
				} catch ( e ) {}
			}, true );

			// Re-release the intro-animations gate after the reveal completes,
			// mirroring notifyPageTransitionComplete() in the Barba engine.
			window.addEventListener( 'pagereveal', function ( event ) {
				if ( ! event.viewTransition ) {
					return;
				}
				event.viewTransition.finished.then( function () {
					window.dispatchEvent( new CustomEvent( 'anima:page-transition-complete' ) );
				} );
			} );
			window.addEventListener( 'pageswap', function ( event ) {
				if ( event.viewTransition ) {
					window.dispatchEvent( new CustomEvent( 'anima:page-transition-start' ) );
				}
			} );
		} )();
	</script>
	<?php
}, 99 );
