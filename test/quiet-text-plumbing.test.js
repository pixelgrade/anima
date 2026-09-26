/**
 * Quiet text (style-manager#214, `--sm-current-fg-muted-color`) resets alongside the other
 * `--sm-current-*` roles in Anima's shared `apply-variation` mixin, so it never carries over from
 * an outer surface into a nested variation (style-manager#216).
 */
const test = require( 'node:test' );
const assert = require( 'node:assert/strict' );
const fs = require( 'node:fs' );
const path = require( 'node:path' );
const sass = require( 'sass' );
const postcss = require( 'postcss' );

const file = path.join( __dirname, '..', 'src', 'scss', 'setup', 'mixins', '_apply-variation.scss' );
// The invocation must come AFTER the file's own content: Sass does not hoist
// mixin definitions for forward references within a stylesheet.
const css = sass.compileString(
	fs.readFileSync( file, 'utf8' ) + '\n.probe { @include apply-variation(5); }\n',
	{ silenceDeprecations: [ 'import', 'global-builtin', 'slash-div' ] }
).css;

test( "Anima's shared apply-variation mixin resets quiet text alongside the other current-* roles", () => {
	let value;
	postcss.parse( css ).walkRules( '.probe', rule => {
		const decl = rule.nodes.find( node => node.type === 'decl' && node.prop === '--sm-current-fg-muted-color' );
		if ( decl ) {
			value = decl.value;
		}
	} );
	assert.equal( value, 'var(--sm-fg-muted-color-5, var(--sm-current-fg1-color))' );
} );
