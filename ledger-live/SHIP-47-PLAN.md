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

---

## CP-ADOPT-7R P1 addendum (CHECKPOINT-1) — folds into ship #47

New/changed **mosaic** files (this pass; still READ-ONLY, Arun commits):
- `src/Service/MosaicRenderer.php` — SSR harvest merges provider `global_libraries` (§3d) via
  `providerGlobalLibraries` + `mergeAttachments`; reads `<provider>.mosaic-adopt.yml`.
- `js/src/builder/tierBOptimistic.ts` — `ensureSsr()` (first SSR on mount).
- `js/src/builder/MosaicPuckAdapter.ts` — `EnsureSsr` mount-effect in both loading skeletons;
  `buildTierBRenderer(manifest, basePath)`.
- `js/src/builder/__tests__/tierBOptimistic.test.ts` (+5 cells) ·
  `tests/src/Kernel/Adopt/AdoptGlobalAssetsTest.php` (new, 2 cells) ·
  `tests/modules/adopt_fixture/{adopt_fixture.libraries.yml, adopt_fixture.mosaic-adopt.yml, css/adopt-base.css}` (fixtures).
- `scripts/qa/{adopted-style-shasum.sh, adopted-style-shasum.mjs}` (§3f parity oracle).
- `js/dist/{builder.js, frontend-editor.js}` rebuilt · `mosaic.libraries.yml` → **1.0.67**.
- `check-ignore` clean on all; `SdcComponentPlugin.php` still pristine.

**Helper module — ships SEPARATELY under Arun's SITE repo, NOT the Mosaic module** (git untracked by
mosaic; `web/modules/custom/mosaic_adopt_ext/`):
- `mosaic_adopt_ext.info.yml` (deps: `mosaic:mosaic`, the library module)
- `mosaic_adopt_ext.libraries.yml` (`base` → depends on the library's shipped base ES-module bundle;
  copies nothing proprietary)
- `«ext».mosaic-adopt.yml` (`global_libraries: [mosaic_adopt_ext/base]`)

Arun installs the helper module on the site (a config write — the adoption profile is then read by
Mosaic). The brand token/font/icon layer still comes from the library's example theme (install it, or
add it to `mosaic_adopt_ext/base`).

## CP-ADOPT-7R P2 addendum (CHECKPOINT-2) — folds into ship #47

Ruling this pass: **"Reader now, UX next pass."** New/changed **mosaic** files (still READ-ONLY,
Arun commits):
- `src/Sdc/MosaicAdoptionProfile.php` — NEW `final` reader for `<provider>.mosaic-adopt.yml`
  (full parse of containers/items/repeaters/requiresParent/global_libraries/preview_defaults/
  thumbnails; id-validation → warnings not crash; cached under the library cache tag).
- `mosaic.services.yml` — registers `mosaic.adoption_profile`; appends it to `mosaic.renderer` args.
- `src/Service/MosaicRenderer.php` — `providerGlobalLibraries()` now delegates to the reader
  (P1's duplicated yaml/cache block removed); removed the now-unused `Yaml` import.
- `tests/src/Kernel/Adopt/MosaicAdoptionProfileTest.php` (NEW, 4 methods / 29 assertions) ·
  `tests/modules/adopt_fixture/adopt_fixture.mosaic-adopt.yml` (extended: every key + an
  unknown-id warning path).
- `tests/src/Unit/Service/MosaicRendererTest.php` + `MosaicRendererCacheTest.php` — construct a REAL
  `MosaicAdoptionProfile` (the class is `final`; `createMock` cannot double it) with mocked deps.
- `tests/src/Unit/Smoke/Sprint60SmokeTest.php` — §1.4 oracle retargeted (endpoint path, not the
  old leading-slash bug).
- `js/src/builder/useLighthouseScore.ts` (§1.4 URL fix) + `js/src/builder/__tests__/useLighthouseScore.test.ts`
  (root `/` + subdir `/drupal/` cells; `startsWith('//')` guard).
- `js/dist/builder.js` rebuilt (`a298662d`) · `mosaic.libraries.yml` → **1.0.68**.

**«ext» helper — ships SEPARATELY (Arun's SITE repo, `web/modules/custom/mosaic_adopt_ext/`):**
- `«ext».mosaic-adopt.yml` EXTENDED with the 9 repeater families + requires-parent map + global_libraries.

Gates: Kernel+Unit **3113/0** · Vitest **660/1** (B-101 only) · phpcs **0** (changed) · phpstan
**0 new** (MosaicRenderer 4 pre-existing B-102) · owned oracles REGION `14e6cb9c…3954` + STYLE
`b7756795…ca982 4354 10` IDENTICAL (with «ext» ON) · dist **1.0.67 → 1.0.68**.

**DEFERRED to next pass:** the repeater-UX React build (§3b); then P3 = requires-parent enforcement
(§3c) + preview defaults (§3e).

## CP-ADOPT-7R P2b addendum (CHECKPOINT-3) — folds into ship #47

Repeater UX §3b — MODEL + PANEL (owned-Tabs unification + films deferred, see report).
New/changed **mosaic** files (READ-ONLY; Arun folds into the single ship #47 ceremony):
- `src/Sdc/SlotDescriptor.php` — `repeater` ctor field + `withRepeater()` + `toArray()` emit.
- `src/Service/MosaicManifestBuilder.php` — injects `@mosaic.adoption_profile`; `resolveRepeater()`
  (profile wins → single-`allowed` heuristic floor), applied last in `buildSlotDescriptors`.
- `mosaic.services.yml` — `mosaic.manifest_builder` gains `@mosaic.adoption_profile`.
- `mosaic.libraries.yml` — **1.0.69**.
- `js/src/shared/types/schema.ts` — `SlotDescriptorJson.repeater`.
- `js/src/builder/fields/MosaicRepeaterField.tsx` (NEW) — inline item list (rows/summary/+Add/
  reorder drag+keyboard/remove min-guard/min-max banner/row→select).
- `js/src/builder/tierBOptimistic.ts` — `readSlotItems`/`reorderInSlot`/`removeFromSlot`/`selectSlotItem`.
- `js/src/builder/MosaicPuckAdapter.ts` — `_mosaic_repeater__<slot>` custom field beside the slot field.
- `js/src/builder/fields/__tests__/MosaicRepeaterField.test.tsx` (NEW) +
  `js/src/builder/__tests__/MosaicPuckAdapterRepeater.test.ts` (NEW) — 14 cells.
- `tests/src/Kernel/Adopt/RepeaterDescriptorTest.php` (NEW, 5 cells).
- `tests/src/Kernel/Adopt/SlotDescriptorEmissionTest.php` + `tests/src/Unit/Plugin/Field/MosaicLayoutWidgetTest.php`
  + `tests/src/Unit/Controller/ManifestControllerTest.php` — manifest-builder construction sites (+imports).
- `js/dist/{builder.js (3182e57f), frontend-editor.js (3c67e57e)}` rebuilt.

Gates: Kernel+Unit **3118/0** · Vitest **675/1** (B-101) · phpcs **0** · phpstan **0** (changed) ·
tsc clean · owned REGION `14e6cb9c…3954` + STYLE `b7756795…ca982 4354 10` IDENTICAL · dist **1.0.69**.

DEFERRED to next pass: owned-Tabs field unification (dual backing store); headed films (need helper
enabled = Arun's walk, or an owned slot-repeater); then P3 requires-parent (§3c) + preview defaults (§3e).

## CP-ADOPT-7R P5 addendum (CHECKPOINT-4) — folds into ship #47

Repeater films (owed) + two bug fixes the films caught. §3c/§3e deferred (see report).
New/changed **mosaic** files (READ-ONLY; Arun folds into ship #47):
- `src/Service/MosaicManifestBuilder.php` — resolveRepeater qualifies the profile's LOCAL child id
  with the provider (→ correct Puck key for the insert path).
- `src/Sdc/MosaicAdoptionProfile.php` — readYaml also scans ALL enabled modules for
  `<provider>.mosaic-adopt.yml` (finds the real `mosaic_adopt_ext` helper; the file name is the contract).
- `tests/src/Kernel/Adopt/RepeaterDescriptorTest.php` — profile child expectation now provider-qualified.
- `js/e2e/repeater-authoring.spec.ts` (NEW) — headed «ext» accordion repeater film (frame 01).
- NO bundled JS changed → dist unchanged (1.0.69, builder 3182e57f).

RED the film caught (next pass): `+Add` for an ADOPTED-component child is a no-op — insertIntoSlot
appends to parent.props[slot] (owned inline slots) but adopted components use the Tier-B SSR-preview
slot machinery, so the child is not picked up. Architectural gap; unblocks the full film once fixed.

Gates: Kernel+Unit 3118/0 · Vitest 675/1 (B-101; no JS change) · phpcs 0 · phpstan 0 · owned REGION
14e6cb9c…3954 + STYLE b7756795…ca982 4354 10 IDENTICAL · dist unchanged.
DEFERRED: adopted-slot insert fix → §3c requires-parent → §3e preview defaults.

## CP-ADOPT-7R P6 addendum (CHECKPOINT-5) — folds into ship #47

Adopted-slot insert fix (repeater +Add no-op) + naming sweep. New/changed **mosaic** files (READ-ONLY):
- `js/src/builder/MosaicPuckAdapter.ts` — repeater `render` recovers the instance id from Puck's
  composite custom-field id (`<instanceId>_custom_<fieldKey>` → strip `_custom_…`); shared insertIntoSlot
  now lands the child (was the +Add no-op the CHECKPOINT-4 film caught).
- `js/src/builder/__tests__/MosaicPuckAdapterRepeater.test.ts` — +1 P6 parentId-derivation cell.
- `js/e2e/repeater-authoring.spec.ts` + `js/e2e/repeater-diag.spec.ts` — headed «ext» accordion film
  (now GREEN, 4 frames) + the diagnostic that named the cause.
- `js/src/builder/fields/__tests__/MosaicRepeaterField.test.tsx` — tsc `rows[1]!` nullability.
- `mosaic.libraries.yml` → **1.0.70**; `js/dist/{builder.js 6153347d, frontend-editor.js 37ea9b58}` rebuilt.
- NO PHP changed → Kernel 3118/0 stands.

Cause: Puck's CustomFieldRender `id` is field-scoped (`<instanceId>_custom_<fieldKey>`), not the bare
instance id → findItemById never matched → insertIntoSlot no-op. Fix strips the scope. Before/after
slot JSON + frames in films/checkpoint-5-repeater/.

Gates: Kernel+Unit 3118/0 · Vitest 676/1 (B-101) · tsc clean · phpcs 0 · owned REGION 14e6cb9c…3954 +
STYLE b7756795…ca982 4354 10 IDENTICAL · dist 1.0.70. DEFERRED: §3c requires-parent, §3e preview defaults.
