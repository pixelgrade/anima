const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const linksSource = readFileSync(
  path.join(__dirname, '../src/scss/elements/_links.scss'),
  'utf8',
);

test('inline links inherit a parent block font-size modifier', () => {
  assert.match(
    linksSource,
    /^a\s*\{[^}]*font-size:\s*inherit;[^}]*line-height:\s*inherit;/ms,
    'a link nested in a Small paragraph must not recompute the base font size',
  );
});
