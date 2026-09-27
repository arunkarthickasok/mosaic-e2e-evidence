# WALK-CP-ADOPT-7 — the adopt-any-SDC composition walk (Arun's hands)

> **Story.** "As a site builder I turn an external SDC library ON, and Mosaic lets me place its
> components, compose them (accordion items, tabs), keep the library's previews out of my saved content,
> and everything I build renders on the page — with the library's own look once its theme is installed."
>
> One **STOP** at the end. `[your hands]` marks a config action; the «ext» helper module is already ON,
> so no enabling is needed. The library is «ext» throughout. Each step gives the **expected** value.

## Setup (already done)
- «ext» (the external SDC library) + `mosaic_adopt_ext` helper: **enabled**. 63 SDCs discovered.
- A scratch Article to author on. Never save Arun's real content.

## A — Library appears + grades
Go to **Component libraries**. `[your hands]` confirm «ext» is listed and its components grade
(Ready / Attention / Blocked). **Expected:** «ext» present; typeless props → Attention (a note, not a
crash); no Blocked from Mosaic itself.

## B — Place an owned + an adopted component (regression + adopt)
On the scratch node, drag an owned **Heading** then an «ext» **Card** onto the canvas.
**Expected:** both render live; the owned panel is unchanged; the Card shows the library's chrome.

## C — Preview defaults + the "example" badge (§3e / WC#97)
Look at the placed «ext» Card. **Expected:** it shows the library's **example image** with a small
**"example"** corner badge (tooltip "Preview only — set a value to publish"). **Set** an image on the
Card. **Expected:** the badge clears. **Save**, view the page.
**Expected:** with NO image set → the saved layout has no image (the page shows the library's own empty
state, not the placeholder); with an image set → the page shows it.

## D — Accordion items via the rail repeater (§3b)
Place an «ext» **Accordion**; select it. **Expected:** the panel shows an **Items** list with
**"+ Add accordionitem"** and "Requires at least 1 item — 0/1". Click **+ Add ×2**; type a heading/body
in each. **Expected:** two rows; the canvas renders two live accordion items; expand/collapse works.
Focus row 2, press **↑** (keyboard reorder). **Expected:** the canvas order follows. **Remove** down to
one. **Expected:** at the floor the Remove is disabled + the banner shows.

## E — Tabs (owned) — the same authoring shape (regression)
Place the owned **Tabs**; add/reorder tab sets. **Expected:** the same inline-list feel; save + page
render byte-identical to before (owned oracles unchanged).

## F — Item auto-wrap via "+ Add" / drag (§3c)
In a Columns slot, open **+ Add** and pick an **Accordion item** (an item, not a container).
**Expected:** it is **auto-wrapped in a new Accordion** with a toast **"Placed inside a new …"** — never
a bare item. `[your hands]` also **drag an accordion item onto the empty canvas 5 times** (WC#101
condition, no retry). **Expected:** each landing auto-wraps into an Accordion + toast; some drags may not
register (synthetic-drag flakiness is a harness trait — the picker path above is the deterministic
proof). The palette marks item cards **"needs {Container}"**.

## G — Refused wrong-zone drop, with the reason (§3c)
Attempt to drop / pick an item where several containers or none apply, or a bare orphan at the page root.
**Expected:** it is **refused with an author-grade reason** (e.g. "… must be placed inside …") and, on a
hand-edited orphan, **Save is rejected** with the same message (the H5 guard).

## H — Global assets / brand layer (§3d, C4)
Check an «ext» component's on-canvas styling. **Expected:** structure + shape correct via the shadow-DOM
CSS; **full brand fidelity (tokens/font/icons) requires the library's example THEME** — `[your hands]`
install that theme (or add its asset layer to the helper's `base` library) for 100% page==canvas parity.
This is a **brand-layer** note, not a Mosaic bug.

## I — Save → view → round-trip
Save the node; view the page; re-open the builder. **Expected:** everything round-trips — accordion
items, tabs, the Card (image empty unless set); no orphan; owned components byte-identical.

## J — STOP
Report per component: place / panel / items / save / page / behaviour → PASS, or a red with its class
(**library-schema** = advice for «ext»'s authors; **brand-layer** = install the theme; **accepted** =
harness/limitation). This is the acceptance gate before tagging 1.0.0.

**STOP.**
