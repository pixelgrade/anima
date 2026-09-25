const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const sass = require('sass');

const root = path.join(__dirname, '..');
const registryFile = path.join(root, 'inc', 'social-icons.json');
const generatedPartial = path.join(root, 'src', 'scss', 'setup', '_social-icons.scss');

function readRegistry() {
  return JSON.parse(fs.readFileSync(registryFile, 'utf8')).icons;
}

function compile(entry) {
  const { css } = sass.compile(path.join(root, 'src', 'scss', entry), {
    loadPaths: [path.join(root, 'src', 'scss')],
  });

  return css.replace(/\s+/g, ' ');
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\\/]/g, '\\$&');
}

function hrefSelector(fragment) {
  // Sass drops the quotes around identifier-like values.
  return new RegExp(`\\[href\\*=(?:"${escapeRegExp(fragment)}"|${escapeRegExp(fragment)}) i\\]`);
}

test('the shared registry covers the current platforms from #614', () => {
  const icons = readRegistry();
  const bySlug = Object.fromEntries(icons.map((icon) => [icon.slug, icon]));

  const expected = {
    tiktok: ['tiktok.com'],
    linkedin: ['linkedin.com'],
    github: ['github.com'],
    threads: ['threads.net', 'threads.com'],
    bluesky: ['bsky.app'],
    whatsapp: ['//wa.me/', 'whatsapp.com'],
    telegram: ['//t.me/', 'telegram.me'],
    discord: ['discord.gg', 'discord.com'],
  };

  for (const [slug, fragments] of Object.entries(expected)) {
    assert.ok(bySlug[slug], `missing ${slug}`);
    for (const fragment of fragments) {
      assert.ok(bySlug[slug].match.includes(fragment), `${slug} should match ${fragment}`);
    }
  }

  // Mastodon instances live on arbitrary domains: class opt-in only.
  assert.ok(bySlug.mastodon, 'missing mastodon');
  assert.deepEqual(bySlug.mastodon.match, []);

  for (const slug of ['mail', 'phone', 'rss']) {
    assert.ok(bySlug[slug], `missing generic ${slug} icon`);
  }

  for (const icon of icons) {
    assert.match(icon.slug, /^[a-z0-9-]+$/, `slug ${icon.slug} must be class-safe`);
    assert.ok(Boolean(icon.glyph) !== Boolean(icon.mask), `${icon.slug} needs exactly one of glyph or mask`);
    if (icon.mask) {
      assert.ok(fs.existsSync(path.join(root, 'assets', 'images', icon.mask)), `${icon.mask} must exist`);
    }
  }
});

test('the committed Sass partial is generated from the registry', () => {
  const { buildSocialIconsScss } = require('../tasks/lib/social-icons-scss.js');
  const expected = buildSocialIconsScss(readRegistry());

  assert.equal(fs.readFileSync(generatedPartial, 'utf8'), expected, 'run `npx gulp build:social-icons` to regenerate');
});

test('every registry fragment marks the Nova navigation link as social and paints its icon', () => {
  const css = compile('social-links.scss');
  const isSocialBlock = css.match(/\.nb-navigation [^{}]*\{ --is-social: 1; \}/g).join(' ');

  for (const icon of readRegistry()) {
    for (const fragment of icon.match) {
      assert.match(isSocialBlock, hrefSelector(fragment), `${fragment} must set --is-social`);

      const iconRule = new RegExp(`\\.social-menu-item > a${hrefSelector(fragment).source} \\{[^}]*--social-icon-(?:glyph|mask)`);
      assert.match(css, iconRule, `${fragment} must paint the ${icon.slug} icon`);
    }
  }
});

test('every registry slug can be forced with a menu-item--icon class that wins over URL matching', () => {
  const css = compile('social-links.scss');
  const lastUrlRule = css.lastIndexOf('.social-menu-item > a[href*=');

  for (const icon of readRegistry()) {
    const classSelector = `.nb-navigation .menu-item--icon-${icon.slug} > a`;
    assert.ok(css.includes(classSelector), `${classSelector} must set --is-social`);

    const iconRule = new RegExp(`li\\.social-menu-item\\.menu-item--icon-${escapeRegExp(icon.slug)} > a[^{]*\\{([^}]*)\\}`);
    const match = css.match(iconRule);
    assert.ok(match, `the ${icon.slug} opt-in class must paint an icon`);
    assert.ok(css.indexOf(match[0]) > lastUrlRule, `the ${icon.slug} class rule must come after the URL rules`);

    if (icon.glyph) {
      assert.match(match[1], new RegExp(`--social-icon-glyph: "\\\\${icon.glyph}"`));
      assert.match(match[1], /--social-icon-mask: none/);
    } else {
      assert.match(match[1], /--social-icon-glyph: ""/);
      assert.match(match[1], new RegExp(`--social-icon-mask: url\\([^)]*${escapeRegExp(icon.mask)}\\)`));
    }
  }
});

test('the icon pseudo element is driven only by the per-link custom properties', () => {
  const css = compile('social-links.scss');
  const before = css.match(/\.social-menu-item > a:before \{([^}]*)\}/);

  assert.ok(before, 'missing the shared icon pseudo element rule');
  assert.match(before[1], /content: var\(--social-icon-glyph\)/);
  assert.match(before[1], /background-color: var\(--social-icon-fill, transparent\)/);
  assert.match(before[1], /mask-image: var\(--social-icon-mask, none\)/);
  assert.match(before[1], /-webkit-mask-image: var\(--social-icon-mask, none\)/);
  // Glyph codepoints must not leak into the link's accessible name.
  assert.match(css, /@supports \(content: "x" ?\/ ?""\) \{ \.social-menu-item > a:before \{ content: var\(--social-icon-glyph\) ?\/ ?""; \} \}/);
});

test('X detection no longer captures dropbox.com or netflix.com', () => {
  const css = compile('social-links.scss');

  assert.doesNotMatch(css, /\[href\*="x\.com" i\]/);
  assert.match(css, hrefSelector('//x.com'));
  assert.match(css, hrefSelector('.x.com'));
});

test('Site Frame sizes every mask icon on the marker, not only X', () => {
  const css = compile('style.scss');

  assert.doesNotMatch(css, /\.nav--toolbar \.social-menu-item > a\[href\*="x\.com"\]/);
  assert.match(
    css,
    /\.nav--toolbar \.social-menu-item > a::before \{[^}]*mask-position: calc\(50% \+ var\(--site-frame-marker-padding-left\) \* 0\.5\) 50%;[^}]*mask-size: var\(--site-frame-marker-mask-size\) var\(--site-frame-marker-mask-size\);/
  );
});
