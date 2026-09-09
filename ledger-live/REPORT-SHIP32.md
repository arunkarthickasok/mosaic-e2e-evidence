# SHIP #32 BUILD — progress report (machinery-reuse wave)

Parent: ship #31 = `8124d3e` (== origin). Read-only git, nothing staged. All laws active.

## STATUS SUMMARY (honest)
| Item | State |
|------|-------|
| **Z1 F-094 canvas scroll parity** | ✅ COMPLETE (root named, fixed, real-pointer journey both hosts, W18 before+after) |
| **Z2 Preview-toggle removal** | ✅ COMPLETE (client removed + files deleted; server route ledgered; tests retargeted) |
| **Z3 Stage 5 template round-trip** | ✅ Kernel round-trip COMPLETE (invariant locked). Journey + MOSAIC.md docs: pending |
| **Z4 F-083 carousel** | ⏸ WITNESSED (real prop shape quoted below). Full redesign = large build, ledgered |
| **Z5 F-084 search** | ⏸ NOT STARTED (ledgered) |

The wave is stopped after Z1–Z3 + the Z4 witness rather than producing superficial
carousel/search work: F-083 alone is a schema-migration chain step + field-type engine +
discriminator-pin RED-proof + sync generalization + derivation matrix + RED→GREEN
Vitest/Kernel/journeys both surfaces — the scale of the whole Tabs Stage 3/4 redesign. It is
recorded here so a continuation starts from the witness, not scratch.

---

## Z1 — F-094 CANVAS SCROLL PARITY (walk-catch #48). COMPLETE.
- **Witnessed both chains live** (tall 2965px layout). ADMIN: no canvas scroller — the only
  scroll surface was the left `_BlocksPlugin_` sidebar; `_PuckCanvas-root` was `overflow:hidden`
  (h=833) so the 2965px content was clipped + unreachable. FE (known-good): `_PuckCanvas-root`
  keeps `overflow-y:auto` and scrolls (h=653, sh=1824).
- **ROOT NAMED:** `css/builder.css` `.mosaic-puck-wrapper [class*="PuckCanvas"] { overflow:hidden
  !important }` matched `_PuckCanvas-root` on admin (added to avoid a "second scroll surface"),
  killing the scroll the FE has.
- **FIX (parity):** scope the hidden to `:not([class*="PuckCanvas-root"])`, and give
  `[class*="PuckCanvas-root"]` `overflow-y:auto; min-height:0; overscroll-behavior:contain` —
  exactly the FE chain. After: admin gains a scrollable `_PuckCanvas-root` (h=981, sh=1885).
- **RED→GREEN real-pointer journey both hosts:** real `mouse.wheel` over the canvas centre moves
  `scrollTop` 0→900 on admin AND FE (`f094-scroll-journey.spec.ts`). W18 (@2b-geometry +
  fe-sidebar-scroll) green BEFORE and AFTER — no scar re-triggered. Frames: `ship32-scroll/`.

## Z2 — PREVIEW-TOGGLE REMOVAL (Arun-ratified). COMPLETE.
- **Consumer grep first:** `MosaicPreview` used only by `BuilderApp` (+ its Vitest);
  `/mosaic/render-preview` → `RenderPreviewController` called only by `MosaicPreview` (+
  `Sprint09SmokeTest` asserting existence). NO device_preview / SSR / parity consumer
  (`mosaic/device_preview` is a separate published-page library).
- **Removed (client):** the Edit/Preview mode-tab tablist + the `mode` state + the MosaicPreview
  canvas-swap branch in `BuilderApp.tsx`; deleted `MosaicPreview.tsx` + `MosaicPreview.test.tsx`.
  Breakpoint buttons + the breakpoint banner now always run their edit-mode behaviour.
- **Server-side LEFT + ledgered:** `/mosaic/render-preview` route + `RenderPreviewController` +
  `Sprint09SmokeTest` remain (harmless when unused; retiring them touches routing + the smoke
  test) — retirement is a ledgered follow-up, not this wave.
- **Journeys retargeted (oracle-change records):** `breakpoints.spec.ts` — B-032 (Preview-unsaved
  notice) + B-033 (Preview re-fetch) REMOVED with an inline oracle-change record; the B-031/B-028
  breakpoint-EDITING cells are unchanged. Follow-up ledger: the unused `S.tabPreview` selector +
  the `uat-100 B-006` / `uat-phase0 S09-002` cells (broad UAT suites, gitignored, not in the gate).
- **Verified live:** builder shows `{modeTabs:0, previewTab:0, editTab:0, canvasTabs:1,
  bpButtons:4, canvasScroller:1}` — no tabs, canvas still renders + scrolls. Vitest 482/1-preexisting
  (−10 = the deleted MosaicPreview tests). Frame: `ship32-scroll/03-builder-no-preview-tab.png`.

## Z3 — STAGE 5 TEMPLATE v5 ROUND-TRIP. Kernel invariant locked (journey + docs pending).
- **F-079 confirmed:** `layout_json` is an opaque blob at every hop (save stores verbatim; apply
  reads it back). The XS GREEN guard F-079 flagged is now built.
- **`MosaicTemplateRoundTripTest`** (1 test / 13 assertions): a rich v5 Tabs layout — 2 repeatable
  `sets`, per-set `bodyFormat` (full_html/basic_html), an embedded `<drupal-media>`, AND a `mobile`
  breakpoint variant — round-trips through `mosaic_template` storage **byte-for-byte**; the decode
  keeps both sets, the bodyFormat, the media, and the mobile variant (root ∈ its nodes); the
  reloaded JSON still passes structural validation. (The F-060 richtext write-guard is the
  author-format check the controller runs at save time — covered by `MosaicTextFormatGuardTest`,
  orchestrated with real formats there; the Kernel env has no filter formats, so the round-trip
  test asserts the structural schema.)
- PENDING: a save-as-template → apply → render full-lifecycle journey + MOSAIC.md authoring/dev docs.

## Z4 — F-083 CAROUSEL. WITNESS (mandatory first step). Build ledgered.
- **REAL stored prop shape (node 330), quoted:**
  `{"slide_1":"<p>Slide 1 UAT</p>","slide_2":"<p>Slide 2 UAT</p>","slide_3":"<p>Slide 3 UAT</p>",
  "loop":true,"auto_advance":false,"interval":5000}`
- So slides are **individual `slide_N` richtext-HTML props** (NOT image/caption/link — "per its
  actual props" resolved by witnessing), plus config `loop`/`auto_advance`/`interval`. This is the
  pre-Stage-3 Tabs pattern (`panel_N` before `sets`). The carousel `.mosaic.yml` has **no
  `field_types`** block (unlike Tabs `sets`), so the slides currently degrade to labelled-text.
- **Consequences for the build (ledger):**
  1. The stored shape MUST change (`slide_1..N` → a repeatable `slides` array) → a PROPER migration
     chain step (v5→v6), never a side path — witnessed as unavoidable.
  2. `.mosaic.yml` gains `field_types: slides: {type: repeatable, summary, item_label,
     default_item, fields: {body: richtext, bodyFormat, …}}` mirroring Tabs `sets`.
  3. Adapter consumes `slides` as a Puck array field; **discriminator pin** (slide rows must NEVER
     serialize as `{type,props}`) needs a dedicated guard cell red-proven vs a synthetic violation.
  4. `getItemSummary` (caption/'Slide N'), `defaultItemProps`, Stage-0 DSD preview + #30
     content-gated placeholder verified for carousel.
  5. Panel↔canvas active-slide sync — generalize `tabsPanelSync`, but FIRST witness its selectors
     against the carousel's REAL DOM (the walk-47 lesson: fabricated-test-DOM green lied).
  6. Media via the bridge; derivation {0..many slides, reorder, remove-to-empty placeholder, media
     insert, empty caption} × surfaces × breakpoint trees × templates × geometry.
- STATUS: **witnessed, NOT built** — F-083 remains OPEN.

## Z5 — F-084 SEARCH-UX. NOT STARTED (ledgered). Same machinery-reuse pattern; witness live_search
  props first, then structured labelled field_types.

## Gates (this wave's changes)
Vitest 482/1-preexisting-B101 · FULL Kernel+Unit (new MosaicTemplateRoundTripTest +1; render-preview
controller + Sprint09 smoke intact) · phpcs 0/0 on the new test · builder+FE dist rebuilt (Z1 CSS +
Z2 JS). Evidence album `ship32-scroll/` pushed.
