# ACT 2 — baseline screenshot album (A2-0a)

Every authoring surface at **desktop (1280)** and **tablet (834)** widths — the reference inventory for the
ACT 2 visual campaign. One line per frame naming **what an author sees**. NO fixes in this album (inventory
only). Suffix each frame `-d` (desktop) / `-t` (tablet).

> **Capture note (honest):** the live Puck builder closes/crashes under headless full-page screenshots
> (witnessed WC61 — bounded/immediate clips work, full-page hangs). This INDEX is the authoritative shot
> list; the frames are best captured from a **running builder** (Arun's own screenshots drive the ACT 2
> design pass — see `reports/ACT2-DESIGN-PACKET.md`). Frames present so far are listed under "Captured".

## Shot list — admin builder
| Frame id | What the author sees |
|---|---|
| `01-admin-canvas` | The WYSIWYG canvas with a representative layout; selection overlay + inline affordances. |
| `02-admin-palette` | The component palette (drag source), categories + cards. |
| `03-admin-panel` | The right settings panel for a selected component (fields stack). |
| `04-breakpoint-bar` | The wide/tablet/mobile switch + the per-breakpoint override affordance. |
| `04b-breakpoint-override-panel` | The panel state AFTER "start override" — the list of overridden props (**defect 1 witness: are these human labels or machine names?**). |
| `07-datasource-section` | The data-source binding section (view/display picker + six argument-source rows). |
| `09-media-picker` | The media-library picker opened from a Mosaic image field (F-037 state). |
| `11-template-picker` | The template splash for new content (start blank / start with a template). |
| `12-a11y-panel` | The accessibility score panel + a violation detail. |
| `13-device-preview` | The device-preview (mosaic/device_preview) at a non-wide breakpoint. |
| `14-lock-banner` | The edit-lock state banner (foreign lock / save-disabled). |
| `15-degradation-card` | A red degradation card (component failed to render / missing dependency). |

## Shot list — field-type widgets (surface #7)
| Frame id | Widget |
|---|---|
| `10-field-autocomplete` | The fixed-value entity autocomplete (label-in-field, WC59/WC61). |
| `10-field-debounced` | A debounced plain-value / url-param input (P0.5). |
| `10-field-argrows` | The contextual-filter argument rows (source dropdown + per-source input). |
| `10-field-tabs-rows` | The tabs component's per-tab rows in the panel. |
| `10-field-slides-rows` | The carousel component's per-slide rows in the panel. |
| `10-field-imagestyle` | The image-style / aspect-ratio widgets. |

## Shot list — front-end editing
| Frame id | What the author sees |
|---|---|
| `08-fe-dialog` | The FE builder dialog: chrome + panel + canvas. |
| `08b-fe-save-close` | The FE dialog's save / close controls. |
| `05-inline-edit-dialog` | The body rich-text inline-edit (CKE5 expand modal, F-066). |

## Captured (seed set)
| Frame | Surface |
|---|---|
| `01-admin-canvas-d.png` | Admin builder, desktop 1280 — full width shows palette (left) + canvas (center) + panel (right), node 780's 11-component layout. |
| `01-admin-canvas-t.png` | Admin builder, tablet 834 — same layout at tablet width. |
| `11-template-picker-d.png` | New-content template splash, desktop 1280 (node/add/page). |

The remaining shot-list surfaces are checkpointed for a capture pass on a running builder (the headless
capture is unstable per the note above; Arun's own screenshots drive the ACT 2 design pass). Runtime-render
references that film stably are in the sibling `cp-ve3/` album.
