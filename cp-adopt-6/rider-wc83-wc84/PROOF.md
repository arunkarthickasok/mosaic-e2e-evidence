# CP-ADOPT-6R RIDER — WC#83 + WC#84 — PROOF

## Oracles (BEFORE == AFTER, verbatim)
REGION 14e6cb9c17dc61b90a86dd97d8957ae462d789ff854d3523ae581010a43e0dec 3954 (both)
STYLE  b7756795ff2234b5793c3533f48c3a70b34c37989b946756f20b78aa9aaca982 4354 10 (both)

## WC#83 — binding lost in the card/fallback
(a) MECHANISM: renderFallback iterated only $instance->slots (static children), NEVER
$instance->slotsBinding/renderBoundSlot -> a bound slot's View rows vanished when the
library went off. SAVED-LAYOUT DIFF: pure toPuck->fromPuck keeps slots_binding
byte-identical (after === before, not undefined) -> NO client save-strip; render-only loss.
(b) FIX: renderFallback iterates union(static,bound) + renderBoundSlot (bare) + note
(Kernel FallbackRenderTest bound-slot cell). Missing card shows "{Slot} — bound to {View}".
defaultProps carry _mosaic_slot_binding so Puck live-runtime can't prune. Round-trip Vitest.

## WC#84 — "+" did nothing on click
(a) MECHANISM: picker <button> had onClick but NO onPointerDown/onMouseDown stopPropagation;
dnd-kit's pointer sensor on the ancestor draggable captured the real pointerdown and
suppressed the click. jsdom userEvent.click bypasses the pointer->drag sequence, so
keyboard/unit tests passed while a real mouse click failed.
(b) FIX: stopPropagation on +/list pointerdown+mousedown -> native click fires. ONE
affordance per zone (compact header "+" when children; roomy "+ Add" when empty). Owned
Columns same. Vitest 11 incl. the pointerdown-doesn't-bubble cell.

## Gates
Vitest 632/1-B101; tsc clean; phpcs surface clean; phpstan renderFallback 0 new.
libs 1.0.57->1.0.58 (builder 2746840f->0b6cb0e8, frontend-editor 55f30bcf->a772c8f8,
renderer 9c7f9320 byte-identical). Ship #46 -> 60 files. Click film + fallback film = walk.
