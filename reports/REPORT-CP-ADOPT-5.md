# REPORT — CP-ADOPT-5 P0 DERIVATION (Pillar E typed binding + capability-aware panel; §9 SO-1..8; H9) — 2026-09-19

Report-only. MOSAIC git READ-ONLY; nothing staged; no dev DB/config writes. Fresh-read: HEAD
`0bcc2ab` (ship #44), tree clean. **ADOPT §9 ratified 2026-09-19** (this pass). STOP for audit
before any build. All claims below are verified against source with `file:line`.

---

## 1. PANEL TODAY → the capability table (proposed truth)

### 1.1 The five meta sections are added UNCONDITIONALLY, kind-AGNOSTIC
`js/src/builder/MosaicPuckAdapter.ts` seeds five meta props for EVERY component (`:441-447`) and
appends five panel sections outside any guard (`:666-700`):
```
_mosaic_bp            → bpField (BreakpointOverrideField)     :458-470 / :674
_mosaic_visibility    → visibilityField (VisibilityField)     :472-483 / :675
_mosaic_ds            → dsField (MosaicDataSourceField)        :487-501 / :676
_mosaic_spacing       → SpacingControl                        :677-687
_mosaic_style_overrides → StyleOverridesControl               :688-699
```
No `if` gates any of them. Worse, the capabilities they expose are NOT keyed off prop kind:
- **Binding** offers ANY prop (`MosaicDataSourceField.tsx:485` "Any prop in propKeys can be
  bound"; `:507-508` diffs keys, no kind filter).
- **Breakpoint override** renders a raw TEXT box per breakpoint for the first 6 prop keys
  regardless of kind (`MosaicPuckAdapter.ts:116` `slice(0,6)`, `:147-168`) — even a media/number/
  select prop gets a text override.
- **Visibility / spacing / style** are whole-component, not per-prop.
The ONLY kind-specific facts today are `translatable` (`MosaicPropShapeRegistry.php:216-218`:
text/formatted_text/link) and `format_enforced` (formatted_text). **So the panel today lets an
author bind a closed enum and breakpoint-override a media prop as text — it lies about what a
prop can honestly do.** Pillar E's job is to make these honest.

### 1.2 The inventory it must be honest about
- **10 descriptor KINDS** (`src/Sdc/PropShape.php:31-40`): `text, formatted_text, link, select,
  toggle, number, repeatable, entity_ref, media, raw`. `classify()` (`:56-78`): enum→select,
  `$ref`→raw, string→(uri→link, text/html→formatted_text, else text), int/number→number,
  boolean→toggle, array→repeatable, else raw. `media`/`entity_ref` are never produced by
  `classify()` — only assigned by a `MosaicPropShapeEvent` subscriber.
- **8 field-type plugins** (`#[MosaicFieldType]`, `MosaicFieldTypeManager.php`): `text, number,
  media, image_style, richtext, repeatable` (core) + `views_display, views_arguments`
  (mosaic_views). Unknown → falls back to `text` (`:73-79`).
- **3 ERP prop_types** (separate sentinel system, `buildErpField` `:1538-1576`): `drupal_media,
  drupal_entity_ref, drupal_link`.

### 1.3 CAPABILITY TABLE — proposed truth (descriptor kind × capability, reason per cell)
Source-kind abbreviations: PF=page field, VW=View, ER=entity ref, CX=context, ST=static.

| kind | bindable → sources | breakpointable | stylable | translatable | reason |
|---|---|---|---|---|---|
| text | YES → PF, ER-field, CX, ST | YES | no | YES | scalar string; text-yielding sources bind honestly; a label may differ per breakpoint; i18n. |
| formatted_text | YES → PF(body), ST | no | no | YES | HTML body via text format (H5); a rich body per-breakpoint is impractical → off. |
| link | YES → PF(link), ER→url, ST | no | no | YES | uri; link/entity-url sources; label translatable; no per-bp. |
| select | **no** | YES | no | no | CLOSED enum — a source can't honestly yield an arbitrary enum member; a variant per breakpoint IS meaningful. |
| toggle | **no** | YES | no | no | boolean authored flag; per-breakpoint meaningful; not a source value. |
| number | YES → PF(number), ST | YES | no | no | numeric sources bind; a size/count per breakpoint is meaningful. |
| repeatable | **no — bind the CONTAINER via H9** | no | no | no (items carry own) | array of sub-items; you bind the slot/View (H9), never the array as a scalar. |
| media | YES → PF(image/media), ER→media | no | no | no | media reference; binds a media/image field; not per-bp, not text-i18n. |
| entity_ref | YES → PF(entity ref), CX(entity) | no | no | no | entity reference; entity-yielding sources; no per-bp. |
| raw | **no** | no | no | no | unmodelled `$ref`/bare object; NO honest capability; field shows its `reason`. |

"stylable" is a COMPONENT capability, not a prop-kind one, so every cell is `no` at prop level;
style (spacing + overrides) is offered per-component and gated by CONTEXT (§4.a), not by kind.
Truth: bindable-blocked = {select, toggle, repeatable, raw}; translatable = {text, formatted_text,
link}; breakpointable = {text, select, toggle, number}.

---

## 2. BINDING TODAY (two subsystems — must not conflate)

### 2.1 Prop→source: the DataSourceBinding subsystem
- Manager `mosaic.data_source_manager` (`mosaic.services.yml:52`, `MosaicDataSourceManager.php:37`);
  interface method `resolve(DataSourceBinding, RenderContext): mixed` + `getCacheMetadata()`
  (`MosaicDataSourceInterface.php:19`); value object `DataSourceBinding.php:17`.
- **7 binding TYPES** (`DataSourceBinding.php:20-32`): `static, entity_field, entity_query,
  views_result, external_rest, context, merge` (+ `paragraphs` from a submodule). Cores: static
  `:38`, context `ContextDataSource.php:63`, entity_field `EntityFieldDataSource.php:75`,
  entity_query `:85`, merge `MergeDataSource.php:64`, external_rest `:69`, views_result
  (mosaic_views).
- **Page-field binding** = `EntityFieldDataSource` with no `entity_id` → uses the context/host
  entity (`:183`), enforces `access('view')` (`:75`), transforms rendered/label/url/count/raw.
- **Entity-ref** (`drupal_entity_ref` sentinel) `MosaicPropResolver.php:252` → `{id,uuid,label,url}`,
  access-checked, "shows an entity, never copies it"; save-validated `MosaicPropValidator.php:436`.

### 2.2 Views contextual-filter binding: the SIX argument sources
Authoritative list (`mosaic_view.component.yml:23`; `ViewsArgumentResolver.php:133`): `view_default,
fixed, url_param, current_user, this_page, page_field`. Field types `views_display` (stores
`{view,display}`) + `views_arguments` (one row per contextual filter, each row picks a source).
Cacheability per source `ViewsArgumentResolver::getCacheability()` (`:84`): current_user→`user`;
url_param→`url.query_args:<name>`; this_page/page_field→`addCacheableDependency($host)`.

### 2.3 How a bound value reaches render + cacheability
`MosaicRenderer.php:744`: `$dsOverrides = $this->dataSourceResolver->resolve(...)` then
`array_merge($baseProps, $dsOverrides)` (source wins over static). Non-null only; fallback on
throw (`MosaicDataSourceResolver.php:49`). Tags bubble into `$componentMeta` (per-component cache),
folded up at `:890-891`; `user.*` bindings force a BigPipe `#lazy_builder` (`:511`). Views embed:
`MosaicViewComponent::resolveProps` runs the real executable on PAGE render (`:165`), twig prints
`props._view_render` (`mosaic_view.twig:9`); View `#attached` + cacheability captured even warm
(`MosaicRenderer.php:817-857`).

### 2.4 "Slot bound to a View" (H9) — DESIGNED, NOT BUILT
`views_row_sdc` (design note only, `ADOPT-DESIGN.md:89`) has **zero code hits**. Present: View
execution + row/entity extraction (`ViewsResultDataSource.php:112,183` returns raw `ResultRow[]`),
generic SDC slot storage, prop-shape registry, whole-View cacheability. **Missing (the H9 build):**
(1) a View-field→prop MAPPING model; (2) per-row CHILD-COMPONENT instantiation into a slot;
(3) a SLOT-level binding type (`DataSourceBinding` is prop-level only, resolver returns prop
overrides only); (4) per-row CACHEABILITY (tag-per-row-entity); (5) field→prop shape
reconciliation + a readiness grade for the mapping.

---

## 3. STYLE OWNERSHIP TODAY

### 3.1 Where Mosaic touches a rendered component
`src/Service/MosaicRenderer.php`: owns a `data-mosaic-*` `Attribute` (`:793-796`); visibility →
`.mosaic-hidden--{bp}` classes (`:798-803`); spacing + style-overrides → an inline `style` attr
(`:805-815`); a per-instance per-breakpoint `<style>` block prepended to the HTML (`:858`,
`buildBreakpointSpacingStyle` `:1018-1046`); breakpoint trees wrap in `data-mosaic-bp` divs +
`@media` display CSS (`:283-293`). ADOPTED components receive Mosaic styling ONLY via `#attributes`
on the core component element (`:954-962`) — the library DOM is never rewritten (SO-1/SO-2 already
honoured). Spacing scale → CSS in `css/mosaic-spacing.css:14-35` (`[data-mosaic-component]` consumes
`--mosaic-p*`). Style-overrides accept only `--`-prefixed props, HTML-escaped (`:999-1013`), also
applied on the canvas as inline React style (`MosaicPuckAdapter.ts:218-228`).

### 3.2 Design tokens `:root`
NOT in the `mosaic_tokens` submodule (that is Figma/Git sync only). The parent module emits the
token CSS as an INLINE `<head>` `<style id="mosaic-design-tokens">` via `hook_page_attachments`
(`src/Hook/MosaicHooks.php:108-134`), built by `MosaicTokenManager::buildCss` (`:95-109`,
`:root { … }`) + an external-token bridge (`MosaicTokenBridgeService.php:91`). Unlayered inline —
inline custom props beat every layer (`design-system.css:14-16`).

### 3.3 ⚠️ @layer CONFIRMATION — CORRECTED: @layer IS ALREADY IN PRODUCTION (premise false)
The charter asked to "confirm no @layer today." **That premise is FALSE.** `@layer` at-rules exist
in **11 of 28** module `.css` files. The cascade order is already DECLARED:
- FE `css/mosaic-design-system.css:23`: `@layer mosaic-tokens, mosaic-components, site-theme;`
- Canvas `css/mosaic-canvas-reset.css:30`: `@layer admin, mosaic-tokens, mosaic-components, site-theme;`
- Builder UI: `mosaic-builder-base < mosaic-builder-ui < mosaic-builder-dark`.
Author overrides win via INLINE custom properties (above all layers); `mosaic-spacing.css`/
`mosaic-visibility.css` and the compat files are intentionally UNLAYERED. **Consequence for §9:
SO-5 does NOT introduce layers — it RECONCILES the existing declared order** (see §4.c).

### 3.4 The donut boundary — `.mosaic-adopted-preview`
`css/builder.css:648-685` (WC#69 reset: `position:static/float:none/transform:none/inset:auto
!important` + `display:block !important` for chrome; `--min-empty-height:32px` cap). Applied only
by `buildAdoptedRenderer` on the canvas (`MosaicPuckAdapter.ts:1100-1115`); the FE render never
emits it → adopted keeps byte-identical library layout on the front end (SO-4).

---

## 4. DESIGN

### 4.a Capability rules from PHP; panel gating; foreign-slot behaviour
Each descriptor gains `capabilities:{ bindable:<source-kinds[]|false>, breakpointable:bool,
stylable:bool, translatable:bool }`, DERIVED in PHP from the kind (the §1.3 table) so admin panel
AND FE manifest read one truth (Permission-Parity). The adapter shows a section only where a
capability allows: `_mosaic_ds` per-prop only where `bindable!==false`; `_mosaic_bp` only where a
prop is `breakpointable`; `_mosaic_spacing`/`_mosaic_style_overrides` only where `stylable` AND not
in a foreign slot. CONTEXT axis {top-level, in-Mosaic-container, in-foreign-slot}: inside a FOREIGN
(adopted) slot the child renders BARE (no Mosaic wrapper), STYLE sections HIDDEN, replaced by a
one-line OWNERSHIP note "Styled by <Library>" (SO-1/SO-3 — Mosaic never restyles a library's slot;
bind/translate still apply per kind).

### 4.b "Plain content" slot fill
Beside dropping a child component, a slot offers "Plain content": a formatted-text value rendered
as the slot child with NO Mosaic chrome, through the text-format path (H5: format enforced +
stored), inside the library's slot markup untouched (SO-1). The low-friction "just put a paragraph
in the teaser's content" path.

### 4.c SO-4/5/6 as concrete CSS + attach points (RECONCILING the existing layers)
Because @layer is already declared (§3.3): (i) INSERT one name into the existing order —
`mosaic-tokens < mosaic-library < mosaic-components < site-theme` — and attach an adopted library's
CSS into `@layer mosaic-library` at the render attach we control (core component element), so
Mosaic component chrome sits ABOVE the library by ORDER, never weight (SO-5/SO-6). (ii) Author
overrides KEEP the existing inline-custom-property mechanism (already beats all layers, no
`!important`; SO-6). (iii) SO-6 token scoping: `:root` tokens stay global (values, not selectors —
no war); forwarded across the SO-7 Shadow boundary in ADOPT-6. (iv) SO-4 canvas reset stays where
it is (edit-mode only); optionally move it under the existing `admin` layer for hygiene. **No new
`!important` in any Mosaic-authored adopted rule.** RISK: if we cannot wrap a library's attached
CSS into `mosaic-library` at attach time, fall back to SO-3 scope (a capped-specificity,
`!important`-free author selector on the instance wrapper) — see R1.

### 4.d H9 mapping model + slot-binding UI
`views_row_sdc` shape: `{ view, display, row_component:<sdc type>, field_map:{<viewFieldId>:
<propDescriptorId>}, args:[<arg-source>] }`. At render each View ROW instantiates one
`row_component` child; View fields map only to descriptors whose KIND accepts them (§1.3). New: a
SLOT-level binding + per-row child instantiation + per-row cacheability (View config + each row
entity's tags into `$componentMeta`, mirroring §2.3). UI: a slot source-picker offers {drop
components | plain content | bind a View}; "bind a View" → View → display → child TYPE (allowed
children, H7) → map fields → descriptors (compatible kinds only) → args to the six sources.

### 4.e FE dialog parity
All gating (sections shown, ownership note, bind availability) computes from the SAME PHP
descriptor `capabilities`, so the FE editor dialog is identical to admin (Permission-Parity). FE
reuses the admin field components — one source of truth.

---

## 5. DERIVED MATRIX

Axes: descriptor KIND × context{top-level, in-Mosaic-container, in-foreign-slot} × capability{bind,
breakpoint, style, translate} × source{PF, View, ER, CX, none} × surface{admin, FE, page} ×
cascade{library-reset present, two libraries, tokens} × GEOMETRY(section presence/absence,
ownership-line placement) × Permission-Parity(admin manifest == FE manifest == render). Each cell
carries an ORACLE (acceptance assertion) + a SMOKE-ALARM (cheap regression trip).

Representative rows (full grid built in P1a as the tag-gating oracle):
| kind | context | bind | style section | geometry oracle |
|---|---|---|---|---|
| text | top-level | shown (PF/ER/CX/ST) | shown | 4 sections when bindable+breakpointable+stylable |
| text | in foreign slot | shown | HIDDEN + ownership line | style absent; ownership line present; bare render |
| select | any | HIDDEN | per context | no bind section (enum honest); breakpoint shown |
| raw | any | HIDDEN | per context | only value field + reason; no bind/bp/style |
| media | in foreign slot | shown | HIDDEN + ownership line | bind shown; style hidden |
| repeatable | container | HIDDEN (bind via H9) | n/a | slot source-picker offers "bind a View" |

§9 scenarios S1–S18 each map to ≥1 cascade/geometry cell: S1/S11 author-override predictability
(text/style cells); S2 library-`!important` (style/ownership); S3/S4 two-library preflight/global
(cascade{two libraries}); S5/S6 absolute/clipped field (GEOMETRY, SO-8, WC#72); S7 z-index band;
S8 token var (source{tokens}); S9 theme switch (H6); S10 library-update prop (Pillar F); S12 RTL;
S13 print; S14 nested adopted; S15 device-preview (surface{page} vs canvas); S16 utility-class
namespacing; S17 forced-colors; S18 Shadow-DOM opt-in (SO-7, ADOPT-6). Every S lands in a cell.

---

## 6. RISK REGISTER + BUILD ORDER

### Build order (one subsystem per pass; STOP between)
- **P1a** — capability rules on descriptors (PHP) + panel gating + foreign-slot bare/style-hidden/
  ownership-line. Kernel: descriptor capability map per kind; Vitest: adapter section gating. No CSS move.
- **P1b** — bare slot-child render + "plain content" fill + SO-4/5/6 layer RECONCILE + donut scope
  + token scoping. Byte-identical owned HTML + NEW computed-style oracle.
- **P1c** — H9 slot binding (`views_row_sdc`): mapping model + per-row child instantiation + per-row
  cacheability + slot source-picker UI.
- **P1d** — journeys + external-library oracle walk (headed, PROOF-CONDITIONS LAW) + walk.

### Risk register (10)
- **R1** Cannot wrap a library's attached CSS into `@layer mosaic-library` at attach → SO-5 order
  can't beat library without weight. Mitigation: SO-3 scoped, `!important`-free author selector.
- **R2** Layer RECONCILE changes computed styles for owned without changing markup (region shasum is
  HTML-only → silent visual drift). Mitigation: computed-style oracle (below).
- **R3** Foreign-slot CONTEXT detection must be reliable across nested adopted slots (S14).
- **R4** H9 per-row child render cache explosion (100-row View × child). Mitigation: per-row cache
  keyed by row entity + descriptor hash.
- **R5** Plain-content text-format enforcement inside a foreign slot must not double-wrap chrome.
- **R6** FE dialog parity: capabilities must be one PHP source (admin==FE==render), or the panel lies.
- **R7** SO-7 token forwarding across the Shadow boundary (ADOPT-6) — deferred, flagged now.
- **R8** Two adopted libraries with clashing global classes on one page (S4) — donut scope must isolate.
- **R9** RC-A3: Puck 0.21 has NO KeyboardSensor — slot-binding + capability panel MUST be reachable by
  keyboard even where drag is not (panel-driven add-to-slot as the a11y path).
- **R10** Binding honesty is a BEHAVIOUR CHANGE: props that were bindable today become non-bindable
  (select/toggle/raw/repeatable). Any EXISTING saved layout that bound such a prop must be migrated
  or grandfathered — audit saved data before P1a lands; do not silently drop a live binding.

### Byte-identical gate + computed-style oracle (the layer RECONCILE)
The region-shasum oracle hashes RENDERED HTML ONLY → reconciling CSS layers does NOT change markup,
so node/780 `14e6cb9c…43e0dec` MUST stay identical (gate; any attribute change = defect). BUT a
layer reorder CAN change COMPUTED styles without changing markup — so ADD a COMPUTED-STYLE ORACLE:
for the owned components on node/780, capture `getComputedStyle` for margin/padding/color/display/
position BEFORE and AFTER the layer reconcile (headed, same viewport) and assert byte-equal. This
proves the move is visually inert for owned, not just markup-inert. (Given §3.3, the reconcile only
INSERTS `mosaic-library` between existing names + optionally relocates the canvas reset — owned CSS
is not re-layered — so R2 exposure is small but must still be proven.)

---

## Honest status line
CP-ADOPT-5 P0 is derivation only. The capability table (§1.3) is the proposed truth; the panel
today is dishonest (kind-agnostic binding/breakpoint). H9 slot-into-View is unbuilt (`views_row_sdc`
= 0 code hits). **@layer is already in production (11 files) — the charter's "no @layer" premise is
false; the design RECONCILES the existing order, it does not introduce it.** 10 risks; behaviour-
change migration (R10) + the layer computed-style oracle (R2) are the two that most need Arun's eye
before P1a. STOP for audit.
