# Nova Blocks Wave 2: Iframe-Compatible DOM Access

**Parent plan:** `2026-03-02-wordpress-7-compatibility.md` -> Phase 3, Wave 2  
**Updated:** 2026-03-02 (plan hardening revision)  
**Status:** Not started  
**Prerequisite:** Wave 1 done (`feature/wp7-compat`, commit `a6d96882`)  
**Branch:** Continue on `feature/wp7-compat` in `pixelgrade/nova-blocks`

## Git Workflow (Required)

This wave must end with commit + push + issue update.

**Issue linkage:** `pixelgrade/nova-blocks#481`

### Commit templates

1. `wp7(nb): wave 2 - robust iframe scroll container resolution`
2. `wp7(nb): wave 2 - preview scrolling button frame-safe query`
3. `wp7(nb): wave 2 - navigation block ref-based editor lookup`
4. `wp7(nb): wave 2 - harden social menu helper to ownerDocument`

**Commit footer:**

```text
Refs pixelgrade/nova-blocks#481
```

Use `Closes pixelgrade/nova-blocks#481` only on the final merge commit when the full Nova Blocks WP7 scope is done.

### Push/PR checklist

- [ ] Branch pushed to GitHub
- [ ] PR title includes `WP7 Wave 2`
- [ ] PR body links parent plan and issue `#481`
- [ ] Comment posted on issue with commit SHA(s) and test result summary

## Context

In WP 7.0 editor contexts where the block canvas is iframed, direct `document`/`window` access from editor code often points to the outer admin shell, not the canvas document.  
Wave 2 fixes these cross-frame lookups before Wave 5 (`apiVersion: 3`) expands iframe exposure.

Wave 1 already handled verified API migrations and bug fixes. Wave 2 is specifically DOM/frame compatibility work.

## Key Patterns (WP 7.0-safe)

```js
// Derive the correct frame context from a DOM node:
const doc = element.ownerDocument;
const win = doc.defaultView;

// Query inside that document (not global document):
doc.querySelector( selector );

// When needed, get scroll container from a node:
import { getScrollContainer } from '@wordpress/dom';
const container = getScrollContainer( doc.body ) || doc.body;
```

## Scope

### Required fixes (3) + hardening fix (1)

| # | Location | Verdict |
|---|----------|---------|
| 1 | `useScrollContainer` / `getEditorScrollContainer` | **FIX** - resolves wrong frame and is brittle if iframe appears after first render |
| 2 | `preview-scrolling-button.js` - `document.querySelector('#block-...')` | **FIX** - block node is in canvas document |
| 3 | `navigation/index.js` - `document.querySelector('.block-...')` | **FIX** - server-rendered block is in canvas document |
| 4 | `navigation/utils.js` - `window.getComputedStyle(document.documentElement)` | **HARDEN** - should use the same document/window as target container |

### Safe for now (spot-check only)

| # | Location | Why currently safe |
|---|----------|--------------------|
| 5 | `controls-sections/index.js` | Targets inspector panel in outer frame; null-safe behavior |
| 6 | `google-map/edit.js` | Script-loading and API key model flow currently operates in outer editor context |
| 7 | `utils/src/index.js` (`IS_EDITOR` / `IS_CUSTOMIZER`) | Used by frontend-oriented runtime paths, not this iframe-critical editor flow |
| 8 | `with-overlay-filter/controls.js` | Optional chaining protects missing `window.styleManager` |

If any safe item fails during verification, move it into an immediate follow-up patch in this wave.

---

## Change 1: Harden `useScrollContainer` resolution (CRITICAL)

**Files:**
- `packages/block-editor/src/hooks/use-scroll-container/index.js`
- `packages/block-editor/src/utils/index.js` (fallback unchanged)

**Current issue:** Hook resolves only once at mount and may bind to outer shell container if iframe is not ready yet or gets recreated.

**Fix approach:**
1. Resolve scroll container via helper `resolveScrollContainer()`.
2. Prefer `iframe[name="editor-canvas"]` document when present.
3. Fall back to existing selector-based `getEditorScrollContainer()` for WP 6.x and non-iframe contexts.
4. Re-resolve when iframe appears/changes (MutationObserver + iframe `load` listener).

```js
import { getScrollContainer } from '@wordpress/dom';
import { useEffect, useState } from '@wordpress/element';
import { getEditorScrollContainer } from '../../utils';

const resolveScrollContainer = () => {
  const iframe = document.querySelector( 'iframe[name="editor-canvas"]' );
  const iframeBody = iframe?.contentDocument?.body;

  if ( iframeBody ) {
    return getScrollContainer( iframeBody ) || iframeBody;
  }

  return getEditorScrollContainer();
};

const useScrollContainer = () => {
  const [ scrollContainer, setScrollContainer ] = useState( null );

  useEffect( () => {
    const update = () => setScrollContainer( resolveScrollContainer() );
    update();

    const observer = new MutationObserver( update );
    observer.observe( document.body, { childList: true, subtree: true } );

    const iframe = document.querySelector( 'iframe[name="editor-canvas"]' );
    iframe?.addEventListener( 'load', update );

    return () => {
      observer.disconnect();
      iframe?.removeEventListener( 'load', update );
    };
  }, [] );

  return scrollContainer;
};
```

**Why this is better than one-time detection:** avoids stale container references during delayed iframe creation and editor mode transitions.

---

## Change 2: Fix `PreviewScrollingButton` cross-frame lookup (HIGH)

**File:** `packages/scrolling-effect/src/controls/preview-scrolling-button.js`

**Current issue:** Uses global `document.querySelector`, which can target wrong frame.

**Fix:**
- Query block node from `scrollContainer.ownerDocument`.
- Guard for null container.
- Include `clientId` in callback dependencies.

```js
const onClick = useCallback( () => {
  if ( ! scrollContainer ) return;

  const doc = scrollContainer.ownerDocument;
  const element = doc.querySelector( `#block-${ clientId }` );
  if ( ! element ) return;

  // existing scroll math unchanged
}, [ scrollContainer, clientId ] );
```

---

## Change 3: Fix navigation editor lookup using refs (HIGH)

**File:** `packages/block-library/src/blocks/navigation/index.js`

**Current issue:** `document.querySelector('.block-' + clientId)` queries outer document.

**Fix:**
1. Wrap `ServerSideRender` with `containerRef`.
2. Use `containerRef.current` as query root/observer root.
3. Keep observer cleanup explicit.

```js
const containerRef = useRef( null );

useLayoutEffect( () => {
  const container = containerRef.current;
  if ( ! container ) return;

  addSocialMenuClass( container );

  const observer = new MutationObserver( () => addSocialMenuClass( container ) );
  observer.observe( container, { childList: true, subtree: true } );

  return () => observer.disconnect();
}, [] );
```

---

## Change 4: Harden `addSocialMenuClass` to container document/window (MEDIUM, but important)

**File:** `packages/block-library/src/blocks/navigation/utils.js`

**Current issue:** even when passing a container, helper still reads `document.documentElement` and `window.getComputedStyle` from global context.

**Fix:**
1. Derive `doc` and `win` from `container.ownerDocument` when possible.
2. Use those for style reads.
3. Keep default behavior for frontend call `addSocialMenuClass()` (no arg).

```js
export const addSocialMenuClass = ( container = document ) => {
  const doc = container?.ownerDocument || container || document;
  const win = doc.defaultView || window;
  const root = doc.documentElement;

  const menuItem = container.querySelectorAll( '.nb-navigation .menu-item a' );
  const bodyStyle = win.getComputedStyle( root );
  // existing logic unchanged
};
```

Without this hardening, Change 3 can still produce false negatives when CSS vars are defined in canvas document, not outer shell.

---

## Commit Sequence

1. **`Fix useScrollContainer: robust iframe-aware resolution`** (Change 1)
2. **`Fix PreviewScrollingButton: query in scrollContainer document`** (Change 2)
3. **`Fix navigation block editor lookup: ref-based container`** (Change 3)
4. **`Harden addSocialMenuClass to ownerDocument/defaultView`** (Change 4)

Each commit should be independently reversible.

---

## Verification

After each commit:

```bash
cd /Users/georgeolaru/Local Sites/style-manager/app/public/wp-content/plugins/nova-blocks
npm run build
```

### Pre-flight static check (before and after wave)

```bash
rg -n "document\\.querySelector\\(|window\\.getComputedStyle\\(|iframe\\[name=\\\"editor-canvas\\\"\\]" \
packages/block-editor/src packages/scrolling-effect/src packages/block-library/src/blocks/navigation
```

### Functional tests (WP 7.0 beta/RC)

- [ ] Cards Collection -> Scrolling Effect -> `Preview Scrolling` animates as expected.
- [ ] Navigation block renders in editor without console errors.
- [ ] Social menu class is applied correctly in navigation preview.
- [ ] No `querySelector(...)=null` errors in console.
- [ ] Switching editor viewport/mode (Desktop/Tablet/Mobile preview where available) does not break scrolling preview after iframe context changes.

### Backward compatibility tests (WP 6.x current)

- [ ] Same tests pass on current supported WP baseline.
- [ ] Scrolling preview still works in non-iframe context.
- [ ] Navigation social class behavior unchanged on frontend and in editor.

### Visual consistency checks (release-gate subset)

- [ ] Cards Collection proportions/overlays/content hierarchy unchanged.
- [ ] Scrolling preview path/distance feels unchanged (no jumpy offsets).
- [ ] Navigation icon spacing and social icon styling unchanged.
- [ ] No editor layout shift or unstyled flash introduced by these changes.

### Safe-item spot checks (must pass)

- [ ] `controls-sections/index.js` advanced panel transition behavior unchanged.
- [ ] Google Map block editor preview still loads API and renders map/placeholder correctly.
- [ ] Overlay filter controls still read palettes without runtime errors.

If any safe-item check fails, promote that item into an immediate patch before closing Wave 2.

---

## Dependency and Exit Criteria

This wave remains independent of Style Manager Phase 1 and Anima Phase 2, and can run in parallel.

Wave 2 is complete when all are true:

1. All four changes are merged.
2. WP 7.0 tests pass with zero frame-context JS errors in covered flows.
3. WP 6.x regression checks pass.
4. Visual checks pass for cards + navigation surfaces.

**Wave 5 dependency:** do not start `apiVersion: 3` broad migration until this wave is complete and verified.

---

## Rollback

- Per-change rollback: revert individual commits.
- Full rollback: revert all Wave 2 commits on `feature/wp7-compat`.
- No `apiVersion` changes are part of this wave, so rollback does not alter block registration semantics.
