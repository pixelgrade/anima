const test = require('node:test');
const assert = require('node:assert/strict');

const {
  syncSiteFrameMobileMenu,
  SITE_FRAME_CLONE_ATTR,
} = require('../src/js/components/site-frame/runtime.js');

function createClassList(initialClasses = []) {
  const classSet = new Set(initialClasses);

  return {
    add(...classes) {
      classes.forEach((className) => classSet.add(className));
    },
    contains(className) {
      return classSet.has(className);
    },
    toArray() {
      return Array.from(classSet);
    },
  };
}

function createListItem(label) {
  return {
    label,
    dataset: {},
    classList: createClassList(['menu-item']),
    children: [],
    parentNode: null,
    cloneNode() {
      const clone = createListItem(this.label);
      clone.classList = createClassList(this.classList.toArray());

      return clone;
    },
    remove() {
      if (!this.parentNode) {
        return;
      }

      const index = this.parentNode.children.indexOf(this);
      if (index >= 0) {
        this.parentNode.children.splice(index, 1);
      }

      this.parentNode = null;
    },
  };
}

function createMenuList(labels) {
  const list = {
    children: [],
    appendChild(node) {
      node.parentNode = this;
      this.children.push(node);
    },
  };

  labels.forEach((label) => {
    list.appendChild(createListItem(label));
  });

  return list;
}

test('syncSiteFrameMobileMenu appends Site Frame items once at the bottom of the mobile menu', () => {
  const sourceList = createMenuList(['Read', 'Instagram', 'Search']);
  const targetList = createMenuList(['Home', 'Work']);

  const appendedCount = syncSiteFrameMobileMenu({
    enabled: true,
    belowLap: true,
    sourceList,
    targetList,
  });

  assert.equal(appendedCount, 3);
  assert.deepEqual(
    targetList.children.map((item) => item.label),
    ['Home', 'Work', 'Read', 'Instagram', 'Search']
  );

  const cloneFlags = targetList.children.slice(-3).map((item) => item.dataset[SITE_FRAME_CLONE_ATTR]);
  assert.deepEqual(cloneFlags, ['true', 'true', 'true']);

  syncSiteFrameMobileMenu({
    enabled: true,
    belowLap: true,
    sourceList,
    targetList,
  });

  assert.deepEqual(
    targetList.children.map((item) => item.label),
    ['Home', 'Work', 'Read', 'Instagram', 'Search']
  );
});

test('syncSiteFrameMobileMenu removes prior Site Frame clones when leaving the mobile layout', () => {
  const sourceList = createMenuList(['Read']);
  const targetList = createMenuList(['Home']);

  syncSiteFrameMobileMenu({
    enabled: true,
    belowLap: true,
    sourceList,
    targetList,
  });

  assert.equal(targetList.children.length, 2);

  const removedCount = syncSiteFrameMobileMenu({
    enabled: true,
    belowLap: false,
    sourceList,
    targetList,
  });

  assert.equal(removedCount, 0);
  assert.deepEqual(
    targetList.children.map((item) => item.label),
    ['Home']
  );
});
