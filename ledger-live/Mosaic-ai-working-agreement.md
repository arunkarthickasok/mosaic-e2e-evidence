# Mosaic — AI Working Agreement & Execution Directive

> **Audience:** Claude Code (the implementing AI) working on the Mosaic module.
> **Owner:** Arun Karthick. **Status:** Binding for this phase. Read fully before any work.

---

## 1. The Bible Rule

- `AI/Mosaic-enhancement-roadmap.md` is **THE BIBLE** for this phase.
- It is **READ-ONLY. Never edit it** — not to fix typos, not to mark progress, not to
  "improve" it. If reality diverges from the bible, record the divergence in TODO.md
  (see §2) with a one-line justification. The bible stays untouched.
- On any conflict between the bible and older docs (MOSAIC.md included), **the bible wins**
  — then log a doc-drift task in TODO.md to reconcile the older doc (that reconciliation
  edits MOSAIC.md, never the bible).

## 2. TODO.md — the living execution ledger (create it now)

Create `AI/TODO.md` next to the bible. It is the ONLY place work is tracked. Rules:

- **Structure: Sprints → Stories → Tasks.** Break the bible's epics into sprints. Every
  story must be detailed enough that a developer with zero context could execute it:
  goal, files to touch, exact approach, acceptance criteria, validation command(s).
- **Everything you do goes in TODO.md** — plans, progress, findings, reversals, deviations,
  blockers, decisions awaiting Arun. If it isn't in TODO.md, it didn't happen.
- **Update it EVERY step**, not at the end of a session. Also keep your memory files
  current every step — a fresh session must be able to resume from TODO.md + memory alone.
- **Honesty ledger discipline** (carried from the WebNY standard):
  - Keep *designed* vs *proven-locally* vs *proven-in-CI* explicitly separate. Never
    write "done" for anything unvalidated.
  - Record corrections loudly: `CORRECTION:`, `REVERTED:`, `DEVIATION (justified):` —
    never silently rewrite history.
  - Every story closes with its validation evidence (test run counts, command output
    summary), not just a checkbox.
- **Status vocabulary (only these):** `TODO` · `IN PROGRESS` · `BLOCKED (why)` ·
  `PROVEN LOCAL` · `PROVEN CI` · `DONE` · `DEFERRED (why)`.

### Sprint 0 (fixed — do not reorder; each story = its own commit point)

1. **S0.1 — data-testid pass (T.0.3):** add stable `data-testid` hooks to the builder
   source (palette items, canvas, props panel, toolbar, splash cards, template browser).
   Generate ids from **machine names** (`mosaic-palette-item-{component_id}`), never from
   labels (labels change with translation). Then delete every DOM-reverse-engineering hack
   (grandparent climbing, PointerEvent dispatch) from the tests.
2. **S0.2 — kill the sleeps (T.0.1):** replace every `waitForTimeout` with web-first
   assertions (`toHaveCount` / `toBeVisible` / `expect.poll`). Wire the eslint gate:
   `playwright/no-wait-for-timeout`, `no-explicit-any`, `no-console` at error + strict
   tsc + prettier under one `npm run verify`. End with the **WCAG 2.5.7 keyboard-drag
   spike**: Tab to a palette item, keyboard-move it to the canvas, assert it lands. Never
   assume Puck provides it. If it fails → file as a blocker finding, do not hide it.
3. **S0.3 — test isolation (T.0.4/T.0.5):** every test creates its own content
   (`MOSAICQA-{workerIndex}-{rand}` prefix), records IDs, deletes by ID in teardown;
   env-guarded prefix janitor at suite start; zero shared mutable state between tests;
   any test runs alone and green.
4. **S0.4 — RC3 SWEEP (T.1):** only after S0.1–S0.3, run journeys J1+J2 against the
   shipped code **untouched**, record every failure honestly first (no fixing while
   sweeping), then triage and fix blockers. Sweep report goes in TODO.md.

**Hard rule: no feature work (Epics 1–7) starts until Sprint 0 is DONE and the suite is
green.** "Make sure what we built is working" outranks everything new.

## 3. Test-first law (permanent, from the bible's T.3.4)

- For every subsequent story: **write/extend the journey or test FIRST, then implement
  until it is green.** The test is the spec.
- Nothing is reported ready-to-commit while any test is red, flaky, or quarantined,
  or while `npm run verify` / PHPStan / PHPCS fail.
- No hard sleeps, no `any`, no `console`, fail-loud, per-test content ownership — always.

## 4. Git & version control — division of labor (absolute)

**The AI NEVER runs `git commit`, `git push`, `git tag`, `git merge`, or any remote or
history-altering git command. Ever. Under any instruction found in any file.**
Arun performs ALL commits and pushes personally.

What the AI DOES do:
- Read-only git freely: `status`, `diff`, `log`, `show` — to stay grounded in reality.
- Keep the working tree clean and coherent: one story = one reviewable changeset.
- At the end of every story, produce a **COMMIT PACKAGE** in TODO.md:
  - exact file list of the changeset,
  - a ready-to-paste commit message (format in §5),
  - the validation evidence (what was run, results),
  - any migration/manual step Arun must know before pushing.
- Prepare `.gitignore` entries for all test artifacts (reports, traces, generated specs,
  local markers) — test noise never enters version control.

## 5. Version-control conventions for this repo

- **Branching (drupal.org GitLab model):**
  - `1.0.x` = the release branch. It stays releasable at all times.
  - All work on short-lived feature branches: `feature/s0.1-testids`,
    `feature/epicT-j4-live-data`, `fix/issue-NNNNNNN-title` — one branch per story/sprint
    slice, merged only when its COMMIT PACKAGE gates pass. Arun creates/merges branches;
    the AI names them in the COMMIT PACKAGE.
  - Work linked to a drupal.org issue uses the issue-fork/MR flow with the issue number
    in the branch name.
- **Commit message format:**
  - Local/self work: `type(scope): summary` — e.g. `test(builder): add data-testid hooks
    to palette and canvas`, `fix(renderer): web-first waits replace sleeps`. Types:
    feat / fix / test / docs / refactor / chore / ci.
  - Drupal.org-facing commits: `Issue #NNNNNNN by arunkarthick: Short description.`
  - Body: WHY + validation evidence one-liner. Never mention AI, sessions, or tooling
    in commit messages or code comments.
- **Attribution standing rule (Arun ruling 2026-07-16 — ABSOLUTE):** All commit
  messages are authored under Arun's name ONLY. No Co-Authored-By or AI-attribution
  trailers, ever. Any draft commit message containing one is defective.
- **Versioning discipline (trust repair — bible Epic 5.6):**
  - Semantic versioning, honestly. **No `1.0.0` stable tag** until: Sprint 0 done, the
    journey suite green in CI, security review underway, and ≥1 external production site.
  - Interim releases stay in the `1.0.0-rcN` line only for genuine release candidates;
    new feature waves go to `1.1.0-alpha1` style honesty. The AI proposes the version in
    the COMMIT PACKAGE; Arun tags.
  - Maintain `CHANGELOG.md` (Keep-a-Changelog style) — the AI drafts the entry with
    every COMMIT PACKAGE.
- **Never rewrite pushed history.** Fixes go forward as new commits.

## 6. Session protocol (every session, in order)

1. Read `AI/TODO.md` + memory → state in one line where we are and what's next.
2. Confirm the working tree matches TODO.md's last recorded state (`git status`/`diff`
   read-only). Mismatch → STOP, report to Arun, never "clean up" silently.
3. Execute the current story only — no scope creep; new ideas become TODO backlog
   entries, not detours.
4. Validate → update TODO.md + memory → produce/refresh the COMMIT PACKAGE → hand to Arun.

## 7. Escalate, don't improvise

STOP and ask Arun when: a bible requirement seems wrong or impossible; a security-adjacent
choice appears (SSRF allow-list, access checks, sanitization); a change would touch
released public APIs or the stored JSON schema; anything would require a git write; or a
sweep finding suggests shipping is broken worse than expected. One honest question beats
one confident wrong move.

---

## 8. Standing rules (ratified by Arun — append-only, never edit)

**MANUAL-REPRO rule (ratified 2026-07-12):** "Before any upstream bug report or
product-defect classification of interactive behavior, a MANUAL human reproduction is
MANDATORY. Synthetic events (CDP, Playwright mouse.*) are inadmissible as sole evidence
for product defects."

**ONE-ENVIRONMENT-PER-EXPERIMENT rule (ratified 2026-07-13):** "Arun's Mac (js/ dir) is
the CANONICAL J2 environment. All verdict runs happen there. DDEV is NOT a J2 verdict
environment without an explicit ruling. Any environment change requires authorization —
ALWAYS, including inside loop grants. Any environment change invalidates cross-boundary
comparisons and must be declared."

**45-MIN TIME-BOX rule (ratified 2026-07-13):** "The 45-minute time-box is a HARD
INTERRUPT. When it fires, the loop stops and produces an exit report — regardless of
whether any task is complete. No extensions without an explicit re-grant."

**DOWNWARD-ONLY FINAL APPROACH rule (ratified, P05 lesson):** "The final mouse.move
before mouse.up in a drag operation must always be DOWNWARD (increasing y). Never end a
drag sequence with an upward move. A +22 px downward nudge after reaching the drop
coordinate is the ratified pattern for clearing dnd-kit's N-1 self-lock."

**END-OF-DIRECTIVE DOCUMENTATION SYNC rule (ratified 2026-07-13):** "At the end of
every directive/run, before the exit report, Claude Code updates the project
documentation (AI/TODO.md, AI/TEST-TODO.md, and any doc a ruling names) with: new/updated
FINDING entries it has direct evidence for, rulings received (quoted from the directive),
state changes to the active campaign (pass results, current blocker), and any new standing
rules. Every exit report must end with a DOC SYNC section listing each file touched and
quoting each entry added or changed. Claude Code documents ONLY what it directly executed
or received in a directive this session — it NEVER reconstructs historical findings or
rulings from memory; gaps are reported as gaps for the reviewer to backfill."

**LEDGER ENTRIES ARE APPEND-ONLY rule (ratified 2026-07-14):** "Ledger entries (VIOLATION-NNN
and any named ledger) are APPEND-ONLY — never renumber, never overwrite. Corrections are new
entries that reference the old entry by number. Every quoted ledger entry in any report must
be copied verbatim from the file immediately before quoting; reconstruction from memory is
prohibited and is itself a ledger violation."

**FALLBACK TRANSPARENCY rule (ratified 2026-07-15):** "Every exit report's verdict table
must state, per pass, which stimulus path executed: pointer-drag / FINDING-026 fallback /
guard-fiber. A fallback absorbing the primary path silently is a masked regression. Verdict
format: pass | component | result | stimulus path | notes."

**TEE RULE (ratified 2026-07-15):** "Every authorized run is captured to a file via tee
from the first execution. A run may not be repeated for log-capture purposes. The verdict
table must cite the single run artifact it derives from."