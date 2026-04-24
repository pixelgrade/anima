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
  settleMs = DEFAULT_SETTLE_MS,
} = {}) {
  if (!win || typeof win.addEventListener !== 'function' || !choreographer) {
    return () => {};
  }

  if (
    doc &&
    doc.body &&
    doc.body.classList &&
    doc.body.classList.contains('is-loading') &&
    doc.body.classList.contains('has-page-transitions')
  ) {
    choreographer.closeGate(PAGE_TRANSITION_GATE);
  }

  const onStart = () => {
    choreographer.closeGate(PAGE_TRANSITION_GATE);
  };
  const onComplete = () => {
    choreographer.openGate(PAGE_TRANSITION_GATE, { settle: settleMs });
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
  PAGE_TRANSITION_GATE,
};
