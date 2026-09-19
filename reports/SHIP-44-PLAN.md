# SHIP #44 PLAN — CP-ADOPT-4 + 4R (adopt any SDC, usable end-to-end)

Fresh-read 75b3039 (ship #43 at HEAD). MOSAIC git READ-ONLY — Arun does the human commit.
**Status: UNBLOCKED.** WC#69 drop PROVEN with real CDP input; WC#66/#67/#68/#70 resolved;
full gates green; byte-identical held.

## What ships

The first component from OUTSIDE Mosaic (Olivero's `teaser`) is authorable end-to-end:
enabled from a library, placed on the canvas with the library's own markup, its slots filled
by real drag-and-drop, an empty required slot refused rather than shipped broken, and the
saved page matches — while owned components stay byte-identical.

## Changes (CP-ADOPT-4 server/client + 4R fixes)

### CP-ADOPT-4 (from earlier passes, uncommitted)
- Hybrid renderer (owned → direct Twig byte-identical; adopted → core component element).
- Palette opens for adopted Ready/Attention of enabled libraries; canvas attaches adopted libs.
- Tier-B SSR canvas render of adopted; `MosaicAdoptedPreview` + inline slot composition.

### CP-ADOPT-4R PASS 1
- `MosaicSlotZone` min hittable box (empty adopted slots were zero-width); slot labels (WC#67).

### CP-ADOPT-4R PASS 2 (this pass)
- `css/builder.css` — `.mosaic-adopted-preview` layout reset + `--min-empty-height` cap (WC#69).
- `js/src/builder/MosaicPuckAdapter.ts` — `.mosaic-adopted-preview` class; `serializeForDirty`
  empty-array strip (WC#66); slot-info empty-state wiring (WC#68).
- `js/src/builder/fields/MosaicSlotInfo.tsx` (new) — WC#68 empty panel.
- `src/Service/MosaicPropValidator.php` — WC#70a required-slot save validation.
- `src/Service/MosaicRenderer.php` — WC#70b empty-required-slot render guard.
- `tests/src/Kernel/Adopt/RequiredSlotTest.php` (new) + `MosaicSlotInfo.test.tsx` (new).
- `js/dist/builder.js` + `frontend-editor.js` rebuilt; `mosaic.libraries.yml` → 1.0.42.

## Gates at ship

- Full Kernel+Unit **2988 / 0** (8065 assertions; 1 warn, 6 deprec, non-fatal).
- Vitest **556 / 1-B101** (pre-existing checkbox drift); +2 MosaicSlotInfo pass.
- PHPCS **0 errors** on changed files. PHPStan L6 **+0** (MosaicRenderer 3 pre-existing).
- **Byte-identical node/780 `14e6cb9c…43e0dec` (3954) — before==after.**
- Dist rebuilt → **BUMP-LIBS 1.0.42**.

## Walk-catch status

| # | Catch | Status |
|---|---|---|
| 66 | dirty on load | FIXED — `dialogFired:false`, WC66-adopted.json |
| 67 | zone order / labels / banner | FIXED — WC67-LABELS.json |
| 68 | empty panel | FIXED — WC68.json + wc68-empty-panel.png |
| 69 | drop into adopted slot | **FIXED + PROVEN (CDP)** — WC69-CDP-PROOF.json |
| 70 | empty required slot | FIXED (a validator + b renderer) — RequiredSlotTest 4/4 |

## After ship #44

SSR-attachments refinement (R5/R10 dynamic-attach adopted) → CP-ADOPT-5..7 → backend config
audit (parallel, read-only) → Wave D/F/G → minimal ACT 2 → soak → tag 1.0.0.
