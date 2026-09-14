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

---

# APPEND (2026-09-14) — H4 MATRIX EXPANSION (reviewer rulings Q1–Q3)

The reviewer accepted the H checkpoint with a remediation: expand the matrix to the FULL derived
product, add an access axis, and upgrade the oracle from "is an array" to derived result
composition. All three landed; budget met; the harness now continues to Phase M.

## Q1 — full derived product (no hand-picked cells)
`ScenarioMatrixTest::runProduct()` enumerates the FULL product by nested loops (not a hand-authored
provider array): argument {nid, term, term+depth, uid} × exposed {none, type, term} × display
{block, embed} × pager {mini, full} = **48 cells**, run-as root. Per-dimension coverage is asserted
in-test: `assertSame([12,12,12,12], array_values($dimCounts))` and `assertSame(48, $ran)`.

| argument | exposed | display | pager | cells |
|---|---|---|---|---|
| nid / term / term+depth / uid (4) | none / type / term (3) | block / embed (2) | mini / full (2) | **48** |

## Q2 — access axis (access ⊥ pager/display)
`runAccessAxis()`: argument {nid, term, term+depth, uid} × principal {root, auth, restricted, anon}
= **16 cells**, on perm-gated ('access content') views. Access outcome is a function of the display
gate + node grants, which do NOT vary by pager or display — so the axis is run once per (argument,
principal), not across the full 48 (16, not 192). root/auth are allowed; restricted/anon are denied.

## Q3 — oracle upgrade: derived result composition (no "is array")
Every cell asserts the real result `nids` equal the set DERIVED from the universe via public
accessors (`allPublishedNids`, `publishedPlainNidsForTermExact`, `publishedPlainNidsForTerms`,
`publishedNidsOwnedBy`, `rootSubtreeTids`) — expected counts AND expected nid sets. The term+depth
cells additionally assert child-level AND grandchild-level node inclusion.

### RAW — probe establishing ground-truth semantics (the derivation mirrors reality)
A throwaway probe (`ScenarioProbeTest`, since deleted) confirmed every derived expectation equals the
real Views result before the oracle was finalised:
```
taxonomy_index rows: 6
root uid=1 auth uid=2 restricted uid=3 anon uid=0
allPublishedNids=1,2,3,4,7,8,9,10
depth_child nid=7 term=2; depth_gc nid=8 term=3
aChildTid(0)=2 aRootTid(0)=1 subtree(root0)=1,2,3,4,5
nid arg=plain_pub_0 (root): nids=1
term(d0) arg=child0 (root): nids=1,7 | expectExact=1,7
term(d2) arg=root0 (root): nids=1,4,7,8 | expectSubtree=1,4,7,8
  depth_child in? YES depth_gc in? YES          ← child AND grandchild inclusion proven
exposed=none/type/term nid ignore (root): count=8,8,8 (identical) ← unsubmitted exposed = no effect
uid arg=auth (root): nids=1,2 | expectOwnedBy(auth)=1,2
access[perm] nid ignore: root=true/8, auth=true/8, restricted=false/0, anon=false/0
access[perm] uid default(current_user): root=3,4,7,8,9,10 (own), auth=1,2 (own)
```
Semantics locked in the derivation: depth-0 = exact term; depth-2 from a root = root+children+
grandchildren; unsubmitted exposed filters do not filter; perm 'access content' gates the display
(root/auth in, restricted/anon out); the default node grant lets any 'access content' holder see all
published (so the access axis differentiates allowed-vs-denied at the gate, and the uid argument
provides the current-user composition delta among allowed principals).

### RAW — the green run (single method, one universe build)
```
Scenario Matrix (Drupal\Tests\mosaic_views\Kernel\ScenarioMatrix)
 ✔ Scenario universe matrix
OK (1 test, 46 assertions)

Time: 00:02.900, Memory: 6.00 MB
```
Structure + determinism + 48 product + 16 access all run on ONE `setUp` universe build (requirement
d). The 46 assertions include the two `assertSame([], $failures)` set-equality gates that carry all
64 cells' composition checks, the per-dimension count asserts, and the structure/determinism cells.

## Gates (H4)
| Gate | Result |
|---|---|
| PHPUnit — harness suite | **1 test, 46 assertions, 2.9s** (budget ≤90s MET) |
| PHPUnit — full mosaic_views suite | **21/21, 153 assertions** (no regression) |
| PHPStan (L6) | **[OK] No errors** |
| PHPCS (Drupal, errors-only) | **exit 0** |
| Production `src/` changed | **none** (test support only) |

## Determinism follow-up (Q3 optional)
The two-container same-seed fingerprint-diff cell is ledgered as **optional Wave-G hardening** per the
ruling — not built here (the seededIndex recomputation + prediction-match in `assertDeterminism`
already proves purity).

## Budget gate outcome
Full suite ≤90s (2.9s) with zero reds → per the charter, the harness CONTINUES to Phase M.

---

# PHASE N — FILM LEG (SHIP #37 final before walk) — ROAD CORRECTED, A2 NATIVE, 2 BUGS CAUGHT

## LEDGER FIRST — the road after ship #37 (supersedes "walk → tag")
The earlier report's "Arun's walk → tag 1.0.0" is WRONG. Ship #37 is NOT followed by a tag.
The ratified road is **CP-VE3 → ACT 2 → Wave D-0 + D/F → Wave G → dev push → Arun soak → tag**
(bible §P4 + ratified queue). Arun's representative walk is a REVIEW GATE within ship #37.

## N1 — the chartered help-string affordance (A2 = NATIVE accepted)
The introspection API now reports `supports_exclude` per argument (read from the initialised
handler's `->options` — numeric args carry `not`, UI label "Exclude"). The panel shows, on a
**This page** source row whose argument supports it, the note *"To exclude this page, enable
'Exclude' on the View's contextual filter."* PANEL LABEL LAW tone. Kernel
`ViewsArgumentsApiTest::testSupportsExclude` (numeric → TRUE); Vitest cell (viewsFields 9/9).

## N2 — the film + TWO real bugs it caught (the whole point of filming)
Deterministic content (`web/cpve2_content.php`): hosts 977–981 over a Fruit→Citrus/Berry→
Lemon/Straw tree. The film asserts geometry oracles on the published pages. Building it
surfaced two defects the unit/kernel layer had missed:

**BUG 1 — the embed ignored the resolved argument.** `renderView()` set the resolved args via
`setArguments()` (honoured by the immediate execute + hide-when-empty), then called
`buildRenderable($display, [])`. The 2nd param of `buildRenderable()` IS the render-time
contextual arguments; passing `[]` made the RENDERED embed show the whole unfiltered View.
Witnessed live: /node/977 rendered 50 rows instead of the 2 Citrus pages.
- Fix: `buildRenderable($display, $arguments)`.
- Guard: `ViewsEmbedRenderTest::testEmbedAppliesResolvedArgument` (RED before the fix — 50 rows,
  no match; GREEN after — only the matched node).
```
977 Fixed(Citrus d0)  →  CPVE2 Navel, CPVE2 Orange
979 Depth(Fruit d2)   →  Navel, Orange, Meyer, Blueberry, Wild Straw   (child + grandchild)
```

**BUG 2 — the per-component render cache didn't vary by cache CONTEXT.** The CID keyed on
static props only ("dynamic values covered by cache TAGS"). A `url_param` / `current_user`
source has identical props for every value, so the render cache served a stale hit —
/node/978?tid=2 and ?tid=3 returned the SAME rows. `getCacheMetadata` correctly reported
`url.query_args:tid`, but the CID never used it.
- Fix (MosaicRenderer): fold the component's cache contexts into the CID
  (`convertTokensToKeys(...)->getKeys()`). This relaxes the V0 warm-cache invariant — a warm
  hit now instantiates the plugin to read its contexts (a cheap factory call) — but **twig
  still never re-runs on a warm hit** (the invariant that matters). New DI:
  `@cache_contexts_manager`.
- Guard: `ViewsEmbedRenderTest::testRenderCacheVariesByUrlParamContext` (?nid=A then ?nid=B →
  different node; A's render is not served for B).
- Blast radius: 2 renderer Unit tests re-oracled (warm hit now allows createInstance, still
  asserts twig=0); both green.
```
978 ?tid=2 → Navel, Orange     978 ?tid=3 → Blueberry     978 ?tid=2 → Navel, Orange  (varies)
```

### Album cp-ve2 (frames + oracles)
`ledger-live/e2e-evidence/cp-ve2/` + INDEX.md. Published-page frames (03 fixed-term · 04a/04b
param-swap · 06 depth · 07 exclude) carry PASSING geometry oracles; 05a/05b current-user delta
(admin rows vs anon empty); builder frames 01 source-dropdown · 02 autocomplete · 08 N1 help
(visual evidence; behaviour proven by Vitest 9/9).

## N3 — proposed representative WALK LIST for Arun
`reports/WALK-CP-VE2.md` — 10 steps with exact nodes + exact expects (5 runtime geometry steps
on hosts 977–981, 5 authoring-panel steps), each backed by a film frame.

## Gates (N leg)
| Gate | Result |
|---|---|
| Vitest — panel | **9/9** (added the N1 help cell) |
| PHPUnit — ViewsArgumentsApiTest | **4/4** (supports_exclude) |
| PHPUnit — ViewsEmbedRenderTest (new) | **2/2** (both bug guards) |
| PHPUnit — renderer Unit (MosaicRendererTest + Cache) | **23/23** (re-oracled) |
| PHPUnit — full mosaic_views | **40/40** |
| PHPStan (my new code) / PHPCS | clean / exit 0 |
| dist | rebuilt (builder + FE), libs 1.0.17 |

---

# PHASE M — M1: the shared ArgumentResolver (R-V6)

M1 is landed as the coherent PHP-only unit of Phase M. M2–M7 (the panel TSX, §3.4 cacheability
cells, A2 exclude-this-page, validator/degradation, e2e film, dist + ship) are the next wave — they
need a dist rebuild + browser film and are scoped below. This is the natural seam: M1 is the backend
resolver, Kernel-proven; M2+ is the frontend/e2e/ship wave.

## M1 — WITNESS FIRST (before): two divergent, dynamic-blind paths
Neither call-site resolved dynamic argument sources; there was no shared resolver.

**Embed** — `MosaicViewComponent::renderView()` hardcoded empty args (CP-1 "View default"):
```php
$view->setDisplay($displayId);
// CP-1: View-default argument plugins run (no author-supplied arguments).
$view->setArguments([]);
```
**Data source** — `ViewsResultDataSource::resolve()` took only literal pre-resolved values:
```php
if (!empty($binding->config['arguments']) && is_array($binding->config['arguments'])) {
  $view->setArguments(array_values($binding->config['arguments']));
}
```
The R-V6 gap: no per-slot SOURCE spec (this_page / fixed / url_param / current_user / page_field /
view_default) → concrete value, and no single place the mapping lives.

## M1 — the ONE shared resolver (`src/Service/ViewsArgumentResolver.php`, new)
A registered service (FQCN service id, per contrib rules) injecting `request_stack` + `current_user`.
`resolve(array $sources, ?EntityInterface $host): array` maps per-slot source specs to a positional
argument array for `ViewExecutable::setArguments()`:

| source | resolves to |
|---|---|
| `view_default` | `null` (the View's own default plugin runs for that slot) |
| `fixed` | the literal `value` |
| `url_param` | the request query value (then a scalar route attribute) for `param` |
| `current_user` | the viewer's uid |
| `this_page` | the host entity's id |
| `page_field` | the host entity's `field` value (entity-ref target id or main property) |

A null in a slot means "View default"; when EVERY slot is null the whole thing collapses to `[]` —
exactly the CP-1 behaviour, so an absent/empty spec is fully backward compatible.

### RED → GREEN (`tests/src/Kernel/ViewsArgumentResolverTest.php`, new)
RED (before the service existed):
```
ServiceNotFoundException: You have requested a non-existent service
  "Drupal\mosaic_views\Service\ViewsArgumentResolver".
Tests: 4, Assertions: 72, Errors: 4.
```
GREEN (after service + registration), each source proven against the deterministic universe:
```
Views Argument Resolver (Drupal\Tests\mosaic_views\Kernel\ViewsArgumentResolver)
 ✔ Service is registered
 ✔ Each source resolves       → ['42','77',authUid,hostId,termTid]
 ✔ View default and collapse  → [['view_default']]→[]; []→[]; [default,fixed]→[null,'9']
 ✔ Unresolvable sources are null → no host / missing param → []
OK (4 tests, 78 assertions)
```

## M1 — WIRING (after): both call-sites use the ONE resolver
**Embed** — `MosaicViewComponent` injects the resolver, adds an `argument_sources` prop (M2 panel
emits it; absent → []), resolves with the host entity, and passes the result to `renderView()`:
```php
$host = $context instanceof MosaicRenderContext ? $context->entity : NULL;
$sources = is_array($props['argument_sources'] ?? NULL) ? $props['argument_sources'] : [];
$args = $this->argResolver->resolve($sources, $host);
$render = $this->renderView($viewId, $displayId, (bool) ($props['hide_when_empty'] ?? FALSE), $args);
...
// renderView():
// R-V6: resolved contextual arguments ([] = View-default plugins run).
$view->setArguments($arguments);
```
**Data source** — `ViewsResultDataSource` injects the resolver (new constructor + create()) and
prefers source specs, keeping the literal `arguments` as a backward-compatible fallback:
```php
if (!empty($binding->config['argument_sources']) && is_array($binding->config['argument_sources'])) {
  $host = $context instanceof MosaicRenderContext ? $context->entity : NULL;
  $view->setArguments($this->argResolver->resolve($binding->config['argument_sources'], $host));
}
elseif (!empty($binding->config['arguments']) && is_array($binding->config['arguments'])) {
  $view->setArguments(array_values($binding->config['arguments']));
}
```

## M1 — a pre-existing PHPStan gap fixed in passing
`MosaicViewComponent::create()` used `new static()` WITHOUT the project's established
`// @phpstan-ignore new.static` idiom (the base `MosaicComponentPluginBase::create()` carries it).
PHPStan L6 flagged it once the file was touched; the idiom was applied to match the codebase.

## Gates (M1)
| Gate | Result |
|---|---|
| PHPUnit — resolver | **4/4, 78 assertions** (RED→GREEN) |
| PHPUnit — full mosaic_views suite | **25/25, 231 assertions** (no regression; embed wiring backward compatible) |
| PHPStan (L6, whole submodule) | **[OK] No errors** |
| PHPCS (Drupal, errors-only) | **exit 0** |

## Files (M1 set — uncommitted, read-only mosaic git)
- `modules/mosaic_views/src/Service/ViewsArgumentResolver.php` (new)
- `modules/mosaic_views/mosaic_views.services.yml` (new)
- `modules/mosaic_views/tests/src/Kernel/ViewsArgumentResolverTest.php` (new)
- `modules/mosaic_views/src/Plugin/MosaicComponent/MosaicViewComponent.php` (wired + new.static idiom)
- `modules/mosaic_views/src/Plugin/MosaicDataSource/ViewsResultDataSource.php` (wired)

## Not done (M2–M7 — the next wave, needs dist + film)
M2 panel per-row source dropdown + source-specific inputs (fixed=entity autocomplete, url_param=name,
page_field=host-bundle field select), PANEL LABEL LAW · M3 §3.4 cacheability derived cells PER SOURCE
(RED first: current_user → user context, url_param → url context, this_page → route/entity tags) ·
M4 A2 exclude-this-page WITNESS-FIRST · M5 validator + degradation (deleted term/user/field), RED
first · M6 e2e + album cp-ve2 + geometry + proposed walk list · M7 full gates + dist + SHIP-37 add
block + ledger + report push.

## Checkpoint
H4 + M1 landed this wave (backend, PHP-only, fully gated). STOP for reviewer audit before the M2+
frontend/e2e/ship wave.

---

# PHASE M — M2–M5 + dist (M7 part) — CODE COMPLETE + GATED

This leg lands the panel (M2), cacheability (M3), exclude-this-page witness (M4), validator/
degradation (M5), and the dist rebuild + library bump (M7 part). Every piece is unit/kernel/Vitest
proven. The e2e FILM (M6) + full-suite ceremony + Arun's representative walk are the remaining leg —
the functionality is proven at the unit/kernel/component level; M6 adds the browser-level evidence.

## M2 — the per-row source panel + source-specific inputs
`js/src/builder/fields/MosaicViewsArgumentsField.tsx` — one row per contextual filter, each with a
SOURCE dropdown (View default, Fixed value, URL query parameter, Current user, This page, Field on
this page) writing a positional `argument_sources` (the ArgSourceSpec[] the M1 resolver consumes).
Source-specific inputs: **fixed → entity autocomplete** (when the argument targets an entity type)
via a new endpoint, else a plain value; **url_param → the parameter name**; **page_field →
host-bundle field select** via a new endpoint. PANEL LABEL LAW: the View-default option shows the A1
resolved behaviour in parentheses (F-105), never a bare "default".

**Endpoints** (`src/Controller/ViewsArgumentSourcesController.php`, new; `final` +
ContainerInjectionInterface + StringTranslationTrait):
- `GET /api/mosaic/views/entity-autocomplete/{entity_type}?q=` → label-matched `{id,label}`.
- `GET /api/mosaic/views/page-fields/{entity_type}/{bundle}` → the host bundle's `{name,label}`.
Both permission-gated (`mosaic.use_builder`), private + max-age 0.

**Wiring**: the `views_arguments` field type rebound from the legacy `arguments` prop to
`argument_sources` (mosaic_view.mosaic.yml + component.yml); host entity type + bundle threaded
through `toConfig → fieldTypeFields → descriptorToPuckField → MosaicViewsArgumentsPanel`; the widget
now attaches `bundle` to drupalSettings (backs the page_field select).

**Vitest** (`viewsFields.test.tsx`, 8/8): the source dropdown renders with the F-105 resolved label;
switching to URL parameter writes a `url_param` source; the param-name input writes the name; a fixed
source on an entity argument shows the autocomplete (and a suggestion resolves from the endpoint); a
page_field source shows the host-bundle field select; the empty state holds.
```
 Test Files  1 passed (1)
      Tests  8 passed (8)
```
**Endpoints Kernel** (`ViewsArgumentSourcesControllerTest`, 2/2): label-matched terms + host fields.

## M3 — §3.4 cacheability derivation PER source (RED → GREEN)
`ViewsArgumentResolver::getCacheability(sources, host)` derives the cache metadata each source
implies; wired into BOTH the embed's and the data source's `getCacheMetadata`. RED (undefined method,
5 errors) → GREEN 6/6, 118 assertions:
```
 ✔ Current user context        → 'user'; max-age untouched (Cache::PERMANENT)
 ✔ Url param context           → 'url.query_args:tid'
 ✔ Host tags                   → 'node:<id>' (this_page / page_field)
 ✔ Fixed referenced entity tag → 'taxonomy_term:<tid>'
 ✔ No dynamic keeps max age    → [] contexts, Cache::PERMANENT
 ✔ Embed get cache metadata wires source cacheability  ← the wiring proof
```

## M4 — A2 "exclude this page" WITNESS (native path; build nothing)
Witnessed native mechanism: a Views numeric contextual filter has its OWN `not` option (UI label
"Exclude") that inverts the argument. So "exclude this page" needs NO new Mosaic argument logic — the
View author ticks Exclude on the nid argument, and Mosaic's existing `this_page` source (M1) feeds it.
`ViewsExcludeThisPageTest` (1/1, 21 assertions) proves the end-to-end path: `this_page` resolves to
the host id, the View's `not` flag drops the host and keeps every other published node.
```
this_page → [hostId]; result = allPublished \ {host}; host NOT in result.
```
Ruling-ready: build nothing beyond a panel affordance that documents the native "Exclude" toggle.

## M5 — validator + graceful degradation (RED → GREEN)
`MosaicViewComponent::validateProps` now flags a `fixed` argument source that references a DELETED
entity (a stale term/user/node id silently empties the View — caught at save). Degradation is already
graceful via the resolver: a missing `page_field` → null (View default); a deleted `fixed` id → the
stale id (the View returns empty, no crash). `ViewsArgumentDegradationTest` 4/4:
```
 ✔ Validator flags deleted fixed entity   (RED before the extension: 0 violations)
 ✔ Validator allows existing fixed entity
 ✔ Missing page field degrades to default → []
 ✔ Deleted fixed still resolves to stale id → ['999999']
```

## dist (M7 part) — builder-first, FE-last (per witness)
The builder bundle (MosaicPuckAdapter + the panel + index.tsx) AND the FE bundle (FrontendBuilderDialog
imports `toConfig` + the shared schema) both changed → both rebuilt, builder FIRST then FE LAST:
```
dist/builder.js          1,224.77 kB   (was 1,217 kB — the panel)
dist/frontend-editor.js    755.03 kB
```
Library versions bumped 1.0.16 → **1.0.17** (3 libraries). Routes registered (verified live):
arg_entity_autocomplete, arg_page_fields, views_arguments = OK.

## Gates (M2–M5 + dist)
| Gate | Result |
|---|---|
| Vitest — panel | **8/8** (viewsFields) |
| Vitest — full suite | **515 / 1** (the 1 is the pre-existing B-101 boolean→radio drift) |
| PHPUnit — full mosaic_views suite | **38/38, 512 assertions** (config rebind + widget, no regression) |
| PHPUnit — full main-module Unit+Kernel | **2887/2887, 7625 assertions, 0 failures** (1 pre-existing warning) — the widget `bundle` + shared-schema change regress nothing |
| PHPUnit — M3/M4/M5/endpoints (new) | cacheability 6/6 · exclude 1/1 · degradation 4/4 · endpoints 2/2 |
| PHPStan (L6, my new code) | **[OK] No errors** |
| PHPCS (Drupal, errors-only) | **exit 0** |
| tsc (my files) | clean (1 remaining error is pre-existing `dsdShadow.ts`, unchanged at HEAD) |

## Files (M2–M5 + dist)
New: `Controller/ViewsArgumentSourcesController.php` · 4 Kernel tests (cacheability, degradation,
exclude, sources-controller) · `fields/MosaicViewsArgumentsField.tsx` (rewritten). Modified:
`Service/ViewsArgumentResolver.php` (getCacheability) · `Plugin/MosaicComponent/MosaicViewComponent.php`
(cacheability + validator) · `Plugin/MosaicDataSource/ViewsResultDataSource.php` (cacheability) ·
`Support/ViewFactory.php` (exclude/not) · `mosaic_views.routing.yml` · `mosaic_view.mosaic.yml` +
`.component.yml` (rebind) · `MosaicPuckAdapter.ts` + `index.tsx` + `shared/types/schema.ts` (host
threading) · `MosaicLayoutWidget.php` (bundle) · `mosaic.libraries.yml` (1.0.17) · `js/dist/*`.

## Not done (the final ceremony leg)
M6 e2e film album cp-ve2 (autocomplete journey, ?param swap, current-user delta logged-in vs anon,
depth cell) + GEOMETRY + proposed representative walk list · full Unit+Kernel ceremony gate · Arun's
representative walk. The functionality is unit/kernel/Vitest-proven; M6 is the browser evidence.

**ROAD CORRECTION (supersedes any earlier "walk → tag"):** ship #37 is NOT followed by a tag. The
ratified road after ship #37 is **CP-VE3 → ACT 2 → Wave D-0 + D/F → Wave G → dev push → Arun soak →
tag** (bible §P4 + the ratified queue). Arun's walk of the CP-VE2 representatives is a review gate
within ship #37, NOT a release trigger. No tag before the full queue + soak.
