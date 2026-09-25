/**
 * Turn the shared social icon registry (inc/social-icons.json) into the Sass
 * map consumed by src/scss/social-links.scss. PHP reads the same JSON at
 * runtime (inc/social-icons.php), so the Social Menu styles and the Site Frame
 * detector cannot drift (#614).
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..', '..');
const REGISTRY_FILE = path.join(ROOT, 'inc', 'social-icons.json');
const PARTIAL_FILE = path.join(ROOT, 'src', 'scss', 'setup', '_social-icons.scss');

function quote(value) {
	if (/["\\\n]/.test(value)) {
		throw new Error(`Unsupported character in social icon value: ${value}`);
	}

	return `"${value}"`;
}

function buildSocialIconsScss(icons) {
	const entries = icons.map((icon) => {
		if (!/^[a-z0-9-]+$/.test(icon.slug)) {
			throw new Error(`Social icon slug must be class-safe: ${icon.slug}`);
		}

		const fields = [`"match": (${icon.match.map(quote).join(', ')}${icon.match.length === 1 ? ',' : ''})`];

		if (icon.glyph) {
			if (!/^[0-9a-f]{4,5}$/i.test(icon.glyph)) {
				throw new Error(`Social icon glyph must be a hex codepoint: ${icon.glyph}`);
			}
			fields.push(`"glyph": "\\${icon.glyph}"`);
		} else if (icon.mask) {
			fields.push(`"mask": ${quote(icon.mask)}`);
			fields.push(`"scale": ${Number(icon.scale || 1)}`);
		} else {
			throw new Error(`Social icon ${icon.slug} needs a glyph or a mask`);
		}

		return `\t"${icon.slug}": (${fields.join(', ')}),`;
	});

	return [
		'// Generated from inc/social-icons.json by tasks/lib/social-icons-scss.js.',
		'// Do not edit: change the JSON and run `npx gulp build:social-icons`.',
		'$social-icons: (',
		...entries,
		');',
		'',
	].join('\n');
}

function readRegistry() {
	return JSON.parse(fs.readFileSync(REGISTRY_FILE, 'utf8')).icons;
}

function writeSocialIconsScss() {
	const contents = buildSocialIconsScss(readRegistry());

	if (!fs.existsSync(PARTIAL_FILE) || fs.readFileSync(PARTIAL_FILE, 'utf8') !== contents) {
		fs.writeFileSync(PARTIAL_FILE, contents);
	}

	return PARTIAL_FILE;
}

module.exports = { buildSocialIconsScss, readRegistry, writeSocialIconsScss };
