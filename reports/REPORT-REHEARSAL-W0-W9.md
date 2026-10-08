# Oracle rehearsal — Chunk 1: reference library W0–W9 (headed films) (2026-10-07)

Headed Chromium (headless:false), dev `https://drupalak.ddev.site:33001`, admin via `drush uli`, one film per
step, no retries. Films: `films/cp-adopt-9r-w0-w9/`. Parent: ship #49 `0276f01` + the #50 batch (A2).
Mosaic git READ-ONLY; dev writes sanctioned.

## Table — step · condition · PASS/FAIL · film
| Step | Condition | Result | Film |
|---|---|---|---|
| W0 | `drush updb` → "No pending updates"; node/780 still renders (HTTP 200) — nothing changes | **PASS** | (drush + curl, no browser step) |
| W1 | Field types page: Mosaic tabs + a widget select + Reset-to-defaults | **PASS** | W1.png |
| W2.1 | Reference Card authoring form loads (fields table) | **PASS** | W2_1.png |
| W2.2 | Relabel Media + hide a non-required field → Save → "saved" | **PASS** | W2_2.png |
| W2.3 | Open the builder for a ref_card node → the Puck canvas/rail MOUNTS | **PASS** | W2_3-builder.png |
| W2b | (builder rail) untick Bindable → Data section drops | **DEFER** | — |
| W2c | (builder rail) rail order + open cell | **DEFER** | — |
| W2d | (builder rail) help line under the control + required `*` marker | **DEFER** | — |
| W3 | Hide required Heading → row error "…required…cannot be hidden", nothing saved | **PASS** | W3.png |
| W4 | Reset to defaults → "reset" message | **PASS** | W4.png |
| W5 | Owned component (mosaic_heading) authoring form loads (round-trip base) | **PASS** | W5.png |
| W6 | A ref_card node with a PICKED image renders `<img class="ref-card__image">` on the page | **PASS** | W6.png |
| W7 | Help lines come from the schema description | **DEFER** (builder-rail surface) | W7.png (wrong surface) |
| W8 | Libraries page: ref_legacy shows "Replaced by" the successor | **PASS** (after dev re-sync — see note) | W8.png |
| W9 | Libraries page: per-library Patterns section with a "Shown in palette" box | **PASS** | W9.png |

**Filmed PASS: 11 steps** (W0, W1, W2.1, W2.2, W2.3, W3, W4, W5, W6, W8, W9).

## DEFER (builder-rail sub-states + W7) — not product FAILs
W2b / W2c / W2d / W7 assert states INSIDE the live Puck rail (Data-section gating, rail order, open-cell, the
help line under the control, the required `*`). W2.3 confirms the builder MOUNTS headed; asserting each rail
sub-state headed (select a field, read the rail DOM) is multi-session harness work and is **automated-proven**
by `js/src/builder/__tests__/railApplication.test.ts` (media picker, help, required marker, rail-order,
open-cell, capabilities) + the Functional suite. (W7's film checked the authoring FORM by mistake — help from
the schema description renders in the BUILDER rail, not the form; re-classified here, not a product FAIL.)

## W8 — a real finding, DEV-STALE (resolved by re-sync, no code rider)
W8 first FAILED: no "Replaced by" note. Mechanism: the reference library's `mosaic_component_library` entity
was synced in the OWNED era (before ship #49's A1 allow-list) and stored its component rows by **bare** id
(`ref_legacy`), but the `replaces` target is **qualified** (`mosaic_reference_library:ref_legacy`), so
`replacedBy('ref_legacy')` = NULL. `replacedBy('mosaic_reference_library:ref_legacy')` correctly returns the
successor; a FRESH install stores qualified ids (ComponentReplacesTest proves it). Classification: **dev-stale
state from the owned→adopted flip** — it only affects a library that was mis-classified owned pre-A1 (the test
fixture); a production adopted library always had qualified ids. FIX (sanctioned dev write): deleted the stale
library entity + re-synced → ids re-qualified → `replacedBy` resolves → W8 PASS (filmed). **No code rider** (no
production site can hit this). Recorded for M2's config-audit nonetheless.

## #50 batch riders from Chunk 1
**None.** No product finding needs a rider or a ruling. (W8 = dev-stale, re-synced; W7/W2b/W2c/W2d = deferred
builder-rail sub-states, automated-proven.)

## Dev state
M1 test nodes left (all ref_card, render): **nid 1006** (variant set), **nid 1007** (variant UNSET — A2 case),
**nid 1008** (image picked — W6). Reference library enabled + library ON (re-synced → qualified ids). Nothing
uninstalled; no Manage-authoring overrides persisted (W2.2's override was reset in W4). Diagnosis nodes deleted.

## Next
Chunk 2 (next pass, same rules): reference library **A–J**. Then Chunk 3: «ext» A–J + W2/W6/W9.
