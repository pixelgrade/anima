# Quote Card Blueprint Reset Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the current theme-side Quote blueprint merge path with a Nova-native Quote blueprint renderer that can faithfully render the `card-quote` template part inside Cards Collection while preserving collection rhythm and normal no-media behavior.

**Architecture:** Nova Blocks gains a dedicated Quote blueprint renderer that works from the full `novablocks/supernova` root plus the first `supernova-item`, applies root surface context where needed, binds the live Quote post data by convention, and falls back cleanly to the normal collection-card renderer when the blueprint or live quote data is invalid. Anima keeps only the lightweight post-expression resolver, the semantic classes, and the single-template routing; it no longer builds Quote card HTML itself.

**Tech Stack:** WordPress block themes, PHP 8.3, Nova Blocks PHP render pipeline, `parse_blocks()`, `WP_Block_Template`, `studio wp eval-file`, Node 22 for any rebuilt assets, Hive LT Studio runtime at `/Users/georgeolaru/Studio/hive-lt-starter`.

---

## Scope Guard

- Quote only in v1.
- No placeholder blocks.
- No new manual UI.
- No full generic blueprint engine for all formats yet.
- Do not touch unrelated dirty changes already present in either repo.

## File Structure

### Nova Blocks source repo

**Create**
- `/Users/georgeolaru/Local Sites/style-manager/app/public/wp-content/plugins/nova-blocks/lib/post-format-card-blueprints.php`
- `/Users/georgeolaru/Local Sites/style-manager/app/public/wp-content/plugins/nova-blocks/tests/wp-eval/post-format-quote-blueprint-contract.php`

**Modify**
- `/Users/georgeolaru/Local Sites/style-manager/app/public/wp-content/plugins/nova-blocks/nova-blocks.php`
- `/Users/georgeolaru/Local Sites/style-manager/app/public/wp-content/plugins/nova-blocks/lib/block-rendering.php`

### Anima source repo

**Modify**
- `/Users/georgeolaru/Local Sites/style-manager/app/public/wp-content/themes/anima/inc/post-expressions.php`
- `/Users/georgeolaru/Local Sites/style-manager/app/public/wp-content/themes/anima/inc/integrations/post-expressions.php`
- `/Users/georgeolaru/Local Sites/style-manager/app/public/wp-content/themes/anima/test/post-expression-card-render.php`

**Delete or stop using**
- the current Quote blueprint render helpers in `inc/post-expressions.php`
- the current Quote blueprint merge path in `inc/integrations/post-expressions.php`
- obsolete Quote blueprint tests once Nova-level coverage replaces them:
  - `/Users/georgeolaru/Local Sites/style-manager/app/public/wp-content/themes/anima/test/post-expression-quote-card-blueprint.php`
  - `/Users/georgeolaru/Local Sites/style-manager/app/public/wp-content/themes/anima/test/post-expression-card-style-merge.php`

### Runtime verification target

**Use**
- `/Users/georgeolaru/Studio/hive-lt-starter`

All verification should run against the mirrored Hive LT Studio site, not directly against the source repo paths.

---

### Task 1: Add failing Nova Quote blueprint contracts

**Files:**
- Create: `/Users/georgeolaru/Local Sites/style-manager/app/public/wp-content/plugins/nova-blocks/tests/wp-eval/post-format-quote-blueprint-contract.php`
- Verify: `/Users/georgeolaru/Studio/hive-lt-starter/wp-content/plugins/nova-blocks/tests/wp-eval/post-format-quote-blueprint-contract.php`

- [ ] **Step 1: Write one eval-file contract that covers the reset behavior**

Create `tests/wp-eval/post-format-quote-blueprint-contract.php` with fixtures for:

- valid `card-quote` blueprint
- invalid `card-quote` blueprint missing `core/quote`
- Quote post with featured image
- Quote post without featured image
- Quote post without extractable quote text

The test should inject a synthetic `WP_Block_Template` through the `get_block_template` filter, similar to the existing Quote-card tests, but it should assert the new renderer contract instead of the old Anima merge contract.

Core assertions to encode:

```php
if ( false === strpos( $markup, 'format-quote' ) ) {
	throw new RuntimeException( 'Expected Quote cards to keep the semantic format class.' );
}

if ( false === strpos( $markup, 'card-variant-quote' ) ) {
	throw new RuntimeException( 'Expected Quote cards to keep the Quote card variant class.' );
}

if ( false === strpos( $markup, 'nb-supernova' ) ) {
	throw new RuntimeException( 'Expected Quote blueprint cards to render inside a Supernova surface wrapper.' );
}

if ( false === strpos( $markup, 'data-color-signal="3"' ) ) {
	throw new RuntimeException( 'Expected Quote blueprint root signal context to reach the rendered card.' );
}

if ( false === strpos( $markup, 'Paul Graham' ) ) {
	throw new RuntimeException( 'Expected Quote blueprint cards to inject the live citation.' );
}
```

- [ ] **Step 2: Run the contract before implementation**

Run:

```bash
studio wp eval-file /wordpress/wp-content/plugins/nova-blocks/tests/wp-eval/post-format-quote-blueprint-contract.php --path '/Users/georgeolaru/Studio/hive-lt-starter'
```

Expected: FAIL because Nova does not yet have a Quote blueprint renderer.

- [ ] **Step 3: Add one explicit failing assertion for the no-media path**

The same test should assert that Quote posts without a thumbnail do not render a media wrapper:

```php
if ( false !== strpos( $markup_without_media, 'nb-supernova-item__media-wrapper' ) ) {
	throw new RuntimeException( 'Expected Quote blueprint cards without thumbnails to omit the media wrapper.' );
}
```

- [ ] **Step 4: Add one explicit failing fallback assertion**

The same test should assert that an invalid blueprint falls back to the normal collection-card renderer:

```php
if ( false === strpos( $fallback_markup, 'nb-card__title' ) ) {
	throw new RuntimeException( 'Expected invalid Quote blueprints to fall back to the normal collection-card renderer.' );
}
```

- [ ] **Step 5: Commit the failing test only if you need an isolated checkpoint**

```bash
git -C '/Users/georgeolaru/Local Sites/style-manager/app/public/wp-content/plugins/nova-blocks' status --short
```

Expected: only the new eval-file test is staged if you choose to checkpoint. Do not touch unrelated Nova changes.

---

### Task 2: Add Nova Quote blueprint resolution helpers

**Files:**
- Create: `/Users/georgeolaru/Local Sites/style-manager/app/public/wp-content/plugins/nova-blocks/lib/post-format-card-blueprints.php`
- Modify: `/Users/georgeolaru/Local Sites/style-manager/app/public/wp-content/plugins/nova-blocks/nova-blocks.php`

- [ ] **Step 1: Bootstrap a focused helper file**

In `nova-blocks.php`, require the new helper file immediately after `lib/block-rendering.php`:

```php
require_once dirname( __FILE__ ) . '/lib/block-rendering.php';
require_once dirname( __FILE__ ) . '/lib/post-format-card-blueprints.php';
require_once dirname( __FILE__ ) . '/lib/client-assets.php';
```

- [ ] **Step 2: Add a dedicated blueprint resolver**

In `lib/post-format-card-blueprints.php`, add a focused resolver API:

```php
function novablocks_get_post_format_card_blueprint( string $slug ): ?array {}
function novablocks_parse_post_format_card_blueprint( WP_Block_Template $template ): ?array {}
function novablocks_validate_post_format_card_quote_blueprint( array $blueprint ): bool {}
```

The resolver should:

- load the `wp_template_part` via `get_block_template()`
- parse the first `novablocks/supernova`
- find the first `novablocks/supernova-item`
- find the first `core/quote` inside that item
- hydrate both root and item attrs through:
  - `novablocks_get_supernova_attributes()`
  - `novablocks_get_supernova_item_attributes()`
  - `novablocks_get_attributes_with_defaults()`
- return `null` when the structure is missing any required element

- [ ] **Step 3: Cache blueprint resolution per request**

Use a static cache keyed by slug:

```php
static $blueprint_cache = [];
```

Expected behavior:
- repeated Quote cards in the same request do not reparse the same template part
- cache stores both valid results and explicit `null` misses

- [ ] **Step 4: Add unit-level helper assertions to the eval contract**

Extend the eval contract temporarily or add a second tiny fixture inside it to prove:

- valid blueprint returns hydrated root attrs
- valid blueprint returns hydrated item attrs
- invalid blueprint returns `null`

- [ ] **Step 5: Run the eval contract again**

Run:

```bash
studio wp eval-file /wordpress/wp-content/plugins/nova-blocks/tests/wp-eval/post-format-quote-blueprint-contract.php --path '/Users/georgeolaru/Studio/hive-lt-starter'
```

Expected: still FAIL, but now because the renderer path is missing, not because blueprint resolution is impossible.

---

### Task 3: Add the Nova Quote blueprint renderer

**Files:**
- Modify: `/Users/georgeolaru/Local Sites/style-manager/app/public/wp-content/plugins/nova-blocks/lib/post-format-card-blueprints.php`
- Modify: `/Users/georgeolaru/Local Sites/style-manager/app/public/wp-content/plugins/nova-blocks/lib/block-rendering.php`

- [ ] **Step 1: Add a dedicated Quote renderer API**

In `lib/post-format-card-blueprints.php`, add a renderer entry point:

```php
function novablocks_maybe_get_quote_blueprint_card_markup( WP_Post $post, array $attributes, array $profile ): ?string {}
```

It should return:
- a fully rendered Quote blueprint card string when valid
- `null` when the normal collection-card renderer should take over

- [ ] **Step 2: Build the render context in three layers**

The renderer should assemble:

1. collection-owned baseline from the incoming `$attributes`
2. blueprint root + item surface context from the resolved blueprint
3. live post bindings:
   - quote text
   - citation
   - featured image
   - permalink

The render context should keep collection-owned behavior intact:

```php
$collection_attributes = $attributes;
$root_attributes       = $blueprint['root_attrs'];
$item_attributes       = $blueprint['item_attrs'];
```

- [ ] **Step 3: Render a real Supernova surface wrapper**

The Quote renderer should output:

- the normal `.nb-collection__layout-item` wrapper
- a real `.nb-supernova ...` wrapper with root classes/data/style
- the rendered `.nb-supernova-item ...` inside it

Do not try to fake root Supernova behavior with only extra item attrs.

The helper can be a dedicated function such as:

```php
function novablocks_get_quote_blueprint_collection_card_markup(
	array $root_attributes,
	array $item_attributes,
	string $media_markup,
	string $content_markup
): string {}
```

- [ ] **Step 4: Bind the live media using Nova’s normal media renderer**

Media binding rules:

- if the post has a featured image, render media through
  `novablocks_get_collection_card_media_markup()` plus the normal wrapper helper
- if the post has no featured image, pass an empty media string and omit the
  media wrapper entirely

Do not preserve any static demo image from the blueprint.

- [ ] **Step 5: Bind the live quote using convention, not placeholders**

Parse the first `core/quote` block from the blueprint item and replace only its
live fields:

```php
function novablocks_replace_first_blueprint_quote_block(
	array $blocks,
	string $quote,
	string $citation
): array {}
```

Rules:
- keep the blueprint block structure and attrs
- replace the quote text with the extracted live quote
- replace the citation when present
- if no live quote exists, bail out and return `null` from the Quote renderer

- [ ] **Step 6: Wire the new renderer into the existing post-card entry point**

In `lib/block-rendering.php`, keep the current default path intact, but before
calling `novablocks_get_collection_card_markup()`, try the Quote renderer:

```php
$profile = apply_filters( 'novablocks/post_card_profile', [], $post, $attributes );

$blueprint_markup = novablocks_maybe_get_quote_blueprint_card_markup( $post, $attributes, $profile );

if ( is_string( $blueprint_markup ) && $blueprint_markup !== '' ) {
	return $blueprint_markup;
}
```

Only Quote cards with valid blueprint data should short-circuit the normal path.

- [ ] **Step 7: Re-run the Nova contract**

Run:

```bash
studio wp eval-file /wordpress/wp-content/plugins/nova-blocks/tests/wp-eval/post-format-quote-blueprint-contract.php --path '/Users/georgeolaru/Studio/hive-lt-starter'
```

Expected: PASS with a clear success line such as `post format quote blueprint contract ok`.

- [ ] **Step 8: Commit the Nova renderer**

```bash
git -C '/Users/georgeolaru/Local Sites/style-manager/app/public/wp-content/plugins/nova-blocks' add nova-blocks.php lib/block-rendering.php lib/post-format-card-blueprints.php tests/wp-eval/post-format-quote-blueprint-contract.php
git -C '/Users/georgeolaru/Local Sites/style-manager/app/public/wp-content/plugins/nova-blocks' commit -m 'Add Quote blueprint renderer for collection cards'
```

Before committing, verify `git status --short` and make sure only the intended files are staged; Nova already has unrelated dirty work in the repo.

---

### Task 4: Simplify Anima to semantic integration only

**Files:**
- Modify: `/Users/georgeolaru/Local Sites/style-manager/app/public/wp-content/themes/anima/inc/post-expressions.php`
- Modify: `/Users/georgeolaru/Local Sites/style-manager/app/public/wp-content/themes/anima/inc/integrations/post-expressions.php`

- [ ] **Step 1: Keep the profile resolver and Quote extract helpers**

Retain:

- `anima_get_post_expression_profile()`
- image-shape and format normalization helpers
- Quote extract and citation helpers

These still belong in Anima.

- [ ] **Step 2: Remove the old Quote blueprint HTML builder path**

Delete or stop using the current helpers that build Quote card HTML in Anima:

- `anima_get_post_expression_card_blueprint()`
- `anima_get_post_expression_quote_blueprint_render_data()`
- `anima_merge_post_expression_card_blueprint_attributes()`
- `anima_get_post_expression_card_style_props()`
- `anima_get_post_expression_card_media_markup()`
- `anima_get_post_expression_quote_blueprint_content_markup()`
- related replacement helpers that only existed for the old theme-side renderer

If one of these helpers still has value for single-template routing or profile
semantics, split the reusable part out instead of keeping the old render path.

- [ ] **Step 3: Replace the Anima integration with semantic profile data only**

In `inc/integrations/post-expressions.php`, keep:

- `novablocks/post_card_profile` returning the Anima profile
- semantic class additions:
  - `format-*`
  - `card-trait-*`
  - `card-variant-*`

Do not let Anima build the Quote card markup anymore.

The integration should collapse down to something close to:

```php
function anima_filter_novablocks_post_card_render_data( array $render_data, $post, array $attributes, array $profile ): array {
	$render_data['card_classes'] = array_values(
		array_unique(
			array_merge(
				$render_data['card_classes'] ?? [],
				[
					'format-' . $profile['format'],
					'card-trait-' . ( $profile['traits']['image_shape'] ?? 'text' ),
					'card-variant-' . ( $profile['card_variant'] ?? 'default' ),
				]
			)
		)
	);

	return $render_data;
}
```

- [ ] **Step 4: Re-run the existing profile and single-template contracts**

Run the relevant Anima eval tests that should remain valid, especially the
profile resolver and single-template routing tests.

Expected: profile semantics and `single-quote` routing still pass after the
archive-card renderer is removed from Anima.

- [ ] **Step 5: Commit the Anima cleanup**

```bash
git -C '/Users/georgeolaru/Local Sites/style-manager/app/public/wp-content/themes/anima' add inc/post-expressions.php inc/integrations/post-expressions.php
git -C '/Users/georgeolaru/Local Sites/style-manager/app/public/wp-content/themes/anima' commit -m 'Move Quote blueprint card rendering into Nova'
```

Do not stage unrelated dirty files in the Anima repo.

---

### Task 5: Replace obsolete Anima tests with reset-era coverage

**Files:**
- Modify: `/Users/georgeolaru/Local Sites/style-manager/app/public/wp-content/themes/anima/test/post-expression-card-render.php`
- Delete: `/Users/georgeolaru/Local Sites/style-manager/app/public/wp-content/themes/anima/test/post-expression-quote-card-blueprint.php`
- Delete: `/Users/georgeolaru/Local Sites/style-manager/app/public/wp-content/themes/anima/test/post-expression-card-style-merge.php`

- [ ] **Step 1: Rewrite `post-expression-card-render.php` around the new architecture**

Keep this Anima-side test focused on what Anima still owns:

- profile semantics
- semantic card classes
- Quote fallback markup when Nova blueprint rendering is unavailable

It should no longer assert blueprint style vars or theme-built Quote HTML.

- [ ] **Step 2: Remove tests that only prove the discarded architecture**

Delete or retire:

- `post-expression-quote-card-blueprint.php`
- `post-expression-card-style-merge.php`

Those tests describe the abandoned theme-side blueprint merge path and should
not be carried forward.

- [ ] **Step 3: Run the Anima test set through Studio**

Run:

```bash
studio wp eval-file /wordpress/wp-content/themes/anima/test/post-expression-card-render.php --path '/Users/georgeolaru/Studio/hive-lt-starter'
studio wp eval-file /wordpress/wp-content/themes/anima/test/post-expression-profile.php --path '/Users/georgeolaru/Studio/hive-lt-starter'
studio wp eval-file /wordpress/wp-content/themes/anima/test/post-expression-single-template-routing.php --path '/Users/georgeolaru/Studio/hive-lt-starter'
```

Expected: PASS for the remaining Anima-owned responsibilities.

- [ ] **Step 4: Commit the test reset**

```bash
git -C '/Users/georgeolaru/Local Sites/style-manager/app/public/wp-content/themes/anima' add test/post-expression-card-render.php
git -C '/Users/georgeolaru/Local Sites/style-manager/app/public/wp-content/themes/anima' rm test/post-expression-quote-card-blueprint.php test/post-expression-card-style-merge.php
git -C '/Users/georgeolaru/Local Sites/style-manager/app/public/wp-content/themes/anima' commit -m 'Reset Quote card tests around Nova blueprint rendering'
```

If those deleted files were never committed on the branch, remove them from the
working tree without touching unrelated files and commit only the intended test
changes.

---

### Task 6: Hive LT Studio parity verification

**Files:**
- Use: `/Users/georgeolaru/Studio/hive-lt-starter`
- Use: `http://localhost:8893/`
- Use: `http://localhost:8893/wp-admin/site-editor.php?p=%2Fwp_template_part%2Fanima%2F%2Fcard-quote&canvas=edit`

- [ ] **Step 1: Verify the mirrored source is current**

Run:

```bash
studio wp plugin list --path '/Users/georgeolaru/Studio/hive-lt-starter' --status=active --field=name
studio wp theme list --path '/Users/georgeolaru/Studio/hive-lt-starter' --status=active
```

Expected: the Studio site is running `nova-blocks` and `anima` from the mirrored source stack.

- [ ] **Step 2: Check the Quote card with featured image**

Use the existing `card-quote` template part and a real Quote post with:

- featured image
- quote text
- citation

Verify:

- editor preview and frontend card are materially aligned
- root signal/background treatment matches the blueprint much more closely
- featured image replaces the demo media
- live citation is preserved

- [ ] **Step 3: Check the Quote card without featured image**

Use or create a Quote post without a thumbnail.

Verify:

- Quote blueprint path still works when valid
- no media wrapper is rendered
- the card remains in collection rhythm

- [ ] **Step 4: Check invalid blueprint fallback**

Temporarily remove the `core/quote` block from `card-quote` or use a test
fixture that simulates this state.

Verify:

- the Quote card falls back to the normal collection-card renderer
- no broken half-blueprint output appears

- [ ] **Step 5: Capture the final verification output**

Record the exact passing commands and any manual frontend observations in your
final handoff.

---

### Task 7: Finish and prepare for execution handoff

**Files:**
- Use: `/Users/georgeolaru/Local Sites/style-manager/app/public/wp-content/themes/anima/.ai/docs/2026-04-15-quote-card-blueprint-reset-design.md`
- Use: `/Users/georgeolaru/Local Sites/style-manager/app/public/wp-content/themes/anima/.ai/plans/2026-04-15-quote-card-blueprint-reset-implementation-plan.md`

- [ ] **Step 1: Check both repos before the final handoff**

Run:

```bash
git -C '/Users/georgeolaru/Local Sites/style-manager/app/public/wp-content/themes/anima' status --short
git -C '/Users/georgeolaru/Local Sites/style-manager/app/public/wp-content/plugins/nova-blocks' status --short
```

Expected: only intended files for the Quote reset are changed. Do not claim a
clean worktree if unrelated changes still exist.

- [ ] **Step 2: Keep the execution notes explicit**

Document in the final execution handoff:

- Nova had unrelated dirty work before this feature
- Anima had earlier experimental Quote-card changes before the reset
- the restart implementation must not revert unrelated local edits

- [ ] **Step 3: Choose execution style before touching code**

Either:

- `Inline execution` in the current session
- `Subagent-driven execution` only if the user explicitly approves delegation

Do not begin implementation until this plan is accepted.
