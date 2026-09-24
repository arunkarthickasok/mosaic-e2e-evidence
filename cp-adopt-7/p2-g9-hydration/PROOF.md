# CP-ADOPT-7 P2 — G9 canvas hydration (shadow-DOM web components)

## Oracles (IDENTICAL before==after)
REGION 14e6cb9c17dc61b90a86dd97d8957ae462d789ff854d3523ae581010a43e0dec 3954
STYLE  b7756795ff2234b5793c3533f48c3a70b34c37989b946756f20b78aa9aaca982 4354 10

## Mechanism
The external library ships one ESM per component (`libraryOverrides.js.<comp>.js.attributes.type=module`),
so core auto-attaches `core/components.«ext»--<comp>`; no Drupal.behaviors; each ESM customElements.define()s
a shadow-DOM element. The per-component ESM is self-contained (only a relative shared-chunk import, no bare
specifiers) → loads standalone, no import map.

## G9 fix
- SERVER (MosaicRenderer::renderSingleComponent): renderInIsolation DISCARDED bubbled metadata (the bug) →
  now renders in a captured render context + pops BubbleableMetadata; harvestAttachments resolves each
  library name → css/js URLs (library.discovery + file_url_generator) carrying the ESM `module` flag.
  «ext» card SSR now → js:[{src:.../card.js, module:true}] (was libraries=[]).
- CLIENT (mosaicAttach): ensureJs injects <script type="module"> for module:true, deduped by src.
- SMOOTHNESS: [data-mosaic-hydrating] :not(:defined){opacity:0} + :defined crossfade; 3s safety reveal.

## Headed PAGE hydration proof (standalone harness, NO dev writes)
Navigate to a public dev page (serves the static ESM same-origin), inject <script type=module src=card.js>
+ <«ext»-card><div slot="footer">…</div> client-side, wait for upgrade:
```
scriptState=loaded  defined=true  hasShadowRoot=true  display=block  box=1280x62  slotAssigned=true
```
Element upgrades for real; shadow root + shadow CSS; light-DOM slot content projects. Film: hydrated.png.

## Cells
Vitest mosaicAttach (12): ESM <script type=module> once + dedupe; classic stays classic; re-render
once-guard; anti-flash guard set for a web-component node, absent for built-ins.
Kernel ExternalLibraryReadinessTest::testExternalSsrHarvestsEsmLibraryG9 (env-gated): SSR carries module:true JS.

## Needs Arun (dev) — builder-canvas headed films
Enable the external library in Mosaic (Component libraries → tick → Save), place a card in the builder,
film: hydrates on canvas (shadow styling, no flash), slot drop zone hittable + banner geometry, iframe +
FE dialog. These are the P3 oracle-walk Pillar-D steps; the mechanism is landed + page-proven here.

## Gates
Kernel+Unit 3104/0 (8638 assertions) · Vitest 654/1-B101 · tsc clean · phpcs 0 · phpstan 4-pre-existing(0 new) ·
oracles IDENTICAL · dist 1.0.65→1.0.66 (builder ca887186, frontend-editor 161614c8, renderer byte-identical).
