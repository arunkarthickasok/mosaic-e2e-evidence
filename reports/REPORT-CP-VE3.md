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

---

## P2 — exposed filters + pager depth — CHECKPOINT (Kernel + a real fixed finding) 2026-09-15

Verification phase: Views owns the mechanics; P2 proves the embed never breaks them. The derivable truths
are Kernel-proven, and probing surfaced + fixed a REAL caching bug.

### RED → GREEN finding — exposed-filter / pager render-cache staleness
Witnessed: rendering an exposed-filter embed with `?type=cpve2_host` returned the **stale unfiltered**
render — but rendering the filtered case FIRST (fresh cache) narrowed correctly (`hasPlain0=N hasHost=Y`).
Root cause: the per-component render cache CID did not vary by `url.query_args`, so a submitted exposed
filter (or a `?page`) served a cached earlier render — the same class as the url_param cache bug (BUG2),
for the view's OWN query state. **Fix:** `MosaicViewComponent::getCacheMetadata` now adds the
`url.query_args` context when the display has an exposed filter or a full/mini pager (a lightweight config
inspection — `displayUsesQuery`, no view execution). Regression: cacheability + embed **8/8 (161 assertions)**.

### Kernel — derivable truth (`ViewsEmbedExposedPagerTest`, 3/3, 68 assertions)
- **exposed form renders + filters** — the `<form` + the Type control render in the embed; both bundles'
  rows show with no input; `?type=cpve2_host` narrows the ROWS to Host (asserted on the numbered row title
  `CPVE2 Plain 0`, since the "CPVE2 Plain" select OPTION always persists).
- **pager structure** — full + mini: `items_per_page=2` limits page 0 to 2 `views-row`s and the pager
  markup renders inside the embed.
- **hide_when_empty honors an exposed input** — a user-filtered-to-empty view keeps its form (NOT hidden,
  so the author can un-filter); a genuinely-empty view (contextual arg matching nothing, no input) IS hidden.

### Honest checkpoint — the browser-truth cells are the next pass
Page NAVIGATION (`?page=N` advance), AJAX exposed-form filtering, dual-embed pager independence + the
exposed-form double-instance quirk, and one-embed + the view's own page display are BROWSER-TRUTH — a
sub-render Kernel request does not exercise the pager's page-param detection, and dual-instance is a live
DOM concern. They require live dev-site content (exposed/pager views + single & dual host embeds) and are
scoped as the next focused P2 pass. The Kernel proves the embed preserves the mechanics + the cache fix
makes a submitted filter/page actually vary the render — the derivable core.

### Gates (P2 so far)
Kernel exposed/pager **3/3 (68)** · regression cacheability + embed **8/8 (161)** · phpstan OK · phpcs 0
errors. No JS/dist change (PHP-only). Ship #39 set +2 (`MosaicViewComponent.php` gains the cache fix;
`ViewsEmbedExposedPagerTest.php` NEW).

### STOP — reviewer audits the P2 Kernel + cache finding; the browser-truth e2e films are the next pass.

---

## P3 — data-source sibling parity (backend) — CHECKPOINT (GREEN) 2026-09-15

`ViewsResultDataSource` already resolved per-slot argument SOURCES via the shared `ViewsArgumentResolver`
(it was wired in R-V6). P3 verifies that parity with derived cells AND applies the P2 finding's lesson to
the data-source cache path.

### The P2 lesson on the data-source path (RED → GREEN)
The data-source `getCacheMetadata` added the config tag + the argument-source cacheability but NOT
`url.query_args` — so a `views_result` binding on an EXPOSED or PAGED view served a stale result to any
component folding its cacheability (the same staleness P2 fixed for the embed). **Fix:** it now adds
`url.query_args` when the display reads `?query`. **DRY:** the detection moved to a shared pure static
`MosaicViewRenderer::displayUsesQuery(array $displays, string $displayId)` — the embed component and the
data source both call it (the component's private copy is gone).

### Kernel — derived cells (`ViewsResultDataSourceParityTest`, 4/4, 79 assertions)
- **fixed** source filters the result to the target node (`ids` transform).
- **url_param** source filters the result by the request query.
- **current_user** source resolves against the acting account (`count` transform → positive int).
- **cacheability**: an exposed-filter binding's metadata contains `url.query_args`; a no-query display
  (pager overridden to `none`, no exposed filter) does NOT over-vary.

### Gates (P3)
Kernel data-source parity **4/4 (79)** · component regression (shared helper) **3/3** · phpstan OK · phpcs
0 errors. No JS/dist change (PHP-only).

### Honest checkpoint — two pieces remain, scoped for the next pass
1. **P2-B browser-truth films** — `?page=N` advance (rows-change-by-id, full + mini), AJAX exposed-form
   filtering, dual-embed pager independence + the exposed-form double-instance verdict (INDEPENDENT vs
   QUIRK-WITNESSED, with a MOSAIC.md author note), one-embed + own-page coexist, and the exposed-filter
   cache fix proven live (filter → unfiltered → filtered, no stale). These need live dev-site content
   (exposed/pager views + single & dual host embeds).
2. **P3 PANEL LABEL LAW UI** — the data-source's `ViewsDataSourceField.tsx` panel does not yet expose the
   per-slot argument-source picker (the backend supports `argument_sources`; the UI is JSON-only today).
   Adding the picker + the PANEL LABEL LAW strings mirrors the component's `MosaicViewsArgumentsPanel` — a
   JS build.

The BACKEND of P3 (six sources via the shared resolver + the cacheability fix) is the substantive, tested
core; the two remaining pieces are a browser-content pass and a JS-panel pass.

### STOP — reviewer audits P3 backend + the shared cache helper; the browser films + data-source panel UI are next.

---

## P3-UI — data-source argument-source picker — CHECKPOINT (GREEN) 2026-09-15

The `views_result` data-source panel now configures contextual filters exactly like the embed — by REUSING
the mosaic_view argument panel, not re-building it.

### Built (reuse, not rebuild)
`ViewsDataSourceField.tsx` replaces the old literal-args textarea with `MosaicViewsArgumentsField` (the pure,
non-Puck argument panel), passing the data-source's `view`/`display` + `config.argument_sources` +
`onChange`. That brings, for free: the **six sources**, the **PANEL LABEL LAW** (the View-default option
shows the resolved behaviour — "View default (show all)" — never a bare "default"), and the **WC57/WC60
input contracts** (single-field entity autocomplete, debounced plain-value commits) — one implementation,
both the embed and the data source. `argument_sources` added to the config type (the backend resolved it via
the shared resolver since R-V6; the legacy `arguments` remains a backward-compatible fallback).

### Vitest (`dataSourceViewsPicker.test`, 2/2)
- renders the argument-source picker with the PANEL LABEL LAW option ("View default (show all)");
- selecting a source (current_user) writes `argument_sources` to the data-source config.
- **Oracle-change:** the 3 old `ViewsDataSourceField` literal-args-textarea cells were removed (that UI is
  gone) — the picker is covered by the new test.

### Gates
Vitest full **536 / 1** (pre-existing B-101) · tsc clean · dist builder+FE rebuilt (no debug leaks) · libs
**1.0.26 → 1.0.27**. Minor known gap: without threaded host context the page_field source's field-options are
empty in the DATA-SOURCE panel (the other five sources work; threading host context to the data-source field
is a small follow-up).

### Honest checkpoint — P2-B + P4 + P5 close the wave (next pass)
Given this session's length, the remaining closing pieces are scoped as the next pass: **P2-B** browser films
(live content — `?page=N` advance, AJAX exposed form, dual-embed independence + verdict, embed+own-page,
cache-fix-live), **P4** A3 preset doc + one e2e round-trip witness, and **P5** the full album + recipe-grade
`WALK-CP-VE3.md` + full gates (Kernel+Unit+Vitest+sentinels+phpcs) + the final SHIP-39 consolidated add block.
P0.5 → P1 → P2-Kernel → P2-finding → P3-backend → P3-UI are all landed and green.

### STOP — reviewer audits P3-UI; P2-B films + P4 doc + P5 packaging close CP-VE3.

---

## G0 — page_field host-context gap — CHECKPOINT (GREEN) 2026-09-15

The P3-UI known gap is closed: the data-source picker now ships with all SIX sources working, not a dead
page_field dropdown. Threaded host context per the P1b `hostEntityId` precedent — no hiding needed.

### Threaded end-to-end (both surfaces)
`hostEntityType`/`hostBundle` now flow adapter → `MosaicDataSourceField` → `BindingEditor` →
`ViewsDataSourceField` → `MosaicViewsArgumentsField` → `PageFieldSelect`. So the page_field source's field
list populates from the host bundle in the DATA-SOURCE panel exactly as in the component panel. (Two internal
`createElement` sites coerce `?? ''` for `exactOptionalPropertyTypes`.)

### Vitest — RED → GREEN (`dataSourceViewsPicker`, 3/3)
New cell (stateful harness): choosing the **page_field** source renders the field select and it shows the
host bundle's field (`Topic` from `/page-fields/node/article`). RED without the threading (empty dropdown),
GREEN with it. Full Vitest **537 / 1** (pre-existing B-101); MosaicDataSourceField regression clean.

### Gates
Vitest **537/1** · tsc clean · dist builder+FE rebuilt (no debug leaks) · libs **1.0.27 → 1.0.28**.

### Honest checkpoint — P2-B + P4 + P5 remain to close the wave
This session has run an extraordinary number of large charters back-to-back; the three remaining closing
pieces are a substantial package best done fresh, not at the tail:
- **P2-B** browser-truth films (live dev content: exposed/pager views + single & dual embeds) — `?page=N`
  advance, AJAX exposed form, dual-embed independence + verdict + MOSAIC.md note, embed+own-page, cache-fix-live.
- **P4** A3 preset doc + one e2e round-trip witness (configured mosaic_view → global template → insert on
  another node → config intact; zero new code).
- **P5** the album + recipe-grade `WALK-CP-VE3.md` + FULL gates (Kernel+Unit+Vitest+sentinels+phpcs) + the
  final SHIP-39 consolidated add block re-verified vs porcelain + ceremony.

**All CODE for CP-VE3 is now landed and green** (P0.5, P1a-d, P2-Kernel+cache-finding, P3-backend, P3-UI, G0).
What remains is verification films (P2-B), one doc + witness (P4), and the packaging/gates ceremony (P5).

### STOP — reviewer audits G0; P2-B films + P4 doc + P5 packaging close CP-VE3.

---

## P5 — CLOSING PACKAGE (gates + walk + album + ship block) — 2026-09-15

Ship #38 = `d915ee7` (verified `HEAD == @{u}`). Ship #39 set re-verified vs `git status --porcelain`:
**16 modified + 11 new = 27** — matches the SHIP-39.md consolidated add block exactly.

### FULL gates (raw excerpts — evidence gate)

**Kernel — mosaic_views FULL suite:**
```
=== mosaic_views FULL Kernel (all CP-VE3 backend) ===
Time: 02:02.824, Memory: 10.00 MB
OK (53 tests, 816 assertions)
```
Includes the CP-VE3 additions: `ViewsPreviewControllerTest` (4/4, 89), `ViewsEmbedExposedPagerTest` (3/3, 68),
`ViewsResultDataSourceParityTest` (4/4, 79), plus the shared-path embed-render regression (7/7, 75).

**phpcs — all 7 CP-VE3 PHP files (0 ERRORS; warnings = pre-existing line-length, tolerated):**
```
FOUND 0 ERRORS AND 8 WARNINGS AFFECTING 8 LINES     (MosaicViewRenderer.php)
FOUND 0 ERRORS AND 7 WARNINGS AFFECTING 7 LINES     (ViewsPreviewController.php)
FOUND 0 ERRORS AND 21 WARNINGS AFFECTING 21 LINES   (MosaicViewComponent.php)
FOUND 0 ERRORS AND 4 WARNINGS AFFECTING 4 LINES     (ViewsResultDataSource.php)
FOUND 0 ERRORS AND 5 WARNINGS AFFECTING 5 LINES     (ViewsPreviewControllerTest.php)
FOUND 0 ERRORS AND 9 WARNINGS AFFECTING 9 LINES     (ViewsEmbedExposedPagerTest.php)
FOUND 0 ERRORS AND 4 WARNINGS AFFECTING 4 LINES     (ViewsResultDataSourceParityTest.php)
```

**phpstan — all CP-VE3 PHP, level 6 (needs `--memory-limit=512M` for MosaicViewComponent's graph):**
```
 [OK] No errors
```

**Vitest — full (established at G0; JS unchanged since):** `537 / 1` — the 1 is the pre-existing B-101
(`MosaicPuckAdapter.test.ts` boolean→radio). tsc clean (only pre-existing `dsdShadow.ts`). dist builder+FE
rebuilt clean (no debug leaks); libs `1.0.23 → 1.0.28`.

### Walk + album (P5 deliverables)
- `reports/WALK-CP-VE3.md` — recipe-grade, every click spelled out, one STOP line each: A (SSR preview,
  panel-driven), B (debounced typing), C (data-source picker parity + G0 six live sources), D (exposed +
  pager depth — the P2-B live-content walks), E (A3 preset round-trip — the P4 walk).
- `ledger-live/e2e-evidence/cp-ve3/INDEX.md` — album index: the 2 P1c preview stills present
  (`01-admin-preview.png`, `02-fe-preview.png`) + the pending P2-B/P4 frames enumerated with their walk refs.
- `ledger-live/SHIP-39.md` — FINAL consolidated add block (27 files), gates table, exclusions, expected count.

### Honest checkpoint — P2-B films + P4 filmed-witness (the live-content ceremony)
All CP-VE3 CODE is landed and green (P0.5, P1a-d, P2-Kernel+cache-finding, P3-backend, P3-UI, G0) and the
static ship-readiness gates are FULL-green above. Two pieces are **live-content ceremony**, not code, and are
honest-checkpointed for a fresh pass rather than rushed at the tail of this very long session:

- **P2-B** — browser-truth films (D1–D6 in the walk). These need a paged, exposed VIEW that does not exist on
  the dev site yet + scratch host embeds (983 single, 984 dual). The retired `cpve2_content.php` is the
  provisioning precedent; the P2-B pass provisions `cpve3_ep` (embed + page displays, exposed Title filter,
  full pager) then films: pager `?page=N` by-id (full + mini), AJAX exposed filtering, dual-embed
  independence verdict + MOSAIC.md note, embed+own-page coexist, and the cache fix LIVE. The exposed/pager
  plumbing + cache fix are already PROVEN at the Kernel layer (`ViewsEmbedExposedPagerTest` 3/3); D1–D6 are
  the browser confirmation.
- **P4** — the A3 preset round-trip is walkable TODAY from `WALK-CP-VE3.md` §E (builder "Save as template" →
  insert on another node → config intact); the FILMED witness rides the P2-B live pass.

### STOP — reviewer audits the package (gates + walk + album + ship block); Arun walks per WALK-CP-VE3.md.
Ship #39 ceremony (the human commit of the 27-file block) closes CP-VE3 once the P2-B/P4 films land. Road
after: ACT 2 → Wave D-0+D/F → Wave G → dev push → Arun soak → tag 1.0.0 (NOT this ship).

---

## P2-B + P4 — LIVE-CONTENT PASS (provisioned + filmed) — 2026-09-15

Ship #39 code set UNCHANGED (re-verified: 16 modified + 11 new = 27; HEAD `d915ee7`). This pass is
content + films only. Provisioner `web/cpve3_content.php` (docroot scratch, NEVER staged) built view
`cpve3_ep` (exposed Type filter + AJAX; `embed_1` full pager, `embed_mini` mini pager, `page_1` at
`/cpve3-list`) + scratch hosts 983 (single), 984 (dual), 985 (mini). View sorts by nid ASC, 2 rows/page.

### D1–D6 films — raw console (all GREEN, `cpve3-live.spec.ts`, 7 passed)
```
[D1] full pager  p0=1,2  p1=3,4
[D2] mini pager  numbered-links=0  p0=1,2  p1=3,4
[D3] exposed  before=1,2  after=4,5  window-marker=alive
[D4] cache  filter1=4,5  clear=1,2  refilter=4,5
[D5] dual  e1 1,2->3,4  e2 1,2->1,2  VERDICT=INDEPENDENT
[D6] embed(after paging)=3,4  own-page(page0)=1,2
  7 passed (11.6s)
```
- **D1** full pager advances rows BY ID (`1,2`→`3,4`, no overlap). Frames `p2b-a-pager-full-p0/p1.png`.
- **D2** mini pager: `numbered-links=0` (prev/next only), advances `1,2`→`3,4`. Frames `...mini-p0/p1.png`.
- **D3** AJAX exposed filter (Type=Skill) narrows `1,2`→`4,5`; the `window.__cpve3` marker set before submit
  still reads `alive` after = **no full reload** (AJAX). Frames `p2b-b-exposed-before/after.png`.
- **D4** the cache fix LIVE: `filter 4,5 → clear 1,2 → refilter 4,5` — refilter EQUALS filter, **no stale
  serve**. Frames `p2b-e-cache-1filter/2clear/3refilter.png`. (Also Kernel-proven: `ViewsEmbedExposedPagerTest`.)
- **D5** dual embed: paging embed-1 (`1,2`→`3,4`) leaves embed-2 at `1,2` → **INDEPENDENT** under AJAX.
  Frames `p2b-c-dual-before/after.png`. **NUANCE (both true):** no-JS `curl /node/984?page=1` returns
  `3 4 3 4` — BOTH advance, because the two embeds share pager element `id:0` (one `?page` key). MOSAIC.md
  author-note drafted in `WALK-CP-VE3.md` §D (give each embed a distinct pager Element id for no-JS robustness).
- **D6** embed paged to `3,4`; the view's own page `/cpve3-list` stays at its own page-0 `1,2` → coexist
  independently. Frames `p2b-d-embed-paged.png` + `p2b-d-ownpage.png`.

### P4 — preset round-trip — raw verdict (`cpve3-preset.spec.ts` + data-layer)
Witnessed through the REAL `MosaicGlobalTemplate` config entity (what the builder's "Save as template"
writes). A genuinely-configured mosaic_view — `cpve2_termd0:embed_1` + `argument_sources:[{fixed,6,
taxonomy_term}]` + `hide_when_empty:true` — saved as template `cpve3_preset`, inserted onto fresh node 986:
```
template saved: cpve3_preset (version 1)
[P4] view_display intact: YES ({"view":"cpve2_termd0","display":"embed_1"})
[P4] argument_sources intact: YES ([{"source":"fixed","value":"6","entity_type":"taxonomy_term"}])
[P4] hide_when_empty intact: YES
[P4] VERDICT: CONFIG ROUND-TRIPS INTACT
listed: CPVE3 Preset (configured view) | layout bytes=374
[P4] node 986 renders the round-tripped cpve2_termd0:embed_1 view   (2 rows)
```
Frame `p4-preset-instance.png`. Zero new code — a witness. The interactive builder save/insert UI is
separately covered by `templates.spec.ts` + `MosaicTemplateWorkflowTest`; this pass witnesses that a
mosaic_view's Views config survives the template round-trip.

### No defects found
Per the charter (defect ⇒ STOP + report, never a silent fix): none. Every D/E walk matched its expected
render; the one nuance (D5 AJAX-vs-no-JS) is documented behaviour, not a defect. Ship #39 code set untouched.

### STOP — reviewer audits ALL frames (P1 stills + 14 new P2-B/P4 frames), Arun walks WALK-CP-VE3.md,
then the ship #39 human-commit closes CP-VE3 and the Views act.
