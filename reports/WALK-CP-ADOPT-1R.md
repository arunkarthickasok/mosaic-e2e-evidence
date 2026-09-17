# CP-ADOPT-1R — re-walk W3 + W4 (Arun, after the rider)

Site: `https://drupalak.ddev.site:33001`. Only the two catch areas. One STOP line each.

## W3 — restricted keeps the component for ADMIN (WC#63)
**W3.1** Visit **/admin/config/mosaic/component-libraries**; expand **Mosaic Components**. For the **Button**
row, confirm **Enabled is CHECKED** (it should already be). Tick **Restricted**; click **Save libraries**.
→ **STOP if, on reload, Button's Enabled is not still checked or Restricted did not persist.**

**W3.2** As **admin** (you), open **/node/add/page**. EXPECT: **Button IS present** in the palette (admin
retains restricted components). → **STOP if Button is missing for admin.**

**W3.3** In a second browser as a **non-admin author** (builder access, no *Administer Mosaic*), open the
builder / FE edit dialog. EXPECT: **Button is ABSENT**. → **STOP if the author sees Button.** Then untick
**Restricted** on the libraries page + **Save** to restore.

## W4 — node-type allowlist persists (WC#64)
**W4.1** Visit **/admin/structure/types/manage/article**; open **Mosaic component governance**. Tick exactly
**three** components under **Allowed components**; click **Save**. → **STOP if the save errors.**

**W4.2** Re-open **/admin/structure/types/manage/article** → **Mosaic component governance**. EXPECT: **the same
three checkboxes are still ticked** (the allowlist persisted). → **STOP if any of the three is unticked.**

**W4.3** Open **/node/add/article**. EXPECT: the palette shows **only those three** Mosaic components.
→ **STOP if more or fewer than three appear.** Untick all three + **Save** to restore "all allowed".

*6 steps. Backing: reports/REPORT-CP-ADOPT-1.md §R, album ledger-live/e2e-evidence/cp-adopt-1r/.*
