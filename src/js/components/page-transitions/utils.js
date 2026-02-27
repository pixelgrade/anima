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
 * Restore the header's color signal classes from the server-rendered HTML.
 *
 * In FSE templates, the Nova Blocks header color detection queries
 * `.site-main .hentry` to find the first block's palette — but FSE themes
 * don't have those elements (the structure is .wp-site-blocks > .nb-sidecar
 * > .entry-content). So after the header script re-executes during AJAX
 * navigation, it fails to detect colors and strips the correct classes.
 *
 * This function extracts the server-rendered header classes from the raw HTML
 * (which WordPress computed correctly) and re-applies them after the header
 * script has run.
 */
export function syncHeaderColorSignal( html ) {
  // Extract the nb-header element's class attribute from the raw HTML.
  const match = html.match( /<div[^>]+class="([^"]*nb-header nb-header--main[^"]*)"/ );
  if ( ! match || ! match[ 1 ] ) {
    return;
  }

  const serverClasses = match[ 1 ];

  // Extract color-related classes from the server-rendered HTML.
  const colorClassPattern = /\b(sm-palette-\S+|sm-variation-\S+|sm-color-signal-\S+|sm-light|sm-dark)\b/g;
  const serverColorClasses = serverClasses.match( colorClassPattern );
  if ( ! serverColorClasses ) {
    return;
  }

  // Store for later application (after Nova Blocks scripts have re-executed).
  syncHeaderColorSignal._pendingClasses = serverColorClasses;
  syncHeaderColorSignal._serverHtml = html;
}

/**
 * Apply the stored header color classes to DOM elements.
 *
 * This is called in TWO places:
 * 1. BEFORE Nova Blocks scripts re-execute — so when the Header constructor
 *    runs initializeColors(), it reads the correct classes from the DOM and
 *    freezes them. This is the primary fix for FSE themes where the header
 *    script's `.site-main .hentry` query fails.
 * 2. AFTER Nova Blocks scripts finish — as a safety net in case the scripts
 *    overwrote our classes during initialization.
 */
function applyPendingHeaderColorSignal() {
  const classes = syncHeaderColorSignal._pendingClasses;
  if ( ! classes ) {
    return;
  }

  const header = document.querySelector( '.nb-header--main' );
  if ( ! header ) {
    return;
  }

  // Remove any existing color classes that may be wrong.
  const existing = header.className.match( /\b(sm-palette-\S+|sm-variation-\S+|sm-color-signal-\S+|sm-light|sm-dark)\b/g );
  if ( existing ) {
    existing.forEach( cls => header.classList.remove( cls ) );
  }

  // Apply the correct classes from the server HTML.
  classes.forEach( cls => header.classList.add( cls ) );

  // Also fix the header row if present.
  const headerRow = header.querySelector( '.nb-header-row--primary' );
  if ( headerRow ) {
    const rowMatch = syncHeaderColorSignal._serverHtml &&
      syncHeaderColorSignal._serverHtml.match( /<div[^>]+class="([^"]*nb-header-row--primary[^"]*)"/ );
    if ( rowMatch ) {
      const rowColorClasses = rowMatch[ 1 ].match( /\b(sm-palette-\S+|sm-variation-\S+|sm-color-signal-\S+|sm-light|sm-dark)\b/g );
      if ( rowColorClasses ) {
        const existingRow = headerRow.className.match( /\b(sm-palette-\S+|sm-variation-\S+|sm-color-signal-\S+|sm-light|sm-dark)\b/g );
        if ( existingRow ) {
          existingRow.forEach( cls => headerRow.classList.remove( cls ) );
        }
        rowColorClasses.forEach( cls => headerRow.classList.add( cls ) );
      }
    }
  }

  // Don't clear _pendingClasses here — we need them for the post-script safety net.
}

/**
 * Clear the pending header color signal data.
 * Called after the post-script safety net has run.
 */
function clearPendingHeaderColorSignal() {
  syncHeaderColorSignal._pendingClasses = null;
  syncHeaderColorSignal._serverHtml = null;
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

  // Dispatch resize + scroll events for layout-dependent JS.
  // Resize: recalculates layout (Hero, GlobalService).
  // Scroll: triggers Hero.update() and bully's rAF loop to process new elements.
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
 *
 * After ALL scripts have loaded and executed, dispatches resize + scroll
 * events so scripts like the Doppler parallax effect recalculate their
 * initial positions with correct DOM measurements.
 */
function reinitNovaBlocksScripts() {
  // Re-execute the bully vendor script first so it creates a fresh IIFE
  // with an empty elements array and a new .c-bully DOM element.
  // The old instance's rAF loop will harmlessly reference the removed DOM.
  reinitBullyScript();

  // Apply correct header color classes BEFORE the header script re-executes.
  // The Header constructor calls initializeColors() which freezes whatever
  // sm-* classes are on the header element at construction time. In FSE
  // themes, the script's own color detection fails (queries `.site-main
  // .hentry` which doesn't exist), so it would freeze empty/wrong classes.
  // By setting the correct classes now, initializeColors() freezes the right
  // ones, and toggleClasses() on sticky threshold will use the correct set.
  applyPendingHeaderColorSignal();

  const scripts = document.querySelectorAll( 'script[id*="novablocks"][id$="-js"][src*="frontend"]' );
  let pending = 0;

  const onAllLoaded = () => {
    // Nova Blocks scripts have now executed their domReady() callbacks
    // and measured the DOM. Force a recalculation so scripts like the
    // Doppler parallax effect get correct initial positions.
    // Use rAF to ensure measurements happen after the browser has
    // applied any style changes from the newly-loaded scripts.
    requestAnimationFrame( () => {
      // Safety net: re-apply header color classes in case the header script
      // overwrote them during its initialization sequence.
      applyPendingHeaderColorSignal();
      clearPendingHeaderColorSignal();

      // Trigger the bully bullet pop animation. The bully plugin normally
      // does this on window.load, which won't fire again after AJAX nav.
      // Bullets default to opacity: 0 and only become visible via --pop.
      $( '.c-bully .c-bully__bullet' ).not( '.c-bully__bullet--active' ).each( function( i ) {
        const $bullet = $( this );
        setTimeout( () => {
          $bullet.addClass( 'c-bully__bullet--pop' );
        }, i * 400 );
      } );

      window.dispatchEvent( new Event( 'resize' ) );
      window.dispatchEvent( new Event( 'scroll' ) );
    } );
  };

  scripts.forEach( ( script ) => {
    // Skip scripts that syncPageAssets() just loaded for the first time —
    // they will run their own domReady() callbacks. Re-executing them would
    // cause double-initialization (duplicate share icons, toggled handlers
    // that cancel each other out, etc.).
    if ( freshlyLoadedScriptIds.has( script.id ) ) {
      return;
    }

    pending++;
    const newScript = document.createElement( 'script' );
    // Append a cache-bust param so the browser treats it as a new request
    // (avoids de-duplication of identical src URLs).
    newScript.src = script.src + ( script.src.includes( '?' ) ? '&' : '?' ) + '_barba=' + Date.now();
    newScript.async = false;
    newScript.onload = () => {
      pending--;
      if ( pending === 0 ) {
        onAllLoaded();
      }
    };
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
