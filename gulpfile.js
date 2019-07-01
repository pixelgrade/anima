var gulp = require('gulp'),
	sass = require( 'gulp-sass' );

sass.compiler = require('node-sass');

const watch = gulp.task( 'watch', function( cb ) {
	cb();
	gulp.watch( ['./assets/scss/**/*.scss'], styles );
});

function styles( cb ) {
	cb();
	return gulp.src('./assets/scss/*.scss')
	           .pipe(sass().on('error', sass.logError))
	           .pipe(gulp.dest('./'));
}

exports.styles = styles;
exports.watch = watch;
