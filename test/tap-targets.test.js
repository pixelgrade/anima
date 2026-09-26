/**
 * Touch targets for navigation and menu links (#605).
 *
 * On coarse pointers, navigation and menu links get a 44px hit area built into
 * the design system: the hit area grows, the layout does not. Text rects and
 * row heights stay identical to fine pointers and to the stylesheet without
 * the rules. Adjacent targets must not steal each other's taps. Linked
 * content rows opt in through the `Link rows` list style. Inline links in
 * running text are exempt (WCAG 2.5.8).
 *
 * The cascade runs in headless Chrome with a real coarse primary pointer
 * (`--blink-settings=primaryPointerType=2`), against the compiled theme
 * stylesheets plus minimal stand-ins for the core Navigation and Nova Blocks
 * menu rules the theme builds on.
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

const TARGET = 44;
// elementFromPoint is sampled in 0.25px steps from the label centre.
const REACHED = TARGET - 0.5;

// ---------------------------------------------------------------------------
// Contracts on the compiled CSS and the block style registration.
// ---------------------------------------------------------------------------

test( 'the tap target is a token on :root', () => {
  const root = postcss.parse( compileCss( 'custom-properties.scss' ) );
  let value = null;
  root.walkDecls( '--theme-tap-target-size', decl => {
    if ( decl.parent.selector === ':root' ) {
      value = decl.value;
    }
  } );
  assert.equal( value, '44px' );
} );

test( 'every hit-area rule is scoped to coarse pointers', () => {
  for ( const entry of [ 'style.scss', path.join( 'blocks', 'style.scss' ), path.join( 'blocks', 'common.scss' ), 'block-editor.scss' ] ) {
    postcss.parse( compileCss( entry ) ).walkDecls( decl => {
      if ( ! /--(theme-)?tap-target/.test( `${ decl.prop } ${ decl.value }` ) ) {
        return;
      }
      // The Link rows style sizes its rows on every pointer (opt-in layout).
      if ( decl.parent.selector && decl.parent.selector.includes( 'is-style-link-rows' ) && ! decl.parent.selector.includes( '::after' ) ) {
        return;
      }
      let node = decl.parent, coarse = false;
      while ( node ) {
        if ( node.type === 'atrule' && node.name === 'media' && node.params.includes( 'pointer: coarse' ) ) {
          coarse = true;
        }
        node = node.parent;
      }
      assert.ok( coarse, `${ entry }: ${ decl.parent.selector } { ${ decl.prop } } is outside (pointer: coarse)` );
    } );
  }
} );

test( 'Link rows is registered for core/list and core/navigation', () => {
  const php = fs.readFileSync( path.join( __dirname, '..', 'inc', 'block-styles.php' ), 'utf8' );
  for ( const block of [ 'core\\/list', 'core\\/navigation' ] ) {
    assert.match( php, new RegExp( `register_block_style\\(\\s*'${ block }',\\s*\\[\\s*'name'\\s*=>\\s*'link-rows'` ) );
  }
} );

// ---------------------------------------------------------------------------
// Real cascade: the compiled theme stylesheets in headless Chrome.
// ---------------------------------------------------------------------------

const CHROME = [
  process.env.CHROME_BIN,
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
].find( bin => bin && fs.existsSync( bin ) );

// Minimal stand-ins for the markup owners' own rules (Nova Blocks menus and
// core Navigation / Social Links), so the theme rules meet the same boxes.
const OWNER_CSS = `
  body { margin: 0; font: 16px/1.25 sans-serif; }
  /* Nova Blocks navigation (wp_nav_menu), above lap */
  .nb-navigation { --nb-navigation-item-padding-y: calc(75 * 0.01em); --nb-navigation-item-spacing: 18px; display: flex; }
  .nb-navigation ul { list-style: none; padding: 0; margin: 0; }
  .nb-navigation :is(ul.menu, .menu > ul) { display: flex; flex-wrap: wrap; column-gap: var(--nb-navigation-item-spacing); }
  .nb-navigation :is(ul.menu, .menu > ul) a { display: block; padding-top: var(--nb-navigation-item-padding-y); padding-bottom: var(--nb-navigation-item-padding-y); color: inherit; text-decoration: none; }
  .nb-navigation .menu-item { position: relative; }
  .nb-navigation .sub-menu { position: absolute; top: 100%; left: 0; width: 15.625em; padding: .75em 0; }
  .nb-navigation .sub-menu a { position: relative; padding-left: 1.25em; padding-right: 1.875em; }
  /* core/navigation */
  .wp-block-navigation__container { display: flex; flex-wrap: wrap; align-items: center; gap: 10px; list-style: none; margin: 0; padding: 0; }
  .wp-block-navigation-item { display: flex; align-items: center; position: relative; }
  .wp-block-navigation-item__content { display: block; color: inherit; text-decoration: none; }
  .wp-block-navigation__submenu-container { position: absolute; top: 100%; left: 0; display: flex; flex-direction: column; list-style: none; margin: 0; padding: 0; width: 12em; }
  .wp-block-navigation__submenu-container .wp-block-navigation-item__content { display: flex; padding: .5em 1em; }
  .wp-block-navigation__submenu-container.is-closed { visibility: hidden; opacity: 0; width: 0; height: 0; overflow: hidden; }
  .toggles { position: relative; display: flex; gap: 40px; width: 200px; height: 24px; margin-top: 60px; }
  .wp-block-navigation__responsive-container-open,
  .wp-block-navigation__responsive-container-close { display: flex; width: 24px; height: 24px; padding: 0; border: 0; background: transparent; }
  .wp-block-navigation__responsive-container-close { position: fixed; top: 0; right: 0; }
  /* core/social-links */
  .wp-block-social-links { display: flex; gap: 18px; list-style: none; margin: 0; padding: 0; }
  .wp-social-link a { display: flex; padding: .25em; line-height: 0; }
`;

const FIXTURE = `
<header style="padding: 40px 60px">
  <div class="nb-navigation nb-navigation--primary"><ul class="menu">
    <li class="menu-item"><a href="#home">Home</a></li>
    <li class="menu-item menu-item-has-children"><a href="#about">About</a>
      <ul class="sub-menu"><li class="menu-item"><a href="#team">Team</a></li><li class="menu-item"><a href="#history">History</a></li></ul>
    </li>
    <li class="menu-item"><a href="#faq">FAQ</a></li>
    <li class="menu-item"><a href="#blog">Blog</a></li>
  </ul></div>
</header>
<section style="position: absolute; top: 280px; left: 60px">
  <nav class="wp-block-navigation"><ul class="wp-block-navigation__container">
    <li class="wp-block-navigation-item"><a class="wp-block-navigation-item__content" href="#pricing"><span>Pricing</span></a></li>
    <li class="wp-block-navigation-item"><a class="wp-block-navigation-item__content" href="#faq2"><span>FAQ</span></a></li>
    <li class="wp-block-navigation-item has-child"><a class="wp-block-navigation-item__content" href="#company"><span>Company</span></a>
      <ul class="wp-block-navigation__submenu-container is-closed">
        <li class="wp-block-navigation-item"><a class="wp-block-navigation-item__content" href="#team1"><span>Team</span></a></li>
      </ul>
    </li>
    <li class="wp-block-navigation-item"><a class="wp-block-navigation-item__content" href="#contact"><span>Contact</span></a></li>
  </ul>
  <div class="toggles">
    <button class="wp-block-navigation__responsive-container-open" aria-label="Open menu"><svg width="24" height="24"></svg></button>
    <button class="wp-block-navigation__responsive-container-close" aria-label="Close menu"><svg width="24" height="24"></svg></button>
  </div></nav>
</section>
<section style="position: absolute; top: 280px; left: 450px">
  <nav class="wp-block-navigation plain-sub-nav"><ul class="wp-block-navigation__container">
    <li class="wp-block-navigation-item has-child"><a class="wp-block-navigation-item__content" href="#company2"><span>Company</span></a>
      <ul class="wp-block-navigation__submenu-container">
        <li class="wp-block-navigation-item"><a class="wp-block-navigation-item__content" href="#team2"><span>Team</span></a></li>
        <li class="wp-block-navigation-item"><a class="wp-block-navigation-item__content" href="#history2"><span>History</span></a></li>
      </ul>
    </li>
  </ul></nav>
</section>
<section style="position: absolute; top: 280px; left: 750px">
  <nav class="wp-block-navigation is-style-link-rows linkrows-nav"><ul class="wp-block-navigation__container">
    <li class="wp-block-navigation-item has-child"><a class="wp-block-navigation-item__content" href="#company3"><span>Company</span></a>
      <ul class="wp-block-navigation__submenu-container">
        <li class="wp-block-navigation-item"><a class="wp-block-navigation-item__content" href="#team3"><span>Team</span></a></li>
        <li class="wp-block-navigation-item"><a class="wp-block-navigation-item__content" href="#history3"><span>History</span></a></li>
      </ul>
    </li>
  </ul></nav>
</section>
<section style="position: absolute; top: 460px; left: 60px; width: 500px">
  <ul class="wp-block-social-links" style="margin-bottom: 24px">
    <li class="wp-social-link"><a href="#x" aria-label="X"><svg width="24" height="24"></svg></a></li>
    <li class="wp-social-link"><a href="#ig" aria-label="Instagram"><svg width="24" height="24"></svg></a></li>
  </ul>
  <ul class="wp-block-list plain-list"><li><a href="#plain">Plain list link</a></li><li><a href="#plain2">FAQ</a></li></ul>
  <p class="inline">Read the <a href="#inline1">about page</a> or our <a href="#inline2">FAQ</a> inside a sentence.</p>
  <!-- Opt-in rows last: the style sets their pitch, so nothing follows them. -->
  <ul class="wp-block-list is-style-link-rows">
    <li><a href="#services">Services</a></li>
    <li><a href="#office">Visit our office</a></li>
    <li>Call or <a href="#visit">visit us</a></li>
  </ul>
</section>
`;

const GROUPS = {
  nova: '.nb-navigation > .menu > li > a',
  novaSub: '.nb-navigation .sub-menu a',
  core: '.wp-block-navigation:not(.linkrows-nav, .plain-sub-nav) .wp-block-navigation__container > li > a',
  coreSub: '.plain-sub-nav .wp-block-navigation__submenu-container a',
  coreRows: '.linkrows-nav .wp-block-navigation__submenu-container a',
  toggles: '.toggles button',
  social: '.wp-block-social-links a',
  rows: '.wp-block-list.is-style-link-rows a',
  plain: '.plain-list a',
  inline: '.inline a',
};

const PROBE = `
  const GROUPS = ${ JSON.stringify( GROUPS ) };
  const r2 = r => [ r.left, r.top, r.width, r.height ].map( v => +v.toFixed( 2 ) );
  const textRect = el => {
    const range = document.createRange();
    range.selectNodeContents( el );
    const rs = [ ...range.getClientRects() ].filter( r => r.width > 0 );
    const l = Math.min( ...rs.map( r => r.left ) ), t = Math.min( ...rs.map( r => r.top ) );
    return [ l, t, Math.max( ...rs.map( r => r.right ) ) - l, Math.max( ...rs.map( r => r.bottom ) ) - t ].map( v => +v.toFixed( 2 ) );
  };
  const owns = ( el, x, y ) => { const hit = document.elementFromPoint( x, y ); return !! hit && ( hit === el || el.contains( hit ) ); };
  const centre = el => { const t = textRect( el ); return [ t[ 0 ] + t[ 2 ] / 2, t[ 1 ] + t[ 3 ] / 2 ]; };
  // The hit area measured by sampling elementFromPoint outward from the centre.
  const span = ( el, dx, dy ) => { const [ x, y ] = centre( el ); let d = 0; while ( d < 200 && owns( el, x + dx * ( d + 0.25 ), y + dy * ( d + 0.25 ) ) ) d += 0.25; return d; };
  const out = {};
  for ( const [ name, sel ] of Object.entries( GROUPS ) ) {
    const els = [ ...document.querySelectorAll( sel ) ];
    out[ name ] = els.map( ( el, i ) => {
      const next = els[ i + 1 ];
      let mid = null, gapSides = null;
      if ( next ) {
        const [ ax, ay ] = centre( el ), [ bx, by ] = centre( next );
        const hit = document.elementFromPoint( ( ax + bx ) / 2, ( ay + by ) / 2 );
        const target = hit && hit.closest( 'a, button' );
        mid = target === el ? 'self' : target === next ? 'next' : target ? 'other' : 'none';
        // Same-row neighbours: who owns each side of the gap's midpoint.
        const a = textRect( el ), b = textRect( next );
        if ( Math.abs( a[ 1 ] - b[ 1 ] ) < 1 && b[ 0 ] > a[ 0 ] + a[ 2 ] ) {
          const gapMid = ( a[ 0 ] + a[ 2 ] + b[ 0 ] ) / 2;
          const who = x => { const t = document.elementFromPoint( x, ay )?.closest( 'a, button' ); return t === el ? 'self' : t === next ? 'next' : t ? 'other' : 'none'; };
          gapSides = [ who( gapMid - 1 ), who( gapMid + 1 ) ];
        }
      }
      return {
        label: el.textContent.trim() || el.getAttribute( 'aria-label' ),
        text: textRect( el ),
        row: r2( ( el.closest( 'li' ) || el.parentElement ).getBoundingClientRect() ),
        hitW: span( el, -1, 0 ) + span( el, 1, 0 ),
        hitH: span( el, 0, -1 ) + span( el, 0, 1 ),
        ownsCentre: owns( el, ...centre( el ) ),
        mid,
        gapSides,
      };
    } );
  }
  // Hover underline anchor: the Nova underline is positioned against the item.
  out.underlineHost = r2( document.querySelector( '.nb-navigation > .menu > li' ).getBoundingClientRect() );
  document.getElementById( 'out' ).textContent = JSON.stringify( out );
`;

const render = ( css, coarse ) => {
  const dir = fs.mkdtempSync( path.join( os.tmpdir(), 'anima-605-' ) );
  const file = path.join( dir, 'fixture.html' );
  fs.writeFileSync( file, `<!doctype html><html><head><meta charset="utf-8">
<style>${ css }
${ OWNER_CSS }
</style></head><body>${ FIXTURE }
<pre id="out" style="position:absolute;top:900px"></pre>
<script>${ PROBE }</script></body></html>` );

  const pointer = coarse
    ? '--blink-settings=primaryPointerType=2,availablePointerTypes=2,primaryHoverType=1,availableHoverTypes=1'
    : '--blink-settings=primaryPointerType=4,availablePointerTypes=4,primaryHoverType=2,availableHoverTypes=2';

  const dom = execFileSync( CHROME, [
    '--headless=new', '--disable-gpu', '--no-sandbox', '--hide-scrollbars', pointer,
    '--window-size=1200,1000', '--virtual-time-budget=2000', '--dump-dom', `file://${ file }`,
  ], { encoding: 'utf8', stdio: [ 'ignore', 'pipe', 'ignore' ], timeout: 60000 } );

  fs.rmSync( dir, { recursive: true, force: true } );
  return JSON.parse( dom.match( /<pre id="out"[^>]*>([^<]*)<\/pre>/ )[ 1 ].replace( /&quot;/g, '"' ) );
};

// The stylesheet as it was before #605: no coarse-pointer hit areas and no
// Link rows style.
const stripFix = css => {
  const root = postcss.parse( css );
  root.walkAtRules( 'media', rule => {
    if ( rule.params.includes( 'pointer: coarse' ) ) {
      rule.remove();
    }
  } );
  root.walkRules( rule => {
    if ( rule.selector.includes( 'is-style-link-rows' ) ) {
      rule.remove();
    }
  } );
  return root.toString();
};

// Layout snapped to the layout unit (1/64px): the padding and the negative
// margin are separate calc() values, so a box edge may round differently.
const snap = v => Math.round( v * 16 ) / 16;
const layout = run => Object.fromEntries( Object.entries( run ).filter( ( [ k ] ) => k !== 'underlineHost' ).map( ( [ k, items ] ) => [ k, items.map( i => ( { label: i.label, text: i.text.map( snap ), row: i.row.map( snap ) } ) ) ] ) );

test( 'headless Chrome: nav targets reach 44px on coarse pointers without moving anything', { skip: ! CHROME && 'Chrome not installed' }, () => {
  const css = [ 'custom-properties.scss', 'style.scss', path.join( 'blocks', 'common.scss' ), path.join( 'blocks', 'style.scss' ) ].map( compileCss ).join( '\n' );
  const before = stripFix( css );

  const coarse = render( css, true );
  const fine = render( css, false );
  const coarseBefore = render( before, true );
  const fineBefore = render( before, false );

  // The bug: before the fix, touch users get line-box-sized nav targets.
  const small = [ 'nova', 'core', 'toggles', 'social' ].flatMap( g => coarseBefore[ g ] ).filter( i => i.hitW < TARGET || i.hitH < TARGET );
  assert.ok( small.length >= 6, `before the fix most nav targets are under ${ TARGET }px (found ${ small.length })` );

  // Every nav and menu target now reaches the token on a coarse pointer.
  for ( const group of [ 'nova', 'novaSub', 'core', 'toggles', 'social', 'rows', 'coreRows' ] ) {
    for ( const item of coarse[ group ] ) {
      assert.ok( item.ownsCentre, `${ group } ${ item.label }: its own centre is tappable` );
      assert.ok( item.hitW >= REACHED && item.hitH >= REACHED, `${ group } ${ item.label }: hit area ${ item.hitW }x${ item.hitH } on coarse` );
    }
  }

  // Stacked rows without Link rows have no free space to grow into: each row
  // owns its full pitch (never less), and the opt-in style supplies the 44px.
  for ( const item of coarse.coreSub ) {
    assert.ok( item.ownsCentre && item.hitW >= REACHED, `coreSub ${ item.label }: ${ item.hitW }px wide` );
    assert.ok( item.hitH >= item.row[ 3 ] - 0.5, `coreSub ${ item.label }: owns its ${ item.row[ 3 ] }px row (${ item.hitH })` );
  }
  assert.ok( coarseBefore.coreSub.every( i => i.hitH < TARGET ), 'plain submenu rows are under the token' );

  // Layout is untouched: text rects and row boxes match fine pointers and the
  // stylesheet without the fix (the opt-in Link rows style aside).
  const withoutRows = run => { const l = layout( run ); delete l.rows; delete l.coreRows; return l; };
  assert.deepEqual( layout( coarse ), layout( fine ), 'coarse and fine pointers lay out identically' );
  assert.deepEqual( withoutRows( coarse ), withoutRows( coarseBefore ), 'coarse layout matches the stylesheet before the fix' );
  assert.deepEqual( withoutRows( fine ), withoutRows( fineBefore ), 'fine layout matches the stylesheet before the fix' );
  assert.deepEqual( coarse.underlineHost, coarseBefore.underlineHost, 'the hover underline host keeps its box' );

  // Fine pointers keep their hit areas (the opt-in Link rows aside).
  for ( const group of Object.keys( GROUPS ).filter( g => ! [ 'rows', 'coreRows' ].includes( g ) ) ) {
    fine[ group ].forEach( ( item, i ) => assert.deepEqual( [ item.hitW, item.hitH ], [ fineBefore[ group ][ i ].hitW, fineBefore[ group ][ i ].hitH ], `${ group } ${ item.label } unchanged on fine` ) );
  }

  // Neighbours never steal taps: the midpoint between two adjacent targets
  // belongs to one of them or to neither (a gap wider than both reaches),
  // never to a third target, and each keeps its own centre (checked above).
  // Nova's row links meet exactly at the midpoint.
  for ( const group of [ 'nova', 'novaSub', 'core', 'coreSub', 'coreRows', 'toggles', 'social', 'rows' ] ) {
    for ( const item of coarse[ group ].slice( 0, -1 ) ) {
      assert.ok( [ 'self', 'next', 'none' ].includes( item.mid ), `${ group } ${ item.label }: midpoint to the next target resolves to ${ item.mid }` );
    }
  }
  for ( const item of coarse.nova.slice( 0, -1 ) ) {
    assert.deepEqual( item.gapSides, [ 'self', 'next' ], `nova ${ item.label }: neighbours split the item gap at its midpoint` );
  }

  // Inline links in running text are exempt (WCAG 2.5.8): identical hit areas.
  for ( const group of [ 'inline', 'plain' ] ) {
    assert.deepEqual( coarse[ group ], coarseBefore[ group ], `${ group } links unchanged on coarse` );
  }

  // Link rows: the opt-in style gives each row the token's pitch on every
  // pointer, so fine and coarse agree and rows never overlap.
  for ( const rows of [ fine.rows, fine.coreRows ] ) {
    rows.slice( 1 ).forEach( ( item, i ) => {
      const pitch = item.row[ 1 ] - rows[ i ].row[ 1 ];
      assert.ok( pitch >= TARGET - 0.1, `Link rows ${ item.label }: ${ pitch }px from the previous row` );
    } );
  }
} );
