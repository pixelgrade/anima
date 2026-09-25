/**
 * Editorial (reading) quote style and the Editorial citation ink (nova-blocks#652).
 *
 * Editorial sets its quote in the heading-3 role (weight 900 in some
 * palettes), too big for quote cards in narrow tracks and with no native way
 * to get a reading-size quote. Editorial (reading) keeps the same ornament
 * (rule, opening mark, rule) with the lead role for the quote and the meta
 * role for the citation. The Editorial citation ink follows the context's text
 * role (Color Signal) instead of the fixed theme.json "contrast" colour, which
 * read 1.81:1 on a dark card.
 */
const test = require( 'node:test' );
const assert = require( 'node:assert/strict' );
const fs = require( 'node:fs' );
const path = require( 'node:path' );
const sass = require( 'sass' );
const postcss = require( 'postcss' );

const root = path.join( __dirname, '..' );
const scssRoot = path.join( root, 'src', 'scss' );
const css = postcss.parse( sass.compile( path.join( scssRoot, 'blocks', 'common.scss' ), {
  loadPaths: [ scssRoot ],
  silenceDeprecations: [ 'import', 'global-builtin', 'slash-div' ],
} ).css );

const declsFor = selector => {
  const found = {};
  css.walkRules( rule => {
    if ( rule.selector.split( ',' ).map( s => s.trim() ).includes( selector ) ) {
      rule.walkDecls( decl => {
        found[ decl.prop ] = decl.value;
      } );
    }
  } );
  return found;
};

const READING = '.wp-block-quote.is-style-editorial-reading:not(.is-style-plain)';
const EDITORIAL = '.wp-block-quote.is-style-editorial:not(.is-style-plain)';

test( 'Editorial (reading) keeps the Editorial ornament', () => {
  for ( const [ suffix, prop ] of [ [ '', 'padding-top' ], [ ':before', 'content' ], [ ':after', 'box-shadow' ] ] ) {
    const reading = declsFor( READING + suffix );
    const editorial = declsFor( EDITORIAL + suffix );
    assert.ok( reading[ prop ], `${ READING }${ suffix } sets ${ prop }` );
    assert.equal( reading[ prop ], editorial[ prop ], `${ suffix || 'frame' } ${ prop } matches Editorial` );
  }
} );

test( 'Editorial (reading) sets the quote in the lead role and the citation in the meta role', () => {
  const text = declsFor( READING + ' p' );
  assert.equal( text[ '--current-font-family' ], 'var(--theme-lead-font-family)' );
  assert.equal( text[ '--current-line-height' ], 'var(--theme-lead-line-height)' );
  assert.equal( text[ '--current-font-weight' ], '400', 'a reading weight, not the heading weight' );

  const cite = declsFor( READING + ' cite' );
  assert.equal( cite[ '--current-font-family' ], 'var(--theme-meta-font-family)' );
  assert.equal( cite.color, 'var(--sm-current-fg1-color)' );
} );

test( 'Editorial itself is unchanged: heading-3 quote, heading-5 citation', () => {
  assert.equal( declsFor( EDITORIAL + ' p' )[ '--current-font-family' ], 'var(--theme-heading-3-font-family)' );
  assert.equal( declsFor( EDITORIAL + ' cite' )[ '--current-font-family' ], 'var(--theme-heading-5-font-family)' );
} );

test( 'the block style is registered, and Editorial citations take the context text role first', () => {
  const source = fs.readFileSync( path.join( root, 'inc', 'block-styles.php' ), 'utf8' );

  assert.match( source, /'name'\s*=>\s*'editorial-reading',\s*\n\s*'label'\s*=>\s*__\(\s*'Editorial \(reading\)'/ );

  const citeRules = [ ...source.matchAll( /\.is-style-editorial(?:-reading)? cite \{([^}]*)\}/g ) ].map( match => match[ 1 ] );
  assert.equal( citeRules.length, 2, 'both Editorial styles style their citation' );
  for ( const rule of citeRules ) {
    assert.match( rule, /color:\s*var\(--sm-current-fg1-color,\s*var\(--wp--preset--color--contrast/, rule );
  }
} );
