/**
 * Inline Letter case / Appearance (italic) reach inline children (#618).
 *
 * WordPress 7.1 writes Typography → Letter case and Typography → Appearance →
 * Italic as an inline style on the block element (`style="text-transform:…"`,
 * `style="font-style:…"`). Anima's universal rule (`* { … }`, style.scss:53,
 * via setup/mixins/_font.scss `apply-font-properties`) recomputes every
 * descendant from the inherited role tokens (`--current-text-transform`,
 * `--current-font-style`). A descendant with no inline style of its own —
 * the `<a>` inside a linked Heading, the `<time>` inside a Post Date — re-reads
 * the role instead of the block's inline choice.
 *
 * The fix hands the inline value to the token on the element that carries
 * the inline style, so it cascades down normally like `em`'s own
 * `--current-font-style: italic` hand-off (elements/_base.scss). `[style]`
 * is doubled for specificity so the hand-off outranks compound role
 * selectors (`:is(h2,.h2)`, `.wp-block-post-date`) whatever the load order.
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

const TEXT_TRANSFORM_VALUES = [ 'uppercase', 'lowercase', 'capitalize', 'none' ];
const FONT_STYLE_VALUES = [ 'italic', 'normal' ];

// Sass drops quotes around identifier-like attribute values; compare without them.
const norm = selector => selector.replace( /\s+/g, ' ' ).replace( /"/g, '' ).trim();

const handOffRules = ( root, prop ) => {
  const found = [];
  root.walkRules( rule => {
    const props = Object.fromEntries( rule.nodes.filter( n => n.type === 'decl' ).map( d => [ d.prop, d.value ] ) );
    if ( props[ `--current-${ prop }` ] && /\[style\]\[style\*=/.test( rule.selector ) ) {
      found.push( { selector: norm( rule.selector ), value: props[ `--current-${ prop }` ] } );
    }
  } );
  return found;
};

for ( const [ entry, scope ] of [ [ 'style.scss', '' ], [ 'block-editor.scss', '.editor-styles-wrapper[class] ' ] ] ) {
  test( `${ entry }: inline text-transform is handed to --current-text-transform`, () => {
    const root = postcss.parse( compileCss( entry ) );
    const rules = handOffRules( root, 'text-transform' );
    assert.equal( rules.length, TEXT_TRANSFORM_VALUES.length, JSON.stringify( rules ) );
    for ( const value of TEXT_TRANSFORM_VALUES ) {
      const expected = norm( `${ scope }[style][style*="text-transform:${ value }"], ${ scope }[style][style*="text-transform: ${ value }"]` );
      const rule = rules.find( r => r.value === value );
      assert.ok( rule, `no hand-off rule for ${ value }` );
      assert.equal( rule.selector, expected );
    }
  } );

  test( `${ entry }: inline font-style is handed to --current-font-style`, () => {
    const root = postcss.parse( compileCss( entry ) );
    const rules = handOffRules( root, 'font-style' );
    assert.equal( rules.length, FONT_STYLE_VALUES.length, JSON.stringify( rules ) );
    for ( const value of FONT_STYLE_VALUES ) {
      const expected = norm( `${ scope }[style][style*="font-style:${ value }"], ${ scope }[style][style*="font-style: ${ value }"]` );
      const rule = rules.find( r => r.value === value );
      assert.ok( rule, `no hand-off rule for ${ value }` );
      assert.equal( rule.selector, expected );
    }
  } );
}

// ---------------------------------------------------------------------------
// Real cascade: the compiled theme stylesheet in headless Chrome.
// ---------------------------------------------------------------------------

const CHROME = [
  process.env.CHROME_BIN,
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
].find( bin => bin && fs.existsSync( bin ) );

// Simulates: a Heading role set to `none`/`uppercase` in Style Manager, a Post
// Date-style meta role set to `normal`, plus the two repro shapes from #618
// (linked heading, Post-Date-style wrapper around an inner text element).
const FIXTURE = `
<div id="root-vars" style="--theme-heading-2-text-transform: none; --theme-heading-3-text-transform: uppercase; --theme-meta-font-style: normal;">

  <!-- Repro 1: linked heading, role text-transform is none, block sets Uppercase inline -->
  <h2 id="h2-upper" class="wp-block-heading" style="text-transform:uppercase"><a href="#">Section title</a></h2>

  <!-- Reverse direction: role text-transform is uppercase, block sets None inline -->
  <h3 id="h3-none" class="wp-block-heading" style="text-transform: none"><a href="#">Section title</a></h3>

  <!-- Other transform values -->
  <h2 id="h2-lower" class="wp-block-heading" style="text-transform:lowercase"><a href="#">Section Title</a></h2>
  <h2 id="h2-capitalize" class="wp-block-heading" style="text-transform:capitalize"><a href="#">section title</a></h2>

  <!-- Unaffected: heading without inline style keeps the plain role -->
  <h2 id="h2-plain" class="wp-block-heading"><a href="#">Section title</a></h2>

  <!-- Repro 2: Post Date, role font-style is normal, block sets Italic inline -->
  <div id="post-date" class="wp-block-post-date" style="font-style:italic"><time datetime="2026-09-21">September 21, 2026</time></div>

  <!-- Reverse direction for font-style: role is italic, block sets Normal (Regular) inline -->
  <div id="post-date-explicit-normal" class="wp-block-post-date" style="font-style:normal; --theme-meta-font-style: italic;"><time datetime="2026-09-21">September 21, 2026</time></div>

  <!-- Component with its own role and no inline style: unaffected -->
  <div id="chip" class="wp-block-post-terms taxonomy-category is-style-tag"><a href="#">Tag chip</a></div>
</div>
`;

const render = css => {
  const dir = fs.mkdtempSync( path.join( os.tmpdir(), 'anima-618-' ) );
  const file = path.join( dir, 'fixture.html' );
  fs.writeFileSync( file, `<!doctype html><html><head><meta charset="utf-8">
<style>${ css }</style></head><body>${ FIXTURE }
<pre id="out"></pre>
<script>
  const pick = ( id, childSelector ) => {
    const host = document.getElementById( id );
    const child = childSelector ? host.querySelector( childSelector ) : null;
    const own = getComputedStyle( host );
    const inner = child ? getComputedStyle( child ) : null;
    return {
      own: { textTransform: own.textTransform, fontStyle: own.fontStyle },
      inner: inner ? { textTransform: inner.textTransform, fontStyle: inner.fontStyle } : null,
    };
  };
  const out = {
    h2Upper: pick( 'h2-upper', 'a' ),
    h3None: pick( 'h3-none', 'a' ),
    h2Lower: pick( 'h2-lower', 'a' ),
    h2Capitalize: pick( 'h2-capitalize', 'a' ),
    h2Plain: pick( 'h2-plain', 'a' ),
    postDate: pick( 'post-date', 'time' ),
    postDateExplicitNormal: pick( 'post-date-explicit-normal', 'time' ),
    chip: pick( 'chip', 'a' ),
  };
  document.getElementById( 'out' ).textContent = JSON.stringify( out );
</script></body></html>` );

  const dom = execFileSync( CHROME, [
    '--headless=new', '--disable-gpu', '--no-sandbox', '--hide-scrollbars',
    '--window-size=1440,900', '--virtual-time-budget=2000', '--dump-dom', `file://${ file }`,
  ], { encoding: 'utf8', stdio: [ 'ignore', 'pipe', 'ignore' ], timeout: 60000 } );

  fs.rmSync( dir, { recursive: true, force: true } );
  return JSON.parse( dom.match( /<pre id="out">([^<]*)<\/pre>/ )[ 1 ].replace( /&quot;/g, '"' ).replace( /&amp;/g, '&' ) );
};

test( 'headless Chrome: inline Letter case / Italic reach inline children; components with their own role are untouched', { skip: ! CHROME && 'Chrome not installed' }, () => {
  const properties = compileCss( 'custom-properties.scss' );
  const style = compileCss( 'style.scss' );
  const blocks = compileCss( path.join( 'blocks', 'common.scss' ) );
  const root = postcss.parse( style );

  let removed = 0;
  root.walkRules( rule => {
    if ( /\[style\]\[style\*=/.test( rule.selector ) && ( rule.selector.includes( 'text-transform' ) || rule.selector.includes( 'font-style' ) ) ) {
      removed++;
      rule.remove();
    }
  } );
  assert.equal( removed, TEXT_TRANSFORM_VALUES.length + FONT_STYLE_VALUES.length, 'the #618 hand-off rules were found in the compiled stylesheet' );

  const withFix = render( properties + style + blocks );
  const withoutFix = render( properties + root.toString() + blocks );

  // The bug: without the fix, the inline value on the block does not reach the inner element.
  assert.notEqual( withoutFix.h2Upper.inner.textTransform, withoutFix.h2Upper.own.textTransform, 'bug repro: link ignores the heading\'s inline Uppercase without the fix' );
  assert.notEqual( withoutFix.postDate.inner.fontStyle, withoutFix.postDate.own.fontStyle, 'bug repro: <time> ignores the block\'s inline Italic without the fix' );

  // The fix: inner element matches the block's own computed value in every direction tested.
  for ( const key of [ 'h2Upper', 'h3None', 'h2Lower', 'h2Capitalize', 'postDate' ] ) {
    assert.deepEqual( withFix[ key ].inner, withFix[ key ].own, `${ key }: inner element should match the block` );
  }
  assert.equal( withFix.h2Upper.own.textTransform, 'uppercase' );
  assert.equal( withFix.h3None.own.textTransform, 'none' );
  assert.equal( withFix.h2Lower.own.textTransform, 'lowercase' );
  assert.equal( withFix.h2Capitalize.own.textTransform, 'capitalize' );
  assert.equal( withFix.postDate.own.fontStyle, 'italic' );

  // Reverse direction: an inline font-style wins over a role token that also went italic.
  assert.equal( withFix.postDateExplicitNormal.own.fontStyle, 'normal' );
  assert.equal( withFix.postDateExplicitNormal.inner.fontStyle, 'normal' );

  // Unaffected: a heading with no inline style keeps the plain role, in both builds.
  assert.deepEqual( withFix.h2Plain, withoutFix.h2Plain, 'plain heading (no inline style) must be unchanged' );

  // Unaffected: a component with its own role and no inline style is untouched by the fix.
  assert.deepEqual( withFix.chip, withoutFix.chip, 'tag chip (own role, no inline style) must be unchanged' );
} );
