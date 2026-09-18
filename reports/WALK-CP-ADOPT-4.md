# WALK — CP-ADOPT-4 (the first outside component becomes usable) — Arun eye-test

**What changed:** a component from OUTSIDE Mosaic — Olivero's `teaser`, a theme-provided SDC Mosaic never
authored — can now be turned on and used in a Mosaic layout.
**Why:** the whole point of "adopt any SDC" is that authors get to place third-party components, not just
Mosaic's own twelve.
**What proves it:** enable the Olivero library, and the teaser appears in the palette and renders on the page
with Olivero's OWN markup and CSS, holding your Mosaic content in its slot.
**Claim under test:** an enabled outside library's component is authorable and renders faithfully — the library
owns its markup; Mosaic only adds its data-attributes.

Prereq: admin on the dev site. (Both screens below are filmed in `ledger-live/e2e-evidence/cp-adopt-4/`.)

---

## Step 1 — turn the Olivero library on
1. Go to **`/admin/config/mosaic/component-libraries`**.
2. Scroll to the **"Olivero (theme) — theme-bound"** section.
3. **Expected:** the library has a **"Library enabled"** checkbox (checked), and its **Teaser**
   (`olivero:teaser`) is listed with grade **Attention** — the note explains its `attributes` prop has no known
   field shape (it falls to a raw text input) — and **0 fields, 5 slots**. The page header states *"Adopted
   (non-Mosaic) libraries are off by default"* — you turned this one on.
   (Filmed: `j1-libraries-olivero-enabled.png`.) **STOP.**

## Step 2 — the Olivero teaser renders on a page, with its own styling and your content
1. Open **`/node/988`** — a page whose layout places an Olivero teaser with a heading in its content slot.
   (You place components like this in the builder; here the fixture is pre-placed.)
2. Look at the teaser.
3. **Expected:** the teaser renders with **Olivero's own `.teaser` markup and CSS** (the machine check:
   `getComputedStyle('.teaser').position === 'relative'`, which only Olivero's stylesheet sets — see
   `page-computed.json`), and **your Mosaic heading — "Adopted Olivero teaser" — sits inside the teaser's
   content slot**. Mosaic added only its `data-mosaic-instance`; it did not rewrite Olivero's markup.
   (Filmed: `j3-page-teaser-olivero-css.png`.) **STOP.**

---

### If both hold: CP-ADOPT-4 P1b is walk-green. An outside component becomes usable — enabled + graded on the
### libraries page, present in the palette (data-proven in `palette-ids.json`), and rendered faithfully with its
### own markup/CSS holding your content.
###
### Not in this walk (machine-proven / deferred — see REPORT-CP-ADOPT-4 §P1b): placing the teaser in the
### builder and its LIVE canvas render (the headless Puck canvas is unstable to film — the canvas SSR is proven
### at the Kernel level, `PaletteOpenTest::testAdoptedSsrRendersViaHybrid`); the client Tier-B SSR-attachments
### work and the adopted-with-slots-on-canvas composition are the P1b-client slice.
