import $ from 'jquery';
import App from '../app';
import * as PileParallax from '../pile-parallax';

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
 * Header color signal guard.
 *
 * Problem: In FSE templates, the Nova Blocks header color detection queries
 * `.site-main .hentry` to find the first block's palette — but FSE themes
 * don't have those elements. HeaderColors.initializeColors() reads from
 * `colorsElement` (the adjacent content block), NOT the header itself, so
 * pre-applying classes on the header doesn't affect what gets frozen.
 * Then on every sticky threshold crossing, toggleClasses() overwrites the
 * header's classes with the frozen wrong set.
 *
 * Solution: extract the correct color classes from the server-rendered HTML
 * (which WordPress computed correctly via PHP), apply them immediately,
 * and use a MutationObserver to guard them against ALL future overwrites.
 * The observer is set up right after the DOM swap — before any scripts
 * re-execute — so it catches the header script's initialization AND
 * subsequent toggleClasses() calls on scroll. Observer callbacks fire
 * before the browser paints, so there's no visual flicker.
 */
let headerColorObserver = null;

// Regex pattern for color-related classes on the header.
const COLOR_CLASS_PATTERN = /\b(sm-palette-\S+|sm-variation-\S+|sm-color-signal-\S+|sm-light|sm-dark)\b/g;

/**
 * Detect and apply the correct header color signal after AJAX page swap.
 *
 * Replicates the EXACT detection logic from Nova Blocks' Header constructor:
 *   getAdjacentElement() → findProperElement() → findColorsElement()
 *   → getColorSetClasses() → toggleClasses()
 *
 * This is the same code path that runs on a fresh page load. We run it on
 * the live DOM (after Barba has inserted the new container) to get the same
 * result. A MutationObserver then guards the classes in transparent mode
 * while allowing the normal sticky toggle on scroll.
 *
 * @param {string}      html      Full HTML of the new page (unused, kept for API compat).
 * @param {HTMLElement}  container The new Barba container element (scopes DOM queries).
 */
export function syncHeaderColorSignal( html, container ) {
  // Disconnect any observer from the previous page.
  disconnectHeaderColorObserver();

  // Find the header in the live DOM (scoped to new Barba container).
  const header = container
    ? container.querySelector( '.nb-header--main' )
    : document.querySelector( '.nb-header--main' );
  if ( ! header ) {
    return;
  }

  // --- Replicate Nova Blocks Header detection on the live DOM ---

  // Step 1: Find the adjacent element (next sibling, skipping scripts/styles).
  const adjacent = getAdjacentElement( header );
  if ( ! adjacent ) {
    return;
  }

  // Step 2: Walk into containers to find the "proper" color source element.
  const properElement = findProperElement( adjacent );
  if ( ! properElement ) {
    return;
  }

  // Step 3: Handle nested sidecar/supernova to find the actual colors element.
  const colorsElement = findColorsElement( properElement );
  if ( ! colorsElement ) {
    return;
  }

  // Step 4: Read color signal classes from the detected element.
  const transparentClasses = getColorSetClasses( colorsElement )
    .filter( cls => cls !== 'sm-color-signal-0' );

  if ( ! transparentClasses.length ) {
    return;
  }

  // Step 5: Apply to the header (and row).
  replaceColorClasses( header, transparentClasses );

  const headerRow = header.querySelector( '.nb-header-row--primary' );
  if ( headerRow ) {
    replaceColorClasses( headerRow, transparentClasses );
  }

  // Step 6: Guard with sticky-aware observer.
  setupHeaderColorObserver( header, transparentClasses );
}

// ---------------------------------------------------------------------------
// Nova Blocks Header detection logic (replicated from source).
// See: nova-blocks/packages/block-library/src/blocks/header/frontend/components/
// ---------------------------------------------------------------------------

/**
 * Get the element adjacent to the header (its next meaningful sibling).
 * Skips script, style, and menu toggle elements.
 * Climbs up to parent if no sibling exists.
 *
 * Replica of: Header.getAdjacentElement()
 */
function getAdjacentElement( element ) {
  const skip = '.c-menu-toggle, .c-menu-toggle__checkbox, script, style';
  const next = element.nextElementSibling;

  if ( ! next ) {
    if ( element.parentElement ) {
      return getAdjacentElement( element.parentElement );
    }
    return null;
  }

  if ( next.matches( skip ) ) {
    return getAdjacentElement( next );
  }

  return next;
}

/**
 * Walk down the DOM from the adjacent element to find the block that
 * determines the header's transparent-state colors.
 *
 * Traverses into known container blocks (main, wp-block-group, sidecar,
 * wp-block-post-content) when they don't carry their own color signal.
 *
 * Replica of: Header.findProperElement()
 */
function findProperElement( element, previous ) {
  if ( ! element ) {
    return previous || null;
  }

  const variation = element.dataset.paletteVariation
    ? parseInt( element.dataset.paletteVariation, 10 )
    : 1;
  const isShifted = !! element.dataset.useSourceColorAsReference;
  const hasSignal = variation !== 1 || isShifted;

  // Container blocks without their own color signal — recurse into first child.
  if ( element.matches( 'main, .wp-block-group.alignfull, .wp-block-query, .wp-block-post-content' ) ) {
    if ( ! hasSignal ) {
      return findProperElement( element.firstElementChild, element );
    }
  }

  // Sidecar layout — recurse into content area's first child.
  if ( element.classList.contains( 'nb-sidecar' ) ) {
    if ( element.children.length === 1 &&
      element.firstElementChild.classList.contains( 'nb-sidecar-area--content' ) ) {
      const child = element.firstElementChild.firstElementChild;
      if ( child ) {
        return findProperElement( child, element );
      }
    }
  }

  // Non-fullwidth block with color signal — return the parent container instead.
  if ( ! element.matches( '.alignfull' ) && hasSignal && previous ) {
    return previous;
  }

  // Element with palette class — use it.
  if ( element.matches( '[class*="sm-palette-"]' ) ) {
    return element;
  }

  // Fall back to closest ancestor with palette.
  return element.closest( '[class*="sm-palette-"]' ) || null;
}

/**
 * Handle nested sidecar and supernova blocks to find the actual element
 * whose color classes should be copied to the header.
 *
 * Replica of: Header.findColorsElement()
 */
function findColorsElement( element ) {
  if ( ! element ) {
    return null;
  }

  // Nested sidecar — recurse into content area.
  if ( element.classList.contains( 'nb-sidecar' ) ) {
    const content = Array.from( element.children )
      .find( child => child.classList.contains( 'nb-sidecar-area--content' ) );
    if ( content && content.firstElementChild &&
      content.firstElementChild.classList.contains( 'nb-sidecar' ) ) {
      return findColorsElement( content.firstElementChild );
    }
  }

  // Supernova with 0 padding — use the first item.
  if ( element.classList.contains( 'nb-supernova' ) ) {
    const paddingTop = parseInt( window.getComputedStyle( element ).paddingTop, 10 );
    if ( paddingTop === 0 ) {
      return element.querySelector( '.nb-supernova-item' ) || element;
    }
  }

  return element;
}

/**
 * Extract all color signal classes from an element's class attribute.
 *
 * Replica of: getColorSetClasses() from header/utils.js
 */
function getColorSetClasses( element ) {
  const classAttr = element.getAttribute( 'class' );
  if ( ! classAttr ) {
    return [];
  }
  return classAttr.split( /\s+/ ).filter( cls => {
    return cls.includes( 'sm-color-signal-' ) ||
      cls.includes( 'sm-palette-' ) ||
      cls.includes( 'sm-variation-' ) ||
      cls.includes( 'sm-dark' ) ||
      cls.includes( 'sm-light' );
  } );
}

/**
 * Replace color classes on an element with the correct set.
 */
function replaceColorClasses( element, correctClasses ) {
  const existing = element.className.match( COLOR_CLASS_PATTERN );
  if ( existing ) {
    existing.forEach( cls => element.classList.remove( cls ) );
  }
  correctClasses.forEach( cls => element.classList.add( cls ) );
}

/**
 * Set up a MutationObserver that guards the header's transparent-state
 * color classes.
 *
 * The observer is "sticky-aware":
 * - When the header has `is-sticky` class (scrolled past hero), the observer
 *   does nothing — Nova Blocks manages the sticky-state colors correctly
 *   (the header uses its own palette, which doesn't need detection).
 * - When the header is in transparent mode (overlapping hero, no `is-sticky`),
 *   the observer guards the correct color classes from the adjacent block.
 *
 * MutationObserver callbacks are batched — both `is-sticky` and color class
 * changes are visible by the time the callback runs, so there's no race.
 */
function setupHeaderColorObserver( header, transparentClasses ) {
  let applying = false;

  headerColorObserver = new MutationObserver( () => {
    if ( applying ) {
      return;
    }

    // Don't interfere when the header is in sticky mode.
    // Nova Blocks manages sticky colors correctly (uses header's own palette).
    if ( header.classList.contains( 'is-sticky' ) ) {
      return;
    }

    // In transparent mode: check if the correct (adjacent block) classes
    // are still present. If Nova Blocks overwrote them (failed detection
    // in FSE), re-apply.
    const hasAll = transparentClasses.every( cls => header.classList.contains( cls ) );
    if ( ! hasAll ) {
      applying = true;
      replaceColorClasses( header, transparentClasses );

      const headerRow = header.querySelector( '.nb-header-row--primary' );
      if ( headerRow ) {
        replaceColorClasses( headerRow, transparentClasses );
      }

      applying = false;
    }
  } );

  headerColorObserver.observe( header, {
    attributes: true,
    attributeFilter: [ 'class' ],
  } );
}

/**
 * Disconnect the header color observer.
 * Called at the start of each new navigation and during cleanup.
 */
function disconnectHeaderColorObserver() {
  if ( headerColorObserver ) {
    headerColorObserver.disconnect();
    headerColorObserver = null;
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
  reinitNovaBlocksScripts( () => {
    // Nova Blocks scripts can mutate/rebuild collection card DOM after AJAX swap.
    // Refresh pile parallax bindings after those scripts finish so we target
    // the final nodes and not stale pre-mutation references.
    PileParallax.initialize();
    window.dispatchEvent( new Event( 'scroll' ) );
  } );

  // Reinitialize FacetWP if it was previously loaded.
  // FacetWP renders facets client-side — after AJAX page swap, the new DOM
  // has empty .facetwp-facet containers that need FWP to re-parse and render.
  // Only call refresh() if FacetWP already completed its first init (FWP.loaded).
  // On first navigation TO a page with facets, FacetWP's own script handles init.
  if ( typeof FWP !== 'undefined' && FWP.loaded && typeof FWP.refresh === 'function' ) {
    if ( typeof FWP_HTTP !== 'undefined' ) {
      FWP_HTTP.uri = window.location.pathname;
      FWP_HTTP.get = {};
    }
    FWP.refresh();
  }

  // Re-trigger WooCommerce cart fragments if available.
  if ( typeof wc_cart_fragments_params !== 'undefined' ) {
    $( document.body ).trigger( 'wc_fragment_refresh' );
  }

  // Fire a custom event that other scripts can hook into.
  $( document ).trigger( 'anima:page-transition-complete' );
  // Native event mirror for non-jQuery listeners.
  window.dispatchEvent( new CustomEvent( 'anima:page-transition-complete' ) );

  // Dispatch resize + scroll events for layout-dependent JS.
  // Resize: recalculates layout (Hero, GlobalService).
  // Scroll: triggers Hero.update() and bully's rAF loop to process new elements.
  window.dispatchEvent( new Event( 'resize' ) );
  window.dispatchEvent( new Event( 'scroll' ) );
  // Delayed fallback pass: some third-party scripts mutate the new container
  // asynchronously right after transition. Trigger one more recalculation.
  setTimeout( () => {
    window.dispatchEvent( new Event( 'resize' ) );
    window.dispatchEvent( new Event( 'scroll' ) );
  }, 250 );
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
function reinitNovaBlocksScripts( onComplete = () => {} ) {
  // Re-execute the bully vendor script first so it creates a fresh IIFE
  // with an empty elements array and a new .c-bully DOM element.
  // The old instance's rAF loop will harmlessly reference the removed DOM.
  reinitBullyScript();

  const scripts = document.querySelectorAll( 'script[id*="novablocks"][id$="-js"][src*="frontend"]' );
  let pending = 0;

  const onAllLoaded = () => {
    // Nova Blocks scripts have now executed their domReady() callbacks
    // and measured the DOM. Force a recalculation so scripts like the
    // Doppler parallax effect get correct initial positions.
    // Use rAF to ensure measurements happen after the browser has
    // applied any style changes from the newly-loaded scripts.
    requestAnimationFrame( () => {
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
      onComplete();
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

  // If no scripts needed re-execution (all were freshly loaded by
  // syncPageAssets, or no Nova Blocks frontend scripts exist), fire
  // onAllLoaded immediately so resize/scroll events still dispatch.
  if ( pending === 0 ) {
    onAllLoaded();
  }
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
  // Disconnect the header color observer from the current page.
  disconnectHeaderColorObserver();

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
