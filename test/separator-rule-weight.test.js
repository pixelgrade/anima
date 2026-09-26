// pixelgrade/anima#610: the Separator line thickness follows Nova's
// per-block rule weight (--nb-separator-rule-weight) and falls back to the
// theme's historical 3px when the block sets nothing.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const sass = require('sass');

const root = path.join(__dirname, '..');
const OLD_THICKNESS = '3px';

function compileComponents() {
  const { css } = sass.compile(path.join(root, 'src', 'scss', 'theme', 'components.scss'), {
    loadPaths: [path.join(root, 'src', 'scss')],
    style: 'compressed',
  });
  return css;
}

function declarationsFor(css, selector) {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const matches = [...css.matchAll(new RegExp(`(?:^|})${escaped}\\{([^}]*)\\}`, 'g'))];
  return matches.map(match => match[1]).join(';');
}

for (const [label, getCss] of [
  ['compiled source', compileComponents],
  ['shipped dist/css/theme/components.css', () => fs.readFileSync(path.join(root, 'dist', 'css', 'theme', 'components.css'), 'utf8')],
]) {
  test(`${label}: the separator maps its line thickness to the Nova rule weight with the old fallback`, () => {
    const css = getCss();
    const separator = declarationsFor(css, '.c-separator');

    assert.match(
      separator,
      new RegExp(`--separator-line-thickness:\\s*var\\(--nb-separator-rule-weight,\\s*${OLD_THICKNESS}\\)`),
      'The thickness must be declared on .c-separator, inside the block that carries --nb-separator-rule-weight, so it resolves per block.'
    );
  });

  test(`${label}: no root declaration pins the thickness for every separator`, () => {
    const css = getCss();
    assert.doesNotMatch(declarationsFor(css, ':root'), /--separator-line-thickness/);
  });

  test(`${label}: the lines, the arrows and the Simple rule all draw with the mapped thickness`, () => {
    const css = getCss();

    assert.match(declarationsFor(css, '.c-separator__line:after'), /height:var\(--separator-line-thickness\)/);
    assert.match(declarationsFor(css, '.c-separator__arrow'), /height:var\(--separator-line-thickness\)/);
    assert.match(declarationsFor(css, '.c-separator'), /--separator-arrow-width:\s*calc\(var\(--separator-line-thickness\) \* 2\)/);
    assert.match(declarationsFor(css, '.wp-block-separator.is-style-simple .c-separator:after'), /height:var\(--separator-line-thickness\)/);
  });
}
