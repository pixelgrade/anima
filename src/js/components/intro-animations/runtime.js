const {
  collectRevealTargets,
} = require('./targeting.js');

const REVEAL_ZONE_TOP_RATIO = 0.82;
const DELAY_WINDOW_BY_STYLE = {
  fade: 600,
  scale: 600,
  slide: 600,
};

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

  function getActiveAnimationStyle() {
    if (!doc || !doc.body || !doc.body.classList) {
      return 'fade';
    }

    const styles = Object.keys(DELAY_WINDOW_BY_STYLE);
    const activeStyle = styles.find((style) => doc.body.classList.contains(`has-intro-animations--${style}`));

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

  function applyRevealDelay(target, index = 0, totalTargets = 1) {
    if (!target || !target.style || typeof target.style.setProperty !== 'function') {
      return;
    }

    const delay = totalTargets > 0 ? (getDelayWindowMs() / totalTargets) * index : 0;

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
      applyRevealDelay(target, index, sortedTargets.length);
      revealTarget(target);
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
      win.requestAnimationFrame(() => {
        win.requestAnimationFrame(runReveal);
      });
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
