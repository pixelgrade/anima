# Anima Theme - Development Guide

## Overview

Anima is a WordPress block theme (FSE) by Pixelgrade. It serves as the universal base for Pixelgrade LT themes (Rosa LT, Felt LT, Julia LT, Mies LT). Heavily integrated with **Style Manager** (color/font system) and **Nova Blocks** (block library).

GitHub: `git@github.com:pixelgrade/anima.git`

## Critical Warnings

- **Node 16+ required** (`.nvmrc` = 16, `package.json` engines `>=16.13.0`). Enforced by `node-tasks/lock_node_version.js` on `npm install`.
- **`npm run build` creates the ZIP** — it runs webpack, gulp styles, AND `gulp zip` in sequence. The build deletes `../build/` before creating it, so a failed build mid-way can leave the theme without a build folder.
- **CLAUDE.md is excluded from the ZIP** via `.zipignore` — keep it that way.
- **`style.css` is compiled output** — never edit it directly. Source is in `src/scss/`.
- **Text domain `__theme_txtd`** is a placeholder replaced with `anima` during the build process. Use `__theme_txtd` in source PHP/JS/CSS files.

## Prerequisites

```bash
export NVM_DIR="/Users/georgeolaru/.nvm" && source "/Users/georgeolaru/.nvm/nvm.sh" && nvm use 16
```

## Build & Release

### Full build + ZIP (single command):

```bash
export NVM_DIR="/Users/georgeolaru/.nvm" && source "/Users/georgeolaru/.nvm/nvm.sh" && nvm use 16
cd "/Users/georgeolaru/Local Sites/style-manager/app/public/wp-content/themes/anima"
npm run build
```

### What `npm run build` does:

1. `webpack --mode=production` — compiles JS entry points to `dist/js/`
2. `gulp compile:styles` — compiles SCSS to CSS in `dist/css/` (with RTL variants)
3. `gulp zip` — runs the full packaging pipeline:
   - `build:translate` — generates `.pot` file
   - `build:folder` — rsync to `../build/anima/`, removes files per `.zipignore`
   - `build:fix` — fixes permissions (755/644), line endings (UNIX), replaces `__theme_txtd` with `anima`
   - `build:zip` — creates `../Anima-X-Y-Z.zip`, deletes build folder

Output: `../Anima-2-0-12.zip` (one directory up from the theme).

### Development mode:

```bash
npm run dev
```

Runs webpack in watch mode + gulp dev (BrowserSync + SCSS watch).

### Build only styles or scripts:

```bash
npm run styles   # gulp compile:styles only
npm run scripts  # webpack production only
```

### Verify the ZIP:

```bash
# Check size (should be reasonable, not tiny)
ls -la ../Anima-*.zip

# Must NOT contain CLAUDE.md, src/, node_modules/, or dev config
unzip -l ../Anima-2-0-12.zip | grep -E "CLAUDE.md|/src/|node_modules|webpack"

# Check version
unzip -p ../Anima-2-0-12.zip anima/style.css | head -15
```

## Project Structure

```
anima/
├── assets/            # Static assets (fonts, images, separators)
├── dist/              # Compiled output (JS + CSS) — committed to git
│   ├── css/           # Compiled stylesheets + RTL variants
│   └── js/            # Compiled scripts + minified versions
├── inc/               # PHP includes
│   ├── admin/         # Customizer, nav menu admin
│   ├── fse/           # Full Site Editing patterns
│   ├── integrations/  # Plugin integrations
│   │   ├── style-manager/  # Style Manager (colors, fonts, layouts)
│   │   ├── novablocks.php
│   │   ├── jetpack.php
│   │   └── woocommerce.php
│   ├── required-plugins/   # TGM Plugin Activation
│   └── upgrade/       # Theme upgrade routines
├── languages/         # Translation files (.pot)
├── parts/             # FSE template parts (header.html, footer.html)
├── src/               # Source files (excluded from ZIP)
│   ├── js/            # JavaScript source
│   │   ├── scripts.js       # Main entry (App component)
│   │   ├── woocommerce.js   # WooCommerce entry
│   │   ├── editor.js        # Block editor entry
│   │   ├── components/      # JS components (navbar, hero, search-overlay)
│   │   ├── blocks/          # Block filters (button, paragraph, separator)
│   │   └── admin/           # Customizer scripts
│   └── scss/          # SCSS source
│       ├── style.scss       # Main entry point
│       ├── setup/           # Variables, mixins, functions, typography
│       ├── components/      # UI component styles
│       ├── blocks/          # Block styles (core, Nova Blocks, WooCommerce)
│       ├── custom-properties/ # CSS variable definitions
│       ├── woocommerce/     # WooCommerce overrides
│       └── utility/         # Utility classes
├── tasks/             # Gulp build tasks
├── templates/         # FSE block templates (25+ HTML files)
├── woocommerce/       # WooCommerce template overrides
├── functions.php      # Theme setup and initialization
├── style.css          # Compiled main stylesheet (with theme header)
├── theme.json         # Block theme configuration (v2)
├── webpack.config.js  # Webpack config
├── gulpfile.js        # Gulp task registry
└── package.json       # Dependencies and scripts
```

## Webpack Entry Points

| Entry | Source | Output |
|-------|--------|--------|
| scripts | `src/js/scripts.js` | `dist/js/scripts.js` + `.min.js` |
| woocommerce | `src/js/woocommerce.js` | `dist/js/woocommerce.js` + `.min.js` |
| editor | `src/js/editor.js` | `dist/js/editor.js` + `.min.js` |
| customizer-nav-menus | `src/js/admin/customizer-nav-menus.js` | `dist/js/admin/customizer-nav-menus.js` + `.min.js` |

Externals: `React` and `jQuery` are provided by WordPress.

## Key Architecture

### Style Manager Integration

The theme's visual design (colors, fonts, spacing) is controlled by the **Style Manager** plugin via:
- `inc/integrations/style-manager/` — connected fields, color palettes, font palettes, layout options
- CSS custom properties prefixed with `--sm-` (e.g., `--sm-current-accent-color`)
- `theme.json` restricts custom colors/fonts to enforce Style Manager control

### Full Site Editing (FSE)

- Block templates in `templates/` (index, single, page, archive, search, 404, etc.)
- Template parts in `parts/` (header, footer)
- Block patterns in `inc/fse/patterns/`
- Custom template canvas in `inc/fse/template-canvas.php`

### Nova Blocks Integration

Defined in `inc/integrations/novablocks.php`. Provides custom separator markup, hero block support, and color signal classes.

### Navigation Menus

Four registered menus: `primary`, `secondary`, `tertiary`, `search-suggestions`.

### WooCommerce

Template overrides in `woocommerce/`, dedicated styles in `src/scss/woocommerce/`, and scripts in `src/js/woocommerce.js`.

## Version Bump Checklist

When changing the version, update:
- [ ] `style.css` header → `Version: X.Y.Z` (in the compiled output — rebuild after changing source)
- [ ] Source SCSS that generates `style.css` if version is embedded there

The build system reads the version from the `style.css` header to name the ZIP file.

## Release on GitHub

```bash
git add <files>
git commit -m "message"
git push origin main

# Tag and release
git tag -f X.Y.Z
git push origin X.Y.Z --force

# Create release with ZIP
gh release create X.Y.Z ../Anima-X-Y-Z.zip --title "X.Y.Z - Title" --notes "Release notes"
```

## Legacy Decisions to Review

This theme was originally built around WordPress 5.8–5.9 (2021–2022). Several decisions made sense at the time but conflict with how the block editor (Gutenberg) works in WordPress 6.x+. When investigating bugs, **check `inc/block-editor.php` first** — it aggressively disables core block features.

### Known issues already fixed

- **`wp_render_layout_support_flag` was removed** (`inc/block-editor.php`). This filter processes block `layout` attributes (flex alignment, content justification) into CSS. Without it, alignments set in the editor (e.g., centered buttons) had no effect on the frontend. Fixed in 2.0.12 (#348).

### Still disabled — may cause future issues

- **`wp_enqueue_global_styles` removed** (`inc/block-editor.php`). Disables WordPress global styles (from `theme.json`). The theme uses Style Manager instead, but this may break core blocks that depend on global CSS custom properties as WordPress evolves.
- **`wp_render_duotone_support` removed** (`inc/block-editor.php`). Disables duotone image filters set in the editor. Any duotone settings users apply to images will not render on the frontend.
- **`wp_restore_group_inner_container` removed** (`inc/block-editor.php`). Disables the inner container wrapper for Group blocks, which may affect layout in certain configurations.
- **`theme.json` disables most settings** — custom colors, gradients, font sizes, spacing, borders are all set to `false`. This forces users through Style Manager but prevents use of native block editor design controls. As WordPress block capabilities grow, these restrictions may feel increasingly limiting.
- **`"layout": {}` in `theme.json`** is empty. This means no `contentSize` or `wideSize` is defined, so WordPress doesn't generate default layout constraint styles. The theme handles layout widths entirely through its own CSS.
- **`"spacing": { "blockGap": null }`** disables block gap support. WordPress uses this for vertical spacing between blocks. The theme uses its own spacing system (Nova Blocks `--nb-*` variables) instead.

### General guidance

When a block editor feature "doesn't work on the frontend," the first place to look is `inc/block-editor.php` — it's likely being explicitly disabled. Before re-enabling a filter, test that the theme's CSS doesn't conflict with the generated WordPress styles.

## Security Fixes (Milestone 2.0.12)

### High — Stored XSS (fixed)

- **#349** — Menu item badge: `esc_html()` (`inc/admin/class-admin-nav-menus.php:977`)
- **#350** — Menu item description: `wp_kses_post()` (`inc/extras.php:380`)
- **#351** — WooCommerce product title: `esc_html()` (`inc/integrations/woocommerce.php:288`)

### Medium — Input/output sanitization (fixed)

- **#352** — Search query: `esc_attr()` on `get_search_query()` (`inc/admin/class-admin-nav-menus.php:834`)
- **#353** — Body class options: `sanitize_html_class()` (`inc/template-functions.php:69,77`)
- **#354** — Transparent logo sanitize callback: `absint()` (`inc/admin/class-admin-customize.php:104`)
- **#355** — Separator symbol: allowlist validation before `get_template_part()` (`inc/integrations/novablocks.php:171`)
- **#356** — Upgrade notice: `esc_html()` on theme name and version (`inc/upgrade/class-Anima_Upgrade.php:148`)
- **#361** — `save_custom_fields` nonce: relies on WP core nonce (no code change, documented)

### Low — Defense-in-depth (fixed)

- **#357** — Admin field labels/IDs: `esc_attr()` and `esc_html()` (`inc/admin/class-admin-nav-menus.php:226-230,586-590`)
- **#358** — Pixelgrade Care installer: `esc_html()` on title, `esc_js()` on status (`inc/integrations/pixelgrade-care.php:139,188`)
- **#359** — CSS selector output: `esc_html()` (`inc/admin/class-admin-nav-menus.php:292`)
- **#360** — Removed unused `debug()` method with `var_dump()` (`inc/upgrade/class-Anima_Upgrade.php:176`)

## Coding Conventions

- **PHP**: WordPress coding standards. Tab indentation (4 spaces wide).
- **JS**: WordPress Babel preset. Space indentation (2 spaces).
- **SCSS**: Space indentation (2 spaces). BEM-like naming (`.c-component__element`).
- **Text domain**: Always use `__theme_txtd` in source (replaced at build time).
- **CSS custom properties**: `--sm-*` from Style Manager, `--nb-*` from Nova Blocks.
- **Editor config**: `.editorconfig` defines indentation rules per file type.
