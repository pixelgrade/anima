const gulp = require('gulp'),
	plugins = require('gulp-load-plugins')(),
	fs = require('fs'),
	del = require('del'),
	{ readSmDefaultColors } = require('./build-wporg-tokens')

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
// Relax theme.json for the bare (no Style Manager) build.
//
// The commercial theme.json locks every design setting (no palette, no font
// sizes, no spacing, no base styles) because Style Manager supplies all of it
// at runtime. Without that plugin the theme is unstyled and gives the user no
// design controls — which the WordPress.org review treats as crippling core.
//
// This transform deep-mutates the built theme.json in place: it keeps
// templateParts / customTemplates / per-block settings intact, but enables
// appearanceTools, ships a default palette, font sizes/families, a spacing
// scale, base styles, and content widths with a pixel fallback (so constrained
// layout works whether or not Nova Blocks resolves --nb-* variables). When the
// Style Manager + Nova Blocks plugins ARE active, they layer their generated
// CSS on top, so this only governs the bare experience.
// -----------------------------------------------------------------------------
function wporgRelaxThemeJson(done) {
	const file = '../build/' + slug + '/theme.json';
	const json = JSON.parse( fs.readFileSync( file, 'utf8' ) );
	json.settings = json.settings || {};
	const s = json.settings;

	s.appearanceTools = true;
	s.useRootPaddingAwareAlignments = true;

	s.layout = Object.assign( {}, s.layout, {
		contentSize: 'var(--nb-content-width, 650px)',
		wideSize: 'var(--nb-container-width, 1100px)',
	} );

	// Derive the editor palette from Style Manager's own default palette so the
	// block-editor color picker matches the runtime tokens the compiled CSS uses.
	const smc = readSmDefaultColors();
	s.color = {
		background: true,
		custom: true,
		customDuotone: false,
		customGradient: false,
		defaultGradients: false,
		defaultPalette: false,
		link: true,
		text: true,
		palette: [
			{ slug: 'base',      color: smc.bg,       name: 'Base' },
			{ slug: 'contrast',  color: smc.fg1,      name: 'Contrast' },
			{ slug: 'primary',   color: smc.accent,   name: 'Primary' },
			{ slug: 'secondary', color: smc.fg2,      name: 'Secondary' },
			{ slug: 'tertiary',  color: smc.tertiary, name: 'Tertiary' },
		],
	};

	s.typography = Object.assign( {}, s.typography, {
		customFontSize: true,
		fontStyle: true,
		fontWeight: true,
		lineHeight: true,
		letterSpacing: true,
		textDecoration: true,
		textTransform: true,
		dropCap: false,
		fluid: true,
		fontFamilies: [
			{ slug: 'body', name: 'Body', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", Helvetica, Arial, sans-serif' },
			{ slug: 'heading', name: 'Heading', fontFamily: 'Georgia, Cambria, "Times New Roman", Times, serif' },
		],
		fontSizes: [
			{ slug: 'small', name: 'Small', size: '0.9rem' },
			{ slug: 'medium', name: 'Medium', size: '1.125rem' },
			{ slug: 'large', name: 'Large', size: '1.5rem', fluid: { min: '1.3rem', max: '1.5rem' } },
			{ slug: 'x-large', name: 'Extra Large', size: '2.25rem', fluid: { min: '1.8rem', max: '2.25rem' } },
			{ slug: 'xx-large', name: 'Huge', size: '3rem', fluid: { min: '2.2rem', max: '3rem' } },
		],
	} );

	s.spacing = Object.assign( {}, s.spacing, {
		blockGap: true,
		margin: true,
		padding: true,
		units: [ 'px', 'em', 'rem', 'vh', 'vw', '%' ],
		spacingScale: { operator: '*', increment: 1.5, steps: 7, mediumStep: 1.5, unit: 'rem' },
	} );

	json.styles = {
		spacing: {
			blockGap: '1.2rem',
			padding: { top: '0', bottom: '0', left: 'clamp(1.2rem, 5vw, 2.5rem)', right: 'clamp(1.2rem, 5vw, 2.5rem)' },
		},
		color: { background: 'var(--wp--preset--color--base)', text: 'var(--wp--preset--color--contrast)' },
		typography: { fontFamily: 'var(--wp--preset--font-family--body)', fontSize: 'var(--wp--preset--font-size--medium)', lineHeight: '1.7' },
		elements: {
			heading: { typography: { fontFamily: 'var(--wp--preset--font-family--heading)', fontWeight: '600', lineHeight: '1.2' } },
			h1: { typography: { fontSize: 'var(--wp--preset--font-size--xx-large)' } },
			h2: { typography: { fontSize: 'var(--wp--preset--font-size--x-large)' } },
			h3: { typography: { fontSize: 'var(--wp--preset--font-size--large)' } },
			link: { color: { text: 'var(--wp--preset--color--primary)' }, ':hover': { typography: { textDecoration: 'underline' } } },
			button: {
				color: { background: 'var(--wp--preset--color--primary)', text: 'var(--wp--preset--color--base)' },
				spacing: { padding: { top: '0.7rem', bottom: '0.7rem', left: '1.4rem', right: '1.4rem' } },
			},
		},
	};

	fs.writeFileSync( file, JSON.stringify( json, null, '\t' ) + '\n' );
	return done();
}
gulp.task( 'build:wporg:relax-theme-json', wporgRelaxThemeJson );

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
	'build:wporg:relax-theme-json',
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
