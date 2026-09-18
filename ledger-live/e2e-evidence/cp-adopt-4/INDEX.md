# CP-ADOPT-4 evidence album — the first outside component becomes usable (P1b)

Filmed 2026-09-18 against DDEV, real admin auth, `--project=journeys`, no sleeps. Journey
`js/e2e/journeys/cp-adopt-4.spec.ts` (gitignored `js/e2e/`; the frames are the artifact). Scratch node **988**
(a page whose layout places `olivero:teaser` with its `content` slot filled by an owned `mosaic_heading`).

| Frame | Screen | Shows |
|---|---|---|
| `j1-libraries-olivero-enabled.png` | Component Libraries admin page | the **Olivero (theme) — theme-bound** library **enabled**, with **Teaser** (`olivero:teaser`) graded **Attention** ("Prop 'attributes' … has no known field shape — falls to a raw text input", **0 fields, 5 slots**). "Adopted (non-Mosaic) libraries are off by default." |
| `j3-page-teaser-olivero-css.png` | anon page (node 988) | the adopted teaser rendered on a real page — Olivero's own `.teaser` markup + the Mosaic-authored heading inside the `content` slot |
| `palette-ids.json` | builder drupalSettings | the live palette contains **`olivero:teaser`** (data proof — the Puck palette panel is not stably screenshot-able headlessly) |
| `page-computed.json` | computed style | `.teaser` → **`position: relative`** (default is `static`; only set by `core/components.olivero--teaser`) + boundingBox 788×144 → **Olivero's stylesheet applied** |

## What the album proves
- The **Olivero teaser** — a theme-provided, NON-Mosaic component — is **enabled + graded on the libraries
  page** (j1) and **present in the live builder palette** (palette-ids.json).
- It **renders on a real page** through the hybrid core element with **Olivero's own markup + CSS**
  (j3 + page-computed.json: `position: relative`), and the author's Mosaic content sits inside its `content`
  slot. The library owns its DOM; Mosaic added only `data-mosaic-instance`.

## Machine-proven, not filmed (headless builder is unstable — cp-adopt-1 precedent)
- **Palette + governance:** `PaletteOpenTest` (4 cells) — adopted eligible unless Blocked; authorable only when
  the library is ENABLED (adopted default OFF); admin/author restricted parity.
- **The canvas Tier-B SSR render** of an adopted component: `renderSingleComponent` renders it through the
  hybrid (`PaletteOpenTest::testAdoptedSsrRendersViaHybrid`), but the **client** Tier-B injection into the Puck
  canvas + the SSR-attachments client work (R5/R10) is the P1b-client slice (checkpointed) — the headless Puck
  canvas did not render `.teaser` within 30s. The adopted-with-slots-on-canvas composition (drop a child into
  an adopted slot on the canvas) is a known Tier-B+slots gap, deferred.
