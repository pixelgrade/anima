# WordPress 7.0 Compatibility Plan

**Date:** 2026-03-02
**Status:** Plan — not yet implemented
**Repos affected:** Anima, Nova Blocks, Style Manager, Pixelgrade Care

## GitHub Issues

- Anima: [#365](https://github.com/pixelgrade/anima/issues/365)
- Nova Blocks: [#481](https://github.com/pixelgrade/nova-blocks/issues/481)
- Style Manager: [#48](https://github.com/pixelgrade/style-manager/issues/48)
- Pixelgrade Care: [#430](https://github.com/pixelgrade/pixelgrade-care/issues/430)

---

## WP 7.0 Breaking Changes Summary

| Change | Impact | Primary repos affected |
|--------|--------|----------------------|
| Always-iframed post editor | CRITICAL | Nova Blocks, Style Manager, Anima |
| `__unstableResolvedAssets` removal | CRITICAL | Anima, Style Manager |
| `__experimentalFeatures` removal | CRITICAL | Anima |
| `__experimental*` API removals | HIGH | Nova Blocks (10+ APIs) |
| Font Library for all themes | HIGH | Anima, Style Manager |
| Global stylesheet restructuring | HIGH | Anima, Style Manager |
| `getEditWrapperProps` removal | HIGH | Nova Blocks (3 blocks) |
| `@wordpress/api` (Backbone) removal | HIGH | Nova Blocks |
| `lodash` bundle removal | MEDIUM | Nova Blocks |
| View Transitions API in admin | MEDIUM | Anima (page transitions) |
| Admin UI refresh | MEDIUM | Pixelgrade Care |
| Per-block custom CSS | LOW | Anima |
| New core blocks (Breadcrumbs, Icons) | LOW | Anima |

---

## Implementation Order

The repos have cross-dependencies, so order matters:

1. **Style Manager first** — Anima depends on SM for editor CSS injection
2. **Anima second** — depends on SM changes
3. **Nova Blocks third** — largest scope, most independent
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

### 1.5 Fix cross-frame access in Customizer preview
**Files:** `src/_js/customizer-preview/index.js`, `src/_js/utils/maybe-load-font-family.js`
**Approach:** Add try/catch around all `window.parent` and `window.top` access. Provide graceful fallbacks when cross-frame access fails.

### 1.6 Fix `getElementByTag` typo
**File:** `src/Customize/Fonts.php:1475`
**Change:** `document.getElementByTag('html')` → `document.getElementsByTagName('html')`

### 1.7 Handle Font Library conflict
**Approach:** If Style Manager is active and managing fonts, disable WP Font Library via:
```php
add_filter('wp_theme_json_data_theme', function($theme_json) {
    // Remove fontFamilies from theme.json to prevent Font Library conflicts
});
```
Or use the `wp_register_font_collection` / `wp_unregister_font_collection` APIs.

---

## Phase 2: Anima (est. scope: ~5 files)

### 2.1 Replace `__experimentalFeatures` mutations
**File:** `inc/block-editor.php:54-66`
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
Test that `theme.json` properly suppresses Font Library UI when Style Manager is active. May need `"typography": { "fontLibrary": false }` if supported in WP 7.0.

### 2.7 Test page transitions vs View Transitions
Test Barba.js page transitions on frontend against WP 7.0's admin View Transitions. Should be no conflict (different contexts) but verify.

---

## Phase 3: Nova Blocks (est. scope: ~40+ files — largest effort)

This is the biggest body of work. Recommend splitting into sub-phases.

### 3A: Block API migration (apiVersion 2 → 3)
**Files:** All 23 `block.json` files + `openhours/index.js` + `opentable/index.js`
**Approach:**
1. Update all `block.json` to `"apiVersion": 3`
2. Create `block.json` for `openhours` and `opentable`
3. Migrate all `getEditWrapperProps` → `useBlockProps` (3 blocks)
4. Test each block renders correctly in the iframed editor

### 3B: Replace direct DOM access in editor code
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

### 3C: Replace deprecated `__experimental*` APIs
| Import | Stable replacement |
|--------|-------------------|
| `__experimentalLinkControl` | `LinkControl` from `@wordpress/block-editor` |
| `__experimentalBlockVariationPicker` | `BlockVariationPicker` from `@wordpress/block-editor` |
| `__experimentalGetSettings` | `getSettings` from `@wordpress/date` |
| `__experimentalUseSlot` | `useSlot` from `@wordpress/components` |
| `__experimentalBlockAlignmentMatrixControl` | `BlockAlignmentMatrixControl` from `@wordpress/block-editor` |
| `__experimentalUseInnerBlocksProps` | `useInnerBlocksProps` from `@wordpress/block-editor` |
| `__experimentalLayout` | `layout` in block supports |
| `__experimentalGroup` on `InspectorControls` | `group` prop |

### 3D: Replace deprecated component props and packages
- `Button` props: `isPrimary` → `variant="primary"`, `isSecondary` → `variant="secondary"`, `islarge` → `size="compact"`, `isLink` → `variant="link"`, `isDestructive` → `isDestructive` (this one stays)
- `@wordpress/api` → `@wordpress/api-fetch` (Google Maps block)
- `URLInput` → `LinkControl` (announcement-bar)
- `lodash` imports → native JS (`uniq` → `[...new Set()]`, `debounce` → custom or `@wordpress/compose`, `groupBy`/`orderBy` → native)
- `__unstableStripHTML` → local implementation: `(html) => { const doc = new DOMParser().parseFromString(html, 'text/html'); return doc.body.textContent || ''; }`

### 3E: Layout and CSS fixes
- Remove or scope `supportsLayout: false` (`lib/block-editor-settings.php:551-556`) — only apply to NB block types
- Replace `.wp-block-group__inner-container` selectors in SCSS
- Fix editor CSS targeting `.edit-post-*` / `.edit-site-*` classes
- Fix `removeFilter` for duotone controls — use correct filter name
- Fix `core/query` variation replacement — merge instead of clear all

### 3F: Bug fixes
- Fix `"lassic"` → `"classic"` typo in `menu-food/block.json`
- Fix undeclared `element` in `with-overlay-filter-controls.js`
- Fix `hasFixedToolbar` → `fixedToolbar`
- Replace `view_script` → `view_script_handles` in `lib/client-assets.php`

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

### Key test scenarios
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

### Lesson: Always verify WP exports before migrating
Not all `__experimental*` APIs have been promoted to stable exports, even in WP 7.0 beta 2:
- `__experimentalUseSlot` — still only exported as experimental
- `__experimentalBlockVariationPicker` — still only exported as experimental
- `__experimentalBlockAlignmentMatrixControl` — still only exported as experimental
Always check `wp-includes/js/dist/*.js` exports before replacing.

---

## Risk Assessment

| Repo | Risk | Effort | Notes |
|------|------|--------|-------|
| Nova Blocks | Very High | Very High | 23 blocks need apiVersion 3, 6+ critical DOM access rewrites, 10+ experimental API migrations |
| Style Manager | High | Medium | Core editor CSS injection needs complete rewrite |
| Anima | Medium | Low-Medium | Mostly removing dead code and switching to stable APIs |
| Pixelgrade Care | Low | Low | Mostly cleanup and version bumps |

**Nova Blocks is by far the largest effort.** The apiVersion 2 → 3 migration for 23 blocks, combined with rewriting all direct DOM access patterns, is a multi-day project. Recommend starting with the 5 critical DOM access issues first, as those cause the most visible breakage.
