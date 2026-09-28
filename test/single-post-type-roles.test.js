/**
 * Single-post type roles that no block setting can change (#625).
 *
 * - Post navigation titles (`novablocks/post-navigation`) used the heading-3
 *   role x 0.85, and Nova Blocks' phone rule replaced the size with a literal
 *   `--font-size: 19`, which rendered below the body size. They now take the
 *   heading-5 role at every width.
 * - The comment form title (`#reply-title.comment-reply-title`) used the
 *   heading-3 role, often larger than the Comments Title above it. It now
 *   takes heading-4.
 * - "Logged in as …. Edit your profile. Log out?" links shared the heading-6
 *   meta treatment (label role, 0.6 opacity) inside a running sentence. They
 *   now follow the paragraph. Comment metadata and reply links keep heading-6.
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

const norm = selector => selector.replace( /\s+/g, ' ' ).trim();
const declsOf = rule => Object.fromEntries( rule.nodes.filter( n => n.type === 'decl' ).map( d => [ d.prop, d.value ] ) );

const rulesMatching = ( root, predicate ) => {
  const found = [];
  root.walkRules( r => {
    const selectors = r.selectors.map( norm );
    if ( predicate( selectors ) ) {
      found.push( { selectors, decls: declsOf( r ) } );
    }
  } );
  return found;
};

test( 'style.scss: the three elements carry the intended roles', () => {
  const root = postcss.parse( compileCss( 'style.scss' ) );

  // Post navigation titles: heading-5 role, no size modifier, specific enough
  // to outrank Nova's `.post-navigation .post-navigation__post-title`.
  const nav = rulesMatching( root, s => s.some( sel => /post-navigation__post-title/.test( sel ) ) )
    .filter( r => '--font-size' in r.decls );
  assert.equal( nav.length, 1, 'exactly one rule sets the post navigation title size' );
  assert.deepEqual( nav[ 0 ].selectors, [ '.post-navigation .post-navigation__post-title[class]' ] );
  assert.equal( nav[ 0 ].decls[ '--font-size' ], 'var(--theme-heading-5-font-size)' );
  assert.equal( nav[ 0 ].decls[ '--current-font-weight' ], 'var(--theme-heading-5-font-weight)' );
  assert.ok( ! ( '--font-size-modifier' in nav[ 0 ].decls ), 'no size modifier on the navigation title' );

  // Comment form title: heading-4 role.
  const reply = rulesMatching( root, s => s.includes( '.comment-reply-title[class]' ) );
  assert.equal( reply.length, 1 );
  assert.equal( reply[ 0 ].decls[ '--font-size' ], 'var(--theme-heading-4-font-size)' );
  assert.equal( reply[ 0 ].decls[ '--current-font-family' ], 'var(--theme-heading-4-font-family)' );

  // Logged-in-as links: no rule gives them a role or dims them.
  const loggedIn = rulesMatching( root, s => s.some( sel => /\.logged-in-as a\b/.test( sel ) ) );
  for ( const r of loggedIn ) {
    for ( const prop of Object.keys( r.decls ) ) {
      assert.ok( ! /^--(font-size|current-)/.test( prop ) && prop !== 'opacity', `${ r.selectors.join( ', ' ) } sets ${ prop }` );
    }
  }

  // Comment metadata and reply links keep the heading-6 meta treatment.
  const meta = rulesMatching( root, s => s.includes( '.comment__metadata a' ) && s.includes( '.reply a' ) );
  assert.equal( meta.length, 1 );
  assert.equal( meta[ 0 ].decls[ '--font-size' ], 'var(--theme-heading-6-font-size)' );
  assert.equal( parseFloat( meta[ 0 ].decls.opacity ), 0.6 );
} );

// ---------------------------------------------------------------------------
// Real cascade: the compiled theme stylesheet in headless Chrome, with Nova
// Blocks' phone rule for the navigation title loaded after it.
// ---------------------------------------------------------------------------

const CHROME = [
  process.env.CHROME_BIN,
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
].find( bin => bin && fs.existsSync( bin ) );

const NOVA_PHONE_RULE = '@media only screen and (max-width: 1023px) { .post-navigation .post-navigation__post-title { --font-size: 19; } }';

const FIXTURE = `
<h4 id="h4">Heading 4</h4>
<h5 id="h5">Heading 5</h5>
<nav class="navigation post-navigation"><div class="nav-links">
  <div class="post-navigation__link post-navigation__link--previous">
    <span class="post-navigation__link-label">Previous article</span>
    <span id="nav" class="post-navigation__post-title post-navigation__post-title--previous"><a href="#">An earlier story</a></span>
  </div>
</div></nav>
<ol class="comment-list"><li><div class="comment__metadata"><a id="meta" href="#">September 2, 2026</a></div><div class="reply"><a id="reply" href="#">Reply</a></div></li></ol>
<div id="respond" class="comment-respond">
  <h3 id="reply-title" class="comment-reply-title">Leave a Reply</h3>
  <form class="comment-form">
    <p id="logged-in" class="logged-in-as">Logged in as admin. <a id="profile" href="#">Edit your profile</a>. <a href="#">Log out?</a></p>
  </form>
</div>
`;

// Headless Chrome will not size its window below 500px, so the fixture runs
// in an iframe of the exact width: its media queries and fluid sizes see that
// viewport. A srcdoc frame shares the wrapper's origin and writes back to it.
const render = ( css, width ) => {
  const dir = fs.mkdtempSync( path.join( os.tmpdir(), 'anima-625-' ) );
  const file = path.join( dir, 'fixture.html' );
  const inner = `<!doctype html><html><head><meta charset="utf-8">
<style>${ css }</style></head><body>${ FIXTURE }
<script>
  const pick = id => { const cs = getComputedStyle( document.getElementById( id ) );
    return { size: parseFloat( cs.fontSize ), weight: cs.fontWeight, family: cs.fontFamily, transform: cs.textTransform,
      spacing: cs.letterSpacing, lh: cs.lineHeight, opacity: cs.opacity, deco: cs.textDecorationLine }; };
  const out = { viewport: innerWidth };
  for ( const id of [ 'h4', 'h5', 'nav', 'reply-title', 'logged-in', 'profile', 'meta', 'reply' ] ) out[ id ] = pick( id );
  parent.document.getElementById( 'out' ).textContent = JSON.stringify( out );
</script></body></html>`;
  const srcdoc = inner.replace( /&/g, '&amp;' ).replace( /"/g, '&quot;' );
  fs.writeFileSync( file, `<!doctype html><html><head><meta charset="utf-8"><style>body{margin:0}iframe{border:0;display:block}</style></head>
<body><pre id="out"></pre><iframe width="${ width }" height="900" srcdoc="${ srcdoc }"></iframe></body></html>` );

  const dom = execFileSync( CHROME, [
    '--headless=new', '--disable-gpu', '--no-sandbox', '--hide-scrollbars',
    `--window-size=${ Math.max( width, 500 ) + 40 },1000`, '--virtual-time-budget=2000', '--dump-dom', `file://${ file }`,
  ], { encoding: 'utf8', stdio: [ 'ignore', 'pipe', 'ignore' ], timeout: 60000 } );

  fs.rmSync( dir, { recursive: true, force: true } );
  const out = JSON.parse( dom.match( /<pre id="out">([^<]*)<\/pre>/ )[ 1 ].replace( /&quot;/g, '"' ) );
  assert.equal( out.viewport, width, 'the fixture renders at the requested viewport width' );
  return out;
};

const role = m => ( { size: m.size, weight: m.weight, family: m.family, transform: m.transform, spacing: m.spacing } );

for ( const width of [ 1440, 390 ] ) {
  test( `headless Chrome at ${ width }px: navigation title = heading-5, form title = heading-4, logged-in links = sentence`, { skip: ! CHROME && 'Chrome not installed' }, () => {
    const css = compileCss( 'custom-properties.scss' ) + compileCss( 'style.scss' ) + NOVA_PHONE_RULE;
    const out = render( css, width );

    assert.deepEqual( role( out.nav ), role( out.h5 ), 'post navigation title follows the heading-5 role' );
    assert.deepEqual( role( out[ 'reply-title' ] ), role( out.h4 ), 'comment form title follows the heading-4 role' );

    const sentence = out[ 'logged-in' ], link = out.profile;
    assert.deepEqual( { ...role( link ), lh: link.lh }, { ...role( sentence ), lh: sentence.lh }, 'logged-in-as link follows its sentence' );
    assert.equal( link.opacity, '1' );
    assert.equal( link.deco, 'underline' );

    // The meta treatment stays on comment metadata and reply links.
    assert.equal( out.meta.opacity, '0.6' );
    assert.equal( out.reply.opacity, '0.6' );
    assert.notDeepEqual( role( out.meta ), role( sentence ), 'metadata links keep their own (heading-6) role' );
  } );
}
