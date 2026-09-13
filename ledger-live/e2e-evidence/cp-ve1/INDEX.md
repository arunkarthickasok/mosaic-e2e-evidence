# CP-VIEWS-EMBED-1 — walk album (cp-ve1) — 8/8 GREEN (post F-104 fix)

Fixtures: node 970 embeds cpve1_list/embed_1 (paged mini-pager AJAX view over 20 "CPVE1 Article"
nodes + a nid contextual filter, default_action=ignore); node 971 embeds the DISABLED cpve1_off.

- `01-admin-placeholder-card.png` — admin canvas: mosaic_view PLACEHOLDER card (view · display ·
  argument summary · "Renders on the published page"). R-V1 no live render. ✅
- `02-admin-panel-label-law.png` — admin panel (post F-104): the cascading picker with HUMAN
  labels ("CPVE1 recent articles" / "Embed: list"), the argument row "The node ID", and the
  PANEL-LABEL-LAW string **"View default (CPVE1 recent articles)"**; the machine view id
  (cpve1_list) never appears. ✅
- `03-fe-dialog-placeholder-card.png` — FE dialog: same placeholder card (F-087 parity). ✅
- `04a-page-pager-before.png` / `04b-page-pager-after.png` — anon page: the real view + mini
  pager; the AJAX "Next" click swaps the rows (Article 1|2 → 3|4). ✅
- `05a-canvas-red-card.png` — disabled view → red "View no longer exists" card on the canvas. ✅
- `05b-page-empty.png` — the disabled view renders nothing on the page (F-058). ✅
- `06-anon-page.png` — anon parity of the page render. ✅

F-104 (field_types dropped for PHP-class components) is FIXED — the panel picker is now reachable
(frame 02). Mechanism + RED excerpt in REPORT-CP-VE1.md.
