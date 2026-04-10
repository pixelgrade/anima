const test = require('node:test');
const assert = require('node:assert/strict');

const {
  collectRevealTargets,
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
