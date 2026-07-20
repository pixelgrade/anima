# Anima Theme - Development Guide

## Overview

Anima is a WordPress block theme (FSE) by Pixelgrade. It serves as the universal base for Pixelgrade LT themes (Rosa LT, Felt LT, Julia LT, Mies LT). Heavily integrated with **Style Manager** (color/font system) and **Nova Blocks** (block library).

GitHub: `git@github.com:pixelgrade/anima.git`
WordPress.org: https://wordpress.org/themes/anima-lt/ (`anima-lt`, public Anima LT build)

## Private Local Files

- Keep `AGENTS.md` as the canonical shared instruction file for both Codex and Claude.
- Keep `CLAUDE.md` as a thin shim to `@AGENTS.md` so the shared instructions stay in one place.
- Keep shared private agent instructions in `AGENTS.local.md`.
- Keep vendor-neutral private research notes, plans, issue writeups, and draft docs in `.ai/docs/`.
- Keep tool-specific distilled working memory in `.claude/napkin.md`.
- Keep local env values in `.env.local`.
- Do not commit those private overlays; commit only the `*.example` files.
- Use `bin/bootstrap-private` to hydrate the private overlays after cloning the public repo.

Clone/bootstrap flow for a fresh machine:
```bash
# 1. Clone the public repo
git clone git@github.com:pixelgrade/anima.git
cd anima

# 2. Point the repo at the shared private companion repo
git config --local anima.privateRepo git@github.com:pixelgrade/anima-private.git

# 3. Hydrate the private local overlays
bin/bootstrap-private
```

What gets pulled from the private repo when present:
- `AGENTS.local.md`
- `.ai/`
- `.claude/napkin.md`
- `.env.local`

If you prefer to keep an explicit local checkout of the private repo, use:
```bash
git clone git@github.com:pixelgrade/anima-private.git /path/to/anima-private
bin/bootstrap-private --source-dir /path/to/anima-private
```

How later private-overlay changes are handled:
- `bin/bootstrap-private` only manages these top-level targets: `AGENTS.local.md`, `.ai/`, `.claude/napkin.md`, and `.env.local`.
- In the default copy mode, rerun `bin/bootstrap-private --force` when one of those targets changed in the private repo and you want to replace your local copy.
- New files added inside `.ai/` are treated as part of the `.ai/` target, so copy mode still needs `--force` to refresh that directory.
- If you bootstrap with `--link`, later changes inside the private repo show up through the symlink without recopies.
- If you introduce a brand-new private path outside those managed targets, update `bin/bootstrap-private`, `.gitignore`, and `.zipignore` before expecting it to sync.

## Cross-Stack Strategy Decisions

When Anima LT work changes or settles product, business, positioning, monetization, Pixelgrade.com, Pixelgrade LT vs Pixelgrade Plus, starter strategy, or cross-repo LT stack architecture, save the durable decision in the central strategy folder:

`/Users/georgeolaru/Developer/pixelsite/master-strategy/`

Before making or changing those decisions, read:
- `/Users/georgeolaru/Developer/pixelsite/master-strategy/README.md`
- `/Users/georgeolaru/Developer/pixelsite/master-strategy/decisions/README.md`
- `/Users/georgeolaru/Developer/pixelsite/master-strategy/pixelgrade-lt-stack-strategy.md`
- `/Users/georgeolaru/Developer/pixelsite/master-strategy/source-index.md`

For any meaningful cross-stack strategy decision:
- Create a dated note in `/Users/georgeolaru/Developer/pixelsite/master-strategy/decisions/YYYY-MM-DD-short-title.md` using the template in `decisions/README.md`.
- Update `source-index.md` when the decision depends on a new source document, repo note, issue, or public reference.
- Update `pixelgrade-lt-stack-strategy.md` only when the decision changes the central strategy.

Keep implementation details, tests, and repo-specific plans in the repo where the work happens. Keep cross-stack product direction, positioning, monetization, and Pixelgrade.com strategy in `pixelsite/master-strategy`.

## Critical Warnings

- **Node 22+ required** (`.nvmrc` = 22, `package.json` engines `>=22.0.0`). Enforced by `node-tasks/lock_node_version.js` on `npm install`.
- **`npm run build` creates the ZIP** — it runs webpack, gulp styles, AND `gulp zip` in sequence. The build deletes `../build/` before creating it, so a failed build mid-way can leave the theme without a build folder.
- **AGENTS.md, CLAUDE.md, `AGENTS.local.md`, `.ai/`, and `.private/` are excluded from the ZIP** via `.zipignore` — keep it that way.
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

### wp.org build variant:

```bash
npm run build:wporg   # or: WPORG_SLUG=<slug> npx gulp zip:wporg
```

Outputs `../anima-lt-X-Y-Z.zip` (default slug `anima-lt`; `anima` is taken on
wp.org by an unrelated theme). Differences from the commercial build, all
confined to `tasks/build-wporg.js` + `.zipignore-wporg` + the `wporg/` overlay:

- Strips the commercial distribution layer (`inc/distribution.php`,
  `inc/distribution/`, TGMPA, Pixelgrade Care) per `.zipignore-wporg`.
- Copies the `wporg/` overlay into the build root — overlay files overwrite
  same-named originals (readme.txt, screenshot.jpg, core-only templates/parts,
  patterns, style variations).
- Swaps `__theme_txtd` to the slug, rewrites `Theme Name:`/`Description:`,
  drops the `Pixelgrade Plugin Supports:` and `Update URI:` headers, and
  relaxes theme.json (palette, fonts, sizes, base styles) for the bare build.

Anima LT is approved and live on WordPress.org. Treat `npm run build:wporg` as
the update package builder for the public directory theme, not only as a review
candidate builder. Keep `wporg/readme.txt` `Stable tag` and changelog aligned
with the version being uploaded.

WordPress.org theme uploads must be performed while logged in as the theme
author account, `pixelgrade`. If the upload screen reports that `anima-lt` is
owned by a different author, the browser is authenticated as the wrong account.
Two-factor approval can return to the upload form; reselect the ZIP before
submitting again. WordPress.org repackages accepted downloads, so do not treat a
ZIP checksum mismatch as failure by itself. Download the official ZIP and compare
the extracted `anima-lt/` tree with the local build instead.

### Local Anima LT testing install:

Local development source stays in `themes/anima`. The sibling
`themes/anima-lt` folder is generated from the source theme plus the wp.org
overlay, and Studio targets sync `themes/anima-lt` through `wp-code-mirror`.
Do not edit `themes/anima-lt` directly; direct edits drift from the generated
artifact and can be lost on the next build.

After any source change that needs local/public-test verification, run:

```bash
export NVM_DIR="/Users/georgeolaru/.nvm" && source "/Users/georgeolaru/.nvm/nvm.sh" && nvm use 22
cd "/Users/georgeolaru/Local Sites/style-manager/app/public/wp-content/themes/anima"
npm run build:wporg:install
```

This command runs `npm run build:wporg`, finds the matching
`../anima-lt-X-Y-Z.zip`, replaces only the expected sibling `../anima-lt`
folder from that zip, and verifies that `../anima-lt/style.css` declares
`Theme Name: Anima LT`, `Text Domain: anima-lt`, and the source version. Then
`wp-code-mirror` can sync `themes/anima-lt` to Studio sites. To verify an
already-installed sibling without rebuilding, run
`node bin/install-wporg-build --verify-only`.

### Fresh Studio release smoke test (required):

Every theme release or update package must be tested on a brand-new WordPress
Studio site before it is published or called verified. This is separate from
Theme Check, existing Studio sites, `wp-code-mirror`, and the sibling
`themes/anima-lt` install. Run it for every generated release artifact that will
ship, including `../Anima-X-Y-Z.zip` and `../anima-lt-X-Y-Z.zip` when both are
part of the release.

The smoke test must install the generated ZIP archive itself. Prefer
`studio wp theme install /absolute/path/to/<zip> --activate`; if Studio's
sandbox cannot read the host ZIP, move/copy the ZIP inside the fresh site or use
the wp-admin theme upload flow. Direct extraction into `wp-content/themes/` is a
last-resort fallback and does not count as archive-install coverage unless the
installer path was separately exercised.

```bash
SMOKE_PATH="$HOME/Studio/anima-release-smoke-X-Y-Z-$(date +%Y%m%d-%H%M%S)"
studio site create --name "Anima X.Y.Z Smoke" --path "$SMOKE_PATH"
studio wp --path="$SMOKE_PATH" theme install "/absolute/path/to/Anima-X-Y-Z.zip" --activate
studio wp --path="$SMOKE_PATH" user update 1 --user_pass=admin

# Browser smoke: frontend, admin dashboard, Site Editor, and archive/single pages.
# Check browser console/network and PHP logs for new fatal errors.

studio site stop --path="$SMOKE_PATH"
studio site delete --path="$SMOKE_PATH" --files
```

Do not mark release/update verification complete until the final report states
the fresh site path/name, ZIP installed, smoke coverage, and deletion result. If
deletion fails, report the leftover path and cleanup blocker.

**Rules that keep the bare build submittable:**

- Remote/CDN or non-GPL assets (GSAP, SplitText, Snap.svg, pxgcdn webfonts)
  may only be registered inside `inc/distribution/` — never in `functions.php`
  or `inc/`. Treat their script handles as optional everywhere else
  (`wp_script_is( $handle, 'registered' )`).
- Style-Manager-only behavior (including `update_option( 'sm_*' )` calls and
  editor UI) must be gated on `anima_style_manager_is_active()` or on the
  distribution being present (`function_exists( 'anima_webfonts_fallback' )`).
- Verify with Theme Check before uploading a new WordPress.org version: the
  headless runner lives on the bare Studio test site —
  `studio wp eval-file wp-content/run-theme-check.php --path=~/Studio/anima-lt`.
  It must report PASS (no REQUIRED items).
  Before relying on this path, verify that the Studio site and runner file still
  exist. If the local runner has drifted, record the gap and use the WordPress.org
  scanner plus the fresh Studio archive smoke as the release gate until the local
  runner is restored.

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

### Block Layout Widths

- In WordPress 7+, `add_theme_support( 'align-wide' )` is not enough on a block theme. To restore the editor's `Wide` and `Full` controls inside post content, define `theme.json.settings.layout.contentSize` and `wideSize`.
- In Anima, those widths should come from `var(--nb-content-width)` and `var(--nb-container-width)`, not hardcoded values. They stay aligned with the Style Manager-generated site container and inset settings.
- Templates that render `post-content` should use `<!-- wp:post-content {"layout":{"inherit":true}} /-->`. Without inherited constrained layout, WordPress 7 may hide `Wide`/`Full` even if the theme-level widths exist.
- Old Tosca alignment fixtures may still show `unexpected or invalid content` in the editor because their serialized block markup predates current core/Nova output. That is separate from whether `Wide`/`Full` support is working.

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

**Page Transitions & WooCommerce:** All WooCommerce pages that carry complex JS state are excluded from AJAX (Barba.js) navigation — cart, checkout, my account, and single product pages. The exclusion list lives in `anima_page_transitions_get_excluded_urls()` (`inc/integrations/page-transitions.php`). Single products are excluded by matching the `/product/` permalink base (auto-adapts to custom permalink structures). This is a deliberate safety measure; WooCommerce scripts and inline state don't reliably survive AJAX DOM swaps. Future work may re-enable AJAX for some of these pages once compatibility is validated.

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

### 0. Refresh the central release cockpit

Before release planning, open
`/Users/georgeolaru/Developer/pixelgrade-release-ops`, pull `main`, and refresh
the Anima LT row in `README.md` from current source and public-channel evidence.
Repeat the refresh after publication and push the cockpit change before calling
the release complete.

The central cockpit's `.github/workflows/status-watch.yml` workflow is only a
durable notification signal: it periodically compares Anima's `main` version
with GitHub and WordPress.org, then creates or refreshes a cockpit issue when
they drift. It does not edit the cockpit snapshot, publish a release, or replace
the start/end refresh gate. Keeping this watcher in the private cockpit avoids
placing a reusable cross-repo credential in Anima's public repository.

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

Before committing, tagging, creating a GitHub release, uploading to WUpdates, or
submitting a WordPress.org update, run the mandatory fresh Studio release smoke
test above against the generated ZIP. If the release includes both commercial
and wp.org artifacts, smoke each ZIP that will ship.

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

### 6. Publish Anima LT to WordPress.org

When the public build is part of the release, upload the verified
`../anima-lt-X-Y-Z.zip` through `https://wordpress.org/themes/upload/` while
logged in as `pixelgrade`.

After upload, record:

- The Trac ticket URL, e.g. `https://themes.trac.wordpress.org/ticket/<ID>`.
- The SVN version directory and revision:
  ```bash
  svn info https://themes.svn.wordpress.org/anima-lt/X.Y.Z
  svn log https://themes.svn.wordpress.org/anima-lt --limit 1
  ```
- The official download URL:
  ```bash
  curl -I https://downloads.wordpress.org/theme/anima-lt.X.Y.Z.zip
  ```
- An extracted-content diff between the official WordPress.org download and the
  local `../anima-lt-X-Y-Z.zip`. WordPress.org may repackage the archive, so ZIP
  checksums can differ even when the shipped files match.

The public theme listing and `api.wordpress.org/themes/info` can lag behind SVN
and the direct download URL. Treat that as propagation lag only after SVN,
Trac, direct download, and extracted-content comparison are all verified.
Trac may also block non-browser requests with anti-abuse checks; in that case,
verify Trac in the browser and rely on SVN plus the direct download for scripted
evidence.

### 7. Publish to WUpdates

- Keep raw WUpdates host, port, and key material out of git. Store those only in local/private files such as `AGENTS.local.md`, `.ai/`, or `.claude/napkin.md`. This repo assumes a local `wupdates` SSH alias is already configured on the release machine.
- Product type: `wup_theme`
- Product slug: `anima`
- Release artifact: `../Anima-X-Y-Z.zip`
- After publishing the GitHub release, publish the same zip in WUpdates:
  1. `wp-admin` -> `Theme Versions` -> `Add New`
  2. Set parent theme to `Anima`
  3. Upload the versioned zip
  4. Fill `Version Name` with the exact semantic version
  5. Paste release notes into the version post body if the WUpdates changelog should be updated
  6. Save/publish the version post, then edit the parent `Anima` product and switch `Current Version` to that new version post
- SSH verification uses the live WUpdates WordPress install at `/home/wupdates/public_html`:
  - Resolve the product ID by slug:
    ```bash
    ssh wupdates 'WP=/home/wupdates/public_html; CLI="php $WP/cli/wp-cli.phar --path=$WP"; PREFIX=$($CLI db prefix); $CLI db query "SELECT ID FROM ${PREFIX}posts WHERE post_type = '\''wup_theme'\'' AND post_name = '\''anima'\'' LIMIT 1;"'
    ```
  - Verify the selected version:
    ```bash
    ssh wupdates 'php /home/wupdates/public_html/cli/wp-cli.phar --path=/home/wupdates/public_html post meta get <PRODUCT_ID> current_version'
    ssh wupdates 'php /home/wupdates/public_html/cli/wp-cli.phar --path=/home/wupdates/public_html post meta get <CURRENT_VERSION_ID> parent_product'
    ssh wupdates 'php /home/wupdates/public_html/cli/wp-cli.phar --path=/home/wupdates/public_html post meta get <CURRENT_VERSION_ID> version'
    ssh wupdates 'php /home/wupdates/public_html/cli/wp-cli.phar --path=/home/wupdates/public_html post meta get <CURRENT_VERSION_ID> zip_attachment_id'
    ssh wupdates 'php /home/wupdates/public_html/cli/wp-cli.phar --path=/home/wupdates/public_html post meta get <ZIP_ATTACHMENT_ID> _wp_attached_file'
    ```
  - `parent_product` must match `<PRODUCT_ID>`, and the attached file must be the expected versioned zip under `wp-content/uploads/...`.
- HTTP verification:
  - In the WUpdates product edit screen, copy the `Current Version URL`.
  - `curl -I '<CURRENT_VERSION_URL>'` should return a `302` to the expected versioned zip on `media.wupdates.com`.
  - `curl -L -o /tmp/anima.zip '<CURRENT_VERSION_URL>'` can be used for a full download smoke test when needed.
  - The generated `api_wupl_version` URL is HTTPS-only. The same path over plain HTTP returns `404`.

### 8. Verify

- The central release cockpit Anima LT row reflects the final source, GitHub,
  WordPress.org, and WUpdates state, and the refreshed snapshot is pushed
- Release appears at https://github.com/pixelgrade/anima/releases
- ZIP is attached and downloadable
- WUpdates `Current Version` points to the new version post
- If Anima LT was submitted to WordPress.org, Trac, SVN, the direct download URL,
  and extracted-content diff are verified; public API/listing propagation status
  is recorded separately
- Fresh Studio release smoke passed with the shipped ZIP archive installed on a
  brand-new site, and the temporary Studio site was deleted with files
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
- **`theme.json` layout widths are now required for block alignment UI**. Anima sets `contentSize` to `var(--nb-content-width)` and `wideSize` to `var(--nb-container-width)` so WordPress 7 exposes `Wide`/`Full` again. If those controls disappear, check both `theme.json.settings.layout` and whether the relevant `wp:post-content` block inherits layout.
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
