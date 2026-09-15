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
