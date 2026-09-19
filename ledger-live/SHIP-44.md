# SHIP #44 — CP-ADOPT-4 + 4R: adopt any SDC, authorable end-to-end (2026-09-19)

Commit **0bcc2ab** (parent 75b3039 = ship #43). **29 files.** Walk **7/7 PASS** (Arun).
Tracked tree clean == HEAD. byte-identical node/780 `14e6cb9c…43e0dec` held. libs **1.0.43**.

## What shipped
The first component from OUTSIDE Mosaic — Olivero's `teaser`, a theme-provided SDC Mosaic never
wrote — is authorable end-to-end: enabled from a library, placed on the canvas with the
library's OWN markup + CSS, its slots filled by real drag-and-drop, an empty required slot
refused rather than shipped broken, and the saved page matches — while owned components stay
byte-identical.

## Walk-catches closed (tally 72)
| # | Catch | Resolution |
|---|---|---|
| 66 | dirty on load | `serializeForDirty` strips empty-array slot props (dirty comparison only; F-089 save path untouched). No false "Leave site?". |
| 67 | zone order / labels / banner | inline slots in twig order; each `MosaicSlotZone` binds its slot id + label + own descriptor. |
| 68 | empty panel | `MosaicSlotInfo` — "No fields — built from its slots" + slot list w/ required marker. |
| 69 | drop into adopted slot | **HEADED-PROVEN** (PROOF-CONDITIONS LAW). 3 stacked causes fixed: zero-width min-box; `.mosaic-adopted-preview` canvas layout reset (library CSS overlap); `--min-empty-height` cap (5-stack reflow); **+ colon-free Puck key** (placed id `olivero:teaser-<uuid>` colon broke Puck `split(":")` zone parsing — the true cause the fixture `teaser-a4` hid). |
| 70 | empty required slot | (a) `MosaicPropValidator` refuses at save, names component+slot; (b) `MosaicRenderer` renders nothing + logs (no broken markup). No owned fixture broken. |

## Fix map (source)
- `js/src/builder/MosaicPuckAdapter.ts` — colon-free adopted Puck key (`:`⇆`--`); serializeForDirty empty-array strip; slot-info wiring; buildAdoptedRenderer.
- `js/src/builder/fields/{MosaicAdoptedPreview,htmlToReactSlots,MosaicSlotZone,MosaicSlotInfo}.tsx` — inline slots, min hittable box, labels, empty-state.
- `css/builder.css` — `.mosaic-adopted-preview` layout reset + min-empty-height cap.
- `src/Service/MosaicPropValidator.php` (WC#70a) · `src/Service/MosaicRenderer.php` (WC#70b).
- Kernel `RequiredSlotTest` 4/4; Vitest `MosaicAdoptedPreview`/`MosaicSlotInfo`/`MosaicPuckAdapterColonType` cells.

## Gates at ship
Full Kernel+Unit **2988/0** · Vitest **561/1-B101** · phpcs 0-err changed files · phpstan +0
(MosaicRenderer 3 pre-existing) · **byte-identical `14e6cb9c` before==after** · dist rebuilt,
**served==built 1.0.43** (`d7429dc5…95e7875a`).

## Proof of record
Headed Chrome (PROOF-CONDITIONS LAW), fresh `/node/add/page`, Arun's steps: 3/3 land + persist
(`e2e-evidence/cp-adopt-4r/HEADED-PROOF.json`); reports REPORT-CP-ADOPT-4R{,-P2,-P3}.md;
WALK-CP-ADOPT-4.md 7/7.

## Open after #44
WC#71 (author-grade save-rejection wording) · WC#72 (clipped field geometry) · ACT-2
consistency (adopted zones show labels, owned Columns zones don't) · RC-A3 keyboard-drag spike
(Puck 0.21 has NO keyboard sensor) · Style-Ownership packet ADOPT §9 → CP-ADOPT-5 (+SO-7 in
ADOPT-6) · SSR-attachments R5/R10 → CP-ADOPT-5/6 → backend config audit → Wave D/F/G → ACT 2 →
soak → tag 1.0.0.
