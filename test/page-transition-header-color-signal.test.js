const test = require( 'node:test' );
const assert = require( 'node:assert/strict' );

// ---------------------------------------------------------------------------
// Minimal DOM: enough element/selector/MutationObserver behavior for the
// header color signal lifecycle. Mutation callbacks are delivered on flush(),
// batched like real microtask delivery.
// ---------------------------------------------------------------------------

function createDom() {
  const observers = new Set();
  const pending = new Map(); // observer -> records

  function notify( element ) {
    observers.forEach( ( observer ) => {
      if ( observer.targets.has( element ) ) {
        if ( ! pending.has( observer ) ) {
          pending.set( observer, [] );
        }
        pending.get( observer ).push( { type: 'attributes', attributeName: 'class', target: element } );
      }
    } );
  }

  function matchesCompound( element, compound ) {
    const re = /^([a-z]+)?((?:\.[\w-]+)*)(\[class\*="([^"]+)"\])?$/i;
    const m = compound.trim().match( re );
    if ( ! m ) {
      throw new Error( `Unsupported selector: ${ compound }` );
    }
    if ( m[ 1 ] && element.tagName !== m[ 1 ].toUpperCase() ) {
      return false;
    }
    const classes = ( m[ 2 ] || '' ).split( '.' ).filter( Boolean );
    if ( ! classes.every( ( cls ) => element.classes.includes( cls ) ) ) {
      return false;
    }
    if ( m[ 4 ] && ! element.className.includes( m[ 4 ] ) ) {
      return false;
    }
    return true;
  }

  class Element {
    constructor( tag, className = '', dataset = {} ) {
      this.tagName = tag.toUpperCase();
      this.classes = className.split( /\s+/ ).filter( Boolean );
      this.dataset = dataset;
      this.children = [];
      this.parentElement = null;
      this.style = { paddingTop: '10px' };
      const self = this;
      this.classList = {
        contains: ( cls ) => self.classes.includes( cls ),
        add: ( cls ) => {
          if ( ! self.classes.includes( cls ) ) {
            self.classes.push( cls );
            notify( self );
          }
        },
        remove: ( cls ) => {
          if ( self.classes.includes( cls ) ) {
            self.classes = self.classes.filter( ( c ) => c !== cls );
            notify( self );
          }
        },
      };
    }

    get className() {
      return this.classes.join( ' ' );
    }

    set className( value ) {
      this.classes = value.split( /\s+/ ).filter( Boolean );
      notify( this );
    }

    getAttribute( name ) {
      return name === 'class' ? this.className : null;
    }

    append( ...children ) {
      children.forEach( ( child ) => {
        child.parentElement = this;
        this.children.push( child );
      } );
      return this;
    }

    remove() {
      if ( this.parentElement ) {
        this.parentElement.children = this.parentElement.children.filter( ( c ) => c !== this );
        this.parentElement = null;
      }
    }

    get firstElementChild() {
      return this.children[ 0 ] || null;
    }

    get nextElementSibling() {
      if ( ! this.parentElement ) {
        return null;
      }
      const siblings = this.parentElement.children;
      return siblings[ siblings.indexOf( this ) + 1 ] || null;
    }

    get isConnected() {
      let node = this;
      while ( node.parentElement ) {
        node = node.parentElement;
      }
      return node === dom.root;
    }

    matches( selector ) {
      return selector.split( ',' ).some( ( part ) => matchesCompound( this, part ) );
    }

    closest( selector ) {
      for ( let node = this; node; node = node.parentElement ) {
        if ( node.matches( selector ) ) {
          return node;
        }
      }
      return null;
    }

    querySelectorAll( selector ) {
      const found = [];
      const walk = ( node ) => node.children.forEach( ( child ) => {
        if ( child.matches( selector ) ) {
          found.push( child );
        }
        walk( child );
      } );
      walk( this );
      return found;
    }

    querySelector( selector ) {
      return this.querySelectorAll( selector )[ 0 ] || null;
    }
  }

  class MutationObserver {
    constructor( callback ) {
      this.callback = callback;
      this.targets = new Set();
      dom.created++;
    }

    observe( target ) {
      this.targets.add( target );
      observers.add( this );
    }

    disconnect() {
      this.targets.clear();
      observers.delete( this );
      pending.delete( this );
    }
  }

  const dom = {
    created: 0,
    root: null,
    Element,
    observers,
    el: ( tag, className, dataset ) => new Element( tag, className, dataset ),
    flush() {
      // Deliver until quiet, like chained microtasks (bounded to catch wars).
      for ( let round = 0; round < 20 && pending.size; round++ ) {
        const batch = Array.from( pending.entries() );
        pending.clear();
        batch.forEach( ( [ observer, records ] ) => observer.callback( records, observer ) );
      }
      if ( pending.size ) {
        throw new Error( 'Observer war: mutations never settled' );
      }
    },
  };

  dom.root = new Element( 'html' );
  dom.window = {
    MutationObserver,
    document: dom.root,
    getComputedStyle: ( element ) => ( { paddingTop: element.style.paddingTop } ),
  };

  return dom;
}

const COLORS = /^(sm-palette-|sm-variation-|sm-color-signal-|sm-light|sm-dark)/;
const colorClasses = ( element ) => element.classes.filter( ( c ) => COLORS.test( c ) ).sort().join( ' ' );

/**
 * Build a Barba container like the FSE page template renders it:
 * container > [ template-part header > .nb-header--main > row ] + main > post-content > first block
 */
function buildPage( dom, { heroClasses, heroVariation = '1', backgroundMode } ) {
  const container = dom.el( 'div', 'barba-container' );
  const part = dom.el( 'header', 'wp-block-template-part' );
  const header = dom.el( 'div', 'nb-header nb-header--main alignfull sm-palette-1 sm-variation-1 sm-color-signal-0',
    backgroundMode ? { backgroundMode } : {} );
  const row = dom.el( 'div', 'nb-header-row nb-header-row--primary sm-palette-1 sm-variation-1 sm-color-signal-0' );
  header.append( row );
  part.append( header );
  const main = dom.el( 'main', 'wp-block-group' );
  const content = dom.el( 'div', 'wp-block-post-content' );
  const hero = dom.el( 'div', `wp-block-group alignfull ${ heroClasses }`, { paletteVariation: heroVariation } );
  hero.append( dom.el( 'h1', '' ) );
  content.append( hero );
  main.append( content );
  container.append( part, main );
  return { container, header, row };
}

const {
  createHeaderColorSignal,
} = require( '../src/js/components/page-transitions/header-color-signal.js' );
const registry = require( '../src/js/components/page-transitions/registry.js' );

const DARK = 'sm-palette-1 sm-variation-11 sm-color-signal-3';
const LIGHT = 'sm-palette-1 sm-variation-1 sm-color-signal-0';

test( 'reinit applies the hero colors to the header rows only, like a hard load', () => {
  const dom = createDom();
  const page = buildPage( dom, { heroClasses: DARK, heroVariation: '11' } );
  dom.root.append( page.container );

  const integration = createHeaderColorSignal( { getWindow: () => dom.window } );
  integration.reinit( page.container );
  dom.flush();

  assert.equal( colorClasses( page.row ), 'sm-color-signal-3 sm-palette-1 sm-variation-11' );
  // The header element keeps its own palette (Nova never repaints it).
  assert.equal( colorClasses( page.header ), 'sm-color-signal-0 sm-palette-1 sm-variation-1' );
  assert.equal( dom.observers.size, 1 );
} );

test( 'the guard re-applies transparent colors when a script overwrites them, and yields to sticky', () => {
  const dom = createDom();
  const page = buildPage( dom, { heroClasses: DARK, heroVariation: '11' } );
  dom.root.append( page.container );

  const integration = createHeaderColorSignal( { getWindow: () => dom.window } );
  integration.reinit( page.container );
  dom.flush();

  // A re-executed header script freezes the wrong (light) set on the row.
  page.row.className = 'nb-header-row nb-header-row--primary sm-palette-1 sm-variation-1';
  dom.flush();
  assert.equal( colorClasses( page.row ), 'sm-color-signal-3 sm-palette-1 sm-variation-11' );

  // Scrolling past the threshold: Nova marks the header sticky and gives the
  // row its own colors back. The guard must not fight that.
  page.header.classList.add( 'nb-header--sticky' );
  page.row.className = `nb-header-row nb-header-row--primary ${ LIGHT }`;
  dom.flush();
  assert.equal( colorClasses( page.row ), 'sm-color-signal-0 sm-palette-1 sm-variation-1' );

  // While sticky the guard never writes: Nova's own row colors (with the
  // sm-light/sm-dark its color signal script adds) stay untouched.
  page.row.className = `nb-header-row nb-header-row--primary ${ LIGHT } sm-light`;
  dom.flush();
  assert.equal( colorClasses( page.row ), 'sm-color-signal-0 sm-light sm-palette-1 sm-variation-1' );

  // Back above the threshold: transparent colors again.
  page.header.classList.remove( 'nb-header--sticky' );
  dom.flush();
  assert.equal( colorClasses( page.row ), 'sm-color-signal-3 sm-palette-1 sm-variation-11' );
} );

test( 'solid headers keep their own row colors and get no guard', () => {
  const dom = createDom();
  const page = buildPage( dom, { heroClasses: DARK, heroVariation: '11', backgroundMode: 'solid' } );
  dom.root.append( page.container );

  const integration = createHeaderColorSignal( { getWindow: () => dom.window } );
  integration.reinit( page.container );
  dom.flush();

  assert.equal( colorClasses( page.row ), 'sm-color-signal-0 sm-palette-1 sm-variation-1' );
  assert.equal( dom.observers.size, 0 );
} );

test( 'cleanup disconnects the observer and forgets the outgoing header', () => {
  const dom = createDom();
  const page = buildPage( dom, { heroClasses: DARK, heroVariation: '11' } );
  dom.root.append( page.container );

  const integration = createHeaderColorSignal( { getWindow: () => dom.window } );
  integration.reinit( page.container );
  assert.equal( dom.observers.size, 1 );

  integration.cleanup( page.container );
  assert.equal( dom.observers.size, 0 );
  assert.equal( integration.getState(), null );

  // The outgoing header is no longer guarded.
  page.row.className = 'nb-header-row';
  dom.flush();
  assert.equal( colorClasses( page.row ), '' );
} );

test( 'A->B->A… through the registry keeps one observer and the correct colors for each page', () => {
  const dom = createDom();
  dom.window.dispatchEvent = () => {};
  const previousWindow = global.window;
  global.window = dom.window;
  global.CustomEvent = class {
    constructor( name, init ) {
      this.type = name;
      this.detail = init && init.detail;
    }
  };

  const integration = createHeaderColorSignal( { getWindow: () => dom.window } );
  registry.register( integration );

  try {
    const pages = [
      { heroClasses: DARK, heroVariation: '11', expectedRow: 'sm-color-signal-3 sm-palette-1 sm-variation-11' },
      { heroClasses: LIGHT, heroVariation: '1', expectedRow: 'sm-palette-1 sm-variation-1' },
    ];

    let current = buildPage( dom, pages[ 0 ] );
    dom.root.append( current.container );
    integration.reinit( current.container );

    for ( let i = 1; i <= 10; i++ ) {
      const spec = pages[ i % 2 ];
      const outgoing = current;

      registry.runCleanup( outgoing.container );
      outgoing.container.remove();

      current = buildPage( dom, spec );
      dom.root.append( current.container );
      registry.notifyAfterSwap( current.container );

      // Nothing touches the incoming header before the Nova scripts re-run:
      // Nova captures the rows' current classes as their sticky colors.
      assert.equal( colorClasses( current.row ), 'sm-color-signal-0 sm-palette-1 sm-variation-1', `navigation ${ i }: row painted before reinit` );
      assert.equal( dom.observers.size, 0, `navigation ${ i }: guard alive across the swap` );

      // The re-executed Nova header script writes its (possibly wrong) set.
      current.row.className = `nb-header-row nb-header-row--primary ${ LIGHT }`;
      registry.runReinit( current.container );
      dom.flush();

      assert.equal( colorClasses( current.row ), spec.expectedRow, `navigation ${ i }` );
      assert.equal( colorClasses( current.header ), 'sm-color-signal-0 sm-palette-1 sm-variation-1', `navigation ${ i } header` );
      assert.ok( dom.observers.size <= 1, `navigation ${ i }: ${ dom.observers.size } live observers` );
      dom.observers.forEach( ( observer ) => {
        observer.targets.forEach( ( target ) => assert.ok( target.isConnected, `navigation ${ i }: observer on a detached node` ) );
      } );
      assert.equal( integration.getState() && integration.getState().header, current.header );
    }

    // One observer per navigation at most (created on reinit), never more.
    assert.ok( dom.created <= 11, `created ${ dom.created } observers for 11 page views` );
  } finally {
    registry.unregister( integration.id );
    global.window = previousWindow;
  }
} );

test( 'reinit twice for the same container does not stack observers', () => {
  const dom = createDom();
  const page = buildPage( dom, { heroClasses: DARK, heroVariation: '11' } );
  dom.root.append( page.container );

  const integration = createHeaderColorSignal( { getWindow: () => dom.window } );
  integration.reinit( page.container );
  integration.reinit( page.container );
  integration.reinit( page.container );
  integration.reinit( page.container );

  assert.equal( dom.observers.size, 1 );
} );

test( 'a page without a header or without a colored neighbour installs no guard', () => {
  const dom = createDom();
  const bare = dom.el( 'div', 'barba-container' );
  bare.append( dom.el( 'main', 'wp-block-group' ) );
  dom.root.append( bare );

  const integration = createHeaderColorSignal( { getWindow: () => dom.window } );
  integration.reinit( bare );
  assert.equal( dom.observers.size, 0 );
  assert.equal( integration.getState(), null );
} );
