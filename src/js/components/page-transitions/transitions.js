import $ from 'jquery';
import {
  syncBodyClasses,
  syncPageAssets,
  syncDocumentTitle,
  syncHeaderColorSignal,
  reinitComponents,
  cleanupBeforeTransition,
  trackPageview,
} from './utils';
import { syncAdminBar } from './admin-bar';

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
 * Shared enter logic for both transitions.
 *
 * Syncs WordPress state (assets, body classes, title, admin bar, header color),
 * reinitializes components, and plays the border collapse animation.
 */
function performEnter( { next } ) {
  // Scroll to top.
  window.scrollTo( 0, 0 );

  // Reset border background.
  $( '.js-page-transition-border' ).css( 'backgroundColor', 'transparent' );

  // Sync WordPress state from new page HTML.
  const html = next.html;
  syncPageAssets( html );
  syncBodyClasses( html );
  syncDocumentTitle( html );

  // Sync admin bar from raw HTML (full #wpadminbar replacement).
  syncAdminBar( html );

  // Save the header's correct color signal classes from the server HTML.
  // The Nova Blocks header script will re-execute and fail to detect colors
  // in FSE templates (it queries `.site-main .hentry` which doesn't exist).
  // Pass the new container to scope DOM queries and avoid finding the old header.
  syncHeaderColorSignal( html, next.container );

  // Defer component reinitialization until after the browser has reflowed the
  // new DOM. Nova Blocks color signal scripts read computed styles (padding,
  // background-color) and Hero.js calls getBoundingClientRect() — both return
  // stale values if called before the browser recalculates layout.
  // Double-rAF ensures styles are applied and one paint cycle has completed.
  return new Promise( ( resolve ) => {
    requestAnimationFrame( () => {
      requestAnimationFrame( () => {
        reinitComponents();
        trackPageview();

        const timeline = createBorderInTimeline();
        timeline.play();

        timelinePromise( timeline ).then( resolve );
      } );
    } );
  } );
}

/**
 * The generic Barba.js v2 transition definition.
 * Ported from Pile's FadeTransition (Barba v1).
 * Used for all non-card links (header nav, footer, back button, etc.).
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
      cleanupBeforeTransition( current.container );

      // Hide old container.
      $( current.container ).hide();
    } );
  },

  enter( { next } ) {
    return performEnter( { next } );
  },
};

/**
 * Card-expand transition.
 *
 * When clicking a Nova Blocks collection card (project/post in a grid),
 * the border overlay is positioned exactly over the clicked card, fills it
 * solid in the project's color, then scales to cover the full viewport.
 *
 * Ported from Pile's projectBorderOutTimeline().
 *
 * Uses Barba v2's `custom` function to match only clicks from grid cards.
 * The `trigger` parameter is the clicked <a> element (or 'barba' for popstate).
 */
export const cardExpandTransition = {
  name: 'card-expand',

  // Only match clicks from within a multi-column post archive grid card.
  // - .wp-block-query: excludes standalone supernova blocks (hero, media card)
  // - :not(.nb-supernova--1-columns): excludes full-width sliders/carousels
  custom: ( { trigger } ) => {
    if ( ! trigger || trigger === 'barba' || typeof trigger.closest !== 'function' ) {
      return false;
    }
    const card = trigger.closest( '.nb-supernova-item' );
    if ( ! card || ! card.closest( '.wp-block-query' ) ) {
      return false;
    }
    const supernova = card.closest( '.nb-supernova' );
    return supernova !== null && ! supernova.classList.contains( 'nb-supernova--1-columns' );
  },

  leave( { current, trigger } ) {
    const card = trigger.closest( '.nb-supernova-item' );
    // Use the media wrapper for positioning (border is around the image, not full card).
    const mediaWrapper = card.querySelector( '.nb-supernova-item__media-wrapper' ) || card;
    const rect = mediaWrapper.getBoundingClientRect();

    // Read project color (custom property with accent fallback).
    const styles = getComputedStyle( card );
    const projectColor = styles.getPropertyValue( '--anima-project-color' ).trim();
    const accentColor = styles.getPropertyValue( '--sm-current-accent-color' ).trim();
    const color = projectColor || accentColor || '#333';

    const $border = $( '.js-page-transition-border' );
    const borderX = Math.ceil( rect.width / 2 );
    const borderY = Math.ceil( rect.height / 2 );
    const scaleX = window.innerWidth / rect.width;
    const scaleY = window.innerHeight / rect.height;
    const moveX = window.innerWidth / 2 - ( rect.left + rect.width / 2 );
    const moveY = window.innerHeight / 2 - ( rect.top + rect.height / 2 );

    // Position the overlay exactly over the clicked card.
    $border.css( {
      display: 'block',
      position: 'fixed',
      top: rect.top - 1,
      left: rect.left - 1,
      right: 'auto',
      bottom: 'auto',
      width: rect.width + 2,
      height: rect.height + 2,
      borderWidth: 0,
      borderColor: color,
      backgroundColor: 'transparent',
      transform: 'none',
    } );

    $( 'body' ).addClass( 'is-transitioning' );

    const timeline = gsap.timeline( { paused: true } );

    // Step A (0.4s): Border grows inward until it fills the card solid.
    timeline.to( $border[ 0 ], {
      borderTopWidth: borderY,
      borderBottomWidth: borderY,
      borderLeftWidth: borderX,
      borderRightWidth: borderX,
      duration: 0.4,
      ease: 'quart.inOut',
      onComplete: () => {
        // Once border fills the card, set backgroundColor to match.
        // This creates a seamless solid fill for the scale step.
        $border.css( 'backgroundColor', color );
      },
    } );

    // Step B (0.5s): Scale + translate from card position to cover full viewport.
    timeline.to( $border[ 0 ], {
      x: moveX,
      y: moveY,
      scaleX,
      scaleY,
      duration: 0.5,
      ease: 'power3.inOut',
    } );

    timeline.play();

    // Close mobile nav if open.
    $( 'body' ).removeClass( 'nav-is-open' );

    return timelinePromise( timeline ).then( () => {
      cleanupBeforeTransition( current.container );
      $( current.container ).hide();
      $( 'body' ).removeClass( 'is-transitioning' );
    } );
  },

  enter( { next } ) {
    return performEnter( { next } );
  },
};
