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
    };
  }

  return function $(arg) {
    // Accepts document, a carousel node, or a "this" binding from .each.
    if (Array.isArray(arg)) return wrap(arg);
    if (arg && typeof arg === 'object') return wrap([arg]);
    return wrap([]);
  };
}

function createCarousel() {
  const attrs = {};
  return {
    getAttribute: (k) => attrs[k] || null,
    setAttribute: (k, v) => { attrs[k] = v; },
    events: {},
    dataStore: {},
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
