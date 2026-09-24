// Bottom action bar: a Group with the `is-style-bottom-action-bar` block
// style inside the Footer template part (marked `has-bottom-action-bar` by
// PHP), pinned to the bottom of the viewport on phones by CSS. This keeps
// the page's end reservation (`--anima-bottom-action-bar-height`, consumed by
// the stylesheet) equal to the bar's real height, which changes with the
// label length, the palette's type scale and the safe-area inset. Without
// this script the stylesheet reserves a one-row fallback height.

const SELECTOR = '.has-bottom-action-bar .wp-block-group.is-style-bottom-action-bar';
const HEIGHT_PROPERTY = '--anima-bottom-action-bar-height';
const EXTRA_CLASS = 'is-bottom-action-bar-extra';

// Only a bar that is actually pinned (phones) takes space from the page.
const getReservedHeight = ( bars, getStyle ) => {
  return bars.reduce( ( height, bar ) => {
    if ( getStyle( bar ).getPropertyValue( 'position' ) !== 'fixed' ) {
      return height;
    }

    return Math.max( height, Math.ceil( bar.getBoundingClientRect().height ) );
  }, 0 );
};

class BottomActionBar {

  constructor( options = {} ) {
    this.root = options.root || document;
    this.target = options.target || document.documentElement;
    this.getStyle = options.getStyle || ( element => window.getComputedStyle( element ) );
    this.bars = [];

    const ResizeObserverImpl = 'ResizeObserver' in options ? options.ResizeObserver : window.ResizeObserver;
    this.resizeObserver = ResizeObserverImpl ? new ResizeObserverImpl( () => this.update() ) : null;

    this.scan();
  }

  // Bars come and go with Site Editor changes and AJAX page transitions.
  scan() {
    const bars = Array.from( this.root.querySelectorAll( SELECTOR ) );

    if ( this.resizeObserver ) {
      this.bars.filter( bar => ! bars.includes( bar ) ).forEach( bar => this.resizeObserver.unobserve( bar ) );
      // Border box: a Color Signal changes the bar's padding, not its content.
      bars.filter( bar => ! this.bars.includes( bar ) ).forEach( bar => this.resizeObserver.observe( bar, { box: 'border-box' } ) );
    }

    // Stacked bars would overlap at the same spot and hide focusable
    // buttons behind each other: only the first one on the page is shown.
    bars.forEach( ( bar, index ) => bar.classList.toggle( EXTRA_CLASS, index > 0 ) );

    this.bars = bars;
    this.update();
  }

  update() {
    const height = getReservedHeight( this.bars, this.getStyle );

    if ( height > 0 ) {
      this.target.style.setProperty( HEIGHT_PROPERTY, `${ height }px` );
    } else {
      this.target.style.removeProperty( HEIGHT_PROPERTY );
    }
  }
}

module.exports = {
  SELECTOR,
  HEIGHT_PROPERTY,
  EXTRA_CLASS,
  getReservedHeight,
  BottomActionBar,
};
