var gulp = require( 'gulp' ),
	sass = require( 'gulp-sass' );

sass.compiler = require('node-sass');

function sass( src, dest ) {
	return gulp.src( src )
	           .pipe(sass().on('error', sass.logError))
	           .pipe(gulp.dest( dest ));
}

function styles( cb ) {
	cb();
	return gulp.src('./assets/scss/*.scss')
	           .pipe(sass().on('error', sass.logError))
	           .pipe(gulp.dest('./'));
}

function watch( cb ) {
	cb();
	gulp.watch( ['./assets/scss/**/*.scss'], styles );
}

gulp.task( 'compile:styles', styles );
gulp.task( 'watch:styles', gulp.series( styles, watch ) );