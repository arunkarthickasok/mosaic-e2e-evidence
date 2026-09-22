# CP-ADOPT-6R PASS 4 — WC#86 real-click FIXED + PROVEN (headed) · insert-landing flagged

## Oracles (BEFORE == AFTER, verbatim)
REGION 14e6cb9c17dc61b90a86dd97d8957ae462d789ff854d3523ae581010a43e0dec 3954 (both)
STYLE  b7756795ff2234b5793c3533f48c3a70b34c37989b946756f20b78aa9aaca982 4354 10 (both)

## The full diagnosis (headed, node/993/edit, drush uli, Playwright trusted events + CDP)
Pass 3 left two hypotheses; PASS 4 nailed the truth:
- The "+" button **HAS a live React fiber** (`__reactFiber$`/`__reactProps$`) — NOT injected HTML. Its
  ancestor chain is `button → div.mosaic-zone-picker → …slot-zone → div.mosaic-columns__col` (an OWNED
  Columns zone that WC#87 made show a picker; `data-mosaic-foreign: false`).
- A native `el.click()` did NOT flip `aria-expanded`, and the button did NOT remount
  (`fiberBefore == fiberAfter`, `sameNode: true`).
- **Invoking the React `onClick` DIRECTLY (`props.onClick(...)`) → `aria-expanded: true`, `listbox: 1`** —
  the handler is perfect. **So the bug is PURELY event DELIVERY:** Puck's DropZone stops the DOM click in
  the CAPTURE phase before it reaches React's delegated onClick, AND Puck's `_DropZone--isRootZone` overlay
  is the hit-target at the "+", so `e.target` is the overlay, not the button.

## The fix (`MosaicZonePicker.tsx`)
1. A **document-level CAPTURE listener** (fires FIRST, before the DropZone's capture handler) detects the
   "+"/option by **COORDINATES** (rect hit-test — immune to the overlay being the event target) and drives
   the picker directly (`setOpen`, `pick`), `stopPropagation` so dnd-kit never starts a drag. Degenerate
   (unlaid-out) rects fall through to the React onClick path, so keyboard + jsdom unit tests are unchanged.
2. A `z-index: 30` on the picker wrapper lifts the "+" above the overlay so `elementsFromPoint` returns the
   button (the visible, hoverable affordance). Scoped to the small "+" box — drops elsewhere still land.

## PROOF (real trusted `page.mouse.click`, node/993 owned Columns zone)
```
elementsFromPoint top-3:  div.mosaic-zone-picker (top)  ·  div  ·  _DropZone--isRootZone (below)
aria-expanded:            "false"  →  "true"
listboxOpen:              1   (14 catalog options; owned zone → owned components first, e.g. "Button")
```
Screenshots: `1-picker-closed.png`, `2-real-click-opened-list.png`. The reported bug ("'+' does nothing
on click") is FIXED — a real mouse click now opens the picker. Keyboard path unchanged (Vitest 16/16).

## Honest flag — the picker INSERT does not land (separate issue)
After the real click opened the list, choosing the first option (`mosaic_button`) did NOT add a component
to the zone (`zoneChildrenBefore=0 → After=0`). So the picker OPENS + is selectable by real mouse (WC#86
fixed), but `insertIntoSlot` (the P6 Puck slot-insert) does not land on this owned Columns zone — a NEW,
separate issue (candidate WC#88), NOT a regression of the click fix. Flagged for the next pass; the click
fix stands on its own.

## Gates
tsc clean; Vitest 637/1 (B-101; picker suite 16/16); Kernel unchanged 3050/0 (no PHP this pass); oracles
IDENTICAL. dist 1.0.59 → 1.0.60 (builder 5ce2823a→0a0ba0ea, frontend-editor facb3ff2→eafb9b82, renderer
byte-identical; served==built). Ship count 62.
