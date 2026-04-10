const {
  collectRevealTargets,
} = require('./targeting.js');

function createIntroAnimationsRuntime({
  window: win = typeof window !== 'undefined' ? window : null,
  document: doc = typeof document !== 'undefined' ? document : null,
  collectTargets = collectRevealTargets,
  createObserver = (callback) => new win.IntersectionObserver(callback, {
    threshold: 0.15,
    rootMargin: '0px 0px -10% 0px',
  }),
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

    return rect.bottom > 0 && rect.top < viewportHeight && rect.right > 0 && rect.left < viewportWidth;
  }

  function markTargetBase(target) {
    if (target && target.classList) {
      target.classList.add('anima-intro-target');
    }
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
      entries.forEach((entry) => {
        if (!entry || !entry.isIntersecting) {
          return;
        }

        revealTarget(entry.target);
      });
    });

    return observer;
  }

  function scheduleReveal(targets) {
    if (!targets.length) {
      return;
    }

    const runReveal = () => {
      targets.forEach(revealTarget);
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
    stageTarget,
    prefersReducedMotion,
    isInViewport,
  };
}

module.exports = {
  createIntroAnimationsRuntime,
};
