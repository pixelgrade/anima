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

// Kinetic-only extension: find heading-role nodes nested INSIDE already-tracked
// reveal-root targets. Used by the runtime when the active animation style is
// 'kinetic' so card titles get the word-curtain treatment while the card
// containers themselves still slide in as a whole. For fade/slide/scale this
// helper is never called — those styles keep the original outer-only behavior.
const NESTED_TITLE_SELECTORS = [
  'h1',
  'h2',
  'h3',
  '.wp-block-heading',
  '.wp-block-post-title',
].join(',');

function collectNestedTitlesWithinTargets(existingTargets) {
  if (!Array.isArray(existingTargets) || existingTargets.length === 0) {
    return [];
  }

  const existingSet = new Set(existingTargets);
  const results = [];
  const seen = new Set();

  existingTargets.forEach((container) => {
    if (!container || typeof container.querySelectorAll !== 'function') {
      return;
    }

    const candidates = Array.from(container.querySelectorAll(NESTED_TITLE_SELECTORS));

    candidates.forEach((node) => {
      if (!node || node.isConnected === false) {
        return;
      }

      // Skip the container itself if it happens to match (e.g., a heading
      // that was also a top-level target), and skip any node we've already
      // collected.
      if (existingSet.has(node) || seen.has(node)) {
        return;
      }

      if (isExcludedTarget(node)) {
        return;
      }

      seen.add(node);
      results.push(node);
    });
  });

  return results;
}

module.exports = {
  REVEAL_ROOT_SELECTORS,
  FALLBACK_TARGET_SELECTORS,
  EXCLUDED_TARGET_SELECTORS,
  NESTED_TITLE_SELECTORS,
  isExcludedTarget,
  hasTrackedRevealAncestor,
  collectRevealTargets,
  collectNestedTitlesWithinTargets,
};
