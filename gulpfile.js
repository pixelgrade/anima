require( './tasks/sass' );

var gulp = require( 'gulp' ),
	map = require( 'map-stream' ),
	del = require( 'del' ),
	plugins = require( 'gulp-load-plugins')();

var HubRegistry = require('gulp-hub');

/* load some files into the registry */
var hub = new HubRegistry(['tasks/*.js']);

/* tell gulp to use the tasks just loaded */
gulp.registry(hub);

function zip(cb) {
	return gulp.series( 'build:folder', 'build:fix', 'build:zip' )(cb);
}
zip.description = 'Creates the zip file';

gulp.task( 'zip', zip );
