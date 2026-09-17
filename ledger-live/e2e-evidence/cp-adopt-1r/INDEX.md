# CP-ADOPT-1R — album INDEX (walk-catches #63 + #64)

Rider on ship #41. Claro admin forms (no builder needed).

| Frame | Catch | Shows |
|---|---|---|
| `r1-allowlist-persisted.png` | WC#64 (FIXED) | Article node-type form: 3 allowed components remain **checked after save + reload** (the write now persists). |
| `r2-button-restricted.png` | WC#63 (not reproduced) | Component libraries form: `mosaic_button` **Restricted checkbox checked**, enabled still checked — admin retains the component. |

## Findings
- **WC#64 FIXED (real bug):** the node-type allowlist value lands at the FLAT parent `allowed_components`
  (the `mosaic_governance` details group is not `#tree`), but `saveAllowedComponents` read the nested path —
  so every save read `[]` and UNSET the allowlist. Fix: read the flat path. Proven RED→GREEN (Functional
  `NodeTypeAllowlistTest` 2/20; real-browser round-trip: 3 persist). Also added the missing config schema for
  `node.type.*.third_party.mosaic`.
- **WC#63 NOT REPRODUCED:** governance is `return $isAdmin || !$restricted;` — admin always retains restricted
  components. Verified admin-sees / author-doesn't on the FE manifest, the admin-widget manifest, and the real
  HTTP builder (14 ids with Button restricted); the libraries form checkboxes render + save correctly; the
  builder manifest invalidates on a library change (no cache staleness). Locked by a real two-account Kernel
  cell. Most plausible: a walk-sequence transient (Button left disabled from W3.1). Reviewer/Arun to re-walk W3.
