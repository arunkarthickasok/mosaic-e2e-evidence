# WALK-CP-ADOPT-5 — the ADOPT-5 acceptance walk (Arun)

> WALK-SCRIPT LAW: one story, numbered steps, each with a DROP-PROOF (the exact
> thing to see) and a PROOF-CONDITION (pass/fail). Arun creates the pages; the AI
> does not. Automated coverage per step is noted `[auto: …]`; steps marked
> `[manual]` are not yet in a headed spec (their code lands in a later slice).

## Story
An author builds a page with Mosaic's own components and an adopted Olivero
teaser. The panels tell the truth about what each component can do; a slot can be
driven by a View; the library keeps its own look inside its slots; and a viewport
switch never loses work.

## Steps

1. **Honest Card panel (owned gating).**
   Create a page, drop a **Card**, select it.
   - DROP-PROOF: the rail shows **Data Sources** + **Breakpoint overrides** +
     Spacing + Style + Visibility. Select a **Tabs** (or **View**) instead.
   - PROOF-CONDITION: Tabs shows its "Tab sets" field but **NO Data, NO
     Breakpoint**; View shows **NO Data**. Card keeps Data.
     `[auto: cp-adopt-5-owned-panel.spec.ts — tabs/view drop Data, columns keeps]`

2. **Bind a column to a View + result line (H9).**
   Drop a **Columns**, select it, open **Data binding** → **Bind Column 1 to
   data** → pick a View + display → child type **Card** → map the View's title
   field → the Card title.
   - DROP-PROOF: the column fills with one **Card per row**, and a line under the
     zone reads **"{shown} of {total} · {View} · {display}"**.
   - PROOF-CONDITION: N cards == N rows; the result line matches the View.
     `[auto: cp-adopt-5-bind-journey.spec.ts — 3 Cards + "3 of 4 · J8 Articles"]`

3. **Mobile switch keeps everything (WC#73).**
   With the bound Columns (and any adopted teaser) on the canvas, switch the
   viewport **Desktop → Mobile → Desktop**.
   - DROP-PROOF: every component is still there after the switch (nothing blanks).
   - PROOF-CONDITION: node count before == after; the adopted teaser still shows
     its library markup (not a skeleton).
     `[auto: wc73-viewport-witness.spec.ts + cp-adopt-5-bind-journey.spec.ts]`

4. **Teaser slot: Plain content offered first, Olivero look, ownership line.**
   Drop an **olivero:teaser**. Open its **content** slot's add control.
   - DROP-PROOF: **Plain content** is offered **first** in the slot's picker; add
     it and type a sentence — it renders in **Olivero's** typography, not Mosaic's.
     Drop a **Heading** in the same slot: it renders **bare** and its panel shows
     the **ownership line** ("Styling is owned by Olivero Teaser") with **no Style
     sections**.
   - PROOF-CONDITION: plain content inherits the library font/colour; the bare
     Heading has no `data-mosaic-component` and no Style/Spacing sections.
     `[manual: SO-2 client add-picker is P1d-B-CONT; the FONT inheritance is
      proven by the SO-5 donut computed-style cell (CHECKPOINT-3) + the bare-render
      Kernel cell]`

5. **Save → page matches.**
   Save the node, view the published page.
   - DROP-PROOF: the bound rows render as Cards; the teaser renders with Olivero's
     own markup; the plain content inherits the library look.
   - PROOF-CONDITION: the page byte-identical invariant holds for the owned-only
     regions (region-shasum `14e6cb9c…`, style-shasum `b7756795…`); bound rows +
     adopted markup render server-side.
     `[auto: bind-journey page cards + SlotBindingRenderTest + region/style shasums]`

## Pre-existing reds (known, not walk failures)
- Vitest B-101 (`maps boolean props to checkbox fields`) — pre-existing drift.
- tsc `dsdShadow.ts:17` — DOM-lib drift in the SO-7 shadow code.
- phpstan 3× `MosaicRenderer` (property.notFound + parameter.phpDocType ×2).
