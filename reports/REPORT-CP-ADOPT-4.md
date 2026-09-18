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
| R9 | **core floor** — `#attributes` + `#variant` landed 11.3; a site below that would break the hybrid | pin the module to `core_version_requirement: ^11.3` (or feature-detect the component element); a Kernel cell asserts the merged `#attributes` reaches an adopted component on THIS version (11.4.5) |
| R10 | **SSR behavior attach** — an adopted component's JS behaviours won't run unless re-attached after the client injects the SSR html | the client calls `Drupal.attachBehaviors(node, settings)` on the injected subtree AFTER attaching its libraries (P1b) — never before the assets land |
| R11 | **library-toggle staleness** — the builder attachment list must drop a library the moment its governance entity is toggled OFF | the builder route's attachment build carries the `mosaic_component_library` **config cache tag** (`config:mosaic.component_library.*`), so a library toggle invalidates the page + canvas asset set (P1b) |

**Teaser rule (H-rule, standing):** a raw / class-typed `attributes` prop (SDC props whose type is
`Drupal\Core\Template\Attribute` — e.g. `olivero:teaser.attributes`) is **NEVER passed in `#props`**. All
Mosaic data-attributes (`data-mosaic-*`, visibility, spacing/style) reach an adopted component **only** through
`#attributes` (merged by core at ComponentElement:170-184). This keeps Mosaic from ever writing into the
library's own attribute contract and dodges the "Object could not be converted to string" class-typed-prop trap.

### P0.10 P1 build order (for the reviewer to gate, then a later pass)
1. Hybrid switch (owned direct-Twig unchanged; adopted → core element) — byte-identical owned (region shasum).
2. Canvas asset path (route attaches enabled libs; SSR returns attachments; client dedupe-attach).
3. Palette opening (adopt_palette for Ready/Attention in enabled+allowed libraries; Blocked never) — reuse
   CP-ADOPT-1 governance.
4. Adopted geometry + parity journeys (filmed): an adopted component styled on the canvas, boundingBox matches
   the page within tolerance; F-098 external-library oracle walk.
5. Full gates + dist + BUMP-LIBS + CHECKPOINT-1.

### STOP — reviewer audits §P0 (the hybrid boundary + the canvas-asset gap + the risk register). No build until then.

---

## §P1a — BUILD — HYBRID RENDERER (page) — CHECKPOINT-1 FILED

The page-render half of Pillar D (P1b = canvas assets / SSR attachments / palette opening / journeys is the
next pass). **5 files: 1 modified (`MosaicRenderer.php`) + 4 new (the `adopt_fixture` test module + the Kernel
test). PHP + YAML + Twig-fixture only — NO dist / NO libs.**

### Item 1 — the hybrid switch [DONE, GREEN]
`MosaicRenderer::renderNode()` now branches at the render step. **Owned** (`provider` `mosaic`/`mosaic_*`, or
empty → the byte-identical default) → **direct Twig, unchanged**. **Adopted** → `buildAdoptedComponentElement()`
→ `['#type' => 'component', '#component' => <provider:id>, '#props', '#slots', '#variant', '#attributes']`,
rendered inside the SAME `executeInRenderContext` harvest.
- **#component** = `$instance->type` (the adopted key IS the SDC id; `getTemplatePath()` would DOUBLE the
  provider — a bug caught + fixed: `adopt_fixture:adopt_fixture:adopt_widget`).
- **#props** — stored (H5-validated) data, **excluding** `attributes`, `variant`, and any **class-typed** shape
  (`type` contains `\`) — the teaser rule / R7. Mosaic never writes the library's attribute contract.
- **#slots** — the already-rendered child HTML per zone as `['#markup' => Markup::create(...)]`, keyed exactly;
  empty zones omitted.
- **#variant** — an enum `variant` prop → the singular `#variant` (11.4.5).
- **#attributes** — the Mosaic `Attribute` (data-mosaic-*, visibility, spacing/style); core merges it with the
  component's own attributes, the library's winning (R2/R3/R7).

### Item 2 — attachments [DONE, GREEN]
The adopted render runs inside the existing render-context harvest, so core's auto-attached
`core/components.<provider>--<id>` library lands in the page's BubbleableMetadata. **R1 cell asserts it.**

### Item 3 — fixtures [DONE, GREEN]
`Kernel HybridRenderTest 4/4` (36 assertions):
- **`adopt_fixture:adopt_widget`** (a NEW non-Mosaic fixture SDC — **honest deviation:** the charter suggested
  `mosaic_test`, but that provider is `mosaic_*` = OWNED and cannot reach the adopted branch; a non-Mosaic
  provider is required) with a **variant enum + a required slot + a class-typed raw prop** → renders via the
  core element: `adopt-widget--wide` (variant), the heading (props), the owned `mosaic_heading` child inside
  the body slot, `data-mosaic-instance="aw-1"` (attribute merged), and the raw prop `should-be-dropped`
  **absent** (class-typed excluded).
- **`olivero:teaser`** (real theme-provided adopted) → its own `teaser` markup + a filled `content` slot +
  the merged Mosaic attribute.
- **R1** — `core/components.adopt_fixture--adopt_widget` on the page `#attached`.
- **Owned** `mosaic_heading` still renders direct-Twig (`data-mosaic-component="mosaic_heading"`).
- **RED demo:** force `$isOwned = TRUE` → adopted misroutes to direct Twig → `LoaderError: Template
  "adopt_fixture:adopt_fixture:adopt_widget" is not defined` → restored clean.

### Item 4 — owned byte-identical [DONE]
node/780 region shasum `14e6cb9c17dc61b90a86dd97d8957ae462d789ff854d3523ae581010a43e0dec` (3954 B)
**before == after**. **`git diff --stat` on the 19 owned templates = EMPTY** (no template changed; owned never
touches the core-element path).

### Item 5 — gates
```
Unit FULL     2762/2762 OK   (fixed a mock regression: the unit renderer mocks carry no `provider`, so an
                              empty provider now defaults to OWNED — the safe byte-identical path)
Kernel FULL    218/218  OK  (1345 assertions; +4 HybridRenderTest; 0 failures)
phpcs 0        (MosaicRenderer + HybridRenderTest)
phpstan L6     MosaicRenderer = 14 errors, ALL PRE-EXISTING (identical count in HEAD — `missingType.
               iterableValue` docblocks on render()/renderResponsive()/… ; the CP-ADOPT-4 branch +
               buildAdoptedComponentElement add ZERO). Documented, not scope-crept on a 900-line hot-path file.
byte-identical 14e6cb9c before==after   (no dist → libs unchanged 1.0.31)
```

### Oracle-changes (P1a)
**None** — no test oracle was changed. The 8 unit failures (`MosaicRendererTest`, `MosaicRendererCacheTest`)
were a **code** gap: those mocks return a definition with no `provider`, so the first-cut `providerIsOwned('')`
misrouted their owned components to the adopted branch. Fixed in the RENDERER (empty provider → owned), not in
the tests — the tests are byte-for-byte unchanged and green.

### STOP — P1a GREEN (hybrid page render, byte-identical owned). P1b (canvas assets, SSR attachments, palette opening, adopted geometry + F-098 walk, dist) is the next pass.

---

## §P1b — BUILD — PALETTE OPENS + CANVAS ASSETS + ADOPTED SSR — CHECKPOINT-2 FILED

The server-side "adopted becomes usable" foundation. **14 files (9 modified + the adopt_fixture module + 2 new
Kernel tests). PHP + Twig-fixture only — NO dist / NO libs.** Ledger-first: R9–R11 + the teaser rule (done in
§P1a). Baseline `14e6cb9c` before == after throughout.

### Item 3 — the palette opens [DONE, GREEN]
Adopted components become palette-ELIGIBLE (`adopt_palette = grade != blocked`) — `ComponentDefinition::
fromCoreDefinition` + the discovery adopted-with-sidecar path. The RUNTIME gate stays governance: adopted
libraries **default OFF** (`status => providerIsOwned`), and `MosaicComponentGovernance::isAuthorable` now
returns FALSE for an adopted component with **no library entity** (opt-in), so nothing appears until an admin
enables the library. LIVE: with the Olivero library ON, the admin palette is **15** — `olivero:teaser` (Attention)
now present; with it OFF / absent, excluded. **Kernel `PaletteOpenTest` 4/4:** eligibility + Tier-B flag +
descriptors/slots; governance ON/OFF + no-library; restricted admin/author parity; SSR hybrid. **RED demo:**
neuter the no-library exclusion → adopted authorable with no enabled library → the governance cell fails →
restored.

### Item 2 (canvas SSR) — adopted render on the canvas [DONE server-side]
The manifest flags adopted `requires_ssr_preview = TRUE` (adapter routes them to the EXISTING Tier-B SSR path —
no dist change). `MosaicRenderer::renderSingleComponent()` now uses the **same hybrid** as the page (owned →
Twig; adopted → core element), so the canvas SSR of an adopted component renders its library markup, not the
double-provider error. **`PaletteOpenTest::testAdoptedSsrRendersViaHybrid`** asserts the SSR html.

### Item 1 — builder route attachments [DONE]
`MosaicLayoutWidget` attaches `core/components.<provider>--<id>` for every ADOPTED component in the (already
governance-filtered) palette, so its CSS/JS loads in the same-document canvas; and stamps the
`config:mosaic.component_library_list` cache tag so a library toggle rebuilds the attachment set without a
manual cache clear (**R11**).

### Item 4 — FILMED journey [DONE — the stable proof; the builder UI is deferred]
Journey `js/e2e/journeys/cp-adopt-4.spec.ts` (scratch node 988 places `olivero:teaser`; content slot = an owned
heading). Album `ledger-live/e2e-evidence/cp-adopt-4/` + INDEX (**2 frames + 2 data files**):
- `j1` — the **Component Libraries page**: Olivero (theme-bound) **enabled**, teaser graded **Attention**
  (0 fields, 5 slots), "adopted libraries off by default".
- `j3` — the **anon page**: the teaser rendered with **Olivero's own markup + CSS** + the Mosaic heading in its
  content slot.
- `page-computed.json` — the **computed-style assertion**: `.teaser { position: relative }` (default `static`;
  only `core/components.olivero--teaser` sets it) + boundingBox 788×144.
- `palette-ids.json` — the live builder palette contains `olivero:teaser`.
- **HONEST — deferred to P1b-client:** the **builder-canvas LIVE render** of the adopted teaser did not
  materialise in the headless Puck canvas within 30s (the canvas is unstable to film — cp-adopt-1 precedent),
  and the **client Tier-B SSR-attachments** work (R5/R10: attach the SSR response's libraries + dedupe +
  `Drupal.attachBehaviors`) + the **adopted-with-slots-on-canvas composition** (dropping a child into an
  adopted slot on the canvas — a Tier-B+slots gap) are the P1b-client slice. The canvas render is machine-proven
  at the Kernel level (`testAdoptedSsrRendersViaHybrid`).

### Item 5 — gates
```
Unit FULL     2762/2762 OK   (5 oracle-changes: adopted Ready/Attention now palette-ELIGIBLE)
Kernel FULL    222/222  OK    (1370 assertions; +4 PaletteOpenTest; 0 failures)
Vitest FULL    unchanged (no JS change; 552 pass / 1 pre-existing B-101)
phpcs 0        phpstan L6: MosaicRenderer 14 + MosaicLayoutWidget 28 errors — ALL PRE-EXISTING (identical
               counts in HEAD; my P1a/P1b changes add ZERO to either). Documented, not scope-crept.
byte-identical 14e6cb9c before==after   (NO dist → libs unchanged 1.0.31)
```

### Oracle-changes (P1b)
| # | Test | Old | New | Reason |
|---|---|---|---|---|
| 1 | AdoptedDescriptorParityTest | adopted stays palette-guarded (FALSE) | adopted (Attention) is palette-eligible (TRUE) | the palette opens |
| 2 | SdcComponentDiscoveryTest C2 (Ready) | adopt_palette FALSE | TRUE (Ready eligible) | palette opens |
| 3 | SdcComponentDiscoveryTest C7 (Attention) | adopt_palette FALSE | TRUE (Attention eligible) | palette opens |
| 4 | SdcComponentDiscoveryTest palette-guard invariant | all adopted FALSE | eligible unless Blocked (+ Blocked FALSE) | palette-eligibility invariant |
| 5 | Sprint02SmokeTest (Ready adopted) | adopt_palette FALSE | TRUE | palette opens |

### CHECKPOINT-2 — the P1b-client slice (next pass)
- **Item 2-client:** `renderSingleComponent`/`CanvasPreviewController` return `{html, attachments}`; the Tier-B
  client attaches the libraries once (dedupe, R5) + `Drupal.attachBehaviors` (R10); dist rebuild → BUMP-LIBS.
- **Adopted-on-canvas LIVE render** + the **adopted-with-slots composition** (Tier-B + Puck slots).
- Film the builder canvas (or Arun's own-browser walk); the anon page + libraries page are already filmed.

### STOP — P1b server foundation GREEN + filmed (page + libraries); the P1b-client (canvas render + SSR-attachments + dist) → CHECKPOINT-2 next. Ship #44 human-commit closes the P1b server slice.
