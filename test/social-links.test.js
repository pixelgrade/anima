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

  assert.match(css, /\.nb-navigation [^{}]*\[href\*="twitter\.com"\][^{}]*\{[^}]*--is-social: 1;[^}]*\}/);
  assert.match(css, /\.nb-navigation [^{}]*\[href\*="x\.com"\][^{}]*\{[^}]*--is-social: 1;[^}]*\}/);

  assert.match(css, /\.social-menu-item > a\[href\*="twitter\.com"\]:before/);
  assert.match(css, /\.social-menu-item > a\[href\*="x\.com"\]:before/);
  assert.match(css, /mask-image:\s*url\([^)]*icon-x\.svg\)/);
  assert.match(css, /width:\s*calc\(var\(--icons-size-multiplier\)\s*\*\s*0\.86\s*\*\s*var\(--current-font-size\)\)/);
  assert.match(css, /height:\s*calc\(var\(--icons-size-multiplier\)\s*\*\s*0\.86\s*\*\s*var\(--current-font-size\)\)/);

  assert.match(css, /\.social-menu-item > a\[href\*=facebook\]:before/);
  assert.match(css, /\.social-menu-item > a\[href\*=instagram\]:before/);
});
