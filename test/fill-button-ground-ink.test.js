/**
 * Solid (primary) and outline (secondary) buttons that carry a Style Manager
 * variation keep their text readable once no fill is painted
 * (pixelgrade/nova-blocks#625).
 *
 * A primary button's fill scales away on hover and focus; a secondary button
 * paints no fill at rest. In both states the label sits on the ground, not on
 * the variation's surface. Nova card buttons carry a shifted variation one
 * grade from their card, so inking that exposed label with the variation's
 * background grade measured 1.29:1 (light card) and 2.03:1 (dark card). The
 * exposed label takes the ground's text role, captured on the Buttons wrapper
 * (as text-style buttons already do since #609).
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
const css = sass.compile( path.join( scssRoot, 'theme', 'components.scss' ), {
  loadPaths: [ scssRoot ],
  silenceDeprecations: [ 'import', 'global-builtin', 'slash-div' ],
} ).css;
const root = postcss.parse( css );

test( 'variation fill buttons ink their exposed (hover) state with the ground text role', () => {
  const hover = [];
  root.walkDecls( '--theme-button-hover-text-color', decl => {
    const selector = decl.parent.selector.replace( /\s+/g, ' ' );
    if ( /:not\(\.is-style-text\)/.test( selector ) && /sm-variation/.test( selector ) ) {
      hover.push( { selector, value: decl.value } );
    }
  } );

  assert.ok( hover.length >= 2, `light and dark rules found: ${ JSON.stringify( hover ) }` );
  for ( const decl of hover ) {
    assert.match( decl.value, /^var\(--theme-button-ground-text-color\b/, `${ decl.selector }: ${ decl.value }` );
  }
} );

// ---------------------------------------------------------------------------
// Real cascade: the compiled rules resolve in headless Chrome.
// ---------------------------------------------------------------------------

const CHROME = [
  process.env.CHROME_BIN,
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
].find( bin => bin && fs.existsSync( bin ) );

const luminance = rgb => {
  const [ r, g, b ] = rgb.match( /\d+/g ).map( Number ).map( v => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow( ( v + 0.055 ) / 1.055, 2.4 );
  } );
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const contrast = ( a, b ) => {
  const [ hi, lo ] = [ luminance( a ), luminance( b ) ].sort( ( x, y ) => y - x );
  return ( hi + 0.05 ) / ( lo + 0.05 );
};

test( 'headless Chrome: card fill buttons stay readable where no fill is painted, in light and dark', { skip: ! CHROME && 'Chrome not installed' }, () => {
  const dir = fs.mkdtempSync( path.join( os.tmpdir(), 'anima-625-' ) );
  const file = path.join( dir, 'fixture.html' );
  // Minimal Style Manager stand-ins measured on a fresh Anima LT site: a peach
  // card ground and the Nova card button's shifted variation one grade away.
  fs.writeFileSync( file, `<!doctype html><html class=""><head><meta charset="utf-8"><style>
    .ground { --sm-current-bg-color: #fddac1; --sm-current-fg1-color: #2d1e1c; --sm-current-accent-color: #6d442f; background: var(--sm-current-bg-color); }
    html.is-dark .ground { --sm-current-bg-color: #1f1c1c; --sm-current-fg1-color: #fffdfa; --sm-current-accent-color: #fddac1; }
    .sm-variation-1 { --sm-current-bg-color: #fffdfa; --sm-current-fg1-color: #1a1a1a; --sm-current-accent-color: #fffdfa; }
    html.is-dark .sm-variation-1 { --sm-current-bg-color: #2a2525; --sm-current-fg1-color: #fffdfa; --sm-current-accent-color: #332d2d; }
    * { transition: none !important; }
    ${ css }
  </style></head><body>
  <div class="ground" id="ground">
    <div class="wp-block-buttons"><div class="wp-block-button is-style-primary sm-variation-1 sm-light"><a id="primary" class="wp-block-button__link" href="#">Read More</a></div></div>
    <div class="wp-block-buttons"><div class="wp-block-button is-style-secondary sm-variation-1 sm-light"><a id="secondary" class="wp-block-button__link" href="#">Read More</a></div></div>
  </div>
  <pre id="out"></pre>
  <script>
    const link = id => getComputedStyle( document.getElementById( id ) );
    // Headless focus is unreliable across runs, so read the primary's hover
    // ink as resolved on the link: button-base maps :hover/:focus to it.
    // A secondary paints that same ink at rest, which is read as painted.
    document.getElementById( 'out' ).textContent = JSON.stringify( {
      ground: getComputedStyle( document.getElementById( 'ground' ) ).backgroundColor,
      primaryRest: link( 'primary' ).color,
      primaryHover: link( 'primary' ).getPropertyValue( '--theme-button-hover-text-color' ).trim(),
      secondaryRest: link( 'secondary' ).color,
    } );
  </script></body></html>` );

  const run = theme => {
    fs.writeFileSync( file, fs.readFileSync( file, 'utf8' ).replace( /<html class="[^"]*">/, `<html class="${ theme }">` ) );
    const dom = execFileSync( CHROME, [ '--headless=new', '--disable-gpu', '--no-sandbox', '--virtual-time-budget=2000', '--dump-dom', `file://${ file }` ],
      { encoding: 'utf8', stdio: [ 'ignore', 'pipe', 'ignore' ], timeout: 60000 } );
    return JSON.parse( dom.match( /<pre id="out">([^<]*)<\/pre>/ )[ 1 ].replace( /&quot;/g, '"' ) );
  };

  const light = run( '' );
  assert.equal( light.primaryRest, 'rgb(26, 26, 26)', 'light: the resting primary label keeps its variation text on its own fill' );
  assert.equal( light.primaryHover, '#2d1e1c', 'light: the hovered/focused primary label takes the ground fg1 once its fill scales away' );
  assert.equal( light.secondaryRest, 'rgb(45, 30, 28)', 'light: the unfilled secondary label takes the ground fg1' );
  assert.ok( contrast( light.secondaryRest, light.ground ) >= 4.5, `light secondary ${ light.secondaryRest } on ${ light.ground }` );

  const dark = run( 'is-dark' );
  assert.equal( dark.primaryHover, '#fffdfa', 'dark: the hovered/focused primary label takes the dark ground fg1' );
  assert.equal( dark.secondaryRest, 'rgb(255, 253, 250)', 'dark: the unfilled secondary label takes the dark ground fg1' );
  assert.ok( contrast( dark.secondaryRest, dark.ground ) >= 4.5, `dark secondary ${ dark.secondaryRest } on ${ dark.ground }` );

  fs.rmSync( dir, { recursive: true, force: true } );
} );
