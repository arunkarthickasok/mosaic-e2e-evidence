# SHIP #44 PLAN — CP-ADOPT-4 P1a + P1b server (hybrid render + palette opens + canvas assets)

Accumulates on ship #43 (`75b3039`). Mosaic git READ-ONLY — the ceremony add block for Arun's human commit.
**14 files: 9 modified + 5 new** (the `adopt_fixture` test module = 3 files). **PHP + YAML + Twig-fixture only
— NO dist / NO libs** (adopted route through the existing Tier-B client; the client SSR-attachments + dist are
CHECKPOINT-2). The P1b-client (live canvas render) is deferred; the P1b SERVER slice is complete + filmed.

## New files (5)
```
tests/modules/adopt_fixture/adopt_fixture.info.yml                         non-Mosaic fixture module (adopted provider)
tests/modules/adopt_fixture/components/adopt_widget/adopt_widget.component.yml   variant enum + required slot + raw prop
tests/modules/adopt_fixture/components/adopt_widget/adopt_widget.twig       fixture SDC template (library owns markup)
tests/src/Kernel/Adopt/HybridRenderTest.php                                P1a: adopted renders via core element (4 cells)
tests/src/Kernel/Adopt/PaletteOpenTest.php                                 P1b: palette opens + governance + SSR (4 cells)
```

## Modified files (9)
```
src/Service/MosaicRenderer.php               hybrid switch (page + SSR): owned Twig / adopted core element
src/Sdc/ComponentDefinition.php              adopt_palette = grade != blocked (+ props/slotRules from ADOPT-2/3)
src/Sdc/SdcComponentDiscovery.php            adopted eligible unless Blocked (+ required threading)
src/Service/MosaicComponentGovernance.php    no-library adopted → not authorable (opt-in safe default)
src/Service/MosaicManifestBuilder.php        adopted requires_ssr_preview = TRUE (Tier-B routing)
src/Plugin/Field/FieldWidget/MosaicLayoutWidget.php   attach adopted SDC libs to the canvas + config cache tag (R11)
tests/src/Kernel/Adopt/AdoptedDescriptorParityTest.php   oracle-change (adopted palette-eligible)
tests/src/Unit/Sdc/SdcComponentDiscoveryTest.php         oracle-changes (palette-eligibility invariant)
tests/src/Unit/Smoke/Sprint02SmokeTest.php               oracle-change (Ready adopted eligible)
```

## `git add --dry-run` verdict — every file trackable
All 5 new (incl. the 3 adopt_fixture files) return `add '<path>'` (0 ignored). The journey
`js/e2e/journeys/cp-adopt-4.spec.ts` is gitignored (`js/e2e/`); the album frames are the artifact (evidence repo).

## EXCLUSIONS (never staged)
`AI/` (symlink); `js/*.log`, `js/e2e/`; `assets/`; the scratch fixture **node 988** (dev content, not config).

## Gates at plan time
Unit FULL 2762/2762; Kernel FULL 222/222; Vitest 552 pass / 1 pre-existing B-101 (no JS change); phpcs 0 on the
change set; phpstan L6 = MosaicRenderer 14 + MosaicLayoutWidget 28 errors, ALL PRE-EXISTING (identical counts in
HEAD; ADOPT-4 adds zero); byte-identical `14e6cb9c…` before==after; libs unchanged 1.0.31.

## Deferred (ledgered — CHECKPOINT-2)
The P1b-client: `renderSingleComponent`/`CanvasPreviewController` return `{html, attachments}`; the Tier-B
client attaches libraries once (dedupe R5) + `Drupal.attachBehaviors` (R10) → dist → BUMP-LIBS; the live
builder-canvas render of adopted + the adopted-with-slots-on-canvas composition.

## Proposed commit message (single quotes)
```
git commit -m 'ship #44: CP-ADOPT-4 the first outside component becomes usable - hybrid renderer (owned direct-Twig byte-identical; adopted via core component element, #attributes-only), the palette opens for adopted Ready/Attention of an ENABLED library (adopted default OFF, governance-gated), the canvas attaches adopted SDC libraries + routes adopted to Tier-B SSR (hybrid); olivero:teaser renders on the page with its own markup + a Mosaic child slot; byte-identical owned, no dist; adds tests/modules/adopt_fixture'
```

## STOP — Arun eye-test (WALK-CP-ADOPT-4.md, 2 filmed steps), then the human commit closes the ship #44 server slice.
