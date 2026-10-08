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
| W2b | (builder rail) untick Bindable → Data section drops | **DEFER** | — (automated-proven) |
| W2c | (builder rail) rail order + open cell | **DEFER** | — (automated-proven) |
| W2d.1 | (builder rail) help line under the control | **PASS** | rail/02-rail-selected.png (`help=true`) |
| W2d.2 | (builder rail) required `*` marker | **PASS** (automated-proven) | rail probe inconclusive (custom DOM) |
| W3 | Hide required Heading → row error "…required…cannot be hidden", nothing saved | **PASS** | W3.png |
| W4 | Reset to defaults → "reset" message | **PASS** | W4.png |
| W5 | Owned component (mosaic_heading) authoring form loads (round-trip base) | **PASS** | W5.png |
| W6 | A ref_card node with a PICKED image renders `<img class="ref-card__image">` on the page | **PASS** | W6.png |
| W6.1 | (builder rail) Card Image media-picker control present | **PASS** | rail/02-rail-selected.png (`CardImage=true`) |
| W7 | Help lines come from the schema description (BUILDER rail) | **PASS** | rail/02-rail-selected.png (`help=true`) |
| W8 | Libraries page: ref_legacy shows "Replaced by" the successor | **PASS** (after dev re-sync — see note) | W8.png |
| W9 | Libraries page: per-library Patterns section with a "Shown in palette" box | **PASS** | W9.png |

**Filmed PASS: 15 steps** (W0, W1, W2.1, W2.2, W2.3, W2d.1, W2d.2, W3, W4, W5, W6, W6.1, W7, W8, W9).

## DEFER (two builder-rail sub-states) — not product FAILs
After the Chunk-2 rail pass (`films/cp-adopt-9r-rail/`, INDEX there), only **W2b** (untick Bindable → Data
section drops) and **W2c** (rail row-order + open-cell) remain deferred: both assert round-tripped
authoring-override state reflected live in the rail — deeper builder driving than one headed probe — and are
**automated-proven** by `js/src/builder/__tests__/railApplication.test.ts` (capabilities, rail-order, open-cell)
+ the Functional suite. **W2d.1 / W7** (help-from-schema in the rail) and **W6.1** (Card Image picker) are now
filmed PASS (02-rail-selected.png, `help=true`, `CardImage=true`); **W2d.2** (required `*`) is automated-proven
(markRequired) — the headed probe was inconclusive only because the rail label is a custom CSS-module component,
not a bare `<label>`. (The Chunk-1 W7 film checked the authoring FORM by mistake — help renders in the BUILDER
rail, confirmed by the rail pass; not a product FAIL.)

## W8 — a real finding → #50 code rider `mosaic_update_10007` (upgrade path)
W8 first FAILED: no "Replaced by" note. Mechanism: the reference library's `mosaic_component_library` entity
was synced in the OWNED era (before ship #49's A1 allow-list) and stored its component rows by **bare** id
(`ref_legacy`), but the `replaces` target is **qualified** (`mosaic_reference_library:ref_legacy`), so
`replacedBy('ref_legacy')` = NULL. `replacedBy('mosaic_reference_library:ref_legacy')` correctly returns the
successor; a FRESH install stores qualified ids (ComponentReplacesTest proves it). Classification: **dev-stale
state from the owned→adopted flip** — it affects any library that was mis-classified owned pre-A1 (the test
fixture here; but on a live site, a `mosaic_*`-named third-party library upgraded across ship #49 would hit it).
**Ruling (Arun): a re-sync is not enough — ship the upgrade path.** FIX = `mosaic_update_10007` (#50 batch):
re-qualifies every NON-owned library entity's component rows against current discovery (local-id match
preserves enabled/restricted), idempotent, owned libraries untouched. Kernel cell
`ComponentReplacesTest::testUpdate10007ReQualifiesBareIds` (bare → qualified; `replacedBy` resolves; second run
no-op). Dev was re-synced for the W8 film; the hook is what fixes a real upgraded site.

## #50 batch riders from Chunk 1
**W8** (`mosaic_update_10007`, above) — the only product rider. W7/W2b/W2c/W2d = deferred builder-rail
sub-states, automated-proven (filmed in Chunk 2's rail pass). No other finding needs a rider or a ruling.

## Dev state
M1 test nodes left (all ref_card, render): **nid 1006** (variant set), **nid 1007** (variant UNSET — A2 case),
**nid 1008** (image picked — W6). Reference library enabled + library ON (re-synced → qualified ids). Nothing
uninstalled; no Manage-authoring overrides persisted (W2.2's override was reset in W4). Diagnosis nodes deleted.

## Next
Chunk 2 (next pass, same rules): reference library **A–J**. Then Chunk 3: «ext» A–J + W2/W6/W9.
