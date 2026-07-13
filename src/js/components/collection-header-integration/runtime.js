const CANVAS_SELECTOR = '.anima-collection-canvas';
const HEADER_SELECTOR = ':scope > header.wp-block-template-part, header.wp-block-template-part';
const COLLECTION_SELECTOR = '.nb-supernova--layout-recipe-anima-collage[data-header-integration="grid-item"]';
const PROXY_SELECTOR = '[data-nb-external-participant="site-header"]';
const SHARED_RUNTIME_KEY = '__animaCollectionHeaderIntegrationRuntime';
let sharedRuntime = null;
let sharedRuntimeWindow = null;

function getCandidates(canvas) {
  if (!canvas || typeof canvas.querySelector !== 'function') {
    return [];
  }

  const header = canvas.querySelector(HEADER_SELECTOR);
  const collections = typeof canvas.querySelectorAll === 'function'
    ? Array.from(canvas.querySelectorAll(COLLECTION_SELECTOR))
    : [canvas.querySelector(COLLECTION_SELECTOR)].filter(Boolean);

  if (!header) {
    return [];
  }

  return collections.map((collection) => {
    const proxy = collection && collection.querySelector(PROXY_SELECTOR);
    const grid = proxy && typeof proxy.closest === 'function'
      ? proxy.closest('.nb-collection__layout')
      : null;

    return proxy && grid ? {canvas, header, collection, proxy, grid} : null;
  }).filter(Boolean);
}

function getCandidate(canvas) {
  return getCandidates(canvas)[0] || null;
}

function getEditorColumnCount(grid) {
  if (!grid || typeof grid.querySelectorAll !== 'function') {
    return null;
  }

  const columns = grid.querySelectorAll(':scope > .nb-collection__layout-column');
  return columns.length > 0 ? columns.length : null;
}

function captureHeaderStyle(header) {
  return {
    position: header.style.position,
    top: header.style.top,
    left: header.style.left,
    width: header.style.width,
    zIndex: header.style.zIndex,
  };
}

function restoreHeaderStyle(binding) {
  const {header, originalHeaderStyle} = binding;

  Object.keys(originalHeaderStyle).forEach((property) => {
    header.style[property] = originalHeaderStyle[property];
  });
}

function releaseBinding(binding, {flow = false, hideProxy = false} = {}) {
  restoreHeaderStyle(binding);
  binding.header.classList.remove('is-anima-collage-header-integrated');
  binding.canvas.classList.remove('is-anima-collage-header-bound');
  binding.canvas.classList[flow ? 'add' : 'remove']('is-anima-collage-header-flow');
  binding.proxy.style.removeProperty('--nb-external-participant-height');
  binding.proxy.hidden = flow || hideProxy;
  binding.flow = flow;
}

function destroyBinding(binding) {
  releaseBinding(binding, {hideProxy: true});
  if (binding.resizeObserver) {
    binding.resizeObserver.disconnect();
    binding.resizeObserver = null;
  }
}

function applyBinding(binding) {
  const {canvas, header, proxy} = binding;

  proxy.hidden = false;
  canvas.classList.remove('is-anima-collage-header-flow');
  canvas.classList.add('is-anima-collage-header-bound');

  const headerRect = header.getBoundingClientRect();
  proxy.style.setProperty('--nb-external-participant-height', `${headerRect.height}px`);

  const proxyRect = proxy.getBoundingClientRect();
  const canvasRect = canvas.getBoundingClientRect();

  header.style.position = 'absolute';
  header.style.top = `${proxyRect.top - canvasRect.top}px`;
  header.style.left = `${proxyRect.left - canvasRect.left}px`;
  header.style.width = `${proxyRect.width}px`;
  header.style.zIndex = '40';
  header.classList.add('is-anima-collage-header-integrated');
  binding.flow = false;
}

function createCollectionHeaderIntegrationRuntime({
  window: win = typeof window !== 'undefined' ? window : null,
  document: doc = typeof document !== 'undefined' ? document : null,
  createObserver = (callback) => {
    const Observer = win && typeof win.MutationObserver === 'function'
      ? win.MutationObserver
      : (typeof MutationObserver === 'function' ? MutationObserver : null);
    return Observer ? new Observer(callback) : null;
  },
  createResizeObserver = (callback) => {
    const Observer = win && typeof win.ResizeObserver === 'function'
      ? win.ResizeObserver
      : (typeof ResizeObserver === 'function' ? ResizeObserver : null);
    return Observer ? new Observer(callback) : null;
  },
} = {}) {
  const bindings = new Map();
  const activeColumnsByGrid = new WeakMap();
  let observer = null;
  let frameId = null;
  let isBound = false;

  function rememberLayoutEvent(event) {
    const eventGrid = event && event.detail ? event.detail.grid : null;
    const eventColumns = event && event.detail ? event.detail.activeColumns : null;
    if (eventGrid && Number.isFinite(eventColumns)) {
      activeColumnsByGrid.set(eventGrid, eventColumns);
    }
  }

  function sync(event = null) {
    if (!doc || typeof doc.querySelectorAll !== 'function') {
      return;
    }

    rememberLayoutEvent(event);

    const canvases = Array.from(doc.querySelectorAll(CANVAS_SELECTOR));
    const activeCanvases = new Set(canvases);

    bindings.forEach((binding, canvas) => {
      if (!activeCanvases.has(canvas)) {
        destroyBinding(binding);
        bindings.delete(canvas);
      }
    });

    canvases.forEach((canvas) => {
      const candidates = getCandidates(canvas);
      const candidate = candidates[0] || null;
      const existing = bindings.get(canvas);

      candidates.slice(1).forEach(({proxy}) => {
        proxy.style.removeProperty('--nb-external-participant-height');
        proxy.hidden = true;
      });

      if (!candidate) {
        if (existing) {
          destroyBinding(existing);
          bindings.delete(canvas);
        }
        return;
      }

      let binding = existing;
      if (!binding || binding.header !== candidate.header || binding.proxy !== candidate.proxy || binding.grid !== candidate.grid) {
        if (binding) {
          destroyBinding(binding);
        }
        binding = {
          ...candidate,
          originalHeaderStyle: captureHeaderStyle(candidate.header),
          flow: false,
          resizeObserver: null,
        };
        binding.resizeObserver = createResizeObserver(scheduleSync);
        if (binding.resizeObserver && typeof binding.resizeObserver.observe === 'function') {
          binding.resizeObserver.observe(binding.header);
          binding.resizeObserver.observe(binding.grid);
        }
        bindings.set(canvas, binding);
      }

      const activeColumns = activeColumnsByGrid.get(binding.grid) || getEditorColumnCount(binding.grid);
      if (activeColumns === 1) {
        releaseBinding(binding, {flow: true});
        return;
      }

      applyBinding(binding);
    });
  }

  function scheduleSync(event = null) {
    // Nova emits the detailed Masonry event immediately followed by the
    // generic layout event. Persist the detail before coalescing animation
    // frames so the generic event cannot erase the one-column state.
    rememberLayoutEvent(event);

    if (!win || typeof win.requestAnimationFrame !== 'function') {
      sync();
      return;
    }

    if (frameId !== null) {
      win.cancelAnimationFrame(frameId);
    }

    frameId = win.requestAnimationFrame(() => {
      frameId = null;
      sync();
    });
  }

  function bind() {
    if (isBound || !win || !doc) {
      return;
    }

    isBound = true;
    win.addEventListener('nb:masonry-layout', scheduleSync);
    win.addEventListener('nb:layout', scheduleSync);
    win.addEventListener('resize', scheduleSync);

    observer = createObserver(scheduleSync);
    if (observer && doc.body && typeof observer.observe === 'function') {
      observer.observe(doc.body, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['data-header-integration'],
      });
    }

    sync();
  }

  function destroy() {
    if (!isBound) {
      return;
    }

    isBound = false;
    win.removeEventListener('nb:masonry-layout', scheduleSync);
    win.removeEventListener('nb:layout', scheduleSync);
    win.removeEventListener('resize', scheduleSync);
    if (observer) {
      observer.disconnect();
    }
    if (frameId !== null) {
      win.cancelAnimationFrame(frameId);
    }
    bindings.forEach((binding) => destroyBinding(binding));
    bindings.clear();
  }

  return {bind, destroy, sync};
}

function getSharedCollectionHeaderIntegrationRuntime(options = {}) {
  const runtimeWindow = options.window || (typeof window !== 'undefined' ? window : null);

  // `scripts.js` and `page-transitions.js` are independent webpack bundles,
  // so their module caches cannot provide a true singleton. Store the runtime
  // on the shared browser window to keep AJAX re-initialization idempotent.
  if (runtimeWindow) {
    if (!runtimeWindow[SHARED_RUNTIME_KEY]) {
      runtimeWindow[SHARED_RUNTIME_KEY] = createCollectionHeaderIntegrationRuntime(options);
      runtimeWindow[SHARED_RUNTIME_KEY].bind();
    }
    sharedRuntimeWindow = runtimeWindow;
    return runtimeWindow[SHARED_RUNTIME_KEY];
  }

  if (!sharedRuntime) {
    sharedRuntime = createCollectionHeaderIntegrationRuntime(options);
    sharedRuntime.bind();
  }
  return sharedRuntime;
}

function destroySharedCollectionHeaderIntegrationRuntime(options = {}) {
  const runtimeWindow = options.window || sharedRuntimeWindow || (typeof window !== 'undefined' ? window : null);
  const runtime = runtimeWindow ? runtimeWindow[SHARED_RUNTIME_KEY] : sharedRuntime;

  if (!runtime) {
    return;
  }

  runtime.destroy();
  if (runtimeWindow && runtimeWindow[SHARED_RUNTIME_KEY] === runtime) {
    delete runtimeWindow[SHARED_RUNTIME_KEY];
  }
  sharedRuntime = null;
  sharedRuntimeWindow = null;
}

module.exports = {
  CANVAS_SELECTOR,
  HEADER_SELECTOR,
  COLLECTION_SELECTOR,
  PROXY_SELECTOR,
  SHARED_RUNTIME_KEY,
  createCollectionHeaderIntegrationRuntime,
  destroySharedCollectionHeaderIntegrationRuntime,
  getSharedCollectionHeaderIntegrationRuntime,
  getCandidate,
  getCandidates,
  getEditorColumnCount,
};
