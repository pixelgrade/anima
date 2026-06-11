const fs = require('fs')

// -----------------------------------------------------------------------------
// Style Manager default-palette reader for the WordPress.org build.
//
// The wp.org build's theme.json palette (and, through the css mapping in
// relax-theme-json, the `--sm-current-*` runtime tokens the compiled theme CSS
// consumes) is seeded from Style Manager's OWN canonical default palette — not a
// hand-picked parallel set (which would drift). When Style Manager IS active its
// runtime output takes over; this only governs the bare default look.
// -----------------------------------------------------------------------------

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

// NOTE: the SM runtime tokens (`--sm-current-*`, `--sm-button-background-color`,
// layout) are now mapped to the active palette in theme.json `styles.css` by the
// relax-theme-json transform (see build-wporg.js), so they follow the default
// palette OR any style variation. This module only supplies the default palette
// colors that seed that theme.json palette.

module.exports = { readSmDefaultColors }
