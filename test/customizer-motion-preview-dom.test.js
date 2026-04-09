const test = require('node:test');
const assert = require('node:assert/strict');

const {
  renderMotionPreview,
} = require('../src/js/admin/customizer-motion-preview-dom.js');

function createFakeClassList(element) {
  return {
    add(className) {
      const classNames = new Set((element.className || '').split(/\s+/).filter(Boolean));
      classNames.add(className);
      element.className = Array.from(classNames).join(' ');
    },
    contains(className) {
      return (element.className || '').split(/\s+/).filter(Boolean).includes(className);
    },
  };
}

function createFakeElement(tagName, document) {
  return {
    tagName,
    ownerDocument: document,
    className: '',
    innerHTML: '',
    parentNode: null,
    children: [],
    attributes: {},
    classList: null,
    setAttribute(name, value) {
      this.attributes[name] = value;
      if (name === 'id') {
        this.id = value;
        document.elements.set(value, this);
      }
    },
    appendChild(child) {
      child.parentNode = this;
      this.children.push(child);

      if (child.id) {
        document.elements.set(child.id, child);
      }
    },
    remove() {
      if (this.id) {
        document.elements.delete(this.id);
      }

      if (this.parentNode) {
        this.parentNode.children = this.parentNode.children.filter((child) => child !== this);
      }
    },
  };
}

function createFakeDocument() {
  const timeouts = [];
  const clearedTimeouts = [];

  const document = {
    elements: new Map(),
    body: null,
    createElement(tagName) {
      const element = createFakeElement(tagName, document);
      element.classList = createFakeClassList(element);

      return element;
    },
    getElementById(id) {
      return document.elements.get(id) || null;
    },
    defaultView: {
      __animaMotionPreviewHideTimer: null,
      setTimeout(callback, delay) {
        const timer = { callback, delay };
        timeouts.push(timer);

        return timer;
      },
      clearTimeout(timer) {
        clearedTimeouts.push(timer);
      },
    },
    __timeouts: timeouts,
    __clearedTimeouts: clearedTimeouts,
  };

  document.body = document.createElement('body');

  return document;
}

test('motion preview settles into a held frame instead of removing itself after the first replay', () => {
  const previewDocument = createFakeDocument();

  renderMotionPreview(
    previewDocument,
    {
      isVisible: true,
      pageTransitionStyle: 'border_iris',
      logoLoadingStyle: 'progress_bar',
      transitionSymbol: '',
    },
    {
      progressBarMarkup: '<div class="border-logo"><div class="logo">Logo</div></div>',
      previewSettleDelay: 1200,
    }
  );

  const previewRoot = previewDocument.getElementById('anima-motion-preview-root');

  assert.ok(previewRoot);
  assert.equal(previewDocument.__timeouts.length, 1);
  assert.equal(previewDocument.__timeouts[0].delay, 1200);

  previewDocument.__timeouts[0].callback();

  assert.equal(previewDocument.getElementById('anima-motion-preview-root'), previewRoot);
  assert.equal(previewRoot.classList.contains('anima-motion-preview-root--settled'), true);
});
