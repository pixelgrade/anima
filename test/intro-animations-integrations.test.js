const test = require('node:test');
const assert = require('node:assert/strict');

const {
  attachPageTransitionGate,
  PAGE_TRANSITION_GATE,
} = require('../src/js/components/intro-animations/integrations/page-transition-gate.js');
const {
  attachSlickGate,
  getSlickGateName,
  assignCarouselGateName,
  isInsideSingleItemSlickCarousel,
  classifySlickCarousel,
  KIND_ATTRIBUTE,
} = require('../src/js/components/intro-animations/integrations/slick-gate.js');

// Fake window that records addEventListener + dispatches synchronously.
function createFakeWindow() {
  const listeners = new Map();
  return {
    listeners,
    addEventListener(type, fn) {
      if (!listeners.has(type)) listeners.set(type, []);
      listeners.get(type).push(fn);
    },
    removeEventListener(type, fn) {
      const list = listeners.get(type);
      if (!list) return;
      const i = list.indexOf(fn);
      if (i !== -1) list.splice(i, 1);
    },
    dispatch(type) {
      (listeners.get(type) || []).forEach(fn => fn({ type }));
    },
    requestAnimationFrame(fn) { fn(); return 1; },
  };
}

// Minimal choreographer mock that records gate calls.
function createRecordingChoreographer() {
  const closed = [];
  const opened = [];
  return {
    closeGate(name) { closed.push(name); },
    openGate(name, opts) { opened.push({ name, opts }); },
    closedCalls: closed,
    openedCalls: opened,
  };
}

// ---------- page-transition-gate ----------

test('attachPageTransitionGate closes the gate on anima:page-transition-start', () => {
  const win = createFakeWindow();
  const ch = createRecordingChoreographer();

  attachPageTransitionGate({ window: win, choreographer: ch });

  win.dispatch('anima:page-transition-start');

  assert.deepEqual(ch.closedCalls, [PAGE_TRANSITION_GATE]);
  assert.deepEqual(ch.openedCalls, []);
});

test('attachPageTransitionGate opens the gate with settle on anima:page-transition-complete', () => {
  const win = createFakeWindow();
  const ch = createRecordingChoreographer();

  attachPageTransitionGate({ window: win, choreographer: ch, settleMs: 200 });

  win.dispatch('anima:page-transition-complete');

  assert.equal(ch.openedCalls.length, 1);
  assert.equal(ch.openedCalls[0].name, PAGE_TRANSITION_GATE);
  assert.equal(ch.openedCalls[0].opts.settle, 200);
});

test('attachPageTransitionGate closes the gate during the initial page-transition loader', () => {
  const win = createFakeWindow();
  const ch = createRecordingChoreographer();
  const doc = {
    body: {
      classList: {
        contains(name) {
          return name === 'is-loading' || name === 'has-page-transitions';
        },
      },
    },
  };

  attachPageTransitionGate({ window: win, document: doc, choreographer: ch });

  assert.deepEqual(ch.closedCalls, [PAGE_TRANSITION_GATE]);
});

test('attachPageTransitionGate returns a detach function that removes listeners', () => {
  const win = createFakeWindow();
  const ch = createRecordingChoreographer();

  const detach = attachPageTransitionGate({ window: win, choreographer: ch });
  detach();

  win.dispatch('anima:page-transition-start');
  win.dispatch('anima:page-transition-complete');

  assert.deepEqual(ch.closedCalls, []);
  assert.deepEqual(ch.openedCalls, []);
});

test('attachPageTransitionGate is a no-op without a choreographer or window', () => {
  assert.doesNotThrow(() => attachPageTransitionGate({ window: null, choreographer: null }));
  assert.doesNotThrow(() => attachPageTransitionGate({ window: createFakeWindow(), choreographer: null }));
});

// ---------- slick-gate helpers ----------

test('assignCarouselGateName assigns a stable id on first call', () => {
  const attrs = {};
  const carousel = {
    getAttribute: (k) => attrs[k] || null,
    setAttribute: (k, v) => { attrs[k] = v; },
  };

  const first = assignCarouselGateName(carousel);
  const second = assignCarouselGateName(carousel);

  assert.equal(first, second, 'second call should return the same id');
  assert.ok(first.startsWith('slick:'));
});

test('getSlickGateName returns null for elements outside a carousel', () => {
  const el = { closest: () => null };
  assert.equal(getSlickGateName(el), null);
});

test('getSlickGateName returns the carousel\'s gate for a descendant', () => {
  const attrs = {};
  const carousel = {
    getAttribute: (k) => attrs[k] || null,
    setAttribute: (k, v) => { attrs[k] = v; },
  };
  const descendant = { closest: (sel) => sel === '.slick-initialized.slick-slider' ? carousel : null };

  const gate = getSlickGateName(descendant);
  assert.ok(gate && gate.startsWith('slick:'));
});

// ---------- slick-gate attach ----------

// Minimal jQuery-like stub sufficient for the integration's needs.
function createFakejQuery(carouselList) {
  // carouselList = array reference the test mutates; find() always returns
  // the current set, so rescans after a page transition pick up new carousels.
  function wrap(nodes) {
    return {
      0: nodes[0], // jQuery-style numeric index access
      length: nodes.length,
      find(_sel) {
        return wrap(carouselList);
      },
      each(fn) {
        nodes.forEach((n, i) => fn.call(n, i, n));
      },
      on(type, fn) {
        nodes.forEach(n => {
          n.events = n.events || {};
          n.events[type] = n.events[type] || [];
          n.events[type].push(fn);
        });
      },
      data(key, value) {
        if (nodes.length === 0) return undefined;
        const n = nodes[0];
        n.dataStore = n.dataStore || {};
        if (value === undefined) return n.dataStore[key];
        n.dataStore[key] = value;
        return this;
      },
      // Stubs Slick's jQuery plugin interface. The carousel node is expected
      // to carry a _slickOptions object when Slick-initialized behavior is
      // needed in the test.
      slick(methodName) {
        if (nodes.length === 0) return null;
        const n = nodes[0];
        if (methodName === 'getSlick') {
          return n._slickOptions ? { options: n._slickOptions } : null;
        }
        return null;
      },
    };
  }

  return function $(arg) {
    // Accepts document, a carousel node, or a "this" binding from .each.
    if (Array.isArray(arg)) return wrap(arg);
    if (arg && typeof arg === 'object') return wrap([arg]);
    return wrap([]);
  };
}

function createCarousel(slickOptions = { slidesToShow: 1, fade: true }) {
  const attrs = {};
  return {
    getAttribute: (k) => (k in attrs ? attrs[k] : null),
    setAttribute: (k, v) => { attrs[k] = v; },
    events: {},
    dataStore: {},
    _slickOptions: slickOptions,
    // closest() for isInsideSingleItemSlickCarousel tests — returns self
    // when asked for the carousel selector.
    closest(sel) {
      return sel.indexOf('slick-slider') !== -1 ? this : null;
    },
  };
}

test('attachSlickGate wires beforeChange/afterChange into choreographer gates', () => {
  const win = createFakeWindow();
  const carousel = createCarousel();
  const carouselList = [carousel];
  const $ = createFakejQuery(carouselList);
  const ch = createRecordingChoreographer();

  attachSlickGate({
    window: win,
    document: { querySelectorAll: () => [carousel] },
    jQuery: $,
    choreographer: ch,
    settleMs: 150,
  });

  // Simulate Slick firing its events
  (carousel.events.beforeChange || []).forEach(fn => fn());
  assert.equal(ch.closedCalls.length, 1);
  assert.ok(ch.closedCalls[0].startsWith('slick:'));

  (carousel.events.afterChange || []).forEach(fn => fn());
  assert.equal(ch.openedCalls.length, 1);
  assert.equal(ch.openedCalls[0].opts.settle, 150);
});

test('attachSlickGate skips carousels already bound (via jQuery data flag)', () => {
  const win = createFakeWindow();
  const carousel = createCarousel();
  carousel.dataStore['anima-slick-gate-bound'] = true;
  const carouselList = [carousel];
  const $ = createFakejQuery(carouselList);
  const ch = createRecordingChoreographer();

  attachSlickGate({
    window: win,
    document: { querySelectorAll: () => [carousel] },
    jQuery: $,
    choreographer: ch,
  });

  assert.equal(Object.keys(carousel.events).length, 0, 'no new handlers attached to already-bound carousel');
});

test('attachSlickGate rescans after anima:page-transition-complete', () => {
  const win = createFakeWindow();
  const carouselList = [];
  const $ = createFakejQuery(carouselList);
  const ch = createRecordingChoreographer();

  attachSlickGate({
    window: win,
    document: { querySelectorAll: () => carouselList },
    jQuery: $,
    choreographer: ch,
  });

  // No carousels yet on first scan.
  assert.equal(carouselList.length, 0);

  // Simulate a soft-nav delivering a fresh carousel.
  const newCarousel = createCarousel();
  carouselList.push(newCarousel);

  win.dispatch('anima:page-transition-complete');

  // beforeChange should now be wired on the new carousel.
  assert.ok(
    (newCarousel.events.beforeChange || []).length > 0,
    'newly-delivered carousel should have gate listeners attached'
  );
});

// ---------- classifySlickCarousel ----------

test('classifySlickCarousel: fade → single', () => {
  const carousel = createCarousel({ fade: true, slidesToShow: 1 });
  const $ = createFakejQuery([carousel]);
  assert.equal(classifySlickCarousel(carousel, $), 'single');
});

test('classifySlickCarousel: variableWidth → multi', () => {
  const carousel = createCarousel({ variableWidth: true, slidesToShow: 1 });
  const $ = createFakejQuery([carousel]);
  assert.equal(classifySlickCarousel(carousel, $), 'multi');
});

test('classifySlickCarousel: centerMode → multi', () => {
  const carousel = createCarousel({ centerMode: true, slidesToShow: 1 });
  const $ = createFakejQuery([carousel]);
  assert.equal(classifySlickCarousel(carousel, $), 'multi');
});

test('classifySlickCarousel: slidesToShow > 1 → multi', () => {
  const carousel = createCarousel({ slidesToShow: 3 });
  const $ = createFakejQuery([carousel]);
  assert.equal(classifySlickCarousel(carousel, $), 'multi');
});

test('classifySlickCarousel: plain single slide (slidesToShow=1, no fancy flags) → single', () => {
  const carousel = createCarousel({ slidesToShow: 1 });
  const $ = createFakejQuery([carousel]);
  assert.equal(classifySlickCarousel(carousel, $), 'single');
});

test('classifySlickCarousel: no Slick instance → multi (safe default, no replay)', () => {
  const carousel = createCarousel();
  delete carousel._slickOptions; // no Slick API available
  const $ = createFakejQuery([carousel]);
  assert.equal(classifySlickCarousel(carousel, $), 'multi');
});

// ---------- attachToCarousel behavior per kind ----------

test('attachSlickGate wires gate listeners for SINGLE-item carousels (fade hero)', () => {
  const win = createFakeWindow();
  const carousel = createCarousel({ fade: true, slidesToShow: 1 });
  const carouselList = [carousel];
  const $ = createFakejQuery(carouselList);
  const ch = createRecordingChoreographer();

  attachSlickGate({
    window: win,
    document: { querySelectorAll: () => [carousel] },
    jQuery: $,
    choreographer: ch,
    settleMs: 150,
  });

  assert.equal(carousel.getAttribute(KIND_ATTRIBUTE), 'single');
  assert.ok((carousel.events.beforeChange || []).length > 0,
    'single carousel gets beforeChange listener');
  assert.ok((carousel.events.afterChange || []).length > 0,
    'single carousel gets afterChange listener');
});

test('attachSlickGate does NOT wire gate listeners for MULTI-item carousels', () => {
  const win = createFakeWindow();
  const carousel = createCarousel({ variableWidth: true, slidesToShow: 1 });
  const carouselList = [carousel];
  const $ = createFakejQuery(carouselList);
  const ch = createRecordingChoreographer();

  attachSlickGate({
    window: win,
    document: { querySelectorAll: () => [carousel] },
    jQuery: $,
    choreographer: ch,
  });

  assert.equal(carousel.getAttribute(KIND_ATTRIBUTE), 'multi',
    'kind attribute should be tagged for downstream consumers');
  assert.equal((carousel.events.beforeChange || []).length, 0,
    'multi carousel must NOT get beforeChange listener (it would gate reveals that should never gate)');
  assert.equal((carousel.events.afterChange || []).length, 0);
});

// ---------- isInsideSingleItemSlickCarousel ----------

test('isInsideSingleItemSlickCarousel returns true only for nodes inside a single-tagged carousel', () => {
  const singleCarousel = createCarousel();
  singleCarousel.setAttribute(KIND_ATTRIBUTE, 'single');
  const multiCarousel = createCarousel();
  multiCarousel.setAttribute(KIND_ATTRIBUTE, 'multi');

  const inSingle = {
    closest(sel) { return sel.indexOf('slick-slider') !== -1 ? singleCarousel : null; },
  };
  const inMulti = {
    closest(sel) { return sel.indexOf('slick-slider') !== -1 ? multiCarousel : null; },
  };
  const outside = { closest() { return null; } };

  assert.equal(isInsideSingleItemSlickCarousel(inSingle), true);
  assert.equal(isInsideSingleItemSlickCarousel(inMulti), false);
  assert.equal(isInsideSingleItemSlickCarousel(outside), false);
  assert.equal(isInsideSingleItemSlickCarousel(null), false);
});

// ---------- getSlickGateName honors kind ----------

test('getSlickGateName returns null for nodes inside a multi-item carousel', () => {
  const carousel = createCarousel();
  carousel.setAttribute(KIND_ATTRIBUTE, 'multi');
  const descendant = {
    closest(sel) { return sel.indexOf('slick-slider') !== -1 ? carousel : null; },
  };
  assert.equal(getSlickGateName(descendant), null,
    'multi carousels do not have a gate — their reveals must not wait on a slick:{id} gate');
});

test('getSlickGateName returns a slick:{id} name for nodes inside a single-item carousel', () => {
  const carousel = createCarousel();
  carousel.setAttribute(KIND_ATTRIBUTE, 'single');
  const descendant = {
    closest(sel) { return sel.indexOf('slick-slider') !== -1 ? carousel : null; },
  };
  const name = getSlickGateName(descendant);
  assert.ok(typeof name === 'string' && name.startsWith('slick:'),
    'single carousels emit a slick:{id} gate name');
});

// ---------- init-race MutationObserver ----------

test('attachSlickGate wires carousels that become .slick-initialized AFTER attach', () => {
  // Simulates the common race: attachSlickGate runs before Slick initializes.
  // When Slick later adds .slick-initialized to a carousel, our MutationObserver
  // should catch the class change and wire the gate.

  const events = [];
  let mutationCallback = null;

  const fakeWindow = {
    addEventListener() {},
    removeEventListener() {},
    requestAnimationFrame(fn) { fn(); return 1; },
    MutationObserver: class {
      constructor(cb) { mutationCallback = cb; }
      observe() {}
      disconnect() {}
    },
  };

  const carousel = createCarousel({ fade: true, slidesToShow: 1 });
  // At attach time, the carousel is NOT yet slick-initialized — scan finds nothing.
  const carouselList = [];
  const $ = createFakejQuery(carouselList);
  const ch = createRecordingChoreographer();

  attachSlickGate({
    window: fakeWindow,
    document: { body: {}, querySelectorAll: () => carouselList },
    jQuery: $,
    choreographer: ch,
  });

  // No gate yet.
  assert.equal((carousel.events.beforeChange || []).length, 0);

  // Now Slick finishes init: our MutationObserver sees the class change.
  carouselList.push(carousel);
  // Make the carousel appear as a slick-initialized slick-slider for the observer.
  carousel.classList = {
    contains(cls) {
      return cls === 'slick-initialized' || cls === 'slick-slider';
    },
  };

  // Fire the mutation: class was changed on our carousel.
  mutationCallback([{
    type: 'attributes',
    attributeName: 'class',
    target: carousel,
  }]);

  // Gate should now be wired.
  assert.ok((carousel.events.beforeChange || []).length > 0,
    'late-initialized carousel should have gate listeners attached via the MutationObserver');
});
