# SHIP #36 — CP-VIEWS-EMBED-1 (foundation) — IN PROGRESS

Uncommitted change set on top of ship #35 (108fa41). Mosaic git read-only here.
REPORT-TO-REPO: reports/REPORT-CP-VE1.md. **This checkpoint lands V0 (the gate) only.**

## V0 — the #attached-drop blocker: DONE + PROVEN (gate for everything after)

**Witness (the drop):** MosaicRenderer rendered every component to a STRING via
`$this->twig->render()` and applied only `CacheableMetadata` (`$cacheable->applyTo($build)`),
which carries `#cache` but NOT `#attached`. The per-component render cache stored a
CacheableMetadata; a warm cache HIT returned the stored HTML WITHOUT re-running twig — so a
component's libraries (a View embed's views/ajax + exposed-form + pager) were dropped, and
dropped ENTIRELY on warm hits. Confirmed on the page paths (render → renderInternal;
renderResponsive → renderResponsiveInternal; renderLazy/renderLazyResponsive call the same
internals). Canvas SSR (renderSingleComponent) is placeholder-only for views (R-V1) — no
dynamic libraries there in CP-1; canvas library DELIVERY rides with CP-3 live preview.

**Fix (src/Service/MosaicRenderer.php):**
- `$cacheable` / `$entityMeta` / `$componentMeta` are now `BubbleableMetadata` (extends
  CacheableMetadata + attachments). `BubbleableMetadata::applyTo` sets BOTH `#cache` AND
  `#attached` on the build.
- Each component's twig render runs inside a controlled `executeInRenderContext`; the bubbled
  BubbleableMetadata (attach_library + printed render arrays like `$view->buildRenderable()`)
  is popped and merged into `$componentMeta` — cacheability + attachments.
- The per-component render cache stores that BubbleableMetadata; the **cache-HIT path replays
  it** (`addCacheableDependency` + `addAttachments`) — the warm-hit crux.
- Component→field bubble carries attachments too.

**Proof (tests/src/Kernel/Service/MosaicRendererAttachedTest.php, 3/3, RED→GREEN):**
- COLD: a rendered component's library is in `$build['#attached']['library']`.
- WARM (crux): a cache HIT still carries `#attached` (no twig re-run).
- No regression: the host entity cache tag still bubbles.
(Pre-fix the cold+warm cells FAIL — CacheableMetadata carries no #attached; the tag cell passes.)

**Regressions fixed (the refactor's blast radius):** 8 renderer Unit tests
(MosaicRendererTest ×7 + MosaicRendererCacheTest ×1) whose `RendererInterface` mock did not
invoke the `executeInRenderContext` callback — configured to run it. 1 source-grep oracle
(Sprint76SmokeTest) updated CacheableMetadata → BubbleableMetadata.

**Gates:** PHPCS **0 errors** on all touched files (project gate is errors-only; remaining
warnings are pre-existing `// ── divider` convention debt in the two Unit test files, not V0).
Full Unit+Kernel **2887/0** (7625 assertions, 1 pre-existing warning). No JS changed → no dist
rebuild; no e2e (V0 is Kernel-proven).

## V1–V7 — NOT STARTED (scoped for continuation)
V0 was the explicit gate ("THE BLOCKER FIRST"). The remaining foundation is genuinely
multi-session and is deliberately NOT rushed:
- **V1** witness `mosaic_views` (data-source binder) structure.
- **V2** `views_display` + `views_arguments` MosaicFieldType plugins + `GET /api/mosaic/views/
  {view}/{display}/arguments` introspection endpoint (CP-1: "View default" source only).
- **V3** `mosaic_view` component — placeholder card both surfaces (F-087), red "view no longer
  exists" state; NO live canvas render (R-V1).
- **V4** page render via Views executable (design §3.3): access → setDisplay → setArguments([])
  → preExecute/execute → hide-when-empty (default OFF, R-V3) → buildRenderable, bubbled through
  the V0-fixed renderer.
- **V5** save-time validator (typed JSON) + F-058 degradation (deleted/disabled → [] + 1
  watchdog + red card).
- **V6** derived RED→GREEN matrix (design §6 restricted to CP-1).
- **V7** gates + dist (builder — new field types) + album cp-ve1 + this ship record.

## Files (this checkpoint)
Modified: `src/Service/MosaicRenderer.php`; `tests/src/Unit/Service/MosaicRendererTest.php`;
`tests/src/Unit/Service/MosaicRendererCacheTest.php`; `tests/src/Unit/Smoke/Sprint76SmokeTest.php`.
New: `tests/src/Kernel/Service/MosaicRendererAttachedTest.php`.

## Add commands (mosaic repo, Arun runs — ONLY if committing the V0 gate now)
```
git add src/Service/MosaicRenderer.php
git add tests/src/Kernel/Service/MosaicRendererAttachedTest.php
git add tests/src/Unit/Service/MosaicRendererTest.php tests/src/Unit/Service/MosaicRendererCacheTest.php
git add tests/src/Unit/Smoke/Sprint76SmokeTest.php
```

---

## CONTINUATION (2026-09-13) — L1/L2 ledgered + V1 witnessed + V2 SERVER landed

**L1/L2:** REVIEWER-RESEARCH standing law + the CP-VIEWS-EMBED scan recorded in TODO.md; A1
ratified (introspection API returns resolved values; PANEL LABEL LAW — never a bare "default");
A2/A3 candidates + A4 backlog recorded.

**V1 witness:** mosaic_views = ViewsResultDataSource (the CP-2/R-V6 data-source sibling) +
ViewsBrowserController::list (all views+displays, unfiltered) + routing. CP-1 is purely additive.

**V2 SERVER — DONE + TESTED:**
- Arguments introspection API `GET /api/mosaic/views/{view}/{display}/arguments`
  (`ViewsArgumentsController`): per-argument metadata (id, human title, validator, entity_type,
  default_argument, not_available, multiple) + **A1 `resolved` block** (title, items_per_page,
  read inheritance-aware from the display's pager option). 404 on missing view/display (F-058).
- `ViewsBrowserController::list` now filters to ENABLED views with >=1 EMBEDDABLE display
  (block/embed only, R-V2); page/disabled excluded.
- `views_display` + `views_arguments` MosaicFieldType plugins (mosaic_views) — client-fetch
  pattern (mirrors ImageStyleFieldType), for the panel React fields (V2 client, next).
- **Tests:** ViewsBrowserFilterTest (R-V2 filter) + ViewsArgumentsApiTest (arguments + A1 +
  404) = 3 Kernel tests, 23 assertions, GREEN. PHPCS ERRORS_0 on the whole submodule.

**STILL PENDING (next session):** V2 client (ViewsDisplayField + ViewsArgumentsField React
fields + adapter cases + Vitest, label law in panel strings) · V3 (mosaic_view component +
placeholder card both surfaces, F-087, red "view no longer exists") · V4 (Views-executable page
render, design §3.3, View-default args, bubbled through the V0-fixed renderer) · V5 (validator +
degradation) · V6 (derived matrix) · V7 (dist builder + album cp-ve1 + gates).

**Files this checkpoint (all mosaic_views, read-only git — Arun commits):**
New: `src/Controller/ViewsArgumentsController.php`, `src/Plugin/MosaicFieldType/ViewsDisplayFieldType.php`,
`src/Plugin/MosaicFieldType/ViewsArgumentsFieldType.php`, `tests/src/Kernel/ViewsArgumentsApiTest.php`,
`tests/src/Kernel/ViewsBrowserFilterTest.php`. Modified: `src/Controller/ViewsBrowserController.php`,
`mosaic_views.routing.yml`.

---

## CONTINUATION (2026-09-13, cont.) — DEBT + V3 + V4 + V5-degradation landed

**DEBT (reviewer conditional-accept):**
- D1: mosaic_views witnessed with file:line — info.yml deps (mosaic:mosaic, drupal:views);
  routes views_browser (/api/mosaic/views/list) + views_arguments; ViewsResultDataSource
  (data-source sibling, CP-2); no .services.yml (controllers static create()). In REPORT-CP-VE1.md.
- D2 smoke-alarm: mutated the R-V2 embeddable filter (ViewsBrowserController) → RED, restored →
  GREEN; mutated the A1 resolved items_per_page (ViewsArgumentsController) → RED, restored → GREEN.
  Both tests bite.

**V3 (component) + V4 (page render) + V5 (degradation) — DONE + TESTED:**
- `mosaic_view` SDC component (mosaic_views/components/mosaic_view): component.yml + mosaic.yml
  (field_types views_display + views_arguments) + twig (placeholder card / red missing card / view
  render). PHP plugin `MosaicViewComponent` (#[MosaicComponent], DI) — resolveProps: canvas
  (base RenderContext) → placeholder data (view label · display label · arg summary · "Renders on
  the published page"), R-V1 no live render; page (MosaicRenderContext) → runs the Views executable
  per §3.3 (access($display, viewer) → setDisplay → setArguments([]) → preExecute/execute →
  R-V3 hide-when-empty default OFF → buildRenderable), returned as `_view_render` and bubbled
  through the V0 renderer. getCacheMetadata adds config:views.view.{id}.
- Degradation (F-058): missing/disabled view/display → page renders nothing + ONE watchdog
  warning; canvas shows the red "View no longer exists" card.
- **Kernel (MosaicViewEmbedRenderTest, 5 cells): the V4 crux — an AJAX view's `views/views.ajax`
  library is in #attached COLD and WARM** (the V0 payoff); the view renders on the page
  (js-view-dom-id); missing view → page nothing; missing → canvas red card; valid → canvas
  placeholder (no live render, R-V1). All mosaic_views Kernel = 8 tests / 55 assertions GREEN,
  PHPCS ERRORS_0.

**STILL PENDING (next session):** V2c client (MosaicViewsDisplayField + MosaicViewsArgumentsField
React fields + adapter cases + Vitest, label law in strings) · V5 save-time validator (typed JSON,
MosaicPropValidator) · V6 derived matrix (display × row × access × cache × surface × abuse +
permission-parity + geometry on both canvases) · V7 dist (builder — the new field types) + album
cp-ve1 (placeholder both canvases) + full gates.

**Files added this checkpoint (mosaic_views, read-only git — Arun commits):**
`src/Plugin/MosaicComponent/MosaicViewComponent.php`, `components/mosaic_view/{mosaic_view.component.yml,
mosaic_view.mosaic.yml, mosaic_view.twig}`, `tests/src/Kernel/MosaicViewEmbedRenderTest.php`.
