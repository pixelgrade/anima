/**
 * Fluid type must not grow roles declared under 16px on phones (#613).
 *
 * Each role moves linearly from an anchor at 320px to its declared size S at
 * 1440px. The anchor was the 16px minimum for every role, so a 14px meta or
 * label line was pulled UP toward 16 as the viewport narrowed (14 -> 15.2px at
 * 320). The anchor is now min(16, S): roles under 16 keep their size at every
 * width, roles at or above 16 shrink toward 16 exactly as before, and the
 * value at 1440 is unchanged by construction.
 *
 * #626 follow-up: readers must see at least 12px on phones -- the RENDERED
 * size, i.e. after --font-size-modifier / --font-size-base scale a role down
 * for a given context (Pile LT's card meta uses a 0.9375 modifier). Guarding
 * only the un-multiplied --y0-new anchor (as first shipped) let an
 * already-floored role still render under 12px once multiplied
 * (12 * 0.9375 = 11.25), and the floor tapered away immediately past 320
 * instead of holding through phone widths. --y0-new is back to its plain
 * #622 form; a second, independent floor -- --theme-font-size-floor-fade --
 * is applied to the final --current-font-size via max(). It holds the floor
 * value FLAT through every width up to --theme-font-size-floor-breakpoint
 * (480px), then fades linearly to 0 by --theme-font-size-breakpoint (1440px),
 * so desktop is unchanged by construction and nothing above the fade window
 * is ever lifted.
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
// This anchor is intentionally UN-multiplied -- #626's rendered-size floor
// (below) is what guards the actual on-screen value.
// ---------------------------------------------------------------------------

test( 'the phone anchor never drops below the floor value (#622)', () => {
  assert.deepEqual( universalDecl( '--y0-new' ), [
    'max( var(--theme-font-size-floor-value), calc( var(--y1) - ( var(--y1) - var(--y0) ) * var(--theme-font-size-slope-adjust) ) )',
  ] );
} );

// ---------------------------------------------------------------------------
// #626: the RENDERED size (--current-font-size, after every multiplier) must
// hold the floor value flat through --theme-font-size-floor-breakpoint
// (480px), then fade linearly to 0 by --theme-font-size-breakpoint (1440px).
// ---------------------------------------------------------------------------

test( 'the rendered size never drops below the floor value through the floor breakpoint, then fades out by 1440 (#626)', () => {
  assert.deepEqual( universalDecl( '--theme-font-size-floor-fade' ), [
    'clamp( 0px, calc( ( var(--theme-font-size-breakpoint) * 1px - 100vw ) * var(--theme-font-size-floor-value) / ( var(--theme-font-size-breakpoint) - var(--theme-font-size-floor-breakpoint) ) ), var(--theme-font-size-floor-value) * 1px )',
  ] );
  assert.deepEqual( universalDecl( '--current-font-size' ), [
    'max( calc( var(--font-size-modifier) * var(--font-size-base) * ( var(--y2) + var(--theme-addon) ) ), var(--theme-font-size-floor-fade) )',
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

const WIDTHS = [ 320, 360, 390, 430, 480, 768, 1024, 1440 ];
const ROLES = { meta: 14, label: 12, body: 18, h1: 48, floor: 16, tiny: 9.5 };

const FLOOR = 12;
const FLOOR_BREAKPOINT = 480;
const DESKTOP_BREAKPOINT = 1440;

// The pre-#613 formula (anchor = 16 for every role), below the 1440 breakpoint.
const legacySize = ( size, width ) => {
  const y0 = size - ( size - 16 ) * 0.6;
  return y0 + ( size - y0 ) * ( width - 320 ) / ( 1440 - 320 );
};

// The #622 curve: the UN-multiplied phone anchor (--y0-new) is floored at 12,
// everything else about the curve is unchanged. For size >= 12 this reduces
// exactly to the #613 curve (the floor is a no-op).
const curveSize = ( size, width ) => {
  const y0 = Math.min( 16, size );
  const y0New = Math.max( FLOOR, size - ( size - y0 ) * 0.6 );
  const a = ( size - y0New ) / ( 1440 - 320 );
  const b = y0New - a * 320;
  return a * width + b;
};

// #626: the fade wedge added to the RENDERED size. Flat at the floor value up
// to the floor breakpoint (480), then linear down to 0 by the desktop
// breakpoint (1440), and exactly 0 above it -- matching the clamp() in CSS.
const floorFade = ( width ) => {
  const ratio = ( DESKTOP_BREAKPOINT - width ) / ( DESKTOP_BREAKPOINT - FLOOR_BREAKPOINT );
  return Math.min( Math.max( ratio, 0 ), 1 ) * FLOOR;
};

// The full #626 model: the #622 curve, scaled by the context's combined
// --font-size-modifier * --font-size-base ("mult"), with the (un-scaled)
// rendered-size floor wedge applied on top via max() -- exactly mirroring
// --current-font-size. mult = 1 (the default) is every context that doesn't
// set a modifier/base of its own.
const renderedSize = ( size, width, mult = 1 ) => {
  return Math.max( mult * curveSize( size, width ), floorFade( width ) );
};

const measure = ( roles = ROLES, modifier = null ) => {
  const dir = fs.mkdtempSync( path.join( os.tmpdir(), 'anima-613-' ) );
  const modifierOverride = modifier === null ? '' : `:root { --font-size-modifier: ${ modifier }; }`;
  const frame = `<!doctype html><html><head><style>${ css }
    html, body { margin: 0; }
    ${ modifierOverride }
    * { font-size: var(--current-font-size); }
  </style></head><body>${ Object.entries( roles ).map( ( [ id, size ] ) => `<p id="${ id }" style="--font-size: ${ size }">${ id }</p>` ).join( '' ) }</body></html>`;
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

    // Roles at or above 16 are exactly the pre-#613 values (#626's fade wedge
    // never reaches this high, so it never disturbs them).
    for ( const id of [ 'body', 'h1', 'floor' ] ) {
      const expected = legacySize( ROLES[ id ], width );
      assert.ok( Math.abs( at[ id ] - expected ) < 0.02, `${ id } at ${ width }: ${ at[ id ] } vs legacy ${ expected.toFixed( 2 ) }` );
    }

    // #626: a role under the floor value (9.5px) never drops below 12px
    // through the floor breakpoint (480px), then fades back to its own
    // 9.5px by 1440 -- unchanged there "by construction", same as every
    // other role.
    assert.ok( Math.abs( at.tiny - renderedSize( ROLES.tiny, width ) ) < 0.02, `tiny at ${ width }: ${ at.tiny } vs expected ${ renderedSize( ROLES.tiny, width ).toFixed( 2 ) }` );
    assert.ok( at.tiny <= 12 + 0.02, `tiny at ${ width } must not exceed the 12px floor: ${ at.tiny }` );

    // 12, 14, 16 and 18px roles (label, meta, floor, body) are byte-for-byte
    // unchanged by #622/#626: renderedSize() reduces to legacySize()/its own
    // value for every size >= the 12px floor, so re-check them through it.
    for ( const [ id, size ] of [ [ 'label', 12 ], [ 'meta', 14 ], [ 'floor', 16 ], [ 'body', 18 ] ] ) {
      assert.ok( Math.abs( at[ id ] - renderedSize( size, width ) ) < 0.02, `${ id } (${ size }px) at ${ width } must stay unchanged: ${ at[ id ] }` );
    }
  }

  // #626 acceptance: the sub-floor role renders EXACTLY 12px at every width
  // up to and including the floor breakpoint (480) -- not just at 320.
  for ( const width of [ 320, 360, 390, 430, 480 ] ) {
    assert.ok( Math.abs( sizes[ width ].tiny - 12 ) < 0.02, `tiny at ${ width } should be exactly the 12px floor, got ${ sizes[ width ].tiny }` );
  }
  // Past the floor breakpoint the fade wedge no longer reaches this role
  // (its own curve is already above the fading wedge), so it resumes its
  // #622 curve unchanged -- confirmed generically by the per-width loop above.
} );

// ---------------------------------------------------------------------------
// #626: the floor must hold on the RENDERED size, i.e. after a context's
// --font-size-modifier scales the anchor down (Pile LT's card meta uses
// 0.9375), and must hold it FLAT through every phone width up to 480, not
// just taper away immediately past 320.
// ---------------------------------------------------------------------------

const MULTIPLIER_626 = 0.9375;
const ROLES_626 = { r12: 12, r95: 9.5, r1045: 10.45, r14: 14 };
const PHONE_WIDTHS_626 = [ 320, 360, 390, 430 ];

test( 'headless Chrome: the rendered floor holds flat through 480 under a context multiplier, then fades out by 1440 (#626)', { skip: ! CHROME && 'Chrome not installed' }, () => {
  const sizes = measure( ROLES_626, MULTIPLIER_626 );

  for ( const width of WIDTHS ) {
    const at = sizes[ width ];
    assert.equal( at.innerWidth, width, `iframe viewport ${ width }` );

    for ( const [ id, size ] of Object.entries( ROLES_626 ) ) {
      const expected = renderedSize( size, width, MULTIPLIER_626 );
      assert.ok(
        Math.abs( at[ id ] - expected ) < 0.02,
        `${ id } (${ size }px * ${ MULTIPLIER_626 }) at ${ width }: ${ at[ id ] } vs expected ${ expected.toFixed( 4 ) }`,
      );
    }
  }

  // Acceptance: 12px, 9.5px and 10.45px roles all render EXACTLY 12.0px at
  // every phone width the floor covers (320, 360, 390, 430) -- flat, not a
  // taper. 480 itself (the floor breakpoint) is covered generically above.
  for ( const width of PHONE_WIDTHS_626 ) {
    for ( const id of [ 'r12', 'r95', 'r1045' ] ) {
      assert.ok(
        Math.abs( sizes[ width ][ id ] - 12 ) < 0.001,
        `${ id } at ${ width } must render exactly 12.0px, got ${ sizes[ width ][ id ] }`,
      );
    }
  }

  // A role already rendering at/above 12px (14 * 0.9375 = 13.125) is
  // unchanged by #626 at every width: it stays exactly at its multiplied
  // declared size, the fade wedge never reaches it.
  for ( const width of WIDTHS ) {
    assert.ok(
      Math.abs( sizes[ width ].r14 - 14 * MULTIPLIER_626 ) < 0.02,
      `r14 at ${ width } must stay unchanged: ${ sizes[ width ].r14 } vs ${ 14 * MULTIPLIER_626 }`,
    );
  }

  // 1024 and 1440 are unchanged from 2.0.50 as shipped (the plain #622
  // curve times the multiplier) for every one of these roles: the fade
  // wedge has already decayed below what each role's own curve renders
  // there. (A role tiny enough that its own curve dips under the fading
  // wedge at 1024 WOULD legitimately differ there -- none of these do.)
  for ( const width of [ 1024, 1440 ] ) {
    for ( const [ id, size ] of Object.entries( ROLES_626 ) ) {
      const shipped250 = MULTIPLIER_626 * curveSize( size, width );
      assert.ok(
        Math.abs( sizes[ width ][ id ] - shipped250 ) < 0.02,
        `${ id } at ${ width } must match 2.0.50 as shipped: ${ sizes[ width ][ id ] } vs ${ shipped250.toFixed( 4 ) }`,
      );
    }
  }

  // 1440 specifically: unchanged by construction, same as every other role --
  // the curve always passes through the role's own multiplied declared size.
  for ( const [ id, size ] of Object.entries( ROLES_626 ) ) {
    assert.ok(
      Math.abs( sizes[ 1440 ][ id ] - size * MULTIPLIER_626 ) < 0.02,
      `${ id } at 1440 must be unchanged: ${ sizes[ 1440 ][ id ] } vs ${ size * MULTIPLIER_626 }`,
    );
  }
} );
