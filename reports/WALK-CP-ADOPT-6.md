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
   survives the library going away. **WC#85:** the fallback renders the teaser's slots in
   the component's **declared order** (Olivero teaser: content, then image), regardless of
   the order they were stored in. Capture the **fallback-page shasum** now (the
   *fallback baseline*; mechanical proof `FallbackRenderTest`, incl. the bound-slot + the
   declared-order cells).
   *Film:* the fallback block (bound rows, declared slot order). **STOP.**

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
   click it; type a sentence.
   **Keyboard:** on another zone, Tab to the "+", Enter opens, ↑/↓ move, Enter chooses,
   Esc closes.
   **WC#87 (fixed):** the picker now appears on **owned** free-content zones too (not just
   foreign), and on a free-content slot it lists **every** authorable component (owned
   first, grouped by library) after Plain content.
   *Keyboard PASS:* the full keyboard path opens the picker and inserts.
   *Mouse — WC#86 FIXED (PROVEN headed):* a **real mouse click** now **opens** the picker.
   Proven on node/993 (headed): `elementsFromPoint` at the "+" returns the button wrapper
   (the `_DropZone--isRootZone` overlay now sits below), and the click flips
   `aria-expanded` **false → true**, opening the list. The cause was pure event delivery —
   Puck's DropZone stopped the click in the capture phase before React's onClick (invoking
   onClick directly always worked); the fix is a document-capture listener that drives the
   picker + a z-index lift above the overlay. Keyboard path unchanged.
   *Known follow-up — WC#88 (insert):* choosing an option does **not yet insert** the
   component (`insertIntoSlot` slot-zone id); the picker opens + is selectable, but the
   inserted component does not land. Do not sign off the full add-flow until WC#88. **STOP.**

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
