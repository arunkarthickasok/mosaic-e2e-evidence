# CP-ADOPT-6 P4+P5 — SO-7 global-styles · client drift notices · SO-2 slot-only — PROOF

## Oracles (BEFORE == AFTER, verbatim)
See `oracles-dist.txt`. REGION `14e6cb9c…3954` and STYLE `b7756795…ca982 4354 10` are byte-identical
before and after — P4/P5 add metadata, a panel field, a validator guard and a drawer exclusion; no
node-render path changed.

## P4 — SO-7 global-styles flag
- `MosaicGlobalStylesScanner` (`src/Sdc/`): heuristic — after stripping comments + `@layer` bodies, a
  selector with NO `.`/`#`/`[` hook can only match by element type → an unlayered such rule is a global
  restyle. `!important` counted. R7 false-positive note in the docblock.
- `MosaicComponentLibrariesForm` surfaces the reason on adopted libraries only, cached under
  `config:mosaic.component_library.<provider>`. No grade change.
- Fixtures: `adopt_widget.css` (unlayered `*`/`body`/`h1..h3`/`a` + 1 `!important`) FLAGGED;
  `adopt_widget_v2.css` (all `.adopt-widget-v2`-scoped; `h2`/`p` inside `@layer adopt.reset`) NOT flagged.
- Tests: Unit `MosaicGlobalStylesScannerTest` (5) + Kernel `GlobalStylesFlagTest` (2).

## P5 — client drift notices
- `MosaicSchemaDrift::driftByNode()` → per-node-id map. Admin: `drupalSettings.mosaic[field].drift`.
  FE: `POST /api/mosaic/canvas/drift` (`CanvasPreviewController::drift`).
- `toConfig(…, driftMap)` + `resolveFieldsWithDrift` prepends a `_mosaic_drift` field for the SELECTED
  drifted instance (per-instance via `data.props.id`). Three notice classes:
  - removed → `⚠ Removed: … the saved value is kept` (editor already absent → value round-trips).
  - type-changed → `⚑ Type changed: … the saved value is flagged`.
  - required-added → `! Attention: … is now required by the library`.
- Tests: Vitest `MosaicDriftNotices` (3) + Kernel `SchemaDriftTest::testDriftByNodeKeysOnlyDriftedNodes`.
  FE parity via the shared `toConfig`.

## P5 — SO-2 slot-only (safety core; picker UX deferred)
- Dormant-feature FIX: added `slot_only` to `ComponentDefinition::SIDECAR_KEYS` (it was dropped, so
  `config.slotOnly` was always empty — the whole feature was inert).
- Server reject: `MosaicPropValidator` rejects a slot-only component at the top level (root + its direct
  slot children); nested-in-a-slot is allowed. Kernel `SlotOnlyPlacementTest` (3).
- Client root-disallow: slot-only omitted from every drawer category (can't drag to root/any slot),
  still registered. Vitest `MosaicSlotOnlyDrawer` (2) + retargeted `MosaicPuckAdapterSlotOnly` (4).
- DEFERRED → P6: the per-zone add-picker UX (keyboard "+" listing Plain content first, Puck slot-insert)
  + headed film. Root-disallow safety is fully shipped + tested; the picker is a focused follow-up.

## Gates
See the checkpoint in reports/REPORT-CP-ADOPT-6.md. phpstan on the 7 changed src files: **No errors**
(`phpstan-changed-surface.log`). Vitest 619/1 (B-101 pre-existing). tsc clean. phpcs P4/P5 surface clean.
