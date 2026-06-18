const gulp = require('gulp')

const HubRegistry = require('gulp-hub')

/* load some files into the registry */
const hub = new HubRegistry(['tasks/*.js'])

/* tell gulp to use the tasks just loaded */
gulp.registry( hub );

gulp.task( 'zip', gulp.series( 'build:translate', 'build:folder', 'build:fix', 'build:zip' ) );

// WordPress.org build variant: strips the commercial distribution logic and
// packages under the wp.org slug (see tasks/build-wporg.js).
gulp.task( 'zip:wporg', gulp.series(
	'build:translate',
	'build:wporg:folder',
	'build:wporg:copy-novablocks-template-variants',
	'build:wporg:overlay',
	'build:fix:dir-permissions',
	'build:fix:file-permissions',
	'build:fix:line-endings',
	'build:wporg:fix-wporg',
	'build:wporg:zip'
) );

gulp.task( 'dev', gulp.parallel( 'watch:styles', 'server' ) );
