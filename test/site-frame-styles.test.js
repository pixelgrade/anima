const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const sass = require('sass');

function compileSiteFrameCss() {
  const entryFile = path.join(__dirname, '..', 'src', 'scss', 'style.scss');
  const { css } = sass.compile(entryFile, {
    loadPaths: [path.join(__dirname, '..', 'src', 'scss')],
  });

  return css.replace(/\s+/g, ' ');
}

test('Site Frame styles expose the desktop frame shell selectors', () => {
  const css = compileSiteFrameCss();

  assert.match(css, /body\.has-site-frame\s*\{/);
  assert.match(css, /body\.has-site-frame-menu #page\s*\{[^}]*padding-right:/);
  assert.match(css, /\.c-site-frame__rail\s*\{/);
  assert.match(css, /\.c-site-frame__top\s*\{/);
  assert.match(css, /\.c-site-frame__left\s*\{/);
});

test('Site Frame styles expose the Hive-like rail strip treatment', () => {
  const css = compileSiteFrameCss();

  assert.match(css, /body\.has-site-frame\s*\{[^}]*--site-frame-admin-bar-offset:\s*var\(--theme-sticky-distance,\s*0px\);[^}]*--site-frame-rail-gap:\s*12px;[^}]*--site-frame-rail-top-offset:\s*calc\(var\(--site-frame-admin-bar-offset,\s*0px\) \+ var\(--site-frame-rail-gap\)\);[^}]*--site-frame-sticky-top:\s*calc\(var\(--theme-sticky-distance,\s*0px\) \+ var\(--site-frame-top-size\)\);[^}]*--site-frame-rail-width:\s*60px;[^}]*--site-frame-link-font-size:\s*13px;/);
  assert.match(css, /body\.single-post\.has-site-frame\s*\{[^}]*--site-frame-rail-top-offset:\s*calc\(var\(--site-frame-admin-bar-offset,\s*0px\) \+ var\(--site-frame-top-size\) \+ var\(--theme-sticky-header-height,\s*0px\) \+ var\(--site-frame-rail-gap\)\);/);
  assert.match(css, /\.c-site-frame__rail\s*\{[^}]*padding-left:\s*12px;[^}]*padding-right:\s*12px;[^}]*width:\s*var\(--site-frame-rail-width\);[^}]*top:\s*var\(--site-frame-rail-top-offset\);[^}]*right:\s*0;[^}]*bottom:\s*0;/);
  assert.doesNotMatch(css, /\.admin-bar \.c-site-frame__rail\s*\{[^}]*margin-top:/);
  assert.match(css, /\.c-site-frame__rail(?::before|::before)\s*\{[^}]*width:\s*1px;/);
  assert.match(css, /\.c-site-frame__head\s*\{[^}]*padding-top:\s*var\(--site-frame-head-padding-y\);[^}]*padding-bottom:\s*var\(--site-frame-head-padding-y\);[^}]*min-height:\s*var\(--site-frame-head-min-height\);/);
  assert.match(css, /\.c-site-frame\s*\{[^}]*z-index:\s*4000;/);
  assert.match(css, /\.nav--toolbar a\s*\{[^}]*font-size:\s*var\(--site-frame-link-font-size\);[^}]*line-height:\s*var\(--site-frame-link-line-height\);[^}]*margin-right:\s*var\(--site-frame-link-margin-right\);[^}]*padding-left:\s*var\(--site-frame-link-padding-left\);[^}]*right:\s*100%;[^}]*border:\s*1px solid transparent;[^}]*color:\s*transparent;[^}]*pointer-events:\s*auto;[^}]*text-align:\s*left;/);
  assert.match(css, /\.c-site-frame \.nav--toolbar > li > a\s*\{[^}]*padding-left:\s*var\(--site-frame-link-padding-left\);/);
  assert.match(css, /\.c-site-frame :is\(:is\(\.menu-item--search,\s*\.menu-item--dark-mode\):not\(\.no-icon\),\s*#specific\) a\s*\{[^}]*padding-left:\s*var\(--site-frame-link-padding-left\);/);
  assert.doesNotMatch(css, /\.nav--toolbar a\s*\{[^}]*min-width:/);
  assert.match(css, /\.nav--toolbar a(?::hover|:focus-visible)\s*\{[^}]*color:\s*inherit;[^}]*pointer-events:\s*auto;[^}]*border-color:\s*var\(--site-frame-divider-color\);/);
});

test('Site Frame styles let hover labels use the navigation typography role', () => {
  const css = compileSiteFrameCss();

  assert.match(
    css,
    /\.c-site-frame__label\s*\{[^}]*--current-font-family:\s*var\(--theme-navigation-font-family\);[^}]*--current-font-weight:\s*var\(--theme-navigation-font-weight\);[^}]*--current-font-style:\s*var\(--theme-navigation-font-style\);[^}]*--current-letter-spacing:\s*var\(--theme-navigation-letter-spacing\);[^}]*--current-text-transform:\s*var\(--theme-navigation-text-transform\);[^}]*font-size:\s*inherit;[^}]*line-height:\s*inherit;/
  );
});

test('Site Frame styles keep sticky headers below the top frame accent', () => {
  const css = compileSiteFrameCss();

  assert.match(
    css,
    /body\.has-site-frame-frame \.nb-header--secondary,\s*body\.has-site-frame-frame \.nb-header--main\.nb-header--sticky\s*\{[^}]*top:\s*var\(--site-frame-sticky-top\)\s*!important;/
  );
});

test('Site Frame styles expose the regular-link monogram treatment', () => {
  const css = compileSiteFrameCss();

  assert.match(css, /\.menu-item--site-frame-link > a \.menu-item-monogram\s*\{[^}]*width:\s*var\(--site-frame-marker-width\);[^}]*height:\s*var\(--site-frame-marker-height\);[^}]*padding-left:\s*var\(--site-frame-marker-padding-left\);/);
});

test('Site Frame styles keep social links on the icon slot', () => {
  const css = compileSiteFrameCss();

  assert.match(css, /\.nav--toolbar \.social-menu-item\s*\{[^}]*display:\s*list-item;/);
  assert.match(css, /\.nav--toolbar \.social-menu-item > a::before\s*\{[^}]*width:\s*var\(--site-frame-marker-width\);[^}]*height:\s*var\(--site-frame-marker-height\);[^}]*font-size:\s*var\(--site-frame-marker-font-size\);[^}]*right:\s*calc\(var\(--site-frame-marker-width\) \* -1\);[^}]*padding-left:\s*var\(--site-frame-marker-padding-left\);/);
  assert.match(css, /\.nav--toolbar \.social-menu-item > a::after\s*\{[^}]*display:\s*none;/);
  assert.match(css, /\.c-site-frame \.nav--toolbar \.menu-item--search > a::before, \.c-site-frame \.nav--toolbar \.menu-item--dark-mode > a::before\s*\{[^}]*left:\s*auto\s*!important;[^}]*right:\s*calc\(var\(--site-frame-marker-width\) \* -1\)\s*!important;[^}]*box-sizing:\s*border-box;[^}]*padding-left:\s*var\(--site-frame-marker-padding-left\);[^}]*background-position:\s*calc\(50% \+ var\(--site-frame-marker-padding-left\) \* 0\.5\) 50%;[^}]*mask-position:\s*calc\(50% \+ var\(--site-frame-marker-padding-left\) \* 0\.5\) 50%;[^}]*-webkit-mask-position:\s*calc\(50% \+ var\(--site-frame-marker-padding-left\) \* 0\.5\) 50%;/);
  assert.doesNotMatch(css, /--site-frame-dark-mode-active-offset-x/);
  assert.match(css, /\.is-dark \.c-site-frame \.nav--toolbar \.menu-item--dark-mode > a::before\s*\{[^}]*transform:\s*translateY\(-50%\) rotate\(180deg\);/);
});

test('Site Frame styles place cart counts on the site-frame marker slot', () => {
  const css = compileSiteFrameCss();

  assert.match(
    css,
    /body\.has-site-frame\s*\{[^}]*--site-frame-marker-slot-width:\s*calc\(var\(--site-frame-marker-font-size\) \* 2\.52632\);[^}]*--site-frame-marker-slot-height:\s*calc\(var\(--site-frame-marker-font-size\) \* 1\.89474\);[^}]*--site-frame-marker-offset-x:\s*calc\(var\(--site-frame-marker-padding-left\) \* 0\.5\);/
  );

  assert.match(
    css,
    /\.c-site-frame \.nav--toolbar \.menu-item--cart > a \.menu-item__icon\s*\{[^}]*position:\s*absolute;[^}]*top:\s*50%;[^}]*right:\s*calc\(var\(--site-frame-marker-slot-width\) \* -1\);[^}]*display:\s*flex;[^}]*align-items:\s*center;[^}]*justify-content:\s*center;[^}]*box-sizing:\s*border-box;[^}]*width:\s*var\(--site-frame-marker-slot-width\);[^}]*height:\s*var\(--site-frame-marker-slot-height\);[^}]*padding-left:\s*0;[^}]*color:\s*var\(--site-frame-surface\);[^}]*font-feature-settings:\s*"lnum";[^}]*transition:\s*all 0\.25s[^;]*;[^}]*transform:\s*translate\(var\(--site-frame-marker-offset-x\), -50%\) translateZ\(0\);/
  );

  assert.match(
    css,
    /\.c-site-frame \.nav--toolbar \.menu-item--cart > a \.menu-item__icon:after\s*\{[^}]*content:\s*"";[^}]*display:\s*block;[^}]*width:\s*var\(--site-frame-marker-height\);[^}]*height:\s*var\(--site-frame-marker-height\);[^}]*border:\s*0\.125em solid currentColor;[^}]*border-radius:\s*50%;[^}]*position:\s*absolute;[^}]*top:\s*50%;[^}]*left:\s*50%;[^}]*transform:\s*translate\(-50%, -50%\);[^}]*z-index:\s*-1;[^}]*transition:\s*all 0\.25s[^;]*;/
  );

  assert.match(
    css,
    /\.c-site-frame \.nav--toolbar \.menu-item--cart > a:hover \.menu-item__icon,\s*\.c-site-frame \.nav--toolbar \.menu-item--cart > a:focus-visible \.menu-item__icon\s*\{[^}]*color:\s*var\(--sm-current-bg-color\);/
  );

  assert.match(
    css,
    /\.c-site-frame \.nav--toolbar \.menu-item--cart > a:hover \.menu-item__icon:after,\s*\.c-site-frame \.nav--toolbar \.menu-item--cart > a:focus-visible \.menu-item__icon:after\s*\{[^}]*border-width:\s*calc\(var\(--site-frame-marker-height\) \/ 2\);[^}]*border-color:\s*var\(--sm-current-accent-color\);/
  );
});

test('Site Frame styles remove the site-frame shell on mobile', () => {
  const css = compileSiteFrameCss();

  assert.match(
    css,
    /@media not screen and \(min-width: 1024px\)\s*\{[^}]*body\.has-site-frame-menu #page\s*\{[^}]*padding-right:\s*0;[^}]*\}[^}]*body\.has-site-frame-frame #page\s*\{[^}]*padding-top:\s*0;[^}]*padding-left:\s*0;[^}]*\}[^}]*\.c-site-frame\s*\{[^}]*display:\s*none;[^}]*\}/
  );
});
