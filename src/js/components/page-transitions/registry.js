/**
 * Public re-init registry for AJAX page transitions.
 *
 * Inversion of control for the "special triggers" problem: instead of the
 * transitions system hardcoding every component that needs cleanup/re-init
 * around a container swap, components register themselves:
 *
 *   window.anima.pageTransitions.register( {
 *     id: 'my-component',
 *     // Optional. Lower runs first; entries with the same priority run in
 *     // registration order. The theme's own integrations use the default 10,
 *     // so a plugin whose DOM they build on (Nova Blocks) registers below it.
 *     priority: 10,
 *     // Called with the OUTGOING container, before it is replaced.
 *     cleanup( container ) {},
 *     // Called with the INCOMING container, after it is live and the
 *     // theme/block frontend scripts have re-executed against it.
 *     reinit( container ) {},
 *   } );
 *
 * DOM events mirror the lifecycle for code that prefers listening
 * (`event.detail.container` carries the relevant container):
 *
 *   anima:page-transition-start     navigation started (existing event)
 *   anima:before-swap               outgoing container about to be replaced
 *   anima:after-swap                incoming container is live in the DOM
 *   anima:page-transition-complete  overlay dismissed, page interactive (existing event)
 *
 * Entries run by priority, then in registration order. A throwing handler is
 * isolated — it never breaks the navigation or the other handlers.
 */

const DEFAULT_PRIORITY = 10;

const entries = new Map();
let registrations = 0;

function register( entry ) {
  if ( ! entry || typeof entry.id !== 'string' || ! entry.id ) {
    return;
  }

  const existing = entries.get( entry.id );

  entries.set( entry.id, {
    entry,
    priority: Number.isFinite( entry.priority ) ? entry.priority : DEFAULT_PRIORITY,
    // Re-registering an id keeps its place.
    order: existing ? existing.order : registrations++,
  } );
}

function unregister( id ) {
  entries.delete( id );
}

function has( id ) {
  return entries.has( id );
}

function orderedEntries() {
  return Array.from( entries.values() )
    .sort( ( a, b ) => ( a.priority - b.priority ) || ( a.order - b.order ) )
    .map( ( { entry } ) => entry );
}

function runPhase( phase, container ) {
  orderedEntries().forEach( ( entry ) => {
    if ( typeof entry[ phase ] !== 'function' ) {
      return;
    }

    try {
      entry[ phase ]( container );
    } catch ( error ) {
      // eslint-disable-next-line no-console
      console.error( `[anima] page-transitions ${ phase } handler "${ entry.id }" failed:`, error );
    }
  } );
}

function dispatchLifecycleEvent( name, container ) {
  if ( typeof window === 'undefined' ) {
    return;
  }

  window.dispatchEvent( new CustomEvent( name, { detail: { container } } ) );

  if ( window.jQuery ) {
    window.jQuery( document ).trigger( name, [ container ] );
  }
}

/**
 * Run every registered cleanup against the outgoing container and announce
 * the swap. Called by the transitions system right before Barba replaces
 * the container.
 */
function runCleanup( container ) {
  runPhase( 'cleanup', container );
  dispatchLifecycleEvent( 'anima:before-swap', container );
}

/**
 * Announce that the incoming container is live in the DOM (before component
 * re-initialization). Called by the transitions system right after the swap.
 */
function notifyAfterSwap( container ) {
  dispatchLifecycleEvent( 'anima:after-swap', container );
}

/**
 * Run every registered reinit against the incoming container. Called by the
 * transitions system after the theme/block frontend scripts have re-executed.
 */
function runReinit( container ) {
  runPhase( 'reinit', container );
}

// The public API surface third parties integrate against.
if ( typeof window !== 'undefined' ) {
  window.anima = window.anima || {};
  window.anima.pageTransitions = window.anima.pageTransitions || {};
  window.anima.pageTransitions.register = register;
  window.anima.pageTransitions.unregister = unregister;
  window.anima.pageTransitions.has = has;
}

// CommonJS so the node:test suite can drive the lifecycle directly; webpack
// interops it for the ES `import { … } from './registry'` call sites.
module.exports = {
  register,
  unregister,
  has,
  runCleanup,
  notifyAfterSwap,
  runReinit,
};
