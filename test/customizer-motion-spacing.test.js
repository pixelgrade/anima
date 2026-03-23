const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const sass = require('sass');

function compileCustomizerCss() {
  const entryFile = path.join(__dirname, '..', 'src', 'scss', 'admin', 'customizer.scss');
  const { css } = sass.compile(entryFile, {
    loadPaths: [path.join(__dirname, '..', 'src', 'scss')],
  });

  return css.replace(/\s+/g, ' ');
}

test('transition symbol description uses half the Customizer spacing token above it', () => {
  const css = compileCustomizerCss();

  assert.match(
    css,
    /#sub-accordion-section-sm_motion_section #customize-control-sm_transition_symbol_control \.customize-control-description\s*\{[^}]*margin-top:\s*calc\(var\(--customize-control-spacing-y\)\s*\/\s*2\);[^}]*\}/
  );
});
