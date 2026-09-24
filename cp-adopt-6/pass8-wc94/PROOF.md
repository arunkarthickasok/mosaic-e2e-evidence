# WC#94 — picker list stays glued to the "+" on scroll (post-ship #46 walk-catch)

## The bug (Arun)
The per-zone picker list, once open, was **pinned to the viewport** on page scroll — it detached
from its "+". Cause: the list is `position: fixed` at the button's rect computed ONCE at open, so
scrolling moved the "+" while the fixed list stayed put.

## The fix (`MosaicZonePicker.tsx`)
Position is extracted into `computePos()` (reads the button's CURRENT rect). While OPEN, a
`scroll` listener (`capture: true` → catches scroll in ANY ancestor scroll container, not just the
window) + a `resize` listener re-anchor the list to the "+" on every scroll/resize. If the "+"
scrolls entirely out of the viewport, the list CLOSES and focus returns to the "+"
(`focus({ preventScroll: true })` so returning focus never yanks the page back).

## Headed film (node/993, scroll ~140px while open) — PASS
```
pickers: 5
BEFORE scroll: btnBottom=409  listTop=413  gap=4
AFTER  scroll: btnBottom=223  listTop=227  gap=4      gapStable(glued)=TRUE  listMoved=TRUE
```
The "+" moved up 186px (409→223) and the list top tracked it exactly (413→227), holding the gap
constant at 4px. Films: `1-open-before-scroll.png`, `2-after-scroll-glued.png`.

## Vitest (`MosaicZonePicker.test.tsx`, +2 cells)
- re-anchors to the "+" on scroll (list top follows the button's new rect).
- closes when the "+" scrolls out of the viewport; focus returns to the "+".

## Gates
tsc clean · Vitest 649/1 (B-101; +2 WC#94 cells) · oracles REGION 14e6cb9c…3954 + STYLE
b7756795…ca982 4354 10 IDENTICAL before==after · dist 1.0.63→1.0.64 (builder `03d1afea→5845c8db`,
frontend-editor `43e9d9c6→e5d4d604`, renderer `9c7f9320` byte-identical; served==built). Tally 94.
