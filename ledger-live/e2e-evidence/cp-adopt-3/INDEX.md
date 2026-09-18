# CP-ADOPT-3 evidence album — slot drop-zone enforcement (item 4)

Filmed 2026-09-17 against DDEV, real admin auth, `--project=journeys`, no sleeps. Element clips only (the
full-page Puck canvas is unstable to screenshot — cp-adopt-1 precedent), so each frame is a real element
screenshot of the live builder. Journey: `js/e2e/journeys/cp-adopt-3.spec.ts` (gitignored `js/e2e/`; the frames
are the artifact). Scratch fixture node **987** (a `mosaic_columns` with `column_1` EMPTY, `column_2` filled).

| Frame | Screen | Shows |
|---|---|---|
| `j1-columns-below-min-banner.png` | node 987 builder — the columns component | the red **"Requires at least 1 item — 0/1"** below-min banner on the empty `column_1`, the dashed empty drop zone, and the italic empty_display text |
| `j2-below-min-banner.png` | crop | the below-min banner alone |
| `j3-empty-display.png` | crop | the empty-state guidance *"Drop a component here — column 1 needs at least one."* |
| `j4-filled-no-banner.png` | node 334 builder — the columns component | `column_1` FILLED (has a heading) → **no banner** (the rule is satisfied) — the after-drop state |
| `geometry.json` | boundingBox data | `col1 {x:415,w:136}` + `col2 {x:567,w:136}` → **non-overlapping** (415+136=551 ≤ 567) |

## What the album proves
- The **below-min banner** (min = 1, from the ruled-exception PHP source on `mosaic_columns.column_1`) renders
  **inside the zone**, live in the builder, on a shipped component (j1/j2).
- The **empty_display** text renders while the zone is empty (j1/j3).
- The **drop zones are laid out side by side, non-overlapping** (geometry.json).
- The banner is **conditional** — a filled `column_1` shows no banner (j4), so it is a live violation signal,
  not a static label. j1 → (Arun drops a component) → j4 is the before/after the walk brackets.

## What is machine-proven (not filmed — drag is the unstable surface)
- **Drop refusal** (`allow`/`disallow`): the adapter emits `allow` on the slot field so Puck refuses a
  non-allowed child natively — asserted in `SlotEnforcement.test.tsx` (the slot field carries `allow`).
- **The live count** clearing the banner on a drop — asserted in `SlotEnforcement.test.tsx` via the real
  `MosaicSlotZone` + MutationObserver.
- **FE dialog parity**: the frontend-editor bundle uses the SAME `MosaicPuckAdapter` + `MosaicSlotZone`, so the
  zone chrome is identical by construction (both surfaces share `toConfig`).
