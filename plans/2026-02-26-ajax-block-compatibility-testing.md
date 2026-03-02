# AJAX Block Compatibility Testing Plan

**Goal:** Systematically test every Nova Blocks and WordPress Core block that uses frontend JavaScript through AJAX page transitions, comparing behavior against fresh page loads to identify rendering, functionality, and scripting issues.

**Method:** Create dedicated test pages per block (via wp-cli), then navigate to each via AJAX and via full refresh. Compare screenshots and check console for errors. Blocks with frontend JS get the most scrutiny since their scripts may not reinitialize after Barba container swap.

**Prerequisites:**
- WordPress Studio site (recommended over Local by Flywheel for wp-cli ease)
- Anima theme active with page transitions enabled
- Nova Blocks plugin active
- Chrome DevTools MCP server connected (for screenshots and console monitoring)

---

## Block Risk Categories

### Tier 1 — HIGH RISK: Blocks with frontend JS (must test thoroughly)

These blocks run JavaScript on the frontend. After AJAX navigation, their scripts may not reinitialize, may double-initialize, or may lose their data dependencies.

| # | Block | Script Purpose | Known Risk |
|---|-------|---------------|------------|
| **Nova Blocks** | | | |
| 1 | `novablocks/header` | Sticky header, transparent overlay, mobile nav, color signals, reading bar, GSAP intro | Complex state machine. Re-execution could cause duplicate sticky observers or wrong height calculations. |
| 2 | `novablocks/supernova` | Dropcap resize, carousel (Slick.js), grid layout (classic/masonry/parametric), scroll indicator, position indicators, duotone filters | Slick.js may not destroy/reinit cleanly. Grid layout dispatch fires `nb:layout` event — listeners may not rebind. |
| 3 | `novablocks/sharing-overlay` | Shariff social share popup, body-appended overlay, click handlers | Moves elements to `<body>` — may create duplicates on reinit. Already fixed once (duplicate icons). |
| 4 | `novablocks/facetwp-filter` | Toggle handler for filter visibility | Already fixed (double-init caused toggle cancel). Verify still works. |
| 5 | `novablocks/navigation` | Social menu class detection from CSS custom properties | Reads `--enable-social-icons` from document root. Should reinit cleanly. |
| 6 | `novablocks/announcement-bar` | Cookie-based show/hide, close handler | Cookie persists. Reinit could rebind close handler. |
| 7 | `novablocks/google-map` | Google Maps API init, custom markers, dark mode, Customizer live preview | Requires `window.google.maps`. Map instances stored in `REFERENCES` — reinit could create duplicate maps. |
| 8 | `novablocks/post-comments` | Comment highlight AJAX, copy link, dropdown close | jQuery event handlers. Should reinit via `reinitNovaBlocksScripts()`. |
| 9 | `novablocks/header-row` | Sticky row scroll logic (currently disabled — `return` on line 11) | Script is a no-op. Low risk but include for completeness. |
| **WordPress Core** | | | |
| 10 | `core/navigation` | Mobile overlay, desktop submenus, focus trap, aria | Uses Interactivity API. May not reinit after Barba swap. |
| 11 | `core/image` (lightbox) | Lightbox overlay, zoom animation, focus trap, touch events | Uses Interactivity API. Lightbox may not bind to new images. |
| 12 | `core/query` (enhanced pagination) | Client-side pagination via Interactivity Router | Two AJAX systems (Barba + Interactivity Router) may conflict. |
| 13 | `core/search` (expandable) | Icon-only search toggle | Uses Interactivity API. Toggle state may not bind after swap. |
| 14 | `core/file` (PDF preview) | PDF browser support detection | Uses Interactivity API. Mostly state-based, low risk. |

### Tier 2 — MEDIUM RISK: Blocks with PHP-generated inline CSS

These blocks generate inline CSS custom properties at render time. The styles are in the HTML container that Barba swaps, so they should survive. But per-page `<style>` blocks in `<head>` may differ between pages.

| # | Block | Inline CSS |
|---|-------|-----------|
| 15 | `novablocks/post-meta` | Layout CSS props (flex direction, display) |
| 16 | `novablocks/author-box` | Spacing/sizing CSS props |
| 17 | `novablocks/sidecar` | Spacing/sizing CSS props |
| 18 | `novablocks/cpt-metafields` | Layout/sizing CSS props |
| 19 | `novablocks/post-navigation` | Spacing/sizing CSS props |

### Tier 3 — LOW RISK: Static blocks (no JS, no dynamic inline CSS)

These are pure HTML/CSS. AJAX swap should work perfectly. Quick visual check only.

Core blocks: `paragraph`, `heading`, `list`, `quote`, `pullquote`, `image` (no lightbox), `gallery`, `cover`, `media-text`, `video`, `audio`, `button/buttons`, `columns`, `group`, `spacer`, `separator`, `table`, `code`, `preformatted`, `details`, `embed`, `social-links`, `archives`, `categories`, `tag-cloud`, `latest-posts`, `latest-comments`, `calendar`, `rss`.

Nova Blocks without JS: `headline`, `logo`, `menu-food`, `openhours`, `opentable`, `facetwp-facet`, `facetwp-selections`, `facetwp-title`, `facetwp-toggle`.

---

## Test Page Setup (wp-cli)

Each command creates a page with the specified block markup. Run these from the WordPress root directory.

### Environment setup

```bash
# If using Studio, these commands work directly.
# If using Local by Flywheel, prefix with the PHP binary + socket:
# LOCAL_PHP="/path/to/Local/php"
# MYSQL_SOCK="/path/to/Local/run/SITE_ID/mysql/mysqld.sock"
# "$LOCAL_PHP" "$(which wp)" ...

# Create a parent page to organize test pages
wp post create --post_type=page --post_title="Block Tests" --post_status=publish --porcelain
# Note the returned ID — use it as --post_parent below
```

### Tier 1 Pages (blocks with frontend JS)

```bash
# 1. Header block — tested implicitly (present on every page via FSE template parts)
# No separate page needed — test by navigating between any two pages.

# 2. Supernova (collection — carousel layout)
wp post create --post_type=page --post_title="Test: Supernova Carousel" --post_status=publish --post_content='<!-- wp:novablocks/supernova {"variation":"posts-collection","layoutStyle":"carousel","columns":3} /-->'

# 3. Supernova (collection — masonry layout)
wp post create --post_type=page --post_title="Test: Supernova Masonry" --post_status=publish --post_content='<!-- wp:novablocks/supernova {"variation":"posts-collection","layoutStyle":"masonry","columns":3} /-->'

# 4. Supernova (collection — parametric grid)
wp post create --post_type=page --post_title="Test: Supernova Parametric" --post_status=publish --post_content='<!-- wp:novablocks/supernova {"variation":"posts-collection","layoutStyle":"parametric","columns":3} /-->'

# 5. Supernova (hero — with scroll indicator)
wp post create --post_type=page --post_title="Test: Supernova Hero" --post_status=publish --post_content='<!-- wp:novablocks/supernova {"variation":"hero","cardLayout":"stacked","columns":1,"align":"full"} --><!-- wp:novablocks/supernova-item --><!-- wp:paragraph --><p>Hero content with scroll indicator</p><!-- /wp:paragraph --><!-- /wp:novablocks/supernova-item --><!-- /wp:novablocks/supernova -->'

# 6. Sharing overlay
wp post create --post_type=page --post_title="Test: Sharing Overlay" --post_status=publish --post_content='<!-- wp:novablocks/sharing-overlay /-->'

# 7. FacetWP filter (requires FacetWP plugin + configured facets)
wp post create --post_type=page --post_title="Test: FacetWP Filters" --post_status=publish --post_content='<!-- wp:novablocks/facetwp-filter --><!-- wp:novablocks/facetwp-facet {"facetName":"categories"} /--><!-- wp:novablocks/facetwp-toggle --><!-- wp:paragraph --><p>+ More Filters</p><!-- /wp:paragraph --><!-- /wp:novablocks/facetwp-toggle --><!-- /wp:novablocks/facetwp-filter -->'

# 8. Navigation (social menu detection)
# Tested implicitly via header template part — no separate page needed.

# 9. Announcement bar
# Configured via FSE template parts — test by adding to header template.
# Create a page to navigate TO (the bar is global):
wp post create --post_type=page --post_title="Test: Announcement Bar Target" --post_status=publish --post_content='<!-- wp:paragraph --><p>Navigate here to test announcement bar persistence.</p><!-- /wp:paragraph -->'

# 10. Google Map (requires Google Maps API key in settings)
wp post create --post_type=page --post_title="Test: Google Map" --post_status=publish --post_content='<!-- wp:novablocks/google-map {"markers":[{"location":{"lat":40.7128,"lng":-74.006},"label":"New York"}],"zoom":12} /-->'

# 11. Post comments
# Use an existing post with comments enabled — no page creation needed.
# Or create a post:
wp post create --post_type=post --post_title="Test: Comments Block" --post_status=publish --comment_status=open --post_content='<!-- wp:novablocks/post-comments /-->'

# 12. Core Navigation (mobile overlay + submenus)
# Tested implicitly via header — the core/navigation block is in FSE template parts.
# To test the expandable search variant specifically:
wp post create --post_type=page --post_title="Test: Core Search Expandable" --post_status=publish --post_content='<!-- wp:search {"buttonPosition":"button-only","isSearchFieldHidden":true} /-->'

# 13. Core Image with lightbox
wp post create --post_type=page --post_title="Test: Image Lightbox" --post_status=publish --post_content='<!-- wp:image {"lightbox":{"enabled":true}} --><figure class="wp-block-image"><img src="/wp-content/uploads/sample.jpg" alt="Test"/></figure><!-- /wp:image -->'

# 14. Core Query with enhanced pagination
wp post create --post_type=page --post_title="Test: Query Enhanced Pagination" --post_status=publish --post_content='<!-- wp:query {"queryId":1,"query":{"perPage":3,"pages":0,"offset":0,"postType":"post"},"enhancedPagination":true} --><!-- wp:post-template --><!-- wp:post-title /--><!-- wp:post-excerpt /--><!-- /wp:post-template --><!-- wp:query-pagination --><!-- wp:query-pagination-previous /--><!-- wp:query-pagination-numbers /--><!-- wp:query-pagination-next /--><!-- /wp:query-pagination --><!-- /wp:query -->'

# 15. Core File with PDF preview
# Requires an uploaded PDF — upload one first:
# wp media import /path/to/sample.pdf --porcelain
# Then use the attachment URL in the block markup.
wp post create --post_type=page --post_title="Test: File PDF Preview" --post_status=publish --post_content='<!-- wp:file {"displayPreview":true} --><div class="wp-block-file"><a href="/wp-content/uploads/sample.pdf">Sample PDF</a></div><!-- /wp:file -->'
```

### Tier 2 Pages (inline CSS blocks)

```bash
# 16. Post meta (test via a single post page — post-meta is in post templates)
# Already tested by navigating to any post.

# 17. Author box
wp post create --post_type=page --post_title="Test: Author Box" --post_status=publish --post_content='<!-- wp:novablocks/author-box /-->'

# 18. Sidecar
wp post create --post_type=page --post_title="Test: Sidecar" --post_status=publish --post_content='<!-- wp:novablocks/sidecar --><!-- wp:novablocks/sidecar-area --><!-- wp:paragraph --><p>Sidebar content</p><!-- /wp:paragraph --><!-- /wp:novablocks/sidecar-area --><!-- wp:novablocks/sidecar-area --><!-- wp:paragraph --><p>Main content</p><!-- /wp:paragraph --><!-- /wp:novablocks/sidecar-area --><!-- /wp:novablocks/sidecar -->'

# 19. Post navigation
# Tested by navigating to a single post — post-navigation is in post templates.
```

### Hub page (links to all test pages)

```bash
# After creating all pages, generate a hub page with links to each.
# This serves as the starting point for AJAX navigation testing.
wp post create --post_type=page --post_title="AJAX Test Hub" --post_status=publish --post_content='<!-- wp:heading --><h2>Block Compatibility Tests</h2><!-- /wp:heading --><!-- wp:paragraph --><p>Click each link to test AJAX navigation. Compare with direct URL load (Ctrl+Shift+click or paste URL).</p><!-- /wp:paragraph --><!-- wp:list -->REPLACE_WITH_LINKS<!-- /wp:list -->'

# Then update with actual links using:
# wp post list --post_type=page --post_status=publish --field=url --title="Test:*"
```

---

## Test Procedure

For each test page, perform these steps:

### A. Fresh load baseline

1. Open the page URL directly in the browser (full page load)
2. Take a screenshot → save as `screenshots/fresh/{block-name}.png`
3. Record console output (errors, warnings)
4. Test block-specific functionality (click handlers, toggles, animations)

### B. AJAX navigation test

1. Start from the Hub page (or any other page)
2. Click the link to the test page (AJAX transition)
3. Wait for border animation to complete
4. Take a screenshot → save as `screenshots/ajax/{block-name}.png`
5. Record console output (errors, warnings)
6. Test block-specific functionality (same interactions as baseline)

### C. Compare and record

| Check | Pass criteria |
|-------|--------------|
| Visual match | Screenshots match (layout, colors, spacing, visibility) |
| Console clean | No new JS errors after AJAX navigation |
| Functionality | All interactive features work (clicks, toggles, animations) |
| No duplicates | No duplicate DOM elements (share icons, map instances, carousels) |
| Styles correct | Inline CSS custom properties present on block elements |
| Scripts loaded | Required frontend scripts are in the DOM (check `<script>` tags) |

---

## Block-Specific Test Scripts

### 1. Header (`novablocks/header`)

```
Test: Navigate between pages, check:
- [ ] Header height CSS variable (--nb-header-height) is set
- [ ] Transparent header works on hero pages
- [ ] Sticky header activates on scroll
- [ ] Mobile nav hamburger opens/closes
- [ ] Reading bar appears on single posts
- [ ] No duplicate sticky scroll observers (check for layout jumps)
- [ ] Color signal classes update correctly
```

### 2-5. Supernova collections (`novablocks/supernova`)

```
Test each layout variant (carousel, masonry, parametric, hero):
- [ ] Carousel: arrows work, slides move, dots update
- [ ] Masonry: items positioned correctly (not stacked)
- [ ] Parametric: grid layout applied (not default flow)
- [ ] Hero: scroll indicator visible and clickable
- [ ] Dropcap: sized correctly (not oversized/missing)
- [ ] Position indicators (dots): synced with visible item
- [ ] Duotone filters: SVG filter applied to images
- [ ] No Slick.js "slick-initialized" class on destroyed carousels
```

### 6. Sharing overlay (`novablocks/sharing-overlay`)

```
- [ ] Share button visible (only ONE icon, not duplicated)
- [ ] Click opens popup with social buttons
- [ ] Popup positioned correctly relative to trigger
- [ ] Click outside closes popup
- [ ] Shariff social links render (not empty)
- [ ] Copy link button works
```

### 7. FacetWP filter (`novablocks/facetwp-filter`)

```
- [ ] Filter facets render with correct options
- [ ] Clicking a filter updates results
- [ ] "+ More Filters" toggle reveals hidden filters
- [ ] Toggle state correct (data-toggled changes)
- [ ] window.FWP_JSON is populated with correct data
- [ ] FacetWP external script is loaded
```

### 8. Announcement bar (`novablocks/announcement-bar`)

```
- [ ] Bar visible if not previously dismissed
- [ ] Close button hides bar
- [ ] Cookie persists across AJAX navigations
- [ ] Bar stays hidden after dismiss + AJAX navigate
- [ ] No duplicate close handlers (close once = stays closed)
```

### 9. Google Map (`novablocks/google-map`)

```
- [ ] Map renders with tiles loaded
- [ ] Custom markers visible at correct positions
- [ ] Map interactive (pan, zoom)
- [ ] No duplicate map instances in DOM
- [ ] Dark mode toggle updates map style (if applicable)
```

### 10. Post comments (`novablocks/post-comments`)

```
- [ ] Comment form visible and submittable
- [ ] Comment highlight toggle works (AJAX call fires)
- [ ] Copy comment link works (clipboard)
- [ ] Dropdown menus open/close
- [ ] No stale event handlers
```

### 11. Core Navigation (`core/navigation`)

```
- [ ] Mobile hamburger opens overlay
- [ ] Overlay has focus trap (Tab cycles)
- [ ] Escape closes overlay
- [ ] Desktop submenus open on hover
- [ ] aria-modal and role="dialog" set on overlay
- [ ] has-modal-open class toggles on <html>
```

### 12. Core Image lightbox (`core/image`)

```
- [ ] Click image opens lightbox overlay
- [ ] Zoom animation plays
- [ ] Escape closes lightbox
- [ ] Focus trapped inside lightbox
- [ ] Scroll locked while lightbox open
- [ ] Close button works
```

### 13. Core Query enhanced pagination (`core/query`)

```
- [ ] Pagination links render
- [ ] Click pagination does client-side navigation (no full reload)
- [ ] Content updates correctly
- [ ] No conflict between Barba AJAX and Interactivity Router
- [ ] Back button works after pagination
```

### 14. Core Search expandable (`core/search`)

```
- [ ] Search icon visible
- [ ] Click expands input field
- [ ] Input field accepts text
- [ ] Submit works
- [ ] Escape collapses input
- [ ] Click outside collapses input
```

---

## Automation Script

This script automates the screenshot comparison using Chrome DevTools MCP.

```bash
#!/bin/bash
# ajax-block-test.sh — Automated AJAX block compatibility testing
#
# Usage: ./ajax-block-test.sh <site-url>
# Example: ./ajax-block-test.sh http://style-manager.local
#
# Prerequisites:
# - wp-cli configured for the site
# - Chrome DevTools MCP server running
# - Page transitions enabled in Style Manager

SITE_URL="${1:-http://style-manager.local}"
SCREENSHOTS_DIR="plans/test-results/screenshots"

mkdir -p "$SCREENSHOTS_DIR/fresh"
mkdir -p "$SCREENSHOTS_DIR/ajax"

# Get all test page URLs
TEST_PAGES=$(wp post list --post_type=page --post_status=publish --fields=ID,post_title,url --format=csv | grep "Test:")

echo "Found test pages:"
echo "$TEST_PAGES"
echo ""
echo "Manual testing required — use Chrome DevTools MCP to:"
echo "1. Navigate to each URL directly (fresh load) → screenshot"
echo "2. Navigate from Hub page via click (AJAX) → screenshot"
echo "3. Compare screenshots and check console"
echo ""
echo "See plans/2026-02-26-ajax-block-compatibility-testing.md for detailed test scripts."
```

---

## Results Template

Create `plans/test-results/2026-MM-DD-ajax-block-results.md` after testing:

```markdown
# AJAX Block Compatibility Test Results — YYYY-MM-DD

## Environment
- WordPress: X.X
- Anima: X.X.X
- Nova Blocks: X.X.X
- Browser: Chrome XXX

## Summary
- Tested: NN blocks
- Passed: NN
- Failed: NN
- Skipped: NN (missing plugin/config)

## Results

| # | Block | Visual | Console | Functionality | Status | Notes |
|---|-------|--------|---------|---------------|--------|-------|
| 1 | novablocks/header | OK/DIFF | OK/ERR | OK/FAIL | PASS/FAIL | |
| 2 | novablocks/supernova (carousel) | | | | | |
| ... | | | | | | |

## Issues Found

### Issue N: [Block name] — [Short description]
- **Symptom:**
- **Fresh load behavior:**
- **AJAX behavior:**
- **Console errors:**
- **Screenshot diff:** `screenshots/diff/block-name.png`
- **Root cause:**
- **Fix:**
```

---

## Cleanup

After testing, remove test pages:

```bash
# Delete all test pages
wp post list --post_type=page --post_status=publish --field=ID --search="Test:" | xargs wp post delete --force

# Delete hub page
wp post delete $(wp post list --post_type=page --post_title="AJAX Test Hub" --field=ID) --force

# Delete test post
wp post delete $(wp post list --post_type=post --post_title="Test: Comments Block" --field=ID) --force
```
