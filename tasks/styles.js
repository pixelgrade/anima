var gulp = require( 'gulp' ),
	sass = require( 'gulp-sass' ),
	sassUnicode = require('gulp-sass-unicode'),
	rtlcss = require( 'gulp-rtlcss' ),
	rename = require( 'gulp-rename' ),
	replace = require( 'gulp-replace' )
	cached = require( 'gulp-cached' );

sass.compiler = require( 'node-sass' );

function stylesBase( src, dest, cb ) {
	return gulp.src( src )
	           .pipe( sass().on( 'error', sass.logError ) )
	           .pipe( sassUnicode() )
	           .pipe( replace( /^@charset "UTF-8";\n/gm, '' ) )
	           .pipe( gulp.dest( dest ) );
}

const stylesRoot = './src/scss/';
const rootStyles = [ stylesRoot + 'style.scss' ];
const notRootStyles = rootStyles.map( path => '!' + path );

notRootStyles.unshift( stylesRoot + '**/*.scss' );

function compileRootStyles( cb ) {
	return stylesBase( rootStyles, './', cb );
}

function compileNotRootStyles( cb ) {
	return stylesBase( notRootStyles, './dist/css/', cb );
}

function stylesRTL( cb ) {
	return gulp.src( [ 'style.css', './dist/css/**/*.css', '!./dist/css/**/*-rtl.css' ], { base: './' } )
	           .pipe( cached( 'styles-rtl' ) )
	           .pipe( rtlcss() )
	           .pipe( rename( function( path ) { path.basename += "-rtl"; } ) )
	           .pipe( gulp.dest( '.' ) );
}

stylesRTL.description = 'Generate style-rtl.css file based on style.css';

function watch( cb ) {
	gulp.watch( [ './src/scss/**/*.scss' ], compile );
}

const compile = gulp.series( gulp.parallel( compileRootStyles, compileNotRootStyles ), stylesRTL );

gulp.task( 'compile:styles', compile );
gulp.task( 'watch:styles', gulp.series( compile, watch ) );
