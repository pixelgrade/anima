const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.join(__dirname, '..');

test('Header integration keeps one standard Template Part and never generates Header markup', () => {
  const integration = fs.readFileSync(path.join(root, 'inc', 'integrations', 'novablocks.php'), 'utf8');
  const runtime = fs.readFileSync(path.join(root, 'src', 'js', 'components', 'collection-header-integration', 'runtime.js'), 'utf8');
  const editorEntry = fs.readFileSync(path.join(root, 'src', 'js', 'editor.js'), 'utf8');
  const editorIntegration = fs.readFileSync(path.join(root, 'src', 'js', 'editor', 'collection-header-integration.js'), 'utf8');
  const collageStyles = fs.readFileSync(path.join(root, 'src', 'scss', 'utility', '_collection-collage.scss'), 'utf8');

  assert.doesNotMatch(integration, /collection_header_brick|collection_leading_items|wp_nav_menu|get_custom_logo/);
  assert.doesNotMatch(runtime, /cloneNode|appendChild|insertBefore|replaceChild/);
  assert.match(runtime, /\.anima-collection-canvas/);
  assert.match(runtime, /header\.wp-block-template-part/);
  assert.match(runtime, /data-nb-external-participant="site-header"/);
  assert.match(editorEntry, /editor\/collection-header-integration/);
  assert.match(editorIntegration, /iframe/);
  assert.match(editorIntegration, /contentDocument/);
  assert.match(collageStyles, /\.anima-collection-canvas\[class\]\s*>\s*header\.wp-block-template-part\s*\{[\s\S]*?width:\s*100%;[\s\S]*?max-width:\s*none;/);
} );
