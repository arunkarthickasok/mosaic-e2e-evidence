---
name: feedback_evidence_repo_law
description: Evidence-repo (mosaic-e2e-evidence) push law — now also carries campaign ledgers; mandatory pre-push secret guard
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 23adca41-0ddb-4bbc-8455-2a8fe073bba4
  modified: 2026-09-09T18:29:26.853Z
---

The `mosaic-e2e-evidence` repo (remote `arunkarthickasok/mosaic-e2e-evidence`, ledgered as temporary → private-or-deleted before any public tag marketing) is AI-pushable (unlike the Mosaic module git, which is Arun-only — see [[feedback_commit_flow]]). Evidence albums live under `reports/`.

**LEDGER-TO-REPO amendment (Arun-ratified 2026-09-09):** the repo now ALSO carries the campaign ledgers under `ledger/`:
- `AI/TODO.md`, `AI/FINDINGS.md`, `AI/MASTER-AUDIT-CAPABILITY.md`, `AI/MOSAIC-BIBLE.md`
- the implementer's own MEMORY/self-maintained `.md` files (this `~/.claude/.../memory/` set) → `ledger/memory/`

**STILL NEVER push:** secrets, `.env`, settings.php, DB dumps, credentials, code/DB/raw-secret content. Reports stay evidence-quality (verdicts + file:line citations, not code).

**MANDATORY PRE-PUSH GUARD** (run on EVERY push, AFTER the remote check): grep the staged set for `password|secret|token=|api_key|BEGIN.*PRIVATE|hash_salt`. Any hit that is a real credential VALUE/assignment = **ABORT + report** (do not push). Prose mentions of these words inside the ledger docs (e.g. "the JWT secret", "webhook_secret field") are not credentials — report them transparently and proceed. When in doubt, abort and ask.

**Sync cadence:** ledgers are re-copied into `ledger/` and re-pushed at every post-ship sync automatically.

**Why:** keeps the campaign's decision-trail and audit reports durable + shareable-on-demand without ever risking a credential leak; the guard is the safety net that lets the .md ledgers ride along safely. See [[project_mosaic]].
