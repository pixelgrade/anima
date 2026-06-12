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
	// The directory shows style.css Description, so the wp.org variant gets
	// the bare-build positioning instead of the commercial marketing line.
	const description = displayName + ' is a design-system foundation for the block editor — considered colour, typography, and spacing for writing-first sites, built entirely from core blocks. It is the universal base of the Pixelgrade LT site solutions.';

	return gulp.src( ['../build/' + slug + '/style.css', '../build/' + slug + '/style-rtl.css'], { allowEmpty: true } )
	           .pipe( plugins.replace( /^Theme Name:.*$/m, 'Theme Name: ' + displayName ) )
	           .pipe( plugins.replace( /^Description:.*$/m, 'Description: ' + description ) )
	           .pipe( plugins.replace( /^Pixelgrade Plugin Supports:.*[\r\n]*/m, '' ) )
	           // The Update URI header firewalls commercial installs from the
	           // unrelated "anima" theme on wordpress.org; a directory theme
	           // must NOT carry it, or it won't receive wp.org updates.
	           .pipe( plugins.replace( /^Update URI:.*[\r\n]*/m, '' ) )
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

	// Bare-build layout fallbacks approximate the Felt LT demo's proportions
	// (content ≈ 816px, container ≈ 1290–1490px depending on viewport). When Nova
	// Blocks is active, its --nb-* widths (driven by Style Manager) take over.
	s.layout = Object.assign( {}, s.layout, {
		contentSize: 'var(--nb-content-width, 820px)',
		wideSize: 'var(--nb-container-width, 1290px)',
	} );

	// Default palette borrowed from Style Manager's "Morning Glory" colour palette
	// (periwinkle/indigo flower + dark garden green on a soft cool light grey).
	// When Style Manager is active, its runtime palette overrides these.
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
			{ slug: 'base',      color: '#eef0ea', name: 'Base' },
			{ slug: 'contrast',  color: '#2b3e20', name: 'Contrast' },
			{ slug: 'primary',   color: '#5663d5', name: 'Primary' },
			{ slug: 'secondary', color: '#262c52', name: 'Secondary' },
			{ slug: 'tertiary',  color: '#dcdfd3', name: 'Tertiary' },
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
		// Default pairing borrowed from Style Manager's "Atlas" font palette:
		// Space Grotesk (geometric grotesk) for headings and body. Bundled OFL font.
		// The body slug reuses the same family, so the @font-face is declared once.
		fontFamilies: [
			{
				slug: 'heading', name: 'Heading',
				fontFamily: '"Space Grotesk", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Helvetica, Arial, sans-serif',
				fontFace: [ { fontFamily: 'Space Grotesk', fontStyle: 'normal', fontWeight: '300 700', fontDisplay: 'swap', src: [ 'file:./assets/fonts/space-grotesk.woff2' ] } ],
			},
			{
				slug: 'body', name: 'Body',
				fontFamily: '"Space Grotesk", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Helvetica, Arial, sans-serif',
			},
		],
		// "Smaller" font sizing (one notch below normal, ~0.9375x): preset sizes
		// scaled down to match, paired with --font-size-base below for the
		// theme's role-based type.
		fontSizes: [
			{ slug: 'small', name: 'Small', size: '0.84rem' },
			{ slug: 'medium', name: 'Medium', size: '1.05rem' },
			{ slug: 'large', name: 'Large', size: '1.4rem', fluid: { min: '1.22rem', max: '1.4rem' } },
			{ slug: 'x-large', name: 'Extra Large', size: '2.1rem', fluid: { min: '1.69rem', max: '2.1rem' } },
			{ slug: 'xx-large', name: 'Huge', size: '2.8rem', fluid: { min: '2.06rem', max: '2.8rem' } },
		],
	} );

	s.spacing = Object.assign( {}, s.spacing, {
		blockGap: true,
		margin: true,
		padding: true,
		units: [ 'px', 'em', 'rem', 'vh', 'vw', '%' ],
		spacingScale: { operator: '*', increment: 1.5, steps: 7, mediumStep: 1.5, unit: 'rem' },
	} );

	// $theme-fonts roles that read as display/headings (serif) vs body/UI (sans).
	const headingRoles = [ 'super-display', 'display', 'heading-1', 'heading-2', 'heading-3', 'heading-4', 'site-title' ];
	const bodyRoles = [ 'body', 'lead', 'small-body', 'caption', 'heading-5', 'heading-6', 'navigation', 'meta', 'button', 'input', 'accent' ];

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
			// Buttons are styled by the theme's own CSS via the --theme-button-*
			// tokens (fed by --sm-button-background-color in the css mapping below);
			// don't set elements.button.color here or the ghost button disappears.
		},
		// Map the Style Manager runtime tokens the compiled theme CSS consumes to
		// the ACTIVE palette's preset variables. This drives buttons/accents/
		// separators/Nova bridges from whichever palette is live — the default
		// palette or any style variation (wporg/styles/*.json) — so a variation is
		// just a palette swap and recolors the whole theme bare. Supersedes the
		// separate sm-token-fallback.css.
		css: ':root{'
			+ '--sm-current-bg-color:var(--wp--preset--color--base);'
			+ '--sm-current-accent-color:var(--wp--preset--color--primary);'
			+ '--sm-current-accent2-color:var(--sm-current-accent-color);'
			+ '--sm-current-accent3-color:var(--sm-current-accent2-color);'
			+ '--sm-current-fg1-color:var(--wp--preset--color--contrast);'
			+ '--sm-current-fg2-color:var(--wp--preset--color--secondary);'
			+ '--sm-button-background-color:var(--wp--preset--color--primary);'
			// Leave --sm-site-container-width / --sm-content-inset to the theme's
			// own Nova-common fallbacks (67 / 288), which drive --nb-content-width /
			// --nb-container-width. Those land near Felt's proportions (~1410px wide,
			// ~720px content); Felt's literal "80" isn't portable because the width
			// is em-based and our fluid font scale differs.
			+ '--sm-spacing-level:1;'
			+ '}'
			// Point the theme's per-role font-family tokens at the active heading/
			// body families so the compiled typography (apply-font) uses the bundled
			// fonts — and follows a style variation that swaps the families. Higher
			// specificity (:root:root) to win over the compiled defaults.
			+ ':root:root{'
			+ headingRoles.map( r => '--theme-' + r + '-font-family:var(--wp--preset--font-family--heading);' ).join( '' )
			+ bodyRoles.map( r => '--theme-' + r + '-font-family:var(--wp--preset--font-family--body);' ).join( '' )
			// "Smaller" font sizing: scale the theme's whole role-based type system
			// down one notch (the compiled CSS defaults --font-size-base to 1).
			+ '--font-size-base:0.9375;'
			+ '}',
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
