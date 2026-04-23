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
    choreographer.openGate(gateName, { settle: settleMs });
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
  settleMs = DEFAULT_SETTLE_MS,
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
    initObserver = new win.MutationObserver((mutations) => {
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
      subtree: true,
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
  KIND_ATTRIBUTE,
};
