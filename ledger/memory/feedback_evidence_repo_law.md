---
name: feedback_evidence_repo_law
description: Evidence-repo (mosaic-e2e-evidence) push law — now also carries campaign ledgers; mandatory pre-push secret guard
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 23adca41-0ddb-4bbc-8455-2a8fe073bba4
  modified: 2026-09-09T19:02:53.077Z
---

The `mosaic-e2e-evidence` repo (remote `arunkarthickasok/mosaic-e2e-evidence`, ledgered as temporary → private-or-deleted before any public tag marketing) is AI-pushable (unlike the Mosaic module git, which is Arun-only — see [[feedback_commit_flow]]). Evidence albums live under `reports/`.

**LEDGER-TO-REPO amendment (Arun-ratified 2026-09-09):** the repo now ALSO carries the campaign ledgers under `ledger/`:
- `AI/TODO.md`, `AI/FINDINGS.md`, `AI/MASTER-AUDIT-CAPABILITY.md`, `AI/MOSAIC-BIBLE.md`
- the implementer's own MEMORY/self-maintained `.md` files (this `~/.claude/.../memory/` set) → `ledger/memory/`

**STILL NEVER push:** secrets, `.env`, settings.php, DB dumps, credentials, code/DB/raw-secret content. Reports stay evidence-quality (verdicts + file:line citations, not code).

**MANDATORY PRE-PUSH GUARD** (run on EVERY push, AFTER the remote check): grep the staged set for `password|secret|token=|api_key|BEGIN.*PRIVATE|hash_salt`. Any hit that is a real credential VALUE/assignment = **ABORT + report** (do not push). Prose mentions of these words inside the ledger docs (e.g. "the JWT secret", "webhook_secret field") are not credentials — report them transparently and proceed. When in doubt, abort and ask.

**LEDGER RELOCATION (Arun-ratified 2026-09-09, evidence commit `d8949d0`):** the campaign `.md` ledgers no longer live under `ledger/` as copies — `<mosaic>/AI` was physically moved INTO the evidence repo as `ledger-live/`, and `<mosaic>/AI` is now a symlink → `ledger-live`. So **report/album/ledger writes land in `ledger-live` directly (NO copy step)**. The old copy-based `ledger/` doc copies were retired (git renamed them into `ledger-live/`); `ledger/memory/` copies stay (memory files live in `~/.claude` and are copied at sync — they are NOT in `AI/`/`ledger-live`). Code-ish artifacts (`ledger-live/*.patch`, `ledger-live/*.php`) are gitignored in the evidence repo: present on disk (reachable via the symlink) but NEVER published. See [[feedback_isolation_law]] for the symlink self-check + rollback recipe.

**Sync cadence:** `ledger-live` is already the live tree (direct writes); at every post-ship sync AND every run closeout, re-copy `~/.claude` memory → `ledger/memory/`, run the isolation self-check + guard, and push.

**Why:** keeps the campaign's decision-trail and audit reports durable + shareable-on-demand without ever risking a credential leak; the guard is the safety net that lets the .md ledgers ride along safely. See [[project_mosaic]].
