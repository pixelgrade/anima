# Editorial Frame Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add the reusable `Editorial Frame` chrome system to Anima so Hive LT can enable framed desktop chrome, a `chrome` menu location, automatic link treatment, and mobile menu merging without changing Nova Blocks or Style Manager core.

**Architecture:** Keep Style Manager option definitions theme-owned inside Anima, not plugin-owned. Render the frame shell through Anima’s FSE wrapper hooks, use menu filters to classify chrome items, and keep mobile behavior in a small front-end component that appends cloned `chrome` items to the bottom of the existing mobile menu.

**Tech Stack:** WordPress PHP, Anima theme hooks, Style Manager config filters, Sass, vanilla DOM logic in the existing theme JS app, `node:test`, `sass`, `studio wp eval-file`

---

## Preconditions

- Work from the Anima git checkout at `/Users/georgeolaru/Local Sites/style-manager/app/public/wp-content/themes/anima`.
- Do not touch the existing unrelated modification in `/Users/georgeolaru/Local Sites/style-manager/app/public/wp-content/themes/anima/test/post-expression-card-render.php`.
- Prefer a fresh worktree before execution because the main Anima checkout is already dirty.

## File Map

### Existing files to modify

- `/Users/georgeolaru/Local Sites/style-manager/app/public/wp-content/themes/anima/functions.php`
  - Register the `chrome` menu location and load new runtime code.
- `/Users/georgeolaru/Local Sites/style-manager/app/public/wp-content/themes/anima/inc/template-functions.php`
  - Only modify if the new runtime helper truly has to extend the existing body class filter instead of owning its own filter.
- `/Users/georgeolaru/Local Sites/style-manager/app/public/wp-content/themes/anima/inc/integrations/style-manager/style-manager.php`
  - Load the new Editorial Frame Style Manager config file.
- `/Users/georgeolaru/Local Sites/style-manager/app/public/wp-content/themes/anima/src/scss/style.scss`
  - Import the new component partial.
- `/Users/georgeolaru/Local Sites/style-manager/app/public/wp-content/themes/anima/src/js/components/app.js`
  - Initialize the Editorial Frame front-end component.

### New files to create

- `/Users/georgeolaru/Local Sites/style-manager/app/public/wp-content/themes/anima/inc/editorial-frame.php`
  - Own runtime option reads, body classes, menu item classification, monogram rendering, and chrome shell output hooks.
- `/Users/georgeolaru/Local Sites/style-manager/app/public/wp-content/themes/anima/inc/integrations/style-manager/editorial-frame.php`
  - Own the `sm_chrome_*` option definitions, section placement, and config cache invalidation logic.
- `/Users/georgeolaru/Local Sites/style-manager/app/public/wp-content/themes/anima/src/scss/components/_editorial-frame.scss`
  - Own desktop frame accents, right rail layout, monogram styling, and mobile hiding rules.
- `/Users/georgeolaru/Local Sites/style-manager/app/public/wp-content/themes/anima/src/js/components/editorial-frame.js`
  - Own mobile-menu append behavior and duplicate-guard logic.
- `/Users/georgeolaru/Local Sites/style-manager/app/public/wp-content/themes/anima/test/editorial-frame-config.php`
  - Contract-test menu registration, Style Manager config placement, and body classes.
- `/Users/georgeolaru/Local Sites/style-manager/app/public/wp-content/themes/anima/test/editorial-frame-render.php`
  - Contract-test rendered chrome shell markup and automatic menu-item treatment.
- `/Users/georgeolaru/Local Sites/style-manager/app/public/wp-content/themes/anima/test/editorial-frame-styles.test.js`
  - Sass contract test for the desktop frame, rail reservation, mobile hide rule, and monogram selector output.
- `/Users/georgeolaru/Local Sites/style-manager/app/public/wp-content/themes/anima/test/editorial-frame-mobile-menu.test.js`
  - Pure JS test for the mobile merge helper using fake menu/list objects.

### Build outputs expected to change

- `/Users/georgeolaru/Local Sites/style-manager/app/public/wp-content/themes/anima/style.css`
- `/Users/georgeolaru/Local Sites/style-manager/app/public/wp-content/themes/anima/dist/js/scripts.js`
- `/Users/georgeolaru/Local Sites/style-manager/app/public/wp-content/themes/anima/dist/js/scripts.min.js`

## Task 1: Add Editorial Frame Settings And Theme Contracts

**Files:**
- Create: `/Users/georgeolaru/Local Sites/style-manager/app/public/wp-content/themes/anima/test/editorial-frame-config.php`
- Create: `/Users/georgeolaru/Local Sites/style-manager/app/public/wp-content/themes/anima/inc/integrations/style-manager/editorial-frame.php`
- Modify: `/Users/georgeolaru/Local Sites/style-manager/app/public/wp-content/themes/anima/functions.php`
- Modify: `/Users/georgeolaru/Local Sites/style-manager/app/public/wp-content/themes/anima/inc/integrations/style-manager/style-manager.php`
- Create: `/Users/georgeolaru/Local Sites/style-manager/app/public/wp-content/themes/anima/inc/editorial-frame.php`

- [ ] **Step 1: Write the failing PHP contract test**

Create `test/editorial-frame-config.php` that:

- asserts `get_registered_nav_menus()` contains `chrome`
- asserts `apply_filters( 'style_manager/filter_fields', [] )` exposes:
  - `sm_chrome_preset`
  - `sm_chrome_menu_visibility`
  - `sm_chrome_frame_visibility`
  - `sm_chrome_color_role`
- asserts `apply_filters( 'style_manager/sm_panel_config', ... )` places those controls into a dedicated Editorial Frame section
- updates the relevant `sm_chrome_*` options and asserts `apply_filters( 'body_class', [] )` gains:
  - `has-editorial-frame`
  - `has-editorial-frame-menu`
  - `has-editorial-frame-frame`
  - a tone class such as `has-editorial-frame-tone-strong-contrast`

Use this shape:

```php
$config = apply_filters( 'style_manager/filter_fields', [] );
$style_manager_section = $config['sections']['style_manager_section'] ?? [];
$panel_config = apply_filters( 'style_manager/sm_panel_config', [ 'sections' => [] ], $style_manager_section );
$editorial_frame_section = $panel_config['sections']['sm_editorial_frame_section'] ?? null;
```

- [ ] **Step 2: Run the contract test and confirm it fails**

Run:

```bash
studio wp eval-file "/Users/georgeolaru/Local Sites/style-manager/app/public/wp-content/themes/anima/test/editorial-frame-config.php" --path "/Users/georgeolaru/Local Sites/style-manager/app/public"
```

Expected: FAIL because the `chrome` menu location, `sm_chrome_*` controls, and Editorial Frame body classes do not exist yet.

- [ ] **Step 3: Implement the minimal settings and runtime scaffolding**

Implement:

- `functions.php`
  - register `chrome` inside `register_nav_menus()`
  - `require_once` the new `inc/editorial-frame.php`
- `inc/integrations/style-manager/style-manager.php`
  - require `editorial-frame.php`
- `inc/integrations/style-manager/editorial-frame.php`
  - add the `sm_chrome_*` fields
  - move them into a dedicated `sm_editorial_frame_section`
  - invalidate cached Style Manager config when the new section or copy is missing/stale
- `inc/editorial-frame.php`
  - add helpers to read the `sm_chrome_*` options
  - add the Editorial Frame body classes through a dedicated `body_class` filter

Use option defaults:

```php
'sm_chrome_preset' => 'none',
'sm_chrome_menu_visibility' => true,
'sm_chrome_frame_visibility' => true,
'sm_chrome_color_role' => 'strong-contrast',
```

- [ ] **Step 4: Re-run the contract test and confirm it passes**

Run:

```bash
studio wp eval-file "/Users/georgeolaru/Local Sites/style-manager/app/public/wp-content/themes/anima/test/editorial-frame-config.php" --path "/Users/georgeolaru/Local Sites/style-manager/app/public"
```

Expected: PASS with a final line like `editorial frame config contract ok`.

- [ ] **Step 5: Commit the settings contract**

```bash
git -C "/Users/georgeolaru/Local Sites/style-manager/app/public/wp-content/themes/anima" add functions.php inc/editorial-frame.php inc/integrations/style-manager/style-manager.php inc/integrations/style-manager/editorial-frame.php test/editorial-frame-config.php
git -C "/Users/georgeolaru/Local Sites/style-manager/app/public/wp-content/themes/anima" commit -m "feat: add Editorial Frame settings contract"
```

## Task 2: Render The Desktop Chrome Shell And Automatic Item Treatment

**Files:**
- Create: `/Users/georgeolaru/Local Sites/style-manager/app/public/wp-content/themes/anima/test/editorial-frame-render.php`
- Modify: `/Users/georgeolaru/Local Sites/style-manager/app/public/wp-content/themes/anima/inc/editorial-frame.php`

- [ ] **Step 1: Write the failing render contract test**

Create `test/editorial-frame-render.php` that:

- programmatically creates a `chrome` menu with:
  - one normal link (`Read`)
  - one social link (`https://instagram.com/...`)
  - one Search extra (`#search` plus `menu-item--search`)
- assigns that menu to the `chrome` location
- enables the Editorial Frame options
- captures the output of the chrome render action
- asserts the markup includes:
  - top frame element
  - left frame element
  - rail navigation container
  - the normal link monogram wrapper
  - the social item class
  - the existing search extra class

Use this capture pattern:

```php
ob_start();
do_action( 'anima/template_html:before', 'main' );
$output = ob_get_clean();
```

The test should only assert chrome-shell fragments, not the whole page wrapper.

- [ ] **Step 2: Run the render contract test and confirm it fails**

Run:

```bash
studio wp eval-file "/Users/georgeolaru/Local Sites/style-manager/app/public/wp-content/themes/anima/test/editorial-frame-render.php" --path "/Users/georgeolaru/Local Sites/style-manager/app/public"
```

Expected: FAIL because no Editorial Frame shell or chrome menu treatment is rendered yet.

- [ ] **Step 3: Implement runtime rendering and item classification**

Update `inc/editorial-frame.php` to:

- render the fixed Editorial Frame shell from `anima/template_html:before` at a priority lower than the `#page` opener
- output:
  - top accent
  - left accent
  - rail container
  - a hidden mobile-source menu container for later JS merging
- classify `chrome` menu items via menu filters:
  - add `social-menu-item` for recognized social URLs
  - add `menu-item--editorial-frame-link` for ordinary text links
  - leave `menu-item--search` and other extras intact
- prepend a decorative monogram span for ordinary `chrome` items only

Use a helper boundary like:

```php
function anima_editorial_frame_get_item_kind( \WP_Post $item ): string
```

and branch to `social`, `extra`, or `regular`.

- [ ] **Step 4: Re-run the render contract test and confirm it passes**

Run:

```bash
studio wp eval-file "/Users/georgeolaru/Local Sites/style-manager/app/public/wp-content/themes/anima/test/editorial-frame-render.php" --path "/Users/georgeolaru/Local Sites/style-manager/app/public"
```

Expected: PASS with a final line like `editorial frame render contract ok`.

- [ ] **Step 5: Commit the desktop shell contract**

```bash
git -C "/Users/georgeolaru/Local Sites/style-manager/app/public/wp-content/themes/anima" add inc/editorial-frame.php test/editorial-frame-render.php
git -C "/Users/georgeolaru/Local Sites/style-manager/app/public/wp-content/themes/anima" commit -m "feat: render Editorial Frame shell"
```

## Task 3: Add Sass Coverage And Chrome Shell Styles

**Files:**
- Create: `/Users/georgeolaru/Local Sites/style-manager/app/public/wp-content/themes/anima/test/editorial-frame-styles.test.js`
- Create: `/Users/georgeolaru/Local Sites/style-manager/app/public/wp-content/themes/anima/src/scss/components/_editorial-frame.scss`
- Modify: `/Users/georgeolaru/Local Sites/style-manager/app/public/wp-content/themes/anima/src/scss/style.scss`

- [ ] **Step 1: Write the failing Sass contract test**

Create `test/editorial-frame-styles.test.js` that compiles `src/scss/style.scss` and asserts the output contains selectors for:

- `body.has-editorial-frame`
- `#page` right-padding reservation on desktop
- `.c-editorial-frame__rail`
- `.c-editorial-frame__top`
- `.c-editorial-frame__left`
- `.menu-item--editorial-frame-link > a .menu-item-monogram`
- a mobile breakpoint rule that hides `.c-editorial-frame__rail` and removes the right-padding reservation

Follow the same pattern used in `test/social-links.test.js`:

```js
const { css } = sass.compile(entryFile, { loadPaths: [...] });
const normalized = css.replace(/\s+/g, ' ');
```

- [ ] **Step 2: Run the Sass contract test and confirm it fails**

Run:

```bash
node --test "/Users/georgeolaru/Local Sites/style-manager/app/public/wp-content/themes/anima/test/editorial-frame-styles.test.js"
```

Expected: FAIL because the Editorial Frame selectors are not in the compiled CSS yet.

- [ ] **Step 3: Implement the Editorial Frame Sass partial**

Create `src/scss/components/_editorial-frame.scss` and import it from `src/scss/style.scss`.

Style requirements:

- desktop frame accents
- right rail fixed to the viewport
- `#page` right padding reservation when frame/menu is active
- monogram badge layout for ordinary links
- safe spacing for social and extra-item links inside the rail
- hide the frame and rail on small screens
- remove desktop reservation on small screens

Use CSS variables for shell sizing:

```scss
--editorial-frame-top-size: 12px;
--editorial-frame-left-size: 48px;
--editorial-frame-rail-width: 60px;
```

- [ ] **Step 4: Re-run the Sass contract test and build styles**

Run:

```bash
node --test "/Users/georgeolaru/Local Sites/style-manager/app/public/wp-content/themes/anima/test/editorial-frame-styles.test.js"
npm --prefix "/Users/georgeolaru/Local Sites/style-manager/app/public/wp-content/themes/anima" run styles
```

Expected:

- test PASS
- `style.css` updates without Sass errors

- [ ] **Step 5: Commit the style layer**

```bash
git -C "/Users/georgeolaru/Local Sites/style-manager/app/public/wp-content/themes/anima" add src/scss/style.scss src/scss/components/_editorial-frame.scss style.css test/editorial-frame-styles.test.js
git -C "/Users/georgeolaru/Local Sites/style-manager/app/public/wp-content/themes/anima" commit -m "feat: style Editorial Frame chrome"
```

## Task 4: Merge Chrome Items Into The Mobile Menu

**Files:**
- Create: `/Users/georgeolaru/Local Sites/style-manager/app/public/wp-content/themes/anima/test/editorial-frame-mobile-menu.test.js`
- Create: `/Users/georgeolaru/Local Sites/style-manager/app/public/wp-content/themes/anima/src/js/components/editorial-frame.js`
- Modify: `/Users/georgeolaru/Local Sites/style-manager/app/public/wp-content/themes/anima/src/js/components/app.js`

- [ ] **Step 1: Write the failing mobile merge unit test**

Create `test/editorial-frame-mobile-menu.test.js` around a pure helper exported from `src/js/components/editorial-frame.js`.

Test cases:

- clones top-level `chrome` items into the target mobile list
- appends them after the existing mobile items
- marks the first appended item with a boundary class
- does nothing when source or target is missing
- does not append duplicates when run twice

Use fake list/item objects instead of a browser DOM. The helper API should be small enough to test with simple objects:

```js
appendChromeItemsToMobileMenu({ sourceList, targetList });
```

- [ ] **Step 2: Run the mobile merge unit test and confirm it fails**

Run:

```bash
node --test "/Users/georgeolaru/Local Sites/style-manager/app/public/wp-content/themes/anima/test/editorial-frame-mobile-menu.test.js"
```

Expected: FAIL because the helper does not exist yet.

- [ ] **Step 3: Implement the mobile merge helper and wire it into the app**

Create `src/js/components/editorial-frame.js` that:

- finds the hidden `chrome` source list rendered by PHP
- finds the existing mobile menu list under `.nb-header--mobile`
- clones top-level `chrome` items
- appends them at the bottom
- adds a boundary class to the first appended clone
- marks the target as already merged to avoid duplicates

Then initialize it from `src/js/components/app.js`.

- [ ] **Step 4: Re-run the unit test and rebuild scripts**

Run:

```bash
node --test "/Users/georgeolaru/Local Sites/style-manager/app/public/wp-content/themes/anima/test/editorial-frame-mobile-menu.test.js"
npm --prefix "/Users/georgeolaru/Local Sites/style-manager/app/public/wp-content/themes/anima" run scripts
```

Expected:

- test PASS
- `dist/js/scripts.js` and `dist/js/scripts.min.js` update without build errors

- [ ] **Step 5: Commit the mobile merge behavior**

```bash
git -C "/Users/georgeolaru/Local Sites/style-manager/app/public/wp-content/themes/anima" add src/js/components/app.js src/js/components/editorial-frame.js dist/js/scripts.js dist/js/scripts.min.js test/editorial-frame-mobile-menu.test.js
git -C "/Users/georgeolaru/Local Sites/style-manager/app/public/wp-content/themes/anima" commit -m "feat: merge Editorial Frame items into mobile menu"
```

## Task 5: Verify End-To-End Behavior

**Files:**
- Verify: `/Users/georgeolaru/Local Sites/style-manager/app/public/wp-content/themes/anima/test/editorial-frame-config.php`
- Verify: `/Users/georgeolaru/Local Sites/style-manager/app/public/wp-content/themes/anima/test/editorial-frame-render.php`
- Verify: `/Users/georgeolaru/Local Sites/style-manager/app/public/wp-content/themes/anima/test/editorial-frame-styles.test.js`
- Verify: `/Users/georgeolaru/Local Sites/style-manager/app/public/wp-content/themes/anima/test/editorial-frame-mobile-menu.test.js`

- [ ] **Step 1: Run all automated checks**

```bash
studio wp eval-file "/Users/georgeolaru/Local Sites/style-manager/app/public/wp-content/themes/anima/test/editorial-frame-config.php" --path "/Users/georgeolaru/Local Sites/style-manager/app/public"
studio wp eval-file "/Users/georgeolaru/Local Sites/style-manager/app/public/wp-content/themes/anima/test/editorial-frame-render.php" --path "/Users/georgeolaru/Local Sites/style-manager/app/public"
node --test "/Users/georgeolaru/Local Sites/style-manager/app/public/wp-content/themes/anima/test/editorial-frame-styles.test.js"
node --test "/Users/georgeolaru/Local Sites/style-manager/app/public/wp-content/themes/anima/test/editorial-frame-mobile-menu.test.js"
```

Expected: all PASS.

- [ ] **Step 2: Rebuild theme assets cleanly**

```bash
npm --prefix "/Users/georgeolaru/Local Sites/style-manager/app/public/wp-content/themes/anima" run scripts
npm --prefix "/Users/georgeolaru/Local Sites/style-manager/app/public/wp-content/themes/anima" run styles
```

Expected: build succeeds and no unexpected files outside the planned asset outputs change.

- [ ] **Step 3: Manual QA in the local LT site**

Check in `http://localhost:8893/` with `Editorial Frame` enabled:

- desktop shows top accent, left accent, and right rail
- regular `chrome` links show monograms
- social links show icons
- Search opens the existing overlay
- mobile removes the chrome shell
- mobile appends `chrome` items to the bottom of the existing mobile menu

- [ ] **Step 4: Review git status for stray files**

Run:

```bash
git -C "/Users/georgeolaru/Local Sites/style-manager/app/public/wp-content/themes/anima" status --short
```

Expected: only planned files remain changed, plus the pre-existing unrelated `test/post-expression-card-render.php` modification if still present.

- [ ] **Step 5: Commit the final verification pass**

```bash
git -C "/Users/georgeolaru/Local Sites/style-manager/app/public/wp-content/themes/anima" commit --allow-empty -m "chore: verify Editorial Frame implementation"
```

Use `--allow-empty` only if every implementation task already produced the necessary commits and the verification step itself changed nothing.
