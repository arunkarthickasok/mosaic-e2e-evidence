# SHIP #37 — CP-VE2 (scenario-universe harness + argument matrix) — IN PROGRESS

Uncommitted change set on top of ship #36 (44a09c8). Mosaic git read-only here.
REPORT-TO-REPO: reports/REPORT-CP-VE2.md. **This checkpoint lands PHASE H (the harness) only.**

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

## CHECKPOINT — the final ceremony leg remains
M6 e2e film album cp-ve2 (autocomplete journey, ?param swap, current-user delta logged-in vs anon,
depth cell) + GEOMETRY + proposed representative walk list · full Unit+Kernel ceremony gate · Arun's
representative walk · tag. Functionality is unit/kernel/Vitest-proven; M6 is browser-level evidence.
