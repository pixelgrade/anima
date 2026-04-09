const PREVIEW_ROOT_ID = 'anima-motion-preview-root';
const PREVIEW_SETTLE_DELAY = 1200;

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function renderTransitionSymbolMarkup(symbol, fallbackSymbol) {
  const normalizedSymbol = typeof symbol === 'string' ? symbol.trim() : '';

  if (normalizedSymbol.includes('<') && normalizedSymbol.includes('>')) {
    return normalizedSymbol;
  }

  return `<svg><text id="letter" x="50%" y="50%" text-anchor="middle" alignment-baseline="central" font-size="180" font-weight="bold">${escapeHtml(normalizedSymbol || fallbackSymbol || '')}</text></svg>`;
}

function getLoadingContentMarkup(state, config) {
  if (state.logoLoadingStyle === 'cycling_images') {
    return `<div class="c-loader__logo">${renderTransitionSymbolMarkup(state.transitionSymbol, config.fallbackSymbol)}</div>`;
  }

  return config.progressBarMarkup || '';
}

function getOverlayMarkup(state, config) {
  const loadingMarkup = getLoadingContentMarkup(state, config);

  if (state.pageTransitionStyle === 'slide_wipe') {
    return `<div class="c-loader c-loader--preview"><div class="c-loader__mask">${loadingMarkup}</div></div>`;
  }

  return `<div class="c-page-transition-border c-page-transition-border--preview" style="border-color: var(--sm-current-accent-color); background: var(--sm-current-accent-color);">${loadingMarkup}</div>`;
}

function clearMotionPreviewTimer(previewWindow) {
  if (!previewWindow || !previewWindow.__animaMotionPreviewSettleTimer) {
    return;
  }

  previewWindow.clearTimeout(previewWindow.__animaMotionPreviewSettleTimer);
  previewWindow.__animaMotionPreviewSettleTimer = null;
}

function removeMotionPreview(previewDocument) {
  if (!previewDocument) {
    return;
  }

  clearMotionPreviewTimer(previewDocument.defaultView);

  const existingRoot = previewDocument.getElementById(PREVIEW_ROOT_ID);
  if (existingRoot) {
    existingRoot.remove();
  }
}

function settleMotionPreview(previewDocument) {
  if (!previewDocument) {
    return;
  }

  const existingRoot = previewDocument.getElementById(PREVIEW_ROOT_ID);

  if (!existingRoot) {
    return;
  }

  existingRoot.classList.add('anima-motion-preview-root--settled');
}

function renderMotionPreview(previewDocument, state, config = {}) {
  removeMotionPreview(previewDocument);

  if (!previewDocument || !state || !state.isVisible) {
    return;
  }

  const previewWindow = previewDocument.defaultView;
  if (!previewWindow || !previewDocument.body) {
    return;
  }

  const previewRoot = previewDocument.createElement('div');
  previewRoot.id = PREVIEW_ROOT_ID;
  previewRoot.className = 'anima-motion-preview-root';
  previewRoot.setAttribute('aria-hidden', 'true');
  previewRoot.innerHTML = getOverlayMarkup(state, config);

  previewDocument.body.appendChild(previewRoot);

  previewWindow.__animaMotionPreviewSettleTimer = previewWindow.setTimeout(
    () => settleMotionPreview(previewDocument),
    config.previewSettleDelay || PREVIEW_SETTLE_DELAY
  );
}

module.exports = {
  renderMotionPreview,
};
