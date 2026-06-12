import $ from 'jquery';

import * as PileParallax from '../pile-parallax';
import { register } from './registry';

const { cleanupTransitionContainer } = require( './cleanup' );
const { rebindAjaxReadingProgress } = require( './reading-bar' );

/**
 * The theme's own transition integrations, registered through the same
 * public registry third parties use (window.anima.pageTransitions.register).
 *
 * Order matters and mirrors the previous hardcoded sequence: parallax and
 * the reading bar rebind first (they target the post-mutation DOM), then
 * plugin refreshes.
 */
export function registerDefaultIntegrations() {
  // Nova Blocks scripts can mutate/rebuild collection card DOM after the
  // swap — refresh parallax bindings after they finish so we target the
  // final nodes and not stale pre-mutation references.
  register( {
    id: 'anima/pile-parallax',
    reinit() {
      PileParallax.initialize();
    },
  } );

  register( {
    id: 'anima/reading-bar',
    // Remove reading bar nodes from the outgoing container before scripts
    // re-run. Nova Blocks queries `.js-reading-*` globally; leaving old
    // nodes in the DOM during the swap can leak a stale progress bar into
    // the next page header. (Also pauses/releases outgoing videos.)
    cleanup( container ) {
      cleanupTransitionContainer( container );
    },
    reinit() {
      rebindAjaxReadingProgress();
      document.dispatchEvent( new Event( 'scroll', { bubbles: true } ) );
    },
  } );

  // FacetWP renders facets client-side — after the swap, the new DOM has
  // empty .facetwp-facet containers that need FWP to re-parse and render.
  // Only refresh if FacetWP already completed its first init (FWP.loaded);
  // on first navigation TO a page with facets, its own script handles init.
  register( {
    id: 'facetwp',
    reinit() {
      if ( typeof FWP !== 'undefined' && FWP.loaded && typeof FWP.refresh === 'function' ) {
        if ( typeof FWP_HTTP !== 'undefined' ) {
          FWP_HTTP.uri = window.location.pathname;
          FWP_HTTP.get = {};
        }
        FWP.refresh();
      }
    },
  } );

  // Re-trigger WooCommerce cart fragments so header carts stay correct.
  register( {
    id: 'woocommerce/cart-fragments',
    reinit() {
      if ( typeof wc_cart_fragments_params !== 'undefined' ) {
        $( document.body ).trigger( 'wc_fragment_refresh' );
      }
    },
  } );
}
