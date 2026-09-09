---
name: Bash arithmetic with set -e
description: In bash scripts using set -e, ((VAR++)) when VAR=0 returns exit code 1 and kills the script — use ((++VAR)) instead
type: feedback
originSessionId: 23adca41-0ddb-4bbc-8455-2a8fe073bba4
---
In QA scripts that use `set -euo pipefail`, the `ok()`/`fail()` counter pattern must use pre-increment:

```bash
# WRONG — ((PASS++)) when PASS=0 evaluates to 0 (falsy), exits the script
ok()   { echo "  ✔ $1"; ((PASS++)); }
fail() { echo "  ✘ $1"; ((FAIL++)); }

# CORRECT — ((++PASS)) evaluates to the new value (≥1), always truthy
ok()   { echo "  ✔ $1"; ((++PASS)); }
fail() { echo "  ✘ $1"; ((++FAIL)); }
```

**Why:** In bash, `((expr))` returns exit code 1 when `expr` evaluates to 0. `PASS++` (post-increment) uses the *old* value (0) for the expression result. With `set -e`, exit code 1 from inside any function call kills the script immediately, even mid-pipeline.

**How to apply:** Always use `((++VAR))` (pre-increment) in `ok`/`fail` helper functions in `scripts/qa/sprint-NN-qa.sh`. For loop counters, `VAR=$((VAR+1))` is the safest form — it never returns a non-zero exit code. Also avoid the pipeline `while IFS= read` pattern for incrementing PASS/FAIL — subshell variables don't propagate back to the parent shell. Run phpunit as a direct command and use its exit code instead.
