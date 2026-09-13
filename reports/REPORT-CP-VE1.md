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

---

## WALK-PREP FILM (2026-09-13) — R0/R1/R2/R3 (probe-then-report, film only)

**R0:** HEAD 108fa41; ship #36 set intact (V0-V7 files M/??); dead session touched nothing. The
prior session died mid zero-rows investigation (API error). Interruption ledgered.

**R1/R2 — zero-rows probe → VERDICT: FIXTURE (resolved).** The film page showed the view wrapper
+ mini pager but 0 "CPVE1 Article" rows. Witness: the view returns 2 rows (executable), and
**Views' OWN native render also showed 0 "CPVE1 Article"** — it printed other nodes
(`NYS ITS…`, `Pfizer…`). Cause: `nid ASC` over 20+ published pages put the new nodes on a later
page. The Mosaic embed rendered the IDENTICAL rows Views-native did (`NYS ITS`:1, `Pfizer`:1,
views-row:2) — no row-drop; V0's capture keeps child #markup. Fixture fixed (title filter +
sort) → page 1 now shows Article 1|2 + pager; the AJAX "Next" swaps to Article 3|4.

**F1 FILM — 7/8 frames GREEN** (album cp-ve1/): 01 admin placeholder card, 03 FE placeholder
(parity), 04a/04b page + AJAX pager (rows change), 05a/05b degradation (red card + empty page),
06 anon parity. All real-pointer.

### NEW DEFECT — F-104 (mechanism quoted; NO fix; reviewer + Arun rule)
Frame 02 (admin panel) FAILED: the picker + argument rows are absent; the panel renders RAW schema
fields (machine names view_display/view/display/arguments/hide_when_empty leak — label-law
violation).

Witnessed hop-by-hop:
- Served manifest (`ManifestController`): `mosaic_view` **field_types = EMPTY**; propDefinitions =
  view_display,view,display,arguments,hide_when_empty.
- Component definition: `getDefinition('mosaic_view')` has **NO `field_types` key** (class =
  `MosaicViewComponent`, a PHP-class component). By contrast `getDefinition('mosaic_carousel')`
  (class `SdcComponentPlugin`, SDC-only) HAS `field_types: [image_style, slides]`.
- Field-type plugins ARE registered (views_display, views_arguments) and the .mosaic.yml sidecar
  DOES declare them — but they never reach the definition.

**Mechanism:** `MosaicComponentManager::getDefinitions()` merges the SDC/.mosaic.yml sidecar data
into a PHP-class component's definition for canvas_class / style_tokens / requires_ssr_preview /
icon / level / category / description / tags — but **NOT `field_types`**. So any component that
has BOTH a PHP class (`#[MosaicComponent]`) AND a `.mosaic.yml` `field_types` block loses its
field_types from the manifest; the builder then falls back to the raw schema propDefinitions.
mosaic_view is the first such component (it needs a PHP class for the Views executable in
resolveProps AND field_types for the panel), so it is the first to expose this gap.

**Scope:** AUTHORING-PANEL ONLY. The render path is unaffected — `resolveProps` reads props
directly; all 16 Kernel + the page/pager/degradation frames are GREEN. The picker just can't be
authored via the panel (a developer can still set view_display in JSON, as the fixtures do).

**Proposed RED cell (not written — reviewer rules):** a Kernel assertion that
`getDefinition('mosaic_view')['field_types']` contains `view_display` + `arguments` (currently RED
— absent), mirrored by a served-manifest assertion. Fix candidate (for the ruling): the
PHP-class/SDC merge in MosaicComponentManager must UNION the sidecar `field_types` into the
PHP-class definition. NO fix applied this leg (film-only charter + witnessed-mechanism rule).

---

## F-104 FIX (2026-09-13) — rides ship #36 (X1–X5)

**X2 blast radius:** scan of PHP-class components (`#[MosaicComponent]`) with a `.mosaic.yml`
field_types block → **mosaic_view ONLY**. X2b merge carried-vs-dropped: `MosaicComponentManager::
findDefinitions()` preserves prop_types + slots (explicit) + `ComponentDefinition::SIDECAR_KEYS`
[canvas_class, canvas_tag, tag_prop, tag_map, canvas_text_prop, canvas_class_modifiers,
inline_editable_prop, style_tokens, requires_ssr_preview, level] — **field_types is the ONLY
dropped key** (no other candidates; ledgered).

**X3 fix:** `MosaicComponentManager::findDefinitions()` now unions the sidecar `field_types` into a
PHP-class definition (mirrors the prop_types/slots preserve):
```php
if (!isset($phpDef['field_types']) && !empty($sdcDef['field_types'])) {
  $phpDef['field_types'] = $sdcDef['field_types'];
}
```

**RED (before fix) — raw excerpt:**
```
1) Drupal\Tests\mosaic_views\Kernel\MosaicViewFieldTypesTest::testDefinitionHasFieldTypes
Failed asserting that an array has the key 'field_types'.
2) Drupal\Tests\mosaic_views\Kernel\MosaicViewFieldTypesTest::testManifestExposesFieldTypes
Failed asserting that null is identical to 'views_display'.
Tests: 3, Assertions: 4, Failures: 2.
```
**GREEN (after fix):** MosaicViewFieldTypesTest 3/3 — getDefinition('mosaic_view')['field_types']
has view_display + arguments; served manifest field_types[view_display].type === 'views_display' +
[arguments].type === 'views_arguments'; SDC-only carousel field_types [slides] unchanged (regression).

**Two additional panel-consistency fixes (witnessed, within the "reachable picker" ratification —
reported, not silent):** (1) the field_type key was `views_display` but the component reads prop
`view_display` (mismatch → picker value lost) → renamed the mosaic.yml key to `view_display`;
(2) getPropDefinitions declared `view`/`display` as schema props → raw machine-name fields → removed
them (the picker's `view_display` object drives it; separate view/display are still ACCEPTED at
render via extractViewDisplay for the developer API + Kernel fixtures). Without both, F-104's merge
alone would surface a broken/dirty panel.

**X4 refilm — frame 02 GREEN:** the panel shows the cascading picker (human labels "CPVE1 recent
articles" / "Embed: list"), the argument row "The node ID", and the PANEL-LABEL-LAW string
**"View default (CPVE1 recent articles)"**; the machine view id (cpve1_list) never appears.
Album now 8/8 (`02-admin-panel-label-law.png` replaces the defect frame).

**Pre-existing observation (NOT F-104, not fixed):** the responsive/breakpoint-override panel
section lists prop machine names (view_display/arguments/hide_when_empty) for ALL components — a
general pre-existing UI, unrelated to the mosaic_view authoring picker.

**Gates:** mosaic_views Kernel 19 tests / 102 assertions GREEN; full Unit+Kernel (main) **2887/0**
(MosaicComponentManager core change — no regression); PHPCS ERRORS_0. **No JS changed** → no dist
rebuild (renderer/builder/FE bundles untouched; the adapter already handles views_display/
views_arguments from the prior leg).
