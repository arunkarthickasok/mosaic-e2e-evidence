# SHIP #37 — CP-VE2 (scenario-universe harness + argument matrix) — IN PROGRESS

Uncommitted change set on top of ship #36 (44a09c8). Mosaic git read-only here.
REPORT-TO-REPO: reports/REPORT-CP-VE2.md.

---

## SHIP #37 — CONSOLIDATED CEREMONY `git add` (run from `web/modules/custom/mosaic`)

Read-only law: the AI does NOT stage the mosaic repo — this is the command for the human commit
at ceremony time. Verified against `git status --porcelain` at HEAD **44a09c8**. Expected staged
count: **33** (21 modified + 12 new). Grouped by phase; run all five (or concatenate).

```bash
# H1–H3 — the scenario-universe harness (new)
git add \
  modules/mosaic_views/tests/src/Support/ScenarioUniverse.php \
  modules/mosaic_views/tests/src/Support/ViewFactory.php \
  modules/mosaic_views/tests/src/Kernel/ScenarioMatrixTest.php

# M1 — the shared ArgumentResolver (R-V6) + both wired call-sites
git add \
  modules/mosaic_views/src/Service/ViewsArgumentResolver.php \
  modules/mosaic_views/mosaic_views.services.yml \
  modules/mosaic_views/tests/src/Kernel/ViewsArgumentResolverTest.php \
  modules/mosaic_views/src/Plugin/MosaicComponent/MosaicViewComponent.php \
  modules/mosaic_views/src/Plugin/MosaicDataSource/ViewsResultDataSource.php

# M2–M5 — panel + endpoints + cacheability/exclude/validator (rebind + widget + libs)
git add \
  modules/mosaic_views/src/Controller/ViewsArgumentSourcesController.php \
  modules/mosaic_views/mosaic_views.routing.yml \
  modules/mosaic_views/components/mosaic_view/mosaic_view.mosaic.yml \
  modules/mosaic_views/components/mosaic_view/mosaic_view.component.yml \
  js/src/builder/MosaicPuckAdapter.ts \
  js/src/builder/index.tsx \
  js/src/builder/fields/MosaicViewsArgumentsField.tsx \
  js/src/builder/fields/__tests__/viewsFields.test.tsx \
  js/src/shared/types/schema.ts \
  src/Plugin/Field/FieldWidget/MosaicLayoutWidget.php \
  mosaic.libraries.yml \
  modules/mosaic_views/tests/src/Kernel/ViewsArgumentSourcesControllerTest.php \
  modules/mosaic_views/tests/src/Kernel/MosaicViewFieldTypesTest.php \
  modules/mosaic_views/tests/src/Kernel/ViewsArgumentCacheabilityTest.php \
  modules/mosaic_views/tests/src/Kernel/ViewsExcludeThisPageTest.php \
  modules/mosaic_views/tests/src/Kernel/ViewsArgumentDegradationTest.php

# N1 — native-exclude help  +  N2 BUG 1 (buildRenderable args) & BUG 2 (render-cache CID contexts) + guard
git add \
  modules/mosaic_views/src/Controller/ViewsArgumentsController.php \
  modules/mosaic_views/tests/src/Kernel/ViewsArgumentsApiTest.php \
  src/Service/MosaicRenderer.php \
  mosaic.services.yml \
  tests/src/Unit/Service/MosaicRendererTest.php \
  tests/src/Unit/Service/MosaicRendererCacheTest.php \
  modules/mosaic_views/tests/src/Kernel/ViewsEmbedRenderTest.php

# dist — builder-first, FE-last (already rebuilt; libs 1.0.17)
git add js/dist/builder.js js/dist/frontend-editor.js
```

**Verify:** `git status --porcelain | grep -c '^[MA]'` → **33**  ·  `git status --porcelain | grep '^??'`
should then show ONLY the excluded noise below (nothing ship-relevant).

**EXCLUSIONS — never staged (verified against `git status --porcelain`):**
- `web/cpve2_content.php` — DOCROOT film content-builder scratch (outside this repo; already deleted).
  The scratch nodes 972–981 + views live only on the dev site for Arun's walk.
- `js/e2e/journeys/cp-ve2-film.spec.ts` — gitignored (`.gitignore:15 js/e2e/`).
- `AI/` — gitignored symlink to the evidence repo (`.gitignore:12 AI`).
- `assets/`, `js/*.log`, `tests/*.log`, `js/e2e.zip`, `js/esc-probe.config.ts`, `js/esc-probe.log` —
  untracked noise, not ship files (pre-existing / probe leftovers).

Per-phase counts: H1–H3 = 3 · M1 = 5 · M2–M5 = 16 · N1–N2 = 7 · dist = 2  →  **33**.

---

**This checkpoint lands PHASE H (the harness) only.** *(historical — the file grew across the whole
ship #37 arc below; the add block above is the consolidated final set.)*

## Charter
Ratified from the S3 harness-FIRST walk ruling (2026-09-13) + design §3.2/§3.4/§5 + R-V6 + A2.
Explicitly multi-session with honest checkpoints. Two phases:
- **PHASE H (this leg):** the deterministic scenario-universe harness. Checkpoint + reviewer audit
  BEFORE Phase M.
- **PHASE M (after H accepted, separate charter):** the argument-source matrix + R-V6 shared
  ArgumentResolver + A2 witness-first + §3.4 cacheability + validator/degradation + e2e film.

## PHASE H — DONE + GREEN (checkpoint)

Deterministic test harness so the argument matrix + every later views-embed change is regression-
covered by DERIVED Kernel cells (Arun samples representative cells). Test support only — no `src/`
production code changed.

**H1 — fixture factory** (`tests/src/Support/ScenarioUniverse.php`, 328 lines):
seeded + idempotent. 2 vocabularies × 3-level term trees (2 roots + 4 children + 4 grandchildren =
10/vocab) × 2 content types (plain + paragraph-host) × 2 paragraph types with real 2-level nesting
(host → nest → leaf) × 5 entity-ref field storages (node→term, node→node chain, host→paragraphs,
para→term, para→nested) × 8 nodes (4 pub + 2 unpub plain + 2 host) × publish states × principals
(anon + auth + restricted, 1 no-perm role). **DETERMINISTIC:** assignments come from a pure
`seededIndex($seed,$n,$salt)` (Knuth multiplicative hash) — no rand/time/uniqid. SYNERGY
(ledgered): reusable as the future F-086 demo-recipe seed.

**H2 — view generator** (`tests/src/Support/ViewFactory.php`, 203 lines): `make($spec)` →
`[$viewId,$displayId]`, programmatic View over node_field_data, embeddable `embed_1`, across the
grid — argument (nid | term-with-depth | uid=current_user) × depth (on/off) × exposed (none | type
| term, vid-bound) × display (block | embed) × pager (mini | full). Spec-encoded id → idempotent.

**H3 — matrix runner** (`tests/src/Kernel/ScenarioMatrixTest.php`, 165 lines): builds the universe
ONCE, then runs derived cells via `#[DataProvider]` — 5 representative grid cells (real Views
executable path: access → setDisplay → setArguments([]) → preExecute → execute → assert result is
array) + a universe-structure cell + a determinism cell (recomputes the seed prediction, asserts
purity). Per-dimension coverage: argument nid×2/term×2/uid×1; depth on×1/off×4; exposed
none×3/type×1/term×1; display embed×3/block×2; pager mini×3/full×2.

**REDs hit + fixed during the build (harness genuinely exercised, not hand-waved):**
- `LogicException: taxonomy module does not define a schema for table 'taxonomy_index'` — D11
  creates it via `taxonomy_install()`, not hook_schema; runner now creates it in setUp (canonical
  columns).
- `Call to a member function getConfigDependencyKey() on null` (TaxonomyIndexTid:441) — the exposed
  term filter needs a `vid` on save; generator now binds `VOCAB_A`.

**Gates (checkpoint):**
- PHPUnit `ScenarioMatrixTest` **7/7, 160 assertions, 17.8s** (≤~90s budget MET).
- PHPStan L6 **[OK] No errors**; PHPCS (Drupal, errors-only) **exit 0** — all three files.
- No `src/` production change; no JS/dist rebuild; no e2e (Phase H is Kernel-only).

## Files (Phase H — uncommitted)
- `modules/mosaic_views/tests/src/Support/ScenarioUniverse.php` (new, 328)
- `modules/mosaic_views/tests/src/Support/ViewFactory.php` (new, 203)
- `modules/mosaic_views/tests/src/Kernel/ScenarioMatrixTest.php` (new, 165)

## CHECKPOINT — STOP for reviewer audit before Phase M
Open audit questions in REPORT-CP-VE2.md: (1) grid sampling vs full Cartesian product; (2) whether
a per-cell access dimension belongs in Phase H or Phase M's §3.4 cacheability leg; (3) whether a
two-container same-seed fingerprint diff cell is wanted for determinism.

## PHASE H4 — MATRIX EXPANSION (reviewer rulings Q1–Q3) — DONE + GREEN

Reviewer accepted the H checkpoint with a remediation. All three landed:
- **Q1 full derived product**: 48 cells (argument{nid,term,term+depth,uid} × exposed{none,type,term}
  × display{block,embed} × pager{mini,full}) enumerated by nested loops, not hand-picked; per-
  dimension coverage asserted (`[12,12,12,12]`, `48 ran`).
- **Q2 access axis**: 16 cells (argument × principal{root,auth,restricted,anon}) on perm-gated views;
  access ⊥ pager/display reasoning stated → 16 not 192.
- **Q3 oracle upgrade**: every cell asserts result nids == set DERIVED from the universe (counts AND
  nid sets); term+depth cells assert child AND grandchild inclusion. "is array" gone.
- Universe built ONCE (single test method). A throwaway probe confirmed the derivation mirrors real
  Views semantics (depth-0=exact, depth-2 from root=subtree, unsubmitted exposed=no filter, perm gate
  root/auth-in restricted/anon-out) before finalising.
- Gates: harness suite **1 test, 46 assertions, 2.9s** (≤90s MET); full mosaic_views **no regression**;
  PHPStan L6 clean; PHPCS errors-only clean. Determinism two-container fingerprint ledgered optional
  Wave-G. Budget met + zero reds → CONTINUE to Phase M.

## PHASE M — M1: shared ArgumentResolver (R-V6) — DONE + GREEN

- **Witness (before)**: embed hardcoded `setArguments([])`; data source took only literal
  `config['arguments']`. No per-slot source resolution, no shared path.
- **Build**: `src/Service/ViewsArgumentResolver.php` (new, FQCN service id, injects request_stack +
  current_user). `resolve(sources, ?host)` maps per-slot specs → positional args: view_default→null,
  fixed→literal, url_param→request, current_user→uid, this_page→host id, page_field→host field.
  All-null collapses to [] (CP-1 backward compatible).
- **RED→GREEN**: `ViewsArgumentResolverTest` — RED `ServiceNotFoundException` (4 errors) → GREEN 4/4,
  78 assertions (each source proven against the universe).
- **Wiring (after)**: BOTH call-sites now use the one resolver — embed adds an `argument_sources`
  prop + resolves with the host entity; data source prefers source specs, literal `arguments` kept as
  fallback. Backward compatible (absent sources → []).
- **Fixed in passing**: `MosaicViewComponent::create()` missing the project's `// @phpstan-ignore
  new.static` idiom (base carries it) — applied.
- Gates: resolver 4/4; full mosaic_views **25/25, 231 assertions** (no regression); PHPStan L6 clean;
  PHPCS errors-only clean.

### M1 files (uncommitted)
- `modules/mosaic_views/src/Service/ViewsArgumentResolver.php` (new)
- `modules/mosaic_views/mosaic_views.services.yml` (new)
- `modules/mosaic_views/tests/src/Kernel/ViewsArgumentResolverTest.php` (new)
- `modules/mosaic_views/src/Plugin/MosaicComponent/MosaicViewComponent.php` (wired)
- `modules/mosaic_views/src/Plugin/MosaicDataSource/ViewsResultDataSource.php` (wired)

## PHASE M — M2–M5 + dist (M7 part) — CODE COMPLETE + GATED

- **M2 panel** (`fields/MosaicViewsArgumentsField.tsx`): per-row SOURCE dropdown (view_default, fixed,
  url_param, current_user, this_page, page_field) writing positional `argument_sources`; inputs —
  fixed→entity autocomplete (new endpoint) / url_param→name / page_field→host-bundle field select
  (new endpoint); PANEL LABEL LAW (F-105 resolved parenthetical on View default). Endpoints in
  `Controller/ViewsArgumentSourcesController.php` (final + CII + StringTranslationTrait, gated). Field
  type rebound `arguments`→`argument_sources`; host entity_type+bundle threaded toConfig→panel; widget
  attaches `bundle`. Vitest 8/8; endpoints Kernel 2/2.
- **M3 cacheability** (`ViewsArgumentResolver::getCacheability`, wired into embed + data source
  getCacheMetadata): current_user→'user', url_param→'url.query_args:<name>', this_page/page_field→host
  tags, fixed→referenced-entity tag; max-age untouched. RED→GREEN 6/6 incl. embed wiring proof.
- **M4 exclude-this-page WITNESS**: native Views numeric `not` option (UI "Exclude") inverts the
  argument; Mosaic's this_page source (M1) feeds it — build nothing. `ViewsExcludeThisPageTest` 1/1
  proves host dropped, rest kept.
- **M5 validator + degradation**: validateProps flags a `fixed` source referencing a DELETED entity;
  resolver degrades a missing page_field→null and a deleted fixed→stale-id (empty View, no crash).
  RED→GREEN 4/4.
- **dist (M7 part)**: builder + FE both rebuilt (builder-first, FE-last — FE imports toConfig + shared
  schema); libraries 1.0.16→**1.0.17**; routes verified live.
- **Fixed in passing**: MosaicViewFieldTypesTest oracles updated for the rebind.
- Gates: Vitest 8/8 (full 515/1 pre-existing B-101); full mosaic_views 38/38; **full main-module
  Unit+Kernel 2887/2887, 7625 assertions, 0 failures** (1 pre-existing warning); PHPStan L6 clean;
  PHPCS errors-only clean; tsc clean (my files; 1 pre-existing dsdShadow error).

### M2–M5 files
New: `Controller/ViewsArgumentSourcesController.php`, 4 Kernel tests. Modified:
`Service/ViewsArgumentResolver.php`, `Plugin/MosaicComponent/MosaicViewComponent.php`,
`Plugin/MosaicDataSource/ViewsResultDataSource.php`, `Support/ViewFactory.php`,
`mosaic_views.routing.yml`, `components/mosaic_view/*.yml`, `js/src/builder/MosaicPuckAdapter.ts`,
`js/src/builder/index.tsx`, `js/src/builder/fields/MosaicViewsArgumentsField.tsx`,
`js/src/shared/types/schema.ts`, `src/Plugin/Field/FieldWidget/MosaicLayoutWidget.php`,
`mosaic.libraries.yml`, `js/dist/builder.js`, `js/dist/frontend-editor.js`.

## PHASE N — FILM LEG (final before walk) — ROAD CORRECTED, A2 NATIVE, 2 BUGS CAUGHT

- **LEDGER:** "walk → tag" corrected — road is CP-VE3 → ACT 2 → Wave D-0+D/F → Wave G → dev push
  → Arun soak → tag (bible §P4). Walk = review gate, not a tag trigger.
- **N1 (A2 native):** introspection API reports `supports_exclude` per argument (from the handler
  `->options`); the panel's "This page" row shows a native-Exclude help note when supported.
  ViewsArgumentsApiTest 4/4; Vitest 9/9.
- **N2 film (cp-ve2 album):** deterministic content (web/cpve2_content.php, hosts 977–981). Frames
  with geometry oracles. Building it caught **two real bugs**:
  - **BUG 1**: `renderView()` called `buildRenderable($display, [])` — the 2nd param IS the render
    arguments — so the embed showed the unfiltered View (977 rendered 50 rows, not 2). Fix: pass
    resolved args. Guard: ViewsEmbedRenderTest::testEmbedAppliesResolvedArgument.
  - **BUG 2**: per-component render CID keyed on static props only → a url_param/current_user source
    served a stale render (?tid=2 == ?tid=3). Fix: fold the component's cache contexts into the CID
    (MosaicRenderer + @cache_contexts_manager); warm hit now instantiates the plugin for contexts
    but twig still never re-runs. Guard: testRenderCacheVariesByUrlParamContext. Blast radius: 2
    renderer Unit tests re-oracled (23/23).
- **N3 walk list:** reports/WALK-CP-VE2.md — 10 steps, exact nodes + expects, each backed by a frame.
- Gates: Vitest 9/9, ViewsEmbedRenderTest 2/2, renderer Unit 23/23, full mosaic_views 40/40, PHPStan
  (new code) clean, PHPCS 0. dist current (N1 help string in builder; libs 1.0.17).

## WALK-CATCH #57 + #57-REOPENED + #58 (from Arun's walk)
- **#57** (autocomplete drops keys): EntityAutocomplete → local state + debounced (~280ms) abortable
  lookup + commit only on pick; witness-scan ledgered (url_param per-key commit, 24× usePuck storm).
- **#57 REOPENED (delivery):** aggregation OFF + libs NOT bumped after the WC57 rebuild → browsers
  served the cached pre-fix bundle. FIX: **libs 1.0.17 → 1.0.18** (all 3) + rebuild builder+FE + cr.
  LAW: bump libs after EVERY dist rebuild. Storm not promoted (typing is smooth once delivered).
- **#58** (store-id/show-label): pick already commits `r.id`; added `entity-label` endpoint +
  EntityAutocomplete shows "Selected: <label>" on reopen. ORACLE-CHANGE (accepted): the pick Vitest
  cell now asserts the ID value committed, not just "called once".
- Gates: Vitest 11/11 (518/1 full), sources-controller Kernel 3/3, full mosaic_views **42/42**, film
  **8/8** (frame 10 = full pick→save→filtered loop), PHPCS/PHPStan clean, libs **1.0.18**.
- **Add-block delta: NONE** — all WC57/#57-reopened/#58 changes touched files ALREADY in the
  consolidated add block: `MosaicViewsArgumentsField.tsx`, `viewsFields.test.tsx`,
  `ViewsArgumentSourcesController.php` + its Kernel test, `mosaic_views.routing.yml`,
  `mosaic.libraries.yml`, `js/dist/*`. No new tracked files. Ship #37 count stays **33**.

## CHECKPOINT — the final ceremony leg remains
M6 e2e film album cp-ve2 (autocomplete journey, ?param swap, current-user delta logged-in vs anon,
depth cell) + GEOMETRY + proposed representative walk list · full Unit+Kernel ceremony gate · Arun's
representative walk. Functionality is unit/kernel/Vitest-proven; M6 is browser-level evidence.

**ROAD CORRECTION (supersedes any earlier "walk → tag"):** ship #37 is NOT followed by a tag. The
ratified road after ship #37 is **CP-VE3 → ACT 2 → Wave D-0 + D/F → Wave G → dev push → Arun soak →
tag** (bible §P4 + ratified queue). Arun's walk is a review gate within ship #37, not a release
trigger.
