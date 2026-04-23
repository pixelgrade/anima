const {
  collectRevealTargets,
  collectKineticTitleTargets,
} = require('./targeting.js');
const { createRevealChoreographer } = require('./choreographer.js');

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
  collectKineticTitles = collectKineticTitleTargets,
  createObserver = (callback) => new win.IntersectionObserver(callback, getRevealObserverOptions()),
  // Injectable so tests can supply a synchronous stub. Factory receives the
  // runtime's handleReveal as its onReveal; integrations can close/open
  // gates on the returned choreographer (exposed via runtime.choreographer).
  createChoreographer = createRevealChoreographer,
  // Given a staged target, return the list of gate names its reveal must
  // wait on. Default: no gates (reveal fires immediately; backward-compat
  // for tests). The shipping runtime wires this up in index.js so titles
  // inside Slick slides or the post-transition page wait appropriately.
  resolveGates = () => [],
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

    const charSpans = chars.map((ch) => {
      const span = doc.createElement('span');
      span.className = 'char';
      span.textContent = ch;
      return span;
    });

    // Pass 1: flat layout so the browser decides where the word wraps.
    splitRoot.textContent = '';
    charSpans.forEach((span) => splitRoot.appendChild(span));

    if (typeof splitRoot.getBoundingClientRect === 'function') {
      splitRoot.getBoundingClientRect();
    }

    const charsByTop = new Map();
    charSpans.forEach((span) => {
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

    // Single-word titles: split into characters instead of words so the
    // cascade shows a rising letter sequence. Otherwise a one-word heading
    // like "Newsletter" would render as a single block pop with no stagger.
    if (words.length === 1) {
      splitTextIntoChars(splitRoot, words[0]);
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
    if (slideChangeObserver && typeof slideChangeObserver.disconnect === 'function') {
      slideChangeObserver.disconnect();
    }
    if (choreographer && typeof choreographer.disconnect === 'function') {
      choreographer.disconnect();
    }

    observer = null;
    slideChangeObserver = null;
    // Leave choreographer reference intact — the factory-returned API
    // still exposes it for integrations and for re-use after re-initialize.
    // Its internal state has been reset by disconnect().
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

    const obs = new win.MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
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

        const titles = slide.querySelectorAll('.anima-intro-target--role-title');
        // Route through the choreographer: for an already-revealed title,
        // the slick:{id} gate (closed during this transition by the slick
        // integration) holds the request until the slide settles, then
        // onReveal routes to replayKineticTitle. For a not-yet-revealed
        // title, it routes to the first-reveal path.
        titles.forEach(requestTargetReveal);
      });
    });

    obs.observe(doc.body, {
      attributes: true,
      attributeFilter: ['class'],
      attributeOldValue: true,
      subtree: true,
    });

    return obs;
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
        onReveal: handleReveal,
      });
    }
    return choreographer;
  }

  function requestTargetReveal(target) {
    if (!target) return;
    const gates = typeof resolveGates === 'function' ? resolveGates(target) : [];
    getChoreographer().requestReveal(target, { waitFor: gates });
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

      // Also start watching for Slick slide changes so Kinetic titles
      // inside a carousel re-play their word-curtain each time a slide
      // becomes newly active (IntersectionObserver doesn't re-fire
      // because Slick uses CSS transform, not DOM mutation).
      slideChangeObserver = observeSlickSlideChanges();
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
    replayKineticTitle,
    // Integrations (page-transition-gate, slick-gate) attach to this.
    // Getter so lazy creation still works: callers don't have to know
    // about the creation timing.
    get choreographer() { return getChoreographer(); },
  };
}

module.exports = {
  createIntroAnimationsRuntime,
  getRevealObserverOptions,
  classifyTargetRole,
  TITLE_ROLE_SELECTORS,
  DELAY_WINDOW_BY_STYLE,
};
