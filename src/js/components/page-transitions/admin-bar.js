import $ from 'jquery';

/**
 * Sync the WordPress admin bar from the new page's raw HTML.
 *
 * Replaces the entire #wpadminbar element with the one from the AJAX response.
 * This handles all admin bar changes: items appearing/disappearing, link updates,
 * plugin-added nodes, etc.
 *
 * @param {string} html - Full HTML response from Barba's AJAX fetch.
 */
export function syncAdminBar( html ) {
  if ( ! document.getElementById( 'wpadminbar' ) ) {
    return;
  }

  const parser = new DOMParser();
  const doc = parser.parseFromString( html, 'text/html' );
  const newAdminBar = doc.getElementById( 'wpadminbar' );

  if ( ! newAdminBar ) {
    return;
  }

  const currentAdminBar = document.getElementById( 'wpadminbar' );
  currentAdminBar.replaceWith( newAdminBar );
}
