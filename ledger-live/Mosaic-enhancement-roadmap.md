# Mosaic — Market-Driven Enhancement Roadmap (v2 Priorities)

> **Purpose:** This document is the authoritative "next in line" TODO for Mosaic development.
> It reprioritizes work based on actual 2026–2027 market needs, real user/developer/client
> demand, and competitive positioning — not architectural completeness.
>
> **Instruction to Claude Code:** Treat the epics below as the priority queue. Epic 0 is
> mandatory before ANY new feature code. Epics 1–4 outrank everything currently in the
> Phase 4/5 backlog (Mercure presence, A/B variants, Figma bridge). When this document
> conflicts with MOSAIC.md, THIS document wins — then update MOSAIC.md to match.
>
> **Created:** July 2026 · **Source:** Market gap analysis session (Arun + Claude)
> **Verdict being fixed:** Architecture 9/10, Market fit 5/10.

---

## The Three Personas — Who We Are Actually Building For

Every epic below is justified against one or more of these. If a proposed feature serves
none of them, it goes to the backlog.

| Persona | Who they are | What they buy on | What kills adoption |
|---|---|---|---|
| **P1 — The Content Author** | Non-technical editor at a gov agency / enterprise. Uses the builder daily. | "Can I build a page in 10 minutes without a ticket to IT?" | Hunting through props panels, no inline editing, broken search, no AI assist |
| **P2 — The Developer / Site Builder** | Drupal dev evaluating Mosaic vs Canvas vs Paragraphs for a client. Decides in ~30 minutes of trial. | "Does it install clean, demo instantly, and not paint me into a corner (headless, D12, migrations)?" | No demo recipe, DB bloat at scale, no decoupled path, doc drift |
| **P3 — The Client / Decision Maker** | Gov IT director, agency PM, procurement. Signs off on the platform. | "Translation? Workflow? Accessibility? Security coverage? Who maintains this?" | Missing multilingual, missing Content Moderation, single maintainer risk, no stable release |

**Market reality check (mid-2026):**
- Drupal CMS + Project Browser + Recipes is now how modules get discovered. Module pages are dead as a discovery channel.
- Drupal's AI initiative is a headline track at every DrupalCon. Every commercial builder (Site Studio, DXPR, Wix, Webflow, Framer) ships AI generation. Canvas will ship it. "No AI story" reads as "legacy" to evaluators.
- Headless/hybrid is the default enterprise RFP checkbox, even when they end up using Twig.
- Gov/enterprise (Mosaic's declared niche) will not pilot anything without: translation, moderation workflow, WCAG, search indexing, and security advisory coverage.

---

## EPIC T — Human-Level Verification Suite + RC3 Sweep (NEW #1 PRIORITY — outranks everything)

> **Purpose:** Mosaic currently ships with no end-to-end proof that it works the way a human
> uses it. Before ANY new feature (including Epic 0's doc pass companion work), stand up a
> **journey-first, human-level test suite** and immediately **sweep the already-shipped RC3
> code** with it. Every feature built after this epic MUST land with its journey test in the
> same commit — the suite is the permanent definition of "Mosaic works."
>
> **Explicit style decision: NO BDD/Gherkin.** Plain Playwright + TypeScript, page-object
> driven, tests written as readable human stories in code. (Lessons are imported from a prior
> enterprise Drupal BDD suite — the engineering discipline transfers; the Gherkin layer does not.)

### The philosophy — "human-level" defined precisely

A test is human-level when it does what a real person does and checks what a real person
sees, through the full lifecycle, with nothing mocked at the journey layer:

1. **Author's eyes:** real browser, real Drupal admin, real builder UI — drag, type, click,
   save. Never seed via API what the test claims an author can do via UI.
2. **Visitor's eyes:** the published page as an anonymous user — rendered output, correct
   content, correct styling, no console errors. SEO truth = assert content exists in the
   **initial HTML response** (fetch with JS disabled / view-source), because "Twig-first"
   is Mosaic's core promise and only a no-JS check proves it.
3. **Full lifecycle:** install → attach field → author → save → publish → render → edit →
   re-render → delete. Partial-lifecycle tests are supporting tests, not journeys.
4. **The machine's honesty:** fail loud, never silently pass. A test that can't verify its
   assertion errors out; it never logs-and-continues.

### T.0 — Non-negotiable engineering rules (carve in stone; every test file obeys)

- [ ] **T.0.1 — Zero hard sleeps.** No `waitForTimeout` anywhere, ever. Web-first
  auto-retrying assertions and `expect.poll` only. (Machine-enforced: eslint
  `playwright/no-wait-for-timeout` at error.)
- [ ] **T.0.2 — Strict TypeScript, no `any`, no `console`.** `strict: true`, eslint flat
  config with `no-explicit-any` + `no-console` at error, prettier. One `npm run verify`
  script (tsc + eslint + prettier) green before any commit. Gate wired into GitLab CI.
- [ ] **T.0.3 — Own your DOM: add `data-testid` to the builder.** Unlike testing someone
  else's site, we own Mosaic's code — every builder control (palette items, canvas nodes,
  props panel fields, breakpoint buttons, save/template buttons, splash cards) gets a
  stable `data-testid`. Selectors live in ONE central `selectors.ts`, never inline in tests.
- [ ] **T.0.4 — Per-test content ownership.** Every test creates its own content with a
  reserved prefix (`MOSAICQA-{workerIndex}-{rand}`), records created IDs, deletes by ID in
  teardown; a prefix-sweep janitor runs at suite start (env-guarded: refuses outside test
  environments) so an interrupted run never poisons the next. Idempotent setup throughout.
- [ ] **T.0.5 — No test interdependence.** Any test runs alone and green; parallel-safe by
  construction (namespaced content, no shared mutable fixtures). Retries only on flagged
  tests, never blanket; flaky quarantine capped and expiring.
- [ ] **T.0.6 — The suite is the release gate.** No tag, no release, no "stable" while any
  journey is red or quarantined. CI runs the full journey suite on every MR.

### T.1 — The RC3 SWEEP (do FIRST — validate what's already shipped)

**Rationale:** rc1→rc3 shipped in 48 hours with heavy local iteration and zero E2E coverage.
Before building anything new, prove (or disprove) that the shipped module actually works.
Every failure found here becomes a drupal.org issue and gets fixed BEFORE feature work —
this converts the version-number credibility problem into demonstrated rigor.

- [ ] **T.1.1 — Reproducible test environment.** DDEV config in-repo: Drupal 11.1 + Mosaic
  RC3 via composer + a `mosaic_qa` install script (content type with the field, editor role,
  sample media, taxonomy terms). One command from zero → testable site. This doubles as the
  Epic 5 demo-recipe foundation.
- [ ] **T.1.2 — Smoke journeys (J1 + J2 below) written and run against RC3 untouched.**
  No fixes while writing — record every failure honestly first.
- [ ] **T.1.3 — Sweep report.** Every failure → a public issue in the Mosaic queue with
  reproduction steps (transparency = trust; the community sees a maintainer who audits his
  own module). Triage: blockers fixed immediately; the rest scheduled.
- [ ] **T.1.4 — Green gate.** J1+J2 green on patched RC3 = the sweep is done; Epics 0–7
  may now proceed, each landing with its own journeys per the rule in T.3.

### T.2 — The Journey Suite (the crown layer — build in this order)

Each journey = one spec file, page-object driven, full lifecycle, anonymous-verification
included. Names below are the permanent journey registry:

- [ ] **J1 — First Contact:** fresh site → enable Mosaic → attach `mosaic_layout` to a
  content type via Field UI → open node form → builder loads, splash screen shows, no JS
  errors. (Proves install + field + widget wiring.)
- [ ] **J2 — The Author's Page:** start from scratch → drag Heading + Rich Text + Image from
  palette → edit props in panel → reorder → save → **view page anonymously** → all content
  present **in initial HTML (no-JS fetch)** + hydrated view matches → edit the node → change
  a heading → re-save → change visible anonymously. (THE core journey — Mosaic's whole pitch.)
- [ ] **J3 — Templates:** build a layout → Save as Template (name/category) → create a second
  node → splash → Use saved layout → template browser shows it with thumbnail → load → edit
  independently → original template unchanged.
- [ ] **J4 — Live Data:** component bound to a host entity field renders that field's value;
  visual query builder configured through the UI ("6 newest MOSAICQA articles") → grid
  renders exactly the seeded matching nodes; **access-check journey:** unpublished/restricted
  content NEVER appears in results for anonymous (this is a security assertion, not a
  feature assertion).
- [ ] **J5 — Design Tokens:** admin changes a token value → published Mosaic pages reflect
  it; CSS custom property cascade (`--mosaic-*` falling back through site vars) verified
  computationally (getComputedStyle), not by pixel.
- [ ] **J6 — Editorial Lifecycle:** with Content Moderation enabled: draft layout edit does
  NOT leak to anonymous; publish → visible; revision revert → prior layout intact
  byte-for-byte; unpublish → anonymous gets 403/404. (Feeds Epic 3's ADR with ground truth.)
- [ ] **J7 — Breakpoints:** set per-breakpoint overrides in the builder → verify rendered
  behavior at 393/768/1280 viewports (assert the override's computed effect, not the
  viewport label).
- [ ] **J8 — Accessibility:** axe-core (wcag2a/aa + 21aa/22aa) scoped to each shipped
  component's root on a rendered page + one full-page scan; builder-side: saving with a
  missing required alt text is BLOCKED; keyboard-only drag-and-drop of a component
  completes (WCAG 2.5.7 — test it, never assume Puck provides it).
- [ ] **J9 — Time Travel (schema migration):** create a layout → simulate a component
  schema_version bump with a `migrateInstance()` → run the migration → layout renders
  correctly and JSON validates against the new schema. (Protects the single most dangerous
  failure mode Mosaic has.)
- [ ] **J10 — The Adversary (abuse journeys):** author binds a field they lack view access
  to → server refuses; crafted POST to `/api/mosaic/resolve` for a restricted entity → 403;
  external REST source pointed at a non-allow-listed/internal address → blocked; malformed
  layout JSON POSTed to the layout endpoint → validation error, nothing persisted. (These
  double as Epic 7B's abuse tests — write once, count twice.)

### T.3 — Supporting layers (fast feedback under the journeys)

- [ ] **T.3.1 — PHPUnit Kernel/Unit:** JSON schema validation (valid + attack fixtures),
  plugin discovery (SDC + `.mosaic.yml` sidecar), every data source plugin's
  `accessCheck(TRUE)` behavior, cache tag correctness (component save invalidates the right
  pages, and ONLY those), field type CRUD round-trip, LayoutMigrator idempotence.
- [ ] **T.3.2 — Render-contract checks (cheap, high-value):** Schema.org JSON-LD present and
  valid where declared; LCP image emitted in initial HTML with `fetchpriority="high"`;
  zero browser console errors on any rendered demo page; `aspect-ratio` reserved (CLS guard).
- [ ] **T.3.3 — Static gates in CI:** PHPStan level 6, PHPCS Drupal standard, `tsc`, eslint,
  JSON-schema fixture validation — the drupal.org GitLab CI template + custom jobs.
- [ ] **T.3.4 — Feature-locked rule (permanent process):** from this epic onward, every
  feature MR ships with its journey (new or extended) in the same MR. Claude Code
  instruction: when implementing any Epic 1–7 item, FIRST extend the journey registry, THEN
  implement until the journey is green. The journey is the spec.

**Acceptance for EPIC T:** All 10 journeys + supporting layers green in GitLab CI on Drupal
11.1 and D12 at ≥2 workers, zero flaky over 3 consecutive full runs; RC3 sweep report
published in the issue queue; `npm run verify` + PHPStan/PHPCS green; a stranger can run the
whole suite with two commands (`ddev start`-equivalent + `npm test`) from the README.

---

## EPIC 0 — Documentation Truth Pass (BLOCKER — do this week, before any feature work)

**Persona:** P2 (and Claude Code itself). **Effort:** 1–2 days. **Why first:** MOSAIC.md is
the source-of-truth spec fed to Claude Code. Internal contradictions are the #1 cause of
"Claude Code behaving stupid" — it faithfully implements whichever contradictory paragraph
it read last. This is the cheapest, highest-leverage fix available.

### Tasks

- [ ] **0.1 — Kill the `responsive` vs `breakpoint_overrides` contradiction.**
  The JSON Schema section declares `breakpoint_overrides` (keyed by breakpoint ID) as the
  format and explicitly says it "replaces `responsive`". The Breakpoint Configuration
  section still documents a `responsive` object with `xs/sm/lg` keys. Decide once
  (recommendation: `breakpoint_overrides`, matching `schema/mosaic_layout_value.schema.json`),
  then grep the entire doc AND the codebase for `responsive` and purge/migrate every reference.
- [ ] **0.2 — Fix the dnd-kit ghost references.** The decision log says "Use Puck instead of
  raw dnd-kit" and notes Puck uses Pragmatic DnD internally. But: WCAG section credits
  "dnd-kit's KeyboardSensor" for criterion 2.5.7, and the Phase 1 roadmap says "Canvas:
  dnd-kit multi-container drag". Rewrite both to reference Puck's built-in keyboard DnD,
  and add a task to actually TEST keyboard-only drag in Puck (do not assume).
- [ ] **0.3 — Reconcile Phase plans vs Execution Path weeks.** The "Phase-by-Phase Roadmap"
  and "Step-by-Step Execution Path" sections drifted (e.g., live preview appears in Phase 1
  in one and Phase 2/Week 29 in the other; EntityQuery data source is Phase 2 core in one,
  "Week 37 stretch" in the other). Merge into ONE plan. Delete the loser.
- [ ] **0.4 — Sync MOSAIC.md against the actual shipped RC3 code.** The doc says "Phase 0
  COMPLETE, Phase 1 next" but drupal.org RC3 already lists the builder, Lit components,
  data sources, templates, Drush commands as shipped. The spec is now BEHIND the code.
  Audit each MOSAIC.md claim against the repo; mark each section SHIPPED / PARTIAL / NOT
  STARTED. Claude Code needs to know what exists.
- [ ] **0.5 — Add a `CLAUDE.md` to the repo root** (if not present) containing: the locked
  JSON schema rules, the "PHP Attributes only / accessCheck(TRUE) always / #[Hook] classes
  only" invariants, the security checklist, and a pointer to this roadmap as the priority
  queue. Keep it under ~150 lines — Claude Code reads it every session.
- [ ] **0.6 — Duplicate-section cleanup.** "IO Builder investigated" and the solo-timeline
  reality check each appear twice with slightly different wording. Keep one canonical copy each.

**Acceptance:** `grep -n "responsive\|dnd-kit" MOSAIC.md` returns only intentional,
consistent references. A fresh Claude Code session, given only CLAUDE.md + MOSAIC.md,
describes the current system state accurately.

---

## EPIC 1 — Mosaic AI: Prompt-to-Layout (THE headline feature)

**Persona:** P1 primarily, P3 for the demo wow. **Target:** next minor release after Epic 0.
**Market rationale:** "Describe the page, get a draft" is the 2026 baseline expectation set
by Wix ADI, Framer AI, Webflow AI, and Drupal's own AI module ecosystem. Canvas will have
it. Being first-with-AI in the *classic Drupal* builder space is a genuine land-grab —
and Mosaic's flat-node-map JSON with typed props is architecturally the EASIEST layout
format in the Drupal world for an LLM to generate correctly. This is an unfair advantage;
use it.

### Design principles

- **Provider-agnostic.** Integrate through the `drupal/ai` module's provider abstraction
  (OpenAI, Anthropic, Ollama/local, etc.). Never hardcode one vendor — gov clients often
  require on-prem/local models. Soft dependency: Mosaic works fully without AI configured.
- **AI proposes, human disposes.** AI output always lands as a DRAFT on the canvas for the
  author to edit. Never auto-publish. Every AI-generated layout is validated against
  `mosaic_layout_value.schema.json` + component prop schemas server-side before it touches
  the canvas; invalid nodes are dropped with a visible notice, never silently "fixed".
- **Guardrails are P3 features.** Log every AI generation (who, when, prompt) for gov audit
  requirements. Respect component permissions — AI may only place components the current
  user may use (reuse the manifest access filter).

### Tasks

- [ ] **1.1 — `mosaic_ai` sub-module scaffold.** Soft-depends on `drupal/ai`. Admin settings:
  enable/disable per feature (generation, alt-text, query suggest), provider selection,
  max tokens, audit logging toggle.
- [ ] **1.2 — Layout generation service.** `MosaicAiLayoutGenerator`: builds a system prompt
  from the component manifest (component IDs, prop schemas, slot rules — generated, not
  hand-written, so new components are automatically AI-available), sends the author's
  prompt, receives JSON, validates, returns a layout tree.
- [ ] **1.3 — Builder UI: "✨ Generate" entry point.** Third card on the splash screen
  ("Start from scratch" / "Use a saved layout" / "Describe your page") + a toolbar action
  for generating INTO an existing layout ("add a 3-column stats section after the hero").
- [ ] **1.4 — AI alt-text for the WCAG gate.** The builder already blocks save on missing
  alt text (`requires_alt_text`). Add a "Suggest alt text" button that sends the image to
  a vision-capable provider. Human must confirm — never auto-fill. This turns your
  accessibility enforcement from a nag into a delight, and it's a killer demo for gov.
- [ ] **1.5 — AI-assisted query builder.** Natural language → `entity_query` data source
  config ("show the 6 newest press releases tagged Health"). The AI receives the site's
  entity type/bundle/field map (from the manifest endpoint) and returns a query config,
  which renders in the EXISTING visual query builder UI for review. This compounds your
  #1 differentiator instead of competing with it.
- [ ] **1.6 — Content-aware fill.** When generating, optionally pull real entity data via
  existing data sources instead of lorem ipsum ("use real projects from this site").
- [ ] **1.7 — Prompt-injection hardening.** Treat all AI output as untrusted user input:
  schema validation, prop sanitization through the existing Twig pipeline, no raw HTML
  props from AI, component allow-list enforcement. Add this to the security checklist.
- [ ] **1.8 — Marketing moment.** Ship with a 90-second screen recording: blank node →
  prompt → full themed page. Post to drupal.org project page, Drupal Slack, a blog post.
  This video IS the adoption strategy for the quarter.

**Acceptance:** On a demo site with `drupal/ai` + any provider, an author types "landing
page for a summer road-safety campaign with a hero, 3 stat cards, and latest 4 news items"
and gets a valid, editable, schema-conformant layout in under 15 seconds. With AI
unconfigured, Mosaic shows no AI UI and functions 100% normally.

---

## EPIC 2 — Headless / Hybrid Rendering Story

**Persona:** P2, P3 (RFP checkbox). **Target:** same release cycle as Epic 1 or next.
**Market rationale:** The JSON blob is already framework-agnostic — Mosaic is sitting on a
headless story and not telling it. Enterprise RFPs in 2026–27 ask "does it support
decoupled?" even when they deploy Twig. Canvas is actively chasing this. Cost to Mosaic is
low because the architecture already did the hard part.

### Tasks

- [ ] **2.1 — Normalized layout via JSON:API.** Field normalizer for `mosaic_layout` so
  JSON:API exposes: (a) the raw layout tree, and (b) RESOLVED data source values (server
  executes entity queries/Views with full access checks and cache metadata, frontend never
  queries Drupal internals directly). Flag to choose raw vs resolved.
- [ ] **2.2 — `@mosaic/renderer` npm package.** Headless renderer consuming the normalized
  payload. Two layers: framework-agnostic core (walks the tree, maps `type` → component
  implementation) + thin React bindings (Next.js/Remix are the market). Component mapping
  is user-supplied — Mosaic ships the walker + TypeScript types (reuse
  `js/src/shared/types/schema.ts`), integrators ship their own React components.
- [ ] **2.3 — Reference Next.js example.** Small example app in the repo (or separate
  GitHub repo) rendering a Mosaic page headlessly. This is documentation-as-code; P2
  evaluators clone it during their 30-minute trial.
- [ ] **2.4 — Preview contract for decoupled.** Document how the builder's preview iframe
  can point at a decoupled frontend URL (env-configurable preview origin + postMessage
  contract). Full implementation can lag; the documented contract wins the RFP line today.
- [ ] **2.5 — Positioning update.** Add "Hybrid by design: Twig-first for SEO, JSON-native
  for headless" to the project page pitch and comparison table (a row Canvas can't cleanly
  claim while Twig-less, and Site Studio can't claim at all).

**Acceptance:** `npx create-next-app` + `@mosaic/renderer` + the example mapping renders a
real Mosaic page from a live Drupal backend in under 30 minutes of developer effort,
including access-checked query data.

---

## EPIC 3 — Multilingual + Editorial Workflow ADR (the gov/enterprise gate)

**Persona:** P3 hard requirement, P1 daily reality. **Target:** ADR now, implementation next
2 releases. **Market rationale:** This is the difference between "cool demo" and "NYS ITS
could actually run it." No translation + no Content Moderation = automatic disqualification
in every government and most enterprise evaluations. It is also the hardest unsolved design
problem in the current spec — one line ("Week 39: translatable vs non-translatable props")
covers what needs a full architecture decision. Do the thinking BEFORE more features pile
onto an untranslatable foundation; retrofitting translation onto a JSON blob is brutal.

### Tasks

- [ ] **3.1 — Write `docs/adr/ADR-translation-and-workflow.md`.** Must decide, explicitly:
  - **Translation model:** Symmetric (one layout, translatable prop values within nodes)
    vs asymmetric (independent layout per language). Recommendation to evaluate first:
    symmetric default — same structure, translated text props — with an explicit
    "decouple this translation" escape hatch, because gov sites overwhelmingly want
    structural parity across languages. Study how Canvas/XB and Paragraphs (asymmetric
    pain) handled this; steal lessons, not bugs.
  - **What is translatable:** string/text/rich-text props = yes; layout structure, data
    source configs, breakpoint overrides = no (shared). Mark translatability per prop in
    the component schema (`translatable: true` in prop definition), surface it in the
    builder UI ("This text will need translation in 3 languages").
  - **Storage:** how translated prop values are stored (per-langcode field deltas vs
    per-node prop translation map inside the JSON) — and how this interacts with the
    schema migration system (`migrateInstance()` must migrate ALL translations).
  - **Content Moderation:** confirm and TEST that `mosaic_layout` participates correctly
    in draft/published moderation states via standard entity revisions. Define behavior
    for: editing a draft while published version live, preview-per-moderation-state,
    revert. Templates entity gets moderation too or explicitly not (decide).
  - **Workspaces:** state a position (supported / not supported / roadmap). "Not yet,
    tracked in issue #X" is acceptable; silence is not.
- [ ] **3.2 — Translation UI in the builder.** Language switcher in the toolbar; editing
  the French translation shows the same canvas with French prop values; untranslated
  props show source-language value with a visual "untranslated" badge.
- [ ] **3.3 — TMGMT compatibility check.** Gov translation workflows run through TMGMT or
  export/import. Provide a translatable-strings extractor (all translatable props of a
  layout → XLIFF-friendly structure) even if full TMGMT plugin comes later.
- [ ] **3.4 — Moderation + preview test matrix.** Kernel/Functional tests: draft layout
  edit does not leak to anonymous; preview endpoint respects moderation state access;
  revision revert restores prior JSON intact.

**Acceptance:** The ADR is merged and MOSAIC.md references it. A bilingual demo site
(EN/ES) shows: one page, two languages, shared structure, translated text, correct
moderation behavior (draft ES translation invisible to anonymous until published).

---

## EPIC 4 — Revision Storage Diet (solve the problem you claim to solve)

**Persona:** P2 (scale credibility), P3 (5-year TCO). **Target:** design + measurement now,
implementation before any 1.x "stable". **Market rationale:** Mosaic's strategic pitch is
"the contrib proof-of-concept for core issue #3440578" — whose central idea is hash-based
diff storage to kill the Paragraphs revision-bloat disease (50GB+ databases). Current
Mosaic stores the FULL JSON blob per entity revision, inheriting the exact disease. On a
gov site with 10k pages × 50 revisions × 100KB blobs, that's the same 50GB story. If Mosaic
proves the storage model, the core-adoption path becomes real; if it skips it, the "core
PoC" claim is marketing.

### Tasks

- [ ] **4.1 — Measure first.** Script/Drush command: generate 1k nodes × 30 revisions with
  realistic layouts; report table sizes. Establish the baseline number (this becomes blog
  post content later: "how we cut layout revision storage by N%").
- [ ] **4.2 — Design the dedup layer per #3440578's model.** Content-hash lookup table
  (`mosaic_layout_blob`: hash → JSON, refcounted) + revisions store the hash reference.
  Unchanged layouts across revisions cost ~0 bytes. Evaluate node-level vs blob-level
  granularity (blob-level is simpler and captures the dominant case: revision without
  layout change).
- [ ] **4.3 — Garbage collection.** Cron/queue job removing unreferenced blobs after
  revision deletion; Drush `mosaic:storage-report` + `mosaic:storage-gc`.
- [ ] **4.4 — Transparent upgrade path.** Update hook migrating existing full-blob rows to
  hashed storage, idempotent (ACSF site-duplication rule), queue-based for big sites.
- [ ] **4.5 — Report findings back to core issue #3440578.** Comment with implementation
  notes + numbers. This is the highest-credibility marketing Mosaic can buy, and it's free.

**Acceptance:** The 1k×30 benchmark shows ≥80% storage reduction for the
"revision-without-layout-change" case; existing sites upgrade with zero data loss;
findings posted to the core issue.

---

## EPIC 5 — Adoption Engineering: The 5-Minute Wow

**Persona:** P2's 30-minute trial, P3's demo meeting. **Target:** continuous, first pieces
immediately. **Market rationale:** In 2026 modules are discovered through Drupal CMS
Recipes and Project Browser, and evaluated via "did it wow me in 5 minutes." Mosaic
currently offers a module page and a wiki. Three more data sources add less adoption than
one demo recipe. Code 30%, trust 70%.

### Tasks

- [ ] **5.1 — `mosaic_demo` recipe.** Applying it yields: content type with the field,
  6–8 themed sample pages (hero, cards, tabs, live search, a query-driven grid), sample
  design tokens, an editor role with correct permissions. One command → full showcase.
- [ ] **5.2 — Project Browser readiness.** Logo, screenshots, category metadata, concise
  description tuned for the Browser card. Verify how Mosaic renders inside Project
  Browser's UI today.
- [ ] **5.3 — Public demo site.** Even a $10 VPS with the demo recipe + auto-reset cron +
  guest editor login. "Try the builder" link on the project page. Nothing converts P1/P3
  like touching the canvas.
- [ ] **5.4 — 3 short videos (≤2 min each):** builder basics (P1), visual query builder
  (the differentiator — P1/P2), install-to-first-page via recipe (P2). Host on the
  project page + wiki + YouTube.
- [ ] **5.5 — Launch content:** one drupal.org blog-style announcement ("Why I built a free
  Site Studio alternative"), one Drupal Slack #contrib post, submit a session to the next
  DrupalCamp/NYC/GovCon in reach. GovCon is literally Mosaic's target persona in one room.
- [ ] **5.6 — Versioning trust repair.** No 1.0.0 stable until: security review done
  (Epic 7), ≥1 external site in production, Epics 0+3 ADR complete. Communicate the bar
  openly in the README ("what stable means to us") — it converts the rc1-in-week-1 stumble
  into a credibility statement.
- [ ] **5.7 — Co-maintainer recruitment.** Pin a "maintainers wanted" note in README +
  project page; tag 2–3 good first issues. P3 counts maintainers before signing.

**Acceptance:** A stranger with a fresh Drupal 11 install reaches an editable, themed demo
page in ≤5 minutes using only public instructions. Project page has video + demo link.

---

## EPIC 6 — Inline Editing on the Canvas

**Persona:** P1 — this is their #1 real-world complaint driver. **Target:** after Epics 0–1.
**Market rationale:** Every modern builder (Webflow, Framer, Wix, Site Studio, Canvas's
direction) lets authors click text on the canvas and type. Mosaic's current
select-component-then-find-prop-in-side-panel flow is developer-brained; authors
experience it as friction on every single edit. This is UX debt that compounds into churn.

### Tasks

- [ ] **6.1 — Inline plain-text editing.** Click a text/heading prop directly on the Puck
  canvas → contenteditable in place → syncs to store + props panel. (Investigate Puck's
  inline/contentEditable field support first — it may be mostly built-in; do not
  hand-roll what Puck provides.)
- [ ] **6.2 — Inline rich text via CKEditor5 balloon.** For rich-text props, CKEditor5
  balloon/inline build scoped to the site's allowed formats. Reuse Drupal's editor config
  — do NOT invent a parallel rich-text security model; output must flow through the same
  format filtering as body fields.
- [ ] **6.3 — Direct-manipulation affordances:** hover outlines with component name,
  click-to-select, in-canvas ✕ delete and drag handle — reduce props-panel round trips
  for the 3 most common actions (edit text, delete, move).
- [ ] **6.4 — Keyboard/a11y parity.** Every inline interaction usable keyboard-only
  (WCAG 2.5.7 discipline extends here); axe-core panel keeps passing.

**Acceptance:** An author changes a headline by clicking it and typing — zero side-panel
interaction — and the change persists through save/reload. Rich text respects the site's
text format restrictions.

---

## EPIC 7 — Search Indexing + Security Review (the silent disqualifiers)

**Persona:** P3 (both are procurement checkboxes), P1 (search). **Target:** search extractor
next release; security review before any stable tag.

### 7A — Search integration

**Rationale:** If a Hero headline typed into Mosaic can't be found by the site's search,
government sites discover it in week one of a pilot and walk. JSON blobs are invisible to
DB search and to Search API's default field extraction.

- [ ] **7A.1 — Rendered-content extraction service.** `MosaicSearchExtractor`: layout JSON →
  plain-text (walk nodes, pull text-bearing props per component schema, strip markup).
  Exclude non-content props (URLs, config, tokens).
- [ ] **7A.2 — Search API processor plugin** exposing extracted text as an indexable field
  on the host entity; invalidate/reindex on layout save.
- [ ] **7A.3 — Core Search fallback:** ensure `search_index` sees the rendered output
  (verify the formatter output is captured by core search's rendering; document if a
  processor is needed).
- [ ] **7A.4 — Bonus (cheap, big P1 win):** builder-side "find on this page" that jumps
  to/highlights the node containing a search term — big layouts get hard to navigate.

### 7B — Security review

**Rationale:** Canvas took 2 advisories in its first year; Mosaic's REST data source has
the identical SSRF shape (SA-CONTRIB-2026-017 pattern), and the resolve endpoint is an
access-bypass magnet. Getting formally reviewed BEFORE stable is both protection and a
P3 selling point.

- [ ] **7B.1 — Self-audit against the existing checklist** (accessCheck(TRUE) everywhere,
  CSRF on POST, permission on every route, SSRF allow-list enforced server-side, prop
  sanitization, manifest permission filtering) — as automated tests, not a manual pass.
- [ ] **7B.2 — Abuse-case tests:** author binds a field they can't view (must 403), crafted
  data source posts to /resolve for a restricted entity (must 403), external REST pointing
  at 169.254.169.254 / internal hosts (must be blocked by allow-list).
- [ ] **7B.3 — Apply for the drupal.org security review / stable-release process** and
  fix findings. Only then schedule 1.0.0 stable (ties into 5.6).

**Acceptance:** Search: text typed into any shipped component is findable via Search API
on a demo site. Security: abuse-case tests green in CI; review process formally underway.

---

## Deprioritized (moved BELOW everything above — do not let these jump the queue)

| Feature (from MOSAIC.md Phase 4/5) | Why it waits |
|---|---|
| Mercure SSE presence avatars | Zero P3 asks for it pre-adoption; infra burden; Content Lock covers the real need |
| A/B component variants | Optimization feature for sites with traffic — Mosaic needs sites first |
| Figma DTCG token bridge | Design-team luxury; niche until agencies adopt |
| Storybook auto-generation | Valuable for contributor DX later; not adoption-critical |
| Component usage analytics dashboard | Needs usage to analyze |
| `mosaic_canvas_bridge` | Keep the stub; deep interop only once Canvas's entity-agnostic direction settles |

They stay on the roadmap — they just never outrank Epics 0–7 again.

---

## Sequencing Summary (feed this order to Claude Code)

```
NOW (first, before all):  EPIC T.0/T.1 — test rules + env + RC3 SWEEP      [find the truth]
                          EPIC 0  — doc truth pass + CLAUDE.md             [1–2 days, parallel]
NEXT (this month):        EPIC T.2 — journeys J1–J4 green                  [the crown layer]
                          EPIC 3.1 — translation/workflow ADR (design)     [thinking, not code]
                          EPIC 5.1/5.2 — demo recipe + Project Browser     [reuses T.1.1 env]
RELEASE N+1:              EPIC T.2 — J5–J10 complete + T.3 layers          
                          EPIC 1  — Mosaic AI (headline; lands WITH its journey)
                          EPIC 7A — search extractor                       [quiet disqualifier]
RELEASE N+2:              EPIC 2  — headless renderer + JSON:API           
                          EPIC 6  — inline editing                         
                          EPIC 3  — translation implementation (J6 informs the ADR)
BEFORE ANY 1.0 STABLE:    EPIC 4  — revision storage diet                  
                          EPIC 7B — security review (J10 = the abuse tests)
CONTINUOUS:               EPIC T.3.4 — every feature MR ships with its journey
                          EPIC 5  — videos, demo site, talks, co-maintainers
```

**One-line strategy:** Win the *"free, AI-assisted, translation-ready, ACSF-native page
builder for government and enterprise Drupal"* niche — a sentence neither Site Studio
(not free, no AI-open, cloud-locked) nor Canvas (no ACSF story, no Twig, entity-locked)
can say. Every sprint should make that sentence more true.