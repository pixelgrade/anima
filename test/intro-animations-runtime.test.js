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

function createTarget(name, isInViewport = undefined, rect = null) {
  return {
    name,
    isInViewport,
    classList: createClassList(),
    style: createStyleStub(),
    getBoundingClientRect() {
      return rect || {
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
      };
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

test('initialize stages in-viewport targets for one frame before revealing them', () => {
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
  assert.equal(win.animationFrameQueue.length, 1);

  const firstFrame = win.animationFrameQueue.shift();
  firstFrame();

  assert.equal(target.classList.contains('anima-intro-target--pending'), true);
  assert.equal(target.classList.contains('anima-intro-target--revealed'), false);
  assert.equal(win.animationFrameQueue.length, 1);

  const secondFrame = win.animationFrameQueue.shift();
  secondFrame();

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

  target.isInViewport = true;

  observerCallback([
    {
      isIntersecting: true,
      target,
    },
  ]);

  // handleReveal wraps the class-flip in rAF×2 so the browser paints the
  // pre-state before the transition fires. Flush those frames in-test.
  win.flushAnimationFrames();
  win.flushAnimationFrames();

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

test('isInViewport only accepts targets once they reach the deeper reveal zone', () => {
  const target = createTarget('late-card', null, {
    top: 860,
    bottom: 1100,
    left: 0,
    right: 800,
  });
  const win = createWindowStub();
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
      documentElement: {
        clientHeight: 1000,
        clientWidth: 1200,
      },
    },
    collectTargets() {
      return [target];
    },
  });

  assert.equal(runtime.isInViewport(target), false);

  target.getBoundingClientRect = () => ({
    top: 780,
    bottom: 1020,
    left: 0,
    right: 800,
  });

  assert.equal(runtime.isInViewport(target), true);
});

test('initialize distributes fade delay across the full batch window', () => {
  const first = createTarget('first', true);
  const second = createTarget('second', true);
  const third = createTarget('third', true);
  const win = createWindowStub();
  const runtime = createIntroAnimationsRuntime({
    window: win,
    document: {
      body: {
        classList: {
          contains(className) {
            return ['has-intro-animations', 'has-intro-animations--medium'].includes(className);
          },
        },
      },
    },
    collectTargets() {
      return [first, second, third];
    },
    createObserver() {
      return {
        observe() {},
        unobserve() {},
        disconnect() {},
      };
    },
  });

  runtime.initialize();
  win.flushAnimationFrames();

  assert.equal(first.style.getPropertyValue('--anima-intro-delay'), '0ms');
  assert.equal(second.style.getPropertyValue('--anima-intro-delay'), '200ms');
  assert.equal(third.style.getPropertyValue('--anima-intro-delay'), '400ms');
});

test('separate reveal batches get independent fade delay windows', () => {
  const first = createTarget('first', true, {
    top: 80,
    bottom: 180,
    left: 0,
    right: 300,
  });
  const second = createTarget('second', true, {
    top: 120,
    bottom: 220,
    left: 320,
    right: 620,
  });
  const third = createTarget('third', false, {
    top: 900,
    bottom: 1100,
    left: 0,
    right: 300,
  });
  const fourth = createTarget('fourth', false, {
    top: 920,
    bottom: 1120,
    left: 320,
    right: 620,
  });
  const fifth = createTarget('fifth', false, {
    top: 940,
    bottom: 1140,
    left: 640,
    right: 940,
  });
  const win = createWindowStub();
  let observerCallback = null;
  const runtime = createIntroAnimationsRuntime({
    window: win,
    document: {
      body: {
        classList: {
          contains(className) {
            return ['has-intro-animations', 'has-intro-animations--medium', 'has-intro-animations--fade'].includes(className);
          },
        },
      },
      documentElement: {
        clientHeight: 1000,
        clientWidth: 1200,
      },
    },
    collectTargets() {
      return [first, second, third, fourth, fifth];
    },
    createObserver(callback) {
      observerCallback = callback;

      return {
        observe() {},
        unobserve() {},
        disconnect() {},
      };
    },
  });

  runtime.initialize();
  win.flushAnimationFrames();

  assert.equal(first.style.getPropertyValue('--anima-intro-delay'), '0ms');
  assert.equal(second.style.getPropertyValue('--anima-intro-delay'), '300ms');

  observerCallback([
    {
      isIntersecting: true,
      target: third,
    },
    {
      isIntersecting: true,
      target: fourth,
    },
    {
      isIntersecting: true,
      target: fifth,
    },
  ]);

  assert.equal(third.style.getPropertyValue('--anima-intro-delay'), '0ms');
  assert.equal(fourth.style.getPropertyValue('--anima-intro-delay'), '200ms');
  assert.equal(fifth.style.getPropertyValue('--anima-intro-delay'), '400ms');
});

test('default observer watches the deeper reveal band instead of threshold ladders', () => {
  const target = createTarget('band-target', false);
  const win = createWindowStub();
  let capturedOptions = null;
  function IntersectionObserverStub(callback, options) {
    capturedOptions = options;

    return {
      callback,
      observe() {},
      unobserve() {},
      disconnect() {},
    };
  }
  const runtime = createIntroAnimationsRuntime({
    window: {
      ...win,
      IntersectionObserver: IntersectionObserverStub,
    },
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
  });

  runtime.initialize();

  assert.deepEqual(capturedOptions, {
    threshold: 0,
    rootMargin: '0px 0px -18% 0px',
  });
});
