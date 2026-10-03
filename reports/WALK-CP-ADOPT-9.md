# CP-ADOPT-9 — authoring walk (Arun)

Site: `https://drupalak.ddev.site:33001`. The arc: shape_map → authoring entity → resolver (H5) →
Manage-authoring form → **rail applies the overrides** (CP-5/6). One STOP line each. «ext» = the adopted
(non-Mosaic) library whose Card you author; its real name never appears here.

> **Applied this far:** widget kind (cke5/plain/media/select/…), hidden, label, slot allowed/repeater,
> previews. **Not yet applied** (see REPORT-ADOPT9-CP6.md knob table): capabilities section-gating (key
> mismatch), slot preferred/open-cell, patterns-shown, rail order, help text. Steps below exercise only the
> applied knobs, so the walk does not STOP on an un-applied one.

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

*6 steps. Backing: reports/REPORT-ADOPT9-CP6.md (knob table) + WALK; Vitest railApplication (11), Functional
ComponentAuthoringFormTest (4), Kernel AuthoringResolverTest (11). The capability/patterns/rail-order/help/
preferred knobs are NOT exercised here — they are recorded as the remaining follow-up.*
