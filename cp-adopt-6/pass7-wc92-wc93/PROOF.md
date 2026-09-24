# CP-ADOPT-6R PASS 7 — WC#92 slot-only save + WC#93 picker geometry/keyboard

## Oracles (BEFORE == AFTER, verbatim)
REGION 14e6cb9c17dc61b90a86dd97d8957ae462d789ff854d3523ae581010a43e0dec 3954 (both)

## WC#92 — mechanism (headed, node/993) then the real cause
The per-zone picker inserts land CORRECTLY NESTED on a multi-component page, and BOTH pass the
server validator — so the picker is NOT the bug:
```
CASE-A teaser "Add to Content" → Plain content
  olivero:teaser(9ecbc5c7).content = [plain(e27d0a05), plain(2da0b503←new)]   nested
  mosaic_region(e75821ed).items    = [columns, teaser]                        UNCHANGED
  slotOnlyPlacementErrors ⇒ []
CASE-B "Add to Column 2" → mosaic_button
  mosaic_columns(c9a5f65a).column_2 = [button(0a2bbddf←new)]                  nested
  mosaic_region.items               = [columns, teaser]                       UNCHANGED
  slotOnlyPlacementErrors ⇒ []
```
THE CAUSE: `MosaicPropValidator::slotOnlyPlacementErrors()` walked EVERY slot of the root. On a
multi-component page the root is the structural `mosaic_region` (its slots ARE the page canvas), so
Plain content inside a real component is a grandchild → allowed. But a LONE adopted component is its
own root (fromPuck's single-item-root rule); walking all its slots wrongly counted the teaser's own
`content` slot as "top level" and rejected the Plain content inside it. node/993 (columns+teaser)
can't reproduce it; a lone teaser can.
```
root = mosaic_region  → canvas = region + region.slots.*          ✓
root = olivero:teaser → OLD canvas = teaser + teaser.slots.*  ✗   NEW canvas = {teaser} only  ✓
```

## WC#92 — the fix (ONE shared rule; author-grade message)
Rule (server validator + client picker catalog): a slot-only component (Plain content) may live
inside ANY real component's slot — owned or adopted — refused ONLY at the true page root.
- Server `slotOnlyPlacementErrors`: canvas = root node + (only if root is `mosaic_region`) its slot
  children. A component-root's own slots are allowed. Message: **"Plain content can only be placed
  inside another component's area, not directly on the page."**
- Client `MosaicSlotZone.slotAcceptsPlainContent` + both `MosaicSlotZone` sites now `offerPlainContent`
  → Plain content offered in every component slot (owned Columns too), dropped from a constrained
  allow-list slot; the root drawer still excludes it.

Proof: Kernel `SlotOnlyPlacementTest` (9 cells incl. lone-root saves, owned saves, adopted saves,
canvas rejected, slot-only-as-root rejected, save-path presave migrate→validateFull throws with the
author-grade message on a canvas drop). Vitest: owned free-content slot offers Plain content first;
constrained slot excludes it even with the flag on.

## WC#93 — picker list geometry + keyboard
Fix (`MosaicZonePicker`): anchor below the "+"; flip above when room below < 240px; max-height 60vh
(bounded by room) with internal scroll; `box-sizing: border-box` so the cap includes padding+border;
Esc closes + refocuses the "+"; outside-click closes; no layout shift (still portaled out of canvas).

Headed film (800px window) — PASS:
```
chosen "+" rect.top = 431          (viewport h = 800)
listbox: top 452 · h 344 · bottom 796  → fullyVisible = TRUE
listbox style: position:fixed · maxHeight:343.641px · overflowY:auto · top:450.359px
after Esc: listbox count = 0
```
The pre-fix film caught a real ~6px overflow (bottom 806 > 800): max-height bounds the content box,
so padding+border spilled past. box-sizing:border-box → box 354→344, bottom 806→796.
Screenshots: `1-list-open-short-window.png`, `2-after-esc-closed.png`.
Vitest: flip-above (short window), anchor-below (room), outside-click closes, Esc refocuses the "+".

## Ledger — Arun's words
- WC#92: "save rejected 'mosaic_plain_content … slot-only … top level'" → FIXED.
- WC#93: "picker list geometry + keyboard" → FIXED. Keyboard picker NOT configurable (WCAG) — recorded.
- Tally 93.

## Gates
Kernel+Unit 3057/0 (8559 assertions; +6 cells; 1 pre-existing warning + 7 D11.3 deprecations) ·
Vitest 647/1 (B-101, pre-existing) · tsc clean · phpcs 0 errors ·
phpstan MosaicPropValidator 0 errors · oracles IDENTICAL · dist 1.0.62→1.0.63 (builder
`a9cf2a9c→03d1afea`, frontend-editor `93103f23→43e9d9c6`, renderer `9c7f9320` byte-identical;
served==built). Ship count 63 (rider work; not a git ship). WC#86 capture-listener debt open for the
1.1 Puck-extension review.
