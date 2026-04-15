# Quote Card Blueprint Reset Design

**Status:** Proposed

## Goal

Restart the Quote post-format card work around a Nova-first architecture that
can faithfully render an editable `card-quote` template part inside Cards
Collection while keeping the collection rhythm consistent.

Version 1 targets **Post Formats only** and implements **Quote first**.

## Why The First Attempt Drifted

The first implementation pushed Quote blueprint data into Nova's lightweight
collection-card renderer from the theme layer.

That approach failed structurally:

- the archive card path rendered a standalone `.nb-supernova-item`, not a full
  Supernova surface
- several visual behaviors expected from the editor, especially
  signal/background treatment, live on the Supernova rendering contract rather
  than on loose per-card attrs
- theme-side attribute merging created partial parity where classes and vars
  existed in markup but did not map cleanly to the same visible surfaces as the
  editor

The reset moves the responsibility into Nova, where the rendering contract
already lives.

## Product Intent

For Quote posts:

- the editor-facing visual source of truth is the `card-quote`
  `wp_template_part`
- the frontend archive card should aim for near-exact parity with that blueprint
- only four pieces of content stay live from the post:
  - quote text
  - quote citation
  - featured image
  - permalink

This stays automatic-only in v1. No manual override UI is introduced.

## Non-Goals

- No generic blueprint engine for all formats in v1
- No custom placeholder block registration
- No change to collection query logic, pagination, or grid orchestration
- No attempt to make cards render a full independent Supernova block per post
- No new author-facing controls for format-card overrides

## Recommended Architecture

### Responsibility split

- **Nova Blocks** owns blueprint-aware card rendering
- **Anima** owns post-expression semantics and decides when to ask for a Quote
  blueprint
- **The active LT variation** owns the `card-quote` blueprint through starter
  content and Site Editor customization

### Runtime flow

1. Cards Collection resolves a post as usual.
2. Anima resolves the post-expression profile.
3. If the post format is `quote`, Anima asks Nova to try the `card-quote`
   blueprint path.
4. Nova resolves and validates the blueprint.
5. If valid, Nova renders the card through the blueprint-aware renderer.
6. If missing or invalid, Nova falls back to the normal collection-card path.

The important reset is that Anima no longer tries to simulate Supernova surface
behavior by merging a subset of attrs into the old card renderer.

## Blueprint Contract

The Quote blueprint lives in a `wp_template_part` with slug `card-quote`.

The renderer treats it as structured data, not as a bag of loose attrs.

### Source structure

- the first `novablocks/supernova` block is the blueprint root
- the first `novablocks/supernova-item` inside that root is the card blueprint
  item
- the root Supernova attrs provide surface context
- the item attrs provide card-level treatment

### Binding conventions

No custom placeholder blocks are used in v1. The blueprint follows strict
conventions instead:

- the primary media surface is replaced with the live featured image
- the first `core/quote` block is replaced with the live quote text and citation
- the permalink is applied by the card renderer, not by links authored inside
  the blueprint

### Authoring constraints

To keep the convention predictable, `card-quote` should contain:

- one primary `novablocks/supernova` root
- one primary `novablocks/supernova-item`
- one primary `core/quote`
- no extra interactive links inside the blueprint content

If designers need more freedom later, that can be a v2 problem. V1 should keep
the contract disciplined.

## Nova Renderer Design

Nova should add a dedicated internal renderer for **format blueprint cards**
instead of overloading the existing generic card path.

### Existing renderer

The current collection-card renderer remains the default for standard cards and
all non-Quote formats.

### New renderer

The new Quote blueprint renderer should:

- resolve `card-quote`
- parse the full Supernova root plus the first Supernova item
- hydrate both root and item attrs through Nova defaults
- render the card inside the normal collection item wrapper
- preserve collection rhythm while honoring blueprint-owned card surfaces

### Render order

1. **Collection baseline**
   - keep query behavior
   - keep collection wrapper/layout rhythm
   - keep columns and collection orchestration

2. **Blueprint surface context**
   - apply root Supernova surface context where signal/background treatment
     depends on it
   - apply item-level layout, spacing, overlay, alignment, palette, and media
     treatment

3. **Live post bindings**
   - replace the blueprint media with the featured image
   - replace the first `core/quote` block text and citation with live post data
   - apply the live permalink through the normal card-link mechanism

This is the key change from the first attempt: Nova renders “a collection card
sourced from a Supernova blueprint” instead of “a generic card with some extra
attrs”.

## Ownership Model

### Collection-owned

These must remain owned by the parent collection and must not be overridden by
the blueprint:

- query and post source
- columns and responsive collection structure
- masonry / parametric / variable-width rhythm
- pagination and load-more behavior
- collection wrapper behavior
- collection-level sequencing and animation orchestration

### Blueprint-owned

For Quote cards, the blueprint owns how the card looks as an individual card:

- card layout direction and stacking treatment
- content position
- content padding and internal spacing
- overlay strength
- palette / variation / color-signal behavior
- media aspect-ratio and image treatment
- quote block styling and surrounding block structure

### Live post-owned

Only these are bound live in v1:

- quote text
- quote citation
- featured image
- permalink

## Missing Media Behavior

Quote cards must stay consistent with normal collection-card behavior.

If the Quote post has no featured image:

- the Quote blueprint path may still activate
- but the media wrapper is omitted entirely
- Nova does not synthesize a placeholder media surface for normal Quote cards

This matches how regular collection cards already behave when media is missing.

## Fallback Rules

The blueprint path should only activate when Nova can render it confidently.

Fallback to the normal card renderer when:

- the post is not `quote`
- `card-quote` does not exist
- the blueprint has no `novablocks/supernova` root
- the blueprint has no `supernova-item`
- the blueprint has no `core/quote`
- the post has no extractable quote text

In short:

- **valid Quote post + valid blueprint + valid quote extract = blueprint
  renderer**
- everything else = normal renderer

## Verification Strategy

### Nova contract coverage

Add Quote-blueprint tests that prove:

- a valid `card-quote` blueprint activates the Quote renderer
- an invalid blueprint falls back cleanly
- missing featured image omits the media wrapper
- the first `core/quote` receives live quote text and citation
- permalink binding still works
- blueprint surface context reaches the intended rendered surfaces

### Hive LT runtime checks

Verify on the Studio site with a real `card-quote` template part and real Quote
posts:

- editor preview vs frontend card
- with featured image
- without featured image
- with citation
- without citation

### Rollout order

1. Add Nova renderer support first.
2. Keep Anima focused on profile resolution and Quote-template routing.
3. Remove or supersede the current Anima-side Quote blueprint merge path once
   the Nova renderer is ready.

## Resulting End State

After the reset:

- **Nova** owns Quote blueprint card rendering
- **Anima** owns Quote semantics
- **Hive LT** owns Quote card art direction

This is the leanest path to Site Editor parity without inventing custom blocks
or forcing LT themes to duplicate rendering logic in PHP.
