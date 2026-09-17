# SHIP #42 PLAN — CP-ADOPT-2 (Panel from schema: Pillar B / H3 + H4 + H5 + F-108)

Accumulates on ship #41 (`5a65173`). Mosaic git READ-ONLY — this is the ceremony add block for Arun's human
commit. **28 files: 17 modified + 11 new.** All trackable, 0 unintended ignores (verified via
`git add --dry-run`). Includes a **dist rebuild** (builder.js + frontend-editor.js) → **BUMP-LIBS 1.0.29 →
1.0.30**, so unlike ship #41 this ship carries JS/dist + libs.

## New files (11)
```
src/Sdc/PropShape.php                       pure shared classifier (schema → kind); one source of truth
src/Sdc/PropDescriptor.php                  immutable abstract descriptor value object
src/Sdc/MosaicPropShapeEvent.php            per-prop alter event (Symfony Event)
src/Sdc/MosaicPropShapeRegistry.php         service: describe()/describeAll() + H4 defaults + dispatch
scripts/qa/region-shasum.sh                 byte-identical region-shasum invariant (committed; .gitignore excepts it)
js/src/builder/__tests__/PropDescriptors.test.ts        adapter byte-identical + F-084 + fallback (8 cells)
tests/src/Unit/Sdc/PropShapeTest.php                    18 §P0 shapes ×2 + smoke-alarm
tests/src/Unit/Sdc/MosaicPropShapeRegistryTest.php      label/H4/options/bounds/items/flag/reason/event
tests/src/Kernel/Adopt/AdoptedDescriptorParityTest.php  F-108 adopted-vs-owned emission parity (olivero)
tests/src/Kernel/Adopt/PropShapeSaveValidationTest.php  H5 save-path validation (4 cells)
tests/modules/mosaic_test/src/Plugin/MosaicComponent/ShapeValidationTestComponent.php   H5 fixture (enum + html prop)
```

## Modified files (17)
```
.gitignore                                  + exception so scripts/qa/region-shasum.sh ships
mosaic.services.yml                         + mosaic.prop_shape_registry; manifest_builder +arg; prop_validator +arg
mosaic.libraries.yml                        BUMP-LIBS 1.0.29 → 1.0.30 (×3 libraries)
src/Sdc/ComponentDefinition.php             + props (core SDC schema root) — F-108
src/Sdc/MosaicComponentGrader.php           mapsToKnownShape → PropShape::isKnown; + H4 required Attention
src/Sdc/SdcComponentDiscovery.php           threads props.required into grade()
src/Service/MosaicManifestBuilder.php       + prop_descriptors (additive) from propDefinitions.properties
src/Service/MosaicPropValidator.php         + registry; validateShapes() (H5 formatted_text-without-format)
src/Plugin/MosaicComponent/SdcComponentPlugin.php   getPropDefinitions prefers stored props (F-108)
js/src/shared/types/schema.ts               + PropDescriptorJson + manifest.prop_descriptors
js/src/builder/MosaicPuckAdapter.ts         propsFieldsFromDescriptors + descriptorToField (consumes descriptors)
js/dist/builder.js                          rebuilt (adapter change)
js/dist/frontend-editor.js                  rebuilt (adapter change)
tests/src/Unit/Controller/ManifestControllerTest.php   +registry arg (PASS 2)
tests/src/Unit/Plugin/Field/MosaicLayoutWidgetTest.php +registry arg (PASS 2)
tests/src/Unit/Sdc/MosaicComponentGraderTest.php       oracle-change C1 (bare object → Attention) + H4 (PASS 2)
tests/src/Unit/Service/MosaicPropValidatorTest.php     +registry arg (H5)
```

## `git add --dry-run` verdict — every file trackable
All 11 new files return `add '<path>'` (0 ignored). The region-shasum script ships via the `.gitignore`
exception `!scripts/qa/region-shasum.sh` (mirrors the committed `e2e-setup.sh` / `e2e-setup-extended.sh`).

## EXCLUSIONS (never staged)
`AI/` (symlink outside the module); `js/*.log`, `js/dist-build-2b-*.log`, `js/e2e.zip`, `js/esc-probe.*`;
`assets/`; the `js/e2e/` Playwright specs (gitignored); scratch dev content + nodes.

## Gates at plan time
Unit FULL 2758/2758; Kernel FULL 209/209; Vitest 547 pass / 1 pre-existing B-101 fail; phpcs 0; phpstan L6 OK;
byte-identical region shasum `14e6cb9c…` before==after; palette guard CLOSED; dist 1.0.30.

## Proposed commit message (single quotes)
```
git commit -m 'ship #42: CP-ADOPT-2 panel from schema - PropShape classifier + prop-shape registry derive abstract descriptors in PHP (H3), manifest emits prop_descriptors, the Puck adapter consumes them byte-identically for owned (field_types still wins), H4 defaults, H5 save-time validation (formatted_text needs a text format), F-108 adopted components expose their props schema; committed region-shasum invariant; dist rebuilt, libs 1.0.30'
```

## STOP — Arun eye-test (reviewer audits REPORT-CP-ADOPT-2 §P1 PASS 3), then the human commit closes ship #42.
