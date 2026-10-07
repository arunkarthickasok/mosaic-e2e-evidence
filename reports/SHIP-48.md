# SHIP #48 — CP-ADOPT-8 + CP-ADOPT-9 (+9R): adopt-any-SDC + site-configurable authoring

**Committed (on-machine proof):** `6f859a8ece3d8ac0d878fe5f93c586f975c0cbbf` · author **Arun karthick Ashok
Kumar <arunkarthickasok@gmail.com>** · 2026-10-07 · parent ship #47 `33cd40c`.
**86 files changed, 6014 insertions(+), 80 deletions(-).** `git status --short` clean at HEAD.
Served bundle == built dist (`js/dist/builder.js` sha `21376a245c0e34086fbf`). libs 1.0.86. Drupal core
11.4.5. Owned FE render byte-identical: REGION `14e6cb9c…3954`, STYLE `b7756795…ca982 4354 10`.

## What shipped
The whole adoption arc, in one commit:
- **CP-ADOPT-8** — `json-schema-definitions://` shape resolver + bundled canvas-shapes (adopt a Canvas-ready
  SDC library on any Drupal 11.x without Canvas).
- **CP-ADOPT-9** — site-configurable authoring: `mosaic.shape_map` + a Field types page; the
  `mosaic_component_authoring` config entity (overrides-only); ONE H5 precedence resolver
  (SDC > entity > profile > shape-map > heuristic); owned migration `mosaic_update_10004`; the
  Manage-authoring form; the rail applies **14/14** knobs; patterns at the library level
  (`patterns_hidden[]`, `mosaic_update_10006`).
- **CP-ADOPT-9R** — adopted inline-image media picker ("Card Image"); **WC#108** x-allowed-schemes validated
  on the **resolved served URL**; help from schema descriptions; titled rows + rail=form order; component
  `replaces` governance; the **Mosaic** admin menu group + tabs + Field-types reset; and
  `tests/modules/mosaic_reference_library` (7 components, **100% Ready**) as LIBRARY-AUTHOR-GUIDE.md's worked
  example.

Full per-checkpoint detail: REPORT-CP-ADOPT-8.md · REPORT-ADOPT9-CP2…CP10.md · REPORT-ADOPT9R.md.

---

## MILESTONE-WALK RULING (Arun 2026-10-07, delegated; Bible P1.5 amended)

Per-ship eye-tests are replaced by **milestone walks**. Ships commit on machine proof; Arun runs the
**ceremony** only at a milestone; between milestones **the machine rehearses the oracle**.

- **M1 — ADOPT closed:** ship #48 + the oracle rehearsal A–J (reference library) + W0–W9.
- **M2 — author-trust + config audit + Wave D + submodule removal.**
- **M3 — Wave F + Wave G.**
- **M4 — ACT 2 + soak.**

---

## TIGHT GATE LAW (standing from 2026-10-07; quoted in full every pass)

Before ANY evidence push with a **rider or ship candidate**, ALL of:
- Kernel FULL · Unit FULL · Functional FULL · Vitest FULL · `tsc`
- phpcs **0 errors** · phpstan **0 new** (B-102 baseline count quoted)
- `scripts/qa/region-shasum.sh` + `style-shasum.sh` **verbatim** (`14e6cb9c… 3954` / `b7756795… 4354 10`)
- **served == built** bundle hashes
- the **headed journey films** for the pass

A pass missing any of these is **NOT pushed as green** — it is pushed as **"INCOMPLETE — <what is missing>"**.

B-102 baseline (pre-existing Drupal-11.4.5 PHPStan L6 drift, env-only, not a defect): **79** module-wide.
