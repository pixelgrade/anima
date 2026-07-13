const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.join(__dirname, '..');

test('Pile parallax preserves Nova placement transforms and excludes external participants', () => {
  const source = fs.readFileSync(
    path.join(root, 'src', 'js', 'components', 'pile-parallax', 'index.js'),
    'utf8'
  );

  assert.match(
    source,
    /const EXTERNAL_ITEM_SELECTOR = '\.nb-collection__layout-item--external'/
  );
  assert.match(source, /! item\.matches\( EXTERNAL_ITEM_SELECTOR \) &&/);
  assert.match(source, /const items = el\.querySelectorAll\( ITEM_SELECTOR \);/);
  assert.match(source, /if \( item\.matches\( EXTERNAL_ITEM_SELECTOR \) \) \{[^}]*return false;/s);
  assert.match(source, /style\.setProperty\( '--anima-pile-parallax-y'/);
  assert.match(source, /style\.removeProperty\( '--anima-pile-parallax-y' \)/);
  assert.doesNotMatch(source, /\.style\.transform\s*=/);
});

test('Pile parallax and card hover compose on the card layer', () => {
  const parallaxSource = fs.readFileSync(
    path.join(root, 'src', 'scss', 'components', '_pile-parallax.scss'),
    'utf8'
  );
  const hoverSource = fs.readFileSync(
    path.join(root, 'src', 'scss', 'utility', '_collection-hover-reveal.scss'),
    'utf8'
  );

  assert.match(
    parallaxSource,
    /> \.nb-supernova-item\s*\{[^}]*transform:\s*translateY\(calc\(var\(--anima-pile-parallax-y, 0px\) \+ var\(--anima-card-hover-y, 0px\)\)\);/s
  );
  assert.match(hoverSource, /--anima-card-hover-y:\s*0px;/);
  assert.match(
    hoverSource,
    /&:focus-within\s*\{[^}]*--anima-card-hover-y:\s*calc\(var\(--theme-spacing-smallest\) \* 1\.875\);/s
  );
});

test('Collage styling does not own standard Single or Footer template presentation', () => {
  const collageSource = fs.readFileSync(
    path.join(root, 'src', 'scss', 'utility', '_collection-collage.scss'),
    'utf8'
  );

  assert.doesNotMatch(collageSource, /anima-reading-layout/);
  assert.doesNotMatch(collageSource, /patch-site-footer/);
});
