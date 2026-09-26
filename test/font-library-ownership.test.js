/**
 * The WordPress Font Library stays enabled (#379): fonts installed there are a
 * Style Manager font source (pixelgrade/style-manager#57), and Style Manager
 * keeps block-level font family pickers out of the way.
 *
 * The behavior lives in test/font-library-ownership-contract.php; this runs it
 * with the first working PHP binary (ANIMA_PHP_CLI, NB_PHP_CLI, or `php`).
 */
const test = require( 'node:test' );
const assert = require( 'node:assert/strict' );
const fs = require( 'node:fs' );
const path = require( 'node:path' );
const { execFileSync } = require( 'node:child_process' );

const contract = path.join( __dirname, 'font-library-ownership-contract.php' );

const findPhp = () => [ process.env.ANIMA_PHP_CLI, process.env.NB_PHP_CLI, 'php' ].filter( Boolean ).find( bin => {
  try {
    execFileSync( bin, [ '-r', 'exit(PHP_VERSION_ID >= 80000 ? 0 : 1);' ], { stdio: 'ignore' } );
    return true;
  } catch ( e ) {
    return false;
  }
} );

test( 'theme.json does not hard-disable the Font Library', () => {
  const json = JSON.parse( fs.readFileSync( path.join( __dirname, '..', 'theme.json' ), 'utf8' ) );

  assert.notEqual( json.settings.typography.fontLibrary, false );
  assert.deepEqual( json.settings.typography.fontFamilies, [], 'Style Manager owns the font family presets.' );
} );

test( 'the editor settings keep the Font Library enabled and the Styles handoff reaches it', t => {
  const php = findPhp();
  if ( ! php ) {
    t.skip( 'No PHP 8 binary (set ANIMA_PHP_CLI).' );
    return;
  }

  const output = execFileSync( php, [ contract ], { cwd: path.join( __dirname, '..' ), encoding: 'utf8' } );
  assert.match( output, /Font Library ownership contract OK/ );
} );
