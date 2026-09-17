# WALK — CP-ADOPT-2 (Panel from schema) — Arun eye-test

Recipe-grade, 4 steps. Prereq: on the dev site, logged in as an admin who may build Mosaic layouts. The claim
under test: **the panel is now derived from PHP `prop_descriptors`, byte-identical for owned components**;
adopted components are graded + described but stay out of the palette; the save path gained a shape guard.

---

## Step 1 — an owned panel is UNCHANGED (byte-identical derivation)
1. Go to **`/node/add/page`**.
2. In the Mosaic builder, add a **Card** component (Content category) and select it.
3. Confirm the property panel shows exactly these fields, with these labels, in this order:
   - **Title** (text)
   - **Description** (text)
   - **Image Url** (text)
   - **Image Alt** (text)
   - **Link Url** (text)
   - **Link Text** (text)
   - **Variant** (select: *default*, *horizontal*)
   - …followed by the standard Mosaic controls (Spacing, Style overrides, breakpoint, visibility, data source).
4. **Expected:** identical to before ship #41 — same fields, same labels, same widget types. Nothing added,
   removed, or relabelled. (Under the hood these fields now come from the PHP prop-shape registry via
   `manifest.prop_descriptors`, but the produced Puck fields are byte-identical — proven by
   `PropDescriptors.test.ts` and by the node/780 shasum in Step 4.)

## Step 2 — the libraries page shows an ADOPTED component, graded (Olivero → teaser)
1. Go to **`/admin/config/mosaic/component-libraries`**.
2. Open the **Olivero** library (a theme-provided library, discovered with the `.mosaic.yml` gate removed).
3. Find **teaser** and open its living-docs / readiness detail.
4. **Expected:** teaser is graded **Attention**, and its single prop **`attributes`** is listed as needing
   attention — reason: *"Drupal\Core\Template\Attribute has no known field shape — falls to a raw text input."*
   This is the F-108 fix visible: before, an adopted component surfaced **no** prop detail at all (its schema
   was invisible to Mosaic); now its full descriptor set (here, one prop) is derived from the core SDC schema.
5. Confirm teaser is **NOT** offered in the builder palette on `/node/add/page` (Step 1) — adopted components
   stay palette-guarded in ADOPT-2; the palette opens in a later CP.

## Step 3 — save-time shape validation (H5)
**Honest note — this is a machine-only cell.** The H5 rule rejects a formatted-text (HTML) prop that carries
content but declares no text format, and rejects an out-of-range enum. On a shipped component there is **no UI
path to reach it**: an enum renders as a *select* (you can only pick a valid option), and an owned rich-text
field always ships with a format picker (field_types richtext), so an author cannot hand the server an HTML
value with no format. The guard exists for **hand-crafted POST / config-import payloads** that bypass the UI.
1. If you want to see it bite, it is exercised by the Kernel oracle **`PropShapeSaveValidationTest`** (4 cells:
   invalid enum rejected, HTML-without-format rejected, unknown prop tolerated, valid passes), run against the
   real `MosaicPropValidator::validate()` with the `mosaic_test_shape` fixture. There is no author-facing UI
   step — stated plainly rather than inventing one.
2. **Expected (UI):** normal authoring is unaffected — you never see a shape error for valid content, and the
   Preview/Save path behaves exactly as before.

## Step 4 — anonymous render is UNCHANGED
1. Open **`/node/780`** in a private/incognito window (anonymous).
2. **Expected:** the page renders exactly as before — this fixture host's Mosaic region is byte-identical.
   Machine check (optional): `ddev exec bash web/modules/custom/mosaic/scripts/qa/region-shasum.sh
   http://localhost/node/780` prints
   `14e6cb9c17dc61b90a86dd97d8957ae462d789ff854d3523ae581010a43e0dec 3954` — the same before and after ship #42.

---

### If all four hold: CP-ADOPT-2 is walk-green. The panel derivation moved to PHP with zero author-visible
### change, adopted components are now describable, and the save path is guarded — the ship #42 human-commit
### (27 files; the held SdcComponentPlugin.php is NOT in the set) closes CP-ADOPT-2.
