---
name: feedback_isolation_law
description: PATH ALLOWLIST LAW — state-changing git permitted in exactly ONE dir (evidence repo); everywhere else read-only; isolation self-check on every sync
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 23adca41-0ddb-4bbc-8455-2a8fe073bba4
  modified: 2026-09-09T18:40:24.946Z
---

**PATH ALLOWLIST LAW (Arun-ratified 2026-09-09, verbatim):**

State-changing git (`add`/`commit`/`push`/`branch`/`stash`/`reset`) is permitted in EXACTLY ONE directory: `/Users/arun/projects/Drupal/drupalak/mosaic-e2e-evidence`. Everywhere else on this machine — the mosaic module repo, the drupalak site root, and ANY other repo or directory (including all of Arun's work projects) — is read-only territory: **before ANY git state op, verify cwd is the allowlisted path, else HARD ABORT + report.** `AI/**` and implementer `.md` files travel ONLY to the evidence repo `ledger/`, never to the mosaic repo (gitignored + ceremony noise-grep enforce), never to drupal.org, never anywhere else.

(Editing a gitignored file such as `AI/TODO.md` in the mosaic module is a file write, NOT a git state op, so it is permitted — only git state ops are path-locked.)

**ISOLATION SELF-CHECK — run + PRINT on EVERY post-ship sync. Any failure = STOP everything + report:**
- (a) `git -C <mosaic> check-ignore AI/TODO.md` → must report it ignored.
- (b) `git -C <mosaic> status --short | grep '^[AM].*AI/'` → must be empty (no AI/ file staged/added in the mosaic repo).
- (c) evidence repo `git remote -v` → must be `arunkarthickasok/mosaic-e2e-evidence`.
- (d) secret-guard result (`password|secret|token=|api_key|BEGIN.*PRIVATE|hash_salt`; see [[feedback_evidence_repo_law]]).

Complements [[feedback_evidence_repo_law]] (what may be pushed + the guard) and [[feedback_commit_flow]] (mosaic git is Arun-only). See [[project_mosaic]].
