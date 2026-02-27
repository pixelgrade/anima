/******/ (() => { // webpackBootstrap
/******/ 	"use strict";

;// ./src/js/components/page-transitions/transitions.js
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
  return document.querySelector('.js-page-transition-border');
}

/**
 * Calculate border width needed to fully cover the viewport.
 */
function getFullCoverBorderWidth() {
  return Math.max(window.innerWidth, window.innerHeight) / 2 + 10;
}

/**
 * Safety: force-clear the overlay if animation gets stuck.
 */
function safetyTimeout(border, resolve, delay = 3000) {
  return setTimeout(() => {
    console.warn('[page-transitions] Animation timed out, force-clearing overlay.');
    border.style.borderWidth = '0px';
    border.style.opacity = '0';
    border.style.pointerEvents = 'none';
    document.body.classList.remove('is-loading');
    document.body.classList.add('has-loaded', 'is-loaded');
    resolve();
  }, delay);
}

/**
 * Page Leave animation — border expands inward, logo appears.
 */
function pageLeave() {
  return new Promise(resolve => {
    const border = getBorderEl();
    if (!border) {
      console.log('[page-transitions] pageLeave: no border element found');
      resolve();
      return;
    }
    const gsap = window.gsap;
    if (!gsap) {
      console.log('[page-transitions] pageLeave: GSAP not available');
      resolve();
      return;
    }
    border.style.pointerEvents = 'auto';
    const coverWidth = getFullCoverBorderWidth();
    console.log('[page-transitions] pageLeave: starting, coverWidth=' + coverWidth);
    const timeout = safetyTimeout(border, resolve);
    const tl = gsap.timeline({
      onComplete: () => {
        clearTimeout(timeout);
        console.log('[page-transitions] pageLeave: complete');
        resolve();
      }
    });
    tl.fromTo(border, {
      borderWidth: 0,
      opacity: 1
    }, {
      borderWidth: coverWidth,
      duration: DURATION,
      ease: EASING
    });
    const mainContent = document.querySelector('.wp-site-blocks') || document.querySelector('main') || document.querySelector('.entry-content');
    if (mainContent) {
      tl.to(mainContent, {
        opacity: 0,
        duration: 0.3,
        ease: 'power2.out'
      }, 0);
    }
    const openMenu = document.querySelector('.c-navbar.is-open');
    if (openMenu) {
      openMenu.classList.remove('is-open');
      document.body.classList.remove('nav-is-open');
    }
  });
}

/**
 * Page Enter animation — border collapses outward, content fades in.
 */
function pageEnter() {
  return new Promise(resolve => {
    const border = getBorderEl();
    if (!border) {
      console.log('[page-transitions] pageEnter: no border element found');
      resolve();
      return;
    }
    const gsap = window.gsap;
    if (!gsap) {
      console.log('[page-transitions] pageEnter: GSAP not available');
      resolve();
      return;
    }
    console.log('[page-transitions] pageEnter: starting');
    const timeout = safetyTimeout(border, resolve);
    const tl = gsap.timeline({
      onComplete: () => {
        clearTimeout(timeout);
        border.style.pointerEvents = 'none';
        gsap.set(border, {
          borderWidth: 0,
          opacity: 0
        });
        console.log('[page-transitions] pageEnter: complete');
        resolve();
      }
    });
    tl.to(border, {
      borderWidth: 0,
      duration: DURATION,
      ease: EASING
    });
    const heroElements = document.querySelectorAll('.novablocks-hero__inner-container > *, ' + '.nb-supernova-item__inner-container > *');
    if (heroElements.length) {
      tl.fromTo(heroElements, {
        opacity: 0,
        y: 30
      }, {
        opacity: 1,
        y: 0,
        duration: 0.4,
        stagger: 0.08,
        ease: 'power2.out'
      }, '-=0.4');
    }
    const heroMedia = document.querySelectorAll('.nb-supernova-item__media-wrapper');
    if (heroMedia.length) {
      tl.fromTo(heroMedia, {
        scale: 1.05,
        opacity: 0
      }, {
        scale: 1,
        opacity: 1,
        duration: 0.4,
        ease: 'power2.out'
      }, '-=0.4');
    }
  });
}

/**
 * Initial page load animation — the "opening curtain" from Pile.
 */
function initialLoadAnimation() {
  return new Promise(resolve => {
    const border = getBorderEl();
    if (!border) {
      console.log('[page-transitions] initialLoad: no border element found');
      resolve();
      return;
    }
    const gsap = window.gsap;
    if (!gsap) {
      console.log('[page-transitions] initialLoad: GSAP not available, hiding border');
      border.style.display = 'none';
      resolve();
      return;
    }
    const logoFill = border.querySelector('.border-logo-fill');
    const logoBgScale = border.querySelector('.border-logo-bgscale');
    const coverWidth = getFullCoverBorderWidth();
    console.log('[page-transitions] initialLoad: starting, coverWidth=' + coverWidth);
    console.log('[page-transitions] initialLoad: gsap version=' + gsap.version);
    console.log('[page-transitions] initialLoad: logoFill=' + !!logoFill + ', logoBgScale=' + !!logoBgScale);

    // Start with border fully covering the viewport.
    gsap.set(border, {
      borderWidth: coverWidth,
      opacity: 1
    });
    const timeout = safetyTimeout(border, resolve, 4000);
    const tl = gsap.timeline({
      onComplete: () => {
        clearTimeout(timeout);
        border.style.pointerEvents = 'none';
        border.style.borderWidth = '0px';
        border.style.opacity = '0';
        document.body.classList.remove('is-loading');
        document.body.classList.add('has-loaded', 'is-loaded');
        console.log('[page-transitions] initialLoad: complete');
        resolve();
      }
    });

    // 1. Logo fills in from left.
    if (logoFill) {
      tl.fromTo(logoFill, {
        x: '-100%'
      }, {
        x: '0%',
        duration: 0.3,
        ease: 'power2.inOut'
      }, 0.2);
    }

    // 2. Background scales away.
    if (logoBgScale) {
      tl.to(logoBgScale, {
        scale: 1.2,
        opacity: 0,
        duration: 0.3,
        ease: 'power2.inOut'
      }, 0.5);
    }

    // 3. Border collapses.
    tl.to(border, {
      borderWidth: 0,
      duration: DURATION,
      ease: EASING
    }, 0.5);

    // 4. Hero content fades in.
    const heroElements = document.querySelectorAll('.novablocks-hero__inner-container > *, ' + '.nb-supernova-item__inner-container > *');
    if (heroElements.length) {
      tl.fromTo(heroElements, {
        opacity: 0,
        y: 30
      }, {
        opacity: 1,
        y: 0,
        duration: 0.4,
        stagger: 0.08,
        ease: 'power2.out'
      }, 0.7);
    }
    const heroMedia = document.querySelectorAll('.nb-supernova-item__media-wrapper');
    if (heroMedia.length) {
      tl.fromTo(heroMedia, {
        scale: 1.2,
        opacity: 0
      }, {
        scale: 1,
        opacity: 1,
        duration: 0.4,
        ease: 'power2.out'
      }, 0.7);
    }
  });
}
;// ./src/js/components/page-transitions/utils.js
/**
 * Utility functions for page transitions.
 */

/**
 * Sync body classes from a new page's HTML string.
 * Preserves JS-only classes that shouldn't be lost.
 */
function syncBodyClasses(newDocument) {
  const preserveClasses = ['has-page-transitions', 'is-loaded', 'has-loaded', 'admin-bar'];
  const newBody = newDocument.querySelector('body');
  if (!newBody) {
    return;
  }
  const preserved = preserveClasses.filter(cls => document.body.classList.contains(cls));
  document.body.className = newBody.className;
  preserved.forEach(cls => {
    document.body.classList.add(cls);
  });
}

/**
 * Update the document title from the new page.
 */
function syncDocumentTitle(newDocument) {
  const newTitle = newDocument.querySelector('title');
  if (newTitle) {
    document.title = newTitle.textContent;
  }
}

/**
 * Update admin bar edit/customize links for the new page.
 */
function syncAdminBar(newDocument) {
  const adminBar = document.getElementById('wpadminbar');
  if (!adminBar) {
    return;
  }
  const newAdminBar = newDocument.getElementById('wpadminbar');
  if (newAdminBar) {
    adminBar.innerHTML = newAdminBar.innerHTML;
  }
}

/**
 * Re-initialize Anima theme components after DOM swap.
 */
function reinitComponents() {
  // Trigger hero re-initialization.
  window.dispatchEvent(new Event('resize'));
  window.dispatchEvent(new Event('scroll'));

  // Re-trigger image lazy loading.
  if (typeof jQuery !== 'undefined') {
    jQuery(document.body).trigger('post-load');
  }

  // Re-init WooCommerce cart fragments.
  if (typeof jQuery !== 'undefined' && jQuery.fn.wc_cart_fragments) {
    jQuery(document.body).trigger('wc_fragment_refresh');
  }
}

/**
 * Push a pageview event for analytics.
 */
function trackPageview(url) {
  // Google Analytics 4 / gtag.
  if (typeof gtag === 'function') {
    gtag('event', 'page_view', {
      page_location: url
    });
  }

  // Google Tag Manager.
  if (typeof dataLayer !== 'undefined' && Array.isArray(dataLayer)) {
    dataLayer.push({
      event: 'pageview',
      page: url
    });
  }

  // Legacy Universal Analytics.
  if (typeof ga === 'function') {
    ga('send', 'pageview', url);
  }
}

/**
 * Determine if a URL should be excluded from page transitions.
 */
function shouldExcludeUrl(url, config) {
  const urlObj = new URL(url, window.location.origin);

  // Different origin.
  if (urlObj.origin !== window.location.origin) {
    return true;
  }

  // Hash-only navigation.
  if (urlObj.pathname === window.location.pathname && urlObj.hash) {
    return true;
  }

  // File downloads.
  const fileExtensions = /\.(pdf|doc|docx|zip|rar|jpg|jpeg|png|gif|eps|svg|mp3|mp4|avi)$/i;
  if (fileExtensions.test(urlObj.pathname)) {
    return true;
  }

  // WordPress admin/login.
  if (/wp-(admin|login|content|includes)/.test(urlObj.pathname)) {
    return true;
  }

  // WooCommerce transactional pages.
  const excludedPaths = config.excludedUrls || [];
  for (const excluded of excludedPaths) {
    if (urlObj.pathname.includes(excluded)) {
      return true;
    }
  }

  // Cart actions via query params.
  if (urlObj.search.includes('add-to-cart') || urlObj.search.includes('remove_item')) {
    return true;
  }

  // Feed URLs.
  if (/\/feed\/?$/i.test(urlObj.pathname)) {
    return true;
  }
  return false;
}

/**
 * Sync <head> assets (styles and scripts) from the new page.
 * Loads any new stylesheets/scripts that weren't on the current page.
 */
function syncHeadAssets(newDocument) {
  const currentHead = document.head;
  const newHead = newDocument.head;
  if (!newHead) {
    return Promise.resolve();
  }
  const promises = [];

  // Sync stylesheets.
  const newStyles = newHead.querySelectorAll('link[rel="stylesheet"], style');
  newStyles.forEach(newStyle => {
    const id = newStyle.id;
    if (id && !currentHead.querySelector(`#${id}`)) {
      const clone = newStyle.cloneNode(true);
      if (clone.tagName === 'LINK') {
        promises.push(new Promise(resolve => {
          clone.onload = resolve;
          clone.onerror = resolve;
        }));
      }
      currentHead.appendChild(clone);
    }
  });

  // Sync inline styles (WordPress per-page custom properties).
  const newInlineStyles = newHead.querySelectorAll('style[id]');
  newInlineStyles.forEach(newInline => {
    const existing = currentHead.querySelector(`#${newInline.id}`);
    if (existing) {
      existing.textContent = newInline.textContent;
    }
  });
  return promises.length ? Promise.all(promises) : Promise.resolve();
}
;// ./src/js/components/page-transitions/index.js
/**
 * Page Transitions — View Transitions API + Navigation API + GSAP
 *
 * Uses the Navigation API to intercept same-origin link clicks,
 * then document.startViewTransition() to orchestrate the transition
 * with GSAP-powered border expand/collapse animations.
 *
 * Graceful degradation:
 * - No Navigation API → falls back to click event interception
 * - No View Transitions API → falls back to direct GSAP animations
 * - No GSAP → instant page swap (still AJAX, no animation)
 * - No JS → normal page loads (links work as usual)
 */



let isTransitioning = false;
let config = {};

/**
 * Parse an HTML string into a Document.
 */
function parseHTML(html) {
  return new DOMParser().parseFromString(html, 'text/html');
}

/**
 * Get the main content container to swap.
 */
function getContentContainer() {
  return document.querySelector('.wp-site-blocks') || document.querySelector('main') || document.querySelector('.site-content');
}

/**
 * Perform the actual content swap and all DOM updates.
 */
function performSwap(newDocument) {
  const currentContainer = getContentContainer();
  const newContainer = newDocument.querySelector('.wp-site-blocks') || newDocument.querySelector('main') || newDocument.querySelector('.site-content');
  if (currentContainer && newContainer) {
    currentContainer.innerHTML = newContainer.innerHTML;
  }
  syncBodyClasses(newDocument);
  syncDocumentTitle(newDocument);
  syncAdminBar(newDocument);
  syncHeadAssets(newDocument);

  // Scroll to top.
  window.scrollTo(0, 0);
}

/**
 * Handle the full transition lifecycle for a navigation.
 */
async function handleTransition(url, signal) {
  if (isTransitioning) {
    return;
  }
  isTransitioning = true;
  try {
    // Start fetching the new page immediately.
    const fetchPromise = fetch(url, {
      signal,
      credentials: 'same-origin',
      headers: {
        'X-Requested-With': 'XMLHttpRequest'
      }
    });

    // Run page leave animation (border expands inward).
    await pageLeave();

    // Wait for fetch to complete.
    const response = await fetchPromise;
    if (!response.ok) {
      // Fallback: navigate normally on fetch error.
      window.location.href = url;
      return;
    }
    const html = await response.text();
    const newDocument = parseHTML(html);

    // Use View Transitions API if available for the DOM swap.
    if (document.startViewTransition) {
      const transition = document.startViewTransition(() => {
        performSwap(newDocument);
      });

      // Wait for the DOM update to be ready.
      await transition.updateCallbackDone;
    } else {
      // No View Transitions API — swap directly.
      performSwap(newDocument);
    }

    // Run page enter animation (border collapses outward).
    await pageEnter();

    // Post-transition tasks.
    reinitComponents();
    trackPageview(url);
  } catch (error) {
    // AbortError means the user navigated away — don't fallback.
    if (error.name === 'AbortError') {
      return;
    }

    // Any other error: fallback to normal navigation.
    console.error('Page transition failed:', error);
    window.location.href = url;
  } finally {
    isTransitioning = false;
  }
}

/**
 * Initialize using the Navigation API (preferred).
 * This gives us proper history management, abort signals, and
 * handles both link clicks and back/forward navigation.
 */
function initWithNavigationAPI() {
  if (typeof navigation === 'undefined') {
    return false;
  }
  navigation.addEventListener('navigate', event => {
    // Skip non-interceptable navigations.
    if (!event.canIntercept || event.hashChange || event.downloadRequest || event.formData) {
      return;
    }
    const url = new URL(event.destination.url);

    // Only handle same-origin navigations.
    if (url.origin !== location.origin) {
      return;
    }

    // Check exclusions.
    if (shouldExcludeUrl(event.destination.url, config)) {
      return;
    }

    // Skip if the link had target="_blank".
    if (event.navigationType === 'push' || event.navigationType === 'replace') {
      event.intercept({
        async handler() {
          await handleTransition(event.destination.url, event.signal);
        }
      });
    }

    // For traverse (back/forward), also animate.
    if (event.navigationType === 'traverse') {
      event.intercept({
        async handler() {
          await handleTransition(event.destination.url, event.signal);
        }
      });
    }
  });
  return true;
}

/**
 * Fallback: intercept clicks on <a> elements.
 * Used when the Navigation API is not available (Firefox).
 */
function initWithClickInterception() {
  document.addEventListener('click', event => {
    // Find the closest <a> element.
    const link = event.target.closest('a[href]');
    if (!link) {
      return;
    }

    // Skip modified clicks (new tab, etc).
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
      return;
    }

    // Skip target="_blank".
    if (link.target === '_blank') {
      return;
    }
    const url = link.href;

    // Check exclusions.
    if (shouldExcludeUrl(url, config)) {
      return;
    }
    event.preventDefault();

    // Create an AbortController for this navigation.
    const controller = new AbortController();

    // Push history state.
    window.history.pushState({}, '', url);
    handleTransition(url, controller.signal);
  });

  // Handle back/forward navigation.
  window.addEventListener('popstate', () => {
    const controller = new AbortController();
    handleTransition(window.location.href, controller.signal);
  });
}

/**
 * Prefetch links on hover for faster transitions.
 */
function initPrefetch() {
  const prefetched = new Set();
  document.addEventListener('pointerenter', event => {
    const link = event.target.closest('a[href]');
    if (!link || link.target === '_blank') {
      return;
    }
    const url = link.href;
    if (prefetched.has(url) || shouldExcludeUrl(url, config)) {
      return;
    }
    prefetched.add(url);

    // Use <link rel="prefetch"> for browser-native prefetching.
    const prefetchLink = document.createElement('link');
    prefetchLink.rel = 'prefetch';
    prefetchLink.href = url;
    prefetchLink.as = 'document';
    document.head.appendChild(prefetchLink);
  }, {
    passive: true
  });
}

/**
 * Main initialization.
 */
function init(userConfig = {}) {
  config = userConfig;

  // Don't initialize in Customizer preview.
  if (document.body.classList.contains('is--customizer-preview')) {
    return;
  }

  // Add feature class.
  document.body.classList.add('has-page-transitions');

  // Try Navigation API first, fall back to click interception.
  if (!initWithNavigationAPI()) {
    initWithClickInterception();
  }

  // Set up link prefetching.
  initPrefetch();

  // Play initial load animation.
  if (document.readyState === 'complete') {
    initialLoadAnimation();
  } else {
    window.addEventListener('load', () => {
      initialLoadAnimation();
    });
  }
}
;// ./src/js/page-transitions.js
/**
 * Page Transitions — Webpack Entry Point
 *
 * Only loaded when the page transitions feature is enabled in Style Manager.
 * Uses View Transitions API + Navigation API + GSAP for smooth page-to-page
 * animations with a border expand/collapse overlay.
 */



// Config is passed from PHP via wp_localize_script().
const page_transitions_config = window.animaPageTransitions || {};

// Initialize when DOM is ready.
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => init(page_transitions_config));
} else {
  init(page_transitions_config);
}
/******/ })()
;