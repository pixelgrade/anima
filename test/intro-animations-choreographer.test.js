const test = require('node:test');
const assert = require('node:assert/strict');

const {
  createRevealChoreographer,
} = require('../src/js/components/intro-animations/choreographer.js');

// Fake timers: collect scheduled timeouts so tests can advance time manually.
function createTimerWindow() {
  const timers = new Map();
  let next = 1;
  let now = 0;

  return {
    setTimeout(fn, ms) {
      const id = next++;
      timers.set(id, { fn, fireAt: now + ms });
      return id;
    },
    clearTimeout(id) {
      timers.delete(id);
    },
    advanceBy(ms) {
      now += ms;
      // Fire in insertion order among those past-due.
      const due = [...timers.entries()]
        .filter(([, t]) => t.fireAt <= now)
        .sort(([, a], [, b]) => a.fireAt - b.fireAt);
      for (const [id, timer] of due) {
        timers.delete(id);
        timer.fn();
      }
    },
    pendingCount() {
      return timers.size;
    },
  };
}

// -------- requestReveal: no gates --------

test('requestReveal with no waitFor fires onReveal immediately', () => {
  const fired = [];
  const ch = createRevealChoreographer({
    window: createTimerWindow(),
    onReveal: (el) => fired.push(el.id),
  });

  ch.requestReveal({ id: 'a' });
  assert.deepEqual(fired, ['a']);
  assert.equal(ch.queuedCount(), 0);
});

test('requestReveal with empty waitFor fires immediately', () => {
  const fired = [];
  const ch = createRevealChoreographer({
    window: createTimerWindow(),
    onReveal: (el) => fired.push(el.id),
  });

  ch.requestReveal({ id: 'a' }, { waitFor: [] });
  assert.deepEqual(fired, ['a']);
});

// -------- requestReveal: closed gate queues --------

test('requestReveal queues while its gate is closed', () => {
  const fired = [];
  const ch = createRevealChoreographer({
    window: createTimerWindow(),
    onReveal: (el) => fired.push(el.id),
  });

  ch.closeGate('page-transition');
  ch.requestReveal({ id: 'a' }, { waitFor: ['page-transition'], timeout: 10000 });

  assert.deepEqual(fired, []);
  assert.equal(ch.queuedCount(), 1);
});

test('openGate (no settle) flushes queued requests immediately', () => {
  const fired = [];
  const ch = createRevealChoreographer({
    window: createTimerWindow(),
    onReveal: (el) => fired.push(el.id),
  });

  ch.closeGate('page-transition');
  ch.requestReveal({ id: 'a' }, { waitFor: ['page-transition'], timeout: 10000 });
  ch.requestReveal({ id: 'b' }, { waitFor: ['page-transition'], timeout: 10000 });

  ch.openGate('page-transition');
  assert.deepEqual(fired, ['a', 'b']);
  assert.equal(ch.queuedCount(), 0);
});

// -------- openGate with settle --------

test('openGate with settle keeps the gate effectively closed during settle window', () => {
  const fired = [];
  const timers = createTimerWindow();
  const ch = createRevealChoreographer({
    window: timers,
    onReveal: (el) => fired.push(el.id),
  });

  ch.closeGate('page-transition');
  ch.requestReveal({ id: 'a' }, { waitFor: ['page-transition'], timeout: 10000 });

  ch.openGate('page-transition', { settle: 200 });
  // Before settle elapses: NOTHING fires.
  timers.advanceBy(199);
  assert.deepEqual(fired, []);
  // A fresh requestReveal in this window still queues behind the same gate.
  ch.requestReveal({ id: 'b' }, { waitFor: ['page-transition'], timeout: 10000 });
  assert.deepEqual(fired, []);
  assert.equal(ch.queuedCount(), 2);

  // Settle elapses: everything queued flushes together.
  timers.advanceBy(1);
  assert.deepEqual(fired, ['a', 'b']);
  assert.equal(ch.queuedCount(), 0);
});

test('closeGate during a pending settle cancels the open', () => {
  const fired = [];
  const timers = createTimerWindow();
  const ch = createRevealChoreographer({
    window: timers,
    onReveal: (el) => fired.push(el.id),
  });

  ch.closeGate('slick:hero');
  ch.requestReveal({ id: 'a' }, { waitFor: ['slick:hero'], timeout: 10000 });

  ch.openGate('slick:hero', { settle: 300 });
  timers.advanceBy(100);

  // User clicks Next mid-settle — gate re-closes.
  ch.closeGate('slick:hero');
  timers.advanceBy(500);

  assert.deepEqual(fired, [], 'the previous settle should have been cancelled');
  assert.equal(ch.queuedCount(), 1);
});

// -------- multi-gate requests --------

test('a request with multiple gates only fires when ALL are open', () => {
  const fired = [];
  const ch = createRevealChoreographer({
    window: createTimerWindow(),
    onReveal: (el) => fired.push(el.id),
  });

  ch.closeGate('page-transition');
  ch.closeGate('slick:hero');
  ch.requestReveal({ id: 'a' }, {
    waitFor: ['page-transition', 'slick:hero'],
    timeout: 10000,
  });

  ch.openGate('page-transition');
  assert.deepEqual(fired, [], 'one gate still closed → still queued');

  ch.openGate('slick:hero');
  assert.deepEqual(fired, ['a']);
});

// -------- reduced motion --------

test('prefersReducedMotion bypasses the queue and fires immediately', () => {
  const fired = [];
  const ch = createRevealChoreographer({
    window: createTimerWindow(),
    prefersReducedMotion: () => true,
    onReveal: (el) => fired.push(el.id),
  });

  ch.closeGate('page-transition');
  ch.requestReveal({ id: 'a' }, { waitFor: ['page-transition'], timeout: 10000 });

  assert.deepEqual(fired, ['a']);
  assert.equal(ch.queuedCount(), 0);
});

// -------- timeout safety net --------

test('a request force-fires after its timeout if its gate never opens', () => {
  const fired = [];
  const timers = createTimerWindow();
  const ch = createRevealChoreographer({
    window: timers,
    onReveal: (el) => fired.push(el.id),
    defaultTimeout: 1500,
  });

  ch.closeGate('stuck');
  ch.requestReveal({ id: 'a' }, { waitFor: ['stuck'] });

  timers.advanceBy(1499);
  assert.deepEqual(fired, []);

  timers.advanceBy(1);
  assert.deepEqual(fired, ['a']);
  assert.equal(ch.queuedCount(), 0);
});

test('timeout 0 disables the safety net', () => {
  const fired = [];
  const timers = createTimerWindow();
  const ch = createRevealChoreographer({
    window: timers,
    onReveal: (el) => fired.push(el.id),
  });

  ch.closeGate('stuck');
  ch.requestReveal({ id: 'a' }, { waitFor: ['stuck'], timeout: 0 });

  timers.advanceBy(1000000);
  assert.deepEqual(fired, []);
  assert.equal(ch.queuedCount(), 1);
});

// -------- re-requesting the same element --------

test('re-requesting the same element cancels the previous request', () => {
  const fired = [];
  const timers = createTimerWindow();
  const ch = createRevealChoreographer({
    window: timers,
    onReveal: (el) => fired.push(el.id),
  });

  const el = { id: 'a' };

  ch.closeGate('g');
  ch.requestReveal(el, { waitFor: ['g'], timeout: 1000 });

  // Second request with no gates fires immediately AND drops the queued one.
  ch.requestReveal(el, { waitFor: [] });

  assert.deepEqual(fired, ['a']);
  assert.equal(ch.queuedCount(), 0);

  timers.advanceBy(2000); // the first request's timeout should NOT fire
  assert.deepEqual(fired, ['a']);
});

// -------- disconnect --------

test('disconnect clears all queued requests and cancels every timer', () => {
  const fired = [];
  const timers = createTimerWindow();
  const ch = createRevealChoreographer({
    window: timers,
    onReveal: (el) => fired.push(el.id),
  });

  ch.closeGate('g');
  ch.requestReveal({ id: 'a' }, { waitFor: ['g'], timeout: 1000 });
  ch.requestReveal({ id: 'b' }, { waitFor: ['g'], timeout: 1000 });
  ch.openGate('g', { settle: 500 });

  ch.disconnect();

  timers.advanceBy(10000);
  assert.deepEqual(fired, []);
  assert.equal(ch.queuedCount(), 0);
  assert.equal(timers.pendingCount(), 0, 'every timer should be cleared');
});

test('disconnect can preserve closed gates while clearing old queued requests', () => {
  const fired = [];
  const timers = createTimerWindow();
  const ch = createRevealChoreographer({
    window: timers,
    onReveal: (el) => fired.push(el.id),
  });

  ch.closeGate('page-transition');
  ch.requestReveal({ id: 'old' }, { waitFor: ['page-transition'], timeout: 1000 });

  ch.disconnect({ preserveGates: true });

  assert.equal(ch.isGateOpen('page-transition'), false);
  assert.equal(ch.queuedCount(), 0);

  ch.requestReveal({ id: 'fresh' }, { waitFor: ['page-transition'], timeout: 0 });
  assert.deepEqual(fired, []);
  assert.equal(ch.queuedCount(), 1);

  ch.openGate('page-transition');
  assert.deepEqual(fired, ['fresh']);
});

test('disconnect preserves pending gate opens when preserving gates', () => {
  const fired = [];
  const timers = createTimerWindow();
  const ch = createRevealChoreographer({
    window: timers,
    onReveal: (el) => fired.push(el.id),
  });

  ch.closeGate('page-transition');
  ch.openGate('page-transition', { settle: 200 });
  ch.disconnect({ preserveGates: true });
  ch.requestReveal({ id: 'fresh' }, { waitFor: ['page-transition'], timeout: 0 });

  timers.advanceBy(199);
  assert.deepEqual(fired, []);

  timers.advanceBy(1);
  assert.deepEqual(fired, ['fresh']);
  assert.equal(ch.isGateOpen('page-transition'), true);
});

// -------- isGateOpen introspection --------

test('isGateOpen reflects current state', () => {
  const ch = createRevealChoreographer({ window: createTimerWindow() });

  assert.equal(ch.isGateOpen('a'), true);
  ch.closeGate('a');
  assert.equal(ch.isGateOpen('a'), false);
  ch.openGate('a');
  assert.equal(ch.isGateOpen('a'), true);
});

// -------- onReveal throwing --------

test('a throwing onReveal does not corrupt the queue', () => {
  const fired = [];
  let throwOnce = true;
  const ch = createRevealChoreographer({
    window: createTimerWindow(),
    onReveal: (el) => {
      if (throwOnce && el.id === 'a') {
        throwOnce = false;
        throw new Error('boom');
      }
      fired.push(el.id);
    },
  });

  ch.closeGate('g');
  ch.requestReveal({ id: 'a' }, { waitFor: ['g'], timeout: 10000 });
  ch.requestReveal({ id: 'b' }, { waitFor: ['g'], timeout: 10000 });

  ch.openGate('g');

  assert.deepEqual(fired, ['b'], 'the second reveal fires even though the first threw');
  assert.equal(ch.queuedCount(), 0);
});
