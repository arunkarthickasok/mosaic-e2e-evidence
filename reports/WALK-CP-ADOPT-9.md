# CP-ADOPT-9 — Manage authoring form walk (Arun)

Site: `https://drupalak.ddev.site:33001`. CHECKPOINT-4 = the **form** (§5.5); the **rail follows**
walk + films are CHECKPOINT-5 (client rail application). One STOP line each.

## W0 — run the owned migration (Arun's walk)
**W0.1** Run **`ddev drush updb`**. EXPECT: update **mosaic_update_10004** runs and logs
*"generated N owned authoring entities"*; the site is otherwise unchanged (the entities are empty —
no override rows — so nothing in the builder or on any rendered page changes).
→ **STOP if updb errors, or if any rendered node's Mosaic output changes.**

## W1 — reach the form from the libraries page
**W1.1** Visit **/admin/config/mosaic/component-libraries**; expand **Mosaic Components**. In the
component table, each row now has an **Authoring** column with a **"Manage authoring →"** link.
Click it for **Heading**. EXPECT: the Manage-authoring form opens with a **Fields** table (Text, Level,
Alignment) and a **Save configuration** button. → **STOP if the link is missing or the form 404/403s.**

## W2 — an override saves (overrides only)
**W2.1** In the **Text** row, change **Label** to `Body text`; leave every other field at its default.
Click **Save configuration**. EXPECT: *"Authoring configuration saved."* → **STOP if the save errors.**

**W2.2** Check the stored config: **/admin/config/development/configuration/single/export**, type
*Component authoring*, name *mosaic_heading*. EXPECT: `rows` has **exactly one** entry — `text` with
`label: 'Body text'` — and **no rows for level/alignment** (overrides only; defaults are never stored).
→ **STOP if untouched fields appear in `rows`, or the label override is missing.**

## W3 — H5 refuses hiding a required field, and blocks Save
**W3.1** Open a component with a **library-required** field (the test fixture **Adopt Required**, or any
adopted component whose schema marks a prop required). In that field's **Widget** select, choose
**Hidden**; click **Save configuration**. EXPECT: a **row error** — *"… is required by the component and
cannot be hidden."* — and the configuration is **NOT saved** (Save is blocked; never a silent drop).
→ **STOP if the form saves, or the error does not name the field.**

## W4 — reset to defaults
**W4.1** Back on **Heading** (which still has the `Body text` override from W2), click **Reset to
defaults**. EXPECT: *"… reset to defaults."*; re-exporting *mosaic_heading* shows the config entity is
**gone** (the rail is back to its shipped defaults). → **STOP if the override entity remains.**

*5 steps. CHECKPOINT-4 = the form; the **rail follows a change without a cache clear** (the entity cache
tag) + the headed films are CHECKPOINT-5. Backing: reports/REPORT-ADOPT9-CP4.md; Functional
ComponentAuthoringFormTest.*
