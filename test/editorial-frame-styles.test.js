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

test('Editorial Frame styles expose the regular-link monogram treatment', () => {
  const css = compileEditorialFrameCss();

  assert.match(css, /\.menu-item--editorial-frame-link > a \.menu-item-monogram\s*\{/);
});

test('Editorial Frame styles remove the chrome shell on mobile', () => {
  const css = compileEditorialFrameCss();

  assert.match(
    css,
    /@media not screen and \(min-width: 1024px\)\s*\{[^}]*body\.has-editorial-frame-menu #page\s*\{[^}]*padding-right:\s*0;[^}]*\}[^}]*body\.has-editorial-frame-frame #page\s*\{[^}]*padding-top:\s*0;[^}]*padding-left:\s*0;[^}]*\}[^}]*\.c-editorial-frame\s*\{[^}]*display:\s*none;[^}]*\}/
  );
});
