# REPORT — CP-ADOPT-4 (Pillar D — render via core component element, hybrid; canvas assets; palette opens)

Evidence base: ADOPT-DESIGN.md RATIFIED (§3.D), MOSAIC-BIBLE.md. Mosaic git READ-ONLY. **Report-only — no build
until the reviewer audits §P0.** HEAD `75b3039` (ship #43). Core **11.4.5**. Paths relative to
`web/modules/custom/mosaic/`.

---

## §P0 — DERIVATION (report-only)

### P0.1 The current render path, end to end
Owned components render by **direct Twig**, not the core component element:
- `MosaicRenderer::renderNode()` resolves the template via `$plugin->getTemplatePath()` (the SDC id, e.g.
  `mosaic_components:mosaic_card`, resolved by core's ComponentLoader Twig loader) and calls
  `$this->twig->render($templatePath, ['props','slots','meta','context','attributes','mosaic'])`
  (`src/Service/MosaicRenderer.php:785-793`).
- **Attribute pre-seeding (the hybrid boundary):** before the render, the renderer seeds `$attributes` with
  `data-mosaic-component` / `data-mosaic-instance`, folds in visibility classes and the spacing / style-override
  inline styles (`MosaicRenderer.php:752-773`). A core ComponentElement would **not** pre-populate these.
- **Attachment harvest:** the Twig render runs inside a `DrupalRenderContext`
  (`executeInRenderContext`, :780-796); `$twigContext->pop()` → `$componentMeta->addAttachments($bubbled->
  getAttachments())` captures each component's `#attached` (its SDC library, a View embed's ajax/pager libs,
  etc.) + cacheability, so they are cached and bubbled cold AND warm (CP-VIEWS-EMBED-1 / V0). The page build
  gets both via `BubbleableMetadata::applyTo` (:400).
- **SDC library auto-attach:** rendering an SDC template makes core auto-attach its library
  `core/components.<provider>--<id>` — this is how each component's CSS/JS reaches the page.

Where component css/js reaches each surface:
- **(a) page** — via core's SDC auto-attach + the harvested `#attached` (bubbled through BubbleableMetadata).
- **(b) admin builder route** — `MosaicLayoutWidget` attaches ONLY `mosaic/builder`
  (`:153`) + `mosaic_media/media_library_bridge` (`:160`) + drupalSettings. **No component libraries.** The
  same-document Puck canvas (iframe disabled, `BuilderApp.tsx:755` `iframe={{enabled:false}}`) therefore has
  only what `mosaic/builder` bundles.
- **(c) Tier-B SSR JSON** — `CanvasPreviewController` returns `new JsonResponse(['html' => $html])`
  (`src/Controller/CanvasPreviewController.php:113`); `MosaicRenderer::renderSingleComponent(type, props): string`
  returns **HTML only**. **No attachments in the SSR JSON.**
- **(d) iframe preview** — there is **no Puck iframe** (disabled, ADR-002); the canvas is same-document. A
  separate `mosaic/device_preview` library (`mosaic.libraries.yml:24`) is a device-frame feature, not the
  component render path. The FE dialog uses `frontend-editor.js` + `mosaic/fe_chrome` (same adapter).

### P0.2 LIVE attachment probe — page vs builder vs SSR
```
(a) PAGE node/780 (anon render):  49 #attached libraries — one core/components.mosaic_components--<id> per
    rendered SDC instance: --mosaic_heading ×4, --mosaic_text ×N, --mosaic_button ×4, --mosaic_divider ×4,
    --mosaic_spacer ×4, --mosaic_card ×4, --mosaic_columns, --mosaic_image ×4, + mosaic/renderer.
(b) BUILDER route /node/780/edit:  mosaic/builder  +  mosaic_media/media_library_bridge  ONLY.
    NO core/components.<id> libraries → an ADOPTED component's own css/js never loads in the canvas.
(c) SSR JSON (renderSingleComponent → CanvasPreviewController):  {"html": "<…>"}  — html only, NO attachments.
```
**The gap (the whole of Pillar D's canvas work):** the page attaches component assets correctly (core SDC
auto-attach + harvested `#attached`); the **builder canvas has no path for a component's assets** — the route
attaches none, and the Tier-B SSR JSON drops them. Owned components survive because `mosaic/builder` bundles
the design-system CSS + they render via the React Tier-A scaffold; **adopted components would render unstyled
and behaviour-less on the canvas.**

### P0.3 Core component-element contract on 11.4.5 (confirmed live)
`ComponentElement` (`web/core/lib/Drupal/Core/Render/Element/ComponentElement.php`) — the render-array API:
- `#type => 'component'`, `#component => '<provider>:<id>'`, `#props => [...assoc...]`, `#slots => [...render
  arrays / scalars per slot...]` (:16-25).
- `#variant` — **singular** (:17, :65-66): sets `$props['variant']` when props.variant is unset; renders as a
  `data-component-variant` attribute (`ComponentsTwigExtension.php:81-82`). (The charter's `#variants` is
  `#variant` on this version.)
- **`#attributes` — AVAILABLE on 11.4.5** (:170-184): "an universal property of the Render API"; the element's
  `#attributes` is merged with `#props['attributes']` and passed to the component. **This is the only channel
  Mosaic needs to pass its `data-mosaic-*` + visibility/spacing attributes to an adopted component.**
- **Library auto-attach:** rendering the component auto-attaches `core/components.<provider>--<id>` (proven by
  the page probe) — so the component element brings the adopted component's css/js with it.
- **Prop validation is assert-gated (DEV only):** `ComponentsTwigExtension::validateProps()` is
  `assert($this->doValidateProps(...))` (`:106`) + `assert(...)` in `ComponentPluginManager.php:268`. In
  production (assertions off) core does NOT validate props. **Implication:** Mosaic's H5 save-time validation
  (CP-ADOPT-2) remains the real gate; the hybrid must not rely on core's runtime validation.

Twig variables a **core-rendered SDC** receives: `attributes`, `slots`, and each prop as a top-level variable
(SDC flattens `props.*` to top-level) + `variant`. It does **NOT** provide a `mosaic` helper.

### P0.4 Owned-template dependence (the hybrid boundary) — 19 templates, one line each
"Owned" = `MosaicComponentAlias::providerIsOwned()` (provider `mosaic` or `mosaic_*`). 12 in
`modules/mosaic_components/components/` + 7 in other `mosaic_*` submodules. (+1 doc-stub `templates/
mosaic-component.html.twig`, no render logic.) **`mosaic` helper: used by ZERO** → dropping it from a core path
breaks nothing. **`attributes`: all 19** (15 `attributes.addClass`, 4 print bare) — but the renderer pre-seeds
it (P0.1). **`slots` var: only `mosaic_columns`.** Prop access is **nested `props.*`** (MOSAIC-022), not
flattened.

| Template | mosaic | attributes | slots | notable |
|---|---|---|---|---|
| mosaic_button | no | addClass | no | `<a>`/`<button>`; `|escape`,`|t` |
| mosaic_card | no | addClass + reads `attributes['data-mosaic-instance']` | no | derives aria id from the seeded instance attr |
| mosaic_carousel | no | prints `{{ attributes }}` | no (HTML `<slot>` = shadow DOM) | `attach_library('mosaic/renderer')`; `|raw` picture_element + legacy; `processed_text` |
| mosaic_columns | no | addClass | **YES** `slots.column_1..4|default('')|raw` | slot HTML via `|raw` |
| mosaic_divider | no | addClass | no | — |
| mosaic_heading | no | addClass | no | `|escape` |
| mosaic_html | no | addClass | no | `|raw` on props.content (intentional) |
| mosaic_image | no | addClass | no | `|raw` on picture_element; drupal_media array |
| mosaic_live_search | no | prints `{{ attributes }}` | no | `attach_library('mosaic/renderer')`; DSD `<template shadowrootmode>` |
| mosaic_spacer | no | addClass | no | — |
| mosaic_tabs | no | prints `{{ attributes }}` | no (HTML `<slot>`) | `attach_library`; `processed_text` body; DSD |
| mosaic_text | no | addClass | no | **`props.body|check_markup(...)`** — the ONLY owned use of the Mosaic filter (globally registered → resolves under core SDC too) |
| mosaic_view (mosaic_views) | no | prints `{{ attributes }}` | no | prints a View `buildRenderable` render array (`#attached` harvested by V0) |
| webform_embed (mosaic_webform) | no | addClass | no | `drupal_entity('webform',…)` (twig_tweak) |
| product_card (mosaic_commerce) | no | addClass | no | `drupal_entity('commerce_product',…)` |
| product_list (mosaic_commerce) | no | addClass | no | `drupal_entity(…)` loop |
| search_bar (mosaic_search) | no | addClass | no | plain GET `<form>` |
| search_results (mosaic_search) | no | addClass | no | `drupal_entity(…)` loop |
| mosaic_meta (mosaic_metatag) | no | addClass | no | renders an empty `<meta>` carrying only data-mosaic-* (read by PHP) |

**Boundary verdict:** owned templates need the **pre-seeded `attributes`** + **nested `props.*`** + (columns
only) the **`slots` var**; none need `mosaic`. A core SDC path provides `attributes`/`slots`/flattened props but
NOT the pre-seeding — so **owned stays on direct-Twig (byte-identical), adopted goes through the core element.**

### P0.5 The HYBRID switch (design)
- **Definition flag:** `MosaicComponentAlias::providerIsOwned($provider)` (already on the definition via
  `provider_type` / the alias map). Owned → **direct Twig** (unchanged, byte-identical). Adopted → **core
  component element**.
- **Adopted render:** build `['#type' => 'component', '#component' => '<provider:id>', '#props' => …,
  '#slots' => …, '#variant' => …, '#attributes' => $mosaicAttributes]`.
  - **props** — from stored `nodes[id].props` through the **prop-shape registry**, H5-validated (invalid enum /
    html-without-format rejected at save; the runtime path trusts validated data since core validation is
    dev-only).
  - **slots** — from `nodes[id].slots.{zone}`, each rendered child as a `#slots[zone]` render array (the same
    depth-first child render, wrapped as a render array not a string).
  - **variant** — the variant enum prop → `#variant`.
  - **attributes** — ONLY `#attributes` carries Mosaic's `data-mosaic-*` + visibility/spacing;
    **H-RULE: never rewrite the library's own markup / ids / classes** — Mosaic adds attributes, the library
    owns its DOM.
- Attachment harvest is unchanged (the component element's auto-attached library + any `#attached` bubble
  through the same `executeInRenderContext` / BubbleableMetadata path).

### P0.6 The canvas asset path (design)
- **Builder route:** attach every **ENABLED** component library's `core/components.<provider>--<id>` (from the
  discovery registry filtered by the library-governance entity) to the `MosaicLayoutWidget` element, so the
  same-document canvas has every authorable component's css/js. Dedupe by library id.
- **Tier-B SSR:** `CanvasPreviewController` returns `{'html', 'attachments'}` — the `attachments` = the
  BubbleableMetadata `libraries` + `drupalSettings` harvested during `renderSingleComponent` (today discarded).
  The client attaches them **once, deduped** (a client-side `attachedLibraries` set) via Drupal's
  `ajax`/`drupal-settings-json` merge or `Drupal.attachBehaviors` after injecting the library assets.
- **Adopted components are ALWAYS Tier-B SSR on the canvas** (no React Tier-A scaffold — the library owns the
  DOM); cacheability (BubbleableMetadata) preserved.
- **FE dialog** attaches the same enabled-library set (same adapter). **iframe: N/A** (canvas is same-document).

### P0.7 Palette opening (design)
`adopt_palette` becomes TRUE for a component **iff**: grade is **Ready or Attention** (never **Blocked**) AND
its library is **ENABLED** (governance entity `status`) AND the component is **enabled** (not disabled/
restricted-for-this-author) AND the **bundle allows** it (the node-type `allowed_components` allowlist).
Governance cells **reuse CP-ADOPT-1's** (`MosaicComponentGovernance::isAuthorable`) — no new gate.

### P0.8 DERIVED matrix — component × surface × assets × geometry × parity × cache
| component | page anon | page admin | builder canvas | FE dialog | SSR JSON | render tier |
|---|---|---|---|---|---|---|
| owned Tier-A (heading/card/columns) | direct Twig, css auto-attached | same | React scaffold, mosaic/builder css | same | n/a | **byte-identical (region shasum gate)** |
| owned Tier-B (mosaic_view) | direct Twig + View `#attached` | same | SSR html (+ now attachments) | same | html+attachments | byte-identical |
| adopted Ready | core element, lib auto-attached | same | **Tier-B SSR + attached libs** | same | html+attachments | new |
| adopted Attention (raw prop) | core element (raw prop = text field) | same | Tier-B SSR | same | html+attachments | new |
| adopted slots-only | core element, `#slots` | same | Tier-B SSR | same | html+attachments | new |
| adopted with variants | core element `#variant` | same | Tier-B SSR | same | html+attachments | new |
| theme-bound active | rendered (active theme) | rendered | Tier-B SSR | same | html+attachments | new |
| theme-bound inactive | **not rendered** (lib absent) | not rendered | palette-hidden | hidden | n/a | governed out |

× **assets** {css-on-page ✓ / css-on-canvas (the fix) / js-behaviors attached / **deduped on repeat**} ×
**geometry** {adopted boundingBox on the canvas non-zero + matches the page within tolerance} ×
**permission-parity** {admin vs author see the same palette; restricted filtered} × **cache** {cold / warm /
**invalidation on library toggle**}. **Oracle + smoke per cell** (e.g. assets: neuter the dedupe → a library
double-attaches; geometry: an adopted component with zero boundingBox on the canvas = the css-not-attached
regression; cache: toggle a library OFF → the palette + canvas drop it on the next request).

**Byte-identical invariant for OWNED stays the gate:** `scripts/qa/region-shasum.sh` `14e6cb9c…` before==after
across the entire hybrid landing (owned never touches the core-element path).

### P0.9 Risk register
| # | Where it could diverge | Mitigation |
|---|---|---|
| R1 | **Attachment ordering** — core-element libs vs harvested `#attached` ordering differs from today | keep the single `executeInRenderContext`/BubbleableMetadata harvest; assert the page library SET (order-agnostic) in a Kernel cell |
| R2 | **Twig autoescape** — adopted templates autoescape; Mosaic's owned `|raw` points (columns/html/image/carousel) do NOT apply to adopted (library owns its markup) | adopted render passes props as data, never pre-rendered HTML; `#slots` children are render arrays (escaped by core), not `|raw` strings |
| R3 | **Variant class conventions** — `#variant` → `data-component-variant`, but a library may key its CSS on a BEM modifier class instead | pass the variant via `#variant` (core's contract) AND leave the library's own class logic untouched (H-rule: never rewrite classes); grade an unmatched variant as Attention |
| R4 | **`#attributes` availability** — confirmed on 11.4.5 (:170-184); a site on <11.3 would lack it | pin `core: ^11.3` capability in the hybrid; Kernel cell asserts the merged attribute reaches the component |
| R5 | **SSR JSON size** — adding `attachments` (libs + settings) per component inflates the batch response | attachments are library IDs + a settings delta (small); dedupe server-side per batch; the client caches the attached set |
| R6 | **Prop validation dev/prod skew** — core validates props only under assertions (dev) | rely on Mosaic's H5 save-time validation (already the gate); never assume core rejects a bad prop at runtime |
| R7 | **Attribute pre-seeding loss** — a core-rendered adopted component won't carry `data-mosaic-instance` unless passed | pass ALL Mosaic data-attributes via `#attributes`; a Kernel cell asserts `data-mosaic-instance` is present on the adopted component's root |
| R8 | **check_markup filter scope** — only mosaic_text uses it (owned); adopted never does | no action — owned stays direct-Twig; the filter is module-global anyway |

### P0.10 P1 build order (for the reviewer to gate, then a later pass)
1. Hybrid switch (owned direct-Twig unchanged; adopted → core element) — byte-identical owned (region shasum).
2. Canvas asset path (route attaches enabled libs; SSR returns attachments; client dedupe-attach).
3. Palette opening (adopt_palette for Ready/Attention in enabled+allowed libraries; Blocked never) — reuse
   CP-ADOPT-1 governance.
4. Adopted geometry + parity journeys (filmed): an adopted component styled on the canvas, boundingBox matches
   the page within tolerance; F-098 external-library oracle walk.
5. Full gates + dist + BUMP-LIBS + CHECKPOINT-1.

### STOP — reviewer audits §P0 (the hybrid boundary + the canvas-asset gap + the risk register). No build until then.
