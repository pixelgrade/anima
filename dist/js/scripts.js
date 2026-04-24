/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 771
(module) {

const NEW_HERO_SELECTOR = '.nb-supernova--card-layout-stacked.nb-supernova--1-columns.nb-supernova--align-full';
const OLD_HERO_SELECTOR = '.novablocks-hero';
function shouldInitializeHero(element) {
  if (!element || typeof element.matches !== 'function') {
    return false;
  }
  if (element.classList && element.classList.contains('nb-contextual-post-card')) {
    return false;
  }
  return element.matches(NEW_HERO_SELECTOR) || element.matches(OLD_HERO_SELECTOR);
}
module.exports = {
  NEW_HERO_SELECTOR,
  OLD_HERO_SELECTOR,
  shouldInitializeHero
};

/***/ },

/***/ 945
(module) {

/**
 * Reveal Choreographer
 *
 * Coordinates when intro-animation reveals are allowed to fire. Producers
 * (the IntersectionObserver / slide-change flows) request a reveal and list
 * the "gates" it depends on. Integrations (page transitions, Slick carousels,
 * etc.) close and open those gates in response to blocking animations.
 *
 * Semantics:
 *  - A gate is OPEN by default. Only integrations close it.
 *  - While any gate a request depends on is closed, the request queues and
 *    its target stays in its pre-reveal state.
 *  - openGate(name, { settle }) keeps the gate logically closed for `settle`
 *    ms after the blocking animation ends, then flushes queued reveals.
 *    closeGate(name) called during a pending settle cancels that settle.
 *  - Every request has a timeout safety net (default 3s). If a gate it
 *    depends on never opens, the reveal force-fires so the user never sees
 *    permanently-hidden content.
 *  - When prefersReducedMotion() returns true, requests bypass gates
 *    entirely and fire immediately.
 *
 * The module is pure: no DOM queries, no CSS knowledge. The actual reveal
 * (adding a class, running a keyframe, whatever) is the caller's onReveal
 * callback.
 */
function createRevealChoreographer({
  window: win = typeof window !== 'undefined' ? window : null,
  prefersReducedMotion = () => false,
  onReveal = () => {},
  defaultTimeout = 3000
} = {}) {
  const closedGates = new Set();
  // Request queue, keyed by the element so a repeat requestReveal() for the
  // same target cancels the previous one instead of stacking up.
  const queue = new Map();
  // Pending "settle" timers keyed by gate name. If the gate is re-closed
  // before settle elapses, we cancel the timer and stay closed.
  const pendingOpens = new Map();
  function setTimer(fn, ms) {
    if (win && typeof win.setTimeout === 'function') {
      return win.setTimeout(fn, ms);
    }
    return null;
  }
  function clearTimer(handle) {
    if (handle == null) return;
    if (win && typeof win.clearTimeout === 'function') {
      win.clearTimeout(handle);
    }
  }
  function isRequestReady(req) {
    for (const gate of req.waitFor) {
      if (closedGates.has(gate)) return false;
    }
    return true;
  }
  function cleanupRequest(req) {
    clearTimer(req.timeoutHandle);
    queue.delete(req.el);
  }
  function fireReveal(req) {
    cleanupRequest(req);
    // Caller-provided reveal. Try/catch so a throw in one reveal doesn't
    // leave the queue in an inconsistent state.
    try {
      onReveal(req.el);
    } catch (_) {
      /* no-op */
    }
  }
  function flushReadyRequests() {
    // Collect first so we're not mutating queue during iteration.
    const ready = [];
    for (const req of queue.values()) {
      if (isRequestReady(req)) ready.push(req);
    }
    ready.forEach(fireReveal);
  }
  return {
    /**
     * Ask for an element to be revealed.
     *
     * @param {Element} el The target.
     * @param {{ waitFor?: string[], timeout?: number }} [opts]
     *   waitFor: gate names to wait on. Empty = fire immediately.
     *   timeout: force-reveal after this many ms (default 3000).
     */
    requestReveal(el, opts = {}) {
      if (!el) return;

      // Reduced-motion short-circuit: fire now, skip the whole machinery.
      if (typeof prefersReducedMotion === 'function' && prefersReducedMotion()) {
        try {
          onReveal(el);
        } catch (_) {/* no-op */}
        return;
      }
      const waitFor = Array.isArray(opts.waitFor) ? opts.waitFor.slice() : [];
      const timeout = typeof opts.timeout === 'number' ? opts.timeout : defaultTimeout;

      // Cancel any previous request for the same element.
      const previous = queue.get(el);
      if (previous) cleanupRequest(previous);
      const req = {
        el,
        waitFor,
        timeoutHandle: null
      };
      if (waitFor.length === 0 || isRequestReady(req)) {
        try {
          onReveal(el);
        } catch (_) {/* no-op */}
        return;
      }

      // Queue it and arm the timeout safety net.
      queue.set(el, req);
      if (timeout > 0) {
        req.timeoutHandle = setTimer(() => {
          fireReveal(req);
        }, timeout);
      }
    },
    /**
     * Mark a gate as closed. Cancels any pending settle timer for this gate.
     */
    closeGate(name) {
      closedGates.add(name);
      if (pendingOpens.has(name)) {
        clearTimer(pendingOpens.get(name));
        pendingOpens.delete(name);
      }
    },
    /**
     * Mark a gate as open. With settle > 0, the gate stays logically closed
     * for `settle` ms first — requests queued during that window flush when
     * the timer fires. Useful for letting a blocking animation finish its
     * last frame of motion before the next one starts.
     */
    openGate(name, opts = {}) {
      const settle = typeof opts.settle === 'number' ? opts.settle : 0;
      const actuallyOpen = () => {
        closedGates.delete(name);
        pendingOpens.delete(name);
        flushReadyRequests();
      };
      if (settle <= 0) {
        actuallyOpen();
        return;
      }

      // Cancel any previous pending open so a later openGate with a
      // different settle resets the timer.
      if (pendingOpens.has(name)) {
        clearTimer(pendingOpens.get(name));
      }
      const handle = setTimer(actuallyOpen, settle);
      pendingOpens.set(name, handle);
    },
    /** True iff the gate is not currently in the closed set. */
    isGateOpen(name) {
      return !closedGates.has(name);
    },
    /**
     * For instrumentation/tests only — returns the current number of
     * queued (not-yet-fired) requests.
     */
    queuedCount() {
      return queue.size;
    },
    /**
     * Tear down: cancel every pending timer and flush state.
     * Used before re-initializing (e.g., on Barba re-init).
     */
    disconnect({
      preserveGates = false
    } = {}) {
      for (const req of queue.values()) {
        clearTimer(req.timeoutHandle);
      }
      queue.clear();
      if (!preserveGates) {
        for (const handle of pendingOpens.values()) {
          clearTimer(handle);
        }
        pendingOpens.clear();
        closedGates.clear();
      }
    }
  };
}
module.exports = {
  createRevealChoreographer
};

/***/ },

/***/ 688
(module, __unused_webpack_exports, __webpack_require__) {

const {
  createIntroAnimationsRuntime
} = __webpack_require__(280);
const {
  attachPageTransitionGate,
  PAGE_TRANSITION_GATE
} = __webpack_require__(155);
const {
  attachSlickGate,
  getSlickGateName
} = __webpack_require__(376);

// Compose the runtime with the production gate resolver.
// - Every target waits on the global page-transition gate. On first page
//   load the gate is open (never closed) so this is a no-op. During a
//   Barba soft-nav the integration closes it during the transition and
//   opens it with settle after, giving the loader a clean exit.
// - Targets inside a Slick carousel also wait on that carousel's
//   slick:{id} gate, so the word-curtain cascade only starts after the
//   slide transform finishes.
function resolveGates(target) {
  const gates = [PAGE_TRANSITION_GATE];
  const slickGate = getSlickGateName(target);
  if (slickGate) gates.push(slickGate);
  return gates;
}
const runtime = createIntroAnimationsRuntime({
  resolveGates
});

// Integrations attach their listeners BEFORE runtime.bind() so that on a
// 'anima:page-transition-complete' dispatch the gate's openGate (with
// settle) runs before runtime.initialize() — queued requests from
// initialize then actually wait the settle window before firing.
if (typeof window !== 'undefined') {
  attachPageTransitionGate({
    window,
    choreographer: runtime.choreographer
  });
  attachSlickGate({
    window,
    document,
    jQuery: window.jQuery || window.$,
    choreographer: runtime.choreographer
  });
}
module.exports = {
  initialize(root) {
    return runtime.initialize(root);
  },
  bind() {
    return runtime.bind();
  },
  disconnect() {
    return runtime.disconnect();
  }
};

/***/ },

/***/ 155
(module) {

/**
 * Page-transition integration for the reveal choreographer.
 *
 * Listens for Anima's window-level page-transition events and opens/closes
 * the 'page-transition' gate accordingly. When a soft navigation is in
 * flight, new reveals requested by the runtime queue behind this gate so
 * they don't animate against the loader/overlay. When the transition ends
 * we open the gate with a small settle delay, giving the overlay a beat to
 * clear before the cascade starts.
 *
 * Events relied upon:
 *  - 'anima:page-transition-start'    — dispatched in page-transitions/index.js
 *                                        via barba.hooks.before().
 *  - 'anima:page-transition-complete' — existing event dispatched after the
 *                                        loader is dismissed.
 *
 * On first page load neither event has fired, so the gate stays open and
 * reveals behave exactly as before.
 */
const PAGE_TRANSITION_GATE = 'page-transition';
const DEFAULT_SETTLE_MS = 200;
function attachPageTransitionGate({
  window: win = typeof window !== 'undefined' ? window : null,
  document: doc = win && win.document ? win.document : null,
  choreographer,
  settleMs = DEFAULT_SETTLE_MS
} = {}) {
  if (!win || typeof win.addEventListener !== 'function' || !choreographer) {
    return () => {};
  }
  if (doc && doc.body && doc.body.classList && doc.body.classList.contains('is-loading') && doc.body.classList.contains('has-page-transitions')) {
    choreographer.closeGate(PAGE_TRANSITION_GATE);
  }
  const onStart = () => {
    choreographer.closeGate(PAGE_TRANSITION_GATE);
  };
  const onComplete = () => {
    choreographer.openGate(PAGE_TRANSITION_GATE, {
      settle: settleMs
    });
  };
  win.addEventListener('anima:page-transition-start', onStart);
  win.addEventListener('anima:page-transition-complete', onComplete);
  return function detach() {
    if (typeof win.removeEventListener === 'function') {
      win.removeEventListener('anima:page-transition-start', onStart);
      win.removeEventListener('anima:page-transition-complete', onComplete);
    }
  };
}
module.exports = {
  attachPageTransitionGate,
  PAGE_TRANSITION_GATE
};

/***/ },

/***/ 376
(module) {

/**
 * Slick carousel integration for the reveal choreographer.
 *
 * For single-item Slick carousels (a fade hero, a full-width slide-wipe),
 * closes a per-carousel gate ('slick:{id}') during the slide-change
 * transition and opens it (with a settle delay) once the transition ends.
 * Reveals inside the newly-active slide use that gate name so the Kinetic
 * word-curtain waits for the slide transform to finish before playing.
 *
 * Multi-item carousels (variableWidth, centerMode, slidesToShow > 1) are
 * NOT wired — their "slide changes" are just a scroll of an already-visible
 * gallery of items, so replaying the newly-focused title's cascade feels
 * wrong. They're tagged `data-slick-carousel-kind="multi"` so the runtime's
 * slide-change observer can skip them.
 *
 * Uses jQuery because Slick itself is jQuery-based; Slick dispatches its
 * transition events as jQuery events on the carousel element.
 */
const SLICK_GATE_PREFIX = 'slick:';
const DEFAULT_SETTLE_MS = 100;
const GATE_ID_ATTRIBUTE = 'data-slick-gate-id';
const KIND_ATTRIBUTE = 'data-slick-carousel-kind';
let nextAutoId = 1;

/**
 * Classify a Slick carousel as 'single' or 'multi' based on its options.
 *
 *  - fade: always single-item (Slick fade is a crossfade between 1-at-a-time).
 *  - variableWidth / centerMode / slidesToShow > 1 → multi-item.
 *  - slidesToShow <= 1 without those flags → single-item.
 *
 * Used to decide whether a slide-change should replay the newly-prominent
 * title's cascade (desirable on hero-style carousels) or leave existing
 * reveals alone (correct for gallery-style carousels where nothing is
 * taking over the viewport).
 */
function classifySlickCarousel(carouselEl, jQuery) {
  if (!carouselEl || !jQuery) return 'multi'; // safer default: don't replay
  try {
    const $c = jQuery(carouselEl);
    if (!$c || !$c.length || typeof $c.slick !== 'function') {
      return 'multi';
    }
    const inst = $c.slick('getSlick');
    const opts = inst && inst.options ? inst.options : null;
    if (!opts) return 'multi';
    if (opts.fade) return 'single';
    if (opts.variableWidth) return 'multi';
    if (opts.centerMode) return 'multi';
    if ((opts.slidesToShow || 1) > 1) return 'multi';
    return 'single';
  } catch (e) {
    return 'multi';
  }
}

/**
 * Resolve the gate name for a carousel element. If the carousel hasn't been
 * tagged yet, assigns a fresh id. Safe to call multiple times.
 */
function assignCarouselGateName(carouselEl) {
  if (!carouselEl || !carouselEl.getAttribute) return null;
  let id = carouselEl.getAttribute(GATE_ID_ATTRIBUTE);
  if (!id) {
    id = String(nextAutoId++);
    carouselEl.setAttribute(GATE_ID_ATTRIBUTE, id);
  }
  return SLICK_GATE_PREFIX + id;
}

/**
 * Given any element, find the gate name of the nearest single-item
 * carousel it lives inside. Returns null for elements outside a carousel
 * or inside a multi-item carousel (those don't use gates).
 */
function getSlickGateName(el) {
  if (!el || typeof el.closest !== 'function') return null;
  const carousel = el.closest('.slick-initialized.slick-slider');
  if (!carousel) return null;
  // Multi-item carousels don't participate in the gate system.
  if (carousel.getAttribute && carousel.getAttribute(KIND_ATTRIBUTE) === 'multi') {
    return null;
  }
  return assignCarouselGateName(carousel);
}

/**
 * True iff the element is inside a Slick carousel whose slide changes
 * should replay the Kinetic cascade. Used by the runtime's slide-change
 * observer to skip multi-item carousels.
 */
function isInsideSingleItemSlickCarousel(el) {
  if (!el || typeof el.closest !== 'function') return false;
  const carousel = el.closest('.slick-initialized.slick-slider');
  if (!carousel || !carousel.getAttribute) return false;
  return carousel.getAttribute(KIND_ATTRIBUTE) === 'single';
}

/**
 * Wire one carousel's beforeChange/afterChange into the choreographer.
 * Classifies the carousel first; multi-item carousels get tagged but
 * skip the gate wiring (nothing to gate — the runtime won't replay).
 */
function attachToCarousel($carousel, choreographer, settleMs, jQuery) {
  if (!$carousel || !$carousel.length || $carousel.data('anima-slick-gate-bound')) return;
  const carouselEl = $carousel[0];
  const kind = classifySlickCarousel(carouselEl, jQuery);
  if (carouselEl && carouselEl.setAttribute) {
    carouselEl.setAttribute(KIND_ATTRIBUTE, kind);
  }

  // Flag as bound so repeated scans skip this element either way.
  $carousel.data('anima-slick-gate-bound', true);
  if (kind !== 'single') {
    // Multi-item carousel: no gate, no replay. The runtime's slide-change
    // observer checks the kind attribute and skips these entirely.
    return;
  }
  const gateName = assignCarouselGateName(carouselEl);
  if (!gateName) return;
  $carousel.on('beforeChange', () => {
    choreographer.closeGate(gateName);
  });
  $carousel.on('afterChange', () => {
    choreographer.openGate(gateName, {
      settle: settleMs
    });
  });
}

/**
 * Attach the Slick integration. Wires every already-initialized carousel
 * immediately AND watches the document for new .slick-initialized class
 * additions so late-init carousels (the common case — Slick often
 * initializes after our module loads) get wired as soon as they appear.
 * Also rescans after page transitions to catch soft-navigated-in carousels.
 */
function attachSlickGate({
  window: win = typeof window !== 'undefined' ? window : null,
  document: doc = typeof document !== 'undefined' ? document : null,
  jQuery = win ? win.jQuery || win.$ : null,
  choreographer,
  settleMs = DEFAULT_SETTLE_MS
} = {}) {
  if (!choreographer || !jQuery) {
    return () => {};
  }
  const $ = jQuery;
  function scan(root) {
    const searchRoot = root && typeof root.querySelectorAll === 'function' ? root : doc;
    if (!searchRoot || typeof searchRoot.querySelectorAll !== 'function') return;
    $(searchRoot).find('.slick-initialized.slick-slider').each(function () {
      attachToCarousel($(this), choreographer, settleMs, $);
    });
  }

  // Initial sweep for anything already initialized when we ran.
  scan();

  // Watch for late init. Slick often initializes after our script executes
  // (themes load their scripts in an order the runtime can't control), and
  // the .slick-initialized class is the definitive signal.
  let initObserver = null;
  if (win && typeof win.MutationObserver === 'function' && doc && doc.body) {
    initObserver = new win.MutationObserver(mutations => {
      for (const m of mutations) {
        if (m.type !== 'attributes' || m.attributeName !== 'class') continue;
        const target = m.target;
        if (!target || !target.classList) continue;
        if (!target.classList.contains('slick-initialized')) continue;
        if (!target.classList.contains('slick-slider')) continue;
        attachToCarousel($(target), choreographer, settleMs, $);
      }
    });
    initObserver.observe(doc.body, {
      attributes: true,
      attributeFilter: ['class'],
      subtree: true
    });
  }
  const onPageTransitionComplete = () => {
    // Slick often (re-)initializes after a Barba content swap. Give it
    // one frame to settle, then scan. The MutationObserver above also
    // catches these, but the explicit rescan covers the edge case where
    // Slick reuses existing elements without toggling .slick-initialized.
    if (win && typeof win.requestAnimationFrame === 'function') {
      win.requestAnimationFrame(() => {
        win.requestAnimationFrame(() => scan());
      });
    } else {
      scan();
    }
  };
  if (win && typeof win.addEventListener === 'function') {
    win.addEventListener('anima:page-transition-complete', onPageTransitionComplete);
  }
  return function detach() {
    if (win && typeof win.removeEventListener === 'function') {
      win.removeEventListener('anima:page-transition-complete', onPageTransitionComplete);
    }
    if (initObserver && typeof initObserver.disconnect === 'function') {
      initObserver.disconnect();
    }
  };
}
module.exports = {
  attachSlickGate,
  getSlickGateName,
  assignCarouselGateName,
  isInsideSingleItemSlickCarousel,
  classifySlickCarousel,
  SLICK_GATE_PREFIX,
  KIND_ATTRIBUTE
};

/***/ },

/***/ 280
(module, __unused_webpack_exports, __webpack_require__) {

const {
  collectRevealTargets,
  collectKineticTitleTargets
} = __webpack_require__(687);
const {
  createRevealChoreographer
} = __webpack_require__(945);
const {
  isInsideSingleItemSlickCarousel
} = __webpack_require__(376);
const REVEAL_ZONE_TOP_RATIO = 0.82;
const PAGE_TRANSITION_REVEAL_TIMEOUT = 8000;
const DELAY_WINDOW_BY_STYLE = {
  fade: 600,
  scale: 600,
  slide: 600,
  // Kinetic needs a longer window: the title's per-word cascade can take
  // ~500ms+ on a multi-line heading, and the rest of the batch should still
  // feel like one continuous reveal.
  kinetic: 1000
};

// Selectors that identify a "title" role target (heading blocks, post titles).
// Used by the role classifier below. Anything else gets role 'other'.
const TITLE_ROLE_SELECTORS = ['h1', 'h2', 'h3', '.wp-block-heading', '.wp-block-post-title'];

// Animatable content found inside a Slick slide. Used by the slide-change
// observer to pre-hide and re-stagger the WHOLE slide on every change, not
// just the title. Includes:
//   - Anything already tagged as a tracked intro target.
//   - Headings (covers Kinetic titles inside the slide).
//   - Body text / excerpts / paragraphs.
//   - Card meta (date, author, categories).
//   - CTAs / button groups.
// Anima's parallax hero (.nb-supernova-item--scrolling-effect-parallax) is
// excluded from default reveal targeting, so its description/meta/buttons
// are NOT picked up by collectRevealTargets — this list catches them so
// they participate in the slide-change cascade.
const SLIDE_CONTENT_SELECTORS = ['.anima-intro-target', 'h1', 'h2', 'h3', '.wp-block-heading', '.wp-block-post-title', '.nb-card__title', '.nb-collection__title', '.wp-block-paragraph', '.wp-block-post-excerpt', '.nb-card__description', '.nb-card__meta', '.wp-block-post-date', '.wp-block-post-author', '.wp-block-buttons', '.nb-supernova-item__cta'].join(',');
const ACTIVE_SLICK_SLIDE_SELECTOR = '.slick-slide.slick-active';
function classifyTargetRole(node) {
  if (!node || typeof node.matches !== 'function') {
    return 'other';
  }
  for (const selector of TITLE_ROLE_SELECTORS) {
    if (node.matches(selector)) {
      return 'title';
    }
  }
  return 'other';
}
function getRevealObserverOptions() {
  return {
    threshold: 0,
    rootMargin: `0px 0px -${Math.round((1 - REVEAL_ZONE_TOP_RATIO) * 100)}% 0px`
  };
}
function createIntroAnimationsRuntime({
  window: win = typeof window !== 'undefined' ? window : null,
  document: doc = typeof document !== 'undefined' ? document : null,
  collectTargets = collectRevealTargets,
  collectKineticTitles = collectKineticTitleTargets,
  createObserver = callback => new win.IntersectionObserver(callback, getRevealObserverOptions()),
  // Injectable so tests can supply a synchronous stub. Factory receives the
  // runtime's handleReveal as its onReveal; integrations can close/open
  // gates on the returned choreographer (exposed via runtime.choreographer).
  createChoreographer = createRevealChoreographer,
  // Given a staged target, return the list of gate names its reveal must
  // wait on. Default: no gates (reveal fires immediately; backward-compat
  // for tests). The shipping runtime wires this up in index.js so titles
  // inside Slick slides or the post-transition page wait appropriately.
  resolveGates = () => []
} = {}) {
  const consumedTargets = new WeakSet();
  let observer = null;
  let slideChangeObserver = null;
  let isBound = false;
  function hasEnabledBodyClass() {
    return !!doc && !!doc.body && !!doc.body.classList && doc.body.classList.contains('has-intro-animations');
  }
  function prefersReducedMotion() {
    return !!win && typeof win.matchMedia === 'function' && win.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }
  function getActiveAnimationStyle() {
    if (!doc || !doc.body || !doc.body.classList) {
      return 'fade';
    }
    const styles = Object.keys(DELAY_WINDOW_BY_STYLE);
    const activeStyle = styles.find(style => doc.body.classList.contains(`has-intro-animations--${style}`));
    return activeStyle || 'fade';
  }
  function parseDelayWindow(value) {
    if (typeof value !== 'string') {
      return null;
    }
    const normalizedValue = value.trim();
    if (!normalizedValue) {
      return null;
    }
    if (normalizedValue.endsWith('ms')) {
      const numericValue = Number.parseFloat(normalizedValue.slice(0, -2));
      return Number.isNaN(numericValue) ? null : numericValue;
    }
    if (normalizedValue.endsWith('s')) {
      const numericValue = Number.parseFloat(normalizedValue.slice(0, -1));
      return Number.isNaN(numericValue) ? null : numericValue * 1000;
    }
    return null;
  }
  function getDelayWindowMs() {
    if (win && typeof win.getComputedStyle === 'function' && doc && doc.body) {
      const delayWindow = parseDelayWindow(win.getComputedStyle(doc.body).getPropertyValue('--anima-intro-delay-window'));
      if (delayWindow !== null) {
        return delayWindow;
      }
    }
    return DELAY_WINDOW_BY_STYLE[getActiveAnimationStyle()] || DELAY_WINDOW_BY_STYLE.fade;
  }
  function formatDelay(delay) {
    const roundedDelay = Math.round(delay * 1000) / 1000;
    if (Number.isInteger(roundedDelay)) {
      return `${roundedDelay}ms`;
    }
    return `${roundedDelay}ms`;
  }
  function isInViewport(target) {
    if (!target) {
      return false;
    }
    if (typeof target.isInViewport === 'boolean') {
      return target.isInViewport;
    }
    if (!win || typeof target.getBoundingClientRect !== 'function') {
      return false;
    }
    const rect = target.getBoundingClientRect();
    const viewportHeight = win.innerHeight || doc?.documentElement?.clientHeight || 0;
    const viewportWidth = win.innerWidth || doc?.documentElement?.clientWidth || 0;
    const revealTop = viewportHeight * REVEAL_ZONE_TOP_RATIO;
    return rect.bottom > 0 && rect.top <= revealTop && rect.right > 0 && rect.left < viewportWidth;
  }
  function markTargetBase(target) {
    if (target && target.classList) {
      target.classList.add('anima-intro-target');
    }
  }

  // Pick the DOM node that actually holds the text to split. Handles the
  // three common heading shapes:
  //   <h2>Title</h2>                      — split inside the heading
  //   <h2><a>Title</a></h2>               — split inside the anchor (card titles)
  //   <h2><a><b>Rich</b> Title</a></h2>   — skip to preserve inline markup
  //   <h2>Mixed <em>inline</em> stuff</h2> — skip (returns null)
  function pickSplitRoot(el) {
    if (!el || typeof el.childElementCount !== 'number') {
      return null;
    }
    const outerText = typeof el.textContent === 'string' ? el.textContent.trim() : '';
    if (!outerText) {
      return null;
    }
    if (el.childElementCount === 0) {
      return el;
    }

    // Single wrapper child (e.g., an anchor) whose text covers the entire
    // heading. This is the common pattern for post-card titles and block
    // theme headings that link to the post.
    if (el.childElementCount === 1) {
      const only = el.firstElementChild;
      const innerText = only && typeof only.textContent === 'string' ? only.textContent.trim() : '';
      if (only && innerText === outerText && only.childElementCount === 0) {
        return only;
      }
    }
    return null;
  }

  // Char-split helper used for single-word titles (a word-level cascade on a
  // one-word heading renders as a single pop, which loses the drama). Each
  // character becomes a <span class="char"> with --char-index (per-line) and
  // --line-index (global). Line wrapping is measured via offsetTop so very
  // long single "words" that wrap still get per-line clip-masks.
  function splitTextIntoChars(splitRoot, word) {
    const chars = Array.from(word); // Unicode-aware iteration

    if (chars.length === 0) {
      return;
    }
    const charSpans = chars.map(ch => {
      const span = doc.createElement('span');
      span.className = 'char';
      span.textContent = ch;
      return span;
    });

    // Pass 1: flat layout so the browser decides where the word wraps.
    splitRoot.textContent = '';
    charSpans.forEach(span => splitRoot.appendChild(span));
    if (typeof splitRoot.getBoundingClientRect === 'function') {
      splitRoot.getBoundingClientRect();
    }
    const charsByTop = new Map();
    charSpans.forEach(span => {
      const top = typeof span.offsetTop === 'number' ? span.offsetTop : 0;
      if (!charsByTop.has(top)) {
        charsByTop.set(top, []);
      }
      charsByTop.get(top).push(span);
    });

    // Pass 2: rewrap each visual line in its own <span class="line">.
    const lineTops = [...charsByTop.keys()].sort((a, b) => a - b);
    splitRoot.textContent = '';
    lineTops.forEach((top, lineIndex) => {
      const lineSpan = doc.createElement('span');
      lineSpan.className = 'line';
      if (lineSpan.style && typeof lineSpan.style.setProperty === 'function') {
        lineSpan.style.setProperty('--line-index', String(lineIndex));
      }
      const lineChars = charsByTop.get(top);
      lineChars.forEach((charSpan, charIndex) => {
        if (charSpan.style && typeof charSpan.style.setProperty === 'function') {
          charSpan.style.setProperty('--char-index', String(charIndex));
          charSpan.style.setProperty('--line-index', String(lineIndex));
        }
        lineSpan.appendChild(charSpan);
      });
      splitRoot.appendChild(lineSpan);
    });
  }

  // Split a heading into per-line <span class="line"> containers whose
  // children are <span class="word"> with --word-index (per-line) and
  // --line-index (global). Mirrors the splitting.js behavior used on
  // louisansa.com — line wrapping is detected from the browser's own
  // layout, so each visual line gets its own overflow:hidden clip and
  // the CSS cascade drives delays with no per-element JS work.
  //
  // Safeguards:
  //  - Skip if the element already has split children (re-entrancy / SPA).
  //  - Skip if the heading contains mixed inline markup we can't handle
  //    safely (pickSplitRoot returns null). Text-only single-anchor wrappers
  //    around the full title text ARE handled — we split inside the anchor.
  function splitHeadingForCurtain(el) {
    if (!el || typeof el.querySelector !== 'function') {
      return;
    }
    if (el.querySelector('.line')) {
      return; // already split
    }
    if (!doc || typeof doc.createElement !== 'function' || typeof doc.createTextNode !== 'function') {
      return;
    }
    const splitRoot = pickSplitRoot(el);
    if (!splitRoot) {
      return;
    }
    const text = typeof splitRoot.textContent === 'string' ? splitRoot.textContent.trim() : '';
    if (!text) {
      return;
    }
    const words = text.split(/\s+/).filter(Boolean);
    if (words.length === 0) {
      return;
    }

    // Single-word titles: split into characters instead of words so the
    // cascade shows a rising letter sequence. Otherwise a one-word heading
    // like "Newsletter" would render as a single block pop with no stagger.
    if (words.length === 1) {
      splitTextIntoChars(splitRoot, words[0]);
      return;
    }
    const wordSpans = words.map(word => {
      const span = doc.createElement('span');
      span.className = 'word';
      span.textContent = word;
      return span;
    });

    // Pass 1: flat layout so the browser decides where lines wrap.
    splitRoot.textContent = '';
    wordSpans.forEach((span, index) => {
      splitRoot.appendChild(span);
      if (index < wordSpans.length - 1) {
        splitRoot.appendChild(doc.createTextNode(' '));
      }
    });

    // Force a layout read, then group words by their offsetTop.
    if (typeof splitRoot.getBoundingClientRect === 'function') {
      splitRoot.getBoundingClientRect();
    }
    const wordsByTop = new Map();
    wordSpans.forEach(span => {
      const top = typeof span.offsetTop === 'number' ? span.offsetTop : 0;
      if (!wordsByTop.has(top)) {
        wordsByTop.set(top, []);
      }
      wordsByTop.get(top).push(span);
    });

    // Pass 2: rewrap each visual line in its own <span class="line">.
    const lineTops = [...wordsByTop.keys()].sort((a, b) => a - b);
    splitRoot.textContent = '';
    lineTops.forEach((top, lineIndex) => {
      const lineSpan = doc.createElement('span');
      lineSpan.className = 'line';
      if (lineSpan.style && typeof lineSpan.style.setProperty === 'function') {
        lineSpan.style.setProperty('--line-index', String(lineIndex));
      }
      const lineWords = wordsByTop.get(top);
      lineWords.forEach((wordSpan, wordIndex) => {
        if (wordSpan.style && typeof wordSpan.style.setProperty === 'function') {
          wordSpan.style.setProperty('--word-index', String(wordIndex));
          wordSpan.style.setProperty('--line-index', String(lineIndex));
        }
        lineSpan.appendChild(wordSpan);
        if (wordIndex < lineWords.length - 1) {
          lineSpan.appendChild(doc.createTextNode(' '));
        }
      });
      splitRoot.appendChild(lineSpan);
    });
  }
  function applyRevealDelay(target, index = 0, totalTargets = 1) {
    if (!target || !target.style || typeof target.style.setProperty !== 'function') {
      return;
    }
    const delay = totalTargets > 0 ? getDelayWindowMs() / totalTargets * index : 0;
    target.style.setProperty('--anima-intro-delay', formatDelay(delay));
  }
  function revealTarget(target) {
    if (!target || !target.classList) {
      return;
    }
    markTargetBase(target);
    target.classList.remove('anima-intro-target--pending');
    target.classList.add('anima-intro-target--revealed');
    consumedTargets.add(target);
    if (observer && typeof observer.unobserve === 'function') {
      observer.unobserve(target);
    }
  }
  function stageTarget(target) {
    if (!target || consumedTargets.has(target)) {
      return false;
    }
    markTargetBase(target);
    target.classList.remove('anima-intro-target--revealed');

    // Tag the target with its role (title / other). Per-role CSS uses this
    // class to apply style-specific treatment — notably Kinetic, which
    // reveals non-title targets with a slide and titles with a word curtain.
    const role = classifyTargetRole(target);
    if (target.classList && typeof target.classList.add === 'function') {
      target.classList.add('anima-intro-target--role-' + role);
    }
    if (prefersReducedMotion()) {
      revealTarget(target);
      return false;
    }

    // Suppress the transition while we apply the pre-state. Without this,
    // the element would interpolate from its natural style (opacity 1,
    // no transform) toward the --pending values over the transition
    // duration. rAF×2 (the usual "wait for a paint" trick) only gives us
    // ~33ms of that transition — nowhere near enough to settle — so when
    // revealTarget later flips to --revealed the reveal transition starts
    // from ~95% opacity with almost no visible distance to animate.
    //
    // With --staging applied, the pre-state snaps in instantly. We force
    // a reflow so the snapped style is committed, then remove --staging
    // on the next frame. revealTarget is wrapped in its own rAF×2 inside
    // handleReveal so it fires AFTER this unstaging — transitions then
    // animate the full --pending → --revealed distance.
    target.classList.add('anima-intro-target--staging');
    target.classList.add('anima-intro-target--pending');

    // Force a synchronous reflow so the browser commits the pre-state
    // paint before we drop the transition suppression.
    // eslint-disable-next-line no-unused-expressions
    target.offsetWidth;
    if (win && typeof win.requestAnimationFrame === 'function') {
      win.requestAnimationFrame(() => {
        if (target && target.classList) {
          target.classList.remove('anima-intro-target--staging');
        }
      });
    } else {
      target.classList.remove('anima-intro-target--staging');
    }

    // Kinetic style only: split title-role headings into words so the CSS
    // per-word cascade has something to reveal. Runs on every stageTarget
    // call, which means it re-applies correctly after Barba page transitions
    // (initialize() re-fires on 'anima:page-transition-complete').
    if (role === 'title' && getActiveAnimationStyle() === 'kinetic') {
      splitHeadingForCurtain(target);
    }
    return true;
  }
  function disconnect() {
    if (observer && typeof observer.disconnect === 'function') {
      observer.disconnect();
    }
    if (slideChangeObserver && typeof slideChangeObserver.disconnect === 'function') {
      slideChangeObserver.disconnect();
    }
    if (choreographer && typeof choreographer.disconnect === 'function') {
      choreographer.disconnect({
        preserveGates: true
      });
    }
    observer = null;
    slideChangeObserver = null;
    // Leave choreographer reference intact — the factory-returned API
    // still exposes it for integrations and for re-use after re-initialize.
    // Its queued requests have been reset by disconnect(); integration gate
    // state is preserved so page-transition/Slick blockers still apply
    // during this fresh scan.
  }

  // Snap an already-revealed intro target back to its pre-state *without*
  // a visible transition. Used ahead of a Slick slide change so the slide
  // transition plays over a fully pre-hidden slide — title invisible,
  // description invisible, buttons invisible, etc. — and the gated
  // re-reveal then plays the staggered cascade on the settled slide.
  //
  // Two strategies depending on role:
  //
  // Title role (Kinetic word-curtain): the container is always opaque
  // under Kinetic — it's the inner .word/.char spans that hide. Use
  // --replaying to suppress THEIR transitions during the snap; the
  // container itself doesn't transition.
  //
  // Other role (slide-up + fade-in): hide the container itself by
  // putting it back at --pending. Use --staging to suppress its
  // opacity/transform transition during the snap so it doesn't visibly
  // animate backward to the pre-state.
  function snapTargetToPreState(el) {
    if (!el || !el.classList) return;
    if (!el.classList.contains('anima-intro-target--revealed')) return;
    if (el.classList.contains('anima-intro-target--role-title')) {
      el.classList.add('anima-intro-target--replaying');
      el.classList.remove('anima-intro-target--revealed');
      if (typeof el.getBoundingClientRect === 'function') {
        el.getBoundingClientRect();
      }
      el.classList.remove('anima-intro-target--replaying');
      return;
    }

    // Non-title: snap the container itself back to --pending with
    // transitions suppressed.
    el.classList.add('anima-intro-target--staging');
    el.classList.add('anima-intro-target--pending');
    el.classList.remove('anima-intro-target--revealed');
    if (typeof el.getBoundingClientRect === 'function') {
      el.getBoundingClientRect();
    }
    el.classList.remove('anima-intro-target--staging');
  }

  // Backward-compat alias kept for anything that imports the old name.
  // Internally delegates to snapTargetToPreState which handles both roles.
  function snapTitleToPreState(el) {
    snapTargetToPreState(el);
  }

  // Re-run the Kinetic word/char cascade on a title that has already been
  // revealed. Used when a carousel slide comes into view a second time
  // (Slick doesn't mutate the DOM on slide change, so IntersectionObserver
  // never re-fires). The sequence:
  //   1. Add --replaying (disables word/char transitions)
  //   2. Remove --revealed → words/chars snap to pre-state with no animation
  //   3. Force a reflow so the snap is committed
  //   4. Remove --replaying (re-enables transitions)
  //   5. Next frame pair, re-add --revealed → cascade runs forward
  function replayKineticTitle(el) {
    if (!el || !el.classList) {
      return;
    }

    // If the title was never revealed in the first place, let the normal
    // IntersectionObserver flow handle it instead — no replay needed.
    if (!el.classList.contains('anima-intro-target--revealed')) {
      return;
    }
    el.classList.add('anima-intro-target--replaying');
    el.classList.remove('anima-intro-target--revealed');

    // Force reflow so the pre-state snap is committed before we re-enable
    // transitions and trigger the forward cascade.
    if (typeof el.getBoundingClientRect === 'function') {
      el.getBoundingClientRect();
    }
    el.classList.remove('anima-intro-target--replaying');
    if (win && typeof win.requestAnimationFrame === 'function') {
      win.requestAnimationFrame(() => {
        win.requestAnimationFrame(() => {
          el.classList.add('anima-intro-target--revealed');
        });
      });
    } else {
      el.classList.add('anima-intro-target--revealed');
    }
  }

  // Watch the document for Slick carousels changing slides. When a slide
  // gains the `slick-active` class (i.e., it's newly in the carousel's
  // visible set), replay any Kinetic titles inside it. The observer is
  // body-wide so it works regardless of Slick-init order relative to the
  // runtime, and it handles dynamic carousels (e.g., those initialized
  // after a page transition).
  function observeSlickSlideChanges() {
    if (!win || typeof win.MutationObserver !== 'function') {
      return null;
    }
    if (!doc || !doc.body) {
      return null;
    }
    if (getActiveAnimationStyle() !== 'kinetic') {
      return null;
    }
    const obs = new win.MutationObserver(mutations => {
      mutations.forEach(mutation => {
        if (mutation.type !== 'attributes' || mutation.attributeName !== 'class') {
          return;
        }
        const slide = mutation.target;
        if (!slide || !slide.classList || !slide.classList.contains('slick-slide')) {
          return;
        }
        const oldClass = mutation.oldValue || '';
        const wasActive = oldClass.split(/\s+/).indexOf('slick-active') !== -1;
        const isActive = slide.classList.contains('slick-active');
        if (wasActive || !isActive) {
          return; // not a freshly-activated slide
        }
        if (typeof slide.querySelectorAll !== 'function') {
          return;
        }

        // Only replay when the slide belongs to a SINGLE-item carousel
        // (fade hero, full-width slide-wipe). On multi-item carousels —
        // variableWidth galleries, centerMode, slidesToShow > 1 — a
        // slide becoming "active" is just a gallery scroll and replay
        // reads as a glitch. The slick-gate integration tags each
        // carousel as 'single' or 'multi' during attach.
        if (!isInsideSingleItemSlickCarousel(slide)) {
          return;
        }
        if (typeof slide.querySelectorAll !== 'function') {
          return;
        }

        // Snap EVERY animatable piece of content inside the slide —
        // title, description, meta, buttons, etc. — to its pre-state
        // synchronously, then queue staggered reveals through the gate.
        //
        // Two populations matter here:
        //   (a) Elements that were already intro targets (most commonly
        //       the title, since Anima collects only headings as primary
        //       targets in a hero slide). For these we snap back to
        //       pre-state via snapTargetToPreState.
        //   (b) Other in-slide content that should participate in the
        //       slide-change cascade — description, meta, buttons —
        //       which Anima's default targeting doesn't pick up because
        //       the hero's `.nb-supernova-item--scrolling-effect-parallax`
        //       container is in the EXCLUDED zone. For these we stage
        //       them on the fly, which adds the .anima-intro-target +
        //       --pending + --staging classes and pre-hides them.
        //
        // Either way, by the end of this loop every element in the slide
        // is at its pre-state and ready to be re-revealed. revealTargets
        // applies a FRESH stagger across this slide's target count
        // (instead of the page-wide count) and queues each through the
        // choreographer. When the slick:{id} gate opens (afterChange +
        // 100ms settle), the whole cascade plays on the settled slide.
        // Dedupe: if both a parent and a child match (e.g., a tracked
        // .nb-supernova-item containing an h1 and a .nb-card__description),
        // keep only the parent — staging the parent already pre-hides
        // everything inside it, and staggering child + parent separately
        // produces a doubled fade/slide.
        const slideContent = collectSlideContentTargets(slide);
        if (slideContent.length === 0) return;
        slideContent.forEach(el => {
          if (!el || !el.classList) return;
          if (el.classList.contains('anima-intro-target--revealed')) {
            snapTargetToPreState(el);
            return;
          }
          if (!el.classList.contains('anima-intro-target')) {
            // Not yet a tracked intro target — stage it now (which
            // pre-hides it via --pending under --staging).
            stageTarget(el);
          }
        });
        revealTargets(slideContent);
      });
    });
    obs.observe(doc.body, {
      attributes: true,
      attributeFilter: ['class'],
      attributeOldValue: true,
      subtree: true
    });
    return obs;
  }
  function collectSlideContentTargets(slide) {
    if (!slide || typeof slide.querySelectorAll !== 'function') {
      return [];
    }
    const candidates = [...slide.querySelectorAll(SLIDE_CONTENT_SELECTORS)];
    return candidates.filter(node => {
      return !candidates.some(other => {
        return other !== node && typeof other.contains === 'function' && other.contains(node);
      });
    });
  }
  function appendUniqueTargets(targets, additions) {
    const results = targets.slice();
    additions.forEach(node => {
      if (!node || results.indexOf(node) !== -1) {
        return;
      }
      if (results.some(existing => {
        return existing !== node && existing && typeof existing.contains === 'function' && existing.contains(node);
      })) {
        return;
      }
      results.push(node);
    });
    return results;
  }
  function collectInitialActiveSlideContentTargets(root, existingTargets = []) {
    if (!root || typeof root.querySelectorAll !== 'function') {
      return [];
    }
    const activeSlides = [...root.querySelectorAll(ACTIVE_SLICK_SLIDE_SELECTOR)].filter(slide => isInsideSingleItemSlickCarousel(slide));
    const slideTargets = activeSlides.flatMap(slide => collectSlideContentTargets(slide));
    return appendUniqueTargets(existingTargets, slideTargets).filter(target => existingTargets.indexOf(target) === -1);
  }
  function ensureObserver() {
    if (observer || prefersReducedMotion() || !hasEnabledBodyClass() || typeof createObserver !== 'function') {
      return observer;
    }
    observer = createObserver((entries = []) => {
      const readyTargets = entries.filter(entry => entry && entry.isIntersecting).map(entry => entry.target);
      revealTargets(readyTargets);
    });
    return observer;
  }
  function sortBatchTargets(targets = []) {
    return [...targets].sort((firstTarget, secondTarget) => {
      if (!firstTarget || !secondTarget || typeof firstTarget.getBoundingClientRect !== 'function' || typeof secondTarget.getBoundingClientRect !== 'function') {
        return 0;
      }
      const firstRect = firstTarget.getBoundingClientRect();
      const secondRect = secondTarget.getBoundingClientRect();
      const verticalDelta = firstRect.top - secondRect.top;
      if (Math.abs(verticalDelta) > 24) {
        return verticalDelta;
      }
      return firstRect.left - secondRect.left;
    });
  }

  // The choreographer's onReveal callback. Branches on whether the target
  // is already in the --revealed state:
  //   - Already revealed (e.g., Slick slide becoming active again) → run
  //     the replay pattern (snap to pre-state with transitions disabled,
  //     reflow, re-enable, trigger).
  //   - Pending → wrap in a rAF×2 so the browser has painted the pre-state
  //     before we flip to --revealed; otherwise CSS transitions won't fire.
  function handleReveal(target) {
    if (!target || !target.classList) return;
    if (target.classList.contains('anima-intro-target--revealed')) {
      replayKineticTitle(target);
      return;
    }
    const runReveal = () => revealTarget(target);
    if (win && typeof win.requestAnimationFrame === 'function') {
      win.requestAnimationFrame(() => {
        win.requestAnimationFrame(runReveal);
      });
      return;
    }
    runReveal();
  }

  // Lazily-created choreographer. Factory signature lets tests substitute
  // a synchronous stub; default is the real one.
  let choreographer = null;
  function getChoreographer() {
    if (!choreographer) {
      choreographer = createChoreographer({
        window: win,
        prefersReducedMotion,
        onReveal: handleReveal
      });
    }
    return choreographer;
  }
  function requestTargetReveal(target) {
    if (!target) return;
    const gates = typeof resolveGates === 'function' ? resolveGates(target) : [];
    const options = {
      waitFor: gates
    };
    if (gates.indexOf('page-transition') !== -1) {
      options.timeout = PAGE_TRANSITION_REVEAL_TIMEOUT;
    }
    getChoreographer().requestReveal(target, options);
  }
  function revealTargets(targets = []) {
    const sortedTargets = sortBatchTargets(targets);
    sortedTargets.forEach((target, index) => {
      applyRevealDelay(target, index, sortedTargets.length);
      requestTargetReveal(target);
    });
  }
  function scheduleReveal(targets) {
    if (!targets.length) {
      return;
    }

    // Route through the choreographer so any active gates hold these
    // reveals until ready. The choreographer fires onReveal (handleReveal),
    // which applies the rAF×2 pre-paint dance — no need for us to rAF first.
    revealTargets(targets);
  }
  function initialize(root = doc) {
    if (!hasEnabledBodyClass() || !root || typeof collectTargets !== 'function') {
      return [];
    }
    disconnect();
    const immediateTargets = [];
    const primaryTargets = collectTargets(root);
    let targets = primaryTargets;

    // Kinetic extension: also animate title-role headings anywhere on the
    // page (card titles inside reveal roots, collection headings outside
    // them, footer headings, etc.). The outer reveal-root containers still
    // slide (role-other), and any title found via this broader collector
    // gets the word-curtain (role-title). Outside Kinetic this is a no-op
    // so fade/slide/scale keep the original outer-only reveal semantics.
    if (getActiveAnimationStyle() === 'kinetic' && typeof collectKineticTitles === 'function') {
      const extraTitles = collectKineticTitles(root, primaryTargets);
      if (extraTitles && extraTitles.length) {
        targets = primaryTargets.concat(extraTitles);
      }
      const activeSlideContent = collectInitialActiveSlideContentTargets(root, targets);
      if (activeSlideContent.length) {
        targets = targets.concat(activeSlideContent);
      }

      // Also start watching for Slick slide changes so Kinetic titles
      // inside a carousel re-play their word-curtain each time a slide
      // becomes newly active (IntersectionObserver doesn't re-fire
      // because Slick uses CSS transform, not DOM mutation).
      slideChangeObserver = observeSlickSlideChanges();
    }
    targets.forEach(target => {
      if (!stageTarget(target)) {
        return;
      }
      if (isInViewport(target)) {
        immediateTargets.push(target);
        return;
      }
      const activeObserver = ensureObserver();
      if (activeObserver && typeof activeObserver.observe === 'function') {
        activeObserver.observe(target);
      }
    });
    scheduleReveal(immediateTargets);
    return targets;
  }
  function bind() {
    if (isBound || !win || typeof win.addEventListener !== 'function') {
      return;
    }
    win.addEventListener('anima:page-transition-complete', () => {
      initialize(doc);
    });
    isBound = true;
  }
  return {
    initialize,
    bind,
    disconnect,
    revealTarget,
    revealTargets,
    stageTarget,
    prefersReducedMotion,
    isInViewport,
    getRevealObserverOptions,
    // Exposed for tests and for external consumers who want to pre-split
    // server-rendered headings (e.g. a future critical-path enhancement).
    splitHeadingForCurtain,
    replayKineticTitle,
    snapTitleToPreState,
    snapTargetToPreState,
    // Integrations (page-transition-gate, slick-gate) attach to this.
    // Getter so lazy creation still works: callers don't have to know
    // about the creation timing.
    get choreographer() {
      return getChoreographer();
    }
  };
}
module.exports = {
  createIntroAnimationsRuntime,
  getRevealObserverOptions,
  classifyTargetRole,
  TITLE_ROLE_SELECTORS,
  DELAY_WINDOW_BY_STYLE
};

/***/ },

/***/ 687
(module, __unused_webpack_exports, __webpack_require__) {

const {
  NEW_HERO_SELECTOR,
  OLD_HERO_SELECTOR
} = __webpack_require__(771);
const REVEAL_ROOT_SELECTORS = ['.wp-block-cover', '.wp-block-group', '.wp-block-columns', '.wp-block-media-text', '.wp-block-gallery', '.wp-block-image', '.wp-block-quote', '.wp-block-pullquote', '.wp-block-buttons', '.wp-block-button', '.wp-block-query .wp-block-post', '.nb-supernova-item'];
const FALLBACK_TARGET_SELECTORS = ['.wp-block-heading', '.wp-block-paragraph', '.wp-block-list', '.wp-block-table', '.wp-block-separator', '.wp-block-file', '.wp-block-embed', '.wp-block-post-title', '.wp-block-post-featured-image', '.wp-block-post-excerpt'];
const EXCLUDED_TARGET_SELECTORS = ['header', 'footer', '.js-page-transition-border', '.js-slide-wipe-loader', NEW_HERO_SELECTOR, OLD_HERO_SELECTOR, '.nb-supernova-item--scrolling-effect-parallax', '#wpadminbar', '[aria-hidden="true"]', '[inert]'];
function isExcludedTarget(node) {
  if (!node || typeof node.matches !== 'function' || typeof node.closest !== 'function') {
    return false;
  }
  return EXCLUDED_TARGET_SELECTORS.some(selector => node.matches(selector) || node.closest(selector));
}
function hasTrackedRevealAncestor(node, trackedNodes = []) {
  if (!node) {
    return false;
  }
  return trackedNodes.some(trackedNode => {
    return trackedNode !== node && typeof trackedNode.contains === 'function' && trackedNode.contains(node);
  });
}
function addTargetsForSelectors(root, selectors, trackedNodes) {
  selectors.forEach(selector => {
    const nodes = Array.from(root.querySelectorAll(selector));
    nodes.forEach(node => {
      if (!node || node.isConnected === false) {
        return;
      }
      if (trackedNodes.includes(node) || isExcludedTarget(node) || hasTrackedRevealAncestor(node, trackedNodes)) {
        return;
      }
      trackedNodes.push(node);
    });
  });
}
function collectRevealTargets(root) {
  if (!root || typeof root.querySelectorAll !== 'function') {
    return [];
  }
  const trackedNodes = [];
  addTargetsForSelectors(root, REVEAL_ROOT_SELECTORS, trackedNodes);
  addTargetsForSelectors(root, FALLBACK_TARGET_SELECTORS, trackedNodes);
  return trackedNodes;
}

// Kinetic-only extension: find heading-role nodes anywhere on the page so they
// can receive the word-curtain treatment, regardless of whether they live
// inside a tracked reveal-root container. Used by the runtime when the active
// animation style is 'kinetic'. For fade/slide/scale this helper is never
// called — those styles keep the original outer-only reveal semantics.
//
// Deliberately broader than `collectRevealTargets`:
//   - Selector list includes Nova Blocks' custom title classes
//     (.nb-collection__title, .nb-card__title) which aren't picked up by
//     Anima's standard fallback list.
//   - Excluded-zone list is SMALLER than the default one: we WANT footer
//     headings to animate under Kinetic (they're typographic moments too).
//     Only admin bar, site <header> chrome, hidden/inert nodes, and the
//     page-transition loader UI are excluded.
const KINETIC_TITLE_SELECTORS = ['h1', 'h2', 'h3', '.wp-block-heading', '.wp-block-post-title', '.nb-collection__title', '.nb-card__title'].join(',');
const KINETIC_EXCLUDED_ZONES = ['#wpadminbar', '[aria-hidden="true"]', '[inert]', '.js-page-transition-border', '.js-slide-wipe-loader', 'header'
// Intentionally NOT excluding .nb-supernova-item--scrolling-effect-parallax:
// the parallax container keeps its own scroll motion, but the title inside
// it (e.g., a single-project hero h1.wp-block-post-title) still benefits
// from the Kinetic word-curtain. The container itself isn't a primary
// intro target anyway (the base EXCLUDED_TARGET_SELECTORS list keeps the
// container static), so there's no conflicting outer animation.
].join(',');
function isInsideKineticExclusionZone(node) {
  if (!node || typeof node.closest !== 'function') {
    return false;
  }
  const hit = node.closest(KINETIC_EXCLUDED_ZONES);
  if (!hit) {
    return false;
  }

  // Slick carousels toggle aria-hidden="true" on inactive slides as part of
  // their rotation — but the slide content IS visible when the slide is
  // active. If the nearest exclusion-zone ancestor is a .slick-slide, let
  // the title through; the carousel replay observer will re-run its reveal
  // each time the slide becomes active.
  if (hit.classList && hit.classList.contains('slick-slide')) {
    return false;
  }
  return true;
}
function collectKineticTitleTargets(root, primaryTargets = []) {
  if (!root || typeof root.querySelectorAll !== 'function') {
    return [];
  }
  const primarySet = new Set(primaryTargets);
  const results = [];
  const seen = new Set();
  const candidates = Array.from(root.querySelectorAll(KINETIC_TITLE_SELECTORS));
  candidates.forEach(node => {
    if (!node || node.isConnected === false) {
      return;
    }

    // Already handled by the primary-target pipeline (or collected here earlier
    // in the loop) — skip to avoid double-staging.
    if (primarySet.has(node) || seen.has(node)) {
      return;
    }

    // Kinetic-specific exclusion zones. Intentionally more lenient than
    // EXCLUDED_TARGET_SELECTORS — footer is NOT listed, because users want
    // Kinetic to animate footer headings too. The aria-hidden check is
    // further narrowed in isInsideKineticExclusionZone so slick-slide
    // rotation doesn't hide every inactive slide's title permanently.
    if (isInsideKineticExclusionZone(node)) {
      return;
    }
    seen.add(node);
    results.push(node);
  });
  return results;
}
module.exports = {
  REVEAL_ROOT_SELECTORS,
  FALLBACK_TARGET_SELECTORS,
  EXCLUDED_TARGET_SELECTORS,
  KINETIC_TITLE_SELECTORS,
  KINETIC_EXCLUDED_ZONES,
  isExcludedTarget,
  hasTrackedRevealAncestor,
  collectRevealTargets,
  collectKineticTitleTargets
};

/***/ },

/***/ 233
(module) {

function matchesPilePattern({
  index,
  columns = 1,
  target3d = 'item',
  rule3d = 'odd'
}) {
  const normalizedColumns = Math.max(1, parseInt(columns, 10) || 1);
  if (target3d === 'column') {
    const column = index % normalizedColumns + 1;
    return rule3d === 'even' ? column % 2 === 0 : column % 2 === 1;
  }
  const position = index + 1;
  return rule3d === 'even' ? position % 2 === 0 : position % 2 === 1;
}
function getPilePatternSettings({
  className = '',
  columns = 1
} = {}) {
  return {
    has3d: className.includes('nb-supernova--pile-3d'),
    target3d: className.includes('nb-supernova--pile-3d-target-column') ? 'column' : 'item',
    rule3d: className.includes('nb-supernova--pile-3d-rule-even') ? 'even' : 'odd',
    columns: Math.max(1, parseInt(columns, 10) || 1)
  };
}
function shouldParallaxItem({
  has3d = false,
  index,
  columns = 1,
  target3d = 'item',
  rule3d = 'odd'
}) {
  if (!has3d) {
    return true;
  }
  return matchesPilePattern({
    index,
    columns,
    target3d,
    rule3d
  });
}
module.exports = {
  getPilePatternSettings,
  matchesPilePattern,
  shouldParallaxItem
};

/***/ },

/***/ 33
(module, __unused_webpack_exports, __webpack_require__) {

const {
  createSiteFrameRuntime
} = __webpack_require__(869);
class SiteFrame {
  constructor({
    window: win = typeof window !== 'undefined' ? window : null,
    runtime = createSiteFrameRuntime()
  } = {}) {
    this.window = win;
    this.runtime = runtime;
    this.onResize = this.onResize.bind(this);
    this.runtime.sync();
    if (this.window && typeof this.window.addEventListener === 'function') {
      this.window.addEventListener('resize', this.onResize);
    }
  }
  onResize() {
    this.runtime.sync();
  }
}
module.exports = SiteFrame;

/***/ },

/***/ 869
(module) {

const SITE_FRAME_CLONE_ATTR = 'siteFrameClone';
function getChildElements(node) {
  if (!node || !node.children) {
    return [];
  }
  return Array.from(node.children);
}
function removeSiteFrameMobileMenuClones(targetList) {
  if (!targetList) {
    return 0;
  }
  let removedCount = 0;
  getChildElements(targetList).forEach(item => {
    if (item?.dataset?.[SITE_FRAME_CLONE_ATTR] !== 'true') {
      return;
    }
    if (typeof item.remove === 'function') {
      item.remove();
      removedCount += 1;
    }
  });
  return removedCount;
}
function appendSiteFrameMobileMenuItems(sourceList, targetList) {
  if (!sourceList || !targetList) {
    return 0;
  }
  removeSiteFrameMobileMenuClones(targetList);
  let appendedCount = 0;
  getChildElements(sourceList).forEach(item => {
    if (!item || typeof item.cloneNode !== 'function') {
      return;
    }
    const clone = item.cloneNode(true);
    if (!clone.dataset) {
      clone.dataset = {};
    }
    clone.dataset[SITE_FRAME_CLONE_ATTR] = 'true';
    if (clone.classList && typeof clone.classList.add === 'function') {
      clone.classList.add('menu-item--site-frame-clone');
    }
    if (typeof targetList.appendChild === 'function') {
      targetList.appendChild(clone);
      appendedCount += 1;
    }
  });
  return appendedCount;
}
function syncSiteFrameMobileMenu({
  enabled = false,
  belowLap = false,
  sourceList = null,
  targetList = null
} = {}) {
  if (!enabled || !belowLap || !sourceList || !targetList) {
    removeSiteFrameMobileMenuClones(targetList);
    return 0;
  }
  return appendSiteFrameMobileMenuItems(sourceList, targetList);
}
function createSiteFrameRuntime({
  window: win = typeof window !== 'undefined' ? window : null,
  document: doc = typeof document !== 'undefined' ? document : null,
  sourceSelector = '.c-site-frame__menu',
  targetSelector = '.nb-header .nb-navigation--primary .menu',
  isBelowLap = () => !!win && typeof win.matchMedia === 'function' && win.matchMedia('not screen and (min-width: 1024px)').matches
} = {}) {
  function hasEnabledBodyClass() {
    return !!doc && !!doc.body && !!doc.body.classList && doc.body.classList.contains('has-site-frame-menu');
  }
  function getSourceList() {
    return doc && typeof doc.querySelector === 'function' ? doc.querySelector(sourceSelector) : null;
  }
  function getTargetList() {
    return doc && typeof doc.querySelector === 'function' ? doc.querySelector(targetSelector) : null;
  }
  function sync() {
    return syncSiteFrameMobileMenu({
      enabled: hasEnabledBodyClass(),
      belowLap: isBelowLap(),
      sourceList: getSourceList(),
      targetList: getTargetList()
    });
  }
  return {
    sync,
    removeClones() {
      return removeSiteFrameMobileMenuClones(getTargetList());
    }
  };
}
module.exports = {
  SITE_FRAME_CLONE_ATTR,
  appendSiteFrameMobileMenuItems,
  createSiteFrameRuntime,
  removeSiteFrameMobileMenuClones,
  syncSiteFrameMobileMenu
};

/***/ }

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/************************************************************************/
// This entry needs to be wrapped in an IIFE because it needs to be in strict mode.
(() => {
"use strict";

;// external "jQuery"
const external_jQuery_namespaceObject = jQuery;
var external_jQuery_default = /*#__PURE__*/__webpack_require__.n(external_jQuery_namespaceObject);
;// ./src/js/utils.js



const debounce = (func, wait) => {
  let timeout = null;
  return function () {
    const context = this;
    const args = arguments;
    const later = () => {
      func.apply(context, args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};
const hasTouchScreen = function () {
  var hasTouchScreen = false;
  if ('maxTouchPoints' in navigator) {
    hasTouchScreen = navigator.maxTouchPoints > 0;
  } else if ('msMaxTouchPoints' in navigator) {
    hasTouchScreen = navigator.msMaxTouchPoints > 0;
  } else {
    var mQ = window.matchMedia && matchMedia('(pointer:coarse)');
    if (mQ && mQ.media === '(pointer:coarse)') {
      hasTouchScreen = !!mQ.matches;
    } else if ('orientation' in window) {
      hasTouchScreen = true;
    } else {
      var UA = navigator.userAgent;
      hasTouchScreen = /\b(BlackBerry|webOS|iPhone|IEMobile)\b/i.test(UA) || /\b(Android|Windows Phone|iPad|iPod)\b/i.test(UA);
    }
  }
  return hasTouchScreen;
};
function setAndResetElementStyles(element, props = {}) {
  const $element = external_jQuery_default()(element);
  $element.css(props);
  Object.keys(props).forEach(key => {
    props[key] = '';
  });
  if (window.requestIdleCallback) {
    window.requestIdleCallback(() => {
      $element.css(props);
    });
  } else {
    setTimeout(() => {
      $element.css(props);
    }, 0);
  }
}
const getColorSetClasses = element => {
  const classAttr = element?.getAttribute('class');
  if (!classAttr) {
    return [];
  }
  const classes = classAttr.split(/\s+/);
  return classes.filter(classname => {
    return classname.search('sm-palette-') !== -1 || classname.search('sm-variation-') !== -1;
  });
};
const addClass = (element, classes) => {
  const classesArray = classes.split(/\s+/).filter(x => x.trim().length);
  if (classesArray.length) {
    element.classList.add(...classesArray);
  }
};
const removeClass = (element, classes) => {
  const classesArray = classes.split(/\s+/).filter(x => x.trim().length);
  if (classesArray.length) {
    element.classList.remove(...classesArray);
  }
};
const hasClass = (element, className) => {
  return element.classList.contains(className);
};
const toggleClasses = (element, classesToAdd = '') => {
  const prefixes = ['sm-palette-', 'sm-variation-', 'sm-color-signal-'];
  const classesToRemove = Array.from(element.classList).filter(classname => {
    return prefixes.some(prefix => classname.indexOf(prefix) > -1);
  });
  element.classList.remove(...classesToRemove);
  addClass(element, classesToAdd);
};
function getFirstChild(el) {
  var firstChild = el.firstChild;
  while (firstChild != null && firstChild.nodeType === 3) {
    // skip TextNodes
    firstChild = firstChild.nextSibling;
  }
  return firstChild;
}
const getFirstBlock = element => {
  if (!element || !element.children.length) {
    return element;
  }
  const firstBlock = element.children[0];
  if (hasClass(firstBlock, 'nb-sidecar')) {
    const content = firstBlock.querySelector('.nb-sidecar-area--content');
    if (content && content.children.length) {
      return getFirstBlock(content);
    }
  }
  return firstBlock;
};
;// ./src/js/components/globalService.js


class GlobalService {
  constructor() {
    this.props = {};
    this.newProps = {};
    this.renderCallbacks = [];
    this.resizeCallbacks = [];
    this.debouncedResizeCallbacks = [];
    this.observeCallbacks = [];
    this.scrollCallbacks = [];
    this.currentMutationList = [];
    this.frameRendered = true;
    this.useOrientation = hasTouchScreen() && 'orientation' in window;
    this._init();
  }
  _init() {
    const $window = external_jQuery_default()(window);
    const updateProps = this._updateProps.bind(this);
    const renderLoop = this._renderLoop.bind(this);
    this._debouncedResizeCallback = debounce(this._resizeCallbackToBeDebounced.bind(this), 100);

    // now
    updateProps();

    // on document ready
    external_jQuery_default()(updateProps);
    this._bindOnResize();
    this._bindOnScroll();
    this._bindOnLoad();
    this._bindObserver();
    this._bindCustomizer();
    requestAnimationFrame(renderLoop);
  }
  _bindOnResize() {
    const $window = external_jQuery_default()(window);
    const updateProps = this._updateProps.bind(this);
    if (this.useOrientation) {
      $window.on('orientationchange', () => {
        $window.one('resize', updateProps);
      });
    } else {
      $window.on('resize', updateProps);
    }
  }
  _bindOnScroll() {
    external_jQuery_default()(window).on('scroll', this._updateScroll.bind(this));
  }
  _bindOnLoad() {
    external_jQuery_default()(window).on('load', this._updateProps.bind(this));
  }
  _bindObserver() {
    const self = this;
    const observeCallback = this._observeCallback.bind(this);
    const observeAndUpdateProps = () => {
      observeCallback();
      self.currentMutationList = [];
    };
    const debouncedObserveCallback = debounce(observeAndUpdateProps, 300);
    if (!window.MutationObserver) {
      return;
    }
    const observer = new MutationObserver(function (mutationList) {
      self.currentMutationList = self.currentMutationList.concat(mutationList);
      debouncedObserveCallback();
    });
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }
  _bindCustomizer() {
    if (typeof wp !== 'undefined' && typeof wp.customize !== 'undefined') {
      if (typeof wp.customize.selectiveRefresh !== 'undefined') {
        wp.customize.selectiveRefresh.bind('partial-content-rendered', this._updateProps.bind(this));
      }
      wp.customize.bind('change', debounce(this._updateProps.bind(this), 100));
    }
  }
  _updateProps(force = false) {
    this._updateSize(force);
    this._updateScroll(force);
  }
  _observeCallback() {
    const mutationList = this.currentMutationList;
    external_jQuery_default().each(this.observeCallbacks, function (i, fn) {
      fn(mutationList);
    });
  }
  _renderLoop() {
    if (!this.frameRendered) {
      this._renderCallback();
      this.frameRendered = true;
    }
    window.requestAnimationFrame(this._renderLoop.bind(this));
  }
  _renderCallback() {
    const passedArguments = arguments;
    external_jQuery_default().each(this.renderCallbacks, function (i, fn) {
      fn(...passedArguments);
    });
  }
  _resizeCallback() {
    const passedArguments = arguments;
    external_jQuery_default().each(this.resizeCallbacks, function (i, fn) {
      fn(...passedArguments);
    });
  }
  _resizeCallbackToBeDebounced() {
    const passedArguments = arguments;
    external_jQuery_default().each(this.debouncedResizeCallbacks, function (i, fn) {
      fn(...passedArguments);
    });
  }
  _scrollCallback() {
    const passedArguments = arguments;
    external_jQuery_default().each(this.scrollCallbacks, function (i, fn) {
      fn(...passedArguments);
    });
  }
  _updateScroll(force = false) {
    this.newProps = Object.assign({}, this.newProps, {
      scrollY: window.scrollY,
      scrollX: window.scrollX
    });
    this._shouldUpdate(this._scrollCallback.bind(this));
  }
  _updateSize(force = false) {
    const body = document.body;
    const html = document.documentElement;
    const bodyScrollHeight = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight);
    const htmlScrollHeight = Math.max(html.scrollHeight, html.offsetHeight);
    this.newProps = Object.assign({}, this.newProps, {
      scrollHeight: Math.max(bodyScrollHeight, htmlScrollHeight),
      adminBarHeight: this.getAdminBarHeight(),
      windowWidth: this.useOrientation && window.screen && window.screen.availWidth || window.innerWidth,
      windowHeight: this.useOrientation && window.screen && window.screen.availHeight || window.innerHeight
    });
    this._shouldUpdate(() => {
      this._resizeCallback();
      this._debouncedResizeCallback();
    });
  }
  _shouldUpdate(callback, force = false) {
    if (this._hasNewProps() || force) {
      this.props = Object.assign({}, this.props, this.newProps);
      this.newProps = {};
      this.frameRendered = false;
      if (typeof callback === 'function') {
        callback();
      }
    }
  }
  _hasNewProps() {
    return Object.keys(this.newProps).some(key => {
      return this.newProps[key] !== this.props[key];
    });
  }
  getAdminBarHeight() {
    const adminBar = document.getElementById('wpadminbar');
    if (adminBar) {
      const box = adminBar.getBoundingClientRect();
      return box.height;
    }
    return 0;
  }
  registerOnResize(fn) {
    if (typeof fn === 'function' && this.resizeCallbacks.indexOf(fn) < 0) {
      this.resizeCallbacks.push(fn);
    }
  }
  registerOnDeouncedResize(fn) {
    if (typeof fn === 'function' && this.resizeCallbacks.indexOf(fn) < 0) {
      this.debouncedResizeCallbacks.push(fn);
    }
  }
  registerOnScroll(fn) {
    if (typeof fn === 'function' && this.scrollCallbacks.indexOf(fn) < 0) {
      this.scrollCallbacks.push(fn);
    }
  }
  registerObserverCallback(fn) {
    if (typeof fn === 'function' && this.observeCallbacks.indexOf(fn) < 0) {
      this.observeCallbacks.push(fn);
    }
  }
  registerRender(fn) {
    if (typeof fn === 'function' && this.renderCallbacks.indexOf(fn) < 0) {
      this.renderCallbacks.push(fn);
    }
  }
  getProps() {
    return this.props;
  }
}
/* harmony default export */ const globalService = (new GlobalService());
;// ./src/js/components/hero.js

class Hero {
  constructor(element) {
    this.element = element;
    this.progress = 0;
    this.timeline = gsap.timeline({
      paused: true,
      onComplete: () => {
        this.paused = true;
      }
    });
    this.pieces = this.getMarkupPieces();
    this.paused = false;
    this.offset = 0;
    this.reduceMotion = false;
    this.update();
    this.updateOnScroll();
    this.init();
  }
  init() {
    globalService.registerOnScroll(() => {
      this.update();
    });
    globalService.registerRender(() => {
      this.updateOnScroll();
    });
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    mediaQuery.addEventListener('change', () => {
      this.reduceMotion = mediaQuery.matches;
      this.updateOnScroll();
    });
    this.reduceMotion = mediaQuery.matches;
    this.addIntroToTimeline();
    this.timeline.addLabel('middle');
    this.addOutroToTimeline();
    this.timeline.addLabel('end');
    this.pauseTimelineOnScroll();
    if (this.reduceMotion) {
      const middleTime = this.labels.middle;
      const endTime = this.labels.end;
      const minTlProgress = middleTime / endTime;
      this.paused = true;
      this.timeline.progress(minTlProgress);
    } else {
      this.timeline.play();
    }
  }
  update() {
    const {
      scrollY
    } = globalService.getProps();
    this.box = this.element.getBoundingClientRect();
    this.view = {
      left: this.box.left,
      top: this.box.top + scrollY,
      width: this.box.width,
      height: this.box.height
    };
  }
  updateOnScroll() {
    const {
      scrollY,
      scrollHeight,
      windowHeight
    } = globalService.getProps();

    // used to calculate animation progress
    const length = windowHeight * 0.5;
    const middleMin = 0;
    const middleMax = scrollHeight - windowHeight - length * 0.5;
    const middle = this.view.top + (this.box.height - windowHeight) * 0.5;
    const middleMid = Math.max(middleMin, Math.min(middle, middleMax));
    this.start = middleMid - length * 0.5;
    this.end = this.start + length;
    this.progress = (scrollY - this.start) / (this.end - this.start);
    if (this.reduceMotion) {
      const middleTime = this.timeline.labels.middle;
      const endTime = this.timeline.labels.end;
      const minTlProgress = middleTime / endTime;
      this.progress = minTlProgress;
    }
    this.updateTimelineOnScroll();
  }
  updateTimelineOnScroll() {
    if (!this.paused) {
      return;
    }
    const currentProgress = this.timeline.progress();
    const middleTime = this.timeline.labels.middle;
    const endTime = this.timeline.labels.end;
    const minTlProgress = middleTime / endTime;
    let newTlProgress = (this.progress - 0.5) * 2 * (1 - minTlProgress) + minTlProgress;
    newTlProgress = Math.min(Math.max(minTlProgress, newTlProgress), 1);
    if (currentProgress === newTlProgress) {
      return;
    }
    this.timeline.progress(newTlProgress);
  }
  getMarkupPieces() {
    const container = jQuery(this.element).find('.novablocks-hero__inner-container, .nb-supernova-item__inner-container');
    const headline = container.children().filter('.c-headline').first();
    const title = headline.find('.c-headline__primary');
    const subtitle = headline.find('.c-headline__secondary');
    const separator = headline.next('.wp-block-separator');
    const sepFlower = separator.find('.c-separator__symbol');
    const sepLine = separator.find('.c-separator__line');
    const sepArrow = separator.find('.c-separator__arrow');
    const othersBefore = headline.prevAll();
    const othersAfter = headline.length ? headline.nextAll().not(separator).not('.nb-scroll-indicator') : container.children().not('.nb-scroll-indicator');
    return {
      headline,
      title,
      subtitle,
      separator,
      sepFlower,
      sepLine,
      sepArrow,
      othersBefore,
      othersAfter
    };
  }
  addIntroToTimeline() {
    const timeline = this.timeline;
    const {
      windowWidth
    } = globalService.getProps();
    const {
      headline,
      title,
      subtitle,
      separator,
      sepFlower,
      sepLine,
      sepArrow,
      othersBefore,
      othersAfter
    } = this.pieces;
    if (title.length && title.text().trim().length) {
      this.splitTitle = new SplitText(title, {
        wordsClass: 'c-headline__word'
      });
      this.splitTitle.lines.forEach(line => {
        const words = Array.from(line.children);
        const letters = [];
        words.forEach(word => {
          letters.push(...word.children);
        });
        letters.forEach(letter => {
          const box = letter.getBoundingClientRect();
          const width = letter.offsetWidth;
          const offset = box.x - windowWidth / 2;
          const offsetPercent = 2 * offset / windowWidth;
          const move = 400 * letters.length * offsetPercent;
          timeline.from(letter, {
            duration: 0.72,
            x: move,
            ease: 'power.out'
          }, 0);
        });
      });
      timeline.fromTo(title, {
        opacity: 0
      }, {
        opacity: 1,
        duration: 0.89,
        ease: 'power.out'
      }, 0);

      // aici era title dar facea un glitch ciudat
      timeline.fromTo(headline, {
        'y': 30
      }, {
        'y': 0,
        duration: 1,
        ease: 'power.out'
      }, 0);
    }
    if (subtitle.length) {
      timeline.fromTo(subtitle, {
        opacity: 0
      }, {
        opacity: 1,
        duration: 0.65,
        ease: 'power4.out'
      }, '-=0.65');
      timeline.fromTo(subtitle, {
        y: 30
      }, {
        y: 0,
        duration: 0.9,
        ease: 'power4.out'
      }, '-=0.65');
    }
    if (separator.length) {
      if (sepFlower.length) {
        timeline.fromTo(sepFlower, {
          opacity: 0
        }, {
          opacity: 1,
          duration: 0.15,
          ease: 'power4.out'
        }, '-=0.6');
        timeline.fromTo(sepFlower, {
          rotation: -270
        }, {
          rotation: 0,
          duration: 0.55,
          ease: 'back.out'
        }, '-=0.5');
      }
      if (sepLine.length) {
        timeline.fromTo(sepLine, {
          width: 0
        }, {
          width: '42%',
          opacity: 1,
          duration: 0.6,
          ease: 'power4.out'
        }, '-=0.55');
        timeline.fromTo(separator, {
          width: 0
        }, {
          width: '100%',
          opacity: 1,
          duration: 0.6,
          ease: 'power4.out'
        }, '-=0.6');
      }
      if (sepArrow.length) {
        timeline.fromTo(sepArrow, {
          opacity: 0
        }, {
          opacity: 1,
          duration: 0.2,
          ease: 'power4.out'
        }, '-=0.27');
      }
    }
    if (othersAfter.length) {
      timeline.fromTo(othersAfter, {
        opacity: 0
      }, {
        opacity: 1,
        duration: 0.5,
        ease: 'power4.out'
      }, '-=0.28');
      timeline.fromTo(othersAfter, {
        y: -20
      }, {
        y: 0,
        duration: 0.75
      }, '-=0.5');
    }
    if (othersBefore.length) {
      timeline.fromTo(othersBefore, {
        opacity: 0
      }, {
        opacity: 1,
        duration: 0.5,
        ease: 'power4.out'
      }, '-=0.75');
      timeline.fromTo(othersBefore, {
        y: 20
      }, {
        y: 0,
        duration: 0.75
      }, '-=0.75');
    }
    this.timeline = timeline;
  }
  addOutroToTimeline() {
    const {
      title,
      subtitle,
      othersBefore,
      othersAfter,
      separator,
      sepLine,
      sepFlower,
      sepArrow
    } = this.pieces;
    const timeline = this.timeline;
    if (title.length) {
      timeline.fromTo(title, {
        y: 0
      }, {
        opacity: 0,
        y: -60,
        duration: 1.08,
        ease: 'power1.in'
      }, 'middle');
    }
    if (subtitle.length) {
      timeline.to(subtitle, {
        opacity: 0,
        y: -90,
        duration: 1.08,
        ease: 'power1.in'
      }, 'middle');
    }
    if (othersBefore.length) {
      timeline.to(othersBefore, {
        y: 60,
        opacity: 0,
        duration: 1.08,
        ease: 'power1.in'
      }, 'middle');
    }
    if (othersAfter.length) {
      timeline.to(othersAfter, {
        y: 60,
        opacity: 0,
        duration: 1.08,
        ease: 'power1.in'
      }, 'middle');
    }
    if (sepLine.length) {
      timeline.to(sepLine, {
        width: '0%',
        opacity: 0,
        duration: 0.86,
        ease: 'power1.in'
      }, '-=0.94');
    }
    if (separator.length) {
      timeline.to(separator, {
        width: '0%',
        opacity: 0,
        duration: 0.86,
        ease: 'power1.in'
      }, '-=0.86');
    }
    if (sepFlower.length) {
      timeline.to(sepFlower, {
        rotation: 180,
        duration: 1
      }, '-=1.08');
    }
    if (sepFlower.length) {
      timeline.to(sepFlower, {
        opacity: 0,
        duration: 0.11
      }, '-=0.03');
    }
    if (sepArrow.length) {
      timeline.to(sepArrow, {
        opacity: 0,
        duration: 0.14
      }, '-=1.08');
    }
    this.timeline = timeline;
  }
  revertTitle() {
    if (typeof this.splitTitle !== 'undefined') {
      this.splitTitle.revert();
    }
  }
  pauseTimelineOnScroll() {
    const middleTime = this.timeline.labels.middle;
    const endTime = this.timeline.labels.end;
    this.timeline.eventCallback('onUpdate', tl => {
      const time = this.timeline.time();

      // calculate the current timeline progress relative to middle and end labels
      // in such a way that timelineProgress is 0.5 for middle and 1 for end
      // because we don't want the animation to be stopped before the middle label
      const tlProgress = (time - middleTime) / (endTime - middleTime);
      const pastMiddle = time > middleTime;
      const pastScroll = tlProgress * 0.5 + 0.5 >= this.progress;
      if (pastMiddle && pastScroll) {
        this.timeline.pause();
        this.revertTitle();
        this.timeline.eventCallback('onUpdate', null);
        this.paused = true;
      }
    }, ['{self}']);
  }
}
// EXTERNAL MODULE: ./src/js/components/hero-init-filter.js
var hero_init_filter = __webpack_require__(771);
var hero_init_filter_default = /*#__PURE__*/__webpack_require__.n(hero_init_filter);
;// ./src/js/components/commentsArea.js

class CommentsArea {
  constructor(element) {
    this.$element = external_jQuery_default()(element);
    this.$checkbox = this.$element.find('.c-comments-toggle__checkbox');
    this.$content = this.$element.find('.comments-area__content');
    this.$contentWrap = this.$element.find('.comments-area__wrap');

    // overwrite CSS that hides the comments area content
    this.$contentWrap.css('display', 'block');
    this.$checkbox.on('change', this.onChange.bind(this));
    this.checkWindowLocationComments();
  }
  onChange() {
    this.toggle(false);
  }
  toggle(instant = false) {
    const $contentWrap = this.$contentWrap;
    const isChecked = this.$checkbox.prop('checked');
    const newHeight = isChecked ? this.$content.outerHeight() : 0;
    if (instant) {
      $contentWrap.css('height', newHeight);
    } else {
      gsap.to($contentWrap, {
        duration: 0.4,
        height: newHeight,
        onComplete: function () {
          if (isChecked) {
            $contentWrap.css('height', '');
          }
        }
      });
    }
  }
  checkWindowLocationComments() {
    if (window.location.href.indexOf('#comment') === -1) {
      this.$checkbox.prop('checked', false);
      this.toggle(true);
    }
  }
}
;// ./src/js/components/mqService.js

class mqService {
  constructor() {
    this.breakpoints = {
      mobile: '480px',
      tablet: '768px',
      lap: '1024px',
      desktop: '1440px'
    };
    this.above = {};
    this.below = {};
    globalService.registerOnDeouncedResize(this.onResize.bind(this));
    this.onResize();
  }
  onResize() {
    Object.keys(this.breakpoints).forEach(key => {
      const breakpoint = this.breakpoints[key];
      this.above[key] = !!window.matchMedia(`not screen and (min-width: ${breakpoint})`).matches;
      this.below[key] = !!window.matchMedia(`not screen and (min-width: ${breakpoint})`).matches;
    });
  }
}
/* harmony default export */ const components_mqService = (new mqService());
;// ./src/js/components/navbar.js



const MENU_ITEM = '.menu-item, .page_item';
const MENU_ITEM_WITH_CHILDREN = '.menu-item-has-children, .page_item_has_children';
const SUBMENU = '.sub-menu, .children';
const SUBMENU_LEFT_CLASS = 'has-submenu-left';
const HOVER_CLASS = 'hover';
class Navbar {
  constructor() {
    this.$menuItems = external_jQuery_default()(MENU_ITEM);
    this.$menuItemsWithChildren = this.$menuItems.filter(MENU_ITEM_WITH_CHILDREN).removeClass(HOVER_CLASS);
    this.$menuItemsWithChildrenLinks = this.$menuItemsWithChildren.children('a');
    this.initialize();
  }
  initialize() {
    this.onResize();
    this.initialized = true;
    globalService.registerOnDeouncedResize(this.onResize.bind(this));
  }
  onResize() {
    // we are on desktop
    if (!components_mqService.below.lap) {
      this.addSubMenusLeftClass();
      if (this.initialized && !this.desktop) {
        this.unbindClick();
      }
      if (!this.initialized || !this.desktop) {
        this.bindHoverIntent();
      }
      this.desktop = true;
      return;
    }
    this.removeSubMenusLeftClass();
    if (this.initialized && this.desktop) {
      this.unbindHoverIntent();
    }
    if (!this.initialized || this.desktop) {
      this.bindClick();
    }
    this.desktop = false;
  }
  addSubMenusLeftClass() {
    const {
      windowWidth
    } = globalService.getProps();
    this.$menuItemsWithChildren.each(function (index, obj) {
      const $obj = external_jQuery_default()(obj);
      const $subMenu = $obj.children(SUBMENU),
        subMenuWidth = $subMenu.outerWidth(),
        subMenuOffSet = $subMenu.offset(),
        availableSpace = windowWidth - subMenuOffSet.left;
      if (availableSpace < subMenuWidth) {
        $obj.addClass(SUBMENU_LEFT_CLASS);
      }
    });
  }
  removeSubMenusLeftClass() {
    this.$menuItemsWithChildren.removeClass(SUBMENU_LEFT_CLASS);
  }
  onClickMobile(event) {
    const $link = external_jQuery_default()(this);
    const $siblings = $link.parent().siblings().not($link);
    if ($link.is('.active')) {
      return;
    }
    event.preventDefault();
    $link.addClass('active').parent().addClass(HOVER_CLASS);
    $siblings.removeClass(HOVER_CLASS);
    $siblings.find('.active').removeClass('active');
  }
  bindClick() {
    this.$menuItemsWithChildrenLinks.on('click', this.onClickMobile);
  }
  unbindClick() {
    this.$menuItemsWithChildrenLinks.off('click', this.onClickMobile);
  }
  bindHoverIntent() {
    this.$menuItems.hoverIntent({
      out: function () {
        external_jQuery_default()(this).removeClass(HOVER_CLASS);
      },
      over: function () {
        external_jQuery_default()(this).addClass(HOVER_CLASS);
      },
      timeout: 200
    });
  }
  unbindHoverIntent() {
    this.$menuItems.off('mousemove.hoverIntent mouseenter.hoverIntent mouseleave.hoverIntent');
    delete this.$menuItems.hoverIntent_t;
    delete this.$menuItems.hoverIntent_s;
  }
}
;// ./src/js/components/base-component.js

class BaseComponent {
  constructor() {
    globalService.registerOnResize(this.onResize.bind(this));
    globalService.registerOnDeouncedResize(this.onDebouncedResize.bind(this));
  }
  onResize() {}
  onDebouncedResize() {}
}
/* harmony default export */ const base_component = (BaseComponent);
;// ./src/js/components/search-overlay.js



const SEARCH_OVERLAY_OPEN_CLASS = 'has-search-overlay';
const ESC_KEY_CODE = 27;
class SearchOverlay extends base_component {
  constructor() {
    super();
    this.$searchOverlay = external_jQuery_default()('.c-search-overlay');
    this.initialize();
    this.onDebouncedResize();
  }
  initialize() {
    external_jQuery_default()(document).on('click', '.menu-item--search a', this.openSearchOverlay);
    external_jQuery_default()(document).on('click', '.c-search-overlay__cancel', this.closeSearchOverlay);
    external_jQuery_default()(document).on('keydown', this.closeSearchOverlayOnEsc);
  }
  onDebouncedResize() {
    setAndResetElementStyles(this.$searchOverlay, {
      transition: 'none'
    });
  }
  openSearchOverlay(e) {
    e.preventDefault();
    external_jQuery_default()('body').toggleClass(SEARCH_OVERLAY_OPEN_CLASS);
    external_jQuery_default()('.c-search-overlay__form .search-field').focus();
  }
  closeSearchOverlayOnEsc(e) {
    if (e.keyCode === ESC_KEY_CODE) {
      external_jQuery_default()('body').removeClass(SEARCH_OVERLAY_OPEN_CLASS);
      external_jQuery_default()('.c-search-overlay__form .search-field').blur();
    }
  }
  closeSearchOverlay(e) {
    e.preventDefault();
    external_jQuery_default()('body').removeClass(SEARCH_OVERLAY_OPEN_CLASS);
  }
}
/* harmony default export */ const search_overlay = (SearchOverlay);
// EXTERNAL MODULE: ./src/js/components/site-frame/index.js
var site_frame = __webpack_require__(33);
var site_frame_default = /*#__PURE__*/__webpack_require__.n(site_frame);
;// ./src/js/components/pile-parallax/index.js
/**
 * Pile Parallax — differential parallax scrolling for Nova Blocks collection grids.
 *
 * Ported from Pile theme's ArchiveParallax.js.
 * Uses vanilla JS + requestAnimationFrame — no GSAP dependency.
 *
 * Two linked features:
 *  1. 3D Grid: applies `js-3d` to the same item/column odd/even pattern used by
 *     Nova Blocks so the frontend matches the editor and plugin CSS.
 *  2. Parallax Scrolling: when 3D is enabled, only the selected 3D pattern gets
 *     translated on scroll; otherwise the effect applies to every item.
 */

const {
  getPilePatternSettings,
  matchesPilePattern,
  shouldParallaxItem
} = __webpack_require__(233);
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
  return Math.max(body ? body.scrollHeight : 0, html ? html.scrollHeight : 0);
}

/**
 * Add only the missing top/bottom space needed for parallax near viewport edges.
 * Mirrors Pile's ArchiveParallax.addMissingPadding() behavior.
 */
function addMissingPadding(layout, items, parallaxAmount, windowHeight) {
  if (!layout) {
    return;
  }
  let maxMissingTop = 0;
  let maxMissingBottom = 0;

  // Remove previously applied inline padding before recomputing.
  layout.style.paddingTop = '';
  layout.style.paddingBottom = '';
  const contentTop = 0;
  const contentBottom = getDocumentHeight();
  items.forEach(item => {
    item.style.transform = '';
    const rect = item.getBoundingClientRect();
    const itemTop = rect.top + window.scrollY;
    const itemHeight = item.offsetHeight;
    const toTop = itemTop + itemHeight / 2 - contentTop;
    const toBottom = contentBottom - itemTop - itemHeight / 2;
    const missingTop = toTop < windowHeight / 2 ? windowHeight / 2 - toTop : 0;
    const missingBottom = toBottom < windowHeight / 2 ? windowHeight / 2 - toBottom : 0;
    const paddingLimit = itemHeight * parallaxAmount / 2;
    maxMissingTop = Math.max(Math.min(missingTop, paddingLimit), maxMissingTop);
    maxMissingBottom = Math.max(Math.min(missingBottom, paddingLimit), maxMissingBottom);
  });
  if (!maxMissingTop && !maxMissingBottom) {
    return;
  }
  const computedStyles = window.getComputedStyle(layout);
  const basePaddingTop = parseFloat(computedStyles.paddingTop) || 0;
  const basePaddingBottom = parseFloat(computedStyles.paddingBottom) || 0;
  layout.style.paddingTop = `${(basePaddingTop + maxMissingTop).toFixed(2)}px`;
  layout.style.paddingBottom = `${(basePaddingBottom + maxMissingBottom).toFixed(2)}px`;
}

/**
 * Apply 3D grid classes to items in a collection.
 * Purely visual: adds `js-3d` class for CSS padding using Nova's selected pattern.
 */
function apply3dClasses(el) {
  const {
    columns,
    target3d,
    rule3d
  } = getPilePatternSettings({
    className: el.className,
    columns: parseInt(el.dataset.columns, 10) || 3
  });
  const items = el.querySelectorAll(ITEM_SELECTOR);
  items.forEach((item, index) => {
    item.classList.toggle('js-3d', matchesPilePattern({
      index,
      columns,
      target3d,
      rule3d
    }));
  });
}

/**
 * Initialize parallax for all matching blocks on the page.
 */
function initialize() {
  blocks = [];

  // 1. Apply 3D classes to all 3D grid blocks (independent of parallax).
  const grid3dElements = document.querySelectorAll(GRID_3D_SELECTOR);
  grid3dElements.forEach(apply3dClasses);

  // 2. Set up parallax scrolling for blocks that have it enabled.
  const parallaxElements = document.querySelectorAll(PARALLAX_SELECTOR);
  const windowHeight = window.innerHeight;
  // Reduce only the positive (downward) phase to avoid oversized blank bands at
  // the top of dense grids, while keeping the negative (upward) phase fully
  // visible so the parallax effect remains obvious during scroll.
  positiveOffsetFactor = 0.35;
  parallaxElements.forEach(el => {
    const amount = parseFloat(el.dataset.pileParallaxAmount) || 0;
    const parallaxAmount = amount / 100;
    const layout = el.querySelector('.nb-collection__layout');
    const pilePattern = getPilePatternSettings({
      className: el.className,
      columns: parseInt(el.dataset.columns, 10) || 3
    });
    if (amount <= 0) {
      if (layout) {
        layout.style.paddingTop = '';
        layout.style.paddingBottom = '';
      }
      return;
    }
    const items = el.querySelectorAll(ITEM_SELECTOR);
    if (!items.length) {
      if (layout) {
        layout.style.paddingTop = '';
        layout.style.paddingBottom = '';
      }
      return;
    }
    const animatedItems = Array.from(items).filter((item, index) => {
      const shouldAnimate = shouldParallaxItem({
        ...pilePattern,
        index
      });
      if (!shouldAnimate) {
        item.style.transform = '';
      }
      return shouldAnimate;
    });
    if (!animatedItems.length) {
      if (layout) {
        layout.style.paddingTop = '';
        layout.style.paddingBottom = '';
      }
      return;
    }

    // Match Pile: compute extra padding before measuring per-item scroll windows.
    addMissingPadding(layout, animatedItems, parallaxAmount, windowHeight);
    const itemsData = [];
    animatedItems.forEach(item => {
      // Reset transform before measuring positions.
      item.style.transform = '';
      const height = item.offsetHeight;
      const initialTop = height * parallaxAmount / 2;
      const travel = initialTop;

      // Cache the item's absolute top position for scroll-window calculation.
      const rect = item.getBoundingClientRect();
      const itemTop = rect.top + window.scrollY;

      // Scroll window: item enters viewport at bottom → leaves at top.
      const scrollStart = itemTop - windowHeight;
      const scrollEnd = itemTop + height;
      itemsData.push({
        el: item,
        travel,
        scrollStart,
        scrollEnd
      });
    });
    blocks.push({
      el,
      items: itemsData
    });
  });
  if (blocks.length) {
    update();
  }
}

/**
 * Update transforms based on current scroll position.
 */
function update() {
  const scrollY = window.scrollY;
  blocks.forEach(block => {
    block.items.forEach(({
      el,
      travel,
      scrollStart,
      scrollEnd
    }) => {
      const scrollRange = scrollEnd - scrollStart;
      if (scrollRange <= 0) {
        return;
      }
      let progress = (scrollY - scrollStart) / scrollRange;
      progress = Math.max(0, Math.min(1, progress));
      const rawOffset = travel - progress * travel * 2;
      const y = rawOffset > 0 ? rawOffset * positiveOffsetFactor : rawOffset;
      el.style.transform = `translateY(${y.toFixed(1)}px)`;
    });
  });
}

/**
 * Scroll handler with requestAnimationFrame throttle.
 */
function onScroll() {
  if (!ticking) {
    ticking = true;
    requestAnimationFrame(() => {
      update();
      ticking = false;
    });
  }
}

/**
 * Start listening for scroll events.
 */
function bind() {
  if (isBound) {
    return;
  }
  onResizeHandler = () => {
    initialize();
  };
  onPageTransitionCompleteHandler = () => {
    initialize();
    onScroll();
  };
  window.addEventListener('scroll', onScroll, {
    passive: true
  });
  window.addEventListener('resize', onResizeHandler);
  window.addEventListener('anima:page-transition-complete', onPageTransitionCompleteHandler);
  isBound = true;
}

/**
 * Clean up — useful for page transitions.
 */
function destroy() {
  window.removeEventListener('scroll', onScroll);
  if (onResizeHandler) {
    window.removeEventListener('resize', onResizeHandler);
  }
  if (onPageTransitionCompleteHandler) {
    window.removeEventListener('anima:page-transition-complete', onPageTransitionCompleteHandler);
  }
  onResizeHandler = null;
  onPageTransitionCompleteHandler = null;
  isBound = false;
  blocks = [];
}
// EXTERNAL MODULE: ./src/js/components/intro-animations/index.js
var intro_animations = __webpack_require__(688);
var intro_animations_default = /*#__PURE__*/__webpack_require__.n(intro_animations);
;// ./src/js/components/app.js











class App {
  constructor() {
    this.initializeHero();
    this.navbar = new Navbar();
    this.searchOverlay = new search_overlay();
    this.siteFrame = new (site_frame_default())();
    this.initializeImages();
    this.initializeCommentsArea();
    this.initializeReservationForm();
    this.initializeIntroAnimations();
    this.initializePileParallax();
  }
  initializeImages() {
    const showLoadedImages = this.showLoadedImages.bind(this);
    showLoadedImages();
    globalService.registerObserverCallback(function (mutationList) {
      external_jQuery_default().each(mutationList, (i, mutationRecord) => {
        external_jQuery_default().each(mutationRecord.addedNodes, (j, node) => {
          const nodeName = node.nodeName && node.nodeName.toLowerCase();
          if ('img' === nodeName || node.childNodes.length) {
            showLoadedImages(node);
          }
        });
      });
    });
  }
  initializeReservationForm() {
    globalService.registerObserverCallback(function (mutationList) {
      external_jQuery_default().each(mutationList, (i, mutationRecord) => {
        external_jQuery_default().each(mutationRecord.addedNodes, (j, node) => {
          const $node = external_jQuery_default()(node);
          if ($node.is('#ot-reservation-widget')) {
            $node.closest('.novablocks-opentable').addClass('is-loaded');
          }
        });
      });
    });
  }
  showLoadedImages(container = document.body) {
    const $images = external_jQuery_default()(container).find('img').not('[srcset], .is-loaded, .is-broken');
    $images.imagesLoaded().progress((instance, image) => {
      const className = image.isLoaded ? 'is-loaded' : 'is-broken';
      external_jQuery_default()(image.img).addClass(className);
    });
  }
  initializeHero() {
    // When the Intro Animations feature is active, OUR reveal system owns the
    // hero's intro/outro. Letting the legacy Hero GSAP timeline run alongside
    // it would tween inline opacity/transform on the same elements we manage
    // via --pending / --revealed, which out-specifies our CSS and leaves
    // slide content stuck in the timeline's outro state.
    if (document.body && document.body.classList && document.body.classList.contains('has-intro-animations')) {
      this.HeroCollection = [];
      this.firstHero = null;
      return;
    }
    const {
      NEW_HERO_SELECTOR: newHeroesSelector,
      OLD_HERO_SELECTOR: oldHeroesSelector,
      shouldInitializeHero
    } = (hero_init_filter_default());
    const heroesSelector = `${newHeroesSelector}, ${oldHeroesSelector}`;
    const heroElementsArray = Array.from(document.querySelectorAll(heroesSelector)).filter(shouldInitializeHero);
    this.HeroCollection = heroElementsArray.map(element => new Hero(element));
    this.firstHero = heroElementsArray[0];
  }
  initializePileParallax() {
    initialize();
    bind();
  }
  initializeIntroAnimations() {
    intro_animations_default().initialize();
    intro_animations_default().bind();
  }
  initializeCommentsArea() {
    const $commentsArea = external_jQuery_default()('.comments-area');
    if ($commentsArea.length) {
      this.commentsArea = new CommentsArea($commentsArea.get(0));
    }
  }
}
;// ./src/js/scripts.js


function scripts_initialize() {
  new App();
}
external_jQuery_default()(function () {
  const $window = external_jQuery_default()(window);
  const $html = external_jQuery_default()('html');
  if ($html.is('.wf-active')) {
    scripts_initialize();
  } else {
    $window.on('wf-active', scripts_initialize);
  }
});
})();

/******/ })()
;