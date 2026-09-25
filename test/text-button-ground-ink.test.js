/**
 * Text-style buttons read against the ground they sit on (#609).
 *
 * A text-style button paints no fill. When it carries Style Manager variation
 * classes (Nova Blocks card buttons always do), its `--sm-current-*` describe
 * the button's own variation, a fill that is never painted. Its ink must be
 * the text role of the surrounding ground, captured on the Buttons wrapper,
 * not the variation's background grade (1.09:1 / 3.16:1 measured).
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

const declarations = prop => {
  const found = [];
  root.walkDecls( prop, decl => found.push( { selector: decl.parent.selector.replace( /\s+/g, ' ' ), value: decl.value } ) );
  return found;
};

test( 'the Buttons wrapper captures the ground text role before a button re-scopes the palette', () => {
  const ground = declarations( '--theme-button-ground-text-color' ).filter( decl => /\.wp-block-buttons/.test( decl.selector ) );
  assert.ok( ground.length, 'a .wp-block-buttons rule sets --theme-button-ground-text-color' );
  assert.ok( ground.every( decl => decl.value === 'var(--sm-current-fg1-color)' ), JSON.stringify( ground ) );
} );

test( 'text-style buttons with a variation take the ground ink, not the variation background', () => {
  const textVariation = [ '--theme-button-text-color', '--theme-button-hover-text-color' ]
    .flatMap( declarations )
    .filter( decl => /\.is-style-text/.test( decl.selector.replace( /:not\(\.is-style-text\)/g, '' ) ) && /sm-variation/.test( decl.selector ) );

  assert.ok( textVariation.length >= 2, JSON.stringify( textVariation ) );
  for ( const decl of textVariation ) {
    assert.match( decl.value, /^var\(--theme-button-ground-text-color\b/, `${ decl.selector }: ${ decl.value }` );
    // The variation's own role survives only as the no-wrapper fallback.
    assert.doesNotMatch( decl.value.replace( /^var\(--theme-button-ground-text-color,\s*/, '' ), /--theme-button-ground-text-color/, decl.value );
  }
} );

test( 'solid and outline buttons keep their variation mapping', () => {
  const solid = declarations( '--theme-button-background-color' ).filter( decl => /:not\(\.is-style-text\)/.test( decl.selector ) );
  assert.ok( solid.some( decl => decl.value === 'var(--sm-current-bg-color)' ), JSON.stringify( solid ) );
} );

// ---------------------------------------------------------------------------
// Real cascade: the compiled rules resolve to the ground ink in headless Chrome.
// ---------------------------------------------------------------------------

const CHROME = [
  process.env.CHROME_BIN,
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
].find( bin => bin && fs.existsSync( bin ) );

test( 'headless Chrome: a card text button inks with its ground fg1, in light and dark', { skip: ! CHROME && 'Chrome not installed' }, () => {
  const dir = fs.mkdtempSync( path.join( os.tmpdir(), 'anima-609-' ) );
  const file = path.join( dir, 'fixture.html' );
  // Minimal Style Manager stand-ins: the card ground (grade 1) and the button's
  // shifted variation (grade 5) each re-scope the --sm-current-* roles.
  fs.writeFileSync( file, `<!doctype html><html class=""><head><meta charset="utf-8"><style>
    .ground { --sm-current-bg-color: #ffffff; --sm-current-fg1-color: #212220; --sm-current-accent-color: #d9480f; background: var(--sm-current-bg-color); }
    html.is-dark .ground { --sm-current-bg-color: #121212; --sm-current-fg1-color: #f0f0f0; --sm-current-accent-color: #ff8a4c; }
    .sm-variation-5 { --sm-current-bg-color: #909190; --sm-current-fg1-color: #ffffff; --sm-current-accent-color: #ffffff; }
    ${ css }
  </style></head><body>
  <div class="ground">
    <div class="wp-block-buttons"><div class="wp-block-button is-style-text sm-variation-5 sm-color-signal-1"><a id="text" class="wp-block-button__link" href="#">Read More</a></div></div>
    <div class="wp-block-buttons"><div class="wp-block-button is-style-text"><a id="plain" class="wp-block-button__link" href="#">Plain text button</a></div></div>
    <div class="wp-block-buttons"><div class="wp-block-button sm-variation-5"><a id="solid" class="wp-block-button__link" href="#">Solid</a></div></div>
  </div>
  <pre id="out"></pre>
  <script>
    const color = id => getComputedStyle( document.getElementById( id ) ).color;
    document.getElementById( 'out' ).textContent = JSON.stringify( { text: color( 'text' ), plain: color( 'plain' ), solid: color( 'solid' ) } );
  </script></body></html>` );

  const run = theme => {
    fs.writeFileSync( file, fs.readFileSync( file, 'utf8' ).replace( /<html class="[^"]*">/, `<html class="${ theme }">` ) );
    const dom = execFileSync( CHROME, [ '--headless=new', '--disable-gpu', '--no-sandbox', '--virtual-time-budget=2000', '--dump-dom', `file://${ file }` ],
      { encoding: 'utf8', stdio: [ 'ignore', 'pipe', 'ignore' ], timeout: 60000 } );
    return JSON.parse( dom.match( /<pre id="out">([^<]*)<\/pre>/ )[ 1 ].replace( /&quot;/g, '"' ) );
  };

  const light = run( '' );
  assert.equal( light.text, 'rgb(33, 34, 32)', 'light: the card text button inks with the ground fg1' );
  assert.equal( light.plain, 'rgb(217, 72, 15)', 'light: a text button without a variation keeps the accent' );
  assert.equal( light.solid, 'rgb(255, 255, 255)', 'light: a solid button keeps its variation text color' );

  const dark = run( 'is-dark' );
  assert.equal( dark.text, 'rgb(240, 240, 240)', 'dark: the card text button inks with the dark ground fg1' );

  fs.rmSync( dir, { recursive: true, force: true } );
} );
