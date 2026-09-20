# SHIP-45-PLAN — CP-ADOPT-5 (the ADOPT-5 arc → ship #45)

> MOSAIC git is READ-ONLY for the AI; **Arun executes the commit**. This is the
> plan: the exact changeset, the .log exclusions, and a single-quoted message.

## Counts
- Tracked-modified (M): 38
- Untracked code (NEW, to add): 17
- Ship total: 55 files
- Untracked .log cruft to EXCLUDE: 170

## SdcComponentPlugin.php
- PRISTINE — unchanged vs HEAD (not in git status). ✓

## Tracked-modified (M) — `git add` these
```
MOSAIC.md
css/mosaic-canvas-reset.css
css/mosaic-design-system.css
js/dist/builder.js
js/dist/frontend-editor.js
js/src/builder/BuilderApp.tsx
js/src/builder/MosaicPuckAdapter.ts
js/src/builder/__tests__/MosaicPuckAdapterColonType.test.ts
js/src/builder/__tests__/MosaicPuckAdapterSlotRoundTrip.test.ts
js/src/builder/__tests__/tierBOptimistic.test.ts
js/src/builder/fields/MosaicAdoptedPreview.tsx
js/src/builder/fields/MosaicDataSourceField.tsx
js/src/builder/tierBOptimistic.ts
js/src/shared/types/schema.ts
modules/mosaic_views/mosaic_views.services.yml
mosaic.libraries.yml
mosaic.routing.yml
mosaic.services.yml
schema/mosaic_layout_value.schema.json
src/Controller/CanvasPreviewController.php
src/Sdc/PropDescriptor.php
src/Sdc/PropShape.php
src/Service/MosaicDtcgParser.php
src/Service/MosaicManifestBuilder.php
src/Service/MosaicPropValidator.php
src/Service/MosaicRenderer.php
src/Service/MosaicTokenBridgeService.php
src/Service/MosaicTokenManager.php
src/Value/ComponentInstance.php
tests/src/Functional/MosaicDesignTokenTest.php
tests/src/Unit/Service/MosaicDtcgParserTest.php
tests/src/Unit/Service/MosaicRendererCacheTest.php
tests/src/Unit/Service/MosaicRendererTest.php
tests/src/Unit/Service/MosaicTokenBridgeServiceTest.php
tests/src/Unit/Service/MosaicTokenManagerTest.php
tests/src/Unit/Smoke/Sprint10SmokeTest.php
tests/src/Unit/Smoke/Sprint65SmokeTest.php
tests/src/Unit/Smoke/Sprint66SmokeTest.php
```

## Untracked code (NEW) — `git add` these
```
js/esc-probe.config.ts
js/src/builder/__tests__/MosaicPuckAdapterCapability.test.ts
js/src/builder/__tests__/MosaicPuckAdapterSlotOnly.test.ts
js/src/builder/fields/MosaicBoundSlot.tsx
js/src/builder/fields/MosaicSlotBindField.tsx
js/src/builder/fields/__tests__/MosaicBoundSlot.test.tsx
js/src/builder/fields/__tests__/MosaicDataSourceFieldLegacy.test.tsx
js/src/builder/fields/__tests__/MosaicSlotBindField.test.tsx
modules/mosaic_views/tests/src/Kernel/SlotBindingRenderTest.php
src/Service/MosaicCapabilityAudit.php
src/Value/SlotBinding.php
tests/src/Kernel/Adopt/BareRenderTest.php
tests/src/Kernel/Adopt/CapabilityAuditTest.php
tests/src/Kernel/Adopt/SlotBindingValidationTest.php
tests/src/Kernel/Component/PlainContentRenderTest.php
tests/src/Unit/Sdc/PropShapeCapabilityTest.php
tests/src/Unit/Value/SlotBindingTest.php
```

## EXCLUDE — untracked .log cruft + non-code (do NOT add; not gitignored → must be explicit)
check-ignore verdict: NONE of these are ignored (git check-ignore returns nothing),
so a bare `git add -A` WOULD wrongly stage them. Add code paths explicitly, or
`printf '%s
' *.log >> .git/info/exclude` first.
```
js/cp-edit13-proof.log
js/cr-016.log
js/d1-constraint-016.log
js/d2-presave-016.log
js/d2d3-016.log
js/d3-worker-016.log
js/d4-full-016.log
js/d4-full-016b.log
js/d4-smoke-016.log
js/d4-smokes-016.log
js/d4-smokes-016b.log
js/diag-fe-blankout.log
... (+158 more .log files)
assets/
js/e2e.zip
modules/mosaic_components/components/mosaic_plain_content/
modules/mosaic_views/src/Render/
src/Render/
```

## Commit message (single-quoted, for Arun to paste)
```
git commit -m 'ship #45: CP-ADOPT-5 adopt-any-SDC style ownership + typed slot binding + honest panels - Pillar E capability rules (Data/Breakpoint gated by prop kind, owned + adopted); SO-1 bare render + SO-4/5/6 cascade (tokens on owned-root, @scope donut, @layer mosaic-library) keep adopted libraries owning their look; H9 Views-into-slots (SlotBinding model + validation + server render + canvas bound-render + result line + bind panel); mosaic_plain_content chrome-free slot fill; WC#73 viewport-switch canvas-wipe fixed; byte-identical frontend 14e6cb9c/b7756795 held throughout, dist rebuilt, libs 1.0.49'
```
