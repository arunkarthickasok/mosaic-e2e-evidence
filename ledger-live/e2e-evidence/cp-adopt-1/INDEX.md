# CP-ADOPT-1 — album INDEX (P3 journeys)

Ship #41 candidate. The **Component libraries admin page** is the stable filmed surface (a Drupal admin
form). The governance journeys J2–J5 assert the **manifest** — the exact data source that drives the builder
palette — which is proven reliably at the server level (raw excerpts in `reports/REPORT-CP-ADOPT-1.md` §P3);
the live Puck builder is unstable under headless capture (witnessed WC61 / A2-0a), so the palette-empty/refill
states are verified via the manifest rather than crash-prone builder screenshots.

## Frames present
| Frame | Journey | Shows |
|---|---|---|
| `j1-libraries-admin-page.png` | J1 | The 4 libraries in provider order — Mosaic Components/Views/Webform (module) + Olivero (theme, **theme-bound**); per-component grade badges + enabled/restricted; sections non-overlapping (boundingBox asserted). |
| `j1-olivero-attention.png` | J1 | The Olivero (theme) section expanded: `olivero:teaser` graded **Attention** with the reason ("attributes … no known field shape"). |

## Journeys proven at the manifest level (raw excerpts in the report §P3)
- **J2 governance round-trip:** admin manifest all-ON = **14** → `mosaic_components` OFF = **2** (mosaic_view +
  webform_embed) → ON = **14**.
- **J3 per-component:** disable `mosaic_button` → manifest **13** (absent); restrict `mosaic_button` → **admin
  sees it, author does not** (Permission-Parity).
- **J4 bundle allowlist:** the unchanged P7-039 `mosaic.allowed_components` mechanism (widget-level); a bundle
  with a stored allowlist behaves as before (back-compat, write path untouched).
- **J5 anon:** node/780 region shasum still
  `0864e2386cf7725d0c467f9dfc41b20d8fe41df3a5762375e3a4aabc03e894d5` (render unchanged).

## Backing gates (§P2 CHECKPOINT-2)
Kernel mosaic-core **203/1231/0** · Unit **2709/6498/0** · Vitest **539/1** (B-101) · phpcs **0** · phpstan L6
**[OK]**. Governance `ComponentLibraryGovernanceTest` **5/16**.
