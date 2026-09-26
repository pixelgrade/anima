/**
 * Fluid type must not grow roles declared under 16px on phones (#613).
 *
 * Each role moves linearly from an anchor at 320px to its declared size S at
 * 1440px. The anchor was the 16px minimum for every role, so a 14px meta or
 * label line was pulled UP toward 16 as the viewport narrowed (14 -> 15.2px at
 * 320). The anchor is now min(16, S): roles under 16 keep their size at every
 * width, roles at or above 16 shrink toward 16 exactly as before, and the
 * value at 1440 is unchanged by construction.
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
const css = sass.compile( path.join( scssRoot, 'custom-properties.scss' ), {
  loadPaths: [ scssRoot ],
  silenceDeprecations: [ 'import', 'global-builtin', 'slash-div' ],
} ).css;

const universalDecl = prop => {
  const found = [];
  postcss.parse( css ).walkDecls( prop, decl => {
    if ( decl.parent.selector === '*' ) {
      found.push( decl.value.replace( /\s+/g, ' ' ).trim() );
    }
  } );
  return found;
};

test( 'the fluid anchor never exceeds the role\'s own declared size', () => {
  assert.deepEqual( universalDecl( '--y0' ), [ 'min(var(--theme-font-size-minimum-value), var(--y1))' ] );
  assert.deepEqual( universalDecl( '--y1' ), [ 'var(--font-size)' ] );
} );

// ---------------------------------------------------------------------------
// #622: tiny roles (under the floor value) still keep a usable phone anchor.
// ---------------------------------------------------------------------------

test( 'the phone anchor never drops below the floor value (#622)', () => {
  assert.deepEqual( universalDecl( '--y0-new' ), [
    'max( var(--theme-font-size-floor-value), calc( var(--y1) - ( var(--y1) - var(--y0) ) * var(--theme-font-size-slope-adjust) ) )',
  ] );
} );

// ---------------------------------------------------------------------------
// Real layout: computed font sizes in headless Chrome at phone to desktop widths.
// Each width is an iframe, so `vw` and the desktop media query use that width.
// ---------------------------------------------------------------------------

const CHROME = [
  process.env.CHROME_BIN,
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
].find( bin => bin && fs.existsSync( bin ) );

const WIDTHS = [ 320, 390, 768, 1024, 1440 ];
const ROLES = { meta: 14, label: 12, body: 18, h1: 48, floor: 16, tiny: 9.5 };

// The pre-#613 formula (anchor = 16 for every role), below the 1440 breakpoint.
const legacySize = ( size, width ) => {
  const y0 = size - ( size - 16 ) * 0.6;
  return y0 + ( size - y0 ) * ( width - 320 ) / ( 1440 - 320 );
};

// The #622 formula: the phone anchor (--y0-new) is floored at 12, everything
// else about the curve is unchanged. For size >= 12 this reduces exactly to
// the #613 behaviour (floor is a no-op), so this same function also covers
// the "unchanged" roles below.
const floorSize = ( size, width ) => {
  const y0 = Math.min( 16, size );
  const y0New = Math.max( 12, size - ( size - y0 ) * 0.6 );
  const a = ( size - y0New ) / ( 1440 - 320 );
  const b = y0New - a * 320;
  return a * width + b;
};

const measure = () => {
  const dir = fs.mkdtempSync( path.join( os.tmpdir(), 'anima-613-' ) );
  const frame = `<!doctype html><html><head><style>${ css }
    html, body { margin: 0; }
    * { font-size: var(--current-font-size); }
  </style></head><body>${ Object.entries( ROLES ).map( ( [ id, size ] ) => `<p id="${ id }" style="--font-size: ${ size }">${ id }</p>` ).join( '' ) }</body></html>`;
  fs.writeFileSync( path.join( dir, 'frame.html' ), frame );
  const file = path.join( dir, 'fixture.html' );
  fs.writeFileSync( file, `<!doctype html><html><head><style>body { margin: 0; } iframe { display: block; height: 200px; border: 0; }</style></head><body>
${ WIDTHS.map( w => `<iframe data-w="${ w }" style="width: ${ w }px" src="frame.html"></iframe>` ).join( '\n' ) }
<pre id="out"></pre>
<script>
  window.addEventListener( 'load', () => {
    const out = {};
    for ( const frame of document.querySelectorAll( 'iframe' ) ) {
      const doc = frame.contentDocument;
      out[ frame.dataset.w ] = { innerWidth: frame.contentWindow.innerWidth };
      for ( const p of doc.querySelectorAll( 'p' ) ) {
        out[ frame.dataset.w ][ p.id ] = parseFloat( frame.contentWindow.getComputedStyle( p ).fontSize );
      }
    }
    document.getElementById( 'out' ).textContent = JSON.stringify( out );
  } );
</script></body></html>` );

  const dom = execFileSync( CHROME, [
    '--headless=new', '--disable-gpu', '--no-sandbox', '--hide-scrollbars', '--allow-file-access-from-files',
    '--window-size=1600,1200', '--virtual-time-budget=3000', '--dump-dom', `file://${ file }`,
  ], { encoding: 'utf8', stdio: [ 'ignore', 'pipe', 'ignore' ], timeout: 60000 } );

  fs.rmSync( dir, { recursive: true, force: true } );
  return JSON.parse( dom.match( /<pre id="out">([^<]*)<\/pre>/ )[ 1 ].replace( /&quot;/g, '"' ) );
};

test( 'headless Chrome: small roles hold their size, larger roles follow the unchanged curve', { skip: ! CHROME && 'Chrome not installed' }, () => {
  const sizes = measure();

  for ( const width of WIDTHS ) {
    const at = sizes[ width ];
    assert.equal( at.innerWidth, width, `iframe viewport ${ width }` );

    // Roles under 16 never exceed their declared size, and hold it on phones and tablets.
    for ( const id of [ 'meta', 'label' ] ) {
      assert.ok( at[ id ] <= ROLES[ id ] + 0.01, `${ id } at ${ width }: ${ at[ id ] } > ${ ROLES[ id ] }` );
      assert.ok( Math.abs( at[ id ] - ROLES[ id ] ) < 0.02, `${ id } at ${ width }: ${ at[ id ] } != ${ ROLES[ id ] }` );
    }

    // Roles at or above 16 are exactly the pre-#613 values.
    for ( const id of [ 'body', 'h1', 'floor' ] ) {
      const expected = legacySize( ROLES[ id ], width );
      assert.ok( Math.abs( at[ id ] - expected ) < 0.02, `${ id } at ${ width }: ${ at[ id ] } vs legacy ${ expected.toFixed( 2 ) }` );
    }

    // #622: a role under the floor value (9.5px) never drops below 12px on
    // phones. It never goes above it either (the anchor is capped, not
    // boosted past 12), and it tapers back down to its own 9.5px by 1440 --
    // unchanged there "by construction", same as every other role.
    assert.ok( Math.abs( at.tiny - floorSize( ROLES.tiny, width ) ) < 0.02, `tiny at ${ width }: ${ at.tiny } vs expected ${ floorSize( ROLES.tiny, width ).toFixed( 2 ) }` );
    assert.ok( at.tiny <= 12 + 0.02, `tiny at ${ width } must not exceed the 12px floor: ${ at.tiny }` );

    // 12, 14, 16 and 18px roles (label, meta, floor, body) are byte-for-byte
    // unchanged by #622: floorSize() reduces to legacySize()/its own value
    // for every size >= the 12px floor, so re-check them through floorSize.
    for ( const [ id, size ] of [ [ 'label', 12 ], [ 'meta', 14 ], [ 'floor', 16 ], [ 'body', 18 ] ] ) {
      assert.ok( Math.abs( at[ id ] - floorSize( size, width ) ) < 0.02, `${ id } (${ size }px) at ${ width } must stay unchanged by #622: ${ at[ id ] }` );
    }
  }

  // The 320 phone anchor for a sub-floor role is exactly the 12px floor.
  assert.ok( Math.abs( sizes[ 320 ].tiny - 12 ) < 0.02, `tiny at 320 should be the 12px floor, got ${ sizes[ 320 ].tiny }` );
  // 390 tapers only slightly off the floor -- still "about 12px" (#622's acceptance check).
  assert.ok( sizes[ 390 ].tiny >= 11.5 && sizes[ 390 ].tiny <= 12 + 0.02, `tiny at 390 should be about 12px, got ${ sizes[ 390 ].tiny }` );
} );
