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

## PHASE M (not started)
M1 ArgumentResolver service (R-V6 shared embed + data-source; witness ViewsResultDataSource first) ·
M2 panel per-row source dropdown · M3 §3.4 cacheability derived cells (RED first) · M4 A2 "exclude
this page" WITNESS-FIRST · M5 validator extensions + degradation · M6 e2e film album cp-ve2 ·
M7 gates + dist + SHIP-37 final + ledger + report push.
