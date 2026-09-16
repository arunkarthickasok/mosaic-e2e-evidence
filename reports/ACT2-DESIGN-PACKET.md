# ACT 2 — DESIGN-INPUT PACKET for Arun (A2-0c)

Opener for the ACT 2 VISUAL CAMPAIGN. This packet is **inventory + direction-setting input only** — no
taste decisions are made here. It gives you (a) the baseline album reference, (b) the ten surfaces a daily
author sees most, frequency-ranked with frame ids, so your screenshot → design-AI pass targets what matters,
and (c) the candidates already waiting for your taste ruling. The reviewer runs the REVIEWER-RESEARCH scan
(Webflow / Framer / Canva / Builder.io builder-UX benchmarks) before any design ruling.

## A. Baseline album
`ledger-live/e2e-evidence/act2-baseline/` — see its `INDEX.md` for the full surface inventory (one line per
frame naming what an author sees), at desktop + tablet widths. NB: the live Puck builder is unstable under
headless capture (it can close mid-screenshot — witnessed WC61), so the album is best driven by **your own
screenshots** of a running builder; the INDEX is the shot list to follow.

## B. The ten surfaces a daily author sees most (frequency-ranked)
Target your screenshot → design-AI pass here first — these are the minutes-per-day surfaces.

| # | Surface | Frame id (shot list) | Why it ranks |
|---|---|---|---|
| 1 | **Canvas** (the WYSIWYG editing area) | `01-admin-canvas` | Where all editing happens; every action passes through it. |
| 2 | **Settings panel** (right rail, per-component fields) | `03-admin-panel` | Opened on every component select; the field widgets live here. |
| 3 | **Component palette** (drag source) | `02-admin-palette` | Every "add a component" starts here. |
| 4 | **Breakpoint bar** (wide / tablet / mobile) | `04-breakpoint-bar` | Toggled constantly for responsive work; hosts the override affordance. |
| 5 | **Body / rich-text inline edit** (CKE5 expand modal, F-066) | `05-inline-edit-dialog` | The single most-used field; opened for every text block. |
| 6 | **Node-form Save / Preview controls** | `06-nodeform-controls` | Ends every editing session. |
| 7 | **Field-type widgets** (autocomplete, debounced inputs, tabs/slides rows, argument rows) | `10-field-widgets-*` | The texture of daily editing; small frictions compound. |
| 8 | **Data-source section** (binding a component to a View/Paragraphs) | `07-datasource-section` | The power-user surface; six argument sources + display picker. |
| 9 | **FE builder dialog** (front-end editing) | `08-fe-dialog` | The alternate authoring entry; chrome + panel + save/close. |
| 10 | **Media / image picker** (F-037 state) | `09-media-picker` | Opened for every image; a known rough edge. |

## C. Candidates awaiting your taste ruling
Recorded through the Views act + walk-catches; each needs a design direction before build.
- **Puck actionBar "Preview" action** (spike) — a preview control in the component's selection toolbar
  instead of / in addition to the panel button. Unwitnessed Puck API; a spike, not a fix. (ACT-2 candidate
  filed at P1b.)
- **FE chrome polish scope** — the `mosaic/fe_chrome` scoped Claro styling for the front-end dialog: how far
  to take it (Y3). Where should the FE surface match admin, and where diverge?
- **F-099** — (open UI item) — ruling on scope/priority.
- **F-037 media picker** — the media-library picker state in a Mosaic image field; the daily rough edge at
  surface #10. Adopt Claro-native, or a Mosaic-styled picker?
- **page_field source polish** — partially addressed in A2-0b (the mosaic_layout field is now excluded from
  the "field on this page" list); any further trimming of offered fields is a taste call.

## D. What shipped alongside this packet (A2-0b clear-defect polish — no taste needed)
- **page_field exclusion** — the mosaic_layout field (and `map`/`password` types) no longer appear as a
  "field on this page" argument source. (Kernel-tested; witnessed live on node/page.)
- **argument-label fallback** — an argument with no admin label now shows a **humanized** title
  ("Term node tid depth") instead of the raw handler id ("term_node_tid_depth"). (Kernel RED→GREEN.)

Still open in A2-0b (honest checkpoint — need baseline-album frames to witness the exact surface before a
correct fix, per the witness-first law): **breakpoint-override panel machine names → human labels** and
**carousel/tabs panel render-count ≤2 proof**. See `reports/REPORT-ACT2.md`.
