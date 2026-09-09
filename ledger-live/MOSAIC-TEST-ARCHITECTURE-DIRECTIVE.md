# Mosaic — Test Architecture Directive (Binding Addendum)

> **Extends:** MOSAIC-AI-WORKING-AGREEMENT.md. Where they conflict, THIS document wins.
> **Trigger:** the current 127-test suite is NOT the standard. This directive defines the
> real one. Nothing else moves forward until this is delivered.

---

## 1. RELEASE FREEZE — carved in stone

- **NO `1.0.0` tag. No tag of ANY kind. Do not propose tagging again.**
- "127/127 green" does NOT satisfy the release gate. The working agreement's gate is:
  Sprint 0 truly done + the FULL journey suite (defined below) green in CI + security
  review underway + ≥1 external production site. None of the last three are met, and
  Sprint 0's definition is superseded by this directive.
- Pushing commits continues normally (Arun pushes). Tags: frozen until Arun explicitly
  says the word. Recommending "tag first, test later" is a violation of this agreement.

## 2. RECONCILE BEFORE ANYTHING

- `AI/TODO.md` is stale vs Sprint 103/104 reality (drag strategy changed to
  `page.mouse.*`, B-036/B-088 resolved differently than planned). FIRST task: a
  reconciliation pass — every stale entry corrected with `CORRECTION:` entries, current
  ground truth recorded. Do not claim "S0.4 already achieved" — the sweep as defined
  below has never run. A ledger that doesn't match reality is a defect.

## 3. THE ORACLE RULE — test the REQUIREMENTS, not the current site

- Test cases are written from the **specification** (the roadmap bible + MOSAIC.md +
  this directive), NOT from observed current behavior. The spec is the oracle.
- If the product doesn't do what the spec says → the test FAILS and that is a
  **FINDING**, not a broken test. Never bend an assertion to match a bug.
- If a spec'd capability doesn't exist yet (e.g. inline/visual editing on the frontend),
  its tests are still WRITTEN and marked `SPEC-PENDING` — they become the executable
  spec for that feature and flip on when it lands. Missing features surface as an
  honest gap list, never silently skipped.
- Every test case cites its requirement source (roadmap epic / MOSAIC.md section /
  this directive section). No orphan tests, no invented expectations.

## 4. THE MASTER LIFECYCLE JOURNEY — the atomic unit of this suite

This exact loop, formalized. One full pass per component; the node PERSISTS and GROWS
across passes (that accumulation is deliberate — it's how real content evolves):

```
For component C(n) on the SAME node used for C(1)..C(n-1):

 A. ADMIN / BUILDER
  1. Open the node edit form (existing node — not fresh).
  2. Add component C(n) via the builder.
  3. Fill EVERY field with REAL, meaningful values (§6.1) — no lorem, no "test123".
  4. Verify builder-side rendering/preview behavior:
     - Assert the documented pre-save preview behavior (§6.2) — including that
       the limitation itself behaves as specified.
  5. Save → Publish (full moderation path if enabled).

 B. FRONTEND AS ADMIN (logged in)
  6. Visit the published page. Verify C(n) AND all previously added C(1)..C(n-1)
     still render correctly (regression-by-accumulation).
  7. Precision render assertions (§6.3): font family, size, weight, color, placement,
     spacing — computed-style first, pixel layer second.
  8. Inline/visual editing (per spec §3): full positive + negative cases.

 C. FRONTEND AS ANONYMOUS (logged out)
  9. Same page, logged out. Content parity with admin view (minus admin chrome).
 10. All THREE breakpoints — desktop / tablet / mobile — precise content + FULL UI
     assertions at each (§6.4). No "spot check": every visible element accounted for.

 D. NEGATIVE PASS (every stage above gets its mirror)
 11. Required-field blanks block save; invalid values rejected; unauthorized roles
     blocked; draft invisible to anonymous; broken references fail loud; XSS strings
     in text fields render inert.

 E. LOOP
 12. Return to A with C(n+1) on the same node. After the final component: one
     kitchen-sink verification of the fully-loaded node across all three breakpoints,
     both roles, plus revision history integrity (each pass created a revision —
     revert one and verify).
```

Additional master journeys (same rigor):
- **Sub-module interop matrix:** every enabled sub-module × every component it touches
  (each sub-module run through the lifecycle with representative components; a
  compatibility table is a deliverable).
- **AI generation journey:** prompt → generated layout → schema-valid → renders →
  editable → publishes → anonymous-correct. Deterministic runs via a mocked/stubbed
  provider fixture (CI-safe, asserts the full pipeline); a small live-provider smoke
  kept separate and optional. Negative: invalid AI output rejected by validation,
  never persisted, never rendered.
- **Template, revision, breakpoint-override, data-source journeys** as already defined
  in the bible's J1–J10 — now upgraded to this directive's depth.

## 5. COVERAGE MODEL — how "millions of cases" is actually engineered

The intent "millions of test cases" is honored the way a Fortune-500 test architect
does it — engineered combinatorial coverage, not naive enumeration (naive cross-product
is how suites die; NIST/pairwise research is the industry standard here):

- **Depth axis (never compressed):** the Master Journey runs FULLY for every component,
  every sub-module, every builder feature. This is the human-grade layer. One worker,
  hours-long runtime: ACCEPTED. Completeness outranks speed.
- **Breadth axes (engineered):** field-value classes (valid/boundary/invalid/XSS/unicode/
  max-length), breakpoints, roles, palettes/tokens — combined via all-singles +
  **targeted pairwise where axes share a rendering or storage mechanism** (component ×
  neighbor, override × breakpoint, sub-module × component).
- **Promotion register:** every promoted pair carries a one-line mechanism hypothesis or
  fault-history reference. Any real fault found → escalate that local subset one level
  deeper. The register lives in TEST-TODO.md and is maintained forever.
- The generated matrix (thousands of executable cases from journey templates ×
  data tables) IS the "millions" — declared, counted, and reported per run.

## 6. TECHNICAL MANDATES

### 6.1 Real values
A curated real-content fixture library (government-flavored: program names, real-shaped
URLs, realistic imagery/alt text, dates, phone numbers, unicode/diacritics, RTL sample,
max-length strings). Every field of every component has a defined real value AND a
defined invalid value. No placeholders anywhere.

### 6.2 Preview-before-save
The known behavior (preview not functional before first save) is SPEC'D and ASSERTED:
pre-save state shows the documented behavior gracefully (no crash, no blank-screen
mystery), post-save preview renders correctly. If actual behavior is undocumented →
FINDING: spec gap.

### 6.3 Pixel-by-pixel — the honest version
- **Primary:** computed-style assertions (font-family/size/weight/line-height, exact
  color via ΔE2000 tolerance ≤2, geometry/bounding-box placement, spacing) — these are
  environment-stable and diagnose precisely WHAT broke.
- **Secondary:** element-clipped screenshot baselines (`toHaveScreenshot`) per component
  per breakpoint — **pinned to ONE environment** (the local/CI container that generates
  baselines), animations disabled, dynamic regions masked, human-reviewed updates only,
  CI never auto-regenerates. (Proven lesson: cross-environment pixel baselines produce
  false failures via font rendering — do not repeat that mistake.)
- **Structural:** ARIA-tree snapshots everywhere (environment-independent).
- Distinguish in assertions what the FRAME/theme owns vs what the MODULE owns — each
  gets its own expected-value source, so a failure names the guilty layer.

### 6.4 Full UI at each breakpoint
Per breakpoint: every element visible/absent as spec'd, no horizontal overflow, no
overlap between siblings (bbox check), tap targets ≥ spec size on mobile, focus order
sane, axe scan (component-scoped + one full-page) — a11y findings recorded; gating per
the bible's rules.

### 6.5 Parallelism — researched, not assumed
Default: workers=1, full sweep, and that is fine. RESEARCH TASK: safe parallelization —
per-worker content namespacing (`MOSAICQA-w{N}-`), per-worker sites/DBs (DDEV multi-db
or SQLite-per-worker), login state reuse via storageState, and whether the Master
Journey's stateful accumulating node can shard per-component-chain per worker. Adopt
multi-worker ONLY with proven isolation; never trade determinism for speed.

## 7. RESEARCH MANDATE (before writing the plan)

Deep, current research — last 2 years to present — across: Playwright official docs +
release notes (worker isolation, fixtures, aria snapshots, visual comparisons), Drupal
core's own E2E/Nightwatch and Experience Builder (Canvas) test approaches, Puck's test
patterns, page-builder testing case studies (enterprise CMS), NIST combinatorial
testing, government a11y test standards (Section 508/WCAG 2.2 harnesses), test-data
management for CMS, and CI strategies for hour-long suites (staging, sharding, nightly
full + PR smoke). Every adopted practice cited in TEST-TODO.md; every rejected
alternative noted with one line WHY. Zero hallucination tolerance: any API/pattern used
must be verified against current docs — if unverifiable, say so and stop.

## 8. THE SIX HATS — applied, not decorative

Design every piece from all six views and record one line each in TEST-TODO.md per
suite area: **QA Architect** (coverage model integrity), **Sr QA** (can a human execute
this case manually and get the same verdict?), **PM** (staging: what runs on PR vs
nightly vs weekly full sweep), **Product Owner** (does this prove the ADOPTION promises
— Twig-first, ACSF-safe, a11y, gov-grade?), **Dev Architect** (testability hooks the
product must add — more data-testids, test-only endpoints, deterministic seeds),
**Sr Developer** (maintainability: page objects, zero duplication, diamond code
standard — strict TS, no sleeps, no `any`, fail-loud).

## 9. DELIVERABLE — `AI/TEST-TODO.md`

Created after research; becomes the second bible (same read-only-after-approval rule
once Arun approves it). Must contain: research digest with citations → the full test
architecture → the component/sub-module/journey coverage matrix with COUNTS → the
fixture library spec → sprint/story breakdown to build it all → run-tier strategy
(PR smoke / nightly / full sweep) → promotion register → findings log (every FINDING
from §3 lands here) → the same honesty-ledger + COMMIT PACKAGE discipline as the
working agreement. Old suite disposition: keep as regression net until the new suite
provably covers each area, then retire per area — never big-bang delete, never
polish the retiring code.

## 10. DEFINITION OF DONE for this phase

The phase is done ONLY when: every component + every sub-module + AI generation has its
Master Journey green; the negative mirror is complete; all three breakpoints asserted
everywhere; the findings log is empty or every finding is fixed/accepted by Arun; the
full sweep runs green end-to-end twice consecutively; and TEST-TODO.md + memory match
reality exactly. Then — and only then — the tag conversation may be REOPENED by Arun.