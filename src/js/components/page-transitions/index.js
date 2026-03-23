import $ from 'jquery';
import barba from '@barba/core';
import { pageTransition, cardExpandTransition } from './transitions';
import { slideWipePageTransition, slideWipeCardExpandTransition } from './slide-wipe-transitions';
import { playBorderIrisLoadingAnimation, playProgressBarComplete } from './loading-animation';
import * as SlideWipeLoader from './slide-wipe-loader';

// Ignored URL patterns — file extensions, admin, anchors.
const IGNORED_PATTERNS = [
  '.pdf', '.doc', '.eps', '.png', '.jpg', '.jpeg', '.zip',
  'wp-admin', 'wp-login', 'wp-',
  'feed',
  '#',
  '&add-to-cart=', '?add-to-cart=', '?remove_item',
];

/**
 * Initialize page transitions.
 *
 * Two independent settings control behavior:
 * - pageTransitionStyle: 'border_iris' | 'slide_wipe' — how pages swap
 * - logoLoadingStyle: 'progress_bar' | 'cycling_images' — what shows on first visit
 */
export function init() {
  const $body = $( 'body' );

  // Don't init in Customizer preview.
  if ( $body.hasClass( 'is--customizer-preview' ) ) {
    return;
  }

  const config = ( typeof animaPageTransitions !== 'undefined' ) ? animaPageTransitions : {};
  const pageTransitionStyle = config.pageTransitionStyle || 'border_iris';
  const logoLoadingStyle = config.logoLoadingStyle || 'progress_bar';

  const isSlideWipe = pageTransitionStyle === 'slide_wipe';
  const isCyclingImages = logoLoadingStyle === 'cycling_images';

  // Initialize overlay and loading content based on the 2x2 matrix.
  if ( isSlideWipe && isCyclingImages ) {
    // Slide Wipe + Cycling Images — original Fargo combo.
    SlideWipeLoader.init();
  } else if ( isSlideWipe && ! isCyclingImages ) {
    // Slide Wipe overlay + Progress Bar content.
    SlideWipeLoader.initOverlayOnly();
  } else if ( ! isSlideWipe && isCyclingImages ) {
    // Border Iris overlay + Cycling Images content.
    const $border = $( '.js-page-transition-border' );
    SlideWipeLoader.initCyclingImagesContent( $border );
  }
  // Border Iris + Progress Bar needs no special init — CSS keyframes handle it.

  // Merge server-side excluded URLs with client-side patterns.
  const serverExcluded = config.excludedUrls || [];

  // Select the correct page-to-page transition objects.
  const transitions = isSlideWipe
    ? [ slideWipeCardExpandTransition, slideWipePageTransition ]
    : [ cardExpandTransition, pageTransition ];

  barba.init( {
    prefetchIgnore: true,

    prevent: ( { el, href } ) => {
      if ( el.target && el.target === '_blank' ) {
        return true;
      }

      if ( el.hasAttribute( 'data-no-transition' ) ) {
        return true;
      }

      for ( const pattern of IGNORED_PATTERNS ) {
        if ( href.indexOf( pattern ) > -1 ) {
          return true;
        }
      }

      for ( const url of serverExcluded ) {
        if ( href.indexOf( url ) > -1 ) {
          return true;
        }
      }

      return false;
    },

    transitions,

    requestError: ( trigger, action, url ) => {
      window.location.href = url;
      return false;
    },
  } );

  barba.hooks.after( () => {
    $body.addClass( 'is-loaded' );
  } );

  // Minimum display times for each loading style.
  // Progress Bar: 2.5s — CSS intro takes 0.8s, then fill bar needs ~1.7s to show visible progress.
  // Cycling Images: uses the default MIN_DISPLAY_TIME (0.9s) from slide-wipe-loader.js.
  const PROGRESS_BAR_MIN_TIME = 2500;

  // For Cycling Images and Slide Wipe, mark as loaded immediately — the overlay covers the page.
  // For Progress Bar on Border Iris, defer is-loaded until the dismiss fires,
  // because the CSS rule `.is-loaded .border-logo .logo { opacity: 0 }` would
  // kill the logo prematurely while the fill bar is still progressing.
  const deferIsLoaded = ! isSlideWipe && ! isCyclingImages;
  if ( ! deferIsLoaded ) {
    $body.addClass( 'is-loaded' );
  }

  // Dispatch initial load animation based on the 2x2 matrix.
  if ( isSlideWipe && isCyclingImages ) {
    // Slide Wipe + Cycling Images: wait for load, then slide out.
    SlideWipeLoader.waitForLoadAndHide();
  } else if ( isSlideWipe && ! isCyclingImages ) {
    // Slide Wipe + Progress Bar: wait for load, complete progress bar, then slide out.
    SlideWipeLoader.waitForLoadThen( () => {
      playProgressBarComplete().then( () => {
        SlideWipeLoader.hide();
      } );
    }, PROGRESS_BAR_MIN_TIME );
  } else if ( ! isSlideWipe && isCyclingImages ) {
    // Border Iris + Cycling Images: wait for load, then collapse border.
    SlideWipeLoader.waitForLoadThen( () => {
      SlideWipeLoader.stopCyclingImages();
      const $border = $( '.js-page-transition-border' );
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;

      // Hide the cycling images content.
      $border.find( '.c-loader__logo' ).css( 'opacity', 0 );

      // Collapse the border overlay.
      gsap.fromTo( $border[ 0 ], {
        borderWidth: windowHeight / 2 + 'px ' + windowWidth / 2 + 'px',
      }, {
        background: 'none',
        borderWidth: 0,
        duration: 0.6,
        ease: 'quart.inOut',
      } );
    } );
  } else {
    // Border Iris + Progress Bar: wait for load, then play the opening curtain.
    // Defer is-loaded until after the progress bar content animation completes,
    // because the CSS `.is-loaded .border-logo .logo { opacity: 0 }` would
    // instantly hide the logo before the fill bar finishes.
    SlideWipeLoader.waitForLoadThen( () => {
      playProgressBarComplete().then( () => {
        $body.addClass( 'is-loaded' );
        // Now collapse the border.
        const $border = $( '.js-page-transition-border' );
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;
        gsap.fromTo( $border[ 0 ], {
          borderWidth: windowHeight / 2 + 'px ' + windowWidth / 2 + 'px',
        }, {
          background: 'none',
          borderWidth: 0,
          duration: 0.6,
          ease: 'quart.inOut',
        } );
      } );
    }, PROGRESS_BAR_MIN_TIME );
  }
}
