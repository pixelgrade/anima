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

// Kinetic-only extension: find heading-role nodes anywhere on the page so they
// can receive the word-curtain treatment, regardless of whether they live
// inside a tracked reveal-root container. Used by the runtime when the active
// animation style is 'kinetic'. For fade/slide/scale this helper is never
// called — those styles keep the original outer-only reveal semantics.
//
// Deliberately broader than `collectRevealTargets`:
//   - Selector list includes Nova Blocks' custom title classes
//     (.nb-collection__title, .nb-card__title) which aren't picked up by
//     Anima's standard fallback list.
//   - Excluded-zone list is SMALLER than the default one: we WANT footer
//     headings to animate under Kinetic (they're typographic moments too).
//     Only admin bar, site <header> chrome, hidden/inert nodes, and the
//     page-transition loader UI are excluded.
const KINETIC_TITLE_SELECTORS = [
  'h1',
  'h2',
  'h3',
  '.wp-block-heading',
  '.wp-block-post-title',
  '.nb-collection__title',
  '.nb-card__title',
].join(',');

const KINETIC_EXCLUDED_ZONES = [
  '#wpadminbar',
  '[aria-hidden="true"]',
  '[inert]',
  '.js-page-transition-border',
  '.js-slide-wipe-loader',
  'header',
  // Intentionally NOT excluding .nb-supernova-item--scrolling-effect-parallax:
  // the parallax container keeps its own scroll motion, but the title inside
  // it (e.g., a single-project hero h1.wp-block-post-title) still benefits
  // from the Kinetic word-curtain. The container itself isn't a primary
  // intro target anyway (the base EXCLUDED_TARGET_SELECTORS list keeps the
  // container static), so there's no conflicting outer animation.
].join(',');

function isInsideKineticExclusionZone(node) {
  if (!node || typeof node.closest !== 'function') {
    return false;
  }

  const hit = node.closest(KINETIC_EXCLUDED_ZONES);

  if (!hit) {
    return false;
  }

  // Slick carousels toggle aria-hidden="true" on inactive slides as part of
  // their rotation — but the slide content IS visible when the slide is
  // active. If the nearest exclusion-zone ancestor is a .slick-slide, let
  // the title through; the carousel replay observer will re-run its reveal
  // each time the slide becomes active.
  if (hit.classList && hit.classList.contains('slick-slide')) {
    return false;
  }

  return true;
}

function collectKineticTitleTargets(root, primaryTargets = []) {
  if (!root || typeof root.querySelectorAll !== 'function') {
    return [];
  }

  const primarySet = new Set(primaryTargets);
  const results = [];
  const seen = new Set();

  const candidates = Array.from(root.querySelectorAll(KINETIC_TITLE_SELECTORS));

  candidates.forEach((node) => {
    if (!node || node.isConnected === false) {
      return;
    }

    // Already handled by the primary-target pipeline (or collected here earlier
    // in the loop) — skip to avoid double-staging.
    if (primarySet.has(node) || seen.has(node)) {
      return;
    }

    // Kinetic-specific exclusion zones. Intentionally more lenient than
    // EXCLUDED_TARGET_SELECTORS — footer is NOT listed, because users want
    // Kinetic to animate footer headings too. The aria-hidden check is
    // further narrowed in isInsideKineticExclusionZone so slick-slide
    // rotation doesn't hide every inactive slide's title permanently.
    if (isInsideKineticExclusionZone(node)) {
      return;
    }

    seen.add(node);
    results.push(node);
  });

  return results;
}

module.exports = {
  REVEAL_ROOT_SELECTORS,
  FALLBACK_TARGET_SELECTORS,
  EXCLUDED_TARGET_SELECTORS,
  KINETIC_TITLE_SELECTORS,
  KINETIC_EXCLUDED_ZONES,
  isExcludedTarget,
  hasTrackedRevealAncestor,
  collectRevealTargets,
  collectKineticTitleTargets,
};
