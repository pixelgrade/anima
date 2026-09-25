/**
 * Secondary text reads at 4.5:1 on its ground (#612, pixelgrade/nova-blocks#649).
 *
 * Dates, authors, counts, credits and the Conversations composer stand-in
 * were dimmed with `opacity` or a fixed translucent ink, which blends the
 * text into whatever ground sits behind it (2.79–4.28:1 on white). They now
 * take the context's text role, `--sm-current-fg1-color`, the role Style
 * Manager contrast-picks per variation (fg2 is only held to the large-text
 * minimum), or inherit their caption's ink. Their smaller size keeps the
 * hierarchy.
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

test( 'Latest Posts date and author take fg1, not opacity', () => {
  for ( const target of [ /wp-block-latest-posts__post-date(\[class\])?$/, /wp-block-latest-posts__post-author(\[class\])?$/ ] ) {
    assert.deepEqual( dimmed( commonCss, target ), [], `${ target } is not dimmed` );
    const colors = decls( commonCss, target, 'color' );
    assert.ok( colors.length && colors.every( decl => FG1.test( decl.value ) ), JSON.stringify( colors ) );
  }
} );

test( 'Latest Comments meta is not dimmed and its date takes fg1', () => {
  assert.deepEqual( dimmed( commonCss, /wp-block-latest-comments__comment-meta( > \*|>\*)?( |$)/ ), [] );
  assert.deepEqual( dimmed( commonCss, /wp-block-latest-comments__comment-date$/ ), [] );
  const colors = decls( commonCss, /wp-block-latest-comments__comment-date$/, 'color' );
  assert.ok( colors.length && colors.every( decl => FG1.test( decl.value ) ), JSON.stringify( colors ) );
} );

test( 'caption credits inherit the caption ink at full opacity', () => {
  const credits = decls( commonCss, /\.credits$/, 'opacity' );
  assert.deepEqual( credits.filter( decl => parseFloat( decl.value ) < 1 ), [], JSON.stringify( credits ) );
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

test( 'headless Chrome: secondary text paints fg1 at full opacity, in light and dark', { skip: ! CHROME && 'Chrome not installed' }, () => {
  const dir = fs.mkdtempSync( path.join( os.tmpdir(), 'anima-612-' ) );
  const file = path.join( dir, 'fixture.html' );
  const html = theme => `<!doctype html><html class="${ theme }"><head><meta charset="utf-8"><style>
    .ground { --sm-current-bg-color: #ffffff; --sm-current-fg1-color: #212220; --sm-current-fg2-color: #6b6b6b; --sm-current-accent-color: #d9480f; background: var(--sm-current-bg-color); color: var(--sm-current-fg1-color); }
    html.is-dark .ground { --sm-current-bg-color: #121212; --sm-current-fg1-color: #f0f0f0; --sm-current-fg2-color: #9a9a9a; }
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

  const light = run( '' );
  for ( const [ key, value ] of Object.entries( light ) ) {
    assert.equal( value, 'rgb(33, 34, 32)@1', `light ${ key }` );
  }
  const dark = run( 'is-dark' );
  for ( const [ key, value ] of Object.entries( dark ) ) {
    assert.equal( value, 'rgb(240, 240, 240)@1', `dark ${ key }` );
  }

  fs.rmSync( dir, { recursive: true, force: true } );
} );
