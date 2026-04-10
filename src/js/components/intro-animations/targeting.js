const {
  NEW_HERO_SELECTOR,
  OLD_HERO_SELECTOR,
} = require('../hero-init-filter.js');

const REVEAL_ROOT_SELECTORS = [
  '.wp-block-cover',
  '.wp-block-group',
  '.wp-block-columns',
  '.wp-block-media-text',
  '.wp-block-gallery',
  '.wp-block-image',
  '.wp-block-quote',
  '.wp-block-pullquote',
  '.wp-block-buttons',
  '.wp-block-button',
  '.wp-block-query .wp-block-post',
  '.nb-supernova-item',
];

const FALLBACK_TARGET_SELECTORS = [
  '.wp-block-heading',
  '.wp-block-paragraph',
  '.wp-block-list',
  '.wp-block-table',
  '.wp-block-separator',
  '.wp-block-file',
  '.wp-block-embed',
  '.wp-block-post-title',
  '.wp-block-post-featured-image',
  '.wp-block-post-excerpt',
];

const EXCLUDED_TARGET_SELECTORS = [
  'header',
  'footer',
  '.js-page-transition-border',
  '.js-slide-wipe-loader',
  NEW_HERO_SELECTOR,
  OLD_HERO_SELECTOR,
  '.nb-supernova-item--scrolling-effect-parallax',
  '#wpadminbar',
  '[aria-hidden="true"]',
  '[inert]',
];

function isExcludedTarget(node) {
  if (!node || typeof node.matches !== 'function' || typeof node.closest !== 'function') {
    return false;
  }

  return EXCLUDED_TARGET_SELECTORS.some((selector) => node.matches(selector) || node.closest(selector));
}

function hasTrackedRevealAncestor(node, trackedNodes = []) {
  if (!node) {
    return false;
  }

  return trackedNodes.some((trackedNode) => {
    return trackedNode !== node && typeof trackedNode.contains === 'function' && trackedNode.contains(node);
  });
}

function addTargetsForSelectors(root, selectors, trackedNodes) {
  selectors.forEach((selector) => {
    const nodes = Array.from(root.querySelectorAll(selector));

    nodes.forEach((node) => {
      if (!node || node.isConnected === false) {
        return;
      }

      if (trackedNodes.includes(node) || isExcludedTarget(node) || hasTrackedRevealAncestor(node, trackedNodes)) {
        return;
      }

      trackedNodes.push(node);
    });
  });
}

function collectRevealTargets(root) {
  if (!root || typeof root.querySelectorAll !== 'function') {
    return [];
  }

  const trackedNodes = [];

  addTargetsForSelectors(root, REVEAL_ROOT_SELECTORS, trackedNodes);
  addTargetsForSelectors(root, FALLBACK_TARGET_SELECTORS, trackedNodes);

  return trackedNodes;
}

module.exports = {
  REVEAL_ROOT_SELECTORS,
  FALLBACK_TARGET_SELECTORS,
  EXCLUDED_TARGET_SELECTORS,
  isExcludedTarget,
  hasTrackedRevealAncestor,
  collectRevealTargets,
};
