# REPORT — GOV-REPORT-TO-REPO

**Charter:** governance ledger append (append-only), 2026-09-12.
**Status:** COMPLETE — STANDING LAW ratified + F-102 registered + pushed.
**Type:** governance (no code, no gates — the report IS the audit trail).

This is the first report written under the law it establishes, to prove the
convention is operative immediately (the law reads "from this point every charter").

## What was appended (ledger-live/TODO.md, append-only)

### 1. STANDING LAW — REPORT-TO-REPO
Ratified via reviewer delegation, recorded as Arun's ruling. Every charter's full
detailed report (witnesses with file:line, RED/GREEN logs, gate outputs, file
lists) is written to `reports/REPORT-<charter-id>.md` in the evidence repo and
**pushed before stopping**. The chat paste is reduced to four lines: charter id,
one-line status, report path, commit hash. Evidence-quality law (no code/DB/
secrets; secret guard + isolation self-check before push) applies to the repo
report identically.

**Home resolved:** the top-level tracked `reports/` dir (alongside
`REPORT-SHIP32.md`, `REPORT-SHIP33.md`, `MASTER-AUDIT-CAPABILITY.md`) — not the
older `ledger-live/REPORT-*.md` scatter. Confirmed tracked (not gitignored).

### 2. F-102 — DSD style-adoption gap (mosaic-tabs + mosaic-live-search)
Registered as a tracked finding. Both components share the carousel defect fixed
under WALK-CATCH #53/#54: their `createRenderRoot()` override reuses a hydrated
declarative-shadow-DOM root but never adopts `elementStyles` (Lit's `adoptStyles`
is skipped because `ReactiveElement.createRenderRoot()` is never reached). Currently
symptom-free **by accident** — both are attribute-driven (not CSS-layout-driven),
so a style-less shadow still functions. Fix = the same `_adoptStaticStyles(sr)`
step now in `mosaic-carousel.ts`. **Slot: Wave D-0 retrofits.** Regression oracle:
assert the hydrated shadow's `adoptedStyleSheets.length > 0` on both components,
both hosts.

## Cross-references
- Root-cause + fix that F-102 mirrors: `reports/`/`ledger-live/SHIP-34.md`
  (WALK-CATCHES #50–#54 section) + `ledger-live/TODO.md` resolution 2026-09-12.
- Memory gotcha (durable): project_mosaic.md — "Lit + Declarative Shadow DOM:
  a createRenderRoot override that reuses a hydrated DSD shadow must adopt styles
  itself."

## Push discipline (this charter)
- Isolation self-check (a–e): git toplevel = `mosaic-e2e-evidence`; changes confined
  to `ledger-live/TODO.md` + `reports/REPORT-GOV-REPORT-TO-REPO.md`; no code-ish
  files (`.php`/`.ts`/`.tsx`/`.patch`); ship34-carousel + ship32-scroll untouched.
- Secret guard: no credential values in the appended/authored text.
- No AI-attribution line in the commit.
