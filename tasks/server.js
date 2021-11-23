const gulp = require( "gulp" );
const fs = require( 'fs' );
const browserSync = require( 'browser-sync' ).create();
let gulpconfig;

if ( fs.existsSync( './tasks/gulpconfig.json' ) ) {
	gulpconfig = require( './gulpconfig.json' );
} else {
	gulpconfig = require( './gulpconfig.example.json' );
	console.warn( "Don't forget to create your own gulpconfig.json from gulpconfig.json.example" );
}

gulp.task( 'server', function() {

	// Init the Browsersync server
	browserSync.init( {
		cwd: '../../',
		files: [
			'plugins/nova-blocks/build/**/*.css',
			'themes/anima/dist/**/*',
			'themes/anima/style.css',
		],
		open: false,
		proxy: gulpconfig.server.domain,
		injectChanges: true,
	} );

} );