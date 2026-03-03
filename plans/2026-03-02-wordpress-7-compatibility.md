# WordPress 7.0 Compatibility Plan

**Date:** 2026-03-02
**Updated:** 2026-03-02 (post-review revision)
**Status:** In progress — Nova Blocks Phase 3-wave-1 done, rest not started
**Repos affected:** Anima, Nova Blocks, Style Manager, Pixelgrade Care

## GitHub Issues

- Anima: [#365](https://github.com/pixelgrade/anima/issues/365)
- Nova Blocks: [#481](https://github.com/pixelgrade/nova-blocks/issues/481)
- Style Manager: [#48](https://github.com/pixelgrade/style-manager/issues/48)
- Pixelgrade Care: [#430](https://github.com/pixelgrade/pixelgrade-care/issues/430)

## Progress

- **Style Manager (Phase 1)** — Done. All 7 items implemented: `enqueue_block_editor_assets` injection, `wp-block-editor` dependency, updated selectors, iframe dark mode, cross-frame try/catch guards (6 JS files), `getElementByTag` typo fix, Font Library deregistration. Build verified. Phase 1.5 validation gate PASSED on WP 7.0-beta2.
- **Anima (Phase 2)** — Done. Removed dead `__experimentalFeatures` mutations (key removed in WP 7.0), replaced `__unstableResolvedAssets` with `enqueue_block_editor_assets`, removed dead filter removals, fixed deprecated JS APIs (`addListener`→`addEventListener`, `pageYOffset`→`scrollY`). Build verified, browser validated.
- **Nova Blocks wave 1** — Done. Committed on `feature/wp7-compat` branch (`a6d96882`).
- **Nova Blocks wave 2** — Done (not yet committed). Hardened `useScrollContainer` for iframe, fixed `PreviewScrollingButton` cross-frame lookup, ref-based navigation block editor lookup, hardened `addSocialMenuClass` to `ownerDocument`. Build verified.
- **Nova Blocks wave 3** — Done. Removed global `supportsLayout: false` filter. CSS selectors kept as-is (no breaking changes). See `plans/2026-03-02-nova-blocks-wave3-layout-css.md`.
- **Nova Blocks wave 4** — Done (not yet committed). Replaced `@wordpress/api` (Backbone, REMOVED in WP 7.0) with `@wordpress/api-fetch` in Google Map block. Lodash replacement deferred → [#485](https://github.com/pixelgrade/nova-blocks/issues/485). Build verified.
- **Nova Blocks wave 5** — DEFERRED → [#484](https://github.com/pixelgrade/nova-blocks/issues/484). apiVersion 2 still works in WP 7.0. See `plans/2026-03-02-nova-blocks-wave5-apiversion3.md`.
- **Pixelgrade Care (Phase 4)** — Done (not yet committed). Setup wizard admin API cleanup, PHP minimum version 5.3→7.4, readme Tested up to 7.0. Admin pages verified on WP 7.0-beta2. Classic Editor strategy deferred → [#431](https://github.com/pixelgrade/pixelgrade-care/issues/431).

---

## Phase Completion + Git Workflow

Every phase (or wave) should end with a commit + push + issue update. This keeps cross-repo progress auditable and avoids local-only completion.

### Required steps after each phase/wave

1. Run the phase-specific validation checklist in this plan.
2. Commit only that phase/wave scope (no mixed unrelated changes).
3. Push branch to GitHub.
4. Open/update PR and link the corresponding issue.
5. Post short issue update: what shipped, commit SHA, test status, known follow-ups.
6. Update this plan's `Progress` section with commit SHA + status.

### Issue mapping for commits/PRs

| Scope | Repo | Issue |
|------|------|-------|
| Phase 1 + 1.5 (Style Manager) | `pixelgrade/style-manager` | `#48` |
| Phase 2 (Anima) | `pixelgrade/anima` | `#365` |
| Phase 3 waves 2-5 (Nova Blocks) | `pixelgrade/nova-blocks` | `#481` |
| Phase 4 (Pixelgrade Care) | `pixelgrade/pixelgrade-care` | `#430` |

### Commit message templates

Use one of these forms and include issue linkage in the commit body/footer.

1. `wp7(sm): phase 1 - stable editor asset injection and iframe dark mode`
2. `wp7(sm): phase 1.5 - validation gate fixes and compatibility follow-ups`
3. `wp7(anima): phase 2 - editor settings cleanup and deprecated api updates`
4. `wp7(nb): wave 2 - iframe dom access fixes`
5. `wp7(nb): wave 3 - layout/css compatibility fixes`
6. `wp7(nb): wave 4 - package replacement cleanup`
7. `wp7(nb): wave 5 - apiVersion 3 migration`
8. `wp7(pc): phase 4 - wp7 admin compatibility and metadata update`

Footer lines:

```text
Refs pixelgrade/<repo>#<issue>
```

Use `Closes pixelgrade/<repo>#<issue>` only on the final PR merge commit for that repo's full WP7 scope.

### Push/PR checklist

- [ ] Branch pushed to remote
- [ ] PR title includes phase/wave label
- [ ] PR body links parent WP7 plan and repo issue
- [ ] Commit SHA added to issue comment
- [ ] `Progress` section in this plan updated

---

## WP 7.0 Breaking Changes Summary

| Change | Impact | Confidence | Primary repos affected |
|--------|--------|------------|----------------------|
| Always-iframed post editor | CRITICAL | Confirmed | Nova Blocks, Style Manager, Anima |
| `__unstableResolvedAssets` removal | CRITICAL | Confirmed | Anima, Style Manager |
| `__experimentalFeatures` removal | HIGH | VERIFY — may still be present in 7.0 | Anima |
| `__experimental*` API removals | HIGH | Mixed — some promoted, some still experimental | Nova Blocks (10+ APIs) |
| Font Library for all themes | HIGH | VERIFY — behavior with existing theme.json unclear | Anima, Style Manager |
| Global stylesheet restructuring | HIGH | Likely | Anima, Style Manager |
| `getEditWrapperProps` removal | HIGH | VERIFY — may be deprecated-but-present | Nova Blocks (3 blocks) |
| `@wordpress/api` (Backbone) removal | HIGH | Confirmed | Nova Blocks |
| `lodash` bundle removal | MEDIUM | Confirmed | Nova Blocks |
| View Transitions API in admin | MEDIUM | Confirmed (admin only) | Anima (page transitions) |
| Admin UI refresh | MEDIUM | Confirmed | Pixelgrade Care |
| Per-block custom CSS | LOW | Confirmed | Anima |
| New core blocks (Breadcrumbs, Icons) | LOW | Confirmed | Anima |

**Important:** Items marked `VERIFY` must be tested against WP 7.0 beta before implementing changes. Do not refactor code for removals that haven't happened yet.

---

## Non-Goals for 7.0

These are explicitly out of scope to prevent scope creep:

- Full redesign of Style Manager's architecture
- Rewriting Nova Blocks' block registration system beyond what's needed for iframe compat
- Adding new features (only fix what breaks)
- Automated visual regression testing infrastructure (manual QA is sufficient)
- Supporting WP versions below 6.4 (current minimum stays)

---

## Implementation Order

The repos have cross-dependencies, so order matters:

1. **Style Manager first** — Anima depends on SM for editor CSS injection
2. **Anima second** — depends on SM changes
3. **Nova Blocks third** — largest scope, most independent (wave 1 already done)
4. **Pixelgrade Care last** — lowest risk, mostly cosmetic

---

## Phase 1: Style Manager (est. scope: ~8 files)

### 1.1 Replace `__unstableResolvedAssets` injection
**File:** `src/Screen/EditWithBlocks.php:203-213`
**Approach:** Use `enqueue_block_editor_assets` action to register a dynamic inline style. This is the stable, supported way to inject CSS into the block editor. The inline style should contain the same dynamic CSS variables that SM currently injects via the unstable key.

```php
// Instead of mutating $settings['__unstableResolvedAssets']['styles']
add_action('enqueue_block_editor_assets', function() {
    $css = self::get_dynamic_style_manager_css();
    wp_register_style('style-manager-editor-dynamic', false);
    wp_enqueue_style('style-manager-editor-dynamic');
    wp_add_inline_style('style-manager-editor-dynamic', $css);
});
```

**Rollback:** Restore the `__unstableResolvedAssets` mutation. The old code is a single method — easy to revert.

### 1.2 Replace `wp-editor` handle dependency
**File:** `src/Provider/AdminAssets.php:74`
**Change:** `['wp-editor']` → `['wp-block-editor']`

### 1.3 Fix stale editor DOM selectors
**File:** `src/Screen/EditWithBlocks.php:33-35,59`
**Change:** Update `.editor-post-title__block`, `.editor-post-title__input`, `.edit-post-visual-editor` to current WP 6.x+ selectors (`.editor-post-title`, `.editor-visual-editor`). Add comments noting these are admin-shell selectors, not iframe selectors.

### 1.4 Fix dark mode for iframed editor
**File:** `src/_js/dark-mode/index.js:120-122`
**Approach:** After adding the class to the outer document, also inject it into the editor iframe:
```js
const iframe = document.querySelector('iframe[name="editor-canvas"]');
if (iframe?.contentDocument) {
    iframe.contentDocument.documentElement.classList.add('is-dark');
}
```
Use a MutationObserver to handle the iframe being created dynamically.

**Rollback:** Remove the iframe injection code. Dark mode reverts to outer-document-only (current behavior).

### 1.5 Fix cross-frame access in Customizer preview
**Files:** `src/_js/customizer-preview/index.js`, `src/_js/utils/maybe-load-font-family.js`
**Approach:** Add try/catch around all `window.parent` and `window.top` access. Provide graceful fallbacks when cross-frame access fails.

### 1.6 Fix `getElementByTag` typo
**File:** `src/Customize/Fonts.php:1475`
**Change:** `document.getElementByTag('html')` → `document.getElementsByTagName('html')`

### 1.7 Handle Font Library conflict
**Approach:** Conditionally hide the Font Library UI panel when Style Manager is actively managing fonts, rather than stripping font data from theme.json. This preserves SM's font definitions while preventing the duplicate UI.

Strategy:
1. If SM is active and managing fonts, deregister WP's font collections via `wp_unregister_font_collection`.
2. Keep SM's own font data in theme.json intact — do not filter `wp_theme_json_data_theme` to remove fontFamilies (too aggressive, risks typography regressions).
3. If SM is not managing fonts, let Font Library work normally.

**Rollback:** Remove the `wp_unregister_font_collection` calls. Font Library UI reappears alongside SM (cosmetically confusing but not breaking).

---

## Phase 1.5: Validation Gate

**Before moving to Phase 2, verify all Phase 1 changes pass these checks:**

- [ ] Editor loads without JS errors on WP 6.x (current) and WP 7.0 beta
- [ ] SM dynamic CSS variables render correctly in the editor canvas (inspect iframe `<head>`)
- [ ] SM color/font controls in Customizer work — preview updates live
- [ ] Dark mode toggle applies `is-dark` class to both outer document and editor iframe content
- [ ] Font selection shows SM fonts only (no duplicate Font Library panel)
- [ ] No cross-frame `SecurityError` in browser console on any admin page
- [ ] Visual spot-check: editor typography, colors, and spacing match frontend on 2-3 key templates

**Proceed only after this gate passes.** If issues are found, fix in Phase 1 before continuing.

---

## Phase 2: Anima (est. scope: ~5 files)

### 2.1 Replace `__experimentalFeatures` mutations
**File:** `inc/block-editor.php:54-66`
**Confidence:** VERIFY — test on WP 7.0 beta first. If `__experimentalFeatures` key is still present (just deprecated), this is lower priority.
**Approach:** Move all feature suppression into `theme.json`. The theme already uses `theme.json` to disable most settings — ensure it covers everything currently done via `__experimentalFeatures` mutations:
- `color.custom: false`
- `color.customGradient: false`
- `typography.customFontSize: false`
- etc.

### 2.2 Replace `__unstableResolvedAssets` injection
**File:** `inc/block-editor.php:81`
**Approach:** Same pattern as SM — use `enqueue_block_editor_assets` + inline style.

### 2.3 Audit `wp_enqueue_global_styles` removal
**File:** `inc/block-editor.php:21-24`
**Approach:** Test with WP 7.0 beta whether removing global styles is still necessary. If SM now handles all CSS injection via the stable `enqueue_block_editor_assets` action, global styles may coexist without conflict. If removal is still needed, find the WP 7.0-compatible way to do it.

### 2.4 Clean up dead filter removals
**File:** `inc/block-editor.php:27-28`
**Change:** Remove the `remove_filter` calls for `wp_render_duotone_support` and `wp_restore_group_inner_container` — they're already no-ops.

### 2.5 Fix deprecated JS APIs
**Files:** `src/js/components/hero.js:30`, `src/js/components/globalService.js:150-151`
**Changes:**
- `mediaQuery.addListener(fn)` → `mediaQuery.addEventListener('change', fn)`
- `window.pageYOffset` → `window.scrollY`
- `window.pageXOffset` → `window.scrollX`

### 2.6 Test Font Library interaction
Test that SM's font management properly suppresses Font Library UI (depends on Phase 1.7). May need `"typography": { "fontLibrary": false }` in `theme.json` if supported in WP 7.0.

### 2.7 Test page transitions vs View Transitions
Test Barba.js page transitions on frontend against WP 7.0's admin View Transitions. Should be no conflict (different contexts) but verify.

---

## Phase 3: Nova Blocks (est. scope: ~40+ files — largest effort)

This is the biggest body of work. Split into waves by risk — fix breakages first, defer broad migrations last.

### Wave 1: Verified API migrations + bug fixes — DONE ✓

Committed on `feature/wp7-compat` (`a6d96882`). Includes:
- Experimental→stable migrations (only verified-stable ones)
- Button prop deprecations
- URLInput→TextControl
- Bug fixes (typo, undeclared variable, toolbar flag)

**Not migrated (correctly kept as experimental — not yet stable in WP 7.0 beta 2):**
- `__experimentalUseSlot`
- `__experimentalBlockVariationPicker`
- `__experimentalBlockAlignmentMatrixControl` (stable fallback added)

### Wave 2: DOM access / iframe fixes (causes visible breakage)
**Critical files:**
- `packages/block-editor/src/utils/index.js:13-18` — `getEditorScrollContainer()` → use `useRef` to get the scroll container from the iframe context
- `packages/block-editor/src/components/controls-sections/index.js:38` — replace `document.querySelector` with React ref
- `packages/block-library/src/blocks/navigation/index.js:26-44` — use `useBlockProps` ref + `ownerDocument`
- `packages/block-library/src/blocks/google-map/edit.js` — complete rewrite of script injection using `ref.current.ownerDocument`
- `packages/scrolling-effect/src/controls/preview-scrolling-button.js:15` — use React ref
- `packages/utils/src/index.js:322-323` — `IS_EDITOR` / `IS_CUSTOMIZER` detection must use a different method (e.g., checking for `wp.data` stores or `body` class on the correct document)

**Pattern to follow (from WP migration guide):**
```js
// Before (broken in iframe)
document.querySelector('.block-' + clientId)

// After (iframe-compatible)
import { useRefEffect } from '@wordpress/compose';
const ref = useRefEffect((element) => {
    const doc = element.ownerDocument;
    const win = doc.defaultView;
    // Use doc and win instead of document and window
}, []);
return <div ref={ref}>...</div>;
```

### Wave 3: Layout and CSS fixes
- Remove or scope `supportsLayout: false` (`lib/block-editor-settings.php:551-556`) — only apply to NB block types
- Replace `.wp-block-group__inner-container` selectors in SCSS
- Fix editor CSS targeting `.edit-post-*` / `.edit-site-*` classes
- Fix `removeFilter` for duotone controls — use correct filter name
- Fix `core/query` variation replacement — merge instead of clear all

### Wave 4: Remaining package replacements
- `@wordpress/api` → `@wordpress/api-fetch` (Google Maps block)
- `lodash` imports → native JS (`uniq` → `[...new Set()]`, `debounce` → custom or `@wordpress/compose`, `groupBy`/`orderBy` → native)

### Wave 5: Block API migration (apiVersion 2 → 3) — last
**Files:** All 23 `block.json` files + `openhours/index.js` + `opentable/index.js`
**Approach:**
1. Update all `block.json` to `"apiVersion": 3`
2. Create `block.json` for `openhours` and `opentable`
3. Migrate all `getEditWrapperProps` → `useBlockProps` (3 blocks) — VERIFY that `getEditWrapperProps` is actually removed first
4. Test each block renders correctly in the iframed editor

**Rationale for doing this last:** apiVersion 3 is the broadest change (23 blocks) and forces iframe rendering. All DOM access fixes (wave 2) and CSS fixes (wave 3) must be in place first, otherwise apiVersion 3 will cause cascading failures.

### Experimental API status tracker

| Import | Stable replacement | Status in WP 7.0 beta 2 |
|--------|-------------------|--------------------------|
| `__experimentalLinkControl` | `LinkControl` | ✓ Migrated (wave 1) |
| `__experimentalGetSettings` | `getSettings` | ✓ Migrated (wave 1) |
| `__experimentalUseInnerBlocksProps` | `useInnerBlocksProps` | ✓ Migrated (wave 1) |
| `__experimentalGroup` on InspectorControls | `group` prop | ✓ Migrated (wave 1) |
| `__experimentalLayout` | `layout` in block supports | ✓ Migrated (wave 1) |
| `__unstableStripHTML` | Local `stripHTML` | ✓ Migrated (wave 1) |
| `__experimentalUseSlot` | `useSlot` | ✗ Still experimental — keep as-is |
| `__experimentalBlockVariationPicker` | `BlockVariationPicker` | ✗ Still experimental — keep as-is |
| `__experimentalBlockAlignmentMatrixControl` | `BlockAlignmentMatrixControl` | ✗ Still experimental — fallback added |

**Rule:** Only migrate when the stable export is verified in `wp-includes/js/dist/*.js`. Check again at WP 7.0 RC.

---

## Phase 4: Pixelgrade Care (est. scope: ~5 files)

### 4.1 Update or remove bundled Classic Editor
Evaluate if Classic Editor is still needed. If yes, update to latest version. If no, remove from `vendor/` and rely on users installing it separately.

### 4.2 Fix setup wizard deprecated APIs
**File:** `admin/class-pixelgrade_care-setup_wizard.php:153-163`
- Remove `wp_enqueue_style('ie')` call
- Replace deprecated `do_action("admin_print_styles-{$hook_suffix}")` with standard style enqueue

### 4.3 Fix PHP version constant
**File:** `includes/class-pixelgrade_care.php:159`
**Change:** `$minimalRequiredPhpVersion = '5.3.0'` → `'7.4'`

### 4.4 Test admin menu position
Test position 2 against WP 7.0 admin layout. May need to adjust to avoid collision.

### 4.5 Visual QA of dashboard SPA
Test dashboard appearance against WP 7.0's refreshed admin UI. May need CSS adjustments.

### 4.6 Update "Tested up to" header
Change `Tested up to: 6.7.2` → `Tested up to: 7.0`

---

## Testing Strategy

### WP 7.0 Beta Testing Environment
1. Set up a WP 7.0 beta install (use `wp core update --version=7.0-beta1` or Local Sites beta channel)
2. Install all four plugins/theme at current versions
3. Document all visible breakage before any fixes
4. Apply fixes in dependency order (SM → Anima → NB → PC)
5. Re-test after each phase

### Functional test scenarios
- [ ] Block editor loads without JS errors
- [ ] Style Manager colors/fonts render correctly in editor
- [ ] Style Manager Customizer preview works
- [ ] All Nova Blocks blocks render in editor and frontend
- [ ] **Cards Collection block inspector panels** — open each section (Color Signal, Space and Sizing, Collection Layout, Elements Stacking, Elements Visibility, Content Details, Content Type, Scrolling Effect, Shape Modeling, Overlay Filter) and verify no JS crash
- [ ] **Block customization Slot/Fill system** — Color Signal uses `createSlotFill` + `__experimentalUseSlot`; verify fills render in correct slots without `TypeError: Object(...) is not a function`
- [ ] Google Maps block loads API in editor
- [ ] Navigation block social menu detection works
- [ ] Parallax scroll preview works in editor
- [ ] Dark mode toggle affects editor content
- [ ] Page transitions work on frontend (Anima)
- [ ] Font selection UI shows only Style Manager fonts (no duplicate Font Library)
- [ ] Pixelgrade Care setup wizard completes
- [ ] Pixelgrade Care dashboard renders correctly

### Visual consistency checks (release gate)

Visual parity is a first-class release requirement. The theme's design fidelity is a key product differentiator.

**Contexts to verify:** post editor (iframe), Site Editor, Customizer preview, live frontend.

| Surface | What to check |
|---------|--------------|
| Typography | Font family, weight, size, and line-height match across all contexts |
| Colors | SM color tokens (`--sm-*`) resolve correctly; no missing/wrong values |
| Spacing | Margins, padding, block gaps are consistent editor↔frontend |
| Block layout | Container widths, alignments, flex/grid layouts render correctly |
| Nova Blocks | Collections/cards/supernova preserve proportions, overlays, content hierarchy |
| Transitions | Hover, focus states, dark-mode toggle behave as expected |

**Visual acceptance criteria:**
- [ ] No unstyled flash or delayed style injection in editor iframe
- [ ] Dark mode class propagation works in both shell and iframe content
- [ ] Top 3 templates (index, single-post, page) render identically editor↔frontend
- [ ] Top 5 high-use blocks (Group, Columns, Image, Paragraph, NB Cards Collection) have no visual regressions

### Lesson: Always verify WP exports before migrating
Not all `__experimental*` APIs have been promoted to stable exports, even in WP 7.0 beta 2:
- `__experimentalUseSlot` — still only exported as experimental
- `__experimentalBlockVariationPicker` — still only exported as experimental
- `__experimentalBlockAlignmentMatrixControl` — still only exported as experimental
Always check `wp-includes/js/dist/*.js` exports before replacing.

---

## Rollback Strategy

| Phase | Rollback approach |
|-------|------------------|
| Phase 1 (SM) | Revert the `enqueue_block_editor_assets` approach and restore `__unstableResolvedAssets` mutation. Single method change. |
| Phase 1.7 (Font Library) | Remove `wp_unregister_font_collection` calls. Font Library UI reappears but nothing breaks. |
| Phase 2 (Anima) | `git revert` the Anima commits. `theme.json` and `block-editor.php` changes are isolated. |
| Phase 3 wave 1 (NB APIs) | Revert `a6d96882` on `feature/wp7-compat`. All changes are in one commit. |
| Phase 3 wave 5 (apiVersion 3) | Revert `block.json` apiVersion back to 2. Blocks fall back to non-iframe rendering. |

---

## Risk Assessment

| Repo | Risk | Effort | Notes |
|------|------|--------|-------|
| Nova Blocks | Very High | Very High | Wave 2 (DOM/iframe rewrites) is the hardest remaining work. Wave 1 done. |
| Style Manager | High | Medium | Core editor CSS injection needs complete rewrite |
| Anima | Medium | Low-Medium | Mostly removing dead code and switching to stable APIs |
| Pixelgrade Care | Low | Low | Mostly cleanup and version bumps |

**Nova Blocks is by far the largest effort.** With wave 1 done, the critical remaining work is wave 2 (iframe DOM access rewrites for 6+ files) and wave 5 (apiVersion 3 for 23 blocks). Wave 2 should be done first — it fixes the most visible breakage and is a prerequisite for wave 5.
