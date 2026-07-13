const {
  createCollectionHeaderIntegrationRuntime,
} = require('../components/collection-header-integration/runtime.js');

const runtimes = new WeakMap();
const observedFrames = new WeakSet();

function initializeDocument(doc) {
  if (!doc || !doc.defaultView || runtimes.has(doc)) {
    return;
  }

  const runtime = createCollectionHeaderIntegrationRuntime({
    window: doc.defaultView,
    document: doc,
  });
  runtime.bind();
  runtimes.set(doc, runtime);
}

function initializeIframe(iframe) {
  if (!iframe || observedFrames.has(iframe)) {
    return;
  }

  observedFrames.add(iframe);

  const initializeContentDocument = () => {
    try {
      initializeDocument(iframe.contentDocument);
    } catch (error) {
      // The editor canvas is same-origin. Ignore unrelated cross-origin frames.
    }
  };

  iframe.addEventListener('load', initializeContentDocument);
  initializeContentDocument();
}

function initializeEditorDocuments() {
  initializeDocument(document);
  document.querySelectorAll('iframe').forEach(initializeIframe);

  if (typeof MutationObserver !== 'function' || !document.body) {
    return;
  }

  const observer = new MutationObserver(() => {
    document.querySelectorAll('iframe').forEach(initializeIframe);
  });
  observer.observe(document.body, {childList: true, subtree: true});
}

wp.domReady(initializeEditorDocuments);

module.exports = {
  initializeDocument,
  initializeIframe,
};
