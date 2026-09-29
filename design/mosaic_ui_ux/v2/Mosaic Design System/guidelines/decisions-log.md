# Decisions log — Mosaic 1.0 authoring design (v2)

Each entry: the decision, why, and the alternatives rejected (kept on purpose so they aren't re-proposed).

## Brand

**D1 · Signature: drafting marks + mono indices.** Selection is a 1px hairline with four 8px corner ticks and a small index tab ("03 Card · Civic UI"). Every Mosaic-owned structure is numbered in Plex Mono: rail sections (01 Content), zones (A · FOOTER), repeater rows, palette libraries, result lines. The look comes from technical drawing, which suits a tool about structure.
- Rejected: a coloured glow/halo selection (the Webflow/Framer default; noisy over user content).
- Rejected: a signature colour gradient (decorative, and it fights the site's own palette on the canvas).
- Rejected: a custom display typeface (costs load time inside an admin form, and reads as marketing).

**D2 · One accent (teal), indigo only for data/structure.** Teal means "you did this / this is selected". Indigo means "this is structure or live data" (zones, DATA badges, result lines, field maps). Amber, red and green are semantic only.
- Rejected: indigo as the accent (it's the default of every SaaS tool, and it collides with Claro/Gin blues).
- Rejected: using the admin theme's primary (breaks theme independence).

**D3 · IBM Plex Sans + Plex Mono.** Technical and legible at 11–13px, with tabular numerals for counts.
- Rejected: Inter (it's Gin's font, so Mosaic would visually merge into Gin); system UI (would differ per OS and per admin theme).

## Structure

**D4 · Builder stays in the node form; palette collapses to a 48px strip by default.** The layout field competes with the title, body and revision sidebar for width, so the canvas gets it.
- Rejected: palette always open (at 1440px in the form, the canvas dropped to about 480px).
- Rejected: full-screen by default (breaks the "a field on a node" truth; focus mode stays available).

**D5 · Rail sections are absent when unusable, never disabled; indices renumber.** An owned component shows 01 Content · 02 Slots · 03 Data · 04 Accessibility.
- Rejected: greyed-out Style tab with a tooltip (it invites clicks that can't succeed).
- Rejected: fixed numbering with gaps (01, 02, 05 reads like a bug).

**D6 · Style ownership as one dashed "owned" banner at the top of the rail.** Dashed border plus a lock glyph: informational, not a warning.
- Rejected: amber attention banner (ownership is correct behaviour, not a problem).

**D7 · Front-end dialog reuses the identical RailCard, docked right and non-modal.** The live page stays readable beside it, and the same component guarantees every section works in both places.
- Rejected: a centred modal (hides the thing being edited); inline popovers on the page (can't hold Data or Accessibility).

**D8 · Tablet: rail and palette become floating panels over the canvas. Mobile: bottom sheet at 62% height.**
- Rejected: a stacked rail below the canvas on tablet (it separates the editor from what it edits).

## Canvas

**D9 · Zones: dashed indigo hairline, mono label; "+ Add" inside when empty, a 20px "+" in the header once filled.**
- Rejected: a permanent "+ Add" bar under every zone (clutter once the page is full).

**D10 · Anchored picker, Plain content first, fully keyboard, max 420px high and clamped to the window.**
- Rejected: opening the full palette for every "+ Add" (too much context for a zone that accepts 2 types).

**D11 · Refused drop: the zone turns red with a named reason, and the item snaps back in 240ms.**
- Rejected: a not-allowed cursor alone (colour/cursor only; no reason; fails "violations are shown").

**D12 · Auto-wrap reported by a toast with Undo, not a dialog.** Optimistic; nothing blocks.

**D13 · Example content has a dashed EXAMPLE corner badge on the canvas and "Preview only — set a value to publish" in the rail.**
- Rejected: lorem ipsum at reduced opacity (it gets mistaken for real content in screenshots and reviews).

## Data

**D14 · Result line is mono indigo, always under the bound zone: "3 of 128 · Latest news · Block".** Failing uses red text plus a glyph; empty uses muted text plus a dashed-circle glyph.

**D15 · Data-state switcher sits in the builder top bar, only when the selection or page has a binding.**
- Rejected: a global preferences toggle (authors would never find it).

**D16 · Contextual-filter sources are a single select with human labels ("Page field: Topic").** No query builder, per scope.

## Feedback

**D17 · Stale shimmer: a 12% teal sweep over the preview only, plus "Refreshing preview…" in the status line.** Reduced motion: a static 6% tint.
- Rejected: a spinner overlay (it blocks the canvas); no indicator at all (authors can't tell a slow server from a broken save).

**D18 · Save errors: an error summary strip above the canvas, author words, one action per line; Save focuses the first field that needs attention (alt text).**
- Rejected: only inline errors (on a long page the author doesn't know where to look); a blocking modal.

**D19 · Revert to saved is a confirm popover anchored to the status line, stating how many changes will be lost.**

## Dark mode

**D20 · Designed, not inverted.** Elevation comes from lighter surfaces plus a 1px top highlight; shadows deepen. Accent lifts to #5cc0b8, with dark ink on primary buttons. Semantic backgrounds are deep tinted, not transparent overlays.
- Rejected: a filter:invert approach; reusing the light accent (fails 4.5:1 on dark surfaces).

## Admin

**D21 · Manage authoring mirrors Drupal's Manage form display (table-drag rows, widget per row).** Site builders already know it.

**D22 · Library "notes" are banners inside the library detail (shadow DOM / global styles / resets / theme-bound), not badges on every row.**

## Accessibility

**D23 · Inputs and checkboxes use border-strong (≥3:1).** text-faint was raised to AA. See `contrast-audit.md`: 122 pairs, 0 failures.

**D24 · Keyboard move: selection marks turn indigo, and an inverse status bar states "position 1 of 3 in Card row" with the arrow keys that apply; on mobile the arrows are 44px buttons.**
