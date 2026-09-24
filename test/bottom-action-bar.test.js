const test = require( 'node:test' );
const assert = require( 'node:assert/strict' );
const path = require( 'node:path' );
const sass = require( 'sass' );
const postcss = require( 'postcss' );

const {
  SELECTOR,
  HEIGHT_PROPERTY,
  getReservedHeight,
  BottomActionBar,
} = require( '../src/js/components/bottom-action-bar.js' );

const scssRoot = path.join( __dirname, '..', 'src', 'scss' );
const barSelector = '.wp-block-group.is-style-bottom-action-bar';
const phones = 'not screen and (min-width: 1024px)';
const desktops = 'only screen and (min-width: 1024px)';

// ---------------------------------------------------------------------------
// Runtime: the page-end reservation follows the pinned bar's real height.
// ---------------------------------------------------------------------------

const createBar = ( { position = 'fixed', height = 70.2 } = {} ) => ( {
  position,
  height,
  getBoundingClientRect() {
    return { height: this.height };
  },
} );

const getStyle = bar => ( {
  getPropertyValue: property => ( property === 'position' ? bar.position : '' ),
} );

const createTarget = () => {
  const properties = new Map();

  return {
    properties,
    style: {
      setProperty: ( name, value ) => properties.set( name, value ),
      removeProperty: name => properties.delete( name ),
    },
  };
};

class FakeResizeObserver {
  constructor( callback ) {
    this.callback = callback;
    this.observed = new Set();
    FakeResizeObserver.last = this;
  }

  observe( element, options ) {
    assert.deepEqual( options, { box: 'border-box' }, 'padding changes must be observed too' );
    this.observed.add( element );
  }

  unobserve( element ) {
    this.observed.delete( element );
  }
}

const createRoot = bars => ( {
  bars,
  querySelectorAll( selector ) {
    assert.equal( selector, SELECTOR );
    return this.bars;
  },
} );

test( 'only a pinned bar reserves room, rounded up to whole pixels', () => {
  assert.equal( getReservedHeight( [ createBar( { height: 70.2 } ) ], getStyle ), 71 );
  assert.equal( getReservedHeight( [ createBar( { position: 'static', height: 70 } ) ], getStyle ), 0 );
  assert.equal( getReservedHeight( [], getStyle ), 0 );
  assert.equal( getReservedHeight( [ createBar( { height: 60 } ), createBar( { height: 90 } ) ], getStyle ), 90 );
} );

test( 'publishes the pinned bar height and clears it when the bar is not pinned', () => {
  const bar = createBar( { height: 76 } );
  const target = createTarget();
  const component = new BottomActionBar( { root: createRoot( [ bar ] ), target, getStyle, ResizeObserver: FakeResizeObserver } );

  assert.equal( target.properties.get( HEIGHT_PROPERTY ), '76px' );

  // Crossing into desktop widths un-pins (hides) the bar; ResizeObserver fires.
  bar.position = 'static';
  FakeResizeObserver.last.callback();
  assert.equal( target.properties.has( HEIGHT_PROPERTY ), false );

  // A longer label wraps the bar taller on a narrow phone.
  bar.position = 'fixed';
  bar.height = 120;
  component.update();
  assert.equal( target.properties.get( HEIGHT_PROPERTY ), '120px' );
} );

test( 'leaves pages without a bar untouched', () => {
  const target = createTarget();

  new BottomActionBar( { root: createRoot( [] ), target, getStyle, ResizeObserver: FakeResizeObserver } );

  assert.equal( target.properties.size, 0 );
} );

test( 'rescans bars swapped in by page transitions or editing', () => {
  const first = createBar( { height: 70 } );
  const second = createBar( { height: 82 } );
  const root = createRoot( [ first ] );
  const target = createTarget();
  const component = new BottomActionBar( { root, target, getStyle, ResizeObserver: FakeResizeObserver } );
  const observer = FakeResizeObserver.last;

  root.bars = [ second ];
  component.scan();

  assert.deepEqual( Array.from( observer.observed ), [ second ] );
  assert.equal( target.properties.get( HEIGHT_PROPERTY ), '82px' );

  root.bars = [];
  component.scan();

  assert.equal( observer.observed.size, 0 );
  assert.equal( target.properties.has( HEIGHT_PROPERTY ), false );
} );

test( 'still measures once without ResizeObserver support', () => {
  const target = createTarget();

  new BottomActionBar( { root: createRoot( [ createBar( { height: 64 } ) ] ), target, getStyle, ResizeObserver: undefined } );

  assert.equal( target.properties.get( HEIGHT_PROPERTY ), '64px' );
} );

// ---------------------------------------------------------------------------
// Styles: pinned only on phones, hidden on desktops, in flow in the editor.
// ---------------------------------------------------------------------------

const compile = entry => postcss.parse( sass.compile( path.join( scssRoot, entry ) ).css );

// Declarations for rules whose selector includes `needle`, keyed by media query.
const collect = ( root, needle ) => {
  const found = [];

  root.walkRules( rule => {
    if ( ! rule.selector.includes( needle ) ) {
      return;
    }

    const media = rule.parent?.type === 'atrule' && rule.parent.name === 'media' ? rule.parent.params : null;
    const declarations = {};
    rule.walkDecls( decl => {
      declarations[ decl.prop ] = decl.value + ( decl.important ? ' !important' : '' );
    } );
    found.push( { selector: rule.selector, media, declarations } );
  } );

  return found;
};

test( 'the frontend pins the bar only below the lap breakpoint', () => {
  const rules = collect( compile( 'blocks/style.scss' ), barSelector );
  const pinned = rules.filter( rule => rule.declarations.position === 'fixed' );

  assert.equal( pinned.length, 1, 'exactly one rule pins the bar' );
  assert.equal( pinned[ 0 ].media, phones );
  assert.equal( pinned[ 0 ].selector, barSelector );
  assert.equal( pinned[ 0 ].declarations.bottom, '0' );
  assert.equal( pinned[ 0 ].declarations[ 'border-bottom' ], 'env(safe-area-inset-bottom, 0px) solid transparent' );
  assert.equal( 'padding-bottom' in pinned[ 0 ].declarations, false, 'padding belongs to the look / Color Signal' );

  const hidden = rules.filter( rule => rule.declarations.display === 'none' );
  assert.equal( hidden.length, 1 );
  assert.equal( hidden[ 0 ].media, desktops );
} );

test( 'the frontend reserves the bar height at the page end and hides it behind the open drawer', () => {
  const rules = collect( compile( 'blocks/style.scss' ), barSelector );
  const reserve = rules.find( rule => rule.selector === `body:has(${ barSelector })` );
  const scrollPadding = rules.find( rule => rule.selector === `html:has(${ barSelector })` );
  const drawer = rules.find( rule => rule.selector.startsWith( 'body:has(#nova-menu-toggle:checked)' ) );

  assert.equal( reserve?.media, phones );
  assert.match( reserve.declarations[ 'padding-bottom' ], /^var\(--anima-bottom-action-bar-height, calc\(44px .*env\(safe-area-inset-bottom, 0px\)\)\)$/ );
  assert.equal( scrollPadding?.media, phones );
  assert.match( scrollPadding.declarations[ 'scroll-padding-bottom' ], /^var\(--anima-bottom-action-bar-height,/ );
  assert.equal( drawer?.media, phones );
  assert.equal( drawer.declarations.visibility, 'hidden' );
} );

test( 'the shared look keeps 44px targets, readable labels and Style Manager colours', () => {
  const rules = collect( compile( 'blocks/common.scss' ), barSelector );
  const bar = rules.find( rule => rule.selector === barSelector );
  const link = rules.find( rule => rule.selector === `${ barSelector } .wp-block-button__link` );

  assert.match( bar.declarations[ 'background-color' ], /^var\(--sm-current-bg-color,/ );
  assert.match( bar.declarations.color, /^var\(--sm-current-fg1-color,/ );
  assert.equal( link.declarations[ 'min-height' ], '44px' );
  assert.equal( link.declarations[ 'white-space' ], 'normal', 'labels wrap instead of being clipped' );
  assert.equal( rules.some( rule => rule.declarations.position === 'fixed' ), false );
} );

test( 'the editor never pins the bar', () => {
  for ( const entry of [ 'blocks/editor.scss', 'blocks/common.scss' ] ) {
    const rules = collect( compile( entry ), 'is-style-bottom-action-bar' );
    assert.equal( rules.some( rule => rule.declarations.position === 'fixed' ), false, entry );
  }

  const editor = collect( compile( 'blocks/editor.scss' ), `.editor-styles-wrapper ${ barSelector }` );
  assert.equal( editor[ 0 ]?.declarations.position, 'relative' );
} );
