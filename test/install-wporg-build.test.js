const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { execFileSync } = require('node:child_process');

const installer = require('../bin/install-wporg-build');

function makeThemeHeader({ name = 'Anima LT', version = '2.0.23', textDomain = 'anima-lt' } = {}) {
  return `/*!
Theme Name: ${name}
Version: ${version}
Text Domain: ${textDomain}
*/\n`;
}

function makeFixture() {
  const workspace = fs.mkdtempSync(path.join(os.tmpdir(), 'anima-wporg-install-'));
  const root = path.join(workspace, 'anima');
  fs.mkdirSync(root);
  fs.writeFileSync(path.join(root, 'package.json'), JSON.stringify({
    engines: { node: '>=22.0.0' },
  }));
  fs.writeFileSync(path.join(root, 'style.css'), makeThemeHeader({
    name: 'Anima',
    textDomain: '__theme_txtd',
  }));

  return { workspace, root };
}

function makeZip(workspace, version, styleCss) {
  const source = path.join(workspace, 'zip-source');
  const zipRoot = path.join(source, 'anima-lt');
  const zipPath = path.join(workspace, `anima-lt-${version.replace(/\./g, '-')}.zip`);
  fs.mkdirSync(zipRoot, { recursive: true });
  fs.writeFileSync(path.join(zipRoot, 'style.css'), styleCss);
  fs.writeFileSync(path.join(zipRoot, 'index.php'), '<?php\n');

  execFileSync('zip', ['-q', '-r', zipPath, 'anima-lt'], { cwd: source });

  return zipPath;
}

test('installs the generated wp.org zip into the expected anima-lt sibling folder', () => {
  const { workspace, root } = makeFixture();
  makeZip(workspace, '2.0.23', makeThemeHeader());

  const target = path.join(workspace, 'anima-lt');
  fs.mkdirSync(target);
  fs.writeFileSync(path.join(target, 'old-file.txt'), 'stale');

  const result = installer.installWporgBuild({
    root,
    build: () => {},
    log: () => {},
  });

  assert.equal(result.version, '2.0.23');
  assert.equal(result.targetDir, target);
  assert.equal(fs.existsSync(path.join(target, 'old-file.txt')), false);
  assert.equal(fs.readFileSync(path.join(target, 'index.php'), 'utf8'), '<?php\n');

  const installedStyle = fs.readFileSync(path.join(target, 'style.css'), 'utf8');
  assert.match(installedStyle, /^Theme Name:\s*Anima LT$/m);
  assert.match(installedStyle, /^Text Domain:\s*anima-lt$/m);
  assert.match(installedStyle, /^Version:\s*2\.0\.23$/m);
});

test('detects the source version after the wp.org build updates style.css', () => {
  const { workspace, root } = makeFixture();
  fs.writeFileSync(path.join(root, 'style.css'), makeThemeHeader({
    name: 'Anima',
    version: '2.0.22',
    textDomain: '__theme_txtd',
  }));

  const result = installer.installWporgBuild({
    root,
    build: () => {
      fs.writeFileSync(path.join(root, 'style.css'), makeThemeHeader({
        name: 'Anima',
        version: '2.0.23',
        textDomain: '__theme_txtd',
      }));
      makeZip(workspace, '2.0.23', makeThemeHeader());
    },
    log: () => {},
  });

  assert.equal(result.version, '2.0.23');
  assert.match(fs.readFileSync(path.join(workspace, 'anima-lt', 'style.css'), 'utf8'), /^Version:\s*2\.0\.23$/m);
});

test('refuses to install when the source folder is not the anima sibling source', () => {
  const workspace = fs.mkdtempSync(path.join(os.tmpdir(), 'anima-wporg-install-'));
  const root = path.join(workspace, 'source-theme');
  fs.mkdirSync(root);
  fs.writeFileSync(path.join(root, 'style.css'), makeThemeHeader({
    name: 'Anima',
    textDomain: '__theme_txtd',
  }));

  assert.throws(
    () => installer.installWporgBuild({ root, build: () => {}, log: () => {} }),
    /source theme folder must be named "anima"/
  );
});

test('rejects a zip with wrong wp.org metadata before replacing the existing target', () => {
  const { workspace, root } = makeFixture();
  makeZip(workspace, '2.0.23', makeThemeHeader({ textDomain: 'anima' }));

  const target = path.join(workspace, 'anima-lt');
  fs.mkdirSync(target);
  fs.writeFileSync(path.join(target, 'style.css'), 'existing install\n');

  assert.throws(
    () => installer.installWporgBuild({ root, build: () => {}, log: () => {} }),
    /Text Domain must be "anima-lt"/
  );

  assert.equal(fs.readFileSync(path.join(target, 'style.css'), 'utf8'), 'existing install\n');
});
