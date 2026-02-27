/**
 * Page Transitions — View Transitions API + Navigation API + GSAP
 *
 * Uses the Navigation API to intercept same-origin link clicks,
 * then document.startViewTransition() to orchestrate the transition
 * with GSAP-powered border expand/collapse animations.
 *
 * Graceful degradation:
 * - No Navigation API → falls back to click event interception
 * - No View Transitions API → falls back to direct GSAP animations
 * - No GSAP → instant page swap (still AJAX, no animation)
 * - No JS → normal page loads (links work as usual)
 */

import { pageLeave, pageEnter, initialLoadAnimation } from './transitions';
import {
  syncBodyClasses,
  syncDocumentTitle,
  syncAdminBar,
  reinitComponents,
  trackPageview,
  shouldExcludeUrl,
  syncHeadAssets,
} from './utils';

let isTransitioning = false;
let config = {};

/**
 * Parse an HTML string into a Document.
 */
function parseHTML( html ) {
  return new DOMParser().parseFromString( html, 'text/html' );
}

/**
 * Get the main content container to swap.
 */
function getContentContainer() {
  return document.querySelector( '.wp-site-blocks' ) ||
    document.querySelector( 'main' ) ||
    document.querySelector( '.site-content' );
}

/**
 * Perform the actual content swap and all DOM updates.
 */
function performSwap( newDocument ) {
  const currentContainer = getContentContainer();
  const newContainer = newDocument.querySelector( '.wp-site-blocks' ) ||
    newDocument.querySelector( 'main' ) ||
    newDocument.querySelector( '.site-content' );

  if ( currentContainer && newContainer ) {
    currentContainer.innerHTML = newContainer.innerHTML;
  }

  syncBodyClasses( newDocument );
  syncDocumentTitle( newDocument );
  syncAdminBar( newDocument );
  syncHeadAssets( newDocument );

  // Scroll to top.
  window.scrollTo( 0, 0 );
}

/**
 * Handle the full transition lifecycle for a navigation.
 */
async function handleTransition( url, signal ) {
  if ( isTransitioning ) {
    return;
  }
  isTransitioning = true;

  try {
    // Start fetching the new page immediately.
    const fetchPromise = fetch( url, {
      signal,
      credentials: 'same-origin',
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
      },
    } );

    // Run page leave animation (border expands inward).
    await pageLeave();

    // Wait for fetch to complete.
    const response = await fetchPromise;
    if ( ! response.ok ) {
      // Fallback: navigate normally on fetch error.
      window.location.href = url;
      return;
    }

    const html = await response.text();
    const newDocument = parseHTML( html );

    // Use View Transitions API if available for the DOM swap.
    if ( document.startViewTransition ) {
      const transition = document.startViewTransition( () => {
        performSwap( newDocument );
      } );

      // Wait for the DOM update to be ready.
      await transition.updateCallbackDone;
    } else {
      // No View Transitions API — swap directly.
      performSwap( newDocument );
    }

    // Run page enter animation (border collapses outward).
    await pageEnter();

    // Post-transition tasks.
    reinitComponents();
    trackPageview( url );
  } catch ( error ) {
    // AbortError means the user navigated away — don't fallback.
    if ( error.name === 'AbortError' ) {
      return;
    }

    // Any other error: fallback to normal navigation.
    console.error( 'Page transition failed:', error );
    window.location.href = url;
  } finally {
    isTransitioning = false;
  }
}

/**
 * Initialize using the Navigation API (preferred).
 * This gives us proper history management, abort signals, and
 * handles both link clicks and back/forward navigation.
 */
function initWithNavigationAPI() {
  if ( typeof navigation === 'undefined' ) {
    return false;
  }

  navigation.addEventListener( 'navigate', ( event ) => {
    // Skip non-interceptable navigations.
    if ( ! event.canIntercept || event.hashChange || event.downloadRequest || event.formData ) {
      return;
    }

    const url = new URL( event.destination.url );

    // Only handle same-origin navigations.
    if ( url.origin !== location.origin ) {
      return;
    }

    // Check exclusions.
    if ( shouldExcludeUrl( event.destination.url, config ) ) {
      return;
    }

    // Skip if the link had target="_blank".
    if ( event.navigationType === 'push' || event.navigationType === 'replace' ) {
      event.intercept( {
        async handler() {
          await handleTransition( event.destination.url, event.signal );
        },
      } );
    }

    // For traverse (back/forward), also animate.
    if ( event.navigationType === 'traverse' ) {
      event.intercept( {
        async handler() {
          await handleTransition( event.destination.url, event.signal );
        },
      } );
    }
  } );

  return true;
}

/**
 * Fallback: intercept clicks on <a> elements.
 * Used when the Navigation API is not available (Firefox).
 */
function initWithClickInterception() {
  document.addEventListener( 'click', ( event ) => {
    // Find the closest <a> element.
    const link = event.target.closest( 'a[href]' );
    if ( ! link ) {
      return;
    }

    // Skip modified clicks (new tab, etc).
    if ( event.metaKey || event.ctrlKey || event.shiftKey || event.altKey ) {
      return;
    }

    // Skip target="_blank".
    if ( link.target === '_blank' ) {
      return;
    }

    const url = link.href;

    // Check exclusions.
    if ( shouldExcludeUrl( url, config ) ) {
      return;
    }

    event.preventDefault();

    // Create an AbortController for this navigation.
    const controller = new AbortController();

    // Push history state.
    window.history.pushState( {}, '', url );

    handleTransition( url, controller.signal );
  } );

  // Handle back/forward navigation.
  window.addEventListener( 'popstate', () => {
    const controller = new AbortController();
    handleTransition( window.location.href, controller.signal );
  } );
}

/**
 * Prefetch links on hover for faster transitions.
 */
function initPrefetch() {
  const prefetched = new Set();

  document.addEventListener( 'pointerenter', ( event ) => {
    const link = event.target.closest( 'a[href]' );
    if ( ! link || link.target === '_blank' ) {
      return;
    }

    const url = link.href;
    if ( prefetched.has( url ) || shouldExcludeUrl( url, config ) ) {
      return;
    }

    prefetched.add( url );

    // Use <link rel="prefetch"> for browser-native prefetching.
    const prefetchLink = document.createElement( 'link' );
    prefetchLink.rel = 'prefetch';
    prefetchLink.href = url;
    prefetchLink.as = 'document';
    document.head.appendChild( prefetchLink );
  }, { passive: true } );
}

/**
 * Main initialization.
 */
export function init( userConfig = {} ) {
  config = userConfig;

  // Don't initialize in Customizer preview.
  if ( document.body.classList.contains( 'is--customizer-preview' ) ) {
    return;
  }

  // Add feature class.
  document.body.classList.add( 'has-page-transitions' );

  // Try Navigation API first, fall back to click interception.
  if ( ! initWithNavigationAPI() ) {
    initWithClickInterception();
  }

  // Set up link prefetching.
  initPrefetch();

  // Play initial load animation.
  if ( document.readyState === 'complete' ) {
    initialLoadAnimation();
  } else {
    window.addEventListener( 'load', () => {
      initialLoadAnimation();
    } );
  }
}
