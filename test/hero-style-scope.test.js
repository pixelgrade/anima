const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const heroStylePath = path.join(
  __dirname,
  '..',
  'src',
  'scss',
  'blocks',
  'nova-blocks',
  'hero',
  '_style.scss'
);

test( 'hero hidden-state styles exclude contextual post cards', () => {
  const source = fs.readFileSync( heroStylePath, 'utf8' );

  assert.match(
    source,
    /\.nb-supernova--card-layout-stacked\.nb-supernova--1-columns\.nb-supernova--align-full:not\(\.nb-contextual-post-card\) \.nb-supernova-item__inner-container/
  );
} );
