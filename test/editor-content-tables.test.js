// pixelgrade/anima#632: content table styling must not resize plugin editor UI.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const sass = require('sass');

const root = path.join(__dirname, '..');
const CHROME = [process.env.CHROME_BIN, '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/usr/bin/google-chrome', '/usr/bin/chromium'].find(file => file && fs.existsSync(file));
const compile = file => sass.compile(path.join(root, 'src/scss', file), {
  style: 'compressed', logger: sass.Logger.silent,
}).css;

function render(css, editor) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'anima-632-'));
  const file = path.join(dir, 'fixture.html');
  const table = (id, wrapper) => `<div class="${wrapper}" style="width:600px"><table id="${id}"><tbody><tr><td>A</td><td>B</td></tr><tr><td>C</td><td>D</td></tr></tbody></table></div>`;
  fs.writeFileSync(file, `<!doctype html><meta charset="utf-8"><style>
    .tribe-editor__calendars td { padding: 0; }
    ${css}</style>
    <div class="${editor ? 'editor-styles-wrapper' : 'entry-content'}" style="font-size:16px">
      ${table('picker', 'tribe-editor__calendars')}
      ${table('core', 'wp-block-table')}
      ${table('classic', 'wp-block-freeform')}
      ${table('legacy', '')}
    </div><pre id="result"></pre><script>
      const results = {};
      for (const id of ['picker', 'core', 'classic', 'legacy']) {
        const table = document.getElementById(id);
        const cell = getComputedStyle(table.rows[0].cells[1]);
        results[id] = {
          width: table.getBoundingClientRect().width,
          collapse: getComputedStyle(table).borderCollapse,
          padding: parseFloat(cell.paddingTop),
          whitespace: cell.whiteSpace,
          border: getComputedStyle(table.rows[0]).borderBottomWidth,
        };
      }
      document.getElementById('result').textContent = JSON.stringify(results);
    </script>`);
  try {
    const dom = execFileSync(CHROME, ['--headless=new', '--disable-gpu', '--no-sandbox',
      '--virtual-time-budget=1000', '--dump-dom', `file://${file}`], {
      encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'], timeout: 30000,
    });
    return JSON.parse(dom.match(/<pre id="result">([^<]*)<\/pre>/)[1]);
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
}

for (const [label, editorCss, frontendCss] of [
  ['compiled source', () => compile('block-editor.scss'), () => compile('style.scss')],
  ['shipped CSS', () => fs.readFileSync(path.join(root, 'dist/css/block-editor.css'), 'utf8'),
    () => fs.readFileSync(path.join(root, 'style.css'), 'utf8')],
  ['shipped RTL CSS', () => fs.readFileSync(path.join(root, 'dist/css/block-editor-rtl.css'), 'utf8'),
    () => fs.readFileSync(path.join(root, 'style-rtl.css'), 'utf8')],
]) {
  test(`${label}: editor tables preserve content styles without leaking into plugin UI`, { skip: !CHROME }, () => {
    const result = render(editorCss(), true);
    assert.ok(result.picker.width < 100, 'Plugin UI table must keep its intrinsic width, not content width.');
    assert.equal(result.picker.padding, 0);
    assert.equal(result.picker.whitespace, 'normal');
    assert.equal(result.picker.border, '0px');
    for (const id of ['core', 'classic']) {
      assert.equal(result[id].width, 600, id);
      assert.equal(result[id].collapse, 'collapse', id);
      assert.equal(result[id].padding, 8, id);
      assert.equal(result[id].whitespace, 'nowrap', id);
      assert.equal(result[id].border, '1px', id);
    }
  });
  test(`${label}: plain legacy frontend tables retain content styling`, { skip: !CHROME }, () => {
    const { legacy } = render(frontendCss(), false);
    assert.equal(legacy.width, 600);
    assert.equal(legacy.collapse, 'collapse');
    assert.equal(legacy.padding, 8);
    assert.equal(legacy.whitespace, 'nowrap');
    assert.equal(legacy.border, '1px');
  });
}
