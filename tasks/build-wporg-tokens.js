const gulp = require('gulp'),
	fs = require('fs')

// -----------------------------------------------------------------------------
// Style Manager token fallback for the bare (no-plugin) WordPress.org build.
//
// The compiled theme CSS consumes a small set of Style Manager runtime tokens
// (`--sm-current-*` colors + a few layout tokens). Style Manager emits them at
// runtime from the active palette; without the plugin they are undefined and
// buttons/accents/separators/Nova bridges render uncolored.
//
// This generator reproduces those tokens from Style Manager's OWN canonical
// default palette so the bare demo's colors come straight from SM's defaults —
// not a hand-picked parallel set (which would drift). When Style Manager IS
// active, its runtime output overrides these, so the file is enqueued only when
// the plugin is absent (see anima_enqueue_sm_token_fallback() in
// inc/block-editor.php).
// -----------------------------------------------------------------------------

const slug = process.env.WPORG_SLUG || 'anima-lt'

/**
 * Read Style Manager's default palette colors (light, variation 1).
 *
 * Prefers the live plugin source so the values stay fresh; falls back to the
 * committed snapshot (wporg/sm-default-tokens.json) so release builds work
 * without the plugin checked out.
 */
function readSmDefaultColors() {
	const livePath = '../../plugins/style-manager/src/Customize/sm_advanced_palette_output.json'
	const snapshotPath = './wporg/sm-default-tokens.json'

	try {
		if ( fs.existsSync( livePath ) ) {
			const palettes = JSON.parse( fs.readFileSync( livePath, 'utf8' ) )
			const palette = Array.isArray( palettes ) ? palettes[0] : null
			const variation = palette && palette.variations && palette.variations[0]
			if ( variation && variation.bg && variation.accent && variation.fg1 && variation.fg2 ) {
				return {
					bg: variation.bg,
					accent: variation.accent,
					fg1: variation.fg1,
					fg2: variation.fg2,
					tertiary: ( palette.colors && palette.colors[1] ) || variation.bg,
					source: 'plugin',
				}
			}
		}
	} catch ( e ) {
		// fall through to the committed snapshot
	}

	const snap = JSON.parse( fs.readFileSync( snapshotPath, 'utf8' ) )
	return {
		bg: snap.bg,
		accent: snap.accent,
		fg1: snap.fg1,
		fg2: snap.fg2,
		tertiary: snap.tertiary || snap.bg,
		source: 'snapshot',
	}
}

function tokenFallbackCss() {
	const c = readSmDefaultColors()
	return `/* Auto-generated for the WordPress.org build from Style Manager's default palette. Do not edit by hand. Source: ${c.source}. */
:root {
	--sm-current-bg-color: ${c.bg};
	--sm-current-accent-color: ${c.accent};
	--sm-current-accent2-color: var(--sm-current-accent-color);
	--sm-current-accent3-color: var(--sm-current-accent2-color);
	--sm-current-fg1-color: ${c.fg1};
	--sm-current-fg2-color: ${c.fg2};
	--sm-site-container-width: 67;
	--sm-content-inset: 288;
	--sm-spacing-level: 1;

	/* The theme's button CSS fills from --sm-button-background-color (the one
	   button token Style Manager normally supplies). Define it so buttons get
	   the brand fill with their built-in light text. */
	--sm-button-background-color: var(--sm-current-accent-color);
}
`
}

function writeTokenFallback( done ) {
	const dir = '../build/' + slug + '/dist/css'
	const colors = readSmDefaultColors()
	fs.mkdirSync( dir, { recursive: true } )
	fs.writeFileSync( dir + '/sm-token-fallback.css', tokenFallbackCss() )
	console.log( '[build:wporg:token-fallback] wrote sm-token-fallback.css from SM ' + colors.source + ' defaults (accent ' + colors.accent + ')' )
	return done()
}
writeTokenFallback.description = 'Generate the bare-build Style Manager token fallback CSS from SM defaults'
gulp.task( 'build:wporg:token-fallback', writeTokenFallback )

module.exports = { readSmDefaultColors }
