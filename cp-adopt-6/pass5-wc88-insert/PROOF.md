# CP-ADOPT-6R PASS 5 — WC#88 picker insert LANDS (headed proof) — the picker is now whole

## Oracles (BEFORE == AFTER, verbatim)
REGION 14e6cb9c17dc61b90a86dd97d8957ae462d789ff854d3523ae581010a43e0dec 3954 (both)
STYLE  b7756795ff2234b5793c3533f48c3a70b34c37989b946756f20b78aa9aaca982 4354 10 (both)

## Mechanism (headed, node/993/edit)
The charter hypothesised a colon-free zone-id mismatch. It is NOT that — the two ids MATCH:
```
insertIntoSlot computed destinationZone:   mosaic_columns-c9a5f65a-010d-4d6d-92c1-1103723b2ba5:column_2
Puck-registered data-puck-dropzone:        mosaic_columns-c9a5f65a-010d-4d6d-92c1-1103723b2ba5:column_2
```
(Puck node ids are `${colon-free-type}-${uuid}`, so the WC#69 colon-free invariant already keeps zone ids
correct.) The real failure: **Puck's `insert` action does not land in a compound/inline slot** even with
the correct zone (data unchanged, no error). Plus a second bug in the picker: the option-click detection in
the WC#86 document-capture used `elementsFromPoint`, which missed the option (the picker never even fired
`pick` → it stayed open).

## The fix (root, shared mechanism — NOT a picker-local patch)
1. `insertIntoSlot` (`tierBOptimistic.ts`) now inserts the SAME way bind + the optimistic SSR write-back do
   — a **setData on a deep clone**, appending a fresh Puck item to the parent's slot-prop array, with the
   component's **defaultProps** (published by `toConfig` via `setComponentDefaults`) and a colon-free Puck id
   `${componentType}-${uuid}` (keeps the WC#69 invariant). `findItemById` recurses content + zones + nested
   slots, so an OWNED and an ADOPTED (and a nested) parent all resolve.
2. The picker's option detection (`MosaicZonePicker.tsx`) now finds the chosen option by which option's RECT
   contains the click (robust against the overlay being topmost), instead of `elementsFromPoint`.

## PROOF (real trusted `page.mouse.click`, node/993 owned Columns zone)
```
real click "+ Add"  → picker opens (listbox)
choose first option (mosaic_button)
layout JSON nodes:  4  →  5     (dataGrew: true — the child LANDED under the slot)
picker closed:      true
```
Screenshots: `1-real-click-list-open.png`, `2-after-insert-landed.png`. The add-flow is now whole:
click → open → choose → the component is inserted into the slot.

## Cells (Vitest `WC88InsertIntoSlot`, 4)
- OWNED parent slot 0 → 1, with defaultProps + a colon-free `mosaic_button-<uuid>` id.
- ADOPTED (colon-free) parent slot 0 → 1; the new id stays colon-free.
- No duplicate: two inserts → exactly two distinct children.
- Recurses into a parent nested inside another slot.

## WC#86 debt note (ledgered)
The WC#86 click fix is a document-capture-listener WORKAROUND for Puck's DropZone eating the click — a
deliberate debt item for the **1.1 Puck-extension review** (the clean solution is a Puck plugin/overlay
integration rather than a document-level capture listener).

## Gates
tsc clean; Vitest 642/1 (B-101; +WC#88 4 cells); Kernel unchanged 3050/0 (no PHP); oracles IDENTICAL. dist
1.0.60 → 1.0.61 (builder 0a0ba0ea→2deffd63, frontend-editor eafb9b82→7f56106d, renderer byte-identical;
served==built). Ship count 63.
