# Nova Blocks Wave 3: Layout and CSS Compatibility

**Parent plan:** `2026-03-02-wordpress-7-compatibility.md` -> Phase 3, Wave 3
**Status:** Not started
**Branch:** Continue on `feature/wp7-compat` in `pixelgrade/nova-blocks`

## Scope

### 3.1 Scope `supportsLayout: false` to NB blocks only (MEDIUM)

**File:** `lib/block-editor-settings.php:548-553`
**Current:** Disables `supportsLayout` globally for ALL blocks.
**Issue:** This prevents WP from generating layout CSS for core blocks (flex, flow). In WP 7.0 this becomes more impactful as layout CSS is used more heavily.
**Fix:** Remove the global filter. NB blocks already control their own layout via CSS custom properties. Core blocks should use WP's native layout system.

**Risk:** Removing this may cause spacing/alignment changes in the editor for core blocks nested inside NB blocks. Requires visual QA.

### 3.2 Keep `.wp-block-group__inner-container` selectors (NO CHANGE)

**Files:** 3 SCSS files in `packages/core/`
**Assessment:** WP still generates this wrapper in older saved content. The selectors are additive (:is() lists) alongside modern equivalents (`.wp-block-group:not(.wp-block-row)`). Removing them risks breaking sites with existing content.
**Decision:** Keep as-is. This is not a WP 7.0 breaking change.

### 3.3 Keep `.edit-post-*` / `.edit-site-*` selectors (NO CHANGE for now)

**Files:** `packages/core/src/editor-styles.scss`
**Assessment:** These are panel positioning selectors. WP 7.0 may rename these classes, but the current selectors fail silently (no match = no style = fallback position). Not a breaking change.
**Decision:** Keep as-is. Monitor for visual issues during testing.

### 3.4 Fix duotone filter removal (LOW priority)

**File:** `packages/block-editor/src/filters/with-overlay-filter/index.js:8`
**Current:** `removeFilter( 'editor.BlockEdit', 'core/editor/duotone/with-editor-controls' )`
**Assessment:** If WP renamed the filter hook in 7.0, this becomes a no-op (the core duotone controls would show alongside NB overlay controls). Not a crash but may cause UI confusion.
**Decision:** Verify filter name in WP 7.0. Fix only if duotone controls appear unexpectedly.

### 3.5 Fix `core/query` variation replacement (LOW priority)

**File:** `packages/block-library/src/blocks/supernova/index.js:45`
**Current:** `settings.variations = []` — clears ALL core variations.
**Assessment:** This is aggressive but intentional (NB replaces the query block UI entirely). Not a WP 7.0 compatibility issue per se. If WP 7.0 adds new required core variations, they'd be removed.
**Decision:** Keep as-is for now. The NB query experience is self-contained.

## Implementation

Only item 3.1 requires code changes. Items 3.2-3.5 are no-change decisions documented above.

## Verification

After removing global `supportsLayout: false`:
- [ ] Core Group, Columns, Row blocks maintain correct alignment in editor
- [ ] NB Cards Collection layout unchanged
- [ ] No visual regression in block spacing
