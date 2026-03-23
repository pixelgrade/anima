import $ from 'jquery';
import * as SlideWipeLoader from './slide-wipe-loader';
import {
  syncBodyClasses,
  syncPageAssets,
  syncDocumentTitle,
  syncHeaderColorSignal,
  reinitComponents,
  cleanupBeforeTransition,
  trackPageview,
} from './utils';
import { syncAdminBar } from './admin-bar';

/**
 * Shared enter logic for Slide Wipe transitions.
 * Syncs WordPress state, reinitializes components, then hides the loader.
 */
function performSlideWipeEnter( { next } ) {
  window.scrollTo( 0, 0 );

  const html = next.html;
  syncPageAssets( html );
  syncBodyClasses( html );
  syncDocumentTitle( html );
  syncAdminBar( html );
  syncHeaderColorSignal( html, next.container );

  return new Promise( ( resolve ) => {
    requestAnimationFrame( () => {
      requestAnimationFrame( () => {
        reinitComponents();
        trackPageview();

        SlideWipeLoader.hide().then( resolve );
      } );
    } );
  } );
}

/**
 * Generic page transition using Slide Wipe.
 */
export const slideWipePageTransition = {
  name: 'slide-wipe-page-transition',

  leave( { current } ) {
    $( 'body' ).removeClass( 'nav-is-open' );

    return SlideWipeLoader.show().then( () => {
      cleanupBeforeTransition();
      $( current.container ).hide();
    } );
  },

  enter( { next } ) {
    return performSlideWipeEnter( { next } );
  },
};

/**
 * Card-expand transition using Slide Wipe.
 * Same card-click detection as Border Iris, but uses slide wipe instead of border overlay.
 */
export const slideWipeCardExpandTransition = {
  name: 'slide-wipe-card-expand',

  custom: ( { trigger } ) => {
    if ( ! trigger || trigger === 'barba' || typeof trigger.closest !== 'function' ) {
      return false;
    }
    const card = trigger.closest( '.nb-supernova-item' );
    if ( ! card || ! card.closest( '.wp-block-query' ) ) {
      return false;
    }
    const supernova = card.closest( '.nb-supernova' );
    return supernova !== null && ! supernova.classList.contains( 'nb-supernova--1-columns' );
  },

  leave( { current } ) {
    $( 'body' ).removeClass( 'nav-is-open' );

    return SlideWipeLoader.show().then( () => {
      cleanupBeforeTransition();
      $( current.container ).hide();
    } );
  },

  enter( { next } ) {
    return performSlideWipeEnter( { next } );
  },
};
