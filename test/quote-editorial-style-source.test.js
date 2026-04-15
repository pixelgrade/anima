const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const quoteStylePath = path.join(
  __dirname,
  '..',
  'src',
  'scss',
  'blocks',
  'core',
  'quote',
  '_common.scss'
);

test('editorial quote style defines a dedicated pseudo-element treatment', () => {
  const source = fs.readFileSync( quoteStylePath, 'utf8' );

  assert.match(
    source,
    /&\.is-style-editorial:not\(\.is-style-plain\)\s*\{/,
  );

  assert.match(
    source,
    /&\.is-style-editorial:not\(\.is-style-plain\)[\s\S]*?&:before[\s\S]*?&:after/s,
  );
} );
