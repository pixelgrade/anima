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

  assert.match(css, /\.c-editorial-frame__rail\s*\{[^}]*padding-left:\s*0\.75em;[^}]*padding-right:\s*0\.75em;[^}]*width:\s*3\.75em;[^}]*top:\s*0\.75em;[^}]*right:\s*0;[^}]*bottom:\s*0;/);
  assert.match(css, /\.c-editorial-frame__rail(?::before|::before)\s*\{[^}]*width:\s*1px;/);
  assert.match(css, /\.c-editorial-frame__head\s*\{[^}]*padding-top:\s*1\.5em;[^}]*padding-bottom:\s*1\.5em;[^}]*min-height:\s*21em;/);
  assert.match(css, /\.nav--toolbar a\s*\{[^}]*margin-right:\s*0\.85714em;[^}]*right:\s*100%;[^}]*color:\s*transparent;[^}]*pointer-events:\s*none;/);
  assert.match(css, /\.nav--toolbar a(?::hover|:focus-visible)\s*\{[^}]*color:\s*inherit;[^}]*pointer-events:\s*auto;/);
});

test('Editorial Frame styles expose the regular-link monogram treatment', () => {
  const css = compileEditorialFrameCss();

  assert.match(css, /\.menu-item--editorial-frame-link > a \.menu-item-monogram\s*\{/);
});

test('Editorial Frame styles keep social links on the icon slot', () => {
  const css = compileEditorialFrameCss();

  assert.match(css, /\.nav--toolbar \.social-menu-item > a::before\s*\{[^}]*width:\s*var\(--editorial-frame-marker-width\);[^}]*height:\s*var\(--editorial-frame-marker-height\);[^}]*font-size:\s*1\.35714em;/);
  assert.match(css, /\.nav--toolbar \.social-menu-item > a::after\s*\{[^}]*display:\s*none;/);
});

test('Editorial Frame styles remove the chrome shell on mobile', () => {
  const css = compileEditorialFrameCss();

  assert.match(
    css,
    /@media not screen and \(min-width: 1024px\)\s*\{[^}]*body\.has-editorial-frame-menu #page\s*\{[^}]*padding-right:\s*0;[^}]*\}[^}]*body\.has-editorial-frame-frame #page\s*\{[^}]*padding-top:\s*0;[^}]*padding-left:\s*0;[^}]*\}[^}]*\.c-editorial-frame\s*\{[^}]*display:\s*none;[^}]*\}/
  );
});
