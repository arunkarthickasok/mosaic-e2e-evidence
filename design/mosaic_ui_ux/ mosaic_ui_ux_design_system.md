# Mosaic 1.0 — authoring UI/UX design system

Built 2026-09-20. Design-only: no module code was touched, no git ran against the Mosaic repo.

## Where it lives

- **Design System artifact** (private): https://claude.ai/artifact/GWs9f2nDDEqiGBJDmok4M5 — tokens, 18 component cards with guidelines, 17 screen cards, cover, brand book, four guideline sections.
- **Repo** `arunkarthickasok/mosaic_ui_ux` — NOT yet pushed. The cloud sandbox's git proxy refused it ("not in this session's authorized repository set"). Delivered as `mosaic_ui_ux.bundle` (one commit, full tree) plus `PUSH-TO-GITHUB.md`. To push from a future Cowork session, the repo must first be added to that session's sources.

## What the system decided

- `brand` = deep teal `#0d5c55` — deliberately not Claro's or Gin's blue. Spent on four things only: primary button, selection outline, drop indicator, active tab.
- `data` = violet `#5b3e8c`, reserved for binding. A violet surface in Mosaic always means "this comes from somewhere else".
- Public Sans (USWDS face) + IBM Plex Mono. Hosted, no files bundled; layouts verified in the fallback stack too.
- Every rule scoped to `.mosaic`, every value a token, nothing read from an admin theme. `.mosaic` neutralises inherited element styling then rebuilds.
- Rail = five stacked sections (Content · Data · Style · Responsive · Accessibility), each present only when the component's schema can use it. Sections not tabs, because tabs hide state. No settings page for sections.
- Inside an outside library's component: Style/Responsive **absent** (not disabled) + one ownership line. Binding still works.
- Violations shown, never refused. Save is what stops.
- Optimistic commit + stale shimmer. No blocking overlay anywhere.
- Colour never the only cue — glyph + word on every badge and banner.
- 122 documented contrast pairs, both themes, 0 failing (`tools/contrast.js`).

## Files worth reusing in the module

`tokens/tokens.json` → `tokens/tokens.css` (generated), `src/mosaic-ui.css`, `src/mosaic-ui.d.ts` (React prop contracts), `src/mosaic-ui.js` (framework-neutral behaviour layer). The React/Puck layer should render these exact class names so design and implementation cannot drift.

## Open items

- Push to GitHub still owed.
- Screens 7, 8 and 9 are desktop-only (they are state and theme studies that reuse screens 1–6's layouts).