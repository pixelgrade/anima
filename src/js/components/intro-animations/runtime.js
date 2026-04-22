const {
  collectRevealTargets,
  collectNestedTitlesWithinTargets,
} = require('./targeting.js');

const REVEAL_ZONE_TOP_RATIO = 0.82;
const DELAY_WINDOW_BY_STYLE = {
  fade: 600,
  scale: 600,
  slide: 600,
  // Kinetic needs a longer window: the title's per-word cascade can take
  // ~500ms+ on a multi-line heading, and the rest of the batch should still
  // feel like one continuous reveal.
  kinetic: 1000,
};

// Selectors that identify a "title" role target (heading blocks, post titles).
// Used by the role classifier below. Anything else gets role 'other'.
const TITLE_ROLE_SELECTORS = [
  'h1',
  'h2',
  'h3',
  '.wp-block-heading',
  '.wp-block-post-title',
];

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
    rootMargin: `0px 0px -${Math.round((1 - REVEAL_ZONE_TOP_RATIO) * 100)}% 0px`,
  };
}

function createIntroAnimationsRuntime({
  window: win = typeof window !== 'undefined' ? window : null,
  document: doc = typeof document !== 'undefined' ? document : null,
  collectTargets = collectRevealTargets,
  collectNestedTitles = collectNestedTitlesWithinTargets,
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

  // Pick the DOM node that actually holds the text to split. Handles the
  // three common heading shapes:
  //   <h2>Title</h2>                      — split inside the heading
  //   <h2><a>Title</a></h2>               — split inside the anchor (card titles)
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

      if (only && innerText === outerText) {
        return only;
      }
    }

    return null;
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
  //    safely (pickSplitRoot returns null). Single-anchor wrappers around
  //    the full title text ARE handled — we split inside the anchor.
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

    const wordSpans = words.map((word) => {
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
    wordSpans.forEach((span) => {
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

    target.classList.add('anima-intro-target--pending');

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
    const primaryTargets = collectTargets(root);
    let targets = primaryTargets;

    // Kinetic extension: also animate title-role headings that live INSIDE
    // the tracked reveal roots. The outer container still slides (role-other),
    // and its inner heading gets the word-curtain (role-title). Outside
    // Kinetic this is a no-op so fade/slide/scale keep the simpler
    // outer-only reveal semantics.
    if (getActiveAnimationStyle() === 'kinetic' && typeof collectNestedTitles === 'function') {
      const nested = collectNestedTitles(primaryTargets);
      if (nested && nested.length) {
        targets = primaryTargets.concat(nested);
      }
    }

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
    // Exposed for tests and for external consumers who want to pre-split
    // server-rendered headings (e.g. a future critical-path enhancement).
    splitHeadingForCurtain,
  };
}

module.exports = {
  createIntroAnimationsRuntime,
  getRevealObserverOptions,
  classifyTargetRole,
  TITLE_ROLE_SELECTORS,
  DELAY_WINDOW_BY_STYLE,
};
