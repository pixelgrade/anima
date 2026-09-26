/**
 * Heading case per context (#616).
 *
 * A font palette can set a heading role to uppercase, e.g. heading-2. Anima
 * applies that role's `text-transform` to every `h2`/`.h2` on the site
 * through `:is(h2, .h2) { @include apply-font(heading-2); }` (`_headings.
 * scss`), which is correct for template and section headings but also
 * uppercases every heading an author writes inside a post or page. Post
 * Content (`.wp-block-post-content`) is the author-content boundary: any
 * heading inside it now renders its case as written (`text-transform: none`)
 * while every other role property (size, weight, family, letter-spacing)
 * stays the role's. Headings outside Post Content — site title, widget
 * headings, Nova collection titles, page-builder rows — are untouched and
 * keep the palette's case.
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

const HEADING_SELECTOR = 'h1, .h1, h2, .h2, h3, .h3, h4, .h4, h5, .h5, h6, .h6';
const norm = selector => selector.replace( /\s+/g, ' ' ).replace( /"/g, '' ).trim();

test( 'style.scss: Post Content headings reset text-transform to none, and only that', () => {
  const root = postcss.parse( compileCss( 'style.scss' ) );
  const matches = [];
  root.walkRules( rule => {
    if ( norm( rule.selector ) === norm( `.wp-block-post-content :is(${ HEADING_SELECTOR })` ) ) {
      const props = Object.fromEntries( rule.nodes.filter( n => n.type === 'decl' ).map( d => [ d.prop, d.value ] ) );
      matches.push( props );
    }
  } );
  assert.equal( matches.length, 1, 'exactly one Post Content heading-case rule' );
  assert.deepEqual( matches[ 0 ], { '--current-text-transform': 'none' } );
} );

// ---------------------------------------------------------------------------
// Real cascade: the compiled theme stylesheet in headless Chrome.
// ---------------------------------------------------------------------------

const CHROME = [
  process.env.CHROME_BIN,
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
].find( bin => bin && fs.existsSync( bin ) );

const FIXTURE = `
<article class="wp-block-post-content">
  <h2 id="content-h2">Content H2</h2>
  <h3 id="content-h3">Content H3</h3>
  <span class="h2" id="content-dot-h2">Content .h2</span>
</article>
<aside class="widget"><h2 id="widget-h2">Widget H2</h2></aside>
<h2 id="bare-h2">Bare H2 (template)</h2>
`;

const IDS = [ 'content-h2', 'content-h3', 'content-dot-h2', 'widget-h2', 'bare-h2' ];

const render = css => {
  const dir = fs.mkdtempSync( path.join( os.tmpdir(), 'anima-616-' ) );
  const file = path.join( dir, 'fixture.html' );
  fs.writeFileSync( file, `<!doctype html><html><head><meta charset="utf-8">
<style>${ css }
  /* Simulate a font palette with an uppercase heading-2 role (heading-3 stays none) */
  :root { --theme-heading-2-text-transform: uppercase !important; }
</style></head><body>${ FIXTURE }
<pre id="out"></pre>
<script>
  const out = {};
  for ( const id of ${ JSON.stringify( IDS ) } ) {
    const el = document.getElementById( id );
    const cs = getComputedStyle( el );
    out[ id ] = { textTransform: cs.textTransform, fontSize: cs.fontSize, letterSpacing: cs.letterSpacing, fontWeight: cs.fontWeight };
  }
  document.getElementById( 'out' ).textContent = JSON.stringify( out );
</script></body></html>` );

  const dom = execFileSync( CHROME, [
    '--headless=new', '--disable-gpu', '--no-sandbox', '--hide-scrollbars',
    '--window-size=1440,900', '--virtual-time-budget=2000', '--dump-dom', `file://${ file }`,
  ], { encoding: 'utf8', stdio: [ 'ignore', 'pipe', 'ignore' ], timeout: 60000 } );

  fs.rmSync( dir, { recursive: true, force: true } );
  return JSON.parse( dom.match( /<pre id="out">([^<]*)<\/pre>/ )[ 1 ].replace( /&quot;/g, '"' ) );
};

test( 'headless Chrome: Post Content h2 renders as written; template/widget h2 keeps the palette case', { skip: ! CHROME && 'Chrome not installed' }, () => {
  const properties = compileCss( 'custom-properties.scss' );
  const style = compileCss( 'style.scss' );
  const root = postcss.parse( style );
  let removed = 0;
  root.walkRules( rule => {
    if ( norm( rule.selector ) === norm( `.wp-block-post-content :is(${ HEADING_SELECTOR })` ) ) {
      removed++;
      rule.remove();
    }
  } );
  assert.equal( removed, 1, 'the #616 rule was found in the compiled stylesheet' );

  const withRule = render( properties + style );
  const without = render( properties + root.toString() );

  // The bug: without the rule, a Post Content h2 renders uppercase too.
  assert.equal( without[ 'content-h2' ].textTransform, 'uppercase' );

  // Fixed: Post Content headings render as written...
  for ( const id of [ 'content-h2', 'content-dot-h2' ] ) {
    assert.equal( withRule[ id ].textTransform, 'none', id );
  }
  // ...heading-3 was never caps, so it stays none either way (no regression).
  assert.equal( withRule[ 'content-h3' ].textTransform, 'none' );

  // ...while everything outside Post Content keeps the palette's case.
  for ( const id of [ 'widget-h2', 'bare-h2' ] ) {
    assert.equal( withRule[ id ].textTransform, 'uppercase', id );
    assert.deepEqual( withRule[ id ], without[ id ], `${ id } is unaffected by the fix` );
  }

  // Scope: only the case changes for the affected heading.
  assert.equal( withRule[ 'content-h2' ].fontSize, without[ 'content-h2' ].fontSize );
  assert.equal( withRule[ 'content-h2' ].fontWeight, without[ 'content-h2' ].fontWeight );
  assert.equal( withRule[ 'content-h2' ].letterSpacing, without[ 'content-h2' ].letterSpacing );
} );
