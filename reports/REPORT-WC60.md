# REPORT — WALK-CATCH #60 — Panel responsiveness (PROBE + DESIGN, no build)

Arun's walk (verbatim): *"after selecting a fixed value, the right panel freezes, a loading pass runs, and
the panel refreshes — not Drupal-native feel."* Product-bar ruling: **input must never block or visibly
reload.** CP-VE3 P1-P4 paused behind this. Read-only mosaic git; P0 9-file set stays uncommitted on
`f3787cb` (verified byte-identical after this probe — instrumentation reverted, dist restored from backup,
md5 match). This report is probe + design only; implementation follows the reviewer + Arun ruling.

---

## Z1 — the post-pick timeline, instrumented (numbers, not adjectives)

Host 982, admin builder, one fixed-entity pick. A temporary render counter was added to the panel
(`MosaicViewsArgumentsPanel`), the builder rebuilt, measured via e2e, then fully reverted. Two runs:

```
run A: {"panelRendersAfterPick":16,
        "renderTimestampsRel":[0,0,1,1, 52,52, 338,339,340,341, 588,588, 2577,2579,2583,2583],
        "ssrRequests":[{"start":0,"dur":34}]}
run B: {"overlayDomOn_ms":103,"overlayDomOff_ms":357,
        "searchInputFocusLostAt_ms":36,
        "panelRendersAfterPick":16,
        "renderTimestampsRel":[0,1,1,1, 52,52, 324,325,326,327, 573,574, 2527,2528,2533,2533],
        "ssrRequests":[{"start":0,"dur":20}]}
```

| Measurement | Value | Meaning |
|---|---|---|
| SSR round-trip (`POST /api/mosaic/canvas/ssr`) | **20–34 ms** | the network is trivial — NOT the delay |
| `resolveData` debounce | **300 ms** (source constant) | the DOMINANT wait; artificial |
| Store replace (resolved props committed) | **~324 ms** after pick | when the pick reaches `appState.data` |
| Puck `loadingOverlay` present in panel DOM | **~103 ms → ~357 ms (≈254 ms)** | the visible "loading pass" (a `<Loader/>` over the fields) |
| Search input loses focus | **~36 ms** | you cannot keep typing after a pick |
| **Panel re-renders after ONE pick** | **16×** (StrictMode-doubled → ~8 prod) | the "refresh"/jank — bursts at t=0, ~52, ~324, ~573, **~2527 ms** |
| Last panel render | **~2.53 s** after pick | the panel churns for ~2.5 s per pick |

**Where the loading state comes from (quoted).** Puck's Fields component:
`const isLoading = fieldsLoading || componentResolving;` → renders
`<div class="…loadingOverlay"><div class="…loadingOverlayInner"><Loader size={16}/></div></div>`.
`componentResolving = componentState[selectedItem.props.id]?.loadingCount > 0`, and Puck's
`resolveComponentData` calls `setComponentLoading(item.props.id, true, 50)` (50 ms-delayed) while OUR
`resolveData` runs. So the panel overlay is switched on by the **same Tier-B resolve cycle** — it appears
~103 ms after the pick and clears when the 300 ms debounce + SSR completes (~357 ms).

**What "refreshes" (unmount/remount).** On resolve completion Puck dispatches `{type:"replace", data:
resolved.node}` → `selectedItem` changes → the Fields `form`'s `FieldsChildMemo` list + the `usePuck`
panel subtree re-render. The ~2.5 s trailing burst is a second churn (the entity-label resolve + settle).
The overlay is Puck-owned, not ours — so this is NOT a stray Mosaic spinner; it is structural.

---

## Z2 — why Tier-B commits AFTER resolveData (design intent, quoted)

**Our adapter — `MosaicPuckAdapter.buildTierBResolveData` (lines 996-1047):** for a component with
`requires_ssr_preview: true`, `resolveData` does `await new Promise(r => setTimeout(r, 300))` (a 300 ms
debounce, abort-safe) then `fetch(POST api/mosaic/canvas/ssr, {component_id, props})` and returns
`{ props: { ...props, _renderedHtml: json.html } }`. Its sibling `buildTierBRenderer` renders a **loading
skeleton** until `_renderedHtml` is set, then the real Twig HTML.

**Puck 0.21.3 contract:** the field-onChange path is
`yield resolveComponentData(item, "replace")` → runs the component config's `resolveData` → then
`dispatch({type:"replace", data: resolved.node})`. **The data commit — including the raw field value —
is gated behind `resolveData`.** (Puck's separate `DEBOUNCE_MS = 100` wraps the *history* record, not
the commit; `AREA_CHANGE_DEBOUNCE_MS = 100` is drag collision. Neither is the gate.)

**What consumes the resolved props — PROVEN preview-only.** `_renderedHtml` is:
- rendered by `buildTierBRenderer` on the **canvas card only**;
- **stripped on save** — `MosaicPuckAdapter.ts:1282 delete props['_renderedHtml']` (fromPuck);
- **skipped by file-usage** — `MosaicFileUsage.php:143 if ($key === '_renderedHtml') continue;`.

The **panel reads the RAW props** (argument_sources, view_display) and **SAVE persists the RAW props**.
So neither the panel nor save needs `_renderedHtml` — **only the canvas card does.** This is the linchpin:
the raw authoring commit and the SSR preview are separable.

**Tier-B roster (`requires_ssr_preview: true`) — 11 components, all affected:** mosaic_tabs,
mosaic_carousel, mosaic_html, mosaic_live_search, mosaic_image, mosaic_view, product_card, product_list,
search_results, webform_embed (search_bar is `false`). Every one couples its panel + canvas to the
300 ms + SSR cycle on **every** prop edit — F-106 and the panel freeze are two faces of one root cause.

---

## Z3 — design options

### (a) OPTIMISTIC COMMIT  ← RECOMMENDED
Split the raw authoring commit (synchronous) from the SSR preview (background):
- `resolveData` returns `{ props }` **immediately** (raw props, no 300 ms wait) → Puck commits the field
  change to the store synchronously → panel + save see the pick at once, `componentResolving` never
  latches the panel overlay.
- The SSR fetch runs in the **background** (still debounced/abortable to protect the endpoint, but OFF the
  commit path) and, on completion, applies `_renderedHtml` (preview-only) to the canvas via a targeted,
  **history-excluded** update (`recordHistory:false`) that does NOT re-enter `resolveData` (loop guard).
- Panel isolated (memo + narrow selectors) so a background `_renderedHtml`-only change re-renders **zero**
  panel nodes (the panel never reads `_renderedHtml`).
- Loading shown as a subtle **canvas-card shimmer**, never a panel overlay.
- **F-106 side-channel RETIRED** — the raw commit is now synchronous, so the flush reads live store data
  correctly; `pendingArgSources.*` deleted, its 4 Vitest cells + the film re-pointed at the new contract.

**Blast radius:** LARGE — core Tier-B SSR architecture (`buildTierBResolveData` + `buildTierBRenderer` +
the background-apply mechanism) → all **11** Tier-B components. **Save-correctness proof sketch:** the raw
value is in `appState.data` synchronously at the field onChange, before any save reads it → F-106 cannot
recur by construction (no timing window). **Undo/redo:** raw commits record history normally; the
background `_renderedHtml` apply is `recordHistory:false` so undo never steps through preview-only states.
**Per-component risk:** carousel + tabs carry slot children (nested props) — the background apply must
patch only `_renderedHtml` and not clobber slots; view/live_search/webform are flat (low risk);
commerce product_* mirror view. **Key implementation risk to resolve in the charter:** Puck 0.21.3 must
allow applying a prop update WITHOUT routing back through `resolveData` (candidate hooks:
`resolveComponentData`'s `onResolveEnd`, or a direct `setData`/`replace` dispatch with a loop guard) — to
be proven before build. **Law conflicts:** none fatal — ADR-002/003 (Twig-first SSR preview) preserved
(SSR still runs, just backgrounded); no-sleeps satisfied (the 300 ms leaves the commit path).

### (b) KEEP PIPELINE, isolate panel re-renders + inline non-blocking affordance
Keep `resolveData` gating the commit. Suppress Puck's `loadingOverlay` via the `fields` override + a
subtle inline affordance; memoize the panel to cut the 16 renders. **Smaller blast radius (panel-only),
but the DISEASE survives:** the raw commit is still 300 ms + SSR behind the pick → the **F-106 side-channel
stays** (permanent tourniquet), a fast save still races, and the panel still can't reflect the pick until
resolve. Undo/redo unchanged. Treats the symptom Arun sees, not the cause.

### (c) HYBRID
= (a) scoped by splitting each Tier-B component's props into "authoring" (commit synchronously) vs
"preview" (`_renderedHtml`, background). Converges on (a); the split is (a)'s implementation detail.

**Recommendation: (a).** It is the only option that CURES the root cause — fixing both F-106 (retiring the
side-channel tourniquet) and the panel freeze/storm in one architecture change across all 11 Tier-B
components, and it aligns with the product-bar ruling (input never blocks or reloads). (b) leaves the
tourniquet and the race. The cost of (a) is the larger blast radius + the one open Puck-API question above,
which is exactly why this needs the reviewer + Arun ruling before a build charter.

### Derived test plan (for whichever option is ruled)
1. **Race cell** — pick → INSTANT save persists the pick (option a: WITHOUT the side-channel).
2. **Storm render-count cell** — instrumented pick asserts panel re-renders ≤ N (target: 16 → ~2-4).
3. **No-panel-overlay cell** — after a pick, `[class*="loadingOverlay"]` never enters the panel DOM.
4. **Background-preview cell** — `_renderedHtml` updates the canvas card without re-rendering the panel.
5. **Geometry** — all 11 Tier-B components still render (skeleton→HTML) correctly; carousel/tabs slots intact.
6. **Films** — mosaic_view + mosaic_carousel + one commerce, both surfaces (admin + FE).

---

## Z4 — status
Findings ledgered (WALK-CATCH #60, tally 60). **STOP — reviewer + Arun RULE on the option (a/b/c); the
implementation charter follows the ruling.** P0's F-106 side-channel remains the accepted interim
tourniquet until then; the FE-surface film is owed by CP-VE3 P5.
