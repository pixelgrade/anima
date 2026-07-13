const test = require('node:test');
const assert = require('node:assert/strict');

const {
  createCollectionHeaderIntegrationRuntime,
  destroySharedCollectionHeaderIntegrationRuntime,
  getSharedCollectionHeaderIntegrationRuntime,
} = require('./runtime.js');

function createClassList() {
  const values = new Set();
  return {
    add: (...names) => names.forEach((name) => values.add(name)),
    remove: (...names) => names.forEach((name) => values.delete(name)),
    contains: (name) => values.has(name),
  };
}

function createStyle() {
  const custom = new Map();
  return {
    position: '',
    top: '',
    left: '',
    width: '',
    zIndex: '',
    setProperty: (name, value) => custom.set(name, value),
    removeProperty: (name) => custom.delete(name),
    getPropertyValue: (name) => custom.get(name) || '',
  };
}

function createFixture({integrated = true, height = 120, x = 100, deferFrames = false} = {}) {
  const header = {
    classList: createClassList(),
    style: createStyle(),
    getBoundingClientRect: () => ({height, left: 20, top: 10, width: 900}),
  };
  const grid = {querySelectorAll: () => []};
  const proxy = {
    hidden: false,
    style: createStyle(),
    closest: () => grid,
    getBoundingClientRect: () => ({height, left: x, top: 200, width: 300}),
  };
  const collection = {
    querySelector: () => proxy,
  };
  const canvas = {
    classList: createClassList(),
    querySelector(selector) {
      if (selector.includes('data-header-integration')) return integrated ? collection : null;
      if (selector.includes('header.wp-block-template-part')) return header;
      return null;
    },
    getBoundingClientRect: () => ({left: 20, top: 40, width: 1000}),
  };
  const listeners = new Map();
  const frames = new Map();
  let nextFrameId = 0;
  const win = {
    addEventListener(type, callback) { listeners.set(type, callback); },
    removeEventListener(type) { listeners.delete(type); },
    requestAnimationFrame(callback) {
      if (!deferFrames) {
        callback();
        return 1;
      }

      nextFrameId += 1;
      frames.set(nextFrameId, callback);
      return nextFrameId;
    },
    cancelAnimationFrame(id) { frames.delete(id); },
  };
  const doc = {
    body: {},
    querySelectorAll: () => [canvas],
  };

  const flushAnimationFrames = () => {
    const callbacks = Array.from(frames.values());
    frames.clear();
    callbacks.forEach((callback) => callback());
  };

  return {header, grid, proxy, collection, canvas, listeners, win, doc, flushAnimationFrames};
}

function createSameCanvasFixture() {
  const fixture = createFixture();
  const secondGrid = {querySelectorAll: () => []};
  const secondProxy = {
    hidden: false,
    style: createStyle(),
    closest: () => secondGrid,
    getBoundingClientRect: () => ({height: 120, left: 500, top: 200, width: 300}),
  };
  const secondCollection = {querySelector: () => secondProxy};
  fixture.canvas.querySelectorAll = (selector) => selector.includes('data-header-integration')
    ? [fixture.collection, secondCollection]
    : [];

  return {...fixture, secondGrid, secondProxy, secondCollection};
}

test('positions the real Header over its local proxy without moving or cloning it', () => {
  const fixture = createFixture();
  const runtime = createCollectionHeaderIntegrationRuntime({
    window: fixture.win,
    document: fixture.doc,
    createObserver: () => null,
  });

  runtime.bind();

  assert.equal(fixture.proxy.style.getPropertyValue('--nb-external-participant-height'), '120px');
  assert.equal(fixture.header.style.position, 'absolute');
  assert.equal(fixture.header.style.top, '160px');
  assert.equal(fixture.header.style.left, '80px');
  assert.equal(fixture.header.style.width, '300px');
  assert.equal(fixture.proxy.hidden, false);
  assert.equal(fixture.header.classList.contains('is-anima-collage-header-integrated'), true);
  assert.equal(fixture.canvas.classList.contains('is-anima-collage-header-bound'), true);
  assert.equal(Object.hasOwn(fixture.header, 'cloneNode'), false);
  assert.equal(Object.hasOwn(fixture.canvas, 'appendChild'), false);
} );

test('releases the Header to normal flow when Masonry reports one column', () => {
  const fixture = createFixture();
  const runtime = createCollectionHeaderIntegrationRuntime({
    window: fixture.win,
    document: fixture.doc,
    createObserver: () => null,
  });

  runtime.bind();
  fixture.listeners.get('nb:masonry-layout')({
    detail: {grid: fixture.grid, activeColumns: 1},
  });

  assert.equal(fixture.header.style.position, '');
  assert.equal(fixture.proxy.style.getPropertyValue('--nb-external-participant-height'), '');
  assert.equal(fixture.proxy.hidden, true);
  assert.equal(fixture.header.classList.contains('is-anima-collage-header-integrated'), false);
  assert.equal(fixture.canvas.classList.contains('is-anima-collage-header-flow'), true);
} );

test('preserves the one-column state when the generic layout event coalesces the same frame', () => {
  const fixture = createFixture({deferFrames: true});
  const runtime = createCollectionHeaderIntegrationRuntime({
    window: fixture.win,
    document: fixture.doc,
    createObserver: () => null,
  });

  runtime.bind();
  fixture.listeners.get('nb:masonry-layout')({
    detail: {grid: fixture.grid, activeColumns: 1},
  });
  fixture.listeners.get('nb:layout')({});
  fixture.flushAnimationFrames();

  assert.equal(fixture.header.style.position, '');
  assert.equal(fixture.proxy.hidden, true);
  assert.equal(fixture.canvas.classList.contains('is-anima-collage-header-flow'), true);
} );

test('leaves the standard Header untouched when integration is disabled', () => {
  const fixture = createFixture({integrated: false});
  const runtime = createCollectionHeaderIntegrationRuntime({
    window: fixture.win,
    document: fixture.doc,
    createObserver: () => null,
  });

  runtime.bind();

  assert.equal(fixture.header.style.position, '');
  assert.equal(fixture.canvas.classList.contains('is-anima-collage-header-bound'), false);
} );

test('keeps multiple collection canvases local and releases a removed canvas', () => {
  const first = createFixture({x: 100});
  const second = createFixture({x: 500});
  const doc = {
    querySelectorAll: () => [first.canvas, second.canvas],
  };
  const runtime = createCollectionHeaderIntegrationRuntime({
    window: first.win,
    document: doc,
    createObserver: () => null,
  });

  runtime.bind();
  first.listeners.get('nb:masonry-layout')({
    detail: {grid: first.grid, activeColumns: 1},
  });

  assert.equal(first.header.style.position, '');
  assert.equal(first.canvas.classList.contains('is-anima-collage-header-flow'), true);
  assert.equal(second.header.style.position, 'absolute');
  assert.equal(second.header.style.left, '480px');
  assert.equal(second.canvas.classList.contains('is-anima-collage-header-bound'), true);

  doc.querySelectorAll = () => [second.canvas];
  runtime.sync();

  assert.equal(first.header.style.position, '');
  assert.equal(first.canvas.classList.contains('is-anima-collage-header-bound'), false);
  assert.equal(second.header.style.position, 'absolute');
} );

test('binds only the first eligible Collection in one canvas and excludes later proxies', () => {
  const fixture = createSameCanvasFixture();
  const runtime = createCollectionHeaderIntegrationRuntime({
    window: fixture.win,
    document: fixture.doc,
    createObserver: () => null,
  });

  runtime.bind();

  assert.equal(fixture.proxy.hidden, false);
  assert.equal(fixture.secondProxy.hidden, true);
  assert.equal(fixture.secondProxy.style.getPropertyValue('--nb-external-participant-height'), '');
  assert.equal(fixture.header.style.left, '80px');
});

test('observes only relationship changes and watches bound geometry with ResizeObserver', () => {
  const fixture = createFixture();
  let mutationOptions = null;
  let mutationDisconnected = false;
  const resizedElements = [];
  let resizeDisconnected = false;
  const runtime = createCollectionHeaderIntegrationRuntime({
    window: fixture.win,
    document: fixture.doc,
    createObserver: () => ({
      observe(target, options) { mutationOptions = options; },
      disconnect() { mutationDisconnected = true; },
    }),
    createResizeObserver: () => ({
      observe(element) { resizedElements.push(element); },
      disconnect() { resizeDisconnected = true; },
    }),
  });

  runtime.bind();

  assert.deepEqual(mutationOptions, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['data-header-integration'],
  });
  assert.deepEqual(resizedElements, [fixture.header, fixture.grid]);

  runtime.destroy();

  assert.equal(mutationDisconnected, true);
  assert.equal(resizeDisconnected, true);
});

test('shares one bound runtime across repeated App initialization and separate webpack bundles', () => {
  destroySharedCollectionHeaderIntegrationRuntime();
  const fixture = createFixture();
  let observerCount = 0;
  const options = {
    window: fixture.win,
    document: fixture.doc,
    createObserver: () => {
      observerCount += 1;
      return null;
    },
  };

  const first = getSharedCollectionHeaderIntegrationRuntime(options);
  const runtimeModulePath = require.resolve('./runtime.js');
  delete require.cache[runtimeModulePath];
  const reloadedRuntimeModule = require('./runtime.js');
  const second = reloadedRuntimeModule.getSharedCollectionHeaderIntegrationRuntime(options);

  assert.equal(first, second);
  assert.equal(observerCount, 1);
  assert.equal(fixture.listeners.size, 3);

  reloadedRuntimeModule.destroySharedCollectionHeaderIntegrationRuntime();
  assert.equal(fixture.listeners.size, 0);
});
