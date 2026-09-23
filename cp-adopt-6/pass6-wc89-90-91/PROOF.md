# CP-ADOPT-6R PASS 6 — WC#89 · WC#90 · WC#91 + fallback-notice ruling

## Oracles (BEFORE == AFTER, verbatim)
REGION 14e6cb9c17dc61b90a86dd97d8957ae462d789ff854d3523ae581010a43e0dec 3954 (both)
STYLE  b7756795ff2234b5793c3533f48c3a70b34c37989b946756f20b78aa9aaca982 4354 10 (both)
(node/780's render path is untouched — WC#89 fires only for MISSING components; the picker is admin-only.)

## WC#89 — fallback slot order (FIXED)
The WC#85 fix used the DESCRIPTOR key order, which is NOT the template order:
```
DESCRIPTOR slots order (WC#85 used this):  content, image, meta, prefix, title
ENABLED template render marker order:      prefix, meta, image, title, content
```
So WC#85 rendered `content` FIRST; the teaser template renders it LAST. FIX (`MosaicRenderer`):
`slotRenderOrder($type)` derives the true order once from the SDC's own marker render
(`renderSingleComponent` emits a `data-mosaic-slot` marker per slot in template order and renders the SDC
directly, independent of Mosaic governance), cached per request; a genuinely-gone plugin keeps descriptor
order. Kernel `testFallbackRendersSlotsInTemplateOrder`: teaser STORED content-first → fallback renders
prefix … image … content (content LAST), matching the template.

## Fallback-notice ruling (implemented)
Anonymous → a visually-hidden note (their content shows; no scary chrome). Users with `mosaic.use_builder`
→ a VISIBLE `<div class="mosaic-fallback__notice" role="status">This component's library is unavailable;
showing its content.</div>`. Permission-gated → the fallback render is keyed by edit access
(`$cid . ':fb-edit|anon'`) and carries the `user.permissions` cache context. Kernel
`testFallbackNoticeIsPermissionGated`. (Keyboard picker is NOT configurable — WCAG — recorded.)

## WC#90 — picker list under the selection overlay (FIXED)
The list was rendered inside the picker wrapper (inside Puck's DropZone/selection overlay stacking). FIX
(`MosaicZonePicker`): the list is **portaled to `document.body`** with `position: fixed` at the button's
viewport rect and `z-index: 2147483000` — above every Puck overlay. The WC#86 document-capture hit-testing
already works on the portaled list (rect-based, in viewport coords). PROOF (headed, node/993): at the first
option's centre `elementFromPoint` returns `{role: "option", isOption: true}` — the list is fully above the
blue overlay.

## WC#91 — canvas top eaten after inserting from a bottom "+ Add" (FIXED)
Because the list is now portaled OUT of the canvas DOM, opening/closing it cannot change the canvas height
or scroll. PROOF (headed, node/993, insert from the LAST "+ Add"):
```
top zone boundingBox.top  before open:  -219
top zone boundingBox.top  after insert: -219   (topUnchanged: true)
layout JSON nodes:        4 → 5              (the insert still lands — WC#88 intact)
```
No layout jump; the top zone stays put.

## Vitest
`MosaicZonePicker` (8, incl. the portal cell: the open list is a child of document.body, NOT the canvas
subtree), `MosaicSlotZonePicker` (4), `MosaicPickerCatalog` (5), `WC88InsertIntoSlot` (4).

## Gates
tsc clean; Vitest 643/1 (B-101); Kernel+Unit (full run); phpcs clean; phpstan MosaicRenderer 4 (all
pre-existing — the redundant `!== []` I introduced was removed); oracles IDENTICAL. dist 1.0.61 → 1.0.62
(builder 2deffd63→a9cf2a9c, frontend-editor 7f56106d→93103f23, renderer byte-identical; served==built).
Ship count 63.
