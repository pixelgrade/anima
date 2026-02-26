import $ from 'jquery';
import {
  syncBodyClasses,
  syncPageAssets,
  syncDocumentTitle,
  syncAdminBar,
  reinitComponents,
  cleanupBeforeTransition,
  trackPageview,
} from './utils';

/**
 * Wraps a GSAP timeline in a Promise.
 * Resolves when the timeline completes.
 */
function timelinePromise( timeline ) {
  return new Promise( ( resolve ) => {
    timeline.eventCallback( 'onComplete', () => {
      resolve( true );
    } );
  } );
}

/**
 * Create the "border expanding inward" timeline for page leave.
 * Ported from Pile's borderOutTimeline().
 */
function createBorderOutTimeline() {
  const $border = $( '.js-page-transition-border' );
  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;
  const borderX = windowWidth / 2;
  const borderY = windowHeight / 2;

  const timeline = gsap.timeline( { paused: true } );

  $border.css( {
    top: 0,
    left: 0,
    width: windowWidth,
    height: windowHeight,
    borderWidth: '0 0',
    borderColor: 'var(--sm-current-accent-color)',
    display: 'block',
  } );

  timeline.fromTo( $border[ 0 ], {
    x: 0,
    y: 0,
    scale: 1,
  }, {
    borderTopWidth: borderY,
    borderBottomWidth: borderY,
    borderLeftWidth: borderX,
    borderRightWidth: borderX,
    duration: 0.6,
    ease: 'quart.inOut',
  } );

  return timeline;
}

/**
 * Create the "border collapsing outward" timeline for page enter.
 * Ported from Pile's FadeTransition.fadeIn().
 *
 * IMPORTANT: Only animates the border overlay itself.
 * Hero content animations are handled by Hero.js after reinitComponents().
 */
function createBorderInTimeline() {
  const $border = $( '.js-page-transition-border' );

  const timeline = gsap.timeline( {
    paused: true,
    onComplete: () => {
      // Clear all GSAP inline styles from the border element so it returns
      // to its CSS-defined state (border: 0 solid transparent).
      gsap.set( $border[ 0 ], { clearProps: 'all' } );
    },
  } );

  timeline.to( $border[ 0 ], {
    borderWidth: 0,
    duration: 0.6,
    ease: 'quart.inOut',
  } );

  return timeline;
}

/**
 * The Barba.js v2 transition definition.
 * Ported from Pile's FadeTransition (Barba v1).
 */
export const pageTransition = {
  name: 'page-transition',

  leave( { current } ) {
    const timeline = createBorderOutTimeline();
    timeline.play();

    // Close mobile nav if open.
    $( 'body' ).removeClass( 'nav-is-open' );

    return timelinePromise( timeline ).then( () => {
      // Cleanup heavy resources from the old page.
      cleanupBeforeTransition();

      // Hide old container.
      $( current.container ).hide();
    } );
  },

  enter( { next } ) {
    // Scroll to top.
    window.scrollTo( 0, 0 );

    // Reset border background.
    $( '.js-page-transition-border' ).css( 'backgroundColor', 'transparent' );

    // Sync WordPress state from new page HTML.
    const html = next.html;
    syncPageAssets( html );
    syncBodyClasses( html );
    syncDocumentTitle( html );

    // Sync admin bar using the container element (reads inline JSON).
    syncAdminBar( next.container );

    // Re-initialize components on new DOM.
    // This creates fresh Hero instances which run their own intro timelines.
    reinitComponents();

    // Track pageview.
    trackPageview();

    // Play the border-only enter animation.
    const timeline = createBorderInTimeline();
    timeline.play();

    return timelinePromise( timeline );
  },
};
