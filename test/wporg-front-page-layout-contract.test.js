const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

function readWporgFile(...segments) {
  return fs.readFileSync(path.join(__dirname, '..', 'wporg', ...segments), 'utf8');
}

function getBlockAttributes(source, blockName) {
  const matches = source.matchAll(new RegExp(`<!-- wp:${blockName} (\\{[^\\n]+\\}) -->`, 'g'));

  return Array.from(matches, (match) => JSON.parse(match[1]));
}

test('Anima LT template-part roots span the full Nova layout grid', () => {
  const header = readWporgFile('parts', 'header.html');
  const footer = readWporgFile('parts', 'footer.html');
  const [headerRoot] = getBlockAttributes(header, 'group');
  const [footerRoot] = getBlockAttributes(footer, 'group');

  assert.equal(
    headerRoot.align,
    'full',
    'The header root must span the full template-part grid before its inner alignwide row is resolved.'
  );
  assert.match(header, /^<header class="wp-block-group alignfull"/m);

  assert.equal(
    footerRoot.align,
    'full',
    'The footer root must span the full template-part grid before its inner alignwide rows are resolved.'
  );
  assert.match(footer, /^<div class="wp-block-group alignfull /m);
});

test('Anima LT hero heading content is anchored to the left wide edge', () => {
  const hero = readWporgFile('patterns', 'hero-design-cover.php');
  const headingGroup = getBlockAttributes(hero, 'group').find(
    (attributes) => attributes.align === 'wide' && attributes.style?.spacing?.blockGap === '1.2rem'
  );

  assert.ok(headingGroup, 'The hero heading group must remain an alignwide block.');
  assert.deepEqual(headingGroup.layout, { type: 'constrained', justifyContent: 'left' });
});
