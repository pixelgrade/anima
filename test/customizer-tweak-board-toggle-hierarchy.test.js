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

test('tweak board subsection intros promote their titles like the Motion panel', () => {
  const css = compileCustomizerCss();

  assert.match(
    css,
    /#sub-accordion-section-sm_tweak_board_section #customize-control-sm_decorative_titles_style_intro_control \.customize-control-title,\s*#sub-accordion-section-sm_tweak_board_section #customize-control-sm_contextual_entry_colors_intro_control \.customize-control-title\s*\{[^}]*font-size:\s*18px;[^}]*font-weight:\s*600;[^}]*line-height:\s*1\.3;[^}]*letter-spacing:\s*-0\.02em;[^}]*\}/
  );
});

test('tweak board enable toggles attach directly to their intro controls', () => {
  const css = compileCustomizerCss();

  assert.match(
    css,
    /#sub-accordion-section-sm_tweak_board_section #customize-control-sm_decorative_titles_style_intro_control\s*\+\s*#customize-control-sm_decorative_titles_style_control,\s*#sub-accordion-section-sm_tweak_board_section #customize-control-sm_contextual_entry_colors_intro_control\s*\+\s*#customize-control-sm_contextual_entry_colors_control\s*\{[^}]*border-top-width:\s*0;[^}]*\}/
  );
});

test('tweak board enable toggles keep the compact Motion-style spacing', () => {
  const css = compileCustomizerCss();

  assert.match(
    css,
    /#sub-accordion-section-sm_tweak_board_section #customize-control-sm_decorative_titles_style_control,\s*#sub-accordion-section-sm_tweak_board_section #customize-control-sm_contextual_entry_colors_control\s*\{[^}]*padding-top:\s*0;[^}]*padding-bottom:\s*var\(--customize-control-spacing-y\);[^}]*border-bottom-width:\s*1px;[^}]*\}/
  );
});
