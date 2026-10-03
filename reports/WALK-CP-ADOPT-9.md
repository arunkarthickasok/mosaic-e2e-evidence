# CP-ADOPT-9 — authoring walk (Arun)

Site: `https://drupalak.ddev.site:33001`. The whole arc: shape_map → authoring entity → resolver (H5) →
Manage-authoring form → **rail applies the overrides** (CHECKPOINT-5). One STOP line each. «ext» = the
adopted (non-Mosaic) library whose Card you author; its real name never appears here.

## W0 — run the owned migration (Arun's walk)
**W0.1** Run **`ddev drush updb`**. EXPECT: update **mosaic_update_10004** runs and logs *"generated N
owned authoring entities"*; nothing in the builder or on any rendered page changes (the entities are empty).
→ **STOP if updb errors, or any rendered node's Mosaic output changes.**

## W1 — Field types (site-wide shape → widget)
**W1.1** Visit **/admin/config/mosaic/field-types**. EXPECT: a row per schema shape (media, formatted text,
link, select, toggle, number, text) with a **default widget** select that offers **only compatible widgets**
(Toggle offers Checkbox, never a media widget). Change **select → radios**; **Save**. EXPECT: it saves and,
on reload, Select shows **radios** with a **Reset** to defaults. → **STOP if the save errors or an
incompatible widget is offered.**

## W2 — Manage authoring on the «ext» Card: edits → rail follows
**W2.1** Visit **/admin/config/mosaic/component-libraries**; in the «ext» library row, click **"Manage
authoring →"** for **Card**. EXPECT: the form opens with a **Fields** table and the banner *"Stylable is
unavailable because «ext» owns this component's look."* → **STOP if the link is missing or the form 403/404s.**

**W2.2** Change the **Summary** field's **Label** to `Teaser text`; in another field's **Widget** select
choose **Hidden** (pick a NON-required field — e.g. a secondary field). Click **Save configuration**.
EXPECT: *"Authoring configuration saved."* → **STOP if the save errors.**

**W2.3** Open a node that uses the «ext» Card in the **builder** (node edit form) — or the **front-end edit
dialog**. EXPECT, with **no cache clear**: the Summary field's rail label now reads **"Teaser text"**, and
the field you hid is **gone from the rail**. → **STOP if the rail still shows the old label or the hidden
field.** *(Note: the Media-widget and Footer-preferred reflections are the recorded remaining polish — the
server resolves them into the manifest now; the rail applies label + hidden this checkpoint.)*

## W3 — H5 refuses hiding a required field, and blocks Save
**W3.1** Back in Manage authoring for the «ext» Card, set the **Title** (required by the library) Widget to
**Hidden**; click **Save configuration**. EXPECT: a **row error** — *"Title is required by the component and
cannot be hidden."* — and the configuration is **NOT saved** (never a silent drop). → **STOP if it saves,
or the error does not name the field.**

## W4 — Overrides only + Reset all
**W4.1** In the form, read the **"Overrides only (N)"** count — it reflects the rows that differ from the
default (your Teaser-text + hidden edits). Click **Reset to defaults**. EXPECT: *"… reset to defaults."*;
re-exporting the config entity (/admin/config/development/configuration/single/export → *Component
authoring* → the Card) shows it is **gone**. → **STOP if the override entity remains.**

**W4.2** Re-open the «ext» Card node in the builder. EXPECT: the rail is **back to defaults** — Summary is
labelled from the schema again and the hidden field is present. → **STOP if the rail still shows the overrides.**

## W5 — owned Card label round-trip (byte-identical)
**W5.1** Open **Manage authoring** for the **owned** Card (Mosaic Components). Change one field's **Label**;
**Save**; open an owned-Card node in the builder → the rail shows the new label. Then **Reset to defaults**;
re-open the node. EXPECT: the rail is **byte-identical** to before the edit (owned rail unchanged by an
empty entity). → **STOP if the owned rail differs after reset.**

*6 steps. Backing: reports/REPORT-ADOPT9-CP5.md; Vitest railApplication (5), Functional ComponentAuthoringFormTest
(4), Kernel AuthoringResolverTest (11). The rail applies label + hidden this checkpoint; capability-gating,
slot-rail, previews/patterns/order are the recorded remaining polish.*
