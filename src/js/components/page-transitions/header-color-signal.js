/**
 * Header color signal guard, as a page-transitions registry integration.
 *
 * Problem: in FSE templates the Nova Blocks header's fallback color detection
 * queries `.site-main .hentry`, which FSE themes do not have, and after an
 * AJAX swap the re-executed header script can freeze the wrong transparent
 * color set. Its `toggleClasses()` then re-applies that set on every sticky
 * threshold crossing.
 *
 * Solution: replicate Nova Blocks' detection on the live incoming container,
 * apply the transparent-state classes to the header rows (exactly where Nova
 * applies them on a hard load; the header element itself keeps its own
 * palette), and guard them with a MutationObserver while the header is not
 * sticky. In sticky mode the guard yields: Nova Blocks restores the rows' own
 * colors there. Solid headers are never transparent, so they get no guard.
 *
 * Lifecycle (owned by the registry, see registry.js):
 *
 *   cleanup( container )  disconnect the observer and drop every reference to
 *                         the outgoing header
 *   reinit( container )   destroy any previous guard, then detect + apply +
 *                         observe on the incoming header
 *
 * The guard installs in `reinit`, i.e. AFTER the Nova Blocks scripts have
 * re-executed, never before: Nova's header captures each row's current
 * classes as its sticky-state colors when it is constructed, so painting the
 * rows earlier would freeze the hero colors into the sticky state. The page
 * is still under the transition overlay at that point, so nothing flickers.
 *
 * At most one observer is alive at any time, and it never outlives its header.
 *
 * Replica of: nova-blocks/packages/block-library/src/blocks/header/frontend/
 * components/index.js (getAdjacentElement, findProperElement,
 * findColorsElement) and header/utils.js (getColorSetClasses).
 * Scheduled for removal once Nova Blocks' header exposes `refresh(container)`
 * (anima#530, H2 upstream step).
 */

const ID = 'anima/header-color-signal';

// Color-related classes, as Nova Blocks' header toggleClasses() manages them.
const COLOR_CLASS_PATTERN = /^(sm-palette-|sm-variation-|sm-color-signal-|sm-light|sm-dark)/;

// `nb-header--sticky` is what Nova Blocks toggles; `is-sticky` is the legacy name.
const STICKY_CLASSES = [ 'nb-header--sticky', 'is-sticky' ];

// ---------------------------------------------------------------------------
// Nova Blocks header detection (replica).
// ---------------------------------------------------------------------------

function getAdjacentElement( element ) {
  const skip = '.c-menu-toggle, .c-menu-toggle__checkbox, script, style';
  const next = element.nextElementSibling;

  if ( ! next ) {
    return element.parentElement ? getAdjacentElement( element.parentElement ) : null;
  }

  if ( next.matches( skip ) ) {
    return getAdjacentElement( next );
  }

  return next;
}

function findProperElement( element, previous ) {
  if ( ! element ) {
    return previous || null;
  }

  const dataset = element.dataset || {};
  const variation = dataset.paletteVariation ? parseInt( dataset.paletteVariation, 10 ) : 1;
  const isShifted = !! dataset.useSourceColorAsReference;
  const hasSignal = variation !== 1 || isShifted;

  // Container blocks without their own color signal: recurse into first child.
  if ( element.matches( 'main, .wp-block-group.alignfull, .wp-block-query, .wp-block-post-content' ) && ! hasSignal ) {
    return findProperElement( element.firstElementChild, element );
  }

  // Sidecar layout: recurse into the content area's first child.
  if ( element.classList.contains( 'nb-sidecar' ) &&
    element.children.length === 1 &&
    element.firstElementChild.classList.contains( 'nb-sidecar-area--content' ) ) {
    const child = element.firstElementChild.firstElementChild;
    if ( child ) {
      return findProperElement( child, element );
    }
  }

  // Non-fullwidth block with color signal: use the parent container instead.
  if ( ! element.matches( '.alignfull' ) && hasSignal && previous ) {
    return previous;
  }

  if ( element.matches( '[class*="sm-palette-"]' ) ) {
    return element;
  }

  return element.closest( '[class*="sm-palette-"]' ) || null;
}

function findColorsElement( element, win ) {
  if ( ! element ) {
    return null;
  }

  // Nested sidecar: recurse into the content area.
  if ( element.classList.contains( 'nb-sidecar' ) ) {
    const content = Array.from( element.children )
      .find( ( child ) => child.classList.contains( 'nb-sidecar-area--content' ) );
    if ( content && content.firstElementChild &&
      content.firstElementChild.classList.contains( 'nb-sidecar' ) ) {
      return findColorsElement( content.firstElementChild, win );
    }
  }

  // Supernova with 0 padding: use the first item.
  if ( element.classList.contains( 'nb-supernova' ) && win && typeof win.getComputedStyle === 'function' ) {
    const paddingTop = parseInt( win.getComputedStyle( element ).paddingTop, 10 );
    if ( paddingTop === 0 ) {
      return element.querySelector( '.nb-supernova-item' ) || element;
    }
  }

  return element;
}

function getColorSetClasses( element ) {
  const classAttr = element && element.getAttribute( 'class' );
  if ( ! classAttr ) {
    return [];
  }

  return classAttr.split( /\s+/ ).filter( ( cls ) => COLOR_CLASS_PATTERN.test( cls ) );
}

/**
 * Detect the header's transparent-state color classes for a header element.
 *
 * @return {string[]} Classes, or an empty array when nothing usable is found.
 */
function detectTransparentClasses( header, win ) {
  const adjacent = getAdjacentElement( header );
  const properElement = adjacent ? findProperElement( adjacent ) : null;
  const colorsElement = properElement ? findColorsElement( properElement, win ) : null;

  if ( ! colorsElement ) {
    return [];
  }

  return getColorSetClasses( colorsElement ).filter( ( cls ) => cls !== 'sm-color-signal-0' );
}

// ---------------------------------------------------------------------------
// Class helpers.
// ---------------------------------------------------------------------------

function hasExactColorClasses( element, classes ) {
  const current = getColorSetClasses( element );
  return current.length === classes.length && classes.every( ( cls ) => current.includes( cls ) );
}

function replaceColorClasses( element, classes ) {
  getColorSetClasses( element ).forEach( ( cls ) => element.classList.remove( cls ) );
  classes.forEach( ( cls ) => element.classList.add( cls ) );
}

function isSticky( header ) {
  return STICKY_CLASSES.some( ( cls ) => header.classList.contains( cls ) );
}

// ---------------------------------------------------------------------------
// Lifecycle.
// ---------------------------------------------------------------------------

/**
 * Create the header color signal integration.
 *
 * @param {Object}   [deps]
 * @param {Function} [deps.getWindow] Returns the window to use (tests inject one).
 * @return {Object} A page-transitions registry entry plus `getState()`/`destroy()`.
 */
function createHeaderColorSignal( { getWindow = () => window } = {} ) {
  // { header, rows, transparentClasses, observer, applying }
  let current = null;

  function destroy() {
    if ( current && current.observer ) {
      current.observer.disconnect();
    }
    current = null;
  }

  function enforce( state ) {
    // Sticky mode: the rows show their own palette, managed by Nova Blocks.
    if ( isSticky( state.header ) ) {
      return;
    }

    state.applying = true;
    state.rows.forEach( ( row ) => {
      if ( ! hasExactColorClasses( row, state.transparentClasses ) ) {
        replaceColorClasses( row, state.transparentClasses );
      }
    } );
    state.applying = false;
  }

  function observe( state, win ) {
    const Observer = win && win.MutationObserver;
    if ( typeof Observer !== 'function' ) {
      return;
    }

    state.observer = new Observer( () => {
      // Our own writes, or a guard that has already been torn down.
      if ( state.applying || current !== state ) {
        return;
      }
      enforce( state );
    } );

    const options = { attributes: true, attributeFilter: [ 'class' ] };
    state.observer.observe( state.header, options );
    state.rows.forEach( ( row ) => state.observer.observe( row, options ) );
  }

  function findHeader( container, win ) {
    const scope = container && typeof container.querySelector === 'function'
      ? container
      : win && win.document;
    return scope ? scope.querySelector( '.nb-header--main' ) : null;
  }

  function init( container ) {
    destroy();

    const win = getWindow();
    const header = findHeader( container, win );

    // Solid headers never take the neighbour's colors (Nova Blocks'
    // `allowsTransparency`), so there is nothing to guard.
    if ( ! header || ( header.dataset && header.dataset.backgroundMode === 'solid' ) ) {
      return;
    }

    const transparentClasses = detectTransparentClasses( header, win );
    if ( ! transparentClasses.length ) {
      return;
    }

    const rows = Array.from( header.querySelectorAll( '.nb-header-row' ) );
    if ( ! rows.length ) {
      return;
    }

    const state = {
      header,
      rows,
      transparentClasses,
      observer: null,
      applying: false,
    };

    current = state;
    enforce( state );
    observe( state, win );
  }

  return {
    id: ID,
    cleanup() {
      destroy();
    },
    reinit( container ) {
      init( container );
    },
    destroy,
    getState() {
      return current
        ? {
          header: current.header,
          transparentClasses: current.transparentClasses.slice(),
          observing: !! current.observer,
        }
        : null;
    },
  };
}

module.exports = {
  ID,
  createHeaderColorSignal,
  detectTransparentClasses,
  getColorSetClasses,
};
