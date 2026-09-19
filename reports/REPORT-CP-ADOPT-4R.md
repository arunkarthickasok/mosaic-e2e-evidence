# REPORT — CP-ADOPT-4R (walk-catches #66–#69) — 2026-09-18

Fresh work-tree since ship #43 (75b3039). MOSAIC git READ-ONLY (file edits only).
Baseline byte-identical anchor: node/780 region `14e6cb9c…43e0dec` (3954 bytes).
Ship #44 status at end of pass: **BLOCKED** (WC#69 drop-commit UNPROVEN per DROP-PROOF LAW).

MECHANISM-FIRST law honoured: every claim below is either a filmed measurement or a
quoted line of Puck's own source — NOT a guess.

---

## WC#69 (BLOCKER) — drop into an adopted slot fails

### Investigation path (honest, with the reds)

1. **First "witness" was inconclusive.** `dragTo`/manual drags into `teaser-a4:content`
   showed `before==after`, no SSR (`WC69-PROOF.json`, `WC69-EMPTY.json`). I initially
   read this as "adopted drop broken".

2. **Calibration exposed a confound.** `dragTo` into the OWNED columns `column_1`
   landed **once** (`afterDragTo:1`) but was **not reproducible** — a later run of the
   same test returned `afterDragTo:0` (`CALIB.json`). So my drag harness was **flaky for
   Puck's dnd-kit**, and the "adopted fails" reading was not trustworthy.

3. **Position-controlled control killed the composition theories.** On the SAME node 988,
   dropping into the OWNED `root:default-zone` ALSO failed (`CONTROL.json`:
   `before:2, after:2, landed:false`). Owned and adopted both failed via synthetic
   pointer → the harness, not the component, was the variable.

4. Ruled out, each with a rebuild + re-test (all still failed — confound, not signal):
   - the `MosaicAdoptedPreview` html→react composition (rendered the adopted slots via the
     EXACT owned inline scaffold — still no land);
   - the Tier-B `resolveData` (disabled it for adopted-with-slots — still no land);
   - DOM-identity churn (memoised the parsed tree — still no land).

### Root cause — proven at Puck's source, not by a drag

`@puckeditor/core` 0.21.3, `chunk-YXFTA2VL.mjs:3207-3244` — `getPointerCollisions`
contracts every candidate dropzone box by `BUFFER = 6` px on each side before it will
count the pointer as inside:

```js
var BUFFER = 6;
const contractedBox = { left: box.left+BUFFER, right: box.right-BUFFER,
                        top: box.top+BUFFER, bottom: box.bottom-BUFFER };
if (position.frame.x < contractedBox.left || position.frame.x > contractedBox.right ||
    position.frame.y > contractedBox.bottom || position.frame.y < contractedBox.top) {
  continue;   // candidate skipped
}
```

A **zero-width** zone has `contractedBox.left (box.left+6) > contractedBox.right
(box.left-6)` — the pointer can **never** satisfy the test, so the zone is **never** a
drop candidate → never the deepest zone → never `isEnabled` → the droppable is
`disabled: !isDropEnabled` (`:5170`) → **structurally impossible to drop into.**

**Filmed measurement of the cause** — the empty adopted slot rendered at ZERO width:
`PRECISE.json` (pre-fix) `teaser-a4:image` → `zoneBox {x:415, width:0, height:128}`.
The library's own layout CSS (Olivero `.teaser__image`) is not present on the canvas, and
`MosaicSlotZone` did not enforce its own width, so the slot collapsed. Owned scaffolds
never collapse — their grid/flex parent supplies width.

### Fix (applied, filmed)

`js/src/builder/fields/MosaicSlotZone.tsx` — while a slot is empty, the zone body now
renders a guaranteed hittable box (`minWidth:96px, minHeight:48px`, dashed outline)
**independent of the library's absent CSS**.

**Filmed after fix** — all five adopted teaser slots now clear the BUFFER gate
(`RECTS.json`): `content 288×33 ✓ · image 96×128 ✓ · meta 288×128 ✓ · prefix 288×128 ✓
· title 96×128 ✓` (each `passesBuffer:true`, i.e. width>12 AND height>12).
Before→after on the empty image slot: **w 0 → 96**.
Screenshot `adopted-slots-hittable.png`.

### Why the actual drop-COMMIT is still UNPROVEN (honest, blocks the ship)

A committed real-pointer drop could **not** be filmed in this environment:

- Puck registers **only** `PointerSensor` — **no KeyboardSensor** (`chunk-YXFTA2VL.mjs:402,
  417-432`). **DROP-PROOF LAW option 2 (keyboard-move) is not available in Puck 0.21.**
- The PointerSensor activation is `{ delay:{value:200,tolerance:10}, distance:{value:5} }`
  (`:405-408`). With a 200 ms still-hold + activation move, the drag **does** start —
  `HARNESS-columns.json`: `midDrag.dragging:true`, and the pointer reaches the target
  (`atTarget.hoveringZones` includes `cols-a3:column_1`).
- BUT zone resolution runs through `createNestedDroppablePlugin` on
  `document.elementsFromPoint` + a **debounced** collision observer with a `setTimeout(…,50)`
  `forceUpdate` (`:3325, 3559-3561`). Under Playwright's synthetic pointer **no zone ever
  becomes `isEnabled`** — `HARNESS-columns.json`: `enabledZones:[]` at every sample, for the
  OWNED columns control. Without an enabled (deepest) zone the drop is `disabled` and cannot
  commit — for owned OR adopted alike.

Conclusion: the flakiness is in **driving Puck 0.21's new dnd-kit from a synthetic pointer**,
not in the adopted component. I cannot film a committed drop for **any** zone here.
Per the DROP-PROOF LAW an unfilmable drop is **UNPROVEN** → **ship #44 stays BLOCKED**
pending Arun's manual eye-test of the min-box fix (which removes the proven zero-width
cause).

---

## WC#67 — zone order / labels / banner — FIXED + filmed

- Slots now render **inline in document order** (no portals) via `htmlToReactSlots.tsx`.
- Each zone binds to its own slot id and shows its label — `WC67-LABELS.json`:
  `prefix→"Prefix", meta→"Meta", image→"Image", title→"Title content", content→"Content"`,
  in the teaser's twig order.
- Because each `MosaicSlotZone` receives its **own** descriptor, the "requires at least 1"
  banner renders inside the ruled zone (`content`, `required`) — not the last zone.

---

## WC#66 — dirty on load — NOT reproduced this pass (honest)

Witness `WC66-68.json`: on a pristine load of node 988 the layout textarea is **stable**
(`initialLen==settledLen==362`, `changedOnLoad:false`). `serializeForDirty`
(`MosaicPuckAdapter.ts:1320`) already strips `TIER_B_PREVIEW_KEYS` so the SSR-preview apply
does not read as an edit. I could **not** reproduce the dirty-on-load headlessly and will
**not** ship a fix for a mechanism I have not witnessed (MECHANISM-FIRST law). Needs Arun's
exact repro (component + steps). **Open.**

Data smell ledgered: the stored layout keeps the teaser's `title` **slot** as a
`props.title` array (`initialHead` shows `"props":{"title":[…`) — an adopted slot leaking
into props; candidate contributor to a normalisation-dirty and worth a dedicated fix.

## WC#68 — empty panel — witnessed, fix scoped, NOT built this pass (honest)

Witness `WC66-68.json`: selecting the props-less teaser shows a panel with `fieldCount:10`
— only the unconditional meta controls (breakpoint / Data Sources / Padding / Spacing …),
no component field, so it reads as "nothing to edit". Fix = an empty-state ("No fields —
this component is built from its slots" + the slot list) gated on "no authorable prop/slot
field". Scoped, not built this pass. **Open.**

---

## Gates (this pass — JS-only source changes)

- **Vitest:** 554 passed / 1 failed — the 1 is the pre-existing **B-101**
  (`MosaicPuckAdapter.test.tsx:148` checkbox drift), always expected. Field specs 27/27.
- **PHPCS:** **0 errors** (2 pre-existing warnings in mosaic_intelligence + mosaic_tokens,
  files untouched this pass).
- **PHPStan (L6):** 39 errors — all the systemic `dependencySerializationTraitProperty`
  (private/readonly DI props) pattern across 9 files + a few misc; **JS-only pass adds
  ZERO**.
- **Adopt Kernel:** 24/24 (1 deprecation, 0 failures).
- **Full Kernel+Unit:** **2984 tests, 0 failures** (8028 assertions; 1 warning, 6
  deprecations — all non-fatal).
- **Byte-identical:** node/780 region `14e6cb9c…43e0dec` (3954 bytes) — **before==after**
  (canvas-only JS changes never touch the frontend render).
- **Dist:** builder.js rebuilt; **BUMP-LIBS 1.0.32 → 1.0.39**.

## Files changed this pass (MOSAIC, uncommitted — Arun commits)

- `js/src/builder/fields/MosaicSlotZone.tsx` — WC#69 min hittable box; WC#67 label chip.
- `js/src/builder/fields/MosaicAdoptedPreview.tsx` — inline (no portals) + memoised tree.
- `js/src/builder/fields/htmlToReactSlots.tsx` — SSR-html → React with inline slots.
- `js/src/builder/MosaicPuckAdapter.ts` — buildAdoptedRenderer via MosaicAdoptedPreview
  (diagnostics reverted).
- `js/dist/builder.js` (rebuilt) · `mosaic.libraries.yml` (1.0.39).

## Honest status line

WC#69 root-caused at source + the proven zero-width cause fixed + rect-filmed; the
drop-COMMIT is UNPROVEN headlessly (Puck 0.21 dnd-kit not actuable by synthetic pointer;
no keyboard path) → **ship #44 BLOCKED** pending Arun's manual re-test. WC#67 FIXED+filmed.
WC#66 not reproduced (open). WC#68 witnessed, fix scoped (open).
