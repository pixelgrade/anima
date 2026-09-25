/**
 * Links take the size of a block sized outside the role system (#595).
 *
 * WordPress sizes a block with a preset class (`.has-small-font-size`) or an
 * inline `font-size`. Anima's universal rule recomputes every element from
 * the inherited role variables, so a link in a Small paragraph rendered at
 * the body size (12.6px paragraph, 15px link). Links directly inside such a
 * block now inherit its font size and line height. Component links that set
 * their own role on the anchor (tag chips, latest-posts titles, the comment
 * cancel link) must keep it, so the base `a` rule stays size-neutral.
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

const SCOPE = ':where([class*="has-"][class*="-font-size"], [style^="font-size"], [style*=";font-size"], [style*="; font-size"]) > a';

// Sass drops quotes around identifier-like attribute values; compare without them.
const norm = selector => selector.replace( /\s+/g, ' ' ).replace( /"/g, '' ).trim();

const inheritRules = root => {
  const found = [];
  root.walkRules( rule => {
    const props = Object.fromEntries( rule.nodes.filter( n => n.type === 'decl' ).map( d => [ d.prop, d.value ] ) );
    if ( props[ 'font-size' ] === 'inherit' && /(^|[\s>(,])a$/.test( rule.selector.trim() ) ) {
      found.push( { selector: norm( rule.selector ), props } );
    }
  } );
  return found;
};

for ( const [ entry, scope ] of [ [ 'style.scss', '' ], [ 'block-editor.scss', '.editor-styles-wrapper ' ] ] ) {
  test( `${ entry }: links inside a font-sized block inherit its size and line height`, () => {
    const root = postcss.parse( compileCss( entry ) );
    const rules = inheritRules( root );
    assert.deepEqual( rules, [ { selector: norm( `${ scope }${ SCOPE }` ), props: { 'font-size': 'inherit', 'line-height': 'inherit' } } ] );

    // The base link rule stays size-neutral: component links keep their own role.
    root.walkRules( rule => {
      if ( rule.selector.trim() === `${ scope }a`.trim() ) {
        rule.walkDecls( decl => assert.ok( ! [ 'font-size', 'line-height', 'font' ].includes( decl.prop ), `${ rule.selector } sets ${ decl.prop }` ) );
      }
    } );
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

const FIXTURE = `
<div class="wp-block-post-content">
  <p id="normal">Normal <a href="#">link</a></p>
  <p id="small" class="has-small-font-size">Small <a href="#">link</a></p>
  <p id="xlarge" class="has-x-large-font-size">X-Large <a href="#">link</a></p>
  <p id="inline" style="font-style:normal;font-size:22px;line-height:1.1">Inline size <a href="#">link</a></p>
  <p id="custom" class="has-custom-font-size" style="font-size:11px">Custom <a href="#">link</a></p>
</div>
<div id="role" style="--font-size: 24"><a class="own-role" href="#">own role under a role variable</a></div>
<div id="modifier" style="--font-size-modifier: 1.4"><a class="own-role" href="#">own role under a modifier</a></div>
<div id="chip" class="wp-block-post-terms taxonomy-category is-style-tag"><a href="#">Tag chip</a></div>
<ul id="latest" class="wp-block-latest-posts"><li><a class="wp-block-latest-posts__post-title" href="#">Latest title</a></li></ul>
<nav id="nav" class="has-small-font-size wp-block-navigation"><ul><li class="wp-block-navigation-item"><a class="wp-block-navigation-item__content" href="#"><span>Nav item</span></a></li></ul></nav>
<div id="button" class="wp-block-button"><a class="wp-block-button__link wp-element-button" href="#">Button</a></div>
`;

const IDS = [ 'normal', 'small', 'xlarge', 'inline', 'custom', 'role', 'modifier', 'chip', 'latest', 'nav', 'button' ];

const render = css => {
  const dir = fs.mkdtempSync( path.join( os.tmpdir(), 'anima-595-' ) );
  const file = path.join( dir, 'fixture.html' );
  fs.writeFileSync( file, `<!doctype html><html><head><meta charset="utf-8">
<style>${ css }
  /* WordPress core preset output */
  .has-small-font-size { font-size: 13px !important; }
  .has-x-large-font-size { font-size: 42px !important; }
  /* A component link that sets its own role on the anchor */
  .own-role { --font-size-modifier: 0.5; }
</style></head><body>${ FIXTURE }
<pre id="out"></pre>
<script>
  const out = {};
  for ( const id of ${ JSON.stringify( IDS ) } ) {
    const host = document.getElementById( id );
    const a = host.querySelector( 'a' );
    const parent = getComputedStyle( a.parentElement ), link = getComputedStyle( a );
    out[ id ] = { parentSize: parseFloat( parent.fontSize ), size: parseFloat( link.fontSize ), parentLh: parseFloat( parent.lineHeight ), lh: parseFloat( link.lineHeight ) };
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

test( 'headless Chrome: preset-sized links match their block; role links are unchanged', { skip: ! CHROME && 'Chrome not installed' }, () => {
  const properties = compileCss( 'custom-properties.scss' );
  const style = compileCss( 'style.scss' );
  const root = postcss.parse( style );
  let removed = 0;
  root.walkRules( rule => {
    if ( norm( rule.selector ) === norm( SCOPE ) ) {
      removed++;
      rule.remove();
    }
  } );

  assert.equal( removed, 1, 'the #595 rule was found in the compiled stylesheet' );

  // Block styles (post terms chips, latest posts) load after the theme stylesheet.
  const blocks = compileCss( path.join( 'blocks', 'common.scss' ) );

  const withRule = render( properties + style + blocks );
  const without = render( properties + root.toString() + blocks );

  // The bug: without the rule, preset-sized links fall back to the role size.
  assert.notEqual( without.small.size, without.small.parentSize, 'small link differs from its paragraph without the rule' );

  for ( const id of [ 'normal', 'small', 'xlarge', 'inline', 'custom' ] ) {
    assert.equal( withRule[ id ].size, withRule[ id ].parentSize, `${ id } link size ${ withRule[ id ].size } vs block ${ withRule[ id ].parentSize }` );
    assert.equal( withRule[ id ].lh, withRule[ id ].parentLh, `${ id } link line height ${ withRule[ id ].lh } vs block ${ withRule[ id ].parentLh }` );
  }
  assert.equal( withRule.small.size, 13 );
  assert.equal( withRule.xlarge.size, 42 );
  assert.equal( withRule.inline.size, 22 );

  // Links that carry their own role, or sit under role variables, are untouched.
  for ( const id of [ 'normal', 'role', 'modifier', 'chip', 'latest', 'nav', 'button' ] ) {
    assert.deepEqual( withRule[ id ], without[ id ], id );
  }
  for ( const id of [ 'role', 'modifier', 'chip' ] ) {
    assert.notEqual( withRule[ id ].size, withRule[ id ].parentSize, `${ id } link keeps its own role` );
  }
} );
