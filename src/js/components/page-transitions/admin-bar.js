/**
 * Sync the WordPress admin bar from the new page's raw HTML.
 *
 * Replaces the inner content of #wpadminbar with the version from the AJAX
 * response. After replacement, re-initializes WordPress's admin bar JS so
 * dropdown menus and other interactive features continue to work.
 *
 * @param {string} html - Full HTML response from Barba's AJAX fetch.
 */
export function syncAdminBar( html ) {
  const currentAdminBar = document.getElementById( 'wpadminbar' );

  if ( ! currentAdminBar ) {
    return;
  }

  const parser = new DOMParser();
  const doc = parser.parseFromString( html, 'text/html' );
  const newAdminBar = doc.getElementById( 'wpadminbar' );

  if ( ! newAdminBar ) {
    return;
  }

  // Replace inner HTML to update all admin bar items.
  currentAdminBar.innerHTML = newAdminBar.innerHTML;

  // Copy over any changed attributes (classes, aria attributes, etc.).
  Array.from( newAdminBar.attributes ).forEach( ( attr ) => {
    currentAdminBar.setAttribute( attr.name, attr.value );
  } );

  // Re-initialize WordPress admin bar JS.
  // The admin bar script uses event delegation on document for most interactions,
  // but some hover/click handlers are bound directly to elements.
  // Re-executing the script re-binds those handlers to the new DOM nodes.
  reinitAdminBarScripts();
}

/**
 * Re-initialize WordPress admin bar interactive behavior.
 *
 * WordPress's admin-bar.js is enqueued as `admin-bar` and binds hover/click
 * handlers to admin bar elements. After innerHTML replacement, those handlers
 * are lost. We re-execute the script to re-bind them.
 */
function reinitAdminBarScripts() {
  const adminBarScript = document.getElementById( 'admin-bar-js' );

  if ( ! adminBarScript || ! adminBarScript.src ) {
    return;
  }

  const newScript = document.createElement( 'script' );
  newScript.src = adminBarScript.src + ( adminBarScript.src.includes( '?' ) ? '&' : '?' ) + '_barba=' + Date.now();
  newScript.async = false;
  document.body.appendChild( newScript );

  // Clean up after execution.
  newScript.onload = () => {
    newScript.remove();
  };
}
