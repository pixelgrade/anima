# Nova Blocks Wave 4: Package Replacements

**Parent plan:** `2026-03-02-wordpress-7-compatibility.md` -> Phase 3, Wave 4
**Status:** Not started
**Branch:** Continue on `feature/wp7-compat` in `pixelgrade/nova-blocks`

## Scope

### 4.1 Replace `@wordpress/api` with `@wordpress/api-fetch` (CRITICAL)

**File:** `packages/block-library/src/blocks/google-map/edit.js:4`
**Current:** `import { models, loadPromise } from '@wordpress/api'`
**Issue:** `@wordpress/api` (Backbone-based REST client) is REMOVED in WP 7.0 beta 2. This will crash the Google Map block.
**Fix:** Replace with `@wordpress/api-fetch` which is the modern replacement.

The current code uses `models.Settings` via Backbone to read the Google Maps API key. Replace with a direct `apiFetch` call to the REST API settings endpoint.

### 4.2 Replace lodash imports with native JS (DEFERRED)

**Files:** 7 files across packages/
**Assessment:** lodash is still bundled in WP 7.0 beta 2 (just deprecated). The imports will still work.
**Decision:** Defer to a future maintenance pass. Not a blocking WP 7.0 issue.

Tracked lodash usages:
- `packages/block-library/src/blocks/supernova/store.js`
- `packages/block-editor/src/filters/with-content-position-matrix/with-content-position-deprecated.js`
- `packages/block-editor/src/components/heading-toolbar/index.js`
- `packages/block-editor/src/components/drawer/index.js`
- `packages/block-editor/src/components/controls-sections/sections-list.js`
- `packages/block-editor/src/components/controls-sections/index.js`
- `packages/block-editor/src/components/autocomplete-tokenfield/index.js`

## Implementation

Only 4.1 requires immediate changes.

## Verification

- [ ] Google Map block loads in editor without console errors
- [ ] Google Maps API key is read correctly from WP settings
- [ ] Map renders with valid API key
- [ ] Block gracefully handles missing API key
