const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const sass = require('sass');

function compileSocialLinksCss() {
  const entryFile = path.join(__dirname, '..', 'src', 'scss', 'social-links.scss');
  const { css } = sass.compile(entryFile, {
    loadPaths: [path.join(__dirname, '..', 'src', 'scss')],
  });

  return css.replace(/\s+/g, ' ');
}

test('social links styles recognize X URLs without regressing existing brands', () => {
  const css = compileSocialLinksCss();

  assert.match(css, /\.nb-navigation [^{}]*\[href\*="twitter\.com" i\][^{}]*\{[^}]*--is-social: 1;[^}]*\}/);
  assert.match(css, /\.nb-navigation [^{}]*\[href\*="\/\/x\.com" i\][^{}]*\{[^}]*--is-social: 1;[^}]*\}/);

  assert.match(css, /\.social-menu-item > a\[href\*="twitter\.com" i\] \{[^}]*--social-icon-mask: url\([^)]*icon-x\.svg\)/);
  assert.match(css, /\.social-menu-item > a\[href\*="\/\/x\.com" i\] \{[^}]*--social-icon-mask: url\([^)]*icon-x\.svg\)/);
  assert.match(css, /--social-icon-scale: 0\.86;[^}]*--social-icon-size: calc\(var\(--icons-size-multiplier\) \* var\(--social-icon-scale, 1\) \* var\(--current-font-size\)\)/);

  assert.match(css, /\.social-menu-item > a\[href\*=facebook i\] \{[^}]*--social-icon-glyph: "\\f09a"/);
  assert.match(css, /\.social-menu-item > a\[href\*=instagram i\] \{[^}]*--social-icon-glyph: "\\f16d"/);
});
