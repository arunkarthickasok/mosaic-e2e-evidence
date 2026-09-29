# DESIGN COVERAGE MATRIX — code surfaces × design v2

> **CORRECTION (reviewer, 2026-09-30 — my error, owned).** The first sweep read only the **HTML** kit (a
> 1.8 KB builder stub + the authoring HTML) and therefore mis-marked a cluster of surfaces MISSING. Re-run
> over the **JSX source + `data.js`** (`ui_kits/builder/{App,Chrome,Admin,Pages,Canvas,Rail,Palette,
> Builder}.jsx` + `data.js` + `components/**/*.jsx`), those surfaces ARE designed. Corrected rows are
> tagged **[corrected]** with the JSX file + count. New evidence: **`Rail.jsx`** — bind ×20, field-map ×3,
> legacy ×6, breakpoint ×4, ownership ×1, drift notices ("Type changed"/"removed"/"flag"/"required");
> **`Admin.jsx`** — Librar ×10, Manage/Authoring ×5, FieldType ×4, Report ×2, Allowed ×2, Hidden/visib;
> **`Canvas.jsx`** — visib + "Still" (downloaded), required ×3; **`data.js`** — data-state ×13, fieldMap.
>
> **Coverage only, no quality opinions** (quality is the reviewer's audit). Each row = a user-facing
> surface/state extracted from the CODE (with a `file:line` anchor), marked against design **v2**:
> **DESIGNED** / **PARTIAL** (a state/variant absent) / **MISSING**. Marks are **evidence-based** — a
> keyword sweep of v2's HTML kit **and (corrected) the JSX + `data.js`**; hit-counts quoted where they
> drive a mark. The library is never named (v2 grep = 0).

## A. Admin routes / forms
| Surface | Code file:line | v2 | Note |
|---|---|---|---|
| Component libraries page | `mosaic.routing.yml:136` → `MosaicComponentLibrariesForm` | **DESIGNED** [corrected] | `Admin.jsx` "Librar" ×10 |
| Layout usage report | `mosaic.routing.yml:145` → `LayoutUsageController::report` | **PARTIAL** [corrected] | `Admin.jsx` "Report" ×2 (generic report surface) |
| Library-changes report (Pillar H) | `mosaic.routing.yml:156` → `MosaicLibraryChangesController::report` | **DESIGNED** [corrected] | `Admin.jsx` "Report" + "Librar" |
| Settings form | `mosaic.routing.yml:247` → `MosaicSettingsForm` | **MISSING** | "settings" ×0 in HTML + JSX |
| **Field types form (CP-ADOPT-9 P1, this pass)** | `mosaic.routing.yml:257` → `MosaicShapeMapForm` | **DESIGNED** [corrected] | `Admin.jsx` "FieldType" ×4 |
| Manage authoring (CP-ADOPT-9 P0 model, unbuilt) | design in `REPORT-CP-ADOPT-9.md` | **DESIGNED** [corrected] | `Admin.jsx` "Manage"/"Authoring" ×5 |
| Node-type governance (allowed_components) | node-type form alter (`MosaicHooks`) | **PARTIAL** [corrected] | `Admin.jsx` "Allowed" ×2 |
| Design-tokens import | `mosaic.routing.yml:325` | **PARTIAL** | tokens designed in `guidelines/`; the import FORM is admin-native |

## B. Builder — palette + canvas
| Surface | Code file:line | v2 | Note |
|---|---|---|---|
| Palette groups / cards | `js/src/builder/PaletteCard.tsx` | **DESIGNED** | v2 "palette" ×4 |
| Palette "needs {Container}" marker | `PaletteCard.tsx` (wrapEntryFor) | **PARTIAL** | palette designed; the marker state not enumerated |
| Palette "Patterns" panel | `fields/MosaicPatternsPanel.tsx` | **DESIGNED** | v2 "pattern" ×2 |
| Canvas zones / slot drop zones | `fields/MosaicSlotZone.tsx` | **DESIGNED** | v2 "canvas" ×7, "slot" ×21 |
| "+ Add" affordance | `tierBOptimistic.ts` (insertIntoSlot) | **PARTIAL** | v2 "+ Add" literal ×0; add-flows implied by picker/pattern |
| Media picker | `fields/MosaicMediaField.tsx` | **DESIGNED** | v2 "picker" ×12 |
| Toast (auto-wrap / info) | `js/src/builder/mosaicToast.ts` | **DESIGNED** | v2 "toast" ×22 |
| Refusal (wrong-zone, with reason) | `requiresParentWrap.ts` | **DESIGNED** | v2 "refus" ×19 |
| "example" preview badge | `fields/MosaicAdoptedPreview.tsx` | **DESIGNED** | v2 "badge" ×11, "example" ×2 |
| Library-missing card (Pillar H) | `MosaicAdoptedPreview.tsx` / renderer fallback | **DESIGNED** | v2 "missing" ×8 |
| Result line (SSR count) | `fields/ViewsDataSourceField.tsx` | **DESIGNED** | v2 "result" ×5 |
| Data-state switcher | `viewPreviewStore.ts` | **DESIGNED** [corrected] | `data.js` "data-state" ×13 |
| Viewport switch | `BuilderApp.tsx` (breakpoint tabs) | **DESIGNED** | v2 "viewport" ×4 |
| Selection toolbar (ActionBar) | `BuilderApp.tsx` (actionBar override) | **DESIGNED** | v2 "selection" ×3, "toolbar" ×4 |
| Keyboard-move | `fields/MosaicRepeaterField.tsx` (↑/↓) | **DESIGNED** | v2 "keyboard" ×15 |
| Loading shimmer | `tierBOptimistic.ts` (_ssrShimmer) | **DESIGNED** | v2 "loading" ×7 |
| SSR error state | `tierBOptimistic.ts` (_ssrError) | **DESIGNED** | v2 "error" ×20 |

## C. The rail (property panel)
| Surface | Code file:line | v2 | Note |
|---|---|---|---|
| Rail sections (Style / Spacing / Visibility / Breakpoint / Data) | `MosaicPuckAdapter.ts` (resolveFields + capability gate) | **DESIGNED** [corrected] | `Rail.jsx`: breakpoint ×4; `Canvas.jsx` visib; `data.js` data-state ×13 |
| Field kinds (text/number/select/toggle/link) | `MosaicPuckAdapter.ts` descriptorToField | **DESIGNED** | covered by the rail kit |
| CKE5 body modal | `fields/BodyEditModal.tsx` | **DESIGNED** | v2 "CKE" ×124 (heavily designed) |
| Component-fill rows ("+ Add image"/"Filled by") | `fields/MosaicFillField.tsx` | **PARTIAL** | fill implied by picker/badge; the specific fill row not enumerated |
| Repeater rows (inline list) | `fields/MosaicRepeaterField.tsx` | **PARTIAL** | v2 "repeater" ×1 — barely present |
| Slot rows (allowed/preferred) | `fields/MosaicSlotZone.tsx` | **DESIGNED** | v2 "slot" ×21 |
| Bind panel + field map | `fields/MosaicSlotBindField.tsx` | **DESIGNED** [corrected] | `Rail.jsx` "Bind" ×20, "Field map"/"fieldMap" ×3 |
| Drift notices (⚠ removed / ⚑ type-changed / ! required) | `MosaicPuckAdapter.ts` buildDriftField | **DESIGNED** [corrected] | `Rail.jsx` "Type changed", "removed", "flag", "required" |
| Legacy binding | `fields/MosaicDataSourceField.tsx` | **DESIGNED** [corrected] | `Rail.jsx` "legacy" ×6 |
| Ownership line (foreign slot) | `MosaicPuckAdapter.ts` foreignSlotResolveFields | **PARTIAL** [corrected] | `Rail.jsx` "ownership" ×1 |
| Breakpoint override | `BuilderApp.tsx` (bp state) | **DESIGNED** [corrected] | `Rail.jsx`/`Admin.jsx` "breakpoint" ×4 |
| Spacing tokens | `fields/SpacingControl.tsx` | **DESIGNED** | v2 "spacing" ×13 |
| Style tokens | `fields/StyleOverridesControl.tsx` | **PARTIAL** | tokens designed in guidelines; the control state not enumerated |
| Visibility + "still downloaded" note | `MosaicPuckAdapter.ts` (visibility) | **PARTIAL** [corrected] | `Canvas.jsx` "visib" + "Still" (downloaded) ×1 each |

## D. FE dialog + messages + states
| Surface | Code file:line | v2 | Note |
|---|---|---|---|
| FE inline-edit dialog | `js/src/builder/index.tsx` (FE entry) + `mosaic.libraries.yml` frontend_editor | **PARTIAL** | authoring kit covers the builder; the FE dialog chrome not distinctly shown |
| Save errors (validation) | `MosaicHooks` presave → EntityStorageException | **PARTIAL** | v2 "error" ×20 (generic error styling); specific save-error copy not enumerated |
| Toasts / banners | `mosaicToast.ts`, lock banner CSS | **DESIGNED** | v2 "toast" ×22 |
| Empty states | fields' empty-state markup | **DESIGNED** | v2 "empty" ×5 |
| "unavailable component" notice | renderer Pillar-H fallback | **PARTIAL** [corrected] | `components/builder/MissingCard.jsx` designs the card; the exact "unavailable" copy not enumerated |

## E. Cross-cutting states
| Surface | v2 | Note |
|---|---|---|
| Light theme | **DESIGNED** | base palette guidelines |
| Dark theme (DESIGNED, not inverted) | **DESIGNED** | v2 "dark" ×6 + dedicated `*-dark.card.html` guideline cards |
| Three admin themes (Claro/Gin/Stark) | **N/A** | Mosaic scopes its own design (`.mosaic`); admin themes are Drupal's — out of Mosaic's design scope |
| Tablet | **PARTIAL** | v2 "tablet" ×3 — responsive intent present; per-screen tablet layouts need the reviewer audit |
| Mobile | **PARTIAL** | v2 "mobile" ×2 — same |
| Reduced motion | **DESIGNED** | v2 "reduced motion" ×2 + "prefers-reduced" ×4 + `motion.html` |

## Summary counts (corrected 2026-09-30 — re-run over JSX + `data.js`)
- **DESIGNED: 33** — design language + core builder/canvas/rail authoring + toast/refusal/badge/
  missing-card/result/viewport/toolbar/keyboard/loading/error/empty + CKE5 + dark + reduced-motion, **plus
  the [corrected] admin screens (libraries, library-changes report, Field types, Manage authoring — all in
  `Admin.jsx`) and the rail binding cluster (bind + field map, drift notices, legacy, breakpoint,
  data-state — all in `Rail.jsx`/`data.js`)**.
- **PARTIAL: 15** — usage report, node-type governance, design-tokens import, palette needs-marker, +Add,
  fill rows, repeater rows, ownership line, style control, visibility + "still downloaded", FE dialog, save
  errors, "unavailable component" copy, tablet, mobile.
- **MISSING: 1** — the **Settings form** only ("settings" ×0 in both the HTML kit and the JSX).
- **N/A: 1** — three admin themes (Mosaic scopes its own design; admin themes are Drupal's).

*(Was DESIGNED 24 / PARTIAL 12 / MISSING 15 before the correction — the drop from 15 MISSING to 1 is the
reviewer's point: the surfaces I mis-marked live in the JSX source, not the HTML kit my first sweep read.)*

**Reading (coverage only):** v2 covers the **design language**, the **core builder + rail authoring**
(incl. CKE5, dark, refusal, badges, states), the **admin screens** (`Admin.jsx`), and the **rail
data-binding + drift + breakpoint + data-state** cluster. Remaining gaps are narrow — the **Settings form**
(MISSING) and a set of **PARTIAL** states/variants (per-screen tablet/mobile, specific copy, some control
states). This matrix asserts presence/absence only; sufficiency is the reviewer's audit.
