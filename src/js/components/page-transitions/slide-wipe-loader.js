import $ from 'jquery';

/**
 * Slide Wipe Loader — ported from Fargo theme's loader.js.
 *
 * Uses Snap.svg for SVG pattern fills and GSAP 3 for slide animations.
 * The loader slides in from the left while its inner mask slides from the right,
 * creating a parallax wipe effect. A large SVG letter displays centered with
 * cycling image pattern fills.
 */

const LOADER_DURATION = 1; // seconds
const PATTERN_INTERVAL = 300; // ms between image pattern swaps
const MIN_DISPLAY_TIME = 900; // ms — minimum time the loader stays visible on initial load
const MAX_DISPLAY_TIME = 5000; // ms — safety cap so the loader never gets stuck

let $loader = null;
let $loaderMask = null;
let $svg = null;
let snap = null;
let patterns = [];
let isVisible = false;
let locked = false;
let svgWidth = 0;
let svgHeight = 0;
let animationFrameId = null;

/**
 * Initialize the Slide Wipe loader.
 * Must be called after DOM ready and after Snap is available globally.
 */
export function init() {
  $loader = $( '.js-slide-wipe-loader' );
  $loaderMask = $loader.find( '.c-loader__mask' );
  $svg = $loader.find( 'svg' );

  if ( ! $loader.length || ! $svg.length ) {
    return;
  }

  // Snap.svg is loaded globally via CDN.
  if ( typeof Snap === 'undefined' ) {
    return;
  }

  snap = new Snap( $svg[ 0 ] );

  // The loader is visually covering the page from initial render (CSS).
  // Mark as visible so pattern cycling starts immediately.
  isVisible = true;

  // Remove any existing fill attributes so patterns apply cleanly.
  $svg.find( '[fill]' ).removeAttr( 'fill' );

  fitText();
  getSize();

  // Generate Snap.svg image patterns from random post images.
  const imageSrcs = ( typeof animaPageTransitions !== 'undefined' && animaPageTransitions.loaderRandomImages )
    ? animaPageTransitions.loaderRandomImages
    : [];

  if ( imageSrcs.length ) {
    patterns = generatePatterns( imageSrcs );
  }

  // Start the pattern cycling animation loop.
  startPatternAnimation();
}

/**
 * Initialize only the Slide Wipe overlay (no cycling images).
 * Used when the overlay is Slide Wipe but loading content is Progress Bar.
 */
export function initOverlayOnly() {
  $loader = $( '.js-slide-wipe-loader' );
  $loaderMask = $loader.find( '.c-loader__mask' );

  if ( ! $loader.length ) {
    return;
  }

  isVisible = true;
}

/**
 * Initialize cycling images content inside any container.
 * Used when logo_loading_style is 'cycling_images' but the overlay
 * is not necessarily the Slide Wipe loader (e.g., Border Iris overlay).
 *
 * @param {jQuery} $container - The container element that holds the SVG.
 */
export function initCyclingImagesContent( $container ) {
  if ( ! $container || ! $container.length ) {
    return;
  }

  const $svgEl = $container.find( 'svg' );
  if ( ! $svgEl.length ) {
    return;
  }

  if ( typeof Snap === 'undefined' ) {
    return;
  }

  snap = new Snap( $svgEl[ 0 ] );
  $svg = $svgEl;
  isVisible = true;

  $svgEl.find( '[fill]' ).removeAttr( 'fill' );

  fitText();
  getSize();

  const imageSrcs = ( typeof animaPageTransitions !== 'undefined' && animaPageTransitions.loaderRandomImages )
    ? animaPageTransitions.loaderRandomImages
    : [];

  if ( imageSrcs.length ) {
    patterns = generatePatterns( imageSrcs );
  }

  startPatternAnimation();
}

/**
 * Stop cycling images and mark as not visible.
 */
export function stopCyclingImages() {
  isVisible = false;
}

/**
 * Fit the SVG viewBox to the text bounding box.
 * Ported from Fargo's Loader.fitText().
 */
function fitText() {
  const textEl = document.getElementById( 'letter' );
  if ( ! textEl ) {
    return;
  }

  const box = textEl.getBBox();

  $svg.attr( {
    width: box.width,
    height: box.height,
    viewBox: '0 0 ' + box.width + ' ' + box.height,
  } );
}

/**
 * Cache the SVG dimensions.
 */
function getSize() {
  svgWidth = $svg.width();
  svgHeight = $svg.height();
}

/**
 * Generate Snap.svg image patterns from an array of image URLs.
 * Each pattern is scaled to cover the SVG text area.
 * Ported from Fargo's Loader.generatePatterns().
 *
 * @param {string[]} paths - Array of image URLs.
 * @return {Object[]} Array of Snap pattern elements.
 */
function generatePatterns( paths ) {
  const result = [];

  paths.forEach( ( path ) => {
    const box = getPatternSize( 150, 150 );
    const img = snap.image(
      path,
      ( svgWidth - box.width ) / 2,
      ( svgHeight - box.height ) / 2,
      box.width,
      box.height
    );
    const pattern = img.toPattern();

    pattern.attr( {
      width: box.width,
      height: box.height,
      viewBox: '0 0 ' + box.width + ' ' + box.height,
    } );

    result.push( pattern );
  } );

  return result;
}

/**
 * Calculate pattern size that covers the SVG text area.
 * Ported from Fargo's Loader.getPatternSize().
 */
function getPatternSize( width, height ) {
  width = width || 150;
  height = height || 150;

  const scale = Math.max( svgWidth / width, svgHeight / height );

  return {
    width: width * scale,
    height: height * scale,
  };
}

/**
 * Start the pattern cycling animation.
 * Cycles through image patterns at PATTERN_INTERVAL ms.
 * Ported from Fargo's Loader.animate().
 */
function startPatternAnimation() {
  let index = 0;
  let then = Date.now();

  function animate() {
    if ( isVisible && patterns.length ) {
      const now = Date.now();
      const elapsed = now - then;

      if ( elapsed > PATTERN_INTERVAL ) {
        then = now - ( elapsed % PATTERN_INTERVAL );
        index = ( index + 1 ) % patterns.length;

        if ( isVisible && snap ) {
          snap.attr( 'fill', patterns[ index ] );
        }
      }
    }

    animationFrameId = requestAnimationFrame( animate );
  }

  animate();
}

/**
 * Wait for the page to fully load, then hide the loader.
 * Used on initial page visit so the user sees the cycling image patterns
 * while resources load underneath.
 *
 * - Waits for `window.load` (all images, fonts, etc.)
 * - Enforces MIN_DISPLAY_TIME so even on fast connections the patterns show
 * - Caps at MAX_DISPLAY_TIME so the loader never gets stuck
 *
 * @return {Promise} Resolves when the hide animation completes.
 */
export function waitForLoadAndHide() {
  const initTime = Date.now();

  const windowLoaded = new Promise( ( resolve ) => {
    if ( document.readyState === 'complete' ) {
      resolve();
    } else {
      window.addEventListener( 'load', resolve, { once: true } );
    }
  } );

  const minTimer = new Promise( ( resolve ) => {
    setTimeout( resolve, MIN_DISPLAY_TIME );
  } );

  const maxTimer = new Promise( ( resolve ) => {
    setTimeout( resolve, MAX_DISPLAY_TIME );
  } );

  // Hide when: (window loaded AND minimum time elapsed) OR max time reached.
  return Promise.race( [
    Promise.all( [ windowLoaded, minTimer ] ),
    maxTimer,
  ] ).then( () => {
    return hide();
  } );
}

/**
 * Wait for the page to fully load, then call a callback.
 * Like waitForLoadAndHide() but lets the caller control the dismiss animation.
 * Used for Border Iris + Cycling Images combo where the border collapse
 * is different from the slide wipe dismiss.
 *
 * @param {Function} callback - Called when ready to dismiss.
 * @param {number} [customMinTime] - Override minimum display time in ms.
 * @return {Promise}
 */
export function waitForLoadThen( callback, customMinTime ) {
  const minTime = ( typeof customMinTime === 'number' ) ? customMinTime : MIN_DISPLAY_TIME;

  const windowLoaded = new Promise( ( resolve ) => {
    if ( document.readyState === 'complete' ) {
      resolve();
    } else {
      window.addEventListener( 'load', resolve, { once: true } );
    }
  } );

  const minTimer = new Promise( ( resolve ) => {
    setTimeout( resolve, minTime );
  } );

  const maxTimer = new Promise( ( resolve ) => {
    setTimeout( resolve, MAX_DISPLAY_TIME );
  } );

  return Promise.race( [
    Promise.all( [ windowLoaded, minTimer ] ),
    maxTimer,
  ] ).then( () => {
    if ( callback ) {
      callback();
    }
  } );
}

/**
 * Show the loader — slides in from left.
 * .c-loader slides from x:-100% to x:0%.
 * .c-loader__mask slides from x:100% to x:0% simultaneously.
 * Easing: quint.inOut (1 second).
 *
 * @return {Promise} Resolves when the slide-in animation completes.
 */
export function show() {
  if ( locked || ! $loader || ! $loader.length ) {
    return Promise.resolve();
  }

  isVisible = true;

  return new Promise( ( resolve ) => {
    gsap.fromTo( $loader[ 0 ], { x: '-100%' }, {
      x: '0%',
      duration: LOADER_DURATION,
      ease: 'quint.inOut',
      onComplete: resolve,
    } );
    gsap.fromTo( $loaderMask[ 0 ], { x: '100%' }, {
      x: '0%',
      duration: LOADER_DURATION,
      ease: 'quint.inOut',
    } );
  } );
}

/**
 * Hide the loader — slides out to right.
 * .c-loader slides from x:0% to x:100%.
 * .c-loader__mask slides from x:0% to x:-100% simultaneously.
 * Easing: quint.inOut (1 second).
 *
 * @return {Promise} Resolves when the slide-out animation completes.
 */
export function hide() {
  if ( locked ) {
    window.location.reload( true );
    return Promise.resolve();
  }

  if ( ! $loader || ! $loader.length ) {
    return Promise.resolve();
  }

  return new Promise( ( resolve ) => {
    const timeline = gsap.timeline( {
      paused: true,
      onComplete: () => {
        isVisible = false;
        resolve();
      },
    } );

    timeline.to( $loader[ 0 ], {
      x: '100%',
      duration: LOADER_DURATION,
      ease: 'quint.inOut',
    } );
    timeline.to( $loaderMask[ 0 ], {
      x: '-100%',
      duration: LOADER_DURATION,
      ease: 'quint.inOut',
    }, 0 ); // start at same time

    timeline.play();
  } );
}

/**
 * Lock the loader — forces a full page reload on next hide().
 * Used when scripts detect an unrecoverable state.
 */
export function lock() {
  locked = true;
}

/**
 * Check if the loader is currently visible.
 */
export function getIsVisible() {
  return isVisible;
}
