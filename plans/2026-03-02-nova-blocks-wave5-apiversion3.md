# Nova Blocks Wave 5: apiVersion 3 Migration

**Parent plan:** `2026-03-02-wordpress-7-compatibility.md` -> Phase 3, Wave 5
**Status:** DEFERRED — not blocking for WP 7.0 compatibility
**Branch:** Continue on `feature/wp7-compat` in `pixelgrade/nova-blocks`

## Rationale for Deferral

apiVersion 2 blocks still work in WP 7.0. The editor already uses an iframe for the canvas, but apiVersion 2 blocks are rendered in a compatibility mode that doesn't require the block itself to be iframe-aware.

apiVersion 3 forces blocks to render inside the iframe document, which requires all DOM access to use `ownerDocument`/`defaultView` patterns. While Wave 2 fixed the critical DOM access points, migrating all 23 blocks to apiVersion 3 simultaneously is high risk with limited testing capacity.

## Scope (when executed)

1. Update all 23 `block.json` files: `"apiVersion": 2` → `"apiVersion": 3`
2. Create `block.json` for `openhours` and `opentable` (currently registered via JS)
3. Migrate `getEditWrapperProps` → `useBlockProps` (3 blocks)
4. Test each block renders correctly

## Prerequisites

- Wave 2 (iframe DOM fixes) — DONE
- Wave 3 (layout/CSS fixes) — done
- Wave 4 (package replacements) — done
- Comprehensive visual QA pass on all 23 blocks

## Decision Point

Execute Wave 5 when:
- WP 7.0 RC is available (more stable target)
- apiVersion 2 compatibility mode is confirmed deprecated/removed
- Visual regression testing infrastructure is available

Until then, apiVersion 2 blocks work correctly in the iframed editor.
