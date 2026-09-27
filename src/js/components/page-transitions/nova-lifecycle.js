/**
 * Nova Blocks frontend lifecycle bridge (nova-blocks#661, anima#530 H2).
 *
 * Nova Blocks (from the release that closes nova-blocks#661) registers its frontend scripts as re-init-safe modules and
 * hands their lifecycle to the page-transitions registry under
 * `novablocks/frontend`: its cleanup tears every module down with the
 * outgoing page and its reinit sets them up for the incoming one. When that
 * entry is present the theme must NOT re-execute Nova's scripts (that is what
 * piled up observers, scroll listeners and frame loops on every navigation).
 * Older Nova Blocks versions keep the script re-execution fallback.
 */

const { has } = require( './registry' );

const NOVA_FRONTEND_ENTRY_ID = 'novablocks/frontend';

function isNovaFrontendManaged() {
  return has( NOVA_FRONTEND_ENTRY_ID );
}

/**
 * Detach every Barba container except the incoming one.
 *
 * Barba removes the outgoing container only after `enter` resolves, so while
 * the incoming page re-initializes both pages are in the document and
 * document-wide queries find the hidden outgoing elements first (its header,
 * its menu toggle). The outgoing page is already hidden and cleaned up at
 * this point; Barba's own removal skips a container that is gone.
 */
function releaseOutgoingContainers( incoming, doc = ( typeof document !== 'undefined' ? document : null ) ) {
  if ( ! incoming || ! doc || typeof doc.querySelectorAll !== 'function' ) {
    return 0;
  }

  let released = 0;

  Array.from( doc.querySelectorAll( '[data-barba="container"]' ) ).forEach( ( container ) => {
    if ( container !== incoming && typeof container.remove === 'function' ) {
      container.remove();
      released++;
    }
  } );

  return released;
}

module.exports = {
  NOVA_FRONTEND_ENTRY_ID,
  isNovaFrontendManaged,
  releaseOutgoingContainers,
};
