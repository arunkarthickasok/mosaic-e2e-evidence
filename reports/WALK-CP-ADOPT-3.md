# WALK — CP-ADOPT-3 (Slots → drop zones with child rules) — Arun eye-test

**What changed:** container slots are now real drop zones with child rules — a slot can require a minimum
number of children, show empty-state guidance, and restrict which components may drop in.
**Why:** authors dropping into a Columns/Tabs/any-container zone had no guardrails — an empty required column
saved silently, and any component could land anywhere.
**What proves it:** on a shipped component (Columns), `column_1` now carries `min = 1`; the builder shows a
live "requires at least 1" banner + empty-state text until you drop something in.
**Claim under test:** a container zone enforces its child rules, visibly, in the builder — and clears the
signal the moment the rule is satisfied.

Prereq: on the dev site, logged in as an admin who may build Mosaic layouts. (All screens below are filmed in
`ledger-live/e2e-evidence/cp-adopt-3/`.)

---

## Step 1 — see the below-min banner on an empty required column
1. Open the builder for **node 987** (`/node/987/edit`) — a Columns component whose **column 1 is empty**.
2. Look at column 1.
3. **Expected:** a red banner **"Requires at least 1 item — 0/1"** sits inside the zone, above a dashed empty
   drop area, with the italic guidance **"Drop a component here — column 1 needs at least one."**
   (Filmed: `j1-columns-below-min-banner.png`, `j2-below-min-banner.png`, `j3-empty-display.png`.)
   **STOP.**

## Step 2 — drop a component into column 1; the banner clears
1. From the palette, **drag any component into column 1** and release.
2. Watch the banner and the empty-state text.
3. **Expected:** the moment column 1 has a child, the "Requires at least 1" banner and the empty-state text
   **disappear** — the rule is satisfied. (The satisfied state is filmed on a filled column:
   `j4-filled-no-banner.png` — column 1 with content, no banner.) **STOP.**

## Step 3 — the two columns sit side by side, non-overlapping
1. With the Columns component selected, look at the two column drop zones.
2. **Expected:** column 1 and column 2 are laid out **side by side and do not overlap** — column 1 ends before
   column 2 begins. (Filmed geometry: `geometry.json` — col1 x 415–551, col2 x 567; `j1` shows the layout.)
   **STOP.**

---

### If all three hold: CP-ADOPT-3 is walk-green. Container slots enforce their child rules visibly in the
### builder — a required zone shows a live banner + guidance until it's satisfied, and the zones lay out
### cleanly. (Drop-refusal by `allow`/`disallow` and the FE-dialog parity are machine-proven in
### `SlotEnforcement.test.tsx` — same adapter, both surfaces — see REPORT-CP-ADOPT-3 §P1.)
