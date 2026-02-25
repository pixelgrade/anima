import $ from 'jquery';

/**
 * Initial page load animation — the "opening curtain".
 * Ported from Pile's loadingAnimation.js.
 *
 * Uses the global `gsap` object (loaded from CDN by WordPress).
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

  // Hero content fades in.
  gsap.fromTo(
    '.novablocks-hero .nb-supernova-item__inner-container, .nb-supernova--card-layout-stacked.nb-supernova--1-columns.nb-supernova--align-full .nb-supernova-item__inner-container',
    { opacity: 0, y: 50 },
    { opacity: 1, y: 0, duration: 0.4, ease: 'quad.out', delay: 0.7 }
  );

  // Hero background scales down.
  gsap.fromTo(
    '.novablocks-hero .nb-supernova-item__media-wrapper, .nb-supernova--card-layout-stacked.nb-supernova--1-columns.nb-supernova--align-full .nb-supernova-item__media-wrapper',
    { scale: 1.2 },
    { scale: 1, duration: 0.4, ease: 'quad.out', delay: 0.7 }
  );
}
