/**
 * GSAP Animation Timelines for Page Transitions
 *
 * Ported from Pile theme's AjaxLoading.js — border expand/collapse
 * with centered logo reveal.
 */

const DURATION = 0.6;
const EASING = 'power4.inOut';

/**
 * Get the border overlay element.
 */
function getBorderEl() {
  return document.querySelector( '.js-page-transition-border' );
}

/**
 * Calculate border width needed to fully cover the viewport.
 */
function getFullCoverBorderWidth() {
  return Math.max( window.innerWidth, window.innerHeight ) / 2 + 10;
}

/**
 * Safety: force-clear the overlay if animation gets stuck.
 */
function safetyTimeout( border, resolve, delay = 3000 ) {
  return setTimeout( () => {
    console.warn( '[page-transitions] Animation timed out, force-clearing overlay.' );
    border.style.borderWidth = '0px';
    border.style.opacity = '0';
    border.style.pointerEvents = 'none';
    document.body.classList.remove( 'is-loading' );
    document.body.classList.add( 'has-loaded', 'is-loaded' );
    resolve();
  }, delay );
}

/**
 * Page Leave animation — border expands inward, logo appears.
 */
export function pageLeave() {
  return new Promise( ( resolve ) => {
    const border = getBorderEl();
    if ( ! border ) {
      console.log( '[page-transitions] pageLeave: no border element found' );
      resolve();
      return;
    }

    const gsap = window.gsap;
    if ( ! gsap ) {
      console.log( '[page-transitions] pageLeave: GSAP not available' );
      resolve();
      return;
    }

    border.style.pointerEvents = 'auto';
    const coverWidth = getFullCoverBorderWidth();
    console.log( '[page-transitions] pageLeave: starting, coverWidth=' + coverWidth );

    const timeout = safetyTimeout( border, resolve );

    const tl = gsap.timeline( {
      onComplete: () => {
        clearTimeout( timeout );
        console.log( '[page-transitions] pageLeave: complete' );
        resolve();
      },
    } );

    tl.fromTo( border, {
      borderWidth: 0,
      opacity: 1,
    }, {
      borderWidth: coverWidth,
      duration: DURATION,
      ease: EASING,
    } );

    const mainContent = document.querySelector( '.wp-site-blocks' ) ||
      document.querySelector( 'main' ) ||
      document.querySelector( '.entry-content' );
    if ( mainContent ) {
      tl.to( mainContent, {
        opacity: 0,
        duration: 0.3,
        ease: 'power2.out',
      }, 0 );
    }

    const openMenu = document.querySelector( '.c-navbar.is-open' );
    if ( openMenu ) {
      openMenu.classList.remove( 'is-open' );
      document.body.classList.remove( 'nav-is-open' );
    }
  } );
}

/**
 * Page Enter animation — border collapses outward, content fades in.
 */
export function pageEnter() {
  return new Promise( ( resolve ) => {
    const border = getBorderEl();
    if ( ! border ) {
      console.log( '[page-transitions] pageEnter: no border element found' );
      resolve();
      return;
    }

    const gsap = window.gsap;
    if ( ! gsap ) {
      console.log( '[page-transitions] pageEnter: GSAP not available' );
      resolve();
      return;
    }

    console.log( '[page-transitions] pageEnter: starting' );
    const timeout = safetyTimeout( border, resolve );

    const tl = gsap.timeline( {
      onComplete: () => {
        clearTimeout( timeout );
        border.style.pointerEvents = 'none';
        gsap.set( border, { borderWidth: 0, opacity: 0 } );
        console.log( '[page-transitions] pageEnter: complete' );
        resolve();
      },
    } );

    tl.to( border, {
      borderWidth: 0,
      duration: DURATION,
      ease: EASING,
    } );

    const heroElements = document.querySelectorAll(
      '.novablocks-hero__inner-container > *, ' +
      '.nb-supernova-item__inner-container > *'
    );

    if ( heroElements.length ) {
      tl.fromTo( heroElements, {
        opacity: 0,
        y: 30,
      }, {
        opacity: 1,
        y: 0,
        duration: 0.4,
        stagger: 0.08,
        ease: 'power2.out',
      }, '-=0.4' );
    }

    const heroMedia = document.querySelectorAll(
      '.nb-supernova-item__media-wrapper'
    );

    if ( heroMedia.length ) {
      tl.fromTo( heroMedia, {
        scale: 1.05,
        opacity: 0,
      }, {
        scale: 1,
        opacity: 1,
        duration: 0.4,
        ease: 'power2.out',
      }, '-=0.4' );
    }
  } );
}

/**
 * Initial page load animation — the "opening curtain" from Pile.
 */
export function initialLoadAnimation() {
  return new Promise( ( resolve ) => {
    const border = getBorderEl();
    if ( ! border ) {
      console.log( '[page-transitions] initialLoad: no border element found' );
      resolve();
      return;
    }

    const gsap = window.gsap;
    if ( ! gsap ) {
      console.log( '[page-transitions] initialLoad: GSAP not available, hiding border' );
      border.style.display = 'none';
      resolve();
      return;
    }

    const logoFill = border.querySelector( '.border-logo-fill' );
    const logoBgScale = border.querySelector( '.border-logo-bgscale' );
    const coverWidth = getFullCoverBorderWidth();

    console.log( '[page-transitions] initialLoad: starting, coverWidth=' + coverWidth );
    console.log( '[page-transitions] initialLoad: gsap version=' + gsap.version );
    console.log( '[page-transitions] initialLoad: logoFill=' + !!logoFill + ', logoBgScale=' + !!logoBgScale );

    // Start with border fully covering the viewport.
    gsap.set( border, {
      borderWidth: coverWidth,
      opacity: 1,
    } );

    const timeout = safetyTimeout( border, resolve, 4000 );

    const tl = gsap.timeline( {
      onComplete: () => {
        clearTimeout( timeout );
        border.style.pointerEvents = 'none';
        border.style.borderWidth = '0px';
        border.style.opacity = '0';
        document.body.classList.remove( 'is-loading' );
        document.body.classList.add( 'has-loaded', 'is-loaded' );
        console.log( '[page-transitions] initialLoad: complete' );
        resolve();
      },
    } );

    // 1. Logo fills in from left.
    if ( logoFill ) {
      tl.fromTo( logoFill, {
        x: '-100%',
      }, {
        x: '0%',
        duration: 0.3,
        ease: 'power2.inOut',
      }, 0.2 );
    }

    // 2. Background scales away.
    if ( logoBgScale ) {
      tl.to( logoBgScale, {
        scale: 1.2,
        opacity: 0,
        duration: 0.3,
        ease: 'power2.inOut',
      }, 0.5 );
    }

    // 3. Border collapses.
    tl.to( border, {
      borderWidth: 0,
      duration: DURATION,
      ease: EASING,
    }, 0.5 );

    // 4. Hero content fades in.
    const heroElements = document.querySelectorAll(
      '.novablocks-hero__inner-container > *, ' +
      '.nb-supernova-item__inner-container > *'
    );

    if ( heroElements.length ) {
      tl.fromTo( heroElements, {
        opacity: 0,
        y: 30,
      }, {
        opacity: 1,
        y: 0,
        duration: 0.4,
        stagger: 0.08,
        ease: 'power2.out',
      }, 0.7 );
    }

    const heroMedia = document.querySelectorAll(
      '.nb-supernova-item__media-wrapper'
    );

    if ( heroMedia.length ) {
      tl.fromTo( heroMedia, {
        scale: 1.2,
        opacity: 0,
      }, {
        scale: 1,
        opacity: 1,
        duration: 0.4,
        ease: 'power2.out',
      }, 0.7 );
    }
  } );
}
