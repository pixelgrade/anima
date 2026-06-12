# Page Transitions — architecture review & reliability roadmap

Status: review (2026-06-12) · Requested by George: "think if we can make it
more reliable — many times there are blocks and pages where special triggers
need to be made; can we use it with more 3rd-party plugins like ecommerce?"

## 1. How it's built today

**Engine**: Barba.js v2 (AJAX container swap) + GSAP timelines, ported from
Pile. Two visual styles (`border_iris`, `slide_wipe`) × two loading styles
(`progress_bar`, `cycling_images`) — a 2×2 matrix wired in
`page-transitions/index.js`.

**PHP** (`inc/integrations/page-transitions.php`, 360 lines): enable gate
(SM option → `pixelgrade_option` fallback; customize previews gated, now
filterable via `anima/page_transitions_in_customize_preview`), script
enqueue, excluded-URLs builder (WooCommerce cart/checkout/account/product
hard-navigate; filterable via `anima_page_transitions_excluded_urls`),
localized config.

**Navigation lifecycle** (`transitions.js` + `utils.js`, ~1,100 lines):

```
leave(current)      GSAP overlay in, cleanupBeforeTransition()
                    └─ disconnect header observer, remove reading-bar nodes,
                       remove .c-bully (closure-state vendor, no destroy API)
swap                Barba replaces the container
enter(next)         syncPageAssets(html)     head diffing (below)
                    syncBodyClasses(html)    NOTBODY parse + preserve-list
                    syncDocumentTitle(html)
                    syncHeaderColorSignal()  250-line replica of Nova Blocks
                                             header detection + MutationObserver
                    GSAP overlay out
                    reinitComponents()       new App(); re-exec every
                                             novablocks frontend script with
                                             cache-busted src; bully re-exec;
                                             FacetWP refresh; WC fragments;
                                             resize/scroll dispatch ×2 (+250ms retry)
                    trackPageview()          GA4 / GTM / UA, hand-rolled
```

**Asset sync** (`syncPageAssets`): parses the fetched page, diffs
`<style id>`/`<link id>` against the live head (order-preserving inserts,
prefix-allowlisted removals), loads missing external scripts, re-executes
allowlisted inline data scripts (`*-js-extra`, `FWP_JSON`).

## 2. What's genuinely solid

- The asset-sync layer solves the classic PJAX trap (page B needs assets
  page A never enqueued) with order preservation — most PJAX themes never
  get this far.
- The `freshlyLoadedScriptIds` set correctly distinguishes "first load on
  this page" from "needs re-execution" — double-init is handled.
- WooCommerce transactional surfaces are excluded rather than half-working:
  the right call for correctness.
- A real lifecycle signal exists (`anima:page-transition-start/complete`)
  and the intro-animations choreographer already consumes it.
- Hard-nav fallback on request errors; analytics pageviews are not lost.

## 3. The structural fragility

Every compensation re-implements something a real page load gives for free.
The taxonomy — each class will keep generating "special trigger" work:

| Class | Instances today | Why it keeps costing |
|---|---|---|
| **Script re-execution by reload** | every `novablocks-*-frontend` script, cache-busted `?_barba=` | assumes every script tolerates running twice on a mutated document; each new block must be vetted |
| **Closure-state vendors** | jquery.bully (DOM removed + IIFE re-exec; old rAF loop left running) | no destroy API → leaks accumulate per navigation; every such vendor needs a bespoke hack |
| **Replicated logic** | `syncHeaderColorSignal` re-implements Nova Blocks' header detection (~250 lines) and *fights the real script* with a MutationObserver | two copies of one algorithm drift; the observer war is a standing race |
| **Per-plugin allowlists** | inline scripts: `-js-extra` + FacetWP; styles: `wp-block-`/`novablocks` prefixes; FacetWP refresh; WC fragments | every new plugin integration = another entry in Anima's code |
| **Event replay heuristics** | resize/scroll dispatched twice + a 250 ms delayed retry | timing guesses; the retry exists because something, somewhere, measures late |
| **Hand-rolled platform features** | document title, body classes, analytics pageviews, admin-bar, reading-bar rebinding | each is browser-native on a real navigation |

The pattern: **Anima owns the integration burden for the entire ecosystem.**
Reliability is capped by the least idempotent script on any page, and the
cost of "works with more third-party plugins" grows linearly with the
plugin list. Ecommerce today = exclusion (no transitions on product/cart
pages), because WooCommerce's inline state and script soup are exactly the
worst case for re-execution.

## 4. Principles for the next iteration

1. **Inversion of control.** Anima should not know about bully, FacetWP, or
   header internals. It should publish a lifecycle; components register
   their own `cleanup(container)` / `reinit(container)`.
2. **Idempotency as a convention, not a hope.** First-party scripts expose
   `init(container)` guarded by a `data-*-initialized` marker — re-init
   becomes a function call, not a cache-busted script reload.
3. **One copy of every algorithm.** Replicas (header color detection) move
   upstream into Nova Blocks behind a callable API; Anima calls it.
4. **Real navigations are the most compatible navigations.** The long-term
   reliability ceiling is lifted by making the *browser* do the navigation
   and keeping only the *animation* custom.

## 5. Roadmap

### H1 — harden the contract (small, current architecture)

- **Re-init registry**: `anima.pageTransitions.register( { id, cleanup, reinit } )`
  + DOM events with the container in `detail`
  (`anima:before-swap` / `anima:after-swap`). Migrate the hardcoded list
  (bully, FacetWP, WC fragments, reading bar, pile-parallax) into
  registrations. Third parties get a documented extension point —
  this is the single biggest maintainability win.
- **Document the lifecycle events** as public API (they exist; freeze them).
- Keep the WC exclusions as the correctness baseline; both PHP filters are
  already in place.

### H2 — upstream the replicas (Nova Blocks releases)

- Nova Blocks header exposes `refresh( container )`; delete
  `syncHeaderColorSignal` + the MutationObserver war (~300 lines).
- bully gets a `destroy()`; delete the IIFE re-exec hack.
- Nova Blocks frontend scripts adopt the idempotent `init(container)`
  convention; `reinitNovaBlocksScripts()`'s cache-bust reloads become calls.

### H3 — platform path: cross-document View Transitions

The browser now ships the architecture this system hand-builds:
**cross-document View Transitions** (Chrome/Edge 126+, Safari 18.2+;
Firefox not yet — graceful fallback is a plain instant navigation) +
**Speculation Rules** prefetch/prerender for instant feel.

- Navigations become *real* page loads: every script, plugin, form, nonce,
  analytics hook, and WooCommerce flow works by construction — the entire
  §3 table disappears. Ecommerce pages stop being excluded; they simply
  *work*, with transitions.
- The wipe/iris choreography is declared in CSS
  (`@view-transition { navigation: auto }`, `::view-transition-old/new`
  animations; types for directional variants). Slide-wipe maps cleanly;
  border-iris approximately.
- What it can't replicate: mid-navigation *loader* experiences (cycling
  images / progress bar) — with prerendered navigations there is nothing to
  wait for; the first-load loader (which is where those shine) stays as-is.
- Shape: a third "engine" choice behind the existing settings, shipped as
  the default for supporting browsers, Barba retained for legacy or retired
  once coverage satisfies; per-style mapping decided in a design pass.

### Sequencing

H1 is a contained Anima change and immediately de-risks new blocks/plugins.
H2 rides normal Nova Blocks releases. H3 is a design+build project — worth
a prototype early (a CSS-only `@view-transition` spike costs a day and
answers the choreography-fidelity question before any commitment).

### H3 spike verdict (2026-06-12, branch `feature/view-transitions-spike`)

Built and proven live (`?anima-vt=1`): cross-document View Transitions run
on this stack — pageswap/pagereveal fire with live `viewTransition`
objects, the CSS wipe executes between documents, and the destination
page's scripts (sliders, Woo, everything) work natively. Parity against
the current engine's full detail set, per the 1:1 acceptance bar:

| Current detail (slide_wipe) | View Transitions | 1:1? |
|---|---|---|
| Two-layer masked parallax wipe, quint.inOut, 1s per phase | replicable via named layers + exact cubic-bezier | ≈ (very close, snapshot-rasterized) |
| Cover phase **holds while the page loads**, minimum 900 ms, longer on slow loads | impossible — no script runs between documents; animation durations are fixed | ✗ |
| **Cycling-images / progress loader animating during the wait** | impossible — snapshots are static between documents | ✗ |
| Exit overlay awaited before unload (GSAP promise) | mechanism differs (fixed-duration VT, not awaitable script) | ✗ |
| Card-expand shared-element morph | VT's native strength — arguably better | ✓ |
| Scripts / forms / WooCommerce / analytics / history | native — better by construction | ✓ |
| Firefox | no cross-document VT → plain instant navigation | ✗ |

**Verdict: not 1:1.** The held-loader semantics (dynamic duration, animated
content during slow loads) are fundamental impossibilities in cross-document
View Transitions — they require script between documents, which is exactly
what VT removes. Per the acceptance bar, **View Transitions is not currently
an option** as a drop-in engine replacement. The spike stays on its branch
as the ready foundation for the day the loader semantics are allowed to be
redesigned (or the platform grows cross-document progress hooks).

## 6. Out of scope here, related

- The SM Site Editor Live Site preview runs transitions via the
  customize-preview opt-in (`anima/page_transitions_in_customize_preview`,
  style-manager#139) — any engine change must keep that working.
- Intro animations are independent (own runtime, gate, choreographer) and
  already coordinate via the lifecycle events; H3 leaves them untouched.
