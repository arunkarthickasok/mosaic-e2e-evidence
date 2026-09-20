# CP-ADOPT-5 P1d-A-CONT2 — evidence album (canvas bound-render + bind journey)

Fixture: node 992 = owned Columns whose column_1 is bound to the View
`mosaic_j8_articles` (block_1, limit 3), child_type mosaic_card, field_map
{title: title}. View `mosaic_j8_articles` is a journey fixture (fields row,
title field, status filter, mini pager).

## Files
- `J8-JOURNEY.json` — the headed journey result (canvas cards, result line,
  viewport survival, page cards, geometry).
- `geometry.json` — cards non-overlapping (cardsOverlap:false); result line
  inside the zone bounds (resultLineInsideZone:true).
- `j8-01-canvas-bound.png` — the canvas showing the 3 bound Cards + result line.
- `WC73-WITNESS.json` — the WC#73 viewport-switch regression witness (CHECKPOINT-5).
- `BIND-PANEL.json` / `bind-panel.png` — the bind control in the real panel (CHECKPOINT-6).

## Result-line text captured
`3 of 4 · J8 Articles`  (shown 3 · total 4 from the mini pager's has-next probe · View label)

## Journey claims proven (headed Chrome)
1. Canvas renders the bound rows: 3 Cards (cardsOnCanvas=3), one bound-slot SSR request.
2. Result line under the zone: "3 of 4 · J8 Articles".
3. Desktop→Mobile→Desktop viewport switch keeps every node (WC#73 cell reused).
4. The saved page renders the same 3 Cards (pageCards=3).
5. Geometry: cards non-overlapping; result line inside the zone bounds.
