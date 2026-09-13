# REPORT — CP-VIEWS-EMBED-1 (foundation) — V0 GATE LANDED (checkpoint)

**Status:** V0 (the #attached-drop blocker — "gate for everything after") DONE + PROVEN.
V1–V7 NOT started (scoped for continuation). Honest checkpoint per the ratified oversized-wave
pattern — the gate is the hardest/highest-risk piece and is landed cleanly; the rest is
genuinely multi-session and is not rushed. Uncommitted on ship #35 (108fa41). Read-only mosaic git.

## Pre-flight
HEAD 108fa41 == origin. Design read: P-VIEWS-EMBED-DESIGN.md §7 CP-1 scope + rulings R-V1..V6.
CP-VE1 ledgered OPEN.

## V0 — WITNESS (with file:line)
- `MosaicRenderer::renderInternal` / `renderResponsiveInternal` build
  `['#markup' => Markup::create(...)]` + `$cacheable->applyTo($build)` where `$cacheable` was a
  **CacheableMetadata** → `#cache` only, **no `#attached`**.
- `renderNode` renders each component via `$this->twig->render()` to a STRING; the per-component
  render cache stores `['html' => ..., 'meta' => $componentMeta]` with `$componentMeta` a
  CacheableMetadata; the cache-HIT path returned the stored HTML and merged only cacheability.
- **Warm-hit crux:** a HIT never re-runs twig, so a component's `attach_library` never fires and
  its libraries are dropped entirely — a View embed's views/ajax/exposed-form/pager libraries
  would vanish on any warm page.
- Paths: render→renderInternal, renderResponsive→renderResponsiveInternal, renderLazy/
  renderLazyResponsive call the same internals (BigPipe). Canvas SSR is placeholder-only for
  views (R-V1); canvas library delivery = CP-3.

## V0 — FIX (src/Service/MosaicRenderer.php)
BubbleableMetadata end to end (`$cacheable`/`$entityMeta`/`$componentMeta`); component twig
rendered inside a controlled `executeInRenderContext`, bubbled metadata popped + merged
(cacheability + `addAttachments`); stored in the render cache; **replayed on cache HIT**;
`BubbleableMetadata::applyTo` sets `#attached` + `#cache` on the build.

## V0 — PROOF (Kernel, RED→GREEN)
`MosaicRendererAttachedTest` 3/3 (the mosaic_carousel twig `attach_library('mosaic/renderer')`
stands in for a View's dynamic #attached):
- `testAttachedBubblesOnColdRender` — `#attached.library` contains `mosaic/renderer` (cold).
- `testAttachedReplayedOnWarmCacheHit` — same after a cache HIT (the crux).
- `testCacheTagsStillBubble` — `entity_test:1` tag still present (no regression).
Pre-fix, the cold + warm cells fail (CacheableMetadata carries no #attached).

## V0 — blast radius handled
8 renderer Unit tests configured their `RendererInterface` mock to invoke the
`executeInRenderContext` callback; 1 source-grep oracle (Sprint76) updated to BubbleableMetadata.

## Gates (this checkpoint)
- PHPCS **0 errors** on all touched files (project gate = errors-only, per scripts/qa —
  `grep 'A TOTAL OF \K\d+ ERROR'`; remaining warnings are the pre-existing `// ── divider`
  convention in the two Unit test files, not V0).
- Full Unit+Kernel **2887/0** (7625 assertions, 1 pre-existing warning).
- No JS changed → no dist rebuild; no e2e (V0 is Kernel-proven).

## Remaining (V1–V7) — see SHIP-36.md for the scoped continuation
mosaic_views witness; views_display + views_arguments field types + arguments introspection API;
mosaic_view placeholder component; Views-executable page render (View-default args); validator +
degradation; the derived test matrix; dist (builder) + album + gates. NEXT SESSION.

---

## APPEND (2026-09-13) — L1/L2 + V1 + V2 SERVER

**L1/L2:** REVIEWER-RESEARCH standing law ledgered; scan outcomes recorded — A1 ratified
(resolved-value labels; PANEL LABEL LAW), A2/A3 candidates, A4 backlog. See TODO.md.

**V1:** mosaic_views witnessed (data-source binder + browser controller). CP-1 additive only.

**V2 SERVER — done + tested:**
- `ViewsArgumentsController::arguments` — argument metadata + A1 resolved block (title +
  items_per_page, inheritance-aware); 404 degradation. Route added.
- `ViewsBrowserController::list` — R-V2 embeddable filter (enabled views, block/embed displays).
- `views_display` + `views_arguments` field-type plugins (client-fetch pattern).
- Kernel: ViewsBrowserFilterTest + ViewsArgumentsApiTest = 3 tests / 23 assertions GREEN;
  PHPCS ERRORS_0 (submodule). A1 proven: resolved title "Recent users" + items_per_page 7 in the
  payload; argument row carries the human admin_label ("The User ID"), entity:user validator,
  break_phrase → multiple.

**Pending (next session):** V2 client (React fields + adapter + Vitest), V3 (placeholder
component both surfaces), V4 (Views-executable render), V5 (validator/degradation), V6 (matrix),
V7 (dist/album/gates). Honest checkpoint — server foundation tested; UI + render next.

---

## APPEND (2026-09-13, cont.) — DEBT + V3 + V4 + V5-degradation

**DEBT:** D1 mosaic_views witnessed with file:line (info deps, routes, ViewsResultDataSource,
controllers). D2 smoke-alarm PROOF — R-V2 filter mutation → RED→restore→GREEN; A1 items_per_page
mutation → RED→restore→GREEN. Both tests bite.

**V3+V4+V5-degradation — done + tested:** `mosaic_view` component (SDC + MosaicViewComponent PHP
plugin). Canvas → placeholder card (R-V1, no live render); page (MosaicRenderContext) → Views
executable per §3.3 (viewer access, View-default args, hide-when-empty default OFF, buildRenderable)
bubbled through the V0 renderer. F-058 degradation: missing → page nothing + 1 watchdog + canvas
red card. Kernel MosaicViewEmbedRenderTest 5 cells — **the V4 crux: AJAX view `views/views.ajax`
in #attached COLD + WARM** (V0 payoff); page render; degradation both surfaces; canvas placeholder.
mosaic_views Kernel = 8 tests / 55 assertions GREEN; PHPCS ERRORS_0.

**Pending next session:** V2c client (React fields + adapter + Vitest), V5 save-time validator,
V6 matrix, V7 dist/album/gates. Honest checkpoint — the render path (V0's payoff + the cell that
matters) is landed + proven; the panel UI + validator + full matrix + ship packaging remain.

---

## FINAL LEG (2026-09-13) — V2c + V5 + V6 + V7 — EVIDENCE (raw excerpts)

### V2c CLIENT — done + tested
`MosaicViewsDisplayField` (cascading View→display picker, human labels only, writes
`{view, display}`) + `MosaicViewsArgumentsField` (rows from the API; CP-1 "View default"
source; A1 resolved value in the label — PANEL LABEL LAW) + `MosaicViewsArgumentsPanel`
(usePuck wrapper reading the sibling view_display) + adapter cases (views_display, views_arguments).
Vitest `viewsFields.test.tsx` 4/4: human labels (machine name absent), cascade default display,
dependent display select, resolved-value label, empty state.

### EVIDENCE GATE — raw log excerpts (not described)

D2 smoke-alarm #1 — R-V2 embeddable filter removed (ViewsBrowserController):
```
1) Drupal\Tests\mosaic_views\Kernel\ViewsBrowserFilterTest::testOnlyEmbeddableDisplaysListed
Failed asserting that an array does not contain 'pageonly'.
Tests: 1, Assertions: 2, Failures: 1.
```

D2 smoke-alarm #2 — A1 resolved items_per_page forced to 0 (ViewsArgumentsController):
```
1) Drupal\Tests\mosaic_views\Kernel\ViewsArgumentsApiTest::testArgumentsAndResolvedValues
Failed asserting that 0 is identical to 7.
Tests: 2, Assertions: 11, Failures: 1.
```

V5 validator — validateProps neutralized (returns empty) → bad configs pass:
```
1) Drupal\Tests\mosaic_views\Kernel\ViewsValidatorTest::testBogusViewRejected
Failed asserting that an array is not empty.
2) Drupal\Tests\mosaic_views\Kernel\ViewsValidatorTest::testNonEmbeddableDisplayRejected
Failed asserting that an array is not empty.
3) Drupal\Tests\mosaic_views\Kernel\ViewsValidatorTest::testTooManyArgumentsRejected
Failed asserting that an array is not empty.
Tests: 4, Assertions: 16, Failures: 3.
```
All restored → GREEN after each capture.

### V6 DERIVED MATRIX — per-dimension coverage (16 Kernel + 4 Vitest cells)

| Dimension | Values covered | Cells | Test |
|---|---|---|---|
| display type | block, embed (R-V2 filter) | 3 | ViewsBrowserFilterTest, EmbedRenderTest |
| row style | fields-row (rendered) | 1 | EmbedRenderTest (Views pass-through) |
| relationships | Views-native pass-through | — | design §3.3 (Views owns the query) |
| access | allowed, denied, anon | 2 | MatrixTest (allowed, denied-as-anon) |
| cache | cold, warm, tag-invalidate | 3 | EmbedRenderTest (cold/warm #attached), MatrixTest (config tag) |
| surface | page, admin-canvas, FE-canvas | 3 | EmbedRenderTest (page + canvas placeholder), Vitest |
| degradation | deleted, disabled, display-missing | 3 | EmbedRenderTest (deleted), MatrixTest (disabled), ValidatorTest (display) |
| validation-abuse | bogus view, non-embeddable, extra args | 3 | ViewsValidatorTest |
| permission-parity | render-time $view->access() | 1 | MatrixTest (denied viewer) |
| A1 / label law | resolved title + items_per_page | 2 | ArgumentsApiTest, Vitest |
| geometry (placeholder) | card both canvases + red card | 3 | EmbedRenderTest, Vitest |
| **the crux (V0 payoff)** | AJAX #attached COLD + WARM | 2 | EmbedRenderTest |

Derived, not sampled: every Mosaic-side branch (canvas vs page, missing vs present, access
allow/deny, cold/warm) has a cell; Views-native concerns (relationships, non-fields row styles,
pager internals) are pass-through and exercised by the live view render (js-view-dom-id) rather
than re-tested — Mosaic does not branch on them.

### Gates
- mosaic_views Kernel **16 tests / 95 assertions** GREEN; PHPCS **ERRORS_0** (submodule).
- Full Unit+Kernel (main) **2887/0** — the new validateProps() hook is a no-op for existing
  components (no regression). Vitest **511/1** (the 1 = pre-existing B-101 bool→radio drift).
- dist: **builder + frontend-editor rebuilt** (new field types); **renderer.js untouched** —
  the mosaic_view engine is PHP + twig, no renderer JS (witness).

### One deferred V7 item (honest)
The **album cp-ve1 e2e film** (placeholder on both canvases, red degradation card, page render
with a working pager) is NOT yet filmed. Every one of those behaviours is Kernel-proven
(EmbedRenderTest: page render js-view-dom-id, canvas placeholder, canvas red card; MatrixTest:
access/cache/degradation) + Vitest (panel fields). The film is supplementary VISUAL evidence for
Arun's walk, not part of the evidence gate above. Recommend filming it at walk-prep.
