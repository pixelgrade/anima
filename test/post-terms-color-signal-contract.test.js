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
