---
name: Feedback — Kernel/Functional tests need live DB (RESOLVED Sprint 94)
description: The Kernel/Functional test failures were fixed in Sprint 94. All 2713 tests pass inside DDEV (0 failures). Running outside DDEV still fails with DB-connection errors.
type: feedback
originSessionId: 23adca41-0ddb-4bbc-8455-2a8fe073bba4
---
When running the full PHPUnit suite without DDEV running, Kernel/Functional tests still fail with "Failed to connect to your database server." — this is expected and not a bug.

**Why:** Kernel and Functional tests bootstrap Drupal and need a real database. Sprint 94 fixed all the actual code/assertion failures; the remaining failures are only DB-connectivity issues from running outside DDEV.

**How to apply:** Always run the full suite inside DDEV (`ddev exec vendor/bin/phpunit ...`). Unit tests (2577 as of Sprint 94) can run without DB. Full suite result as of Sprint 94: 2713 tests, 0 failures, 0 errors (2 intentional skips) inside DDEV.
