var gulp = require( 'gulp' ),
	sass = require( 'gulp-sass' ),
	rtlcss = require( 'gulp-rtlcss' ),
	rename = require( 'gulp-rename' ),
	replace = require( 'gulp-replace' );

sass.compiler = require('node-sass');

function styles( cb ) {
	cb();
	return gulp.src('./assets/scss/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(replace(/^@charset "UTF-8";\n/gm, ''))
    .pipe(gulp.dest('./'));
}

function stylesRtl() {
	return gulp.src('style.css')
	           .pipe(rtlcss())
	           .pipe(rename('style-rtl.css'))
	           .pipe(gulp.dest('.'))
}
stylesRtl.description = 'Generate style-rtl.css file based on style.css';

function watch( cb ) {
	cb();
	gulp.watch( ['./assets/scss/**/*.scss'], styles );
}

const compile = gulp.series( styles, stylesRtl );

gulp.task( 'compile:styles', compile );
gulp.task( 'watch:styles', gulp.series( compile, watch ) );
