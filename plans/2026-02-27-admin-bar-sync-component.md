# Admin Bar Sync Component — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace the current partial admin bar sync (edit link + customize URL only) with a full admin bar replacement that handles items appearing/disappearing between pages during AJAX navigation.

**Architecture:** Extract the entire `#wpadminbar` element from the new page's raw HTML response and replace the current DOM element. This is simpler and more robust than manually handling each individual admin bar item — WordPress core, plugins, and themes can all add/remove admin bar nodes depending on context, and a full replacement catches everything.

**Tech Stack:** jQuery (already available), Barba.js v2 (existing), DOMParser (native)

---

## Background

### Current state

The existing `syncAdminBar()` in `utils.js:217-252` only:
1. Updates the Edit link's `href` and label text
2. Shows/hides the Edit button
3. Updates the Customize link's `url=` query param

It does **not** handle:
- Admin bar items that appear on some pages but not others (e.g., Customize button only appears on front-end pages, Edit button doesn't exist at all on archive pages without a post)
- Plugin-added admin bar items that are context-dependent
- Any future WordPress core admin bar changes

### Pile's approach

Pile's `adminBarEditFix()` in `assets/js/main/unsorted.js` goes further — it **creates** the Edit button DOM node when navigating from a page that lacks one (e.g., archive → single post) and **removes** it when navigating away. But it still only handles Edit + Customize manually.

### New approach

Instead of manually managing individual items, **replace the entire `#wpadminbar` element** from the new page response. This is:
- Simpler (one DOM replacement vs. many conditionals)
- Future-proof (handles any admin bar item from any source)
- More correct (matches exactly what a full page load would show)

The `#anima-page-data` JSON block is no longer needed for admin bar sync (the admin bar HTML itself carries all the information). However, keep the JSON block — it may be useful for other purposes (post ID, etc.).

---

### Task 1: Create the admin-bar sync module

**Files:**
- Create: `src/js/components/page-transitions/admin-bar.js`

**Step 1: Create the module**

```js
import $ from 'jquery';

/**
 * Sync the WordPress admin bar from the new page's raw HTML.
 *
 * Replaces the entire #wpadminbar element with the one from the AJAX response.
 * This handles all admin bar changes: items appearing/disappearing, link updates,
 * plugin-added nodes, etc.
 *
 * @param {string} html - Full HTML response from Barba's AJAX fetch.
 */
export function syncAdminBar( html ) {
  if ( ! document.getElementById( 'wpadminbar' ) ) {
    return;
  }

  const parser = new DOMParser();
  const doc = parser.parseFromString( html, 'text/html' );
  const newAdminBar = doc.getElementById( 'wpadminbar' );

  if ( ! newAdminBar ) {
    return;
  }

  const currentAdminBar = document.getElementById( 'wpadminbar' );
  currentAdminBar.replaceWith( newAdminBar );
}
```

**Step 2: Verify the file was created correctly**

Run: `cat src/js/components/page-transitions/admin-bar.js`
Expected: The module code from Step 1.

**Step 3: Commit**

```bash
git add src/js/components/page-transitions/admin-bar.js
git commit -m "Add admin-bar sync module for page transitions

Replaces the entire #wpadminbar from the AJAX response HTML instead of
manually updating individual links. Handles admin bar items that
appear/disappear between pages (Edit, Customize, plugin items, etc.)."
```

---

### Task 2: Wire the new module into transitions and remove old code

**Files:**
- Modify: `src/js/components/page-transitions/transitions.js:1-10` (imports)
- Modify: `src/js/components/page-transitions/transitions.js:127-128` (call site)
- Modify: `src/js/components/page-transitions/utils.js:217-252` (remove old syncAdminBar)

**Step 1: Update transitions.js imports**

Replace the `syncAdminBar` import source — it now comes from `./admin-bar` instead of `./utils`:

```js
import {
  syncBodyClasses,
  syncPageAssets,
  syncDocumentTitle,
  reinitComponents,
  cleanupBeforeTransition,
  trackPageview,
} from './utils';
import { syncAdminBar } from './admin-bar';
```

**Step 2: Remove old syncAdminBar from utils.js**

Delete the entire `syncAdminBar` function (lines 209-252, including the JSDoc comment) and its export from `utils.js`. The function in `admin-bar.js` replaces it entirely.

**Step 3: Verify the import/call chain is intact**

The call in `transitions.js:128` (`syncAdminBar( html )`) stays exactly the same — only the import source changes.

Run: `npm run scripts`
Expected: Webpack builds successfully with no errors.

**Step 4: Commit**

```bash
git add src/js/components/page-transitions/transitions.js src/js/components/page-transitions/utils.js src/js/components/page-transitions/admin-bar.js dist/js/
git commit -m "Wire admin-bar sync module into transitions, remove old partial sync

The old syncAdminBar() in utils.js only updated Edit link hrefs and
Customize URL params. The new module in admin-bar.js does a full
#wpadminbar replacement from the AJAX response."
```

---

### Task 3: Remove the `#anima-page-data` JSON dependency for admin bar

**Files:**
- Modify: `inc/integrations/page-transitions.php:146-171` (simplify or keep for other uses)

**Step 1: Evaluate if `#anima-page-data` is used elsewhere**

Search the JS codebase for any reference to `anima-page-data` outside of the old `syncAdminBar`. If nothing else uses it, remove the PHP function. If other code uses `postId`, keep it.

Currently the JSON outputs `postId`, `editLink`, `editLabel`. The new admin bar sync doesn't need any of these (it reads the admin bar HTML directly). If `postId` isn't used elsewhere, the entire `anima_page_transitions_post_data()` function can be removed.

**Step 2a: If nothing else uses it — remove the PHP function**

Delete the `anima_page_transitions_post_data()` function and its `add_action` hook (lines 142-171).

**Step 2b: If `postId` is used elsewhere — keep but simplify**

Remove `editLink` and `editLabel` from the JSON output since they're no longer consumed by JS.

**Step 3: Commit**

```bash
git add inc/integrations/page-transitions.php
git commit -m "Remove anima-page-data JSON block (no longer needed for admin bar sync)

The full #wpadminbar replacement reads all data from the admin bar HTML
itself. The JSON intermediary is no longer needed."
```

---

### Task 4: Build and manual verification

**Step 1: Run the full JS build**

Run: `npm run scripts`
Expected: Clean webpack build, no errors.

**Step 2: Test in browser (manual)**

1. Log in to WordPress as admin
2. Navigate the front-end with page transitions enabled
3. Verify:
   - **Edit button appears** when navigating to a single post/page
   - **Edit button disappears** when navigating to an archive/search page
   - **Customize button** URL updates to current page
   - **Any other admin bar items** (from plugins) update correctly
   - No console errors during transitions

**Step 3: Commit the dist files**

```bash
git add dist/js/
git commit -m "Build page-transitions JS with admin bar sync component"
```

---

## Notes

- The `admin-bar` class in `syncBodyClasses()` preserve list (utils.js:20) is still needed — it ensures the body class persists through the class swap, which controls CSS spacing for the admin bar.
- The `#anima-page-data` JSON block is independent from the admin bar sync. Removing it is a cleanup step, not a functional requirement.
- If the `DOMParser` approach causes issues with inline scripts inside the admin bar (WordPress sometimes injects `<script>` tags), we may need to fall back to regex extraction of the `#wpadminbar` element. But `DOMParser` strips scripts by default, which is actually desirable — admin bar scripts run once on initial load and shouldn't re-execute.
