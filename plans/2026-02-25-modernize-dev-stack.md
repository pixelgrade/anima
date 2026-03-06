# Modernize Development Stack Implementation Plan

**Status:** Implemented

## Current Status Snapshot

- The dev stack was modernized in commit `3d77a34f`
- Node requirement is now 22+
- `package.json` now requires `>=22.0.0`
- This document is now primarily a historical implementation record

**Goal:** Upgrade Anima's development toolchain from Node 16 to Node 22 LTS, update all build dependencies to current versions, and fix deprecations — while keeping the build output identical.

**Architecture:** The build already uses Gulp 4 + dart-sass + Webpack 5, so this is primarily a dependency version bump, not a structural rewrite. The key risk areas are: (1) packages that moved to ESM-only (del, gulp 5), (2) webpack config API changes between major versions, and (3) sass deprecation warnings becoming errors in newer sass versions. We stay on the same major versions where possible and only cross major boundaries when the current version is unmaintained or has security issues.

**Tech Stack:** Node 22 LTS, npm 10+, Gulp 4.x, Webpack 5.x, dart-sass 1.x, Babel 7.x

---

## Current State Assessment (completed)

**What already works on Node 22 (tested):**
- `npm install` — passes ✅
- `npx webpack --mode=production` — compiles JS ✅
- `npx gulp compile:styles` — compiles SCSS ✅ (deprecation warning: `fs.Stats constructor`)
- `npx gulp zip` — full build + ZIP ✅
- Output ZIP: `Anima-2-0-13.zip` (434 KB) ✅

**What needs fixing:**
1. `.nvmrc` says `16` — should say `22`
2. `package.json` `engines.node` says `>=16.13.0` — should say `>=22.0.0`
3. `del.sync()` in `tasks/build-folder.js` — deprecated, should use async `del()`
4. `fs` package (`0.0.2`) in devDependencies — this is a shim that does nothing, remove it
5. `child_process` package in devDependencies — built-in, doesn't need to be installed
6. `postcss-loader` webpack config uses deprecated `plugins` option format
7. Many packages are 2-4 years behind current versions
8. `node-tasks/lock_node_version.js` preinstall hook writes `.nvmrc` based on engines — works but could be simplified
9. Sass deprecation warnings (`fs.Stats constructor`) from older gulp plugins

**Risk assessment by package upgrade:**

| Package | Current → Target | Risk | Notes |
|---------|-----------------|------|-------|
| webpack | 5.72 → 5.105 | 🟢 Low | Minor version bump, backwards compatible |
| webpack-cli | 4.9 → 4.10 | 🟢 Low | Patch-level, stay on v4 (v6 requires webpack 5.75+) |
| sass | 1.51 → 1.97 | 🟡 Medium | More deprecation warnings but same output |
| @babel/core + presets | 7.17 → 7.29 | 🟢 Low | Minor bumps within Babel 7 |
| @wordpress/babel-preset | 6.9 → 6.17 | 🟢 Low | Stay on v6, v8 may need WP config changes |
| @wordpress/browserslist | 4.1.2 → 4.1.3 | 🟢 Low | Patch bump |
| autoprefixer | 10.4.5 → 10.4.24 | 🟢 Low | Patch bumps |
| browser-sync | 2.27 → 2.29 | 🟢 Low | Stay on v2, v3 is a major rewrite |
| css-loader | 6.7 → 6.11 | 🟢 Low | Minor bump within v6 |
| del | 6.0 → 6.1 | 🟢 Low | Stay on v6, v7+ is ESM-only |
| gulp | 4.0.2 → 4.0.2 | 🟢 None | Already current for v4 (v5 is ESM-only) |
| gulp-sass | 5.1 → 5.1 | 🟢 None | Stay on v5 (v6 needs gulp 5) |
| postcss-loader | 6.2 → 6.2 | 🟢 None | Stay on v6 (v7+ needs postcss-loader config changes) |
| mini-css-extract-plugin | 2.6 → 2.10 | 🟢 Low | Minor bump |
| terser-webpack-plugin | 5.3.1 → 5.3.16 | 🟢 Low | Patch bump |
| eslint | 8.14 → 8.57 | 🟢 Low | Stay on v8 (v9+ flat config) |

**NOT upgrading (intentionally):**
- `gulp` to v5 — ESM-only, requires rewriting all task files to `import`
- `webpack-cli` to v6 — requires webpack ≥5.75, adds no value for our config
- `del` to v7+ — ESM-only, would break CommonJS require()
- `postcss-loader` to v7+ — different config format, not worth the churn
- `sass-loader` to v13+ — requires webpack 5 peer changes, sass API v2
- `eslint` to v9+ — new flat config format, massive migration
- `browser-sync` to v3 — major breaking changes
- `cross-env` to v10 — ESM-only
- `jquery` to v4 — breaking changes, only used as webpack external anyway
- `@wordpress/babel-preset-default` to v8 — may change transpilation targets

---

## Task 1: Baseline — Save current build output for comparison

**Files:** None modified. Reference data only.

**Step 1: Build with Node 16 and save baseline**

```bash
export NVM_DIR="/Users/georgeolaru/.nvm" && source "/Users/georgeolaru/.nvm/nvm.sh" && nvm use 16
cd "/Users/georgeolaru/Local Sites/style-manager/app/public/wp-content/themes/anima"
npm run build
```

**Step 2: Save baseline artifacts**

```bash
mkdir -p /tmp/anima-baseline
cp style.css /tmp/anima-baseline/
cp style-rtl.css /tmp/anima-baseline/
cp dist/js/scripts.js /tmp/anima-baseline/
cp dist/js/scripts.min.js /tmp/anima-baseline/
cp dist/js/woocommerce.js /tmp/anima-baseline/
cp dist/js/editor.js /tmp/anima-baseline/
cp ../Anima-*.zip /tmp/anima-baseline/
ls -la /tmp/anima-baseline/
```

**Step 3: Record file sizes for comparison**

```bash
wc -c /tmp/anima-baseline/*
```

Expected: Files saved for later diffing.

---

## Task 2: Update .nvmrc and engine constraints

**Files:**
- Modify: `.nvmrc`
- Modify: `package.json`
- Modify: `node-tasks/lock_node_version.js`

**Step 1: Update .nvmrc**

Change contents from `16` to `22`.

**Step 2: Update package.json engines**

```json
"engines": {
    "node": ">=22.0.0",
    "npm": ">=10.0.0"
}
```

**Step 3: Verify lock_node_version.js still works**

```bash
export NVM_DIR="/Users/georgeolaru/.nvm" && source "/Users/georgeolaru/.nvm/nvm.sh" && nvm use 22
cd node-tasks && node lock_node_version.js
```

Expected: No error. `.nvmrc` rewritten to `22`, `.node-version` rewritten to `>=22.0.0`.

**Step 4: Commit**

```bash
git add .nvmrc package.json node-tasks/lock_node_version.js
git commit -m "Update Node requirement from 16 to 22 LTS"
```

---

## Task 3: Update package.json dependencies (safe bumps)

**Files:**
- Modify: `package.json`

**Step 1: Flatten devDependencies to dependencies**

Move all packages from `devDependencies` to `dependencies` and remove the `devDependencies` section. These themes don't publish to npm — the distinction is meaningless.

**Step 2: Remove fake built-in packages**

Remove these from dependencies — they're Node built-ins that don't need installing:
- `"fs": "^0.0.2"` — does nothing, Node has `fs` built-in
- `"child_process": "^1.0.2"` — does nothing, Node has `child_process` built-in
- `"path": "^0.12.7"` — does nothing, Node has `path` built-in

**Step 3: Update versions (within semver range)**

Update these to their latest compatible minor/patch versions:

```json
{
  "dependencies": {
    "@babel/core": "^7.29.0",
    "@babel/eslint-parser": "^7.28.6",
    "@babel/preset-react": "^7.28.5",
    "@wordpress/babel-preset-default": "^6.17.0",
    "@wordpress/browserslist-config": "^4.1.3",
    "autoprefixer": "^10.4.24",
    "babel-loader": "^8.4.1",
    "browser-sync": "^2.29.3",
    "browserslist": "^4.28.1",
    "colord": "^2.9.3",
    "cross-env": "^7.0.3",
    "css-loader": "^6.11.0",
    "cssnano": "^5.1.15",
    "del": "^6.1.1",
    "eslint": "^8.57.1",
    "gulp": "^4.0.2",
    "gulp-cached": "^1.1.1",
    "gulp-exec": "^5.0.0",
    "gulp-hub": "^4.2.0",
    "gulp-load-plugins": "^2.0.8",
    "gulp-notify": "^4.0.0",
    "gulp-rename": "^2.1.0",
    "gulp-replace": "^1.1.4",
    "gulp-rsync": "0.0.9",
    "gulp-rtlcss": "^2.0.0",
    "gulp-sass": "^5.1.0",
    "gulp-sort": "^2.0.0",
    "gulp-sourcemaps": "^3.0.0",
    "gulp-wp-pot": "^2.5.0",
    "jquery": "^3.7.1",
    "js-cookie": "^3.0.5",
    "mini-css-extract-plugin": "^2.10.0",
    "postcss-loader": "^6.2.1",
    "raw-loader": "^4.0.2",
    "sass": "^1.97.3",
    "sass-loader": "^12.6.0",
    "terser-webpack-plugin": "^5.3.16",
    "webpack": "^5.105.2",
    "webpack-cli": "^4.10.0"
  }
}
```

**Step 4: Clean install**

```bash
export NVM_DIR="/Users/georgeolaru/.nvm" && source "/Users/georgeolaru/.nvm/nvm.sh" && nvm use 22
rm -rf node_modules package-lock.json
npm install
```

Expected: Installs without errors. Deprecation warnings for older gulp plugins are acceptable.

**Step 5: Verify build**

```bash
npx webpack --mode=production --node-env=production
npx gulp compile:styles
```

Expected: Both succeed. JS and CSS output produced.

**Step 6: Commit**

```bash
git add package.json package-lock.json
git commit -m "Update dependencies to latest compatible versions

Flatten devDependencies into dependencies (not published to npm).
Remove fake built-in packages (fs, child_process, path).
Update all packages to latest minor/patch within current major."
```

---

## Task 4: Fix del.sync() deprecation in build-folder.js

**Files:**
- Modify: `tasks/build-folder.js`

**Step 1: Replace del.sync() with async del()**

In `tasks/build-folder.js`, change the `removeUnneededFiles` function:

```js
// BEFORE (line 50)
return del.sync( files_to_remove, {force: true} );

// AFTER
return del( files_to_remove, {force: true} );
```

The function is already `async`, and `del()` returns a Promise. Gulp 4 handles Promises natively, so `return del(files)` signals task completion correctly.

**Step 2: Test the build folder task**

```bash
export NVM_DIR="/Users/georgeolaru/.nvm" && source "/Users/georgeolaru/.nvm/nvm.sh" && nvm use 22
npx gulp zip
```

Expected: ZIP created successfully. Check `../Anima-*.zip` exists.

**Step 3: Commit**

```bash
git add tasks/build-folder.js
git commit -m "Replace del.sync() with async del() in build task

del.sync() is deprecated. del() returns a Promise which Gulp 4
handles natively. The function was already async."
```

---

## Task 5: Fix webpack postcss-loader config deprecation

**Files:**
- Modify: `webpack.config.js`

**Step 1: Fix postcss-loader plugins option**

The current webpack config uses the old postcss-loader option format where `plugins` is a direct option. In postcss-loader v6+, plugins should be inside `postcssOptions`:

```js
// BEFORE
{
  loader: 'postcss-loader',
  options: {
    plugins: [ require( 'autoprefixer' ) ],
  },
},

// AFTER
{
  loader: 'postcss-loader',
  options: {
    postcssOptions: {
      plugins: [ require( 'autoprefixer' ) ],
    },
  },
},
```

**Step 2: Test webpack build**

```bash
export NVM_DIR="/Users/georgeolaru/.nvm" && source "/Users/georgeolaru/.nvm/nvm.sh" && nvm use 22
npx webpack --mode=production --node-env=production
```

Expected: Compiles successfully, no deprecation warnings about postcss-loader options.

**Step 3: Commit**

```bash
git add webpack.config.js
git commit -m "Fix postcss-loader config to use postcssOptions

The plugins option must be nested inside postcssOptions for
postcss-loader v6+."
```

---

## Task 6: Update CLAUDE.md prerequisites

**Files:**
- Modify: `CLAUDE.md`

**Step 1: Update the prerequisites section**

Change the Node version references:
- `.nvmrc` = 22
- `nvm use 22` instead of `nvm use 16`
- engines `>=22.0.0`

Update all `nvm use 16` commands throughout the file to `nvm use 22`.

**Step 2: Commit**

```bash
git add CLAUDE.md
git commit -m "Update CLAUDE.md for Node 22 LTS requirement"
```

---

## Task 7: Compare build output against baseline

**Files:** None modified. Verification only.

**Step 1: Full build with Node 22**

```bash
export NVM_DIR="/Users/georgeolaru/.nvm" && source "/Users/georgeolaru/.nvm/nvm.sh" && nvm use 22
cd "/Users/georgeolaru/Local Sites/style-manager/app/public/wp-content/themes/anima"
npm run build
```

**Step 2: Compare unminified JS (should be identical)**

```bash
diff /tmp/anima-baseline/scripts.js dist/js/scripts.js
diff /tmp/anima-baseline/woocommerce.js dist/js/woocommerce.js
diff /tmp/anima-baseline/editor.js dist/js/editor.js
```

Expected: Identical or near-identical. Minor whitespace differences from newer webpack are acceptable.

**Step 3: Compare CSS (may have formatting differences)**

```bash
diff <(tr -d '[:space:]' < /tmp/anima-baseline/style.css) \
     <(tr -d '[:space:]' < style.css)
```

Expected: Identical when whitespace-stripped. Dart-sass minor version bumps don't change output semantics, only formatting.

**Step 4: Compare minified JS sizes**

```bash
wc -c /tmp/anima-baseline/scripts.min.js dist/js/scripts.min.js
```

Expected: Within 5% of each other. Newer terser may produce slightly different but equivalent minification.

**Step 5: Compare ZIP sizes**

```bash
ls -la /tmp/anima-baseline/Anima-*.zip ../Anima-*.zip
```

Expected: Similar sizes (within 10%).

**Step 6: Verify ZIP contents**

```bash
mkdir -p /tmp/anima-new
unzip -q ../Anima-*.zip -d /tmp/anima-new
diff -rq /tmp/anima-baseline-extracted/ /tmp/anima-new/anima/ 2>/dev/null | head -20
```

Expected: Only CSS/JS files differ (formatting/minification). No missing or extra files.

---

## Task 8: Add .zipignore entry for plans directory

**Files:**
- Modify: `.zipignore`

**Step 1: Add plans/ to .zipignore**

Add `plans` line under the `# Anima specifics` section.

**Step 2: Commit**

```bash
git add .zipignore
git commit -m "Exclude plans/ directory from theme ZIP"
```

---

## Summary of Changes

| File | Change |
|------|--------|
| `.nvmrc` | `16` → `22` |
| `package.json` | Engines to Node ≥22, flatten deps, remove fake built-ins, bump versions |
| `package-lock.json` | Regenerated |
| `tasks/build-folder.js` | `del.sync()` → `del()` |
| `webpack.config.js` | `plugins` → `postcssOptions.plugins` |
| `CLAUDE.md` | All `nvm use 16` → `nvm use 22` |
| `.zipignore` | Add `plans` |

## What This Does NOT Change

- **No Gulp 4 → 5 migration** — Gulp 5 is ESM-only, would require rewriting every task file from `require()` to `import`. Not worth the effort for a build system that works.
- **No Webpack 5 → 6 migration** — Webpack 6 doesn't exist yet. Webpack 5 is current.
- **No ESLint flat config migration** — Would require rewriting ESLint config from scratch.
- **No Sass @use/@forward migration** — Would require rewriting all SCSS source files. The `@import` deprecation warnings from dart-sass are cosmetic; CSS output is correct.
- **No switch to modern bundler** (Vite, esbuild, Turbopack) — Would be a complete rewrite of the build pipeline for a mature theme that ships as a ZIP.

## Future Considerations (not part of this plan)

- **Sass @import → @use migration** — When dart-sass eventually removes `@import` support (Sass 3.0, no date set), all SCSS files will need rewriting. This is a large effort best done as a dedicated project.
- **Gulp → npm scripts** — The gulp tasks are simple enough that they could be replaced with npm scripts + direct CLI calls. Lower priority since Gulp 4 works fine.
- **ESM migration** — When Node drops CommonJS support (not planned), task files will need `import` syntax. Very far future.
