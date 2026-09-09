# CP-VIEWS-EMBED — LEDGER + READ-ONLY RECON (2026-09-01)

Read-only. NO code changes, NO staging, NO DB writes. Design ratified: AI/P-VIEWS-EMBED-DESIGN.md
(directive named it CP-VIEWS-EMBED-DESIGN.md; the Arun-placed file is P-VIEWS-EMBED-DESIGN.md — same doc).

## L1 — design §7 + §8 (quoted) + ledger
- **§7 delivery (3 shippable CPs):** CP-1 foundation (witness renderer bubbling; views_display +
  views_arguments field types; arguments introspection API; placeholder both surfaces; render via Views
  executable with View-default args only; validator; degradation). CP-2 argument matrix (page-id/page-field/
  fixed-autocomplete-multi/url-param/current-user; shared ArgumentResolver; cacheability derivation; overrides
  + hide-when-empty; template + breakpoint cells). CP-3 polish (exposed/AJAX/pager incl. BigPipe/lazy; opt-in
  SSR preview; Edit-this-view link; .mosaic.yml developer API + MOSAIC.md; walk). Est 3–4 sessions.
- **§8 rulings — ratified as recommended:** R-V1 placeholder + opt-in preview · R-V2 block+embed default,
  page opt-in · R-V3 hide-when-empty OFF default · R-V4 preview cap 10 · R-V5 slot after ship #32 before
  Act 2 · R-V6 unify argument resolver with the existing mosaic_views data source in CP-2.
- Appended to AI/TODO.md: ARUN RULING 2026-09-01 + FINDING-088 + updated OPEN QUEUE.
- Appended to AI/MOSAIC-BIBLE.md: P4 Wave E Act 1 (CP-VIEWS-EMBED before Act 2) + P2 feature-map row.

## L3a — mosaic_views submodule today (read-only)
Two classes only; no services.yml; ONE route.
- **`ViewsResultDataSource`** (src/Plugin/MosaicDataSource/ViewsResultDataSource.php) — a DATA source, not a
  display embed. `resolve()` L62-95: `Views::getView($id)` → `setDisplay` → `setArguments(array_values(
  $config['arguments']))` (L71, RAW positional args, no source matrix) → optional `setItemsPerPage` →
  **`$view->execute()`** (L79) → returns `$view->result` rows / count / ids (L91-95). NO display render, NO
  `$view->access()`, NO host-entity argument resolution, NO fixed-entity viewability check.
  `getCacheMetadata()` L104-113 adds ONLY `config:views.view.{id}` (L109) — does NOT bubble the view's own
  tags/contexts/max-age (never calls buildRenderable()). Save schema L118-129 (view_id/display_id/arguments/
  limit). **This is the resolver R-V6 unifies/replaces in CP-2.**
- **`ViewsBrowserController::list()`** (src/Controller/ViewsBrowserController.php) — GET /api/mosaic/views/list
  (mosaic_views.routing.yml). L62 loads ALL view config entities; L67-72 lists ALL displays raw (display_title
  only); NO enabled-view filter, NO embeddable-display filter (block+embed per R-V2), NO grouping, NO
  cacheability on the JsonResponse. Reusable STARTING POINT for the views_display picker options; needs
  filtering + must be served through the manifest (F-087 / MosaicManifestBuilder).
- **display-embed capability: NONE exists in any form.** Confirmed.

## L3b — MosaicRenderer #attached + cacheability contract (THE witness) — VERDICT: cache bubbles, #attached DROPS
- MosaicRenderer injects **raw `Twig\Environment`** (src/Service/MosaicRenderer.php:86), NOT the Drupal
  `RendererInterface`. Components render to STRINGS: `renderNode()` L617 `$html = ... $this->twig->render(
  $plugin->getTemplatePath(), [...])`. `renderNode` returns `string`. The two entrypoints build
  `['#markup' => Markup::create(...), '#cache' => ...]` (renderResponsiveInternal L252-254; render() L156-166
  or renderInternal). **There is NO `#attached` key produced anywhere** and no `RendererInterface` /
  `executeInRenderContext` capture (L433 `new RenderContext()` is the Mosaic VALUE object, not Core's).
- **Cacheability: BUBBLES correctly.** `CacheableMetadata` is threaded end-to-end — `$componentMeta` collects
  data-source tags (L574), prop-resolver tags (L585), plugin cache (L591), entity tags (L635), then
  `$cacheable->addCacheableDependency($componentMeta)` (L655) → `$cacheable->applyTo($build)` (L253). Per-source
  contexts/max-age would ride this same path.
- **`#attached`: DROPPED.** The single `mosaic/renderer` asset library is force-attached ONCE at the FORMATTER
  level (MosaicLayoutFormatter.php:150 `$elements[$delta]['#attached']['library'][] = 'mosaic/renderer'`), so
  no component has ever needed to bubble its own libraries. The `{{ attach_library() }}` calls inside component
  twigs run in a raw `$this->twig->render()` with no render-context capture → they do NOT reliably reach the
  page (the formatter's static attach is what guarantees the one library).
- **Consequence for the embed:** `$view->buildRenderable()` returns a render array whose `#attached` carries
  view-specific, UNKNOWABLE-in-advance libraries (views.ajax for `use_ajax`, the exposed-form library, pager
  libraries, row/field libraries). The current pipeline has **no path to carry a component's dynamic
  `#attached` to the page** → AJAX pagers / exposed forms / row assets would silently break. **This is the CP-1
  foundational blocker.** Also the per-component render cache (L646-651) stores only `{html, meta}` — it must
  additionally store + replay `#attached` or cached View components lose their assets on a warm hit.

## L3c — argument introspection feasibility (core Views) — FEASIBLE
All read-only, config-derived (fits the uncacheable `/api/mosaic/views/{view}/{display}/arguments` endpoint):
- `Views::getView($id)` → `ViewExecutable::setDisplay($display)` (ViewExecutable.php:839) →
  `getHandlers('argument', $display)` (L2299) → the ordered argument handlers.
- Per handler (`ArgumentPluginBase`, ArgumentPluginBase.php): `->adminLabel()` = the row TITLE; validator =
  `->options['validate']['type']` (e.g. `entity:node`, `numeric`, `none` — L225/381); entity type + bundle
  restriction from the validator plugin id + `->options['validate_options']['bundles']`; default-argument
  plugin from `->options['default_argument_type']`; not-available behavior from `->options['default_action']`
  (L204) + `->options['validate']['fail']` (L226); `->options['break_phrase']` = multiple (`+`/`,`) allowed.
- `DisplayPluginBase::getOption('arguments')` (L783) = the raw arguments config if handler enumeration is not
  preferred. Render path (CP-1): `access($display,$account)` (L1807) → `setDisplay` → `setArguments` →
  `preExecute` (L1730) → `buildRenderable($display,$args)` (L1643) bubbles full cacheability + #attached.

## L3d — EntitySuggestController + entity resolver reuse — REUSABLE (entry points quoted)
- **Fixed-value autocomplete:** `EntitySuggestController::suggest(Request)` (src/Controller/
  EntitySuggestController.php:75) at route `mosaic.entity_suggest` → **`/mosaic/entity-suggest`**
  (mosaic.routing.yml:71-74). Query params `entity_type`, `bundle`, `q`, `limit`≤25; `accessCheck(TRUE)`
  (L37, viewer-scoped). Matches a target entity type + bundle — exactly what a Views argument validator
  `entity:node` + bundles restriction needs. Directly reusable (design §2.3).
- **This-page-field resolution:** `EntityFieldDataSource::resolve()` (src/Plugin/MosaicDataSource/
  EntityFieldDataSource.php:75) reads the HOST entity field: host entity from `$context->entity` when
  `$context instanceof MosaicRenderContext` (L193-194); `$entity->get($fieldName)` (L97) at delta (L108);
  `access('view', $this->currentUser)` ENFORCED (L204); main-prop value (target_id for entity-ref) via
  `$item->get($mainProp)->getValue()` (L221); CacheableMetadata (L129). This is precisely the "This page:
  ID/field" resolver the design reuses — for arguments we take the raw target id(s), not the rendered field.
- **Host entity is available:** `MosaicRenderContext` (src/Value/RenderContext.php) carries the entity
  (`$context->entity`, used at EntityFieldDataSource L193-194) + isPreview/request/account/language/breakpoint
  (docblock L12) → "resolve from the entity object, not the route" (design's core differentiator) is feasible.

## L3e — CP-1 blockers/risks (with sizes)
1. **#attached propagation gap — BLOCKER, size M–L.** MosaicRenderer has no `#attached` collection; must add a
   BubbleableMetadata path threaded through renderNode → both internals → the final build's `#attached`, AND
   the per-component render cache must store + replay attachments (L646-651 currently {html,meta} only). Touches
   all 4 render paths (render / renderResponsive / renderLazy / renderLazyResponsive) + SSR preview.
2. **Render-array-in-a-string-pipeline — BLOCKER-ish, size S–M.** Components are Twig→string; the View is a
   render array. Inject `RendererInterface` into MosaicRenderer; render the View's buildRenderable inside a
   render context (capture markup + bubble #attached + cacheability), embed the markup, merge metadata upward.
3. **View access + cacheability in the embed — size S.** New component calls `$view->access($display)` +
   `buildRenderable()` (the existing data source does neither). Leaves the data source untouched (R-V6 = CP-2).
4. **ViewsBrowserController filtering — size S.** Enabled-view + embeddable-display (block+embed, R-V2) filter +
   human-label grouping; serve display options through the manifest (F-087 MosaicManifestBuilder).
5. **Arguments introspection endpoint — size S.** New `/api/mosaic/views/{view}/{display}/arguments` route +
   controller (getHandlers proven L3c); uncacheable/config-derived; per-user note (all enabled views listed;
   viewer access enforced at render).
6. **views_display + views_arguments field types — size S–M.** Reuse Stage-2 MosaicFieldType machinery +
   .mosaic.yml sidecar + adapter. `views_arguments` is DYNAMIC (rows depend on the chosen display via the API)
   — a new custom field type; the Stage-3 array UX is a pattern, not a drop-in.
7. **Placeholder card both surfaces — size XS–S.** New component render (placeholder); F-087 covers both hosts.
8. **Save-time validation — size S.** MosaicPropValidator: view/display exist+embeddable, arg count, fixed-
   entity viewability (reuse the F-055 sentinel-access pattern already present), non-negative ints, url-param
   name sanitize.
- **RISK (fold into #1):** per-component render cache is keyed on STATIC props (L528) — a View's dynamic result
  is covered only if the view's cache TAGS reach $componentMeta (they will, once buildRenderable cacheability
  is captured) AND per-source CONTEXTS (url/user for CP-2 sources) land on the component cache entry, else it
  mis-caches across users/urls.
- **RISK (CP-3, size S):** a `use_ajax` View in multiple breakpoint trees — Views' own DOM/wrapper ids collide
  under F-074 id-suffixing; needs a dedicated cell (design §4).

**CP-1 bottom line:** the introspection, picker, field types, placeholder, validation and access pieces are all
straightforward (S). The ONE hard, foundational item is the **renderer #attached contract** (#1+#2, M–L) —
witness-confirmed missing today. Everything else in CP-VIEWS-EMBED rides on closing that first.
