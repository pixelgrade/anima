/******/ (() => { // webpackBootstrap
(function () {
  var config = window.animaSiteEditorStyleManager;
  if (!config || !window.wp || !wp.domReady) {
    return;
  }
  var STYLE_ID = 'anima-site-editor-style-manager-styles';
  var DISABLED_CLASS = 'anima-site-editor-style-manager-disabled';
  var NOTICE_CLASS = 'anima-site-editor-style-manager-notice';
  var ROUTE_CHANGE_EVENT = 'anima:site-editor-route-change';
  function injectStyles() {
    if (document.getElementById(STYLE_ID)) {
      return;
    }
    var style = document.createElement('style');
    style.id = STYLE_ID;
    // Styled to the WordPress/Gutenberg design system (4px spacing grid, admin
    // theme + gray component color tokens). We can't rely on the components-card
    // / components-button base styles being present on this screen, so the
    // notice and button chrome are defined explicitly.
    style.textContent =
    // Replace mode (Style Manager active): hide the native controls, pad the panel.
    '.edit-site-styles.' + DISABLED_CLASS + ' > :not(.' + NOTICE_CLASS + '){display:none!important;}' + '.edit-site-styles.' + DISABLED_CLASS + '{padding:16px;}' +
    // Append mode (bare): give the note its own padding + a separator from the controls.
    '.edit-site-styles:not(.' + DISABLED_CLASS + ') > .' + NOTICE_CLASS + '{padding:16px;margin:0 0 8px;border-bottom:1px solid var(--wp-components-color-gray-200,#e0e0e0);}' + '.' + NOTICE_CLASS + '{display:grid;gap:16px;box-sizing:border-box;}' + '.' + NOTICE_CLASS + '__intro,.' + NOTICE_CLASS + '__resource{padding:16px;background:var(--wp-components-color-gray-100,#f0f0f0);border-radius:4px;box-shadow:none;border:0;}' + '.' + NOTICE_CLASS + '__intro .components-card__body,.' + NOTICE_CLASS + '__resource .components-card__body{padding:0;display:grid;gap:8px;align-content:start;}' + '.' + NOTICE_CLASS + '__eyebrow,.' + NOTICE_CLASS + '__resources-eyebrow{margin:0;font-size:11px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;color:var(--wp-components-color-foreground-secondary,#757575);}' + '.' + NOTICE_CLASS + '__title,.' + NOTICE_CLASS + '__resource-title{margin:0;font-size:14px;font-weight:600;line-height:1.4;}' + '.' + NOTICE_CLASS + '__description,.' + NOTICE_CLASS + '__resource-description{margin:0;font-size:13px;line-height:1.5;color:var(--wp-components-color-foreground-secondary,#757575);}' + '.' + NOTICE_CLASS + '__actions{display:grid;gap:8px;margin-top:4px;}' + '.' + NOTICE_CLASS + '__resources-section{display:grid;gap:12px;}' + '.' + NOTICE_CLASS + '__resources{display:grid;gap:12px;grid-template-columns:repeat(auto-fit,minmax(min(200px,100%),1fr));}' +
    // Buttons: explicit Gutenberg primary/secondary chrome (height 36, radius 2).
    '.' + NOTICE_CLASS + ' .components-button{display:inline-flex;align-items:center;justify-content:center;width:100%;box-sizing:border-box;min-height:36px;padding:6px 12px;border-radius:2px;font-size:13px;font-weight:500;text-decoration:none;}' + '.' + NOTICE_CLASS + ' .components-button.is-primary{background:var(--wp-admin-theme-color,#3858e9);color:#fff;}' + '.' + NOTICE_CLASS + ' .components-button.is-primary:hover{background:var(--wp-admin-theme-color-darker-10,#2145e6);color:#fff;}' + '.' + NOTICE_CLASS + ' .components-button.is-secondary{border:1px solid var(--wp-admin-theme-color,#3858e9);color:var(--wp-admin-theme-color,#3858e9);}' + '@media (max-width: 781px){.edit-site-styles.' + DISABLED_CLASS + '{padding:12px;}}';
    document.head.appendChild(style);
  }
  function getCurrentRoute() {
    try {
      return new URL(window.location.href).searchParams.get('p') || '';
    } catch (error) {
      return '';
    }
  }
  function isStylesRoute() {
    return getCurrentRoute() === '/styles';
  }
  function buildLink(url, label, className) {
    var link = document.createElement('a');
    link.className = className;
    link.href = url;
    link.textContent = label;
    return link;
  }
  function buildResourceCard(resource) {
    if (!resource || !resource.title || !resource.url || !resource.buttonLabel) {
      return null;
    }
    var card = document.createElement('div');
    card.className = 'components-card is-medium ' + NOTICE_CLASS + '__resource';
    var body = document.createElement('div');
    body.className = 'components-card__body';
    var title = document.createElement('h3');
    title.className = NOTICE_CLASS + '__resource-title';
    title.textContent = resource.title;
    body.appendChild(title);
    if (resource.description) {
      var description = document.createElement('p');
      description.className = NOTICE_CLASS + '__resource-description';
      description.textContent = resource.description;
      body.appendChild(description);
    }
    body.appendChild(buildLink(resource.url, resource.buttonLabel, 'components-button is-secondary'));
    card.appendChild(body);
    return card;
  }
  function buildNotice() {
    var notice = document.createElement('section');
    notice.className = NOTICE_CLASS;
    var intro = document.createElement('div');
    intro.className = 'components-card is-medium ' + NOTICE_CLASS + '__intro';
    var introBody = document.createElement('div');
    introBody.className = 'components-card__body';
    var eyebrow = document.createElement('p');
    eyebrow.className = NOTICE_CLASS + '__eyebrow';
    eyebrow.textContent = config.eyebrow;
    var title = document.createElement('h2');
    title.className = NOTICE_CLASS + '__title';
    title.textContent = config.title;
    var description = document.createElement('p');
    description.className = NOTICE_CLASS + '__description';
    description.textContent = config.description;
    var actions = document.createElement('div');
    actions.className = NOTICE_CLASS + '__actions';
    actions.appendChild(buildLink(config.customizerUrl, config.buttonLabel, 'components-button is-primary'));
    introBody.appendChild(eyebrow);
    introBody.appendChild(title);
    introBody.appendChild(description);
    introBody.appendChild(actions);
    intro.appendChild(introBody);
    notice.appendChild(intro);
    if (Array.isArray(config.resources) && config.resources.length) {
      var resourcesSection = document.createElement('section');
      resourcesSection.className = NOTICE_CLASS + '__resources-section';
      if (config.resourcesEyebrow) {
        var resourcesEyebrow = document.createElement('p');
        resourcesEyebrow.className = NOTICE_CLASS + '__resources-eyebrow';
        resourcesEyebrow.textContent = config.resourcesEyebrow;
        resourcesSection.appendChild(resourcesEyebrow);
      }
      var resources = document.createElement('div');
      resources.className = NOTICE_CLASS + '__resources';
      config.resources.forEach(function (resource) {
        var card = buildResourceCard(resource);
        if (card) {
          resources.appendChild(card);
        }
      });
      if (resources.childElementCount) {
        resourcesSection.appendChild(resources);
        notice.appendChild(resourcesSection);
      }
    }
    return notice;
  }
  function ensureNotice() {
    var container = document.querySelector('.edit-site-styles');
    if (!container) {
      return;
    }

    // When keepNativeStyles is set (the bare WordPress.org build), append the
    // note above the native Styles controls instead of replacing them, so the
    // style variations stay reachable.
    if (!config.keepNativeStyles) {
      container.classList.add(DISABLED_CLASS);
    }
    if (!container.querySelector('.' + NOTICE_CLASS)) {
      container.prepend(buildNotice());
    }
  }
  function clearNotice() {
    document.querySelectorAll('.edit-site-styles').forEach(function (container) {
      container.classList.remove(DISABLED_CLASS);
      var notice = container.querySelector('.' + NOTICE_CLASS);
      if (notice) {
        notice.remove();
      }
    });
  }
  function sync() {
    if (isStylesRoute()) {
      ensureNotice();
      return;
    }
    clearNotice();
  }
  function patchHistoryMethod(methodName) {
    var original = window.history[methodName];
    if (typeof original !== 'function' || original.__animaPatched) {
      return;
    }
    var wrapped = function () {
      var result = original.apply(this, arguments);
      window.dispatchEvent(new Event(ROUTE_CHANGE_EVENT));
      return result;
    };
    wrapped.__animaPatched = true;
    window.history[methodName] = wrapped;
  }
  wp.domReady(function () {
    injectStyles();
    patchHistoryMethod('pushState');
    patchHistoryMethod('replaceState');
    window.addEventListener('popstate', sync);
    window.addEventListener(ROUTE_CHANGE_EVENT, sync);
    new MutationObserver(sync).observe(document.body, {
      childList: true,
      subtree: true
    });
    sync();
  });
})();
/******/ })()
;