const test = require('node:test');
const assert = require('node:assert/strict');

const {
  createIntroAnimationsRuntime,
} = require('../src/js/components/intro-animations/runtime.js');

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

function createTarget(name, isInViewport = false) {
  return {
    name,
    isInViewport,
    classList: createClassList(),
  };
}

function createWindowStub() {
  const listeners = new Map();
  const animationFrameQueue = [];

  return {
    listeners,
    animationFrameQueue,
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

test('initialize stages in-viewport targets and reveals them on the next animation frame', () => {
  const target = createTarget('hero', true);
  const win = createWindowStub();
  const observerEntries = [];
  const runtime = createIntroAnimationsRuntime({
    window: win,
    document: {
      body: {
        classList: {
          contains(className) {
            return className === 'has-intro-animations';
          },
        },
      },
    },
    collectTargets() {
      return [target];
    },
    createObserver(callback) {
      observerEntries.push(callback);

      return {
        observe() {},
        unobserve() {},
        disconnect() {},
      };
    },
  });

  runtime.initialize();

  assert.equal(target.classList.contains('anima-intro-target--pending'), true);
  assert.equal(target.classList.contains('anima-intro-target--revealed'), false);

  win.flushAnimationFrames();

  assert.equal(target.classList.contains('anima-intro-target--pending'), false);
  assert.equal(target.classList.contains('anima-intro-target--revealed'), true);
  assert.equal(observerEntries.length, 0);
});

test('initialize observes offscreen targets until they intersect', () => {
  const target = createTarget('card', false);
  const win = createWindowStub();
  let observerCallback = null;
  let observedTarget = null;
  let unobservedTarget = null;
  const runtime = createIntroAnimationsRuntime({
    window: win,
    document: {
      body: {
        classList: {
          contains(className) {
            return className === 'has-intro-animations';
          },
        },
      },
    },
    collectTargets() {
      return [target];
    },
    createObserver(callback) {
      observerCallback = callback;

      return {
        observe(node) {
          observedTarget = node;
        },
        unobserve(node) {
          unobservedTarget = node;
        },
        disconnect() {},
      };
    },
  });

  runtime.initialize();

  assert.equal(observedTarget, target);
  assert.equal(target.classList.contains('anima-intro-target--pending'), true);
  assert.equal(target.classList.contains('anima-intro-target--revealed'), false);

  observerCallback([
    {
      isIntersecting: true,
      target,
    },
  ]);

  assert.equal(unobservedTarget, target);
  assert.equal(target.classList.contains('anima-intro-target--revealed'), true);
});

test('initialize skips targets already consumed in the same page view', () => {
  const target = createTarget('repeat-card', true);
  const win = createWindowStub();
  let observeCount = 0;
  const runtime = createIntroAnimationsRuntime({
    window: win,
    document: {
      body: {
        classList: {
          contains(className) {
            return className === 'has-intro-animations';
          },
        },
      },
    },
    collectTargets() {
      return [target];
    },
    createObserver() {
      return {
        observe() {
          observeCount += 1;
        },
        unobserve() {},
        disconnect() {},
      };
    },
  });

  runtime.initialize();
  win.flushAnimationFrames();
  runtime.initialize();
  win.flushAnimationFrames();

  assert.equal(observeCount, 0);
  assert.equal(target.classList.contains('anima-intro-target--revealed'), true);
});

test('bind registers a single page-transition listener and re-runs initialize on completion', () => {
  const win = createWindowStub();
  let collectCalls = 0;
  const runtime = createIntroAnimationsRuntime({
    window: win,
    document: {
      body: {
        classList: {
          contains(className) {
            return className === 'has-intro-animations';
          },
        },
      },
    },
    collectTargets() {
      collectCalls += 1;
      return [];
    },
    createObserver() {
      return {
        observe() {},
        unobserve() {},
        disconnect() {},
      };
    },
  });

  runtime.bind();
  runtime.bind();

  assert.equal(win.listeners.get('anima:page-transition-complete').length, 1);
  assert.equal(collectCalls, 0);

  win.dispatchEvent({type: 'anima:page-transition-complete'});

  assert.equal(collectCalls, 1);
});
