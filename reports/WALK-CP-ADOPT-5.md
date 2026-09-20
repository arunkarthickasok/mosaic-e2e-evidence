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
   Drop a **Columns**, click it, tick **Bind Column 1 to data**. A **Data binding**
   panel opens: pick the **View**, pick the **display by its name** (never a machine
   name), pick **Card** as the row component. Under "Fill the row from View fields"
   you **choose which View field fills the Card title** — a dropdown of the View's
   fields that has already guessed "Title", so you can leave it. The column fills
   with **one Card per row**, each showing the row's title as **clean text** (not
   `<a href…>` markup), and a line under the zone reads **"3 of 4 · J8 Articles"**.
   If the display you picked has **no fields**, the panel says *"This display
   exposes no fields; choose a display with fields or add fields to the View."*
   *Pass:* the cards appear with readable titles; the line matches the View; you
   can save the node from the normal **Save** button and the page shows the cards.

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

5. **A child inside the teaser shows on the canvas — not a spinner (WC#79/#80).**
   This is what a child placed inside an adopted (library) slot must do — on the
   canvas, after a reload, and on the page:
   - **Plain content (WC#79).** In the teaser's content slot, drop **Plain content**
     and type a sentence in the rail. The sentence appears **inside the teaser on the
     canvas within a second** — NOT a spinning "⏳ Plain content" that never resolves.
     Reload the edit form: still there. This also holds for any child the canvas has
     to render from the server (an **HTML** block, an **Image**) and for a plain
     **Heading** (which draws instantly).
   - **A View into the teaser (WC#80).** Click the teaser, open **Data binding**, and
     **Bind Content to data**: pick the View, the display by its name, **Card** as the
     row component, map **Title**. The teaser fills with **one Card per row on the
     canvas** — the cards look like **Olivero's** text (the library owns the look) —
     and a line under them reads e.g. **"3 of 4 · CPVE1 recent articles"**. No
     "Requires at least 1 item" warning on a bound slot.
   *Pass:* the child's content is visible inside the teaser on the canvas (never a
   stuck spinner), survives a reload, and matches the page.

6. **Save and look at the page.**
   Save, then view the published page.
   *Pass:* the cards show, the teaser shows Olivero's own markup, the plain content
   and the bound cards look like Olivero. The owned parts of the page are unchanged
   to the byte.

## Known reds (not walk failures)
- One Vitest cell (boolean→checkbox, B-101), one tsc line in the shadow-DOM code,
  three phpstan lines in MosaicRenderer — all pre-existing drift, tracked separately.
