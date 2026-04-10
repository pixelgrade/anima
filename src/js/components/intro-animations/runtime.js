const {
  collectRevealTargets,
} = require('./targeting.js');

const REVEAL_ZONE_TOP_RATIO = 0.82;
const MAX_STAGGER_STEPS = 5;

function getRevealObserverOptions() {
  return {
    threshold: 0,
    rootMargin: `0px 0px -${Math.round((1 - REVEAL_ZONE_TOP_RATIO) * 100)}% 0px`,
  };
}

function createIntroAnimationsRuntime({
  window: win = typeof window !== 'undefined' ? window : null,
  document: doc = typeof document !== 'undefined' ? document : null,
  collectTargets = collectRevealTargets,
  createObserver = (callback) => new win.IntersectionObserver(callback, getRevealObserverOptions()),
} = {}) {
  const consumedTargets = new WeakSet();
  let observer = null;
  let isBound = false;

  function hasEnabledBodyClass() {
    return !!doc && !!doc.body && !!doc.body.classList && doc.body.classList.contains('has-intro-animations');
  }

  function prefersReducedMotion() {
    return !!win && typeof win.matchMedia === 'function' && win.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  function getStaggerStep() {
    if (!doc || !doc.body || !doc.body.classList) {
      return 70;
    }

    if (doc.body.classList.contains('has-intro-animations--slow')) {
      return 90;
    }

    if (doc.body.classList.contains('has-intro-animations--fast')) {
      return 50;
    }

    return 70;
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

  function applyRevealDelay(target, index = 0) {
    if (!target || !target.style || typeof target.style.setProperty !== 'function') {
      return;
    }

    const delay = Math.min(index, MAX_STAGGER_STEPS) * getStaggerStep();

    target.style.setProperty('--anima-intro-delay', `${delay}ms`);
  }

  function revealTarget(target, index = 0) {
    if (!target || !target.classList) {
      return;
    }

    markTargetBase(target);
    applyRevealDelay(target, index);
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

    if (prefersReducedMotion()) {
      revealTarget(target);
      return false;
    }

    target.classList.add('anima-intro-target--pending');

    return true;
  }

  function disconnect() {
    if (observer && typeof observer.disconnect === 'function') {
      observer.disconnect();
    }

    observer = null;
  }

  function ensureObserver() {
    if (observer || prefersReducedMotion() || !hasEnabledBodyClass() || typeof createObserver !== 'function') {
      return observer;
    }

    observer = createObserver((entries = []) => {
      const readyTargets = entries
        .filter((entry) => entry && entry.isIntersecting)
        .map((entry) => entry.target);

      revealTargets(readyTargets);
    });

    return observer;
  }

  function sortBatchTargets(targets = []) {
    return [...targets].sort((firstTarget, secondTarget) => {
      if (
        !firstTarget ||
        !secondTarget ||
        typeof firstTarget.getBoundingClientRect !== 'function' ||
        typeof secondTarget.getBoundingClientRect !== 'function'
      ) {
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

  function revealTargets(targets = []) {
    const sortedTargets = sortBatchTargets(targets);

    sortedTargets.forEach((target, index) => {
      revealTarget(target, index);
    });
  }

  function scheduleReveal(targets) {
    if (!targets.length) {
      return;
    }

    const runReveal = () => {
      revealTargets(targets);
    };

    if (win && typeof win.requestAnimationFrame === 'function') {
      win.requestAnimationFrame(runReveal);
      return;
    }

    runReveal();
  }

  function initialize(root = doc) {
    if (!hasEnabledBodyClass() || !root || typeof collectTargets !== 'function') {
      return [];
    }

    disconnect();

    const immediateTargets = [];
    const targets = collectTargets(root);

    targets.forEach((target) => {
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
  };
}

module.exports = {
  createIntroAnimationsRuntime,
  getRevealObserverOptions,
};
