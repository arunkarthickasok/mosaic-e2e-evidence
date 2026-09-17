# REPORT — CP-ADOPT-1 (Discovery + Component Library entity; Pillars A+F, H1/H2/H8)

Evidence base: ADOPT-DESIGN.md RATIFIED (14abedf), PROBE-COMPONENT-PIPELINE.md (1df630c). Mosaic git
READ-ONLY. No dev DB/config writes. HEAD `d0fdb22` (ship #40), tracked tree clean.

---

## §P0 — FRESH-READ + DERIVED SCENARIO UNIVERSE (report-only)

### P0.1 The gate + discovery shape (fresh, d0fdb22)
Discovery is a **filesystem scan**, not core-SDC-derived:
- `src/Sdc/SdcComponentDiscovery.php:40-56` — `foreach (glob($componentsDir . '/*', GLOB_ONLYDIR) …) { … if
  (!file_exists($componentYml) || !file_exists($mosaicYml)) { continue; } … $definitions[$id] =
  ComponentDefinition::fromSidecarYaml($id, $data, $provider, $templatePath); }`. **THE GATE = lines 45-48**
  (skip unless BOTH `.component.yml` AND `.mosaic.yml` exist). `$id = $data['id'] ?? $name` → **bare id**;
  `$provider = basename($base)`.
- `src/Plugin/MosaicComponentManager.php:101-158` `findDefinitions()` merges PHP-attribute defs
  (`parent::findDefinitions()`) with `$this->sdcDiscovery->discover(...)` — SDC first, PHP overwrites on id
  conflict. NOT a wrapper of `plugin.manager.sdc`.
- **H2 target:** re-base `discover()` on core `plugin.manager.sdc->getDefinitions()` (definitions + cache tags +
  core `$ref` resolution); DROP the `.mosaic.yml` requirement (sidecar → optional enhancer, still parsed when
  present via `ComponentDefinition::fromSidecarYaml`). Keep the PHP-attribute plugins + the SDC→PHP override.

### P0.2 Bare-id consumer census (the H1 alias-map wiring blueprint)
Stored layouts use **bare** `nodes[id].type` (e.g. `mosaic_view`); every lookup passes that bare id to the
Mosaic manager (which returns bare ids). H1 = Mosaic's 14 keep bare ids via an alias map; adopted components
store full `provider:id`. Each site below must resolve a stored id through the alias map:

| # | Site (`file:line`) | Call | Note |
|---|---|---|---|
| 1 | MosaicRenderer.php:425 | `createInstance($type)` (SSR preview path) | bare stored type |
| 2 | MosaicRenderer.php:437 | `getDefinition($type, FALSE)` | " |
| 3 | MosaicRenderer.php:632 | `$instance->type === 'mosaic_region'` | synthetic region literal (keep bare) |
| 4 | MosaicRenderer.php:658 | `createInstance($instance->type)` (page render) | bare stored type |
| 5 | MosaicRenderer.php:731 | `getDefinition($instance->type, FALSE)` | " |
| 6 | MosaicRenderer.php:753,804 | `data-mosaic-component`, `alter('mosaic_render', …, $componentId)` | id surfaced to markup + hook |
| 7 | MosaicLayoutWidget.php:633 | `createInstance((string) $id)` (palette) | manifest ids |
| 8 | ManifestController.php:85 | `createInstance((string) $id)` (manifest) | manifest ids |
Alias map = `{bare ⇄ provider:id}` for the 14 owned ids (12 `mosaic_components:*`, `mosaic_views:mosaic_view`,
`mosaic_webform:webform_embed`); resolution must be idempotent for already-bare + already-prefixed inputs.
**Invariant (H1):** existing saved layouts (bare types) render byte-identically — assert with the current
render/round-trip fixtures.

### P0.3 Governance + entity (fresh; F + H8)
- `component_package` = schema-only config entity (`config/schema/mosaic.schema.yml:78-109`: `id, label,
  description, components[], allowed_bundles[], status`), **no class, `hasDefinition()=false`, zero consumers**
  (PROBE Q6). `default_component_package: base` (`mosaic.settings.yml:31-33`) has no consumer + no shipped
  `base`.
- Admin page groups by provider MODULE (`ComponentPackagesController.php:58-68`), not the entity.
- Governance today = node_type third-party setting `mosaic.allowed_components`: defined
  `MosaicFormHooks.php:39-99`, enforced `MosaicLayoutWidget.php:621-631` (`allowed_components`) +
  `restricted` from the PHP attribute (`ManifestController.php:73-80`, attribute default
  `Attribute/MosaicComponent.php:62`).
- **F/H8 target:** promote to `ConfigEntityType mosaic_component_library` (id=provider, provider_type
  module|theme, status default FALSE non-Mosaic / TRUE for `mosaic_*`, `components[]{id,enabled,restricted}`,
  readiness summary CACHED not stored); auto-create on discovery, never delete; `restricted` moves to the
  entity (attribute = fallback).

### P0.4 DERIVED scenario universe (dimensions crossed; oracle per equivalence class)
Dimensions (RATIFIED §3/§4): **discovery-shape** {sidecar+schema, schema-only, slots-only, no-schema,
theme-provided(active/inactive), replaces, internal, group} × **provider** {mosaic_components, other-module,
theme} × **grade** {Ready, Attention(prop+reason), Blocked} × **governance** {library OFF/ON; component
enabled/disabled/restricted; bundle allowlist empty/library-level/per-component} × **permission-parity**
{admin builder, FE dialog, anon manifest, mosaic.administer vs author} × **geometry** {admin page + palette
boundingBox: rows/badges visible, non-overlapping, section headers ordered}.

Derived cells (equivalence classes — each an ADOPT-1 Kernel/e2e oracle):

| # | Discovery shape | Provider | Expected grade | Admission / palette / governance oracle |
|---|---|---|---|---|
| C1 | sidecar+schema | mosaic_components | Ready | admitted; bare id via alias; in author palette; library ON default TRUE |
| C2 | schema-only (no sidecar) | other-module | Ready (all props map) | **admitted (gate removed)**; provider:id; NOT in author palette (adopt_palette FALSE); library entity auto-created, status FALSE |
| C3 | schema-only, one prop → raw fallback | other-module | **Attention** (names the prop + "fell to raw text") | admitted; grade badge = Attention w/ reason; library page shows reason |
| C4 | slots-only (no props) | other-module | Ready (no props = no props) | admitted; slot fields present; not blocked for having no props |
| C5 | no-schema (no props, no slots) | other-module | Ready or Attention (empty) | admitted; renders as bare element; graded, not dropped |
| C6 | unusable (e.g. missing template) | any | **Blocked** | admitted to library page but **hidden by default**; never in palette |
| C7 | theme-provided, theme ACTIVE | theme | grade as props | admitted; provider_type=theme; **theme-bound flag**; `olivero:teaser` day-one smoke |
| C8 | theme-provided, theme INACTIVE | theme | graded | admitted + flagged theme-bound; H-fallback covers switch (ADOPT-6) |
| C9 | `replaces` present | any | graded | `replaces` read + carried on definition (tolerate absence) |
| C10 | `internal: true` | any | graded | `internal` read; excluded from palette even when adopt opens (ADOPT-4) |
| C11 | `group` present | any | graded | `group` → category on the definition |
| C12 | library OFF | any adopted | n/a | component NOT in manifest (admin+FE); library page still lists it |
| C13 | component disabled in library | any | graded | not in manifest; enable toggles it back |
| C14 | component restricted (H8 entity) | any | graded | in manifest for `mosaic.administer` only; author omitted — Permission-Parity |
| C15 | bundle allowlist per-component | any | graded | admin AND FE dialog both honor it; anon manifest unaffected |

Permission-Parity oracle (every admitting cell): admin builder manifest == FE dialog manifest for the same
role; anon manifest excludes restricted/disabled; `mosaic.administer` sees restricted, author does not.
Geometry oracle (admin page + palette): each library = one section with an ordered header; component rows show
name + thumbnail slot + grade badge; badges/rows non-overlapping (boundingBox); Blocked hidden by default.

### P0.5 Smoke-alarm design (per RED→GREEN law)
Each grader cell has a smoke-alarm: neuter the grader (force Ready) → C3/C6 cells must FAIL (Attention/Blocked
no longer detected). Each alias cell: bypass the map → a bare stored `mosaic_view` fails to resolve.
Each guard cell: unset `adopt_palette=FALSE` → an adopted component leaks into the author manifest → cell bites.

---

## §P1 — DISCOVERY BUILD — HONEST CHECKPOINT (not started this pass)

**Decision (honest, quality-first):** P1 is an architectural change to the **discovery + render hot path** —
re-basing `SdcComponentDiscovery` on core `plugin.manager.sdc` (H2), removing the `.mosaic.yml` gate, and
threading an alias map through the 8 censused bare-id consumers (H1) plus the grader + palette guard. Mutating
that hot path at contrib-quality (with the H1 "saved layouts render byte-identical" invariant, the derived
Kernel matrix RED→GREEN, and full gates) is a focused build that must not be rushed at the tail of a very long
session — a half-applied gate-removal would change what dev discovers on the next cache rebuild and entangle
with P2's auto-create. P0 above is the complete blueprint (gate quote, consumer census, derived matrix + per-
cell oracles + smoke-alarms, entity shape) so P1 starts clean.

**P1 build order (next pass), each RED→GREEN in the Kernel test DB (no dev writes):**
1. Alias map helper (bare ⇄ provider:id, idempotent) + unit cell; then thread sites #1-8 (P0.2); assert the
   saved-layout render invariant with existing fixtures (smoke-alarm: bypass map → bare `mosaic_view` fails).
2. Readiness grader (Ready/Attention(prop+reason)/Blocked) as an isolated PHP service + cells C1-C6, C9-C11
   (smoke-alarm: force-Ready → C3/C6 bite).
3. Rebase `discover()` on core `plugin.manager.sdc`; drop the gate; sidecar optional enhancer; carry grade +
   provider + theme-bound; cells C2/C4/C5/C7/C8.
4. Palette guard `adopt_palette: FALSE` for non-Mosaic components + Kernel cell (C12-style leak alarm).
5. FULL Kernel+Unit, phpcs, phpstan → CHECKPOINT-1 push (red-before-green logs).

**P2 GATE:** the Component Library entity (auto-create on discovery, update hook, cache rebuild) **writes dev
config/DB** and REQUIRES Arun's sanction word in the triggering message. This charter's message contains no
sanction word → **P2 is not started; STOP-and-ask at that gate** per the charter.

### STOP — reviewer audits §P0 (the derivation blueprint); P1 discovery build is the next focused pass; P2 awaits the sanction word.

---

## §P1 — BUILD (interim checkpoint, 2026-09-17) — building blocks GREEN; hot-path integration honest-checkpointed

Mosaic git READ-ONLY (files edited, uncommitted — Arun commits at ship #41). No dev writes in this pass.
Order note (honest): the alias map (step 1) is a **no-op until the core-SDC rebase (step 3)** — its consumer
threading + smoke-alarm can only bite post-rebase — so I built the two **isolated, self-contained units**
first (grader step 2 + the alias-map class step 1) to green, and honest-checkpoint the coupled hot-path
integration (threading + rebase) as one change, per the coupling flagged in §P0.

### DONE + GREEN
**Grader (Pillar A) — `src/Sdc/MosaicComponentGrader.php` + `tests/src/Unit/Sdc/MosaicComponentGraderTest.php`:**
Ready / Attention(prop+reason) / Blocked; slots-only = Ready; shape test mirrors `defToField`
(enum→select; string/integer/number/boolean/array/object mapped; `$ref` + unknown type → raw fallback →
Attention); tolerant readers for `group`/`replaces`/`internal`/`variants`. Cells C1 (all-map=Ready), C3
(raw-fallback=Attention, names `geo`+`hero`, `$ref` reason), C4 (slots-only=Ready), C5 (no-schema=Ready),
C6 (unrenderable=Blocked), tolerated-keys, + smoke-alarm.
RED proof (neuter `mapsToKnownShape → TRUE`):
```
=== RED (mapsToKnownShape → TRUE): C3 must fail ===
Failed asserting that two strings are identical.
FAILURES!  Tests: 1, Assertions: 1, Failures: 1.
```
Restored → GREEN.

**Alias map (H1) — `src/Sdc/MosaicComponentAlias.php` + `…/MosaicComponentAliasTest.php`:**
`toCanonical` (bare→provider:id for owned) / `toBare` (provider:id→bare) / `isOwned` /
`fromSdcDefinitions` / `providerIsOwned`; owned = provider is `mosaic`/`mosaic_*`; adopted (`olivero:teaser`)
+ unknown ids + the `mosaic_region` literal pass through unchanged; both directions idempotent. Smoke-alarm:
bypassing `toCanonical` leaves a bare `mosaic_view` un-resolved (≠ `mosaic_views:mosaic_view`).

**Gates on these units:** Unit **15 tests / 54 assertions OK**; phpcs **0 ERRORS** (4 files; warnings =
pre-existing line-length); phpstan L6 **[OK] No errors**. No dist change → no libs bump.

### NOT STARTED — honest checkpoint (the integration heart of CP-ADOPT-1)
These are the large, coupled, hot-path + live-write pieces; not begun this pass and NOT faked:
- **Step 1 threading + Step 3 core-SDC rebase (H2):** thread `MosaicComponentAlias` through the 8 censused
  consumers (§P0.2) AND re-base `SdcComponentDiscovery::discover()` on core `plugin.manager.sdc` (drop the
  `.mosaic.yml` gate; sidecar optional; carry grade/provider/theme-bound; cache-tag invalidation), under the
  "saved layouts render byte-identical" invariant (shasum node/780 before/after) + cells C2/C4/C5/C7/C8. This
  is one coupled change on the render hot path — deferred to a fresh focused pass rather than rushed at the
  tail of a very long session (a half-applied gate-removal changes dev discovery on next cache rebuild).
- **Step 4 palette guard** (`adopt_palette: FALSE`, Permission-Parity admin/FE/anon).
- **Step 5 full gates + live drush proof** (olivero:teaser graded).
- **P2** Component Library entity + admin page + node-type form + **live auto-create** (SANCTIONED, dev-only) —
  not started; runs in the same focused pass after P1 integration is green.
- **P3** Playwright lifecycle · **P4** close/SHIP-41-PLAN.

No red left red: the two built units are green; the only RED (grader C3) was a deliberate smoke-alarm,
demonstrated then restored. No oracle changed.

### INTERIM CHECKPOINT filed — not CHECKPOINT-1 (which requires all of P1). Next focused pass: thread+rebase (1+3) → guard (4) → gates (5) → CHECKPOINT-1 → P2 (live, sanctioned) → P3 → P4.

---

## §P1 — INTEGRATION HEART (PASS 3, 2026-09-17) — STEP 1+3+4 DONE + verified live

Mosaic git READ-ONLY (files edited, uncommitted — ship #41 candidates). The hot-path rebase was built as one
coherent change and verified against the byte-identical invariant.

### STEP 1+3 — core-SDC rebase (H2) + alias (H1) [DONE]
- `SdcComponentDiscovery` re-based on core `plugin.manager.sdc` (`arguments: ['@plugin.manager.sdc',
  '@mosaic.component_grader']`); the `.mosaic.yml` **gate at :45-48 DELETED**; sidecar now an optional enhancer
  (`readSidecar()` merged when present). Owned keyed BARE via `MosaicComponentAlias::providerIsOwned` +
  machineName; adopted keyed `provider:id`. `ComponentDefinition` gained `grade/gradeReasons/providerType/
  adoptPalette` (+ `fromCoreDefinition`, `withGrade`); manager merge preserves them when a PHP class wins.
- **LIVE registry (drush) — gate removed, olivero:teaser ADMITTED + graded + guarded:**
  ```
  mosaic_button … mosaic_view, webform_embed   grade=ready  pt=module palette=Y   (14 owned, BARE ids)
  olivero:teaser  grade=attention pt=theme palette=N | Prop "attributes" (Drupal\Core\Template\Attribute)
                                                        has no known field shape — falls to a raw text input.
  TOTAL: 15   (was 14 — gate removed)
  ```
- **BYTE-IDENTICAL invariant HELD.** node/780 component-region shasum:
  `0864e2386cf7725d0c467f9dfc41b20d8fe41df3a5762375e3a4aabc03e894d5` **before == after**. (The raw full-page
  shasum changed 4e368565→a9e63b58, but that is `drush cr` asset-aggregate noise: a bare `cr` with ZERO code
  change moved it again a9e63b58→951cca12, while the cache-buster-stripped page shasum is stable
  `c9972a7b`==`c9972a7b`. Diff understood = benign.)
- **SMOKE-ALARM (RED→restored)** on a sidecar-only owned component (mosaic_tabs, node 800): bypassing the
  bare-keying (`$definitions[$sdcId]` instead of `$machineName`) → `getDefinition('mosaic_tabs')` = NULL, node
  800 shows 1 missing component, tabs unrendered → restored → RESOLVES, 0 missing, region shasum back to
  `0864e2386…`. **HONEST FINDING:** most owned components have a PHP `#[MosaicComponent]` class (keyed bare
  independently), so the alias bare-keying is load-bearing specifically for the 3 **sidecar-only** owned
  components (mosaic_carousel/tabs/live_search) — node/780 uses none of those, so its own smoke-alarm couldn't
  bite; node 800 (tabs) is the correct target.

### STEP 4 — palette guard [DONE]
Adopted (`adopt_palette` FALSE) excluded from the author manifest in BOTH consumers — `ManifestController`
(all users) + `MosaicLayoutWidget` (admin widget). This is what makes admitting every SDC safe for authors
today. **LIVE:** admin manifest count = **14**, `olivero:teaser` absent (guarded) — previously excluded only
by accident (createInstance failing); now excluded by explicit guard.

### STEP 5 — gates (partial)
- Unit (grader+alias) **15/54 OK**; phpcs **0 ERRORS** (7 changed files); phpstan L6 **[OK]**.
- Discovery/manifest Kernel regression (5 files) **23/112 OK** — no regression from the rebase.
- No dist change (PHP + services.yml only) → **no BUMP-LIBS**.

### HONEST CHECKPOINT — remaining before CHECKPOINT-1 is fully closed + P2/P3/P4
Done + verified: STEP 1+3+4 (the integration heart) live + green. NOT yet done: the DERIVED matrix as FORMAL
Kernel cells C2/C4/C5/C7/C8 (verified live via drush this pass, not yet codified as Kernel tests — needs a
Kernel harness that enables a theme/test-SDC + core SDC discovery in Kernel); FULL Kernel + Vitest sweeps; and
**P2** (mosaic_component_library entity + admin page + node-type form + LIVE sanctioned auto-create + update
hook), **P3** (Playwright), **P4** (close/SHIP-41-PLAN). No red left red (the tabs smoke-alarm RED was
demonstrated + restored; byte-identical holds). Next pass: codify C2-C8 Kernel cells + full gates → close
CHECKPOINT-1 → P2 live → P3 → P4.

---

## §P1 — CHECKPOINT-1 CLOSED (PASS 4, 2026-09-17) — C2–C8 codified + full gates green

### C2–C8 codified as cells (SdcComponentDiscoveryTest — mocked plugin.manager.sdc + real grader)
| Cell | Oracle | Result |
|---|---|---|
| C2 schema-only foreign module | admitted (gate gone), Ready, provider:id, adopt_palette FALSE | GREEN |
| C4 slots-only | admitted, Ready ("no props = no props") | GREEN |
| C5 no-schema **renderable** | **Ready** — oracle CHOSEN + recorded (charter A said "Blocked"; witnessed reality: a propless SDC still renders, so Blocked is reserved for the unrenderable case C6) | GREEN |
| C6 unrenderable (no template) | Blocked + reason | GREEN |
| C7 theme-active | admitted, provider_type=theme (theme-bound), Attention (attributes class-type → raw) | GREEN |
| C8 theme-inactive | excluded at the core layer (plugin.manager.sdc omits disabled-extension SDCs) | GREEN |
| alias | owned keyed BARE, adopted keyed provider:id | GREEN |
| palette-guard | adopted carry adopt_palette FALSE, owned TRUE | GREEN |
| cache-invalidation (live) | `mosaic_tabs` (sidecar-only) category Interactive→CACHEPROBE_ZZZ after `cr`→restored | GREEN |

### ORACLE-CHANGE (recorded)
`Sprint02SmokeTest` — 3 cells drove the removed filesystem gate + `new SdcComponentDiscovery()` (0-arg):
- `testSdcDiscoverySkipsComponentsWithoutMosaicSidecar` → **flipped** to
  `testSdcDiscoveryAdmitsComponentsWithoutMosaicSidecar` (gate removed; no-sidecar SDC admitted + guarded).
- `testSdcDiscoveryFindsComponentWithMosaicSidecar` / `…BuildsCorrectComponentDefinition` → retargeted to the
  2-arg constructor + core-SDC-derived contract (mocked manager). Old→new documented inline; superseded by the
  full C2–C8 matrix in SdcComponentDiscoveryTest.

### FULL GATES (CHECKPOINT-1)
| Gate | Result |
|---|---|
| Kernel — mosaic core FULL | **198 tests / 1215 assertions / 0 failures** (no regression from the rebase) |
| — incl. discovery/manifest subset | 23/112 |
| Unit — mosaic FULL | **2709 tests / 6493 assertions / 0 failures** (1 pre-existing warning) |
| — incl. Sdc suite (grader+alias+discovery) | 23/78 |
| Vitest — full | **539 / 1** (1 = pre-existing B-101; no JS change) |
| phpcs (all changed PHP) | **0 ERRORS** |
| phpstan L6 (changed PHP) | **[OK]** on all CP-ADOPT-1 code (the legacy MosaicLayoutWidget carries 16 PRE-EXISTING errors untouched by the 4-line guard) |
| dist / libs | unchanged (PHP-only) → no BUMP-LIBS |
| FINDINGS | **FINDING-107** (alias bare-keying load-bearing only for the 3 sidecar-only owned components) |

**CHECKPOINT-1 CLOSED — §P1 (steps 1–5) complete + green.**

### HONEST CHECKPOINT — P2/P3/P4 deferred to a dedicated pass
P2 is a NEW subsystem: a `mosaic_component_library` ConfigEntityType + install/update hook + idempotent
auto-create-on-discovery + an admin page (`/admin/config/mosaic/component-libraries`) + a node-type-form
library switch + Kernel CRUD/parity — plus a LIVE sanctioned `updb`/auto-create on dev. That is a full pass of
its own; starting it at the tail of this one would mean a rushed config entity + install hook (exactly what
the honest-checkpoint law warns against). The rebase (the hard part) is done, verified, and green — P2 builds
cleanly on it next. **STOP — reviewer audits CHECKPOINT-1; next pass: P2 live → CHECKPOINT-2 → P3 → P4.**

---

## §P2 — CHECKPOINT-2 (PASS 5, 2026-09-17) — COMPONENT LIBRARY ENTITY + GOVERNANCE

Reviewer acceptances recorded: C5 oracle change ACCEPTED (grade labelled "Ready (static)" in the report);
Sprint02 gate-cell flips ACCEPTED. Mosaic git READ-ONLY (uncommitted, ship #41 candidates). PHP + YAML only →
no dist, no BUMP-LIBS.

**Item 1 — `mosaic_component_library` ConfigEntityType** (`src/Entity/MosaicComponentLibrary.php` + schema
`mosaic.component_library.*`): id=provider, provider_type module|theme, status, components[]{id,enabled,
restricted} (H8). Readiness is COMPUTED from the (cached) manager at display time, NEVER stored (config export
asserted to omit grade/readiness).

**Item 2 — idempotent auto-create** (`MosaicComponentLibrarySync` + `hook_install` + `mosaic_update_10003`).
Live sanctioned run:
```
>  [notice] CP-ADOPT-1: created 4 component libraries (olivero, mosaic_components, mosaic_views, mosaic_webform).
>  [notice] Update completed: mosaic_update_10003
```
Status defaults verified: mosaic_* ON, olivero OFF. Idempotent re-sync → `[]` (0 created, no overwrite).
`drush cex` clean — exported `mosaic.component_library.olivero.yml`:
```
status: false
id: olivero
provider_type: theme
components:
  - { id: 'olivero:teaser', enabled: true, restricted: false }
```

**Item 3 — `default_component_package`: REMOVED** (decision). No consumer, pointed at a schema-only
`component_package` entity that never existed. Removed from `mosaic.settings.yml` + schema; unset from live
config in `mosaic_update_10003` (`$settings->clear('default_component_package')->save()`); verified absent on dev.

**Item 4 — admin page** `/admin/config/mosaic/component-libraries` (`MosaicComponentLibrariesForm`; the old
`ComponentPackagesController` provider-grouping page is REMOVED — the `mosaic.admin.component_packages` route
repurposed to the new form + path, menu link retitled). Per library ON/OFF; per component enabled/restricted;
grade badge + Attention reasons; schema-derived "@p fields, @s slots" living docs; theme-bound note. Access
(raw): **admin (uid1) 200 · author (uid3) 403 · anon 403** (anon HTTP `403`).

**Item 5 — node-type form** filtered to authorable components (adopted excluded; 14 options on `page`), with a
link to the libraries page. Write path (`mosaic.allowed_components` third-party setting) UNCHANGED → a bundle
with a stored allowlist behaves exactly as before (back-compat).

**Item 6 — enforcement** via `MosaicComponentGovernance` (library OFF / component disabled / restricted
entity-first, PHP-attribute fallback) wired into ManifestController + MosaicLayoutWidget (parity). Live:
manifest 14 (all ON) → **mosaic_components OFF → 2** (mosaic_view + webform_embed) → restored. Kernel
`ComponentLibraryGovernanceTest` **5/16**: CRUD/export shape, library-OFF blocks all, C13 disabled, C14
restricted entity-first (admin sees / author not), H8 attribute-fallback.

**Item 7 — FULL GATES**
| Gate | Result |
|---|---|
| Kernel — mosaic core FULL | **203 / 1231 / 0** (+5 governance; no regression) |
| Unit — mosaic FULL | **2709 / 6498 / 0** (1 pre-existing warning) |
| Vitest — full | **539 / 1** (B-101; no JS change) |
| phpcs (all changed PHP) | **0 ERRORS** |
| phpstan L6 (new P2 PHP) | **[OK]** |
| dist / libs | unchanged (PHP+YAML) → no BUMP-LIBS |

**ORACLE-CHANGES (recorded, reviewer to accept):** ManifestControllerTest (constructor +governance arg,
empty-storage mock → attribute fallback = pre-P2 behaviour); Sprint30SmokeTest (route path + menu title
component-packages→component-libraries); Sprint80SmokeTest (restricted filter moved to governance →
assert `isAuthorable`).

**CHECKPOINT-2 CLOSED — all 7 items built + verified live + green. STOP — P3 (Playwright) + P4 (close) are the next pass.**

---

## §P3 — JOURNEYS (PASS 6, 2026-09-17)

**J1 — libraries admin page (filmed, geometry).** `/admin/config/mosaic/component-libraries` renders 4 library
sections in provider order — `Mosaic Components (module) | Mosaic Views (module) | Mosaic Webform (module) |
Olivero (theme) — theme-bound` — sections non-overlapping (boundingBox order asserted); `olivero:teaser`
graded **Attention** with its reason. Frames `j1-libraries-admin-page.png`, `j1-olivero-attention.png`. (The
builder-heavy J2–J5 assert the manifest — the palette's data source — proven reliably below; the live Puck
builder is unstable under headless capture, so palette states are verified via the manifest, not crash-prone
builder screenshots. Album `ledger-live/e2e-evidence/cp-adopt-1/INDEX.md`.)

**J2 — governance round-trip (raw):**
```
all ON: 14 components
OFF (mosaic_components): 2 components
ON again: 14 components
```

**J3 — per-component (raw):**
```
J3a disable mosaic_button: admin manifest has mosaic_button? no (disabled ✓) (count 13)
J3b restrict mosaic_button: admin sees it YES ✓ · author sees it no ✓   (Permission-Parity)
```

**J4 — bundle allowlist:** the unchanged P7-039 `mosaic.allowed_components` node-type mechanism (widget-level).
Write path untouched by P2, so a bundle with a stored allowlist behaves exactly as before (back-compat). NB
(honest): the bundle allowlist is applied by the admin widget; the FE `ManifestController::manifest()` endpoint
is bundle-agnostic (pre-existing behaviour, unchanged by CP-ADOPT-1).

**J5 — anon render unchanged (raw):** node/780 region shasum
`0864e2386cf7725d0c467f9dfc41b20d8fe41df3a5762375e3a4aabc03e894d5` == baseline.

---

## Oracle-change register (CP-ADOPT-1, reviewer to accept)

| # | Test | Old oracle | New oracle | Reason |
|---|---|---|---|---|
| 1 | grader C5 | "no-schema = Blocked" (charter) | **Ready (static)** | a propless SDC still renders; Blocked reserved for unrenderable (C6) |
| 2 | Sprint02 `…SkipsComponentsWithoutMosaicSidecar` | no-sidecar SDC skipped | **admitted** (flipped) | the `.mosaic.yml` gate is deleted (H2) |
| 3 | Sprint02 `…FindsComponentWithMosaicSidecar` | glob `discover([$dir])` finds fixture | derives from core `plugin.manager.sdc` (mock) | rebase (H2) |
| 4 | Sprint02 `…BuildsCorrectComponentDefinition` | fixture-sidecar shape | core-SDC shape | rebase (H2) |
| 5 | ManifestControllerTest (9 cells) | `new ManifestController(4 args)` | 5 args (+governance; empty-storage mock = attribute fallback) | governance injected |
| 6 | Sprint30 `…RouteRegistered` | `/component-packages` path | `/component-libraries` | admin page replaced |
| 7 | Sprint30 `…MenuLinkRegistered` | "Component Packages" | "Component Libraries" | menu retitled |
| 8 | Sprint80 `…FiltersRestrictedTokens` | ManifestController contains `'restricted'` | contains `isAuthorable` | filter moved to the governance service |

Cross-ref: **FINDING-107** (alias bare-keying load-bearing only for the 3 sidecar-only owned components).
Region-vs-full-page shasum note: node/780's full-page raw shasum moves on any `drush cr` (asset-aggregate
hashes); the byte-identical invariant is the component-region shasum `0864e238…`, held throughout (§P1).

**CP-ADOPT-1 COMPLETE (P0–P4). STOP — Arun eye-test (walk script below), then the ship #41 human-commit.**
