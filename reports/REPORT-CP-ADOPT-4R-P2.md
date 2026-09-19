# REPORT — CP-ADOPT-4R PASS 2 (walk-catches #66–#70) — 2026-09-19

Fresh work-tree since ship #43 (75b3039). MOSAIC git READ-ONLY (file edits only).
Baseline byte-identical anchor: node/780 region `14e6cb9c…43e0dec` (3954 bytes).
**Ship #44 UNBLOCKED — WC#69 drop is PROVEN with real CDP input.**

PASS 1 shipped a min-box (empty slots were zero-width) but Arun re-tested and the drop
STILL failed. This pass root-caused the drop end-to-end with real CDP input and fixed it,
plus WC#66 (reproduced), WC#68 (built), and the new WC#70.

---

## WC#69 (BLOCKER) — drop into an adopted slot — FIXED + PROVEN (CDP)

### A working real-input harness (the PASS-1 gap)

PASS 1 could not drive Puck 0.21's new dnd-kit with Playwright's synthetic pointer. This
pass switched to **CDP `Input.dispatchMouseEvent`** (real browser input) and calibrated it
on the OWNED columns control — it LANDS (`CDP-columns.json`: `before:0 → after:1`). Keys:
- a TALL viewport (1600×2200) so the palette item AND the target zone are both on-screen
  (the item was scrolling off — no press, no drag, empty `MDBG` logs);
- the PointerSensor `{delay:200ms, distance:5px}` activation (hold-still 260 ms, then move);
- LIVE re-measure of the target zone mid-drag (Puck grows empty zones during a drag).

### Three stacked root causes (each necessary), proven with instrumented Puck

1. **Zero-width slots (PASS-1 min-box).** Empty adopted slots rendered at width 0; Puck's
   `getPointerCollisions` contracts every dropzone box by `BUFFER=6`px (chunk-YXFTA2VL.mjs
   :3233-3244), so a 0-width zone is never a candidate. Fixed in PASS 1 (`MosaicSlotZone`
   min box). Necessary but not sufficient.

2. **Library CSS collapses + overlaps the zones.** The Olivero teaser's own layout CSS
   (`teaser__image { position:absolute }`, flex/grid) OVERLAPPED the slot zones on the
   canvas (`EFP.json`: at the image centre `elementsFromPoint` returns `teaser-a4:title`
   stacked ON TOP of `teaser-a4:image`) and pushed the slots OUTSIDE the component box
   (`MDBG` component box `[536,690,824,1206]` while slots sat at y≈1113-1309). Instrumented
   `findDeepestCandidate` proved the inner slot dropzone was NEVER a candidate — the drop
   resolved to `component teaser-a4 → zone root:default-zone` instead. **Fix:** a canvas-only
   layout reset scoped to `.mosaic-adopted-preview` (builder.css) forces the adopted subtree
   into normal block flow. `GEO.json` after: all five zones clean, non-overlapping, in-box.

3. **Reflow during drag.** Even with a clean layout the drop resolved to a SIBLING zone
   (`meta` for an `image` drag): a teaser has FIVE empty slots stacked vertically, and Puck
   reserves `--min-empty-height:128px` on each during a drag, so the stack grew ~640px and
   shoved the target out from under the pointer. **Fix:** cap `--min-empty-height` (and the
   empty-slot min-box) to 32px inside `.mosaic-adopted-preview` so the stack stays compact.

### PROOF — real CDP drop, before/after DOM, saved slot (`WC69-CDP-PROOF.json`)

- **image slot (was empty):**
  - before: `<div ... data-puck-dropzone="teaser-a4:image" ...></div>` (empty)
  - after: `<div ... _DropZone--hasChildren ...><div ... data-puck-component="mosaic…">`
  - **saved layout `nodes["teaser-a4"].slots.image = ["mosaic_divider-…"]`**
- **content slot (had head-a4):**
  - before: 1 child → after: 2 children
  - **saved `nodes["teaser-a4"].slots.content = ["mosaic_heading-…", "head-a4"]`**
- Each landed in the CORRECT slot (enabled zone == target); owned columns control still
  lands (`CDP-columns.json`). Regression re-run after WC#66/68 changes: still lands.

---

## WC#66 — dirty on load — REPRODUCED + FIXED

- **Reproduced** (`WC66-adopted.json`): a pristine `/node/988/edit` fires the beforeunload
  "Leave site?" on a View click (`dialogFired:true`); owned node/987 does not
  (`WC66-owned.json`, `dialogFired:false`).
- **Mechanism:** Puck declares every SDC slot as a `{type:'slot'}` field and, on its
  mount-fire onChange, seeds each EMPTY slot with `props[slot] = []`. The loaded field shows
  `"props":{"title":[],"prefix":[],"meta":[],"image":[]}` — absent from the server baseline,
  so `serializeForDirty(baseline) ≠ serializeForDirty(current)` → dirty.
- **Fix:** `serializeForDirty` (the dirty comparison ONLY — the SAVE path keeps F-089's
  "leave empty arrays in props" untouched) normalises out empty-array props from BOTH sides,
  so an untouched adopted component is not dirty. A real edit (a non-empty array) is
  unaffected. **After:** `dialogFired:false`.

## WC#67 — labels / order / banner — FIXED (PASS 1, confirmed)

`WC67-LABELS.json`: each zone binds its slot id + shows its label in twig order; the min
banner lands on the ruled zone.

## WC#68 — empty panel — BUILT

A props-less adopted component (only the excluded `attributes`) now shows an empty-state
naming what it is — built from its slots — with the slot list + required marker
(`MosaicSlotInfo.tsx`). `WC68.json`: lead "No fields — this component is built from its
slots…", items `Content(required), Image, Meta, Prefix, Title content`. Screenshot
`wc68-empty-panel.png`. Vitest `MosaicSlotInfo.test.tsx` 2/2.

## WC#70 — empty required slot — VALIDATOR + RENDERER (Arun rulings a + b)

- **(a) save-time validator** (`MosaicPropValidator::validateNode`, runs via `validateFull`
  → the entity constraint + all save controllers + presave hook): an empty SDC-`required`
  slot is refused, the message NAMES the component + slot. **No owned component declares a
  required slot** (verified across `components/` + all submodules), so owned fixtures are
  unaffected — the Columns `column_1 min=1` child-rule is NOT an SDC `required` slot and is
  left to its client-side banner, so no existing fixture breaks.
- **(b) renderer** (`MosaicRenderer::renderNode`): an instance with an empty required slot
  renders NOTHING + logs, so the front end never shows the library's empty shells + broken
  image (Arun's node 989). Byte-identical node/780 unchanged (owned = no required slots).
- Kernel `RequiredSlotTest` 4/4 (reject / pass / render-nothing / render-filled). Full
  Adopt Kernel 28/28 — no fixture breakage.

---

## Gates (FULL)

- **Full Kernel+Unit:** **2988 tests, 0 failures** (8065 assertions; 1 warning, 6 deprec —
  non-fatal). +4 from RequiredSlotTest, no regressions.
- **Vitest:** 556 passed / 1 failed — the 1 is pre-existing **B-101**
  (`MosaicPuckAdapter.test.ts:148` checkbox drift). +2 MosaicSlotInfo cells pass.
- **PHPCS:** 0 errors on the changed files (line-length warnings tolerated module-wide).
- **PHPStan (L6):** the changed files add ZERO — `MosaicRenderer` stays at its 3 pre-existing
  `parameter.phpDocType` errors; `MosaicPropValidator` clean.
- **Byte-identical:** node/780 `14e6cb9c…43e0dec` (3954) — before==after.
- **Dist:** builder.js + frontend-editor.js rebuilt; **BUMP-LIBS 1.0.39 → 1.0.42**.

## Files changed this pass (MOSAIC, uncommitted — Arun commits)

- `js/src/builder/MosaicPuckAdapter.ts` — `.mosaic-adopted-preview` class (WC#69);
  WC#66 empty-array strip in `serializeForDirty`; WC#68 slot-info empty-state.
- `js/src/builder/fields/MosaicSlotInfo.tsx` (new) — WC#68 empty-state.
- `css/builder.css` — WC#69 adopted layout reset + min-empty-height cap.
- `src/Service/MosaicPropValidator.php` — WC#70a required-slot validation.
- `src/Service/MosaicRenderer.php` — WC#70b empty-required-slot render guard.
- `tests/src/Kernel/Adopt/RequiredSlotTest.php` (new) — WC#70 cells.
- `js/src/builder/__tests__/MosaicSlotInfo.test.tsx` (new) — WC#68 cells.
- `js/dist/builder.js` + `js/dist/frontend-editor.js` (rebuilt) · `mosaic.libraries.yml` (1.0.42).

## Honest status line

WC#69 root-caused (3 stacked causes) + FIXED + **PROVEN with real CDP input** (before/after
DOM + saved slot). WC#66 reproduced + fixed; WC#67 confirmed; WC#68 built; WC#70 a+b built +
Kernel-proven. All gates green, byte-identical held. **Ship #44 UNBLOCKED** pending Arun's
walk.
