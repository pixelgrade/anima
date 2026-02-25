import $ from 'jquery';

/**
 * Initial page load animation — the "opening curtain".
 * Ported from Pile's loadingAnimation.js.
 *
 * IMPORTANT: This only animates the border overlay and logo.
 * Hero content animations are handled by Hero.js (intro timeline + scroll scrub).
 * We must NOT touch hero elements here to avoid GSAP conflicts.
 */
export function playLoadingAnimation() {
  const $border = $( '.js-page-transition-border' );

  if ( ! $border.length ) {
    return;
  }

  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;

  // Logo fill slides in from left.
  gsap.to( '.border-logo-fill', {
    x: 0,
    duration: 0.3,
    ease: 'circ.in',
    onComplete: function() {
      $( '.border-logo' ).css( 'opacity', 0 );
    },
  } );

  // Logo background scales down.
  gsap.to( '.border-logo-bgscale', {
    scaleY: 0,
    duration: 0.3,
    delay: 0.3,
    ease: 'quad.inOut',
  } );

  // Border collapses from full-screen to zero.
  gsap.fromTo( $border[ 0 ], {
    borderWidth: windowHeight / 2 + 'px ' + windowWidth / 2 + 'px',
  }, {
    background: 'none',
    borderWidth: 0,
    duration: 0.6,
    delay: 0.5,
    ease: 'quart.inOut',
  } );
}
