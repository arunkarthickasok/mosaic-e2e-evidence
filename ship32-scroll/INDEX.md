# ship32-scroll — SHIP #32 Z1 (F-094 canvas scroll) + Z2 (Preview-toggle removed)

Progress evidence for ship #32's completed items. Full detail:
[`../reports/REPORT-SHIP32.md`](../reports/REPORT-SHIP32.md).

| Frame | Shows | Proves |
|-------|-------|--------|
| `01-admin-canvas-scrolled.png` | Admin builder, tall layout, canvas scrolled via real wheel | **Z1 F-094** — admin `_PuckCanvas-root` now scrolls (scrollTop 0→900), parity with FE |
| `02-fe-canvas-scrolled.png` | FE dialog, same tall layout scrolled | Z1 parity — FE canvas scrolls (the known-good) |
| `03-builder-no-preview-tab.png` | Admin builder toolbar after Z2 | **Z2** — no Edit/Preview mode tabs; canvas still renders + breakpoint buttons remain |

Z1: `builder.css` scopes `overflow:hidden` to non-root PuckCanvas + gives `_PuckCanvas-root`
`overflow-y:auto` (FE chain). Z2: the Edit/Preview mode-swap + MosaicPreview removed from
BuilderApp (Arun-ratified); server `/mosaic/render-preview` route left, retirement ledgered.
