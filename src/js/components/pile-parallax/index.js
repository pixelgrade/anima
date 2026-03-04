/**
 * Pile Parallax — differential parallax scrolling for Nova Blocks collection grids.
 *
 * Ported from Pile theme's ArchiveParallax.js.
 * Uses vanilla JS + requestAnimationFrame — no GSAP dependency.
 *
 * Two independent features:
 *  1. 3D Grid: applies `js-3d` class to alternating items (checkerboard or column
 *     pattern). Items with `js-3d` get extra horizontal padding via CSS, creating
 *     visual depth. When combined with parallax, they also travel 2× further.
 *  2. Parallax Scrolling: on scroll (RAF), maps scroll progress to translateY
 *     from +travel (pushed down) to -travel (pushed up).
 */

const PARALLAX_SELECTOR = '.nb-supernova--pile-parallax';
const GRID_3D_SELECTOR = '.nb-supernova--pile-3d';
const ITEM_SELECTOR = '.nb-collection__layout-item';

let blocks = [];
let ticking = false;
let positiveOffsetFactor = 1;
let isBound = false;
let onResizeHandler = null;
let onPageTransitionCompleteHandler = null;

function getDocumentHeight() {
  const body = document.body;
  const html = document.documentElement;

  return Math.max(
    body ? body.scrollHeight : 0,
    html ? html.scrollHeight : 0
  );
}

/**
 * Add only the missing top/bottom space needed for parallax near viewport edges.
 * Mirrors Pile's ArchiveParallax.addMissingPadding() behavior.
 */
function addMissingPadding( layout, items, parallaxAmount, windowHeight ) {
  if ( ! layout ) {
    return;
  }

  let maxMissingTop = 0;
  let maxMissingBottom = 0;

  // Remove previously applied inline padding before recomputing.
  layout.style.paddingTop = '';
  layout.style.paddingBottom = '';

  const contentTop = 0;
  const contentBottom = getDocumentHeight();

  items.forEach( ( item ) => {
    item.style.transform = '';

    const rect = item.getBoundingClientRect();
    const itemTop = rect.top + window.scrollY;
    const itemHeight = item.offsetHeight;
    const toTop = itemTop + itemHeight / 2 - contentTop;
    const toBottom = contentBottom - itemTop - itemHeight / 2;
    const missingTop = toTop < windowHeight / 2 ? ( windowHeight / 2 - toTop ) : 0;
    const missingBottom = toBottom < windowHeight / 2 ? ( windowHeight / 2 - toBottom ) : 0;
    const paddingLimit = itemHeight * parallaxAmount / 2;

    maxMissingTop = Math.max( Math.min( missingTop, paddingLimit ), maxMissingTop );
    maxMissingBottom = Math.max( Math.min( missingBottom, paddingLimit ), maxMissingBottom );
  } );

  if ( ! maxMissingTop && ! maxMissingBottom ) {
    return;
  }

  const computedStyles = window.getComputedStyle( layout );
  const basePaddingTop = parseFloat( computedStyles.paddingTop ) || 0;
  const basePaddingBottom = parseFloat( computedStyles.paddingBottom ) || 0;

  layout.style.paddingTop = `${ ( basePaddingTop + maxMissingTop ).toFixed( 2 ) }px`;
  layout.style.paddingBottom = `${ ( basePaddingBottom + maxMissingBottom ).toFixed( 2 ) }px`;
}

/**
 * Apply 3D grid classes to items in a collection.
 * Purely visual: adds `js-3d` class for CSS padding + doubles parallax travel.
 */
function apply3dClasses( el ) {
  const target3d = el.dataset.pile3dTarget || 'item';
  const rule3d = el.dataset.pile3dTargetRule || 'odd';
  const columns = parseInt( el.dataset.columns, 10 ) || 3;
  const items = el.querySelectorAll( ITEM_SELECTOR );

  items.forEach( ( item, index ) => {
    const odd = rule3d === 'odd' ? 0 : 1;
    let has3d;

    if ( target3d === 'column' ) {
      has3d = !! ( ( Math.floor( index / columns ) + odd + index ) % 2 );
    } else {
      has3d = !! ( ( Math.floor( index / columns ) + odd + ( index % columns ) ) % 2 );
    }

    item.classList.toggle( 'js-3d', has3d );
  } );
}

/**
 * Initialize parallax for all matching blocks on the page.
 */
export function initialize() {
  blocks = [];

  // 1. Apply 3D classes to all 3D grid blocks (independent of parallax).
  const grid3dElements = document.querySelectorAll( GRID_3D_SELECTOR );
  grid3dElements.forEach( apply3dClasses );

  // 2. Set up parallax scrolling for blocks that have it enabled.
  const parallaxElements = document.querySelectorAll( PARALLAX_SELECTOR );
  const windowHeight = window.innerHeight;
  // Reduce only the positive (downward) phase to avoid oversized blank bands at
  // the top of dense grids, while keeping the negative (upward) phase fully
  // visible so the parallax effect remains obvious during scroll.
  positiveOffsetFactor = 0.35;

  parallaxElements.forEach( ( el ) => {
    const amount = parseFloat( el.dataset.pileParallaxAmount ) || 0;
    const parallaxAmount = amount / 100;
    const layout = el.querySelector( '.nb-collection__layout' );

    if ( amount <= 0 ) {
      if ( layout ) {
        layout.style.paddingTop = '';
        layout.style.paddingBottom = '';
      }
      return;
    }

    const is3d = el.classList.contains( 'nb-supernova--pile-3d' );
    const items = el.querySelectorAll( ITEM_SELECTOR );

    if ( ! items.length ) {
      if ( layout ) {
        layout.style.paddingTop = '';
        layout.style.paddingBottom = '';
      }
      return;
    }

    // Match Pile: compute extra padding before measuring per-item scroll windows.
    addMissingPadding( layout, items, parallaxAmount, windowHeight );

    const itemsData = [];

    items.forEach( ( item ) => {
      // Reset transform before measuring positions.
      item.style.transform = '';

      const has3d = item.classList.contains( 'js-3d' );
      const height = item.offsetHeight;
      const initialTop = height * parallaxAmount / 2;
      const travel = ( is3d && has3d ) ? initialTop * 2 : initialTop;

      // Cache the item's absolute top position for scroll-window calculation.
      const rect = item.getBoundingClientRect();
      const itemTop = rect.top + window.scrollY;

      // Scroll window: item enters viewport at bottom → leaves at top.
      const scrollStart = itemTop - windowHeight;
      const scrollEnd = itemTop + height;

      itemsData.push( {
        el: item,
        travel,
        scrollStart,
        scrollEnd,
      } );
    } );

    blocks.push( {
      el,
      items: itemsData,
    } );
  } );

  if ( blocks.length ) {
    update();
  }
}

/**
 * Update transforms based on current scroll position.
 */
function update() {
  const scrollY = window.scrollY;

  blocks.forEach( ( block ) => {
    block.items.forEach( ( { el, travel, scrollStart, scrollEnd } ) => {
      const scrollRange = scrollEnd - scrollStart;

      if ( scrollRange <= 0 ) {
        return;
      }

      let progress = ( scrollY - scrollStart ) / scrollRange;
      progress = Math.max( 0, Math.min( 1, progress ) );

      const rawOffset = travel - ( progress * travel * 2 );
      const y = rawOffset > 0 ? rawOffset * positiveOffsetFactor : rawOffset;
      el.style.transform = `translateY(${ y.toFixed( 1 ) }px)`;
    } );
  } );
}

/**
 * Scroll handler with requestAnimationFrame throttle.
 */
function onScroll() {
  if ( ! ticking ) {
    ticking = true;
    requestAnimationFrame( () => {
      update();
      ticking = false;
    } );
  }
}

/**
 * Start listening for scroll events.
 */
export function bind() {
  if ( isBound ) {
    return;
  }

  onResizeHandler = () => {
    initialize();
  };
  onPageTransitionCompleteHandler = () => {
    initialize();
    onScroll();
  };

  window.addEventListener( 'scroll', onScroll, { passive: true } );
  window.addEventListener( 'resize', onResizeHandler );
  window.addEventListener( 'anima:page-transition-complete', onPageTransitionCompleteHandler );
  isBound = true;
}

/**
 * Clean up — useful for page transitions.
 */
export function destroy() {
  window.removeEventListener( 'scroll', onScroll );
  if ( onResizeHandler ) {
    window.removeEventListener( 'resize', onResizeHandler );
  }
  if ( onPageTransitionCompleteHandler ) {
    window.removeEventListener( 'anima:page-transition-complete', onPageTransitionCompleteHandler );
  }
  onResizeHandler = null;
  onPageTransitionCompleteHandler = null;
  isBound = false;
  blocks = [];
}
