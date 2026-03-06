# Page Transitions Feature — Design Document

> GitHub Issue: [#363](https://github.com/pixelgrade/anima/issues/363)

**Status:** Implemented

## Current Status Snapshot

- The feature shipped and was later refined by follow-up fixes
- This file remains the design reference for the current implementation
- Remaining work, when needed, should be tracked as bug fixes or targeted follow-up plans rather than as a new feature design task

## Goal

Add an optional page transitions system to Anima, porting the cinematic border-expand animation from the Pile theme. When enabled, internal navigation uses AJAX page loading with a smooth 4-sided border overlay (with centered site logo) instead of full page reloads.

## Technology

- **Barba.js v2** — AJAX navigation (npm: `@barba/core`). ~7KB gzipped, modern ES modules, built-in cache and prefetch.
- **GSAP v3** — Animation engine (npm: `gsap`). Core + ScrollToPlugin. Tree-shaken — only imported in the page-transitions entry point.

## Architecture

### Zero-footprint when disabled

- Style Manager layout option: `enable_page_transitions` (default: **off**)
- When off: no JS loaded, no CSS loaded, no overlay markup in DOM
- When on: PHP outputs overlay markup in `wp_footer`, conditionally enqueues `page-transitions.js`, passes config via `wp_localize_script()`

### File structure

```
src/js/page-transitions.js                         — Webpack entry point
src/js/components/page-transitions/
  ├── index.js                                      — Barba.js init, link exclusion config
  ├── transitions.js                                — GSAP timeline definitions (ported from Pile)
  ├── loading-animation.js                          — Initial page load animation (opening curtain)
  └── utils.js                                      — Body class sync, admin bar fix, title update, component reinit
src/scss/components/_page-transitions.scss          — Overlay positioning, border styles, keyframes
inc/integrations/page-transitions.php               — PHP: overlay markup, enqueue, config, exclusions
inc/integrations/style-manager/layout.php           — Style Manager toggle field (added to existing file)
```

### Webpack entry point

New entry in `webpack.config.js`:

```js
'./dist/js/page-transitions': './src/js/page-transitions.js',
'./dist/js/page-transitions.min': './src/js/page-transitions.js',
```

Separate from `scripts.js`. Only loaded when the feature is enabled.

### Barba container

Wraps page content in template markup. The header and footer template parts stay **outside** the container — they persist across transitions.

```html
<!-- parts/header.html or template-canvas -->
<div data-barba="wrapper">
  <div data-barba="container" data-barba-namespace="<?php echo get_post_type(); ?>">

    <!-- page content (swapped on each transition) -->

  </div>
</div>
```

### Overlay markup

Output via PHP in `wp_footer` (only when feature is enabled):

```html
<div class="c-page-transition-border js-page-transition-border"
     style="border-color: var(--sm-current-accent-color); background: var(--sm-current-accent-color);">
  <div class="border-logo-bgscale">
    <div class="border-logo-background">
      <div class="border-logo-fill"></div>
      <div class="logo"><?php the_custom_logo(); ?></div>
    </div>
  </div>
  <div class="border-logo"><?php the_custom_logo(); ?></div>
</div>
```

## Animation

Direct port of Pile's `AjaxLoading.js` and `loadingAnimation.js` timelines.

### Page leave (link clicked → old page hidden)

| Step | What | Duration | Easing |
|------|------|----------|--------|
| 1 | Border expands inward from all 4 sides | 0.6s | `power4.inOut` (GSAP v3 equivalent of `Quart.easeInOut`) |
| 2 | Nav menu closes | concurrent | |
| 3 | Old content fades out | concurrent | |
| 4 | Logo visible at center of border | within border animation | |

### Content swap (during animation)

- Barba fetches new page via XHR
- New content injected into `data-barba="container"`
- Scroll to top (instant)
- Body classes synced from new page HTML
- Document title updated
- Admin bar Edit/Customize links updated

### Page enter (new page revealed)

| Step | What | Duration | Easing |
|------|------|----------|--------|
| 1 | Border collapses outward to edges | 0.6s | `power4.inOut` |
| 2 | Hero content fades in | 0.4s | staggered, overlaps -0.4s |
| 3 | Hero background scales 1.2→1 | 0.4s | staggered |

**Total perceived transition: ~1.1s**

### Initial page load (first visit)

Plays the Pile-style "opening curtain":
1. Logo fills in from left (0.3s)
2. Background scales away (0.3s, delayed 0.3s)
3. Border collapses (0.6s, delayed 0.5s)
4. Hero content fades in (0.4s, delayed 0.7s)

### CSS (ported from Pile's `_loading.scss`)

```scss
.c-page-transition-border {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 100000;
  pointer-events: none;
  border: 0 solid transparent;
  // GSAP animates borderWidth to expand/collapse
}

@keyframes raiseMeUp {
  0%   { transform: translate3d(-50%, -50%, 0) scaleY(0); }
  100% { transform: translate3d(-50%, -50%, 0) scaleY(1); }
}

@keyframes fillMe {
  0%   { transform: translate3d(0, 0, 0); }
  100% { transform: translate3d(90%, 0, 0); }
}
```

## Component Lifecycle (re-scan and re-bind)

Following Pile's pattern — pragmatic, not strict lifecycle management.

### What persists across transitions (outside Barba container)

- Header / navbar
- Footer
- Search overlay
- WooCommerce cart widget
- Admin bar

These are never destroyed. Event listeners on them use delegation (`$body.on(...)`) so they keep working.

### What gets reinitialized after each transition

After content swap, re-run Anima's component init logic on the new DOM:

- `Hero` — re-query hero elements, re-bind scroll-driven animations
- `CommentsArea` — re-query comment toggle, re-bind click handler
- `App.showLoadedImages()` — re-scan for lazy-loaded images

### Selective cleanup before transition (heavy resources only)

- Pause and remove `<video>` elements from old content
- Close any open modals/overlays
- Future: if Nova Blocks adds heavy JS instances (sliders, carousels), add explicit `.destroy()` calls here

### Two-phase init pattern

```js
// Run once on initial page load
function initOnce() {
  // Global scroll/resize listeners
  // Barba.js setup
}

// Run on every page load (initial + after each AJAX transition)
function initPage() {
  // Hero, CommentsArea, images, WooCommerce product galleries
  // Delegated event handlers for page-specific content
}

// Run only on AJAX transitions (not initial load)
function initAfterTransition() {
  // Google Analytics pageview
  // Re-trigger WooCommerce cart fragments
  // Re-init any third-party embeds
}
```

## Link Exclusions

All internal links get AJAX navigation **except**:

| Pattern | Reason |
|---------|--------|
| External links (different hostname) | Not same-origin |
| `#` anchors | Same-page navigation |
| `.pdf`, `.doc`, `.zip`, `.jpg`, `.png`, `.eps` | File downloads |
| `wp-admin`, `wp-login`, `wp-` prefixed | Admin pages |
| WooCommerce cart & checkout URLs | Transactional pages |
| `?add-to-cart=`, `?remove_item` | Cart actions |
| Links with `target="_blank"` | New window intent |
| `feed` | RSS feeds |

Exclusion list passed to JS via `wp_localize_script()`.
Filterable via PHP: `anima_page_transitions_excluded_urls`.

## WordPress Integration

### Body class sync

Parse new page's `<body>` from XHR response (same `NOTBODY` replacement trick as Pile), extract class attribute, apply to current DOM. Critical for conditional CSS (`.single`, `.archive`, `.woocommerce`, etc.).

### Document title

Extract `<title>` from new page's `<head>` in response HTML. Update `document.title`.

### Admin bar

Update Edit and Customize link hrefs using new page's post ID (passed via `data-curpostid` on `<body>`). Only when admin bar is present.

### Dynamic scripts/styles

After transition, check if new page requires scripts/styles not yet loaded. Track loaded handles in a JS set, load new ones via dynamic `<script>` / `<style>` injection. Same pattern as Pile's `loadDynamicScripts()`.

### Analytics

Push pageview event after each transition:
- Google Analytics (`gtag('event', 'page_view')`)
- Google Tag Manager (dataLayer push)
- Fallback: `_gaq.push(['_trackPageview'])` for legacy GA

## Style Manager Configuration

Added to `inc/integrations/style-manager/layout.php`:

```php
'enable_page_transitions' => array(
    'type'    => 'checkbox',
    'label'   => esc_html__( 'Enable page transitions', '__theme_txtd' ),
    'desc'    => esc_html__( 'Smooth animated transitions between pages using AJAX navigation.', '__theme_txtd' ),
    'default' => false,
    'section' => 'layout',
),
```

## Edge Cases

### Customizer preview

Disable AJAX navigation entirely when in the Customizer preview (`.is--customizer-preview` body class). Full page reloads needed for Customizer to track changes.

### Browser back/forward

Barba.js v2 handles `popstate` events natively. The transition animation plays in reverse direction for back navigation.

### JavaScript errors

If a transition fails (network error, JS error during reinit), Barba v2 has error hooks. Fallback: do a full page reload to the target URL. Never leave the user on a broken page.

### No custom logo set

If no custom logo exists, the overlay still works — the logo area is simply empty. The border animation is the primary visual; the logo is a nice-to-have.

### WooCommerce cart widget

The mini-cart widget lives outside the Barba container (in header/footer). After transition, trigger `wc_cart_fragments_refresh` to sync cart state with the new page.

## npm Dependencies to Add

```json
{
  "@barba/core": "^2.10.0",
  "gsap": "^3.12.0"
}
```

Both imported only in `src/js/page-transitions.js`. Tree-shaken in the webpack build.
