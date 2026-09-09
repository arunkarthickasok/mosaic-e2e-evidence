---
name: Sprint Audit Gate — Mandatory After Every Sprint
description: After every sprint, run the full tool suite (PHPUnit + PHPCS + PHPStan + drush en + security review) and write an audit report before starting the next sprint
type: feedback
originSessionId: 23adca41-0ddb-4bbc-8455-2a8fe073bba4
---
After every sprint completes, run the full end-to-end verification audit before starting the next sprint. No exceptions.

**Why:** User explicitly requested "deep research, make sure everything is as per how it should be — Drupal contrib standards, PHP standards, no security violations — this check needs to happen after every sprint."

**How to apply:**

1. Run the tool suite (in DDEV):
   - `php -l` — syntax lint
   - `phpunit` — unit tests (0 failures required)
   - `phpcs --standard=Drupal,DrupalPractice` — 0 ERRORS required (warnings OK if all line-length)
   - `phpstan --level=6` — 0 errors required
   - `drush en mosaic` — clean install required
   - Manual security review against OWASP Top 10

2. Write the audit report to `sprints/audits/sprint-NN-audit.md`

3. Update the sprint's DoD checklist with tool results

4. Fix ALL PHPCS errors before marking sprint complete (phpcbf + manual)

**Template audit file:** `sprints/audits/sprint-01-audit.md` — use as base for all future audits.

**Known acceptable suppressions in phpstan.neon.dist:**
- `missingType.iterableValue` — Drupal plugin/JSON Schema arrays are legitimately untyped; revisit Sprint 06
- `method.alreadyNarrowedType` (scoped to `tests/` only) — `assertInstanceOf()` in smoke tests is explicit behavioral documentation; the identifier is `method.alreadyNarrowedType` (NOT `alreadyNarrowedType`)
- `new.static` in `ContainerFactoryPluginInterface::create()` — Drupal canonical pattern
- `treatPhpDocTypesAsCertain: false` — prevents false positives in unit test assertions

**QA automation (from Sprint 01):**
- Sprint QA: `ddev exec bash .../scripts/qa/sprint-NN-qa.sh` — 12 gates, exit 0 = clean
- Regression: `ddev exec bash .../scripts/qa/regression.sh [--up-to NN]` — runs all sprints in sequence
- Smoke tests: `tests/src/Unit/Smoke/SprintNNSmokeTest.php` — behavioral AC verification
- PHPStan Gate 9 checks exit code (`PHPSTAN_EXIT=$?`), NOT text grep — raw format outputs nothing on success
