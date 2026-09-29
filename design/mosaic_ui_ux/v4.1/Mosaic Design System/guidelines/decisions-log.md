# Decisions log — Mosaic 1.0 authoring design (v2 → v3)

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

## v3 (2026-09-29)

v2 used numbers D1–D24, so v3 entries continue from D25 so nothing is overwritten.

**D25 · Type floor is 12px.** `--mos-text-2xs` (11px) was removed. Section labels, mono indices, badges, kbd keys and zone labels are now 12px, and their containers grew to fit (badge sm 18px, kbd 20px, selection tab 20px).
- Rejected: 11px for mono only (Plex Mono at 11px drops below comfortable x-height on Windows ClearType).
- Rejected: keeping 11px caps labels with extra tracking (still under the floor).

**D26 · Fonts self-hosted.** IBM Plex Sans 400/400i/500/600 and Plex Mono 400/500 as latin-subset woff2 in `assets/fonts/`, with the same fallback stack. There are no third-party requests; government sites often block them by CSP.
- Rejected: Google Fonts @import (privacy/CSP); variable font (two families' variable files cost more than six static latin subsets).

**D27 · Index rule.** Mono indices appear only on Mosaic structure: rail sections, zones, patterns, palette groups and the selection tab. They never appear on content fields, repeater rows, versions or counts, and never inside library markup. Counts and versions use `.mos-count`; breadcrumbs use `.mos-crumbs`.
- Rejected: numbering repeater rows (it reads as content order the author set, and it duplicates the drag handle).

**D28 · Compact density.** `[data-mosaic-density="compact"]` turns every index into an 8×2px tick. The text stays in the DOM for assistive tech. Section headers shrink from 40px to 34px.
- Rejected: hiding indices entirely in compact (loses the signature and the wayfinding).

**D29 · Palette first-run cue.** On an empty canvas the 48px strip's Components button pulses three times (1600ms each) and shows a "Components" label. Both go away after the first drop and are never shown again. Reduced motion: a static ring and the label.
- Rejected: a coach-mark tour (blocking); auto-opening the palette (it takes canvas width from every returning author).

**D30 · Manage authoring: overrides are teal dots with a per-row Reset.** "Overrides only" filters to them. The library's schema always wins: hiding a library-required field is a row-level error plus a summary, and Save is disabled.
- Rejected: silently forcing Required back on (the site builder wouldn't learn why).

**D31 · Field types offer only compatible widgets.** Every shape carries one plain explanation line. A shape with no default is Attention, with the number of fields it affects.

**D32 · Library changes grouped by library.** They use the same badge words as the rail notices (Added / Removed / Type changed / Required added / Legacy binding / Legacy override). The empty state says when the last sync ran.

**D33 · Notice family has fixed copy.** `Notice` renders ⚠ Removed, ⚑ Type changed, ! Attention, "Legacy binding — remove to edit" and "Legacy override — remove to edit". The label never varies; only the detail line does.

**D34 · HTML field switch asks first.** Image → text shows an inline confirm, "Replace the image with text?", because it drops content. Text → image doesn't, because nothing is lost until the author picks an image.

**D35 · Repeater floor and ceiling.** Remove is disabled at the minimum, with a reason in the accessible label and a line under the list. Add is disabled at the maximum, with an info banner "Maximum reached — 4/4".

**D36 · Visibility says what it doesn't do.** "Hidden content is still downloaded and indexed." is always shown in the section, not only after something is hidden.

**D37 · Breakpoint overrides only on layout props** (padding, gap, width). Content fields never vary by breakpoint. Overridden cells carry the same teal dot as Manage authoring.

**D38 · Mobile sheet has two stops: 62% and expanded.** The handle is a real button with aria-expanded. There is no free-drag height, because keyboard and switch users need fixed stops.

**D39 · Settings are limited to behaviours the product has:** front-end editing, example previews, rich-text format, the media type for Image fill, and heading start level. Alt text at save is shown locked "Always on".
- Needs confirmation: whether each of these is a real site-wide setting in Mosaic 1.0.

## v4 polish (2026-09-29)

The brief asked for D31+. v3 already used D25–D39, so these continue at D40 so nothing is overwritten.

**D40 · Palette is 240px** (`--mos-palette-width`). Library headers are one line: index · name · count, then the note, which truncates with a tooltip. Nothing wraps.
- Rejected: two-line headers (at 240px the note pushed the first card below the fold on 800px-tall screens).

**D41 · Selection chrome rule.** The toolbar floats outside the frame, 8px above its top-right corner. The index tab hangs outside from the bottom-left, so it fits in the 24px canvas gap. The EXAMPLE badge sits inside, top-right. z-order, lowest first: `--mos-z-example` 10 < marks `--mos-z-selection` 400 < tab `--mos-z-selection-tab` 420 < toolbar `--mos-z-selection-toolbar` 450. The three never share a corner, so they cannot collide at any width. The tab truncates to the frame width; the toolbar uses its compact set on mobile.
- Rejected: tab top-left (it collided with the toolbar on frames narrower than about 390px, and with the EXAMPLE badge on narrow cards).

**D42 · Palette thumbnails.** A 40×28 slot shows the library's declared image; if there isn't one, the icon shows instead. Mosaic Starter components keep icons, since they have no library art.
- Placeholder: the kit uses a flat block where library images would go.

**D43 · Dark mode follows the admin theme.** "Auto" by default: Gin dark → Mosaic dark, anything else → light. A three-way switch (Auto / Light / Dark) in the builder top bar overrides it. There is no dark island inside a light form unless the author picks Dark.
- Rejected: following `prefers-color-scheme` (Claro ignores it, so the builder would go dark inside a light Claro form).

**D44 · Focus mode is labelled until first used.** The top bar shows a "Focus mode" button with text; after the first use it shrinks to an icon. Esc exits. Focus mode fills the viewport over the node form, which stays underneath.

**D45 · Strip labels.** The 48px strip icons show their label on hover and on keyboard focus. The first-run cue suppresses the Components label so the two never stack.

## v4.1 (2026-09-29)

**D46 · Toolbar flip rule (addendum to D41).** There are two placements:
- *Above* (default): the toolbar sits 8px above the top-right corner; the index tab hangs from the bottom-left.
- *Below*: the toolbar sits 8px under the bottom-right corner; the index tab moves to the top-left and hangs into the gap above.

`SelectionFrame placement="auto"` measures inside the nearest `[data-mos-canvas]` and flips when either is true:
- there is less than 46px above the frame (for example, it is the first component on the canvas);
- the toolbar's box would intersect another component's index tab.

It re-checks on resize. `placement="above"|"below"` forces a placement. The kit shows both on screen 01 (states "Toolbar above" and "Toolbar below · first on canvas").
- Rejected: flipping the toolbar to the left side (it lands on the index tab again on narrow frames).

**D47 · The colour-mode override lives in the builder top bar,** as an icon-only Auto / Light / Dark switch next to the viewport switch. It was removed from the kit's control panel. On mobile, the viewport switch, colour mode, focus mode and keyboard shortcuts move into the "more" (⋯) menu. The menu items are 44px tall, and Esc closes the menu. Screen 01 state "Mobile ‘more’ menu" shows it open.

Icons ship locally as `assets/icons/lucide-subset.js` (99 Lucide glyphs as data URIs, `window.MOS_ICONS`). `Icon` uses the local set first and falls back to the CDN. The offline kit builds from component sources (`ui_kits/builder/offline.html` + `src/ds.offline.babel`) and makes no network requests for icons. Contrast is unchanged: no colour tokens changed.
