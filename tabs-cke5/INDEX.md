# tabs-cke5 — CP-BODY-CKE5 + CP-EDIT20 + CP-EDIT21 journey album (v3)

CKEditor 5 body editor (expand modal) replacing the old in-panel TipTap fork, plus
two rounds of editor-UX hardening. Three green full-lifecycle Playwright journeys,
captured under the evidence-quality law (fullPage overviews / targeted assertion-region
frames, deviceScaleFactor 2). Each journey uses a throwaway scratch node, auto-deleted
(DB net-zero). Media steps use REAL pointers + a `document.elementFromPoint` z-order
oracle (never evaluate-click).

**v3 (CP-EDIT21, editor UX round 2):** the format select moved INTO the modal (changing
it re-attaches CKE5 with that format's toolbar — RED→GREEN); the modal fits content with
the CKE5 editable as the only scroller; the panel preview is a plain-text excerpt (no
more giant-heading-in-a-tiny-box). See `reports/REPORT-CKE5.md` for W0–W5 detail incl.
the W4 FE-media iframe spike verdict (STOP + report).

## Admin surface — `tabs-cke5-journey.spec.ts`
open seeded Tabs → W3 plain-text preview → CKE5 modal (W1 geometry) → W2 format
re-attach + bridge persistence → insert media (real pointer + z-order) → Apply → save →
reload → anonymous render.

| Frame | Shows | Proves |
|-------|-------|--------|
| `01-builder-open.png` | Admin builder on the seeded Tabs node | builder loads the layout |
| `02-tab-set-expanded.png` | Panel: "Body" label + **plain-text excerpt** + Edit body | W3 — excerpt is body-size text (<18px), no child markup, no scrollbar (contrast W0's 32px) |
| `03-cke5-format-fullhtml.png` | Modal after selecting **Full HTML** | W2 — editor re-attached with full_html (toolbar swaps); bodyFormat persisted via the bridge |
| `04-cke5-open.png` | CKE5 "Body" modal (back on Basic HTML) | W1 — fits-content modal, in-modal format select under the editable, ≤1 scroller |
| `05-media-library.png` | Media library open from CKE5 | media button works; z-order oracle = library on top (#40) |
| `06-media-in-cke5-body.png` | **Inserted image inside the CKE5 body** | media lands in `.ck-content` (MONEY FRAME) |
| `07-applied.png` | Modal closed after Apply | serialized layout carries `drupal-media` |
| `08-saved.png` | Node saved | save redirects to `/node/N` |
| `09-reloaded-persisted.png` | Builder reloaded | persisted field JSON still has the media |
| `10-page-render.png` | Anonymous published page | tabs + media render for visitors |

## Frontend surface — `tabs-cke5-fe-journey.spec.ts`
FE editor (top-layer `<dialog>`, S3) → same CKE5 body flow → FE save → reopen.

| Frame | Shows | Proves |
|-------|-------|--------|
| `FE-01-fe-open.png` | FE editor in the top-layer `<dialog>` | FE builder loads |
| `FE-02-fe-expanded.png` | Tab set expanded, Edit body present | no `.ProseMirror` (TipTap gone) on FE |
| `FE-03-fe-cke5-open.png` | CKE5 modal INSIDE the top-layer dialog | modal in `dialog.mosaic-fe-dialog[open]` (S3) |
| `FE-04-fe-media-library.png` | Media library on top inside the FE dialog | z-order oracle = media-library (#43 dialog-mover) |
| `FE-05-fe-media-in-cke5.png` | **Inserted image inside the CKE5 body (FE)** | FE MONEY FRAME |
| `FE-06-fe-applied.png` | Body preview reflects the seeded text after Apply | onChange propagated before save |
| `FE-07-fe-saved.png` | FE dialog closed after save | FE save path succeeds |
| `FE-08-fe-reopened-persisted.png` | FE editor reopened | drush server-truth: `field_mosaic_layout` has the media |

## False-dirty untouched-page — `false-dirty-untouched.spec.ts`
| Frame | Shows | Proves |
|-------|-------|--------|
| `P3-untouched-open.png` | Saved layout open, untouched | Puck mount-fire has run |
| `P3-untouched-closed-clean.png` | Editor closed cleanly | NO unsaved prompt; false-dirty cured (#37) |

Total: 20 frames (admin 10 · frontend 8 · false-dirty 2). The W0 RED baseline is recorded
by the witness test's live computed-value oracles in `reports/REPORT-CKE5.md` (the RED
screenshots were lost to a shot-helper bug and cannot be re-captured post-fix).
