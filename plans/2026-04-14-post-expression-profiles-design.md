# Post Expression Profiles — Design Document

**Status:** Proposed

## Goal

Add a lean, automatic post-expression system to Anima that preserves the simple
authoring experience of classic Post Formats while enabling richer, Hive/Patch-
style presentation in:

- Cards Collection / Posts Collection cards
- Single post templates

The design must stay reusable across LT themes instead of hardcoding Hive-only
behavior into Nova Blocks or the editor UI.

## Product Intent

This feature should behave closer to Tumblr than to a page-builder workflow:

- the author picks a post format
- the theme derives a small set of visual traits from the post data
- the frontend chooses the right presentation automatically

Version 1 is intentionally automatic-only. There is no manual override UI.

## Non-Goals

- No new taxonomy or parallel “story type” system
- No manual per-post card-variant override in v1
- No full recreation of the classic theme template matrix inside block template
  files
- No Hive-specific fork of Cards Collection
- No support in v1 for low-value formats such as `aside`, `status`, or `chat`

## Scope

### Included formats in v1

- `quote`
- `image`
- `gallery`
- `link`
- `audio`
- `video`

### Included surfaces in v1

- Query Loop based card collections rendered through Nova’s Posts Collection /
  Supernova stack
- Single post rendering

### Deferred

- Manual override controls
- Format-specific editor patterns beyond what core already provides
- Archive template parity for post format taxonomies unless needed during
  implementation

## Approaches Considered

### 1. Native Post Formats plus CSS only

Use `add_theme_support( 'post-formats' )`, rely on `format-*` classes, and add
theme CSS for cards and singles.

Pros:

- smallest code footprint
- no new data model

Cons:

- not enough for Cards Collection, which currently builds cards from generic
  post data
- cannot reliably switch single rendering automatically in block themes
- does not capture Patch-style aspect-ratio behavior

This is too weak for the required Hive/Patch parity.

### 2. Expression resolver plus display profiles

Keep native Post Formats as the semantic source, derive a few visual traits from
post data, and map both into reusable display profiles consumed by cards and
singles.

Pros:

- preserves the simple editor UX
- supports real Hive/Patch parity without recreating all legacy templates
- reusable across LT themes
- keeps logic centralized in one place

Cons:

- requires a small theme-side resolver and narrow Nova integration points

This is the recommended approach.

### 3. Full classic parity matrix

Port classic Hive/Patch behavior literally into Anima with format-specific
archive and single renderers for every supported format.

Pros:

- closest to old theme behavior

Cons:

- highest maintenance cost
- too much template and parsing duplication
- hard to keep cross-theme and low-bloat

This is too heavy for v1.

## Recommended Architecture

### Core idea

Introduce a small Anima-side resolver that turns post data into a normalized
expression profile:

- semantic source: post format
- visual traits: image/media/text traits
- display outputs: card variant and single variant

The profile is computed automatically from the current post and consumed by:

- Nova cards
- Anima single templates

### Expression profile shape

The exact implementation can vary, but the resolved profile should expose at
least:

```php
[
	'format'         => 'quote|image|gallery|link|audio|video|standard',
	'traits'         => [
		'media_mode'    => 'text|image|gallery|link|audio|video',
		'image_shape'   => 'portrait|landscape|square|wide|tall|none',
		'has_thumbnail' => true,
	],
	'card_variant'   => 'default|quote|image|gallery|link|audio|video|text',
	'single_variant' => 'default|quote|visual|media',
]
```

The profile is not stored as persistent post meta in v1. It is derived at
runtime from the post and must be cached in-memory for the duration of the
request.

Implementation requirements:

- cache resolved profiles by post ID plus surface context such as `card` or
  `single`
- avoid reparsing the same post content multiple times in one request
- only run format-specific extraction for supported formats that need it

## Trait Resolution Rules

### Semantic format

- Use native `get_post_format( $post )`
- Normalize empty/false to `standard`

### Image shape

If a featured image exists, bucket it into one of:

- `portrait`
- `landscape`
- `square`
- `wide`
- `tall`

Patch already validates this general model via `entry-card--portrait`,
`entry-card--landscape`, `entry-card--text`, and related classes.

Use Patch-compatible thresholds in v1 so Hive LT and Patch LT stay aligned:

- `tall`: ratio `< 0.5625`
- `portrait`: ratio `< 0.75`
- `wide`: ratio `> 1.78`
- `landscape`: ratio `> 1.34`
- otherwise `square`

### Fallback behavior when no featured image exists

Use lean, format-driven defaults:

- `quote` -> `text`
- `link` -> `text`
- `gallery` -> `landscape`
- `audio` -> `landscape`
- `video` -> `landscape`
- `image` -> `landscape`
- `standard` -> `text`

### Format-specific content extraction

Use existing WordPress helpers first, but keep extraction block-aware for modern
content. Classic helpers alone are not enough for block posts.

- `gallery`: prefer a Gallery block payload first, then `get_post_gallery()`
- `link`: prefer a Link-like block or the first meaningful URL in block
  content, then `get_url_in_content()`
- `quote`: resolve in this order:
  - first `core/quote` block
  - then the first real `<blockquote>` in rendered content
  - then the manual excerpt if present
  - then the first paragraph only
  - never the full post content
- `image`: prefer featured image, then first inline image as fallback
- `audio` / `video`: prefer block-aware embedded media extraction helpers,
  then legacy embed discovery if needed

Avoid broad HTML scraping outside the supported formats.

## Display Profile Mapping

### Card variants

Cards should be chosen from a small, reusable set:

- `default`
- `quote`
- `image`
- `gallery`
- `link`
- `audio`
- `video`
- `text`

The final card appearance is the combination of:

- semantic classes, for example `format-quote`
- trait classes, for example `card-trait-portrait`
- variant classes, for example `card-variant-quote`

### Single variants

Do not create one block template per format. Keep the set intentionally small:

- `single-default`
- `single-quote`
- `single-visual`
- `single-media`

Variant routing rules:

- `quote` -> `single-quote`
- `image`, `gallery`, `link` -> `single-visual`
- `audio`, `video` -> `single-media`
- everything else -> `single-default`

This is enough to achieve format-aware singles without rebuilding the full
classic matrix.

## Cards Collection Integration

### Existing Nova path

Posts Collection cards currently render through:

- `novablocks_get_collection_card_markup_from_post()`
- `novablocks_get_collection_card_markup()`

Nova already exposes:

- `novablocks/get_collection_card_markup`

But that filter runs after final card markup has already been built. Using it as
the primary integration point would force Anima to rewrite HTML strings.

### Recommended Nova integration

Add one narrow pre-render hook in Nova so themes can adjust post card data
before final markup generation. For example:

```php
apply_filters( 'novablocks/post_card_profile', $profile, $post, $attributes );
apply_filters( 'novablocks/post_card_render_data', $render_data, $post, $attributes, $profile );
```

Where `$render_data` can include:

- card classes
- media payload
- card content fragments
- card aspect ratio override

This keeps Nova generic and lets Anima inject expression-aware behavior without
forking the block.

Before implementation planning is finalized, validate the insertion point with a
small Nova spike. The preferred hook position is inside
`novablocks_get_collection_card_markup_from_post()` before the final call to
`novablocks_get_collection_card_markup()`, so Anima can alter card inputs
without rewriting finished HTML.

### Theme-side usage

Anima should:

- resolve the expression profile for the queried post
- map it to render data
- append lean classes to the card
- swap media/content payload only when a supported format needs it

The default Nova rendering path remains unchanged for sites or themes that do
not use expression profiles.

## Single Rendering Integration

### Block theme constraint

Block templates do not have a post-format step in the single template
hierarchy. Automatic format-aware singles therefore need theme logic in
addition to template files.

### Recommended Anima integration

Keep one editable single template as the block-theme shell, then render a
dynamic post expression shell inside it based on the resolved profile.

V1 decision:

- do not auto-swap template slugs at runtime
- keep Site Editor expectations centered on one main single template
- let the dynamic shell choose the `default`, `quote`, `visual`, or `media`
  presentation internally
- avoid a format-by-format explosion of templates

This keeps the editing model predictable while still allowing automatic
format-aware single rendering.

## Cross-LT Reuse

This system belongs in Anima as a generic capability, not as a Hive-specific
feature.

Theme variations should be able to customize:

- supported formats
- profile-to-variant mapping
- CSS treatment
- optional extraction details

Suggested filter surface:

```php
anima_expression_supported_formats
anima_expression_profile
anima_expression_card_variant
anima_expression_single_variant
```

Hive LT can use these defaults first. Other LT themes can opt in later without
changing the authoring model.

## Minimal File Footprint

Expected Anima additions:

- one resolver file for post expression profiles
- one single-routing integration file
- one small style layer for card and single variants

Expected Nova changes:

- one or two narrow pre-render filters for post cards

No new CPTs, no new inspector controls, no new author-facing settings for v1.

## Testing

### Resolver tests

- supported formats resolve correctly
- empty format resolves to `standard`
- featured image ratios bucket correctly
- no-thumbnail fallbacks map to expected traits

### Card rendering tests

- Posts Collection cards receive the expected variant/trait classes
- supported formats change media/content output correctly
- unsupported posts continue to use the default Nova path

### Single rendering tests

- automatic routing selects the expected single variant
- standard posts still render through the normal default shell

### Manual verification

Verify on at least Hive LT first:

- quote posts
- image posts with portrait and landscape thumbnails
- gallery posts with and without featured images
- audio/video/link posts

Then verify no regressions on another LT theme with the feature disabled.

## Rollout Order

1. Validate the Nova pre-render insertion point with a small spike
2. Add the Anima resolver and variant mapping
3. Add narrow Nova pre-render hooks for post cards
4. Wire Cards Collection / Posts Collection to expression profiles
5. Add the dynamic single post expression shell
6. Add Hive LT styling for the initial supported variants
7. Verify that other LT themes remain unchanged unless they opt in

## Recommendation

Build v1 as a reusable Anima “post expression profiles” system:

- Post Formats are the semantic author input
- Patch-style aspect-ratio traits provide layout intelligence
- Nova consumes a small render-data contract
- Single posts route automatically into a tiny set of reusable shells

This achieves real Hive/Patch parity where it matters while keeping the
authoring UX simple and the code footprint controlled.
