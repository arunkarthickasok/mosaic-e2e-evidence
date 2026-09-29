# SHIP #48 PLAN (started CP-ADOPT-8 CHECKPOINT-1) — Canvas-dialect shapes

Parent: ship #47 = `33cd40c`. Ship #48 = CP-ADOPT-8 (+ later CP-ADOPT-9). Mosaic tree edited (Arun
commits); evidence repo carries this plan + REPORT-CP-ADOPT-8.md. dist NOT bumped (no adapter/JS change —
resolution is server-side).

## New paths (CHECKPOINT-1)
- `src/Sdc/MosaicSchemaRefResolver.php` — the resolver service.
- `config/schema/mosaic.canvas-shapes.json` — bundled well-known shapes (convention-derived; confirm vs Canvas at build).
- `tests/src/Kernel/Adopt/CanvasShapesTest.php` — 7 cells.
- `tests/modules/adopt_fixture/schema.json` — a module-local `$def` (`local_media`).
- `tests/modules/adopt_fixture/components/adopt_shaped/{adopt_shaped.component.yml,adopt_shaped.twig}` — the fixture component.

## Modified
- `src/Sdc/MosaicPropShapeRegistry.php` — inject resolver; resolve → classify; `rawReason` names unresolved URI.
- `src/Sdc/PropShape.php` — scalar-only union → text (unwrapNullable).
- `mosaic.services.yml` — `mosaic.schema_ref_resolver` + inject into `mosaic.prop_shape_registry`.
- `tests/src/Unit/Sdc/PropShapeTest.php` — scalar-union oracle updated + structural-union cell added.

## Gates at CHECKPOINT-1
- Kernel+Unit 3150/0 · Functional 76/0 · Vitest 724/1 (B-101; no JS) · phpcs 0 · phpstan 0 new ·
  owned REGION 14e6cb9c…3954 + STYLE b7756795…ca982 4354 10 IDENTICAL · dist 1.0.79 (unchanged).
- Re-grade: «ext» base 47/47 Ready; «ext-canvas» card image → media (disk witness).

## Remaining in CP-ADOPT-8
- CHECKPOINT-2: object-shape detectors — link → link, date-range → dates, heading → text (resolved objects
  currently fall to RAW/Attention; safe). Plus H4 defaults + H5 validation of object shapes at save;
  Functional node-form save of a shape-ref component with a media value.
- Then CP-ADOPT-9 (Manage authoring): rail = exportable config; precedence SDC>site>profile>shape>heuristic.

## Standing
Owned oracles the gate; naming ban «ext»/«ext-canvas» in evidence; Canvas NEVER enabled; no AI co-author trailer.
