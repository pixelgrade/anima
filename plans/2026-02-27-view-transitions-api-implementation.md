# Page Transitions — View Transitions API Implementation

> Branch: `feature/view-transitions-api`
> Based on: `676f266d` (pre-Barba.js implementation)
> Date started: 2026-02-27

## Goal

Reimplement the page transitions feature using the **View Transitions API** + **Navigation API** + **GSAP** instead of Barba.js. This approach trades some animation flexibility for dramatically improved reliability — the browser handles real page navigation natively, eliminating all the asset-syncing and script re-initialization complexity of the Barba.js approach.

## Technology Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Navigation interception | Navigation API | Intercepts same-origin link clicks, provides history management, abort signals, back/forward support |
| Navigation fallback | Click event interception | For Firefox (no Navigation API support yet) |
| DOM swap | View Transitions API | `document.startViewTransition()` wraps content swap with browser-managed snapshot timing |
| Animation | GSAP (CDN, already registered) | Border expand/collapse, logo reveal, hero fade-in — same timings as Pile/Barba.js design |

### Browser Support (as of Feb 2026)

**Same-document View Transitions (SPA):** ~89% global — Chrome 111+, Edge 111+, Safari 18+, Firefox 144+

**Cross-document View Transitions (MPA):** ~82% global — Chrome 126+, Edge 126+, Safari 18.2+, Firefox: no support

**Navigation API:** Chromium only — Chrome 102+, Edge 102+. Firefox/Safari: not supported.

**Our approach:** Uses same-document transitions (fetch + swap within the page), not cross-document. Falls back gracefully:
- No Navigation API → click event interception (works everywhere)
- No View Transitions API → direct DOM swap (GSAP animations still play)
- No GSAP → instant content swap
- No JS → normal page loads

## Architecture

### Comparison with Barba.js approach

| Aspect | Barba.js (`main`) | View Transitions API (this branch) |
|--------|-------------------|--------------------------------------|
| Navigation interception | Barba.js library | Navigation API + click fallback |
| DOM swap mechanism | Barba container swap | `startViewTransition()` + innerHTML swap |
| Asset syncing | Manual `syncPageAssets()` with script re-execution tracking | `syncHeadAssets()` — simpler stylesheet/inline style sync |
| Script re-init | Complex: Nova Blocks events, FacetWP state, sharing overlay dedup | Simpler: resize/scroll events + `post-load` trigger |
| npm dependencies | `@barba/core` (~7KB gzip) + `gsap` | `gsap` only (CDN, already registered) |
| Bundle size | ~17KB | ~7.9KB minified |
| Maintenance burden | High — every new plugin/script can break transitions | Low — browser handles navigation natively |
| Reliability | Fragile — asset sync, body class sync, double-init prevention | Solid — real navigation with animation wrapper |

### File Structure

```
src/js/page-transitions.js                          — Webpack entry point
src/js/components/page-transitions/
  ├── index.js                                       — Navigation API + View Transitions API init
  ├── transitions.js                                 — GSAP timelines (border expand/collapse, initial load)
  └── utils.js                                       — Body class sync, title sync, admin bar, analytics, prefetch, head asset sync
src/scss/components/_page-transitions.scss           — Overlay styles, view-transition animation suppression
inc/integrations/page-transitions.php                — PHP: overlay markup, enqueue, config, body class
inc/integrations/style-manager/layout.php            — Style Manager Layout section with toggle
```

### How It Works

1. **Navigation API** (or click fallback) intercepts a same-origin link click
2. **Fetch** starts immediately for the target URL
3. **GSAP pageLeave timeline** plays: border expands inward (0.6s, `power4.inOut`), content fades out
4. Fetch completes, HTML is parsed into a new Document
5. **`document.startViewTransition()`** wraps the DOM swap (suppressed default cross-fade — GSAP handles visuals)
6. Content container (`.wp-site-blocks`) innerHTML is replaced, body classes/title/admin bar synced
7. **GSAP pageEnter timeline** plays: border collapses outward (0.6s), hero content fades in (0.4s staggered)
8. Post-transition: components reinit, analytics pageview pushed

### Animation Timings (from design doc)

**Page leave:** Border expands inward 0.6s `power4.inOut`, content fades out 0.3s concurrent

**Page enter:** Border collapses outward 0.6s `power4.inOut`, hero content fades in 0.4s staggered overlapping -0.4s

**Initial load (opening curtain):** Logo fills 0.3s → background scales 0.3s → border collapses 0.6s → hero fades in 0.4s

### CSS Strategy

The View Transitions API generates `::view-transition-*` pseudo-elements with a default cross-fade animation. We suppress these entirely:

```css
::view-transition-group(*),
::view-transition-old(*),
::view-transition-new(*) {
  animation: none !important;
}
```

All visual transitions are driven by GSAP on the `.c-page-transition-border` overlay element, matching the Pile theme's cinematic border animation.

## Changes Made

### New Files

- `src/js/page-transitions.js` — Webpack entry point
- `src/js/components/page-transitions/index.js` — Navigation API intercept, View Transitions API swap, click fallback, prefetch
- `src/js/components/page-transitions/transitions.js` — GSAP timelines: `pageLeave()`, `pageEnter()`, `initialLoadAnimation()`
- `src/js/components/page-transitions/utils.js` — `syncBodyClasses()`, `syncDocumentTitle()`, `syncAdminBar()`, `reinitComponents()`, `trackPageview()`, `shouldExcludeUrl()`, `syncHeadAssets()`
- `src/scss/components/_page-transitions.scss` — Overlay positioning, logo containers, view-transition suppression, reduced-motion
- `inc/integrations/page-transitions.php` — PHP integration: `anima_page_transitions_enabled()`, enqueue, overlay markup, body class filter
- `dist/js/page-transitions.js` + `.min.js` — Compiled output

### Modified Files

- `webpack.config.js` — Added `page-transitions` / `page-transitions.min` entry points
- `inc/integrations.php` — Added `require_once` for `page-transitions.php`
- `inc/integrations/style-manager/style-manager.php` — Added `require_once` for `layout.php`
- `inc/integrations/style-manager/layout.php` — Rewrote to use `style_manager/filter_fields` filter (matching main branch pattern), added Layout section with Site Container, Content Inset, Spacing Level, and Page Transitions toggle
- `src/scss/style.scss` — Added `@import "components/page-transitions"`
- `style.css` / `style-rtl.css` — Recompiled with page transition styles

## Current Status — IN PROGRESS

### Working

- PHP integration loads correctly (overlay markup renders, script enqueues)
- Webpack compiles successfully (7.9KB minified bundle, no dependencies beyond GSAP CDN)
- SCSS compiles into `style.css`
- Border overlay appears on page load with accent color and centered logo
- Style Manager Layout section with toggle (uses `style_manager/filter_fields` filter)
- Currently force-enabled (`return true`) in `anima_page_transitions_enabled()` for testing

### Known Issue — Initial Load Animation

The opening curtain animation starts (border covers viewport, logo visible) but the GSAP timeline to collapse the border may not complete reliably. Debug logging has been added (`[page-transitions]` prefix in console) and a **safety timeout** (4 seconds) force-clears the overlay if the animation stalls.

Console logs to check:
- `[page-transitions] initialLoad: starting, coverWidth=X` — animation began
- `[page-transitions] initialLoad: gsap version=X` — confirms GSAP loaded
- `[page-transitions] initialLoad: complete` — animation finished successfully
- `[page-transitions] Animation timed out, force-clearing overlay.` — safety fallback triggered

### Not Yet Tested

- Link click navigation (pageLeave → fetch → swap → pageEnter)
- Back/forward navigation via Navigation API
- Click fallback for Firefox
- Link prefetch on hover
- URL exclusions (admin, WooCommerce, file downloads)
- Hero content fade-in after transition
- Analytics pageview tracking
- `prefers-reduced-motion` behavior

### TODO

- [ ] Debug initial load animation stall (check browser console for GSAP errors)
- [ ] Test full navigation cycle (click link → transition → new page)
- [ ] Test back/forward navigation
- [ ] Test Firefox fallback (click interception, no Navigation API)
- [ ] Verify URL exclusions work correctly
- [ ] Restore `pixelgrade_option('enable_page_transitions')` check (currently force-enabled)
- [ ] Remove debug `console.log` statements
- [ ] Consider whether `syncHeadAssets()` needs script re-execution logic
- [ ] Test with WooCommerce pages
- [ ] Test with Nova Blocks hero blocks
