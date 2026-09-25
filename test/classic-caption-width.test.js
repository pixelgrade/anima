/**
 * Classic captions keep to their container (#611).
 *
 * `[caption width="N"]` renders a figure with an inline `width: Npx`. Anima
 * styled `.wp-caption` nowhere, so an imported 985px caption ran past the
 * column and the viewport on tablets and phones.
 *
 * Two layers, both needed:
 * - the stylesheet caps `.wp-caption` at its container (`max-width: 100%`),
 *   which is enough in normal flow (floats, groups, the classic editor);
 * - inside Nova's layout grid a fixed width is the figure's min-content
 *   contribution and widens the `1fr` tracks whatever its max-width, so
 *   inc/classic-captions.php rewrites the inline width to `min(100%, Npx)`
 *   (see test/classic-caption-width.php for that markup contract).
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

const captionRules = root => {
  const found = [];
  root.walkRules( rule => {
    if ( /(^|[\s,>])\.wp-caption(?![\w-])/.test( rule.selector ) && ! rule.selector.includes( ' img' ) ) {
      found.push( rule );
    }
  } );
  return found;
};

for ( const [ entry, selector ] of [ [ 'style.scss', '.wp-caption' ], [ 'block-editor.scss', '.editor-styles-wrapper .wp-caption' ] ] ) {
  test( `${ entry }: classic captions are capped at their container`, () => {
    const rules = captionRules( compile( entry ) );
    assert.equal( rules.length, 1, 'exactly one .wp-caption rule' );
    assert.equal( rules[ 0 ].selector.replace( /\s+/g, ' ' ), selector );

    const decls = Object.fromEntries( rules[ 0 ].nodes.filter( n => n.type === 'decl' ).map( d => [ d.prop, d.value ] ) );
    // Not !important: the inline width stays the authored size wherever it fits.
    assert.deepEqual( decls, { 'max-width': '100%' } );
    assert.ok( rules[ 0 ].nodes.every( n => n.type !== 'decl' || ! n.important ) );
  } );
}

test( 'classic caption images keep their ratio while they shrink', () => {
  // The global media rule already covers images with width/height attributes.
  const root = compile( 'style.scss' );
  let found = false;
  root.walkRules( rule => {
    if ( rule.selector.split( ',' ).map( s => s.trim() ).includes( 'img' ) ) {
      const decls = Object.fromEntries( rule.nodes.filter( n => n.type === 'decl' ).map( d => [ d.prop, d.value ] ) );
      if ( decls[ 'max-width' ] === '100%' && decls.height === 'auto' ) {
        found = true;
      }
    }
  } );
  assert.ok( found, 'img { max-width: 100%; height: auto }' );
} );

// ---------------------------------------------------------------------------
// Real layout in headless Chrome.
// ---------------------------------------------------------------------------

const CHROME = [
  process.env.CHROME_BIN,
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
].find( bin => bin && fs.existsSync( bin ) );

// 1200x800 SVG image: an image with its own intrinsic size, like an upload.
const IMG = 'data:image/svg+xml,' + encodeURIComponent( '<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800"><rect width="1200" height="800" fill="teal"/></svg>' );

const caption = ( id, width, align, style = `width: ${ width }px` ) => `
  <figure id="${ id }" style="${ style }" class="wp-caption ${ align }">
    <img src="${ IMG }" width="${ width }" height="${ Math.round( width * 2 / 3 ) }" alt="">
    <figcaption class="wp-caption-text">A classic caption line that is long enough to wrap onto more lines</figcaption>
  </figure>`;

// `fluid` mirrors inc/classic-captions.php: inline `width: min(100%, Npx)`.
const render = ( css, width, fluid ) => {
  const style = w => ( fluid ? `width: min(100%, ${ w }px)` : `width: ${ w }px` );
  const dir = fs.mkdtempSync( path.join( os.tmpdir(), 'anima-611-' ) );
  const file = path.join( dir, 'fixture.html' );
  fs.writeFileSync( file, `<!doctype html><html><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<style>
  html, body { margin: 0; font: 16px/1.5 sans-serif; }
  *, *::before, *::after { box-sizing: border-box; }
  img { max-width: 100%; height: auto; }
  figure { margin: 0 0 1em; }
  .alignleft { float: left; margin-right: 1em; }
  .alignright { float: right; margin-left: 1em; }
  .aligncenter { margin-inline: auto; }
  /* Normal flow: a column with a side gutter. */
  .flow { margin: 0 16px; }
  /* Nova-like layout grid: flexible side tracks are minmax(auto, 1fr). */
  .grid { clear: both; display: grid; grid-template-columns: [fs] 16px [ws] 1fr [cs] minmax(0, 640px) [ce] 1fr [we] 16px [fe]; }
  .grid > * { grid-column: cs / ce; }
  .grid > .aligncenter { grid-column: ws / we; }
  ${ css }
</style></head><body>
<div class="flow" id="flow">
  ${ caption( 'f-center', 985, 'aligncenter', style( 985 ) ) }
  ${ caption( 'f-left', 560, 'alignleft', style( 560 ) ) }<p>Text beside a floated caption.</p>
  ${ caption( 'f-right', 420, 'alignright', style( 420 ) ) }<p>Text beside a floated caption.</p>
  ${ caption( 'f-small', 190, 'alignleft', style( 190 ) ) }<p>Text beside a small caption.</p>
</div>
<div class="grid" id="grid">
  ${ caption( 'g-center', 985, 'aligncenter', style( 985 ) ) }
  ${ caption( 'g-none', 800, 'alignnone', style( 800 ) ) }
  ${ caption( 'g-small', 190, 'alignnone', style( 190 ) ) }
</div>
<pre id="out"></pre>
<script>
  const box = id => {
    const f = document.getElementById( id );
    const r = f.getBoundingClientRect();
    const img = f.querySelector( 'img' ).getBoundingClientRect();
    const cap = f.querySelector( 'figcaption' ).getBoundingClientRect();
    const parent = f.parentElement.getBoundingClientRect();
    return { width: Math.round( r.width ), right: Math.round( r.right ), parentRight: Math.round( parent.right ),
      img: Math.round( img.width ), ratio: +( img.width / img.height ).toFixed( 2 ), caption: Math.round( cap.width ),
      float: getComputedStyle( f ).float };
  };
  const ids = [ 'f-center', 'f-left', 'f-right', 'f-small', 'g-center', 'g-none', 'g-small' ];
  document.getElementById( 'out' ).textContent = JSON.stringify( {
    scrollWidth: document.documentElement.scrollWidth,
    innerWidth: window.innerWidth,
    ...Object.fromEntries( ids.map( id => [ id, box( id ) ] ) ),
  } );
</script></body></html>` );

  const dom = execFileSync( CHROME, [
    '--headless=new', '--disable-gpu', '--no-sandbox', '--hide-scrollbars',
    `--window-size=${ width },900`, '--virtual-time-budget=2000', '--dump-dom', `file://${ file }`,
  ], { encoding: 'utf8', stdio: [ 'ignore', 'pipe', 'ignore' ], timeout: 60000 } );

  fs.rmSync( dir, { recursive: true, force: true } );
  const json = dom.match( /<pre id="out">([^<]*)<\/pre>/ )[ 1 ].replace( /&quot;/g, '"' ).replace( /&amp;/g, '&' );
  return JSON.parse( json );
};

const FLOW = [ 'f-center', 'f-left', 'f-right', 'f-small' ];
const GRID = [ 'g-center', 'g-none', 'g-small' ];

test( 'headless Chrome: captions overflow without the fix and fit with it', { skip: ! CHROME && 'Chrome not installed' }, () => {
  const rule = captionRules( compile( 'style.scss' ) ).map( r => r.toString() ).join( '\n' );

  for ( const width of [ 320, 390, 768 ] ) {
    const before = render( '', width, false );
    const cssOnly = render( rule, width, false );
    const after = render( rule, width, true );
    const at = `at ${ width }px`;

    // Before: the 985px captions run past their column and widen the page.
    assert.ok( before.scrollWidth > before.innerWidth, `${ at } unfixed page ${ before.scrollWidth } vs ${ before.innerWidth }` );
    assert.ok( before[ 'f-center' ].right > before[ 'f-center' ].parentRight, `${ at } unfixed flow caption fits` );

    // The stylesheet cap fixes normal flow, but not the layout grid.
    for ( const id of FLOW ) {
      assert.ok( cssOnly[ id ].right <= cssOnly[ id ].parentRight + 1, `${ at } ${ id } with the CSS cap: ${ JSON.stringify( cssOnly[ id ] ) }` );
    }
    assert.ok( cssOnly[ 'g-center' ].right > cssOnly.innerWidth, `${ at } the CSS cap alone leaves the grid caption at ${ cssOnly[ 'g-center' ].right }` );
    assert.ok( cssOnly.scrollWidth > cssOnly.innerWidth, `${ at } the CSS cap alone leaves the page at ${ cssOnly.scrollWidth }` );

    // After: nothing is wider than the viewport or its container.
    assert.ok( after.scrollWidth <= after.innerWidth, `${ at } fixed page ${ after.scrollWidth } vs ${ after.innerWidth }` );
    for ( const id of [ ...FLOW, ...GRID ] ) {
      const box = after[ id ];
      assert.ok( box.right <= box.parentRight + 1, `${ at } ${ id } fits: ${ JSON.stringify( box ) }` );
      // The image scales inside the figure with its ratio, and the caption text wraps at the figure's width.
      assert.equal( box.img, box.width, `${ at } ${ id } image fills the figure` );
      assert.equal( box.ratio, 1.5, `${ at } ${ id } image ratio` );
      assert.ok( box.caption <= box.width, `${ at } ${ id } caption text within the figure` );
    }

    // Captions narrower than their column keep their authored width, and floats still float.
    assert.equal( after[ 'f-small' ].width, 190, `${ at } small flow caption` );
    assert.equal( after[ 'g-small' ].width, 190, `${ at } small grid caption` );
    assert.equal( after[ 'f-left' ].float, 'left' );
    assert.equal( after[ 'f-right' ].float, 'right' );
  }
} );

test( 'headless Chrome at 1440px: wide screens keep the authored widths', { skip: ! CHROME && 'Chrome not installed' }, () => {
  const rule = captionRules( compile( 'style.scss' ) ).map( r => r.toString() ).join( '\n' );
  const before = render( '', 1440, false );
  const after = render( rule, 1440, true );

  // Every flow caption fits the 1408px column, so nothing changes there.
  for ( const id of FLOW ) {
    assert.deepEqual( after[ id ], before[ id ], id );
  }
  assert.equal( after[ 'f-center' ].width, 985, `f-center: ${ JSON.stringify( after[ 'f-center' ] ) }` );
  assert.equal( after[ 'f-left' ].width, 560, `f-left: ${ JSON.stringify( after[ 'f-left' ] ) }` );
  assert.equal( after[ 'f-right' ].width, 420, `f-right: ${ JSON.stringify( after[ 'f-right' ] ) }` );
  // In the grid, the 985px centred caption fits its wide area; the 800px one is capped at the 640px column.
  assert.equal( after[ 'g-center' ].width, 985, JSON.stringify( after ) );
  assert.equal( after[ 'g-none' ].width, 640, `g-none: ${ JSON.stringify( after[ 'g-none' ] ) }` );
  assert.equal( after[ 'g-small' ].width, 190, `g-small: ${ JSON.stringify( after[ 'g-small' ] ) }` );
  assert.ok( after.scrollWidth <= after.innerWidth );
} );
