# WALK-CP-ADOPT-7 — the adopt-any-SDC composition walk (Arun's hands)

> **Story.** "As a site builder I turn an external SDC library ON, and Mosaic lets me place its
> components, edit their content (rich text or a real Mosaic component), compose them (patterns, accordion
> items, tabs), keep the library's previews out of my saved content, and everything I build renders on the
> page — with the library's own look once its theme is installed."
>
> **One STOP per step** — finish a step, record PASS or a red with its class, then move on. `[your hands]`
> marks a config action; the «ext» helper module is already ON (it now ships the "Card row" pattern), so no
> enabling is needed. The library is «ext» throughout; each step gives the **expected** value. Reds carry a
> class: **library-schema** = advice for «ext»'s authors · **brand-layer** = install the library theme ·
> **accepted** = a known harness/limitation.

## Setup (already done)
- «ext» (the external SDC library) + `mosaic_adopt_ext` helper: **enabled**. 63 SDCs discovered.
- A scratch Article to author on. Never save Arun's real content.

## A — Library appears + grades
Go to **Component libraries**. Confirm «ext» is listed and read each component's grade
(Ready / Attention / Blocked). **Expected:** «ext» present; typeless props → Attention (a note, not a
crash); no Blocked from Mosaic itself. **STOP** — record A.

## B — Place owned + adopted + the "example" badge (regression + §3e/WC#97)
On the scratch node, drag an owned **Heading**, then an «ext» **Card**, onto the canvas. **Expected:**
both render live; the owned panel is unchanged; the Card shows the library's chrome and its **example
image with a small "example" corner badge** (tooltip "Preview only — set a value to publish"). **STOP** —
record B.

## C — Card content: rich-text fields + component FILL "+ Add image" (WC#104)
Select the «ext» Card. **Expected:** the panel shows its content fields — roughly **7** rows
(Preheading / Heading / Subheading / Description / Content / Media / Media accent), the HTML ones as
**rich-text (CKE5)** fields, each with a primary **"+ Add image"** (media/picture props) or **"+ Add plain
content"**. On **Media**, click **"+ Add image"** → the Mosaic **media picker** opens → choose an image.
**Expected:** the row becomes **"Filled by Image — Edit · Remove"**; the canvas shows the image **inside
the library's card** (the "example" badge is gone). **Save**; view the page. **Expected:** the page shows
the chosen image in the card. Re-open, click **Remove**. **Expected:** the rich-text editor returns (fill
and text are mutually exclusive). **STOP** — record C.

## D — The "Card row" PATTERN + per-column "+ Add card" (PART 3)
In the palette, find the **"Patterns"** group under «ext». Click **"Card row"**. **Expected:** three «ext»
Cards render **in a row** in the library's look (owned Columns wrapper, one Card per column). Select
**column 1**. **Expected:** its rail shows **"+ Add card"** (the per-instance slot rule — owned Columns
have no repeater of their own). Click **"+ Add card"**. **Expected:** a **fourth** card appears in that
column. **Save**; view the page. **Expected:** the page shows four cards in the row. **STOP** — record D.

## E — Accordion items via the rail repeater (§3b)
Place an «ext» **Accordion**; select it. **Expected:** an **Items** list with **"+ Add accordionitem"** and
"Requires at least 1 item — 0/1". Click **+ Add ×2**; type a heading/body in each. **Expected:** two rows;
the canvas renders two live accordion items; expand/collapse works. Focus row 2, press **↑**. **Expected:**
the canvas order follows. **Remove** down to one. **Expected:** at the floor Remove is disabled + the banner
shows. **STOP** — record E.

## F — Tabs (owned) — the same authoring shape (regression)
Place the owned **Tabs**; add and reorder two tab sets. **Expected:** the same inline-list feel; the saved
page renders byte-identical to before (the owned oracles are unchanged). **STOP** — record F.

## G — Item auto-wrap via "+ Add" / drag (§3c)
In a Columns slot, open **+ Add** and pick an **Accordion item** (an item, not a container). **Expected:**
it is **auto-wrapped in a new Accordion** with a toast "Placed inside a new …" — never a bare item. Then
drag an accordion item onto the empty canvas five times. **Expected:** each landing auto-wraps + toasts;
some synthetic drags may not register (a harness trait — the picker path is the deterministic proof). The
palette marks item cards **"needs {Container}"**. **STOP** — record G.

## H — Refused wrong-zone drop, with the reason (§3c)
Pick an item where several containers or none apply, and hand-edit a bare orphan at the page root, then
Save. **Expected:** the pick is **refused with an author-grade reason** ("… must be placed inside …"), and
the orphan **Save is rejected** with the same message (the H5 guard). **STOP** — record H.

## I — Global assets / brand layer (§3d, C4)
Check an «ext» component's on-canvas styling. **Expected:** structure + shape correct via the shadow-DOM
CSS; **full brand fidelity (tokens/font/icons) requires the library's example THEME** — install that theme
(or add its asset layer to the helper's `base` library) for 100% page==canvas parity. A **brand-layer**
note, not a Mosaic bug. **STOP** — record I.

## J — Save → view → round-trip → accept
Save the node; view the page; re-open the builder. **Expected:** everything round-trips — the filled Card
image, the Card-row pattern (four cards), accordion items, tabs; no orphan; owned components byte-identical.
Tally every step PASS, or a red with its class. This is the acceptance gate before tagging **1.0.0**.
**STOP.**
