/**
 * Border Site Frame on small screens (#608).
 *
 * The Border style declares an 8px frame below 1024px, but the `below(lap)`
 * block meant for the Editorial rail hid the frame shell for every style and
 * zeroed only the top/left `#page` padding. Border pages kept an 8px right
 * padding: full-width bands stopped 8px short of the right edge, flush with
 * the left one, and no frame was drawn.
 *
 * Border must keep a symmetric frame at every width (8px below 1024px, 18px
 * from 1024px), keep viewport-anchored mobile chrome inside it, and never
 * widen the page. Editorial keeps hiding its rail below 1024px.
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

// Only the Site Frame rules: the fixture stays independent of the rest of the
// theme stylesheet, but keeps every media query the frame rules live in.
const siteFrameCss = () => {
  const root = postcss.parse( sass.compile( path.join( scssRoot, 'style.scss' ), {
    loadPaths: [ scssRoot ],
    silenceDeprecations: [ 'import', 'global-builtin', 'slash-div' ],
  } ).css );

  root.walkRules( rule => {
    if ( ! /site-frame/.test( rule.selector ) ) {
      rule.remove();
    }
  } );
  root.walkAtRules( atRule => {
    if ( atRule.nodes && ! atRule.nodes.length ) {
      atRule.remove();
    }
  } );
  root.walkComments( comment => comment.remove() );

  return root.toString();
};

const CHROME = [
  process.env.CHROME_BIN,
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
].find( bin => bin && fs.existsSync( bin ) );

const WIDTHS = [ 390, 768, 1023, 1024, 1280, 1440 ];
const STYLES = {
  border: 'has-site-frame has-site-frame-frame has-site-frame-border',
  editorial: 'has-site-frame has-site-frame-frame',
};

// Stand-ins for the Nova mobile header (fixed when sticky) and the menu
// toggle: both resolve against the viewport, not #page.
const frameDoc = ( css, bodyClass ) => `<!doctype html><html><head><meta charset="utf-8">
<style>
  html, body { margin: 0; }
  body { background: #fff; }
  #page { box-sizing: border-box; }
  .band { height: 40px; background: #000; }
  .nb-header--mobile { position: fixed; top: 100px; left: 0; width: 100%; height: 20px; }
  .c-menu-toggle { position: fixed; top: 0; left: 0; width: 48px; height: 48px; }
  ${ css }
</style></head><body class="${ bodyClass }">
<div class="c-site-frame">
  <span class="c-site-frame__top"></span><span class="c-site-frame__left"></span>
  <span class="c-site-frame__right"></span><span class="c-site-frame__bottom"></span>
</div>
<div id="page">
  <header class="nb-header--mobile nb-header--sticky"></header>
  <button class="c-menu-toggle"></button>
  <div class="band"></div>
</div>
</body></html>`;

const measure = css => {
  const dir = fs.mkdtempSync( path.join( os.tmpdir(), 'anima-608-' ) );
  const frames = [];
  for ( const [ style, bodyClass ] of Object.entries( STYLES ) ) {
    const doc = path.join( dir, `${ style }.html` );
    fs.writeFileSync( doc, frameDoc( css, bodyClass ) );
    for ( const width of WIDTHS ) {
      frames.push( `<iframe data-style="${ style }" data-width="${ width }" src="${ style }.html" style="width:${ width }px;height:300px;border:0;display:block"></iframe>` );
    }
  }
  const file = path.join( dir, 'index.html' );
  fs.writeFileSync( file, `<!doctype html><html><body style="margin:0">
${ frames.join( '\n' ) }
<pre id="out"></pre>
<script>
  window.addEventListener( 'load', () => {
    const px = v => Math.round( parseFloat( v ) || 0 );
    const results = [ ...document.querySelectorAll( 'iframe' ) ].map( iframe => {
      const d = iframe.contentDocument;
      const w = iframe.contentWindow;
      const page = w.getComputedStyle( d.getElementById( 'page' ) );
      const band = d.querySelector( '.band' ).getBoundingClientRect();
      const header = d.querySelector( '.nb-header--mobile' ).getBoundingClientRect();
      const right = d.querySelector( '.c-site-frame__right' ).getBoundingClientRect();
      return {
        style: iframe.dataset.style,
        width: Number( iframe.dataset.width ),
        viewport: w.innerWidth,
        scrollWidth: d.documentElement.scrollWidth,
        padding: [ page.paddingTop, page.paddingRight, page.paddingBottom, page.paddingLeft ].map( px ),
        frameDisplay: w.getComputedStyle( d.querySelector( '.c-site-frame' ) ).display,
        rightBar: Math.round( right.width ),
        band: [ Math.round( band.left ), Math.round( band.right ) ],
        header: [ Math.round( header.left ), Math.round( header.right ) ],
        headerTop: Math.round( header.top ),
        toggleLeft: Math.round( d.querySelector( '.c-menu-toggle' ).getBoundingClientRect().left ),
      };
    } );
    document.getElementById( 'out' ).textContent = JSON.stringify( results );
  } );
</script></body></html>` );

  const dom = execFileSync( CHROME, [
    '--headless=new', '--disable-gpu', '--no-sandbox', '--hide-scrollbars', '--allow-file-access-from-files',
    '--window-size=1600,1200', '--virtual-time-budget=3000', '--dump-dom', `file://${ file }`,
  ], { encoding: 'utf8', stdio: [ 'ignore', 'pipe', 'ignore' ], timeout: 60000 } );

  fs.rmSync( dir, { recursive: true, force: true } );
  const json = dom.match( /<pre id="out">([^<]*)<\/pre>/ )[ 1 ].replace( /&quot;/g, '"' ).replace( /&amp;/g, '&' );
  return JSON.parse( json );
};

test( 'headless Chrome: the Border frame stays symmetric at every width; Editorial still hides below 1024px', { skip: ! CHROME && 'Chrome not installed' }, () => {
  const results = measure( siteFrameCss() );
  assert.equal( results.length, WIDTHS.length * Object.keys( STYLES ).length );

  for ( const r of results ) {
    const at = `${ r.style } @ ${ r.width }px: ${ JSON.stringify( r ) }`;
    assert.equal( r.viewport, r.width, `iframe viewport ${ at }` );
    assert.ok( r.scrollWidth <= r.viewport, `page never wider than the viewport ${ at }` );

    if ( r.style === 'border' ) {
      const size = r.width < 1024 ? 8 : 18;
      assert.deepEqual( r.padding, [ size, size, 0, size ], `#page padding follows the frame ${ at }` );
      assert.equal( r.frameDisplay, 'block', `frame shown ${ at }` );
      assert.equal( r.rightBar, size, `right bar size ${ at }` );
      assert.deepEqual( r.band, [ size, r.width - size ], `full-width band meets the frame on both sides ${ at }` );
      if ( r.width < 1024 ) {
        assert.deepEqual( r.header, [ size, r.width - size ], `mobile header inside the frame ${ at }` );
        assert.equal( r.toggleLeft, size, `menu toggle inside the frame ${ at }` );
        assert.equal( r.headerTop, size, `sticky mobile header sits under the top bar ${ at }` );
      }
    } else if ( r.width < 1024 ) {
      assert.deepEqual( r.padding, [ 0, 0, 0, 0 ], `Editorial resets #page padding ${ at }` );
      assert.equal( r.frameDisplay, 'none', `Editorial frame hidden ${ at }` );
      assert.deepEqual( r.band, [ 0, r.width ], `Editorial band is full-bleed ${ at }` );
      assert.deepEqual( r.header, [ 0, r.width ], `Editorial mobile header untouched ${ at }` );
      assert.equal( r.toggleLeft, 0, `Editorial menu toggle untouched ${ at }` );
      assert.equal( r.headerTop, 100, `Editorial sticky header untouched ${ at }` );
    } else {
      assert.deepEqual( r.padding, [ 12, 0, 0, 48 ], `Editorial desktop padding unchanged ${ at }` );
      assert.equal( r.frameDisplay, 'block', `Editorial frame shown ${ at }` );
    }
  }
} );
