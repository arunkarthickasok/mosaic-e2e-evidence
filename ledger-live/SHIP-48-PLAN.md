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

## CHECKPOINT-2 additions
- Modified `src/Sdc/PropShape.php` (looksLikeLink), `tests/src/Kernel/Adopt/CanvasShapesTest.php` (10 cells),
  `tests/modules/adopt_fixture/components/adopt_shaped/{adopt_shaped.component.yml,adopt_shaped.twig}` (inline shapes + cta).
- date-range/heading compound-shape detectors DEFERRED (sub-field descriptor infra); the `$ref`-at-render
  finding recorded. dist still unchanged (no JS).
- CP-ADOPT-9 P0 blueprint filed: reports/REPORT-CP-ADOPT-9.md (14-knob table, shape_map + authoring entity
  overrides-only, precedence + H5, UI, lifecycle, 5 risks, 6-pass build order).

## CP-ADOPT-9 P1 (shape_map) — new paths
- `config/install/mosaic.shape_map.yml`, `src/Sdc/MosaicShapeMap.php`, `src/Form/MosaicShapeMapForm.php`,
  `tests/src/Kernel/Adopt/ShapeMapTest.php`, `tests/src/Functional/Adopt/ShapeMapFormTest.php`.
- Modified `mosaic.services.yml` (mosaic.shape_map), `mosaic.routing.yml` (mosaic.admin.field_types),
  `config/schema/mosaic.schema.yml`. Server-only — dist unchanged. Client rail-follows = CHECKPOINT-2.

## CP-ADOPT-9 P2 (CHECKPOINT-3) — authoring entity + resolver (H5) + owned migration
Arun-ruled scope: entity keystone + owned migration; the Manage-authoring form + client rail application (P3)
+ drift flag are the next landing.
- New: `src/Entity/MosaicComponentAuthoring.php` + `MosaicComponentAuthoringInterface.php` (overrides-only
  config entity), `src/Sdc/MosaicAuthoringResolver.php` (`mosaic.authoring_resolver` — the ONE resolver:
  precedence SDC>entity>profile>shape-map>heuristic + H5 refusals + `ensure()` auto-gen),
  `tests/src/Kernel/Adopt/AuthoringResolverTest.php` (11 cells / 61 assert).
- Modified: `config/schema/mosaic.schema.yml` (mosaic.component_authoring.*), `mosaic.services.yml`
  (authoring_resolver + inject into manifest_builder), `src/Service/MosaicManifestBuilder.php`
  (applyOverrides overlay at buildComponentEntry end), `src/Plugin/Field/FieldWidget/MosaicLayoutWidget.php`
  (mosaic_component_authoring_list cache tag), `mosaic.install` (mosaic_update_10004 owned migration),
  3 test instantiations updated (MosaicLayoutWidgetTest, ManifestControllerTest, SlotDescriptorEmissionTest).
- Gates FULL: Unit 2832/0 · Kernel 336/0 (3 skip) · Functional FULL 78/0 (813 assert, 2 skip) ·
  Vitest 731/1 (B-101; no JS) · phpcs 0 err · phpstan 0 new · owned REGION 14e6cb9c…3954 + STYLE
  b7756795…ca982 4354 10 VERBATIM · dist UNCHANGED (server-side overlay; no BUMP-LIBS).
- Evidence: reports/REPORT-ADOPT9-CP3.md.

## CP-ADOPT-9 P3 (CHECKPOINT-4) — the Manage-authoring FORM (§5.5)
Arun-ruled scope: the form first; the client rail application + headed films = CHECKPOINT-5.
- New: `src/Form/MosaicComponentAuthoringForm.php` (route
  /admin/config/mosaic/component-libraries/{provider}/{component}/authoring; FIELDS tabledrag +
  compatible-widget selects + Hidden + required-lock + capabilities + SLOTS + previews + Reset;
  validateForm = H5 refusals() as row errors + Save blocked; submitForm = overrides-only persist),
  `tests/src/Functional/Adopt/ComponentAuthoringFormTest.php` (4 cells / 46 assert),
  `tests/modules/adopt_fixture/components/adopt_required/` (required-prop fixture for the H5 refusal cell).
- Modified: `mosaic.routing.yml` (mosaic.admin.component_authoring), `src/Form/MosaicComponentLibrariesForm.php`
  ("Manage authoring →" link per component), `src/Service/MosaicManifestBuilder.php` (extract
  buildComponentDefaults = pre-overlay entry; buildComponentEntry = defaults + P2 overlay).
- Gates FULL: Unit 2832/0 · Kernel 336/0 (3 skip) · Functional FULL 82/0 (859 assert, 2 skip; +4
  ComponentAuthoringFormTest) · Vitest 731/1 (B-101; no JS) · phpcs 0 err · phpstan 0 new · owned REGION
  14e6cb9c…3954 + STYLE b7756795…ca982 4354 10 VERBATIM · dist UNCHANGED (no adapter/JS; no BUMP-LIBS).
- Evidence: reports/REPORT-ADOPT9-CP4.md + reports/WALK-CP-ADOPT-9.md.
- Ship count: parent #47 = 33cd40c; the full CP-ADOPT-9 landing (P0/P1 + CP-2 + CP-3 + CP-4) is the mosaic
  working tree, uncommitted (Arun commits). Mosaic one-line message:
  "CP-ADOPT-9: shape_map + authoring entity + resolver (H5) + owned migration + Manage-authoring form;
   Unit 2832/0 Kernel 336/0 Functional 82/0 Vitest 731/1; owned shasums verbatim; dist unchanged"
