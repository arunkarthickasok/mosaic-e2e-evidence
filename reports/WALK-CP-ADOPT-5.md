# WALK-CP-ADOPT-5 — the acceptance walk (plain words)

You (Arun) create the pages; walk the steps; each step says what you should see.

## The story
You build a page with Mosaic's own blocks and an Olivero teaser. The panels only
show controls that actually do something. A column can be filled from a View. The
teaser keeps its own look inside its slots. Switching to the phone size never
wipes your work.

## Steps

1. **The panels tell the truth.**
   Drop a **Card** and click it. You see Data, Breakpoint, Spacing, Style,
   Visibility. Now drop a **Tabs** and click it: you see its "Tab sets" field but
   **no Data and no Breakpoint** — Tabs has nothing to bind or to change per
   screen size. A **View** block shows **no Data**. A block with no colour tokens
   shows **no Style section** (not an empty "no tokens" message).
   *Pass:* Tabs/View lose Data; empty sections simply aren't there.

2. **Fill a column from a View.**
   Drop a **Columns**, click it, tick **Bind Column 1 to data**. You now see a
   **Data binding** panel: pick the **View**, pick the **display**, pick **Card**
   as the row component, then under "Fill the row from View fields" **choose which
   View field fills the Card title** (a dropdown of the View's fields, already
   guessing "Title"). Watch the column fill with **one Card per row**, and a line
   under it: **"3 of 4 · J8 Articles"**.
   *Pass:* the cards appear as you pick; the line matches the View.

3. **The phone size keeps everything.**
   With that bound Columns (and a teaser) on the page, switch the size to
   **Mobile** and back to **Desktop**.
   *Pass:* nothing disappears — the cards and the teaser are still there.

4. **The teaser owns its slots.**
   Drop an **Olivero teaser**. In its content slot, **Plain content** is offered
   **first**; type a sentence — it looks like **Olivero's** text, not Mosaic's.
   Drop a **Heading** in the same slot: it renders plain and its panel says the
   **styling is owned by Olivero** (no Style controls).
   *Pass:* your text takes Olivero's look; the heading shows the ownership note.
   *(The "Plain content first" picker is P1d-B-CONT; the Olivero look + ownership
   note are already proven by the SO-5 font cell + the bare-render cell.)*

5. **Save and look at the page.**
   Save, then view the published page.
   *Pass:* the cards show, the teaser shows Olivero's own markup, the plain content
   looks like Olivero. The owned parts of the page are unchanged to the byte.

## Known reds (not walk failures)
- One Vitest cell (boolean→checkbox, B-101), one tsc line in the shadow-DOM code,
  three phpstan lines in MosaicRenderer — all pre-existing drift, tracked separately.
