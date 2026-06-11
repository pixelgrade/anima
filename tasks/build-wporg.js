const gulp = require('gulp'),
	plugins = require('gulp-load-plugins')(),
	fs = require('fs'),
	del = require('del')

// -----------------------------------------------------------------------------
// WordPress.org build variant.
//
// Produces a separate zip intended for the WordPress.org theme directory:
// - strips the commercial distribution logic (see .zipignore-wporg)
// - copies the wporg/ overlay (readme.txt, ...) into the build root
// - replaces the __theme_txtd placeholder with the wp.org slug
// - renames the theme header and the .pot file to match the slug
//
// The wp.org slug is intentionally NOT "anima" (that slug is taken on
// WordPress.org by an unrelated theme). Override with the WPORG_SLUG env var
// until the final name is decided.
// -----------------------------------------------------------------------------
const slug = process.env.WPORG_SLUG || 'anima-lt'
const displayName = slug
	.split('-')
	.map(part => part.toLowerCase() === 'lt' ? 'LT' : part.charAt(0).toUpperCase() + part.slice(1))
	.join(' ')

// -----------------------------------------------------------------------------
// Copy the theme into ../build/<slug>/ so the zip root folder matches the slug.
// -----------------------------------------------------------------------------
function copyFolderWporg() {
	const dir = process.cwd()
	return gulp.src( './*' )
	           .pipe( plugins.exec( 'rm -Rf ./../build; mkdir -p ./../build/' + slug + ';', {
		           silent: true,
		           continueOnError: true // default: false
	           } ) )
	           .pipe(plugins.rsync({
		           root: dir,
		           destination: '../build/' + slug + '/',
		           progress: false,
		           silent: true,
		           compress: false,
		           recursive: true,
		           emptyDirectories: true,
		           clean: true,
		           exclude: ['node_modules']
	           }));
}
copyFolderWporg.description = 'Copy theme production files to a wp.org build folder';
gulp.task( 'build:wporg:copy-folder', copyFolderWporg );

// -----------------------------------------------------------------------------
// Remove files listed in BOTH .zipignore and .zipignore-wporg.
// -----------------------------------------------------------------------------
async function removeUnneededFilesWporg() {
	const files_to_remove = [];
	const contents = fs.readFileSync( '.zipignore', 'utf8' )
		+ '\n' + fs.readFileSync( '.zipignore-wporg', 'utf8' );

	contents.split(/[\r\n]/).forEach(function(path) {
		path = path.trim();

		// We will skip line starting with # since those are comments (as per the .gitignore standard).
		if ( path && !path.startsWith('#') ) {
			files_to_remove.push( '../build/' + slug + '/' + path );
		}
	});

	return del( files_to_remove, {force: true} );
}
removeUnneededFilesWporg.description = 'Remove unneeded + commercial-only files from the wp.org build folder';
gulp.task( 'build:wporg:remove-unneeded-files', removeUnneededFilesWporg );

gulp.task( 'build:wporg:folder', gulp.series(
	'build:wporg:copy-folder',
	'build:wporg:remove-unneeded-files'
) );

// -----------------------------------------------------------------------------
// Copy the wporg/ overlay (readme.txt, ...) into the build root.
// -----------------------------------------------------------------------------
function copyWporgOverlay() {
	return gulp.src( './wporg/**/*', { dot: true } )
	           .pipe( gulp.dest( '../build/' + slug + '/' ) );
}
copyWporgOverlay.description = 'Copy the wporg/ overlay files into the wp.org build folder';
gulp.task( 'build:wporg:overlay', copyWporgOverlay );

// -----------------------------------------------------------------------------
// Replace the text domain placeholder with the wp.org slug and adjust the
// theme header (a different theme name is mandatory: "anima" is taken on
// WordPress.org by an unrelated theme).
// -----------------------------------------------------------------------------
function wporgTextdomainReplace() {
	return gulp.src( ['../build/' + slug + '/**/*.php', '../build/' + slug + '/**/*.js', '../build/' + slug + '/**/*.css', '../build/' + slug + '/**/*.pot', '../build/' + slug + '/**/*.txt'] )
	           .pipe( plugins.replace( /__theme_txtd/g, slug ) )
	           .pipe( gulp.dest( '../build/' + slug ) );
}
gulp.task( 'build:wporg:txtdomain', wporgTextdomainReplace );

function wporgFixThemeHeader() {
	return gulp.src( ['../build/' + slug + '/style.css', '../build/' + slug + '/style-rtl.css'], { allowEmpty: true } )
	           .pipe( plugins.replace( /^Theme Name:.*$/m, 'Theme Name: ' + displayName ) )
	           .pipe( plugins.replace( /^Pixelgrade Plugin Supports:.*[\r\n]*/m, '' ) )
	           .pipe( gulp.dest( '../build/' + slug ) );
}
gulp.task( 'build:wporg:theme-header', wporgFixThemeHeader );

// -----------------------------------------------------------------------------
// Give core's constrained layout real content widths in the bare build.
//
// theme.json points contentSize/wideSize at the Nova Blocks runtime variables
// (--nb-content-width / --nb-container-width). When Nova Blocks is active those
// resolve as usual; when it is not (e.g. the wp-themes.com preview), an
// undefined variable collapses constrained layout to full width. Add a pixel
// fallback so core blocks stay readable either way.
// -----------------------------------------------------------------------------
function wporgThemeJsonWidths() {
	return gulp.src( '../build/' + slug + '/theme.json' )
	           .pipe( plugins.replace( '"contentSize": "var(--nb-content-width)"', '"contentSize": "var(--nb-content-width, 650px)"' ) )
	           .pipe( plugins.replace( '"wideSize": "var(--nb-container-width)"', '"wideSize": "var(--nb-container-width, 1100px)"' ) )
	           .pipe( gulp.dest( '../build/' + slug ) );
}
gulp.task( 'build:wporg:theme-json-widths', wporgThemeJsonWidths );

function wporgRenamePot(done) {
	const oldPot = '../build/' + slug + '/languages/anima.pot'
	const newPot = '../build/' + slug + '/languages/' + slug + '.pot'
	if ( fs.existsSync( oldPot ) && oldPot !== newPot ) {
		fs.renameSync( oldPot, newPot )
	}
	return done();
}
gulp.task( 'build:wporg:rename-pot', wporgRenamePot );

gulp.task( 'build:wporg:fix-wporg', gulp.series(
	'build:wporg:txtdomain',
	'build:wporg:theme-header',
	'build:wporg:theme-json-widths',
	'build:wporg:rename-pot'
) );

// -----------------------------------------------------------------------------
// Create the wp.org theme archive and delete the build folder.
// -----------------------------------------------------------------------------
function makeZipWporg() {
	// get theme version from the stylesheet
	const contents = fs.readFileSync('./style.css', 'utf8')
	const lines = contents.split(/[\r\n]/)
	const versionLine = lines.filter(value => /^[\s\*]*[Vv]ersion:/.test(value))

	let versionString = versionLine[0].replace(/^[\s\*]*[Vv]ersion:/, '').trim();
	versionString = '-' + versionString.replace(/\./g, '-');

	return gulp.src('./')
	           .pipe( plugins.exec('cd ./../; rm -rf ' + slug + '-*.zip; cd ./build/; zip -r -X ./../' + slug + versionString + '.zip ./; cd ./../; rm -rf build'));
}
makeZipWporg.description = 'Create the wp.org theme archive and delete the build folder';
gulp.task( 'build:wporg:zip', makeZipWporg );
