const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const postTermsSource = readFileSync(
  path.join(__dirname, '../src/scss/blocks/_shame.scss'),
  'utf8',
);

const buttonSource = readFileSync(
  path.join(__dirname, '../src/scss/theme/components/_button.scss'),
  'utf8',
);

const compiledPostTermsStyles = [
  '../dist/css/blocks/common.css',
  '../dist/css/blocks/common-rtl.css',
].map((relativePath) => ({
  relativePath,
  source: readFileSync(path.join(__dirname, relativePath), 'utf8'),
}));

test('category tags use the same Color Signal surface and text tokens as buttons', () => {
  assert.match(
    buttonSource,
    /--theme-button-text-color:\s*var\(--sm-current-fg1-color\);\s*--theme-button-background-color:\s*var\(--sm-current-bg-color\);/,
    'the classic Button contract should define foreground text on the contextual background',
  );

  assert.match(
    postTermsSource,
    /&\.is-style-tag\s*\{[\s\S]*?a\s*\{[\s\S]*?background-color:\s*var\(--sm-current-bg-color\);[\s\S]*?color:\s*var\(--sm-current-fg1-color\);/,
    'category tags should follow the Button Color Signal surface and text direction',
  );
});

test('category tags invert their Color Signal pair on hover and keyboard focus', () => {
  assert.match(
    postTermsSource,
    /&:is\(:hover,\s*:focus\)\s*\{\s*background-color:\s*var\(--sm-current-fg1-color\);\s*color:\s*var\(--sm-current-bg-color\);\s*\}/,
    'interactive tags should retain contrast by inverting their contextual surface and text tokens',
  );

  assert.doesNotMatch(
    postTermsSource,
    /&:hover\s*\{\s*background-color:\s*var\(--sm-current-accent-color\);/,
    'the palette accent is not guaranteed to contrast with the tag foreground',
  );

  for (const { relativePath, source } of compiledPostTermsStyles) {
    assert.match(
      source,
      /\.wp-block-post-terms\.taxonomy-category\.is-style-tag a:is\(:hover,:focus\)\{background-color:var\(--sm-current-fg1-color\);color:var\(--sm-current-bg-color\)\}/,
      `${relativePath} should contain the compiled interactive Color Signal rule`,
    );
  }
});
