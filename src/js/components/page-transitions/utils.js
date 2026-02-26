import $ from 'jquery';
import App from '../app';

/**
 * Sync body classes from the new page's HTML response.
 * Uses the same NOTBODY trick as Pile to parse <body> attributes from raw HTML.
 */
export function syncBodyClasses( html ) {
  const data = html.replace( /(<\/?)body( .+?)?>/gi, '$1NOTBODY$2>' );
  const nobodyClass = $( data ).filter( 'notbody' ).attr( 'class' );

  if ( nobodyClass ) {
    // Preserve classes that our JS manages and that aren't in server HTML.
    const $body = $( 'body' );
    const preserveClasses = [ 'has-page-transitions', 'is-loaded', 'has-loaded', 'admin-bar' ];
    const preserved = preserveClasses.filter( cls => $body.hasClass( cls ) );

    $body.attr( 'class', nobodyClass );

    // Re-add preserved classes.
    preserved.forEach( cls => $body.addClass( cls ) );

    // Remove server-side initial loading state — not applicable after AJAX navigation.
    $body.removeClass( 'is-loading' );
  }
}

/**
 * Update document title from new page HTML.
 */
export function syncDocumentTitle( html ) {
  const match = html.match( /<title[^>]*>([\s\S]*?)<\/title>/i );
  if ( match && match[ 1 ] ) {
    document.title = match[ 1 ].trim();
  }
}

/**
 * Update admin bar Edit/Customize links after AJAX page swap.
 * Reads post data from the inline JSON block in the new page's HTML.
 */
export function syncAdminBar( containerEl ) {
  if ( ! $( 'body' ).hasClass( 'admin-bar' ) ) {
    return;
  }

  // Read post data from the inline JSON block in the new page.
  const $pageData = $( containerEl ).parent().find( '#anima-page-data' );
  if ( ! $pageData.length ) {
    return;
  }

  try {
    const data = JSON.parse( $pageData.text() );

    if ( data.editLink ) {
      $( '#wp-admin-bar-edit a' ).attr( 'href', data.editLink );
    }

    const $customizeLink = $( '#wp-admin-bar-customize a' );
    if ( $customizeLink.length ) {
      const baseUrl = $customizeLink.attr( 'href' ).replace( /url=.*$/, '' );
      $customizeLink.attr( 'href', baseUrl + 'url=' + encodeURIComponent( window.location.href ) );
    }
  } catch ( e ) {
    // Silently fail — admin bar links just won't update.
  }
}

/**
 * Re-initialize Anima's JS components on the new page DOM.
 * Follows Pile's "re-scan and re-bind" pattern.
 *
 * Creates a fresh App instance which initializes Hero, CommentsArea, images, etc.
 * Hero.js handles its own intro timeline and scroll-driven animations —
 * the page transitions system must NOT animate hero elements directly.
 */
export function reinitComponents() {
  // Create fresh App instance — this reinits Hero, CommentsArea, images, etc.
  // Fonts are already loaded (wf-active class persists), so Hero init runs immediately.
  new App();

  // Re-initialize Nova Blocks frontend scripts.
  // In FSE themes the header/footer are inside the Barba container and get swapped,
  // so Nova Blocks' block JS (header sticky, color signal, etc.) must re-run.
  reinitNovaBlocksScripts();

  // Re-trigger WooCommerce cart fragments if available.
  if ( typeof wc_cart_fragments_params !== 'undefined' ) {
    $( document.body ).trigger( 'wc_fragment_refresh' );
  }

  // Fire a custom event that other scripts can hook into.
  $( document ).trigger( 'anima:page-transition-complete' );

  // Dispatch a resize event to recalculate any layout-dependent JS.
  window.dispatchEvent( new Event( 'resize' ) );
}

/**
 * Re-execute Nova Blocks frontend scripts after AJAX page swap.
 *
 * Nova Blocks registers per-block `frontend.js` scripts that initialize
 * DOM-dependent behavior (header sticky, color signals, scroll effects, etc.).
 * These run once on DOMContentLoaded. After Barba swaps the container,
 * the new DOM has no JS behavior — we must re-execute the scripts.
 *
 * We dynamically load fresh <script> tags so each script re-queries the DOM
 * and creates new instances for the new elements.
 */
function reinitNovaBlocksScripts() {
  const scripts = document.querySelectorAll( 'script[id*="novablocks"][id$="-js"][src*="frontend"]' );

  scripts.forEach( ( script ) => {
    const newScript = document.createElement( 'script' );
    // Append a cache-bust param so the browser treats it as a new request
    // (avoids de-duplication of identical src URLs).
    newScript.src = script.src + ( script.src.includes( '?' ) ? '&' : '?' ) + '_barba=' + Date.now();
    newScript.async = false;
    document.body.appendChild( newScript );
  } );
}

/**
 * Cleanup heavy resources before page transition.
 */
export function cleanupBeforeTransition() {
  const $container = $( '[data-barba="container"]' );

  // Pause and remove video elements.
  $container.find( 'video' ).each( function() {
    this.pause();
    this.src = '';
    this.load();
    $( this ).remove();
  } );
}

/**
 * Push a pageview event for analytics.
 */
export function trackPageview() {
  // Google Analytics 4 (gtag).
  if ( typeof gtag === 'function' ) {
    gtag( 'event', 'page_view', {
      page_location: window.location.href,
      page_title: document.title,
    } );
    return;
  }

  // Google Tag Manager dataLayer.
  if ( typeof dataLayer !== 'undefined' && Array.isArray( dataLayer ) ) {
    dataLayer.push( {
      event: 'pageview',
      page: {
        path: window.location.pathname,
        title: document.title,
      },
    } );
    return;
  }

  // Legacy Universal Analytics.
  if ( typeof _gaq !== 'undefined' ) {
    _gaq.push( [ '_trackPageview' ] );
  }
}
