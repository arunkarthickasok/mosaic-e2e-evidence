# DESIGN COVERAGE MATRIX — code surfaces × design v2

> **Coverage only, no quality opinions** (quality is the reviewer's audit). Each row = a user-facing
> surface/state extracted from the CODE (with a `file:line` anchor), marked against design **v2**'s files:
> **DESIGNED** (a v2 file addresses it), **PARTIAL** (present but a state/variant is absent), **MISSING**
> (no v2 file). Marks are **evidence-based**: a keyword sweep of v2's `ui_kits/builder/{index,motion}.html`
> + `Mosaic Authoring UI Kit.html` (the substantive file; the builder index is a 1.8 KB stub). Term-hit
> counts are quoted where they drive a mark. The library is never named (v2 grep = 0).

## A. Admin routes / forms
| Surface | Code file:line | v2 | Note |
|---|---|---|---|
| Component libraries page | `mosaic.routing.yml:136` → `MosaicComponentLibrariesForm` | **PARTIAL** | v2 "librar" ×3 — mentioned, not a full screen |
| Layout usage report | `mosaic.routing.yml:145` → `LayoutUsageController::report` | **MISSING** | v2 "report" ×0 |
| Library-changes report (Pillar H) | `mosaic.routing.yml:156` → `MosaicLibraryChangesController::report` | **MISSING** | v2 "report" ×0 |
| Settings form | `mosaic.routing.yml:247` → `MosaicSettingsForm` | **MISSING** | v2 "settings" ×0 |
| **Field types form (CP-ADOPT-9 P1, this pass)** | `mosaic.routing.yml:257` → `MosaicShapeMapForm` | **MISSING** | v2 "field type" ×0 |
| Manage authoring (CP-ADOPT-9 P0 model, unbuilt) | design in `REPORT-CP-ADOPT-9.md` | **MISSING** | v2 "Manage authoring" ×0 |
| Node-type governance (allowed_components) | node-type form alter (`MosaicHooks`) | **MISSING** | v2 "governance"/"node type" ×0 |
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
| Data-state switcher | `viewPreviewStore.ts` | **MISSING** | v2 "data source" ×0 |
| Viewport switch | `BuilderApp.tsx` (breakpoint tabs) | **DESIGNED** | v2 "viewport" ×4 |
| Selection toolbar (ActionBar) | `BuilderApp.tsx` (actionBar override) | **DESIGNED** | v2 "selection" ×3, "toolbar" ×4 |
| Keyboard-move | `fields/MosaicRepeaterField.tsx` (↑/↓) | **DESIGNED** | v2 "keyboard" ×15 |
| Loading shimmer | `tierBOptimistic.ts` (_ssrShimmer) | **DESIGNED** | v2 "loading" ×7 |
| SSR error state | `tierBOptimistic.ts` (_ssrError) | **DESIGNED** | v2 "error" ×20 |

## C. The rail (property panel)
| Surface | Code file:line | v2 | Note |
|---|---|---|---|
| Rail sections (Style / Spacing / Visibility / Breakpoint / Data) | `MosaicPuckAdapter.ts` (resolveFields + capability gate) | **PARTIAL** | v2 "rail" ×6, "spacing" ×13 — but **"visibility" ×0, "breakpoint" ×0** (see below) |
| Field kinds (text/number/select/toggle/link) | `MosaicPuckAdapter.ts` descriptorToField | **DESIGNED** | covered by the rail kit |
| CKE5 body modal | `fields/BodyEditModal.tsx` | **DESIGNED** | v2 "CKE" ×124 (heavily designed) |
| Component-fill rows ("+ Add image"/"Filled by") | `fields/MosaicFillField.tsx` | **PARTIAL** | fill implied by picker/badge; the specific fill row not enumerated |
| Repeater rows (inline list) | `fields/MosaicRepeaterField.tsx` | **PARTIAL** | v2 "repeater" ×1 — barely present |
| Slot rows (allowed/preferred) | `fields/MosaicSlotZone.tsx` | **DESIGNED** | v2 "slot" ×21 |
| Bind panel + field map | `fields/MosaicSlotBindField.tsx` | **MISSING** | v2 "bind" ×0, "field map" ×0 |
| Drift notices (⚠ removed / ⚑ type-changed / ! required) | `MosaicPuckAdapter.ts` buildDriftField | **MISSING** | v2 "drift" ×0 |
| Legacy binding | `fields/MosaicDataSourceField.tsx` | **MISSING** | v2 "data source" ×0 |
| Ownership line (foreign slot) | `MosaicPuckAdapter.ts` foreignSlotResolveFields | **MISSING** | v2 "ownership" ×0 |
| Breakpoint override | `BuilderApp.tsx` (bp state) | **MISSING** | v2 "breakpoint" ×0 |
| Spacing tokens | `fields/SpacingControl.tsx` | **DESIGNED** | v2 "spacing" ×13 |
| Style tokens | `fields/StyleOverridesControl.tsx` | **PARTIAL** | tokens designed in guidelines; the control state not enumerated |
| Visibility + "still downloaded" note | `MosaicPuckAdapter.ts` (visibility) | **MISSING** | v2 "visibility" ×0, "still downloaded" ×0 |

## D. FE dialog + messages + states
| Surface | Code file:line | v2 | Note |
|---|---|---|---|
| FE inline-edit dialog | `js/src/builder/index.tsx` (FE entry) + `mosaic.libraries.yml` frontend_editor | **PARTIAL** | authoring kit covers the builder; the FE dialog chrome not distinctly shown |
| Save errors (validation) | `MosaicHooks` presave → EntityStorageException | **PARTIAL** | v2 "error" ×20 (generic error styling); specific save-error copy not enumerated |
| Toasts / banners | `mosaicToast.ts`, lock banner CSS | **DESIGNED** | v2 "toast" ×22 |
| Empty states | fields' empty-state markup | **DESIGNED** | v2 "empty" ×5 |
| "unavailable component" notice | renderer Pillar-H fallback | **MISSING** | v2 "unavailable" ×0 (though "missing" ×8 covers the card) |

## E. Cross-cutting states
| Surface | v2 | Note |
|---|---|---|
| Light theme | **DESIGNED** | base palette guidelines |
| Dark theme (DESIGNED, not inverted) | **DESIGNED** | v2 "dark" ×6 + dedicated `*-dark.card.html` guideline cards |
| Three admin themes (Claro/Gin/Stark) | **N/A** | Mosaic scopes its own design (`.mosaic`); admin themes are Drupal's — out of Mosaic's design scope |
| Tablet | **PARTIAL** | v2 "tablet" ×3 — responsive intent present; per-screen tablet layouts need the reviewer audit |
| Mobile | **PARTIAL** | v2 "mobile" ×2 — same |
| Reduced motion | **DESIGNED** | v2 "reduced motion" ×2 + "prefers-reduced" ×4 + `motion.html` |

## Summary counts
- **DESIGNED: 24** (design language + core builder/canvas/rail authoring surfaces + toast/refusal/badge/
  missing-card/result/viewport/toolbar/keyboard/loading/error/empty + CKE5 + dark + reduced-motion).
- **PARTIAL: 12** (rail-sections umbrella, palette needs-marker, +Add, fill rows, repeater rows, style
  control, FE dialog, save errors, libraries page, design-tokens import, tablet, mobile).
- **MISSING: 15** (every admin screen — usage/library-changes reports, settings, **Field types**,
  Manage-authoring, node-type governance; and the rail's **bind panel + field map, drift notices, legacy
  binding, ownership line, breakpoint override, visibility + "still downloaded", data-state switcher,
  "unavailable component" notice**).

**Reading (coverage only):** v2 strongly covers the **design language** and the **core builder + rail
authoring** experience (incl. CKE5, dark, refusal, badges, states). The consistent **gaps** are (1) **every
admin/config screen** (v2 designs the authoring surface, not Drupal-admin forms) and (2) a cluster of
**data-binding + drift + breakpoint + visibility** rail surfaces (0 hits each). These are the reviewer
audit's priority areas; this matrix asserts presence/absence only, not sufficiency.
