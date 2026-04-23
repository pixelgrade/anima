const test = require('node:test');
const assert = require('node:assert/strict');

const {
  collectRevealTargets,
  collectKineticTitleTargets,
} = require('../src/js/components/intro-animations/targeting.js');

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

function createNode(name, selectors = [], parent = null) {
  const node = {
    name,
    selectors: new Set(selectors),
    parentElement: parent,
    children: [],
    classList: createClassList(),
    isConnected: true,
    matches(selector) {
      return this.selectors.has(selector);
    },
    closest(selector) {
      let current = this;

      while (current) {
        if (current.matches(selector)) {
          return current;
        }

        current = current.parentElement;
      }

      return null;
    },
    contains(otherNode) {
      let current = otherNode && otherNode.parentElement;

      while (current) {
        if (current === this) {
          return true;
        }

        current = current.parentElement;
      }

      return false;
    },
  };

  if (parent) {
    parent.children.push(node);
  }

  return node;
}

function createRoot(selectorMap) {
  return {
    querySelectorAll(selector) {
      return selectorMap[selector] || [];
    },
  };
}

test('collectRevealTargets prefers explicit reveal roots over fallback descendants', () => {
  const group = createNode('group', ['.wp-block-group']);
  const heading = createNode('heading', ['.wp-block-heading'], group);
  const paragraph = createNode('paragraph', ['.wp-block-paragraph'], group);
  const root = createRoot({
    '.wp-block-group': [group],
    '.wp-block-heading': [heading],
    '.wp-block-paragraph': [paragraph],
  });

  const targets = collectRevealTargets(root);

  assert.deepEqual(targets.map((node) => node.name), ['group']);
});

test('collectRevealTargets skips excluded ancestors and their descendants', () => {
  const header = createNode('header', ['header']);
  const button = createNode('button', ['.wp-block-button'], header);
  const root = createRoot({
    '.wp-block-button': [button],
  });

  const targets = collectRevealTargets(root);

  assert.deepEqual(targets, []);
});

test('collectRevealTargets collapses duplicate nested candidates to the outermost valid root', () => {
  const columns = createNode('columns', ['.wp-block-columns']);
  const image = createNode('image', ['.wp-block-image'], columns);
  const quote = createNode('quote', ['.wp-block-quote'], columns);
  const heading = createNode('heading', ['.wp-block-heading'], quote);
  const root = createRoot({
    '.wp-block-columns': [columns],
    '.wp-block-image': [image],
    '.wp-block-quote': [quote],
    '.wp-block-heading': [heading],
  });

  const targets = collectRevealTargets(root);

  assert.deepEqual(targets.map((node) => node.name), ['columns']);
});

test('collectRevealTargets does not exclude valid targets inside Barba content containers', () => {
  const barbaContainer = createNode('barba-container', ['[data-barba="container"]']);
  const group = createNode('group', ['.wp-block-group'], barbaContainer);
  const root = createRoot({
    '.wp-block-group': [group],
  });

  const targets = collectRevealTargets(root);

  assert.deepEqual(targets.map((node) => node.name), ['group']);
});

test('collectRevealTargets does not exclude valid targets when body has the admin-bar class', () => {
  const body = createNode('body', ['body', '.admin-bar']);
  const group = createNode('group', ['.wp-block-group'], body);
  const root = createRoot({
    '.wp-block-group': [group],
  });

  const targets = collectRevealTargets(root);

  assert.deepEqual(targets.map((node) => node.name), ['group']);
});

test('collectRevealTargets skips parallax hero surfaces and their descendants', () => {
  const heroWrapper = createNode('hero-wrapper', ['.nb-supernova--card-layout-stacked.nb-supernova--1-columns.nb-supernova--align-full']);
  const heroSurface = createNode('hero-surface', ['.nb-supernova-item', '.nb-supernova-item--scrolling-effect-parallax'], heroWrapper);
  const heroButton = createNode('hero-button', ['.wp-block-button'], heroSurface);
  const root = createRoot({
    '.nb-supernova-item': [heroSurface],
    '.wp-block-button': [heroButton],
  });

  const targets = collectRevealTargets(root);

  assert.deepEqual(targets, []);
});

// ---------- collectKineticTitleTargets (Kinetic-only extension) ----------

function createKineticTitle(name, closestExcluded = false) {
  return {
    name,
    isConnected: true,
    matches() { return false; },
    closest(selector) {
      // The caller passes the KINETIC_EXCLUDED_ZONES selector list; return
      // a truthy value only when this title is explicitly flagged as inside
      // an excluded zone.
      return closestExcluded ? { marker: selector } : null;
    },
  };
}

function createRootFromTitles(titles) {
  return {
    querySelectorAll() { return titles; },
  };
}

test('collectKineticTitleTargets returns empty for invalid root', () => {
  assert.deepEqual(collectKineticTitleTargets(null), []);
  assert.deepEqual(collectKineticTitleTargets({}), []);
});

test('collectKineticTitleTargets finds all candidate headings in the document', () => {
  const cardTitle = createKineticTitle('card-title');
  const collectionTitle = createKineticTitle('collection-title');
  const footerTitle = createKineticTitle('footer-title');
  const root = createRootFromTitles([cardTitle, collectionTitle, footerTitle]);

  const targets = collectKineticTitleTargets(root);

  assert.deepEqual(targets.map((t) => t.name), ['card-title', 'collection-title', 'footer-title']);
});

test('collectKineticTitleTargets skips titles already in the primary target set', () => {
  const primaryHeading = createKineticTitle('primary-h2');
  const otherTitle = createKineticTitle('collection-title');
  const root = createRootFromTitles([primaryHeading, otherTitle]);

  const targets = collectKineticTitleTargets(root, [primaryHeading]);

  assert.deepEqual(targets.map((t) => t.name), ['collection-title'],
    'primary target should not be re-collected as a Kinetic title');
});

test('collectKineticTitleTargets skips titles inside excluded zones (admin bar, header, etc.)', () => {
  const excluded = createKineticTitle('header-title', /* closestExcluded */ true);
  const allowed = createKineticTitle('content-title', /* closestExcluded */ false);
  const root = createRootFromTitles([excluded, allowed]);

  const targets = collectKineticTitleTargets(root);

  assert.deepEqual(targets.map((t) => t.name), ['content-title']);
});

test('collectKineticTitleTargets allows titles inside aria-hidden .slick-slide (carousel inactive state)', () => {
  // Slick toggles aria-hidden="true" on inactive slides. Classify those
  // titles so they can replay when the slide becomes active.
  const slickSlideAncestor = {
    classList: {
      contains(name) { return name === 'slick-slide'; },
    },
  };
  const slickTitle = {
    name: 'slick-inactive-title',
    isConnected: true,
    matches() { return false; },
    closest() { return slickSlideAncestor; }, // any exclusion query returns the slick-slide
  };
  const root = createRootFromTitles([slickTitle]);

  const targets = collectKineticTitleTargets(root);

  assert.deepEqual(targets.map((t) => t.name), ['slick-inactive-title'],
    'title inside an inactive slick-slide (aria-hidden) should still be collected');
});

test('collectKineticTitleTargets excludes aria-hidden zones that are NOT slick-slides (modals, menus)', () => {
  const modalAncestor = {
    classList: {
      contains() { return false; }, // not a slick-slide
    },
  };
  const modalTitle = {
    name: 'modal-title',
    isConnected: true,
    matches() { return false; },
    closest() { return modalAncestor; },
  };
  const root = createRootFromTitles([modalTitle]);

  const targets = collectKineticTitleTargets(root);

  assert.deepEqual(targets, [],
    'aria-hidden inside a non-slick ancestor (e.g., a modal) should still be excluded');
});

test('collectKineticTitleTargets filters disconnected nodes', () => {
  const stale = createKineticTitle('stale');
  stale.isConnected = false;
  const alive = createKineticTitle('alive');
  const root = createRootFromTitles([stale, alive]);

  const targets = collectKineticTitleTargets(root);

  assert.deepEqual(targets.map((t) => t.name), ['alive']);
});

test('collectKineticTitleTargets deduplicates the same candidate appearing twice', () => {
  const shared = createKineticTitle('shared');
  const root = createRootFromTitles([shared, shared]);

  const targets = collectKineticTitleTargets(root);

  assert.equal(targets.length, 1);
  assert.equal(targets[0].name, 'shared');
});
