const SITE_FRAME_CLONE_ATTR = 'siteFrameClone';

function getChildElements(node) {
  if (!node || !node.children) {
    return [];
  }

  return Array.from(node.children);
}

function removeSiteFrameMobileMenuClones(targetList) {
  if (!targetList) {
    return 0;
  }

  let removedCount = 0;

  getChildElements(targetList).forEach((item) => {
    if (item?.dataset?.[SITE_FRAME_CLONE_ATTR] !== 'true') {
      return;
    }

    if (typeof item.remove === 'function') {
      item.remove();
      removedCount += 1;
    }
  });

  return removedCount;
}

function appendSiteFrameMobileMenuItems(sourceList, targetList) {
  if (!sourceList || !targetList) {
    return 0;
  }

  removeSiteFrameMobileMenuClones(targetList);

  let appendedCount = 0;

  getChildElements(sourceList).forEach((item) => {
    if (!item || typeof item.cloneNode !== 'function') {
      return;
    }

    const clone = item.cloneNode(true);

    if (!clone.dataset) {
      clone.dataset = {};
    }

    clone.dataset[SITE_FRAME_CLONE_ATTR] = 'true';

    if (clone.classList && typeof clone.classList.add === 'function') {
      clone.classList.add('menu-item--site-frame-clone');
    }

    if (typeof targetList.appendChild === 'function') {
      targetList.appendChild(clone);
      appendedCount += 1;
    }
  });

  return appendedCount;
}

function syncSiteFrameMobileMenu({
  enabled = false,
  belowLap = false,
  sourceList = null,
  targetList = null,
} = {}) {
  if (!enabled || !belowLap || !sourceList || !targetList) {
    removeSiteFrameMobileMenuClones(targetList);
    return 0;
  }

  return appendSiteFrameMobileMenuItems(sourceList, targetList);
}

function createSiteFrameRuntime({
  window: win = typeof window !== 'undefined' ? window : null,
  document: doc = typeof document !== 'undefined' ? document : null,
  sourceSelector = '.c-site-frame__menu',
  targetSelector = '.nb-header .nb-navigation--primary .menu',
  isBelowLap = () => !!win && typeof win.matchMedia === 'function' && win.matchMedia('not screen and (min-width: 1024px)').matches,
} = {}) {
  function hasEnabledBodyClass() {
    return !!doc && !!doc.body && !!doc.body.classList && doc.body.classList.contains('has-site-frame-menu');
  }

  function getSourceList() {
    return doc && typeof doc.querySelector === 'function' ? doc.querySelector(sourceSelector) : null;
  }

  function getTargetList() {
    return doc && typeof doc.querySelector === 'function' ? doc.querySelector(targetSelector) : null;
  }

  function sync() {
    return syncSiteFrameMobileMenu({
      enabled: hasEnabledBodyClass(),
      belowLap: isBelowLap(),
      sourceList: getSourceList(),
      targetList: getTargetList(),
    });
  }

  return {
    sync,
    removeClones() {
      return removeSiteFrameMobileMenuClones(getTargetList());
    },
  };
}

module.exports = {
  SITE_FRAME_CLONE_ATTR,
  appendSiteFrameMobileMenuItems,
  createSiteFrameRuntime,
  removeSiteFrameMobileMenuClones,
  syncSiteFrameMobileMenu,
};
