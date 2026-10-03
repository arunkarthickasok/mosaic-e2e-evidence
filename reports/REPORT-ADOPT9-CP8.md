# CP-ADOPT-9 CHECKPOINT-8 — required marker + help + slot preferred (13/14)

**Date:** 2026-10-03 · **Branch:** `fix/finding-016-validator` (mosaic working tree — built + gated; not
AI-committed per commit-flow, handed to Arun). Parent ship #47 = `33cd40c`. **JS-only pass.**

CHECKPOINT-8 applies three of the last four knobs — required marker, help, slot preferred — reaching
**13/14**. The 14th (patterns-shown) has a genuine architectural blocker (below); it is tabled, not faked.

## Built this pass (per the reviewer's rulings)
- **Required marker** (`MosaicPuckAdapter.markRequired`) — a required field (schema- or form-required, from
  the resolved descriptor) carries a trailing `*` in its rail label, both field-building paths (owned +
  adopted). Reviewer-ruled honest UI.
- **Help** — Puck 0.21 has no field-help slot and its `fieldLabel` override receives only the label, so a
  help override rides in the label behind a sentinel (`encodeHelp`/`splitHelp`); the new **`MosaicFieldLabel`**
  override (wired into `puckOverrides.fieldLabel`) reuses Puck's exported `FieldLabel` and renders the help
  line **under the control** only when present. No help → Puck's default rendering verbatim → byte-identical.
  Same adapter → FE-dialog parity.
- **Slot preferred** — the resolved preferred child is listed FIRST in the slot's `allow`, so the zone
  picker offers it as the primary "+ Add {Preferred}". No preferred → order unchanged (byte-identical).
- `railApplication.test.ts` — **21 cells** (+6 CP-8: required ×2, help ×2, slot-preferred ×2).
- `mosaic.libraries.yml` — **BUMP-LIBS 1.0.83 → 1.0.84**; `js/dist/{builder,frontend-editor}.js` rebuilt
  (renderer untouched → owned shasums verbatim).

## Oracle-change line
**0 owned-panel Vitest oracle changes.** No owned or fixture component declares a required prop or a help
override, so the required marker + the help sentinel are no-ops on every existing fixture (the marker/help
apply only to a field that IS required / has help). Both **page shasums are verbatim** (the rail changes are
authoring-side; node 780's front-end render is untouched).

## Knob coverage table — 13/14 applied

| knob | applied | cell / obstacle |
|---|---|---|
| widget kind | ✅ (CP-6) | Vitest ×6 |
| hidden | ✅ (CP-5) | Vitest ×2 |
| label | ✅ (CP-5) | Vitest ×2 |
| slot allowed children | ✅ | adapter:864 |
| slot repeater child/min/max | ✅ | adapter:868 |
| previews on/off | ✅ | adapter:660 + previewDefaults.test |
| capabilities → section gating | ✅ (CP-7) | Kernel AuthoringResolverTest + client:705 |
| default value | ✅ (CP-7) | toConfig defaultProps + Kernel |
| rail order | ✅ (CP-7) | Vitest ×2 |
| slot open cell | ✅ (CP-7) | Vitest ×2 |
| **required marker** | ✅ (CP-8) | Vitest ×2 (markRequired) |
| **help text** | ✅ (CP-8) | Vitest ×2 (sentinel + splitHelp) + MosaicFieldLabel override |
| **slot preferred** | ✅ (CP-8) | Vitest ×2 (preferred first in allow) |
| patterns shown | ❌ | **architectural blocker** — patterns are library-grouped (`MosaicPatternManifest` has no component link), `patterns_shown` is per-component and NOT exposed to the client, and the per-component → global-palette filter semantics are ambiguous (which component's list filters the page-wide palette?). Needs a PHP exposure of an aggregated list + a PaletteCard filter + a semantic ruling on the aggregation |

**Applied 13/14.** Remaining: patterns-shown only.

## Gate (FULL, in DDEV)

| Check | Result |
|---|---|
| TypeScript typecheck | clean |
| Vitest | **752 pass / 1 pre-existing** (B-101; +6 CP-8 cells) |
| PHPUnit **Unit** | **2832 / 0** (no PHP delta this pass) |
| PHPUnit **Kernel** | **337 / 0** (no PHP delta — unchanged from CP-7; CP-8 is JS-only) |
| PHPUnit **Functional FULL** | **82 / 0** (859 assert, 2 skip) |
| dist | rebuilt, BUMP-LIBS **1.0.83 → 1.0.84** |
| Owned shasums | **VERBATIM** (REGION 14e6cb9c…3954 + STYLE b7756795…ca982 4354 10) |

## Honest status
13/14. Required marker, help (via a real `fieldLabel` wrapper reusing Puck's `FieldLabel`), and slot
preferred land cleanly and byte-identically. Patterns-shown is the one remaining — its blocker is real
(data-model mismatch + unexposed field + ambiguous semantics), recorded above, not hidden. The entity →
manifest link is green in Kernel for all 14; manifest → rail now stands at 13/14.
