# cp-adopt-4r — WC#66–#69 evidence (2026-09-18)

Mechanism-first witnesses + fix proof for the CP-ADOPT-4R rider. See
`reports/REPORT-CP-ADOPT-4R.md` for the full narrative.

## WC#69 (BLOCKER) — drop into adopted slot

Root cause is proven at Puck's SOURCE (`getPointerCollisions` BUFFER=6 contraction,
`@puckeditor/core/dist/chunk-YXFTA2VL.mjs:3233-3244`): a zero-width zone can never be a
drop candidate. Fix = a guaranteed min hittable box on empty slots.

- `PRECISE.json` — PRE-FIX: empty `teaser-a4:image` dropzone `zoneBox.width:0` (unhittable).
- `RECTS.json` — POST-FIX: all 5 teaser slots `passesBuffer:true` (image `w:0→96`).
- `adopted-slots-hittable.png` — the adopted teaser with hittable, outlined empty slots.
- `CONTROL.json` — owned `root:default-zone` drop ALSO fails via synthetic pointer on the
  same node (harness confound, not a component bug).
- `HARNESS-columns.json` — the drag DOES activate (`dragging:true`) + reaches the target,
  but NO zone becomes `isEnabled` under synthetic pointer (owned columns control) → why the
  committed drop cannot be filmed here.
- `CALIB.json` — `dragTo` landed columns ONCE, non-reproducible (flaky harness).
- `CMP-columns.json` / `CMP-adopted.json` — zone DOM/ancestry comparison (both real zones).
- `WARN.json` — no "DropZones deprecated" warning → adopted zones ARE proper slot zones.
- `WC69-PROOF.json` / `WC69-EMPTY.json` / `WC69-DRAG.json` / `WC69-WITNESS.json` —
  the earlier (confounded) drag attempts, kept for the honest trail.

**Drop-COMMIT status: UNPROVEN** (no keyboard sensor in Puck 0.21; synthetic pointer does
not drive the new dnd-kit). Ship #44 BLOCKED pending Arun's manual re-test.

## WC#67 — labels / order / banner — FIXED

- `WC67-LABELS.json` — each zone bound to its slot id, correct label, twig order:
  prefix→Prefix, meta→Meta, image→Image, title→Title content, content→Content.

## WC#66 — dirty on load — NOT reproduced

- `WC66-68.json` (`wc66`) — textarea stable on pristine load (`changedOnLoad:false`).
  Open; needs Arun repro. Data smell: teaser `title` slot stored as `props.title` array.

## WC#68 — empty panel — witnessed, fix scoped (open)

- `WC66-68.json` (`wc68`) — panel shows only the 10 meta controls, no component field for
  the props-less teaser.
