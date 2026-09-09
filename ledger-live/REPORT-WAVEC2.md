# OVERNIGHT PROBE — F-074 + F-075 (probe-then-fix-if-bug) — EVIDENCE LOG
2026-08-17. Read-only git, NO staging, NO live-DB writes (Kernel/Unit DBs fine).
Gates: FULL Kernel + FULL Unit + W18 on any FE-canvas change + sentinels + phpcs 0/0.

## CHARTER (fresh-read from REPORT-WAVEC.md § S4, quoted)
- F-074 (5 steps): PARSE (MosaicLayoutValue::fromJson breakpoint_states) → RENDER ENTRY
  (MosaicRenderer render()→renderNode($breakpoint): who passes it, what value) → DIFF node-edit vs
  FE page-view → OUTPUT (Kernel fixture with breakpoint_states, quote where breakpoint is fixed to
  'default') → verdict (A) PARAM-PLUMB BUG vs (B) DESIGN GAP. IF A fix now; IF B design options + STOP.
- F-075 (6 steps): per-surface table widget / sentinel+resolver / render / validation / tests =
  works|broken|missing|too-complex; biggest blocker + feature-gap vs bug per row. FIX-IF-BUG the
  F-055-class save-time validation gap for drupal_entity_ref; widget-class = design + STOP (no picker).

═══════════════════════════════════════════════════════════════════════════════
## P1 — F-074 PROBE — VERDICT: **(B) DESIGN GAP** (NO FIX — design options + STOP)
═══════════════════════════════════════════════════════════════════════════════

**Step 1 — PARSE.** `MosaicLayoutValue::fromJson()` (L87-109) parses `breakpoint_states` into
`$breakpointStates[$bp] = ['root' => uuid, 'nodes' => ComponentInstance map]` (readonly, L55). Keys are
'mobile'/'tablet' (L46-47). Doc: "Missing state for a breakpoint = inherits desktop nodes." So the value
object CARRIES the alternative trees. Not the defect.

**Step 2 — RENDER ENTRY.** `MosaicRenderer::render($layout, $entity, $_context, string $breakpoint='',
$fieldName, $delta)` (L112). L120-134: WHEN `$breakpoint !== ''` and not desktop/wide and a state exists,
it SUBSTITUTES that state's root+nodes (`getBreakpointState`) before rendering. So the mechanism to
render an alternative tree EXISTS and is keyed entirely on the `$breakpoint` argument. `renderNode`
uses `$breakpoint` for per-instance overrides + the cache CID (L359/370). Two render contexts:
`MosaicRenderContext` (L219, entity/request/user — the per-render context) vs core `RenderContext`
(L275, canvas-only preview). Neither derives a breakpoint from the viewport.

**Step 3 — DIFF the two paths.**
- **node-EDIT (WORKS):** the builder previews a selected breakpoint on demand via
  `RenderPreviewController` — `$allowedBreakpoints = ['', 'mobile', 'tablet', 'desktop', 'wide']` (L114).
  The builder JS requests a preview for the breakpoint the author picked → render() substitutes that
  tree → the author sees the mobile arrangement. Interactive, on-demand, breakpoint supplied by the UI.
- **FE page-VIEW (BROKEN):** `MosaicLayoutFormatter::viewElements()` L131:
  `$this->mosaicRenderer->render($layout, $entity, [], '', $items->getName(), $delta);` — **hardcoded ''**.
  `renderLazy()` (BigPipe/user-context path) L208: `renderInternal($layout, $entity, '')` — also **''**.
  Grep: NO caller anywhere passes a non-empty breakpoint to render() on the FE path.

**Step 4 — OUTPUT (Kernel fixture, no live DB).**
`tests/src/Kernel/Service/MosaicBreakpointRenderTest.php` (2 tests, 12 asserts, GREEN):
- `render(layout, entity, [], '')` → HTML contains **DESKTOPTREE**, NOT MOBILETREE. (FE-path behaviour.)
- `render(layout, entity, [], 'mobile')` → HTML contains **MOBILETREE**. (Mechanism works with an
  explicit breakpoint — the builder-preview path.)
**The load-bearing line: MosaicLayoutFormatter.php:131 passes `''`.** But it is NOT a forgotten plumb —
there is NOTHING to plumb from: a server-rendered FE page has no viewport (the browser measures AFTER
the HTML ships). Per-instance STYLE overrides DO ship responsively as `@media` CSS (MosaicRenderer
L441-574), but breakpoint_states are full ALTERNATIVE DOM TREES, not style deltas — a single server
render can emit only one.

**Step 5 — VERDICT: (B) DESIGN GAP.** Not (A): the FE render context genuinely has no active-breakpoint
source; the '' is correct given the current design. Making alternative-tree breakpoint_states appear on
the live FE page requires a responsive-switch DESIGN decision. **No fix — Arun ruling required.**

### F-074 design options (for Arun's ruling)
1. **CSS media-query MULTI-EMIT (server-first).** Emit ALL breakpoint trees into the DOM, each in a
   wrapper toggled by `@media` (display none/block). (+) pure server render, works without JS, Twig-first
   ethos, no FOUC. (−) DOM bloat (N× markup + N× data-source renders + N× component cache entries);
   duplicate-content SEO risk; a11y must aria-hidden the inactive trees; duplicate element IDs; heavier
   page. **Size: MEDIUM-LARGE** (renderer emit-all + wrappers + @media + per-state cache keying + a11y +
   W18/geometry re-verify).
2. **CLIENT-SIDE JS SWITCH.** Ship the active (desktop) tree + the alternative trees' HTML (or JSON);
   renderer.js uses `matchMedia` to swap the DOM to the active breakpoint. (+) one active tree visible;
   mirrors the builder's client model. (−) needs JS (no-JS = desktop only); FOUC/layout-shift on swap;
   either emit-all-HTML-hidden (= option 1's bloat) or a client render engine from JSON (large new
   surface); SSR/CSR parity + hydration burden. **Size: LARGE.**
3. **SERVER UA-SNIFF — REJECTED (per charter).** Guess viewport from User-Agent. Unreliable (resize,
   tablets, unknown UAs), cache-fragmenting (vary-by-UA = cache explosion), anti-pattern. Do not build.
4. **REFRAME (product question).** Keep breakpoint_states as a BUILDER-PREVIEW authoring aid only, and
   handle FE responsiveness through the existing per-instance breakpointOverrides `@media` CSS (which
   already ships and works). Viable IFF every arrangement difference authors need can be expressed via
   CSS (order/flex-direction/grid-template/visibility) rather than a different DOM tree. **Size: SMALL**
   (mostly docs + possibly hiding the alternative-tree authoring UI). Arun product call.

**RECOMMENDATION (for the ruling, not a decision):** Option 4 if CSS overrides cover the real authoring
need (cheapest, most robust, Twig-first); else Option 1 (server-first multi-emit) with the a11y/SEO
caveats budgeted. Option 2 only if a client render engine is already on the roadmap. **STOP — Arun rules.**

═══════════════════════════════════════════════════════════════════════════════
## P2 — F-075 PROBE — per-surface table + FIX (validation bug)
═══════════════════════════════════════════════════════════════════════════════

| Surface | Status | Evidence |
|---|---|---|
| WIDGET (`js/src/builder/fields/MosaicEntityRefField.tsx`) | **WORKS** | Debounced (300ms) autocomplete → `GET /mosaic/entity-suggest?entity_type&q&limit`; "× Clear"; emits `{_type:'drupal_entity_ref', entity_type, uuid, label}`. vitest-covered. |
| SENTINEL + RESOLVER (`MosaicPropResolver::resolveEntityRef`) | **WORKS** | entity_type+uuid → `loadEntityByUuid` → `access('view')` → cache tags → `{id,uuid,label,url}`. |
| RENDER (`MosaicRenderer`) | **WORKS** (plumbing) | Resolver returns values for Twig. No CORE mosaic_components component declares an entity_ref prop_type — available for custom/other-module components (feature-dependent, not a bug). |
| VALIDATION (`MosaicPropValidator`) | **BROKEN → FIXED** | `validateMediaSentinel` covered only drupal_media; a bogus/inaccessible `drupal_entity_ref` saved SILENTLY. **F-055-class bug.** |
| TESTS | PARTIAL → EXTENDED | Resolver (Unit+Kernel) + widget (vitest) covered; entity-ref save-validation had NO coverage → +5 cells. |

**Biggest blocker = the save-time validation gap (a BUG, not a feature gap).** The widget exists, so NO
picker to build. **FIX shipped (in-charter):** `MosaicPropValidator::validateEntityRefSentinel()` mirrors
`validateMediaSentinel()` — reads the sentinel's own `entity_type`, `loadEntityByUuid`, errors on missing
/ access-denied / unknown-entity-type; wired via `validateMediaSentinel(...) ?? validateEntityRefSentinel(...)`.
Empty entity_type/uuid deferred to FINDING-023. RED→GREEN Unit: MosaicPropValidatorTest +5 cells (missing,
inaccessible, viewable, unknown-type, no-uuid-deferred). RED proof: with the check disabled, the 3
failing-case cells pass silently (the bug); restored → 9/9 GREEN.

## P3 — REGRESSION (gates)
- FULL Kernel **129/588 GREEN** (127 + 2 F-074 evidence). FULL Unit **2679/6295 GREEN** (2674 + 5 F-075
  cells; 1 pre-existing warning P-1). phpcs **0/0** on all changed/new PHP. Sentinels 826/841-844 all **200**.
- W18: **n/a** — no FE-canvas (css/js) change this run (F-075 = validator PHP; F-074 = Kernel evidence only).

## P4 — CLOSEOUT
- **F-074 = (B) DESIGN GAP — OPEN, no fix.** Design options + recommendation written above; Arun rules on
  the responsive-switch approach (multi-emit / client-switch / reframe; UA-sniff rejected).
- **F-075 = mostly WORKS; ONE bug (save-time validation) FIXED + shipped.** Widget/resolver/render fine.
- **SHIP-LIST #25 (draft):** (1) src/Service/MosaicPropValidator.php [F-075 fix], (2) tests/src/Unit/
  Service/MosaicPropValidatorTest.php [+5 F-075 cells], (3) tests/src/Kernel/Service/
  MosaicBreakpointRenderTest.php [F-074 current-behaviour evidence — update when the B-design ships].
  Count: 3 files (1 src + 2 tests). All `git check-ignore` = shippable.
