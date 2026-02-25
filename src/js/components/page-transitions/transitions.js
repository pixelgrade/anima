import $ from 'jquery';
import {
  syncBodyClasses,
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
 */
function createBorderInTimeline() {
  const $border = $( '.js-page-transition-border' );

  const timeline = gsap.timeline( { paused: true } );

  timeline.to( $border[ 0 ], {
    borderWidth: 0,
    duration: 0.6,
    ease: 'quart.inOut',
  } );

  // Hero content fades in.
  timeline.fromTo(
    '.novablocks-hero .nb-supernova-item__inner-container, .nb-supernova--card-layout-stacked.nb-supernova--1-columns.nb-supernova--align-full .nb-supernova-item__inner-container',
    { opacity: 0, y: 50 },
    { opacity: 1, y: 0, duration: 0.4, ease: 'quad.out' },
    '-=0.4'
  );

  // Hero background scales down.
  timeline.fromTo(
    '.novablocks-hero .nb-supernova-item__media-wrapper, .nb-supernova--card-layout-stacked.nb-supernova--1-columns.nb-supernova--align-full .nb-supernova-item__media-wrapper',
    { scale: 1.2 },
    { scale: 1, duration: 0.4, ease: 'quad.out' },
    '-=0.4'
  );

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
    syncBodyClasses( html );
    syncDocumentTitle( html );

    // Sync admin bar using the container element (reads inline JSON).
    syncAdminBar( next.container );

    // Re-initialize components on new DOM.
    reinitComponents();

    // Track pageview.
    trackPageview();

    // Play the enter animation.
    const timeline = createBorderInTimeline();
    timeline.play();

    return timelinePromise( timeline );
  },
};
