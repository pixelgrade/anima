# Post Title Styling Toggle Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the low-value decorative title style picker with a single LT-facing toggle that enables Hive-inspired automatic post title styling, then prepare an LT-focused documentation article that matches the new workflow.

**Architecture:** Keep the existing Hive title parser and render filters, but change the Style Manager Tweak Board contract from a radio choice to a boolean toggle stored in the same cross-theme option. Migrate legacy stored values (`underline`, `blocky`, `hive`) on theme load, remove unused CSS/body-class branches, and document the LT flow in a repo markdown article.

**Tech Stack:** WordPress PHP, Style Manager Customizer config filters, SCSS, WP-CLI contract tests, Node 22 style build.

---

### Task 1: Lock the new Customizer and runtime contract with a failing test

**Files:**
- Modify: `test/hive-title-style.php`

- [ ] **Step 1: Write the failing assertions for the new toggle contract**

Add coverage for:
- the filtered Style Manager field being an `sm_toggle`
- the LT-facing label/description/default copy
- disabled mode leaving rendered titles untouched
- enabled mode still applying Hive markup
- legacy stored values being normalized for the new toggle

- [ ] **Step 2: Run the contract test to verify it fails**

Run: `wp eval-file wp-content/themes/anima/test/hive-title-style.php`
Expected: FAIL because the field is still a radio choice and legacy values are not normalized.

### Task 2: Rework the Tweak Board field around a single toggle

**Files:**
- Modify: `inc/title-styles.php`

- [ ] **Step 1: Override the shared Tweak Board field contract from the title styling module**

Override the plugin-provided `sm_decorative_titles_style` config with:
- `type => sm_toggle`
- the same `setting_id`
- LT-facing label/description copy
- `default => false`

- [ ] **Step 2: Add legacy option migration and cache invalidation beside the field override**

Normalize legacy stored values on theme load so:
- `hive` becomes enabled
- `underline` and `blocky` become disabled
- unset values stay unset and rely on the new default

### Task 3: Simplify frontend wiring to match the new toggle semantics

**Files:**
- Modify: `inc/title-styles.php`
- Modify: `inc/template-functions.php`
- Modify: `src/scss/elements/_base.scss`

- [ ] **Step 1: Switch the title styling helper to a boolean enable/disable check**

Accept both the new boolean option value and any legacy `hive` value during runtime.

- [ ] **Step 2: Remove dead body-class and CSS branches**

Delete the `Underline` / `Blocky` body-class driven styling and keep only the title emphasis rules that support the injected Hive markup.

- [ ] **Step 3: Keep the parser and render hooks intact**

No behavior change for the actual rule-based title styling once enabled.

### Task 4: Write the LT-focused documentation article

**Files:**
- Create: `docs/post-titles-styling.md`

- [ ] **Step 1: Duplicate the Hive article structure in LT terms**

Cover:
- what the feature does in LT/Anima
- where to enable or disable it in the Customizer
- the punctuation/case rules that drive the styling

- [ ] **Step 2: Rewrite the introduction for LT**

Position it as an Anima-powered LT option instead of a Hive-classic theme feature.

### Task 5: Rebuild and verify before commit

**Files:**
- Modify: `style.css`
- Modify: `style-rtl.css`
- Modify: `dist/css/block-editor.css`
- Modify: `dist/css/block-editor-rtl.css`

- [ ] **Step 1: Run the WP contract test**

Run: `wp eval-file wp-content/themes/anima/test/hive-title-style.php`
Expected: PASS

- [ ] **Step 2: Run the styles build on Node 22**

Run: `npm run styles`
Expected: PASS

- [ ] **Step 3: Spot-check the filtered Style Manager field**

Run a WP eval command to confirm the field type, copy, and default in the filtered config.

- [ ] **Step 4: Commit and push**

Commit message must include:

```bash
Fixes #433
```
