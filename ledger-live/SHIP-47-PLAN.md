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

## CP-ADOPT-7R P7 addendum (CHECKPOINT-6) — folds into ship #47

§3c requires-parent — MODEL + SERVER H5 guard (client auto-wrap UX + films deferred, see report).
New/changed **mosaic** files (READ-ONLY):
- `src/Service/MosaicManifestBuilder.php` — emits `requires_parent` (profile requiresParent, qualified).
- `src/Service/MosaicPropValidator.php` — `requiresParentPlacementErrors` H5 save-guard (WC#78 precedent)
  + `requiredParentsFor`/`componentLabel`; injects `@mosaic.adoption_profile`.
- `mosaic.services.yml` — `mosaic.prop_validator` gains `@mosaic.adoption_profile`.
- `js/src/shared/types/schema.ts` — `MosaicComponentManifest.requires_parent?` (types only → no bundle change).
- `tests/src/Kernel/Adopt/RequiresParentTest.php` (NEW, 4) + `RequiresParentSaveTest.php` (NEW, 3).
- `tests/src/Unit/Service/MosaicPropValidatorTest.php` — construction site (+ MosaicAdoptionProfile).
- NO runtime JS / dist change → dist stays 1.0.70 (builder 6153347d).

H5 message (fixture): "Adopt Widget V2 must be placed inside Adopt Widget."

Gates: Kernel+Unit 3125/0 · Vitest 676/1 (B-101) · tsc clean · phpcs 0 · phpstan 0 · owned REGION
14e6cb9c…3954 + STYLE b7756795…ca982 4354 10 IDENTICAL · dist unchanged.
DEFERRED: §3c CLIENT (auto-wrap/refuse/palette/toast + drag films), then §3e preview defaults.

## CP-ADOPT-7R P8 addendum (CHECKPOINT-7) — folds into ship #47

§3c CLIENT auto-wrap LOGIC + observer + toast + a decisive drop finding. New/changed mosaic files (READ-ONLY):
- `js/src/builder/requiresParentWrap.ts` (NEW) — setWrapIndex + autoWrapOrphans (wrap-single/refuse-several/converge) + wrapEntryFor.
- `js/src/builder/mosaicToast.ts` (NEW) — minimal .mosaic-toast.
- `js/src/builder/BuilderApp.tsx` — auto-wrap observer (safety net; live DROP-PROOF for containers).
- `js/src/builder/MosaicPuckAdapter.ts` — setWrapIndex(manifests) in toConfig.
- `js/src/builder/__tests__/requiresParentWrap.test.ts` (NEW, 5) · `js/e2e/requires-parent-authoring.spec.ts` (enforcement film, 2 frames).
- `mosaic.libraries.yml` → 1.0.71; `js/dist/{builder.js 45a6bc6e, frontend-editor.js c244dbb2}` rebuilt. NO PHP changed.

FINDING: Puck REFUSES an adopted child-item drop at root (never commits; no error) — requires-parent is
enforced client-side (drop-refusal) + server-side (CHECKPOINT-6 H5). The auto-wrap CONVENIENCE needs
Puck drop-INTERCEPTION (observer can't fire — item never lands); logic is built + ready to call.

Gates: Kernel+Unit 3125/0 (no PHP) · Vitest 681/1 (B-101) · tsc clean · owned REGION 14e6cb9c…3954 +
STYLE b7756795…ca982 4354 10 IDENTICAL · dist 1.0.71.
DEFERRED: drop-interception (drag→wrap film) + palette marker/ordering; then §3e preview defaults.

## CP-ADOPT-7R P9 addendum (CHECKPOINT-8) — folds into ship #47

§3c-client remainder: auto-wrap CONFIRMED via drag + picker-wrap + palette marker. §3e deferred.
New/changed mosaic files (READ-ONLY):
- `js/src/builder/tierBOptimistic.ts` — insertWithParentRule (picker wrap: wrap-non-parent/refuse-several/normal) + findNodeById.
- `js/src/builder/fields/MosaicSlotZone.tsx` — onPick routes through insertWithParentRule.
- `js/src/builder/PaletteCard.tsx` — "needs {Container}" marker (wrapEntryFor).
- `js/src/builder/__tests__/requiresParentClient.test.tsx` (NEW, 5) · `js/e2e/requires-parent-authoring.spec.ts` (auto-wrap + DROP-PROOF + marker, 3 frames + wrap-layout.json).
- `mosaic.libraries.yml` → 1.0.72; `js/dist/{builder.js c2a64b9b, frontend-editor.js 5033f410}` rebuilt. NO PHP changed.

CORRECTION to CHECKPOINT-7: drag→auto-wrap WORKS (observer wraps the item when Puck commits the drop;
film retries the flaky drop; wrap deterministic). Toast "Placed inside a new «ext» Accordion" + layout
accordion.slots.items=[accordionitem]. No drop-interception needed for correctness (retry-free UX = 1.1).

Gates: Kernel+Unit 3125/0 (no PHP) · Vitest 686/1 (B-101) · tsc clean · owned REGION 14e6cb9c…3954 +
STYLE b7756795…ca982 4354 10 IDENTICAL · dist 1.0.72.
DEFERRED: §3e preview defaults; then §4 lifecycle greens + walk rewrite.

## CP-ADOPT-7R P10 addendum (CHECKPOINT-9) — folds into ship #47

WC#101 mechanism + deterministic auto-wrap proof. §3e deferred. New/changed mosaic files (READ-ONLY):
- `js/src/builder/tierBOptimistic.ts` — drag gate (setDragActive/isDragActive) + queue SSR write-backs during a drag (defensive).
- `js/src/builder/BuilderApp.tsx` — data-puck-dragging MutationObserver → setDragActive.
- `js/src/builder/__tests__/dragGate.test.ts` (NEW, 1) · `js/e2e/{wc101-mechanism.spec.ts, requires-parent-picker.spec.ts}` (study + deterministic picker-wrap proof).
- `mosaic.libraries.yml` → 1.0.73; `js/dist/{builder.js ba12c771, frontend-editor.js d734e0f8}` rebuilt. NO PHP changed.

WC#101 FINDING: 20-attempt study — zoneReplaced 0, setDataDuringDrag 0 (remount/SSR hypotheses DISPROVEN);
flakiness NOT adopted-specific (item 16-17/20 ≈ owned Columns 15/20); lever = drag-activation timing.
No product defect — inherent synthetic-drag flakiness; 20/20 unachievable via drag for any component.
PROOF: deterministic PICKER-wrap (click, 100%, no retry) — accordion item into Columns slot → wrapped
in Accordion + toast (04-picker-wrap-toast.png, picker-wrap-layout.json).

Gates: Kernel+Unit 3125/0 (no PHP) · Vitest 687/1 (B-101) · tsc clean · owned REGION 14e6cb9c…3954 +
STYLE b7756795…ca982 4354 10 IDENTICAL · dist 1.0.73. DEFERRED: §3e preview defaults; then §4.

## CP-ADOPT-7R P11 addendum (CHECKPOINT-10) — folds into ship #47

§3e preview defaults — the WC#97 fix (example image never saved). Rail badge UI = remaining polish.
New/changed mosaic files (READ-ONLY):
- `src/Sdc/MosaicAdoptionProfile.php` — previewDefaults() accessor.
- `src/Service/MosaicRenderer.php` — renderSingleComponent fills UNSET props from examples (canvas only) + returns _mosaic_preview.
- `src/Controller/CanvasPreviewController.php` — passes _mosaic_preview through.
- `src/Service/MosaicManifestBuilder.php` — emits preview_defaults per component.
- `js/src/shared/types/schema.ts` — MosaicComponentManifest.preview_defaults.
- `js/src/builder/MosaicPuckAdapter.ts` — skips seeding schema defaults for a preview_defaults component (saves empty).
- `tests/modules/adopt_fixture/components/adopt_widget/adopt_widget.component.yml` — heading example (fixture).
- `tests/src/Kernel/Adopt/PreviewDefaultsTest.php` (NEW, 3) · `js/src/builder/__tests__/previewDefaults.test.ts` (NEW, 2) · `js/e2e/preview-defaults.spec.ts` (film).
- `mosaic.libraries.yml` → 1.0.74; `js/dist/{builder.js bce0a157, frontend-editor.js 6368a9ea}` rebuilt.

Saved JSON proof (redacted): «ext»:card props = {"footer":[],"preheading_content":[]} — NO image (card-default not saved).

Gates: Kernel+Unit 3128/0 · Vitest 689/1 (B-101) · tsc clean · phpcs 0 · phpstan 0 new · owned REGION
14e6cb9c…3954 + STYLE b7756795…ca982 4354 10 IDENTICAL · dist 1.0.74.
DEFERRED: the "example" badge UI (rail badge + dirty tracking); then §4 lifecycle greens + walk rewrite.

## CP-ADOPT-7R P12 (CHECKPOINT-11) — SHIP #47 MANIFEST (the arc closes)

> MOSAIC git READ-ONLY for the AI; **Arun commits**. Nothing staged by the AI. The «ext» HELPER
> (`web/modules/custom/mosaic_adopt_ext/`) ships SEPARATELY in Arun's SITE repo (listed at the end).

**Count: 84** shippable paths (all CP-ADOPT-7 + 7R; +6 at CHECKPOINT-15 component fill — see delta below).
Was 75 at CHECKPOINT-11. `git check-ignore`: `js/dist/*` NOT ignored
(bundles ship); `js/e2e/`, `AI/`, `test-results/` ARE ignored (never ship). **`src/Plugin/Component/
SdcComponentPlugin.php` is PRISTINE** (absent from the changeset — the F-108 held-file rule holds).

## Full verbatim `git status --short -uall` (75, gitignored cruft excluded)
```
 M js/dist/builder.js
 M js/dist/frontend-editor.js
 M js/package.json
 M js/src/builder/BuilderApp.tsx
 M js/src/builder/MosaicPuckAdapter.ts
 M js/src/builder/PaletteCard.tsx
 M js/src/builder/__tests__/mosaicAttach.test.ts
 M js/src/builder/__tests__/tierBOptimistic.test.ts
 M js/src/builder/__tests__/useLighthouseScore.test.ts
 M js/src/builder/fields/MosaicAdoptedPreview.tsx
 M js/src/builder/fields/MosaicSlotZone.tsx
 M js/src/builder/fields/MosaicZonePicker.tsx
 M js/src/builder/fields/__tests__/MosaicZonePicker.test.tsx
 M js/src/builder/mosaicAttach.ts
 M js/src/builder/tierBOptimistic.ts
 M js/src/builder/useLighthouseScore.ts
 M js/src/shared/types/schema.ts
 M mosaic.info.yml
 M mosaic.libraries.yml
 M mosaic.services.yml
 M src/Controller/CanvasPreviewController.php
 M src/Drush/MosaicCommands.php
 M src/Form/MosaicComponentLibrariesForm.php
 M src/Sdc/MosaicGlobalStylesScanner.php
 M src/Sdc/MosaicPropShapeRegistry.php
 M src/Sdc/PropShape.php
 M src/Sdc/SlotDescriptor.php
 M src/Service/MosaicManifestBuilder.php
 M src/Service/MosaicPropValidator.php
 M src/Service/MosaicRenderer.php
 M tests/modules/adopt_fixture/components/adopt_widget/adopt_widget.component.yml
 M tests/src/Functional/Adopt/MosaicLibraryChangesReportTest.php
 M tests/src/Kernel/Adopt/BareRenderTest.php
 M tests/src/Kernel/Adopt/CacheTagUnificationTest.php
 M tests/src/Kernel/Adopt/FallbackRenderTest.php
 M tests/src/Kernel/Adopt/GlobalStylesFlagTest.php
 M tests/src/Kernel/Adopt/HybridRenderTest.php
 M tests/src/Kernel/Adopt/PaletteOpenTest.php
 M tests/src/Kernel/Adopt/RequiredSlotTest.php
 M tests/src/Kernel/Adopt/SlotDescriptorEmissionTest.php
 M tests/src/Kernel/Component/PlainContentRenderTest.php
 M tests/src/Unit/Controller/ManifestControllerTest.php
 M tests/src/Unit/Plugin/Field/MosaicLayoutWidgetTest.php
 M tests/src/Unit/Sdc/MosaicComponentGraderTest.php
 M tests/src/Unit/Sdc/MosaicGlobalStylesScannerTest.php
 M tests/src/Unit/Sdc/MosaicPropShapeRegistryTest.php
 M tests/src/Unit/Sdc/PropShapeTest.php
 M tests/src/Unit/Service/MosaicPropValidatorTest.php
 M tests/src/Unit/Service/MosaicRendererCacheTest.php
 M tests/src/Unit/Service/MosaicRendererTest.php
 M tests/src/Unit/Smoke/Sprint50SmokeTest.php
 M tests/src/Unit/Smoke/Sprint60SmokeTest.php
?? js/src/builder/__tests__/MosaicPuckAdapterRepeater.test.ts
?? js/src/builder/__tests__/dragGate.test.ts
?? js/src/builder/__tests__/previewDefaults.test.ts
?? js/src/builder/__tests__/requiresParentClient.test.tsx
?? js/src/builder/__tests__/requiresParentWrap.test.ts
?? js/src/builder/fields/MosaicRepeaterField.tsx
?? js/src/builder/fields/__tests__/MosaicAdoptedPreviewBadge.test.tsx
?? js/src/builder/fields/__tests__/MosaicRepeaterField.test.tsx
?? js/src/builder/mosaicToast.ts
?? js/src/builder/requiresParentWrap.ts
?? src/Hook/MosaicLibrarySyncHooks.php
?? src/Sdc/MosaicAdoptionProfile.php
?? tests/modules/adopt_fixture/adopt_fixture.libraries.yml
?? tests/modules/adopt_fixture/adopt_fixture.mosaic-adopt.yml
?? tests/modules/adopt_fixture/css/adopt-base.css
?? tests/src/Kernel/Adopt/AdoptGlobalAssetsTest.php
?? tests/src/Kernel/Adopt/ExternalLibraryReadinessTest.php
?? tests/src/Kernel/Adopt/MosaicAdoptionProfileTest.php
?? tests/src/Kernel/Adopt/MosaicLibrarySyncTest.php
?? tests/src/Kernel/Adopt/PreviewDefaultsTest.php
?? tests/src/Kernel/Adopt/RepeaterDescriptorTest.php
?? tests/src/Kernel/Adopt/RequiresParentSaveTest.php
?? tests/src/Kernel/Adopt/RequiresParentTest.php
?? tests/src/Kernel/Adopt/PropFillsRenderTest.php
?? js/src/builder/propFills.ts
?? js/src/builder/fields/MosaicFillField.tsx
?? js/src/builder/__tests__/propFills.test.ts
?? js/src/builder/__tests__/propFillsRoundTrip.test.ts
?? js/src/builder/fields/__tests__/MosaicFillField.test.tsx
```
> CHECKPOINT-15 (P16) delta: **+6 new paths** (propFills.ts, MosaicFillField.tsx, 3 Vitest, PropFillsRenderTest.php)
> + modified `src/Value/ComponentInstance.php`, `src/Service/MosaicRenderer.php`, `src/Controller/CanvasPreviewController.php`,
> `js/src/builder/{MosaicPuckAdapter,tierBOptimistic}.ts`, `js/src/shared/types/schema.ts`, `mosaic.libraries.yml` (→1.0.77),
> `js/dist/{builder.js c2c99527, frontend-editor.js 5a64691b}` rebuilt. **Count now 84.**
>
> CHECKPOINT-16 (P17) delta: TEST FILES ONLY — no new paths, no `src`/JS/dist change. Modified
> `tests/src/Functional/{MosaicTextSmokeTest,MosaicSchemaVersionRenderTest,Adopt/MosaicLibraryChangesReportTest}.php`
> (the 5 B-FUNC-DRIFT reds; MosaicLibraryChangesReportTest was already listed, the other two are +2 to the
> tests set). **NEW GATE LAW: Functional FULL (76/0) is now part of every gate line.** Count stays 84 code
> paths (test-only edits to already-tracked files); dist stays 1.0.77.

## The one-line commit message (Arun pastes)
```
'ship #47: CP-ADOPT-7/7R adopt-any-SDC readiness + composition — P1 gap fixes (nullable-union prop classifier, never-blank labels, group->palette category, media-object, shadow-DOM SO-7 reason) + R9 core_version ^11.3||^12 + F-109 build + G9 shadow-DOM canvas hydration + WC#94/#95 (zone-picker re-anchor; external library re-grade on install) + 7R: SSR-on-insert (adopted preview resolves on mount) + global-asset attach (library base CSS/tokens in the SSR delta) + adoption-profile reader (<provider>.mosaic-adopt.yml: containers/repeaters/requiresParent/global_libraries/preview_defaults; found via any enabled module) + repeater UX (a single-child slot becomes an inline rail item-list: +Add/reorder/remove/min-max) + requires-parent (auto-wrap single / refuse several / palette needs-marker / H5 save guard) + preview defaults (library examples fill the canvas preview only + example badge, never saved content — WC#97) + the mosaic_intelligence scores-URL fix (§1.4); owned FE render byte-identical 14e6cb9c/b7756795, libs 1.0.75'
```

## The «ext» helper (SEPARATE — Arun's SITE repo, NOT the Mosaic module)
`web/modules/custom/mosaic_adopt_ext/`: `mosaic_adopt_ext.info.yml` · `mosaic_adopt_ext.libraries.yml`
(`base` → the library's shipped ESM bundle) · `«ext».mosaic-adopt.yml` (9 repeater families + requiresParent
+ containers + global_libraries + preview_defaults). Enabling it is a config write = Arun's action (done).

## After the ship
Tag stays **1.0.x-dev**. Arun runs **WALK-CP-ADOPT-7.md**; then tag **1.0.0** once the security advisory
is Approved. Remaining polish (post-ship): the rail per-prop example badge; owned-Tabs field unification
(1.0 keeps the proven array field).
