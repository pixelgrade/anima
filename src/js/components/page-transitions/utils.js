/**
 * Utility functions for page transitions.
 */

/**
 * Sync body classes from a new page's HTML string.
 * Preserves JS-only classes that shouldn't be lost.
 */
export function syncBodyClasses( newDocument ) {
  const preserveClasses = [
    'has-page-transitions',
    'is-loaded',
    'has-loaded',
    'admin-bar',
  ];

  const newBody = newDocument.querySelector( 'body' );
  if ( ! newBody ) {
    return;
  }

  const preserved = preserveClasses.filter( ( cls ) =>
    document.body.classList.contains( cls )
  );

  document.body.className = newBody.className;

  preserved.forEach( ( cls ) => {
    document.body.classList.add( cls );
  } );
}

/**
 * Update the document title from the new page.
 */
export function syncDocumentTitle( newDocument ) {
  const newTitle = newDocument.querySelector( 'title' );
  if ( newTitle ) {
    document.title = newTitle.textContent;
  }
}

/**
 * Update admin bar edit/customize links for the new page.
 */
export function syncAdminBar( newDocument ) {
  const adminBar = document.getElementById( 'wpadminbar' );
  if ( ! adminBar ) {
    return;
  }

  const newAdminBar = newDocument.getElementById( 'wpadminbar' );
  if ( newAdminBar ) {
    adminBar.innerHTML = newAdminBar.innerHTML;
  }
}

/**
 * Re-initialize Anima theme components after DOM swap.
 */
export function reinitComponents() {
  // Tell scripts.js to re-create App (Navbar, Hero, SearchOverlay, etc.).
  document.dispatchEvent( new CustomEvent( 'anima:page-transition' ) );

  // Re-execute Nova Blocks frontend scripts that use ready() —
  // since readyState is already 'complete', ready() fires immediately
  // when the script re-runs, re-creating Header, Supernova, etc.
  rerunNovaBlocksScripts();

  // Trigger resize/scroll for any remaining listeners.
  window.dispatchEvent( new Event( 'resize' ) );
  window.dispatchEvent( new Event( 'scroll' ) );

  // Re-trigger image lazy loading.
  if ( typeof jQuery !== 'undefined' ) {
    jQuery( document.body ).trigger( 'post-load' );
  }

  // Re-init WooCommerce cart fragments.
  if ( typeof jQuery !== 'undefined' && jQuery.fn.wc_cart_fragments ) {
    jQuery( document.body ).trigger( 'wc_fragment_refresh' );
  }
}

/**
 * Re-execute Nova Blocks frontend scripts after DOM swap.
 *
 * Nova Blocks scripts use ready() which fires immediately when
 * readyState is already 'complete'. By creating fresh <script> tags
 * with the same src, the browser re-executes the initialization code.
 */
function rerunNovaBlocksScripts() {
  // Key Nova Blocks scripts that need re-init after DOM swap.
  const scriptPatterns = [
    'nova-blocks/build/color-signal/frontend',
    'block-library/blocks/header/frontend',
    'block-library/blocks/supernova/frontend',
  ];

  const existingScripts = document.querySelectorAll( 'script[src]' );

  existingScripts.forEach( ( script ) => {
    const src = script.src;
    const shouldRerun = scriptPatterns.some( ( pattern ) => src.includes( pattern ) );

    if ( shouldRerun ) {
      const newScript = document.createElement( 'script' );
      newScript.src = src;
      script.parentNode.insertBefore( newScript, script.nextSibling );
    }
  } );
}

/**
 * Push a pageview event for analytics.
 */
export function trackPageview( url ) {
  // Google Analytics 4 / gtag.
  if ( typeof gtag === 'function' ) {
    gtag( 'event', 'page_view', {
      page_location: url,
    } );
  }

  // Google Tag Manager.
  if ( typeof dataLayer !== 'undefined' && Array.isArray( dataLayer ) ) {
    dataLayer.push( {
      event: 'pageview',
      page: url,
    } );
  }

  // Legacy Universal Analytics.
  if ( typeof ga === 'function' ) {
    ga( 'send', 'pageview', url );
  }
}

/**
 * Determine if a URL should be excluded from page transitions.
 */
export function shouldExcludeUrl( url, config ) {
  const urlObj = new URL( url, window.location.origin );

  // Different origin.
  if ( urlObj.origin !== window.location.origin ) {
    return true;
  }

  // Hash-only navigation.
  if ( urlObj.pathname === window.location.pathname && urlObj.hash ) {
    return true;
  }

  // File downloads.
  const fileExtensions = /\.(pdf|doc|docx|zip|rar|jpg|jpeg|png|gif|eps|svg|mp3|mp4|avi)$/i;
  if ( fileExtensions.test( urlObj.pathname ) ) {
    return true;
  }

  // WordPress admin/login.
  if ( /wp-(admin|login|content|includes)/.test( urlObj.pathname ) ) {
    return true;
  }

  // WooCommerce transactional pages.
  const excludedPaths = config.excludedUrls || [];
  for ( const excluded of excludedPaths ) {
    if ( urlObj.pathname.includes( excluded ) ) {
      return true;
    }
  }

  // Cart actions via query params.
  if ( urlObj.search.includes( 'add-to-cart' ) || urlObj.search.includes( 'remove_item' ) ) {
    return true;
  }

  // Feed URLs.
  if ( /\/feed\/?$/i.test( urlObj.pathname ) ) {
    return true;
  }

  return false;
}

/**
 * Sync <head> assets (styles and scripts) from the new page.
 * Loads any new stylesheets/scripts that weren't on the current page.
 */
export function syncHeadAssets( newDocument ) {
  const currentHead = document.head;
  const newHead = newDocument.head;
  if ( ! newHead ) {
    return Promise.resolve();
  }

  const promises = [];

  // Sync stylesheets.
  const newStyles = newHead.querySelectorAll( 'link[rel="stylesheet"], style' );
  newStyles.forEach( ( newStyle ) => {
    const id = newStyle.id;
    if ( id && ! currentHead.querySelector( `#${ id }` ) ) {
      const clone = newStyle.cloneNode( true );
      if ( clone.tagName === 'LINK' ) {
        promises.push( new Promise( ( resolve ) => {
          clone.onload = resolve;
          clone.onerror = resolve;
        } ) );
      }
      currentHead.appendChild( clone );
    }
  } );

  // Sync inline styles (WordPress per-page custom properties).
  const newInlineStyles = newHead.querySelectorAll( 'style[id]' );
  newInlineStyles.forEach( ( newInline ) => {
    const existing = currentHead.querySelector( `#${ newInline.id }` );
    if ( existing ) {
      existing.textContent = newInline.textContent;
    }
  } );

  return promises.length ? Promise.all( promises ) : Promise.resolve();
}
