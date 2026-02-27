/**
 * Page Transitions — View Transitions API + Navigation API
 *
 * Proof of concept: uses the browser's native View Transitions API
 * cross-fade for page-to-page transitions. No GSAP, no overlays.
 *
 * Graceful degradation:
 * - No Navigation API -> falls back to click event interception
 * - No View Transitions API -> instant swap (no animation)
 * - No JS -> normal page loads (links work as usual)
 */

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

  // The new document arrives with is-loading from PHP body_class.
  // Since we're doing an AJAX swap (not a fresh load), mark it as loaded immediately.
  document.body.classList.remove( 'is-loading' );
  document.body.classList.add( 'has-loaded', 'is-loaded' );

  syncDocumentTitle( newDocument );
  syncAdminBar( newDocument );

  try {
    syncHeadAssets( newDocument );
  } catch ( e ) {
    // Don't let head asset sync errors block the transition.
  }

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
    // Fetch the new page.
    const response = await fetch( url, {
      signal,
      credentials: 'same-origin',
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
      },
    } );

    if ( ! response.ok ) {
      window.location.href = url;
      return;
    }

    const html = await response.text();
    const newDocument = parseHTML( html );

    // Use View Transitions API if available — browser handles the cross-fade.
    if ( document.startViewTransition ) {
      const transition = document.startViewTransition( () => {
        performSwap( newDocument );
      } );

      await transition.finished;
    } else {
      // No View Transitions API — swap directly.
      performSwap( newDocument );
    }

    // Post-transition tasks.
    reinitComponents();
    trackPageview( url );
  } catch ( error ) {
    if ( error.name === 'AbortError' ) {
      return;
    }

    console.error( 'Page transition failed:', error );
    window.location.href = url;
  } finally {
    isTransitioning = false;
  }
}

/**
 * Initialize using the Navigation API (preferred).
 */
function initWithNavigationAPI() {
  if ( typeof navigation === 'undefined' ) {
    return false;
  }

  navigation.addEventListener( 'navigate', ( event ) => {
    if ( ! event.canIntercept || event.hashChange || event.downloadRequest || event.formData ) {
      return;
    }

    const url = new URL( event.destination.url );

    if ( url.origin !== location.origin ) {
      return;
    }

    if ( shouldExcludeUrl( event.destination.url, config ) ) {
      return;
    }

    if ( event.navigationType === 'push' || event.navigationType === 'replace' || event.navigationType === 'traverse' ) {
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
 * Used when the Navigation API is not available (Firefox, Safari).
 */
function initWithClickInterception() {
  document.addEventListener( 'click', ( event ) => {
    const link = event.target.closest( 'a[href]' );
    if ( ! link ) {
      return;
    }

    if ( event.metaKey || event.ctrlKey || event.shiftKey || event.altKey ) {
      return;
    }

    if ( link.target === '_blank' ) {
      return;
    }

    const url = link.href;

    if ( shouldExcludeUrl( url, config ) ) {
      return;
    }

    event.preventDefault();

    const controller = new AbortController();
    window.history.pushState( {}, '', url );

    handleTransition( url, controller.signal );
  } );

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
    if ( ! event.target || ! event.target.closest ) {
      return;
    }
    const link = event.target.closest( 'a[href]' );
    if ( ! link || link.target === '_blank' ) {
      return;
    }

    const url = link.href;
    if ( prefetched.has( url ) || shouldExcludeUrl( url, config ) ) {
      return;
    }

    prefetched.add( url );

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
}
