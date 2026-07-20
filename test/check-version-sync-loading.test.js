const test = require( 'node:test' );
const assert = require( 'node:assert/strict' );
const path = require( 'node:path' );
const { spawnSync } = require( 'node:child_process' );

const themeRoot = path.resolve( __dirname, '..' );
const checkerPath = path.join( themeRoot, 'tasks', 'check-version-sync.js' );

test( 'loading the version checker for Gulp task discovery has no CLI side effects', () => {
	const script = `
		const fs = require( 'node:fs' );
		const originalReadFileSync = fs.readFileSync;

		fs.readFileSync = function ( file, ...args ) {
			const filename = String( file );

			if ( filename.endsWith( '/style.css' ) ) {
				return 'Version: 1.0.0\\nTested up to: 7.0\\nRequires at least: 6.0\\nRequires PHP: 7.4\\n';
			}

			if ( filename.endsWith( '/wporg/readme.txt' ) ) {
				return 'Stable tag: 2.0.0\\nTested up to: 7.0\\nRequires at least: 6.0\\nRequires PHP: 7.4\\n';
			}

			return originalReadFileSync.call( fs, file, ...args );
		};

		require( ${ JSON.stringify( checkerPath ) } );
		process.stdout.write( 'loaded without running' );
	`;

	const result = spawnSync( process.execPath, [ '-e', script ], {
		cwd: themeRoot,
		encoding: 'utf8',
	} );

	assert.equal( result.status, 0, result.stderr );
	assert.equal( result.stdout, 'loaded without running' );
} );
