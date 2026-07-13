const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.join(__dirname, '..');

test('the Template Part wrapper is the sole Footer landmark owner', () => {
  const footer = fs.readFileSync(path.join(root, 'wporg', 'parts', 'footer.html'), 'utf8');

  assert.doesNotMatch(footer, /"tagName"\s*:\s*"footer"/);
  assert.doesNotMatch(footer, /<\/?footer\b/);
  assert.match(footer, /<!-- wp:group /);
  assert.match(footer, /<div class="wp-block-group/);
});

test('the Nova Blocks Footer variant uses current Group serialization', () => {
  const footer = fs.readFileSync(path.join(root, 'parts', 'footer.html'), 'utf8');

  assert.match(footer, /--nb-card-media-container-height:50;/);
  assert.match(footer, /--nb-spacing-multiplier-override:1;/);
  assert.match(footer, /--nb-emphasis-area:100"/);
  assert.doesNotMatch(footer, /--nb-card-media-container-height:50px/);
  assert.doesNotMatch(footer, /--nb-emphasis-area:100px/);
});

test('the Nova Blocks Footer patterns use current Separator and copyright serialization', () => {
  const footerDefault = fs.readFileSync(path.join(root, 'inc', 'fse', 'patterns', 'footer-default.php'), 'utf8');
  const footerNavigation = fs.readFileSync(path.join(root, 'inc', 'fse', 'patterns', 'footer-navigation-copyright.php'), 'utf8');
  const templateTags = fs.readFileSync(path.join(root, 'inc', 'template-tags.php'), 'utf8');

  for (const source of [footerDefault, footerNavigation, templateTags]) {
    assert.doesNotMatch(source, /--nb-card-media-container-height:50px/);
    assert.doesNotMatch(source, /--nb-emphasis-area:100px/);
  }

  for (const pattern of [footerDefault, footerNavigation]) {
    assert.match(pattern, /sm-palette-1 sm-variation-12 sm-color-signal-3/);
    assert.match(pattern, /--nb-spacing-multiplier-override:1;/);
    assert.match(pattern, /data-palette="1" data-palette-variation="12" data-color-signal="3"/);
  }

  assert.match(templateTags, /--nb-spacing-multiplier-override:1;/);
});
