var gulp = require( 'gulp' );
var fs = require( 'fs' );
var browserSync = require( 'browser-sync' ).create();
var gulpconfig;
var defaults = { open: 'external' };

if ( fs.existsSync( './tasks/gulpconfig.json' ) ) {
	gulpconfig = require( './gulpconfig.json' );
} else {
	gulpconfig = require( './gulpconfig.example.json' );
	console.warn( "Don't forget to create your own gulpconfig.json from gulpconfig.json.example" );
}

var config = Object.assign( {}, defaults, gulpconfig.server );

function reload( done ) {
	browserSync.reload("*.css");
	done();
};

gulp.task( 'server', function() {
	console.log( gulpconfig, config );
	

	// Provide a callback to capture ALL events to CSS
	// files - then filter for 'change' and reload all
	// css files on the page.
	// https://browsersync.io/docs/api#api-watch
	browserSync.watch(['*.css', '../../plugins/nova-blocks/,*.css'], function (event, file) {
	    if (event === 'change') {
	        browserSync.reload('*.css');
	    }
	});

	browserSync.watch('dist/**/*.js').on('change', browserSync.reload);

	// Init the Browsersync server
	browserSync.init( {
		watch: true,
		proxy: gulpconfig.server.domain,
		open: 'external',
		injectChanges: true,
	} );

	// add browserSync.reload to the tasks array to make
	// all browsers reload after tasks are complete.
	// gulp.watch( [ 'dist/**/*.js', '*.css' ], reload );

} );
