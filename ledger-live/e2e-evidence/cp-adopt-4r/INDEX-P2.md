# cp-adopt-4r PASS 2 — WC#66/#68/#69/#70 evidence (2026-09-19)

Full narrative: `reports/REPORT-CP-ADOPT-4R-P2.md`. Ship #44 UNBLOCKED — WC#69 drop PROVEN
with real CDP input.

## WC#69 (BLOCKER) — drop into adopted slot — FIXED + PROVEN

- **`WC69-CDP-PROOF.json`** — THE PROOF. Real CDP `Input.dispatchMouseEvent` drop into both
  adopted slots: before/after DOM quoted + saved layout `nodes[teaser].slots.{image,content}`
  carries the dropped child. Lands in the correct slot.
- `CDP-columns.json` — the harness LANDS the owned columns control (real-input harness valid).
- `CDP-adopted.json` — adopted slots land after all three fixes.
- `EFP.json` — the overlap discovery: `teaser-a4:title` stacked over `teaser-a4:image`
  (library `position:absolute`).
- `MDBG-columns.json` / `MDBG-adopted.json` — instrumented Puck: columns resolves to the
  dropzone; adopted (pre-fix) resolves to `component teaser-a4 → root:default-zone`.
- `GEO.json` — post-layout-reset geometry: five clean, non-overlapping, in-box slot zones.
- `P2-WITNESS.json` — the pointer-events chain (pe:none is normal Puck; not the cause).
- `RECTS.json` — PASS-1 min-box: all slots pass the BUFFER gate.

## WC#66 — dirty on load — REPRODUCED + FIXED

- `WC66-adopted.json` — pristine load fires beforeunload (`dialogFired:true`) + shows the
  `props:{title:[],…}` empty-slot leak; owned `WC66-owned.json` does not. Re-run after fix:
  `dialogFired:false`.

## WC#67 — labels — FIXED

- `WC67-LABELS.json` — each zone bound to its slot id, labelled, in twig order.

## WC#68 — empty panel — BUILT

- `WC68.json` — "No fields — this component is built from its slots" + slot list
  (Content required). `wc68-empty-panel.png`.

## WC#70 — empty required slot — validator + renderer

Kernel-proven (`tests/src/Kernel/Adopt/RequiredSlotTest.php`, 4/4) — no album cell needed.
