import $ from 'jquery';
import App from '../app';

// Tracks script IDs that syncPageAssets() loaded for the first time.
// reinitNovaBlocksScripts() skips these to avoid double-initialization
// (which causes duplicate elements and toggled handlers canceling each other).
let freshlyLoadedScriptIds = new Set();

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
 * Sync page assets (styles and scripts) from the new page's full HTML.
 *
 * WordPress injects per-page inline CSS and JS based on which blocks/plugins
 * are present. After AJAX swap only the Barba container changes — the rest of
 * the document keeps stale assets. This function:
 *
 * 1. Syncs inline <style> blocks (add new, update changed, remove stale)
 * 2. Syncs <link> stylesheets (add new ones needed by the new page)
 * 3. Syncs <script> tags — loads new external scripts and executes new inline
 *    data scripts (e.g., FacetWP's `window.FWP_JSON`) so plugins reinitialize
 */
export function syncPageAssets( html ) {
  const parser = new DOMParser();
  const doc = parser.parseFromString( html, 'text/html' );

  syncStyles( doc );
  syncScripts( doc );
}

/**
 * Sync inline <style> blocks and <link> stylesheets.
 */
function syncStyles( doc ) {
  const newHead = doc.head;

  // --- Sync inline <style> blocks (identified by id) ---
  const newStyles = newHead.querySelectorAll( 'style[id]' );
  const newStyleIds = new Set();

  newStyles.forEach( ( newStyle ) => {
    newStyleIds.add( newStyle.id );
    const existing = document.getElementById( newStyle.id );

    if ( existing && existing.tagName === 'STYLE' ) {
      if ( existing.textContent !== newStyle.textContent ) {
        existing.textContent = newStyle.textContent;
      }
    } else {
      document.head.appendChild( newStyle.cloneNode( true ) );
    }
  } );

  // Remove old block-specific inline styles the new page doesn't need.
  document.querySelectorAll( 'head style[id]' ).forEach( ( style ) => {
    if ( ! newStyleIds.has( style.id ) && isBlockInlineStyle( style.id ) ) {
      style.remove();
    }
  } );

  // --- Sync <link> stylesheets ---
  const newLinks = newHead.querySelectorAll( 'link[rel="stylesheet"][id]' );
  const newLinkIds = new Set();

  newLinks.forEach( ( newLink ) => {
    newLinkIds.add( newLink.id );
    if ( ! document.getElementById( newLink.id ) ) {
      document.head.appendChild( newLink.cloneNode( true ) );
    }
  } );

  // Remove old block-specific stylesheets the new page doesn't need.
  document.querySelectorAll( 'head link[rel="stylesheet"][id]' ).forEach( ( link ) => {
    if ( ! newLinkIds.has( link.id ) && isBlockStylesheet( link.id ) ) {
      link.remove();
    }
  } );
}

/**
 * Sync scripts from the new page's full HTML.
 *
 * External scripts: loads any that exist in the new page but not the current page.
 * Inline scripts: executes data/config scripts from the new page's <body>.
 */
function syncScripts( doc ) {
  // Reset the freshly-loaded tracking set for this navigation.
  freshlyLoadedScriptIds = new Set();

  // Build a set of script src URLs already on the current page.
  const currentSrcs = new Set();
  document.querySelectorAll( 'script[src]' ).forEach( ( s ) => {
    // Normalize: strip cache-bust params we added.
    currentSrcs.add( stripCacheBust( s.src ) );
  } );

  // --- Sync external scripts ---
  // Find all external scripts in the new page that aren't on the current page.
  const newScripts = doc.querySelectorAll( 'script[src]' );
  newScripts.forEach( ( script ) => {
    const normalizedSrc = stripCacheBust( script.src );
    if ( ! currentSrcs.has( normalizedSrc ) ) {
      const newScript = document.createElement( 'script' );
      newScript.src = script.src;
      newScript.async = false;
      if ( script.id ) {
        newScript.id = script.id;
        // Track this as freshly loaded so reinitNovaBlocksScripts() skips it.
        freshlyLoadedScriptIds.add( script.id );
      }
      document.body.appendChild( newScript );
    }
  } );

  // --- Sync inline data scripts from <body> ---
  // WordPress plugins inject inline scripts in the body (via wp_footer) that
  // set global data objects. These are outside the Barba container.
  const newBodyScripts = doc.body.querySelectorAll( 'script:not([src])' );
  newBodyScripts.forEach( ( script ) => {
    const text = script.textContent;
    if ( ! text.trim() ) {
      return;
    }

    // Only execute scripts that set global data/config.
    // Skip analytics, tracking, and JSON-LD schema scripts.
    if ( isDataScript( text ) ) {
      const newScript = document.createElement( 'script' );
      newScript.textContent = text;
      document.body.appendChild( newScript );
    }
  } );
}

/**
 * Strip cache-bust params we add for reinit.
 */
function stripCacheBust( url ) {
  return url.replace( /[?&]_barba=\d+/, '' );
}

/**
 * Check if an inline script sets global data (safe and needed to re-execute).
 */
function isDataScript( text ) {
  // Scripts that assign to window (e.g., window.FWP_JSON = {...})
  if ( /window\.\w+\s*=/.test( text ) ) {
    return true;
  }

  // WordPress wp_localize_script output (e.g., var fwpConfig = {...})
  if ( /^var\s+\w+\s*=/.test( text.trim() ) ) {
    return true;
  }

  return false;
}

/**
 * Check if a <style> id is a per-page block inline style (safe to add/remove).
 */
function isBlockInlineStyle( id ) {
  return id.includes( 'inline-css' ) && (
    id.startsWith( 'wp-block-' ) ||
    id.startsWith( 'novablocks' ) ||
    id === 'core-block-supports-inline-css'
  );
}

/**
 * Check if a <link> id is a per-page block stylesheet (safe to add/remove).
 */
function isBlockStylesheet( id ) {
  return id.startsWith( 'wp-block-' ) && id.endsWith( '-css' );
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

  // Trigger the bully bullet pop animation after all scripts have been queued.
  // The bully plugin normally does this on window.load, which won't fire again.
  // Bullets default to opacity: 0 and only become visible via the --pop class.
  // Use setTimeout to yield so dynamically-inserted scripts execute first,
  // then rAF to ensure the DOM has been painted.
  setTimeout( () => {
    requestAnimationFrame( () => {
      $( '.c-bully .c-bully__bullet' ).not( '.c-bully__bullet--active' ).each( function( i ) {
        const $bullet = $( this );
        setTimeout( () => {
          $bullet.addClass( 'c-bully__bullet--pop' );
        }, i * 400 );
      } );
    } );
  }, 0 );

  // Re-trigger WooCommerce cart fragments if available.
  if ( typeof wc_cart_fragments_params !== 'undefined' ) {
    $( document.body ).trigger( 'wc_fragment_refresh' );
  }

  // Fire a custom event that other scripts can hook into.
  $( document ).trigger( 'anima:page-transition-complete' );

  // Dispatch resize + scroll events for layout-dependent JS.
  // Resize: recalculates layout (Hero, GlobalService).
  // Scroll: triggers bully's rAF loop to process the new elements.
  window.dispatchEvent( new Event( 'resize' ) );
  window.dispatchEvent( new Event( 'scroll' ) );
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
  // Re-execute the bully vendor script first so it creates a fresh IIFE
  // with an empty elements array and a new .c-bully DOM element.
  // The old instance's rAF loop will harmlessly reference the removed DOM.
  reinitBullyScript();

  const scripts = document.querySelectorAll( 'script[id*="novablocks"][id$="-js"][src*="frontend"]' );

  scripts.forEach( ( script ) => {
    // Skip scripts that syncPageAssets() just loaded for the first time —
    // they will run their own domReady() callbacks. Re-executing them would
    // cause double-initialization (duplicate share icons, toggled handlers
    // that cancel each other out, etc.).
    if ( freshlyLoadedScriptIds.has( script.id ) ) {
      return;
    }

    const newScript = document.createElement( 'script' );
    // Append a cache-bust param so the browser treats it as a new request
    // (avoids de-duplication of identical src URLs).
    newScript.src = script.src + ( script.src.includes( '?' ) ? '&' : '?' ) + '_barba=' + Date.now();
    newScript.async = false;
    document.body.appendChild( newScript );
  } );
}

/**
 * Re-execute the jquery.bully.js vendor script to create a fresh instance.
 *
 * The bully plugin uses a closure-scoped elements array and rAF loop that
 * persist across page transitions. Since there's no destroy API, we remove
 * the old .c-bully DOM element (done in cleanupBeforeTransition) and
 * re-execute the script so the IIFE runs again with a clean slate.
 *
 * After the new bully instance is ready and position-indicators has run
 * (via the core frontend script), we trigger the bullet pop animation
 * that normally only fires on window.load.
 *
 * The old rAF loop continues but operates on the removed DOM — harmless.
 * The new IIFE creates a fresh .c-bully, empty elements array, and new loop.
 */
function reinitBullyScript() {
  const bullyScript = document.querySelector( 'script[id*="novablocks-bully"][src]' );
  if ( ! bullyScript ) {
    return;
  }

  const newScript = document.createElement( 'script' );
  newScript.src = bullyScript.src + ( bullyScript.src.includes( '?' ) ? '&' : '?' ) + '_barba=' + Date.now();
  newScript.async = false;
  document.body.appendChild( newScript );
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

  // Remove the bully navigation dots. The jquery.bully.js IIFE keeps
  // closure-scoped state (elements array, rAF loop) that can't be reset
  // externally. Removing the DOM element and re-executing the vendor
  // script in reinitNovaBlocksScripts() creates a fresh instance.
  $( '.c-bully' ).remove();
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
