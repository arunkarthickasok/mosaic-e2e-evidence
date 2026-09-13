# SHIP #34 — carousel album (v2 re-film, WALK-CATCHES #50–#54)

Frames from the live full-lifecycle carousel journeys, re-filmed from zero after
Arun's walk 2026-09-10 surfaced five defects (#50–#54). The prior "both hosts"
sync claim was VOIDED and is re-proven here with a **geometry oracle** — which
slide's centre actually sits inside the carousel viewport — not the `active`
attribute alone (the attribute passed during the walk while nothing moved because
the shadow had no adopted styles).

Fixtures (provisioned in the scratch DB):
- **node 942** — v6 `slides` carousel, 3 image slides (items slot).
- **node 943** — legacy v5 slide_N carousel, auto-migrates to v6 on load/save.

## #53 — anonymous page slider (geometry e2e, `carousel-slider-geometry.spec.ts`)
Assertion-only (no frame): on `/node/942` the carousel is clipped to ONE slide,
the next arrow advances 0→1→2, the loop wraps 2→0, prev wraps 0→2, and the dots
track the active slide. Before the fix every slide stacked as a vertical list and
the arrow slid the whole set off-screen (Lit's static styles were never adopted
into the hydrated declarative-shadow-DOM root).

## #54 — panel↔canvas sync, ADMIN host (`ship34-carousel-sync.spec.ts`)
- `01-admin-carousel-selected.png` — carousel selected; clipped to slide 0.
- `02-admin-slide-2-expanded.png` — slide row 2 expanded → canvas SHOWS slide 1 (geometry-verified, `active="1"`).
- `03-admin-collapsed-first-slide.png` — collapsed → canvas returns to slide 0.

## #52 — full lifecycle, ADMIN (`ship34-carousel-lifecycle.spec.ts`, node 943)
- `04-lifecycle-loaded.png` — migrated v6 carousel loads in the canvas.
- `05-lifecycle-slides-panel.png` — panel shows the 2 migrated slides rows (captions preserved); NO legacy slide_N fields (#50).
- `06-lifecycle-saved.png` — saved → node view.
- `07-lifecycle-reloaded-persisted.png` — reload → v6 `slides` JSON persisted (no slide_1).
- `09-page-render.png` — anonymous page renders the carousel + captions (no double-escape).

## #51 + #54 — frontend editor surface (`ship34-carousel-fe.spec.ts`, node 942)
- `10-fe-page.png` — rendered page with the frontend Edit-Layout affordance.
- `11-fe-carousel.png` — v6 carousel loads inside the FE dialog, clipped to one slide (captions NOT stacked; media image resolves — #51).
- `12-fe-slide-2-shown.png` — slide row 2 expanded → FE canvas SHOWS slide 1 (geometry parity with admin — #54 sync).
- `13-fe-collapsed.png` — collapsed → FE canvas returns to slide 0.
