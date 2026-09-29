# Mosaic 1.0 design system export

**Status: DRAFT v1 (2026-09-20) — NOT yet the ACT 2 source of truth.**
Commit `ba37506`. A refined **v2 is owed before ACT 2 (frozen plan §6) starts**;
v2 becomes the source of truth, not this draft.

## Arun's bar for ACT 2 §6
Best-in-class, modern AND easy — **better than the paid builders it will be compared
to**. "A Rolls-Royce, not an Ambassador."

## v2 must KEEP what v1 got right
- Own tokens (`--mosaic-*`), never the admin theme's.
- `.mosaic` scoping (admin-theme-agnostic).
- Absent-not-disabled sections (a section with nothing to show is gone, not greyed).
- No settings page.
- Shimmer-not-overlay while previews load.
- The contrast audit.

## v2 must RAISE
- **Distinctive composites:** the rail, the canvas chrome, the bind panel, the palette.
- **Interaction choreography:** drag / drop / violation / shimmer.
- **Tablet + mobile** for screens 7–9.
- **Dark mode that is DESIGNED, not inverted.**

## ACT 2 ruling candidate (Arun rules at ACT 2)
Design decision 6 — accept-and-mark rule-breaking drops (Save stops) vs the current
native refusal.

---

## v2 — received 2026-09-29 · status: ACCEPTED as source of truth (reviewer 2026-09-30)
`design/mosaic_ui_ux/v2/` — Arun's second design pass for Mosaic 1.0. **136 files, 4.7 MB, no
node_modules / build dirs, secret-guard clean, no library named** (grep verified). Committed under Arun's
personal identity.

**Status: ACCEPTED as the source of truth** (reviewer, 2026-09-30) for **tokens, signature, motion, dark,
theme-independence, and the core builder + rail**. ACT 2 builds against v2 for these.

- **v3 owed by 2026-10-24** — admin surfaces, rail states, per-screen tablet/mobile, and **4 quality
  fixes**: (1) a 12 px type floor, (2) self-hosted fonts, (3) the index rule, (4) a palette first-run cue.
- **v4 = polish only**, then the design is **frozen**.

**Coverage matrix** (`reports/DESIGN-COVERAGE.md`) — DESIGNED 33 / PARTIAL 15 / MISSING 1 (Settings form).
Corrected 2026-09-30: the first sweep read only the HTML kit; the admin screens (`Admin.jsx`) and the rail
binding/drift/breakpoint/data-state cluster (`Rail.jsx`/`data.js`) are designed in the JSX source.

**What v2 delivers (by file name):**
- **Design language:** `Mosaic Design System/tokens/` + `guidelines/` cards — colors (semantic / surfaces
  / accent / neutral / cues, each with a dark variant), type (roles / signature / scale), elevation (+dark),
  spacing (chrome / scale), radius, motion (easing / durations), brand (marks / wordmark).
- **Component cards:** `components/{core,navigation,feedback,surfaces,builder}/*.card.html`.
- **Builder UI kit:** `ui_kits/builder/index.html` + `motion.html`.
- **Authoring UI kit:** `Mosaic Authoring UI Kit.html`.

---

## v3 — received 2026-09-30 · status: UNDER REVIEW
`design/mosaic_ui_ux/v3/` — Arun's third design pass. **152 files, 6.5 MB, no node_modules / build dirs,
secret-guard clean, no library named** (grep = 0). Committed under Arun's personal identity.

**Adds (v3 remit):** the admin surfaces — `ui_kits/builder/Admin{Authoring,Libraries,Reports,Settings}.jsx`
— and **`RailStates.jsx`** (rail states); a v3 authoring kit (`Mosaic Authoring UI Kit v3.html`);
**self-hosted fonts** (`assets/fonts/ibm-plex-{sans,mono}-*.woff2`); `guidelines/contrast-audit.{md,json}`
+ `guidelines/decisions-log.md` (D13–D22).

**Mechanical checks (raw):** (a) 12 px floor — **v3 sources 0 offenders** (token scale xs = 12 px); 4
sub-12px (10.5/11px) remain ONLY in the carried-over v2 `Mosaic Authoring UI Kit.html`. (b) self-hosted
fonts — **0** remote refs (googleapis/gstatic), `@font-face` → local `../assets/fonts/*.woff2`. (c) index
rule — `mos-index` ×3, all on rail-section CHROME (Content/Data/A11y); none on content fields / library
markup; compact + comfortable density present. (d) palette first-run cue — present (`App.jsx`/`Builder.jsx`,
"first-run cue ring"). (e) contrast audit — **152 pairs · 0 failures** (WCAG 2.2 4.5:1, after the 12 px
floor). (f) motion — `motion.html` + `motion-{durations,easing}.card.html` present.

**Renders (pixel review):** `design/mosaic_ui_ux/v3/RENDERS/` — **215 headed-Chromium PNGs**
(200 screen + 15 motion) with `RENDERS/INDEX.md` (one row per PNG). Every kit screen/state at
1440·light·comfortable, then each state across 834 / 390 / dark / compact; motion key frames
(lift, refuse snap-back, insert, shimmer, crossfade) seeked via the Web Animations API. Committed
`ac85797`. Re-checks at render time: sub-12px in the kit **0**; hex outside `tokens/` **120** but
**0 in the product `styles.css`** (rest = host admin-theme sim / palette-doc cards / kit scaffold);
contrast **152 pairs · 0 failures** (ratios 3.4–17.56); fonts self-hosted (React/Babel from unpkg =
the kit's transpile harness only).

**Status: PASSED — source of truth for ALL screens** (reviewer, 2026-10-01). v3 is now the source
of truth for the builder, rail states, admin libraries, Manage authoring, field types, reports,
settings, missing, errors, keyboard, the three admin themes, dark, tablet and mobile — replacing v2
as the reference for these surfaces. The coverage matrix is in `reports/DESIGN-COVERAGE.md`.

**v4 = polish only** (due **2026-10-10**, then **FROZEN**):
1. Palette 240px; one-line library headers; truncation + tooltip.
2. Top-edge chrome rule — toolbar outside above top-right, index tab bottom-left, EXAMPLE badge
   inside top-right, no overlap.
3. Thumbnail slot with icon fallback.
4. Dark follows the admin theme's mode + a manual override.
5. Focus-mode affordance + hover labels on the palette strip.
