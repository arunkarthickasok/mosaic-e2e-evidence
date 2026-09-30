# CP-ADOPT-9 CHECKPOINT-2 — client reads mosaic.shape_map from drupalSettings

**Date:** 2026-10-01 · **Branch:** `fix/finding-016-validator` (mosaic repo, working tree —
not committed by AI per commit-flow; handed to Arun).

## What shipped

The builder rail now reads the site-wide **shape → widget** map from `drupalSettings` and
follows it live via a cache tag — no manual cache clear. Shipped defaults reproduce today's
rail, so nothing changes until an admin overrides a row at **Field types**
(`/admin/config/mosaic/field-types`).

### Server (PHP)
- `src/Sdc/MosaicShapeMap.php` — new `resolvedMap()`: every shape → its configured-or-default
  widget (falls back to the shipped default per shape).
- `src/Plugin/Field/FieldWidget/MosaicLayoutWidget.php` — injects `mosaic.shape_map`; attaches
  `drupalSettings.mosaic.shapeMap = resolvedMap()` and adds the `config:mosaic.shape_map`
  cache tag (mirrors the R11 library-list "no manual cache clear" pattern). Saving the
  Field-types form invalidates the tag → the builder page re-attaches the new map → the rail
  follows it on the next load.

### Client (JS)
- `js/src/builder/shapeMap.ts` — new. `readShapeMap()` reads `window.drupalSettings.mosaic.shapeMap`
  over the shipped defaults (which mirror `MosaicShapeMap::ALLOWED[$shape][0]`); `widgetForShape()`,
  `scalarPuckType()` (number/text) map the resolved widget → a Puck field type.
- `js/src/builder/MosaicPuckAdapter.ts` — `descriptorToPuckField()` consults `scalarPuckType()`
  for the plain scalar shapes (number, text). Default map → byte-identical (number→number,
  text→text); override → number→text input, text→plain textarea.

### Library
- `mosaic.libraries.yml` — **BUMP-LIBS 1.0.79 → 1.0.80** (builder + frontend_editor + fe_chrome),
  cache-busting the rebuilt bundles.
- `js/dist/builder.js`, `js/dist/frontend-editor.js` — rebuilt (`build:all`). `renderer.js`
  unchanged (the front-end render path is untouched).

## Gate (all in DDEV unless noted)

| Check | Result |
|---|---|
| TypeScript `typecheck` | clean |
| Vitest — new `shapeMap.test.ts` | **7 / 7** |
| Vitest — full suite | 731 pass / **1 pre-existing** (B-101 boolean→radio drift, present at HEAD 33cd40c) |
| PHPCS (Drupal,DrupalPractice) changed files | **0 errors** (warnings all pre-existing docblock line-length) |
| PHPStan `-l 6` changed files | **0 new** (12 pre-existing `missingType.iterableValue`, identical at HEAD) |
| PHPUnit Unit suite | **2832 / 0** (1 pre-existing warning) |
| PHPUnit Kernel suite | **325 / 0** (3 pre-existing skips) |
| PHPUnit Functional (ShapeMapForm + BuilderManifestParity) | **5 / 0** (2 pre-existing conditional skips) |

**Functional detail:** `ShapeMapFormTest` **2/2** passed — `testPermissionAndValidSave` (the
Field-types form save → `mosaic.shape_map` config round-trip that the client reads) and
`testFormOffersOnlyCompatibleWidgets`. `BuilderManifestParityTest`: `testApiAndDrupalSettingsManifestKeySetsMatch`
passed (the admin drupalSettings manifest still matches the FE API manifest — the new top-level
`shapeMap` key did not break parity); the other two `markTestSkipped` when the adopted fixture is
absent (pre-existing conditional skips, unrelated to this change).

## Owned byte-identical invariants — VERBATIM (before + after the build)

| Oracle | Canonical | Baseline (pre-build) | Post (build + drush cr) |
|---|---|---|---|
| REGION (`region-shasum.sh` node/780) | `14e6cb9c…a43e0dec 3954` | ✅ match | ✅ match |
| STYLE (`style-shasum.sh` node/780) | `b7756795…9aaca982 4354 10` | ✅ match | ✅ match |

The change is authoring-rail only; node 780's anonymous front-end render (markup + computed
styles) is provably unchanged.

## Handoff (mosaic repo — Arun commits per commit-flow)

The working tree carries the full CP-ADOPT-9 landing (Arun's P0/P1 + this CHECKPOINT-2).
CHECKPOINT-2 files: `src/Sdc/MosaicShapeMap.php` (resolvedMap), `MosaicLayoutWidget.php`,
`js/src/builder/shapeMap.ts` (+test), `MosaicPuckAdapter.ts`, `mosaic.libraries.yml`,
`js/dist/{builder,frontend-editor}.js`, `MosaicLayoutWidgetTest.php`.
