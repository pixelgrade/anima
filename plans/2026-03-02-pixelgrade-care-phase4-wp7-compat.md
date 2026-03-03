# Pixelgrade Care Phase 4: WP 7.0 Admin Compatibility Plan

**Date:** 2026-03-02  
**Status:** Not started  
**Parent plan:** `2026-03-02-wordpress-7-compatibility.md` (Phase 4)  
**Repo:** `wp-content/plugins/pixelgrade-care`  
**Can run while Phase 1 (Style Manager) is in progress:** Yes  

## Git Workflow (Required)

Phase 4 completion requires commit + push + issue update.

**Issue linkage:** `pixelgrade/pixelgrade-care#430`

### Commit templates

1. `wp7(pc): phase 4 - setup wizard admin api cleanup`
2. `wp7(pc): phase 4 - align minimal php requirement`
3. `wp7(pc): phase 4 - admin menu position compatibility`
4. `wp7(pc): phase 4 - classic editor strategy update`
5. `wp7(pc): phase 4 - tested up to 7.0`

**Commit footer:**

```text
Refs pixelgrade/pixelgrade-care#430
```

Use `Closes pixelgrade/pixelgrade-care#430` only on the final merge commit for full Phase 4 completion.

### Push/PR checklist

- [ ] Branch pushed to GitHub
- [ ] PR title includes `WP7 Phase 4`
- [ ] PR body links parent plan and issue `#430`
- [ ] Issue `#430` updated with commit SHA(s), QA summary, and screenshots

---

## Goal

Make Pixelgrade Care compatible with WordPress 7.0 admin changes without regressing dashboard/setup-wizard behavior or visual quality.

This phase is mostly isolated from Style Manager and Anima internals, so it is safe to execute in parallel.

---

## Why This Phase Is Independent

1. Work is scoped to Pixelgrade Care admin code and plugin metadata.
2. No direct dependency on SM editor CSS injection changes.
3. No dependency on Nova Blocks iframe DOM fixes.
4. Visual QA is admin-surface specific (setup wizard + dashboard SPA), not editor-canvas specific.

---

## Scope

## 4.1 Classic Editor strategy (decision + execution)

**Current location:** `vendor/classic-editor/`  

Pick one strategy and execute it in this phase:

1. Keep bundled Classic Editor and update to latest compatible version.
2. Remove bundled Classic Editor and require users to install it separately.

**Decision criteria:**
- Support burden and security maintenance cost.
- Backward compatibility expectations for existing customers.
- Distribution constraints (bundled dependencies size/licensing).

**Acceptance:** chosen strategy is implemented, documented in changelog/readme, and no fatal errors occur when plugin activates.

## 4.2 Setup wizard deprecated admin APIs

**File:** `admin/class-pixelgrade_care-setup_wizard.php`  
**Current hotspots:** around lines 153-170.

Replace deprecated/legacy style printing flow:

1. Remove `wp_enqueue_style( 'ie' )`.
2. Replace direct `do_action( "admin_print_styles-{$hook_suffix}" )` and `do_action( 'admin_print_styles' )` usage with standard enqueue/print patterns for this screen.
3. Keep wizard rendering stable (no broken styles/scripts in the standalone wizard page).

## 4.3 PHP minimum version constant alignment

**File:** `includes/class-pixelgrade_care.php`  
**Current value:** `$minimalRequiredPhpVersion = '5.3.0';`  
**Target:** `'7.4'` (align with plugin header / current support policy).

## 4.4 Admin menu position validation

**File:** `admin/class-pixelgrade_care-admin.php`  
**Current menu position:** `2` in `add_menu_page(...)`.

Tasks:
1. Verify no collisions/weird placement in WP 7.0 admin.
2. If collision exists, choose a new stable position and document rationale.
3. Verify notification bubble markup still renders correctly after any change.

## 4.5 Dashboard SPA visual QA and compatibility pass

**Primary surfaces:**
- Pixelgrade dashboard page (`admin.php?page=pixelgrade_care`)
- Themes page (`admin.php?page=pixelgrade_themes`)
- Setup wizard page (`admin.php?page=pixelgrade_care-setup-wizard`)

Tasks:
1. Check layout, spacing, typography, button hierarchy, and icon alignment under WP 7.0 admin shell.
2. Verify no CSS inheritance conflicts from refreshed WP admin tokens/classes.
3. Fix only compatibility regressions; avoid redesign scope creep.

## 4.6 Plugin metadata update

**File:** `readme.txt`  
**Change:** `Tested up to: 6.7.2` -> `Tested up to: 7.0` (after QA pass is complete).

---

## Non-Goals

1. Re-architecting the dashboard SPA.
2. New product features in Pixelgrade Care.
3. Refactoring unrelated modules (CPTs, required-plugins internals, cloud API).

---

## Implementation Sequence (Recommended)

1. Create branch: `feature/wp7-phase4-pixelgrade-care`.
2. Implement 4.2 (setup wizard API cleanup) first, because it is most likely to break rendering.
3. Implement 4.3 (PHP constant alignment).
4. Run 4.4 admin menu position verification and patch only if needed.
5. Decide and execute 4.1 Classic Editor strategy.
6. Run full visual/functional QA (4.5).
7. Update `readme.txt` (4.6) only after tests pass.

---

## Commit Plan

1. `pixelgrade-care: cleanup setup wizard deprecated admin style hooks`
2. `pixelgrade-care: align minimal required php version to 7.4`
3. `pixelgrade-care: adjust admin menu position for wp7 admin shell` (only if needed)
4. `pixelgrade-care: [keep|remove|update] bundled classic editor` (based on decision)
5. `pixelgrade-care: set tested up to 7.0`

Keep commits small and reversible.

---

## Test Matrix

Run all checks on WP 6.x baseline and WP 7.0 beta/RC.

## Functional Checks

- [ ] Plugin activates/deactivates cleanly.
- [ ] Setup wizard route opens and renders without PHP notices/fatal errors.
- [ ] Dashboard SPA loads without console errors.
- [ ] Themes page and required plugin notices/actions still work.
- [ ] Admin menu entry is visible, clickable, and not visually colliding.

## Visual Consistency Checks (Design-Sensitive)

Because product presentation is a core selling point, these are release gates:

- [ ] Typography hierarchy in Pixelgrade pages remains consistent with existing visual language.
- [ ] Spacing rhythm and panel grouping are preserved (no compressed/overstretched layouts).
- [ ] Button styles and priority (primary/secondary/text) remain visually clear.
- [ ] Icon sizes, vertical alignment, and notification bubble alignment are consistent.
- [ ] No broken dark-on-light or low-contrast combinations introduced by WP 7.0 admin CSS.
- [ ] Setup wizard and dashboard keep a coherent brand look inside the new admin shell.

## Regression Screenshots (Required)

Capture before/after screenshots for:
1. Setup wizard page.
2. Pixelgrade dashboard page.
3. Pixelgrade themes page.
4. WP admin menu area showing Pixelgrade entry + bubble.

---

## Rollback Strategy

1. Revert each commit independently if a regression appears.
2. If setup wizard breaks, revert commit 1 immediately and restore previous hook flow.
3. If Classic Editor decision causes unexpected support issues, revert only commit 4.
4. Delay `Tested up to: 7.0` metadata update until all checks pass.

---

## Exit Criteria

Phase 4 is complete when all are true:

1. Functional checklist passes on WP 6.x and WP 7.0.
2. Visual consistency checklist passes on all three Pixelgrade admin surfaces.
3. No critical console/PHP errors in wizard or dashboard flows.
4. `readme.txt` updated to `Tested up to: 7.0`.
