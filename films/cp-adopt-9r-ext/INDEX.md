# Films — CP-ADOPT-9R «ext» A–J + W2/W6/W9 (2026-10-08)

Headed Chromium (headless:false), dev `https://drupalak.ddev.site:33001`, admin via `drush uli`. Parent: ship
#49 `0276f01` + the #50 batch (A2 + W8). Full table + the H/I shasum journeys + the probe results:
`reports/REPORT-REHEARSAL-EXT.md`.

**Naming ban:** the external library is referred to only as «ext». Its admin surfaces (libraries page,
field-types, authoring form) render its machine name as visible text, so — per the ban — **no screenshots of
those surfaces are taken**; those journeys are confirmed by DOM-probe booleans logged in the report as «ext».
Only the rendered node + the anonymous page are filmed (visual components, no machine-name text).

| File | Journey | Shows |
|---|---|---|
| D-ext-accordion-render.png | D — Slots + items | The «ext» accordion node (node/1003) rendering its items — a real adopted component with a populated slot |
| J-ext-anon.png | J — Anonymous render | Anonymous visitor on node/1003: the «ext» accordion rendered, logged out, **0 console errors** |

A, B, C, F, W2, W6, W9 are confirmed by DOM-probe booleans (no screenshot, per the ban); E and G are
automated-proven; H and I are deterministic shasum journeys. All results are in the report.
