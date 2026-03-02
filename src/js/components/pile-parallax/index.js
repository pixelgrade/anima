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

  parallaxElements.forEach( ( el ) => {
    const amount = parseFloat( el.dataset.pileParallaxAmount ) || 0;
    if ( amount <= 0 ) {
      return;
    }

    const is3d = el.classList.contains( 'nb-supernova--pile-3d' );
    const items = el.querySelectorAll( ITEM_SELECTOR );

    if ( ! items.length ) {
      return;
    }

    const itemsData = [];

    items.forEach( ( item ) => {
      // Reset transform before measuring positions.
      item.style.transform = '';

      const has3d = item.classList.contains( 'js-3d' );
      const height = item.offsetHeight;
      const initialTop = height * ( amount / 100 ) / 2;
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

    // Add vertical padding to the grid container to accommodate parallax travel.
    // Like Pile's addMissingPadding() — prevents items from overflowing the section.
    const maxTravel = Math.max( ...itemsData.map( d => d.travel ) );
    const layout = el.querySelector( '.nb-collection__layout' );
    if ( layout ) {
      layout.style.paddingTop = maxTravel + 'px';
      layout.style.paddingBottom = maxTravel + 'px';
    }

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

      const y = travel - ( progress * travel * 2 );
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
  window.addEventListener( 'scroll', onScroll, { passive: true } );
  window.addEventListener( 'resize', () => {
    initialize();
  } );
}

/**
 * Clean up — useful for page transitions.
 */
export function destroy() {
  window.removeEventListener( 'scroll', onScroll );
  blocks = [];
}
