const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

test('the visible progress-bar loader logo forces anchor and image layout to block', () => {
  const filePath = path.join(__dirname, '..', 'src', 'scss', 'components', '_page-transitions.scss');
  const scss = fs.readFileSync(filePath, 'utf8');

  assert.match(
    scss,
    /\.border-logo\s*\{[\s\S]*?\.logo\s*\{[\s\S]*?a,\s*img\s*\{\s*display:\s*block;\s*\}/
  );
});
