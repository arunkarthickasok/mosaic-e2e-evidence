# CP-ADOPT-6R PASS 3 — WC#87 (fixed) · WC#86 (UNPROVEN, mechanism proven)

## Oracles (BEFORE == AFTER, verbatim)
REGION 14e6cb9c17dc61b90a86dd97d8957ae462d789ff854d3523ae581010a43e0dec 3954 (both)
STYLE  b7756795ff2234b5793c3533f48c3a70b34c37989b946756f20b78aa9aaca982 4354 10 (both)

## WC#87 — picker list (FIXED)
`mosaicPickerCatalog.ts` publishes the authorable-component catalog (set once by `toConfig`, ordered
owned-first then grouped by library, slot_only excluded). `MosaicSlotZone.buildPickerOptions`: a slot
WITH an allowed list offers Plain content (foreign) + that set; a free-content slot (no allowed list)
offers Plain content (foreign) + EVERY authorable component. This makes the picker APPEAR on owned
free-content zones too. Vitest `MosaicPickerCatalog` (5) + the picker suite (16 total). The headed probe
on node/993/edit confirmed the picker now renders (`pickerButtons: 1`) where before there was none.
dist 1.0.58 → 1.0.59 (builder 0b6cb0e8→5ce2823a, frontend-editor a772c8f8→facb3ff2, renderer
byte-identical); served==built confirmed (deterministic rebuild).

## WC#86 — real mouse click still dead — UNPROVEN (mechanism PROVEN this time)
Real-conditions headed probe on **node/993/edit** (an olivero:teaser page, via `drush uli`, Playwright
trusted events + CDP). Layout excerpt: `…"type":"olivero:teaser","props":{"title":[],"prefix":[],…`.

PROVEN PRIMARY CAUSE — `elementsFromPoint` at the "+" button's own centre (with the button's `click`
listener bound per `getEventListeners`) returned, top-to-bottom:
```
div ("")            pointer-events:auto   isBtn:false
div _DropZone--isRootZone …  (isHitbox:true)   ← Puck's absolutely-positioned drop overlay
div _PuckPreview-frame …
div _PuckPreview …
div mosaic-canvas-scope …
```
The button is **not in the top 5 at its own centre** — Puck's `_DropZone--isRootZone` overlay
(`@puckeditor/core/dist/index.css`) paints above the statically-positioned picker, so a real click lands
on the overlay, never the button. This is exactly why WC#84's `stopPropagation` on the button did nothing
(the button never receives the event). (`wc86-button-under-dropzone-overlay.png`.)

SECOND CAUSE (blocks a simple fix) — a z-index lift raised the picker wrapper above the overlay
(verified: top element became `div.mosaic-zone-picker`), but the picker STILL did not open, and a
**native `el.click()` on the button never flips `aria-expanded`** (false at t0/t50/t350) — the onClick's
`setOpen` has no effect. Combined with `getEventListeners` showing a **direct** `click` listener on the
button (not React 17+ delegation) and the teaser rendering with **`data-mosaic-foreign: 0`**, this points
to the picker button living in the SSR-injected preview DOM where it is **not wired to React's live event
system**. (`wc86-still-closed-after-click.png`.)

Because the real click **still cannot open the picker**, per the charter WC#86 is **UNPROVEN** — and no
partial fix ships (the evidenced z-index lift was reverted; it does not, alone, open the picker). Cause
named; the fix must re-wire the picker into the live React tree of the adopted preview (the DsdPreview vs
MosaicAdoptedPreview render path) AND clear the overlay — the next pass's work.

## Gates
tsc clean; Vitest 637/1 (B-101; +WC#87 5 cells); Kernel unchanged (no PHP this pass — 3050/0 from PASS 2);
phpcs/phpstan unaffected. Oracles identical. Ship #46 stays BLOCKED on WC#86 (UNPROVEN).
