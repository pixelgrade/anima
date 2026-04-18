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

const typographyPath = path.join(
  __dirname,
  '..',
  'src',
  'scss',
  'setup',
  '_typography.scss'
);

test('editorial quote style uses design-system tokens and Hive accent treatment', () => {
  const source = fs.readFileSync( quoteStylePath, 'utf8' );
  const typography = fs.readFileSync( typographyPath, 'utf8' );

  assert.match(
    source,
    /&\.is-style-editorial:not\(\.is-style-plain\)\s*\{/,
  );

  assert.match(
    typography,
    /heading-3:\s*\([\s\S]*font-family:\s*\$theme-sm-font-primary,[\s\S]*font-size:\s*32,[\s\S]*font-weight:\s*700,[\s\S]*line-height:\s*1\.2,/s,
  );

  assert.match(
    typography,
    /heading-5:\s*\([\s\S]*font-family:\s*\$theme-sm-font-secondary,[\s\S]*font-size:\s*17,[\s\S]*font-weight:\s*700,[\s\S]*line-height:\s*1\.5,/s,
  );

  assert.match(
    source,
    /&,\s*p\s*\{[\s\S]*@include apply-font\(heading-3\);[\s\S]*%apply-font-properties;/s,
  );

  assert.match(
    source,
    /cite,\s*footer\s*\{[\s\S]*@include apply-font\(heading-5\);[\s\S]*%apply-font-properties;/s,
  );

  assert.match(
    source,
    /--theme-editorial-quote-ornament-inset:\s*var\(--theme-spacing-fluid-normal\);[\s\S]*--theme-editorial-quote-ornament-gap:\s*var\(--theme-spacing-fluid-large\);[\s\S]*padding-top:\s*calc\(var\(--theme-editorial-quote-ornament-inset\)\s*\+\s*var\(--theme-editorial-quote-ornament-gap\)\);[\s\S]*padding-bottom:\s*var\(--theme-spacing-fluid-large\);/s,
  );

  assert.match(
    source,
    /top:\s*calc\(var\(--theme-editorial-quote-ornament-inset\)\s*-\s*\(var\(--current-font-size\)\s*\*\s*0\.7857142857\)\);[\s\S]*color:\s*var\(--sm-current-accent-color\);[\s\S]*font-size:\s*calc\(var\(--current-font-size\)\s*\*\s*1\.92857/s,
  );

  assert.match(
    source,
    /&:after\s*\{[\s\S]*top:\s*var\(--theme-editorial-quote-ornament-inset\);/s,
  );

  assert.match(
    source,
    /box-shadow:\s*currentColor 5\.5em 0 0;/,
  );

  assert.doesNotMatch(
    source,
    /font-family:\s*"Playfair Display", serif;|font-family:\s*"Noto Serif", serif;|font-size:\s*28px;|font-size:\s*16px;|margin-top:\s*3em;|margin-bottom:\s*3em;|margin-top:\s*var\(--theme-editorial-quote-block-spacing\);|margin-bottom:\s*var\(--theme-editorial-quote-block-spacing\);|--theme-editorial-quote-block-spacing:|top:\s*-22px;|color:\s*#ffeb00;|@include apply-font\(editorial-quote\);|@include apply-font\(editorial-quote-citation\);/,
  );

  assert.doesNotMatch(
    typography,
    /\$theme-editorial-font-primary:|\$theme-editorial-font-secondary:|editorial-quote:|editorial-quote-citation:/,
  );
} );
