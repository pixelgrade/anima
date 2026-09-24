/**
 * Every Nova Blocks template the wp.org build strips must come back (#602).
 *
 * .zipignore-wporg removes Nova/CPT templates from templates/ so the bare
 * package stays plugin-free. Each of them must be copied into
 * wporg-template-variants/novablocks/ by the build and be known to the
 * loader, or Anima LT sites with Nova Blocks lose that template (the
 * portfolio/gallery/testimonial archives and singles fell back to the
 * generic archive/single).
 */
const test = require( 'node:test' );
const assert = require( 'node:assert/strict' );
const fs = require( 'node:fs' );
const path = require( 'node:path' );

const root = path.join( __dirname, '..' );
const read = file => fs.readFileSync( path.join( root, file ), 'utf8' );

const stripped = read( '.zipignore-wporg' )
  .split( '\n' )
  .map( line => line.trim() )
  .filter( line => /^templates\/[^*]+\.html$/.test( line ) );

const buildSource = read( 'tasks/build-wporg.js' );
const variantList = buildSource.match( /const novablocksTemplateVariantFiles = \[([\s\S]*?)\]/ )[ 1 ];
const variantFiles = Array.from( variantList.matchAll( /'([^']+)'/g ), m => m[ 1 ] );

const loader = read( 'wporg/inc/wporg-template-variants.php' );
const requirementsBlock = loader.match( /function anima_wporg_get_novablocks_added_template_requirements\(\): array \{([\s\S]*?)\n\}/ )[ 1 ];
const loaderSlugs = Array.from( requirementsBlock.matchAll( /^\t\t'([a-z0-9_-]+)'\s*=>/gm ), m => m[ 1 ] );

test( 'the wp.org build still strips the CPT and split-header templates', () => {
  assert.ok( stripped.length >= 11, `found ${ stripped.length } stripped templates` );
  for ( const file of [ 'templates/archive-portfolio.html', 'templates/single-portfolio.html', 'templates/single-split-header.html' ] ) {
    assert.ok( stripped.includes( file ), `${ file } stripped` );
  }
} );

for ( const file of stripped ) {
  const slug = path.basename( file, '.html' );

  test( `${ slug }: stripped, but copied as a Nova variant and restored by the loader`, () => {
    assert.ok( fs.existsSync( path.join( root, file ) ), `${ file } exists in the source theme` );
    assert.ok( variantFiles.includes( file ), `${ file } is in novablocksTemplateVariantFiles` );
    assert.ok( loaderSlugs.includes( slug ), `${ slug } has a loader requirement` );
  } );
}

test( 'the loader knows no template the build does not copy', () => {
  for ( const slug of loaderSlugs ) {
    assert.ok( variantFiles.includes( `templates/${ slug }.html` ), `${ slug } is copied by the build` );
  }
} );

test( 'demo images from remote hosts are stripped from the shipped variants', () => {
  const list = buildSource.match( /const unsupportedDomains = \[([\s\S]*?)\]/ )[ 1 ];
  for ( const host of [ 'unsplash.com', 'trial.pixelgrade.com' ] ) {
    assert.ok( list.includes( `'${ host }'` ), `${ host } is stripped` );
  }
} );
