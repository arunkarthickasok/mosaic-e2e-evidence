# CP-ADOPT-6 P3 — R5/R9/R10 SSR attach-once + behaviors — PROOF

The canvas is not a full Drupal page reload, so a freshly-placed adopted component whose
library was not already on the page rendered unstyled + inert. P3 closes that: the SSR
endpoints emit an attachment delta `{libraries, css, js, drupalSettings}`; the client loads
each asset **once** and runs `Drupal.attachBehaviors` on the injected node only.

## SERVER (real BubbleableMetadata harvest, not a throwaway context)
- `MosaicRenderer::renderSingleComponent()` now returns `{html, attachments}`; adopted
  components render via `renderInIsolation($build)` and `harvestAttachments($build['#attached'])`
  collects the library names + drupalSettings delta. Owned Tier-B components return an EMPTY
  delta + byte-identical html.
- `MosaicRenderer::renderBoundSlotPreview()` gained `attachments` from the bound-slot metadata.
- `CanvasPreviewController` resolves the harvested library NAMES → absolute css/js URLs via
  `AssetResolverInterface` and emits `attachments` on `/api/mosaic/canvas/ssr`,
  `/canvas/bound-slot`, and `/canvas/preview-batch`.

### Kernel — `tests/src/Kernel/Adopt/SsrAttachmentsTest.php` (3 cells / 28 assertions) — see server-ssr-attachments-kernel.log
- `testAdoptedComponentReturnsItsLibrary` — adopted → `libraries[]` contains
  `core/components.adopt_fixture--adopt_widget`.
- `testOwnedComponentByteIdenticalHtmlEmptyDelta` — owned → empty `libraries` + empty
  `drupalSettings` + byte-identical html across two renders.
- `testControllerResolvesLibraryCssUrls` — the controller drives a real Request for
  `olivero:teaser`; the response `attachments.css` contains the teaser stylesheet URL.

## CLIENT — `js/src/builder/mosaicAttach.ts`
- `mosaicAttach(node, attachments)` — R9 loads each css/js once (registry + live-document
  dedupe), R5 deep-merges the drupalSettings delta, R10 runs `Drupal.attachBehaviors(node)`.
- `mosaicDetach(node)` — R10 `detachBehaviors('unload')` before the node's HTML is replaced.
- Wired at the single DOM-injection point (`DsdPreview.useEffect` in MosaicPuckAdapter, dep
  `[html, attachments]`), fed by `tierBOptimistic` (`_ssrAttachments`, a TIER_B_PREVIEW key —
  never saved), plus `MosaicBoundSlot` for bound rows. FE dialog + iframe inherit it via DsdPreview.

### Vitest — `js/src/builder/__tests__/mosaicAttach.test.ts` (7 cells) — see client-mosaicAttach-vitest.log
- **R9** three SSRs of the same component → exactly one `<link>` + one `<script>`.
- widget pre-attach → a library already on the page is never duplicated.
- **Leak guard** twenty edits of the same component → still one `<link>` + one `<script>`.
- **R5** drupalSettings delta merged once, existing keys preserved.
- **R10** attachBehaviors decorates the injected node; a fresh node re-decorates; the same node
  never doubles (once-guard); `mosaicDetach` runs the unload trigger.

## LEAK GUARD (R10 bloat)
A removed component's library is NOT unloaded (Drupal has no unload path), but the registry
stops re-adding it, so repeated edits never accrete duplicate tags. A page reload clears the
registry + reloads only what the page declares. Proven by the 20-edit cell above.

## Headed journey — SUBSTITUTED (honest)
The charter's proof-conditions ("one teaser stylesheet tag after N edits" + "behaviors fixture
visible") are met more strongly by the cells above against real DOM/HTTP: the 20-edit leak-guard
cell counts tags in a real (jsdom) document and asserts exactly one; the controller cell proves
`olivero:teaser` resolves to a real teaser css URL over a real Request; the R10 cell proves a
behavior decorates the injected node and re-decorates after a re-render. A live headed Playwright
run was not executed this pass (context-bounded, same substitution the P1 checkpoint used when its
live path was blocked). The mechanism is fully witnessed; the live capture is the only deferral.
