/******/ (() => { // webpackBootstrap
/******/ 	"use strict";

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
  // Tell scripts.js to re-create App (Navbar, Hero, SearchOverlay, etc.).
  document.dispatchEvent(new CustomEvent('anima:page-transition'));

  // Re-execute Nova Blocks frontend scripts that use ready() —
  // since readyState is already 'complete', ready() fires immediately
  // when the script re-runs, re-creating Header, Supernova, etc.
  rerunNovaBlocksScripts();

  // Trigger resize/scroll for any remaining listeners.
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
 * Re-execute Nova Blocks frontend scripts after DOM swap.
 *
 * Nova Blocks scripts use ready() which fires immediately when
 * readyState is already 'complete'. By creating fresh <script> tags
 * with the same src, the browser re-executes the initialization code.
 */
function rerunNovaBlocksScripts() {
  // Key Nova Blocks scripts that need re-init after DOM swap.
  const scriptPatterns = ['nova-blocks/build/color-signal/frontend', 'block-library/blocks/header/frontend', 'block-library/blocks/supernova/frontend'];
  const existingScripts = document.querySelectorAll('script[src]');
  existingScripts.forEach(script => {
    const src = script.src;
    const shouldRerun = scriptPatterns.some(pattern => src.includes(pattern));
    if (shouldRerun) {
      const newScript = document.createElement('script');
      newScript.src = src;
      script.parentNode.insertBefore(newScript, script.nextSibling);
    }
  });
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
 * Page Transitions — View Transitions API + Navigation API
 *
 * Proof of concept: uses the browser's native View Transitions API
 * cross-fade for page-to-page transitions. No GSAP, no overlays.
 *
 * Graceful degradation:
 * - No Navigation API -> falls back to click event interception
 * - No View Transitions API -> instant swap (no animation)
 * - No JS -> normal page loads (links work as usual)
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

  // The new document arrives with is-loading from PHP body_class.
  // Since we're doing an AJAX swap (not a fresh load), mark it as loaded immediately.
  document.body.classList.remove('is-loading');
  document.body.classList.add('has-loaded', 'is-loaded');
  syncDocumentTitle(newDocument);
  syncAdminBar(newDocument);
  try {
    syncHeadAssets(newDocument);
  } catch (e) {
    // Don't let head asset sync errors block the transition.
  }

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
    // Fetch the new page.
    const response = await fetch(url, {
      signal,
      credentials: 'same-origin',
      headers: {
        'X-Requested-With': 'XMLHttpRequest'
      }
    });
    if (!response.ok) {
      window.location.href = url;
      return;
    }
    const html = await response.text();
    const newDocument = parseHTML(html);

    // Use View Transitions API if available — browser handles the cross-fade.
    if (document.startViewTransition) {
      const transition = document.startViewTransition(() => {
        performSwap(newDocument);
      });
      await transition.finished;
    } else {
      // No View Transitions API — swap directly.
      performSwap(newDocument);
    }

    // Post-transition tasks.
    reinitComponents();
    trackPageview(url);
  } catch (error) {
    if (error.name === 'AbortError') {
      return;
    }
    console.error('Page transition failed:', error);
    window.location.href = url;
  } finally {
    isTransitioning = false;
  }
}

/**
 * Initialize using the Navigation API (preferred).
 */
function initWithNavigationAPI() {
  if (typeof navigation === 'undefined') {
    return false;
  }
  navigation.addEventListener('navigate', event => {
    if (!event.canIntercept || event.hashChange || event.downloadRequest || event.formData) {
      return;
    }
    const url = new URL(event.destination.url);
    if (url.origin !== location.origin) {
      return;
    }
    if (shouldExcludeUrl(event.destination.url, config)) {
      return;
    }
    if (event.navigationType === 'push' || event.navigationType === 'replace' || event.navigationType === 'traverse') {
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
 * Used when the Navigation API is not available (Firefox, Safari).
 */
function initWithClickInterception() {
  document.addEventListener('click', event => {
    const link = event.target.closest('a[href]');
    if (!link) {
      return;
    }
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
      return;
    }
    if (link.target === '_blank') {
      return;
    }
    const url = link.href;
    if (shouldExcludeUrl(url, config)) {
      return;
    }
    event.preventDefault();
    const controller = new AbortController();
    window.history.pushState({}, '', url);
    handleTransition(url, controller.signal);
  });
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
    if (!event.target || !event.target.closest) {
      return;
    }
    const link = event.target.closest('a[href]');
    if (!link || link.target === '_blank') {
      return;
    }
    const url = link.href;
    if (prefetched.has(url) || shouldExcludeUrl(url, config)) {
      return;
    }
    prefetched.add(url);
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