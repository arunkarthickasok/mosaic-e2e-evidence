# CP-ADOPT-9 CHECKPOINT-4 — the Manage-authoring form (§5.5)

**Date:** 2026-10-01 · **Branch:** `fix/finding-016-validator` (mosaic working tree — built + gated;
not AI-committed per commit-flow, handed to Arun). Parent ship #47 = `33cd40c`.

Arun-ruled scope: **the form first** (§5.5). The **client rail application** (P3 item 2 — the resolved
rows drive the builder rail) + the **headed films** are CHECKPOINT-5.

## What shipped

A site admin (`mosaic.administer`) can now shape a component's authoring experience through a Drupal form
built to the FROZEN v4.1 `AdminAuthoring` design. It persists the `mosaic_component_authoring` entity
**overrides only**, refuses SDC over-reach (H5) as a row error, and blocks Save while any error stands.

### Form
- `src/Form/MosaicComponentAuthoringForm.php` — route
  `/admin/config/mosaic/component-libraries/{provider}/{component}/authoring` (`mosaic.administer`).
  Header (component · library); **"Stylable is unavailable"** notice when the library owns the look;
  **Fields** table (tabledrag by weight) — per row: widget select limited to the shape's **compatible
  widgets** (from `mosaic.shape_map`) + a **Hidden** option, Label, Help, Required (**locked on** when the
  library requires it), Default, Capabilities (Bindable/Breakpoint/Stylable — Stylable locked off for an
  owned-look library), an **Overridden/Default** status; **Slots** (allowed children / preferred fill /
  open cell); a **previews** toggle; **Save configuration** + **Reset to defaults**.
- `validateForm` runs the P2 resolver's **H5 `refusals()`** on the proposed rows and sets each as a **row
  error**, so Save is blocked (Drupal never submits an invalid form) — never a silent drop.
- `submitForm` diffs each field against its computed default and stores **only the overrides** (a field at
  its default is not written); Reset deletes the entity.
- `MosaicComponentLibrariesForm` — each component row gains an **Authoring → "Manage authoring →"** link.
- `MosaicManifestBuilder::buildComponentDefaults()` — extracted (the pre-overlay entry) so the form renders
  the true defaults and diffs against them; `buildComponentEntry()` = defaults + P2 overlay (unchanged).

### Test fixture
- `tests/modules/adopt_fixture/components/adopt_required/` — an adopted component with a **required** prop,
  to exercise the H5 required-hidden refusal through the form (no stock component declares a required prop).

## Functional cells — ComponentAuthoringFormTest (4 / 46 assertions)
- **Permission gate** — anon + non-admin → **403**, admin → **200**.
- **Overrides-only save** — changing the Text label stores **exactly one row** (`text` → label); level /
  alignment (untouched) are not stored.
- **H5 refusal blocks Save** — choosing **Hidden** for a required field yields the row error *"… is required
  by the component and cannot be hidden."* and **persists nothing**; the adopted component shows *"Stylable
  is unavailable"*.
- **Reset to defaults** — deletes the override entity.

## Gate (FULL, in DDEV)

| Check | Result |
|---|---|
| PHPCS (Drupal,DrupalPractice) new/changed | **0 errors** |
| PHPStan `-l6` new form | **0 new** (4 `$form no value type` — the standard Drupal-form noise every form carries) |
| Vitest (no JS) | 731 pass / **1 pre-existing** (B-101) |
| PHPUnit **Unit** | **2832 / 0** (manifest-builder refactor byte-identical; 1 pre-existing warning) |
| PHPUnit **Kernel** | **336 / 0** (3 pre-existing skips) |
| PHPUnit **Functional FULL** | **82 / 0** (859 assertions, 2 pre-existing skips; +4 ComponentAuthoringFormTest) |
| dist | **UNCHANGED** (server-only form — no adapter/JS change; no BUMP-LIBS) |
| Owned shasums | **VERBATIM** (REGION 14e6cb9c…3954 + STYLE b7756795…ca982 4354 10) |

## Deferred — CHECKPOINT-5 (recorded next landing)
- **Client rail application** — the manifest's resolved rows drive the builder rail (widget/label/help/
  required/default/hidden/capabilities/slot/previews/patterns/order) for owned AND adopted; Vitest per knob;
  FE-dialog parity; **dist → BUMP-LIBS**.
- **Headed films** — «ext» Card + owned Card: Manage authoring → set overrides → rail follows live; hide a
  required field → row error + Save disabled; Overrides-only → 3 rows; Reset all → defaults.
- **Form niceties** — the live "Overrides only" client filter, per-row Reset buttons, row-weights toggle,
  and Patterns-shown control (present in the design; the save/refuse/reset core landed this pass).
