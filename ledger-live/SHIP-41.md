# SHIP #41 — SHIPPED 2026-09-17 = commit 5a65173 (parent d0fdb22)

CP-ADOPT-1 (Adopt any SDC) + CP-ADOPT-1R rider. **27 files (16 modified + 11 new).** PHP + YAML only → no dist,
no libs bump. Arun re-walk W1–W5 + W3/W4 rider = **6/6 PASS**, W5 PASS.

## What shipped
- **Discovery rebased on core `plugin.manager.sdc`** (H2): the `.mosaic.yml` gate removed, sidecar optional;
  every SDC on the site is admitted + graded. `olivero:teaser` now admitted (Attention, theme-bound, guarded).
- **Readiness grader** (Pillar A): Ready / Attention(prop+reason) / Blocked; slots-only = Ready.
- **Bare-id alias** (H1): owned components keep bare ids; adopted keep `provider:id`. Existing layouts render
  byte-identical (node/780 region shasum `0864e238…`).
- **Component library config entity** (Pillar F / H8): idempotent auto-create per provider (update hook run
  live — 4 libraries), governance (library on/off, per-component enabled/restricted entity-first), admin page
  `/admin/config/mosaic/component-libraries`.
- **Palette guard**: adopted components discovered + graded but not authored (opens in ADOPT-4).
- **WC#64 fix**: node-type allowlist persistence (flat value path) + config schema for the third-party setting.

## Gates at ship
| Gate | Result |
|---|---|
| Kernel — mosaic core FULL | 203/1231/0 |
| Unit — mosaic FULL | 2709/6503/0 |
| Functional — NodeTypeAllowlistTest | 2/20 |
| Vitest | 539/1 (B-101; no JS change) |
| phpcs | 0 ERRORS · phpstan L6 [OK] |
| dist/libs | unchanged (PHP+YAML) |

## Walk-catches
- **#63** (restricted hides Button from admin) — **NOT REPRODUCED** (admin retains restricted on every surface;
  locked by a real two-account Kernel cell). Tally 64.
- **#64** (allowlist doesn't persist) — **FIXED** (flat value path + schema).

## Oracle-change table (accepted)
| Test | Old → New | Reason |
|---|---|---|
| grader C5 | Blocked → Ready (static) | propless SDC renders |
| Sprint02 ×3 | gate-skip → admitted / core-derived | H2 gate removed |
| ManifestControllerTest ×9 | 4-arg → 5-arg (+governance) | governance injected |
| Sprint30 ×2 | component-packages → component-libraries | admin page replaced |
| Sprint80 | `'restricted'` → `isAuthorable` | filter moved to governance |

## Evidence
reports/REPORT-CP-ADOPT-1.md (P0–P4 + §R) · ledger-live/SHIP-41-PLAN.md · reports/WALK-CP-ADOPT-1.md +
WALK-CP-ADOPT-1R.md · albums cp-adopt-1/ + cp-adopt-1r/ · FINDING-107.
