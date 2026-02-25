import $ from 'jquery';

/**
 * Sync body classes from the new page's HTML response.
 * Uses the same NOTBODY trick as Pile to parse <body> attributes from raw HTML.
 */
export function syncBodyClasses( html ) {
  const data = html.replace( /(<\/?)body( .+?)?>/gi, '$1NOTBODY$2>' );
  const nobodyClass = $( data ).filter( 'notbody' ).attr( 'class' );

  if ( nobodyClass ) {
    $( 'body' ).attr( 'class', nobodyClass );
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
 */
export function reinitComponents() {
  // Trigger imagesLoaded for any new images.
  const $images = $( '[data-barba="container"]' ).find( 'img' ).not( '[srcset], .is-loaded, .is-broken' );
  if ( $images.length && $.fn.imagesLoaded ) {
    $images.imagesLoaded().progress( ( instance, image ) => {
      const className = image.isLoaded ? 'is-loaded' : 'is-broken';
      $( image.img ).addClass( className );
    } );
  }

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
