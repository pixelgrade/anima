/**
 * Original-ratio overlay rules stay on the collection's own cards (#629).
 *
 * In an "Original" aspect-ratio collection the image dictates a stacked card's
 * height and the content is laid over it (`position: absolute`, `min-height:
 * 0`, inner container spread top to bottom). Those rules were written with
 * descendant selectors, so they also reached a card NESTED inside a grid card:
 * Nova's post-format blueprints (e.g. the `card-quote` part in stacked mode)
 * render a whole Supernova inside `.nb-collection__layout-item`. The nested
 * stacked card then collapsed to its image height and clipped the quote.
 *
 * The overlay rules now match only a Supernova item that is a direct child of
 * a layout item, the collection's own card, at unchanged specificity.
 * The natural-height media rules skip a nested STACKED card, so Nova's media
 * covers it as a background (follow-up, with nova-blocks#679); a nested card
 * that is not stacked keeps the collection's natural image ratio.
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
  silenceDeprecations: [ 'import', 'global-builtin', 'slash-div', 'if-function' ],
} ).css;

const norm = selector => selector.replace( /\s+/g, ' ' ).trim();
const OWN_CARD = ':where(.nb-collection__layout-item) > .nb-supernova-item';
const NATURAL_MEDIA = ':where(:not(.nb-collection__layout-item > .nb-supernova > .nb-supernova-item--layout-stacked *))';
const withoutExclusion = selector => selector.split( NATURAL_MEDIA ).join( '' );

test( 'utility.scss: the Original-ratio natural-media rules skip a nested stacked card', () => {
  const root = postcss.parse( compileCss( 'utility.scss' ) );
  const media = /(__media-aspect-ratio|__media-wrapper|doppler__wrapper|blob-mix__mask|blob-mix__media|__media)\b/;
  let count = 0;

  root.walkRules( rule => {
    for ( const selector of rule.selectors.map( norm ) ) {
      if ( ! selector.startsWith( 'body:not(.editor-styles-wrapper) .nb-supernova--aspect-ratio-original ' ) || /layout-stacked/.test( withoutExclusion( selector ) ) || ! media.test( selector ) ) {
        continue;
      }
      count++;
      assert.ok( selector.includes( NATURAL_MEDIA ), `"${ selector }" must skip a nested stacked card (${ NATURAL_MEDIA })` );
    }
  } );

  assert.equal( count, 7, 'the seven natural-media rules (1-5) are all checked' );
} );

test( 'utility.scss: the Original-ratio overlay rules only match the collection\'s own stacked cards', () => {
  const root = postcss.parse( compileCss( 'utility.scss' ) );
  const overlay = [];

  root.walkRules( rule => {
    const selectors = rule.selectors.map( norm );
    if ( ! selectors.some( s => s.startsWith( 'body:not(.editor-styles-wrapper) .nb-supernova--aspect-ratio-original' ) && /layout-stacked/.test( withoutExclusion( s ) ) ) ) {
      return;
    }
    overlay.push( { selectors, decls: Object.fromEntries( rule.nodes.filter( n => n.type === 'decl' ).map( d => [ d.prop, d.value ] ) ) } );
  } );

  const find = prop => overlay.filter( r => prop in r.decls );
  assert.ok( find( 'z-index' ).some( r => r.decls.position === 'absolute' ), 'the content overlay rule exists' );
  assert.ok( find( 'min-height' ).some( r => r.decls[ 'min-height' ] === '0' ), 'the min-height reset exists' );
  assert.ok( find( 'justify-content' ).length, 'the inner-container spread rule exists' );

  for ( const rule of overlay ) {
    for ( const selector of rule.selectors ) {
      assert.ok( selector.includes( OWN_CARD ), `"${ selector }" must be scoped to the collection's own card (${ OWN_CARD })` );
    }
  }
} );

// ---------------------------------------------------------------------------
// Real cascade: compiled utility.css in headless Chrome, on a minimal
// Original-ratio masonry fixture with Nova's stacked-frame rules.
// ---------------------------------------------------------------------------

const CHROME = [
  process.env.CHROME_BIN,
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
].find( bin => bin && fs.existsSync( bin ) );

// The Nova Blocks rules that shape a stacked card and its media chain
// (supernova/style.css, supernova-item/style.css, doppler), plus a plain
// three-column grid standing in for the masonry layout, and a stacked
// min-height like the one Nova derives from minHeightFallback.
const NOVA_STACKED = `
body { margin: 0; font: 16px/1.5 sans-serif; }
.nb-collection__layout { display: grid; grid-template-columns: repeat(var(--cols), 1fr); gap: 20px; }
.nb-supernova-item--layout-stacked { display: block; min-height: 50px; }
.nb-supernova-item--layout-stacked .nb-supernova-item__frame { display: grid; position: relative; width: 100%; }
.nb-supernova-item--layout-stacked .nb-supernova-item__frame > :is(.nb-supernova-item__content, .nb-supernova-item__media-wrapper) { grid-area: 1 / 1 / span 1 / span 1; }
.nb-collection__layout:not(.nb-collection__layout--variable-width) .nb-supernova-item--layout-stacked .nb-supernova-item__frame .nb-supernova-item__media-wrapper { height: 100%; left: 0; position: absolute; top: 0; width: 100%; }
.nb-supernova-item__media-wrapper { display: block; }
.nb-supernova-item__media-aspect-ratio { min-height: 100%; position: relative; }
.nb-supernova-item__media-aspect-ratio::before { content: ""; display: block; padding-top: var(--nb-card-media-padding-top, 100%); }
.nb-supernova-item--layout-stacked .nb-supernova-item__media-aspect-ratio::before { content: none; }
.novablocks-doppler__wrapper { position: absolute; top: 0; left: 0; width: 100%; height: 100%; }
.nb-supernova-item__media-doppler { height: 100%; width: 100%; }
.nb-supernova-item__media { display: block; }
.nb-supernova-item__media[class] { height: 100%; width: 100%; object-fit: var(--nb-card-media-object-fit, cover); }
.nb-supernova-item__inner-container { padding: 20px; }
blockquote { margin: 0; }
`;

// A 16:9 image, like the Hive quote post's featured image.
const IMG = 'data:image/svg+xml,' + encodeURIComponent( '<svg xmlns="http://www.w3.org/2000/svg" width="1280" height="720"><rect width="1280" height="720" fill="#456"/></svg>' );

const media = `<a class="nb-supernova-item__media-wrapper" href="#"><div class="nb-supernova-item__media-aspect-ratio"><div class="novablocks-doppler__wrapper">
  <div class="nb-supernova-item__media-doppler"><img class="nb-supernova-item__media" width="1280" height="720" src="${ IMG }" alt=""></div></div></div></a>`;

// Nova sets the fit per card: Original grids `contain`, stacked cards the
// Image Resizing fit (`cover`, nova-blocks#679).
const card = ( id, content, layout = 'stacked' ) => `<div id="${ id }" class="nb-supernova-item nb-supernova-item--layout-${ layout } nb-supernova-item--aspect-ratio-original"
  style="--nb-card-media-object-fit: ${ 'stacked' === layout ? 'cover' : 'contain' }">
  <div class="nb-supernova-item__frame">${ media }
    <div class="nb-supernova-item__content"><div class="nb-supernova-item__inner-container">${ content }</div></div>
  </div></div>`;

const QUOTE = `<blockquote id="quote"><p>${ 'The best way to get a good idea is to get a lot of ideas, and to throw the bad ones away. '.repeat( 5 ) }</p><cite>Linus Pauling</cite></blockquote>`;

const FIXTURE = `
<div class="nb-supernova nb-supernova--card-layout-stacked nb-supernova--layout-masonry nb-supernova--3-columns nb-supernova--aspect-ratio-original">
  <div class="nb-collection"><div class="nb-collection__layout">
    <div class="nb-collection__layout-item">${ card( 'own', '<h3 id="own-title">An ordinary card</h3><p>Date · Category</p>' ) }</div>
    <div class="nb-collection__layout-item">
      <div class="nb-supernova nb-post-format-card-blueprint nb-post-format-card-blueprint--quote nb-supernova--card-layout-stacked nb-supernova--1-columns">
        ${ card( 'nested', QUOTE ) }
      </div>
    </div>
    <div class="nb-collection__layout-item">${ card( 'own-2', '<h3>Another card</h3>' ) }</div>
    <div class="nb-collection__layout-item">
      <div class="nb-supernova nb-post-format-card-blueprint nb-supernova--card-layout-vertical nb-supernova--1-columns">
        ${ card( 'nested-vertical', '<h3>A vertical format card</h3>', 'vertical' ) }
      </div>
    </div>
  </div></div>
</div>`;

// Headless Chrome will not size its window below 500px, so the fixture runs
// in an iframe of the exact width (see single-post-type-roles.test.js).
const render = ( css, width ) => {
  const dir = fs.mkdtempSync( path.join( os.tmpdir(), 'anima-629-' ) );
  const file = path.join( dir, 'fixture.html' );
  const inner = `<!doctype html><html><head><meta charset="utf-8">
<style>:root{--cols:${ width < 700 ? 1 : 3 }}</style><style>${ css }</style></head><body>${ FIXTURE }
<script>
  const rect = el => { const r = el.getBoundingClientRect(); return { top: r.top, bottom: r.bottom, left: r.left, right: r.right, height: r.height, width: r.width }; };
  const coverage = ( img, box ) => { const w = Math.max( 0, Math.min( img.right, box.right ) - Math.max( img.left, box.left ) ), h = Math.max( 0, Math.min( img.bottom, box.bottom ) - Math.max( img.top, box.top ) ); return w * h / ( box.width * box.height ); };
  const measure = id => { const el = document.getElementById( id ), img = el.querySelector( 'img' );
    const content = el.querySelector( '.nb-supernova-item__content' ), inner = content.firstElementChild;
    return { card: rect( el ), img: rect( img ), cover: coverage( rect( img ), rect( el ) ), fit: getComputedStyle( img ).objectFit,
      naturalRatioHeight: rect( img ).width * 720 / 1280, content: rect( content ), contentHeight: inner.scrollHeight,
      contentPosition: getComputedStyle( content ).position, minHeight: getComputedStyle( el ).minHeight }; };
  const out = { viewport: innerWidth, own: measure( 'own' ), own2: measure( 'own-2' ), nested: measure( 'nested' ), nestedVertical: measure( 'nested-vertical' ), quote: rect( document.getElementById( 'quote' ) ) };
  parent.document.getElementById( 'out' ).textContent = JSON.stringify( out );
</script></body></html>`;
  const srcdoc = inner.replace( /&/g, '&amp;' ).replace( /"/g, '&quot;' );
  fs.writeFileSync( file, `<!doctype html><html><head><meta charset="utf-8"><style>body{margin:0}iframe{border:0;display:block}</style></head>
<body><pre id="out"></pre><iframe width="${ width }" height="1600" srcdoc="${ srcdoc }"></iframe></body></html>` );

  const dom = execFileSync( CHROME, [
    '--headless=new', '--disable-gpu', '--no-sandbox', '--hide-scrollbars',
    `--window-size=${ Math.max( width, 500 ) + 40 },1700`, '--virtual-time-budget=2000', '--dump-dom', `file://${ file }`,
  ], { encoding: 'utf8', stdio: [ 'ignore', 'pipe', 'ignore' ], timeout: 60000 } );

  fs.rmSync( dir, { recursive: true, force: true } );
  const out = JSON.parse( dom.match( /<pre id="out">([^<]*)<\/pre>/ )[ 1 ].replace( /&quot;/g, '"' ) );
  assert.equal( out.viewport, width, 'the fixture renders at the requested viewport width' );
  return out;
};

for ( const width of [ 1440, 390 ] ) {
  test( `headless Chrome at ${ width }px: a nested stacked card grows with its quote; the grid's own cards still take the image height`, { skip: ! CHROME && 'Chrome not installed' }, () => {
    const out = render( NOVA_STACKED + compileCss( 'utility.scss' ), width );

    // The nested blueprint card holds its whole quote.
    const { nested, quote } = out;
    assert.ok( nested.contentHeight > nested.naturalRatioHeight, 'fixture sanity: the quote is taller than the image' );
    assert.ok( nested.card.height >= nested.contentHeight - 0.5, `nested card ${ nested.card.height }px must fit its ${ nested.contentHeight }px content` );
    assert.ok( quote.bottom <= nested.card.bottom + 0.5, `quote bottom ${ quote.bottom } overflows the nested card (bottom ${ nested.card.bottom })` );
    assert.notEqual( nested.contentPosition, 'absolute', 'the nested card content stays in flow' );

    // ...and its media is the card background: the image covers the whole card.
    assert.ok( nested.cover > 0.999, `nested card image covers ${ ( nested.cover * 100 ).toFixed( 1 ) }% of the card` );
    assert.ok( Math.abs( nested.img.height - nested.card.height ) <= 1, `nested image ${ nested.img.height }px = card ${ nested.card.height }px` );
    assert.equal( nested.fit, 'cover' );

    // A nested card that is not stacked keeps the Original natural-ratio image.
    const nv = out.nestedVertical;
    assert.ok( Math.abs( nv.img.height - nv.naturalRatioHeight ) <= 1, `nested vertical image ${ nv.img.height }px keeps its natural ${ nv.naturalRatioHeight }px` );

    // The collection's own cards keep the Original-ratio overlay: the image
    // dictates the card height and the content covers it.
    for ( const own of [ out.own, out.own2 ] ) {
      assert.ok( Math.abs( own.card.height - own.img.height ) <= 1, `own card ${ own.card.height }px = image ${ own.img.height }px` );
      assert.ok( Math.abs( own.img.height - own.naturalRatioHeight ) <= 1, `own card image ${ own.img.height }px keeps its natural ${ own.naturalRatioHeight }px` );
      assert.equal( own.fit, 'contain', 'own cards keep Anima\'s natural-dimension fit' );
      assert.equal( own.contentPosition, 'absolute' );
      assert.equal( own.minHeight, '0px' );
      assert.ok( Math.abs( own.content.top - own.card.top ) <= 1 && Math.abs( own.content.bottom - own.card.bottom ) <= 1, 'content covers the whole card' );
    }
  } );
}
