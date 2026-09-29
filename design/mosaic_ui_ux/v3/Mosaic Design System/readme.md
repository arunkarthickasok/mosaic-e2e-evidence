# Mosaic Design System

Design system for **MOSAIC 1.0** — an open-source, self-hosted visual page builder for Drupal 11. Mosaic is a layout **field** on a Drupal node (not a theme replacement): it opens inside the node edit form, plus a front-end edit dialog on the live page. It renders any SDC ("Adopt any component") with a governed, schema-derived property rail, typed data binding to Drupal fields/Views/entities, and component-library governance — while shipping its own token system that works, unchanged, under Claro, Gin, or any custom admin theme.

Positioning (from the source material): Drupal Canvas rebuilds a site as a JSX app; Mosaic instead gives content authors a world-class visual canvas on a field inside the classically-themed, Twig-rendered, enterprise-governed Drupal site they already have — nothing ships to anonymous visitors but HTML and CSS. The experience bar is Webflow / Framer / Wix Studio, but the feel should be calm and precise, never flashy.

## Sources

- `drupal.org/project/mosaic` — the module's project page.
- GitHub `arunkarthickasok/mosaic-e2e-evidence` — the actual ground truth used here: `README.md`, `INDEX.md`, `ledger-live/MOSAIC-BIBLE.md`, `ledger-live/MOSAIC-NORTHSTAR.md`, `reports/ADOPT-DESIGN.md` (the "Adopt any SDC" + Style Ownership packets), `reports/ACT2-DESIGN-PACKET.md`, and screenshots under `tabs-cke5/`, `ship32-scroll/`, `preview-lock/`, `walk-45-46/`.
- GitHub `arunkarthickasok/mosaic_ui_ux` — named by the user as a UI/UX reference repo, but its tree endpoint returned nothing readable (empty/inaccessible) during this build. Not used. Worth re-checking directly if you have access.
- GitHub `arunkarthickasok/mosaic` — the module source repo; private, not opened this pass (evidence repo had enough product truth for a from-scratch design system).
- Two Claude design links (`Mosaic Builder.dc.html`, `Mosaic Studio.html`) were mentioned but not accessible as project files here — not used.
- Three reference screenshots of the **existing/legacy** admin UI were pulled from the evidence repo (`tabs-cke5/01-builder-open.png`, `tabs-cke5/05-media-library.png`, `ship32-scroll/02-fe-canvas-scrolled.png`) purely to learn the current palette groups, block names, and rail structure — the visual language in this design system is a fresh, better-than-Webflow direction, not a copy of that legacy screen.

Explore the repos further yourself for a deeper rebuild — the evidence repo in particular contains extensive ratified design rulings (`ADOPT-DESIGN.md` §9 "Style Ownership", the full pillar A–H spec) worth mining further.

## Product truths this system designs for (do not contradict these)

- Builder lives **inside the node edit form** — title, revision sidebar, Save are still there. A front-end edit dialog is a second surface for the same rail.
- Palette is grouped **by library** (Mosaic's own starter library + any installed library), with a DATA badge when bindable and an Attention badge with a reason.
- Every component gets a readiness grade: **Ready / Attention (field + reason) / Blocked** (Blocked hidden by default).
- Rail sections — **Content · Data · Style · Responsive · Accessibility** — appear only when the selected field/component supports them. Inside an adopted (outside-library) component, Style/Spacing/Responsive are replaced by one line: "Styling is owned by [Library] [Component]."
- Slots are governed drop zones: allowed children, min/max, defaults, empty state; violations are shown, never silently refused.
- Data binding only to: a field on the page, a Drupal View (with contextual filters/exposed filters/pager), an entity reference, or route/user context. A slot bound to a View repeats one child per row. Binding **shows**, never copies.
- No inline query builders, no external API sources, no generated-code-as-primary-surface, no settings page to pick rail sections.
- Feedback is **optimistic**: commit immediately, show a subtle stale shimmer while the server preview catches up. No blocking overlays, ever.
- Trust cues: "In sync with the saved layout" / "Unsaved changes", Revert to saved, a bound-component result line ("3 of 128 · View name"), a WCAG summary, a Data-state switcher (Populated / One item / Empty / Failing).
- Government-grade accessibility: every drag has a keyboard path, alt text required at save (field focused on error), heading-level guidance, visible focus, AA contrast, reduced motion respected.

## Index

- `styles.css`: root stylesheet, made only of `@import` lines (tokens + `components/mosaic.css`).
- `tokens/`: `fonts.css`, `colors.css` (light on `:root`, designed dark on `[data-mosaic-theme="dark"]`), `typography.css`, `spacing.css`, `radius.css`, `elevation.css`, `motion.css` (choreography durations + reduced-motion), `layers.css`.
- `components/mosaic.css`: all component styles. Every selector is `.mos-*` inside `@layer mos-chrome`, and nothing reads admin-theme classes. Wrap Mosaic UI in `.mosaic`.
- `guidelines/`: foundation cards (Colors, Type, Spacing, Elevation, Motion, Brand), `decisions-log.md` (with rejected alternatives), `contrast-audit.md` / `.json` (122 pairs, 0 failures).
- `ui_kits/builder/index.html`: interactive authoring kit (v3) with builder screens 01–11, site-building screens A–E (libraries, manage authoring, field types, library changes, usage/settings/content-type governance) and rail states F–K. Every screen works at 1440 / 834 / 390, in light/dark, at comfortable/compact density, and under Claro/Gin/Custom admin themes; the mobile sheet has 62% and expanded stops. `motion.html` is screen 12.
- `assets/fonts/`: self-hosted IBM Plex woff2 files (latin subset, SIL OFL). No logo was supplied; the brand mark is the word "Mosaic" set in Plex Sans 600.
- `SKILL.md`, `github.md`, `thumbnail.html`.

## Components

Namespace `window.MosaicDesignSystem_9c1bff`.

- core: Icon, Button, IconButton, Input, Select, Toggle, Checkbox, Badge
- feedback: Banner, Notice, Toast, SyncStatus, ResultLine
- navigation: Tabs, Segmented, SelectionToolbar
- surfaces: Card, Dialog, RailSection, FieldRow
- builder: SelectionFrame, Zone, PaletteItem, Picker, Repeater, MissingCard

## Rules added in v3

- **Type floor 12px.** No text below `--mos-text-xs`. There is no 2xs token.
- **Index rule.** Mono indices (`.mos-index`) appear ONLY on Mosaic structure: rail sections, zones, patterns, palette groups and the selection tab. Never on content fields, repeater rows, versions or counts, and never inside library markup. Use `.mos-count` for counts/versions and `.mos-crumbs` for breadcrumbs.
- **Density.** `data-mosaic-density="compact"` on any ancestor turns indices into 8×2px ticks (the text stays for assistive tech) and tightens rail rhythm.
- **First-run cue.** The 48px strip pulses three times with a "Components" label on an empty canvas, once per author. It is gone after the first drop.
- **Fonts.** Self-hosted from `assets/fonts/`. There are no Google Fonts requests.

## Signature idea (v2)

**Drafting marks + mono indices.** Selection is a 1px hairline with four 8px corner ticks and an index tab ("03 Card · Civic UI"). Every Mosaic-owned structure carries a Plex Mono index: rail sections (01 Content), zones (A · FOOTER), repeater rows, palette libraries, result lines. That is the one distinctive move. Everything else stays quiet so the user's page stays the loudest thing on screen.

## Content fundamentals

Voice comes straight from the source docs: direct, technical, unafraid of precision over polish. Tone patterns to keep:

- **Author-facing copy is plain and literal, never cute.** The brief's own example is the model: *"Teaser (Olivero) needs content in its Content area"* — names the exact component, exact field, exact fix. Never "Oops, something's missing!"
- **Second person for the author, third person for the system.** "You are editing this layout" (seen live in the product), "Styling is owned by [Library] [Component]."
- **Status lines state facts, not feelings.** "In sync with the saved layout" / "Unsaved changes" / "3 of 128 · View name" — a count, a source, done. No exclamation points, no "Great job!"
- **Badges and grades use exactly three words: Ready, Attention, Blocked.** Attention always carries a reason inline, never a generic "warning."
- **No emoji, anywhere.** Government-grade accessibility tooling doesn't use decoration as signal.
- **Sentence case for UI labels and headings** ("Component libraries", not "Component Libraries"); machine names are demoted to a disclosure, never shown as the primary label.
- **Errors name the object and the fix in one sentence** — component + slot/field + what's needed — matching the brief's Alt-text and required-slot examples verbatim in style.

## Visual foundations

- **Color:** deep teal (`--mos-accent` / `--mos-teal-500`, `#0F6E6A`) as the single accent — used for the active/selected state, focus rings, links, and the sync-status "in sync" cue. A cool, low-chroma gray scale (`--mos-gray-*`) carries almost all chrome. Indigo (`--mos-indigo-500`) is reserved exclusively for **data/binding** signals (the DATA badge, bound-field outlines, View-mapped rows) so "this is live data" reads as one consistent hue across the whole system. Amber = Attention, red = Blocked/error, green = Ready/success — a strict semantic-only palette; these four never appear as decoration. Max two accent hues rendered at once (teal + one semantic color) to keep the interface calm. Full dark mode via `[data-mosaic-theme="dark"]` token overrides, not a separate stylesheet.
- **Type:** IBM Plex Sans throughout (self-hosted woff2, 12px floor) — chosen for its technical, slightly geometric character (drafting-table precision, not corporate-neutral like Inter/Roboto) that suits a builder tool aimed at developers and careful site builders alike. IBM Plex Mono for machine names, schema keys, and the developer disclosure. No serif anywhere — nothing in the source suggests editorial warmth; this is an authoring tool.
- **Spacing:** 4px-rooted scale (`--mos-space-025` … `--mos-space-8`) but UI density leans tight — a 32px control height, 28px list rows, 320px rail — because this is a professional tool used for hours a day, not a marketing surface. Generous space is reserved for canvas breathing room, not chrome.
- **Backgrounds:** flat surfaces only. No gradients, no photography, no illustration, no texture/grain — the product is an authoring chrome around the user's own content, so the chrome must recede. The canvas background is a slightly sunken neutral (`--mos-surface-canvas`) so the user's actual page content (which may itself have color/imagery) visually "sits" on the tool.
- **Animation:** short and purely functional — 120–180ms standard-ease transitions on control state changes, a 1200ms shimmer sweep (not a spinner) for the "stale, refreshing" optimistic-commit state, respecting `prefers-reduced-motion` by zeroing all durations. No bounce, no springs, no page-transition flourish — precision over delight.
- **Hover / press states:** hover = subtle background shift to `--mos-surface-hover` (a ~2% gray tint), never a color change on neutral controls; accent controls darken one step (`--mos-accent-hover`) on hover, one more (`--mos-accent-press`) on press — no scale/shrink transforms anywhere, this is a data tool, not a touch toy.
- **Borders & shadows:** 1px hairline borders (`--mos-border-subtle/default/strong`) do most of the separation work; shadow is reserved for things that float above the canvas — dialogs, popovers, the selection toolbar (`--mos-shadow-md/lg/dialog`), never on flat rail sections or list rows. No inner glow, no colored shadows.
- **Slots & selection:** governed drop zones get a dashed indigo outline + faint indigo fill (`--mos-slot-line` / `--mos-slot-fill`) — deliberately distinct from the teal selection color so "this is a data/structure zone" never gets confused with "this is selected." A required-but-empty slot uses the amber line, not red (it's a to-do, not yet an error).
- **Dark mode (designed):** elevation = lighter surface + 1px top highlight (`--mos-highlight-top`); accent lifts to #5cc0b8 with dark ink on primary; semantic backgrounds are deep tints; shadows deepen. It is not an inversion.
- **Choreography:** lift 140ms, zone highlight 100ms, insert 200ms, remove 160ms, drop settle 220ms, refused snap-back 240ms, crossfade 240ms, shimmer 1400ms loop. All collapse to 0 under reduced motion (see `ui_kits/builder/motion.html`).
- **Radius:** small and consistent — 3–4px on controls and cards, 6–8px on dialogs/popovers, pill only for status badges. No large "friendly" rounding; this reads as tool-grade, not consumer-app.
- **Cards:** 1px `--mos-border-subtle` border, 1px `--mos-shadow-xs` at rest, `--mos-radius-lg` (6px) corners, white/`--mos-surface-raised` fill — restrained, closer to a spec sheet than a marketing card.
- **Layout rules:** palette fixed-width left (264px), rail fixed-width right (320px), canvas fluid center — this three-pane shape never changes across screens; the front-end dialog reuses the identical rail so an author's muscle memory transfers.
- **Transparency/blur:** used exactly once — the dialog/media-library scrim (`--mos-surface-overlay`, ~32% black, no blur) to focus attention on a modal without obscuring the page render behind it. No frosted-glass panels elsewhere.
- **Imagery color vibe:** N/A — no photography in the product; component thumbnails in the palette are flat vector previews of the user's own components, not styled imagery.

## Iconography

No icon font, SVG sprite, or icon set was found in the accessible source material (the `mosaic_ui_ux` repo could not be read; the module source repo was not opened this pass). **Substitution, flagged:** this system links **Lucide** from CDN (`unpkg.com/lucide-static`) — a neutral, 1.5–2px stroke-weight outline set that matches the tool's precise, unornamented character and is the most common CDN choice for exactly this kind of admin/builder chrome. If the real Mosaic module ships its own icon set (Drupal core ships several across admin themes), swap this out and say so.
- Used at 16px (inline, inside controls) and 20px (palette/rail section headers) only — two sizes, no in-between.
- No emoji, no Unicode-symbol icons, no hand-drawn icons anywhere.
- Component palette thumbnails are flat, single-color line renders of the block shape (e.g. a heading glyph for `mosaic_heading`) — not photographic or 3D.

## Intentional additions

No component-source-of-truth (mounted Figma file or readable component-library codebase) was available, so the component inventory below is authored from scratch, sized to the screens the brief calls for — not lifted from a pre-existing kit.
