# WALK-CP-ADOPT-6 — the acceptance walk (plain words)

You (Arun) create the pages and **toggle Olivero yourself** — turning a library on or
off is a dev-config write, so it must be your hands, not the AI's. Walk the steps; each
step says what you should see; film only the screens named. **One STOP per step.**

## The story
Pages survive library changes and removals. When you turn a library off, the pages that
used it don't break — they show a clear fallback, the builder keeps your content in a
"Library missing" card, and a report lists exactly which pages are affected. Turn the
library back on and the page is byte-for-byte what it was. When a library updates its
schema, the panel tells you what changed. And you can add content into a library's own
slot with a keyboard, not just by dragging.

## Before you start
- A page (node/780 is the reference) with Mosaic blocks **and** an Olivero **teaser**
  that has a **Plain content** child in its content slot.
- Two terminals ready: one to run `region-shasum.sh <url>`, one to run
  `style-shasum.sh <url>` (the byte-identical proofs).

## Steps

1. **Baseline — the page as it should be.**
   Load node/780 (anonymous). Run `region-shasum.sh` and `style-shasum.sh`.
   *Pass:* REGION `14e6cb9c…3954`, STYLE `b7756795…ca982 4354 10`.
   *Film:* the page. **STOP.**

2. **Turn Olivero OFF (your hands).**
   Go to **Component libraries**, untick **Olivero**, Save.
   Reload node/780 (anonymous).
   *Pass:* the teaser is gone; in its place a bounded **fallback block** shows the
   author's content (the Plain content text is still there), with a small "content kept"
   note — the page never blanks. **WC#83:** if the teaser had a slot **bound to a View**,
   the fallback shows the **View's rows** (as bare cards), not an empty gap — a bound slot
   survives the library going away. **WC#89:** the fallback renders the teaser's slots in
   the component's **template render order** (Olivero teaser: prefix, meta, image, title,
   **content last**), regardless of storage order. **Notice ruling:** as an editor you see a
   VISIBLE "This component's library is unavailable; showing its content" notice; an
   anonymous visitor sees only the content (the note is visually-hidden). Capture the
   **fallback-page shasum** now (mechanical proofs `FallbackRenderTest`: bound-slot,
   template-order, permission-gated-notice cells).
   *Film:* the fallback block (bound rows, template slot order, visible editor notice). **STOP.**

3. **The builder keeps your content — including bindings (WC#83).**
   Edit the node. On the canvas, where the teaser was, a **"Library missing: olivero"**
   card shows the stored values, read-only, with "your content is Kept and returns when
   the library is re-enabled." For every **bound** slot the card adds a line
   **"{Slot} — bound to {View}"** so you can see the binding is still there. Save the node
   with **no changes**: the saved layout's `slots_binding` is **byte-identical** — a save
   while the library is off never strips the binding (mechanical proof: the
   toPuck→fromPuck round-trip cell).
   *Pass:* the card shows the kept values AND the "bound to" line; a no-change save keeps
   the binding.
   *Film:* the card with the "bound to" line. **STOP.**

4. **The report names the affected pages.**
   Visit **Reports → Mosaic library changes** (`/admin/reports/mosaic/library-changes`).
   *Pass:* node/780 is listed under Olivero as an affected page, with the unavailable
   component named.
   *Film:* the report. **STOP.**

5. **Turn Olivero back ON — the page is exactly itself again.**
   Re-tick **Olivero**, Save. Reload node/780 (anonymous). Run both shasums.
   *Pass:* the teaser is back; REGION and STYLE are **identical to step 1**
   (`14e6cb9c…3954` / `b7756795…ca982 4354 10`). One tag toggled everything —
   page, manifest, and report cleared together (cache-tag unification).
   *Film:* the restored page + the two equal shasums. **STOP.**

6. **A library update tells you what changed (test env).**
   In the test environment, swap the adopt_fixture component to its **v2** schema
   (heading removed, variant retyped, title now required). Open a page that used the v1
   component and click the instance.
   *Pass:* the panel shows a **Schema changes** notice — **Removed** (your value kept),
   **Type changed** (flagged), **Attention** (now required). The report's **Schema
   changes** section lists the same. (Mechanical proof: `SchemaDriftTest`.)
   *Film:* the panel notices + the report section. **STOP.**

7. **Add into a library slot — by mouse AND keyboard (the picker, WC#84).**
   Place a fresh Olivero **teaser**. Its **content** zone (empty) shows one **"+ Add"**
   affordance (a zone with children shows a single compact header "+"; never two).
   **Mouse:** click "+ Add" — the picker opens; the list shows **Plain content first**;
   click it; type a sentence. Then **Save the node** — the save **succeeds**
   (**WC#92 fixed**: Plain content lives inside a component's slot; it is refused only on
   the bare page canvas — even on a page whose *only* block is that adopted teaser, where
   the teaser is its own root). The old build wrongly rejected it as "top level".
   **Keyboard:** on another zone, Tab to the "+", Enter opens, ↑/↓ move, Enter chooses,
   **Esc closes** and returns focus to the "+".
   **WC#93 (fixed):** the list is anchored under the "+", **flips above** when the window is
   short (< 240px room below), is capped at **60vh with internal scroll**, closes on Esc or
   an outside click — so on any window height the whole list is reachable and the canvas
   never shifts.
   **WC#87 (fixed):** the picker now appears on **owned** free-content zones too (not just
   foreign), and on a free-content slot it lists **every** authorable component (owned
   first, grouped by library) after Plain content. **WC#92:** Plain content is offered in
   **owned** slots too (e.g. a Columns column), not only adopted ones.
   *Keyboard PASS:* the full keyboard path opens the picker and inserts.
   *Mouse — WC#86 FIXED (PROVEN headed):* a **real mouse click** now **opens** the picker.
   Proven on node/993 (headed): `elementsFromPoint` at the "+" returns the button wrapper
   (the `_DropZone--isRootZone` overlay now sits below), and the click flips
   `aria-expanded` **false → true**, opening the list. The cause was pure event delivery —
   Puck's DropZone stopped the click in the capture phase before React's onClick (invoking
   onClick directly always worked); the fix is a document-capture listener that drives the
   picker + a z-index lift above the overlay. Keyboard path unchanged.
   *WC#88 (fixed):* choosing an option now **inserts** the component into the slot
   (proven headed on node/993: layout JSON nodes 4 → 5, the child lands under the slot,
   picker closes). **WC#90 (fixed):** the list opens **fully above** the blue selection
   overlay (portaled to the page). **WC#91 (fixed):** opening the picker at a **bottom**
   zone and inserting does **not** scroll or shift the top of the canvas (the top zone
   stays put — the list is portaled out of the canvas, so it never changes its height).
   The add-flow is whole: click → open → choose → the component appears. Type in its rail;
   on a foreign teaser slot the text takes Olivero's look. **STOP.**

8. **Attach-once — one stylesheet, many edits.**
   With the teaser placed, edit its Plain content five times. In the builder document,
   count the Olivero teaser stylesheet `<link>` tags.
   *Pass:* exactly **one** (the library loads once; edits never accrete tags).
   (Mechanical proof: the `mosaicAttach` 20-edit leak-guard cell.)
   *Film:* the tag count. **STOP.**

## What this walk proves
Pages survive a library going away (fallback + card + report), come back byte-identical
when it returns (one cache tag), tell you when a library's schema drifts, and let you add
into a library's slot by mouse OR keyboard — all without ever losing your content.

## Standing matrix (regression rows)
- **missing card keeps bindings** — a bound slot on a missing component keeps its
  `slots_binding` byte-identical across a no-change save, the fallback renders its View
  rows, and the card names it "{Slot} — bound to {View}". (WC#83)
- **picker opens by mouse and keyboard on adopted + owned zones** — a real mouse click and
  the full keyboard path both open the per-zone picker; one affordance per zone; drag still
  works. (WC#84)
- **picker insert saves (owned + adopted + root-rejected)** — Plain content added into any
  component's slot (owned Columns or adopted teaser, including a lone-teaser page whose root
  IS the teaser) SAVES; Plain content on the bare page canvas is refused with an author-grade
  message. One shared rule governs the client catalog and the server validator. (WC#92)
- **picker list fits any window + Esc** — the list anchors under the "+", flips above on a
  short window, caps at 60vh with internal scroll, and closes on Esc (focus returns to the
  "+") or an outside click, with no canvas layout shift. (WC#93)
