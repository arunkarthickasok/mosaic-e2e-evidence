# CP-RESPONSIVE-TREES (F-074, Arun Option 1) — EVIDENCE LOG
2026-08-17. Read-only git, NO staging, NO live-DB writes (Kernel fixtures only).
Gates: FULL Kernel + FULL Unit + W18 + lock/f066 e2e + sentinels + phpcs 0/0.

## R1 — WITNESS (quoted)

### (a) Fixed breakpoint set — sources of truth + the single-source rule
- **JS (js/src/builder/BuilderApp.tsx):** `type Breakpoint = 'mobile'|'tablet'|'desktop'|'wide'` (L32);
  `BP_STATE_KEYS = ['mobile','tablet']` (L36 — only these two have alternate TREES); preview WIDTHS
  `BREAKPOINTS` (L43-48): mobile 375px, tablet 768px, desktop 1280px, wide 100%.
- **PHP media-query RANGES (src/Service/MosaicRenderer.php `buildBreakpointSpacingStyle` L548-551,
  HARDCODED inline):** `mobile => 'max-width: 767px'`, `tablet => 'min-width: 768px) and (max-width:
  1279px'`. Desktop/wide (≥1280) = the base, no query.
- **Single-source verdict:** the CSS-authoritative values are the PHP RANGES, but they live inline in ONE
  method with no shared constant. The JS preview widths (375/768/1280) are CONSISTENT with the ranges
  (375 ∈ ≤767; 768 = tablet start; 1280 = desktop start). **A PHP constant MUST be introduced** so the
  new tree-visibility @media reads the SAME ranges as the existing spacing emitter — else JS/PHP or
  emitter/emitter drift. Plan: `MosaicRenderer::BREAKPOINT_MEDIA = ['mobile'=>'max-width: 767px',
  'tablet'=>'min-width: 768px) and (max-width: 1279px']`; both buildBreakpointSpacingStyle and the new
  tree emit consume it. (JS widths are witnessed, NOT invented; the ranges are the fixed 4-set source.)

### (b) The working @media emitter precedent
`buildBreakpointSpacingStyle` (L547-579): for each present per-instance breakpoint spacing it emits
`@media (<range>){[data-mosaic-instance="<id>"]{<props>}}` concatenated into a `<style>…</style>` block
returned as HTML prepended to the component markup. Selector = `[data-mosaic-instance]`; values escaped
via htmlspecialchars; cache = the block is part of the component's cached HTML (renderNode cache entry).
**I mirror this pattern EXACTLY for tree visibility** (a `<style>` block of @media rules).

### (c) Render paths
- `render($layout,$entity,$_context,string $breakpoint='',$fieldName,$delta)` (L112): if $breakpoint is a
  non-empty state key, SUBSTITUTES that state's root+nodes (L120-134), then renderInternal.
- `renderInternal` (L217) → renderNode(root, …, $breakpoint) → one tree's HTML + #cache.
- `renderLazy` (L175) → `renderInternal($layout,$entity,'')` (L208) — FE BigPipe/user-context path.
- FE page path: `MosaicLayoutFormatter::viewElements` L131 → `render($layout,$entity,[],'',$field,$delta)`.
- So BOTH FE paths pass '' → base tree only (the F-074 gap).

### (d) Builder-preview parity target
`RenderPreviewController::preview` L166 → `render($layout,$entity,[],$breakpoint)` with the author-selected
breakpoint (validated to `['','mobile','tablet','desktop','wide']`, L114). One tree per preview.
**PARITY ORACLE:** the FE at viewport X must show the SAME tree markup the preview renders for the
breakpoint whose range contains X (FE@375 == preview 'mobile'; FE@768/1024 == preview 'tablet';
FE@1440 == preview '' / desktop base).

## R2 — DERIVATION (before code)

### Design (Option 1, JS-free, server-emit)
- **New FE method `renderResponsive($layout,$entity,$fieldName,$delta)`** called by the formatter (L131)
  and by renderLazy. The PREVIEW keeps calling `render(explicit bp)` (single tree) — UNCHANGED.
- **No variants → byte-identical:** if `$layout->breakpointStates === []`, renderResponsive delegates to
  the existing `render(..., '', …)` path verbatim (no wrapper, no style). REGRESSION ORACLE.
- **Variants present → multi-emit:** render the BASE tree + each present state tree; wrap each in
  `<div data-mosaic-bp="base|mobile|tablet" data-mosaic-instance-tree>`; prepend ONE `<style>` block:
  - base: `display:block` by default; `@media(mobile-range){[data-mosaic-bp=base]{display:none}}` iff a
    mobile state exists; same for tablet.
  - each variant: `display:none` by default; `@media(<its range>){[data-mosaic-bp=<id>]{display:block}}`.
  Ranges from the single-source `BREAKPOINT_MEDIA`. Desktop/wide (≥1280) always shows base.
- **Cache:** each tree rendered via the existing per-component cache (CID already keyed by breakpoint,
  L370). renderResponsive merges every tree's CacheableMetadata into the field cacheable + entity tags,
  so a save invalidates all trees. Per-tree CID = no cross-tree collision.
- **Anon:** ZERO new JS (pure CSS media queries). renderLazy/SSR path multi-emits identically.
- **Duplicate-id:** components tag with `data-mosaic-instance` (a DATA attribute — duplicates are valid
  HTML), NOT `id`. R3 adds a duplicate-`id` oracle over the emitted DOM; if any component emits a real
  `id`, the strategy is to confirm hidden trees are `display:none` (removed from a11y tree + tab order)
  and, only if real ids exist, scope them per tree. Enumerated in R3.
- **a11y:** inactive trees are `display:none` (not just aria-hidden) → no duplicate focusable, no landmark
  leakage, not in the accessibility tree.

### Cells (layouts × viewport × surface × user × cache × size × a11y × geometry × i18n)
- layouts: {no-variant, mobile-only, tablet-only, both} × viewport {375,768,1024,1440 = witnessed
  boundaries ±1px} × surface {FE page, renderLazy/SSR, admin preview} × user {anon, editor} × cache
  {cold, warm, per-tree CID, tag-invalidation on save} × HTML-size {no-variant = byte-identical (oracle);
  variants = grows only by the variant trees} × a11y {hidden = display:none; no dup focusable/landmark/id}
  × geometry {at each viewport EXACTLY one tree boundingBox non-zero, others zero; both surfaces} × i18n
  {t() strings unchanged; no per-tree translation duplication issues}.
- **Data-source cost:** media/entity resolution runs PER emitted tree (base + variants). Capped by: only
  PRESENT variants emit (≤3 trees total: base+mobile+tablet); documented. renderLazy path identical.

## R4 — FIX (implemented)
- **Single source:** `MosaicRenderer::BREAKPOINT_MEDIA` const (mobile `max-width:767px`, tablet
  `768–1279px`); `buildBreakpointSpacingStyle` refactored to read it → the two @media emitters can never
  drift. (JS BuilderApp widths 375/768/1280 stay consistent; ranges are the CSS-authoritative source.)
- **renderResponsive($layout,$entity,$fieldName,$delta):** no-variant → delegates to `render(..., '')`
  (byte-identical); user-context → `#lazy_builder`→`renderLazyResponsive`; else `renderResponsiveInternal`.
- **renderResponsiveInternal:** renders base (breakpoint '') + each present variant tree (its own
  breakpoint), wraps each in `<div data-mosaic-bp="base|mobile|tablet">`, prepends ONE `<style>` block
  (base hidden in each variant's range; variant hidden by default, shown in its range). Per-component
  render cache (CID already keyed by breakpoint) + entity tags merged → save invalidates all trees.
- **Duplicate-id strategy (suffixTreeIds):** each VARIANT tree's `id`/`for`/`aria-labelledby|controls|
  describedby|owns` values are suffixed `--bp-<id>` (base keeps originals) — the same instance in
  base+variant (mobile seeded from desktop = same UUIDs) never collides; aria refs stay intra-tree.
- **Formatter wired:** `MosaicLayoutFormatter::viewElements` → `renderResponsive(...)`. Anon = ZERO new JS.

## R5 — GREEN + REGRESSION
- **Kernel MosaicBreakpointRenderTest (6/36):** multi-emit (both trees + data-mosaic-bp + <style> +
  @media single-source), **no-variant BYTE-IDENTICAL** (renderResponsive === render('')), **dup-id
  oracle** (base id once + `--bp-mobile` suffix, no collision), base + preview unchanged.
- **Geometry oracle (js/e2e/f074-responsive-geometry.spec.ts, HELD, 4/4):** at 375→mobile, 768→tablet,
  1024→tablet, 1440→base, EXACTLY ONE data-mosaic-bp tree has non-zero boundingBox (@media visibility,
  single-source ranges). Static content — the "no live-DB writes / Kernel fixtures only" rule blocks a
  live variant-node e2e (can't create the fixture); the tree CONTENT + emit are Kernel-verified, the
  @media SHOW/HIDE is proven here, and the LIVE visual is Arun's eye-test (per directive).
- **Regression:** FULL Kernel **132/612**, FULL Unit **2679/6295** (0 fail; 1 pre-existing warn P-1;
  Sprint75 formatter-delta smoke oracle updated render→renderResponsive), W18 **9/9** isolated (one
  flake under parallel load), f066 lock **2/2**, sentinels 826/841-844 **200**, phpcs 0 on changed lines
  (pre-existing MosaicRenderer:352 + MosaicLayoutFormatter:117-118 line-length left out-of-diff). No
  js/src change → NO dist rebuild.

## R6 — MOSAIC.md updated (before → after)
- BEFORE: "Server-side rendering currently uses a single 'default' render context … per-request
  breakpoint detection is unimplemented." + "the desktop/wide viewports render the top-level nodes …
  when absent, it inherits the top-level (desktop) layout."
- AFTER: FE rendering is responsive — renderResponsive emits base + all breakpoint_states trees with
  @media visibility (single-source ranges), JS-free, cacheable, no per-request detection needed;
  no-variant byte-identical; variant ids suffixed. Preview still one-tree, matching the FE per viewport.

## R7 — CLOSEOUT
- **F-074 = FIXED-PENDING-SHIP** (Option 1). Ship #26 draft (check-ignore = shippable):
  1. src/Service/MosaicRenderer.php, 2. src/Plugin/Field/FieldFormatter/MosaicLayoutFormatter.php,
  3. tests/src/Kernel/Service/MosaicBreakpointRenderTest.php, 4. tests/src/Unit/Smoke/Sprint75SmokeTest.php,
  5. MOSAIC.md. HELD (gitignored): js/e2e/f074-responsive-geometry.spec.ts. Count: 5 shippable + 1 held.

═══════════════════════════════════════════════════════════════════════════════
# WALK-CATCH #26 PROBE (2026-08-18) — ship #26 FROZEN. Read-only, no fixes/writes.
Arun eye-test step 1: uid1 added a mobile-only + desktop-only heading on node 841
via the builder Mobile breakpoint → Save → generic Drupal exception wall.
═══════════════════════════════════════════════════════════════════════════════

## Q1 — WATCHDOG (verbatim)
wid 2034/2033, type=node severity=Error. Full message:
> Drupal\Core\Entity\EntityStorageException saving node form: Mosaic layout validation failed for
> node/841 field field_mosaic_layout: [breakpoint_states.mobile.nodes.mosaic_heading-c0997d9b-...slots]
> Array value found, but an object is required; […data_sources] Array value found, but an object is
> required; [ …mosaic_text-… .slots/.data_sources] …; [ …mosaic_columns-… .data_sources] …;
> [ …mosaic_button-… .slots/.data_sources] …; [ …12d45136-… .props/.data_sources] Array value found,
> but an object is required  in Drupal\mosaic\Hook\MosaicHooks->entityPresave() (line 188 of
> …/src/Hook/MosaicHooks.php)  #0 … NodeForm->save() … EntityBase->save() …
**Throw: `MosaicHooks::entityPresave()` line 188-189** (`throw new EntityStorageException(...)` after
`$this->schemaValidator->validateFull($value)` returns invalid). The errors are JSON-SCHEMA violations:
every `breakpoint_states.mobile.nodes.*.{slots|data_sources|props}` is a JSON `[]` where `{}` is required.

## Q2 — LIVE DATA
node 841 `field_mosaic_layout` = **NULL / empty** → the save was **REJECTED** (presave threw →
transaction rollback); nothing persisted. The failing shape (from Q1's message): the mobile-tree nodes'
empty `slots`/`data_sources` (and one node's `props`) are JSON arrays `[]`. **Diff vs the Kernel
fixtures:** MosaicBreakpointRenderTest built breakpoint_states nodes with `(object)[]` → `{}` (objects),
which PASS; the LIVE builder emits `[]` (arrays), which FAIL. The Kernel fixtures assumed the wrong
(correct-object) shape — the live builder shape is the array shape.

## Q3 — PATH TRACE (admin-form SAVE, layout WITH breakpoint_states, post-ship-#26)
NodeForm->save() → EntityStorage->doPreSave() → invokeHook('presave') → **MosaicHooks::entityPresave**:
(L182) migrationManager->migrateToCurrentVersion → (L186) **schemaValidator->validateFull($value)** →
invalid → (L188) throw EntityStorageException. The JSON-SCHEMA envelope check inside validateFull is the
step that matches Q1's throw (it rejects `slots/data_sources/props` arrays in breakpoint_states.nodes).
The widget validateJson (client submit) + MosaicPropValidator (F-055/F-075 media/entity checks) are
NOT the throw here — the JSON-schema shape check fires first. **The throw is NOT in renderResponsive/
suffixTreeIds** — those are the RENDER path, never reached on save.

## Q4 — REPRO (real validator, no live write)
`validateFull()` on a layout whose `breakpoint_states.mobile.nodes.<uuid>.slots = []` (array) → returns
INVALID with EXACTLY:
> [breakpoint_states.mobile.nodes.<uuid>.slots] Array value found, but an object is required
> [breakpoint_states.mobile.nodes.<uuid>.data_sources] Array value found, but an object is required
Same message as the live watchdog. **RED reproduced.**

## Q5 — VERDICT: NOT ship-#26 code + FINDING-077 registered
**Ship #26 working tree = render + tests + docs ONLY** (MosaicRenderer.php, MosaicLayoutFormatter.php,
MosaicBreakpointRenderTest.php, Sprint75SmokeTest.php, MOSAIC.md). It does NOT touch MosaicSchemaValidator,
MosaicHooks::entityPresave, the JSON schema, or the builder JS. So the save failure is **NOT caused by
ship-#26 render code.** It is a pre-existing gap in the breakpoint_states SAVE path — the builder
serializes variant-tree empty `slots`/`data_sources`/`props` as JSON arrays `[]` (top-level nodes
correctly emit `{}` via MosaicPuckAdapter, but the breakpoint-state merge path does not normalize), and
the schema (called by presave) requires objects. F-074/ship-#26 made device variants renderable/usable,
so the eye-test reached the never-exercised save path and surfaced this. **F-077 = HIGH (blocks saving
ANY layout with a device variant).**
**Fix direction (NOT implemented):** normalize empty `slots`/`data_sources`/`props` to `{}` in the
builder's breakpoint-state serialization (BuilderApp merge / MosaicPuckAdapter for the variant tree) —
root cause; OR a presave/migration coercion (`[]`→`{}` for those keys in breakpoint_states.nodes) as a
defensive backstop. Ship #26 render fix stands; F-077 is a separate save-path fix.

---

# F-077 FIX (walk-catch #26) — 2026-08-18. Read-only git, Kernel fixtures only, PHP-only.

## Y1 — WITNESS + DERIVE (the Q5 hypothesis was wrong; the builder is innocent)
Two serialization paths were witnessed:
- **Top-level** — `MosaicPuckAdapter.toPuck()` emits every empty container as `{}` (objects).
- **Variant merge** — `mergeBreakpointState(base, 'mobile', puck, 4)`. Q5 GUESSED this path emits `[]`.
  It does NOT. A guard Vitest — `js/src/builder/__tests__/BreakpointStateSerialization.test.ts` — drives
  the REAL adapter+merge and asserts the JSON has NO `"slots":[]` / `"data_sources":[]` / `"props":[]`.
  It PASSES on first run. **The builder emits `{}` on BOTH paths.** Hypothesis disproven.
Schema types: `props`/`slots`/`data_sources` are `type: object` at top-level AND
`breakpoint_states.*.nodes.*` (same node schema). Empty ⇒ must serialize as `{}`.
**ACTUAL ROOT CAUSE** — `MosaicLayoutMigrationManager::migrateToCurrentVersion()` decoded with
`json_decode($json, TRUE)` (assoc), which converts every empty JSON `{}` into a PHP `[]`, then re-encoded
→ `[]`. A fresh builder layout is `schema_version: 1` (`fromPuck` default), so it ALWAYS runs the
migration chain and comes out with `"slots":[]` etc. — which then fails `validateFull` in presave.
Confirmed by php:eval: v1 `{"props":{},"slots":{},"data_sources":{}}` → migrate →
`{"props":[],"slots":[],"data_sources":[]}`. The bug is the migration re-encode, **not** the builder.
Consequence: fix is **PHP-only — no js/src production change, no dist rebuild.** (I report this against the
directive's assumption that the fix would be builder-side, per "do not assume".)

## Y2 — RED
- Vitest `BreakpointStateSerialization.test.ts`: builder-merge emits `{}` (guards the innocent path; the
  originally-suspected `[]` never appears). 1/1.
- Kernel `testMigrationHealsEmptyContainersToObjects` (RED before fix: migrate emitted `"slots":[]`) and
  `testArrayShapeIsInvalidThenHealsToValid` (RED: the live-841 `[]` shape → `validateFull` FALSE).

## Y3 — FIX (shared helper, not a fork)
- **ROOT** `MosaicLayoutMigrationManager`: re-encode now runs shared `normalizeContainers()` →
  `normalizeNodeContainers()` casting each node's empty `props`/`slots`/`data_sources` (top-level AND
  every `breakpoint_states.*.nodes.*`) to `(object) []` so they encode as `{}`; slot CHILD lists
  (`slots.items`) stay arrays. New public `normalizeContainersJson(string): string` reuses the SAME helper.
- **BACKSTOP** `MosaicHooks::entityPresave`: after migration, `normalizeContainersJson($value)` heals ANY
  already-saved-wrong content on next save before `validateFull`. Idempotent + typed. (No logger injected
  in MosaicHooks; the "log once" was skipped to avoid a constructor/DI change — noted as a follow-up.)

## Y4 — GREEN
`MosaicBreakpointRenderTest` F-077 cells 3/3 within the file's 8/8 (56 assertions): migration heals to
`{}`; `[]` shape invalid→healed→valid; healed breakpoint_states → `validateFull` valid →
`renderResponsive` emits `data-mosaic-bp="mobile"` + `="base"`. PHP-only ⇒ no dist rebuild (builder
already correct); no `drush cr` needed for a render/JS change because none occurred.

## Y5 — REGRESSION (all gates GREEN)
- phpcs: **0 errors** on the 3 changed files (13 warnings, all pre-existing >80-char docblocks/comments I
  did not author; also removed a pre-existing `??`-alignment ERROR in the CP-UNSAVED-UX guard block).
- FULL **Kernel 135/135** (632 assertions). FULL **Unit 2679/2679** (1 pre-existing P-1 warning).
- **Vitest** guard 1/1; full suite 438/439 — the 1 failure is a pre-existing, unrelated
  `MosaicPuckAdapter.test.ts` boolean→radio field drift (git-confirmed the file is unmodified by F-077);
  logged as **B-101**.
- **W18** fe-sidebar-scroll 9/9 (one W18-S2 canvas-click flake in the batch run; passes 3/3 in isolation).
  **f066** fe-lock-parity 2/2.
- **Sentinels**: node/826, 841, 842, 843, 844 all HTTP 200 (841 = the exact walk-catch node).

## Y6 — VERDICT
**F-077 = FIXED-PENDING-SHIP.** Root cause was the migration decode-TRUE re-encode, not ship-#26 render
code and not the builder. Fix is PHP-only (MosaicLayoutMigrationManager + MosaicHooks + tests). Rides into
ship #26 with the CP-RESPONSIVE-TREES render work. Arun eye-test round 2 (re-add mobile+desktop headings
on node 841 → Save should now succeed) → ship.

---

# WALK-CATCH #27 PROBE (2026-08-19) — ship #26 STAYS FROZEN. Read-only, NO fixes/staging/DB writes.

**Arun's live evidence (eye-test round 2):** save no longer throws (F-077 fixed the wall) BUT (a) after
save, node-edit Mobile shows no mobile content; (b) BEFORE save, the builder preview already shows mobile
empty while desktop has its value. Hypothesis on paper: mobile tree lost inside the builder before
serialization; breakpoint_states absent/empty; render path innocent. drush cr was run before testing.

## Q1 — DATA CONFIRM (node 841, php:eval, read-only) — RAW
```
NODE 841 type=page title=FE Splash Test
FIELD field_mosaic_layout (type=mosaic_layout) RAW:
{"schema_version":4,"root":"mosaic_heading-f74dee17-1f39-450a-a253-700e1f010aac",
 "nodes":{"mosaic_heading-f74dee17-...":{"id":"...f74dee17...","type":"mosaic_heading",
   "props":{"text":"DESKTOP ONLY","level":"h2","alignment":"left"},"slots":{},"data_sources":{}}},
 "breakpoint_states":{"mobile":{"root":"77861e89-5649-44ce-b1c1-3f64489d3a2c",
   "nodes":{"mosaic_heading-eb430fff-...":{"id":"...eb430fff...","type":"mosaic_heading",
     "props":{"text":"MOBILE ONLY","level":"h2","alignment":"left"},"slots":{},"data_sources":{}}}}}}
```
**VERDICT — Arun's paper guess is WRONG.** `breakpoint_states.mobile` is **PRESENT** and DOES contain the
`MOBILE ONLY` heading node. The defect: **the mobile tree's `root` = `"77861e89-…"` (a bare UUID) is NOT a
key in its `nodes` map** (the only node key is `mosaic_heading-eb430fff-…`). The root is **dangling** →
the renderer starts at a phantom node → renders EMPTY. (The `"slots":{}` above is the true stored shape —
F-077 held; the `"slots":[]` seen in the earlier raw dump line was my own `json_decode(_,TRUE)` re-mangle,
not the stored value.) Not absent, not lost — **structurally dangling.**

## Q2 — DECISIVE FORK — answered
Arun's fork was "present-in-JSON = save-side loss; absent = builder state loss." **The truth is a THIRD
option neither branch covers: present-in-JSON but STRUCTURALLY DANGLING (root ∉ nodes).** It is a
**builder-side adapter *serialization* defect** — produced the instant the mobile state is committed, in
memory, before any save. That is why the builder's own preview renders mobile empty (evidence b) and the
saved node renders mobile empty (evidence a) with the SAME cause. "Render path innocent" = CORRECT;
"builder-side" = CORRECT; "lost/never persisted" = WRONG (it persisted, broken). Proven two ways: the live
node-841 JSON (Q1) and a unit RED at the exact link (Q4). No live e2e needed — node 841 IS the click-path
artifact from Arun's real clicks.

## Q3 — STATE-CHAIN TRACE (B-028), with code quotes — culprit NAMED
The chain (all reads of the CURRENT layout use `currentLayoutJsonRef.current`, a **ref**, so there is NO
stale closure):
1. `switchEditingTo('mobile')` — BuilderApp.tsx:369-386. No existing state → restores desktop canvas,
   `setEditingBreakpoint(null)`, shows CTA. (Correct.)
2. `startBreakpointOverride()` — BuilderApp.tsx:406 → `MosaicPuckAdapter.mergeBreakpointState(fullLayout,
   breakpoint, currentData)`; commits via `setCurrentLayoutJson` + `onLayoutJsonChange` +
   `setEditingBreakpoint(breakpoint)`. It **does** commit (so "seed-CTA never commits" is FALSE) — it
   commits a *dangling* state.
3. Editing the mobile canvas — `handleChange` BuilderApp.tsx:309-314 →
   `MosaicPuckAdapter.mergeBreakpointState(fullLayout, editingBreakpoint, updatedData)`. Same adapter path.
4. Switch back to Desktop + edit — default branch BuilderApp.tsx:320-328 **preserves**
   `existing.breakpoint_states` from the ref. It does NOT drop the mobile tree (so "switch-away overwrite"
   is FALSE) — it faithfully preserves the already-dangling tree into the saved JSON (matches Q1).
5. Preview — MosaicPreview posts to render-preview (read-only render); never writes the textarea (so
   "preview round-trip clobber" is FALSE).

**THE ONE THAT FIRES — the adapter root asymmetry:**
- `mergeBreakpointState` (MosaicPuckAdapter.ts:1174):
  `const stateRootId = existingState?.root ?? crypto.randomUUID();` → for a new state, a **random UUID**
  (this is where `"77861e89-…"` comes from). Then `fromPuck(puckData, stateRootId, version)`.
- `fromPuck` (MosaicPuckAdapter.ts:1127-1137):
  `if (data.content.length > 1) { nodes[rootId] = { … region wrapper … } }` … `return { …, root: rootId,
  nodes };`. It returns `root: rootId` **unconditionally**, but only **creates a node under `rootId` when
  `content.length > 1`.** For a **single** component it registers the node under the component's OWN id
  (`nodes[String(id)]`, L1080) and never materialises `rootId` → **root ∉ nodes.**
- The default path does NOT hit this because `toLayoutJson` (index.tsx:213-214) special-cases single
  content: `if (data.content.length === 1) { rootId = String(data.content[0]!.props['id']); }` — root =
  the component's own id. **`mergeBreakpointState` never replicates that rule.** Same forked-root-
  derivation class as F-077 (two callers, one helper, only one carries the correction).
- Consequence at render: `extractBreakpointState` (L1148-1153) → `toPuck({…, root: state.root, nodes})`;
  `toPuck` L977-980 `const rootNode = layout.nodes[layout.root]; if (!rootNode) { return emptyData; }` →
  **empty content.** Preview + FE both render empty. Bug bites only when a breakpoint state has exactly
  ONE top-level component (Arun's exact case); 2+ components create the wrapper and it works.

## Q4 — RED (oracle the suite never had) — RAW
Unit RED — `js/src/builder/__tests__/BreakpointRootIntegrity.test.ts` (drives the exact broken link):
```
F078_MERGED {"mobile":{"root":"2571e6b6-dc73-4ad6-95db-a1fb3b9e2aac",
  "nodes":{"mosaic_heading-mobile-…":{…"text":"MOBILE ONLY"…}}}}
 × mergeBreakpointState: mobile root must resolve to a node in nodes
     AssertionError: expected [ Array(1) ] to include '2571e6b6-dc73-4ad6-95db-a1fb3b9e2aac'
 × extractBreakpointState round-trips the mobile heading (not empty)
     AssertionError: expected 0 to be greater than 0
 Test Files  1 failed (1)   Tests  2 failed (2)
```
Reproduces node 841 exactly (root = random UUID ∉ nodes; extract → empty). **RED today.**
E2E held oracle — `js/e2e/f078-breakpoint-root-integrity.spec.ts` (gitignored/HELD, F-048): drives Mobile →
Start override → reads the pre-save hidden textarea → asserts a non-empty `mobile.root` must be a key in
`mobile.nodes`. RED today; runnable on demand.
**LEDGER — the blind spot:** `js/e2e/breakpoints.spec.ts:211-228` is the ONLY test that reads the layout
JSON after an override, and it asserts merely `expect(states?.['mobile']).toBeDefined()` — key-presence,
never root-resolution or content round-trip. A dangling root sails through it. The adapter unit tests
(incl. F-077's BreakpointStateSerialization) checked container SHAPE (`{}` vs `[]`) but never the
root→node STRUCTURAL invariant. Functions/keys were tested; structural integrity of the click-path result
never was.

## Q5 — FINDING-078 registered
See AI/FINDINGS.md § FINDING-078. Severity HIGH (silent loss of user work; ESC3 disease class).
**Relationship to F-077:** independent. F-077 (container `{}` shape) and F-078 (dangling single-component
root) are two separate defects in the same save path. F-077's fix changed the failure MODE from
"save throws the wall" (walk-catch #26) to "save succeeds but mobile renders empty" (walk-catch #27) —
it did not and could not fix the root desync. **Ship #26 (F-074 render + F-077 shape) does NOT deliver a
working device-variant feature end-to-end; F-078 is the remaining blocker.** Ship #26 stays FROZEN. NO fix
applied. STOP after Q5.

---

# WALK-CATCH #27 FIX (F-078) — 2026-08-19. Rides into ship #26. Read-only git, no staging.

## Z1 — FIX ROOT (UNIFY, not fork) — the single-item root rule lives ONCE
BEFORE — the rule was forked across two sites, and one site was wrong:
- `index.tsx toLayoutJson` (default path) special-cased single content:
  `if (data.content.length === 1) { rootId = String(data.content[0]!.props['id']); existingRootId = rootId; }`
- `MosaicPuckAdapter.mergeBreakpointState` (variant path) had NO such rule — it passed a synthetic
  `stateRootId = existingState?.root ?? crypto.randomUUID()` to `fromPuck`, and `fromPuck` returned
  `root: rootId` unconditionally while only creating a node under `rootId` when `content.length > 1`.
  → a single-component breakpoint state got `root = <random uuid> ∉ nodes` (dangling).

AFTER — the rule moved into `fromPuck` (MosaicPuckAdapter.ts:1134-1156), the ONE place both callers use:
```ts
    let resolvedRoot = rootId;
    if (data.content.length === 1) {
      resolvedRoot = String(data.content[0]!.props['id']);   // single item IS its own root
    }
    else if (data.content.length > 1) {
      nodes[rootId] = { id: rootId, type: 'mosaic_region', props: {}, slots: { items: … }, … };
      resolvedRoot = rootId;                                  // only multi needs a wrapper
    }
    return { schema_version: schemaVersion, root: resolvedRoot, nodes };
```
- `mergeBreakpointState` now trusts it: `root: stateLayout.root` (dropped the `|| stateRootId` fallback
  that re-danglered single states).
- `index.tsx toLayoutJson` dropped its single-item branch; it now only manages the stable region UUID for
  MULTI-component layouts and delegates single/empty to `fromPuck`.
- Grep proof — the rule exists exactly once:
  `content.length === 1` + `content[0]!.props['id']` → MosaicPuckAdapter.ts:1135-1136 ONLY.

## Z2 — GUARD (ESC3) + HEAL (self-repair), server-side
- **GUARD** `MosaicSchemaValidator::validateFull` → `validateRootIntegrity()` + `checkTreeRoot()`: for the
  top-level tree AND every `breakpoint_states.*`, a non-empty `nodes` map whose `root` is not one of its
  keys fails with `"[breakpoint_states.mobile] root '…' does not resolve to a node in this tree."` (JSON
  Schema cannot cross-reference, so this is a PHP invariant). Empty trees are skipped (envelope governs).
- **HEAL** `MosaicLayoutMigrationManager::healTreeRoot()` (run inside `normalizeContainers`, reached by the
  existing presave `normalizeContainersJson` backstop): when a tree's root dangles AND it has exactly ONE
  node, repoint root to that node and `$this->logger?->warning('Mosaic F-078 heal: repointed dangling
  @label root to sole node @node.')`. A multi-node dangling tree is left untouched → the guard rejects it.
  Never guesses among several nodes. So node 841 self-heals on its next save; the guard is the tripwire.
- **DI:** `MosaicLayoutMigrationManager` gained an optional `?LoggerInterface $logger = NULL` (2nd ctor
  param, so named-arg unit tests are unaffected); `mosaic.services.yml` injects `@logger.channel.mosaic`.
  `drush cr` rebuilt the compiled container (verified: no ArgumentCountError).

## Z3 — GREEN (RED flips + new oracles)
- Vitest `BreakpointRootIntegrity.test.ts`: the 2 RED cells flip GREEN (root resolves; extract renders
  'MOBILE ONLY'), + a NEW multi-component cell (2 items → region-wrapper root resolves + round-trips 2).
- Kernel `MosaicBreakpointRenderTest` +5 F-078 cells (13/13, 89 assertions):
  `testDanglingRootIsInvalidBeforeHeal` (guard rejects, names `breakpoint_states.mobile`),
  `testDanglingSingleNodeRootHealsThenValidatesAndRenders` (841 shape → heal repoints to MOBILE_HD →
  validateFull valid → renderResponsive emits 'MOBILETREE' + `data-mosaic-bp="mobile"`),
  `testMultiNodeDanglingRootIsRejectedNotGuessed` (ambiguous → heal leaves it → guard rejects),
  `testBuilderSingleNodeShapeValidatesAndRenders` (post-fix shape validates + renders both),
  `testResolvableRootUnchangedByHeal` (idempotence).
- Blind spot closed: `breakpoints.spec.ts:211` upgraded from key-presence to root-resolution; held
  `f078-breakpoint-root-integrity.spec.ts` remains as the UI oracle.

## Z4 — REGRESSION (all gates GREEN) + dist
- **Dist rebuilt** (js/src touched): builder FIRST (`vite.builder.config.ts`), frontend-editor LAST
  (`vite.frontend-editor.config.ts`) — only `js/dist/builder.js` + `js/dist/frontend-editor.js` changed
  (vendor chunks byte-identical). Both contain the fix. Library cache-bust `builder` + `frontend_editor`
  1.0.1→1.0.2. `drush cr`.
- phpcs **0 errors** (changed files; remaining >80 warnings all pre-existing, not F-078).
- FULL **Kernel 140/140** (665 assertions). FULL **Unit 2679/2679** (1 pre-existing P-1 warning).
- **Vitest** BreakpointRootIntegrity 3/3; full suite 441/442 — the 1 failure is the pre-existing,
  git-confirmed-unrelated `MosaicPuckAdapter.test.ts` boolean→radio drift (B-101).
- **W18** fe-sidebar-scroll 9/9 (one W18-S2 canvas-click batch flake; 3/3 isolated). **f066** 2/2.
- **Sentinels** node/826,841,842,843,844 → 200 (renderer degrades gracefully on the still-dangling 841;
  it heals when Arun re-saves).

## Z5 — VERDICT
**F-078 = FIXED-PENDING-SHIP.** Root cause (single-component dangling root) fixed by unifying the root rule
in `fromPuck`; guarded server-side (validateFull) and self-healed (presave) so legacy content like node 841
repairs itself and the class can never silently ship again. Rides into ship #26 with F-074 + F-077.
Ship #26 UNFROZEN. Arun eye-test round 3: re-add mobile+desktop headings on node 841 (or a fresh node) →
Save → Mobile breakpoint should now SHOW the mobile heading → ship #26.

## Ship #26 FINAL — check-ignore verified: EXACTLY 16 files ship (14 tracked-M + 2 new tests)
Tracked (M):
1. `src/Service/MosaicRenderer.php` — F-074 render
2. `src/Plugin/Field/FieldFormatter/MosaicLayoutFormatter.php` — F-074
3. `src/Service/MosaicLayoutMigrationManager.php` — F-077 container heal + **F-078 root heal + logger**
4. `src/Hook/MosaicHooks.php` — F-077 backstop + **F-078 comment**
5. `src/Service/MosaicSchemaValidator.php` — **F-078 guard**
6. `mosaic.services.yml` — **F-078 logger wiring**
7. `mosaic.libraries.yml` — **F-078 cache-bust 1.0.2**
8. `js/src/builder/MosaicPuckAdapter.ts` — **F-078 fromPuck + mergeBreakpointState**
9. `js/src/builder/index.tsx` — **F-078 toLayoutJson**
10. `js/dist/builder.js` — **rebuilt**
11. `js/dist/frontend-editor.js` — **rebuilt**
12. `tests/src/Kernel/Service/MosaicBreakpointRenderTest.php` — F-074 + F-077 + **F-078 cells (13/13)**
13. `tests/src/Unit/Smoke/Sprint75SmokeTest.php` — carry from CP-RESPONSIVE-TREES
14. `MOSAIC.md` — breakpoint truth
New untracked (NOT gitignored → shippable):
15. `js/src/builder/__tests__/BreakpointRootIntegrity.test.ts` — **F-078 Vitest oracle**
16. `js/src/builder/__tests__/BreakpointStateSerialization.test.ts` — F-077 guard (from prior)
GITIGNORED — local evidence / held, do NOT ship: `AI/FINDINGS.md`, `AI/TODO.md`, `AI/REPORT-RESPONSIVE.md`,
`sprints/backlog.md`, `js/e2e/f078-breakpoint-root-integrity.spec.ts`, `js/e2e/breakpoints.spec.ts` (held,
F-048), plus `js/e2e.zip` / `js/esc-probe.config.ts` (pre-existing junk, never staged).

---

# F-079 PROBE — TEMPLATE × BREAKPOINT_STATES — 2026-08-19. Read-only, NO fixes/staging/DB writes.
Arun product ruling: a template = the FULL responsive design; save + apply must carry breakpoint_states for
all devices. VERDICT: **NO DEFECT — all four legs carry variants intact.** `layout_json` is an opaque
serialized-JSON blob at every hop (POST → validate → store → list → apply → builder state → node field), so
`breakpoint_states` are never decomposed and never dropped. Reported with quotes; no bug invented.

## T1 — SAVE PATH: variants SURVIVE
- The dialog POSTs the FULL layout JSON, not desktop-only Puck data. `SaveTemplateDialog` is rendered by
  `BuilderApp.tsx:973` with `layoutJson={currentLayoutJson}` — `currentLayoutJson` is the merged full layout
  (mergeBreakpointState writes it via saveLayoutJson→setCurrentLayoutJson; it holds every tree). The dialog
  sends it verbatim: `SaveTemplateDialog.tsx:62-66` `body: JSON.stringify({ … layout_json: layoutJson })`.
- The controller stores it verbatim after validation: `TemplateSaveController.php:76`
  `$layoutJson = trim((string) ($payload['layout_json'] ?? ''));` → `:88`
  `$validation = $this->schemaValidator->validateFull($layoutJson);` (so the **F-078 root guard now also
  protects the template save path** — a dangling variant can't be templated) → `:102-105`
  `$template = $storage->create([ … 'layout_json' => $layoutJson … ]);`. No round-trip through
  fromPuck/toPuck, no key filtering. **VERDICT: SURVIVE.**

## T2 — APPLY PATH: variants SURVIVE (reach BOTH node JSON and builder state)
- `TemplateSplash.tsx:60-61` `if (tpl.layout_json) { onSelect(tpl.layout_json); }` — passes the stored full
  JSON. The handler `index.tsx:71-82 handleSelect`:
  ```
  const layout = JSON.parse(layoutJson);
  const puckData = MosaicPuckAdapter.toPuck(layout);   // canvas = desktop tree (expected default view)
  setActiveData(puckData);
  setActiveLayoutJson(layoutJson);                     // FULL json (with breakpoint_states) preserved
  onLayoutJsonChange(layoutJson);                      // FULL json written to the node's hidden textarea
  ```
  So the node field receives the full template JSON immediately (save-without-edit persists variants).
- The builder state is seeded with the full JSON: `BuilderApp.tsx:162`
  `const [currentLayoutJson] = useState(initialLayoutJson)` and `:248`
  `const currentLayoutJsonRef = useRef(initialLayoutJson)`, where `initialLayoutJson={activeLayoutJson}`.
  BuilderApp MOUNTS fresh only after `setShowSplash(false)` (splash and builder are mutually exclusive in
  index.tsx), so the ref genuinely holds the template's variants. Therefore a first desktop edit takes the
  default branch `BuilderApp.tsx:325-327` which preserves `existing.breakpoint_states` from
  `currentLayoutJsonRef.current`, and switching to Mobile (`switchEditingTo`→`extractBreakpointState`) shows
  the template's mobile variant (which now RENDERS post-F-078). **VERDICT: SURVIVE.**

## T3 — STORAGE SCHEMAS (both classes carry it intact)
- **Site-local (content) `MosaicTemplate`:** `MosaicTemplate.php:69`
  `$fields['layout_json'] = BaseFieldDefinition::create('string_long')` — one opaque string field; the full
  JSON (with breakpoint_states) is stored as-is. **SURVIVE.**
- **Global (config) `MosaicGlobalTemplate`:** config schema `mosaic.schema.yml:191-193`
  `layout_json: { type: text, label: 'Serialized MosaicLayoutValue JSON' }` — an opaque text blob, not a
  decomposed mapping, so breakpoint_states live inside the string untouched. **SURVIVE.**
- **F-069 note (orthogonal):** the global entity's `config_export` (MosaicGlobalTemplate.php:53-64) exports
  10 keys including `version` + `sync_to_config`, but the schema (mosaic.schema.yml:181-208) declares only 8
  — **the 2 missing schema keys are `version` and `sync_to_config`, NOT `breakpoint_states`.** F-069 is a
  schema-completeness gap (FullyValidatable) unrelated to F-079.
- **Both apply-list legs return the full blob:** `TemplateListController.php:96`
  `'layout_json' => $t->layout_json` (global) and `:117`
  `'layout_json' => (string) ($t->get('layout_json')->value ?? '')` (site-local). **SURVIVE.**

## T4 — ORACLES
All four legs pass, so — per the directive — no RED oracle is written and no bug is invented. The existing
suite already exercises the round-trip indirectly (TemplateSaveController validateFull path). A GREEN guard
(a Kernel cell: template layout_json with a mobile variant → save → reload → assert
`breakpoint_states.mobile.root ∈ nodes` and renderResponsive emits it) would LOCK the invariant; deferred as
optional Wave-D hardening (not a fix, not shipped here).

## T5 — FINDING-079 (see AI/FINDINGS.md)
Per-leg verdict: **save = SURVIVE, apply = SURVIVE, global storage = SURVIVE, site-local storage = SURVIVE.**
No fix required. Fix direction (only if a future regression appears): keep `layout_json` an opaque blob at
every hop — never decompose it into per-key config. Optional XS regression guard as above. Positive
interaction: the F-078 `validateFull` guard + presave heal now also protect the template save/apply path
(dangling variant templates are rejected on save; legacy single-node dangling variants self-heal). Size: 0
(no defect); optional guard ≈ XS (1 Kernel cell). STOP.
