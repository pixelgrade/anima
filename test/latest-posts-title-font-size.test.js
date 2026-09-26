/**
 * Latest Posts titles now track the block's own font-size control (#617).
 *
 * `_common.scss` reset `--font-size`/`--current-*` on every descendant of the
 * block (`.wp-block-latest-posts[class] *`) to the body role, then pinned
 * the title to a fixed heading-4 role with its own `--font-size-modifier`.
 * Neither the title nor the `<li>` around it ever declared a real `font-
 * size` property, so both were rendered by the theme's sitewide `* { font-
 * size: var(--current-font-size) }` rule off the title's own custom-
 * property role — completely ignoring whatever real font-size the block's
 * own control (a `has-*-font-size` preset class or a literal custom value)
 * put on the `<ul>`. The title rendered at a fixed size (Playfair 700,
 * heading-4) no matter what the block's Typography panel said.
 *
 * The fix makes `<li>` and the title inherit the real, cascaded font-size
 * (so both track whatever the `<ul>` resolves to, preset or custom), while
 * keeping the title's other typographic properties on a "list title" role
 * (heading-6: distinct family/weight/letter-spacing/case, lighter than a
 * sidebar's typical heading-5 widget title) instead of the heavier
 * heading-4. Meta (author/date/excerpt) keeps its own independent role and
 * is untouched.
 */
const test = require( 'node:test' );
const assert = require( 'node:assert/strict' );
const fs = require( 'node:fs' );
const os = require( 'node:os' );
const path = require( 'node:path' );
const { execFileSync } = require( 'node:child_process' );
const sass = require( 'sass' );
const postcss = require( 'postcss' );

const scssRoot = path.join( __dirname, '..', 'src', 'scss' );
const compileCss = entry => sass.compile( path.join( scssRoot, entry ), {
  loadPaths: [ scssRoot ],
  silenceDeprecations: [ 'import', 'global-builtin', 'slash-div' ],
} ).css;

const norm = selector => selector.replace( /\s+/g, ' ' ).replace( /"/g, '' ).trim();

const rule = ( root, selector ) => {
  const found = [];
  root.walkRules( r => {
    if ( norm( r.selector ) === norm( selector ) ) {
      found.push( Object.fromEntries( r.nodes.filter( n => n.type === 'decl' ).map( d => [ d.prop, d.value ] ) ) );
    }
  } );
  return found;
};

test( 'blocks/common.scss: the list item and the title inherit real font-size', () => {
  const root = postcss.parse( compileCss( path.join( 'blocks', 'common.scss' ) ) );

  const li = rule( root, '.wp-block-latest-posts[class] li' );
  assert.equal( li.length, 1, 'exactly one rule for the list item' );
  assert.deepEqual( li[ 0 ], { 'font-size': 'inherit' } );

  const title = rule( root, '.wp-block-latest-posts[class] .wp-block-latest-posts__post-title' );
  assert.equal( title.length, 1, 'exactly one rule for the title' );
  assert.equal( title[ 0 ][ 'font-size' ], 'inherit', 'the title no longer pins its own --font-size' );
  assert.ok( ! ( '--font-size' in title[ 0 ] ), 'the title does not redeclare --font-size' );
  assert.ok( ! ( '--font-size-modifier' in title[ 0 ] ), 'the title does not redeclare --font-size-modifier' );

  // Meta stays on its own independent role (untouched by this fix).
  const author = rule( root, '.wp-block-latest-posts__post-author[class], .wp-block-latest-posts__post-date[class]' );
  // Its colour is the quiet-text role (style-manager#216), falling back to fg1.
  assert.deepEqual( author[ 0 ], { '--font-size-modifier': '0.85', color: 'var(--sm-current-fg-muted-color, var(--sm-current-fg1-color))' } );
} );

// ---------------------------------------------------------------------------
// Real cascade: the compiled theme stylesheets in headless Chrome.
// ---------------------------------------------------------------------------

const CHROME = [
  process.env.CHROME_BIN,
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
].find( bin => bin && fs.existsSync( bin ) );

const FIXTURE = markup => `
<ul class="wp-block-latest-posts wp-block-latest-posts__list" id="default">
  <li><a class="wp-block-latest-posts__post-title" href="#">Default title</a></li>
</ul>
<ul class="wp-block-latest-posts wp-block-latest-posts__list has-smaller-font-size" id="smaller">
  <li><a class="wp-block-latest-posts__post-title" href="#">Smaller-preset title</a></li>
</ul>
<ul class="wp-block-latest-posts wp-block-latest-posts__list" id="custom" style="font-size:12px">
  <li><a class="wp-block-latest-posts__post-title" href="#">Custom-12px title</a></li>
</ul>
<aside><h5 id="widget-heading">Widget heading</h5></aside>
`;

const render = css => {
  const dir = fs.mkdtempSync( path.join( os.tmpdir(), 'anima-617-' ) );
  const file = path.join( dir, 'fixture.html' );
  fs.writeFileSync( file, `<!doctype html><html><head><meta charset="utf-8">
<style>${ css }
  /* WordPress core preset output (real CSS property + !important, as core emits it) */
  .has-smaller-font-size { font-size: 13px !important; }
</style></head><body>${ FIXTURE() }
<pre id="out"></pre>
<script>
  const out = {};
  for ( const id of [ 'default', 'smaller', 'custom' ] ) {
    const ul = document.getElementById( id );
    const li = ul.querySelector( 'li' );
    const title = ul.querySelector( '.wp-block-latest-posts__post-title' );
    out[ id ] = {
      ulSize: parseFloat( getComputedStyle( ul ).fontSize ),
      liSize: parseFloat( getComputedStyle( li ).fontSize ),
      titleSize: parseFloat( getComputedStyle( title ).fontSize ),
      titleWeight: getComputedStyle( title ).fontWeight,
    };
  }
  out.widgetHeadingWeight = getComputedStyle( document.getElementById( 'widget-heading' ) ).fontWeight;
  document.getElementById( 'out' ).textContent = JSON.stringify( out );
</script></body></html>` );

  const dom = execFileSync( CHROME, [
    '--headless=new', '--disable-gpu', '--no-sandbox', '--hide-scrollbars',
    '--window-size=1440,900', '--virtual-time-budget=2000', '--dump-dom', `file://${ file }`,
  ], { encoding: 'utf8', stdio: [ 'ignore', 'pipe', 'ignore' ], timeout: 60000 } );

  fs.rmSync( dir, { recursive: true, force: true } );
  return JSON.parse( dom.match( /<pre id="out">([^<]*)<\/pre>/ )[ 1 ].replace( /&quot;/g, '"' ) );
};

test( 'headless Chrome: the title tracks the list font-size (preset and custom)', { skip: ! CHROME && 'Chrome not installed' }, () => {
  const properties = compileCss( 'custom-properties.scss' );
  const style = compileCss( 'style.scss' );
  const blocks = compileCss( path.join( 'blocks', 'common.scss' ) );

  const brokenBlocks = postcss.parse( blocks );
  let removed = 0;
  brokenBlocks.walkRules( r => {
    if ( norm( r.selector ) === norm( '.wp-block-latest-posts[class] li' ) ) {
      removed++;
      r.remove();
    }
    if ( norm( r.selector ) === norm( '.wp-block-latest-posts[class] .wp-block-latest-posts__post-title' ) ) {
      removed++;
      // Restore the pre-fix rule: a fixed heading-4 role, ignoring context.
      r.replaceWith( postcss.parse( `.wp-block-latest-posts[class] .wp-block-latest-posts__post-title {
        --font-size: 24; --current-font-weight: 700; --font-size-modifier: 0.9;
      }` ) );
    }
  } );
  assert.equal( removed, 2, 'both #617 rules were found in the compiled stylesheet' );

  const withFix = render( properties + style + blocks );
  const without = render( properties + style + brokenBlocks.toString() );

  // The bug: without the fix, the title size ignores the list's own size.
  assert.equal( without.default.titleSize, without.smaller.titleSize, 'bug: fixed regardless of preset' );
  assert.equal( without.default.titleSize, without.custom.titleSize, 'bug: fixed regardless of custom size' );

  // Fixed: the title tracks the list's real font-size in every case.
  for ( const id of [ 'default', 'smaller', 'custom' ] ) {
    assert.equal( withFix[ id ].titleSize, withFix[ id ].liSize, `${ id }: title matches li` );
    assert.equal( withFix[ id ].titleSize, withFix[ id ].ulSize, `${ id }: title matches ul` );
  }
  assert.ok( withFix.smaller.titleSize < withFix.default.titleSize, 'smaller preset shrinks the title' );
  assert.ok( withFix.custom.titleSize < withFix.default.titleSize, 'a custom value shrinks the title' );
  assert.equal( withFix.custom.titleSize, 12, 'the literal custom value reaches the title' );

  // The "list title" role now ranks below a typical sidebar widget heading (heading-5, 700).
  assert.equal( withFix.default.titleWeight, '500' );
  assert.equal( withFix.widgetHeadingWeight, '700' );
} );
