/**
 * Long reference URLs in article content (#604).
 *
 * A visible URL is one unbreakable "word"; at phone widths it ran past the
 * paragraph and widened the page (320px requested -> 1675px scroll width,
 * with the mobile layout viewport zoomed out to 1280px). Article links may
 * break anywhere, but only inside text containers of Post Content, so
 * navigation, buttons and card links keep their sizing.
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
const compile = entry => postcss.parse( sass.compile( path.join( scssRoot, entry ), {
  loadPaths: [ scssRoot ],
  silenceDeprecations: [ 'import', 'global-builtin', 'slash-div' ],
} ).css );

const plainTextRules = root => {
  const found = [];
  root.walkDecls( 'overflow-wrap', decl => {
    if ( decl.value === 'break-word' && /wp-block-post-excerpt__excerpt/.test( decl.parent.selector || '' ) ) {
      found.push( decl.parent );
    }
  } );
  return found;
};

const wrapRules = root => {
  const found = [];
  root.walkDecls( 'overflow-wrap', decl => {
    if ( decl.value === 'anywhere' && decl.parent.selector?.includes( 'wp-block-post-content' ) ) {
      found.push( decl.parent );
    }
  } );
  return found;
};

const TEXT_CONTAINERS = [ 'p', 'li', 'dd', 'dt', 'th', 'td', 'figcaption', 'blockquote', 'cite', 'address' ];

for ( const [ entry, scope ] of [ [ 'style.scss', '' ], [ 'block-editor.scss', '.editor-styles-wrapper ' ] ] ) {
  test( `${ entry }: article links break anywhere, scoped to Post Content text`, () => {
    const rules = wrapRules( compile( entry ) );

    assert.equal( rules.length, 1, 'exactly one article-link wrap rule' );

    const selector = rules[ 0 ].selector.replace( /\s+/g, ' ' );
    assert.ok( selector.startsWith( `${ scope }.wp-block-post-content :is(` ), selector );
    for ( const tag of TEXT_CONTAINERS ) {
      assert.match( selector, new RegExp( `[(,]\\s*${ tag }\\s*[,)]` ), `${ tag } is covered` );
    }
    assert.match( selector, /a:not\(\.wp-block-navigation-item__content, \.wp-block-button__link\)/ );
  } );
}

test( 'plain-text URLs in excerpts and card descriptions wrap without changing sizing', () => {
  for ( const [ entry, scope ] of [ [ 'style.scss', '' ], [ 'block-editor.scss', '.editor-styles-wrapper ' ] ] ) {
    const found = [];
    compile( entry ).walkDecls( 'overflow-wrap', decl => {
      if ( decl.value === 'break-word' && /wp-block-post-excerpt__excerpt/.test( decl.parent.selector ) ) {
        found.push( decl.parent.selector.replace( /\s+/g, ' ' ) );
      }
    } );
    assert.equal( found.length, 1, entry );
    assert.equal( found[ 0 ], `${ scope }:is(.wp-block-post-excerpt__excerpt, .nb-card__description)`, entry );
  }
} );

test( 'no other link rule breaks words, and links are never clipped', () => {
  const targetsLinks = selector => /(^|[\s>+~(,])a([.:\[\s,)]|$)/.test( selector );

  const root = compile( 'style.scss' );
  root.walkDecls( decl => {
    const selector = decl.parent.selector || '';
    if ( ! targetsLinks( selector ) ) {
      return;
    }
    if ( decl.prop === 'word-break' ) {
      assert.notEqual( decl.value, 'break-all', `word-break: break-all on links in ${ selector }` );
    }
    if ( decl.prop === 'overflow-wrap' && decl.value === 'anywhere' ) {
      assert.match( selector, /wp-block-post-content/, `unscoped overflow-wrap:anywhere on links in ${ selector }` );
    }
  } );
} );

// ---------------------------------------------------------------------------
// Real layout: the compiled rule fixes the overflow in headless Chrome.
// ---------------------------------------------------------------------------

const CHROME = [
  process.env.CHROME_BIN,
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
].find( bin => bin && fs.existsSync( bin ) );

const URL = 'https://example.org/references/' + 'abcdefghijklmnopqrstuvwxyz'.repeat( 6 );

const render = css => {
  const dir = fs.mkdtempSync( path.join( os.tmpdir(), 'anima-604-' ) );
  const file = path.join( dir, 'fixture.html' );
  fs.writeFileSync( file, `<!doctype html><html><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<style>
  html, body { margin: 0; font: 17px/1.6 sans-serif; }
  .wp-block-post-content { width: 280px; margin: 0 20px; }
  .wp-block-buttons { display: flex; gap: 8px; }
  ${ css }
</style></head><body>
<div class="wp-block-post-content">
  <p class="wp-block-post-excerpt__excerpt" id="excerpt">Reference: ${ URL }</p>
  <p>Reference: <a id="url" href="${ URL }">${ URL }</a></p>
  <ul><li>Listed: <a id="li-url" href="${ URL }">${ URL }</a></li></ul>
  <p id="prose">Ordinary prose keeps its measure: internationalization, characterization and counterrevolutionaries wrap between words.</p>
  <div class="wp-block-buttons"><div class="wp-block-button"><a id="btn" class="wp-block-button__link" href="#">Book a visit</a></div></div>
</div>
<pre id="out"></pre>
<script>
  const a = document.getElementById( 'url' );
  const prose = document.getElementById( 'prose' ).firstChild;
  const split = [];
  for ( const m of prose.data.matchAll( /\\S+/g ) ) {
    const r = document.createRange(); r.setStart( prose, m.index ); r.setEnd( prose, m.index + m[ 0 ].length );
    if ( new Set( [ ...r.getClientRects() ].map( x => Math.round( x.top ) ) ).size > 1 ) split.push( m[ 0 ] );
  }
  document.getElementById( 'out' ).textContent = JSON.stringify( {
    scrollWidth: document.documentElement.scrollWidth,
    innerWidth: window.innerWidth,
    linkRight: Math.round( Math.max( ...[ ...a.getClientRects() ].map( r => r.right ) ) ),
    excerptScroll: document.getElementById( 'excerpt' ).scrollWidth,
    liLinkRight: Math.round( Math.max( ...[ ...document.getElementById( 'li-url' ).getClientRects() ].map( r => r.right ) ) ),
    text: a.textContent, href: a.getAttribute( 'href' ),
    splitProse: split,
    buttonWidth: Math.round( document.getElementById( 'btn' ).getBoundingClientRect().width ),
  } );
</script></body></html>` );

  const dom = execFileSync( CHROME, [
    '--headless=new', '--disable-gpu', '--no-sandbox', '--hide-scrollbars',
    '--window-size=320,800', '--virtual-time-budget=2000', '--dump-dom', `file://${ file }`,
  ], { encoding: 'utf8', stdio: [ 'ignore', 'pipe', 'ignore' ], timeout: 60000 } );

  fs.rmSync( dir, { recursive: true, force: true } );
  const json = dom.match( /<pre id="out">([^<]*)<\/pre>/ )[ 1 ].replace( /&quot;/g, '"' ).replace( /&amp;/g, '&' );
  return JSON.parse( json );
};

test( 'headless Chrome at 320px: overflows without the rule, fits with it', { skip: ! CHROME && 'Chrome not installed' }, () => {
  const compiled = compile( 'style.scss' );
  const rule = [ ...wrapRules( compiled ), ...plainTextRules( compiled ) ].map( r => r.toString() ).join( '\n' );

  const without = render( '' );
  const withRule = render( rule );

  // Without the rule the URL runs past the 300px content edge and widens the page.
  assert.ok( without.linkRight > 300, `unfixed link right edge ${ without.linkRight }` );
  assert.ok( without.scrollWidth > without.innerWidth, `unfixed scroll width ${ without.scrollWidth } vs viewport ${ without.innerWidth }` );

  // With it, everything fits the requested width; text and href are untouched.
  assert.ok( withRule.linkRight <= 300, `fixed link right edge ${ withRule.linkRight }` );
  assert.ok( withRule.liLinkRight <= 300, `fixed list link right edge ${ withRule.liLinkRight }` );
  assert.ok( without.excerptScroll > 280, `unfixed excerpt scroll width ${ without.excerptScroll }` );
  assert.ok( withRule.excerptScroll <= 280, `fixed excerpt scroll width ${ withRule.excerptScroll }` );
  // Headless Chrome may clamp the window above 320px; the page must not be wider than its viewport.
  assert.ok( withRule.scrollWidth <= withRule.innerWidth, `fixed scroll width ${ withRule.scrollWidth } vs viewport ${ withRule.innerWidth }` );
  assert.equal( withRule.text, URL );
  assert.equal( withRule.href, URL );

  // Ordinary prose and buttons are unchanged.
  assert.deepEqual( withRule.splitProse, [] );
  assert.deepEqual( withRule.splitProse, without.splitProse );
  assert.equal( withRule.buttonWidth, without.buttonWidth );
} );
