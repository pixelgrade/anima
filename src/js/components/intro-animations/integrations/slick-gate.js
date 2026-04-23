/**
 * Slick carousel integration for the reveal choreographer.
 *
 * For every .slick-initialized carousel, closes a per-carousel gate
 * ('slick:{id}') during the slide-change transition and opens it (with a
 * settle delay) once the transition ends. Reveals inside slides use the
 * carousel's gate name so their cascade waits for the slide transform to
 * finish before playing.
 *
 * Uses jQuery because Slick itself is jQuery-based; Slick dispatches its
 * transition events as jQuery events on the carousel element.
 *
 * Carousel identification: uses `data-slick-gate-id` if present, falls
 * back to a stable sequential id assigned by this integration. This id is
 * what runtime.js uses to derive the waitFor gate name for titles inside
 * a given slide (`getSlickGateName(slideElement)`).
 */
const SLICK_GATE_PREFIX = 'slick:';
const DEFAULT_SETTLE_MS = 100;
const GATE_ID_ATTRIBUTE = 'data-slick-gate-id';

let nextAutoId = 1;

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
 * Given any element, find the gate name of the carousel it lives inside
 * (if any). Returns null for elements outside a carousel.
 */
function getSlickGateName(el) {
  if (!el || typeof el.closest !== 'function') return null;
  const carousel = el.closest('.slick-initialized.slick-slider');
  if (!carousel) return null;
  return assignCarouselGateName(carousel);
}

/**
 * Wire one carousel's beforeChange/afterChange into the choreographer.
 */
function attachToCarousel($carousel, choreographer, settleMs) {
  if (!$carousel || !$carousel.length || $carousel.data('anima-slick-gate-bound')) return;

  const gateName = assignCarouselGateName($carousel[0]);
  if (!gateName) return;

  $carousel.on('beforeChange', () => {
    choreographer.closeGate(gateName);
  });
  $carousel.on('afterChange', () => {
    choreographer.openGate(gateName, { settle: settleMs });
  });

  $carousel.data('anima-slick-gate-bound', true);
}

/**
 * Attach the Slick integration. Scans for already-initialized carousels
 * immediately, and re-scans whenever a page transition swaps in new
 * content (so carousels on soft-navigated pages get wired too).
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

  function scan() {
    if (!doc || typeof doc.querySelectorAll !== 'function') return;
    $(doc).find('.slick-initialized.slick-slider').each(function () {
      attachToCarousel($(this), choreographer, settleMs);
    });
  }

  scan();

  const onPageTransitionComplete = () => {
    // Slick often (re-)initializes after a Barba content swap. Give it one
    // frame to settle, then scan for newly-initialized carousels.
    if (win && typeof win.requestAnimationFrame === 'function') {
      win.requestAnimationFrame(() => {
        win.requestAnimationFrame(scan);
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
  };
}

module.exports = {
  attachSlickGate,
  getSlickGateName,
  assignCarouselGateName,
  SLICK_GATE_PREFIX,
};
