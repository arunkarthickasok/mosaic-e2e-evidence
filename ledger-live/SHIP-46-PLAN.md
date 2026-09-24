# SHIP-46-PLAN — CP-ADOPT-6 arc (P1–P6) → ship #46

> MOSAIC git READ-ONLY for the AI; **Arun commits**. Nothing was staged by the AI.
> The whole CP-ADOPT-6 arc is one uncommitted working set (P1–P6 landed across passes,
> never committed) — this is that set, ready for a single ship.

## The verdict
**Every changed path is a ship file — INCLUDE all of them.** `git check-ignore` was run
on all 59 paths: **zero are ignored**. The only exclusions are the .gitignore cruft
classes (`*.log`, `js/e2e.zip`, `js/esc-probe.config.ts`, `assets/`, `js/e2e/`,
`scripts/qa/sprint-*`, `AI`, `docs/`, `sprints/`) — none of which appear in the set.
The `assets/` pattern is anchored (`/assets/`, `js/assets/`) so it can NEVER catch the
shipped `js/dist/assets/` worker chunk (verified).

> **PASS 7 (WC#92 slot-only save + WC#93 picker geometry/keyboard):** count **63** — the SAME 63-path
> set as the PASS 6 verbatim list below (`git status --short -uall | wc -l` = 63; `git check-ignore` on
> the changed src/test/dist/libraries paths ⇒ none ignored). This pass modified paths ALREADY in the set:
> `src/Service/MosaicPropValidator.php`, `js/src/builder/fields/MosaicSlotZone.tsx`,
> `js/src/builder/MosaicPuckAdapter.ts`, `js/src/builder/fields/MosaicZonePicker.tsx` (+ its test),
> `js/src/builder/fields/__tests__/MosaicSlotZonePicker.test.tsx`,
> `tests/src/Kernel/Adopt/SlotOnlyPlacementTest.php`, `mosaic.libraries.yml`, and the two dist bundles —
> **no new path added**. dist **1.0.62 → 1.0.63** (builder `a9cf2a9c→03d1afea`, frontend-editor
> `93103f23→43e9d9c6`, renderer `9c7f9320` byte-identical; served==built).
>
> **PASS 6 (WC#89 + WC#90 + WC#91 + fallback-notice ruling):** count **63** (33 M + 30 untracked; no new
> file — all modified existing). dist 1.0.61→1.0.62. Full verbatim `git status --short -uall` (63):
> ```
>  M .gitignore
>  M js/dist/builder.js
>  M js/dist/frontend-editor.js
>  M js/src/builder/MosaicPuckAdapter.ts
>  M js/src/builder/__tests__/MosaicPuckAdapterSlotOnly.test.ts
>  M js/src/builder/dsdShadow.ts
>  M js/src/builder/fields/MosaicBoundSlot.tsx
>  M js/src/builder/fields/MosaicSlotZone.tsx
>  M js/src/builder/fields/htmlToReactSlots.tsx
>  M js/src/builder/index.tsx
>  M js/src/builder/tierBOptimistic.ts
>  M js/src/frontend-editor/FrontendBuilderDialog.tsx
>  M js/src/shared/types/schema.ts
>  M mosaic.libraries.yml
>  M mosaic.routing.yml
>  M mosaic.services.yml
>  M schema/mosaic_layout_value.schema.json
>  M src/Controller/CanvasPreviewController.php
>  M src/Entity/MosaicComponentLibrary.php
>  M src/Form/MosaicComponentLibrariesForm.php
>  M src/Hook/MosaicHooks.php
>  M src/Plugin/Field/FieldWidget/MosaicLayoutWidget.php
>  M src/Sdc/ComponentDefinition.php
>  M src/Service/MosaicComponentGovernance.php
>  M src/Service/MosaicPropValidator.php
>  M src/Service/MosaicRenderer.php
>  M src/Value/ComponentInstance.php
>  M tests/src/Kernel/Adopt/PaletteOpenTest.php
>  M tests/src/Kernel/Component/MosaicCarouselRenderTest.php
>  M tests/src/Unit/Plugin/Field/MosaicLayoutWidgetTest.php
>  M tests/src/Unit/Service/MosaicRendererCacheTest.php
>  M tests/src/Unit/Service/MosaicRendererTest.php
>  M tests/src/Unit/Smoke/Sprint67SmokeTest.php
>  ?? js/src/builder/__tests__/MosaicDriftNotices.test.ts
>  ?? js/src/builder/__tests__/MosaicPuckAdapterMissing.test.ts
>  ?? js/src/builder/__tests__/MosaicSlotOnlyDrawer.test.ts
>  ?? js/src/builder/__tests__/WC83BindingRoundtrip.test.ts
>  ?? js/src/builder/__tests__/WC88InsertIntoSlot.test.ts
>  ?? js/src/builder/__tests__/mosaicAttach.test.ts
>  ?? js/src/builder/fields/MosaicZonePicker.tsx
>  ?? js/src/builder/fields/__tests__/MosaicPickerCatalog.test.tsx
>  ?? js/src/builder/fields/__tests__/MosaicSlotZonePicker.test.tsx
>  ?? js/src/builder/fields/__tests__/MosaicZonePicker.test.tsx
>  ?? js/src/builder/fields/mosaicPickerCatalog.ts
>  ?? js/src/builder/mosaicAttach.ts
>  ?? src/Controller/MosaicLibraryChangesController.php
>  ?? src/Sdc/MosaicBehaviourKeys.php
>  ?? src/Sdc/MosaicGlobalStylesScanner.php
>  ?? src/Service/MosaicSchemaDrift.php
>  ?? tests/modules/adopt_fixture/components/adopt_widget/adopt_widget.css
>  ?? tests/modules/adopt_fixture/components/adopt_widget_v2/adopt_widget_v2.component.yml
>  ?? tests/modules/adopt_fixture/components/adopt_widget_v2/adopt_widget_v2.css
>  ?? tests/modules/adopt_fixture/components/adopt_widget_v2/adopt_widget_v2.twig
>  ?? tests/src/Functional/Adopt/MosaicLibraryChangesReportTest.php
>  ?? tests/src/Functional/Adopt/SchemaSignPresaveTest.php
>  ?? tests/src/Kernel/Adopt/CacheTagUnificationTest.php
>  ?? tests/src/Kernel/Adopt/FallbackRenderTest.php
>  ?? tests/src/Kernel/Adopt/GlobalStylesFlagTest.php
>  ?? tests/src/Kernel/Adopt/SchemaDriftTest.php
>  ?? tests/src/Kernel/Adopt/SlotOnlyPlacementTest.php
>  ?? tests/src/Kernel/Adopt/SsrAttachmentsTest.php
>  ?? tests/src/Unit/Sdc/MosaicBehaviourKeysTest.php
>  ?? tests/src/Unit/Sdc/MosaicGlobalStylesScannerTest.php
> ```
>
> **PASS 5 (WC#88 insert FIXED+PROVEN headed):** count 62 -> **63** (+1 WC88InsertIntoSlot.test.ts). dist 1.0.60->1.0.61. The picker is whole (click+open+choose+insert). WC#86+87+88 all fixed; ship #46 awaits Arun re-walk.
>
> **PASS 4 (WC#86 real-click FIXED+PROVEN headed; WC#88 insert flagged):** count 62 (no new file; WC#86 fix modified MosaicZonePicker.tsx). dist 1.0.59->1.0.60. Ship #46 stays BLOCKED on WC#88 (picker insert does not land).
>
> **PASS 3 (WC#87 fixed; WC#86 UNPROVEN):** count 60 -> **62** (+2 WC#87 files: mosaicPickerCatalog.ts + MosaicPickerCatalog.test.tsx). dist 1.0.58->1.0.59. WC#86 no fix shipped (UNPROVEN). Ship #46 stays BLOCKED on WC#86.
>
> **PASS 2 (WC#85/86/87):** count unchanged at **60**. WC#85 (fallback declared slot order) modified
> already-tracked files (`src/Service/MosaicRenderer.php`, `tests/.../FallbackRenderTest.php`); no new
> file, no JS/dist change (PHP-only). WC#86 UNPROVEN (no code change). WC#87 deferred. **Ship #46 stays
> BLOCKED on WC#86 (unproven) + WC#87 (deferred).**

## Counts (updated after CP-ADOPT-6R rider — WC#83 + WC#84)
- Tracked-modified (M): **33**
- Untracked NEW (`-uall`): **27** (rider added `js/src/builder/__tests__/WC83BindingRoundtrip.test.ts`)
- **Ship total: 60 files** (was 59; +1 rider test)
- Rider also re-touched (already in M): `src/Service/MosaicRenderer.php` (renderFallback
  renders bound slots), `js/src/builder/MosaicPuckAdapter.ts` (missing-card "{Slot} — bound
  to {View}" + defaultProps hardening), `js/src/builder/fields/MosaicZonePicker.tsx` +
  `MosaicSlotZone.tsx` (WC#84 click fix + one affordance), `tests/.../FallbackRenderTest.php`
  (bound-slot cell), `mosaic.libraries.yml` (1.0.58), the two rebuilt dist bundles.
- Cruft excluded (gitignored, not in the set): `*.log`, `js/e2e.zip`,
  `js/esc-probe.config.ts`, `assets/` — 0 present.

## Full `git status --short -uall` (verbatim)
```
 M .gitignore
 M js/dist/builder.js
 M js/dist/frontend-editor.js
 M js/src/builder/MosaicPuckAdapter.ts
 M js/src/builder/__tests__/MosaicPuckAdapterSlotOnly.test.ts
 M js/src/builder/dsdShadow.ts
 M js/src/builder/fields/MosaicBoundSlot.tsx
 M js/src/builder/fields/MosaicSlotZone.tsx
 M js/src/builder/fields/htmlToReactSlots.tsx
 M js/src/builder/index.tsx
 M js/src/builder/tierBOptimistic.ts
 M js/src/frontend-editor/FrontendBuilderDialog.tsx
 M js/src/shared/types/schema.ts
 M mosaic.libraries.yml
 M mosaic.routing.yml
 M mosaic.services.yml
 M schema/mosaic_layout_value.schema.json
 M src/Controller/CanvasPreviewController.php
 M src/Entity/MosaicComponentLibrary.php
 M src/Form/MosaicComponentLibrariesForm.php
 M src/Hook/MosaicHooks.php
 M src/Plugin/Field/FieldWidget/MosaicLayoutWidget.php
 M src/Sdc/ComponentDefinition.php
 M src/Service/MosaicComponentGovernance.php
 M src/Service/MosaicPropValidator.php
 M src/Service/MosaicRenderer.php
 M src/Value/ComponentInstance.php
 M tests/src/Kernel/Adopt/PaletteOpenTest.php
 M tests/src/Kernel/Component/MosaicCarouselRenderTest.php
 M tests/src/Unit/Plugin/Field/MosaicLayoutWidgetTest.php
 M tests/src/Unit/Service/MosaicRendererCacheTest.php
 M tests/src/Unit/Service/MosaicRendererTest.php
 M tests/src/Unit/Smoke/Sprint67SmokeTest.php
?? js/src/builder/__tests__/MosaicDriftNotices.test.ts
?? js/src/builder/__tests__/MosaicPuckAdapterMissing.test.ts
?? js/src/builder/__tests__/MosaicSlotOnlyDrawer.test.ts
?? js/src/builder/__tests__/mosaicAttach.test.ts
?? js/src/builder/fields/MosaicZonePicker.tsx
?? js/src/builder/fields/__tests__/MosaicSlotZonePicker.test.tsx
?? js/src/builder/fields/__tests__/MosaicZonePicker.test.tsx
?? js/src/builder/mosaicAttach.ts
?? src/Controller/MosaicLibraryChangesController.php
?? src/Sdc/MosaicBehaviourKeys.php
?? src/Sdc/MosaicGlobalStylesScanner.php
?? src/Service/MosaicSchemaDrift.php
?? tests/modules/adopt_fixture/components/adopt_widget/adopt_widget.css
?? tests/modules/adopt_fixture/components/adopt_widget_v2/adopt_widget_v2.component.yml
?? tests/modules/adopt_fixture/components/adopt_widget_v2/adopt_widget_v2.css
?? tests/modules/adopt_fixture/components/adopt_widget_v2/adopt_widget_v2.twig
?? tests/src/Functional/Adopt/MosaicLibraryChangesReportTest.php
?? tests/src/Functional/Adopt/SchemaSignPresaveTest.php
?? tests/src/Kernel/Adopt/CacheTagUnificationTest.php
?? tests/src/Kernel/Adopt/FallbackRenderTest.php
?? tests/src/Kernel/Adopt/GlobalStylesFlagTest.php
?? tests/src/Kernel/Adopt/SchemaDriftTest.php
?? tests/src/Kernel/Adopt/SlotOnlyPlacementTest.php
?? tests/src/Kernel/Adopt/SsrAttachmentsTest.php
?? tests/src/Unit/Sdc/MosaicBehaviourKeysTest.php
?? tests/src/Unit/Sdc/MosaicGlobalStylesScannerTest.php
```

## What each cluster is (the CP-ADOPT-6 arc)
- **Pillar H (P1)** — graceful degradation: `MosaicRenderer` fallback + governance,
  `MosaicComponentGovernance::isAvailable`, `MosaicLibraryChangesController` report,
  the "Library missing" card (adapter + index + FE dialog), `FallbackRenderTest`.
- **Pillar G (P2)** — library drift: `MosaicBehaviourKeys`, `MosaicSchemaDrift`,
  `MosaicHooks::signLayout`, `ComponentInstance` sig, the schema file, drift fixtures,
  `SchemaDriftTest` + `MosaicBehaviourKeysTest` + `SchemaSignPresaveTest`.
- **R5/R10 (P3)** — SSR attachments attach-once + behaviors: renderer harvest,
  controller css/js resolution, `mosaicAttach.ts`, DsdPreview/tierBOptimistic/MosaicBoundSlot
  wiring, `SsrAttachmentsTest` + `mosaicAttach.test.ts`. (dsdShadow tsc fix rides here.)
- **SO-7 (P4)** — global-styles flag: `MosaicGlobalStylesScanner` + libraries-form reason
  + 2 css fixtures, `MosaicGlobalStylesScannerTest` + `GlobalStylesFlagTest`.
- **Drift notices + SO-2 (P5)** — `driftByNode` + widget/FE-endpoint delivery + panel field
  (`MosaicDriftNotices.test.ts`); the **slot_only SIDECAR_KEYS fix** (revived the dormant
  feature) + server root-reject (`MosaicPropValidator`, `SlotOnlyPlacementTest`) + client
  drawer exclusion (`MosaicSlotOnlyDrawer.test.ts`).
- **P6** — cache-tag unification (`MosaicComponentLibrary::cacheTagFor` / `LIST_CACHE_TAG`,
  `CacheTagUnificationTest`) + the per-zone add-picker (`MosaicZonePicker` +
  `MosaicSlotZonePicker.test.tsx` + `MosaicZonePicker.test.tsx`) + `.gitignore` cruft rules.
- **dist**: `js/dist/builder.js` + `js/dist/frontend-editor.js` rebuilt; `mosaic.libraries.yml`
  1.0.13-era → **1.0.57**. (`renderer.js` is byte-identical across the arc — not in the set.)

## The commit (Arun runs; single-quoted message)
```
git add -A
git commit -m 'CP-ADOPT-6: fallback + card + report (Pillar H); drift signature + classes + notices (Pillar G); SSR attachments attach-once + behaviors (R5/R10); SO-7 global-styles flag; SO-2 per-zone picker + slot_only fix; cache-tag unification; .gitignore'
```
