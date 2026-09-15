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

---

# O1 — OPTIMISTIC COMMIT SPIKE (mosaic_view only) — CHECKPOINT (GREEN) 2026-09-15

Ruling ratified (Arun): fix = Option (a). This spike proves the mechanism on **mosaic_view only** before
migrating the other 10 Tier-B components (O2). Sits on ship #37R (`f3787cb`); **11 files** (8 tracked-M +
3 new), read-only mosaic git.

## The background-apply mechanism — proven from Puck 0.21.3 dist (quoted)
- **Field-onChange path:** `setDeep(props, propPath, value)` → `resolvedData = yield
  appStore.resolveComponentData(node, …)` → `dispatch({type:"replace", data: resolvedData.node})`. Resolve
  runs BEFORE the dispatch, only on this path.
- **Loop guard input:** `resolveComponentData` caches `lastChange[id]`, computes `changed`, and calls
  `configForItem.resolveData(item, { changed, lastData, trigger, … })`.
- **History exclusion:** `if (typeof action.recordHistory !== "undefined" ? action.recordHistory :
  isValidType)` over `["setData",…,"replace",…]` → `recordHistory:false` keeps an apply out of undo/redo.
- **`setData` does NOT re-enter `resolveComponentData`** (it is a raw reducer action; resolve is the
  pre-dispatch step) — so a background preview apply cannot loop.
- **Overlay latch:** `componentResolving = componentState[id].loadingCount>0`, set by
  `setComponentLoading(id,true,50)` (50 ms delayed) during resolve → a resolveData that resolves in <50 ms
  cancels it, so the panel's `isLoading` overlay never appears.
- **Panel isolation:** `createUsePuck()(selector)` subscribes to only the selected primitives.

## What was built (mosaic_view only; the other 10 stay on the inline path until O2)
| File | Change |
|---|---|
| `js/src/builder/tierBOptimistic.ts` (NEW) | The optimistic resolveData + background SSR scheduler (debounced 200 ms, abortable, OFF the commit path) + history-excluded `setData` apply. Loop guard = authoring-props snapshot per id (a preview-only change ⇒ no refetch). `registerTierBPuckApi(dispatch, getData)` captures the live store from inside `<Puck>`. |
| `js/src/builder/MosaicPuckAdapter.ts` | `id==='mosaic_view'` → `makeOptimisticResolveData`; renderer gains **STALE-PREVIEW-WITH-SHIMMER** (prev HTML stays under a subtle top bar while the new SSR is in flight; never blank; skeleton only first insert); dirty-strip covers all `TIER_B_PREVIEW_KEYS` (`_renderedHtml`/`_ssrError`/`_ssrShimmer`). |
| `js/src/builder/BuilderApp.tsx` | `MosaicTestabilityHooks` registers the Tier-B Puck api (dispatch + `useGetPuck` data). |
| `js/src/builder/fields/MosaicViewsArgumentsField.tsx` | Panel isolated via lazily-created `createUsePuck` primitive selectors (view/display/id) + memoised (deep-equal `value`) so a background apply never re-renders it; focus retained after a pick (input keeps focus; focus alone no longer opens the dropdown). |
| `js/src/frontend-editor/FrontendBuilderDialog.tsx` | `FeTierBRegistrar` registers the api inside the FE `<Puck>` (headerActions) so the FE mosaic_view canvas is not regressed. |
| `mosaic.libraries.yml`, `js/dist/*` | rebuilt; libs **1.0.20 → 1.0.21**. |

## Cells — before → after (numbers)
| Cell | Before (WC60 probe) | After (spike) |
|---|---|---|
| **race** — pick → INSTANT save (live store, no side-channel read) | value LOST (`titles=[]`) | **survives** (`["Navel","Orange","Meyer"]`), 7/7 cells green |
| **overlay-never-latches** — `loadingOverlay` in panel DOM | present **~103→357 ms (254 ms)** | **never** (`overlayDomOn=-1`; cell samples 1.2 s) |
| **focus-retained** — search input focus after pick | lost at **~36 ms** | **retained** (`focusLostAt=-1`; activeElement = the search input) |
| **render-count** — panel re-renders / pick | **16** (dev) | **2 dev = 1 prod** (memo + isolation) |
| **loop-guard** — SSR requests | (n/a) | **1** per pick; **4 rapid edits → 1** SSR (debounce collapses; no runaway) |
| **canvas** — stale-preview-with-shimmer | freeze + skeleton | `sawShimmer=true, wentBlank=false` (never blank on edit) |
| **undo** — history clean | (n/a) | 2 authoring edits reverted within bounded undos → baseline (`view_default`); preview applies are NOT steps |

Raw (final clean build): `{"overlayDomOn_ms":-1,"searchInputFocusLostAt_ms":-1,"panelRendersAfterPick":2,
"ssrRequests":[{"dur":33}]}`.

## Gates
| Gate | Result |
|---|---|
| e2e — wc60-spike (7 behavioral cells) | **7/7 GREEN** |
| e2e — f106-flush (race under optimistic commit) | **2/2 GREEN** |
| Vitest — full | **523 / 1** (1 = pre-existing B-101) |
| tsc | clean (only pre-existing `dsdShadow.ts`) |
| PHP JS-source smoke (Sprint65/66/67/87) | **136/136** (adapter strings intact) |
| dist + libs | builder + FE rebuilt (no debug leaks); libs **1.0.20 → 1.0.21** |

## Notes for the reviewer
- **Side-channel still present** (P0 `pendingArgSources`): now redundant for mosaic_view (the optimistic
  commit puts the pick in the live store synchronously — the race cell proves it). O3 RETIRES it with
  oracle-change records + the FE film.
- **FE parity:** the FE registrar is wired so the FE mosaic_view canvas works, but the FE surface is not yet
  FILMED — that lands in O3 (the owed FE film).
- **Scope:** only `mosaic_view` is on the optimistic path; the other 10 Tier-B components are unchanged
  (inline resolveData) — O2 migrates carousel+tabs (wave 1) then the remaining 7.

### STOP — reviewer audits O1 before O2 (migrate carousel + tabs, then the remaining 7 Tier-B).
