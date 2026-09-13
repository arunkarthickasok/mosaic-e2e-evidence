# REPORT — W8 (F-103 OPTION A: canvas edit-mode inert contract)

**Charter:** W8 — implement F-103 Option A (ratified R-55) into frozen ship #34.
**Status:** COMPLETE — carousel + live_search now honor `data-mosaic-preview`;
RED→GREEN Vitest (7/7) + live e2e both directions (3/3); renderer rebuilt; gates green.
**Rulings ledgered first:** R-55 (Option A; B/C rejected), R-56 (#56 closed non-defect;
per-slide style → CP-CAROUSEL-GEOMETRY, queued first after ceremony).

---

## W8a — WITNESS (current paths, file:line)
- **carousel** `mosaic-carousel.ts`: `connectedCallback` (152) → `if (this.autoAdvance)
  this._startTimer()`; `_startTimer` (162) → `setInterval` auto-advance. **No**
  `data-mosaic-preview` handling; arrows/dots always live.
- **live_search** `mosaic-live-search.ts`: `_onInput` (89) → `setTimeout(300)` →
  `_fetch` (98) → `fetch(endpoint+query)`. **No** edit-mode handling.
- **tabs** (precedent to generalize) `mosaic-tabs.ts:57`:
  `:host([data-mosaic-preview]) button[role="tab"] { pointer-events: none; }` — CSS-only
  contract; MosaicRenderer stamps `data-mosaic-preview="canvas"` (`MosaicRenderer.php:449`).

## W8b — FIX (renderer only)
Shared `editMode.ts` centralises the contract (`CANVAS_PREVIEW_ATTR`, `isCanvasPreview`).
Both components add a reactive `preview` Boolean prop bound to `data-mosaic-preview`.
- **carousel:** `connectedCallback` → `if (this.autoAdvance && !this.preview)`;
  `_startTimer` → `if (this.preview) return`; `updated()` → clears a running timer when
  preview is set; CSS `:host([data-mosaic-preview]) .car-btn, .car-dot { pointer-events:
  none }`. **Panel-sync untouched** (drives via the reactive `active` prop + `.car-track`
  transform, which the inerting does not touch).
- **live_search:** `_onInput` + `_fetch` early-return when preview (zero network);
  input `?disabled=${this.preview}`.

### RED→GREEN — Vitest `editModeInert.test.ts` (7/7)
Guards driven directly (the DSD-reuse `createRenderRoot` is not jsdom-mountable — proven
live instead). Pre-fix, the two canvas cells FAIL (timer runs / fetch fires):
- carousel: auto-advances when !preview; **never** when preview (no `_timer`); a running
  timer STOPS when preview is set (`updated`); panel-sync still drives `active` in preview;
  CSS carries the arrow+dot `pointer-events:none` rule.
- live_search: fetches when !preview; **zero** fetches when preview.

## W8c — PROVE LIVE both ways (`f103-edit-mode-inert.spec.ts`, node 945, auto_advance=ON)
- **VISITOR** `/node/945`: `data-mosaic-preview` = null; track `translateX 0% → −200%`
  over 1.6s → **still auto-advances for visitors**. Frame `f103-01-visitor-autoadvances.png`.
- **FE dialog canvas**: `data-mosaic-preview="canvas"`; `.car-btn` computed
  `pointer-events: none` (**arrows dead**); track `0% → 0%` over 2.5s (**no auto-scroll
  under the author**). Frame `f103-02-fe-canvas-inert.png`.
- **Panel-sync intact**: expanding slide row 2 → canvas shows slide index 1 (geometry
  oracle). Frame `f103-03-fe-canvas-panelsync.png`.
All 3 @journey tests passed (real pointer).

## W8d — dist + gates
- **dist:** `js/dist/renderer.js` rebuilt (37.25 → 39.23 kB). **Builder bundle untouched**
  — change is renderer-only (`js/src/renderer/components/`); the canvas loads
  `mosaic/renderer`, not a builder-bundled copy.
- **Vitest:** 503 passed / 1 failed = pre-existing **B-101** (MosaicPuckAdapter bool→radio
  oracle drift; unrelated).
- **e2e:** carousel slider-geometry + sync + fe + lifecycle + lock + f066 + F-094 scroll
  = **7/7** green post-rebuild (F-103 did not regress the sync journeys — they expand rows,
  not click arrows).
- **PHP:** no PHP changed this charter → suite unaffected (W6 #56 guards remain 10/10).
- Typecheck: only the pre-existing `dsdShadow.ts` TS2430 error; my files clean.

## Files
- New (tracked): `js/src/renderer/components/editMode.ts`;
  `js/src/renderer/components/__tests__/editModeInert.test.ts`.
- Modified (tracked): `js/src/renderer/components/mosaic-carousel.ts`;
  `js/src/renderer/components/mosaic-live-search.ts`; `js/dist/renderer.js`.
- Evidence-only (gitignored): `js/e2e/journeys/f103-edit-mode-inert.spec.ts`.
- Ledger: `ledger-live/SHIP-34.md` (F-103 section), `ledger-live/TODO.md` (R-55/R-56 +
  CP-CAROUSEL-GEOMETRY + F-103 resolution), album `e2e-evidence/ship34-carousel/f103-0{1,2,3}`.

Ship #34 remains ONE uncommitted change set for Arun's ceremony (mosaic git read-only here).
