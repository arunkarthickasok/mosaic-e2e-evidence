# THE MOSAIC BIBLE v2 — RATIFIED 2026-09-17 (delegated ruling, overrule open)
Authored 2026-09-16 (post ship #40, post PROBE-COMPONENT-PIPELINE); ratified
2026-09-17. Owner: Arun Karthick. Supersedes v1 (archived
MOSAIC-BIBLE-v1-2026-08-08.md).

> THE REPO OVERRULES THIS FILE. Live truth: AI/TODO.md (ledger),
> AI/FINDINGS.md, git. Evidence repo: arunkarthickasok/mosaic-e2e-evidence
> (ledger-live/, reports/, albums). This bible changes ONLY by
> Arun-ratified amendment; if it disagrees with the repo, the repo wins.

## P1 — GOVERNANCE ABSOLUTES
1 Three-party system: Arun (owner/decider/hands) · reviewer window
  (drafts, cold-audits from the evidence repo) · Claude Code (builds;
  mosaic git READ-ONLY) · the repo is truth. No window trusts another's
  memory. 2 Git law: Arun's hands only; every ship a numbered ceremony
  in TODO.md; single-quoted commit messages; AI/ gitignored, never in
  ship lists; SdcComponentPlugin.php stays HELD unstaged (Wave 5.2).
3 Sanction word for DB/config writes. 4 Fresh-read rule: quote a live
  read, never memory. 5 Arun's eye-test BEFORE every ship; automated
  green necessary, not sufficient; walk steps recipe-grade. 6 Append-
  only ledgers. 7 Attribution: Arun's name only, never AI. 8 RED→GREEN
  + Test-Coupling with DERIVED matrices; GEOMETRY dimension in every UI
  derivation (walk-catch #10); Permission-Parity; mechanisms before
  fixes; no sleeps; oracle changes mid-green ledgered old→new; stop-
  when-blocked (no self-inflicted-blocker exception). 9 REPORT-TO-REPO:
  full reports pushed to the evidence repo; chat paste = id + status +
  path + hash; reviewer audits from the repo. 10 Evidence, never
  summaries: raw output, file:line, red before green. 11 BUMP-LIBS
  after every dist rebuild (walk-catch #57 root cause). 12 Reviewer-
  research law: market scan in every CP audit. 13 Walk-catches are
  Arun's; the tally is tracked. 14 Naming ban: no third-party library,
  vendor, region or organization named in any ledger line.

## P2 — PRODUCT SOUL
One line: a free, self-hosted, SDC-native visual page builder for
Drupal 11/12 that ADOPTS ANY organization's component library with
zero code — panel from the component's own schema, slots as governed
drop zones, library styles on page AND canvas, typed data binding,
library-level governance, pages that survive library updates and
removals. Architecture 9/10; the campaign closes market fit.
Personas: P1 Content Author · P2 Developer/Site Builder · P3 Client/
Decision-Maker (unchanged from v1).
Defensible seat (honest): graded admission not refusal; slot child
rules + Views-into-slots; zero-code library switch; capability-aware
panel; drag-and-drop canvas with CKE5 freedom intact. We borrow prop-
shape matching and versioning designs from Canvas; we do not out-
engineer them by tag.

## P3 — STATE OF THE PRODUCT (witnessed, post ship #40)
Ships: #21–#40 on fix/finding-016-validator — latest = **d0fdb22
(ship #40)**; 20 numbered ships #21→#40 on this branch (SHIP #21 =
TODO.md:10939; SHIP #40 = `d0fdb22` per `git log`, TODO.md:13126).
Views act CLOSED (#36→#39 + riders): BubbleableMetadata renderer gate,
ViewsArgumentResolver (6 sources), MosaicViewRenderer, url.query_args
cacheability. WC60 optimistic commit for all Tier-B components (#38).
Carousel v6 (#34/#35). Walk-catch tally: **62** (TODO.md:13186; WC62
closed on ship #39R, ship #40 opened no new catch), all Arun's.
Submodules (MASTER-AUDIT-CAPABILITY, "16 units = core + 15 submodules"):
2 complete-walked (`mosaic` core, `mosaic_components`) · 11 functional-
unwalked · 1 experimental (`mosaic_intelligence`) · 1 skeleton
(`mosaic_canvas_bridge`) · 1 broken (`mosaic_commerce`). 13/15
submodules test-desert (MASTER-AUDIT-CAPABILITY.md:14-21, :191). Live
split 2026-09-09: 6 enabled / 10 disabled (core.extension export stale).
Component pipeline (PROBE-COMPONENT-PIPELINE, 1df630c): foreign SDCs
excluded by the .mosaic.yml gate; SDC slots unparsed; direct-Twig
render; component CSS on page but not canvas; component_package
schema-only; five unconditional panel sections; mosaic_registry +
mosaic_tokens present-but-disabled.
Open: author-trust slice (D-1/D-2/D-3/D-8/D-14, ratified Sept 9, never
shipped) · panel semantics (→ ADOPT Pillar E) · backend config never
audited · **M1 moderation unwalked** (Kernel cells Wave D, live walk
Wave G, ADR at truth pass) · **M2 builder keyboard-drag unverified**
(RC-A3 spike, Wave F) · findings: FINDINGS.md tail = **F-092 + F-093,
both FIXED (ship #31)**; the open list is tracked in the Wave F roadmap
(F-072, F-059, F-069, F-076, B-101, F-086).
Security posture: as v1 P3 plus Wave B shipped — **SHIP #22 CP-WAVE-B,
WAVE B CLOSED 2026-08-09** (TODO.md:10990; security & permission
cleanup).

## P4 — RATIFIED ROADMAP TO 1.0.0 (D9 order, ruled 2026-09-17)
0 ADOPT (design packet reports/ADOPT-DESIGN.md; CP-ADOPT-1..7) →
1 author-trust slice (D-1, D-2, D-3-hide, F-095, D-8, D-14) →
2 backend config audit (+M3 onboarding: setup-status page + three-role
  permission recipe; audit sizes them S = pre-tag else labelled post-tag) →
3 Wave D test-desert + D-0 retrofits + F-096 upgrade rehearsal
  (+M1 moderation Kernel cells) →
4 Wave F (D-4 translation promoted, F-072, F-059, F-069, F-076, B-101,
  F-086; +M2 RC-A3 keyboard-drag spike + RC-A2 alt-text; +M4 F-081, F-079) →
5 Wave G enable-or-demote every dark submodule, commerce fix-or-demote,
  walk round 4 (+M1 moderation live walk) →
6 minimal ACT 2 (consistency + ugliness only; F-037 → 1.1 labelled;
  packet reports/ACT2-DESIGN-PACKET.md) →
7 dev push → Arun soak → TAG 1.0.0 + F-098 truth pass (+M1 moderation ADR).
**1.1:** F-037 media picker · RC-A1 Schema.org · D-6 · registry/CEM
catalog · headless · versioned upgrades · full render-element migration ·
Lighthouse. (D-3 all-in render, M5 F-037, M6 production sites, R-C5, D-6
all post-tag / 1.1 per the M-rulings.)
Honest timeline of record: **9.5–11 weeks to tag (early-to-mid December), soak week fixed.** (Amended 2026-09-17, CP-ADOPT-2 PASS 4; was 6–7.5 weeks.)

## P5 — POINTERS
Ledger AI/TODO.md · Findings AI/FINDINGS.md · Audits MASTER-AUDIT.md,
MASTER-AUDIT-GRAND.md, MASTER-AUDIT-CAPABILITY.md · Design packets
reports/ADOPT-DESIGN.md, reports/ACT2-DESIGN-PACKET.md,
P-VIEWS-EMBED-DESIGN.md · Probes reports/PROBE-*.md · Ships SHIP-*.md ·
Governance Mosaic-ai-working-agreement.md (ledger wins on conflict),
MOSAIC-TEST-ARCHITECTURE-DIRECTIVE.md · Northstar AI/MOSAIC-NORTHSTAR.md.
Future windows: FRESH-READ before asserting; this bible orients, the
repo decides.

## TAG 1.0.0 CRITERIA (ratified 2026-09-17)
All waves closed · tag-scope submodules walked green · ADOPT §5 oracle
green · RC-A3 spike answered · findings clear or accepted · MOSAIC.md
truthful · Arun's soak (production sites = post-tag). Timeline 9.5–11 weeks (early-to-mid December), soak week fixed.

*v2 — RATIFIED 2026-09-17 by Arun's delegated ruling ("you are sole
responsibility to this now so take a right call"); overrule open.*
