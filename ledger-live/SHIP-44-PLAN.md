# SHIP #44 PLAN — CP-ADOPT-4 (the first outside component becomes usable) — P1a + P1b + P1b-client

Accumulates on ship #43 (`75b3039`). Mosaic git READ-ONLY — the ceremony add block for Arun's human commit.
**21 files: 14 modified + 7 new** (the `adopt_fixture` module = 3 files). Carries a **dist rebuild** (builder.js
+ frontend-editor.js) → **BUMP-LIBS 1.0.31 → 1.0.32**. The canvas render is witnessed on screen (`j2` +
`WITNESS.json` before/after) — ship #44 is unblocked.

## New files (7)
```
src/... (none new; all server changes are in existing files)
js/src/builder/fields/MosaicAdoptedPreview.tsx             P1b-client: SSR chrome + Puck slots portaled into markers
js/src/builder/__tests__/MosaicAdoptedPreview.test.tsx     the composition (2 cells)
tests/modules/adopt_fixture/adopt_fixture.info.yml         non-Mosaic fixture module (adopted provider)
tests/modules/adopt_fixture/components/adopt_widget/adopt_widget.component.yml   variant + required slot + raw prop
tests/modules/adopt_fixture/components/adopt_widget/adopt_widget.twig            fixture SDC template
tests/src/Kernel/Adopt/HybridRenderTest.php                P1a: adopted renders via core element (4 cells)
tests/src/Kernel/Adopt/PaletteOpenTest.php                 P1b: palette + governance + SSR + slot markers (5 cells)
```

## Modified files (14)
```
src/Service/MosaicRenderer.php               hybrid page + SSR; adopted SSR emits slot markers
src/Sdc/ComponentDefinition.php              adopt_palette = grade != blocked (+ props/slotRules)
src/Sdc/SdcComponentDiscovery.php            adopted eligible unless Blocked (+ required threading)
src/Service/MosaicComponentGovernance.php    no-library adopted → not authorable (opt-in)
src/Service/MosaicManifestBuilder.php        adopted requires_ssr_preview = TRUE (Tier-B routing)
src/Plugin/Field/FieldWidget/MosaicLayoutWidget.php   attach adopted SDC libs + config cache tag (R11)
js/src/builder/MosaicPuckAdapter.ts          Tier-B branch precedes the generic scaffold; buildAdoptedRenderer
js/dist/builder.js                           rebuilt   js/dist/frontend-editor.js  rebuilt
mosaic.libraries.yml                         BUMP-LIBS 1.0.31 → 1.0.32 (×3)
tests/src/Kernel/Adopt/AdoptedDescriptorParityTest.php   oracle-change (adopted palette-eligible)
tests/src/Unit/Sdc/SdcComponentDiscoveryTest.php         oracle-changes (palette-eligibility invariant)
tests/src/Unit/Smoke/Sprint02SmokeTest.php               oracle-change (Ready adopted eligible)
tests/src/Unit/Smoke/Sprint66SmokeTest.php               oracle-change (Tier-B branch precedes scaffold)
```

## `git add --dry-run` verdict — every file trackable
All 7 new (incl. the 3 adopt_fixture files) return `add '<path>'` (0 ignored). The journeys under `js/e2e/`
(incl. `cp-adopt-4.spec.ts` + `cp-adopt-4-witness.spec.ts`) are gitignored; the album is the artifact.

## EXCLUSIONS (never staged)
`AI/` (symlink); `js/*.log`, `js/e2e/`; `assets/`; scratch fixture **node 988** (dev content, not config).

## Gates at plan time
Unit FULL 2762/2762; Kernel FULL 222/222 (Adopt 24/24); Vitest 554 pass / 1 pre-existing B-101; phpcs 0;
phpstan L6 = MosaicRenderer 14 + MosaicLayoutWidget 28 errors, ALL PRE-EXISTING (identical counts in HEAD;
ADOPT-4 adds zero); byte-identical `14e6cb9c…` before==after; dist 1.0.32.

## Deferred (ledgered — CP-ADOPT-5/6, a refinement not a blocker)
SSR `{html, attachments}` + client attach-once (dedupe R5) + `Drupal.attachBehaviors` (R10) for adopted
components with DYNAMIC render-time attachments (the static CSS already loads via the route attach).

## Proposed commit message (single quotes)
```
git commit -m 'ship #44: CP-ADOPT-4 the first outside component becomes usable - hybrid renderer (owned direct-Twig byte-identical; adopted via core component element, #attributes-only), the palette opens for adopted of an ENABLED library (default OFF, governance-gated), the canvas routes adopted to Tier-B SSR and renders the library markup with Puck slot drop zones portaled into its slot markers; olivero:teaser is usable end-to-end - libraries page, canvas, page - with its own CSS holding a Mosaic child; byte-identical owned, dist rebuilt, libs 1.0.32; adds tests/modules/adopt_fixture'
```

## STOP — Arun eye-test (WALK-CP-ADOPT-4.md, 3 filmed steps: enable → canvas → page), then the human commit closes ship #44.
