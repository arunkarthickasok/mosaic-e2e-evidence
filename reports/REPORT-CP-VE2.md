# REPORT — CP-VE2 — PHASE H (scenario-universe harness) — CHECKPOINT

**Status:** Phase H (the harness) DONE + GREEN. Phase M (ArgumentResolver service, panel
source dropdown, §3.4 cacheability, A2 "exclude this page", validator/degradation, e2e film)
NOT started — deliberate checkpoint per the charter ("CHECKPOINT after H: report + push,
reviewer audits before Phase M"). Uncommitted on ship #36 (44a09c8). Read-only mosaic git —
only file edits were made in the module tree; no git state ops there.

## Pre-flight
- HEAD **44a09c8 == origin** (upstream ref matches). Verified before any work.
- CP-VE2 ledgered OPEN (ledger-live/TODO.md).
- Ratified basis: S3 harness-FIRST walk ruling (2026-09-13) + design §3.2/§3.4/§5 + R-V6 + A2.
- Availability confirmed: `paragraphs` + `entity_reference_revisions` contrib + `taxonomy` core.

## What Phase H is
A DETERMINISTIC scenario-universe test harness so the argument matrix (Phase M) and every
later views-embed change is regression-covered by derived Kernel cells Arun samples from —
rather than by hand-authored one-off fixtures. Three pieces:

- **H1 — fixture factory** (`ScenarioUniverse`, 328 lines)
- **H2 — view generator** (`ViewFactory`, 203 lines)
- **H3 — matrix runner** (`ScenarioMatrixTest`, 165 lines)

All three are new, untracked files under `modules/mosaic_views/tests/src/` (696 lines total).
They are TEST SUPPORT only — no `src/` production code changed in Phase H.

---

## H1 — FIXTURE FACTORY (`tests/src/Support/ScenarioUniverse.php`)

A seeded, idempotent builder. `new ScenarioUniverse($seed); $u->build();` then read via accessors.

### Determinism (the ratified MUST — "same seed → same universe")
- The universe STRUCTURE is fixed. Only the entity-ref ASSIGNMENTS vary, and they are driven
  by a **pure function of the seed**, never a global RNG:
  ```php
  public static function seededIndex(int $seed, int $n, int $salt): int {
    return $n === 0 ? 0 : (($seed * 2654435761 + $salt * 40503) % $n + $n) % $n;
  }
  ```
- No `rand()`, `mt_rand()`, `time()`, `uniqid()`, `\Drupal::time()` anywhere. Two runs with the
  same seed produce byte-identical assignments. The determinism cell (H3) recomputes the
  expected index from the seed and asserts each node's actual term ref matches it.
- The factory is made `public static` specifically so the determinism cell can recompute the
  prediction independently of the build.

### The universe (per-dimension counts)

| Dimension | Coverage | Count |
|---|---|---|
| Vocabularies | `cpve2_vocab_a`, `cpve2_vocab_b` | 2 |
| Term tree / vocab | roots → children → grandchildren (3 levels) | 2 + 4 + 4 = 10 |
| Terms total | across both vocabularies | 20 |
| Content types | `cpve2_plain`, `cpve2_host` (paragraph-host) | 2 |
| Paragraph types | `cpve2_para` (nesting) + `cpve2_leaf` | 2 |
| Paragraph nesting depth | host → nest → leaf | 2 levels |
| Entity-ref field storages | node→term, node→node, host→paragraphs, para→term, para→nested | 5 |
| Nodes | 4 published plain + 2 unpublished plain + 2 host | 8 |
| Publish states | published / unpublished | 2 |
| Principals | anon (`getAnonymousUser`) + auth + restricted | 3 |
| Custom roles | `cpve2_restricted` (no permissions) | 1 |

- **node→node** chains the plain nodes (each references the previous) — an entity-ref graph, not
  just leaf refs.
- **host→nest→leaf** is real 2-level paragraph nesting; the nest references an A-grandchild term
  and the leaf references a B-grandchild term (for the taxonomy-depth cells).
- SYNERGY (ledgered): this factory is designed to double as the future **F-086 demo-recipe** seed
  (no recipe work in this CP).

---

## H2 — VIEW GENERATOR (`tests/src/Support/ViewFactory.php`)

`ViewFactory::make($spec)` returns `[$viewId, $displayId]` for a programmatic View over
`node_field_data`, fields-row, an embeddable display (`embed_1`), status=1 filter, `use_ajax`,
`items_per_page => 2`. The view id encodes the spec so the same spec is idempotent. Grid axes:

| Axis | Values |
|---|---|
| argument | `nid` (numeric, ignore) · `term` (`taxonomy_index_tid_depth`) · `uid` (numeric, default = current_user) |
| taxonomy depth | on (depth 2) / off (depth 0) — term argument only |
| exposed filter | none · `type` (node bundle) · `term` (`taxonomy_index_tid`, vid-bound) |
| display | `block` · `embed` |
| pager | `mini` · `full` |

---

## H3 — MATRIX RUNNER (`tests/src/Kernel/ScenarioMatrixTest.php`)

Builds the universe ONCE per test (shared installs), then runs derived cells over the grid via
`#[DataProvider]`. Five representative grid cells + a universe-structure cell + a determinism cell.

### Per-dimension coverage across the 5 grid cells

| Dimension | Distribution across cells |
|---|---|
| argument | nid ×2, term ×2, uid ×1 |
| depth | on ×1, off ×4 |
| exposed | none ×3, type ×1, term ×1 |
| display | embed ×3, block ×2 |
| pager | mini ×3, full ×2 |

Each grid cell runs the real Views executable path: `ViewFactory::make` → `Views::getView` →
`access($displayId)` → `setDisplay` → `setArguments([])` → `preExecute` → `execute` → assert
`$view->result` is an array (executes without error, returns a filtered result set).

### RAW — the harness genuinely exercised (REDs hit + resolved during the build)
Not a hand-waved green. Two real failures were hit and fixed while building H3:
```
LogicException: taxonomy module does not define a schema for table 'taxonomy_index'.
  ScenarioMatrixTest.php:50
```
→ `taxonomy_index` is created by `taxonomy_install()` (not `hook_schema`) in D11; the runner now
creates it explicitly in setUp with the canonical column spec.
```
Error: Call to a member function getConfigDependencyKey() on null
  core/modules/taxonomy/src/Plugin/views/filter/TaxonomyIndexTid.php:441   (data set "term+depth · term · embed · full")
```
→ the exposed `taxonomy_index_tid` filter's `calculateDependencies()` loads its `vid` on save; a
null vid is fatal. The generator now binds `'vid' => VOCAB_A` on that filter.

### RAW — the final green (testdox, timed)
```
Scenario Matrix (Drupal\Tests\mosaic_views\Kernel\ScenarioMatrix)
 ✔ Universe structure
 ✔ Determinism
 ✔ Grid cell executes with data set "nid · none · embed · mini"
 ✔ Grid cell executes with data set "nid · type · block · full"
 ✔ Grid cell executes with data set "term · none · embed · mini"
 ✔ Grid cell executes with data set "term+depth · term · embed · full"
 ✔ Grid cell executes with data set "uid(current_user) · none · block"
OK (7 tests, 160 assertions)

Time: 00:17.763, Memory: 6.00 MB
```
**Runtime 17.8s** — well under the ratified ≤~90s budget (shared installs + one universe build).

---

## Gates (this checkpoint)
| Gate | Result |
|---|---|
| PHPUnit — `ScenarioMatrixTest` | **7 / 7, 160 assertions, 17.8s** |
| PHPStan (L6, `phpstan.neon.dist`) | **[OK] No errors** on all three files |
| PHPCS (Drupal, errors-only) | **exit 0** on all three files |
| Production `src/` changed | **none** (test support only) |
| JS/dist changed | **none** (no e2e/dist rebuild for Phase H) |

## Files (Phase H set — uncommitted, read-only mosaic git)
- `modules/mosaic_views/tests/src/Support/ScenarioUniverse.php` (new, 328)
- `modules/mosaic_views/tests/src/Support/ViewFactory.php` (new, 203)
- `modules/mosaic_views/tests/src/Kernel/ScenarioMatrixTest.php` (new, 165)

## Reviewer audit questions (for before Phase M)
1. Grid breadth — the 5 representative cells cover every axis value at least once; is that the
   agreed sampling, or should the runner enumerate the full Cartesian product (argument × depth ×
   exposed × display × pager)?
2. Access dimension — H1 builds anon/auth/restricted principals + an unpublished-node set, but the
   H3 cells run with the default (root) user and access `none` views. Should a per-cell access
   dimension (run-as principal × node access) land in Phase H, or ride Phase M's cacheability leg
   (§3.4, where cache contexts per source are derived)?
3. Determinism proof — is the seededIndex recomputation + prediction match sufficient, or do you
   want a two-container same-seed fingerprint diff cell as well?

## Not done (Phase M — separate charter after audit)
M1 ArgumentResolver service (R-V6, shared embed + data-source) · M2 panel per-row source dropdown ·
M3 §3.4 cacheability derived cells (RED first) · M4 A2 "exclude this page" WITNESS-FIRST ·
M5 validator extensions + degradation · M6 e2e film album cp-ve2 · M7 gates + dist + SHIP-37 final.
