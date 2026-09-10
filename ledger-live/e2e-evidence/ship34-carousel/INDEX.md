# SHIP #34 — carousel album INDEX

Frames from the live full-lifecycle carousel journeys (both surfaces), node 939 (v6
slides carousel) + node 940 (legacy v5 slide_N auto-migrated to v6 on save).

## L-C — panel↔canvas active-slide sync (admin, real pointer)
- `01-carousel-selected.png` — carousel selected in the builder canvas.
- `02-slide-2-expanded.png` — slide row 2 expanded → canvas shows slide 2 (`active="1"`).
- `03-collapsed-first-slide.png` — collapsed → canvas returns to slide 1 (`active="0"`).

## L-E — full lifecycle (admin)
- `04-lifecycle-loaded.png` — migrated v6 carousel loads in the canvas.
- `05-lifecycle-slides-panel.png` — panel shows the 2 migrated slides rows (captions preserved).
- `06-lifecycle-saved.png` — saved → node view.
- `07-lifecycle-reloaded-persisted.png` — reload → v6 `slides` JSON persisted (no slide_N).
- `09-page-render.png` — anonymous page renders the carousel + captions (no double-escape).

## L-E — frontend editor surface
- `10-fe-page.png` — rendered page with the frontend Edit-Layout affordance.
- `11-fe-carousel.png` — v6 carousel loads inside the frontend editor dialog.
- `12-fe-slides-panel.png` — carousel selected on the FE surface.

Reviewer audits these → Arun walk → ceremony.
