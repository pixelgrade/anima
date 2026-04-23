const test = require('node:test');
const assert = require('node:assert/strict');

const {
  createIntroAnimationsRuntime,
  classifyTargetRole,
  TITLE_ROLE_SELECTORS,
  DELAY_WINDOW_BY_STYLE,
} = require('../src/js/components/intro-animations/runtime.js');

// ---------- DOM-ish helpers shared across tests ----------

function createClassList(initialClasses = []) {
  const classSet = new Set(initialClasses);

  return {
    add(...classes) {
      classes.forEach((className) => classSet.add(className));
    },
    remove(...classes) {
      classes.forEach((className) => classSet.delete(className));
    },
    contains(className) {
      return classSet.has(className);
    },
    toArray() {
      return Array.from(classSet);
    },
  };
}

function createStyleStub() {
  const properties = new Map();

  return {
    setProperty(name, value) {
      properties.set(name, value);
    },
    getPropertyValue(name) {
      return properties.get(name) || '';
    },
  };
}

function createWindowStub() {
  const listeners = new Map();
  const animationFrameQueue = [];

  return {
    listeners,
    animationFrameQueue,
    innerHeight: 1000,
    innerWidth: 1200,
    addEventListener(type, listener) {
      if (!listeners.has(type)) {
        listeners.set(type, []);
      }
      listeners.get(type).push(listener);
    },
    dispatchEvent(event) {
      (listeners.get(event.type) || []).forEach((listener) => listener(event));
    },
    requestAnimationFrame(callback) {
      animationFrameQueue.push(callback);
      return animationFrameQueue.length;
    },
    flushAnimationFrames() {
      while (animationFrameQueue.length) {
        const callback = animationFrameQueue.shift();
        callback();
      }
    },
    matchMedia() {
      return {matches: false};
    },
  };
}

// Minimal Element-like stub that supports matches(selector) for a fixed list
// of selectors, plus the DOM surface the splitter touches. Lets us drive the
// role classifier and splitter without jsdom.
function createDomTarget({tagName = 'H2', matchesSelectors = [], text = ''} = {}) {
  const children = [];
  const state = {textContent: text};

  const makeChild = () => {
    const child = {
      tagName: 'SPAN',
      className: '',
      classList: createClassList(),
      style: createStyleStub(),
      children: [],
      childNodes: [],
      parentNode: null,
      _text: '',
      get textContent() { return this._text; },
      set textContent(value) { this._text = String(value); },
      appendChild(node) {
        this.childNodes.push(node);
        if (node && node._tag === 'TEXT') {
          this._text = this._text + node._data;
          return node;
        }
        if (node) {
          node.parentNode = this;
          this.children.push(node);
        }
        return node;
      },
      querySelector(sel) {
        if (sel === '.line') {
          for (const c of this.children) if (c.className === 'line') return c;
        }
        if (sel === '.word') {
          for (const c of this.children) if (c.className === 'word') return c;
        }
        return null;
      },
      querySelectorAll(sel) {
        const results = [];
        const visit = (node) => {
          if (!node) return;
          for (const child of node.children || []) {
            if (sel === '.word' && child.className === 'word') results.push(child);
            if (sel === '.char' && child.className === 'char') results.push(child);
            if (sel === '.line' && child.className === 'line') results.push(child);
            visit(child);
          }
        };
        visit(this);
        return results;
      },
      matches() { return false; },
      offsetTop: 0,
      getBoundingClientRect() { return {top: 0, bottom: 0, left: 0, right: 0}; },
    };
    return child;
  };

  const target = {
    tagName,
    classList: createClassList(),
    style: createStyleStub(),
    children: [],
    childNodes: [],
    get childElementCount() { return this.children.length; },
    get textContent() { return state.textContent; },
    set textContent(value) {
      state.textContent = String(value);
      this.children.length = 0;
      this.childNodes.length = 0;
    },
    appendChild(node) {
      this.childNodes.push(node);
      if (node && node._tag === 'TEXT') {
        state.textContent = state.textContent + node._data;
        return node;
      }
      if (node) {
        node.parentNode = this;
        this.children.push(node);
      }
      return node;
    },
    querySelector(sel) {
      if (sel === '.line') {
        for (const c of this.children) if (c.className === 'line') return c;
      }
      if (sel === '.word') {
        for (const c of this.children) if (c.className === 'word') return c;
      }
      return null;
    },
    querySelectorAll(sel) {
      const results = [];
      const visit = (node) => {
        if (!node) return;
        for (const child of node.children || []) {
          if (sel === '.word' && child.className === 'word') results.push(child);
            if (sel === '.char' && child.className === 'char') results.push(child);
          if (sel === '.line' && child.className === 'line') results.push(child);
          visit(child);
        }
      };
      visit(this);
      return results;
    },
    matches(selector) { return matchesSelectors.includes(selector); },
    offsetTop: 0,
    getBoundingClientRect() { return {top: 0, bottom: 0, left: 0, right: 0}; },
    _makeChild: makeChild,
  };

  return target;
}

function createDocStub({kinetic = false, matchesReducedMotion = false} = {}) {
  const bodyClassList = createClassList(
    kinetic ? ['has-intro-animations', 'has-intro-animations--kinetic'] : ['has-intro-animations']
  );

  return {
    body: {
      classList: {
        contains(name) { return bodyClassList.contains(name); },
      },
    },
    documentElement: {clientHeight: 1000, clientWidth: 1200},
    createElement(tag) {
      return {
        tagName: tag.toUpperCase(),
        className: '',
        classList: createClassList(),
        style: createStyleStub(),
        children: [],
        childNodes: [],
        _text: '',
        get textContent() { return this._text; },
        set textContent(value) {
          this._text = String(value);
          this.children.length = 0;
          this.childNodes.length = 0;
        },
        appendChild(node) {
          this.childNodes.push(node);
          if (node && node._tag === 'TEXT') {
            this._text = this._text + node._data;
            return node;
          }
          if (node) {
            node.parentNode = this;
            this.children.push(node);
          }
          return node;
        },
        querySelector(sel) {
          if (sel === '.line') {
            for (const c of this.children) if (c.className === 'line') return c;
          }
          return null;
        },
        querySelectorAll(sel) {
          const results = [];
          for (const c of this.children) {
            if (sel === '.word' && c.className === 'word') results.push(c);
            if (sel === '.char' && c.className === 'char') results.push(c);
            if (sel === '.line' && c.className === 'line') results.push(c);
          }
          return results;
        },
        offsetTop: 0,
      };
    },
    createTextNode(data) {
      return {_tag: 'TEXT', _data: String(data)};
    },
  };
}

// ---------- classifyTargetRole ----------

test('classifyTargetRole returns "title" for heading tags and heading blocks', () => {
  for (const selector of TITLE_ROLE_SELECTORS) {
    const node = {matches: (s) => s === selector};
    assert.equal(classifyTargetRole(node), 'title', `expected "${selector}" to be title role`);
  }
});

test('classifyTargetRole returns "other" for non-heading nodes', () => {
  const node = {matches: (s) => s === '.wp-block-cover'};
  assert.equal(classifyTargetRole(node), 'other');
});

test('classifyTargetRole is null-safe', () => {
  assert.equal(classifyTargetRole(null), 'other');
  assert.equal(classifyTargetRole({}), 'other');
  assert.equal(classifyTargetRole({matches: 'not a function'}), 'other');
});

// ---------- DELAY_WINDOW_BY_STYLE ----------

test('Kinetic is registered in DELAY_WINDOW_BY_STYLE', () => {
  assert.equal(typeof DELAY_WINDOW_BY_STYLE.kinetic, 'number');
  assert.ok(DELAY_WINDOW_BY_STYLE.kinetic >= DELAY_WINDOW_BY_STYLE.slide,
    'kinetic window should be at least as wide as slide');
});

// ---------- stageTarget under Kinetic ----------

test('stageTarget adds role-title class for headings under Kinetic', () => {
  const target = createDomTarget({tagName: 'H2', matchesSelectors: ['h2']});
  const runtime = createIntroAnimationsRuntime({
    window: createWindowStub(),
    document: createDocStub({kinetic: true}),
    collectTargets: () => [target],
    createObserver() { return {observe() {}, unobserve() {}, disconnect() {}}; },
  });

  runtime.stageTarget(target);

  assert.equal(target.classList.contains('anima-intro-target--role-title'), true);
  assert.equal(target.classList.contains('anima-intro-target--pending'), true);
});

test('stageTarget adds role-other class for non-heading targets', () => {
  const target = createDomTarget({tagName: 'DIV', matchesSelectors: ['.wp-block-cover']});
  const runtime = createIntroAnimationsRuntime({
    window: createWindowStub(),
    document: createDocStub({kinetic: true}),
    collectTargets: () => [target],
    createObserver() { return {observe() {}, unobserve() {}, disconnect() {}}; },
  });

  runtime.stageTarget(target);

  assert.equal(target.classList.contains('anima-intro-target--role-other'), true);
});

test('stageTarget does NOT split heading when style is fade/slide/scale', () => {
  const target = createDomTarget({tagName: 'H2', matchesSelectors: ['h2'], text: 'The quiet art'});
  const runtime = createIntroAnimationsRuntime({
    window: createWindowStub(),
    document: createDocStub({kinetic: false}),
    collectTargets: () => [target],
    createObserver() { return {observe() {}, unobserve() {}, disconnect() {}}; },
  });

  runtime.stageTarget(target);

  assert.equal(target.querySelectorAll('.word').length, 0,
    'words should not be split when style is not kinetic');
  assert.equal(target.querySelectorAll('.line').length, 0);
});

// ---------- splitHeadingForCurtain ----------

test('splitHeadingForCurtain wraps each word and groups by offsetTop into lines', () => {
  const target = createDomTarget({tagName: 'H2', matchesSelectors: ['h2'], text: 'The quiet art of entering a room'});

  // Simulate a browser that wraps this text onto 2 lines: first 5 words at y=0,
  // last 2 words at y=60. We hook into createElement to stamp offsetTop onto
  // the word spans as they're created, since the real browser would compute
  // these via layout.
  const doc = createDocStub({kinetic: true});
  const originalCreate = doc.createElement;
  let wordIndex = 0;
  doc.createElement = (tag) => {
    const el = originalCreate(tag);
    if (tag === 'span') {
      const idx = wordIndex++;
      // Match playground behavior: first 5 words on line 0, next 2 on line 1.
      // Line spans (no offsetTop touched) are overwritten because they also
      // hit this path — we only care about .word spans, so reset when we
      // pass the word phase. Check via className after it gets assigned.
      Object.defineProperty(el, 'offsetTop', {
        get() {
          return this.className === 'word' ? (idx < 5 ? 0 : 60) : 0;
        },
        configurable: true,
      });
    }
    return el;
  };

  const runtime = createIntroAnimationsRuntime({
    window: createWindowStub(),
    document: doc,
    collectTargets: () => [target],
    createObserver() { return {observe() {}, unobserve() {}, disconnect() {}}; },
  });

  runtime.splitHeadingForCurtain(target);

  const lines = target.querySelectorAll('.line');
  const words = target.querySelectorAll('.word');

  assert.equal(lines.length, 2, 'expected 2 .line containers from 2 offsetTop groups');
  assert.equal(words.length, 7, 'expected 7 .word spans (one per word)');

  // Verify --word-index + --line-index wiring on first word and last word.
  const first = words[0];
  const last = words[words.length - 1];
  assert.equal(first.style.getPropertyValue('--line-index'), '0');
  assert.equal(first.style.getPropertyValue('--word-index'), '0');
  assert.equal(last.style.getPropertyValue('--line-index'), '1');
  // The last word is the 2nd word on line 1 (index 1).
  assert.equal(last.style.getPropertyValue('--word-index'), '1');
});

test('splitHeadingForCurtain is idempotent (skip if already split)', () => {
  const target = createDomTarget({tagName: 'H2', matchesSelectors: ['h2'], text: 'Hello world'});
  const runtime = createIntroAnimationsRuntime({
    window: createWindowStub(),
    document: createDocStub({kinetic: true}),
    collectTargets: () => [target],
    createObserver() { return {observe() {}, unobserve() {}, disconnect() {}}; },
  });

  runtime.splitHeadingForCurtain(target);
  const wordsAfterFirst = target.querySelectorAll('.word').length;

  runtime.splitHeadingForCurtain(target);
  const wordsAfterSecond = target.querySelectorAll('.word').length;

  assert.equal(wordsAfterFirst, wordsAfterSecond,
    'second call should not multiply words');
});

test('splitHeadingForCurtain skips headings with mixed inline markup', () => {
  // Heading with a child whose text doesn't fully cover the heading text.
  // Simulates <h2>Mixed <em>inline</em> stuff</h2>.
  const target = createDomTarget({tagName: 'H2', matchesSelectors: ['h2'], text: 'Mixed inline stuff'});
  target.children.push({
    tagName: 'EM',
    className: 'em-stub',
    textContent: 'inline',  // != outer text 'Mixed inline stuff'
  });
  target.firstElementChild = target.children[0];

  const runtime = createIntroAnimationsRuntime({
    window: createWindowStub(),
    document: createDocStub({kinetic: true}),
    collectTargets: () => [target],
    createObserver() { return {observe() {}, unobserve() {}, disconnect() {}}; },
  });

  runtime.splitHeadingForCurtain(target);

  assert.equal(target.querySelectorAll('.word').length, 0,
    'headings with mixed inline markup should not be split');
});

test('splitHeadingForCurtain splits a single-word heading into characters', () => {
  const target = createDomTarget({tagName: 'H3', matchesSelectors: ['h3'], text: 'Newsletter'});

  const runtime = createIntroAnimationsRuntime({
    window: createWindowStub(),
    document: createDocStub({kinetic: true}),
    collectTargets: () => [target],
    createObserver() { return {observe() {}, unobserve() {}, disconnect() {}}; },
  });

  runtime.splitHeadingForCurtain(target);

  const words = target.querySelectorAll('.word');
  const chars = target.querySelectorAll('.char');

  assert.equal(words.length, 0, 'single-word headings should not produce .word spans');
  assert.equal(chars.length, 'Newsletter'.length, 'should produce one .char span per character');

  // Verify per-char index and line index wiring on first and last char.
  const first = chars[0];
  const last = chars[chars.length - 1];
  assert.equal(first.style.getPropertyValue('--char-index'), '0');
  assert.equal(first.style.getPropertyValue('--line-index'), '0');
  assert.equal(last.style.getPropertyValue('--char-index'), String('Newsletter'.length - 1));
});

test('splitHeadingForCurtain splits INSIDE a single wrapping anchor (card-title pattern)', () => {
  // Card title pattern: <h3><a>Card title text</a></h3>.
  // The anchor's textContent matches the heading's textContent exactly,
  // so the splitter should split inside the anchor.
  const anchorText = 'Card title';
  const anchor = createDomTarget({tagName: 'A', matchesSelectors: [], text: anchorText});
  // Make the anchor queryable like a real element
  anchor.getBoundingClientRect = () => ({top: 0, bottom: 0, left: 0, right: 0});

  const heading = createDomTarget({tagName: 'H3', matchesSelectors: ['h3'], text: anchorText});
  heading.children.push(anchor);
  heading.childNodes.push(anchor);
  heading.firstElementChild = anchor;
  // Override childElementCount since createDomTarget derives it from children.length
  // (which is correct here because we just pushed one).

  const runtime = createIntroAnimationsRuntime({
    window: createWindowStub(),
    document: createDocStub({kinetic: true}),
    collectTargets: () => [heading],
    createObserver() { return {observe() {}, unobserve() {}, disconnect() {}}; },
  });

  runtime.splitHeadingForCurtain(heading);

  // The .line/.word spans should live inside the anchor, not directly in the heading.
  const wordsAnywhere = heading.querySelectorAll('.word');
  const wordsInAnchor = anchor.querySelectorAll('.word');

  assert.ok(wordsInAnchor.length >= 1, 'should create word spans inside the anchor');
  assert.equal(wordsInAnchor.length, wordsAnywhere.length,
    'every word span should be inside the anchor, not the heading');
});

// ---------- Re-init after page transition ----------

// ---------- Nested title collection (Kinetic extension) ----------

test('Kinetic appends nested titles found inside reveal-root containers', () => {
  const cardContainer = createDomTarget({tagName: 'ARTICLE', matchesSelectors: ['.wp-block-post']});
  const cardTitle = createDomTarget({tagName: 'H1', matchesSelectors: ['h1', '.wp-block-heading'], text: 'Card title'});
  const win = createWindowStub();

  const runtime = createIntroAnimationsRuntime({
    window: win,
    document: createDocStub({kinetic: true}),
    collectTargets: () => [cardContainer],
    collectKineticTitles: (root, primary) => {
      // Simulate the extension handing back the heading inside the card.
      return primary && primary.includes(cardContainer) ? [cardTitle] : [];
    },
    createObserver() { return {observe() {}, unobserve() {}, disconnect() {}}; },
  });

  runtime.initialize();

  // Both targets should be staged.
  assert.equal(cardContainer.classList.contains('anima-intro-target--pending'), true);
  assert.equal(cardContainer.classList.contains('anima-intro-target--role-other'), true,
    'container is role-other (it is not a heading itself)');

  assert.equal(cardTitle.classList.contains('anima-intro-target--pending'), true);
  assert.equal(cardTitle.classList.contains('anima-intro-target--role-title'), true,
    'nested heading is role-title');
});

test('Non-Kinetic styles DO NOT collect nested titles', () => {
  const cardContainer = createDomTarget({tagName: 'ARTICLE', matchesSelectors: ['.wp-block-post']});
  const cardTitle = createDomTarget({tagName: 'H1', matchesSelectors: ['h1'], text: 'Card title'});

  let nestedCallCount = 0;
  const runtime = createIntroAnimationsRuntime({
    window: createWindowStub(),
    document: createDocStub({kinetic: false}),
    collectTargets: () => [cardContainer],
    collectKineticTitles: () => {
      nestedCallCount += 1;
      return [cardTitle];
    },
    createObserver() { return {observe() {}, unobserve() {}, disconnect() {}}; },
  });

  runtime.initialize();

  assert.equal(nestedCallCount, 0,
    'collectNestedTitles should not be invoked outside Kinetic');
  assert.equal(cardTitle.classList.contains('anima-intro-target--role-title'), false,
    'inner title should not be staged when style is not kinetic');
});

// ---------- replayKineticTitle ----------

test('replayKineticTitle is a no-op when the title was never revealed', () => {
  const target = createDomTarget({tagName: 'H2', matchesSelectors: ['h2'], text: 'Fresh title'});
  // target has no --revealed class
  const runtime = createIntroAnimationsRuntime({
    window: createWindowStub(),
    document: createDocStub({kinetic: true}),
    collectTargets: () => [target],
    createObserver() { return {observe() {}, unobserve() {}, disconnect() {}}; },
  });

  runtime.replayKineticTitle(target);

  assert.equal(target.classList.contains('anima-intro-target--replaying'), false,
    'replay should leave pending titles alone');
});

test('replayKineticTitle snaps to pre-state then schedules a fresh reveal via rAF', () => {
  const target = createDomTarget({tagName: 'H2', matchesSelectors: ['h2'], text: 'Card title'});
  target.classList.add('anima-intro-target--revealed');
  const win = createWindowStub();

  const runtime = createIntroAnimationsRuntime({
    window: win,
    document: createDocStub({kinetic: true}),
    collectTargets: () => [target],
    createObserver() { return {observe() {}, unobserve() {}, disconnect() {}}; },
  });

  runtime.replayKineticTitle(target);

  // After the call, --revealed should be gone (snapped back to pre-state),
  // --replaying is briefly added and removed within the same tick before
  // the rAF callback schedules the re-reveal.
  assert.equal(target.classList.contains('anima-intro-target--revealed'), false,
    '--revealed should be removed to snap the words back to pre-state');
  assert.equal(target.classList.contains('anima-intro-target--replaying'), false,
    '--replaying is added then removed synchronously to disable transitions during the snap');
  assert.equal(win.animationFrameQueue.length, 1, 'first rAF scheduled');

  win.animationFrameQueue.shift()();
  assert.equal(win.animationFrameQueue.length, 1, 'second rAF scheduled');

  win.animationFrameQueue.shift()();
  assert.equal(target.classList.contains('anima-intro-target--revealed'), true,
    'second rAF should re-add --revealed to trigger the forward cascade');
});

test('page-transition re-init applies Kinetic splitter to fresh title targets', () => {
  const firstHeading = createDomTarget({tagName: 'H2', matchesSelectors: ['h2'], text: 'First page title'});
  const secondHeading = createDomTarget({tagName: 'H2', matchesSelectors: ['h2'], text: 'Second page title'});
  const win = createWindowStub();
  const doc = createDocStub({kinetic: true});

  let targetsToReturn = [firstHeading];
  const runtime = createIntroAnimationsRuntime({
    window: win,
    document: doc,
    collectTargets: () => targetsToReturn,
    createObserver() { return {observe() {}, unobserve() {}, disconnect() {}}; },
  });

  runtime.bind();
  runtime.initialize();

  assert.equal(
    firstHeading.classList.contains('anima-intro-target--role-title'),
    true,
    'first heading classified as title',
  );

  // Simulate Barba delivering a new page: swap the target collection and dispatch event.
  targetsToReturn = [secondHeading];
  win.dispatchEvent({type: 'anima:page-transition-complete'});

  assert.equal(
    secondHeading.classList.contains('anima-intro-target--role-title'),
    true,
    'second heading classified as title after page transition',
  );
  assert.equal(
    secondHeading.classList.contains('anima-intro-target--pending'),
    true,
    'second heading staged as pending after page transition',
  );
});
