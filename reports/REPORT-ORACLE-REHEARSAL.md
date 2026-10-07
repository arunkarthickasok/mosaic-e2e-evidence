# CP-ADOPT-9R Oracle rehearsal — PART C (2026-10-07)

**Status: INCOMPLETE** (per the TIGHT GATE LAW) — **missing: headed journey films for W0–W9 / A–J, and the
«ext» table.** What IS done: harness feasibility established, the dev rehearsal environment set up
(sanctioned), the render path exercised on dev, and the **first acceptance finding (A1) diagnosed +
classified + resolved library-side**. Ship #48 `6f859a8` at HEAD; mosaic git READ-ONLY, clean, nothing staged.

## Feasibility (revises the prior "not runnable" note)
The Playwright e2e harness **runs here headless** and produces films: `js/e2e/*.spec.ts` ran (access.spec 5/6,
videos/traces emitted). So **headless** journeys with screenshot/video films ARE producible; a **headed**
(visible-window) run is not available in this non-interactive environment. Authoring the full W0–W9 + A–J
journey suite (deterministic canvas clicks; the WC#101 drag study governs where drags are allowed) across the
reference library is multi-session; it is not completed here.

## Reference-library table (dev render path exercised via drush; films pending)
| Step | Asserted condition | Result | Evidence |
|---|---|---|---|
| Grade | all 7 ref components grade READY | **PASS** | Kernel `ReferenceLibraryTest` (100% Ready) |
| Zero-untitled | every prop row titled across ref + «ext» | **PASS** | Kernel `ReferenceLibraryTest` |
| Rail=form order | manifest order == schema order | **PASS** | Kernel `ReferenceLibraryTest` |
| WC#108 save | public:// media saves + renders | **PASS** | Functional `InlineImageSaveTest` |
| WC#106 menu/tabs | 3 pages 200 + tabs wired + reset | **PASS** | Functional `AdminMenuTabsTest` |
| **Render (W-render)** | **a ref_card node renders on dev** | **FAIL → finding A1** | dev node (HTTP 500), diagnosed below |
| W0–W9 journeys (headed films) | per-step builder authoring | **NOT RUN** | multi-session journey authoring + headed films |
| A–J (ref_card/accordion/canvas/shadow/plain/legacy) | lifecycle per component | **NOT RUN** | same |

## «ext» table
**NOT RUN** — the external «ext» library is your team's library; it is not available to this environment
(cannot install what I do not have). This table is yours to run with the helper enabled; the reference-library
run is its baseline.

## Finding A1 — adopted render-fail from a `mosaic_*` library name (LIBRARY-SIDE)
**Symptom:** a `ref_card` (or `ref_plain`) node renders **HTTP 500** — SDC: *"[mosaic_reference_library:
ref_card/heading] The property heading is required."* — though the layout sets `heading`.
**Mechanism (diagnosed):** `MosaicComponentAlias::providerIsOwned('mosaic_reference_library')` returns **TRUE**
— any `mosaic` / `mosaic_*` provider is read as an OWNED Mosaic library. So the reference library takes the
OWNED path: its component ids stay **bare** (`ref_card`, `machineName=NULL`) instead of qualified
(`mosaic_reference_library:ref_card`), and the `#component` id handed to SDC cannot bind props → the SDC sees
no `heading` → required-prop render error. `adopt_fixture` (correctly `providerIsOwned=false`) renders fine.
Isolation: raw `#component => 'mosaic_reference_library:ref_plain'` + `#props` renders OK; bare `'ref_plain'`
does not.
**Classification: LIBRARY-SIDE.** A real adopted library is never named `mosaic_*`; the reference FIXTURE was
mis-named. **Resolution:** (a) guide line added — LIBRARY-AUTHOR-GUIDE.md §0 "Name your module anything except
`mosaic` / `mosaic_*`"; (b) **the RIDER:** rename `tests/modules/mosaic_reference_library` → a non-`mosaic_*`
name (e.g. `acme_cards`), update `ReferenceLibraryTest` provider filter + the guide refs, re-sync. This rider
is NOT applied here: renaming the dir would orphan the **dev-enabled** module (I may not uninstall it), and a
rider ships green only with the full TIGHT GATE incl. headed films — not producible here → pushed INCOMPLETE.

## Dev-state ledger (sanctioned writes; restored)
- **Before:** `mosaic_reference_library` module **not enabled**; no library entity; no oracle nodes.
- **During (sanctioned):** enabled the module (its install-sync created the library entity, status ON, 7
  components); created one test node (`ref_card`) → it 500s (finding A1) → **deleted**.
- **After / restored:** 0 oracle test nodes remain; no Manage-authoring overrides saved; no library toggle
  manually flipped. The module stays **enabled** (charter: "never uninstall anything") — harmless at rest, no
  production node references it; it is correctly disabled/renamed when the A1 rename rider lands.
- **No M1 test nodes left yet** — a rendering adopted-library node is only possible after the A1 rename;
  recorded as the first M1-prep step.

## TIGHT GATE LAW status for this push
Ledger/doc push (PART A + B + the A1 finding + guide line). No Mosaic code changed → no rider/ship-candidate,
so the full suite gate is not re-triggered (ship #48's gate stands). The rehearsal itself is **INCOMPLETE**:
headed films + W0–W9/A–J journeys + the «ext» table pending; first finding (A1) diagnosed + library-side
resolution landed.
