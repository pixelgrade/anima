#!/usr/bin/env node
/**
 * Fails if the wp.org readme headers have drifted from style.css.
 *
 * style.css is the single source of truth for the theme version and support
 * floors. wporg/readme.txt duplicates them, and a Stable tag that disagrees with
 * the shipped zip version fails the WordPress.org review checks. The wp.org build
 * auto-syncs the *shipped* readme (see build:wporg:sync-readme-headers), so a
 * mismatch can never ship; this guards the *committed* source so the repo is not
 * misleading and is ready to wire into CI.
 *
 * Dependency-free. Run via `npm run check:version`. Exit 0 = in sync, 1 = drift.
 */
'use strict';

const fs   = require( 'fs' );
const path = require( 'path' );

const root   = path.resolve( __dirname, '..' );
const style  = fs.readFileSync( path.join( root, 'style.css' ), 'utf8' );
const readme = fs.readFileSync( path.join( root, 'wporg', 'readme.txt' ), 'utf8' );

function header( contents, label ) {
	const escaped = label.replace( /[.*+?^${}()|[\]\\]/g, '\\$&' );
	const match   = contents.match( new RegExp( '^[\\s\\*]*' + escaped + ':\\s*(.+)$', 'mi' ) );
	return match ? match[ 1 ].trim() : null;
}

// [ readme header  <-  style.css header ]
const fields = [
	[ 'Stable tag', 'Version' ],
	[ 'Tested up to', 'Tested up to' ],
	[ 'Requires at least', 'Requires at least' ],
	[ 'Requires PHP', 'Requires PHP' ],
];

const mismatches = [];

for ( const [ readmeLabel, styleLabel ] of fields ) {
	const styleValue  = header( style, styleLabel );
	const readmeValue = header( readme, readmeLabel );

	if ( styleValue !== readmeValue ) {
		mismatches.push(
			'  ' + readmeLabel + ': readme.txt has "' + readmeValue +
			'" but style.css ' + styleLabel + ' is "' + styleValue + '"'
		);
	}
}

if ( mismatches.length > 0 ) {
	console.error( '✗ wporg/readme.txt headers are out of sync with style.css:' );
	console.error( mismatches.join( '\n' ) );
	console.error( '\nstyle.css is the source of truth. Update wporg/readme.txt to match' );
	console.error( '(the wp.org build syncs the shipped readme automatically).' );
	process.exit( 1 );
}

console.log( '✓ wporg/readme.txt headers match style.css (Stable tag, Tested up to, Requires at least, Requires PHP).' );
