> ⛔ **CP-ADOPT-4R UPDATE (2026-09-18) — SHIP #44 BLOCKED. The slot-fill DROP step below is UNPROVEN.**
> Arun's eye-test caught WC#66–#69. Per the DROP-PROOF LAW, the "content slot is a live drop zone / fill it
> with your content" claim is **UNPROVEN** — a committed real-pointer drop could not be filmed (Puck 0.21 has
> no keyboard sensor; its new dnd-kit is not driven by Playwright's synthetic pointer — even the OWNED columns
> control never enables a zone headlessly). WC#69's *structural* cause (empty adopted slots render zero-width →
> Puck's `BUFFER=6` pointer-collision makes them undroppable) is root-caused at source + FIXED (min hittable
> box, rect `0→96` filmed) + WC#67 (labels/order) FIXED; WC#66 not reproduced; WC#68 open. The gating next step
> is **Arun's manual re-test of the min-box fix**. See `reports/REPORT-CP-ADOPT-4R.md` +
> `ledger-live/e2e-evidence/cp-adopt-4r/`.

# WALK — CP-ADOPT-4 (the first outside component becomes usable) — Arun eye-test

**What changed:** a component from OUTSIDE Mosaic — Olivero's `teaser`, a theme-provided SDC Mosaic never
authored — can now be enabled, placed on the canvas, filled with your content, and saved.
**Why:** the whole point of "adopt any SDC" is that authors place third-party components, not just Mosaic's own.
**What proves it:** enable the Olivero library, drop a teaser on the canvas, and it renders with Olivero's OWN
markup + CSS, its content slot is a live drop zone, and the saved page matches.
**Claim under test:** an enabled outside component is authorable end-to-end — it renders on the canvas, its
slots stay fillable, and the page render matches; the library owns its markup, Mosaic only adds data-attributes.

Prereq: admin on the dev site. (All three screens below are filmed in `ledger-live/e2e-evidence/cp-adopt-4/`.)

---

## Step 1 — turn the Olivero library on
1. Go to **`/admin/config/mosaic/component-libraries`** and scroll to **"Olivero (theme) — theme-bound"**.
2. **Expected:** its **"Library enabled"** checkbox is checked, and its **Teaser** (`olivero:teaser`) is listed
   with grade **Attention** (0 fields, 5 slots). The page states *"Adopted (non-Mosaic) libraries are off by
   default"* — you turned this one on. (Filmed: `j1-libraries-olivero-enabled.png`.) **STOP.**

## Step 2 — place the teaser on the canvas; it renders styled, its slot is a drop zone
1. Open **`/node/988/edit`** (or add a page and drag **Olivero → Teaser** onto the canvas).
2. Look at the teaser on the canvas.
3. **Expected:** it renders with **Olivero's own `.teaser` markup and CSS** (the machine check on the CANVAS:
   `getComputedStyle('.teaser').position === 'relative'` — see `canvas-computed.json`), and its **content slot
   is a live drop zone** holding the heading **"Adopted Olivero"** you dropped into it. Dropping another
   component into the zone re-renders it inside Olivero's own slot. (Filmed: `j2-canvas-teaser-tierb-ssr.png`.)
   **STOP.**

## Step 3 — save, and the page matches the canvas
1. Save the page and open **`/node/988`**.
2. **Expected:** the teaser renders with the **same** Olivero markup + CSS + your heading in its content slot —
   `getComputedStyle('.teaser').position === 'relative'` on the page too (`page-computed.json`), i.e. canvas ==
   page. (Filmed: `j3-page-teaser-olivero-css.png`.) **STOP.**

---

### If all three hold: CP-ADOPT-4 is walk-green — the first outside component is usable end-to-end. Enabled +
### graded on the libraries page, rendered on the canvas with its own markup/CSS, its slots fillable, and the
### page matches. The mechanism that blocked the canvas render (generic scaffold ran before Tier-B) is fixed +
### re-witnessed (`WITNESS.json`, INDEX). Remaining refinements (SSR `{html, attachments}` client dedupe +
### attachBehaviors for components with DYNAMIC attachments) are ledgered — see REPORT-CP-ADOPT-4 §P1b-client.
