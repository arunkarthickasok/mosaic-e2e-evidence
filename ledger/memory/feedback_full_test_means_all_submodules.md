---
name: Feedback — "Full test" / "full project" means ALL submodules included
description: When Arun says full test, full QA, or full project, he means src/ AND all 15 submodules in modules/ — never src/ alone.
type: feedback
originSessionId: 23adca41-0ddb-4bbc-8455-2a8fe073bba4
---
When Arun says "full test", "full project", "run tests", or any equivalent — it means the entire codebase: `src/` AND every submodule under `modules/`.

**Why:** In a previous session the assistant ran PHPStan and PHPUnit on `src/` only and reported "all clean" while submodules had real bugs. Arun was angry and said it was unacceptable. This must never happen again.

**How to apply:**
- PHPStan: always `phpstan analyse web/modules/custom/mosaic/src/ web/modules/custom/mosaic/modules/ --level=5 -c phpstan.neon`
- PHPCS: always scan both `src/` and `modules/` together
- PHPUnit: always run `php vendor/bin/phpunit web/modules/custom/mosaic/tests/` (covers all submodule tests)
- `drush en`: enable all 15 available submodules before gating
- Never skip optional submodules on the grounds that their 3rd-party deps aren't installed — install the deps first
