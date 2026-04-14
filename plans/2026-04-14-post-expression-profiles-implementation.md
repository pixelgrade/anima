# Post Expression Profiles Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build automatic post expression profiles across Anima and Nova so native Post Formats plus derived media traits drive Cards Collection cards and single-post rendering without adding manual override UI.

**Architecture:** Treat this as a two-repo change. Anima owns the semantic resolver, single-post rendering, and Hive LT styling; Nova exposes one narrow pre-render card hook so themes can inject expression-aware render data without rewriting finished HTML. Execution happens from the mirrored source repos under `/Users/georgeolaru/Local Sites/style-manager/app/public`, but all verification should run against the Hive LT Studio target at `/Users/georgeolaru/Studio/hive-lt-starter` after confirming the mirrored theme/plugin copies are up to date.

**Tech Stack:** WordPress block themes, PHP 8.3, Nova Blocks PHP render pipeline, `parse_blocks()`, `studio wp eval-file`, Node 22, webpack, gulp/SCSS, block editor JS registration.

---

## File Structure

### Anima source repo

**Modify**
- `/Users/georgeolaru/Local Sites/style-manager/app/public/wp-content/themes/anima/functions.php`
- `/Users/georgeolaru/Local Sites/style-manager/app/public/wp-content/themes/anima/inc/integrations.php`
- `/Users/georgeolaru/Local Sites/style-manager/app/public/wp-content/themes/anima/inc/integrations/novablocks.php`
- `/Users/georgeolaru/Local Sites/style-manager/app/public/wp-content/themes/anima/inc/fse.php`
- `/Users/georgeolaru/Local Sites/style-manager/app/public/wp-content/themes/anima/templates/single.html`
- `/Users/georgeolaru/Local Sites/style-manager/app/public/wp-content/themes/anima/src/js/editor.js`
- `/Users/georgeolaru/Local Sites/style-manager/app/public/wp-content/themes/anima/src/scss/style.scss`
- `/Users/georgeolaru/Local Sites/style-manager/app/public/wp-content/themes/anima/src/scss/blocks/nova-blocks/cards-collection/_style.scss`
- `/Users/georgeolaru/Local Sites/style-manager/app/public/wp-content/themes/anima/src/scss/blocks/nova-blocks/supernova-item/_style.scss`

**Create**
- `/Users/georgeolaru/Local Sites/style-manager/app/public/wp-content/themes/anima/inc/post-expressions.php`
- `/Users/georgeolaru/Local Sites/style-manager/app/public/wp-content/themes/anima/inc/integrations/post-expressions.php`
- `/Users/georgeolaru/Local Sites/style-manager/app/public/wp-content/themes/anima/inc/fse/post-expression-shell.php`
- `/Users/georgeolaru/Local Sites/style-manager/app/public/wp-content/themes/anima/src/js/blocks/post-expression-shell/index.js`
- `/Users/georgeolaru/Local Sites/style-manager/app/public/wp-content/themes/anima/src/scss/components/_post-expressions.scss`
- `/Users/georgeolaru/Local Sites/style-manager/app/public/wp-content/themes/anima/src/scss/blocks/nova-blocks/cards-collection/_post-expressions.scss`
- `/Users/georgeolaru/Local Sites/style-manager/app/public/wp-content/themes/anima/test/post-expression-profile.php`
- `/Users/georgeolaru/Local Sites/style-manager/app/public/wp-content/themes/anima/test/post-expression-card-render.php`
- `/Users/georgeolaru/Local Sites/style-manager/app/public/wp-content/themes/anima/test/post-expression-single-shell.php`

### Nova Blocks source repo

**Modify**
- `/Users/georgeolaru/Local Sites/style-manager/app/public/wp-content/plugins/nova-blocks/lib/block-rendering.php`

**Create**
- `/Users/georgeolaru/Local Sites/style-manager/app/public/wp-content/plugins/nova-blocks/tests/wp-eval/post-expression-card-render-data-contract.php`

### Verification target

**Use**
- `/Users/georgeolaru/Studio/hive-lt-starter`

The Studio site is the runtime target. Always verify that its mirrored copies of `anima` and `nova-blocks` reflect the source-repo edits before running `studio wp` contract tests.

---

### Task 1: Prepare the two repos and issue tracking

**Files:**
- Modify: none
- Verify: `/Users/georgeolaru/Local Sites/style-manager/app/public/wp-content/themes/anima/AGENTS.md`
- Verify: `/Users/georgeolaru/Local Sites/style-manager/app/public/wp-content/plugins/nova-blocks/AGENTS.md`

- [ ] **Step 1: Create the implementation issue(s) before touching code**

Create one issue in `pixelgrade/anima` for the end-user feature and one issue in `pixelgrade/nova-blocks` for the pre-render hook. Keep them linked so the theme issue depends on the Nova hook issue.

Run:

```bash
gh issue create --repo pixelgrade/anima --title "Add automatic post expression profiles for cards and single posts"
gh issue create --repo pixelgrade/nova-blocks --title "Add pre-render hook for expression-aware post card data"
```

Expected: Two issue numbers exist and can be referenced from subsequent commits.

- [ ] **Step 2: Assign both issues to the active milestone**

Run:

```bash
gh api repos/pixelgrade/anima/milestones?state=open
gh api repos/pixelgrade/nova-blocks/milestones?state=open
```

Expected: Both issues are assigned to an active release milestone before implementation starts.

- [ ] **Step 3: Confirm the source-of-truth repos and the Studio runtime target**

Run:

```bash
git -C "/Users/georgeolaru/Local Sites/style-manager/app/public/wp-content/themes/anima" rev-parse --show-toplevel
git -C "/Users/georgeolaru/Local Sites/style-manager/app/public/wp-content/plugins/nova-blocks" rev-parse --show-toplevel
studio site status --path "/Users/georgeolaru/Studio/hive-lt-starter"
```

Expected: Anima and Nova both resolve as git repos, and the Hive LT Studio site is running.

- [ ] **Step 4: Confirm the target site can see mirrored theme/plugin changes**

Run:

```bash
studio wp theme list --path "/Users/georgeolaru/Studio/hive-lt-starter" --status=active
studio wp plugin list --path "/Users/georgeolaru/Studio/hive-lt-starter" --status=active --field=name
```

Expected: `anima` is active and `nova-blocks` is active on the Studio site that will run the contract tests.

- [ ] **Step 5: Commit the prep notes if any repo docs need updating**

```bash
git -C "/Users/georgeolaru/Local Sites/style-manager/app/public/wp-content/themes/anima" status --short
git -C "/Users/georgeolaru/Local Sites/style-manager/app/public/wp-content/plugins/nova-blocks" status --short
```

Expected: No code changes yet. If doc-only prep changes were needed, commit them separately before the feature work begins.

---

### Task 2: Add and prove the Nova pre-render hook

**Files:**
- Modify: `/Users/georgeolaru/Local Sites/style-manager/app/public/wp-content/plugins/nova-blocks/lib/block-rendering.php`
- Test: `/Users/georgeolaru/Local Sites/style-manager/app/public/wp-content/plugins/nova-blocks/tests/wp-eval/post-expression-card-render-data-contract.php`

- [ ] **Step 1: Write the failing Nova contract test**

Create `tests/wp-eval/post-expression-card-render-data-contract.php` that:

```php
<?php

$post_id = wp_insert_post(
	[
		'post_title'   => 'Expression Contract Post',
		'post_content' => '<!-- wp:paragraph --><p>Body copy</p><!-- /wp:paragraph -->',
		'post_status'  => 'publish',
		'post_type'    => 'post',
	]
);

add_filter(
	'novablocks/post_card_render_data',
	static function ( array $render_data ) {
		$render_data['card_classes'][] = 'has-expression-contract';
		$render_data['content_markup'] = '<div class="contract-content">Contract content</div>';
		return $render_data;
	},
	10,
	4
);

$markup = novablocks_get_collection_card_markup_from_post( get_post( $post_id ), [ 'showMedia' => true ] );

if ( false === strpos( $markup, 'has-expression-contract' ) ) {
	throw new RuntimeException( 'Expected pre-render hook classes to reach final card markup.' );
}

if ( false === strpos( $markup, 'contract-content' ) ) {
	throw new RuntimeException( 'Expected pre-render hook content override to reach final card markup.' );
}

echo "post expression pre-render contract ok\n";
```

- [ ] **Step 2: Run the contract test to verify it fails before the hook exists**

Run:

```bash
studio wp eval-file "/Users/georgeolaru/Local Sites/style-manager/app/public/wp-content/plugins/nova-blocks/tests/wp-eval/post-expression-card-render-data-contract.php" --path "/Users/georgeolaru/Studio/hive-lt-starter"
```

Expected: FAIL because `novablocks/post_card_render_data` does not exist yet.

- [ ] **Step 3: Add the minimal render-data pipeline in Nova**

In `lib/block-rendering.php`, change `novablocks_get_collection_card_markup_from_post()` so it builds defaults, exposes them to filters, and then renders from the filtered payload:

```php
$profile = apply_filters( 'novablocks/post_card_profile', [], $post, $attributes );

$render_data = [
	'card_classes'   => [],
	'card_attributes' => $attributes,
	'media_markup'   => $media_markup,
	'content_markup' => $card_content,
];

$render_data = apply_filters( 'novablocks/post_card_render_data', $render_data, $post, $attributes, $profile );

if ( ! empty( $render_data['card_classes'] ) ) {
	$extra_classes = implode( ' ', array_map( 'sanitize_html_class', $render_data['card_classes'] ) );
	$render_data['card_attributes']['className'] = trim( ( $render_data['card_attributes']['className'] ?? '' ) . ' ' . $extra_classes );
}

return novablocks_get_collection_card_markup(
	$render_data['media_markup'],
	$render_data['content_markup'],
	$render_data['card_attributes']
);
```

Keep the existing `novablocks/get_collection_card_markup` filter in place so current theme behavior remains backward-compatible.

- [ ] **Step 4: Re-run the Nova contract test**

Run:

```bash
studio wp eval-file "/Users/georgeolaru/Local Sites/style-manager/app/public/wp-content/plugins/nova-blocks/tests/wp-eval/post-expression-card-render-data-contract.php" --path "/Users/georgeolaru/Studio/hive-lt-starter"
```

Expected: PASS with `post expression pre-render contract ok`.

- [ ] **Step 5: Commit the Nova hook**

```bash
git -C "/Users/georgeolaru/Local Sites/style-manager/app/public/wp-content/plugins/nova-blocks" add lib/block-rendering.php tests/wp-eval/post-expression-card-render-data-contract.php
git -C "/Users/georgeolaru/Local Sites/style-manager/app/public/wp-content/plugins/nova-blocks" commit -m "Add pre-render hook for expression-aware post cards

Fixes #NOVA_ISSUE"
```

---

### Task 3: Add the Anima resolver and enable native Post Formats

**Files:**
- Modify: `/Users/georgeolaru/Local Sites/style-manager/app/public/wp-content/themes/anima/functions.php`
- Create: `/Users/georgeolaru/Local Sites/style-manager/app/public/wp-content/themes/anima/inc/post-expressions.php`
- Test: `/Users/georgeolaru/Local Sites/style-manager/app/public/wp-content/themes/anima/test/post-expression-profile.php`

- [ ] **Step 1: Write the failing resolver contract test**

Create `test/post-expression-profile.php` that covers:
- empty format normalizes to `standard`
- quote posts resolve `media_mode => text`
- image-shape thresholds follow Patch values
- quote fallback uses the first paragraph when no quote block or excerpt exists

Use temporary posts and attachment metadata like:

```php
$attachment_id = wp_insert_attachment(
	[
		'post_mime_type' => 'image/jpeg',
		'post_title'     => 'Portrait Fixture',
		'post_status'    => 'inherit',
	],
	'/tmp/post-expression-portrait.jpg'
);

wp_update_attachment_metadata(
	$attachment_id,
	[
		'width'  => 800,
		'height' => 1200,
		'file'   => 'post-expression-portrait.jpg',
	]
);

set_post_thumbnail( $post_id, $attachment_id );

$profile = anima_get_post_expression_profile( $post_id, 'card' );

if ( 'portrait' !== $profile['traits']['image_shape'] ) {
	throw new RuntimeException( 'Expected portrait ratio bucket.' );
}
```

- [ ] **Step 2: Run the resolver contract test to verify it fails**

Run:

```bash
studio wp eval-file "/Users/georgeolaru/Local Sites/style-manager/app/public/wp-content/themes/anima/test/post-expression-profile.php" --path "/Users/georgeolaru/Studio/hive-lt-starter"
```

Expected: FAIL because the resolver functions do not exist yet.

- [ ] **Step 3: Add theme support and implement the resolver**

In `functions.php`, enable the supported formats during `anima_setup()`:

```php
add_theme_support(
	'post-formats',
	[ 'quote', 'image', 'gallery', 'link', 'audio', 'video' ]
);
```

Create `inc/post-expressions.php` with focused functions:

```php
function anima_get_post_expression_profile( $post = null, string $surface = 'default' ): array {}
function anima_resolve_post_expression_profile( WP_Post $post, string $surface ): array {}
function anima_get_post_expression_image_shape( int $thumbnail_id ): string {}
function anima_get_post_expression_extracts( WP_Post $post ): array {}
```

Resolver requirements:
- use a static request cache keyed by `post_id:surface`
- only parse blocks for supported formats that need extraction
- keep Patch thresholds: `<0.5625`, `<0.75`, `>1.78`, `>1.34`
- quote fallback order: `core/quote`, rendered `<blockquote>`, manual excerpt, first paragraph, never full content

Then require the file from `functions.php` next to the other core helper includes.

- [ ] **Step 4: Re-run the resolver contract test**

Run:

```bash
studio wp eval-file "/Users/georgeolaru/Local Sites/style-manager/app/public/wp-content/themes/anima/test/post-expression-profile.php" --path "/Users/georgeolaru/Studio/hive-lt-starter"
```

Expected: PASS with a single success line.

- [ ] **Step 5: Commit the resolver**

```bash
git -C "/Users/georgeolaru/Local Sites/style-manager/app/public/wp-content/themes/anima" add functions.php inc/post-expressions.php test/post-expression-profile.php
git -C "/Users/georgeolaru/Local Sites/style-manager/app/public/wp-content/themes/anima" commit -m "Add post expression profile resolver

Fixes #ANIMA_ISSUE"
```

---

### Task 4: Wire expression profiles into Nova cards from Anima

**Files:**
- Modify: `/Users/georgeolaru/Local Sites/style-manager/app/public/wp-content/themes/anima/inc/integrations.php`
- Modify: `/Users/georgeolaru/Local Sites/style-manager/app/public/wp-content/themes/anima/inc/integrations/novablocks.php`
- Create: `/Users/georgeolaru/Local Sites/style-manager/app/public/wp-content/themes/anima/inc/integrations/post-expressions.php`
- Test: `/Users/georgeolaru/Local Sites/style-manager/app/public/wp-content/themes/anima/test/post-expression-card-render.php`

- [ ] **Step 1: Write the failing card-render contract test**

Create `test/post-expression-card-render.php` that:
- creates a quote-format post and a portrait-image post
- calls `novablocks_get_collection_card_markup_from_post()`
- asserts semantic and trait classes reach the final card
- asserts quote content can replace the default excerpt/title stack when needed

Example assertion:

```php
$markup = novablocks_get_collection_card_markup_from_post( get_post( $quote_post_id ), $attributes );

if ( false === strpos( $markup, 'format-quote' ) ) {
	throw new RuntimeException( 'Expected quote semantic class on card output.' );
}

if ( false === strpos( $markup, 'card-trait-text' ) ) {
	throw new RuntimeException( 'Expected text trait class on quote card output.' );
}
```

- [ ] **Step 2: Run the card-render contract test to verify it fails**

Run:

```bash
studio wp eval-file "/Users/georgeolaru/Local Sites/style-manager/app/public/wp-content/themes/anima/test/post-expression-card-render.php" --path "/Users/georgeolaru/Studio/hive-lt-starter"
```

Expected: FAIL because Anima is not yet filtering the new Nova hooks.

- [ ] **Step 3: Add the theme-side Nova integration**

Create `inc/integrations/post-expressions.php` and load it from `inc/integrations.php`.

Implement the two callbacks:

```php
add_filter( 'novablocks/post_card_profile', 'anima_filter_novablocks_post_card_profile', 10, 3 );
add_filter( 'novablocks/post_card_render_data', 'anima_filter_novablocks_post_card_render_data', 10, 4 );

function anima_filter_novablocks_post_card_profile( array $profile, $post, array $attributes ): array {
	return anima_get_post_expression_profile( $post, 'card' );
}

function anima_filter_novablocks_post_card_render_data( array $render_data, $post, array $attributes, array $profile ): array {
	$render_data['card_classes'] = array_merge(
		$render_data['card_classes'],
		[
			'format-' . $profile['format'],
			'card-trait-' . $profile['traits']['image_shape'],
			'card-variant-' . $profile['card_variant'],
		]
	);

	return $render_data;
}
```

Keep v1 lean:
- do not expose extra public Anima filters yet
- only override media/content markup for supported formats that need it
- leave unsupported or standard cards on the existing Nova path

- [ ] **Step 4: Re-run the card-render contract test**

Run:

```bash
studio wp eval-file "/Users/georgeolaru/Local Sites/style-manager/app/public/wp-content/themes/anima/test/post-expression-card-render.php" --path "/Users/georgeolaru/Studio/hive-lt-starter"
```

Expected: PASS and show the expected semantic + trait classes in final card markup.

- [ ] **Step 5: Commit the Anima card integration**

```bash
git -C "/Users/georgeolaru/Local Sites/style-manager/app/public/wp-content/themes/anima" add inc/integrations.php inc/integrations/novablocks.php inc/integrations/post-expressions.php test/post-expression-card-render.php
git -C "/Users/georgeolaru/Local Sites/style-manager/app/public/wp-content/themes/anima" commit -m "Wire post expression profiles into Nova card rendering

Refs #ANIMA_ISSUE"
```

---

### Task 5: Add the single-post expression shell and switch `single.html` to use it

**Files:**
- Modify: `/Users/georgeolaru/Local Sites/style-manager/app/public/wp-content/themes/anima/inc/fse.php`
- Modify: `/Users/georgeolaru/Local Sites/style-manager/app/public/wp-content/themes/anima/templates/single.html`
- Modify: `/Users/georgeolaru/Local Sites/style-manager/app/public/wp-content/themes/anima/src/js/editor.js`
- Create: `/Users/georgeolaru/Local Sites/style-manager/app/public/wp-content/themes/anima/inc/fse/post-expression-shell.php`
- Create: `/Users/georgeolaru/Local Sites/style-manager/app/public/wp-content/themes/anima/src/js/blocks/post-expression-shell/index.js`
- Test: `/Users/georgeolaru/Local Sites/style-manager/app/public/wp-content/themes/anima/test/post-expression-single-shell.php`

- [ ] **Step 1: Write the failing single-shell contract test**

Create `test/post-expression-single-shell.php` that renders the shell for:
- a standard post
- a quote post
- an image or gallery post

The test should assert the shell chooses the correct variant class and does not require template slug swapping:

```php
$markup = anima_render_post_expression_shell_block(
	[],
	'',
	new WP_Block(
		[
			'blockName' => 'anima/post-expression-shell',
			'attrs'     => [],
		],
		[
			'postId' => $quote_post_id,
		]
	)
);

if ( false === strpos( $markup, 'anima-post-expression-shell--quote' ) ) {
	throw new RuntimeException( 'Expected quote single variant.' );
}
```

- [ ] **Step 2: Run the single-shell contract test to verify it fails**

Run:

```bash
studio wp eval-file "/Users/georgeolaru/Local Sites/style-manager/app/public/wp-content/themes/anima/test/post-expression-single-shell.php" --path "/Users/georgeolaru/Studio/hive-lt-starter"
```

Expected: FAIL because the shell block is not registered yet.

- [ ] **Step 3: Register the template-only dynamic block and renderer**

Create `inc/fse/post-expression-shell.php` with:

```php
add_action( 'init', 'anima_register_post_expression_shell_block' );

function anima_register_post_expression_shell_block(): void {
	register_block_type(
		'anima/post-expression-shell',
		[
			'render_callback' => 'anima_render_post_expression_shell_block',
		]
	);
}
```

Render callback requirements:
- resolve the current post ID from block context or globals
- fetch `anima_get_post_expression_profile( $post_id, 'single' )`
- return variant-scoped markup with classes like:

```php
<div class="anima-post-expression-shell anima-post-expression-shell--quote">
```

- keep the lower-page structures already present in `templates/single.html` outside this shell
- use the shell only for the entry hero/content region that differs by expression

Register a matching editor block in `src/js/blocks/post-expression-shell/index.js` and import it from `src/js/editor.js`:

```js
const { registerBlockType } = wp.blocks;
const { Placeholder } = wp.components;

registerBlockType( 'anima/post-expression-shell', {
  apiVersion: 3,
  title: 'Post Expression Shell',
  icon: 'format-aside',
  category: 'theme',
  supports: { inserter: false, reusable: false, html: false, multiple: false },
  edit() {
    return wp.element.createElement(
      Placeholder,
      { label: 'Post Expression Shell', instructions: 'Rendered automatically from the current post profile.' }
    );
  },
  save() {
    return null;
  },
} );
```

- [ ] **Step 4: Update `single.html` to use the shell**

Replace the current top title/excerpt/featured-image/post-content region with:

```html
<!-- wp:anima/post-expression-shell /-->
```

Leave the later related-posts, post-navigation, comments, and sidebar regions in place unless the shell must own a small portion of them for layout correctness.

- [ ] **Step 5: Re-run the single-shell contract test and commit**

Run:

```bash
studio wp eval-file "/Users/georgeolaru/Local Sites/style-manager/app/public/wp-content/themes/anima/test/post-expression-single-shell.php" --path "/Users/georgeolaru/Studio/hive-lt-starter"
npm --prefix "/Users/georgeolaru/Local Sites/style-manager/app/public/wp-content/themes/anima" run scripts
```

Expected: The PHP contract test passes, and the editor bundle rebuilds without errors.

Commit:

```bash
git -C "/Users/georgeolaru/Local Sites/style-manager/app/public/wp-content/themes/anima" add inc/fse.php inc/fse/post-expression-shell.php templates/single.html src/js/editor.js src/js/blocks/post-expression-shell/index.js dist/js/editor.js dist/js/editor.min.js test/post-expression-single-shell.php
git -C "/Users/georgeolaru/Local Sites/style-manager/app/public/wp-content/themes/anima" commit -m "Add single post expression shell

Refs #ANIMA_ISSUE"
```

---

### Task 6: Add Hive LT card/single styling and rebuild assets

**Files:**
- Modify: `/Users/georgeolaru/Local Sites/style-manager/app/public/wp-content/themes/anima/src/scss/style.scss`
- Modify: `/Users/georgeolaru/Local Sites/style-manager/app/public/wp-content/themes/anima/src/scss/blocks/nova-blocks/cards-collection/_style.scss`
- Modify: `/Users/georgeolaru/Local Sites/style-manager/app/public/wp-content/themes/anima/src/scss/blocks/nova-blocks/supernova-item/_style.scss`
- Create: `/Users/georgeolaru/Local Sites/style-manager/app/public/wp-content/themes/anima/src/scss/components/_post-expressions.scss`
- Create: `/Users/georgeolaru/Local Sites/style-manager/app/public/wp-content/themes/anima/src/scss/blocks/nova-blocks/cards-collection/_post-expressions.scss`

- [ ] **Step 1: Add the single-post shell styles**

Create `src/scss/components/_post-expressions.scss` and import it from `src/scss/style.scss`.

Include only the v1 variant scopes:

```scss
.anima-post-expression-shell--quote {
  .wp-block-post-title {
    @include apply-font(site-title);
  }
}

.anima-post-expression-shell--visual {
  .wp-block-post-featured-image {
    margin-bottom: var(--nb-spacing);
  }
}
```

- [ ] **Step 2: Add the card-variant and trait styles**

Create `src/scss/blocks/nova-blocks/cards-collection/_post-expressions.scss` and import it from `cards-collection/_style.scss`.

Add only the classes emitted by the resolver:

```scss
.nb-supernova-item.format-quote.card-variant-quote {
  .nb-card__description {
    font-style: italic;
  }
}

.nb-supernova-item.card-trait-portrait {
  --nb-card-media-padding-top: 140%;
}
```

Use the existing Supernova/Card CSS variables where possible instead of adding new custom ones.

- [ ] **Step 3: Add any dropcap or media-wrapper adjustments in the existing Supernova item scope**

Keep format-specific CSS that truly belongs to the shared card atom in:
- `src/scss/blocks/nova-blocks/supernova-item/_style.scss`

Avoid duplicating layout rules between the Cards Collection scope and the Supernova item scope.

- [ ] **Step 4: Build the committed CSS assets**

Run:

```bash
export NVM_DIR="/Users/georgeolaru/.nvm" && source "/Users/georgeolaru/.nvm/nvm.sh" && nvm use 22
npm --prefix "/Users/georgeolaru/Local Sites/style-manager/app/public/wp-content/themes/anima" run styles
```

Expected: Updated CSS is written to the committed build outputs, including `style.css`, `style-rtl.css`, and the relevant `dist/css/` files.

- [ ] **Step 5: Commit the styling layer**

```bash
git -C "/Users/georgeolaru/Local Sites/style-manager/app/public/wp-content/themes/anima" add src/scss/style.scss src/scss/components/_post-expressions.scss src/scss/blocks/nova-blocks/cards-collection/_style.scss src/scss/blocks/nova-blocks/cards-collection/_post-expressions.scss src/scss/blocks/nova-blocks/supernova-item/_style.scss style.css style-rtl.css dist/css
git -C "/Users/georgeolaru/Local Sites/style-manager/app/public/wp-content/themes/anima" commit -m "Style post expression cards and singles

Refs #ANIMA_ISSUE"
```

---

### Task 7: Run full verification on Hive LT and close the loop

**Files:**
- Verify: `/Users/georgeolaru/Local Sites/style-manager/app/public/wp-content/themes/anima/test/post-expression-profile.php`
- Verify: `/Users/georgeolaru/Local Sites/style-manager/app/public/wp-content/themes/anima/test/post-expression-card-render.php`
- Verify: `/Users/georgeolaru/Local Sites/style-manager/app/public/wp-content/themes/anima/test/post-expression-single-shell.php`
- Verify: `/Users/georgeolaru/Local Sites/style-manager/app/public/wp-content/plugins/nova-blocks/tests/wp-eval/post-expression-card-render-data-contract.php`

- [ ] **Step 1: Re-run all contract tests serially against the Hive LT Studio site**

Run:

```bash
studio wp eval-file "/Users/georgeolaru/Local Sites/style-manager/app/public/wp-content/plugins/nova-blocks/tests/wp-eval/post-expression-card-render-data-contract.php" --path "/Users/georgeolaru/Studio/hive-lt-starter"
studio wp eval-file "/Users/georgeolaru/Local Sites/style-manager/app/public/wp-content/themes/anima/test/post-expression-profile.php" --path "/Users/georgeolaru/Studio/hive-lt-starter"
studio wp eval-file "/Users/georgeolaru/Local Sites/style-manager/app/public/wp-content/themes/anima/test/post-expression-card-render.php" --path "/Users/georgeolaru/Studio/hive-lt-starter"
studio wp eval-file "/Users/georgeolaru/Local Sites/style-manager/app/public/wp-content/themes/anima/test/post-expression-single-shell.php" --path "/Users/georgeolaru/Studio/hive-lt-starter"
```

Expected: All four contract tests pass. Run them serially, not in parallel.

- [ ] **Step 2: Rebuild the two repos as needed**

Run:

```bash
export NVM_DIR="/Users/georgeolaru/.nvm" && source "/Users/georgeolaru/.nvm/nvm.sh" && nvm use 22
npm --prefix "/Users/georgeolaru/Local Sites/style-manager/app/public/wp-content/themes/anima" run scripts
npm --prefix "/Users/georgeolaru/Local Sites/style-manager/app/public/wp-content/themes/anima" run styles
```

Run the Nova build only if the hook work later expands beyond PHP-only changes:

```bash
npm --prefix "/Users/georgeolaru/Local Sites/style-manager/app/public/wp-content/plugins/nova-blocks" run build
```

- [ ] **Step 3: Verify the frontend manually on the Hive LT Studio site**

Verify:
- quote post card
- image post card with portrait thumbnail
- image or gallery post with landscape thumbnail
- single quote post shell
- single visual post shell
- standard post remains on the default path

Preferred URLs:

```bash
studio wp post list --path "/Users/georgeolaru/Studio/hive-lt-starter" --post_type=post --fields=ID,post_title,post_name
```

- [ ] **Step 4: Push both repos and close the linked issues**

Run:

```bash
git -C "/Users/georgeolaru/Local Sites/style-manager/app/public/wp-content/plugins/nova-blocks" push origin main
git -C "/Users/georgeolaru/Local Sites/style-manager/app/public/wp-content/themes/anima" push origin main
```

Then comment on and close the linked issues after summarizing root cause, fix, and verification.

- [ ] **Step 5: Record any follow-up scope explicitly instead of widening v1**

Open new issues for anything deferred:
- manual per-post override
- additional formats like `aside`, `status`, or `chat`
- theme-variation specific mappings beyond Hive LT
- richer editor preview for the single shell block

Do not expand v1 during implementation.
