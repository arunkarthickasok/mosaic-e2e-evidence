# REPORT — CP-VE3 (SHIP #38) — Final Views Act

Charter: design §7 CP-3 ratified. Standing laws + evidence gate + honest checkpoints; read-only mosaic
git; scratch journeys only. Sits on ship #37R (`f3787cb`, parent `62a1c05`). This report grows one section
per P; each P checkpoints for reviewer audit before the next builds on it.

---

## P0 — F-106 flush-on-submit — CHECKPOINT (GREEN) 2026-09-15

### What F-106 is
Puck's commit of a `mosaic_view` field change to its store is asynchronous, so a Save racing that commit
persists the layout WITHOUT the just-picked value. Concretely: pick a fixed entity in the Views
argument-source panel, then Save immediately → the published page renders the *pre-pick* argument (the
change is silently dropped).

### RED first — the race reproduced on the pre-fix (ship #37R) bundle
Throwaway host **982** baselined to `fixed → Berry (tid 3)` (Berry subtree = Blueberry, Wild Straw; a
surviving Citrus pick = Navel, Orange, Meyer). The e2e cell picks "Citrus" then clicks Save with **no
settle wait**, then asserts the published page filters to the Citrus subtree. On the shipped bundle:

```
[F-106] published titles after instant save: []
    Error: expect(received).toContain(expected) // indexOf
    Expected value: "Navel"
    Received array: []
  > 43 |   expect(titles).toContain('Navel');
  1 failed
```

The picked value never reached the saved layout — the page rendered unfiltered/empty of the Citrus subtree.

### Root cause — DEEPER than the A3 assessment (honest correction)
The A3 registration (SETTLE-WAIT AUDIT) assessed the durable fix as *"index.tsx keeps a ref to the latest
Puck data + a capture-phase submit listener that flushes `toLayoutJson(latestData)` synchronously."* That
was built first — and it was **still RED**. Instrumented probing (browser console) + reading Puck 0.21.3's
dist showed **why the ref is stale**:

- A render-lagged `useLayoutEffect` mirror of `appState.data` did not have the pick at submit.
- Neither did a **live** `useGetPuck().getState()` read of the zustand store. Witnessed at submit:

```
[F106-flush] live.argsrc=[{"source":"fixed","entity_type":"taxonomy_term"}]   ← NO value key
[F-106] published titles after instant save: []
```

- **The gate is our own adapter.** `MosaicPuckAdapter.buildTierBResolveData` (the `mosaic_view` is Tier B)
  runs a **300 ms debounce + SSR `POST /api/mosaic/canvas/ssr` fetch** and only THEN returns resolved
  props; Puck's field-onChange path (`yield resolveComponentData(...)` → `dispatch({type:"replace"})`)
  commits the change to `appState.data` **after** that resolve. So for ~300 ms after a pick the new
  `argument_sources` is not in Puck's store at all — no store read (mirror or live getter) can see it. The
  value exists synchronously **only at the field's own `onChange`**, before the debounce. (Puck's separate
  `DEBOUNCE_MS=100` wraps the *history* record, not the data commit — not the gate.)

### The fix (deviates from the ratified "read latestData" design — reviewer please bless)
A synchronous side-channel captured at the field boundary, overlaid onto the flushed data:

| File | Change |
|---|---|
| `js/src/builder/fields/pendingArgSources.ts` (NEW) | Module-global map. `recordPendingArgSources(id, v)`; `overlayPendingArgSources(data)` (applies pending onto a JSON **copy** — never mutates Puck's store; no-op when empty); `reconcilePendingArgSources(committed)` (drops an entry once the store's committed value matches, so undo/redo stays authoritative). |
| `js/src/builder/fields/MosaicViewsArgumentsField.tsx` | The panel records the raw `argument_sources` (keyed by `usePuck().selectedItem.props.id`) **before** calling Puck's debounced field onChange. |
| `js/src/builder/BuilderApp.tsx` | `MosaicTestabilityHooks` (inside `<Puck>`) registers a live getter via `useGetPuck` returning `overlayPendingArgSources(getState().appState.data)`; `handleChange` calls reconcile. |
| `js/src/builder/index.tsx` | The mount's capture-phase `form 'submit'` listener flushes `textarea.value = toLayoutJson(getLiveData())` synchronously before the form serializes. |
| `js/src/frontend-editor/FrontendBuilderDialog.tsx` | **FE parity** (see below). |
| `mosaic.libraries.yml` | libs 1.0.19 → **1.0.20** (BUMP-LIBS law). |
| `js/dist/builder.js`, `js/dist/frontend-editor.js` | rebuilt (no debug markers — verified `grep -c` = 0). |

### Both save paths witnessed for the same race
- **Admin widget** — hidden `[data-mosaic-field-id]` textarea submitted by the Drupal node form.
- **FE dialog** — POSTs `layout_json` (from `currentDataRef.current`) to `POST /mosaic/frontend-save/…`.

Both read Puck's SSR-debounce-lagged data → the **race is SHARED**; only the save plumbing differs. Because
the side-channel is module-global (the same `MosaicViewsArgumentsPanel` records into it on both surfaces),
the fix is a **parity fix**: FE `handleSave` now reads
`toLayoutJson(overlayPendingArgSources(currentDataRef.current))`. (The FE surface is code-witnessed, not
filmed — an FE-surface film can be added if the reviewer wants live FE evidence.)

### GREEN — the pick survives the instant Save (fix bundle)
```
[F106-flush] live.argsrc=[{"source":"fixed","entity_type":"taxonomy_term","value":"6"}]
[F-106] published titles after instant save: ["Navel","Orange","Meyer"]
  2 passed (8.2s)
```

### Guards
- **e2e** `js/e2e/journeys/f106-flush.spec.ts` (gitignored film): pick → INSTANT Save → published page
  filters to the picked subtree.
- **Vitest** `src/builder/fields/__tests__/pendingArgSources.test.ts` (4 cells): overlay-wins-over-stale,
  no-store-mutation, empty-is-noop, reconcile-then-undo-is-authoritative.

### Gates
| Gate | Result |
|---|---|
| e2e — f106-flush (journeys) | **2/2 GREEN** (RED confirmed on the pre-fix bundle) |
| Vitest — full | **523 / 1** (1 = pre-existing B-101 boolean→radio drift) |
| tsc | clean (only pre-existing `dsdShadow.ts`) |
| dist + libs | builder + FE rebuilt; libs **1.0.19 → 1.0.20** |

### Deltas & follow-ups
- **9 files** uncommitted on ship #37R: 7 tracked-M (`BuilderApp.tsx`, `MosaicViewsArgumentsField.tsx`,
  `index.tsx`, `FrontendBuilderDialog.tsx`, `mosaic.libraries.yml`, `js/dist/builder.js`,
  `js/dist/frontend-editor.js`) + 2 new (`pendingArgSources.ts`, `pendingArgSources.test.ts`). Read-only
  mosaic git — not staged by the AI.
- The fix scopes to `argument_sources` (the witnessed field). The same 300 ms-debounce race theoretically
  affects ANY Tier-B prop on a fast edit-then-save; generalizing the side-channel to all Tier-B props (a
  small `pendingProps` map keyed by instanceId+propName) is a reviewer call.

### STOP — reviewer audits P0, then P1 (SSR preview button) builds on the settled save path.

---

## P0.5 — plain-value inputs adopt the WC57 debounced-commit contract — CHECKPOINT (GREEN) 2026-09-15

Closes the ledgered WC60 panel-perf remainder. The two plain-text argument inputs — `url_param` (parameter
name) and the `fixed` plain value (non-entity args) — committed to Puck **per keystroke**
(`onPatch({param: e.target.value})`), so typing a name was N Puck history entries (N undo steps) + N panel
re-renders + N background SSR schedules. Now they use the same contract as the WC57 entity autocomplete.

### The fix
New `DebouncedTextInput` (exported): holds its own local state, commits on a **~300 ms debounce** (or
immediately **on blur**), and adopts an externally-changed committed value (reopen / undo) via a
`useEffect([value])` — safe because `value` stays stale during a burst until our own debounced commit lands.
Wired for both `url_param` and the `fixed` plain-value input.

### RED → GREEN
```
CP-VE3 P0.5 — DebouncedTextInput
  ✓ fast typing commits ONCE with the full string, zero mid-type commits
  ✓ a later keystroke resets the debounce (still one commit, latest value)
  ✓ blur flushes immediately (no wait)
  ✓ adopts an externally-changed committed value (reopen / undo)
```
The RED is the assertion `expect(onCommit).not.toHaveBeenCalled()` mid-burst — it FAILS on the old
per-keystroke code and PASSES with the debounce. **Oracle-change:** the existing `viewsFields` url_param
cell asserted a synchronous per-keystroke commit → updated to assert *debounced* (no commit mid-type; blur
flushes `param: 'category'`).

### Gates
| Gate | Result |
|---|---|
| Vitest — full | **528 / 1** (1 = pre-existing B-101); +4 debounce cells |
| tsc | clean | 
| e2e — wc60-spike regression | **7/7** (panel unaffected) |
| dist + libs | builder + FE rebuilt (no debug leaks); libs **1.0.23 → 1.0.24** |

**6-file set** on ship #38 (`d915ee7`): 5 M (dist ×2, `MosaicViewsArgumentsField.tsx`, `viewsFields.test.tsx`,
`mosaic.libraries.yml`) + 1 new (`debouncedInput.test.tsx`). Read-only mosaic git.

### STOP — honest checkpoint after P0.5.
P1 (SSR preview button, R-V1 opt-in) is a real feature — an editor-only, access-checked, uncacheable route
that runs the real Views executable on demand (the builder canvas deliberately shows only a summary card
today: `MosaicViewComponent` "BUILDER canvas (R-V1): no live render"), a per-placement Preview button,
placeholder-on-config-change, and both surfaces + films. It deserves its own focused build rather than a
rushed tail-of-session pass. Reviewer audits P0.5; P1 is the next dedicated build.

---

## P1a — SSR preview backend (route + shared renderer + inert snapshot) — CHECKPOINT (GREEN) 2026-09-15

The backend of the SSR Preview button. INERT-SNAPSHOT contract (F-103 lineage): the preview is a STATIC
rendering — no libraries shipped, every form control disabled, the whole snapshot pointer-events:none —
so it can NEVER re-introduce a live component in the editor (walk-catch #55's disease).

### Built
| File | What |
|---|---|
| `modules/mosaic_views/src/Service/MosaicViewRenderer.php` (NEW) | The SHARED Views render path (extracted from `MosaicViewComponent::renderView`). BOTH the page render and the editor preview call it → **args parity by construction**, no drift. |
| `modules/mosaic_views/src/Plugin/MosaicComponent/MosaicViewComponent.php` (M) | Refactored to inject + call the shared renderer; dead private `renderView` + now-unused `Views` import removed. Regression: embed-render Kernel **7/7**. |
| `modules/mosaic_views/src/Controller/ViewsPreviewController.php` (NEW) | `preview()` resolves per-placement args (shared `ViewsArgumentResolver`; page-context sources against the HOST + editing user, url_param against NO params — each surfaced in `labels`), runs the shared renderer, `renderInIsolation` (V0 bubbling contained — attachments captured but NOT shipped), then `makeInert()` (DOMDocument disables every input/select/textarea/button + wraps `pointer-events:none`). `access()` = editor-only (`$entity->access('update')`, frontend-save parity). UNCACHEABLE response. Labelled "Preview — static snapshot". |
| `modules/mosaic_views/mosaic_views.routing.yml` (M) | `mosaic_views.preview` POST `/api/mosaic/views/preview/{entity_type}/{entity_id}` — `_custom_access` + `_csrf_request_header_token` + `entity_id: \d+`. |
| `modules/mosaic_views/mosaic_views.services.yml` (M) | Registers `MosaicViewRenderer`. |

### Kernel — RED → GREEN (raw)
Iterated from RED (initial `TypeError: error() Argument #1 must be of type string, TranslatableMarkup given`
+ `Failed asserting that null is identical to 0` on the max-age) to GREEN by fixing the controller
(`error()` accepts `Stringable`; Cache-Control carries `max-age=0`) and the test (`AnonymousUserSession`):
```
Drupal\Tests\mosaic_views\Kernel\ViewsPreviewControllerTest
  ✓ testPreviewAppliesResolvedArgumentAndIsInert   (matched node present; non-match filtered;
      mosaic-views-preview + pointer-events:none + data-mosaic-inert; NO <script>; label correct)
  ✓ testAccessIsEditorOnly     (anonymous forbidden; editor allowed; missing host forbidden)
  ✓ testResponseIsUncacheable  (max-age 0; Cache-Control no-store; X-Drupal-Cache: UNCACHEABLE)
  ✓ testMissingViewReturnsError
OK (4 tests, 89 assertions)
```

### Gates (P1a)
| Gate | Result |
|---|---|
| Kernel — ViewsPreviewControllerTest | **4/4 (89 assertions)** |
| Kernel — embed-render regression (shared-path refactor) | **7/7 (75 assertions)** |
| phpstan (new PHP) | **OK, no errors** |
| phpcs (all P1a PHP) | **0 errors** (line-length warnings only, as elsewhere) |

No JS/dist change in P1a (backend only). **12-file accumulating ship #39 set** on `d915ee7` (P0.5 + P1a:
8 M + 4 new).

### STOP — honest sub-checkpoint after P1a (backend).
P1b (the React "Preview" button on the mosaic_view card, both surfaces — fetch the route, inject the inert
HTML, shimmer loading, PLACEHOLDER-returns-on-any-config-change), P1c (films: admin + FE preview, inertness
click film, config-change-clears film), and P1d (Vitest + full gates + dist + libs bump + ledger/report
push) are the next sub-checkpoint. Reviewer audits P1a.

---

## P1b — Preview button — CHECKPOINT (BLOCKED on a pinned-contract conflict) 2026-09-15

The `MosaicViewPreview` React component is **built and unit-tested**, but its charter placement ("button on
the mosaic_view **card**") **directly conflicts with the PINNED inert-canvas contract** the charter itself
pins — and the conflict is a hard technical constraint, not a preference. Surfacing it for a ruling.

### Built + GREEN
`js/src/builder/MosaicViewPreview.tsx` — wraps the Tier-B summary card; a "Preview" button CSRF-POSTs the
placement to `mosaic_views.preview`, injects the inert snapshot + chrome/labels, shows a shimmer bar (never
a panel overlay), and — the key contract cells — **returns the placeholder on ANY config change** and
**aborts an in-flight fetch** when the config changes mid-flight. Vitest **5/5**:
```
CP-VE3 P1b — MosaicViewPreview
  ✓ renders the Preview button and the summary card by default
  ✓ Preview POSTs to the route with the CSRF header and injects the inert snapshot
  ✓ a config change clears the snapshot (placeholder returns)
  ✓ a config change WHILE loading aborts the fetch — no stale inject
  ✓ the Preview button is disabled when no view is selected
```
Wired: `getCsrfToken` exported (shared); `toConfig` gained `hostEntityId`; `buildViewPreviewRenderer`
(mosaic_view card renderer) added; both surfaces thread the host context (index.tsx + FE dialog).

### The BLOCKER — witnessed live
Placing the button on the card puts it **behind Puck's click-to-select overlay** (the inert-canvas
convention, F-103 lineage): canvas component content is non-interactive by design — a click selects the
component, it does not reach the content. Live witness on admin host 982:
```
[P1-SMOKE] previewHost=true previewBtn=true      (the button renders on the card)
[P1] btnClicked=false                            (click times out — overlay intercepts; same result
                                                  whether or not the component is selected first)
```
So the charter contradicts itself: **"inert canvas" (pinned) vs "button on the card"**. The inert-canvas
contract is the one explicitly pinned, so it must win — which means the button cannot live on the canvas.

### Recommendation (reviewer ruling requested)
Move the "Preview" button to the **interactive property panel** (the surface Mosaic already uses for
canvas-adjacent interaction — cf. tabsPanelSync/carouselPanelSync, which moved slide/tab interaction to the
panel for exactly this reason). The **inert snapshot still renders IN the card** via a small panel↔card
store keyed by instance id. This honors the pinned contract, keeps the result per-placement on the card,
and reuses the already-tested `MosaicViewPreview` fetch/inject/clear/abort logic.

### State handed to the reviewer
The card gate was **reverted to the plain Tier-B summary card** so the live canvas is clean (no
non-functional button). `MosaicViewPreview` + `buildViewPreviewRenderer` + the `hostEntityId` threading
remain in place, ready for the panel-driven wiring once the placement is ruled. tsc clean; Vitest 5/5;
`getCsrfToken` refactor keeps the WC60 SSR path green (full Vitest **533/1**). libs **1.0.24 → 1.0.25**.

### STOP — reviewer RULES on the Preview-button placement (recommend: panel-driven) before P1b completes
live + P1c films + P1d gates.

---

## P1b-complete + P1c + P1d — SSR Preview button (PANEL-DRIVEN) — CHECKPOINT (GREEN) 2026-09-15

Ruling ratified: **panel-driven**. The panel owns the interaction; the card displays the inert snapshot.

### Built (P1b)
| File | What |
|---|---|
| `js/src/builder/viewPreviewStore.ts` (NEW) | The panel↔card store keyed by instance id: `runPreview` (CSRF POST → publish inert snapshot + labels, abortable), `clearPreview` (reset + abort), `subscribePreview`. |
| `js/src/builder/MosaicViewPreview.tsx` (rewritten) | The CARD **display**: subscribes to the store, renders the inert snapshot + chrome/labels (or the summary), shimmer while loading, and fires `clearPreview` on ANY of the four config fields changing. |
| `js/src/builder/fields/MosaicViewsArgumentsField.tsx` | `ViewPreviewButton` at the top of the panel — "Preview in canvas" runs the preview into the store; a "Clear preview" appears with a snapshot; disabled with no view. Host context (`hostEntityId`) threaded from `toConfig` → field chain → panel; both surfaces. |
| adapter + index.tsx + FE dialog | `toConfig` gained `hostEntityId`; `buildViewPreviewRenderer` renders the display-only card; both surfaces pass the host context. |

### Vitest — RED → GREEN (panel wiring)
```
viewPreviewStore: runPreview CSRF-POSTs + publishes snapshot+labels · clearPreview resets+aborts · newer run aborts prior
MosaicViewPreview card: summary by default · renders snapshot+labels from store · config change clears (placeholder)
ViewPreviewButton (panel): "Preview in canvas" runs it · disabled with no view · "Clear preview" resets
9/9 · full Vitest 537/1 (pre-existing B-101)
```

### Films (P1c) — e2e `cp-ve3-p1-preview.spec.ts`, 4/4
- **admin preview**: panel Preview → the card shows the REAL inert filtered rows (Berry subtree: Blueberry,
  Wild Straw; Navel filtered out) + "Preview — static snapshot" chrome.
- **inertness (F-103, both directions)**: the snapshot wrapper is `pointer-events:none` (computed); a row-link
  click inside it navigates NOWHERE (stays on `/node/982/edit`); the SAME node's PUBLIC page is fully LIVE
  (a real navigable anchor).
- **config-change-clears**: after a preview, changing the source dropdown clears the snapshot (count → 0).
- **FE preview**: the FE dialog's panel Preview renders the inert snapshot in the FE card.

### Gates (P1d)
Vitest **537/1** · tsc clean · Kernel ViewsPreviewControllerTest **4/4** + embed regression **7/7** · phpstan
OK · phpcs 0 errors · films **4/4** · regression (wc60-spike + f106-flush) **8/8** (panel + Preview button
coexist; race green) · dist clean · libs **1.0.23 → 1.0.26**. **20-file ship #39 set** on `d915ee7` (12 M +
8 new). SHIP-39.md carries the consolidated add block.

### STOP — reviewer audits P1, then P2 (exposed filters + pager depth).
