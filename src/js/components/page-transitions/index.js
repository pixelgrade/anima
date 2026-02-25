import $ from 'jquery';
import barba from '@barba/core';
import { pageTransition } from './transitions';
import { playLoadingAnimation } from './loading-animation';

// Ignored URL patterns — file extensions, admin, anchors.
const IGNORED_PATTERNS = [
  '.pdf', '.doc', '.eps', '.png', '.jpg', '.jpeg', '.zip',
  'wp-admin', 'wp-login', 'wp-',
  'feed',
  '#',
  '&add-to-cart=', '?add-to-cart=', '?remove_item',
];

/**
 * Initialize page transitions.
 */
export function init() {
  const $body = $( 'body' );

  // Don't init in Customizer preview.
  if ( $body.hasClass( 'is--customizer-preview' ) ) {
    return;
  }

  // Merge server-side excluded URLs with client-side patterns.
  const serverExcluded = ( typeof animaPageTransitions !== 'undefined' && animaPageTransitions.excludedUrls )
    ? animaPageTransitions.excludedUrls
    : [];

  barba.init( {
    // Barba v2 uses a prevent function instead of overriding preventCheck.
    prevent: ( { el, href } ) => {
      // Skip links with target="_blank".
      if ( el.target && el.target === '_blank' ) {
        return true;
      }

      // Skip links with data-no-transition attribute.
      if ( el.hasAttribute( 'data-no-transition' ) ) {
        return true;
      }

      // Check against ignored patterns.
      for ( const pattern of IGNORED_PATTERNS ) {
        if ( href.indexOf( pattern ) > -1 ) {
          return true;
        }
      }

      // Check against server-side excluded URLs.
      for ( const url of serverExcluded ) {
        if ( href.indexOf( url ) > -1 ) {
          return true;
        }
      }

      return false;
    },

    transitions: [ pageTransition ],

    // Error fallback: if AJAX navigation fails, do a full page reload.
    requestError: ( trigger, action, url ) => {
      window.location.href = url;
      return false;
    },
  } );

  // After each transition, ensure the body is visible.
  barba.hooks.after( () => {
    $body.addClass( 'is-loaded' );
  } );

  // Mark as loaded and play initial page load animation.
  $body.addClass( 'is-loaded' );
  playLoadingAnimation();
}
