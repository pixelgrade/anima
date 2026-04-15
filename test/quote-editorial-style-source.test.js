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

test('editorial quote style matches the classic Hive quote treatment', () => {
  const source = fs.readFileSync( quoteStylePath, 'utf8' );

  assert.match(
    source,
    /&\.is-style-editorial:not\(\.is-style-plain\)\s*\{/,
  );

  assert.match(
    source,
    /font-family:\s*"Playfair Display", serif;/,
  );

  assert.match(
    source,
    /font-size:\s*28px;/,
  );

  assert.match(
    source,
    /top:\s*-22px;[\s\S]*?color:\s*#ffeb00;[\s\S]*?font-size:\s*54px;/s,
  );

  assert.match(
    source,
    /box-shadow:\s*currentColor 5\.5em 0 0;/,
  );

  assert.match(
    source,
    /font-family:\s*"Noto Serif", serif;[\s\S]*?font-size:\s*16px;[\s\S]*?font-weight:\s*700;/s,
  );
} );
