/**
 * Secondary text reads at 4.5:1 on its ground (#612, pixelgrade/nova-blocks#649).
 *
 * Dates, authors, counts, credits and the Conversations composer stand-in
 * were dimmed with `opacity` or a fixed translucent ink, which blends the
 * text into whatever ground sits behind it (2.79–4.28:1 on white).
 *
 * The #612 spots (Latest Posts date/author, Latest Comments date, caption
 * credits) now take the quiet-text role, `--sm-current-fg-muted-color`
 * (style-manager#214), falling back to `--sm-current-fg1-color` on a site
 * whose Style Manager predates the role (style-manager#216). Their smaller
 * size keeps the hierarchy.
 *
 * The Conversations count, hints and composer stand-in are a separate spot
 * (the theme half of nova-blocks#649, out of style-manager#216's scope) and
 * still take fg1 directly; fg2 is only held to the large-text minimum.
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
const compile = entry => sass.compile( path.join( scssRoot, entry ), {
  loadPaths: [ scssRoot ],
  silenceDeprecations: [ 'import', 'global-builtin', 'slash-div' ],
} ).css;
const commonCss = compile( 'blocks/common.scss' );
const conversationsCss = compile( 'blocks/nova-blocks/conversations.scss' );

const FG1 = /^var\(--sm-current-fg1-color\b/;
const FG_MUTED_FALLBACK_FG1 = /^var\(--sm-current-fg-muted-color,\s*var\(--sm-current-fg1-color\b/;
const decls = ( css, selectorPattern, prop ) => {
  const found = [];
  postcss.parse( css ).walkDecls( prop, decl => {
    const selector = decl.parent.selector && decl.parent.selector.replace( /\s+/g, ' ' );
    if ( selector && selector.split( ',' ).some( part => selectorPattern.test( part.trim() ) ) ) {
      found.push( { selector, value: decl.value } );
    }
  } );
  return found;
};
const dimmed = ( css, pattern ) => decls( css, pattern, 'opacity' ).filter( decl => parseFloat( decl.value ) < 1 );

test( 'Latest Posts date and author take the quiet-text role, falling back to fg1, not opacity', () => {
  for ( const target of [ /wp-block-latest-posts__post-date(\[class\])?$/, /wp-block-latest-posts__post-author(\[class\])?$/ ] ) {
    assert.deepEqual( dimmed( commonCss, target ), [], `${ target } is not dimmed` );
    const colors = decls( commonCss, target, 'color' );
    assert.ok( colors.length && colors.every( decl => FG_MUTED_FALLBACK_FG1.test( decl.value ) ), JSON.stringify( colors ) );
  }
} );

test( 'Latest Comments meta is not dimmed and its date takes the quiet-text role, falling back to fg1', () => {
  assert.deepEqual( dimmed( commonCss, /wp-block-latest-comments__comment-meta( > \*|>\*)?( |$)/ ), [] );
  assert.deepEqual( dimmed( commonCss, /wp-block-latest-comments__comment-date$/ ), [] );
  const colors = decls( commonCss, /wp-block-latest-comments__comment-date$/, 'color' );
  assert.ok( colors.length && colors.every( decl => FG_MUTED_FALLBACK_FG1.test( decl.value ) ), JSON.stringify( colors ) );
} );

test( 'caption credits take the quiet-text role, falling back to the inherited caption ink, at full opacity', () => {
  const credits = decls( commonCss, /\.credits$/, 'opacity' );
  assert.deepEqual( credits.filter( decl => parseFloat( decl.value ) < 1 ), [], JSON.stringify( credits ) );

  const colors = decls( commonCss, /\.credits$/, 'color' );
  assert.ok(
    colors.length && colors.every( decl => /^var\(--sm-current-fg-muted-color,\s*currentColor\)$/.test( decl.value ) ),
    JSON.stringify( colors )
  );
} );

test( 'Conversations count, hints and composer stand-in take fg1', () => {
  assert.deepEqual( dimmed( conversationsCss, /novablocks-conversations__comments-count$/ ), [] );
  const count = decls( conversationsCss, /novablocks-conversations__comments-count$/, 'color' );
  assert.ok( count.length && count.every( decl => FG1.test( decl.value ) ), JSON.stringify( count ) );

  const hint = decls( conversationsCss, /^\.novablocks-conversations$/, '--field-description-color' );
  assert.ok( hint.length && hint.every( decl => FG1.test( decl.value ) ), JSON.stringify( hint ) );

  const composer = decls( conversationsCss, /fake-input-button/, 'color' );
  assert.ok( composer.length, 'the composer stand-in is colored' );
  assert.ok( composer.every( decl => FG1.test( decl.value ) ), JSON.stringify( composer ) );
} );

// ---------------------------------------------------------------------------
// Real cascade: the compiled rules resolve to full-strength ink in Chrome.
// ---------------------------------------------------------------------------

const CHROME = [
  process.env.CHROME_BIN,
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
].find( bin => bin && fs.existsSync( bin ) );

test( 'headless Chrome: the #612 spots paint the quiet-text role, the #649 theme half stays on fg1, both at full opacity, in light and dark', { skip: ! CHROME && 'Chrome not installed' }, () => {
  const dir = fs.mkdtempSync( path.join( os.tmpdir(), 'anima-612-' ) );
  const file = path.join( dir, 'fixture.html' );
  // fg-muted is a distinct ink from fg1 so the assertions below actually prove the
  // #612 spots read the quiet-text role, not merely its fg1 fallback.
  const html = theme => `<!doctype html><html class="${ theme }"><head><meta charset="utf-8"><style>
    .ground { --sm-current-bg-color: #ffffff; --sm-current-fg1-color: #212220; --sm-current-fg2-color: #6b6b6b; --sm-current-fg-muted-color: #55605e; --sm-current-accent-color: #d9480f; background: var(--sm-current-bg-color); color: var(--sm-current-fg1-color); }
    html.is-dark .ground { --sm-current-bg-color: #121212; --sm-current-fg1-color: #f0f0f0; --sm-current-fg2-color: #9a9a9a; --sm-current-fg-muted-color: #c9c9c6; }
    ${ commonCss }
    ${ conversationsCss }
  </style></head><body>
  <div class="ground">
    <ul class="wp-block-latest-posts__list wp-block-latest-posts"><li><a class="wp-block-latest-posts__post-title" href="#">Post</a><div class="wp-block-latest-posts__post-author">by Ana</div><time class="wp-block-latest-posts__post-date">May 1</time></li></ul>
    <ol class="wp-block-latest-comments"><li class="wp-block-latest-comments__comment"><article><footer class="wp-block-latest-comments__comment-meta"><a class="wp-block-latest-comments__comment-author" href="#">Ana</a> on <a class="wp-block-latest-comments__comment-link" href="#">Post</a><time class="wp-block-latest-comments__comment-date">May 1</time></footer></article></li></ol>
    <figure class="wp-block-image"><figcaption>Caption <span class="credits">Photo: Someone</span></figcaption></figure>
    <div class="novablocks-conversations"><span class="novablocks-conversations__comments-count">3 comments</span><button class="fake-input-button">Share your knowledge</button></div>
  </div>
  <pre id="out"></pre>
  <script>
    const read = sel => { const el = document.querySelector( sel ); let op = 1; for ( let n = el; n; n = n.parentElement ) op *= parseFloat( getComputedStyle( n ).opacity ); return getComputedStyle( el ).color + '@' + op; };
    document.getElementById( 'out' ).textContent = JSON.stringify( {
      date: read( '.wp-block-latest-posts__post-date' ),
      author: read( '.wp-block-latest-posts__post-author' ),
      commentDate: read( '.wp-block-latest-comments__comment-date' ),
      credits: read( '.credits' ),
      count: read( '.novablocks-conversations__comments-count' ),
      composer: read( '.fake-input-button' ),
    } );
  </script></body></html>`;

  const run = theme => {
    fs.writeFileSync( file, html( theme ) );
    const dom = execFileSync( CHROME, [ '--headless=new', '--disable-gpu', '--no-sandbox', '--virtual-time-budget=2000', '--dump-dom', `file://${ file }` ],
      { encoding: 'utf8', stdio: [ 'ignore', 'pipe', 'ignore' ], timeout: 60000 } );
    return JSON.parse( dom.match( /<pre id="out">([^<]*)<\/pre>/ )[ 1 ].replace( /&quot;/g, '"' ) );
  };

  const MUTED_SPOTS = [ 'date', 'author', 'commentDate', 'credits' ];
  const FG1_SPOTS = [ 'count', 'composer' ];

  const light = run( '' );
  for ( const key of MUTED_SPOTS ) {
    assert.equal( light[ key ], 'rgb(85, 96, 94)@1', `light ${ key } (quiet text)` );
  }
  for ( const key of FG1_SPOTS ) {
    assert.equal( light[ key ], 'rgb(33, 34, 32)@1', `light ${ key } (fg1)` );
  }

  const dark = run( 'is-dark' );
  for ( const key of MUTED_SPOTS ) {
    assert.equal( dark[ key ], 'rgb(201, 201, 198)@1', `dark ${ key } (quiet text)` );
  }
  for ( const key of FG1_SPOTS ) {
    assert.equal( dark[ key ], 'rgb(240, 240, 240)@1', `dark ${ key } (fg1)` );
  }

  fs.rmSync( dir, { recursive: true, force: true } );
} );
