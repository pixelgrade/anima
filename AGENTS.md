# Anima Theme - Development Guide

## Overview

Anima is a WordPress block theme (FSE) by Pixelgrade. It serves as the universal base for Pixelgrade LT themes (Rosa LT, Felt LT, Julia LT, Mies LT). Heavily integrated with **Style Manager** (color/font system) and **Nova Blocks** (block library).

GitHub: `git@github.com:pixelgrade/anima.git`

## Private Local Files

- Keep machine-specific notes in `AGENTS.local.md` or `.claude/napkin.md`.
- Keep local env values in `.env.local`.
- Do not commit those private overlays; commit only the `*.example` files.
- Use `bin/bootstrap-private` to hydrate the private overlays after cloning the public repo.

Clone/bootstrap flow for a fresh machine:
```bash
# 1. Clone the public repo
git clone git@github.com:pixelgrade/anima.git
cd anima

# 2. Point the repo at your private companion repo
git config --local anima.privateRepo git@github.com:<you>/anima-private.git

# 3. Hydrate the private local overlays
bin/bootstrap-private
```

What gets pulled from the private repo when present:
- `AGENTS.local.md`
- `.claude/napkin.md`
- `.env.local`

If you prefer to keep an explicit local checkout of the private repo, use:
```bash
git clone git@github.com:<you>/anima-private.git /path/to/anima-private
bin/bootstrap-private --source-dir /path/to/anima-private
```

## Critical Warnings

- **Node 22+ required** (`.nvmrc` = 22, `package.json` engines `>=22.0.0`). Enforced by `node-tasks/lock_node_version.js` on `npm install`.
- **`npm run build` creates the ZIP** — it runs webpack, gulp styles, AND `gulp zip` in sequence. The build deletes `../build/` before creating it, so a failed build mid-way can leave the theme without a build folder.
- **AGENTS.md and CLAUDE.md are excluded from the ZIP** via `.zipignore` — keep it that way.
- **`style.css` is compiled output** — never edit it directly. Source is in `src/scss/`.
- **Text domain `__theme_txtd`** is a placeholder replaced with `anima` during the build process. Use `__theme_txtd` in source PHP/JS/CSS files.

## Prerequisites

```bash
export NVM_DIR="/Users/georgeolaru/.nvm" && source "/Users/georgeolaru/.nvm/nvm.sh" && nvm use 22
```

## Build & Release

### Full build + ZIP (single command):

```bash
export NVM_DIR="/Users/georgeolaru/.nvm" && source "/Users/georgeolaru/.nvm/nvm.sh" && nvm use 22
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

Output: `../Anima-X-Y-Z.zip` (one directory up from the theme).

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

# Must NOT contain AGENTS.md, CLAUDE.md, src/, node_modules/, or dev config
unzip -l ../Anima-X-Y-Z.zip | grep -E "AGENTS.md|CLAUDE.md|/src/|node_modules|webpack"

# Check version
unzip -p ../Anima-X-Y-Z.zip anima/style.css | head -15
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

### Pile Cards Hover Border

- The stacked Cards Collection `Pile` hover frame belongs to the hover effect, not to page transitions.
- Render the frame on `.nb-supernova-item__media-wrapper::after` inside `src/scss/utility/_collection-hover-pile.scss`. Page transitions should only suppress the effect during transitions in `src/scss/components/_page-transitions.scss`.
- Keep the frame visually inside the card with `box-shadow: inset ...`, then add the hover border size to the inner-container padding on hover so the title/meta clear the frame instead of overlapping it.
- For editor parity, remove the core `.nb-supernova-item__content::before` / `::after` flex spacers inside the Pile scope; otherwise the editor shows extra top/bottom inset even when `Content Area Padding` is `0`.
- Respect Supernova's native `Content Area Padding`. A value of `0` must still let the top and bottom meta sit flush against the card edges.

### Navigation Menus

Four registered menus: `primary`, `secondary`, `tertiary`, `search-suggestions`.

### WooCommerce

Template overrides in `woocommerce/`, dedicated styles in `src/scss/woocommerce/`, and scripts in `src/js/woocommerce.js`.

## LT Full-Stack Smoke Test & Onboarding

Full CLI setup + browser onboarding for LT theme sites (Rosa LT, Felt LT, Julia LT, Mies LT) is documented in the **`lt-test-site` skill** (`~/.claude/skills/lt-test-site/SKILL.md`, also at `~/.codex/skills/lt-test-site/SKILL.md`).

Usage: "Spin up a test site for Mies" — the skill automates Studio site creation, GitHub release ZIP install, and Playwriter-driven onboarding (impersonate, OAuth, license selection, starter content import).

## Workflow: Fixes and Improvements

Every fix or improvement **must** follow this workflow:

1. **Create a GitHub issue** describing the problem and root cause
2. **Assign it to the latest open milestone** (or create a new one if none exists)
3. **Commit with `Fixes #N`** in the message to auto-close the issue on push
4. **Push to main** — the issue closes automatically

This applies to both this repo (`pixelgrade/anima`) and the plugin repo (`pixelgrade/style-manager`).

```bash
# Example workflow
gh issue create --title "Fix XSS in widget output" --milestone "2.0.13"
# ... apply fix ...
git add inc/widgets.php
git commit -m "Escape widget output to prevent stored XSS

Fixes #123"
git push origin main
# Issue #123 closes automatically
```

## Release Process

### 1. Create a milestone (if needed)

```bash
gh api repos/:owner/:repo/milestones -f title="X.Y.Z" -f state="open"
```

Assign all relevant issues to it. If issues were on a previous milestone, move them:
```bash
gh api repos/:owner/:repo/issues/NNN -X PATCH -f milestone=<milestone_number>
```

### 2. Bump the version

Edit `src/scss/style.scss` — change the `Version:` line in the theme header comment:
```
Version: X.Y.Z
```

This is the **only** place to change the version. The build reads it from the compiled `style.css` header to name the ZIP file.

### 3. Build the ZIP

```bash
export NVM_DIR="/Users/georgeolaru/.nvm" && source "/Users/georgeolaru/.nvm/nvm.sh" && nvm use 22
cd "/Users/georgeolaru/Local Sites/style-manager/app/public/wp-content/themes/anima"
npm run build
```

Output: `../Anima-X-Y-Z.zip` (one directory up from the theme).

Verify:
```bash
ls -la ../Anima-X-Y-Z.zip
unzip -p ../Anima-X-Y-Z.zip anima/style.css | head -8   # confirm version
unzip -l ../Anima-X-Y-Z.zip | grep -E "AGENTS.md|CLAUDE.md|/src/|node_modules"  # must be empty
```

### 4. Commit, tag, and push

```bash
git add src/scss/style.scss style.css style-rtl.css dist/ languages/anima.pot
git commit -m "Bump version to X.Y.Z"
git push origin main

git tag -f X.Y.Z
git push origin X.Y.Z --force
```

### 5. Create the GitHub release

Write a changelog in the wupdates style (https://wupdates.com/anima-changelog):
- One bullet per user-visible change
- Order by user impact (most visible first)
- Link each item to its GitHub issue(s)
- Group related low-level fixes (e.g., security) into single bullets

```bash
gh release create X.Y.Z ../Anima-X-Y-Z.zip --title "X.Y.Z" --notes "$(cat <<'EOF'
* User-visible change description. ([#N](https://github.com/pixelgrade/anima/issues/N))
* Another change. ([#M](https://github.com/pixelgrade/anima/issues/M), [#K](https://github.com/pixelgrade/anima/issues/K))
EOF
)"
```

### 6. Verify

- Release appears at https://github.com/pixelgrade/anima/releases
- ZIP is attached and downloadable
- Issues auto-closed via `Fixes #N` in earlier commits
- Milestone issues all closed → close the milestone if done

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

## Security Fixes (Milestone 2.0.13)

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

## Browser Automation Note

- For browser video recordings, use Playwriter native tab-capture only (`recording.start` / `recording.stop`).
- Do not use screenshot-sequence or other fallback methods to synthesize videos.
