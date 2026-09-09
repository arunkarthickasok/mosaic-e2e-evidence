# WAVE E ACT 1 — CP-ADMIN-FIELD-UX (#27) + CP-TABS-REDESIGN (#28) — EVIDENCE LOG
2026-08-20. Read-only git, NO staging, NO live-DB writes. Gates per package: FULL Kernel + FULL Unit +
Vitest + W18 + f066 + lock e2e + sentinels + phpcs 0/0 + dist rebuild. E2e specs held (F-048).

## E0 — CHARTER FRESH-READ (from AI/TODO.md) — RESULT: STOP-AND-ASK (Package 2 blueprint incomplete)

### CONFIRMED / RATIFIED in the ledger (quoted verbatim)

**F-060 / WALK-CATCH #16 testimony** (AI/TODO.md:10020-10023):
> WALK-CATCH #16 (Arun's — tally: 16 identified / 15 closed): Tabs panel fields (`panel_*`) show their
> label/placeholder ONLY while focused; when unfocused they render as silent empty space — author-hostile
> (an editor can't tell an empty field is even there). Registered as FINDING-060.

**ARUN PRODUCT RULING — Tabs redesign** (AI/TODO.md:10028-10033):
> - Repeating SETS (heading + rich body per set), an "Add more" button, NO hard cap (drop the fixed
>   6-panel ceiling).
> - Body field = full WYSIWYG (formatting / links / media-library image insert).
> - PLUS a developer HOOKS/API so custom components can declare these richer field types
>   (repeating-set + WYSIWYG-with-media), not just Tabs.

**D3 — FOUNDATION ratification** (AI/TODO.md:10078-10080):
> D3 — CP-TABS-REDESIGN BLUEPRINT ratified as the design FOUNDATION (repeating sets + WYSIWYG-with-media
> body + developer field-type hooks API). Detailed design STILL needs Arun ratification before build.

**Puck-native path — REVIEWER ERROR #14 correction** (AI/TODO.md:11108-11114):
> The RATIFIED research foundation (2026-07-30 window) is PUCK-NATIVE rich-text: Puck 0.21 TipTap field +
> custom media-library toolbar button reusing `mosaic:open-media-library` + `<drupal-media>` insert; render
> via `check_markup` text formats ONLY; repeating sets via Puck array field; `.mosaic.yml` repeatable/
> richtext types + `hook_mosaic_component_info_alter` + `MosaicFieldType` plugin. Arun's CKEditor answer is
> VOIDED … Foundation stands as ratified; Arun re-confirmation word pending.

**Current Tabs data shape** (AI/TODO.md:9960, 9993): props `labels` (default `'Tab 1,Tab 2'`) + `panel_1..6`;
SDC `.mosaic.yml` sidecar surfaced via getPropDefinitions → ManifestController.

### LACKED by the ledger (exhaustive grep of AI/*.md + MOSAIC.md — 0 hits each) → MUST NOT IMPROVISE
1. `getItemSummary` (= heading) — the Puck array-field summary function — **0 hits.**
2. `defaultItemProps` — the seed props for a new set — **0 hits.**
3. `bodyFormat` — the "storage = HTML string + bodyFormat" second key — **0 hits.**
4. `schemaVersion 2` — the migration versioning for the redesign — **0 hits.** (Architecturally ambiguous:
   the LAYOUT chain is at v4/CURRENT_SCHEMA_VERSION=4; "schemaVersion 2 in the existing migration chain"
   does not resolve to whether this is a layout v4→v5 step or a component-scoped prop migration.)
5. `min 1` / minItems constraint — the ledger records "NO hard cap" (no max) but not the min-1 floor.

Plus the ledger's OWN status markers: D3 "Detailed design STILL needs Arun ratification before build" and
"Arun re-confirmation word pending." The charter (this directive) states these five elements, but E0's
source of truth is the LEDGER, and the ledger does not carry them.

### VERDICT
- **Package 1 (CP-ADMIN-FIELD-UX / F-060):** blueprint COMPLETE in the ledger (persistent visible labels
  per NN/G + consistent field-styling STRUCTURE, admin-native only). Buildable without improvising.
- **Package 2 (CP-TABS-REDESIGN):** blueprint INCOMPLETE in the ledger (5 elements above absent; detailed
  design explicitly "pending Arun ratification"). Per E0 → **STOP and ASK**; do not improvise these.
- **Action:** stopped before any build. Asking Arun to (a) clear Package 1 to proceed now, and (b) confirm
  or correct the 5 missing Tabs elements + resolve the schemaVersion-2 migration semantics, so Package 2's
  blueprint is ledger-ratified before build.

═══════════════════════════════════════════════════════════════════════════════
# PACKAGE 1 — CP-ADMIN-FIELD-UX (F-060, ship #27)

## E1a — WITNESS (mechanism quoted + field-type inventory)
**Mechanism — the prop panel has no persistent-label system (NOT a hostile CSS rule):**
1. Standard fields carry NO label. `MosaicPuckAdapter.defToField` (MosaicPuckAdapter.ts:1319-1364) and
   `propsToFields` (L1309-1317) build every prop field as a bare `{ type: … }` — the JSON-schema prop
   `title` (shared/types/schema.ts:174 `title?: string`) is DROPPED, and the `PuckField` interface
   (L22-30) has no `label` member at all. So the Tabs `labels` + `panel_1..6` fields (walk-catch #16) reach
   Puck with no caption.
2. Custom fields DIY-render inconsistent, low-contrast micro-labels: `MosaicMediaField.tsx:144`
   `<label style={{display:'block',fontSize:'11px',color:'#666',marginBottom:'2px'}}>`;
   `MosaicLinkField.tsx:56` shared `LABEL_STYLE`; `SpacingControl.tsx:47` a gray `<span>` — different sizes,
   gray-on-light, no shared structure.
3. No Mosaic CSS targets Puck field labels (0 hits for `Input-label`/`FieldLabel` across css/*.css); Puck's
   own dist CSS gates only breadcrumb labels on `:focus-visible`, never input labels. So the "label only on
   focus / silent empty space" (walk-catch #16) is the ABSENCE of a consistent persistent label, not a
   focus-hiding rule.
**Both hosts share one config:** admin BuilderApp (`builder.js`) and the FE dialog
(`FrontendBuilderDialog` → `frontend-editor.js`) both consume the same `MosaicPuckAdapter.toConfig`, so a
fix in `toConfig` + shared CSS covers BOTH surfaces.
**Field-type inventory (both hosts):**
- Standard (via `defToField`): `text` (string), `textarea` (canvas text prop), `number` (integer/number),
  `select` (enum), `radio` (boolean Yes/No), `array`, `object`.
- Custom (`type:'custom'` render): `MosaicMediaField`, `MosaicLinkField`, `MosaicEntityRefField`,
  `SpacingControl`, `StyleOverridesControl`, `MosaicDataSourceField` (+ Views/Paragraphs/SearchApi/
  CommerceProduct/EntityQueryBuilder data-source variants).

## E1b — DERIVATION (cells)
field type {text,textarea,number,select,radio,array,object,media,link,entityref,spacing,style} ×
state {unfocused, focused, filled, empty, disabled} × host {admin BuilderApp, FE dialog} ×
GEOMETRY {label boundingBox non-zero AND positioned above/beside its control, no overlap with the input,
panel vertical scroll still reachable} × CONTRAST {computed label color non-transparent, legible on the
admin-native panel background — Drupal admin greys only, no brand colors (Act 2 owns visual polish)} ×
i18n {label text is t()-wrapped / derived from the prop title, not a hardcoded English key}.
**Invariant under test:** for EVERY field, in EVERY state (esp. UNFOCUSED + EMPTY), a legible persistent
label is present with non-zero geometry — on BOTH hosts. **RED today:** standard fields render with no
label config; the unfocused+empty cell shows blank space.
**Fix shape (STRUCTURE only, admin-native — visual vocabulary stays Act 2):** (a) add `label?` to
`PuckField`; (b) `propsToFields` sets `label = def.title ?? humanize(name)` on every field (deterministic —
no reliance on Puck's fallback); (c) give the custom fields the same persistent-label treatment via a
shared field-wrapper; (d) one shared field/label CSS structure (label weight, spacing, grouping) in the
builder + FE-dialog stylesheets — Drupal-admin greys, no colors/branding.

## E1c — RED → FIX → GREEN
**RED (js/src/builder/__tests__/FieldLabels.test.ts):** `toConfig([manifest])` field configs asserted to
carry a persistent `label` (title, or humanized key floor). 3/3 FAILED — `expected undefined to be
'Body copy'` — proving every field reached Puck with no caption.
**FIX (STRUCTURE only, admin-native):**
- `PuckField` gains `label?: string` (MosaicPuckAdapter.ts).
- `propsToFields` sets `label = def.title ?? humanizeFieldName(name)` on every declared prop field
  (recursively — array/object sub-fields too). New `humanizeFieldName` (`panel_1` → "Panel 1").
- Custom fields captioned too: `erpFields` (media/link/entity-ref) get `label = props[name].title ??
  humanize`; the always-present meta fields get stable captions — `_mosaic_bp` "Breakpoint overrides",
  `_mosaic_visibility` "Visibility", `_mosaic_ds` "Data source", `_mosaic_spacing` "Spacing",
  `_mosaic_style_overrides` "Style overrides".
- Shared CSS `css/mosaic-fields.css` (wired into BOTH the `builder` and `frontend_editor` libraries):
  persistent legible label (`[class*="Input-label"]` → weight 600, 13px, Claro ink #232429, margin,
  `opacity:1`), consistent field vertical rhythm (`[class*="_Input_"]` margin), scoped to
  `.mosaic-builder-dialog`/`.mosaic-builder-inline`/`.mosaic-fe-dialog`. Drupal-admin greys only — the
  visual vocabulary stays Act 2.
**GREEN:** FieldLabels 3/3; the two exact-match adapter fixtures updated to the labeled shape
(`{type:'text',label:'Body'}`, array sub-field `label:'Label'`); the only remaining Vitest failure is the
pre-existing B-101 boolean→radio drift (deferred Wave D).
**Geometry e2e (HELD, F-048):** `js/e2e/f060-field-labels.spec.ts` — asserts every visible
`[class*="Input-label"]` has a non-zero boundingBox AND non-blank text, on the admin host (and the FE host
when `E2E_FE_NODE_PATH` is set). Authored as the regression guard; not run in the build.

## PACKAGE-1 GATES — ALL GREEN
- **dist rebuilt** builder FIRST + frontend-editor LAST; only `js/dist/builder.js` + `js/dist/frontend-editor.js`
  changed (both carry the label logic). Libraries `builder` + `frontend_editor` bumped 1.0.2 → 1.0.3;
  `drush cr`.
- phpcs **0/0** (Package 1 changed NO PHP). FULL **Kernel 140/140**; FULL **Unit 2679/2679** (1 pre-existing
  warning). **Vitest 444/445** (FieldLabels 3/3; 1 = pre-existing B-101). **W18 9/9** (one S2 canvas-click
  batch flake, 3/3 isolated); **f066 2/2**; **lock** e2e pass. **Sentinels** 826/841-844 → 200.

## SHIP #27 — CP-ADMIN-FIELD-UX (F-060) — check-ignore verified: EXACTLY 7 files (5 tracked-M + 2 new)
1. `js/src/builder/MosaicPuckAdapter.ts` — M — persistent field labels (PuckField.label + propsToFields +
   erp/meta captions + humanizeFieldName)
2. `js/src/builder/__tests__/MosaicPuckAdapter.test.ts` — M — 2 fixtures updated to the labeled shape
3. `mosaic.libraries.yml` — M — `mosaic-fields.css` wired into both libraries + 1.0.2 → 1.0.3
4. `js/dist/builder.js` — M — rebuilt
5. `js/dist/frontend-editor.js` — M — rebuilt
6. `css/mosaic-fields.css` — ?? (NOT ignored) — shared persistent-label + field structure
7. `js/src/builder/__tests__/FieldLabels.test.ts` — ?? (NOT ignored) — RED→GREEN label oracle
**GITIGNORED — do NOT ship:** `js/e2e/f060-field-labels.spec.ts` (held geometry oracle, F-048); `AI/*.md`
(local evidence). **No PHP touched. No config-schema change.**

## CHECKPOINT — STOP
Package 1 (ship #27) gates green + ship-list finalized. **Package 2 (CP-TABS-REDESIGN, ship #28) is HELD**
per Arun's E0 ruling (build Package 1 first). Its detailed blueprint is now ledger-ratified (AI/TODO.md §
CP-TABS-REDESIGN DETAILED BLUEPRINT RATIFIED) with migration scope = layout-chain v4→v5. Arun eye-test:
field-labels walk (admin + FE) → ship #27. Then Package 2 build → full Tabs authoring walk → ship #28.

═══════════════════════════════════════════════════════════════════════════════
# OVERNIGHT 2026-08-21

## N1 — SYNC
HEAD `cf99b26` (CP-ADMIN-FIELD-UX / F-060) ← `fa3e32f`. Branch fix/finding-016-validator == origin (no
ahead/behind). Tracked tree clean (only untracked `.log` junk). Ship #27 shipped; F-060 CLOSED; walk-catch
#16 closed-on-ship. Walk tally 29.

## N2 — F-081 (walk-catch #29): FE dialog cannot deselect via empty-canvas click; admin can — PARK
**Arun testimony (verbatim):** "FE dialog cannot deselect via empty-canvas click; admin can." FE-parity class.
**Witness (read-only, code-level):**
- Puck deselects via `onClick: () => setUi({ itemSelector: null })` — a handler on a Puck background/frame
  element (Puck dist chunk). Clicking empty canvas background clears the selection.
- BOTH hosts wrap Puck identically in the suspect classes: admin `BuilderApp.tsx:527`
  `className="mosaic-canvas-scope"` + `:937/962` `.mosaic-builder-canvas`; FE
  `FrontendBuilderDialog.tsx:425` `className="mosaic-fe-dialog__canvas mosaic-canvas-scope"` + `:416`
  `.mosaic-builder-canvas`. So `.mosaic-canvas-scope { all: revert-layer }` (F-035 family) is NOT the
  differentiator — it is on admin too, and admin WORKS.
- The FE-ONLY delta: the editor lives inside a native `<dialog className="mosaic-fe-dialog">` (top layer,
  FrontendBuilderDialog.tsx:445), and its canvas wrapper `.mosaic-fe-dialog__canvas` carries
  `overflow:hidden; height:100%; flex:1` (mosaic-frontend-editor.css:141-164, W18/CP-SIDEBAR-SCROLL) — the
  admin `.mosaic-canvas-scope` wrapper has no such clip. The block overlay
  (`.mosaic-builder-block-overlay`) renders ONLY when `isBlocked`, so it is not the normal-editing cause.
**F-035 scope check:** adjacent, not identical. F-035 is the canvas @layer inversion (Wave 3.2); the
canvas-scope `all:revert-layer` it governs is applied on BOTH hosts, so F-081 is NOT an F-035 recurrence —
it is an FE-dialog structural parity issue (the `<dialog>` top-layer context and/or the
`.mosaic-fe-dialog__canvas` clip changing which element receives the empty-background click).
**Verdict:** confirmed FE-parity defect; **root element that intercepts/absorbs the empty-canvas click in
the dialog is NOT determinable from code alone** — both hosts share the scope classes, so the difference is
the live DOM geometry/target inside the `<dialog>`. Mechanism is NOT clean-from-code.
**Fix direction:** (1) live-DOM probe — Playwright on both surfaces: select a component, click the empty
canvas background, capture `document.activeElement`/the click target chain + Puck `itemSelector` state, and
diff admin vs FE to name the element that swallows the click (candidates: the `.mosaic-fe-dialog__canvas`
clip removing the empty frame area from the hit-test, or the `<dialog>` top-layer retargeting). (2) Then
either restore the empty-background hit path, or add an explicit background-deselect `onClick` on the FE
canvas wrapper that dispatches `setUi({ itemSelector: null })` via the usePuck the dialog already holds.
RED→GREEN e2e on BOTH surfaces (admin stays green; FE flips).
**Size: S** (needs the live probe first; then a small handler/CSS fix). **PARK — not fixed in-charter**
tonight per the "fix only if mechanism is clean" rule; the mechanism needs the live probe. Recommend
scheduling with the F-080 live-DOM probe (same FE fixture).

## N3 — F-080 PROBE (walk-catch #28): Tabs invisible on canvas drop — VERDICT: COMBO
**Render-path witness (read-only, code-level):**
- `mosaic_tabs.twig` emits `<mosaic-tabs>` with a **Declarative Shadow DOM** `<template shadowrootmode="open">`
  carrying `<style>:host{display:block}</style>` + the static tablist; panels ride in light-DOM slots
  (`props.panel_1..6`, currently `|raw` — Package 2 replaces with check_markup).
- The BUILDER CANVAS renders component HTML via `MosaicPuckAdapter` **`dangerouslySetInnerHTML`**
  (MosaicPuckAdapter.ts:659, :854). Per the HTML spec, setting `innerHTML` does **NOT** attach declarative
  shadow DOM — DSD attaches only during native parsing (`setHTMLUnsafe`/initial parse). So on the canvas the
  `<template shadowrootmode>` stays an inert `<template>` (display:none): the shadow root never attaches,
  `:host{display:block}` + the tablist never render, and an empty-panel `<mosaic-tabs>` collapses to **zero
  height → invisible.** (Server/anon FE render attaches DSD natively — that path works; D17b shadow-piercing
  found "Overview" in the shadow root there.)
- **Empty-render gap (BOTH surfaces):** even attached, a freshly-dropped Tabs has empty panels and no
  placeholder / no `min-height` on `<mosaic-tabs>` or the canvas node → nothing to see, nothing to click.
**Live DOM delta table (boundingBox, shadowRoot present, computed height, winning @layer per surface):**
NOT captured — requires a Playwright measurement probe on {admin canvas, FE dialog canvas, FE page, anon}.
Reported honestly as PENDING (not fabricated); recommended alongside the F-081 live probe (same FE fixture).
The code path already discriminates the primary cause; the table would confirm the per-surface combination.
**Verdict = COMBO:** primary (a) **shadow-attach-missing-on-canvas** (`dangerouslySetInnerHTML` ⇒ DSD not
attached ⇒ :host/tablist absent) + (b) **empty-render-no-minheight** (no placeholder when panels empty). The
`revert-layer-collapse` (F-035) may add to the FE-dialog surface but is NOT the primary — the shadow-attach
gap is canvas-render-path, surface-agnostic.
**Scope sweep — DSD preview path is shared by THREE components** (emit `<template shadowrootmode>` + have a
Lit renderer): `mosaic_tabs`, `mosaic_carousel`, `mosaic_live_search`. So the invisible-on-canvas disease is
NOT Tabs-only.
**RIDE DECISION (per charter):** Package 2 rebuilds the Tabs preview → the Tabs cure folds INTO N4's "new
preview" cell (canvas placeholder VISIBLE + non-zero boundingBox + selectable when panels empty, both
surfaces; attach the shadow on the canvas via a real web-component upgrade OR render light-DOM in the
builder). **Carousel + live_search share the disease but are NOT rebuilt by Package 2 → F-082 (report-only
candidate).**

## N4 — PACKAGE 2 (CP-TABS-REDESIGN) — E2a RECON + HONEST SCOPE CALL (STOP-WHEN-BLOCKED)
**E2a witness (current Tabs, read-only):**
- Data model: `mosaic_tabs.component.yml` props `labels` (CSV, default 'Tab 1,Tab 2') + `panel_1..6`
  (string). Files: `modules/mosaic_components/components/mosaic_tabs/{mosaic_tabs.twig, .component.yml,
  .mosaic.yml}` + Lit `js/src/renderer/components/mosaic-tabs.ts`.
- Render: `mosaic_tabs.twig` uses `|raw` on panels (admin-trusted) inside a DSD `<template shadowrootmode>`
  — the exact `|raw` the blueprint replaces with `check_markup`.
- Real-shape fixture (from ledger D17b): `{"labels":"Overview,Safety Data,Funding","panel_1":"FHWA…",
  "panel_2":"NHTSA…","panel_3":"RAISE…"}`.

**HONEST SCOPE DETERMINATION — Package 2 is NOT a one-session build.** The ratified blueprint requires, as a
coherent whole (a partial ship breaks Tabs): a v4→v5 LAYOUT migration transforming `labels`+`panel_1..6` →
`sets[{heading,body,bodyFormat}]`; a NEW `mosaic_tabs` SDC data model + `check_markup` render (never `|raw`,
XSS-hardened) + a11y; a Puck ARRAY field (getItemSummary=heading, minItems 1, defaultItemProps); a Puck 0.21
**TipTap richtext** field + a **custom media-library toolbar button** (`mosaic:open-media-library` +
`<drupal-media>` insert); a **`MosaicFieldType` plugin** system + discovery + `hook_mosaic_component_info_alter`;
`.mosaic.yml` `repeatable`/`richtext` types; template save/apply under the new schema; and the F-080 preview
cure — each RED→GREEN across the exhaustive derivation (sets 1/several/reorder/remove-to-min-1/add-many ×
richtext plain/marks/links/`<drupal-media>`/XSS/empty × bodyFormat allowed/disallowed/missing × check_markup
× migration legacy/empty/breakpoint-trees/idempotence × 4 surfaces × a11y × sidecar/hooks × template ×
geometry). This is a multi-day feature (~20-30 files incl. a new plugin type and TipTap UI integration).
**Completing it "to GREEN all cells" in a single turn is impossible without fabricating untested UI/plugin
code — which the red→green→verify discipline forbids.** I will not fabricate a ship #28. **STOP-WHEN-BLOCKED**
per the charter's per-thread rule: the block is scope, and the honest deliverable is the plan, not a fake build.

**STAGED BUILD PLAN (each stage independently RED→GREEN + gated; sequence preserves a non-broken Tabs):**
- **Stage 0 (ship-able NOW, standalone): F-080 preview cure** — decoupled from the redesign. RED: empty
  `<mosaic-tabs>` on canvas has zero boundingBox. FIX: attach the DSD shadow on the canvas render path
  (web-component upgrade / `setHTMLUnsafe`) OR render light-DOM in the builder + an empty-state placeholder
  with min-height. GREEN: non-zero boundingBox, selectable, both surfaces. Helps the CURRENT Tabs
  immediately; also the pattern Package 2 reuses. (Note: N3's ride folded this into #28, but since #28 can't
  land tonight, Stage 0 is the sensible standalone.)
- **Stage 1: PHP backend of the new model** — `V4ToV5Migration` (labels+panel_N → sets[]) in the chain +
  new `mosaic_tabs` `.component.yml`/`.twig` rendering `sets` via `check_markup(body, bodyFormat)` (grep
  `|raw` = 0) + XSS Kernel cells + a11y. RED→GREEN Kernel; interplay with F-077 normalizeContainers +
  F-078 root guard verified (writer emits object-container, root-resolving JSON by construction).
- **Stage 2: MosaicFieldType plugin + hook + `.mosaic.yml` types** — plugin type, discovery,
  `hook_mosaic_component_info_alter`, `repeatable`/`richtext` sidecar types. Additive; Kernel discovery test.
- **Stage 3: Puck array field for `sets`** — getItemSummary=heading, minItems 1, defaultItemProps (the
  adapter already supports `type:'array'`+arrayFields; add the summary/min/defaults). Vitest.
- **Stage 4: TipTap richtext body + media-library toolbar button** — Puck 0.21 TipTap field, custom toolbar
  button firing `mosaic:open-media-library`, `<drupal-media>` insertion, bodyFormat plumbing. The
  UI-heaviest / least-unit-testable stage; Vitest for serialization + held e2e for the toolbar/media flow.
- **Stage 5: template save/apply under new schema + full derivation sweep + MOSAIC.md docs + dist rebuild +
  version bump + all gates.**
Each stage is a real ship. Recommend sequencing across sessions; Stage 0 can ship immediately if Arun wants
the current-Tabs visibility fixed before the redesign lands.

═══════════════════════════════════════════════════════════════════════════════
# STAGE 0 — CP-CANVAS-DSD-CURE (F-080 + F-082 class) + F-081 probe — 2026-08-21

## G1/G3 — LIVE DELTA TABLE (admin canvas, real fixtures 329/330/803) — RED → GREEN
| component        | RED (dist 1.0.3)                              | GREEN (dist 1.0.4)                          |
|------------------|-----------------------------------------------|---------------------------------------------|
| mosaic-tabs (329)| box 288×64, shadowRoot **false**, control **no** | box 288×125, shadowRoot **true**, content **yes** |
| mosaic-carousel (330)| box 288×104, shadowRoot **false**, control **no** | box 288×56, shadowRoot **true**, content **yes** |
| mosaic-live-search (803)| shadowRoot **false** (same class)          | box 288×79, shadowRoot **true**, content **yes** |
`computedHeight` RED = `auto` (light-DOM slotted text only, no shadow); GREEN = concrete px (shadow rendered).
Click-to-select passes on all three GREEN. (`winning @layer`: n/a — the defect is JS shadow-attach, not CSS
cascade; F-035 revert-layer is not implicated by these measurements.) The RED box was non-zero only because
the fixtures have FILLED panels; the shadow/tablist absence is the true defect, now cured.

## G2 — FIX (one shared path, both call sites)
- New `js/src/builder/dsdShadow.ts`: `attachDeclarativeShadowRoots(root)` (walks `<template shadowrootmode>`
  → `attachShadow` + moves content + removes template, recurses for nested, idempotent) and
  `injectPreviewHtml(el, html)` — prefers native **`setHTMLUnsafe`** (parses + attaches DSD in one spec step;
  Chrome/Edge 124+, Safari 18.4+, Firefox 139+) with an `innerHTML` + manual-walk fallback. Choice justified:
  `setHTMLUnsafe` is the native forward-compatible path; the walk is only a shim.
- `MosaicPuckAdapter`: new `DsdPreview` React wrapper (ref + effect → `injectPreviewHtml`) replaces
  `dangerouslySetInnerHTML` at BOTH injection sites (Tier A html body + Tier B SSR preview). Since both hosts
  render through this adapter, the FE dialog is cured identically.
- Empty-state floor (component-agnostic, admin-native): `.mosaic-canvas-preview` min-height in
  `css/mosaic-fields.css`; `DsdPreview` sets `data-mosaic-preview-empty` when the box is near-zero →
  a dashed neutral placeholder ("<Label> — add content", `Drupal.t` when present). Both hosts.

## G3 — GREEN oracles
- Vitest `dsdShadow.test.ts` **7/7**: RED reality (innerHTML → `shadowRoot` null) + cure (attach + tablist),
  nested DSD, `setHTMLUnsafe` preference, no-template passthrough, idempotence.
- Live delta table (above) GREEN for all three; held `js/e2e/dsd-cure.spec.ts`.

## G4 — F-081 (walk-catch #29) — PARK (refined)
Probe attempted (`js/e2e/f081-deselect-probe.spec.ts`): the admin canvas is TALLER than the viewport, so the
"empty background" point (canvas bottom) falls below the fold and `elementFromPoint` returns null — itself a
clue that the reachable empty hit-area is content-height-dependent. **Decisive constraint:** Puck's
`setUi({itemSelector:null})` is only callable INSIDE the Puck tree, so an explicit background-deselect must be
a Puck **override component** (not a wrapper `onClick`) — architecturally more than a clean XS/S fix.
Therefore **PARK** per the charter's "else" branch. **Exact fix plan:** add a Puck `overrides` component that
mounts inside the tree, `usePuck().dispatch({type:'setUi', ui:{itemSelector:null}})` on a background
`pointerdown` guarded to `e.target` being the frame background; verify with an in-viewport empty coordinate
(probe needs a short-content fixture so the empty area is above the fold), RED→GREEN both surfaces.

## G5 — GATES (all green)
dist rebuilt builder→FE, libs 1.0.3→**1.0.4**, drush cr. phpcs **0/0** (no PHP). FULL **Kernel 140/140**;
FULL **Unit 2679/2679** (1 pre-existing warn); **Vitest 451/452** (dsdShadow 7/7; 1 = pre-existing B-101);
**W18 9/9** (S2 flake, 3/3 iso); **f066 2/2**; **lock** pass; **sentinels** 826/841-844 + 329/330/803 → 200.

## SHIP #28 (Stage 0) — check-ignore verified: EXACTLY 7 files (5 tracked-M + 2 new)
1. `js/src/builder/MosaicPuckAdapter.ts` — M — DsdPreview + both call sites + canvasT
2. `css/mosaic-fields.css` — M — `.mosaic-canvas-preview` floor + placeholder
3. `mosaic.libraries.yml` — M — 1.0.3 → 1.0.4 (both libraries)
4. `js/dist/builder.js` — M — rebuilt
5. `js/dist/frontend-editor.js` — M — rebuilt
6. `js/src/builder/dsdShadow.ts` — ?? (NOT ignored) — shared DSD-attach helper
7. `js/src/builder/__tests__/dsdShadow.test.ts` — ?? (NOT ignored) — helper Vitest (7/7)
GITIGNORED — do NOT ship: `js/e2e/dsd-cure.spec.ts`, `js/e2e/f081-deselect-probe.spec.ts` (held, F-048);
`AI/*.md`. No PHP, no config-schema change.

## VERDICTS
- **F-080 — CLOSED** (Tabs visible + selectable on the canvas; shadow attaches).
- **F-082 — CLOSED class-wide** — the SAME shared helper cured carousel + live_search (both proven GREEN),
  so the DSD-invisible-on-canvas disease is closed for all three components in one fix. Better than the
  report-only plan.
- **F-081 — PARK** (refined plan above; fix needs a Puck override, exceeds clean-XS/S).

═══════════════════════════════════════════════════════════════════════════════
# OVERNIGHT 2026-08-22 — V1 SYNC + V2 (#30) + V3 STAGE 1 (CP-TABS-REDESIGN)

## V1 — SYNC
HEAD `c1befcc` (CP-CANVAS-DSD-CURE Stage 0) ← `cf99b26`. Branch == origin, clean tree. Ship #28 shipped;
F-080 + F-082 CLOSED-on-ship. **Arun rulings:** carousel + live_search authoring = REHAUL → F-083
(CP-CAROUSEL-REDESIGN) + F-084 (CP-SEARCH-UX) registered, slotted Wave E Act 1 AFTER Tabs Stage 5, MUST
reuse the Stage 2-3 machinery. Walk-catch #30 registered. Walk tally 30.

## V2 — #30 PROBE + XS FIX: empty-carousel placeholder
**Gate quoted:** `DsdPreview` (MosaicPuckAdapter) flagged empty via
`el.toggleAttribute('data-mosaic-preview-empty', el.getBoundingClientRect().height < 8)`. A DSD carousel has
shadow-chrome height even with zero slides → `height >= 8` → never flagged → no placeholder (walk-catch #30).
**Verdict:** the floor must be CONTENT-gated, not height-gated. Mechanism clean → XS FIX.
**Fix:** new `previewHasContent(el)` in `dsdShadow.ts` (light-DOM text OR a slotted/media element, NOT
height); `DsdPreview` now flags `!previewHasContent(el)`. **RED→GREEN** Vitest `dsdShadow.test.ts` +4 cells
(empty carousel/tabs → no content → placeholder; filled → content) — 11/11. Dist rebuilt (1.0.5).

## V3 — STAGE 1 (CP-TABS-REDESIGN): migration + render rewrite
**V3a — v4→v5 migration** (`V4ToV5Migration`, wired into the chain; `CURRENT_SCHEMA_VERSION` 4→5, schema
enum +5): `mosaic_tabs` `labels`+`panel_1..6` → `sets:[{heading, body, bodyFormat=basic_html}]`, across the
top-level tree AND every breakpoint_states tree; idempotent; no content lost (>6 labels preserved; missing
labels kept as body-only sets; fully-empty slots dropped). Unit `V4ToV5MigrationTest` 9/9.
**V3b — render rewrite:** `mosaic_tabs.component.yml` prop is now `sets` (array of {heading, body,
bodyFormat}); `mosaic_tabs.twig` renders each body via a `processed_text` render element
(`check_markup(body, bodyFormat)`) — **`|raw` grep = 0**. Kernel `MosaicTabsRenderTest` 4/4: body renders
through check_markup; **XSS payloads stripped** (`<script>`/`onerror`/`<iframe>`/`javascript:` all removed by
basic_html); empty sets → no panels; **v4 legacy tabs auto-upgrades → validates (F-077/F-078) → renders**
end-to-end. Live sentinels: tabs nodes 329/335/802 + carousel 330 → HTTP 200 (migrate + render on the page).
The Stage-0 DSD preview renders the new shape (shadow attaches).
**V3c — docs:** MOSAIC.md gains a Tabs data-model before/after + the check_markup developer note.

## REGRESSION — schema-bump blast radius (all healed)
Bumping CURRENT_SCHEMA_VERSION 4→5 surfaced 9 fixture assertions that pinned v4; all updated as intended:
Unit smoke (Sprint23/41: `CURRENT_SCHEMA_VERSION = 5`, enum `[1,2,3,4,5]`) + Sprint13 (`@covers`→`#[CoversClass]`
on the new migration test); Kernel `SdcComponentPluginPropsTest` (tabs props `labels`/`panel_1` → `sets`) +
`MosaicLayoutMigrationManagerTest` (v1→v5). These are regression-guard fixtures following the intentional bump.

═══════════════════════════════════════════════════════════════════════════════
# STAGE 2 — CP-TABS-REDESIGN developer machinery (ship #30) — 2026-08-22
## S1 SYNC
HEAD `38d4878` (Stage 1 + walk-catch 30) ← `c1befcc`. == origin, clean. Ship #29 closed; walk-catch #30
closed-on-ship. Oracle-change record (9 v4→v5 fixtures) + Stage-4 format-permission-abuse pin logged.
## S2a — MosaicFieldType plugin system
`#[MosaicFieldType]` attribute + interface + base + `mosaic.field_type_manager` (mirrors the DataSource
manager) + core `text`/`number` + new `repeatable` (→array) / `richtext` (→rich body) plugins.
`toBuilderField()` returns labelled descriptors; unknown type → labelled text (F-060). Kernel 4/4.
## S2b — .mosaic.yml field_types
`ComponentDefinition::fromSidecarYaml` parses `field_types:` (only well-formed `{type: string, …}` entries
kept — malformed dropped). Tabs `sets` bound to repeatable{heading:text, body:richtext[basic_html,full_html]}.
Unit parser 3/3. `ManifestController` computes descriptors via the plugins + ships `component.field_types`.
## S2c — hook_mosaic_component_info_alter (F-085 fix)
Pre-existing gap: the alter ran inside `parent::findDefinitions()` over PHP-class components only; SDC
components were merged in afterwards and never reached the hook. Fixed by re-running `alterDefinitions($merged)`
over the full PHP+SDC set. Kernel 2/2 via a test module: add a field to Tabs, alter its label, remove
mosaic_html — all take effect. (No shipped module implements the hook → the second pass is idempotent/harmless.)
## S2d — adapter consumes field_types
`fieldTypeFields()` turns `manifest.field_types` descriptors into Puck fields (repeatable→array with resolved
item fields; richtext→Puck-default text for Stage 2; labels always present). Vitest 3/3.
## GATES (all green)
phpcs 0 err; FULL Kernel 150/150; FULL Unit 2691/2691 (9 ManifestControllerTest ctor fixtures updated for the
new dependency — the controller gained the field-type manager; 1 pre-existing warn); Vitest 458/459 (1 =
pre-existing B-101); W18 9/9 (S2 flake, 3/3 iso); f066 2/2; lock pass; sentinels 329/330/803 → 200; dist
rebuilt (libs 1.0.6). MOSAIC.md developer field-type docs (before/after).
## SHIP #30 — 26 files (12 tracked-M + 14 new). No config-schema change (field_types is a sidecar key).

---

## STAGES 3+4 — SHIP #31 (complete Tabs authoring experience) — 2026-08-22

**T1 SYNC:** HEAD `db4f003` (Stage 2 / ship #30) == origin, tracked tree clean. Ship #30 CLOSED
(F-085 closed-on-ship). Arun ruling: Stages 3+4 built COMBINED ("big steps").

**Stage 3 (repeatable array authoring UX):** `.mosaic.yml` repeatable gains `min/summary/item_label/
default_item`; RepeatableFieldType passes them through; adapter builds Puck array `min` + `getItemSummary`
(heading → "Tab N" 1-based) + `defaultItemProps`. Vitest TabsArrayUX 5/5; Kernel descriptor cell.

**Stage 4 (richtext + media + authors-first formats):**
- Native Puck 0.21 richtext (TipTap) body + `RichtextMediaMenu.tsx` (`makeMediaRenderMenu` reuses the
  `mosaic:open-media-library` bridge; per-click token; `drupalMediaMarkup` attribute-escaped). Vitest
  RichtextField 6/6 + RichtextMediaMenu 3/3 (jsdom: open-library dispatch + insert-on-select + wrong-token
  ignore, mock editor).
- `MosaicTextFormatAccess` (filter_format via entity_type.manager + `->access('use')`; portable ^11.1||^12;
  defensive → [] if filter storage absent so the manifest never breaks). ManifestController enriches richtext
  descriptors PER USER (declared ∩ usable → `[{value,label}]`, human labels; `default_format`; default_item
  seeded). Adapter adds `{name}Format` select ONLY at ≥2 usable formats; single-format author sees no field.
- Write-path abuse guard (STANDING PIN): MosaicPropValidator walks field_types richtext (top-level + inside
  repeatable) and rejects a disallowed submitted format. Kernel MosaicTextFormatGuardTest 4/4.
- Render: `<drupal-media>` INERT under basic_html (F-086 lawful story) + rich XSS stripped on new write path.
  MosaicTabsRenderTest 6/6 (70 assertions), incl. legacy v4→v5 migrate→validate(guarded)→render round-trip.

**F-086** registered (media embedding needs a media_embed-enabled format; none shipped; Mosaic emits standard
markup + renders via check_markup; does NOT invent/alter formats). Documented in MOSAIC.md.

**Blast radius healed:** ManifestController +1 ctor arg (5th) → 9 test calls + create() + mock helper;
MosaicPropValidator +1 ctor arg (4th) → 1 test call; FieldTypes.test.ts oracle bumped (body text→richtext);
ManifestFieldTypesTest + filter module; MosaicTabsRenderTest models a permitted editor (uid1 burned).

**GATES ALL GREEN:** phpcs 0 err; FULL Kernel **157/157** (801 assertions); FULL Unit **2691/2691** (6358
assertions, 1 pre-existing warn); Vitest **472/473** (1 = pre-existing B-101 boolean→radio, Wave D);
**W18** 17/18 (only S2 = documented timing flake — clean isolated single-run 3 passed; heading component
has no field_types so Stage-4 code paths can't touch it); **f066+lock** 11/11; sentinels 329/330/803/826/
841-844 → **200**; dist rebuilt (builder 17:14, FE 17:15; libs 1.0.6→**1.0.7**); drush cr.

**SHIP #31 = 21 files (15 tracked-M + 6 new).** Held/ignored (NOT shipped): AI/*.md, js/e2e/tabs-authoring.spec.ts.
No config-schema change. NEXT: Stage 5 (template interplay + doc polish) + F-083/F-084 after Arun's walk.

---

## WALK-CATCH #31 PROBE — Stage 3+4 authoring UI not manifesting live (2026-08-23) — ship #31 FROZEN

**Q1 — SERVED BUNDLE TRUTH (verdict: new bundle served = YES).**
- mosaic.libraries.yml on-disk: builder + frontend_editor `version: 1.0.7`.
- Served URL (library discovery + live DOM): `modules/custom/mosaic/js/dist/builder.js?v=1.0.7` (query tag
  present + bumped). Global system.css_js_query_string state = NONE (irrelevant — the library version drives ?v).
- On-disk dist markers (builder.js / frontend-editor.js): getItemSummary ×3, `drupal-media data-entity-type`
  ×1, "Insert media" ×2, richtext ×31/30, renderMenu ×2, "Text format" ×1. Adapter is INLINED in builder.js.
- Stale artifact noted (hygiene, NOT live-loaded): `chunk-MosaicPuckAdapter.js` (0 Stage-4 markers) exists in
  dist but is referenced by NO current file — a dead leftover from an older split build.
- => The served bundle IS the Stage-4 bundle. Bundle is NOT the cause.

**Q2 — MANIFEST TRUTH (verdict: API enriched; ADMIN source NOT enriched).**
- API manifest as uid1 (GET /api/mosaic/manifest → ManifestController) carries FULL Stage-4 field_types:
  `sets` = {type:array, min:1, summary:heading, item_label:Tab, default_item:{…}, fields:{heading:text,
  body:{type:richtext, formats:[{value:basic_html,label:"Basic HTML"},{value:full_html,label:"Full HTML"}],
  default_format:basic_html}}}. Per-user, human labels. CORRECT.
- BUT the delivery path DIVERGES BY HOST:
  - ADMIN (node-edit, what Arun used): manifest is built by `MosaicLayoutWidget::buildManifests()` and handed
    to the builder via drupalSettings — NO HTTP request (index.tsx:194). That builder OMITS the `field_types`
    key entirely (MosaicLayoutWidget.php:583-606 — no field_types; the L38 hit is the widget's own
    field_types:['mosaic_layout'] property, unrelated). So the admin manifest has NO field_types.
  - FE dialog host: fetch `${basePath}api/mosaic/manifest` (FrontendBuilderDialog.tsx:216) → ManifestController
    (enriched). Response Cache-Control: private, max-age=3600, UNVERSIONED URL, no revalidation (secondary
    staleness vector — not Arun's cause, but real).
- Cached-stale check: NOT the cause. drush cr rebuilds the server manifest; the admin manifest is embedded in
  the (uncacheable) node-edit form fresh each load — it is fresh AND un-enriched.

**Q3 — BINDING CONDITIONS (verdict: adapter correct; fires fallback because field_types is absent).**
- toConfig fields spread (MosaicPuckAdapter.ts:589-597): `...propsToFields(props), ...erpFields,
  ...fieldTypeFields(manifest.field_types), ...slotFields` — fieldTypeFields is spread AFTER propsToFields, so
  when present it OVERRIDES the schema-derived fields. Order is CORRECT.
- fieldTypeFields early-return chain: the ONLY fallback is `Object.entries(fieldTypes ?? {})` — if
  `manifest.field_types` is undefined/empty, it returns `{}` (no override) and the fields come purely from
  `propsToFields(propDefinitions)` = legacy plain fields (sets → array of text heading/body/bodyFormat).
  descriptorToPuckField / resolveSubFields have no other early-returns.
- Condition firing LIVE on the admin page: `manifest.field_types` ABSENT (Q2 — widget omits it) → fallback to
  legacy propsToFields → plain fields. Host difference is the discriminator: FE has field_types, admin doesn't.

**Q4 — LIVE RENDER (ground truth; corrects a contaminated first pass).**
- v1 (page-wide) FALSE POSITIVE: counted contentEditable ×1 + "Insert media" ×1 + select `body[0][format]` —
  these are the NODE FORM's own CKEditor 5 body field + text-format select, NOT the Mosaic inspector.
- v2 (scoped to each Puck field's control, admin node/329/edit): fields = [{label:"Tab sets", control:none},
  {label:"", none}, {label:"Tab sets", none}, {label:"", none}]; addTabButtons: []; NO richtext(TipTap), NO
  media button, NO array-add, NO format select. => The admin inspector renders LEGACY plain fields — MATCHES
  Arun's testimony exactly.

**Q5 — VERDICT: `manifest-not-enriched-live` (ADMIN host / widget parity break).**
The admin/node-edit builder is fed a manifest by `MosaicLayoutWidget::buildManifests()` that never emits
`field_types` (parity break vs ManifestController::formatComponent, contradicting its own L596-597 comment).
With field_types absent, the Stage-4 adapter correctly falls back to legacy propsToFields → plain fields. The
API/FE path IS enriched; the bundle IS fresh; nothing is cache-stale on the admin path. Pre-existing since
Stage 2, surfaced by Stage 4. Registered FINDING-087 (walk-catch #31) + REVIEWER ERROR #15 (presented
unit/server-verified as live-working; no live-DOM check on the admin surface pre-handoff; tests were blind to
buildManifests). Fix direction: add field_types + per-user text-format enrichment to the admin manifest —
minimal = inject field_type_manager + text_format_access into the widget and mirror the field_types line (S);
durable = extract a shared MosaicManifestBuilder both ManifestController + the widget call (M). Secondary: FE
manifest fetch is unversioned + max-age 3600 + no-revalidate (XS). NO FIX APPLIED — probe only.

---

## F-087 FIX (walk-catch #31) — DURABLE shared-builder cure — rides ship #31 (2026-08-23)

**D1 — extract MosaicManifestBuilder.** New `src/Service/MosaicManifestBuilder.php` owns the per-component
entry shape ONCE (buildComponentEntry + buildFieldTypeDescriptors + applyTextFormatAccess + normalizeStyleTokens,
incl. field_types + per-user text-format enrichment). ManifestController (5→4 ctor args: dropped
field_type_manager + text_format_access, +manifest_builder) and MosaicLayoutWidget::buildManifests() (+1 ctor
arg) BOTH delegate. Grep proves the shape logic exists in exactly ONE file. Widget passes the real form user.

**D2 — parity test (the blind oracle).** Kernel `MosaicManifestParityTest`: widget buildManifests() mosaic_tabs
== ManifestController mosaic_tabs for the same 2-format user (field_types incl.). RED (pre-fix) quoted:
`- 'field_types' => [...]` absent in the widget Actual. GREEN after (29-run batch 29/29).

**D3 — live admin oracle.** Post-fix, admin drupalSettings `components[mosaic_tabs]` carries `field_types`
(setsType=array, bodyType=richtext, per-user human-labelled formats). Adapter builds the correct Stage-4 config
from the real manifest (proven: sets array + min + getItemSummary + body richtext + renderMenu + bodyFormat
select). Admin inspector renders the Stage-3 repeatable array (Puck `_ArrayField-addButton`). Held smoke oracle
`js/e2e/f087-manifest-parity.spec.ts` GREEN. Per-tab richtext/media/format = add+expand interactive step
(headless add trips the unsaved-guard + click actionability) → Arun's re-walk; Kernel parity is the
deterministic guard. (Probe honesty: Q4v1 false-positive from the node form's own CKEditor was re-scoped.)

**D4 — FE manifest cache coherence.** ManifestController response `private, max-age=3600` →
`private, max-age=0, must-revalidate` (BEFORE/AFTER quoted). FE fetch was `api/mosaic/manifest` (unversioned) →
`api/mosaic/manifest?v=<bundle version, read from the loaded script ?v=>` + `cache: 'no-store'`. Misleading
"busted on drush cr" docblock corrected.

**D5 — regression + dist.** dist rebuilt (builder 16:18, FE 16:18; libs 1.0.7→**1.0.8**), drush cr → served
`builder.js?v=1.0.8`, FE dist carries `?v=` + `no-store`. GATES: phpcs 0 err; FULL Kernel **159/159** (819
assn; +2 parity); FULL Unit **2691/2691** (6365 assn; 1 pre-existing warn; **22 structural smoke tests
retargeted** from ManifestController/widget source to MosaicManifestBuilder — intentional-refactor tracking;
maxAge test → max-age=0+must-revalidate); Vitest **472/473** (B-101); W18 **9/9** (S2 passed this run);
f066+lock **11/11**; sentinels 329/330/803/826/841-844 → **200**. Hygiene: `chunk-MosaicPuckAdapter.js` dead
leftover → Wave-D cleanup candidate (NOT deleted this CP).

**D6 — F-087 FIXED-PENDING-SHIP** (disease-pattern note: 4th parity-break strike; structural cure = one shared
builder). Ship #31 UPDATED = **32 files (24 tracked-M + 8 new)**; held (js/e2e/*.spec.ts + AI/*.md) NOT shipped.

---

## WALK-CATCHES #32/#33/#34 (Arun walk 2026-09-02) — PROBE+FIX, ride ship #31

**P1/P2 — F-089 (CRITICAL persistence blocker) FIXED.** Write chain: Puck onChange → handleChange
(BuilderApp:304) → toLayoutJson → MosaicPuckAdapter.fromPuck → hidden field (saveLayoutJson:336). ROOT: fromPuck
`processSlots` treated ANY array-valued prop as a slot → for Tabs `sets` it `register()`d each plain set item
(no `.props` → TypeError on `.props.id`) and `delete node.props[sets]`. `toLayoutJson` at BuilderApp:322 is
OUTSIDE the try → the throw aborts handleChange after setCurrentData+guard.updateCurrent but BEFORE
saveLayoutJson → hidden field never written → all 4 symptoms. FIX (root, shared path): `isPuckItem` guard —
only a non-empty array of Puck items ({type, object props}) is a slot; array-field values stay in props. Vitest
TabsPersistence 3/3 (RED reproduced Arun's flow: crash/drop → GREEN preserve + round-trip). Guard + preview
ride the restored path (no separate change). Media survival: new DrupalMediaNode (TipTap atom, parseHTML/
renderHTML round-trips <drupal-media>+data-* attrs) via richtext `tiptap.extensions`; @tiptap/core declared
^3.11.1. Vitest DrupalMediaSurvival 5/5 (DEFAULT TipTap DROPS it → node PRESERVES; survives further edit;
serialize round-trip).

**P3 — F-090 (FE media dialog behind + unstyled) FIXED (stacking) + CSS.** FE builder = native <dialog>
showModal() → top layer; body-appended media modal painted behind. media-library-bridge.js now detects
`dialog.mosaic-fe-dialog[open]` and mounts/appendTo it (same top-layer context; admin → body unchanged). media_
library/ui carries no CSS (lives in Claro) → Mosaic-owned FE-scoped media-dialog chrome added to css/mosaic-
fields.css (never pulls admin CSS; anon never loads the bridge). Live geometry = Arun re-walk + held journey.

**P4 — F-091 (editor overlaps toolbar) FIXED (CSS).** Richtext field = flex column, sticky toolbar +
scrolled ProseMirror region (scoped to Mosaic hosts). Geometry oracle = held journey + walk.

**P5 — Expand modal:** REGISTERED as a functional-build charter (the "same literal TipTap instance in a
portal" is Puck-richtext-internal work; needs a focused live-DOM turn to build+verify — NOT fabricated here).
Media-chip-in-editor + format-fixed-toolbar → Act 2.

**P6 — E2E LAW ledgered** + held full-journey e2e js/e2e/journeys/tabs-full-journey.spec.ts (admin + FE). Live
drive fails on the icon-only `_ArrayField-addButton` click actionability headless (documented walk-catch #31
Puck-array fragility) — Arun runs it interactively; the deterministic serialize round-trip is Vitest-guarded.

**GATES:** typecheck clean (pre-existing dsdShadow:17 only); Vitest 480/481 (1 = pre-existing B-101; +8 new);
dist rebuilt libs 1.0.8→1.0.9 (drupalMedia node bundled), drush cr; sentinels 329/330/803/826/841-844 → 200;
FULL Unit 2691/2691 (no PHP changed this turn); phpcs n/a (no PHP). [FULL Kernel + W18/f066/lock running.]
NO PHP source changed. Ship #31 UPDATED = 53 files (42 tracked-M + 11 new; 3 new this turn: DrupalMediaNode.ts
+ TabsPersistence.test.ts + DrupalMediaSurvival.test.ts). Held (NOT shipped): js/e2e/*.spec.ts + AI/*.md.
