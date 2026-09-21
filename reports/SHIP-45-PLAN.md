# SHIP-45-PLAN — CP-ADOPT-5 arc → ship #45 (regenerated, CP-ADOPT-5R PASS 2)

> MOSAIC git READ-ONLY for the AI; Arun commits. **esc-probe.config.ts EXCLUDED**.

## Folder verdict (the earlier question)
**INCLUDE all three** — they are the ADOPT-5 feature code, enumerated below:
```
modules/mosaic_components/components/mosaic_plain_content/:
  modules/mosaic_components/components/mosaic_plain_content/mosaic_plain_content.component.yml
  modules/mosaic_components/components/mosaic_plain_content/mosaic_plain_content.mosaic.yml
  modules/mosaic_components/components/mosaic_plain_content/mosaic_plain_content.twig
src/Render/ (H9 slot-binding boundary):
  src/Render/BoundSlotResult.php
  src/Render/NullSlotBindingRowProvider.php
  src/Render/SlotBindingRowProviderInterface.php
modules/mosaic_views/src/Render/ (Views provider):
  modules/mosaic_views/src/Render/ViewsSlotBindingRowProvider.php
```

## Counts
- Tracked-modified (M): 45
- Untracked code files (NEW, enumerated -uall): 25  (esc-probe.config.ts excluded)
- Ship total: 70 files
- Untracked .log cruft to EXCLUDE: 170

PASS 4 delta (WC#81 + rider, +2 files vs 68):
- M +2: `js/src/builder/useA11yAudit.ts` (emit violations only on change — no canvas
  remount / flicker) + `js/src/builder/__tests__/useA11yAudit.test.ts` (no-churn cells).
- Also re-touched (already in M): tierBOptimistic.ts (`_mosaic_slot_binding` excluded
  from SSR authoring), BuilderApp.tsx (puckOverrides stable via violationsRef),
  MosaicPuckAdapter.ts (bind-group heading + help), MosaicSlotBindField.tsx (bound
  label "{slot} — bound to {View}"), tierBOptimistic.test.ts (WC#81 cells),
  MosaicSlotBindField.test.tsx (rider cell), mosaic.libraries.yml (1.0.53),
  js/dist/{builder,frontend-editor}.js (rebuilt).
- e2e journeys (cp-adopt-5r-wc81, wc81-bind-repro) are gitignored (harness, not shipped).

PASS 3 delta (WC#79/#80, +2 files vs 66):
- M +1: `js/src/builder/fields/htmlToReactSlots.tsx` (bound adopted slot → MosaicBoundSlot)
- U +1: `js/src/builder/fields/__tests__/htmlToReactSlots.test.tsx` (new WC#80 cell)
- Also re-touched (already in M): tierBOptimistic.ts, MosaicAdoptedPreview.tsx,
  MosaicPuckAdapter.ts, tierBOptimistic.test.ts, Sprint66SmokeTest.php (oracle),
  mosaic.libraries.yml (1.0.52), js/dist/{builder,frontend-editor}.js (rebuilt).
- e2e journeys (cp-adopt-5r-wc79-80, -slot-child-matrix) are gitignored (harness, not shipped).

## SdcComponentPlugin.php
- PRISTINE — unchanged vs HEAD. ✓

## Tracked-modified (M)
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
js/src/builder/fields/SpacingControl.tsx
js/src/builder/fields/htmlToReactSlots.tsx
js/src/builder/tierBOptimistic.ts
js/src/builder/useA11yAudit.ts
js/src/builder/__tests__/useA11yAudit.test.ts
js/src/shared/types/schema.ts
modules/mosaic_views/mosaic_views.routing.yml
modules/mosaic_views/mosaic_views.services.yml
modules/mosaic_views/src/Controller/ViewsBrowserController.php
mosaic.libraries.yml
mosaic.routing.yml
mosaic.services.yml
schema/mosaic_layout_value.schema.json
src/Controller/CanvasPreviewController.php
src/Plugin/Field/FieldWidget/MosaicLayoutWidget.php
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
## Untracked code (NEW, enumerated) — git add these
```
js/src/builder/__tests__/MosaicPuckAdapterCapability.test.ts
js/src/builder/__tests__/MosaicPuckAdapterSlotOnly.test.ts
js/src/builder/fields/MosaicBoundSlot.tsx
js/src/builder/fields/MosaicSlotBindField.tsx
js/src/builder/fields/__tests__/MosaicBoundSlot.test.tsx
js/src/builder/fields/__tests__/MosaicDataSourceFieldLegacy.test.tsx
js/src/builder/fields/__tests__/MosaicSlotBindField.test.tsx
js/src/builder/fields/__tests__/htmlToReactSlots.test.tsx
modules/mosaic_components/components/mosaic_plain_content/mosaic_plain_content.component.yml
modules/mosaic_components/components/mosaic_plain_content/mosaic_plain_content.mosaic.yml
modules/mosaic_components/components/mosaic_plain_content/mosaic_plain_content.twig
modules/mosaic_views/src/Render/ViewsSlotBindingRowProvider.php
modules/mosaic_views/tests/src/Kernel/SlotBindingRenderTest.php
src/Render/BoundSlotResult.php
src/Render/NullSlotBindingRowProvider.php
src/Render/SlotBindingRowProviderInterface.php
src/Service/MosaicCapabilityAudit.php
src/Value/SlotBinding.php
tests/src/Kernel/Adopt/BareRenderTest.php
tests/src/Kernel/Adopt/CapabilityAuditTest.php
tests/src/Kernel/Adopt/SlotBindingValidationTest.php
tests/src/Kernel/Component/PlainContentRenderTest.php
tests/src/Kernel/MosaicLayoutWidgetSerializationTest.php
tests/src/Unit/Sdc/PropShapeCapabilityTest.php
tests/src/Unit/Value/SlotBindingTest.php
```
## EXCLUDE
```
js/esc-probe.config.ts   ← throwaway probe config
170 .log files (session cruft; NOT gitignored)
```
## Commit message (single-quoted)
```
git commit -m 'ship #45: CP-ADOPT-5 adopt-any-SDC style ownership + typed slot binding + honest panels - Pillar E capability rules; SO cascade keeps adopted libraries owning their look; H9 Views-into-slots (model + validation + server render + canvas bound-render + result line + human bind panel with View-field selects, auto-mapped, clean text); mosaic_plain_content; WC#73 viewport-wipe + WC#74 empty sections + WC#75 usable bind panel + WC#77 visible bound rows + WC#78 node-form-save crash + WC#79 slotted Tier-B child stuck on hourglass + WC#80 bound adopted slot blank on canvas + WC#81 binding change flickered the frame / no live update all fixed; children inside adopted slots preview via the same path as top level; a slot-binding change is an ordinary optimistic commit (excluded from the SSR authoring; the a11y audit emits only on change; puckOverrides referentially stable) so the affected zone alone swaps to/from bound rows with no canvas remount; bind panel gains a Data-binding heading + help + a "{slot} — bound to {View}" label; byte-identical frontend 14e6cb9c/b7756795, libs 1.0.53'
```
