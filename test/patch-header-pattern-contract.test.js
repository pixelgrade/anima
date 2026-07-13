const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const themeRoot = path.resolve(__dirname, '..');
const patternPath = path.join(themeRoot, 'inc/fse/patterns/header-patch.php');
const stylePath = path.join(themeRoot, 'src/scss/utility/_header-patch.scss');
const utilityPath = path.join(themeRoot, 'src/scss/utility.scss');

test('Patch Header is a standard selectable Header Template Part pattern', () => {
  assert.equal(fs.existsSync(patternPath), true, 'expected header-patch.php');

  const source = fs.readFileSync(patternPath, 'utf8');

  assert.match(source, /'blockTypes'\s*=>\s*\[\s*'core\/template-part\/header'\s*\]/);
  assert.match(source, /'title'\s*=>\s*__\(\s*'Patch Header'/);
  assert.match(source, /wp:novablocks\/header\s+\{[^}]*"className":"is-style-anima-patch-header"/);
  assert.match(source, /wp:novablocks\/header\s+\{[^}]*"logoHeight":48/);
  assert.match(source, /wp:novablocks\/logo/);
  assert.match(source, /wp:novablocks\/navigation\s+\{"slug":"primary"/);
  assert.match(source, /wp:novablocks\/navigation\s+\{"slug":"tertiary"/);
  assert.doesNotMatch(source, /<header\b/i, 'Template Part wrapper owns the header landmark');

  // Structure is expressed through Header Row block attributes, not theme CSS:
  // every row left-aligns its content, and the primary row lays its menu out
  // on two columns with tightened link density.
  const rowAttrs = [...source.matchAll(/wp:novablocks\/header-row\s+(\{[^}]*\})/g)]
    .map(match => JSON.parse(match[1].replace(/\\'/g, "'")));
  assert.equal(rowAttrs.length, 3, 'expected the logo, primary, and tertiary rows');
  for (const attrs of rowAttrs) {
    assert.equal(attrs.contentAlignment, 'start');
  }
  const primaryRow = rowAttrs.find(attrs => attrs.slug === 'primary');
  assert.equal(primaryRow.navigationColumns, 2, 'primary menu columns come from the block attribute');
  assert.equal(primaryRow.navigationLinkVerticalSpacing, 25, 'primary link density comes from the block attribute');
} );

test('Patch Header styling is desktop-only and consumes Anima design tokens', () => {
  assert.equal(fs.existsSync(stylePath), true, 'expected _header-patch.scss');

  const source = fs.readFileSync(stylePath, 'utf8');
  const utilitySource = fs.readFileSync(utilityPath, 'utf8');

  assert.match(utilitySource, /@import\s+"utility\/header-patch";/);
  assert.match(source, /@include\s+above\(lap\)\s*\{/);
  assert.match(source, /\.is-style-anima-patch-header/);
  assert.match(source, /width:\s*100%\s*!important;/);
  assert.match(source, /box-sizing:\s*border-box;\s*min-width:\s*0;/);
  assert.match(source, /margin-(?:right|left):\s*0\s*!important;/);
  assert.match(source, /padding-top:\s*calc\(var\(--theme-spacing-normal\)\s*\*\s*1\.5625\)\s*!important;/);
  assert.match(source, /padding-right:\s*calc\(var\(--theme-spacing-normal\)\s*\*\s*3\);/);
  assert.match(source, /padding-left:\s*var\(--theme-spacing-normal\);/);
  assert.match(source, /\.c-logo\s*\+\s*\.site-info\s*\{[\s\S]*?display:\s*none;/, 'custom logo suppresses the text-only site-title fallback');
  assert.match(source, /\.site-title\s+a\s*\{/);
  assert.match(source, /font-size:\s*clamp\([\s\S]*var\(--theme-navigation-font-size\)[\s\S]*\*\s*1px[\s\S]*var\(--theme-site-title-font-size\)[\s\S]*\*\s*1px[\s\S]*\);/);
  assert.match(source, /\.nb-navigation--primary[\s\S]*?a\s*\{[\s\S]*?font-size:\s*clamp\([\s\S]*?var\(--theme-navigation-font-size\)[\s\S]*?\*\s*1px/);
  assert.match(source, /\.wp-block-navigation__container/);
  assert.match(
    source,
    /\.editor-styles-wrapper\s+\.is-style-anima-patch-header\s*\{[\s\S]*?\.nb-header__inner-container\s*\{[\s\S]*?padding-top:\s*calc\(var\(--theme-spacing-normal\)\s*\*\s*1\.5625\)\s*!important;/,
    'the narrow editor iframe receives the same Patch desktop skin'
  );
  assert.doesNotMatch(source, /@include\s+below\(/);
  assert.doesNotMatch(source, /#[0-9a-f]{3,8}\b/i);

  // Structural rules now belong to the Header Row block attributes; the skin
  // must not reintroduce them.
  assert.doesNotMatch(source, /grid-template-columns/, 'menu columns are a Header Row attribute (navigationColumns)');
  assert.doesNotMatch(source, /display:\s*block/, 'row stacking/left alignment is a Header Row attribute (contentAlignment)');
  assert.doesNotMatch(source, /justify-content:\s*flex-start/, 'left alignment is a Header Row attribute (contentAlignment)');
} );
