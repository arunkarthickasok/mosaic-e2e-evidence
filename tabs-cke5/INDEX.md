# tabs-cke5 — CP-BODY-CKE5 + CP-EDIT20 journey album (v2)

CKEditor 5 body editor (expand modal) replacing the old in-panel TipTap fork.
Three green full-lifecycle Playwright journeys, captured under the evidence-quality
law (fullPage overviews / targeted assertion-region frames, deviceScaleFactor 2).
Each journey uses a throwaway scratch node, auto-deleted (DB net-zero).

**v2 (CP-EDIT20, editor UX hardening #39–44):** the media-insert steps are now driven
by REAL pointer interactions (locator.click / page.mouse — never evaluate-click) and
assert z-order via `document.elementFromPoint` at the target's centre. The `media-library`
frames prove the library lands **on top and is clickable** — admin (#40, modal z-index
below Drupal's jQuery-UI dialog) and frontend (#43, the library is moved INTO the
top-layer `<dialog>`). Other CP-EDIT20 items (fixed-shell modal, panel Body label + 3-line
clamp preview, panel↔canvas active-tab sync, save-while-open guard) are covered by unit
tests; see `reports/REPORT-CKE5.md`.

## Admin surface — `tabs-cke5-journey.spec.ts`
open seeded Tabs → Edit body (CKE5) → insert media → Apply → save → reload → render.

| Frame | Shows | Proves |
|-------|-------|--------|
| `01-builder-open.png` | Admin builder open on the seeded Tabs node | step 01 — builder loads the layout |
| `02-tab-set-expanded.png` | Tab set expanded: "Edit body" preview button | step 02 — richtext is a preview+button, `.ProseMirror` count 0 → TipTap gone |
| `03-cke5-open.png` | CKE5 "Body" modal, editor attached, dimmed backdrop | step 03 — `Drupal.editorAttach` mounts CKE5 in the modal |
| `04-media-library.png` | Drupal media library dialog opened from CKE5 | step 04 — the drupalMedia toolbar button works |
| `05-media-in-cke5-body.png` | **Inserted image VISIBLE inside the CKE5 body** | step 04 assertion — media lands in `.ck-content` (MONEY FRAME) |
| `06-applied.png` | Modal closed after Apply | step 05 — serialized layout carries `drupal-media` |
| `07-saved.png` | Node saved, redirected to `/node/N` | step 06 — save succeeds |
| `08-reloaded-persisted.png` | Builder reloaded | step 07 — persisted field JSON still has `drupal-media` |
| `09-page-render.png` | Anonymous published page | step 08 — tabs + media render for visitors |

## Frontend surface — `tabs-cke5-fe-journey.spec.ts`
FE editor (top-layer `<dialog>`, S3) → same CKE5 body flow → FE save → reopen.

| Frame | Shows | Proves |
|-------|-------|--------|
| `FE-01-fe-open.png` | FE editor open in the top-layer `<dialog>` | step 01 — FE builder loads |
| `FE-02-fe-expanded.png` | Tab set expanded, "Edit body" present | step 02 — `.ProseMirror` count 0 → TipTap gone on FE too |
| `FE-03-fe-cke5-open.png` | CKE5 modal INSIDE the top-layer dialog | step 03 — modal in `dialog.mosaic-fe-dialog[open]` (S3) |
| `FE-04-fe-media-library.png` | Media library opened from CKE5 on FE | step 04 — F-090 media stacks above the dialog |
| `FE-05-fe-media-in-cke5.png` | **Inserted image VISIBLE inside the CKE5 body (FE)** | step 04 assertion (FE MONEY FRAME) |
| `FE-06-fe-applied.png` | Body preview reflects the media after Apply | step 05 — onChange propagated before save |
| `FE-07-fe-saved.png` | FE dialog closed after save | step 06 — FE save path succeeds |
| `FE-08-fe-reopened-persisted.png` | FE editor reopened on the saved node | step 07 — drush server-truth: `field_mosaic_layout` has `drupal-media` |

## False-dirty untouched-page — `false-dirty-untouched.spec.ts`
Open a saved layout, touch nothing, close → no unsaved prompt (walk-catch #37 P3).

| Frame | Shows | Proves |
|-------|-------|--------|
| `P3-untouched-open.png` | Saved layout open in the FE editor, untouched | setup — Puck mount-fire onChange has fired |
| `P3-untouched-closed-clean.png` | Editor closed cleanly | assertion — NO `mosaic-unsaved-prompt`; false-dirty cured (RED→GREEN) |

Total: 19 frames (admin 9 · frontend 8 · false-dirty 2).
