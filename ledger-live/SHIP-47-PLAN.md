# SHIP-47-PLAN — CP-ADOPT-7 (P1 gap fixes + R9 + F-109 + G9 hydration + WC#94) → ship #47

> MOSAIC git READ-ONLY for the AI; **Arun commits**. Nothing was staged by the AI.
> The CP-ADOPT-7 working set (WC#94 + P1 + P2) is one uncommitted set — this is that set,
> ready for a single ship. Naming ban: the library is "the external library" everywhere.

## The verdict
**Every changed path is a ship file — INCLUDE all of them.** `git check-ignore` was run on the
changed src/test/dist/config paths: **zero are ignored**. The only exclusions are the .gitignore
cruft classes (`*.log`, `js/e2e/`, `AI`, `docs/`, `sprints/`, `js/e2e.zip`, `assets/` anchored) —
**none appear in the set**. The held **`src/Plugin/Component/SdcComponentPlugin.php` is PRISTINE**
(not in the changeset — the F-108 held-file rule holds). **Count: 24** (23 modified + 1 new).

## Full verbatim `git status --short -uall` (24)
```
 M js/dist/builder.js
 M js/dist/frontend-editor.js
 M js/package.json
 M js/src/builder/__tests__/mosaicAttach.test.ts
 M js/src/builder/fields/MosaicZonePicker.tsx
 M js/src/builder/fields/__tests__/MosaicZonePicker.test.tsx
 M js/src/builder/mosaicAttach.ts
 M mosaic.info.yml
 M mosaic.libraries.yml
 M mosaic.services.yml
 M src/Form/MosaicComponentLibrariesForm.php
 M src/Sdc/MosaicGlobalStylesScanner.php
 M src/Sdc/MosaicPropShapeRegistry.php
 M src/Sdc/PropShape.php
 M src/Service/MosaicManifestBuilder.php
 M src/Service/MosaicRenderer.php
 M tests/src/Unit/Sdc/MosaicComponentGraderTest.php
 M tests/src/Unit/Sdc/MosaicGlobalStylesScannerTest.php
 M tests/src/Unit/Sdc/MosaicPropShapeRegistryTest.php
 M tests/src/Unit/Sdc/PropShapeTest.php
 M tests/src/Unit/Service/MosaicRendererCacheTest.php
 M tests/src/Unit/Service/MosaicRendererTest.php
 M tests/src/Unit/Smoke/Sprint50SmokeTest.php
?? tests/src/Kernel/Adopt/ExternalLibraryReadinessTest.php
```

## What each path carries
- **WC#94** (post-ship-46 walk-catch): `MosaicZonePicker.tsx` + its test — the picker list re-anchors
  to the "+" on scroll, closes when it leaves the viewport.
- **P1 gap fixes:** `PropShape.php` (G1 nullable-union unwrap + G5 media-object + G2 humanizeName),
  `MosaicPropShapeRegistry.php` (G2 label + H4 null), `MosaicManifestBuilder.php` (G2 component label +
  G3 category), `MosaicGlobalStylesScanner.php` + `MosaicComponentLibrariesForm.php` (G8 shadow-DOM
  reason), `mosaic.info.yml` (R9 `core_version_requirement ^11.3 || ^12`), `js/package.json` (F-109
  build script). Tests: `PropShapeTest`, `MosaicPropShapeRegistryTest`, `MosaicGlobalStylesScannerTest`,
  `MosaicComponentGraderTest`, `Sprint50SmokeTest` (F-109), + new `ExternalLibraryReadinessTest`.
- **P2 / G9 hydration:** `MosaicRenderer.php` (server ESM harvest via captured render context +
  `library.discovery`/`file_url_generator`), `mosaicAttach.ts` + its test (client `type="module"`
  inject + no-flash), `mosaic.services.yml` (2 new renderer deps), `MosaicRendererTest` +
  `MosaicRendererCacheTest` (constructor mocks).
- **dist + libs:** `js/dist/builder.js`, `js/dist/frontend-editor.js` (rebuilt; renderer byte-identical),
  `mosaic.libraries.yml` (1.0.63 → **1.0.66**).

## Gates at plan (re-run — see the P3 push)
Kernel+Unit **3104 / 0** · Vitest **654 / 1** (B-101, pre-existing) · tsc + phpcs (0 errors) clean ·
phpstan **0 new** (4 pre-existing B-102 in MosaicRenderer) · oracles **REGION 14e6cb9c…3954 + STYLE
b7756795…ca982 4354 10** byte-identical · dist **1.0.66**, served==built.

## The one-line commit message (Arun pastes)
```
'ship #47: CP-ADOPT-7 adopt-any-SDC readiness - P1 gap fixes (nullable-union prop classifier so adopted props map instead of falling to raw, never-blank humanised labels, group->palette category, media-object->media field, shadow-DOM "styles in JavaScript" SO-7 reason) + R9 core_version ^11.3 for the component-element #attributes contract + F-109 build script points at the real vite configs (npm run build works, deterministic) + G9 shadow-DOM canvas hydration (server harvests each component ESM into the SSR attachment delta, client injects it once as <script type=module>, un-upgraded elements hidden then crossfaded - no flash) + WC#94 per-zone picker list re-anchors to its + on scroll; the external library re-grades 47 components 38 Ready / 9 Attention (each a single typeless prop) / 0 Blocked; byte-identical frontend 14e6cb9c/b7756795, libs 1.0.66'
```

## After the ship
Tag stays **1.0.x-dev** (no rc). Next: **P3 oracle walk** (WALK-CP-ADOPT-7.md — Arun's hands), then the
Delivery-Plan order (author-trust → backend audit → Wave D/F/G → ACT 2 from design v2 due 2026-11-24).
