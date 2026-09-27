const test = require( 'node:test' );
const assert = require( 'node:assert/strict' );

// anima#530 H2 / nova-blocks#661: Nova Blocks hands its frontend lifecycle to
// the re-init registry; the theme then stops re-executing Nova's scripts,
// runs Nova's reinit before its own integrations, and re-initializes the
// incoming page without the hidden outgoing container in the document.

const registry = require( '../src/js/components/page-transitions/registry.js' );
const {
  NOVA_FRONTEND_ENTRY_ID,
  isNovaFrontendManaged,
  releaseOutgoingContainers,
} = require( '../src/js/components/page-transitions/nova-lifecycle.js' );
const { createHeaderColorSignal } = require( '../src/js/components/page-transitions/header-color-signal.js' );

const withEntries = ( entries, fn ) => {
  entries.forEach( ( entry ) => registry.register( entry ) );
  try {
    fn();
  } finally {
    entries.forEach( ( entry ) => registry.unregister( entry.id ) );
  }
};

test( 'a lower priority runs first in both phases, whatever the registration order', () => {
  const calls = [];
  const entry = ( id, priority ) => ( {
    id,
    priority,
    cleanup: () => calls.push( `cleanup:${ id }` ),
    reinit: () => calls.push( `reinit:${ id }` ),
  } );

  withEntries( [ entry( 'theme/a' ), entry( 'theme/b' ), entry( 'plugin/early', 0 ) ], () => {
    registry.runCleanup( null );
    registry.runReinit( null );
  } );

  assert.deepEqual( calls, [
    'cleanup:plugin/early', 'cleanup:theme/a', 'cleanup:theme/b',
    'reinit:plugin/early', 'reinit:theme/a', 'reinit:theme/b',
  ] );
} );

test( 're-registering an id keeps its place among equal priorities', () => {
  const calls = [];
  const entry = ( id, tag ) => ( { id, reinit: () => calls.push( `${ id }${ tag }` ) } );

  withEntries( [ entry( 'x/first', '' ), entry( 'x/second', '' ) ], () => {
    registry.register( entry( 'x/first', '*' ) );
    registry.runReinit( null );
  } );

  assert.deepEqual( calls, [ 'x/first*', 'x/second' ] );
} );

test( 'Nova Blocks is lifecycle-managed only once its registry entry exists', () => {
  assert.equal( isNovaFrontendManaged(), false );

  withEntries( [ { id: NOVA_FRONTEND_ENTRY_ID, priority: 0, cleanup() {}, reinit() {} } ], () => {
    assert.equal( registry.has( NOVA_FRONTEND_ENTRY_ID ), true );
    assert.equal( isNovaFrontendManaged(), true );
  } );

  assert.equal( isNovaFrontendManaged(), false );
} );

test( 'releaseOutgoingContainers detaches every container but the incoming one', () => {
  const make = ( name ) => ( {
    name,
    removed: false,
    remove() {
      this.removed = true;
    },
  } );
  const outgoing = make( 'outgoing' );
  const incoming = make( 'incoming' );
  const doc = {
    querySelectorAll: ( selector ) => {
      assert.equal( selector, '[data-barba="container"]' );
      return [ outgoing, incoming ];
    },
  };

  assert.equal( releaseOutgoingContainers( incoming, doc ), 1 );
  assert.equal( outgoing.removed, true );
  assert.equal( incoming.removed, false );
  assert.equal( releaseOutgoingContainers( null, doc ), 0 );
} );

test( 'the header color guard reduces to Nova\'s header refresh when it is available', () => {
  const refreshed = [];
  let observers = 0;
  const win = {
    MutationObserver: class {
      constructor() {
        observers++;
      }
      observe() {}
      disconnect() {}
    },
    novablocks: { header: { refresh: ( container ) => refreshed.push( container ) } },
  };
  const integration = createHeaderColorSignal( { getWindow: () => win } );
  const container = { querySelector: () => {
    throw new Error( 'the replica must not run' );
  } };

  for ( let i = 0; i < 10; i++ ) {
    integration.cleanup( container );
    integration.reinit( container );
  }

  assert.equal( refreshed.length, 10 );
  assert.equal( refreshed[ 0 ], container );
  assert.equal( observers, 0 );
  assert.equal( integration.getState(), null );
} );
