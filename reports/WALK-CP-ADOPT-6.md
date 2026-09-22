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
   note — the page never blanks. Capture the **fallback-page shasum** now (this is the
   *fallback baseline*; the mechanical proof is `FallbackRenderTest`).
   *Film:* the fallback block. **STOP.**

3. **The builder keeps your content.**
   Edit the node. On the canvas, where the teaser was, a **"Library missing: olivero"**
   card shows the stored values, read-only, with "your content is Kept and returns when
   the library is re-enabled." Nothing was lost; you can still save.
   *Pass:* the card shows the kept values; the save is not blocked.
   *Film:* the card. **STOP.**

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

7. **Add into a library slot with the keyboard (the picker).**
   Place a fresh Olivero **teaser**. Focus its **content** zone's **"+"** with Tab;
   press **Enter** to open. The list shows **Plain content first**. Press **Enter** to
   choose it; type a sentence.
   *Pass:* the text appears in **Olivero's** look, and there is **no flash** on the first
   render (the optimistic SSR crossfades, it never blinks). Dragging still works too —
   the picker never replaced the drop zone. (Mechanical proof: `MosaicZonePicker` +
   `MosaicSlotZonePicker` Vitest.)
   *Film:* the picker open with Plain content first, then the typed text. **STOP.**

8. **Attach-once — one stylesheet, many edits.**
   With the teaser placed, edit its Plain content five times. In the builder document,
   count the Olivero teaser stylesheet `<link>` tags.
   *Pass:* exactly **one** (the library loads once; edits never accrete tags).
   (Mechanical proof: the `mosaicAttach` 20-edit leak-guard cell.)
   *Film:* the tag count. **STOP.**

## What this walk proves
Pages survive a library going away (fallback + card + report), come back byte-identical
when it returns (one cache tag), tell you when a library's schema drifts, and let you add
into a library's slot by keyboard — all without ever losing your content.
