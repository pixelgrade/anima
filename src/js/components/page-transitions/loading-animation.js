import $ from 'jquery';

/**
 * Progress Bar loading content animations — the "opening curtain".
 * Ported from Pile's loadingAnimation.js.
 *
 * Animates the logo fill bar and logo visibility inside any overlay.
 * The overlay dismiss (border collapse or slide out) is handled separately.
 */

/**
 * Play the progress bar completion animation.
 * Call this when window.load fires to snap the fill bar to 100% and hide the logo.
 *
 * @return {Promise} Resolves when the content animation is done (~0.6s).
 */
export function playProgressBarComplete() {
  return new Promise( ( resolve ) => {
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
      onComplete: resolve,
    } );
  } );
}

/**
 * Play the full Border Iris loading animation (content + border collapse).
 * Used when page transition style is Border Iris + logo loading is Progress Bar.
 */
export function playBorderIrisLoadingAnimation() {
  const $border = $( '.js-page-transition-border' );

  if ( ! $border.length ) {
    return;
  }

  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;

  // Animate the progress bar content.
  playProgressBarComplete();

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
