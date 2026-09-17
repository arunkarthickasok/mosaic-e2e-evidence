# CP-ADOPT-1 — recipe-grade WALK for Arun (eye-test before ship #41)

Every click spelled out, exact expects, one STOP line each. Site: `https://drupalak.ddev.site:33001`.
J2 (the governance round-trip) first — it is the eye-test moment. Pick any content type that uses the Mosaic
builder for the palette checks (a fresh **/node/add/page** works).

---

## W1 — J2 governance round-trip (THE eye-test)

**W1.1** Visit **/admin/config/mosaic/component-libraries**. Find the **Mosaic Components (module)** section;
untick **"Library enabled"**; click **Save libraries**. EXPECT: "Component libraries saved."
→ **STOP if the save errors or the checkbox does not persist unticked on reload.**

**W1.2** Open the builder: **/node/add/page**. Look at the component palette (left rail). EXPECT: the Mosaic
components (Button, Card, Columns, Heading, Image, Text, Tabs, Carousel …) are **gone** from the palette; only
non-`mosaic_components` items (e.g. the View / Webform embed) remain. → **STOP if any Mosaic Components palette
item is still offered.**

**W1.3** Go back to **/admin/config/mosaic/component-libraries**, re-tick **Mosaic Components → Library
enabled**, **Save libraries**. Reopen **/node/add/page**. EXPECT: the palette is **refilled** — the same
Mosaic components return, in the **same section order and with the same labels** as before W1.1.
→ **STOP if the palette does not fully refill or the order/labels differ.**

---

## W2 — J1 the libraries page (inventory + grading)

**W2.1** Visit **/admin/config/mosaic/component-libraries**. EXPECT: exactly **four** library sections, in
this order — **Mosaic Components (module)**, **Mosaic Views (module)**, **Mosaic Webform (module)**, **Olivero
(theme) — theme-bound**. Sections do not overlap; each is a collapsible panel.
→ **STOP if a library is missing, out of order, or overlapping.**

**W2.2** Expand **Olivero (theme)**. EXPECT: its one component **`olivero:teaser`** shows the grade **Attention**
with a reason naming the `attributes` prop ("…no known field shape…"), plus a **fields/slots** count. The
Olivero library checkbox is **off** by default (adopted libraries start off).
→ **STOP if olivero:teaser is absent, ungraded, or the library defaults on.**

**W2.3** Open the builder on any node and inspect the palette. EXPECT: **`teaser` (Olivero) is NOT in the
author palette** — adopted components are governed on this page but not authored yet.
→ **STOP if teaser appears in the builder palette.**

---

## W3 — J3 per-component enable + restrict (Permission-Parity)

**W3.1** On **/admin/config/mosaic/component-libraries**, in **Mosaic Components**, untick **Enabled** for the
**Button** row; **Save**. Open **/node/add/page** (admin). EXPECT: **Button is absent** from the palette.
→ **STOP if Button still appears.** Re-tick **Enabled**, **Save**.

**W3.2** In the same row, tick **Restricted** for **Button**; **Save**. As **admin**, open **/node/add/page** →
EXPECT Button **present**. In a second browser (or incognito) as a non-admin **author** with builder access,
open the same builder (admin) or the front-end edit dialog → EXPECT Button **absent**.
→ **STOP if the author sees a restricted component, or the admin does not.** Untick **Restricted**, **Save**.

---

## W4 — J4 per-bundle allowlist (back-compat)

**W4.1** Edit a content type at **/admin/structure/types/manage/page**; open **Mosaic component governance**;
tick exactly three components under **Allowed components**; **Save content type**. Open **/node/add/page**.
EXPECT: the palette shows **only those three** Mosaic components. → **STOP if more or fewer than three appear.**
Clear all three (leave unchecked) + **Save** to restore "all allowed".

**W4.2** (Back-compat) A content type that already had an allowlist before this ship must behave unchanged —
its stored allowed set still limits the palette exactly as before. → **STOP if an existing allowlisted bundle's
palette changed.**

---

## W5 — J5 published pages unchanged (anon)

**W5.1** In a private/incognito window (anonymous), visit a published Mosaic page, e.g. **/node/780**. EXPECT:
it renders exactly as before this ship — every component present, no missing-component placeholders, no visual
change. → **STOP if any component fails to render or the layout shifts.**

---

*9 steps. Backing evidence: reports/REPORT-CP-ADOPT-1.md (P0–P4), album ledger-live/e2e-evidence/cp-adopt-1/.
No ship #41 ceremony without this walk.*
