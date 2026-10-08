# SHIP #51 PLAN — E1: adopted-child slot field_map (one shared prop-schema resolver)

Parent ship #50 = `d18d26d` (mosaic HEAD, clean at fresh-read). Mosaic git READ-ONLY to the AI — Arun commits
from the single-quoted message below; the AI pushes evidence only. Drupal 11.4.5. Naming ban: «ext».

## Cause (quoted)
`MosaicPropValidator::childDescriptors()` (`src/Service/MosaicPropValidator.php:944`) read the child's prop set
from **`$plugin->getPropDefinitions()`** (`:947`) — which returns an **EMPTY** `{properties}` for an ADOPTED
SDC (adopted props live on the discovery definition, `getDefinition()['props']['properties']`). So a slot
`field_map` to an adopted child was rejected at save: *"slot '…' maps field '…' to '…' prop 'heading', which
does not exist."* Verified live on the «ext» accordion-item: `getPropDefinitions.properties = []` vs
`getDefinition.props.properties = [id,heading,headingLevel,expanded,content]`. Same class as the CP-9
x-allowed-schemes empty-adopted-defs fix.

## Fix — ONE shared resolver (the same source the manifest uses)
New `MosaicPropShapeRegistry::resolveSchema()` + `describeComponent()` centralise the F-108 resolution
(getPropDefinitions() for owned; the definition's `props` for adopted) in ONE place. The three prop-schema
consumers now read it:
- **validator** — `childDescriptors()` → `describeComponent($plugin->getPropDefinitions(), getDefinition())`
  (the E1 fix);
- **manifest** — `MosaicManifestBuilder::buildPropDescriptors()` → `describeComponent()` (was a private copy of
  the same F-108 branch; behaviour identical, now shared);
- **authoring/bind form** — `MosaicComponentAuthoringForm` reaches it transitively through
  `buildComponentDefaults()` → `buildPropDescriptors()`.
Owned components are unchanged (the plugin schema is used exactly as before).

## Every `getPropDefinitions()` consumer (grep'd) — status
| # | Consumer | Verdict |
|---|---|---|
| 1 | `MosaicPropValidator::childDescriptors()` :947 | **FIXED** (E1 — read getPropDefinitions() only) |
| 2 | `MosaicPropValidator::validate()` main path :341 | NOT a miss — adopted deliberately early-returns after a FULL-DEF media-schemes check (:333); adopted props are not deep-validated at save by design (render seeds enum defaults — A2). Left unchanged. |
| 3 | `MosaicManifestBuilder::buildPropDescriptors()` :316 | Already had the F-108 fallback — **refactored to the shared resolver** (identical behaviour). |
| 4 | `ManifestController` :104 | Feeds buildComponentEntry → buildPropDescriptors (shared). Correct. |
| 5 | `MosaicLayoutWidget` :733 | Feeds buildComponentEntry → buildPropDescriptors (shared). Correct. |
| 6 | `MosaicComponentAuthoringForm` :557 | Feeds buildComponentDefaults → buildPropDescriptors (shared). Correct. |
| 7 | `MosaicComponentPluginBase` :57 | OWNED plugin resolving its OWN schema (adopted use core SdcComponentPlugin). Owned-only — no fix. |
| 8 | `MosaicCapabilityAudit::propertiesFor()` :103 | ALREADY has its own getPropDefinitions()→definition fallback. Not a miss; left as-is. |
| 9 | `MosaicSchemaDrift::schemaOf()` :138 | ALREADY has the F-108 fallback. Changing it would alter the stored drift SIGNATURE (false drift on existing nodes) — must NOT change; left as-is. |

**Only consumer #1 missed adopted props. #3 was consolidated into the shared resolver; the rest already
handled adopted (or are owned-only / must-not-touch).**

## FULL verbatim `git status --short` (5 files)
```
 M src/Sdc/MosaicPropShapeRegistry.php
 M src/Service/MosaicManifestBuilder.php
 M src/Service/MosaicPropValidator.php
 M tests/src/Functional/Adopt/ReferenceCardRenderTest.php
 M tests/src/Kernel/Adopt/SlotBindingValidationTest.php
```
**Count: 5** (3 src + 2 tests, PHP only). js/dist UNCHANGED (builder.js `21376a245c0e…`, dated #50).

## Cells
- Kernel `SlotBindingValidationTest::testAdoptedChildFieldMapPasses` — an adopted parent's slot bound to a View
  with an ADOPTED child (`mosaic_reference_library:ref_accordion_item`) + field_map `title→title` now VALIDATES
  (pre-fix: *"prop 'title' … does not exist"*). **RED-proved:** with the fix reverted the cell fails with that
  exact message; restored → green.
- Kernel `SlotBindingValidationTest::testOwnedChildFieldMapUnchanged` — an owned child's real-prop field_map
  still passes and a truly-missing owned prop is still rejected (owned path untouched). Stayed green under the
  revert (owned-only).
- Functional `ReferenceCardRenderTest::testAdoptedChildSlotBindingSavesViaForm` — an adopted-child slot binding
  SAVES through the node form (no "does not exist"; HTTP 200).

## TIGHT GATE (full, 11.4.5)
Kernel+Unit FULL **3186/0** · Functional FULL **90/0** · Vitest **761/1** (B-101, PHP-only unchanged) ·
tsc **clean** · phpcs **0 errors** · phpstan **0 new** (per-file clean; differential `analyse src` 207 HEAD →
185 with fix = −22, no error introduced) · region-shasum **14e6cb9c…3954** verbatim · style-shasum
**b7756795…ca982 4354 10** verbatim · served==built **21376a245c0e…** (dist unchanged) · headed film
`films/cp-adopt-9r-ext/E-slot-render.png` (the «ext» accordion's slot bound to a View renders both rows as
«ext» CARDS — child = «ext» Card, title→heading — no owned-child workaround).

## Single-quoted commit message
```
'ship #51: E1 rider - a slot field_map to an ADOPTED child was wrongly rejected at save ("prop does not exist") because MosaicPropValidator::childDescriptors() read getPropDefinitions() which is empty for adopted SDCs; fix routes the validator, the manifest and the authoring form through ONE shared prop-schema resolver (MosaicPropShapeRegistry::resolveSchema/describeComponent) that falls back to the definition props for adopted and leaves owned unchanged; adopted-child slot bindings now save and render View rows; Kernel+Unit 3186/0, Functional 90/0, Vitest 761/1-pre, owned shasums verbatim 14e6cb9c/b7756795, dist unchanged builder.js 21376a'
```

## Rehearsal impact
WALK-M1 step E updated to the «ext» Card child (no workaround). Finding E1 in REPORT-REHEARSAL-EXT.md is now
FIXED (ship #51). The ADOPT milestone's one open code item is closed.
