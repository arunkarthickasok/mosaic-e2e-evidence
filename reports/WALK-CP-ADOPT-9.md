# CP-ADOPT-9 — authoring walk (Arun)

Site: `https://drupalak.ddev.site:33001`. The arc: shape_map → authoring entity → resolver (H5) →
Manage-authoring form → **rail applies the overrides** (CP-5/6). One STOP line each. «ext» = the adopted
(non-Mosaic) library whose Card you author; its real name never appears here.

> **Applied (13/14):** widget kind, hidden, label, slot allowed/repeater, previews, capabilities, default,
> rail order, open-cell, **required marker**, **help**, **slot preferred**. **Not yet applied (1)** —
> patterns-shown (architectural blocker — see REPORT-ADOPT9-CP8.md). Steps below exercise only applied knobs.
>
> **CHECKPOINT-9 adds (image prop + help-from-schema + `replaces`):** steps W6–W8 below.

## W0 — run the owned migration (Arun's walk)
**W0.1** Run **`ddev drush updb`**. EXPECT: update **mosaic_update_10004** runs and logs *"generated N owned
authoring entities"*; nothing in the builder or on any rendered page changes. → **STOP if updb errors, or
any rendered node's Mosaic output changes.**

## W1 — Field types (site-wide shape → widget)
**W1.1** Visit **/admin/config/mosaic/field-types**. Change **select → radios**; **Save**. EXPECT: it saves;
on reload Select shows **radios** + a **Reset**, and no incompatible widget is ever offered (Toggle offers
Checkbox, never media). → **STOP if the save errors or an incompatible widget appears.**

## W2 — Manage authoring on the «ext» Card: widget kind + relabel + hide → rail follows
**W2.1** Visit **/admin/config/mosaic/component-libraries**; click **"Manage authoring →"** for the «ext»
**Card**. EXPECT: the form + the banner *"Stylable is unavailable because «ext» owns this component's look."*
→ **STOP if the link is missing or the form 403/404s.**

**W2.2** Make these edits, then **Save configuration**:
- **Media** field Widget → **Image fill**.
- **Summary** field Widget → **Plain text**, and its Label → `Teaser text`.
- A NON-required secondary field Widget → **Hidden**.
EXPECT: *"Authoring configuration saved."* → **STOP if the save errors.**

**W2.3** Open an «ext»-Card node in the **builder** (or the **front-end edit dialog**). EXPECT, with **no
cache clear**: **Media** now shows the **image-fill row ("+ Add image")**, **Summary** is a **one-line text
field labelled "Teaser text"**, and the hidden field is **gone from the rail**. → **STOP if any of the three
is not reflected.**

## W2b — capabilities: untick Bindable → the Data section drops
**W2b.1** In Manage authoring for the «ext» Card, for a bindable field (e.g. Summary) **untick Bindable**;
**Save**. Open the «ext»-Card node in the builder and select that field. EXPECT: the field no longer offers
**"Bind to data"** (the Data section is gone for it). → **STOP if the field still shows a Data/bind control.**
Re-tick Bindable + Save to restore.

## W2c — rail order + open cell
**W2c.1** (rail order) In the form, use **Show row weights** to drag **Summary** above **Media** (or set its
weight lower); **Save**. Open the node in the builder. EXPECT: the rail renders **Summary before Media**.
→ **STOP if the order did not change.**

**W2c.2** (open cell) For the **Footer** slot, tick **Open cell**; **Save**. On the canvas, open the Footer
drop zone. EXPECT: it now accepts **plain content** (text/image) in addition to its allowed children.
→ **STOP if plain content is still refused in Footer.**

## W2d — help text + required marker
**W2d.1** (help) For the **Summary** field, set **Help** to `Keep it under 200 characters.`; **Save**. Open
the node in the builder and select Summary. EXPECT: the help line **"Keep it under 200 characters."** shows
**under the control**. → **STOP if the help line is missing.**

**W2d.2** (required) For a field that is **required by the library** (e.g. the «ext» Card's Title, or the
adopt_required fixture's Title), open Manage authoring. EXPECT: in the builder rail, that field's label
carries a **`*`** marker. → **STOP if a library-required field is not marked.**

## W3 — H5 refuses hiding a required field, and blocks Save
**W3.1** In the form, set **Title** (required by the library) Widget to **Hidden**; **Save**. EXPECT: a row
error — *"Title is required by the component and cannot be hidden."* — and **nothing is saved**. → **STOP if
it saves, or the error does not name the field.**

## W4 — previews off, then reset all
**W4.1** Untick **"Show example previews for untouched fields"**; **Save**. Open an «ext»-Card node whose
Card has untouched fields. EXPECT: the untouched fields no longer show the greyed **EXAMPLE** preview content
(previews off). → **STOP if the example badges still show.**

**W4.2** Back in the form, click **Reset to defaults**. EXPECT: *"… reset to defaults."*; re-open the node —
the rail is **back to defaults** (Media is the default widget again, Summary is schema-labelled, the hidden
field is present, examples return). → **STOP if any override remains.**

## W5 — owned Card label round-trip (byte-identical)
**W5.1** **Manage authoring** for the **owned** Card → change one Label → **Save** → the owned-Card node's
rail shows it → **Reset to defaults** → re-open: the rail is **byte-identical** to before. → **STOP if the
owned rail differs after reset.**

## W6 — the «ext» Card's IMAGE is a media picker, and the page shows the image (CHECKPOINT-9)
**W6.1** Open an «ext»-Card node in the **builder**. EXPECT: the Card's inline image field shows **"Card
Image"** with **OUR media picker** (a "Choose media" button + a greyed EXAMPLE badge for the untouched
default), NOT raw `src`/`alt`/`width`/`height` text boxes. It sits **before** the HTML media fill in the
rail. → **STOP if the image field is raw text boxes, or the picker is missing.**

**W6.2** Pick a media item; **Save** the node; view it anonymously. EXPECT: the **chosen image renders** on
the page (an `<img>` with the picked file's URL + alt). → **STOP if the page shows no image / a broken src.**

**W6.3** (x-allowed-schemes) If the «ext» Card's image declares `x-allowed-schemes` that excludes the
picked media's file scheme, **Save** EXPECT: a row error naming the offending scheme — *"…image is stored on
the 'public://' scheme, which this component does not allow…"* — and **nothing is saved**. → **STOP if a
disallowed-scheme image saves.**

## W7 — help lines come from the schema description (CHECKPOINT-9)
**W7.1** Select an owned field whose SDC prop declares a `description` (e.g. Columns' **gap**). EXPECT: the
schema description shows **as the help line under the control**, with **no Manage-authoring override set**.
Then set a Manage-authoring **Help** override for that field → the override **replaces** the description.
→ **STOP if no help line appears for a described prop, or the override does not win.**

## W8 — a replaced component is hidden, its replacement offered (CHECKPOINT-9)
**W8.1** (only when a library ships a `replaces:` profile) Visit **/admin/config/mosaic/component-libraries**.
EXPECT: the replaced component's row carries **"Replaced by {successor} — not offered in the palette."**
Open the builder: the replaced component is **absent from the palette**, the successor is **present**. A
page already built with the replaced component still **renders** unchanged. → **STOP if the replaced
component still appears in the palette, or an existing page using it breaks.**

*9 steps. Backing: reports/REPORT-ADOPT9-CP9.md (image/help/replaces) + CP6 knob table; Vitest
railApplication (26), Kernel MosaicPropResolverTest + InlineImageTest + ComponentReplacesTest +
AuthoringResolverTest, Functional ComponentAuthoringFormTest. Patterns-shown is the one deferred knob.*
