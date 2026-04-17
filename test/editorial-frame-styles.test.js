const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const sass = require('sass');

function compileEditorialFrameCss() {
  const entryFile = path.join(__dirname, '..', 'src', 'scss', 'style.scss');
  const { css } = sass.compile(entryFile, {
    loadPaths: [path.join(__dirname, '..', 'src', 'scss')],
  });

  return css.replace(/\s+/g, ' ');
}

test('Editorial Frame styles expose the desktop frame shell selectors', () => {
  const css = compileEditorialFrameCss();

  assert.match(css, /body\.has-editorial-frame\s*\{/);
  assert.match(css, /body\.has-editorial-frame-menu #page\s*\{[^}]*padding-right:/);
  assert.match(css, /\.c-editorial-frame__rail\s*\{/);
  assert.match(css, /\.c-editorial-frame__top\s*\{/);
  assert.match(css, /\.c-editorial-frame__left\s*\{/);
});

test('Editorial Frame styles expose the Hive-like rail strip treatment', () => {
  const css = compileEditorialFrameCss();

  assert.match(css, /body\.has-editorial-frame\s*\{[^}]*--editorial-frame-admin-bar-offset:\s*var\(--theme-sticky-distance,\s*0px\);[^}]*--editorial-frame-rail-gap:\s*12px;[^}]*--editorial-frame-rail-top-offset:\s*calc\(var\(--editorial-frame-admin-bar-offset,\s*0px\) \+ var\(--editorial-frame-rail-gap\)\);[^}]*--editorial-frame-sticky-top:\s*calc\(var\(--theme-sticky-distance,\s*0px\) \+ var\(--editorial-frame-top-size\)\);[^}]*--editorial-frame-rail-width:\s*60px;[^}]*--editorial-frame-link-font-size:\s*13px;/);
  assert.match(css, /body\.single-post\.has-editorial-frame\s*\{[^}]*--editorial-frame-rail-top-offset:\s*calc\(var\(--editorial-frame-admin-bar-offset,\s*0px\) \+ var\(--editorial-frame-top-size\) \+ var\(--theme-sticky-header-height,\s*0px\) \+ var\(--editorial-frame-rail-gap\)\);/);
  assert.match(css, /\.c-editorial-frame__rail\s*\{[^}]*padding-left:\s*12px;[^}]*padding-right:\s*12px;[^}]*width:\s*var\(--editorial-frame-rail-width\);[^}]*top:\s*var\(--editorial-frame-rail-top-offset\);[^}]*right:\s*0;[^}]*bottom:\s*0;/);
  assert.doesNotMatch(css, /\.admin-bar \.c-editorial-frame__rail\s*\{[^}]*margin-top:/);
  assert.match(css, /\.c-editorial-frame__rail(?::before|::before)\s*\{[^}]*width:\s*1px;/);
  assert.match(css, /\.c-editorial-frame__head\s*\{[^}]*padding-top:\s*var\(--editorial-frame-head-padding-y\);[^}]*padding-bottom:\s*var\(--editorial-frame-head-padding-y\);[^}]*min-height:\s*var\(--editorial-frame-head-min-height\);/);
  assert.match(css, /\.c-editorial-frame\s*\{[^}]*z-index:\s*4000;/);
  assert.match(css, /\.nav--toolbar a\s*\{[^}]*font-size:\s*var\(--editorial-frame-link-font-size\);[^}]*line-height:\s*var\(--editorial-frame-link-line-height\);[^}]*margin-right:\s*var\(--editorial-frame-link-margin-right\);[^}]*padding-left:\s*var\(--editorial-frame-link-padding-left\);[^}]*right:\s*100%;[^}]*border:\s*1px solid transparent;[^}]*color:\s*transparent;[^}]*pointer-events:\s*auto;[^}]*text-align:\s*left;/);
  assert.match(css, /\.c-editorial-frame \.nav--toolbar > li > a\s*\{[^}]*padding-left:\s*var\(--editorial-frame-link-padding-left\);/);
  assert.match(css, /\.c-editorial-frame :is\(:is\(\.menu-item--search,\s*\.menu-item--dark-mode\):not\(\.no-icon\),\s*#specific\) a\s*\{[^}]*padding-left:\s*var\(--editorial-frame-link-padding-left\);/);
  assert.doesNotMatch(css, /\.nav--toolbar a\s*\{[^}]*min-width:/);
  assert.match(css, /\.nav--toolbar a(?::hover|:focus-visible)\s*\{[^}]*color:\s*inherit;[^}]*pointer-events:\s*auto;[^}]*border-color:\s*var\(--editorial-frame-divider-color\);/);
});

test('Editorial Frame styles let hover labels use the navigation typography role', () => {
  const css = compileEditorialFrameCss();

  assert.match(
    css,
    /\.c-editorial-frame__label\s*\{[^}]*--current-font-family:\s*var\(--theme-navigation-font-family\);[^}]*--current-font-weight:\s*var\(--theme-navigation-font-weight\);[^}]*--current-font-style:\s*var\(--theme-navigation-font-style\);[^}]*--current-letter-spacing:\s*var\(--theme-navigation-letter-spacing\);[^}]*--current-text-transform:\s*var\(--theme-navigation-text-transform\);[^}]*font-size:\s*inherit;[^}]*line-height:\s*inherit;/
  );
});

test('Editorial Frame styles keep sticky headers below the top frame accent', () => {
  const css = compileEditorialFrameCss();

  assert.match(
    css,
    /body\.has-editorial-frame-frame \.nb-header--secondary,\s*body\.has-editorial-frame-frame \.nb-header--main\.nb-header--sticky\s*\{[^}]*top:\s*var\(--editorial-frame-sticky-top\)\s*!important;/
  );
});

test('Editorial Frame styles expose the regular-link monogram treatment', () => {
  const css = compileEditorialFrameCss();

  assert.match(css, /\.menu-item--editorial-frame-link > a \.menu-item-monogram\s*\{[^}]*width:\s*var\(--editorial-frame-marker-width\);[^}]*height:\s*var\(--editorial-frame-marker-height\);[^}]*padding-left:\s*var\(--editorial-frame-marker-padding-left\);/);
});

test('Editorial Frame styles keep social links on the icon slot', () => {
  const css = compileEditorialFrameCss();

  assert.match(css, /\.nav--toolbar \.social-menu-item\s*\{[^}]*display:\s*list-item;/);
  assert.match(css, /\.nav--toolbar \.social-menu-item > a::before\s*\{[^}]*width:\s*var\(--editorial-frame-marker-width\);[^}]*height:\s*var\(--editorial-frame-marker-height\);[^}]*font-size:\s*var\(--editorial-frame-marker-font-size\);[^}]*right:\s*calc\(var\(--editorial-frame-marker-width\) \* -1\);[^}]*padding-left:\s*var\(--editorial-frame-marker-padding-left\);/);
  assert.match(css, /\.nav--toolbar \.social-menu-item > a::after\s*\{[^}]*display:\s*none;/);
  assert.match(css, /\.c-editorial-frame \.nav--toolbar \.menu-item--search > a::before, \.c-editorial-frame \.nav--toolbar \.menu-item--dark-mode > a::before\s*\{[^}]*left:\s*auto\s*!important;[^}]*right:\s*calc\(var\(--editorial-frame-marker-width\) \* -1\)\s*!important;[^}]*box-sizing:\s*border-box;[^}]*padding-left:\s*var\(--editorial-frame-marker-padding-left\);[^}]*background-position:\s*calc\(50% \+ var\(--editorial-frame-marker-padding-left\) \* 0\.5\) 50%;[^}]*mask-position:\s*calc\(50% \+ var\(--editorial-frame-marker-padding-left\) \* 0\.5\) 50%;[^}]*-webkit-mask-position:\s*calc\(50% \+ var\(--editorial-frame-marker-padding-left\) \* 0\.5\) 50%;/);
  assert.match(css, /\.is-dark \.c-editorial-frame \.nav--toolbar \.menu-item--dark-mode > a::before\s*\{[^}]*transform:\s*translate\(var\(--editorial-frame-marker-offset-x\), -50%\) rotate\(180deg\);/);
});

test('Editorial Frame styles place cart counts on the chrome marker slot', () => {
  const css = compileEditorialFrameCss();

  assert.match(
    css,
    /body\.has-editorial-frame\s*\{[^}]*--editorial-frame-marker-slot-width:\s*calc\(var\(--editorial-frame-marker-font-size\) \* 2\.52632\);[^}]*--editorial-frame-marker-slot-height:\s*calc\(var\(--editorial-frame-marker-font-size\) \* 1\.89474\);[^}]*--editorial-frame-marker-offset-x:\s*calc\(var\(--editorial-frame-marker-padding-left\) \* 0\.5\);/
  );

  assert.match(
    css,
    /\.c-editorial-frame \.nav--toolbar \.menu-item--cart > a \.menu-item__icon\s*\{[^}]*position:\s*absolute;[^}]*top:\s*50%;[^}]*right:\s*calc\(var\(--editorial-frame-marker-slot-width\) \* -1\);[^}]*display:\s*flex;[^}]*align-items:\s*center;[^}]*justify-content:\s*center;[^}]*box-sizing:\s*border-box;[^}]*width:\s*var\(--editorial-frame-marker-slot-width\);[^}]*height:\s*var\(--editorial-frame-marker-slot-height\);[^}]*padding-left:\s*0;[^}]*color:\s*var\(--editorial-frame-surface\);[^}]*font-feature-settings:\s*"lnum";[^}]*transition:\s*all 0\.25s[^;]*;[^}]*transform:\s*translate\(var\(--editorial-frame-marker-offset-x\), -50%\) translateZ\(0\);/
  );

  assert.match(
    css,
    /\.c-editorial-frame \.nav--toolbar \.menu-item--cart > a \.menu-item__icon:after\s*\{[^}]*content:\s*"";[^}]*display:\s*block;[^}]*width:\s*var\(--editorial-frame-marker-height\);[^}]*height:\s*var\(--editorial-frame-marker-height\);[^}]*border:\s*0\.125em solid currentColor;[^}]*border-radius:\s*50%;[^}]*position:\s*absolute;[^}]*top:\s*50%;[^}]*left:\s*50%;[^}]*transform:\s*translate\(-50%, -50%\);[^}]*z-index:\s*-1;[^}]*transition:\s*all 0\.25s[^;]*;/
  );

  assert.match(
    css,
    /\.c-editorial-frame \.nav--toolbar \.menu-item--cart > a:hover \.menu-item__icon,\s*\.c-editorial-frame \.nav--toolbar \.menu-item--cart > a:focus-visible \.menu-item__icon\s*\{[^}]*color:\s*var\(--sm-current-bg-color\);/
  );

  assert.match(
    css,
    /\.c-editorial-frame \.nav--toolbar \.menu-item--cart > a:hover \.menu-item__icon:after,\s*\.c-editorial-frame \.nav--toolbar \.menu-item--cart > a:focus-visible \.menu-item__icon:after\s*\{[^}]*border-width:\s*calc\(var\(--editorial-frame-marker-height\) \/ 2\);[^}]*border-color:\s*var\(--sm-current-accent-color\);/
  );
});

test('Editorial Frame styles remove the chrome shell on mobile', () => {
  const css = compileEditorialFrameCss();

  assert.match(
    css,
    /@media not screen and \(min-width: 1024px\)\s*\{[^}]*body\.has-editorial-frame-menu #page\s*\{[^}]*padding-right:\s*0;[^}]*\}[^}]*body\.has-editorial-frame-frame #page\s*\{[^}]*padding-top:\s*0;[^}]*padding-left:\s*0;[^}]*\}[^}]*\.c-editorial-frame\s*\{[^}]*display:\s*none;[^}]*\}/
  );
});
